export interface IOrganization {
  id: string;
  name: string;
  officialEmail: string;
  website?: string;
  address: {
    venueName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    additionalInfo?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  numberOfPeopleAllowed?: number;
  subscription?: string;
}

export type OrganizationCreatePayload = Pick<IOrganization, "name" | "officialEmail" | "address"> &
  Partial<Pick<IOrganization, "website">>;

export type OrganizationUpdatePayload = Partial<Omit<IOrganization, "id">>;
