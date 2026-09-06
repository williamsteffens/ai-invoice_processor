from openai import OpenAI

from app.ai.prompts import SYSTEM_PROMPT
from app.ai.schemas import Invoice
from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)

def extract_invoice(text: str) -> Invoice:
    response = client.responses.parse(
        model=settings.openai_model,
        input=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": (
                    "Extract the invoice information from the "
                    "following document:\n\n"
                    f"{text}"
                ),
            },
        ],
        # pydantic schema to parse the response into
        text_format=Invoice,
    )

    if response.output_parsed is None:
        raise ValueError("The model did not return a valid invoice.")

    return response.output_parsed