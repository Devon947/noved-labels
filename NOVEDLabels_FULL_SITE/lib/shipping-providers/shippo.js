import { ShippingProvider } from './interfaces';

export class ShippoProvider extends ShippingProvider {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = 'https://api.goshippo.com';
  }

  async makeRequest(endpoint, method, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Authorization': `ShippoToken ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    consts response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shippo API Error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  async validateAddress(address) {
    try {
      const shippoAddress = {
        name: address.name,
        company: address.company,
        street1: address.street1,
        street2: address.street2 || '',
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
        email: address.email,
        validate: true
      };

      const result = await this.makeRequest('/addresses/', 'POST', shippoAddress);
      
      return {
        success: true,
        address: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getRates(fromAddress, toAddress, parcel) {
    try {
      // Create shipment to get rates
      const shipment = {
        address_from: fromAddress,
        address_to: toAddress,
        parcels: [{
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          distance_unit: 'in',
          weight: parcel.weight,
          mass_unit: 'oz'
        }],
        async: false
      };

      const result = await this.makeRequest('/shipments/', 'POST', shipment);

      return {
        success: true,
        rates: result.rates.map(rate => ({
          provider: 'shippo',
          carrier: rate.provider,
          service: rate.servicelevel.name,
          rate: parseFloat(rate.amount),
          currency: rate.currency,
          delivery_days: rate.estimated_days,
          delivery_date: rate.estimated_delivery_date
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createLabel(fromAddress, toAddress, parcel, service) {
    try {
      // First create a shipment
      const shipment = {
        address_from: fromAddress,
        address_to: toAddress,
        parcels: [{
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          distance_unit: 'in',
          weight: parcel.weight,
          mass_unit: 'oz'
        }],
        async: false
      };

      const shipmentResult = await this.makeRequest('/shipments/', 'POST', shipment);
      
      // Find the rate that matches our service
      const selectedRate = shipmentResult.rates.find(rate => 
        rate.servicelevel.name.toLowerCase() === service.toLowerCase()
      );
      
      if (!selectedRate) {
        throw new Error(`Service "${service}" not available for this shipment`);
      }
      
      // Create the label transaction
      const transaction = {
        rate: selectedRate.object_id,
        label_file_type: 'PDF',
        async: false
      };
      
      const label = await this.makeRequest('/transactions/', 'POST', transaction);
      
      return {
        success: true,
        label: {
          tracking_number: label.tracking_number,
          label_url: label.label_url,
          rate: parseFloat(label.rate),
          currency: label.rate_currency,
          provider: 'shippo',
          carrier: selectedRate.provider,
          service: selectedRate.servicelevel.name
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async trackShipment(trackingNumber) {
    try {
      const tracking = await this.makeRequest(`/tracks/shippo/${trackingNumber}`, 'GET');
      
      return {
        success: true,
        tracking: {
          status: tracking.tracking_status.status,
          eta: tracking.eta,
          tracking_details: tracking.tracking_history
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
} 