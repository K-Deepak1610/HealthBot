import pytesseract
from PIL import Image
import io
import structlog
from openai import AsyncOpenAI
from app.core.config import settings

logger = structlog.get_logger()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class OCRService:
    def extract_text(self, image_bytes: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            logger.error("ocr_extraction_failed", error=str(e))
            return ""

    async def analyze_prescription(self, text: str):
        if not text.strip():
            return "No text detected in image."
            
        try:
            logger.info("ocr_analysis_started", text_len=len(text))
            response = await client.chat.completions.create(
                model="gpt-4o-mini", # Using a more modern, cost-effective model
                messages=[
                    {"role": "system", "content": "You are a professional pharmaceutical expert. Extract medicine names, purpose, dosage, and side effects from the following prescription text. Return a clear, structured Markdown summary. Note any potential interactions if multiple medicines are found."},
                    {"role": "user", "content": text}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error("ocr_analysis_failed", error=str(e))
            return f"Error analyzing prescription: {str(e)}"

ocr_service = OCRService()
