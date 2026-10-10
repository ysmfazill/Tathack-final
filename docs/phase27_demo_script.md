# PromptGuard AI - Phase 27 Demonstration Script

**Target Duration:** 5–7 minutes

## Prerequisites
- Run `.\scripts\start_promptguard.ps1`
- Verify system health with `.\scripts\check_promptguard.ps1`
- Open a browser to `http://localhost:3000`

---

## A. Application Overview (1 minute)
1. Navigate to the **Overview** dashboard.
2. **Explain the Purpose:** PromptGuard AI serves as a Behavioral Firewall for tool-using AI agents. Instead of just inspecting prompts, it sits as a gateway between the AI and the tools it attempts to use.
3. **Architecture:** Highlight that the system relies on a **deterministic policy engine** for authorizing tool execution. While an LLM (like Ollama) can provide advisory analysis, it never has the authority to approve an action.

## B. Safe Action Demonstration (1 minute)
1. Navigate to **Attack Playground**.
2. Select the scenario: **Authorized Synthetic Search** (`scenario_1_authorized_search`).
3. Click **Run Simulation**.
4. **Observe:**
   - Firewall Verdict should display **ALLOW**.
   - Execution Status should be **EXECUTED_IN_SIMULATION**.
   - Handler Invoked should be **Yes**.
5. **Explanation:** This demonstrates the happy path where a registered tool request matches the active policy, allowing execution.

## C. Blocked Unknown Tool (1 minute)
1. In the **Attack Playground**, select the scenario: **Unknown Tool Request** (`scenario_2_unknown_tool`).
2. Click **Run Simulation**.
3. **Observe:**
   - Firewall Verdict should display **BLOCK**.
   - Execution Status should be **DENIED**.
   - Reason Code: e.g., `TOOL_NOT_ALLOWLISTED`.
   - Handler Invoked: **No**.
4. **Explanation:** The system strictly denies tools not present in the trusted tool registry, verifying the "Default Deny" nature of the firewall.

## D. Approval Protection (1 minute)
1. In the **Attack Playground**, select the scenario: **High-Risk Export Without Approval** (`scenario_5_unapproved_export`).
2. Click **Run Simulation**.
3. **Observe:**
   - Firewall Verdict should display **REVIEW**.
   - Execution Status should be **PENDING** (or **DENIED** if configured to auto-deny pending states in the simulation).
   - Handler Invoked: **No**.
4. **Explanation:** Point out that this operation requires human-in-the-loop approval. A pending state does *not* result in a successful execution, thus securing critical actions.

## E. Audit Logs Verification (1 minute)
1. Navigate to **Audit Logs**.
2. Identify the most recent events corresponding to the simulation runs.
3. Open the event details for the blocked unknown tool or the approval protection scenario.
4. **Observe:** The detailed record captures the event ID, the deterministic policy decision (e.g., `DENY` or `REQUIRE_APPROVAL`), the timestamp, and the explicit reason code.
5. **Explanation:** PromptGuard provides a tamper-evident audit trail for every interception event, critical for SecOps and compliance.

## F. Ollama Advisory Analysis (1 minute)
1. Navigate to **Live Attack Analysis**.
2. If Ollama is online, submit a harmless prompt for analysis.
3. **Observe:** The UI will display the LLM's assessment of the prompt's intent.
4. **Explanation:** Emphasize that while this AI-driven analysis provides rich context and threat signals, the actual execution gateway remains deterministic and does not rely on this model output to authorize a tool call. *(If Ollama is offline, simply highlight the Offline status and mention the fallback deterministic mechanisms).*

## G. Settings Validation (1 minute)
1. Navigate to **Settings** -> **Security Settings**.
2. **Valid Change:** Toggle a safe supported setting (like enabling strict simulation logging) and save. Observe the success confirmation.
3. **Invalid Change:** Use a tool like Postman or `curl` to manually submit a malformed payload (e.g., `{ "require_approval_for_destructive": "NOT_A_BOOLEAN" }`) to the backend `PUT /api/settings/security`.
4. **Observe:** The server will reject the request (422 Unprocessable Entity). Refresh the UI to prove the setting remains in its previous valid state.
5. **Explanation:** The server strictly validates all configuration changes, preventing accidental or malicious degradation of security boundaries.
6. **Cleanup:** Restore the setting modified in step 2.
