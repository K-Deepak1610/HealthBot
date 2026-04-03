import structlog
from openai import AsyncOpenAI, APIError
from app.core.config import settings

logger = structlog.get_logger()

# AsyncOpenAI client pointed at NVIDIA's OpenAI-compatible endpoint
client = AsyncOpenAI(
    api_key=settings.NVIDIA_API_KEY,
    base_url=settings.NVIDIA_BASE_URL,
)

SYSTEM_PROMPT = """You are a professional AI medical assistant designed to help people understand health symptoms and medicines in a safe and clear way.

Your goal is to explain medical information in simple everyday language that anyone can understand. Avoid complex medical terms.

First, classify the symptoms to determine the Severity Level (Mild, Moderate, or Serious).
- If symptoms are Mild, reassure the user.
- If symptoms are Serious, advise medical attention immediately.

Always respond in a structured format using the exact following sections (use Markdown headings):

## 🩺 Condition
Explain what health issue might be related to the symptoms.

## ⚠️ Severity Level
State whether the condition is **Mild**, **Moderate**, or **Serious**.

## 📋 Symptoms
List the common symptoms as bullet points.

## 🔍 Possible Causes
Explain possible causes in simple terms as bullet points.

## 🏠 Home Care Advice
Give safe home remedies and lifestyle advice as bullet points.

## 💊 Medicines That May Help
Mention common over-the-counter medicines with brief descriptions.

## 🚨 When To See A Doctor
Explain warning signs that require immediate medical attention.

## 🛡️ Prevention Tips
Provide tips to prevent the condition in the future.

Important rules:
- Use simple everyday language.
- Do not give dangerous medical advice.
- Be clear and appropriately reassuring or alarming based on the severity.
- If a question is not health-related, politely redirect the user to ask health questions.
"""

async def get_ai_chat_stream(message: str, history: list = None):
    """
    Streams chat response from NVIDIA's LLM API (OpenAI-compatible).
    Yields chunks of text as they arrive.
    """
    if history is None:
        history = []

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history + [{"role": "user", "content": message}]

    try:
        logger.info("ai_chat_request_started", message_len=len(message))

        stream = await client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=messages,
            stream=True,
            temperature=0.6,
            max_tokens=1024,
        )

        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    except APIError as e:
        logger.error("ai_chat_request_failed", error=str(e))
        yield "I'm sorry, I'm having trouble connecting to my medical knowledge base. Please try again in a moment."
    except Exception as e:
        logger.error("ai_chat_request_unexpected_error", error=str(e))
        yield "An unexpected error occurred. Please consult a doctor for serious symptoms."
