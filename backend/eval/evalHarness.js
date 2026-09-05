const fs = require('fs');
const path = require('path');
const { diagnoseEvent } = require('../services/diagnosisService');

// Labeled test cases (Mix of deterministic codes and unstructured text)
const testCases = [
    // --- Deterministic test cases ---
    { failure_code: 'card_declined_insufficient_funds', error_description: '', actual_cause: 'insufficient_funds' },
    { failure_code: 'card_declined_expired', error_description: '', actual_cause: 'card_expired' },
    { failure_code: 'bank_timeout', error_description: '', actual_cause: 'bank_timeout' },
    { failure_code: 'mandate_revoked', error_description: '', actual_cause: 'mandate_revoked' },
    { failure_code: 'checkout_abandoned', error_description: '', actual_cause: 'checkout_abandoned' },
    { failure_code: 'invoice_overdue', error_description: '', actual_cause: 'invoice_overdue' },
    { failure_code: 'user_cancelled', error_description: '', actual_cause: 'user_cancelled' },
    { failure_code: 'success', error_description: '', actual_cause: 'success' },

    // --- Insufficient Funds (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'My balance was not enough to make the payment.', actual_cause: 'insufficient_funds' },
    { failure_code: 'generic_error', error_description: 'I will add money tomorrow, current balance is zero.', actual_cause: 'insufficient_funds' },
    { failure_code: 'failed', error_description: 'Transaction declined due to low funds in my account.', actual_cause: 'insufficient_funds' },
    { failure_code: 'generic_decline', error_description: 'Card declined because I have no money.', actual_cause: 'insufficient_funds' },
    { failure_code: 'error', error_description: 'Not enough balance in bank.', actual_cause: 'insufficient_funds' },

    // --- Card Expired (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'My card expired last month, will update.', actual_cause: 'card_expired' },
    { failure_code: 'generic_error', error_description: 'The validity of my Visa card is over.', actual_cause: 'card_expired' },
    { failure_code: 'failed', error_description: 'Card expiration date reached.', actual_cause: 'card_expired' },
    { failure_code: 'error', error_description: 'Need to enter new card details because my old one expired.', actual_cause: 'card_expired' },
    { failure_code: 'generic_decline', error_description: 'Expiry date is invalid on current card.', actual_cause: 'card_expired' },

    // --- Bank Timeout (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'The bank website gateway timed out during processing.', actual_cause: 'bank_timeout' },
    { failure_code: 'generic_error', error_description: 'Bank server crashed before completing verification.', actual_cause: 'bank_timeout' },
    { failure_code: 'failed', error_description: 'Network failure during 3D secure pin authentication.', actual_cause: 'bank_timeout' },
    { failure_code: 'error', error_description: 'Slow gateway server triggered request timeout.', actual_cause: 'bank_timeout' },
    { failure_code: 'generic_decline', error_description: 'My connection disconnected mid-transaction.', actual_cause: 'bank_timeout' },

    // --- Mandate Revoked (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'Subscription mandate was revoked by the cardholder.', actual_cause: 'mandate_revoked' },
    { failure_code: 'generic_error', error_description: 'Auto-debit setup is not authorized on this account.', actual_cause: 'mandate_revoked' },
    { failure_code: 'failed', error_description: 'Canceled auto-debit consent with BietHub.', actual_cause: 'mandate_revoked' },
    { failure_code: 'error', error_description: 'Recurrent payment permission denied by customer.', actual_cause: 'mandate_revoked' },
    { failure_code: 'generic_decline', error_description: 'Revoked recurrent mandate agreement.', actual_cause: 'mandate_revoked' },

    // --- Checkout Abandoned (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'Left the checkout page before completing purchase.', actual_cause: 'checkout_abandoned' },
    { failure_code: 'generic_error', error_description: 'User abandoned cart due to friction.', actual_cause: 'checkout_abandoned' },
    { failure_code: 'failed', error_description: 'Incomplete transaction - user clicked back button.', actual_cause: 'checkout_abandoned' },
    { failure_code: 'error', error_description: 'Timed out before submitting card details.', actual_cause: 'checkout_abandoned' },
    { failure_code: 'generic_decline', error_description: 'Cart abandoned on payment screen.', actual_cause: 'checkout_abandoned' },

    // --- Invoice Overdue B2B (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'B2B Corporate Invoice has been overdue for 15 days.', actual_cause: 'invoice_overdue' },
    { failure_code: 'generic_error', error_description: 'Corporate wellness tier invoice unpaid by HR team.', actual_cause: 'invoice_overdue' },
    { failure_code: 'failed', error_description: 'B2B billing receivable is outstanding.', actual_cause: 'invoice_overdue' },
    { failure_code: 'error', error_description: 'Corporate account balance overdue for invoice #228.', actual_cause: 'invoice_overdue' },
    { failure_code: 'generic_decline', error_description: 'HR corporate package payment is past due.', actual_cause: 'invoice_overdue' },

    // --- User Cancelled (unstructured/generic) ---
    { failure_code: 'generic_decline', error_description: 'Customer requested manual cancellation of membership.', actual_cause: 'user_cancelled' },
    { failure_code: 'generic_error', error_description: 'I want to unsubscribe, stop auto-charging me.', actual_cause: 'user_cancelled' },
    { failure_code: 'failed', error_description: 'I am leaving the city, please cancel my subscription.', actual_cause: 'user_cancelled' },
    { failure_code: 'error', error_description: 'Please terminate my activity pass. Do not renew.', actual_cause: 'user_cancelled' },
    { failure_code: 'generic_decline', error_description: 'Unsubscribed from monthly event access tier.', actual_cause: 'user_cancelled' }
];

const runEvaluation = async () => {
    console.log(`Running evaluation harness across ${testCases.length} test cases...`);

    const categories = [
        'insufficient_funds',
        'card_expired',
        'bank_timeout',
        'mandate_revoked',
        'checkout_abandoned',
        'invoice_overdue',
        'user_cancelled',
        'success',
        'unknown'
    ];

    // Initialize metrics
    const stats = {};
    categories.forEach(cat => {
        stats[cat] = { tp: 0, fp: 0, fn: 0, tn: 0 };
    });

    // Initialize confusion matrix grid
    const confusionMatrix = {};
    categories.forEach(actual => {
        confusionMatrix[actual] = {};
        categories.forEach(pred => {
            confusionMatrix[actual][pred] = 0;
        });
    });

    let correctCount = 0;

    for (const test of testCases) {
        const result = await diagnoseEvent({
            failure_code: test.failure_code,
            error_description: test.error_description
        });

        const predicted = result.cause;
        const actual = test.actual_cause;

        // Update confusion matrix
        if (confusionMatrix[actual] && confusionMatrix[actual][predicted] !== undefined) {
            confusionMatrix[actual][predicted]++;
        }

        if (predicted === actual) {
            correctCount++;
            stats[actual].tp++;
        } else {
            stats[actual].fn++;
            if (stats[predicted]) {
                stats[predicted].fp++;
            }
        }

        // Update true negatives for others
        categories.forEach(cat => {
            if (cat !== actual && cat !== predicted) {
                stats[cat].tn++;
            }
        });
    }

    const overallAccuracy = (correctCount / testCases.length) * 100;

    // Build Report Content
    let reportMd = `# Root-Cause Diagnosis Agent Evaluation Report

This report presents the classifier performance metrics calculated by running the diagnostic engine against a held-out evaluation test batch of ${testCases.length} labeled payment decline scenarios.

## Headline Classifier Metrics

| Metric | Value | Details |
|---|---|---|
| **Overall Accuracy** | **${overallAccuracy.toFixed(2)}%** | Correct classifications across all test cases |
| **Total Test Samples** | **${testCases.length}** | Representative distribution of decline codes and user descriptions |

---

## Performance Per Cause Category

Precision, Recall, and F1-scores calculated per classification outcome.

| Category | True Positives (TP) | False Positives (FP) | False Negatives (FN) | Precision | Recall | F1-Score |
|---|---|---|---|---|---|---|
`;

    categories.forEach(cat => {
        const s = stats[cat];
        const precision = s.tp + s.fp > 0 ? s.tp / (s.tp + s.fp) : 0;
        const recall = s.tp + s.fn > 0 ? s.tp / (s.tp + s.fn) : 0;
        const f1 = precision + recall > 0 ? 2 * ((precision * recall) / (precision + recall)) : 0;

        reportMd += `| \`${cat}\` | ${s.tp} | ${s.fp} | ${s.fn} | ${(precision * 100).toFixed(1)}% | ${(recall * 100).toFixed(1)}% | ${(f1 * 100).toFixed(1)}% |\n`;
    });

    reportMd += `
---

## Confusion Matrix

Rows show the ground truth (**Actual**) cause. Columns show the **Predicted** cause.

| Actual \\ Predicted | ${categories.map(c => `\`${c}\``).join(' | ')} |
|---|${categories.map(() => '---|').join('')}
`;

    categories.forEach(actual => {
        let rowStr = `| **\`${actual}\`** | `;
        categories.forEach(pred => {
            const val = confusionMatrix[actual][pred];
            rowStr += `${val} | `;
        });
        reportMd += rowStr + '\n';
    });

    reportMd += `
---

## False-Positive Cost & Impact Analysis

In a financial revenue recovery loop, classification errors introduce distinct operational costs:

1. **Low Balance classified as User Cancelled**:
   - **Cost**: High. The platform drops recovery tracking under the assumption that the user wants to leave. This results in direct **silent revenue leakage** that could have been saved.
2. **User Cancelled classified as Mandate Revoked / Insufficient Funds**:
   - **Cost**: Compliancy violation. The recovery system automatically triggers nudge retries or mandate reactivation alerts to a customer who has explicitly opted out, creating a poor user experience and possible spam complaints.
3. **Generic decline mapped to Unknown (confidence < 0.70)**:
   - **Action**: Correctly routes to the **Human-in-Loop queue**. Below the confidence gate, manual support reviews the error description or chat notes before sending escalations.

---
*Report auto-generated by \`backend/eval/evalHarness.js\` on ${new Date().toISOString()}*
`;

    // Ensure directory exists
    const evalDir = path.join(__dirname);
    if (!fs.existsSync(evalDir)) {
        fs.mkdirSync(evalDir);
    }

    const reportPath = path.join(evalDir, 'classifier_report.md');
    fs.writeFileSync(reportPath, reportMd, 'utf8');

    console.log(`\nEvaluation complete! Report written to ${reportPath}`);
    console.log(`Overall Accuracy: ${overallAccuracy.toFixed(2)}%`);
};

runEvaluation();
