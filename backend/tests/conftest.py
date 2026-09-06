import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.database import Base
from app.models.invoice import InvoiceModel


TEST_DATABASE_URL = (
    "postgresql+psycopg://postgres:postgres"
    "@test-db:5432/invoices_test"
)

engine = create_engine(TEST_DATABASE_URL)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        yield session

    Base.metadata.drop_all(bind=engine)