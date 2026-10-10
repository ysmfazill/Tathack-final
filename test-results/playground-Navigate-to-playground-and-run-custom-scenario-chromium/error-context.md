# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playground.spec.ts >> Navigate to playground and run custom scenario
- Location: e2e\playground.spec.ts:8:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Custom Manual Benchmark')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - generic [ref=e8]: shield_lock
        - generic [ref=e10]:
          - generic [ref=e11]: PromptGuard AI
          - generic [ref=e12]: Behavioral Firewall
      - navigation "Main Navigation" [ref=e13]:
        - link "grid_view Overview" [ref=e14] [cursor=pointer]:
          - /url: /overview
          - generic [ref=e15]: grid_view
          - generic [ref=e16]: Overview
        - link "security Attack Playground" [ref=e17] [cursor=pointer]:
          - /url: /attack-playground
          - generic [ref=e18]: security
          - generic [ref=e19]: Attack Playground
        - link "biotech Live Attack Analysis" [ref=e20] [cursor=pointer]:
          - /url: /live-analysis
          - generic [ref=e21]: biotech
          - generic [ref=e22]: Live Attack Analysis
        - link "policy Policy Center" [ref=e23] [cursor=pointer]:
          - /url: /policies
          - generic [ref=e24]: policy
          - generic [ref=e25]: Policy Center
        - link "terminal Audit Logs" [ref=e26] [cursor=pointer]:
          - /url: /audit-logs
          - generic [ref=e27]: terminal
          - generic [ref=e28]: Audit Logs
        - link "science Evaluation Lab" [ref=e29] [cursor=pointer]:
          - /url: /evaluation-lab
          - generic [ref=e30]: science
          - generic [ref=e31]: Evaluation Lab
        - link "tune Settings" [ref=e32] [cursor=pointer]:
          - /url: /settings
          - generic [ref=e33]: tune
          - generic [ref=e34]: Settings
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]: "Engine:"
        - generic [ref=e40]: Active
      - generic [ref=e41]:
        - generic [ref=e42]: LOCAL DEV
        - generic [ref=e45]: v0.1.0
  - generic [ref=e46]:
    - banner [ref=e47]:
      - generic [ref=e49]:
        - generic [ref=e50]: Security Overview
        - generic [ref=e51]: Monitor threats, inspect agent behavior, and enforce tool permissions.
      - generic [ref=e52]:
        - generic [ref=e53]: Protection Active
        - generic [ref=e56]: "Model: Ollama"
        - button "Notifications" [ref=e60] [cursor=pointer]:
          - generic [ref=e61]: notifications
        - button "SA SecOps Admin admin@promptguard.ai expand_more" [ref=e64] [cursor=pointer]:
          - generic [ref=e65]: SA
          - generic [ref=e66]:
            - generic [ref=e67]: SecOps Admin
            - generic [ref=e68]: admin@promptguard.ai
          - generic [ref=e69]: expand_more
    - main [ref=e70]:
      - generic [ref=e71]:
        - generic [ref=e72]: Backend Connected (v0.1.0)
        - generic [ref=e73]:
          - generic [ref=e74]:
            - generic [ref=e75]: info
            - generic [ref=e77]:
              - generic [ref=e78]: Demo Data
              - generic [ref=e79]: •
              - generic [ref=e80]: Metrics and log streams are simulated for local development environment. Backend integration ready.
          - generic [ref=e81]: "READY: PORT 8080"
        - generic [ref=e84]:
          - generic:
            - generic: Incident Dashboard
            - heading "Security Telemetry" [level=1]
            - paragraph: Monitor threats, inspect agent behavior, and enforce cross-boundary tool permissions.
          - generic [ref=e85]:
            - button "security Test an Attack" [ref=e86] [cursor=pointer]:
              - generic [ref=e87]: security
              - generic [ref=e88]: Test an Attack
            - button "sync_problem Test Data Leakage" [ref=e89] [cursor=pointer]:
              - generic [ref=e90]: sync_problem
              - generic [ref=e91]: Test Data Leakage
            - button "block Review Blocked Transfers" [ref=e92] [cursor=pointer]:
              - generic [ref=e93]: block
              - generic [ref=e94]: Review Blocked Transfers
            - button "science Run Security Evaluation" [ref=e95] [cursor=pointer]:
              - generic [ref=e96]: science
              - generic [ref=e97]: Run Security Evaluation
            - button "receipt_long Review Audit Logs" [ref=e98] [cursor=pointer]:
              - generic [ref=e99]: receipt_long
              - generic [ref=e100]: Review Audit Logs
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - generic [ref=e104]:
                - generic [ref=e105]: Attack Attempts
                - generic [ref=e106]: "727"
              - generic [ref=e107]: gpp_maybe
            - generic [ref=e109]:
              - generic [ref=e110]: Attack cases evaluated.
              - generic [ref=e111]: LIVE DATA
          - generic [ref=e112]:
            - generic [ref=e113]:
              - generic [ref=e114]:
                - generic [ref=e115]: Actions Blocked
                - generic [ref=e116]: "0"
              - generic [ref=e117]: verified_user
            - generic [ref=e119]:
              - generic [ref=e120]: Unauthorized actions prevented.
              - generic [ref=e121]: 0.0% block rate
          - generic [ref=e122]:
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]: Pending Review
                - generic [ref=e126]: "0"
              - generic [ref=e127]: pending_actions
            - generic [ref=e129]:
              - generic [ref=e130]: Actions awaiting approval.
              - generic [ref=e131]: Escalated
          - generic [ref=e132]:
            - generic [ref=e133]:
              - generic [ref=e134]:
                - generic [ref=e135]: False Positive Rate
                - generic [ref=e136]: 0.0%
              - generic [ref=e137]: query_stats
            - generic [ref=e139]:
              - generic [ref=e140]: Benign cases incorrectly flagged.
              - generic [ref=e141]: Target < 5.0%
        - generic [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e144]:
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - generic [ref=e147]: hub
                  - heading "Cross-Agent Data Flow" [level=2] [ref=e148]
                - generic [ref=e149]: SIMULATED WORKFLOW • SAMPLE DATA
              - generic [ref=e150]: Track sensitive information moving between AI agents and enforce gateway authorization rules.
            - generic [ref=e151]:
              - generic [ref=e152]: Permitted
              - generic [ref=e155]: Blocked
              - generic [ref=e158]: Review Req.
          - generic [ref=e162]:
            - generic [ref=e163]:
              - generic [ref=e164]:
                - generic [ref=e165]:
                  - generic [ref=e166]: badge
                  - generic [ref=e168]: Source Agent
                - generic [ref=e169]:
                  - generic [ref=e170]: HR AGENT
                  - generic [ref=e171]: Retrieves employee information and internal staff profiles.
              - generic [ref=e172]:
                - generic [ref=e173]: "Scope: internal_hr_db"
                - generic [ref=e174]: Trusted
            - generic [ref=e177]:
              - generic [ref=e178]:
                - generic [ref=e179]: check_circle
                - generic [ref=e180]: Authorized
              - generic [ref=e181]: Employee summary
              - generic [ref=e184]: ▶
            - generic [ref=e185]:
              - generic [ref=e186]:
                - generic [ref=e187]:
                  - generic [ref=e188]: description
                  - generic [ref=e190]: Processing Agent
                - generic [ref=e191]:
                  - generic [ref=e192]: REPORT AGENT
                  - generic [ref=e193]: Processes authorized information for reports & summaries.
              - generic [ref=e194]:
                - generic [ref=e195]: "Taint Engine: Active"
                - generic [ref=e196]: Policy Enforced
            - generic [ref=e198]:
              - generic [ref=e199]:
                - generic [ref=e200]: shield
                - generic [ref=e201]: FIREWALL BLOCKED
              - generic [ref=e202]: Unauthorized dest
              - generic [ref=e203]: close
              - generic [ref=e206]: Transfer Stopped
            - generic [ref=e207]:
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - generic [ref=e210]: cloud_upload
                  - generic [ref=e212]: Target Destination
                - generic [ref=e213]:
                  - generic [ref=e214]: EXPORT AGENT
                  - generic [ref=e215]: Sends approved report data to an authorized destination.
              - generic [ref=e216]:
                - generic [ref=e217]: "Dest: external_sync [Blocked]"
                - generic [ref=e218]: 0 Records leaked
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]: "Active Agents:"
              - generic [ref=e223]: "3"
            - generic [ref=e224]:
              - generic [ref=e225]: "Protected Transfers:"
              - generic [ref=e226]: "14"
              - generic [ref=e227]: (Sample Data)
            - generic [ref=e228]:
              - generic [ref=e229]: "Blocked Transfers:"
              - generic [ref=e230]: "5"
              - generic [ref=e231]: (Sample Data)
            - generic [ref=e232]:
              - generic [ref=e233]: "Pending Approvals:"
              - generic [ref=e234]: "2"
              - generic [ref=e235]: (Sample Data)
          - generic [ref=e236]:
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]: verified
                - generic [ref=e240]: Data Protection Status
              - generic [ref=e241]: Data classification and destination policies determine whether an agent may transfer information.
            - generic [ref=e242]:
              - generic [ref=e243]: Public Data
              - generic [ref=e246]: Internal Data
              - generic [ref=e249]: Confidential Data
              - generic [ref=e252]: Restricted Data
          - generic [ref=e255]: Predefined synthetic classifications (Prototype simulation).
        - generic [ref=e256]:
          - generic [ref=e257]:
            - generic [ref=e258]:
              - generic [ref=e259]:
                - generic [ref=e260]:
                  - generic [ref=e261]:
                    - heading "Security Activity" [level=2] [ref=e262]
                    - generic [ref=e263]: Sample Data
                  - generic [ref=e264]: Attack attempts and enforcement decisions over time.
                - generic [ref=e265]:
                  - button "1H" [ref=e266] [cursor=pointer]
                  - button "24H" [ref=e267] [cursor=pointer]
                  - button "7D" [ref=e268] [cursor=pointer]
              - generic [ref=e269]:
                - generic [ref=e270]: Blocked Actions
                - generic [ref=e273]: Flagged / Approval
                - generic [ref=e276]: Allowed Actions
              - generic [ref=e279]:
                - generic [ref=e280]:
                  - generic:
                    - generic: warning
                    - generic: 18 attempts @ 14:20
                - generic [ref=e288]:
                  - generic [ref=e289]: 02:00
                  - generic [ref=e290]: 06:00
                  - generic [ref=e291]: 10:00
                  - generic [ref=e292]: 14:00
                  - generic [ref=e293]: 18:00
                  - generic [ref=e294]: 22:00
              - generic [ref=e295]:
                - generic [ref=e296]: "Populated from backend audit records. 24h peak: 18 attack attempts at 14:20."
                - generic [ref=e297]: "Real-time Stream: OK"
            - generic [ref=e299]:
              - generic [ref=e300]:
                - generic [ref=e301]:
                  - heading "Recent Security Events" [level=2] [ref=e302]
                  - generic [ref=e303]: Real-time agent tool invocations, inter-agent flows, and firewall decisions
                - link "View All Events chevron_right" [ref=e304] [cursor=pointer]:
                  - /url: /audit-logs
                  - generic [ref=e305]: View All Events
                  - generic [ref=e306]: chevron_right
              - table [ref=e308]:
                - rowgroup [ref=e309]:
                  - row [ref=e310]:
                    - columnheader "Event Descriptor" [ref=e311]
                    - columnheader "Vector / Source" [ref=e312]
                    - columnheader "Risk Level" [ref=e313]
                    - columnheader "Firewall Decision" [ref=e314]
                    - columnheader "Timestamp" [ref=e315]
                    - columnheader "Action" [ref=e316]
                - rowgroup [ref=e317]:
                  - row [ref=e318]:
                    - cell "Inter-Agent Bus Data Leakage Inter-Agent" [ref=e319]:
                      - generic [ref=e320]:
                        - generic [ref=e322]: Inter-Agent Bus Data Leakage
                        - generic [ref=e323]: Inter-Agent
                    - cell "Report Agent (export_sync())" [ref=e324]
                    - cell "Critical" [ref=e325]
                    - cell "Blocked" [ref=e326]
                    - cell "2m ago" [ref=e329]
                    - cell [ref=e330]:
                      - button "Inspect" [ref=e331] [cursor=pointer]
                  - row [ref=e332]:
                    - cell "Unauthorized Tool Invocation" [ref=e333]
                    - cell "SQL Query Agent (system_exec())" [ref=e337]
                    - cell "High" [ref=e338]
                    - cell "Blocked" [ref=e339]
                    - cell "14m ago" [ref=e342]
                    - cell [ref=e343]:
                      - button "Inspect" [ref=e344] [cursor=pointer]
                  - row [ref=e345]:
                    - cell "Indirect Prompt Injection" [ref=e346]
                    - cell "Inbound Ingestion Agent (send_email())" [ref=e350]
                    - cell "High" [ref=e351]
                    - cell "Blocked" [ref=e352]
                    - cell "28m ago" [ref=e355]
                    - cell [ref=e356]:
                      - button "Inspect" [ref=e357] [cursor=pointer]
                  - row [ref=e358]:
                    - cell "PII & Financial Boundary Violation" [ref=e359]
                    - cell "Finance Audit Agent (stripe_refund_batch())" [ref=e363]
                    - cell "Medium" [ref=e364]
                    - cell "Needs Approval" [ref=e365]
                    - cell "42m ago" [ref=e368]
                    - cell [ref=e369]:
                      - button "Inspect" [ref=e370] [cursor=pointer]
                  - row [ref=e371]:
                    - cell "Scanner Obfuscation Evasion" [ref=e372]
                    - cell "Code Review Agent (write_file())" [ref=e376]
                    - cell "Medium" [ref=e377]
                    - cell "Allowed" [ref=e378]
                    - cell "1h ago" [ref=e381]
                    - cell [ref=e382]:
                      - button "Inspect" [ref=e383] [cursor=pointer]
                  - row [ref=e384]:
                    - cell "Benign Analytical Query" [ref=e385]
                    - cell "Analytics Agent (bigquery_query())" [ref=e389]
                    - cell "Low" [ref=e390]
                    - cell "Allowed" [ref=e391]
                    - cell "1h ago" [ref=e394]
                    - cell [ref=e395]:
                      - button "Inspect" [ref=e396] [cursor=pointer]
          - generic [ref=e397]:
            - generic [ref=e398]:
              - generic [ref=e399]:
                - heading "Defense Layers" [level=2] [ref=e400]
                - generic [ref=e401]: 6 of 7 Active
              - generic [ref=e402]: Multi-stage behavioral inspection & cross-agent pipeline
              - generic [ref=e403]:
                - generic [ref=e404]:
                  - generic [ref=e405]:
                    - generic [ref=e406]: terminal
                    - generic [ref=e408]:
                      - generic [ref=e409]: Input Scanner
                      - generic [ref=e410]: Detect suspicious instructions.
                  - generic [ref=e411]: Active
                - generic [ref=e412]:
                  - generic [ref=e413]:
                    - generic [ref=e414]: alt_route
                    - generic [ref=e416]:
                      - generic [ref=e417]: Counterfactual Analysis
                      - generic [ref=e418]: Identify document-induced action changes.
                  - generic [ref=e419]: Active
                - generic [ref=e420]:
                  - generic [ref=e421]:
                    - generic [ref=e422]: bolt
                    - generic [ref=e424]:
                      - generic [ref=e425]: Honey-Tool Detection
                      - generic [ref=e426]: Detect interactions with decoy tools.
                  - generic [ref=e427]: Active
                - generic [ref=e428]:
                  - generic [ref=e429]:
                    - generic [ref=e430]: link
                    - generic [ref=e432]:
                      - generic [ref=e433]: Taint-Aware Authorization
                      - generic [ref=e434]: Identify sensitive arguments derived from untrusted content.
                  - generic [ref=e435]: Degraded
                - generic [ref=e436]:
                  - generic [ref=e437]:
                    - generic [ref=e438]: hub
                    - generic [ref=e440]:
                      - generic [ref=e441]: Cross-Agent Data Guard
                      - generic [ref=e442]: Validate data transfers between agents against classification & destination policies.
                  - generic [ref=e443]: Active • Policy v1.4
                - generic [ref=e444]:
                  - generic [ref=e445]:
                    - generic [ref=e446]: gavel
                    - generic [ref=e448]:
                      - generic [ref=e449]: Policy Engine
                      - generic [ref=e450]: Enforce deterministic allow, approval, and block decisions.
                  - generic [ref=e451]: Active
                - generic [ref=e452]:
                  - generic [ref=e453]:
                    - generic [ref=e454]: visibility_off
                    - generic [ref=e456]:
                      - generic [ref=e457]: Output Guard
                      - generic [ref=e458]: Detect and redact supported sensitive information.
                  - generic [ref=e459]: Not Configured
            - generic [ref=e460]:
              - generic [ref=e461]:
                - heading "System Information" [level=2] [ref=e462]
                - generic [ref=e463]: Sandbox Ready
              - generic [ref=e466]:
                - generic [ref=e467]:
                  - generic [ref=e468]: Execution Mode
                  - generic [ref=e469]: Simulated Tools (Sandbox)
                - generic [ref=e470]:
                  - generic [ref=e471]: Model Provider
                  - generic [ref=e472]: Ollama (Local)
                - generic [ref=e475]:
                  - generic [ref=e476]: Policy Version
                  - generic [ref=e477]: v1.4.2 (Strict)
                - generic [ref=e478]:
                  - generic [ref=e479]: Last Evaluation
                  - generic [ref=e480]:
                    - generic [ref=e481]: Not run (Baseline pending)
                    - link "Run now" [ref=e482] [cursor=pointer]:
                      - /url: /evaluation-lab
                - generic [ref=e483]:
                  - generic [ref=e484]: Agent Simulation
                  - generic [ref=e485]: Ready (3 agents active)
                - generic [ref=e488]:
                  - generic [ref=e489]: Cross-Agent Data Guard
                  - generic [ref=e490]: Enforced (Destination whitelist)
                - generic [ref=e491]:
                  - generic [ref=e492]: Honeytokens Active
                  - generic [ref=e493]: 12 deployed
              - generic [ref=e494]:
                - generic [ref=e495]: "Engine PID: 41920"
                - generic [ref=e496]: "Memory: 348 MB"
                - generic [ref=e497]: Uptime 99.98%
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('App loads successfully', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await expect(page).toHaveTitle(/PromptGuard/i);
  6  | });
  7  | 
  8  | test('Navigate to playground and run custom scenario', async ({ page }) => {
  9  |   await page.goto('/playground');
  10 |   
  11 |   // Select custom scenario
> 12 |   await page.click('text=Custom Manual Benchmark');
     |              ^ Error: page.click: Test timeout of 30000ms exceeded.
  13 |   
  14 |   // Enter target agent id
  15 |   await page.fill('input[placeholder="e.g. agent_123"]', 'agent-test-1');
  16 |   
  17 |   // Enter tool name
  18 |   await page.fill('input[placeholder="e.g. export_credentials"]', 'search_demo_records');
  19 |   
  20 |   // Enter tool args
  21 |   await page.fill('textarea[placeholder=\'{"key": "value"}\']', '{"query": "support"}');
  22 |   
  23 |   // Run
  24 |   await page.click('button:has-text("Run Simulation")');
  25 |   
  26 |   // Check results inspector
  27 |   await expect(page.locator('text=Execution Status: EXECUTED_IN_SIMULATION')).toBeVisible({ timeout: 10000 });
  28 | });
  29 | 
  30 | test('Navigate to Evaluation Lab', async ({ page }) => {
  31 |   await page.goto('/evaluations');
  32 |   await expect(page.locator('text=Evaluation Lab')).toBeVisible();
  33 | });
  34 | 
```