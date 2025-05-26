"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import CustomDataTable from "./CustomDataTable";
import { useAppSelector } from "@/app/store/hooks";
import { getAccessToken } from "@/app/store/features/users/userSlice";
import ActionIcons from "@/components/ActionIcons";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { showToast } from "@/app/utils/toast";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface DeletedCustomer {
  id: string;
  deleted: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
  };
}

interface StripeInvoice {
  id: string;
  amount: number;
  date: number;
  status: "draft" | "open" | "paid" | "uncollectible" | "void" | null;
  subscription: string;
  paymentBrand: string | undefined;
  paymentLast4: string | undefined;
  invoiceURL: string | null | undefined;
  downloadURL: string | null | undefined;
  currency: string;
  customer: string | Customer | DeletedCustomer;
  created: number;
  paymentMethod: string | PaymentMethod | null;
}

const fetchInvoices = async (accessToken: string): Promise<{ data: StripeInvoice[] }> => {
  const response = await api.get("/stripe/invoices", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const createPortalSession = async (accessToken: string): Promise<{ url: string }> => {
  const response = await api.get("/stripe/portal", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};

const Transactions = () => {
  const accessToken = useAppSelector(getAccessToken);

  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => fetchInvoices(accessToken!),
    enabled: !!accessToken,
  });

  const portalSessionMutation = useMutation({
    mutationFn: () => createPortalSession(accessToken!),
    onSuccess: (data) => {
      window.open(data.url, "_blank");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to open Stripe portal";
      showToast(message, "error");
      console.error("Error creating portal session:", error);
    },
  });

  const getPaymentMethodDisplay = (paymentMethod: string | PaymentMethod | null): string => {
    if (!paymentMethod) return "N/A";
    if (typeof paymentMethod === "string") return paymentMethod;
    if (paymentMethod.card) {
      return `${paymentMethod.card.brand.toUpperCase()} •••• ${paymentMethod.card.last4}`;
    }
    return paymentMethod.type;
  };

  const columns = [
    {
      name: "Amount",
      selector: (row: StripeInvoice) => row.amount,
      sortable: true,
      grow: 0.5,
      cell: (row: StripeInvoice) => (
        <div className="text-base text-left text-neutral-900">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: row.currency,
          }).format(row.amount / 100)}
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row: StripeInvoice) => row.created,
      sortable: true,
      grow: 0.5,
      cell: (row: StripeInvoice) => (
        <div className="text-base text-left text-neutral-900">{new Date(row.created * 1000).toLocaleDateString()}</div>
      ),
    },
    {
      name: "Status",
      selector: (row: StripeInvoice) => row.status,
      sortable: true,
      grow: 0.5,
      cell: (row: StripeInvoice) => (
        <span
          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
            row.status === "paid"
              ? "text-green-600 bg-emerald-50"
              : row.status === "open"
              ? "text-yellow-600 bg-yellow-50"
              : row.status === "draft"
              ? "text-gray-600 bg-gray-50"
              : row.status === "uncollectible"
              ? "text-red-600 bg-red-50"
              : row.status === "void"
              ? "text-gray-600 bg-gray-50"
              : "text-gray-600 bg-gray-50"
          }`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Unknown"}
        </span>
      ),
    },
    {
      name: "Payment Method",
      selector: (row: StripeInvoice) => getPaymentMethodDisplay(row.paymentMethod),
      sortable: true,
      grow: 0.5,
      cell: (row: StripeInvoice) => (
        <div className="text-base text-left text-neutral-900">{getPaymentMethodDisplay(row.paymentMethod)}</div>
      ),
    },
    {
      name: "Actions",
      grow: 0.5,
      cell: (row: StripeInvoice) => (
        <div className="flex items-center gap-1">
          <ActionIcons
            onView={row.invoiceURL ? () => window.open(row.invoiceURL!, "_blank") : undefined}
            viewTooltip="View Invoice"
            disabled={{
              view: !row.invoiceURL,
              edit: true,
              delete: true,
            }}
          />
          {row.downloadURL && (
            <button
              onClick={() => window.open(row.downloadURL!, "_blank")}
              className="p-1.5 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Download Invoice"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="flex-1 p-2 sm:p-5 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Transactions</h2>
        <button
          onClick={() => portalSessionMutation.mutate()}
          disabled={portalSessionMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {portalSessionMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
          {portalSessionMutation.isPending ? "Loading..." : "Manage Billing"}
        </button>
      </div>

      <CustomDataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        error={error ? "Failed to load transactions" : null}
        noDataMessage="No transactions found"
      />
    </section>
  );
};

export default Transactions;
