export interface Address {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Package {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value?: number;
  description?: string;
}

export interface ShippingRate {
  provider: string;
  service: string;
  rate: number;
  currency: string;
  deliveryDays: number;
  guaranteed: boolean;
}

export interface ShippingLabel {
  id: string;
  provider: string;
  trackingNumber: string;
  labelUrl: string;
  rate: number;
  service: string;
  createdAt: string;
  from: Address;
  to: Address;
  package: Package;
}

export interface ShippingProvider {
  id: string;
  name: string;
  features: string[];
  apiKeyRequired: boolean;
  configured?: boolean;
}

export interface ShippingFormData {
  fromName: string;
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZip: string;
  fromCountry: string;
  toName: string;
  toAddress: string;
  toCity: string;
  toState: string;
  toZip: string;
  toCountry: string;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ValidationErrors {
  [key: string]: string | undefined;
} 