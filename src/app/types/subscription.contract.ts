export interface ISubscription {
  _id: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  lastPaymentAt?: Date;
  entityType: "user" | "organization";
  entityId: string;
  plan: "individual" | "organization_10" | "organization_20" | "organization_50";
}
