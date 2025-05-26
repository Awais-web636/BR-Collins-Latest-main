"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, CreditCard, Lock, Shield, CheckCircle2, Info, AlertCircle, Apple } from "lucide-react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutPageProps {
  plan: {
    title: string;
    price: number;
    type: "subscription" | "individual";
  };
  clientSecret: string;
  onBack: () => void;
  onClose: () => void;
}

const CheckoutForm: React.FC<{ plan: CheckoutPageProps["plan"]; onBack: () => void; clientSecret: string }> = ({
  plan,
  onBack,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred");
        setProcessing(false);
        return;
      }

      // Confirm the payment with the client secret
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || "An error occurred");
        setProcessing(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/success");
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500">Redirecting to your account...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="text-sm font-medium text-neutral-900">Plan Details</span>
        </div>
        <div className="h-0.5 flex-1 bg-gray-200 mx-4"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="text-sm font-medium text-neutral-900">Payment</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">{plan.title}</h3>
              <p className="text-gray-500">
                {plan.type === "subscription" ? "Yearly Subscription" : "Lifetime Access"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-neutral-900">${plan.price}</span>
              {plan.type === "subscription" && <span className="text-gray-500">/year</span>}
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                {plan.type === "subscription"
                  ? "Access to all courses for one year"
                  : "Lifetime access to your chosen course"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>24/7 customer support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>High quality content from industry experts</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900">Payment Method</h3>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${plan.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">${plan.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Complete Purchase"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plan Selection
        </button>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, onBack, onClose, clientSecret }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-slideIn"
      >
        <div className="p-6">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm plan={plan} onBack={onBack} clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
