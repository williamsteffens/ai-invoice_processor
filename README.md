# AI Invoice Processor

AI Invoice Processor is a full-stack application for turning PDF invoices into structured, validated data using Gemini. It provides a human-in-the-loop workflow via a web interface for reviewing invoices when extraction quality or validation confidence is insufficient.

Built with FastAPI, PostgreSQL, React, TypeScript, and Docker.

## Why this project?

Invoice processing is a repetitive business workflow that is well suited to AI automation, but extracted data should not be trusted blindly. This project combines LLM-based extraction with typed validation and human review to create a safer, reviewable workflow.

## Features

- Upload PDF invoices for automated extraction using pypdf
- Extract invoice number, supplier, dates, currency, totals, and line items
- Structured extraction
- Pydantic validation of extracted invoice data
- Store processed invoices in PostgreSQL
- REST API implemented with FastAPI, including:
	- Review invoice status and add review notes
	- List, inspect, and delete stored invoices
	- Automatically generated documentation
- Docker development environment

## Future improvements

- Extraction currently targets the Gemini provider; the settings abstraction is not yet generic across multiple LLM providers. Ideally the provider-layer will include different providers beyond Gemini, including local models, e.g. via Ollama.
- An evaluation pipeline for comparing extraction quality across models for a invoice datasets. Potential measurements:
	- Number of documents processed
	- Field-level extraction accuracy
	- Automatic approval rate
	- Human review rate
	- Average processing time
- A PDF viewer and in-app source-document capture workflow.
- A set of public sample invoices and an in-app sample selector.
- Redis may be introduced later if invoice processing moves to an asynchronous worker queue, mostly to demonstrate production-oriented asynchronous processing.

## Processing flow

```text
PDF
 ↓
Text extraction
 ↓
LLM
 ↓
Structured output
 ↓
Validation
 ↓
Automatic approval / Human review
 ↓
PostgreSQL
 ↓
Dashboard
```

## Screenshots

Some screenshots of the frontend part of the application, highlightning the different views.

### Invoice overview


![Invoice overview](docs/images/invoice-overview.png)

_Screenshot of the invoice list and processing statuses._

### Invoice detailed view

![Invoice detail](docs/images/invoice-detail.png)

_Screenshot of the extracted invoice data, line items, and validation results._

### Invoice review

![Invoice review](docs/images/invoice-review.png)

_screenshot of the review controls._



<!-- I want to add a demo gif later showing upload and processing. -->

## Architecture

The application is split into a FastAPI backend, PostgreSQL database, and React/Vite frontend written in TypeScript.
Below is a general overview of the layout of the repository.

```text
backend/
	app/
		ai/          Gemini provider, prompts, extraction, and schemas
		api/         FastAPI routers and request/response DTOs
		core/        Configuration and database setup
		models/      SQLAlchemy models
		services/    Processing, validation, persistence, and PDF utilities
	tests/           Backend test suite and fixtures
frontend/
	src/
		components/  Invoice upload, table, detail, review, and status UI
		api.ts       Backend API client
		types.ts     Frontend domain types
data/                Evaluation and sample invoice data (not yet implemented)
```

## API

All application endpoints are under `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check; returns `{"status":"ok"}` |
| `GET` | `/api/invoices` | List stored invoices |
| `GET` | `/api/invoices/{id}` | Get invoice details, including line items and validation errors |
| `POST` | `/api/invoices` | Upload and process a PDF using multipart field `file` |
| `PATCH` | `/api/invoices/{id}/status` | Update status and optional review note |
| `DELETE` | `/api/invoices/{id}` | Delete an invoice |

The upload endpoint accepts `application/pdf` files only. A successful upload returns the extracted invoice, its processing status, and any validation errors.

Example upload:

```bash
curl -X POST http://localhost:8000/api/invoices \
	-F "file=@./path/to/invoice.pdf"
```

Supported statuses are:
- ``approved``
- ``needs_review``
- ``rejected``
- ``failed`` - system-only status


## Docker services

The Docker Compose stack contains:

| Service | Purpose | Local address |
| --- | --- | --- |
| `frontend` | React/Vite review interface | http://localhost:5173 |
| `backend` | FastAPI API and invoice processing | http://localhost:8000 |
| `db` | Development PostgreSQL database | `localhost:5432` |
| `test-db` | PostgreSQL database used by backend tests | `localhost:5433` |

## Running the application

### Quick start with Docker

#### Prerequisites

- Docker and Docker Compose
- A Gemini API key

#### 1. Configure environment variables

Create a `.env` file in the repository root (please see `.env.example` at the project root):

```dotenv
GEMINI_API_KEY=your-gemini-api-key
```

The backend provides these defaults:

```dotenv
DATABASE_URL=postgresql+psycopg://postgres:postgres@db:5432/invoices
GEMINI_MODEL=gemini-3.5-flash-lite
```

Set them in `.env` only when you need to override the defaults. Do not commit API keys or other secrets.

#### 2. Start the application

```bash
docker compose up --build
```

Open the frontend at [http://localhost:5173](http://localhost:5173). The API is available at [http://localhost:8000](http://localhost:8000), and interactive API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs) provided by Swagger/FastAPI.

To stop the services:

```bash
docker compose down
```

To remove the persisted development database volume as well:

```bash
docker compose down -v
```

### Development without Docker

#### Backend

The backend requires Python 3.12 or newer and a running PostgreSQL database.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

When running the backend outside Docker, set `DATABASE_URL` to a PostgreSQL host reachable from your machine, for example:

```dotenv
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/invoices
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8000/api`.

Useful frontend commands:

```bash
npm run build
npm run lint
npm run preview
```

## Testing

The backend test suite can be run in a temporary Docker container:

```bash
docker compose run --rm backend pytest -q
```

The PDF fixture at `backend/tests/fixtures/invoice.pdf` is available for automated tests and local experimentation. The frontend does not yet provide a built-in sample-invoice selector.

## License

This project is licensed under the MIT License.
