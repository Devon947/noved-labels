// Base shipping provider interface
export class ShippingProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async validateAddress(address) {
    throw new Error('Method not implemented');
  }

  async getRates(fromAddress, toAddress, parcel) {
    throw new Error('Method not implemented');
  }

  async createLabel(fromAddress, toAddress, parcel, service) {
    throw new Error('Method not implemented');
  }

  async trackShipment(trackingNumber) {
    throw new Error('Method not implemented');
  }
}

// Common address format
export const AddressFormat = {
  name: '',
  company: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  phone: '',
  email: ''
};

// Common parcel format
export const ParcelFormat = {
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  predefined_package: null
};

// Common rate format
export const RateFormat = {
  provider: '',
  carrier: '',
  service: '',
  rate: 0,
  currency: 'USD',
  delivery_days: 0,
  delivery_date: null
};

// Common label format
export const LabelFormat = {
  tracking_number: '',
  label_url: '',
  rate: 0,
  currency: 'USD',
  provider: '',
  carrier: '',
  service: ''
}; 