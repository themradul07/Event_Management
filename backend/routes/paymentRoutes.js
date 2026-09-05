const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/pay', paymentController.createOrder);
router.post('/pay/membership', paymentController.createMembershipOrder);
router.post('/pay/membership/verify', paymentController.verifyMembershipPayment);
router.post('/pay/abandon', paymentController.handlePaymentAbandonment);
router.post('/simulator/trigger', paymentController.triggerSimulation);
router.get('/simulator/events', paymentController.getPaymentEvents);
router.post('/simulator/promise', paymentController.createPromiseToPay);
router.get('/simulator/promises', paymentController.getPromises);
router.get('/simulator/auditlogs', paymentController.getAuditLogs);
router.post('/batch/run', paymentController.runBatchSimulation);
router.get('/batch/latest', paymentController.getLatestBatchSimulation);
router.get('/batch/live', paymentController.getLiveMetrics);
router.get('/escalations', paymentController.getEscalations);
router.post('/escalations/resolve', paymentController.resolveEscalation);
router.post('/escalations/discount', paymentController.sendDiscountOffer);
router.get('/playbook', paymentController.getPlaybooks);
router.post('/playbook/update', paymentController.updatePlaybook);
router.delete('/playbook/:id', paymentController.deletePlaybook);
router.get('/proactive/scan', paymentController.scanProactiveChurn);
router.post('/proactive/nudge', paymentController.sendProactiveNudge);
router.get('/promise/active', paymentController.getActivePromiseForUser);
router.get('/playbook/optimize-suggestions', paymentController.getPlaybookSuggestions);
router.post('/playbook/apply-optimization', paymentController.applyOptimization);

module.exports = router;
