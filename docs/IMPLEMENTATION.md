# PromptGuard AI - Implementation Document

## 1. Project Overview
PromptGuard AI is a Behavioral Firewall for Tool-Using AI Agents. It intercepts, evaluates, and deterministically authorizes actions proposed by Generative AI models before they are executed.

## 2. Architecture
The system follows a strict pipeline:
**Model Proposes -> Backend Validates -> Policy Engine Authorizes -> Execution Gateway Re-Authorizes -> Authorized Handler Executes -> Audit Persists -> Evaluation Engine Verifies**

## 3. Repository Structure
- `src/`: React 18 Frontend containing 7 primary dashboard screens.
- `backend/app/`: FastAPI Backend housing the Security components.
- `backend/tests/`: Pytest regression suites.
- `backend/data/`: SQLite DB persistence.

## 4. Frontend Technology Stack
- React 18
- Vite 5
- TypeScript
- Tailwind CSS v3
- Axios (API Client)

## 5. Backend Technology Stack
- FastAPI (Python)
- Pydantic
- SQLite3 (Local Persistence)
- Pytest

## 6. Environment Configuration
**Frontend** (`.env`):
`VITE_API_BASE_URL=http://127.0.0.1:8000`

**Backend**:
Configured via `app/core/config.py` using `DATABASE_URL`.

## 7. Installation Instructions (Windows PowerShell)
```powershell
# Backend
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend
npm install
```

## 8. Backend Startup
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

## 9. Frontend Startup
```powershell
npm run dev
```

## 10. Test Commands
```powershell
# Backend
cd backend
python -m pytest -q

# Frontend
npm run build
```

## 11. API Endpoint Inventory
- `GET /api/health`
- `GET /api/overview`
- `GET /api/policies`
- `POST /api/policies/evaluate`
- `POST /api/execution/preview`
- `POST /api/execution/execute`
- `POST /api/data-guard/evaluate`
- `GET /api/audit-logs`
- `GET /api/audit-logs/summary`
- `GET /api/playground/scenarios`
- `POST /api/playground/run`
- `GET /api/playground/runs`
- `GET /api/playground/summary`
- `GET /api/evaluations/suites`
- `POST /api/evaluations/run`
- `GET /api/evaluations/runs`

## 12. Component Status

| Component | Implemented | Tested | Evidence | Limitations |
| --- | --- | --- | --- | --- |
| **Frontend UI** | Yes | Partially | API Client created, OverviewPage connected | Uses some mock data on un-wired screens |
| **Backend REST APIs** | Yes | Yes | 49 Passing Pytests | Operates on SQLite natively |
| **Database Persistence** | Yes | Yes | DB Fixtures pass | SQLite only |
| **Policy Engine** | Yes | Yes | `test_policy_engine.py` | Hardcoded configuration dicts |
| **Execution Gateway** | Yes | Yes | `test_execution_gateway.py` | Idempotency drops on restart |
| **Approval Workflow** | Yes | Yes | Enforced in Gateway | Approvals are synthetic tokens |
| **Data Guard** | Yes | Yes | `test_data_guard.py` | Hardcoded classification registry |
| **Audit Logging** | Yes | Yes | `test_audit_service.py` | Local disk storage only |
| **Attack Playground** | Yes | Yes | `test_playground_api.py` | Pre-defined scenarios only |
| **Evaluation Engine** | Yes | Yes | `test_evaluation_api.py` | Synthetically bounded |
| **Ollama Integration** | No | N/A | N/A | Excluded per Phase 8 safe integration constraints |

## 13. Known Limitations
- The system is purely deterministic. No real LLM heuristic analysis is currently bound to the pipeline.
- Prompt Injections are flagged as `UNSUPPORTED` in the evaluation metrics because they require an LLM detector to parse semantic phrasing.
- The UI relies heavily on mock simulation data outside of the `OverviewPage`.

## 14. Completed and Incomplete Features
- **Completed**: End-to-end FastAPI backend, rigorous security enforcement layers (Gateways, Data Guards, Idempotency), robust SQLite persistence, Automated Playground Harness, Automated Evaluation metrics math. Frontend API client mapped.
- **Incomplete**: Integrating all 7 UI pages with the `api.ts` file. Integrating `Ollama` models. 

## 15. Actual Test Results
`python -m pytest -q` executed successfully in 2.00s across 49 total backend tests.
`npm run build` executed successfully generating production chunks.
