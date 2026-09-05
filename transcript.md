# BietHub — AI Revenue Recovery Platform
## 5-Minute Project Presentation Transcript & Speaker Guide

**Target Duration:** ~5 Minutes (approx. 700 words at a steady, engaging pace of 140 wpm)  
**Presenter:** Project Lead / Developer  
**Audience:** Hackathon Judges, Technical Evaluators, & Product Leaders  
**Tone:** Confident, structured, energetic, and metric-driven  

---

### Timing Overview

| Timestamp | Section | Key Focus |
| :--- | :--- | :--- |
| **0:00 – 0:45** | 1. Hook & Problem Statement | The hidden leaky bucket of failed recurring payments |
| **0:45 – 1:45** | 2. System Architecture & Intelligence | Root-cause diagnosis engine (Deterministic + LLM) |
| **1:45 – 3:00** | 3. Multi-Channel Interventions & Voice AI | Hinglish Vapi Voice Agent & Promise-to-Pay (PTP) |
| **3:00 – 4:00** | 4. Live System Walkthrough & Dashboard | Recovery Dashboard, Admin Simulator, Escalation Queue |
| **4:00 – 5:00** | 5. Measured Impact, Guardrails & Conclusion | Confusion matrix, ROI, stopping rules, & closing |

---

### Transcript

#### **[0:00 - 0:45] Section 1: The Hook & The Problem**

`[SLIDE 1: Title & The Leaky Bucket of Recurring Revenue]`

> *"Good morning, everyone. In subscription and event membership platforms like **BietHub** today, up to 15 to 20 percent of churn isn’t because users want to leave. It happens silently due to payment failures: expired cards, transient bank timeouts, revoked mandates, or momentary insufficient funds.*
>
> *Most platforms treat payment failures with a blunt hammer: blindly spamming card retries or sending cold, generic emails. This damages customer trust, triggers bank anti-fraud flags, and leaves real money on the table.*
>
> *Today, I’m excited to present **BietHub AI Revenue Recovery**—an intelligent, closed-loop system that doesn’t just detect payment failures, but accurately diagnoses their root causes, executes compliant multi-channel playbooks, and recovers lost revenue with conversational AI."*

---

#### **[0:45 - 1:45] Section 2: Architecture & Root-Cause Diagnosis**

`[SLIDE 2: Two-Tier Diagnosis Engine & System Architecture]`

> *"At the core of BietHub is a hybrid **Root-Cause Diagnosis Engine**.*
>
> *We don't just pass every event to an LLM. Instead, we use a two-tiered classification architecture:*
> 1. *First, a **Deterministic Layer** instantly maps standard Razorpay error codes—like card expiry or hard declines—with zero latency.*
> 2. *Second, an **LLM Analysis Layer** processes unstructured signals—such as customer reply messages, support emails, or ambiguous decline descriptions.*
>
> *Each diagnosis yields a confidence score. If the confidence falls below our safety threshold, the system automatically routes the case to a **Human-in-the-Loop Escalation Queue**, ensuring zero unauthorized or improper actions."*

---

#### **[1:45 - 3:00] Section 3: Multi-Channel Interventions & Voice AI**

`[SLIDE 3: Hinglish Voice Recovery & Promise-to-Pay Engine]`

`[DEMO CUE: Point to Phone Simulator / Vapi Voice Sandbox]`

> *"Once a failure is diagnosed, BietHub triggers an adaptive playbook tailored to the exact failure mode. For example, transient bank timeouts trigger a single silent retry, while expired cards receive localized email and WhatsApp updates.*
>
> *Our biggest innovation is our **Interactive Voice Recovery Agent**, powered by Vapi AI. For the Indian market, high-friction email reminders often get ignored. Our AI voice agent speaks fluent **Hinglish**, calling members naturally to offer assistance, explain the issue, and guide them through payment resolution.*
>
> *Crucially, we built first-class compliance guardrails:*
> - *If a user tells our voice agent, 'I will pay this Friday,' our **Promise-to-Pay (PTP) Tracker** captures that commitment, logs a binding PTP record, and immediately suppresses further nudges until the agreed date.*
> - *If a user explicitly cancels, our stopping rules kick in immediately, marking the account as lost to prevent intrusive outreach."*

---

#### **[3:00 - 4:00] Section 4: Live System Walkthrough & Recovery Dashboard**

`[SLIDE 4: Admin Simulator & Recovery Dashboard]`

`[DEMO CUE: Navigate to Recovery Dashboard]`

> *"Let’s look at the system in action.*
>
> *Through our **Admin Simulator**, we can inject controlled, labeled failure events—from mandate revocations to abandoned checkouts—to rigorously evaluate our pipeline.*
>
> *On the **Recovery Dashboard**, managers gain real-time visibility into key performance indicators:*
> - *Net Recovered Revenue and Cohort Conversion Rates*
> - *Intervention Funnel breakdown (Email vs. WhatsApp vs. Voice)*
> - *Audited step-by-step logs of every single AI decision and action taken.*
>
> *And in our **Escalation Panel**, human operators can review flagged edge cases, send custom discount offers, or manual overrides with a single click."*

---

#### **[4:00 - 5:00] Section 5: Measured Impact, Compliance & Conclusion**

`[SLIDE 5: Evaluation Matrix, ROI & Conclusion]`

> *"Unlike naive hackathon demos that cherry-pick single successful cases, we built an **Evaluation Harness** testing over 100 subscriber failure events. Our classifier achieves high precision and recall, backed by a transparent confusion matrix that measures false-positive costs.*
>
> *To recap: BietHub combines deterministic precision, conversational Hinglish voice AI, strict compliance stopping rules, and full auditability.*
>
> *We’re turning payment failures from a silent leak into an automated, empathetic revenue recovery channel.*
>
> *Thank you, and I’m ready for your questions!"*

---

### Speaker Delivery Tips

1. **Pacing:** Keep your rate around 130–140 words per minute. Pause for 2 seconds after presenting the Hinglish Voice Agent to let the concept sink in.
2. **Live Voice Demo Option:** If running a live call in front of judges, trigger the call in the **Phone Simulator (`/phone`)** at `2:30`, let the Vapi AI initiate the greeting, and speak a 15-second exchange before continuing to Section 4.
3. **Key Terminology to Highlight:** 
   - *Deterministic + LLM Diagnosis*
   - *Hinglish Vapi Voice Recovery*
   - *Promise-to-Pay (PTP) Suppression*
   - *False-Positive Auditability*

---

### Anticipated Q&A Cheat Sheet

* **Q1: How do you avoid spamming users who don't want to pay?**  
  *A: We enforce strict playbook bounds (max 2 retries, max 3 nudges over 7 days) and explicit stopping rules. If a user cancels or sets a Promise-to-Pay date, all outreach is instantly suppressed.*

* **Q2: Why use a hybrid deterministic + LLM approach?**  
  *A: 80% of payment failures have explicit Razorpay status codes where LLMs add unnecessary latency and cost. We reserve the LLM for ambiguous reply messages, unstructured error strings, and confidence-gated decision making.*

* **Q3: How does Vapi AI handle Hinglish voice conversations?**  
  *A: We integrated `@vapi-ai/web` with custom prompt engineering tailored to natural Indian conversational nuance, capable of recognizing user intent, collecting promised dates, and passing structured feedback to our backend.*
