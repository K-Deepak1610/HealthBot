import os
from openai import AsyncOpenAI
from app.core.config import settings

class SymptomAdvisor:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.client = AsyncOpenAI(
            base_url=settings.NVIDIA_BASE_URL,
            api_key=self.api_key
        )

    async def get_guidance(self, query: str):
        # Basic Emergency Detection
        emergency_keywords = ["chest pain", "breathing difficulty", "severe bleeding", "unconscious", "stroke symptoms", "heart attack"]
        is_emergency = any(k in query.lower() for k in emergency_keywords)

        try:
            response = await self.client.chat.completions.create(
                model="meta/llama-3.1-8b-instruct",
                messages=[
                    {"role": "system", "content": "You are a safe health advisor. Analyze the user's symptoms and provide guidance. If symptoms seem severe, strongly advise seeing a doctor or calling emergency services. Do not provide a final medical diagnosis. Structure your response with: Possible Causes, Suggested Actions, Lifestyle Tips, and a clear Medical Disclaimer."},
                    {"role": "user", "content": query}
                ],
                max_tokens=2048,
            )
            return {
                "analysis": response.choices[0].message.content,
                "is_emergency": is_emergency
            }
        except Exception as e:
            return {
                "analysis": f"Service temporarily unavailable: {str(e)}",
                "is_emergency": is_emergency
            }

symptom_advisor = SymptomAdvisor()
