import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { apiFetch } from '../utils/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { 
    TrendingUp, 
    AlertTriangle, 
    Zap, 
    CheckCircle, 
    Mail, 
    UserCheck, 
    RefreshCw, 
    DollarSign, 
    Percent, 
    MessageSquare,
    Layers,
    Lightbulb,
    FileText,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const RecoveryDashboard = () => {
    const { isAdmin, IsLogin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Check authorization redirect
    useEffect(() => {
        if (!authLoading && (!IsLogin || !isAdmin)) {
            toast.error("Access denied. Admin role required.");
            navigate("/login");
        }
    }, [IsLogin, isAdmin, authLoading, navigate]);

    const [dataSource, setDataSource] = useState('simulation');
    const [activeTab, setActiveTab] = useState('analytics');

    // Fetch latest metrics using TanStack useQuery
    const { data: latestBatchResponse, isLoading: latestBatchLoading, refetch } = useQuery({
        queryKey: ['latestBatchSimulation', dataSource],
        queryFn: async () => {
            const url = dataSource === 'live'
                ? "/payforevent/batch/live"
                : "/payforevent/batch/latest";
            const res = await apiFetch(url);
            if (!res.ok) throw new Error(`Failed to load ${dataSource} statistics`);
            return res.json();
        },
        enabled: IsLogin && isAdmin // Only load if logged in admin
    });

    const batchData = latestBatchResponse?.data || null;

    // Fetch escalation queue items
    const { data: escalationsResponse, isLoading: escalationsLoading, refetch: refetchEscalations } = useQuery({
        queryKey: ['escalationsList'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/escalations");
            if (!res.ok) throw new Error("Failed to load escalations");
            return res.json();
        },
        enabled: IsLogin && isAdmin
    });

    const escalations = escalationsResponse?.escalations || [];

    // Fetch proactive risks query
    const { data: proactiveResponse, isLoading: proactiveLoading, refetch: refetchProactive } = useQuery({
        queryKey: ['proactiveRisks'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/proactive/scan");
            if (!res.ok) throw new Error("Failed to scan proactive risks");
            return res.json();
        },
        enabled: IsLogin && isAdmin
    });
    const proactiveRisks = proactiveResponse?.risks || [];

    // Proactive nudge dispatch mutation
    const proactiveNudgeMutation = useMutation({
        mutationFn: async ({ userId }) => {
            const res = await apiFetch("/payforevent/proactive/nudge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            if (!res.ok) throw new Error("Failed to dispatch nudge");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Proactive warning nudge email dispatched!");
            refetchProactive();
            refetch(); // Refresh KPI metrics
        },
        onError: (err) => toast.error(err.message)
    });

    // Fetch Gemini AI playbook recommendations
    const { data: suggestionsData, isLoading: suggestionsLoading, refetch: refetchSuggestions } = useQuery({
        queryKey: ['playbookSuggestions'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/playbook/optimize-suggestions");
            if (!res.ok) throw new Error("Failed to load AI suggestions");
            return res.json();
        },
        enabled: IsLogin && isAdmin
    });

    const suggestionsText = suggestionsData?.suggestions || '';

    // Apply Gemini recommendations mutation
    const applySuggestionsMutation = useMutation({
        mutationFn: async (playbooksArray) => {
            const res = await apiFetch("/payforevent/playbook/apply-optimization", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playbooks: playbooksArray })
            });
            if (!res.ok) throw new Error("Failed to apply playbook optimization");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Gemini AI playbook recommendations applied successfully!");
                refetchSuggestions();
            } else {
                toast.error(data.msg || "Failed to apply changes.");
            }
        },
        onError: (err) => toast.error(err.message)
    });

    const extractPlaybookConfig = (markdown) => {
        try {
            if (!markdown) return null;
            const match = markdown.match(/```json([\s\S]*?)```/);
            if (match && match[1]) {
                return JSON.parse(match[1].trim());
            }
            const rawMatch = markdown.match(/\[\s*\{[\s\S]*?\}\s*\]/);
            if (rawMatch) {
                return JSON.parse(rawMatch[0].trim());
            }
        } catch (e) {
            console.error("Error parsing playbook config from markdown:", e);
        }
        return null;
    };

    const parsedPlaybooks = extractPlaybookConfig(suggestionsText);

    // Resolve mutation
    const resolveMutation = useMutation({
        mutationFn: async ({ eventId, notes }) => {
            const res = await apiFetch("/payforevent/escalations/resolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, notes })
            });
            if (!res.ok) throw new Error("Failed to resolve event");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Billing escalation marked as manually resolved!");
            refetchEscalations();
            refetch();
        },
        onError: (err) => toast.error(err.message)
    });

    // Send discount offer mutation
    const discountMutation = useMutation({
        mutationFn: async ({ eventId, discountPercent }) => {
            const res = await apiFetch("/payforevent/escalations/discount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, discountPercent })
            });
            if (!res.ok) throw new Error("Failed to send discount offer");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Discount offer dispatched via email and escalation resolved!");
            refetchEscalations();
            refetch();
        },
        onError: (err) => toast.error(err.message)
    });

    // Run batch simulation mutation using TanStack useMutation
    const runBatchMutation = useMutation({
        mutationFn: async () => {
            toast.info("Running scale recovery simulation for 120 subscribers...");
            const res = await fetch("http://localhost:3000/payforevent/batch/run", {
                method: "POST",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Batch execution request failed");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Harness scale batch completed!");
                refetch();
            } else {
                toast.error(data.msg || "Batch run failed.");
            }
        },
        onError: (err) => {
            toast.error(`Error executing simulation cohort: ${err.message}`);
        }
    });

    const handleRunBatch = () => {
        runBatchMutation.mutate();
    };

    if (authLoading || latestBatchLoading) {
        return (
            <AdminLayout>
                <div className="h-full min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-10 w-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-10 w-10 bg-purple-500 items-center justify-center">
                                <RefreshCw className="h-5 w-5 text-white animate-spin" />
                            </span>
                        </div>
                        <div className="text-sm font-bold text-purple-700 tracking-wider animate-pulse">Loading Recovery Dashboard...</div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Prepare chart data if batch data is loaded
    const barChartData = [];
    const pieChartData = [];
    const COLORS = ['#9333ea', '#4f46e5', '#d97706', '#ea580c', '#65a30d', '#16a34a', '#0891b2'];

    if (batchData && batchData.metrics_by_cause) {
        Object.keys(batchData.metrics_by_cause).forEach((key, index) => {
            const m = batchData.metrics_by_cause[key];
            const rate = m.total > 0 ? Number(((m.recovered / m.total) * 100).toFixed(0)) : 0;
            
            barChartData.push({
                name: key.replace(/_/g, ' ').toUpperCase(),
                'Recovery Rate %': rate,
                'Total Declines': m.total,
                'Saved': m.recovered
            });

            pieChartData.push({
                name: key.replace(/_/g, ' ').toUpperCase(),
                value: m.total,
                color: COLORS[index % COLORS.length]
            });
        });
    }

    // Funnel Steps
    const totalRecovered = batchData && batchData.metrics_by_cause 
        ? Object.keys(batchData.metrics_by_cause).reduce((acc, key) => acc + (batchData.metrics_by_cause[key].recovered || 0), 0)
        : 0;

    const funnelSteps = [
        { name: "Failures Detected", value: batchData?.total_subscribers || 0, desc: dataSource === 'live' ? "Live failed events" : "Seeded synthetic failures", color: "from-purple-900 to-purple-600" },
        { name: "Diagnosed Failures", value: batchData?.total_subscribers || 0, desc: "AI categorized cause", color: "from-purple-600 to-indigo-600" },
        { name: "Gated Interventions", value: batchData ? batchData.total_subscribers - (batchData.exceptions ? batchData.exceptions.filter(e => e.status === 'ptp_suppressed').length : 0) : 0, desc: "PTP suppressed count", color: "from-indigo-600 to-indigo-500" },
        { name: "Revenue Recovered", value: totalRecovered, desc: "Saved premium profiles", color: "from-emerald-600 to-emerald-500" }
    ];

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-8 text-left">
                {/* Control Panel Header Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="space-y-3 z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                            {dataSource === 'live' ? "Production Live Streams" : "Active Simulation Harness"}
                        </div>
                        
                        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                            {dataSource === 'live' ? "Live Webhook Analytics" : "Scale Recovery Analytics"}
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {dataSource === 'live' 
                                ? "Monitor live real-time payment webhook declines and recover revenue using custom recovery playbooks and AI voice diagnostics."
                                : "Simulate and monitor recovery efficiency across 120+ synthetic student profiles with custom playbooks, WhatsApp Hinglish chat interventions, and B2B corporate billing."}
                        </p>
                        
                        {/* Data Source Toggle Switch */}
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-fit mt-2">
                            <button
                                onClick={() => setDataSource('simulation')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all duration-350 ${dataSource === 'simulation' ? 'bg-white text-purple-700 shadow-sm border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Simulation Metrics
                            </button>
                            <button
                                onClick={() => setDataSource('live')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all duration-350 ${dataSource === 'live' ? 'bg-white text-purple-700 shadow-sm border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                Live Webhooks
                            </button>
                        </div>
                    </div>
                    
                    {dataSource === 'simulation' && (
                        <div className="flex flex-wrap items-center gap-3 z-10">
                            <a
                                href="/phone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 font-bold py-3.5 px-5 rounded-xl border border-indigo-700/60 transition-all duration-300 shadow-sm flex items-center gap-2 text-xs uppercase tracking-wider"
                            >
                                <span>📱 Open /phone Simulator</span>
                            </a>
                            <button
                                onClick={handleRunBatch}
                                disabled={runBatchMutation.isPending}
                                className="relative overflow-hidden group bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2 text-xs uppercase tracking-wider"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                {runBatchMutation.isPending ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                        <span>Evaluating Cohort...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 text-yellow-300 animate-bounce" />
                                        <span>Run Scale Simulation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-slate-200 gap-6">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 flex items-center gap-2 relative ${
                            activeTab === 'analytics' 
                                ? 'border-purple-600 text-purple-700' 
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <TrendingUp size={16} />
                        <span>Recovery Analytics</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('escalations')}
                        className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 flex items-center gap-2 relative ${
                            activeTab === 'escalations' 
                                ? 'border-purple-600 text-purple-700' 
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <AlertTriangle size={16} />
                        <span>Escalation Queue</span>
                        {escalations.length > 0 && (
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full text-[9px] font-black h-4 w-4 bg-red-500 text-white items-center justify-center">
                                    {escalations.length}
                                </span>
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('proactive');
                            refetchProactive();
                        }}
                        className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 flex items-center gap-2 relative ${
                            activeTab === 'proactive' 
                                ? 'border-purple-600 text-purple-700' 
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        <Sparkles size={16} className={activeTab === 'proactive' ? 'text-purple-600 animate-spin' : ''} />
                        <span>Proactive Predictor</span>
                    </button>
                </div>

                {activeTab === 'analytics' ? (
                    !batchData ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
                            <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
                                <FileText size={20} />
                            </div>
                            <p className="text-base text-slate-800 font-bold">No {dataSource} data available.</p>
                            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                                {dataSource === 'simulation' 
                                    ? "Run the 120-subscriber batch test cohort above to visualize system recovery conversion rates and analytics."
                                    : "Waiting for student payment webhook triggers. Webhook event charts will populate once received."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* KPI Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                {[
                                    { name: "Revenue at Risk", val: `₹${batchData.revenue_at_risk.toLocaleString()}`, color: "text-purple-700", border: "border-l-4 border-purple-500", desc: "Cohort billing declines", icon: DollarSign },
                                    { name: "Recovered Revenue", val: `₹${batchData.revenue_recovered.toLocaleString()}`, color: "text-emerald-700", border: "border-l-4 border-emerald-500", desc: "Saved premium fees", icon: CheckCircle },
                                    { name: "Recovery Efficiency", val: `${batchData.recovery_rate_percent}%`, color: "text-amber-700", border: "border-l-4 border-amber-500", desc: "Playbook conversion", icon: Percent },
                                    { name: "Messaging Costs", val: `₹${batchData.false_positive_cost.toLocaleString()}`, color: "text-orange-700", border: "border-l-4 border-orange-500", desc: "WhatsApp & email outbox (₹5/msg)", icon: MessageSquare },
                                    { name: "Proactive Saved", val: `₹${(batchData.proactive_revenue_saved || 0).toLocaleString()}`, color: "text-indigo-700", border: "border-l-4 border-indigo-500", desc: "AI Predictor prevented", icon: Sparkles }
                                ].map((kpi) => {
                                    const Icon = kpi.icon;
                                    return (
                                        <div key={kpi.name} className={`bg-white border border-slate-200/80 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow ${kpi.border} group`}>
                                            <div className="flex justify-between items-start">
                                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{kpi.name}</div>
                                                <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                            </div>
                                            <div className={`text-2xl font-black mt-2 tracking-tight ${kpi.color}`}>{kpi.val}</div>
                                            <div className="text-slate-500 text-[10px] mt-1 font-medium">{kpi.desc}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chart Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Bar Chart: Conversion rates */}
                                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                    <div className="mb-4">
                                        <h2 className="text-base font-bold text-slate-800">Playbook Recovery Rates by Decline Cause</h2>
                                        <p className="text-[10px] text-slate-500">Categorized efficiency percentages across simulated failure causes.</p>
                                    </div>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#475569', fontSize: 9 }} />
                                                <YAxis unit="%" stroke="#64748b" tick={{ fill: '#475569', fontSize: 9 }} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: '12px' }}
                                                    labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                                />
                                                <Bar dataKey="Recovery Rate %" fill="#9333ea" radius={[4, 4, 0, 0]}>
                                                    {barChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Pie Chart: Decline Category Distribution */}
                                <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                    <div className="mb-4">
                                        <h2 className="text-base font-bold text-slate-800">Decline Cause Distribution</h2>
                                        <p className="text-[10px] text-slate-500">Decline event groupings mapped by system classifiers.</p>
                                    </div>
                                    <div className="h-56 flex items-center justify-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={75}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#1e293b' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-2 mt-4 max-h-[120px] overflow-y-auto pr-1 scrollbar">
                                        {pieChartData.map((entry) => (
                                            <div key={entry.name} className="flex justify-between items-center text-[10px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                                                    <span className="text-slate-600 font-semibold truncate max-w-[150px]">{entry.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-800 shrink-0">{entry.value} Cases</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Funnel + Rule Performance Loop Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Visual Recovery Funnel */}
                                <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Layers className="h-5 w-5 text-purple-600" />
                                        <h2 className="text-base font-bold text-slate-800">Structured Recovery Funnel</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {funnelSteps.map((step, idx) => (
                                            <div key={step.name} className="relative">
                                                <div className={`p-4 bg-gradient-to-r ${step.color} text-white rounded-xl flex justify-between items-center shadow border border-white/10 relative overflow-hidden group`}>
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="z-10">
                                                        <div className="font-black text-xs uppercase tracking-wide">{step.name}</div>
                                                        <div className="text-[9px] text-purple-100 mt-0.5 font-semibold">{step.desc}</div>
                                                    </div>
                                                    <div className="text-xl font-black z-10 font-mono">{step.value}</div>
                                                </div>
                                                {idx < funnelSteps.length - 1 && (
                                                    <div className="w-full flex justify-center py-0.5">
                                                        <ArrowRight size={14} className="text-slate-350 rotate-90" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Recovery Playbook Optimizations / Insights */}
                                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
                                                <h2 className="text-base font-bold text-slate-800">LLM Playbook Optimizer (Gemini AI)</h2>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => refetchSuggestions()}
                                                className="text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 font-bold px-2.5 py-1 rounded-md transition-all focus:outline-none"
                                            >
                                                Regenerate
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400">
                                            AI-powered recommendations trained on cohort conversion metrics to optimize rule triggers.
                                        </p>
                                    </div>

                                    {suggestionsLoading ? (
                                        <div className="flex-1 flex items-center justify-center py-10">
                                            <div className="text-center">
                                                <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                                <span className="text-[10px] font-semibold text-slate-400">Analyzing statistics...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col justify-between mt-4 gap-4">
                                            {/* Render recommendations body */}
                                            <div className="text-left text-[11px] leading-relaxed text-slate-655 bg-slate-50 border border-slate-200 p-4 max-h-[220px] overflow-y-auto scrollbar rounded-xl">
                                                <div className="prose prose-sm max-w-none">
                                                    {suggestionsText
                                                        .replace(/```json[\s\S]*?```/g, '') // Strip JSON block
                                                        .split('\n')
                                                        .map((line, idx) => {
                                                            if (line.startsWith('###')) {
                                                                return <h3 key={idx} className="text-xs font-bold text-slate-850 mt-3 mb-1.5">{line.replace('###', '').trim()}</h3>;
                                                            }
                                                            if (line.startsWith('*') || line.startsWith('-')) {
                                                                return <li key={idx} className="ml-4 list-disc text-slate-600 font-medium">{line.replace(/^[* -]\s*/, '').trim()}</li>;
                                                            }
                                                            if (line.trim() === '') return <div key={idx} className="h-2"></div>;
                                                            return <p key={idx} className="mb-1 font-medium">{line}</p>;
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            {/* Apply Suggestion Action */}
                                            {parsedPlaybooks ? (
                                                <button
                                                    onClick={() => applySuggestionsMutation.mutate(parsedPlaybooks)}
                                                    disabled={applySuggestionsMutation.isPending}
                                                    className="w-full bg-gradient-to-r from-purple-750 to-indigo-755 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-1.5 focus:outline-none"
                                                >
                                                    {applySuggestionsMutation.isPending ? (
                                                        <>
                                                            <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></div>
                                                            <span>Applying Playbooks...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles size={14} />
                                                            <span>Apply Gemini AI Suggestions ({parsedPlaybooks.length} Rules)</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-center gap-1 font-semibold justify-center">
                                                    <span>⚠️</span>
                                                    <span>Playbook configuration block not found in LLM response.</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* System Exceptions & Corporate Wellness Table */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-left overflow-hidden">
                                <div className="mb-4">
                                    <h2 className="text-base font-bold text-slate-800">Simulation Exception Logs & B2B Receivables</h2>
                                    <p className="text-[10px] text-slate-500">Audit logs tracking active playbooks, billing status changes, and corporate contracts.</p>
                                </div>
                                <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar pr-1">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                                        <thead className="bg-slate-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Student Name</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billing Email</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Trigger Event</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Intervention Summary Details</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {(!batchData.exceptions || batchData.exceptions.length === 0) ? (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-12 text-center text-slate-400 italic">
                                                        No exception logs recorded for this data source.
                                                    </td>
                                                </tr>
                                            ) : (
                                                batchData.exceptions.map((ex, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-3.5 font-bold text-slate-800">{ex.member_name}</td>
                                                        <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">{ex.member_email}</td>
                                                        <td className="px-4 py-3.5">
                                                            <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-100 uppercase text-[9px]">
                                                                {ex.cause}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5 text-slate-550 text-[11px] leading-relaxed max-w-sm">{ex.reason}</td>
                                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                                                                ex.status === 'escalated' ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' :
                                                                ex.status === 'ptp_suppressed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                                {ex.status.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )
                ) : activeTab === 'escalations' ? (
                    /* Escalation Queue Tab Content */
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-left">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">Escalated Interventions</h2>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        These accounts have exhausted automatic AI playbooks or have low confidence scores. Human intervention is required.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => refetchEscalations()}
                                    className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-xs font-bold transition-all border border-purple-100 flex items-center gap-1.5 focus:outline-none"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    <span>Refresh Queue</span>
                                </button>
                            </div>

                            {escalationsLoading ? (
                                <div className="text-center py-16 text-slate-400 animate-pulse font-medium text-xs">
                                    Loading Escalations Queue...
                                </div>
                            ) : escalations.length === 0 ? (
                                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <div className="text-3xl mb-3">🎉</div>
                                    <h3 className="font-bold text-slate-800 text-sm">All Clear!</h3>
                                    <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto">
                                        No billing events are currently escalated. Automated recovery loops are operating within parameters.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                                        <thead className="bg-slate-55">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Customer details</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billing Cause</th>
                                                <th className="px-4 py-3 font-bold text-slate-550 uppercase tracking-wider text-[10px]">At Risk</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Diagnostics Reasoning</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {escalations.map((esc) => (
                                                <tr key={esc._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{esc.member_id?.name || 'Unknown User'}</div>
                                                        <div className="text-slate-500 font-mono text-[10px] mt-0.5">{esc.member_id?.email || 'N/A'}</div>
                                                        <div className="text-[9px] text-slate-400 mt-1 font-semibold">Retries: {esc.retry_count} | Source: {esc.source}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-100 uppercase text-[9px]">
                                                            {esc.diagnosis_cause?.replace(/_/g, ' ') || esc.failure_code}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-slate-800">₹{esc.amount}</td>
                                                    <td className="px-4 py-4 max-w-xs text-slate-600 leading-relaxed text-[10px]">
                                                        <div>Confidence: <span className="font-bold text-slate-800">{esc.diagnosis_confidence * 100}%</span></div>
                                                        <div className="mt-1 italic text-slate-400">&quot;{esc.diagnosis_reasoning || 'No details'}&quot;</div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                const percent = prompt("Enter discount percentage to offer (e.g. 15, 20):", "15");
                                                                if (percent) {
                                                                    discountMutation.mutate({ eventId: esc._id, discountPercent: percent });
                                                                }
                                                            }}
                                                            disabled={discountMutation.isPending}
                                                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-all disabled:opacity-50 inline-flex items-center gap-1 focus:outline-none"
                                                        >
                                                            <Mail size={12} />
                                                            <span>Send Discount</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const notes = prompt("Enter manual override resolution notes:", "Card issue resolved after manual client contact.");
                                                                if (notes) {
                                                                    resolveMutation.mutate({ eventId: esc._id, notes });
                                                                }
                                                            }}
                                                            disabled={resolveMutation.isPending}
                                                            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] transition-all disabled:opacity-50 inline-flex items-center gap-1 focus:outline-none"
                                                        >
                                                            <UserCheck size={12} />
                                                            <span>Resolve</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Proactive AI Predictor Tab Content */
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-left animate-fadeIn">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-slate-150 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-indigo-650" />
                                        <span>Proactive Interventions (AI Predictor)</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        Scan and audit active subscriber records facing high probability churn due to card expiration or inactivity.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => refetchProactive()}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-755 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all border border-indigo-150 flex items-center gap-1.5 focus:outline-none shrink-0"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    <span>Run Prediction Scan</span>
                                </button>
                            </div>

                            {proactiveLoading ? (
                                <div className="text-center py-16 text-slate-400 animate-pulse font-medium text-xs">
                                    Running Predictive Churn Scan...
                                </div>
                            ) : proactiveRisks.length === 0 ? (
                                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <div className="text-3xl mb-3">🛡️</div>
                                    <h3 className="font-bold text-slate-800 text-sm">No Churn Threats Detected</h3>
                                    <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto">
                                        All user credentials are active and healthy. Card expiries and login patterns are within baseline bounds.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Student Details</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Plan Type</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Churn Risk Factor</th>
                                                <th className="px-4 py-3 font-bold text-slate-550 uppercase tracking-wider text-[10px]">Alert Details</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {proactiveRisks.map((risk) => (
                                                <tr key={risk._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{risk.name}</div>
                                                        <div className="text-slate-500 font-mono text-[10px] mt-0.5">{risk.email}</div>
                                                        <div className="text-[9px] text-slate-400 mt-1 font-semibold">Phone: {risk.phone}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-100 uppercase text-[9px]">
                                                            {risk.plan}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-100 uppercase text-[9px] animate-pulse">
                                                            ⚠️ {risk.reason}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600 font-semibold text-[10px]">
                                                        {risk.details}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => proactiveNudgeMutation.mutate({ userId: risk._id })}
                                                            disabled={proactiveNudgeMutation.isPending}
                                                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-lg text-[10px] transition-all disabled:opacity-50 inline-flex items-center gap-1.5 focus:outline-none"
                                                        >
                                                            <Mail size={12} />
                                                            <span>Send Proactive Warning</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RecoveryDashboard;
