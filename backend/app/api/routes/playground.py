from fastapi import APIRouter, Query, HTTPException, UploadFile, File
import json
from typing import List
from pydantic import BaseModel
from app.schemas.playground import ScenarioDefinition, PlaygroundRunResult, PaginatedPlaygroundRuns, PlaygroundSummary, CustomRunRequest
from app.services.attack_scenarios import get_scenarios, get_scenario
from app.services.playground_service import run_scenario, run_custom_scenario, get_runs, get_run, get_playground_summary, _persist_run

router = APIRouter()

class RunRequest(BaseModel):
    scenario_id: str

@router.get("/scenarios", response_model=List[ScenarioDefinition])
async def list_scenarios():
    return get_scenarios()

@router.post("/run", response_model=PlaygroundRunResult)
async def execute_scenario(req: RunRequest):
    if not get_scenario(req.scenario_id):
        raise HTTPException(status_code=404, detail="Scenario not found")
    return run_scenario(req.scenario_id)

@router.post("/run-custom", response_model=PlaygroundRunResult)
async def execute_custom_scenario(req: CustomRunRequest):
    return run_custom_scenario(req)

@router.get("/runs", response_model=PaginatedPlaygroundRuns)
async def list_runs(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    items, total = get_runs(page, page_size)
    return PaginatedPlaygroundRuns(items=items, page=page, page_size=page_size, total=total)

@router.get("/runs/{run_id}", response_model=PlaygroundRunResult)
async def get_run_detail(run_id: str):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/summary", response_model=PlaygroundSummary)
async def fetch_summary():
    return get_playground_summary()

@router.post("/import")
async def import_runs(file: UploadFile = File(...)):
    if file.content_type not in ["application/json"]:
        raise HTTPException(status_code=400, detail="Only JSON is supported for now")
    content = await file.read()
    if len(content) > 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    try:
        data = json.loads(content)
        if not isinstance(data, list):
            raise ValueError("Expected a JSON array")
        imported = 0
        for item in data:
            run = PlaygroundRunResult(**item)
            _persist_run(run)
            imported += 1
        return {"imported": imported}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON data: {str(e)}")
