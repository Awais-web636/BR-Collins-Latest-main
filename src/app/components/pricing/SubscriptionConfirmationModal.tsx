"use client";
import React, { useState } from "react";
import { X, CreditCard, CheckCircle2, Shield, Zap, ArrowRight, Users } from "lucide-react";
import CheckoutPage from "./CheckoutPage";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { useAppSelector } from "@/app/store/hooks";
import { getAccessToken } from "@/app/store/features/users/userSlice";

interface SubscriptionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plan: {
    title: string;
    price: number;
    paymentType: string;
    users?: string;
    type: "subscription" | "individual";
  };
}

const SubscriptionConfirmationModal: React.FC<SubscriptionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();
  const accessToken = useAppSelector(getAccessToken);

  const isCorporate = plan.paymentType === "Corporate";

  const createSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionType: "individual" | "organization_10" | "organization_20" | "organization_50") => {
      const response = await api.post(
        "/stripe/create-subscription",
        {
          subscriptionType,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create subscription";
      showToast(message, "error");
      console.error("Error creating subscription:", error);
    },
  });

  const handleConfirm = async () => {
    if (plan.type === "individual") {
      router.push("/course");
    } else {
      try {
        // Determine subscription type based on plan
        let subscriptionType: "individual" | "organization_10" | "organization_20" | "organization_50";

        if (plan.type === "subscription" && !isCorporate) {
          subscriptionType = "individual";
        } else if (isCorporate && plan.users) {
          if (plan.users === "10 users") subscriptionType = "organization_10";
          else if (plan.users === "20 users") subscriptionType = "organization_20";
          else if (plan.users === "50 users") subscriptionType = "organization_50";
          else subscriptionType = "individual";
        } else {
          subscriptionType = "individual";
        }

        createSubscriptionMutation.mutate(subscriptionType);
      } catch (error) {
        console.error("Error creating subscription:", error);
      }
    }
  };

  if (!isOpen) return null;

  if (showCheckout && clientSecret) {
    return (
      <CheckoutPage
        plan={{
          title: plan.title,
          price: plan.price,
          type: plan.type,
        }}
        clientSecret={clientSecret}
        onClose={() => {
          setShowCheckout(false);
          onClose();
        }}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-slideIn"
      >
        <div className="p-6">
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
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-gray-400">Payment</span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Plan Summary Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900">{plan.title}</h3>
                <span className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
                  {plan.paymentType}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-neutral-900">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              {isCorporate && plan.users && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Number of Users</span>
                    <span className="text-lg font-semibold text-neutral-900">{plan.users}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {plan.type === "subscription" ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">One Year Plan</h4>
                      <p className="text-sm text-gray-500">Full year access to all courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Complete Access</h4>
                      <p className="text-sm text-gray-500">Unlimited access to all courses and features</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Lifetime Access</h4>
                      <p className="text-sm text-gray-500">Permanent access to your chosen course</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Course Selection</h4>
                      <p className="text-sm text-gray-500">Choose any course that fits your needs</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Confirmation Message */}
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <p className="text-sm text-emerald-700">
                {plan.type === "subscription"
                  ? `You'll be charged $${plan.price} today for a full year of access to all courses. Your subscription will automatically renew each year.`
                  : `You'll be charged $${plan.price} today for lifetime access to your chosen course.`}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={createSubscriptionMutation.isPending}
              className={`cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {createSubscriptionMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {plan.type === "subscription" ? "Confirm Purchase" : "Explore Courses"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={createSubscriptionMutation.isPending}
              className="cursor-pointer w-full px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmationModal;
