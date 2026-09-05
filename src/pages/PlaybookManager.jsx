import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import {
    Plus,
    Trash2,
    Sliders,
    MessageSquare,
    Save,
    Tag,
    Clock,
    PhoneCall,
    Mail,
    AlertCircle
} from 'lucide-react';

const PlaybookManager = () => {
    const { isAdmin, IsLogin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Fields for current editing playbook cause
    const [causeName, setCauseName] = useState('');
    const [errorCodes, setErrorCodes] = useState([]);
    const [newErrorCode, setNewErrorCode] = useState('');
    const [actions, setActions] = useState([]);
    const [maxRetries, setMaxRetries] = useState(0);
    const [maxNudges, setMaxNudges] = useState(0);

    // Fetch playbook list using TanStack useQuery
    const { data: playbooksData, isLoading: playbooksLoading, refetch } = useQuery({
        queryKey: ['playbooksList'],
        queryFn: async () => {
            const res = await apiFetch("/payforevent/playbook");
            if (!res.ok) throw new Error("Failed to load playbooks");
            return res.json();
        },
        enabled: IsLogin && isAdmin // Only run if user is logged in admin
    });

    const playbooks = playbooksData?.playbooks || [];

    const selectPlaybook = (pb) => {
        setCauseName(pb.cause);
        setErrorCodes(pb.error_codes || []);
        setActions(pb.actions || []);
        setMaxRetries(pb.max_retries || 0);
        setMaxNudges(pb.max_nudges || 0);
    };

    // Keep state in sync with first playbook on load
    useEffect(() => {
        if (playbooks.length > 0 && !causeName) {
            selectPlaybook(playbooks[0]);
        }
    }, [playbooks, causeName]);

    // Handle authentication redirect
    useEffect(() => {
        if (!authLoading && (!IsLogin || !isAdmin)) {
            toast.error("Access denied. Admin role required.");
            navigate("/login");
        }
    }, [IsLogin, isAdmin, authLoading, navigate]);

    // Update rules mutation using TanStack useMutation
    const updatePlaybookMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await apiFetch("/payforevent/playbook/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Network request failed");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(`Playbook rules for ${causeName} updated!`);
                refetch();
            } else {
                toast.error(data.msg || "Save settings failed.");
            }
        },
        onError: (err) => {
            toast.error(`Error saving: ${err.message}`);
        }
    });

    // Handle adding raw error codes grouping
    const handleAddErrorCode = (e) => {
        e.preventDefault();
        const code = newErrorCode.trim();
        if (code && !errorCodes.includes(code)) {
            setErrorCodes([...errorCodes, code]);
            setNewErrorCode('');
        }
    };

    // Remove raw error code tag
    const handleRemoveErrorCode = (code) => {
        setErrorCodes(errorCodes.filter(c => c !== code));
    };

    // Append action step in playbook timeline
    const handleAddStep = () => {
        const newStep = {
            type: 'nudge',
            channel: 'whatsapp',
            delay: '1m',
            message_type: 'hinglish',
            include_update_link: false,
            include_reauth_link: false
        };
        setActions([...actions, newStep]);
    };

    // Update step parameters in real-time
    const handleUpdateStep = (index, key, value) => {
        const updated = actions.map((act, i) => {
            if (i === index) {
                return { ...act, [key]: value };
            }
            return act;
        });
        setActions(updated);
    };

    // Delete step from playbook sequence
    const handleDeleteStep = (index) => {
        setActions(actions.filter((_, i) => i !== index));
    };

    // Save playbook settings to DB
    const handleSave = (e) => {
        e.preventDefault();
        updatePlaybookMutation.mutate({
            cause: causeName,
            error_codes: errorCodes,
            actions: actions,
            max_retries: maxRetries,
            max_nudges: maxNudges
        });
    };

    const getChannelIcon = (ch) => {
        switch (ch) {
            case 'vapi': return PhoneCall;
            case 'email': return Mail;
            case 'whatsapp': return MessageSquare;
            default: return Clock;
        }
    };

    if (authLoading || playbooksLoading) {
        return (
            <AdminLayout>
                <div className="h-full min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex h-10 w-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-10 w-10 bg-purple-500 items-center justify-center">
                                <Sliders className="h-5 w-5 text-white animate-spin" />
                            </span>
                        </div>
                        <div className="text-sm font-bold text-purple-700 tracking-wider animate-pulse">Loading Playbook Settings...</div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-8 text-left">
                {/* Header Information Banner */}
                <div className="text-left space-y-3 relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Rule Engine Configuration
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                        Billing Recovery Playbook Editor
                    </h1>
                    <p className="text-slate-505 text-sm leading-relaxed max-w-3xl">
                        Dynamic rule engine configuration. Group raw transaction decline codes and sequence multi-channel retry nudges to optimize your recovery process.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT BAR: LIST OF PLAYBOOK GROUPS */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                            <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Playbook Groups</h2>
                            <div className="space-y-3">
                                {playbooks.map((pb) => {
                                    const isActive = pb.cause === causeName;
                                    return (
                                        <button
                                            key={pb._id}
                                            type="button"
                                            onClick={() => selectPlaybook(pb)}
                                            className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 border font-semibold text-xs relative ${
                                                isActive
                                                    ? 'bg-purple-900 text-white border-purple-900 shadow'
                                                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600 hover:text-slate-800'
                                            }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-yellow-400 rounded-r"></div>
                                            )}
                                            <span className="uppercase tracking-wide font-black block truncate">
                                                👑 {pb.cause.replace(/_/g, ' ')}
                                            </span>
                                            <div className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-purple-200' : 'text-slate-400'}`}>
                                                Steps: {pb.actions.length} | Codes: {pb.error_codes.length}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BAR: PLAYBOOK EDITOR PANEL */}
                    <div className="lg:col-span-3">
                        {causeName ? (
                            <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
                                {/* Title Block */}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                                            {causeName.replace(/_/g, ' ')}
                                        </h2>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Configure target triggers and sequential nudges for this decline category.</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updatePlaybookMutation.isPending}
                                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5 focus:outline-none shrink-0 w-fit"
                                    >
                                        {updatePlaybookMutation.isPending ? (
                                            <>
                                                <span className="h-3 w-3 animate-spin border-2 border-white border-t-transparent rounded-full shrink-0"></span>
                                                <span>Saving Config...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>Save Settings</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* 1. Raw Error Codes Grouping */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        <Tag size={14} className="text-purple-600" />
                                        <span>Grouped Raw Error Codes</span>
                                    </div>
                                    <p className="text-[10px] text-slate-450 leading-relaxed">
                                        Map raw payment gateway status decline strings to trigger this playbook rule sequence automatically.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] items-center">
                                        {errorCodes.length === 0 ? (
                                            <span className="text-slate-400 text-xs italic font-medium px-2">No transaction codes mapped yet. Add below.</span>
                                        ) : (
                                            errorCodes.map((code) => (
                                                <span
                                                    key={code}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-bold font-mono"
                                                >
                                                    {code}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveErrorCode(code)}
                                                        className="text-purple-500 hover:text-purple-300 font-bold focus:outline-none pl-1 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newErrorCode}
                                            onChange={(e) => setNewErrorCode(e.target.value)}
                                            placeholder="e.g. BAD_REQUEST_PAYMENT_DECLINED_BY_BANK"
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddErrorCode}
                                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 rounded-xl text-xs transition-all focus:outline-none uppercase tracking-wider"
                                        >
                                            ＋ Add
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Playbook Limits / Guardrails */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b border-slate-150 py-5">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Max Retry Bound</label>
                                        <p className="text-[9px] text-slate-450 mb-2">Total automated card retry limit bounds before escalation.</p>
                                        <input
                                            type="number"
                                            value={maxRetries}
                                            onChange={(e) => setMaxRetries(Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Max Nudges Bound</label>
                                        <p className="text-[9px] text-slate-455 mb-2">Total outbound notification alert bounds before silencing.</p>
                                        <input
                                            type="number"
                                            value={maxNudges}
                                            onChange={(e) => setMaxNudges(Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* 3. Action Sequence Timeline Builder */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                            <Clock size={14} className="text-indigo-600" />
                                            <span>Recovery Action Sequence Timeline</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddStep}
                                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1.5 px-4 rounded-xl text-xs border border-indigo-100 transition-all flex items-center gap-1 focus:outline-none"
                                        >
                                            <Plus size={14} />
                                            <span>Add Step</span>
                                        </button>
                                    </div>

                                    {actions.length === 0 ? (
                                        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs italic font-medium">
                                            No steps configured. All events of this cause will bypass default nudges.
                                        </div>
                                    ) : (
                                        <div className="space-y-4 relative pl-3 border-l border-slate-200 ml-3">
                                            <AnimatePresence initial={false}>
                                                {actions.map((act, index) => {
                                                    const StepIcon = getChannelIcon(act.channel);
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 10 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 relative group"
                                                        >
                                                            {/* Timeline connector circle node */}
                                                            <div className="absolute -left-[21px] top-6 bg-white border border-slate-200 text-purple-700 font-bold h-6 w-6 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                                                                <StepIcon className="h-3 w-3" />
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 text-xs">
                                                                <div className="space-y-1">
                                                                    <label className="block font-bold text-slate-400 text-[10px] uppercase">Action Type</label>
                                                                    <select
                                                                        value={act.type}
                                                                        onChange={(e) => handleUpdateStep(index, 'type', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
                                                                    >
                                                                        <option value="nudge">💬 Nudge Alert</option>
                                                                        <option value="retry">🔄 Card Retry</option>
                                                                        <option value="cancel">❌ Cancel Acc</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="block font-bold text-slate-400 text-[10px] uppercase">Channel</label>
                                                                    <select
                                                                        value={act.channel}
                                                                        onChange={(e) => handleUpdateStep(index, 'channel', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
                                                                    >
                                                                        <option value="whatsapp">WhatsApp Chat</option>
                                                                        <option value="email">Email Alert</option>
                                                                        <option value="sms">SMS Text</option>
                                                                        <option value="vapi">📞 Vapi Call</option>
                                                                        <option value="system">Silent System</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="block font-bold text-slate-400 text-[10px] uppercase">Delay</label>
                                                                    <input
                                                                        type="text"
                                                                        value={act.delay || ''}
                                                                        onChange={(e) => handleUpdateStep(index, 'delay', e.target.value)}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
                                                                        placeholder="e.g., 1m, 2m, 3m"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="block font-bold text-slate-400 text-[10px] uppercase">Language Template</label>
                                                                    <select
                                                                        value={act.message_type}
                                                                        onChange={(e) => handleUpdateStep(index, 'message_type', e.target.value)}
                                                                        disabled={act.type === 'retry'}
                                                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                    >
                                                                        <option value="english">English Template</option>
                                                                        <option value="hinglish">Hinglish Natural</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            {/* Checkbox settings */}
                                                            {act.type === 'nudge' && (
                                                                <div className="flex flex-row md:flex-col gap-3 md:gap-1 text-[10px] text-slate-500 font-semibold md:min-w-[110px] justify-start text-left pt-2 md:pt-0">
                                                                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={act.include_update_link || false}
                                                                            onChange={(e) => handleUpdateStep(index, 'include_update_link', e.target.checked)}
                                                                            className="rounded bg-white border-slate-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                                                                        />
                                                                        <span>Include Link</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={act.include_reauth_link || false}
                                                                            onChange={(e) => handleUpdateStep(index, 'include_reauth_link', e.target.checked)}
                                                                            className="rounded bg-white border-slate-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                                                                        />
                                                                        <span>Include Reauth</span>
                                                                    </label>
                                                                </div>
                                                            )}

                                                            {/* Delete Step Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteStep(index)}
                                                                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2.5 rounded-xl transition-all focus:outline-none self-end md:self-center"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
                                <AlertCircle size={32} className="mx-auto text-slate-400 mb-4" />
                                <h3 className="font-bold text-slate-800 text-sm">No Playbook Selected</h3>
                                <p className="text-[10px] text-slate-500 mt-1">Select a playbook cause from the sidebar column to initialize the editor panel.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PlaybookManager;
