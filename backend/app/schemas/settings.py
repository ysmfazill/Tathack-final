from pydantic import BaseModel, ConfigDict, StrictBool, StrictStr

class ProviderSettings(BaseModel):
    model_config = ConfigDict(extra="forbid")
    provider_name: StrictStr
    endpoint_url: StrictStr
    model_name: StrictStr
    enabled: StrictBool

class SecuritySettings(BaseModel):
    model_config = ConfigDict(extra="forbid")
    enforce_mandatory_deny: StrictBool
    require_approval_for_destructive: StrictBool
    log_level: StrictStr

class RiskThresholdSettings(BaseModel):
    model_config = ConfigDict(extra="forbid")
    low_risk_max: float
    medium_risk_max: float
    high_risk_max: float

    from pydantic import model_validator
    @model_validator(mode='after')
    def validate_thresholds(self):
        if not (0.0 <= self.low_risk_max < self.medium_risk_max < self.high_risk_max <= 1.0):
            raise ValueError('Thresholds must be monotonically increasing between 0 and 1.')
        return self
