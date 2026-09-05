import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

const MembershipPage = () => {
    const { IsLogin, user, refetchAuth, isLoading } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [activePromise, setActivePromise] = useState(null);
    const [promiseDate, setPromiseDate] = useState('');
    const [promiseAmount, setPromiseAmount] = useState('299');
    const [submittingPromise, setSubmittingPromise] = useState(false);

    // Discount state
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoInput, setPromoInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');

    useEffect(() => {
        const discQuery = searchParams.get('discount');
        if (discQuery) {
            const val = parseFloat(discQuery);
            if (!isNaN(val) && val > 0 && val <= 100) {
                setDiscountPercent(val);
                setAppliedCoupon(`GOODWILL${val}`);
                toast.info(`🎉 Special ${val}% Goodwill Discount applied to your account!`);
            }
        }
    }, [searchParams]);

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const cleaned = promoInput.trim();
        if (!cleaned) {
            toast.error("Please enter a valid coupon code.");
            return;
        }
        const match = cleaned.match(/\d+/);
        let val = match ? parseFloat(match[0]) : 15;
        if (val <= 0 || val > 100) val = 15;
        setDiscountPercent(val);
        setAppliedCoupon(cleaned.toUpperCase());
        toast.success(`Coupon ${cleaned.toUpperCase()} applied! ${val}% OFF activated.`);
    };

    const handleClearDiscount = () => {
        setDiscountPercent(0);
        setAppliedCoupon('');
        setPromoInput('');
        setSearchParams({});
        toast.info("Discount removed.");
    };

    const fetchActivePromise = useCallback(async () => {
        try {
            const res = await apiFetch("/payforevent/promise/active");
            const data = await res.json();
            if (data.success && data.promise) {
                setActivePromise(data.promise);
            } else {
                setActivePromise(null);
            }
        } catch (error) {
            console.error("Error fetching active promise:", error);
        }
    }, []);

    useEffect(() => {
        if (IsLogin) {
            fetchActivePromise();
        }
    }, [IsLogin, fetchActivePromise]);

    const handleCommitPromise = async (e) => {
        e.preventDefault();
        if (!promiseDate || !promiseAmount) {
            toast.error("Please provide both a promise date and amount.");
            return;
        }
        
        const selected = new Date(promiseDate);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        
        if (selected > maxDate) {
            toast.error("You can only commit to a pay date up to 7 days in the future.");
            return;
        }
        if (selected < new Date().setHours(0,0,0,0)) {
            toast.error("Promise date cannot be in the past.");
            return;
        }

        setSubmittingPromise(true);
        try {
            const response = await apiFetch("/payforevent/simulator/promise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    member_id: user?.id,
                    promised_date: promiseDate,
                    promised_amount: Number(promiseAmount)
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Payment promise logged! Recovery nudges have been silenced.");
                setPromiseDate('');
                fetchActivePromise();
            } else {
                toast.error(data.msg || "Failed to submit commitment.");
            }
        } catch (error) {
            console.error("Error committing promise:", error);
            toast.error("Something went wrong!");
        } finally {
            setSubmittingPromise(false);
        }
    };

    useEffect(() => {
        if (!isLoading && !IsLogin) {
            toast.error("Please login to purchase membership.");
            navigate("/login");
        }
    }, [IsLogin, isLoading, navigate]);

    const handleSubscribe = async (planType) => {
        setLoadingPlan(planType);
        try {
            const response = await apiFetch("/payforevent/pay/membership", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ planType, discountPercent }),
            });

            const data = await response.json();

            if (data.success) {
                const options = {
                    key: data.key_id,
                    amount: data.amount,
                    currency: "INR",
                    name: "BIETHUB Premium Membership",
                    description: `${planType.toUpperCase()} Subscription Plan ${discountPercent > 0 ? `(${discountPercent}% OFF Goodwill Discount)` : ''}`,
                    image: "https://eventmanagementdevloop.netlify.app/Biet_Hub.jpeg",
                    order_id: data.order_id,
                    handler: async function (paymentResponse) {
                        try {
                            const verifyRes = await apiFetch("/payforevent/pay/membership/verify", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: paymentResponse.razorpay_order_id,
                                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                    razorpay_signature: paymentResponse.razorpay_signature,
                                    planType: planType
                                }),
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                                toast.success(`Successfully subscribed to ${planType} plan!`);
                                await refetchAuth();
                                navigate("/dashboard");
                            } else {
                                toast.error(verifyData.msg || "Payment verification failed.");
                            }
                        } catch (error) {
                            console.error("Verification error:", error);
                            toast.error("Something went wrong during payment verification.");
                        }
                    },
                    prefill: {
                        name: data.name,
                    },
                    theme: {
                        color: "#7b2abf",
                    },
                    modal: {
                        ondismiss: async function () {
                            try {
                                await apiFetch("/payforevent/pay/abandon", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        order_id: data.order_id,
                                        planType: planType
                                    }),
                                });
                            } catch (err) {
                                console.error("Error reporting abandonment:", err);
                            }
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on("payment.failed", function () {
                    toast.error("Payment Failed");
                });
                razorpay.open();
            } else {
                toast.error(data.msg || "Order creation failed.");
            }
        } catch (error) {
            console.error("Error creating subscription order:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly Plan',
            basePrice: 299,
            period: 'month',
            features: [
                'Access to all Exclusive events',
                'Priority event registration',
                'Standard support',
            ],
            color: 'from-purple-500 to-indigo-500',
        },
        {
            id: 'quarterly',
            name: 'Quarterly Plan',
            basePrice: 699,
            period: 'quarter',
            features: [
                'Access to all Exclusive events',
                'Save over 20% compared to monthly',
                'Priority event registration',
                'E-Certificates for all events',
                'Standard support status',
            ],
            color: 'from-purple-700 to-purple-900',
            popular: true,
        },
        {
            id: 'yearly',
            name: 'Yearly Plan',
            basePrice: 2499,
            period: 'year',
            features: [
                'Access to all Exclusive events',
                'One-time payment for 12 months',
                'Priority event registration',
                'E-Certificates for all events',
                'VIP Support status',
            ],
            color: 'from-indigo-600 to-indigo-900',
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
        >
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-purple-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        BIETHUB Premium Membership
                    </h2>
                    <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
                        Unlock access to premium exclusive events, certifications, workshops, and VIP student activities.
                    </p>
                    {user?.isMember && (
                        <div className="mt-6 inline-block bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-medium shadow-sm">
                            👑 Active Plan: <span className="uppercase font-bold">{user.membershipPlan}</span> (Expires: {new Date(user.membershipExpiresAt).toLocaleDateString()})
                        </div>
                    )}
                </div>

                {/* Goodwill & Billing Support Discount Banner */}
                {discountPercent > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border-2 border-amber-400/50 rounded-3xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden text-left"
                    >
                        <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md text-2xl shrink-0">
                                    🎁
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-extrabold text-slate-900">
                                            Goodwill Billing Discount Active!
                                        </h3>
                                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                                            {discountPercent}% OFF
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                                        {user?.name ? <strong>Dear {user.name}, </strong> : ''}We noticed you faced billing issues with your subscription. As a gesture of goodwill, we are offering you a <strong>{discountPercent}% discount</strong> on your next payment!
                                    </p>
                                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                                        Renew your membership for only <span className="underline font-bold">₹{(299 * (1 - discountPercent/100)).toFixed(2)}</span> (Monthly) or apply discount across all plans below.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearDiscount}
                                className="text-xs bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 shadow-sm"
                            >
                                Remove Discount
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Promo Code Input Box */}
                <div className="max-w-md mx-auto mb-10 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-left">
                    <form onSubmit={handleApplyCoupon}>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <span>🎟️</span> Apply Discount / Promo Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. GOODWILL15 or 15"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white uppercase font-mono font-semibold"
                            />
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </form>
                    {appliedCoupon && (
                        <div className="mt-3 text-xs text-emerald-700 font-semibold flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                            <span className="flex items-center gap-1">
                                <span>✓</span> Coupon <span className="font-mono font-bold uppercase">{appliedCoupon}</span> active ({discountPercent}% Discount)
                            </span>
                            <button onClick={handleClearDiscount} className="text-[10px] text-red-500 hover:underline">Clear</button>
                        </div>
                    )}
                </div>

                {/* Promise to Pay Portal */}
                {!user?.isMember && (
                    <div className="max-w-md mx-auto mb-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition-all text-left">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span>🤝</span>
                            <span>Promise-to-Pay Billing Portal</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                            Can&apos;t pay today? Commit to a specific payment date within the next 7 days, and our system will automatically silence all recovery notifications.
                        </p>
                        
                        {activePromise ? (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs font-semibold text-indigo-800">
                                <div>Active Commitment Active:</div>
                                <div className="mt-1 font-black">
                                    Promised ₹{activePromise.promised_amount} on {new Date(activePromise.promised_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="mt-2 text-[9px] text-indigo-650 leading-relaxed">
                                    ✓ Recovery WhatsApp and email notifications are silenced.
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleCommitPromise} className="space-y-4 text-xs font-semibold text-slate-600">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-slate-500 mb-1.5 uppercase font-bold tracking-wide">Commit Date</label>
                                        <input
                                            type="date"
                                            value={promiseDate}
                                            onChange={(e) => setPromiseDate(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500 mb-1.5 uppercase font-bold tracking-wide">Commit Amount</label>
                                        <select
                                            value={promiseAmount}
                                            onChange={(e) => setPromiseAmount(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                        >
                                            <option value="299">Monthly Plan {discountPercent > 0 ? `(Discounted: ₹${(299 * (1 - discountPercent/100)).toFixed(2)})` : '(₹299)'}</option>
                                            <option value="699">Quarterly Plan {discountPercent > 0 ? `(Discounted: ₹${(699 * (1 - discountPercent/100)).toFixed(2)})` : '(₹699)'}</option>
                                            <option value="2499">Yearly Plan {discountPercent > 0 ? `(Discounted: ₹${(2499 * (1 - discountPercent/100)).toFixed(2)})` : '(₹2499)'}</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingPromise}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider shadow-sm transition-all focus:outline-none disabled:opacity-50 text-[10px] flex items-center justify-center gap-1"
                                >
                                    {submittingPromise ? 'Submitting...' : 'Register Promise Commit'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const discounted = discountPercent > 0 ? (plan.basePrice * (1 - discountPercent / 100)).toFixed(2) : null;

                        return (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border-2 ${
                                    plan.popular ? 'border-purple-600 relative' : 'border-transparent'
                                }`}
                            >
                                {plan.popular && (
                                    <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-bl-2xl uppercase tracking-wider">
                                        Best Value
                                    </span>
                                )}
                                <div className="p-8">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                                        
                                        {discounted ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-base font-bold text-gray-400 line-through">₹{plan.basePrice}</span>
                                                <div className="flex items-center justify-center gap-1 mt-0.5">
                                                    <span className="text-4xl font-extrabold text-purple-700">₹{discounted}</span>
                                                    <span className="text-gray-500 text-sm font-medium">/ {plan.period}</span>
                                                </div>
                                                <span className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                                                    🎁 Goodwill Discount {discountPercent}% OFF
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span className="text-5xl font-extrabold text-gray-900">₹{plan.basePrice}</span>
                                                <span className="text-gray-500 ml-2">/ {plan.period}</span>
                                            </div>
                                        )}
                                    </div>
                                    <ul className="mt-8 space-y-4">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg
                                                    className="flex-shrink-0 h-6 w-6 text-green-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-600 ml-3">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 bg-gray-50 border-t border-gray-100">
                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={loadingPlan !== null}
                                        className={`w-full py-3 px-6 rounded-xl text-center font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all bg-gradient-to-r ${plan.color} hover:opacity-90`}
                                    >
                                        {loadingPlan === plan.id ? 'Processing...' : user?.membershipPlan === plan.id ? 'Renew Plan' : 'Subscribe Now'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default MembershipPage;
