from fastapi import APIRouter, Query, HTTPException
from typing import List
from pydantic import BaseModel
from app.schemas.evaluation import EvaluationSuite, EvaluationRun, EvaluationRunDetail, PaginatedEvaluationRuns
from app.services.evaluation_datasets import get_suites, get_suite
from app.services.evaluation_engine import run_evaluation_suite, get_eval_runs, get_eval_run_detail

router = APIRouter()

class EvalRunReq(BaseModel):
    suite_id: str

@router.get("/suites", response_model=List[EvaluationSuite])
async def list_suites():
    return get_suites()

@router.post("/run", response_model=EvaluationRunDetail)
async def run_suite(req: EvalRunReq):
    if not get_suite(req.suite_id):
        raise HTTPException(status_code=404, detail="Suite not found")
    return run_evaluation_suite(req.suite_id)

@router.get("/runs", response_model=PaginatedEvaluationRuns)
async def list_runs(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    items, total = get_eval_runs(page, page_size)
    return PaginatedEvaluationRuns(items=items, page=page, page_size=page_size, total=total)

@router.get("/runs/{run_id}", response_model=EvaluationRunDetail)
async def get_run_detail_ep(run_id: str):
    r = get_eval_run_detail(run_id)
    if not r: raise HTTPException(status_code=404, detail="Not found")
    return r
