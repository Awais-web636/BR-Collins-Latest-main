import * as React from "react";
import { BookingState } from "./InPersonPopup";
import { AppointmentType } from "@/app/types/appointment.contract";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken } from "@/app/store/features/users/userSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  bookingState: BookingState;
  onClose: () => void;
}

const locationSchema = z.object({
  venueName: z.string().min(1, "Venue name is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  additionalInfo: z.string().optional(),
});

const bookingFormSchema = z.object({
  location: locationSchema,
  maxParticipants: z.number().min(1, "At least one participant is required"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const PaymentFormContent: React.FC<{ bookingState: BookingState; onClose: () => void }> = ({
  bookingState,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const accessToken = useAppSelector(getRefreshToken);
  const queryClient = useQueryClient();

  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await api.post(
        "/stripe/create-payment-intent",
        {
          courseDuration: bookingState.courseDuration,
          appointmentType: (bookingState.courseDuration === "full-day" &&
          bookingState.selectedSlot.startsWith("Morning")
            ? "half-day-morning"
            : bookingState.courseDuration === "full-day" && bookingState.selectedSlot.startsWith("Afternoon")
            ? "half-day-afternoon"
            : "full-day") as AppointmentType,
          date: bookingState.selectedDate.toISOString(),
          location: {
            venueName: data.location.venueName,
            streetAddress: data.location.streetAddress,
            city: data.location.city,
            state: data.location.state,
            zipCode: data.location.zipCode,
            additionalInfo: data.location.additionalInfo,
          },
          notes: data.notes,
          maxParticipants: data.maxParticipants,
          courseId: bookingState.courseId,
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
      setError(null);
      setCurrentStep(2);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create payment intent. Please try again.";
      setError(message);
      console.error("Error creating payment intent:", error);
    },
  });

  const {
    register: registerBooking,
    handleSubmit: handleBookingSubmit,
    formState: { errors: bookingErrors },
    watch: watchBooking,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      location: {
        venueName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        additionalInfo: "",
      },
      maxParticipants: 1,
      notes: "",
    },
  });

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  React.useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const onBookingSubmit = (data: BookingFormData) => {
    createPaymentIntentMutation.mutate(data);
  };

  const onPaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      // Confirm the payment with the client secret
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret!, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      setSuccess(true);
      // Invalidate the availableSlots query for the current month
      queryClient.invalidateQueries({ queryKey: ["availableSlots", bookingState.currentMonth] });
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          1
        </div>
        <div className="w-24 h-1 bg-gray-200 mx-2">
          <div className={`h-full ${currentStep === 2 ? "bg-primary" : "bg-gray-200"}`}></div>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );

  const renderBookingForm = () => (
    <form onSubmit={handleBookingSubmit(onBookingSubmit)} className="space-y-4">
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Course Duration:</span>
            <span className="font-medium">{bookingState.courseDuration === "half-day" ? "Half-Day" : "Full-Day"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDateForDisplay(bookingState.selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Slot:</span>
            <span className="font-medium">{bookingState.selectedSlot}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg">${bookingState.price}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">Location Information</h3>

        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
            Venue Name *
          </label>
          <input
            {...registerBooking("location.venueName")}
            type="text"
            id="venueName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Client Office, Conference Center, Hotel Name"
          />
          {bookingErrors.location?.venueName && (
            <p className="mt-1 text-sm text-red-600">{bookingErrors.location.venueName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            {...registerBooking("location.streetAddress")}
            type="text"
            id="streetAddress"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., 123 Main Street"
          />
          {bookingErrors.location?.streetAddress && (
            <p className="mt-1 text-sm text-red-600">{bookingErrors.location.streetAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              {...registerBooking("location.city")}
              type="text"
              id="city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., New York"
            />
            {bookingErrors.location?.city && (
              <p className="mt-1 text-sm text-red-600">{bookingErrors.location.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              {...registerBooking("location.state")}
              type="text"
              id="state"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., NY"
            />
            {bookingErrors.location?.state && (
              <p className="mt-1 text-sm text-red-600">{bookingErrors.location.state.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            {...registerBooking("location.zipCode")}
            type="text"
            id="zipCode"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., 10001"
          />
          {bookingErrors.location?.zipCode && (
            <p className="mt-1 text-sm text-red-600">{bookingErrors.location.zipCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Location Details
          </label>
          <textarea
            {...registerBooking("location.additionalInfo")}
            id="additionalInfo"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Floor number, suite number, parking instructions"
          />
        </div>

        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Participants *
          </label>
          <input
            {...registerBooking("maxParticipants", { valueAsNumber: true })}
            type="number"
            id="maxParticipants"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., 10"
          />
          {bookingErrors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">{bookingErrors.maxParticipants.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...registerBooking("notes")}
            id="notes"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter any additional notes..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={createPaymentIntentMutation.isPending}
        className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createPaymentIntentMutation.isPending ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          "Continue to Payment"
        )}
      </button>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={onPaymentSubmit} className="space-y-4">
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Course Duration:</span>
            <span className="font-medium">{bookingState.courseDuration === "half-day" ? "Half-Day" : "Full-Day"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDateForDisplay(bookingState.selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Slot:</span>
            <span className="font-medium">{bookingState.selectedSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{watchBooking("location.venueName")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Participants:</span>
            <span className="font-medium">{watchBooking("maxParticipants")}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg">${bookingState.price}</span>
          </div>
        </div>
      </div>

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

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible || success ? "opacity-100" : "opacity-0"
      } ${success ? "bg-white" : "bg-opacity-50"}`}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500">Your booking has been confirmed.</p>
        </div>
      ) : (
        <div
          className={`bg-white rounded-2xl max-w-lg w-full mx-4 transform transition-all duration-300 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
        >
          <div className="sticky top-0 bg-white rounded-t-2xl p-8 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                {currentStep === 1 ? "Booking Information" : "Payment Details"}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {renderStepIndicator()}
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-8 pt-4">
            {currentStep === 1 ? renderBookingForm() : renderPaymentForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = ({ bookingState, onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent bookingState={bookingState} onClose={onClose} />
    </Elements>
  );
};
