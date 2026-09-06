from google import genai
from google.genai import types
from pydantic import BaseModel

from app.ai.provider import AIProvider, T
from app.core.config import settings


class GeminiProvider(AIProvider):
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )
        self.model = settings.gemini_model

    def extract(
        self,
        text: str,
        schema: type[T],
        system_prompt: str,
    ) -> T:
        response = self.client.models.generate_content(
            model=self.model,
            contents=f"{system_prompt}\n\n{text}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
            ),
        )

        if not response.text:
            raise ValueError(
                "Gemini returned an empty response."
            )

        return schema.model_validate_json(response.text)