import { useState, useEffect, useRef } from 'react';
import { 
    Phone, PhoneOff, PhoneCall, Mic, MicOff, Volume2, VolumeX, 
    Play, ShieldAlert, Sparkles, MessageSquare, CheckCircle2,
    User, RefreshCw, Smartphone, Zap
} from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { API_BASE_URL } from '../utils/api';

const API_BASE = API_BASE_URL;

const PhoneSimulator = () => {
    const [callState, setCallState] = useState('idle'); // 'idle', 'ringing', 'connected', 'ended'
    const [activeCallData, setActiveCallData] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const [vapiInstance, setVapiInstance] = useState(null);

    // Call metrics & controls
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingEntity, setSpeakingEntity] = useState(null); // 'assistant' | 'user'

    // Transcript & logs
    const [transcripts, setTranscripts] = useState([]);
    const [toolEvents, setToolEvents] = useState([]);
    const [statusMessage, setStatusMessage] = useState('Listening for incoming calls from recovery backend...');

    // Manual test trigger options
    const [testName, setTestName] = useState('Rahul Sharma');
    const [testCause, setTestCause] = useState('checkout_abandoned');
    const [testAmount, setTestAmount] = useState(999);
    const [isTriggering, setIsTriggering] = useState(false);

    const timerRef = useRef(null);
    const transcriptContainerRef = useRef(null);
    const handledCallIdsRef = useRef(new Set());
    const audioCtxRef = useRef(null);
    const ringIntervalRef = useRef(null);

    // Synthesizer Web Audio API Ringtone
    const playRingTonePulse = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;
            
            // Dual electronic phone ringtone pulse (440Hz & 480Hz)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(440, now);
            osc2.frequency.setValueAtTime(480, now);

            // Envelope: 1.2 sec ring duration with smooth gain
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
            gain.gain.linearRampToValueAtTime(0.12, now + 1.15);
            gain.gain.linearRampToValueAtTime(0, now + 1.25);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 1.3);
            osc2.stop(now + 1.3);
        } catch (err) {
            console.error("Audio Context error:", err);
        }
    };

    // Trigger Ringtone Sound while callState === 'ringing'
    useEffect(() => {
        if (callState === 'ringing') {
            playRingTonePulse();
            ringIntervalRef.current = setInterval(() => {
                playRingTonePulse();
            }, 3000);
        } else {
            if (ringIntervalRef.current) {
                clearInterval(ringIntervalRef.current);
                ringIntervalRef.current = null;
            }
            if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
                try {
                    audioCtxRef.current.suspend();
                } catch (e) {
                    console.error(e);
                }
            }
        }

        return () => {
            if (ringIntervalRef.current) {
                clearInterval(ringIntervalRef.current);
                ringIntervalRef.current = null;
            }
        };
    }, [callState]);

    // Auto-scroll transcript container
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [transcripts, toolEvents]);

    // Poll backend for active simulated call
    useEffect(() => {
        let isMounted = true;
        const fetchLatestCall = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/vapi/simulated-call/latest`);
                if (!res.ok) return;
                const data = await res.json();
                
                if (data.vapiApiKey) {
                    setApiKey(data.vapiApiKey);
                }

                if (data.call && isMounted) {
                    // Skip if call ID has already been handled/dismissed
                    if (data.call.id && handledCallIdsRef.current.has(data.call.id)) {
                        return;
                    }
                    if (data.call.status === 'ringing' && callState === 'idle') {
                        setActiveCallData(data.call);
                        setCallState('ringing');
                        setStatusMessage(`Incoming call from BietHub AI Assistant (${data.call.user?.name || 'Customer'})`);
                    } else if (data.call.status === 'ringing' && callState === 'ringing') {
                        setActiveCallData(data.call);
                    }
                }
            } catch (err) {
                console.error("Error polling simulated call:", err);
            }
        };

        fetchLatestCall();
        const interval = setInterval(fetchLatestCall, 2000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [callState]);

    // Handle Call Timer
    useEffect(() => {
        if (callState === 'connected') {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (callState === 'idle') setCallDuration(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callState]);

    // Format duration helper
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Initialize & Answer Vapi Web Call
    const handleAnswerCall = async () => {
        if (activeCallData?.id) {
            handledCallIdsRef.current.add(activeCallData.id);
        }
        setCallState('connected');
        setStatusMessage('Connecting Vapi Web RTC call...');

        // Notify backend call was answered
        try {
            await fetch(`${API_BASE}/api/vapi/simulated-call/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'answer' })
            });
        } catch (e) {
            console.error('Failed to post answer status:', e);
        }

        const vapiKeyToUse = apiKey || "97cc3710-9708-4a4d-8a13-1eda37951a5d";

        try {
            const vapi = new Vapi(vapiKeyToUse);
            setVapiInstance(vapi);

            // Vapi Event Listeners
            vapi.on('call-start', () => {
                setStatusMessage('Connected - Live AI Assistant Voice Session');
                setTranscripts(prev => [...prev, {
                    sender: 'system',
                    text: '📞 Call connected. Speak into your microphone to talk to BietHub AI Assistant.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            });

            vapi.on('call-end', () => {
                handleCallEnd('ended');
            });

            vapi.on('speech-start', () => {
                setIsSpeaking(true);
            });

            vapi.on('speech-end', () => {
                setIsSpeaking(false);
            });

            vapi.on('volume-level', (vol) => {
                setVolumeLevel(vol);
            });

            vapi.on('message', async (message) => {
                console.log('[Vapi Web Message]', message);

                if (message.type === 'transcript') {
                    if (message.transcriptType === 'final') {
                        const role = message.role === 'user' ? 'user' : 'assistant';
                        setSpeakingEntity(role);
                        setTranscripts(prev => [...prev, {
                            sender: role,
                            text: message.transcript,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                    }
                }

                // Handle tool calls in Web mode
                if (message.type === 'tool-calls' || message.type === 'function-call') {
                    const toolCalls = message.toolCalls || (message.functionCall ? [message.functionCall] : []);
                    for (const toolCall of toolCalls) {
                        const fnName = toolCall.function?.name || toolCall.name;
                        const args = toolCall.function?.arguments || toolCall.arguments || {};
                        const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;

                        setStatusMessage(`Executing tool: ${fnName}...`);

                        try {
                            const webToolRes = await fetch(`${API_BASE}/api/vapi/simulated-call/web-tool`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    functionName: fnName,
                                    parameters: parsedArgs,
                                    callMetadata: activeCallData?.payload?.metadata
                                })
                            });
                            const toolData = await webToolRes.json();

                            setToolEvents(prev => [...prev, {
                                tool: fnName,
                                result: toolData.result || 'Executed successfully',
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]);
                        } catch (toolErr) {
                            console.error('Error executing web tool:', toolErr);
                        }
                    }
                }
            });

            vapi.on('error', (err) => {
                console.error('[Vapi Web Error]', err);
                setStatusMessage(`Vapi Audio Session Error: ${err.message || 'Check microphone permissions'}`);
            });

            // Start Vapi Call with Transient Assistant or ID
            const assistantPayload = activeCallData?.payload?.assistant;
            if (assistantPayload) {
                await vapi.start(assistantPayload);
            } else if (activeCallData?.payload?.assistantId) {
                await vapi.start(activeCallData.payload.assistantId);
            } else {
                // Fallback default transient assistant configuration
                const fallbackEmail = activeCallData?.user?.email || activeCallData?.payload?.metadata?.customerEmail || "customer@example.com";
                await vapi.start({
                    name: "BietHub Recovery Assistant",
                    firstMessage: `Hi ${activeCallData?.user?.name || 'there'}, this is BietHub calling regarding your failed payment of ₹${activeCallData?.amount || 999}. Could you quickly tell me what caused the failure?`,
                    model: {
                        provider: "openai",
                        model: "gpt-4o",
                        messages: [
                            {
                                role: "system",
                                content: `You are BietHub's AI Payment Recovery Assistant calling regarding a failed payment of ₹${activeCallData?.amount || 999} (Customer Email: ${fallbackEmail}).

CRITICAL INSTRUCTIONS:
1. BE EXTREMELY CRISP & QUICK. Keep all spoken responses under 1 to 2 short sentences.
2. Inform the customer clearly of their failed payment of ₹${activeCallData?.amount || 999} and ask for the failure reason.
3. NEVER SPEAK OR READ ALOUD ANY WEBSITE URL. Simply say "BietHub". Never pronounce 'http', 'www', 'localhost', or '.com'.
4. IF THE USER WANTS TO PAY (or agrees to receive the link/website):
   - YOU MUST SAY: "I am going to send you a WhatsApp link right now."
   - IMMEDIATELY call tool 'sendPaymentLinkViaWhatsApp'.
5. When the customer states ANY reason for failure:
   - Call tool 'recordFailureReason' with reason, notes, and customerEmail ("${fallbackEmail}").
6. If customer opts out: call 'markAsLostOrFollowUp'.`
                            }
                        ]
                    }
                });
            }

        } catch (err) {
            console.error("Failed to start Vapi web session:", err);
            setStatusMessage(`Microphone / WebRTC Error: ${err.message || 'Permission denied'}`);
        }
    };

    // Decline / Reject Call
    const handleDeclineCall = async () => {
        if (activeCallData?.id) {
            handledCallIdsRef.current.add(activeCallData.id);
        }
        setCallState('ended');
        setStatusMessage('Call declined by user');

        try {
            await fetch(`${API_BASE}/api/vapi/simulated-call/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'decline' })
            });
        } catch (e) {
            console.error('Error sending decline response:', e);
        }

        setTimeout(() => {
            setCallState('idle');
            setActiveCallData(null);
            setTranscripts([]);
            setToolEvents([]);
        }, 2000);
    };

    // End Call / Hang Up
    const handleCallEnd = async (reason = 'ended') => {
        if (activeCallData?.id) {
            handledCallIdsRef.current.add(activeCallData.id);
        }
        if (vapiInstance) {
            try {
                vapiInstance.stop();
            } catch (e) {
                console.error(e);
            }
        }
        setVapiInstance(null);
        setCallState('ended');
        setStatusMessage('Call ended');

        const finalTranscript = transcripts.map(t => `${t.sender}: ${t.text}`).join('\n');

        try {
            await fetch(`${API_BASE}/api/vapi/simulated-call/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'end', transcript: finalTranscript })
            });
        } catch (e) {
            console.error('Error sending end call status:', e);
        }

        setTimeout(() => {
            setCallState('idle');
            setActiveCallData(null);
            setTranscripts([]);
            setToolEvents([]);
        }, 2000);
    };

    // Trigger Manual Test Call Simulation
    const handleManualTrigger = async () => {
        setIsTriggering(true);
        try {
            const res = await fetch(`${API_BASE}/api/vapi/simulated-call/trigger`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: testName,
                    cause: testCause,
                    amount: Number(testAmount)
                })
            });
            const data = await res.json();
            if (data.success) {
                setStatusMessage('Demo incoming call triggered!');
            }
        } catch (err) {
            console.error("Error triggering manual call:", err);
        } finally {
            setIsTriggering(false);
        }
    };

    const toggleMute = () => {
        if (vapiInstance) {
            const nextMute = !isMuted;
            vapiInstance.setMuted(nextMute);
            setIsMuted(nextMute);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
            {/* Ambient Background Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header / Banner */}
            <div className="max-w-4xl w-full text-center mb-6 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Zero Telephony Cost Demo Mode
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    Interactive Vapi AI Phone Simulator
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mt-2">
                    Simulate real-time recovery voice calls directly in your browser. Talk live with BietHub&apos;s AI Assistant using WebRTC without paying PSTN telephony carrier fees!
                </p>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
                
                {/* LEFT / SIMULATOR PHONE DISPLAY (5 Cols) */}
                <div className="lg:col-span-5 flex justify-center">
                    <div className="w-[340px] h-[680px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between ring-1 ring-slate-700/50">
                        
                        {/* Smartphone Top Notch & Dynamic Island */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="pt-3 px-7 flex justify-between items-center text-[11px] text-slate-400 font-medium z-20">
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-800 px-1 rounded font-bold text-slate-300">5G</span>
                                <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-[1px] flex items-center">
                                    <div className="h-full w-full bg-slate-200 rounded-[1px]"></div>
                                </div>
                            </div>
                        </div>

                        {/* PHONE SCREEN CONTENT */}
                        <div className="flex-1 flex flex-col justify-between p-6 z-20 overflow-hidden">
                            
                            {/* --- 1. IDLE STATE --- */}
                            {callState === 'idle' && (
                                <div className="flex-1 flex flex-col justify-between items-center text-center py-6">
                                    <div className="mt-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4 border-2 border-indigo-400/30">
                                            <Smartphone className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">BietHub Phone</h3>
                                        <p className="text-xs text-slate-400 mt-1">Ready for Recovery Calls</p>
                                    </div>

                                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-4 w-full text-left">
                                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Live Connection Active
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            When an intervention triggers a Vapi call from the <strong className="text-white">Admin Dashboard</strong> or <strong className="text-white">Simulator</strong>, this phone screen will ring immediately.
                                        </p>
                                    </div>

                                    <div className="w-full">
                                        <button
                                            onClick={handleManualTrigger}
                                            disabled={isTriggering}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                        >
                                            {isTriggering ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <PhoneCall className="w-4 h-4" />
                                            )}
                                            {isTriggering ? 'Ringing System...' : 'Test Ring /phone Now'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- 2. INCOMING CALL RINGING STATE --- */}
                            {callState === 'ringing' && (
                                <div className="flex-1 flex flex-col justify-between items-center text-center py-6 animate-fadeIn">
                                    <div className="mt-8 flex flex-col items-center">
                                        {/* Pulsing Avatar */}
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping"></div>
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl ring-4 ring-indigo-400/40 relative z-10">
                                                <User className="w-12 h-12" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span className="text-[11px] uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2.5 py-0.5 rounded-full">
                                                Incoming AI Call
                                            </span>
                                            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium animate-pulse">
                                                <Volume2 className="w-3 h-3 text-emerald-400" /> Ringing
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-white">
                                            BietHub AI Recovery
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Calling {activeCallData?.user?.name || 'Customer'}
                                        </p>

                                        <div className="mt-4 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-left w-full">
                                            <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                                                <ShieldAlert className="w-3 h-3" />
                                                Cause: {activeCallData?.cause || 'checkout_abandoned'}
                                            </div>
                                            <div className="text-xs font-bold text-white mt-0.5">
                                                Amount Pending: ₹{activeCallData?.amount || 999}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons (Decline & Answer) */}
                                    <div className="w-full flex justify-around items-center pt-6">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <button
                                                onClick={handleDeclineCall}
                                                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 transition-all active:scale-95"
                                                title="Decline Call"
                                            >
                                                <PhoneOff className="w-7 h-7" />
                                            </button>
                                            <span className="text-[11px] font-medium text-rose-400">Decline</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5">
                                            <button
                                                onClick={handleAnswerCall}
                                                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 animate-bounce transition-all active:scale-95"
                                                title="Answer Call"
                                            >
                                                <Phone className="w-7 h-7" />
                                            </button>
                                            <span className="text-[11px] font-medium text-emerald-400">Accept</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- 3. CONNECTED VOICE CALL STATE --- */}
                            {callState === 'connected' && (
                                <div className="flex-1 flex flex-col justify-between items-center text-center py-4 animate-fadeIn">
                                    <div className="mt-4 flex flex-col items-center w-full">
                                        <div className="w-20 h-20 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 mb-3 relative">
                                            <User className="w-10 h-10" />
                                            {isSpeaking && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping"></span>
                                            )}
                                        </div>

                                        <h4 className="text-lg font-bold text-white">BietHub Voice AI</h4>
                                        <div className="text-xs font-mono text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            {formatTime(callDuration)}
                                        </div>

                                        {/* Audio Visualizer Wave */}
                                        <div className="flex items-center justify-center gap-1 h-8 mt-4">
                                            {[0.4, 0.9, 0.6, 1.2, 0.7, 0.3, 0.8].map((scale, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 rounded-full transition-all duration-150 ${
                                                        isSpeaking ? 'bg-indigo-400' : 'bg-slate-700'
                                                    }`}
                                                    style={{
                                                        height: isSpeaking 
                                                            ? `${Math.max(8, Math.min(32, (volumeLevel || 0.3) * 40 * scale))}px`
                                                            : '6px'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Live Audio Status */}
                                    <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center text-[11px] text-slate-300">
                                        {isSpeaking ? (
                                            <span className="text-indigo-400 font-medium">
                                                🗣️ {speakingEntity === 'user' ? 'You are speaking...' : 'AI Assistant speaking...'}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">🎙️ Listening to microphone...</span>
                                        )}
                                    </div>

                                    {/* Phone Controls (Mute, Speaker, Hangup) */}
                                    <div className="w-full pt-4">
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <button
                                                onClick={toggleMute}
                                                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                                                    isMuted 
                                                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' 
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                                }`}
                                            >
                                                {isMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
                                                <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
                                            </button>

                                            <button
                                                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                                                    isSpeakerOn 
                                                        ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300' 
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                                }`}
                                            >
                                                {isSpeakerOn ? <Volume2 className="w-5 h-5 mb-1" /> : <VolumeX className="w-5 h-5 mb-1" />}
                                                <span className="text-[10px]">Speaker</span>
                                            </button>

                                            <button
                                                onClick={() => setTranscripts([])}
                                                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex flex-col items-center justify-center"
                                            >
                                                <MessageSquare className="w-5 h-5 mb-1" />
                                                <span className="text-[10px]">Logs</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleCallEnd('user_hangup')}
                                            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-semibold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
                                        >
                                            <PhoneOff className="w-5 h-5" />
                                            End Call
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- 4. ENDED STATE --- */}
                            {callState === 'ended' && (
                                <div className="flex-1 flex flex-col justify-center items-center text-center py-6 animate-fadeIn">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                                        <PhoneOff className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">Call Ended</h4>
                                    <p className="text-xs text-slate-400 mt-1">Duration: {formatTime(callDuration)}</p>
                                    <p className="text-[11px] text-slate-500 mt-4">Returning to standby mode...</p>
                                </div>
                            )}

                        </div>

                        {/* Bottom Phone Bar */}
                        <div className="pb-2 flex justify-center z-20">
                            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT / LIVE CONVERSATION & TOOL MONITOR (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                    
                    {/* Live Call Control & Status Card */}
                    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                    callState === 'connected' ? 'bg-emerald-400 animate-ping' :
                                    callState === 'ringing' ? 'bg-amber-400 animate-bounce' : 'bg-slate-500'
                                }`}></div>
                                <h3 className="font-bold text-white text-base">Live Vapi Call Monitor</h3>
                            </div>
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-1 rounded-full uppercase">
                                Status: {callState}
                            </span>
                        </div>

                        <div className="mt-3 text-xs text-slate-300 flex items-center justify-between">
                            <span>{statusMessage}</span>
                            {callState === 'connected' && (
                                <span className="font-mono text-emerald-400 font-semibold">{formatTime(callDuration)}</span>
                            )}
                        </div>
                    </div>

                    {/* Manual Demo Trigger Form */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-indigo-400" />
                            Trigger Custom Demo Call to /phone
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Intervention Reason</label>
                                <select
                                    value={testCause}
                                    onChange={(e) => setTestCause(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="checkout_abandoned">Checkout Abandoned</option>
                                    <option value="insufficient_funds">Insufficient Funds</option>
                                    <option value="card_expired">Card Expired</option>
                                    <option value="mandate_revoked">Mandate Revoked</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={testAmount}
                                    onChange={(e) => setTestAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleManualTrigger}
                            disabled={isTriggering}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            Simulate Incoming Call Event
                        </button>
                    </div>

                    {/* Live Transcript & Tool Execution Feed */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col h-[280px]">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                                Real-Time AI Speech & Tool Execution
                            </h4>
                            <span className="text-[11px] text-slate-500">
                                {transcripts.length} Messages | {toolEvents.length} Tools Executed
                            </span>
                        </div>

                        {/* Scrollable Container */}
                        <div ref={transcriptContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                            {transcripts.length === 0 && toolEvents.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                                    <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
                                    <p>Speech transcript bubbles and tool actions will appear here live during the voice call.</p>
                                </div>
                            ) : (
                                <>
                                    {transcripts.map((t, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-col ${
                                                t.sender === 'user' ? 'items-end' : 
                                                t.sender === 'assistant' ? 'items-start' : 'items-center'
                                            }`}
                                        >
                                            {t.sender === 'system' ? (
                                                <div className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                                                    {t.text}
                                                </div>
                                            ) : (
                                                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                                    t.sender === 'user'
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                                                }`}>
                                                    <div className="text-[9px] font-semibold opacity-70 mb-0.5">
                                                        {t.sender === 'user' ? 'Customer' : 'BietHub AI Assistant'} • {t.time}
                                                    </div>
                                                    {t.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {toolEvents.map((tool, idx) => (
                                        <div key={idx} className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-emerald-300">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Tool Executed: {tool.tool}
                                            </div>
                                            <p className="text-[11px] text-emerald-200/90 mt-1">{tool.result}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PhoneSimulator;
