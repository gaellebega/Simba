"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, ArrowRight, ShoppingCart, MapPin, CreditCard, Smartphone, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { formatPrice } from "@/lib/utils";
import { DeliveryInfo, PaymentInfo } from "@/types";
import toast from "react-hot-toast";

const STEPS = ["cart", "delivery", "payment", "confirmation"] as const;
type Step = typeof STEPS[number];

const DISTRICTS = ["Gasabo", "Kicukiro", "Nyarugenge", "Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Maramagambi", "Ngoma", "Nyagatare", "Rwamagana"];

export default function CheckoutPage() {
  const { cart, cartTotal, language, clearCart } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>("cart");
  const [orderId] = useState(`SMB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    name: "", phone: "", address: "", city: "Kigali", district: "Gasabo",
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    method: "momo", status: "pending",
  });

  const [momoNumber, setMomoNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  const total = cartTotal();
  const currentStepIdx = STEPS.indexOf(step);

  const goNext = () => {
    if (step === "delivery") {
      if (!delivery.name || !delivery.phone || !delivery.address) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (step === "payment") {
      if (payment.method === "momo" && !momoNumber) {
        toast.error("Please enter your MoMo number");
        return;
      }
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        clearCart();
        setStep("confirmation");
        toast.success("Order placed successfully! 🎉", {
          style: { borderRadius: "12px", background: "#22C55E", color: "#fff" },
        });
      }, 2000);
      return;
    }
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < STEPS.length) setStep(STEPS[nextIdx]);
  };

  const goBack = () => {
    const prevIdx = currentStepIdx - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx]);
  };

  if (cart.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <span className="text-7xl mb-6">🛒</span>
        <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>{t(language, "cart.empty")}</h2>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>Add products to your cart first</p>
        <Link href="/categories"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
          {t(language, "cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Progress Steps */}
      {step !== "confirmation" && (
        <div className="flex items-center justify-center mb-10">
          {STEPS.slice(0, 3).map((s, i) => {
            const isCompleted = STEPS.indexOf(step) > i;
            const isCurrent = step === s;
            const icons = [ShoppingCart, MapPin, CreditCard];
            const Icon = icons[i];

            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all font-bold ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100 dark:bg-gray-800"}`}
                    style={!isCompleted && !isCurrent ? { color: "var(--text-muted)" } : {}}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium capitalize ${isCurrent ? "text-orange-500" : ""}`}
                    style={!isCurrent ? { color: "var(--text-muted)" } : {}}>
                    {t(language, `checkout.${s}`)}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all ${isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* CART STEP */}
          {step === "cart" && (
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                {t(language, "checkout.orderSummary")}
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{item.name}</p>
                      {item.weight && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.weight}</p>}
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-orange-500 shrink-0">{formatPrice(item.price * item.quantity)} RWF</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERY STEP */}
          {step === "delivery" && (
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <MapPin className="w-5 h-5 text-orange-500" />
                {t(language, "checkout.deliveryDetails")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                    {t(language, "checkout.fullName")} *
                  </label>
                  <input type="text" value={delivery.name}
                    onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" }}
                    placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                    {t(language, "checkout.phone")} *
                  </label>
                  <input type="tel" value={delivery.phone}
                    onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" }}
                    placeholder="+250 7XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                    {t(language, "checkout.address")} *
                  </label>
                  <input type="text" value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" }}
                    placeholder="KG 11 Ave, House 5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                      {t(language, "checkout.city")}
                    </label>
                    <input type="text" value={delivery.city}
                      onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                      {t(language, "checkout.district")}
                    </label>
                    <select value={delivery.district}
                      onChange={(e) => setDelivery({ ...delivery, district: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      style={{ border: "1.5px solid var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" }}>
                      {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-4 p-4 rounded-xl flex items-center gap-3 bg-orange-50 dark:bg-orange-950/30">
                  <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Estimated delivery: 1-2 hours</p>
                    <p className="text-xs text-orange-600/70">Free delivery for orders above 10,000 RWF</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <CreditCard className="w-5 h-5 text-orange-500" />
                {t(language, "checkout.payWith")}
              </h2>

              <div className="space-y-3 mb-6">
                {/* MoMo */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === "momo" ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" : "hover:border-orange-300"}`}
                  style={payment.method !== "momo" ? { borderColor: "var(--border)" } : {}}>
                  <input type="radio" name="payment" value="momo" checked={payment.method === "momo"}
                    onChange={() => setPayment({ ...payment, method: "momo" })} className="sr-only" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${payment.method === "momo" ? "bg-orange-500" : "bg-gray-100 dark:bg-gray-800"}`}>
                    <Smartphone className={`w-5 h-5 ${payment.method === "momo" ? "text-white" : ""}`}
                      style={payment.method !== "momo" ? { color: "var(--text-muted)" } : {}} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${payment.method === "momo" ? "text-orange-700 dark:text-orange-400" : ""}`}
                      style={payment.method !== "momo" ? { color: "var(--text)" } : {}}>
                      {t(language, "checkout.momo")}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>MTN MoMo • Airtel Money</p>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded">MTN</span>
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Airtel</span>
                  </div>
                </label>

                {/* Cash */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === "cash" ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" : "hover:border-orange-300"}`}
                  style={payment.method !== "cash" ? { borderColor: "var(--border)" } : {}}>
                  <input type="radio" name="payment" value="cash" checked={payment.method === "cash"}
                    onChange={() => setPayment({ ...payment, method: "cash" })} className="sr-only" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${payment.method === "cash" ? "bg-orange-500" : "bg-gray-100 dark:bg-gray-800"}`}>
                    <Package className={`w-5 h-5 ${payment.method === "cash" ? "text-white" : ""}`}
                      style={payment.method !== "cash" ? { color: "var(--text-muted)" } : {}} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${payment.method === "cash" ? "text-orange-700 dark:text-orange-400" : ""}`}
                      style={payment.method !== "cash" ? { color: "var(--text)" } : {}}>
                      {t(language, "checkout.cash")}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {/* MoMo flow */}
              {payment.method === "momo" && (
                <div className="p-5 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-black text-yellow-900 text-lg">M</div>
                    <div>
                      <p className="font-bold" style={{ color: "var(--text)" }}>MTN Mobile Money</p>
                      <p className="text-xs text-green-600">Secure · Instant · Trusted</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                      {t(language, "checkout.momoNumber")} *
                    </label>
                    <div className="flex">
                      <span className="px-3 py-3 rounded-l-xl font-medium text-sm border-y border-l"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--text-muted)" }}>
                        +250
                      </span>
                      <input type="tel" value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        placeholder="7XX XXX XXX"
                        maxLength={9}
                        className="flex-1 px-3 py-3 rounded-r-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                        style={{ border: "1.5px solid var(--border)", borderLeft: "none", backgroundColor: "var(--surface)", color: "var(--text)" }}
                      />
                    </div>
                    <p className="text-xs mt-2 text-orange-600">You will receive a prompt on your phone to confirm payment</p>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
                <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  <span>Subtotal</span><span className="font-medium" style={{ color: "var(--text)" }}>{formatPrice(total)} RWF</span>
                </div>
                <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  <span>Delivery</span>
                  <span className="text-green-500 font-medium">{total >= 10000 ? "Free" : "1,000 RWF"}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-black text-base" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                  <span>{t(language, "cart.total")}</span>
                  <span className="text-orange-500">{formatPrice(total >= 10000 ? total : total + 1000)} RWF</span>
                </div>
              </div>
            </div>
          )}

          {/* CONFIRMATION */}
          {step === "confirmation" && (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>
                {t(language, "checkout.orderConfirmed")}
              </h2>
              <p className="text-lg mb-2" style={{ color: "var(--text-muted)" }}>
                {t(language, "checkout.thankYou")}
              </p>
              <div className="inline-block bg-orange-50 dark:bg-orange-950/30 px-6 py-3 rounded-2xl mb-6">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t(language, "checkout.orderNumber")}</p>
                <p className="font-black text-2xl text-orange-500">{orderId}</p>
              </div>

              {delivery.name && (
                <div className="text-left p-4 rounded-xl mb-6" style={{ backgroundColor: "var(--surface)" }}>
                  <p className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                    <Truck className="w-4 h-4 text-orange-500" />
                    Delivering to:
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {delivery.name} · {delivery.phone}<br />
                    {delivery.address}, {delivery.district}, {delivery.city}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
                  Back to Home
                </Link>
                <Link href="/categories"
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold px-8 py-3.5 rounded-full transition-colors">
                  {t(language, "cart.continueShopping")}
                </Link>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step !== "confirmation" && (
            <div className="flex justify-between mt-6">
              {step !== "cart" ? (
                <button onClick={goBack}
                  className="flex items-center gap-2 px-6 py-3 border rounded-full font-semibold hover:border-orange-400 hover:text-orange-500 transition-colors text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <ArrowLeft className="w-4 h-4" />
                  {t(language, "checkout.back")}
                </button>
              ) : (
                <Link href="/" className="flex items-center gap-2 px-6 py-3 text-sm font-medium hover:text-orange-500 transition-colors"
                  style={{ color: "var(--text-muted)" }}>
                  <ArrowLeft className="w-4 h-4" />
                  {t(language, "cart.continueShopping")}
                </Link>
              )}

              <button onClick={goNext} disabled={processing}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-orange-200 text-sm active:scale-95">
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : step === "payment" ? (
                  <>{t(language, "checkout.placeOrder")} <CheckCircle className="w-4 h-4" /></>
                ) : (
                  <>{t(language, "checkout.next")} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step !== "confirmation" && (
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>
                {t(language, "checkout.orderSummary")}
              </h3>
              <div className="space-y-3 mb-4">
                {cart.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-orange-500">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                {cart.length > 4 && (
                  <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>+{cart.length - 4} more items</p>
                )}
              </div>
              <div className="border-t pt-3 space-y-1.5" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Subtotal</span><span>{formatPrice(total)} RWF</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Delivery</span><span className="text-green-500">{total >= 10000 ? "Free" : "1,000 RWF"}</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1 border-t" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                  <span>{t(language, "cart.total")}</span>
                  <span className="text-orange-500">{formatPrice(total >= 10000 ? total : total + 1000)} RWF</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
