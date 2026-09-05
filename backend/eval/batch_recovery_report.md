# Scale Recovery Batch Execution Report

This scale metrics report summarizes the automated billing recovery outcomes computed across a synthetic batch of **120** subscriber transaction errors.

## Headline Batch Metrics

| Indicator | Value | Description |
|---|---|---|
| **Run ID** | `batch_run_1787932538933` | Unique batch simulation run identifier |
| **Total Subscribers Evaluated** | **120** | Generated synthetic transaction cohort |
| **Revenue At Risk** | **₹1,97,480** | Value of all payment declines / errors |
| **Revenue Recovered** | **₹1,02,346** | Value successfully recovered by recovery playbook |
| **Recovery Efficiency Rate** | **51.83%** | Percent of risk revenue successfully saved |
| **Outbound Messaging Cost** | **₹550** | Cost of WhatsApp / email notifications (₹5 each) |

---

## Recovery Rate by Cause Category

| Cause Category | Total Cases | Revenue At Risk | Recovered Cases | Revenue Saved | Recovery Rate (%) |
|---|---|---|---|---|---|
| `insufficient_funds` | 48 | ₹57,352 | 25 | ₹29,870.833 | 52.1% |
| `card_expired` | 18 | ₹22,782 | 5 | ₹6,328.333 | 27.8% |
| `bank_timeout` | 12 | ₹9,988 | 10 | ₹8,323.333 | 83.3% |
| `mandate_revoked` | 6 | ₹8,394 | 3 | ₹4,197 | 50.0% |
| `checkout_abandoned` | 24 | ₹30,176 | 7 | ₹8,801.333 | 29.2% |
| `invoice_overdue` | 6 | ₹59,994 | 4 | ₹39,996 | 66.7% |
| `user_cancelled` | 6 | ₹8,794 | 0 | ₹0 | 0.0% |

---

## System Exceptions Logs

Detailed log of B2B escalations, written-off accounts, and suppressed nudges.

| Student Name | Email | Cause | Event Outcome details | Status |
|---|---|---|---|---|
| Batch Student 1 | `student1@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 3 | `student3@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 4 | `student4@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 5 | `student5@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 6 | `student6@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 7 | `student7@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 11 | `student11@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 12 | `student12@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 13 | `student13@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 15 | `student15@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 19 | `student19@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 21 | `student21@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 23 | `student23@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 24 | `student24@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 25 | `student25@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 27 | `student27@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 31 | `student31@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 33 | `student33@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 35 | `student35@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 36 | `student36@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 38 | `student38@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 47 | `student47@batch.biethub.in` | `insufficient_funds` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 48 | `student48@batch.biethub.in` | `insufficient_funds` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 49 | `student49@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 51 | `student51@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 52 | `student52@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 54 | `student54@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 57 | `student57@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 58 | `student58@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 59 | `student59@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 60 | `student60@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 62 | `student62@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 63 | `student63@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 64 | `student64@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 65 | `student65@batch.biethub.in` | `checkout_abandoned` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 66 | `student66@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 67 | `student67@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 68 | `student68@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 69 | `student69@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 70 | `student70@batch.biethub.in` | `checkout_abandoned` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 73 | `student73@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 74 | `student74@batch.biethub.in` | `card_expired` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 76 | `student76@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 77 | `student77@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 78 | `student78@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 80 | `student80@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 82 | `student82@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 83 | `student83@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 84 | `student84@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 85 | `student85@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 88 | `student88@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 89 | `student89@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 90 | `student90@batch.biethub.in` | `card_expired` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 92 | `student92@batch.biethub.in` | `bank_timeout` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 93 | `student93@batch.biethub.in` | `bank_timeout` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 104 | `student104@batch.biethub.in` | `mandate_revoked` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 105 | `student105@batch.biethub.in` | `mandate_revoked` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 107 | `student107@batch.biethub.in` | `mandate_revoked` | Exceeded recovery time limits with no response. | `lost` |
| Batch Student 110 | `student110@batch.biethub.in` | `invoice_overdue` | B2B invoice overdue escalated to corporate accounts team. | `escalated` |
| Batch Student 113 | `student113@batch.biethub.in` | `invoice_overdue` | Payment promise committed for date: 2/9/2026 | `ptp_suppressed` |
| Batch Student 115 | `student115@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |
| Batch Student 116 | `student116@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |
| Batch Student 117 | `student117@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |
| Batch Student 118 | `student118@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |
| Batch Student 119 | `student119@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |
| Batch Student 120 | `student120@batch.biethub.in` | `user_cancelled` | Explicit churn: user requested membership cancellation. | `lost` |

---
*Report generated by batch test runner on 2026-08-28T15:58:48.686Z*
