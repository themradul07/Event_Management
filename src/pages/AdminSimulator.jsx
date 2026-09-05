import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../utils/api';
import { 
    Terminal, 
    Handshake, 
    Activity, 
    History, 
    Calendar, 
    IndianRupee, 
    Play,
    Loader
} from 'lucide-react';

const AdminSimulator = () => {
    const { isAdmin, IsLogin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [selectedUser, setSelectedUser] = useState('');
    const [planType, setPlanType] = useState('monthly');
    const [failureCode, setFailureCode] = useState('success');
    const [customAmount, setCustomAmount] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    const [promiseUser, setPromiseUser] = useState('');
    const [promiseDate, setPromiseDate] = useState('');
    const [promiseAmount, setPromiseAmount] = useState('');

    // Check authorization redirect
    useEffect(() => {
        if (!authLoading && (!IsLogin || !isAdmin)) {
            toast.error("Access denied. Admin role required.");
            navigate("/login");
        }
    }, [IsLogin, isAdmin, authLoading, navigate]);

    // 1. Fetch Users query
    const { data: usersResponse, isLoading: usersLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const res = await apiFetch("/admin/users");
            if (!res.ok) throw new Error("Failed to load users");
            return res.json();
        },
        enabled: IsLogin && isAdmin
    });

    const users = usersResponse?.users || [];

    // Keep form states in sync with loaded users
    useEffect(() => {
        if (users.length > 0 && !selectedUser) {
            setSelectedUser(users[0]._id);
            setPromiseUser(users[0]._id);
        }
    }, [users, selectedUser]);

    // 2. Fetch Events log query (auto-refreshing every 3 seconds)
    const { data: eventsResponse, refetch: refetchEvents } = useQuery({
        queryKey: ['simulatorEvents'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/simulator/events");
            if (!res.ok) throw new Error("Failed to load events");
            return res.json();
        },
        refetchInterval: 3000,
        enabled: IsLogin && isAdmin
    });

    const events = eventsResponse?.events || [];

    // 3. Fetch Playbook Audits query (auto-refreshing every 3 seconds)
    const { data: auditsResponse, refetch: refetchAudits } = useQuery({
        queryKey: ['simulatorAudits'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/simulator/auditlogs");
            if (!res.ok) throw new Error("Failed to load audit logs");
            return res.json();
        },
        refetchInterval: 3000,
        enabled: IsLogin && isAdmin
    });

    const auditLogs = auditsResponse?.logs || [];

    // 4. Fetch Active Promises query (auto-refreshing every 3 seconds)
    const { data: promisesResponse, refetch: refetchPromises } = useQuery({
        queryKey: ['simulatorPromises'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/simulator/promises");
            if (!res.ok) throw new Error("Failed to load payment promises");
            return res.json();
        },
        refetchInterval: 3000,
        enabled: IsLogin && isAdmin
    });

    const promises = promisesResponse?.promises || [];

    // 5. Trigger simulation mutation
    const triggerSimulationMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await apiFetch("/payforevent/simulator/trigger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Trigger request failed");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(`Simulation triggered successfully!`);
                setErrorDescription('');
                // Refetch queries immediately to refresh boards
                refetchEvents();
                refetchAudits();
            } else {
                toast.error(data.msg || "Simulation failed.");
            }
        },
        onError: (err) => {
            toast.error(`Error triggering simulation: ${err.message}`);
        }
    });

    // 6. Record promise to pay mutation
    const registerPromiseMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await apiFetch("/payforevent/simulator/promise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Commitment registration failed");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Promise to Pay logged!");
                setPromiseDate('');
                setPromiseAmount('');
                refetchPromises();
            } else {
                toast.error(data.msg || "Failed to log commitment.");
            }
        },
        onError: (err) => {
            toast.error(`Error logging commitment: ${err.message}`);
        }
    });

    // Sync customAmount to plan values
    useEffect(() => {
        if (planType === 'monthly') setCustomAmount('299');
        else if (planType === 'quarterly') setCustomAmount('699');
        else if (planType === 'yearly') setCustomAmount('2499');
        else if (planType === 'corporate_wellness') setCustomAmount('9999');
    }, [planType]);

    const handleTrigger = (e) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.error("Please select a user.");
            return;
        }
        triggerSimulationMutation.mutate({
            member_id: selectedUser,
            planType,
            failure_code: failureCode,
            customAmount: Number(customAmount),
            error_description: errorDescription
        });
    };

    const handleRegisterPromise = (e) => {
        e.preventDefault();
        if (!promiseUser || !promiseDate || !promiseAmount) {
            toast.error("Please fill in all promise fields.");
            return;
        }
        registerPromiseMutation.mutate({
            member_id: promiseUser,
            promised_date: promiseDate,
            promised_amount: Number(promiseAmount)
        });
    };

    const getWorkflowStatusBadge = (status) => {
        if (status === 'needs_review') {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 animate-pulse uppercase tracking-wider">⚠️ Review Queue</span>;
        }
        if (status === 'processed') {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">✅ Auto Recovered</span>;
        }
        if (status === 'resolved') {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">✅ Resolved</span>;
        }
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">🔄 Pending</span>;
    };

    const getAuditActionBadge = (action) => {
        if (action === 'suppress_recovery') return 'bg-blue-50 text-blue-700 border-blue-100';
        if (action === 'escalate_to_human') return 'bg-red-50 text-red-700 border-red-100';
        if (action.startsWith('retry')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        return 'bg-purple-50 text-purple-700 border-purple-100';
    };

    if (authLoading || usersLoading) {
        return (
            <AdminLayout>
                <div className="h-full min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-10 w-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-10 w-10 bg-purple-500 items-center justify-center">
                                <Activity className="h-5 w-5 text-white animate-spin" />
                            </span>
                        </div>
                        <div className="text-sm font-bold text-purple-700 tracking-wider animate-pulse">Loading Simulator Details...</div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-8 text-left">
                {/* Header Info Banner */}
                <div className="text-left space-y-3 relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Simulator Control Center v2.0
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                                AI Revenue Recovery Control Center
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mt-1">
                                Simulate custom student payments, configure automated playbook interventions, manage Promise-to-Pay suppression timelines, and monitor recovery events in real time.
                            </p>
                        </div>
                        <a
                            href="/phone"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 text-xs uppercase tracking-wider shrink-0"
                        >
                            <span>📱 Open /phone Simulator</span>
                        </a>
                    </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { name: "Total Sim Events", count: events.length, label: "Simulated Logs", color: "border-l-4 border-purple-500" },
                        { name: "Active Promises", count: promises.filter(p => p.status === 'active').length, label: "Suppressions Active", color: "border-l-4 border-blue-500" },
                        { name: "Intervention Runs", count: auditLogs.length, label: "Automated Runs", color: "border-l-4 border-indigo-500" }
                    ].map((kpi) => (
                        <div key={kpi.name} className={`bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-300 ${kpi.color}`}>
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{kpi.name}</div>
                            <div className="text-2xl font-black text-slate-800 mt-1.5 flex items-center justify-between">
                                <span>{kpi.count}</span>
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                                    {kpi.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: TRIGGER & PROMISE FORMS */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Control Panel Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80 hover:shadow transition-all duration-300">
                            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-150 pb-3">
                                <Terminal className="h-5 w-5 text-purple-600" />
                                <span>Trigger Payment Simulation</span>
                            </h2>
                            <form onSubmit={handleTrigger} className="space-y-4 text-xs font-semibold text-slate-600">
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Target Student</label>
                                    <select
                                        value={selectedUser}
                                        onChange={(e) => {
                                            setSelectedUser(e.target.value);
                                            setPromiseUser(e.target.value);
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
                                    >
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Simulated Plan</label>
                                    <select
                                        value={planType}
                                        onChange={(e) => setPlanType(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
                                    >
                                        <option value="monthly">Monthly Plan (₹299)</option>
                                        <option value="quarterly">Quarterly Plan (₹699)</option>
                                        <option value="yearly">Yearly Plan (₹2499)</option>
                                        <option value="corporate_wellness">B2B Wellness Corporate (₹9999)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Failure Cause / Razorpay Error</label>
                                    <select
                                        value={failureCode}
                                        onChange={(e) => setFailureCode(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
                                    >
                                        <optgroup label="Standard Outcomes" className="text-slate-400">
                                            <option value="success">🟢 Success (Positive Control)</option>
                                            <option value="user_cancelled">🔴 User Cancelled (Churn - Negative Control)</option>
                                        </optgroup>
                                        <optgroup label="Razorpay Payment Decline Errors" className="text-slate-400">
                                            <option value="card_declined_insufficient_funds">Insufficient Funds (Generic Decline)</option>
                                            <option value="BAD_REQUEST_PAYMENT_DECLINED_BY_BANK">BAD_REQUEST: Declined by Bank</option>
                                            <option value="BAD_REQUEST_PAYMENT_OTP_VALIDATION_FAILED">BAD_REQUEST: OTP Validation Failed</option>
                                            <option value="BAD_REQUEST_PAYMENT_ACCOUNT_BLOCKED">BAD_REQUEST: Account Blocked</option>
                                        </optgroup>
                                        <optgroup label="Razorpay Card Validity Errors" className="text-slate-400">
                                            <option value="card_declined_expired">Card Expired (Generic Decline)</option>
                                            <option value="BAD_REQUEST_PAYMENT_CARD_EXPIRED">BAD_REQUEST: Card Expired</option>
                                            <option value="BAD_REQUEST_PAYMENT_CARD_INVALID">BAD_REQUEST: Invalid Card Details</option>
                                        </optgroup>
                                        <optgroup label="Razorpay Gateway & Network Errors" className="text-slate-400">
                                            <option value="bank_timeout">Bank Timeout (Generic Decline)</option>
                                            <option value="BAD_REQUEST_PAYMENT_TIMED_OUT">BAD_REQUEST: Transaction Timed Out</option>
                                            <option value="BAD_REQUEST_PAYMENT_GATEWAY_ERROR">BAD_REQUEST: Gateway Error</option>
                                        </optgroup>
                                        <optgroup label="Razorpay Mandate & Checkout Errors" className="text-slate-400">
                                            <option value="mandate_revoked">Mandate Revoked (Generic Decline)</option>
                                            <option value="BAD_REQUEST_PAYMENT_MANDATE_CANCELLED">BAD_REQUEST: Mandate Cancelled</option>
                                            <option value="checkout_abandoned">Checkout Abandoned (Generic Decline)</option>
                                            <option value="BAD_REQUEST_PAYMENT_CHECKOUT_ABANDONED">BAD_REQUEST: Checkout Abandoned</option>
                                            <option value="invoice_overdue">Invoice Overdue (B2B Receivable)</option>
                                            <option value="BAD_REQUEST_PAYMENT_DECLINED_BY_CUSTOMER">BAD_REQUEST: Declined by Customer</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Amount (INR)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                                            <IndianRupee size={12} />
                                        </div>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Description / Custom Error (Optional)</label>
                                    <textarea
                                        value={errorDescription}
                                        onChange={(e) => setErrorDescription(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all h-20 resize-none font-semibold"
                                        placeholder="e.g. 'Low balance', 'Expired last month'"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={triggerSimulationMutation.isPending}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 inline-flex justify-center items-center gap-1.5 focus:outline-none"
                                >
                                    {triggerSimulationMutation.isPending ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-3.5 w-3.5" />
                                            <span>Trigger Simulation</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Promise to Pay Logger Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80 hover:shadow transition-all duration-300">
                            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-150 pb-3">
                                <Handshake className="h-5 w-5 text-blue-500" />
                                <span>Record Promise-to-Pay</span>
                            </h2>
                            <form onSubmit={handleRegisterPromise} className="space-y-4 text-xs font-semibold text-slate-600">
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Select Student</label>
                                    <select
                                        value={promiseUser}
                                        onChange={(e) => setPromiseUser(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                    >
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Commitment Pay Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                                            <Calendar size={13} />
                                        </div>
                                        <input
                                            type="date"
                                            value={promiseDate}
                                            onChange={(e) => setPromiseDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wide">Promised Amount (INR)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-455">
                                            <IndianRupee size={12} />
                                        </div>
                                        <input
                                            type="number"
                                            value={promiseAmount}
                                            onChange={(e) => setPromiseAmount(e.target.value)}
                                            placeholder="e.g. 699"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={registerPromiseMutation.isPending}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 inline-flex justify-center items-center gap-1.5 focus:outline-none"
                                >
                                    {registerPromiseMutation.isPending ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin" />
                                            <span>Registering...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Handshake className="h-4 w-4" />
                                            <span>Log Pay Commitment</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EVENTS FEED, AUDITS & ACTIVE PROMISES */}
                    <div className="lg:col-span-2 space-y-8 text-left">
                        {/* Outbox event Table */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
                            <div className="flex justify-between items-center mb-5 border-b border-slate-150 pb-3">
                                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-purple-600" />
                                    <span>Outbox Event Stream</span>
                                </h2>
                                <span className="flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-150 font-bold uppercase tracking-wider">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-550 animate-ping shrink-0"></span>
                                    <span>Live listening</span>
                                </span>
                            </div>
                            {events.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 italic text-xs">No events simulated yet.</div>
                            ) : (
                                <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar pr-1">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                                        <thead className="bg-slate-50 sticky top-0 text-slate-500 z-10">
                                            <tr>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Event / Channel</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Member</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Amount / Code</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Classifier</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                                            {events.slice(0, 15).map((evt) => (
                                                <tr key={evt._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                                                        <div className="font-bold text-purple-700">{evt.event_id}</div>
                                                        <div className="mt-0.5 text-[9px] font-semibold">{evt.source === 'webhook' ? '🔌 Webhook' : '💻 Simulator'}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-800">{evt.member_id?.name || 'Unknown'}</div>
                                                        <div className="text-slate-500 text-[10px] mt-0.5">{evt.member_id?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-800">₹{evt.amount}</div>
                                                        <div className="text-[9px] text-red-600 uppercase font-bold mt-0.5 truncate max-w-[120px]">{evt.failure_code.replace(/_/g, ' ')}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        {evt.diagnosis_cause ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase text-[9px]">
                                                                    {evt.diagnosis_cause}
                                                                </span>
                                                                <span className="text-[9px] text-green-600 font-bold">{(evt.diagnosis_confidence * 100).toFixed(0)}%</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-450 italic text-[10px]">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        {getWorkflowStatusBadge(evt.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Playbook Intervention Audit Logs */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
                            <div className="flex justify-between items-center mb-5 border-b border-slate-150 pb-3">
                                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <History className="h-5 w-5 text-indigo-600" />
                                    <span>Playbook Audit Logs</span>
                                </h2>
                                <span className="flex items-center gap-1.5 text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-150 font-bold uppercase tracking-wider">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 animate-ping shrink-0"></span>
                                    <span>Auditing runs</span>
                                </span>
                            </div>
                            {auditLogs.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 italic text-xs">No interventions executed yet.</div>
                            ) : (
                                <div className="overflow-x-auto max-h-[350px] overflow-y-auto scrollbar pr-1">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                                        <thead className="bg-slate-50 sticky top-0 text-slate-500 z-10">
                                            <tr>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Student / Time</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Cause</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Action Taken</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Message Context</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Bounds & Summary</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                                            {auditLogs.slice(0, 20).map((log) => (
                                                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-800">{log.member_id?.name || 'Unknown'}</div>
                                                        <div className="text-slate-450 text-[10px] mt-0.5">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-bold text-purple-700 uppercase">
                                                        {log.cause}
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                                                            log.action === 'subscription_cancel' ? 'bg-red-50 text-red-700 border-red-100' : getAuditActionBadge(log.action)
                                                        }`}>
                                                            {log.action.replace(/_/g, ' ')}
                                                        </span>
                                                        <div className="text-[9px] text-slate-500 mt-1 font-semibold">Ch: {log.channel}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 max-w-xs">
                                                        {log.message_sent ? (
                                                            <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic leading-relaxed text-[10px] font-medium font-serif">
                                                                &quot;{log.message_sent}&quot;
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-450 italic text-[10px]">None</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-600 text-[10px] max-w-xs leading-relaxed">
                                                        <div className="font-semibold text-slate-800">{log.reasoning_summary}</div>
                                                        <div className="text-slate-450 mt-0.5 text-[9px] font-medium">{log.bound_applied}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Active Promises-to-Pay Suppressions */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/80">
                            <div className="flex justify-between items-center mb-5 border-b border-slate-150 pb-3">
                                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Handshake className="h-5 w-5 text-blue-500" />
                                    <span>Active Promise-to-Pay Suppressions</span>
                                </h2>
                            </div>
                            {promises.length === 0 ? (
                                <div className="text-center py-12 text-slate-450 italic text-xs">No suppressions logged.</div>
                            ) : (
                                <div className="overflow-x-auto max-h-[220px] overflow-y-auto scrollbar pr-1">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                                        <thead className="bg-slate-50 sticky top-0 text-slate-500 z-10">
                                            <tr>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Student</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Promised Date</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Amount</th>
                                                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px] text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                                            {promises.map((ptp) => (
                                                <tr key={ptp._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-bold text-slate-800">{ptp.member_id?.name || 'Unknown'}</div>
                                                        <div className="text-slate-500 text-[10px] mt-0.5">{ptp.member_id?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-bold text-slate-850">
                                                        {new Date(ptp.promised_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-4 py-3.5 font-black text-blue-600">
                                                        ₹{ptp.promised_amount}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                                                            ptp.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        }`}>
                                                            {ptp.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSimulator;
