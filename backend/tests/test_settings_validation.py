import pytest
from app.services.settings_service import update_settings, get_settings
from fastapi import HTTPException
from pydantic import ValidationError

def test_valid_boolean():
    update_settings("security", {"enforce_mandatory_deny": True})
    settings = get_settings("security")
    assert settings["enforce_mandatory_deny"] is True

def test_valid_false_boolean():
    update_settings("security", {"enforce_mandatory_deny": False})
    settings = get_settings("security")
    assert settings["enforce_mandatory_deny"] is False

def test_invalid_string_true():
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"enforce_mandatory_deny": "true"})
    assert excinfo.value.status_code == 422

def test_invalid_string_not_a_boolean():
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"enforce_mandatory_deny": "NOT_A_BOOLEAN"})
    assert excinfo.value.status_code == 422

def test_numeric_boolean():
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"enforce_mandatory_deny": 1})
    assert excinfo.value.status_code == 422

def test_null_required_field():
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"enforce_mandatory_deny": None})
    assert excinfo.value.status_code == 422

def test_unknown_setting_key():
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"unknown_key": "bad_value"})
    assert excinfo.value.status_code == 422

def test_mixed_valid_invalid_fields():
    # Set a known state first
    update_settings("security", {"enforce_mandatory_deny": True, "require_approval_for_destructive": True})
    
    with pytest.raises(HTTPException) as excinfo:
        update_settings("security", {"enforce_mandatory_deny": False, "require_approval_for_destructive": "NOT_A_BOOLEAN"})
    assert excinfo.value.status_code == 422
    
    # Verify valid state is preserved
    settings = get_settings("security")
    assert settings["enforce_mandatory_deny"] is True
    assert settings["require_approval_for_destructive"] is True
