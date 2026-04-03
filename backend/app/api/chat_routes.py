import json
import structlog
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.services.ai_service import get_ai_chat_stream
from app.schemas.chat import ChatRequest
from app.core.database import get_db
from app.models import models

from app.auth.deps import get_optional_user

logger = structlog.get_logger()
router = APIRouter()


@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_optional_user),
):
    """
    POST endpoint to interact with the conversational AI.
    Returns a Server-Sent Events (SSE) stream.
    Works for both authenticated users and guests.
    """
    async def event_generator():
        full_response = ""
        try:
            formatted_history = [
                {"role": m.role if m.role in ("user", "assistant") else "user", "content": m.content}
                for m in request.chat_history
            ]

            async for chunk in get_ai_chat_stream(request.message, formatted_history):
                full_response += chunk
                yield f"data: {json.dumps({'content': chunk})}\n\n"

            # Persist to ChatHistory (use user_id=1 for anonymous guests)
            save_id = current_user.id if current_user else 1
            try:
                user_msg = models.ChatHistory(
                    user_id=save_id,
                    message=request.message,
                    role="user",
                )
                bot_msg = models.ChatHistory(
                    user_id=save_id,
                    message=full_response,
                    role="assistant",
                )
                db.add_all([user_msg, bot_msg])
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error("history_save_failed", error=str(e))

            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
