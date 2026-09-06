from app.ai.gemini_provider import GeminiProvider
from app.ai.prompts import SYSTEM_PROMPT
from app.ai.schemas import Invoice


provider = GeminiProvider()


def extract_invoice(text: str) -> Invoice:
    if not text.strip():
        raise ValueError("Invoice text is empty.")

    return provider.extract(
        text=text,
        schema=Invoice,
        system_prompt=SYSTEM_PROMPT,
    )