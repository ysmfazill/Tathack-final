# PromptGuard AI — Design System & Screen Specifications

## Executive Overview
**PromptGuard AI** is a real-time behavioral firewall designed to safeguard autonomous AI agent architectures. It intercepts adversarial prompt injections, prevents cross-agent data leakage, enforces tool-level execution guardrails, and maintains an immutable forensic audit trail.

This document details the extracted design tokens, UI architecture, component patterns, and complete specifications for all 7 screens from the verified **Stitch** project (`projects/12901583035330563368`).

---

## 1. Design System Foundations

### 1.1 Color Palette
The design system follows a modern technical minimalist command center aesthetic rooted in high-density dark surfaces with precise semantic optical accents.

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `surface` | `#0b1326` | Global base background canvas |
| `surface-dim` | `#0b1326` | Deepest canvas background |
| `surface-bright` | `#31394d` | Highlighted surface layer / hover card state |
| `surface-container-lowest` | `#060e20` | Inset backgrounds, code editors, raw telemetry boxes |
| `surface-container-low` | `#131b2e` | Primary card panels, sidebar canvas, elevated blocks |
| `surface-container` | `#171f33` | Secondary widgets, data cards, metric boxes |
| `surface-container-high` | `#222a3d` | Interactive items, active card states, button ghosts |
| `surface-container-highest`| `#2d3449` | Popovers, tooltips, dialogs, dropdown options |
| `on-surface` | `#dae2fd` | Primary high-contrast text |
| `on-surface-variant` | `#c2c6d6` | Secondary labels, descriptions, subheadings |
| `outline` | `#8c909f` | Standard borders, icons, neutral indicators |
| `outline-variant` | `#424754` | Micro-borders, card hairlines, table grid dividers |
| `primary` | `#adc6ff` | Electric slate / Primary accent & selection |
| `primary-container` | `#4d8eff` | Primary action button fills, active navigation indicator |
| `on-primary` | `#002e6a` | High-contrast text on primary fills |
| `secondary` | `#4cd7f6` | Vibrant Cyan — telemetry stream, active probes, vector links |
| `secondary-container` | `#03b5d3` | Cyan badges, active sandbox chips |
| `on-secondary` | `#003640` | Text on secondary fills |
| `tertiary` | `#4edea3` | Emerald Green — healthy states, passed checks, active protection |
| `tertiary-container` | `#00a572` | Emerald containers, success chips |
| `on-tertiary` | `#003824` | Text on tertiary fills |
| `error` | `#ffb4ab` / `#ef4444` | Crimson — blocked actions, critical severity, taint alert |
| `error-container` | `#93000a` | Critical threat containers, blocked alert backgrounds |
| `on-error` | `#690005` | Text on error fills |
| `warning` (amber) | `#f59e0b` / `#fbbf24` | Suspicious signals, review needed, pending approval |

---

### 1.2 Typography System

The typography pairs **Geist** for clean structural and display hierarchy with **JetBrains Mono** for forensic observability, code traces, metrics, and chips.

| Type Scale Token | Font Family | Size | Line Height | Weight | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | `Geist` | `36px` | `44px` | `600` / `700` | `-0.025em` | Main metric numbers, page hero titles |
| `headline-lg` | `Geist` | `24px` | `32px` | `600` | `-0.02em` | Section headers, modal titles, card headers |
| `headline-md` | `Geist` | `20px` | `28px` | `500` / `600` | `-0.015em` | Widget titles, sub-section headers |
| `body-lg` | `Geist` | `16px` | `24px` | `400` | `0` | Lead paragraph text, prominent descriptions |
| `body-md` | `Geist` | `14px` | `20px` | `400` | `0` | Standard body copy, table cell content |
| `body-sm` | `Geist` | `12px` | `16px` | `400` | `0` | Secondary descriptions, captions, footers |
| `mono-metric` | `JetBrains Mono`| `20px` | `24px` | `600` | `-0.02em` | Percentage badges, KPI indicators, latency |
| `mono-code` | `JetBrains Mono`| `13px` | `18px` | `400` | `0` | Payloads, tool calls, JSON trees, IDs |
| `label-caps` | `JetBrains Mono`| `11px` | `14px` | `500` / `600` | `0.06em` | Uppercase category tags, badges, status chips |

---

### 1.3 Layout & Shell Architecture

1. **Fixed Sidebar** (`w-64`, fixed `top-0`, `left-0`, `h-full`, `bg-surface-container-low`, `border-r border-outline-variant/30`):
   - **Brand Header** (`h-16`, `px-4`, flex items center): PromptGuard AI Shield Icon + "PromptGuard AI" title + "BEHAVIORAL FIREWALL" subtitle.
   - **Navigation Items**:
     - `Overview` (`/` or `/overview`, Icon: `grid_view`)
     - `Attack Playground` (`/attack-playground`, Icon: `security`)
     - `Live Attack Analysis` (`/live-attack-analysis`, Icon: `biotech` / `hub`)
     - `Policy Center` (`/policy-center`, Icon: `policy`)
     - `Audit Logs` (`/audit-logs`, Icon: `terminal` / `receipt_long`)
     - `Evaluation Lab` (`/evaluation-lab`, Icon: `science`)
     - `Settings` (`/settings`, Icon: `tune`)
   - **Engine Footer** (`p-4`, `bg-surface-container-lowest/50`, `border-t border-outline-variant/20`):
     - Engine status indicator ("Engine: Active" with pulsing green pip)
     - Environment badge ("LOCAL DEV", "v0.1.0")

2. **Top Header** (`fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 z-40 px-6`):
   - Dynamic page title and descriptive tagline
   - Real-time status chips ("Protection Active", "Model: Ollama")
   - Notification trigger with unread badge
   - SecOps User profile chip (`SecOps Admin`, `admin@promptguard.ai`, avatar)

3. **Main Content Canvas** (`pl-64 pt-16 bg-surface px-6 py-6 min-h-screen`):
   - Responsive fluid grid system (12-column desktop, responsive collapsing for tablets/mobile)
   - Consistent container rhythm (`gap-6`, `p-6`, `rounded-xl` for primary containers, `rounded-lg` for inner items)

---

## 2. Comprehensive Screen Specifications

### Screen 1: Security Overview
- **Screen ID**: `8cbae379f4eb49c0996ab0e2229834df`
- **Route**: `/` or `/overview`
- **Purpose**: Executive security posture, telemetry health, quick response workflows, and multi-agent cross-boundary visualization.
- **Key Sections**:
  1. **Environmental Banner**: Notice bar displaying demo environment status, port availability (`READY: PORT 8080`), and connectivity.
  2. **Quick Action Bar**: Fast triggers for "Test an Attack", "Test Data Leakage", "Review Blocked Transfers", "Run Security Evaluation", and "Review Audit Logs".
  3. **4 Key Metric Cards**:
     - *Attack Attempts*: Total evaluated cases (128)
     - *Actions Blocked*: Unauthorized actions prevented (94, 73.4% block rate)
     - *Pending Review*: Cases flagged for SecOps review (6, 4.7%)
     - *Active Policies*: Active heuristic rules enforced (42 rules)
  4. **Cross-Agent Data Leakage Guard & Multi-Agent Topology**: Interactive node flow showing source agent (e.g. Ingestion/Report), Inter-Agent Bus, Taint Quarantine Gateway, and Destination Agent.
  5. **Real-time Threat Telemetry Stream**: Live table of intercepted requests with timestamp, agent UUID, risk score, classification, and status pills.
  6. **Active Defense Rule Summary**: Visual rule state cards with rapid toggle enforcement.

---

### Screen 2: Attack Playground
- **Screen ID**: `8e41c29703d345e3800214a090c60116`
- **Route**: `/attack-playground`
- **Purpose**: Interactive sandbox to simulate adversarial prompt injections, jailbreaks, and cross-agent leakage against the behavioral firewall.
- **Key Sections**:
  1. **Telemetry Controls Bar**: Engine status (`Ollama Llama-3-8B | Port 8080`), "Reset Scenario", "Export Spec".
  2. **6 Adversarial Scenario Selector Cards**:
     - *Direct Injection*: Explicit prompt override attempt (Severity 0.88)
     - *Indirect Injection*: Malicious payload in email/external payload (Severity 0.94)
     - *Unauthorized Tool*: Attempting unprivileged file write / shell command (Severity 0.91)
     - *Scanner Evasion*: Obfuscated Base64 / cipher payload test
     - *Cross-Agent Data Leakage*: Unauthorized data transfer between agents (Active Benchmark, Risk 0.92)
     - *Benign Control*: Baseline legitimate task to evaluate false positive rates
  3. **Main Two-Column Workspace**:
     - **Left Column (Test Input Workbench - 58%)**:
       - Legitimate User Task textarea (`Origin: Trusted Session`)
       - Untrusted Ingest Content textarea (`Taint Vector` with red highlight)
       - Source Vector Type dropdown (Inter-Agent Data Transfer, Inbound Email, Web Scraping, RAG chunk)
       - Test Case Identifier & "Execute Simulation" primary action button
     - **Right Column (Firewall Defense Interceptor - 42%)**:
       - Evaluation Decision Banner (`BLOCKED` / `QUARANTINED` / `ALLOWED`)
       - Taint Vector Detection graph & byte offset matching
       - Heuristic Rules Triggered breakdown
       - Raw JSON forensic event viewer with copy action

---

### Screen 3: Live Attack Analysis
- **Screen ID**: `f70a91875a914189b596a10d411cb16b`
- **Route**: `/live-attack-analysis`
- **Purpose**: Deep forensic drilldown into a specific intercepted attack trace, analyzing execution graphs, taint propagation, and policy triggers.
- **Key Sections**:
  1. **Search & Filter Bar**: Search by Request ID (`req_demo_7f92a1`), Time range selector (`Last 15m`, `1H`, `24H`, `Custom`), and "Refresh Stream".
  2. **Incident Signature Banner**: Incident identifier (`SIG-2025-IND-7049`), telemetry verification chip, and sandbox mode alert.
  3. **4 Compact Incident Summary Tiles**:
     - *Risk Level*: CRITICAL (0.96 / 1.00)
     - *Firewall Decision*: ACTION TERMINATED (Pre-execution block)
     - *Taint Score*: 92% Tainted Parameter Matched
     - *Target Tool Intercepted*: `export_sync()` (Unauthorized Exfiltration)
  4. **Multi-Agent Propagation Graph**: Visual trace showing how tainted data flowed from input ingest through agent processing to tool boundary intercept.
  5. **Forensic Trace Log Diff Viewer**: Side-by-side display comparing original legitimate prompt with injected adversarial instructions and tainted parameters highlighted in red.
  6. **Triggered Policy Violations**: List of exact rule IDs matched (e.g. `RULE-DLP-004: Cross-Agent Boundary Violation`, `RULE-INJ-002: Instruction Overwrite`).

---

### Screen 4: Policy Center
- **Screen ID**: `d5f14129891b46618084762222f62835`
- **Route**: `/policy-center`
- **Purpose**: Configure firewall guardrails, tool execution blacklists, data classification boundaries, and human-in-the-loop approval thresholds.
- **Key Sections**:
  1. **Policy Status Header**: Active version (`v1.4.2 Strict`), "View Change History", and "+ Create Policy Rule" button.
  2. **4 Overview Metric Tiles**:
     - *Active Rules*: 42 (100% active across 3 pipelines)
     - *Restricted Tools*: 8 / 24 total constrained
     - *Data Categories*: 4 tiers (Public, Internal, Confidential, Restricted)
     - *Pending Approvals*: 2 queued for SecOps multi-sig authorization
  3. **Category Navigation Tabs**:
     - Tool Execution Guardrails
     - Inter-Agent Data Flow (DLP)
     - Prompt Injection Heuristics
     - Sensitive Data & PII Classifiers
     - Human-in-the-Loop (HITL) Triggers
  4. **Interactive Policy Rules Matrix**:
     - Filter & search by severity, agent, category
     - Rule cards with toggle switch, severity pill, action mode (DROP, QUARANTINE, REWRITE, ESCALATE), and tool permission constraints.

---

### Screen 5: Audit Logs
- **Screen ID**: `f7fd29f0596448e09c6d3f03e7143906`
- **Route**: `/audit-logs`
- **Purpose**: Immutable ledger of all agent activities, firewall interceptions, model interactions, and cryptographic audit proofs.
- **Key Sections**:
  1. **Command Sub-Header**: Storage health (`SQLite-WAL Ready • 4.2 MB / 100 MB`), "Refresh Logs", "Export Sanitized Logs".
  2. **4 Metric Tiles**:
     - *Total Events*: 1,248 (+8.4%)
     - *Blocked Actions*: 342 (27.4% rate)
     - *Approval Required*: 18 (3 in queue)
     - *Benign Clean*: 888 (71.1% rate)
  3. **Filter & Search Bar**: Free text search, severity filter (Critical, Warning, Info, Benign), Event Category dropdown, Agent ID selector.
  4. **High-Density Forensic Log Table**:
     - Columns: Timestamp (`HH:mm:ss.SSS`), Request ID, Agent UUID, Event Vector, Action Taken (Blocked/Allowed/Quarantined), Latency (`ms`), Payload Hash.
     - Expandable row drawer containing complete input/output payloads, taint trace data, and SHA-256 integrity hash.

---

### Screen 6: Evaluation Lab
- **Screen ID**: `b133c9027e614224b5ab4ed8662e50db`
- **Route**: `/evaluation-lab`
- **Purpose**: Red-teaming test harness and automated benchmark suites measuring attack resistance, false positives, and baseline task accuracy.
- **Key Sections**:
  1. **Command Context Bar**: Benchmark Suite (`SYNTH-EVAL-v2.1 • 250 Cases`), Model (`Ollama Llama-3-8B`), "View History", "Export Benchmark JSON", "Run Evaluation".
  2. **5 Key Benchmark Metric Cards**:
     - *Attack Success Rate (ASR)*: 4.2% (vs 88.0% unshielded baseline)
     - *Attack Blocking Rate (ABR)*: 95.8% (46/48 attacks blocked)
     - *False Positive Rate (FPR)*: 2.1% (1/48 benign flagged, target < 5%)
     - *Legitimate Task Completion*: 97.9% (47/48 tasks completed accurately)
     - *Average Latency Overhead*: 18.4 ms (Firewall inspection cost)
  3. **Benchmark Category Breakdown**: Progress bars and pass/fail metrics across Direct Injection, Indirect Injection, Cross-Agent Leakage, Jailbreak Resistance, and Benign Controls.
  4. **Detailed Test Case Results Table**: Test case ID, attack category, expected outcome, actual outcome, defense layer responsible, execution latency, and pass/fail status badge.

---

### Screen 7: Settings
- **Screen ID**: `28e8b05b43cc4cebbb93fcb72c061449`
- **Route**: `/settings`
- **Purpose**: System configuration, model provider connectivity, detection component tuning, risk thresholds, storage maintenance, and health checks.
- **Key Sections**:
  1. **Settings Header**: Configuration state (`v1.4.2 Persisted`), "Discard Unsaved", "Save Changes".
  2. **Sub-Navigation Tabs**:
     - Model Provider
     - Detection Components (6 Active)
     - Runtime Security
     - Risk Thresholds
     - Audit Storage
     - System Health (7/7 Healthy)
     - Simulation & Demo Controls
  3. **Model Provider Configuration**:
     - Provider Selection Cards (Ollama Local, OpenAI, Anthropic, Custom REST)
     - Endpoint URL input, Port, Model Selector (`llama3:8b-instruct`), Context Window, Timeout, and "Test Connection" button.
  4. **Detection Component Toggles**: Taint Tracker, Behavioral Heuristics, Tool Policy Engine, Cross-Agent Bus Guard, PII Redaction Engine.
  5. **System Health & Diagnostics Panel**: Real-time status checks for Gateway, SQLite WAL, Ollama Inference, Taint Engine, and Policy Cache.
