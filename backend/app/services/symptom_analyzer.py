import structlog
from openai import AsyncOpenAI
from app.core.config import settings

logger = structlog.get_logger()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class SymptomAnalyzer:
    async def analyze(self, query: str):
        # Emergency check
        emergency_keywords = ["chest pain", "severe bleeding", "breathing difficulty", "stroke", "unconscious", "head injury", "cyanosis"]
        if any(kw in query.lower() for kw in emergency_keywords):
            logger.info("emergency_detection_triggered", query=query)
            return {
                "is_emergency": True,
                "analysis": "### ⚠️ IMMEDIATE ACTION REQUIRED\nYour symptoms may indicate a serious medical condition. Please **call emergency services (911/112)** or seek immediate medical attention at the nearest emergency room.",
                "follow_up": []
            }

        try:
            logger.info("symptom_analysis_started", query_len=len(query))
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional healthcare assistant. Analyze symptoms provided. Suggest 2-3 possible conditions (NOT a diagnosis). Provide actionable triage (e.g., 'See a doctor within 24h' vs 'Observe for 48h'). Include safety-first advice. Use Markdown headings. Always include a disclaimer that this is not professional medical advice."},
                    {"role": "user", "content": query}
                ]
            )
            analysis_text = response.choices[0].message.content
            return {
                "is_emergency": False,
                "analysis": analysis_text,
                "follow_up": ["Have you had a fever?", "Is there any persistent pain?"]
            }
        except Exception as e:
            logger.error("symptom_analysis_failed", error=str(e))
            return {
                "is_emergency": False,
                "analysis": "I'm sorry, I encountered an error while analyzing your symptoms. Please consult a professional physician.",
                "follow_up": []
            }

symptom_analyzer = SymptomAnalyzer()
