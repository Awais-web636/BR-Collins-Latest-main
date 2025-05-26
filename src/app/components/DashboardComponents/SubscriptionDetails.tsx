import React from "react";
import { useAppSelector } from "@/app/store/hooks";
import { getSubscription } from "@/app/store/features/users/userSlice";
import { Crown, Calendar, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import { ISubscription } from "@/app/types/subscription.contract";
import Link from "next/link";

const SubscriptionDetails = () => {
  const subscription = useAppSelector(getSubscription) as ISubscription | null;

  if (!subscription || !subscription.isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <XCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Active Subscription</h2>
        <p className="text-gray-600 mb-6">You don't have an active subscription at the moment.</p>
        <Link
          href={"/subscriptions"}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Subscription Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan Type</span>
              <span className="font-medium text-gray-800">
                {subscription.entityType === "user" ? "Individual" : "Organization"} Plan
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Validity Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Validity Period</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Activated On</span>
              <span className="font-medium text-gray-800">
                {subscription.activatedAt ? new Date(subscription.activatedAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expires On</span>
              <span className="font-medium text-gray-800">
                {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment History Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Payment</span>
              <span className="font-medium text-gray-800">
                {subscription.lastPaymentAt ? new Date(subscription.lastPaymentAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-800">Stripe</span>
            </div>
          </div>
        </div>

        {/* Subscription ID Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Subscription Info</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subscription ID</span>
              <span className="font-medium text-gray-800">{subscription.subscriptionId || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Customer ID</span>
              <span className="font-medium text-gray-800">{subscription.stripeCustomerId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
