from abc import ABC, abstractmethod
from typing import TypeVar

from pydantic import BaseModel


T = TypeVar("T", bound=BaseModel)


class AIProvider(ABC):
    @abstractmethod
    def extract(
        self,
        text: str,
        schema: type[T],
        system_prompt: str,
    ) -> T:
        """Extract structured data from text."""
        raise NotImplementedError