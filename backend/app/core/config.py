# TODO: make this more generic and support multiple LLMs, not just OpenAI and Gemini. 
# For example, we could have a base class for LLM settings and then subclasses for each
# specific LLM provider. This would allow easily adding support for new providers in
# the future without having to modify the core settings class.


from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+psycopg://postgres:postgres@db:5432/invoices"
    )

    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash-lite"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()

# from pydantic_settings import BaseSettings, SettingsConfigDict

# class Settings(BaseSettings):
#     database_url: str = (
#         "postgresql+psycopg://postgres:postgres@db:5432/invoices"
#     )

#     openai_api_key: str = ""
#     openai_model: str = "gpt-5.6-luna"

#     model_config = SettingsConfigDict(
#         env_file=".env",
#         extra="ignore",
#     )


# settings = Settings()