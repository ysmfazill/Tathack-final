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
