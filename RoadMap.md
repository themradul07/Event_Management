# AI Revenue Recovery — BietHub Campus Subscription Platform
### Razorpay AI Buildathon · Track 03 · 7-Milestone Roadmap

---

## Why this scope raises the bar

The judging bar for Track 3 is: *"Don't just identify the problem. Show measured money recovered across a batch, with compliant escalation, stopping rules, and an audit trail."*

Most submissions will do: basic site → one payment failure → one LLM call → "recovered!" demo. To clearly separate from that pack, this version adds four things most entries will skip:

1. **Root-cause depth** — a real classifier with measured precision/recall, not a single LLM guess.
2. **Multi-channel, multi-step intervention** — retry sequencing, Hinglish nudges, promise-to-pay tracking, B2B receivables — matching *multiple* example directions from the brief instead of one.
3. **Guardrails as a first-class component** — a compliance/gating layer that can reject or downgrade an agent's proposed action, with human-in-loop escalation for high-value cases.
4. **A real batch harness with an evaluation report** — 100+ synthetic subscribers, honest metrics, a false-positive cost line, and an exception list — because "one cherry-picked match proves nothing" is explicitly called out as a failure mode.

Total build: 7 milestones. Treat milestones 1–4 as the non-negotiable core (a working, demoable system). Treat 5–7 as the differentiation layer that makes the submission hard to ignore.

---

## Milestone 1 — Foundations: BietHub platform + data model

**Goal:** A real subscription product to generate believable revenue events from, plus the data backbone everything else writes to.

**Build:**
- BietHub campus platform: plans (monthly/quarterly/annual), member signup, subscription checkout via Razorpay test-mode (Orders + Subscriptions API).
- Core data model (Postgres): `members`, `subscriptions`, `payments`, `events`, `actions`, `audit_log`.
- Seed script for realistic member profiles (plan tier, tenure, payment method, geography — used later to make synthetic failures believable, not random).
- Basic auth + member dashboard (view plan, payment history, update card).

**Definition of done:**
- A user can sign up, pick a plan, and complete a real Razorpay test-mode payment end to end.
- Schema supports recurring billing (subscription id, next charge date, mandate id) — this matters for Milestone 4's mandate retry logic.

**Why it matters for judging:** shows you built a genuine payment surface, not a stub — this is what makes the "failure" scenarios later feel real instead of scripted.

---

## Milestone 2 — Controllable failure simulator + event bus

**Goal:** A wrapper around Razorpay test APIs that can *force* specific revenue-loss scenarios on demand, and a clean event pipeline for the agent to consume.

**Build:**
- Simulator service that intercepts/wraps checkout and subscription charge calls, forcing one of:
  - `card_declined_insufficient_funds`
  - `card_declined_expired`
  - `bank_timeout` (transient — should self-resolve on retry)
  - `mandate_revoked`
  - `checkout_abandoned` (order created, never completed within N minutes)
  - `invoice_overdue` (for a B2B "corporate wellness" membership tier — this is your bridge into the B2B receivables example direction)
  - `user_cancelled` (deliberate churn — critical *negative* case: agent must recognize this and NOT attempt recovery)
- Event bus (simple Postgres outbox + polling worker, or Redis pub/sub) publishing structured events: `{event_id, member_id, subscription_id, amount, failure_code, timestamp, retry_count}`.
- Webhook receiver for real Razorpay test-mode webhooks, normalized into the same event schema as simulated ones — so the agent can't tell (and doesn't need to know) which source an event came from.

**Definition of done:**
- Can trigger any of the 7 failure types on demand via an admin panel or script.
- Every event lands in the `events` table within seconds, with no duplicates.

**Why it matters for judging:** "measured metrics on a held-out test set" style credibility requires *controllable, labeled* ground truth — you need to know the true cause to score your classifier in Milestone 3.

---

## Milestone 3 — Root-cause diagnosis agent (the evaluated core)

**Goal:** Classify *why* revenue is at risk, with measured accuracy — this is the piece a judge will most want to interrogate.

**Build:**
- **Deterministic layer first:** map Razorpay error codes directly to categories via lookup table (no LLM needed — most bank decline reasons are already coded).
- **LLM layer for the ambiguous 20%:** cases where the code is generic ("payment failed") or context is unstructured (a member's WhatsApp reply, a support ticket). Use structured JSON output: `{cause, confidence, reasoning}`.
- **Confidence gating:** below a confidence threshold, route to human review instead of auto-acting (ties directly into Milestone 5's guardrails).
- **Evaluation harness:** hold out 20% of your simulator's labeled events, run the classifier, report a confusion matrix, precision/recall per cause category.

**Definition of done:**
- A checked-in evaluation report (`eval/classifier_report.md`) with real numbers, not estimates.
- Documented false-positive cost: e.g. what happens when "insufficient funds" is misclassified as "user cancelled" (a real recovery opportunity silently dropped).

**Why it matters for judging:** this is the single highest-leverage milestone for standing out — almost no other team will publish an honest confusion matrix.

---

## Milestone 4 — Recovery playbook + multi-channel intervention engine

**Goal:** Turn a diagnosed cause into a bounded, explainable action — covering multiple example directions from the brief, not just "retry the card."

**Build:** an explicit, human-readable playbook config (YAML/JSON, not buried in a prompt):

| Cause | Action sequence | Bound |
|---|---|---|
| Insufficient funds | Retry at +24h, then +72h | Max 2 retries |
| Card expired | Send update-card link (email) | Max 3 nudges / 7 days |
| Bank timeout | Immediate silent retry once | Max 1 auto-retry |
| Mandate revoked | Send re-authorization link | Max 2 nudges, then escalate |
| Checkout abandoned | Reminder nudge sequence | 1 nudge at 1h, 1 at 24h |
| Invoice overdue (B2B) | Escalating reminder + **promise-to-pay capture** | Escalate to human at day 14 |
| User cancelled | No action | Log as lost |

Layer in two of the brief's named example directions as real sub-systems, not window dressing:
- **Hinglish voice/chat recovery:** member-facing nudge messages generated in natural Hinglish register for the WhatsApp-style channel — a genuine differentiator most teams will skip.
- **Promise-to-pay tracker:** when a member replies "I'll pay Friday," capture that as a structured commitment (`promised_date`, `promised_amount`), suppress further nudges until that date, then auto-follow-up if it's missed.

**Definition of done:**
- Playbook is data, not code — swapping a rule doesn't require redeploying the agent.
- Every action selection writes `{cause, action, bound_applied, reasoning_summary}` to `audit_log` before executing.

**Why it matters for judging:** directly answers "the right intervention" and "compliant escalation" from the track description, and covers 4+ of the 7 example directions in one coherent system.

---

## Milestone 5 — Guardrails, stopping rules & human-in-loop escalation

**Goal:** Make the agent's power *bounded and gated* — this is explicitly called out as "the bar" for Track 3.

**Build:**
- **Hard stopping rules (code, never LLM-decided):** max attempts per member per failure type, cooldown windows between retries (issuer-safe), automatic "mark as lost" after N days/attempts.
- **Compliance gate:** a rules-based check that runs *before* any action executes — value-based escalation (e.g. any recovery action on a subscription above ₹X requires human approval), do-not-contact list enforcement, rate limiting per channel.
- **Human-in-loop queue:** a simple review UI where low-confidence or high-value cases wait for approval before the executor fires.
- **Kill switch:** a global pause that stops all outbound actions instantly (shows you designed for the "what if this goes wrong in production" case).

**Definition of done:**
- Demonstrable failure case: force a scenario that should escalate (e.g. large B2B invoice, low classifier confidence) and show it correctly stops short of auto-acting.
- One deliberately "handled gracefully" failure documented end to end (as the Track 1 bar phrase also implies — showing this discipline strengthens the whole submission).

**Why it matters for judging:** most entries will build an agent that *works*; fewer will build one a real fintech would actually trust to run unattended. This milestone is what makes the difference legible.

---

## Milestone 6 — Batch harness, metrics & dashboard

**Goal:** Prove the system at scale with honest numbers — the actual scored artifact.

**Build:**
- **Synthetic subscriber generator:** 100–150 members with a realistic failure-type distribution (weight toward card declines and abandonment, like real platform churn patterns) plus a genuine held-out mix for evaluation.
- **Batch runner:** fires the full pipeline (simulate → classify → decide → gate → execute) across the whole batch and produces a report:
  - Revenue at risk vs. revenue recovered (₹ and %)
  - Recovery rate by cause category
  - False-positive cost (nudges sent to unrecoverable members)
  - Exceptions: cases the agent escalated or gave up on, with reasons
- **Live dashboard** (React): real-time subscriber status board, funnel view (detected → diagnosed → action taken → recovered/lost), and the metrics above rendered as charts.

**Definition of done:**
- One command runs the full batch and regenerates the report.
- Dashboard and report numbers match exactly (no hand-massaged demo data).

**Why it matters for judging:** this is the literal deliverable the track description asks for — "measured money recovered across a batch." Everything else exists to make this number honest.

---

## Milestone 7 — Stress-testing, polish & submission package

**Goal:** De-risk the demo and package the story judges actually see.

**Build:**
- **Adversarial/edge-case pass:** duplicate webhooks, out-of-order events, a member who pays *during* a pending retry (must cancel the scheduled retry), a mandate that gets revoked mid-sequence.
- **Stretch differentiation (pick 1–2 if time allows, don't force all):**
  - Lightweight feedback loop: track which playbook actions actually recover money and surface a "this rule underperforms" signal (shows a path to self-improving recovery, without overclaiming real RL).
  - B2B receivables chaser as a distinct demo flow (separate from consumer subs) to visibly cover a second example direction end to end.
- **README + architecture diagram** written for a reviewer skimming in 2 minutes: problem → architecture → how to run the batch → the metrics table.
- **5-minute pitch video script:** open on the *number* (₹ recovered, recovery %), then show one full audit trail (detect → diagnose → decide → gate → act → outcome), then the dashboard, then one deliberately-handled failure case.
- **Public repo cleanup:** seed data included, one-command setup, `.env.example`, no secrets committed.

**Definition of done:**
- A stranger can clone the repo, run the batch harness, and reproduce your headline number in under 10 minutes.
- Video is under 5 minutes and leads with evidence, not narration.

---

## Suggested effort split

| Milestone | Focus | Relative effort |
|---|---|---|
| 1 | BietHub platform + data model | 15% |
| 2 | Failure simulator + events | 10% |
| 3 | Diagnosis agent + eval | 20% |
| 4 | Playbook + multi-channel actions | 20% |
| 5 | Guardrails + escalation | 15% |
| 6 | Batch harness + dashboard | 15% |
| 7 | Stress-test + submission | 5% |

If time runs short, protect Milestones 3, 4, and 6 above all else — they are the three the judging criteria name explicitly (measured accuracy, right intervention, measured batch recovery). Milestones 5 and 7 are what turn a good submission into a hard-to-beat one.