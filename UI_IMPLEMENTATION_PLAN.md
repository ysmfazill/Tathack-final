# PromptGuard AI — Frontend UI Implementation Plan

## 1. Technology Stack Recommendation & Environment Compatibility

Following our repository inspection and Stitch analysis:
- **Framework**: React 18 / 19 with Vite + TypeScript
- **Styling**: Tailwind CSS v3 configured with the exact design tokens and custom utility classes from Stitch
- **Icons**: Material Symbols Outlined (Google Fonts CDN or `@material-symbols/svg-400`) + Lucide React for supplementary micro-icons
- **Routing**: `react-router-dom` v6
- **State Management**: Zustand / React Context for simulated reactive streams, active test scenarios, telemetry filters, and persisted mock database
- **Charts / Visualizations**: Recharts / Canvas SVG for multi-agent topology nodes and telemetry distribution charts

---

## 2. Component Hierarchy & Architecture

```
src/
├── assets/                  # Brand assets (PromptGuard Shield Logo, avatars)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx    # Master shell (Sidebar + Header + Page Canvas)
│   │   ├── Sidebar.tsx      # Fixed 64-width navigation sidebar with engine status
│   │   └── Header.tsx       # Fixed top command bar with user profile & status chips
│   ├── common/
│   │   ├── MetricCard.tsx   # Reusable KPI / Telemetry tile (single/split stat, icon, trend)
│   │   ├── StatusBadge.tsx  # Semantic pill/chip (Passed, Blocked, Warning, Tainted)
│   │   ├── CodeBlock.tsx    # Monospace code container with copy & diff highlighting
│   │   ├── SearchInput.tsx  # Standardized telemetry search box with trailing badges
│   │   └── TabNav.tsx       # Reusable pill/underline tab navigation strip
│   ├── overview/
│   │   ├── AgentTopology.tsx # Cross-Agent Data Leakage Guard & interactive bus nodes
│   │   ├── ThreatStream.tsx  # Live threat telemetry table with row inspector
│   │   └── QuickActionBar.tsx # Fast action buttons
│   ├── playground/
│   │   ├── ScenarioGrid.tsx # 6 Adversarial test scenario selection cards
│   │   ├── InputWorkbench.tsx # Left-column dual textareas (User Task + Taint Vector)
│   │   └── FirewallInterceptor.tsx # Right-column decision banner, rule breakdown & JSON
│   ├── analysis/
│   │   ├── IncidentSummary.tsx # 4 Compact incident summary cards
│   │   ├── MultiAgentTrace.tsx # Visual multi-agent flow trace diagram
│   │   └── ForensicLogDiff.tsx # Side-by-side prompt diff with taint highlighting
│   ├── policy/
│   │   ├── PolicyMetricStrip.tsx # Active rules, restricted tools, data tiers
│   │   ├── PolicyTabs.tsx   # Category filter tabs (Tools, DLP, Heuristics, PII, HITL)
│   │   └── RuleCardList.tsx # Interactive rule list with toggles and action modes
│   ├── audit/
│   │   ├── AuditMetrics.tsx # 4 Storage and volume metric tiles
│   │   ├── LogTable.tsx     # High-density log table with sorting & filtering
│   │   └── LogDetailDrawer.tsx # Slide-out / expandable drawer for SHA-256 payload inspection
│   ├── evaluation/
│   │   ├── BenchmarkCards.tsx # 5 ASR, ABR, FPR, Task Accuracy & Latency KPI cards
│   │   ├── CategoryBreakdown.tsx # Progress bars for test categories
│   │   └── TestResultsTable.tsx # 48/250 test case execution results matrix
│   └── settings/
│       ├── ProviderSelector.tsx # Ollama, OpenAI, Anthropic, Custom cards
│       ├── ComponentToggles.tsx # Behavioral detection engine switches
│       └── SystemHealthList.tsx # 7/7 diagnostics health check status indicators
├── data/
│   ├── mockSecurityData.ts  # Pre-populated telemetry, threat logs, and incident records
│   ├── mockScenarios.ts     # 6 Adversarial benchmark scenarios with sample payloads
│   ├── mockPolicies.ts      # 42 Default behavioral rules across 5 categories
│   └── mockBenchmarks.ts    # Complete red-teaming evaluation dataset
├── routes/
│   ├── OverviewPage.tsx     # Screen 1
│   ├── PlaygroundPage.tsx   # Screen 2
│   ├── AnalysisPage.tsx     # Screen 3
│   ├── PolicyPage.tsx       # Screen 4
│   ├── AuditPage.tsx        # Screen 5
│   ├── EvaluationPage.tsx   # Screen 6
│   └── SettingsPage.tsx     # Screen 7
├── types/
│   └── index.ts             # TypeScript interfaces for SecurityEvent, PolicyRule, BenchmarkResult, etc.
├── App.tsx                  # React Router configuration
├── index.css                # Tailwind directives & design system color/font utilities
└── main.tsx                 # Application entry point
```

---

## 3. Application Routes & Navigation Mapping

| Route | Page Component | Stitch Screen Resource | Description |
| :--- | :--- | :--- | :--- |
| `/` or `/overview` | `OverviewPage` | `projects/12901583035330563368/screens/8cbae379f4eb49c0996ab0e2229834df` | Security posture, metric cards, cross-agent topology, and live stream. |
| `/attack-playground` | `PlaygroundPage` | `projects/12901583035330563368/screens/8e41c29703d345e3800214a090c60116` | Adversarial prompt injection & cross-agent leakage simulation sandbox. |
| `/live-attack-analysis` | `AnalysisPage` | `projects/12901583035330563368/screens/f70a91875a914189b596a10d411cb16b` | Deep forensic trace drilldown, taint flow diagram, and prompt diff. |
| `/policy-center` | `PolicyPage` | `projects/12901583035330563368/screens/d5f14129891b46618084762222f62835` | Guardrails, tool permissions, and data leakage prevention policies. |
| `/audit-logs` | `AuditPage` | `projects/12901583035330563368/screens/f7fd29f0596448e09c6d3f03e7143906` | High-density immutable log ledger with SHA-256 payload drawer. |
| `/evaluation-lab` | `EvaluationPage` | `projects/12901583035330563368/screens/b133c9027e614224b5ab4ed8662e50db` | Red-teaming benchmarks, ASR/ABR metrics, and test case matrix. |
| `/settings` | `SettingsPage` | `projects/12901583035330563368/screens/28e8b05b43cc4cebbb93fcb72c061449` | Model connectivity (Ollama :11434), engine toggles, and diagnostics. |

---

## 4. Dependencies & Prerequisites

Once approved to proceed, the following packages will be scaffolded:
- `react`, `react-dom`
- `react-router-dom`
- `lucide-react`
- `clsx`, `tailwind-merge`
- Development dependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`

---

## 5. Phased Implementation Sequence

1. **Step 1: Project Scaffolding & Design System Tokens**
   - Initialize Vite React TypeScript in `d:\Tathack\Tathack-final`.
   - Setup `tailwind.config.js` with exact Stitch color tokens (`#0b1326`, `#131b2e`, `#171f33`, `#adc6ff`, `#4cd7f6`, `#4edea3`, `#ffb4ab`, etc.) and typography definitions (`Geist`, `JetBrains Mono`).
   - Setup Google Fonts imports in `index.html` (Geist, JetBrains Mono, Material Symbols Outlined).

2. **Step 2: Core Shell Layout**
   - Implement `Sidebar` with brand header, 7 nav links, active states, and engine status footer.
   - Implement `Header` with dynamic breadcrumb title, protection status badge, and user profile chip.
   - Implement `AppLayout` wrapper and routing table.

3. **Step 3: Shared UI Component Library & Mock Datastores**
   - Implement `MetricCard`, `StatusBadge`, `CodeBlock`, `SearchInput`, and `TabNav`.
   - Implement `mockSecurityData.ts`, `mockScenarios.ts`, `mockPolicies.ts`, and `mockBenchmarks.ts`.

4. **Step 4: Screen 1 & Screen 2 (Overview & Attack Playground)**
   - Build `OverviewPage`: Notice banner, quick actions, 4 KPI cards, multi-agent topology canvas, and threat stream table.
   - Build `PlaygroundPage`: 6 scenario cards, dual-textarea input workbench, interactive simulation runner, and live firewall interceptor output.

5. **Step 5: Screen 3 & Screen 4 (Live Attack Analysis & Policy Center)**
   - Build `AnalysisPage`: Incident signature header, 4 incident summary tiles, multi-agent flow trace, and side-by-side prompt diff inspector.
   - Build `PolicyPage`: Metric strip, category tabs (Tools, DLP, Injection, PII, HITL), rule toggles, and modal rule creator.

6. **Step 6: Screen 5, Screen 6 & Screen 7 (Audit Logs, Evaluation Lab & Settings)**
   - Build `AuditPage`: Storage health bar, 4 audit KPI tiles, filter bar, high-density log table, and expandable JSON forensic drawer.
   - Build `EvaluationPage`: 5 ASR/ABR benchmark cards, category progress breakdown, and interactive test case matrix.
   - Build `SettingsPage`: Model provider selection (Ollama, OpenAI, Custom), detection engine switches, threshold sliders, and 7/7 system health checks.

7. **Step 7: Verification & Quality Audit**
   - Validate responsive viewport fidelity across desktop (2560px & 1440px), laptop (1024px), and tablet/mobile.
   - Validate build with `npm run build` to ensure zero TypeScript or bundling errors.
