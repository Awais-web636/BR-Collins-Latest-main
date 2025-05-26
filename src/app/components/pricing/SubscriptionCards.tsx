"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SubscriptionConfirmationModal from "./SubscriptionConfirmationModal";
import LoginRequiredModal from "./LoginRequiredModal";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import {
  isUserLoggedIn,
  getSubscription,
  selectUser,
  getRefreshToken,
  fetchUserProfile,
  fetchSubscription,
} from "@/app/store/features/users/userSlice";
import { ISubscription } from "@/app/types/subscription.contract";
import { IUser } from "@/app/types/user.contract";

// Define TypeScript interfaces for the data structure
interface IndividualPlan {
  title: string;
  description: string;
  price: number;
  priceText: string;
  paymentType: string;
  buttonText: string;
  type: "subscription" | "individual";
  plan: string;
}

interface CorporatePlan {
  price: number;
  users: string;
  type: "subscription";
  plan: string;
}

interface SubscriptionData {
  individualPlans: IndividualPlan[];
  corporatePlans: {
    title: string;
    description: string;
    plans: CorporatePlan[];
    buttonText: string;
  };
}

const SubscriptionCards: React.FC = () => {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCorporatePlan, setSelectedCorporatePlan] = useState<number | null>(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IndividualPlan | CorporatePlan | null>(null);
  const [isCorporatePlan, setIsCorporatePlan] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(isUserLoggedIn);
  const subscription = useAppSelector(getSubscription) as ISubscription;
  const user = useAppSelector(selectUser) as IUser;
  const refreshToken = useAppSelector(getRefreshToken);

  const isManagerWithOrg = (): boolean => {
    if (!user || typeof user !== "object" || !("role" in user)) {
      return false;
    }
    return user.role === "manager" && Boolean(user.organization);
  };

  const isAdmin = (): boolean => {
    if (!user || typeof user !== "object" || !("role" in user)) {
      return false;
    }
    return user.role === "admin";
  };

  const isSubscribed = (): boolean => {
    return Boolean(
      subscription && Object.keys(subscription).length > 0 && "isActive" in subscription && subscription.isActive
    );
  };

  const isCurrentPlan = (plan: IndividualPlan | CorporatePlan) => {
    if (!isSubscribed() || !subscription) return false;

    const planType = plan.type;
    if (planType !== "subscription") {
      return false;
    }

    if ("users" in plan) {
      const userCount = parseInt(plan.users);
      switch (subscription.plan) {
        case "organization_10":
          return userCount === 10;
        case "organization_20":
          return userCount === 20;
        case "organization_50":
          return userCount === 50;
        default:
          return false;
      }
    } else {
      return subscription.plan === plan.plan;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/subscriptionData.json");
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch subscription data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlanClick = (plan: IndividualPlan) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (isSubscribed()) {
      return;
    }
    if (isLoggedIn && (isManagerWithOrg() || isAdmin())) {
      return;
    }
    setSelectedPlan(plan);
    setIsCorporatePlan(false);
    setShowConfirmationModal(true);
  };

  const handleCorporatePlanClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (isSubscribed()) {
      return;
    }
    if (isLoggedIn && (!isManagerWithOrg() || isAdmin())) {
      return;
    }
    if (selectedCorporatePlan !== null && data) {
      setSelectedPlan(data.corporatePlans.plans[selectedCorporatePlan]);
      setIsCorporatePlan(true);
      setShowConfirmationModal(true);
    }
  };

  const handleConfirmPurchase = () => {
    setShowConfirmationModal(false);
    if (selectedPlan?.type === "individual") {
      router.push("/course");
    } else {
      router.push("/buy-now?type=subscription");
    }

    // Start refetching after 5 seconds
    setIsRefetching(true);
    setTimeout(async () => {
      if (refreshToken) {
        await Promise.all([dispatch(fetchUserProfile(refreshToken)), dispatch(fetchSubscription(refreshToken))]);
      }
      setIsRefetching(false);
    }, 5000);
  };

  if (loading) return <div>Loading subscription plans...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No subscription data available</div>;

  return (
    <>
      {isRefetching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-700">Updating subscription details...</p>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col p-1 xl:p-4  lg:flex-row gap-6 h-auto lg:h-[494px] px-4 max-md:px-1">
        {/* Left Column - Individual Plans */}
        <div className="w-full lg:w-1/2 flex flex-col  gap-3 justify-between ">
          {data.individualPlans.map((plan, index) => (
            <div key={index} className="flex flex-row  h-auto lg:h-[237px] justify-between">
              <div className="bg-white border-1 border-gray-300 rounded-lg w-full p-6 flex flex-row justify-between mr-auto">
                <div className="flex flex-col justify-between w-1/2">
                  <div>
                    <h1
                      className="text-lg sm:text-xl font-bold text-black mb-2"
                      dangerouslySetInnerHTML={{ __html: plan.title }}
                    />
                    <p
                      className="text-gray-700 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: plan.description }}
                    />
                    {isLoggedIn && isManagerWithOrg() && (
                      <p className="mt-2 text-red-600 text-xs font-medium">Available for individual users only</p>
                    )}
                    {isLoggedIn && isAdmin() && (
                      <p className="mt-2 text-red-600 text-xs font-medium">Admins cannot purchase subscriptions</p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlanClick(plan)}
                    disabled={isSubscribed() || (isLoggedIn && (isManagerWithOrg() || isAdmin()))}
                    className={`bg-primary text-sm sm:text-base text-white py-2 sm:py-3 font-medium px-6 rounded-4xl self-start mt-2 lg:mt-0 ${isSubscribed() || (isLoggedIn && (isManagerWithOrg() || isAdmin()))
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-primary-hover transition-all duration-300"
                      }`}
                  >
                    {isCurrentPlan(plan)
                      ? "Current Plan"
                      : isSubscribed()
                        ? "Already Subscribed"
                        : isLoggedIn && isAdmin()
                          ? "Not Available for Admins"
                          : isLoggedIn && isManagerWithOrg()
                            ? "Not Available"
                            : plan.buttonText}
                  </button>
                </div>
                <div className="flex flex-col justify-between w-1/2">
                  <div className="flex flex-col items-end">
                    <h1 className="text-white text-xs sm:text-sm uppercase bg-[#2490E0] w-fit rounded-lg px-2 py-1 self-end mb-2 font-bold">
                      {plan.paymentType}
                    </h1>
                  </div>
                  <div>
                    <h2 className="text-5xl sm:text-6xl font-bold flex items-end flex-col">${plan.price}</h2>
                    <p className="flex items-end flex-col text-sm sm:text-base">{plan.priceText}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Corporate Plans */}
        <div
          className={`w-full lg:w-1/2 bg-white border border-gray-300 rounded-lg p-6 flex flex-col justify-between h-auto lg:h-full ${isLoggedIn && (!isManagerWithOrg() || isAdmin())
            ? `${isAdmin() ? "opacity-100" : "opacity-50"} pointer-events-none`
            : ""
            }`}
        >
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-black mb-2">{data?.corporatePlans.title}</h1>
            <p className="text-gray-700 text-sm sm:text-base mb-4">{data?.corporatePlans.description}</p>
            {isLoggedIn && !isManagerWithOrg() && !isAdmin() && (
              <p className="text-gray-400 text-xs font-medium mb-4">Exclusive to organization managers</p>
            )}
            {isLoggedIn && isAdmin() && (
              <p className="text-red-600 text-xs font-medium mb-4">Admins cannot purchase subscriptions</p>
            )}
            <ul className="space-y-2">
              {data?.corporatePlans.plans.map((plan, index) => (
                <React.Fragment key={index}>
                  <li
                    className={`flex py-2 items-center ${isLoggedIn && (!isManagerWithOrg() || isAdmin()) ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    onClick={() =>
                      !isSubscribed() &&
                      (!isLoggedIn || (isManagerWithOrg() && !isAdmin())) &&
                      setSelectedCorporatePlan(index)
                    }
                  >
                    <div className="flex flex-row w-full justify-between">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold">${plan.price}</h1>
                      </div>
                      <div className="flex items-center w-1/3 md:w-1/5 justify-between flex-row">
                        <h2 className="text-sm sm:text-base">{plan.users}</h2>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="checkbox"
                            className="peer hidden"
                            checked={selectedCorporatePlan === index}
                            onChange={() =>
                              !isSubscribed() &&
                              (!isLoggedIn || (isManagerWithOrg() && !isAdmin())) &&
                              setSelectedCorporatePlan(index)
                            }
                            disabled={isSubscribed() || (isLoggedIn && (!isManagerWithOrg() || isAdmin()))}
                          />
                          <div className={`relative w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 flex justify-center items-center bg-transparent ${isSubscribed() || (isLoggedIn && (!isManagerWithOrg() || isAdmin())) ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <div className={`w-3 h-3 rounded-full ${selectedCorporatePlan === index ? 'bg-blue-500 scale-100' : 'scale-0'}`}></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </li>
                  {index < data.corporatePlans.plans.length - 1 && <hr className="border-gray-200" />}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <button
            onClick={handleCorporatePlanClick}
            disabled={
              selectedCorporatePlan === null || isSubscribed() || (isLoggedIn && (!isManagerWithOrg() || isAdmin()))
            }
            className={`bg-primary duration-300 text-sm sm:text-base text-white py-2 sm:py-4 font-medium px-6 rounded-full w-full mt-2 lg:mt-0 ${selectedCorporatePlan === null || isSubscribed() || (isLoggedIn && (!isManagerWithOrg() || isAdmin()))
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-primary-hover"
              }`}
          >
            {isSubscribed() &&
              selectedCorporatePlan !== null &&
              isCurrentPlan(data?.corporatePlans.plans[selectedCorporatePlan])
              ? "Current Plan"
              : isSubscribed()
                ? "Already Subscribed"
                : isLoggedIn && isAdmin()
                  ? "Not Available for Admins"
                  : isLoggedIn && !isManagerWithOrg()
                    ? "Not Available"
                    : data?.corporatePlans.buttonText}
          </button>
        </div>
      </div>

      {selectedPlan && (
        <SubscriptionConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmPurchase}
          plan={{
            title: isCorporatePlan ? data.corporatePlans.title : (selectedPlan as IndividualPlan).title,
            price: selectedPlan.price,
            paymentType: isCorporatePlan ? "Corporate" : (selectedPlan as IndividualPlan).paymentType,
            users: isCorporatePlan ? data.corporatePlans.plans[selectedCorporatePlan!].users : undefined,
            type: selectedPlan.type,
          }}
        />
      )}

      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default SubscriptionCards;
