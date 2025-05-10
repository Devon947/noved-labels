import { ShippingProvider } from './interfaces';

export class EasyPostProvider extends ShippingProvider {
  constructor(apiKey) {
    super(apiKey);
    this.client = require('@easypost/api')(apiKey);
  }

  async validateAddress(address) {
    try {
      const verifiedAddress = await this.client.Address.create(address);
      await verifiedAddress.verify();
      return {
        success: true,
        address: verifiedAddress
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
      const shipment = await this.client.Shipment.create({
        from_address: fromAddress,
        to_address: toAddress,
        parcel: parcel
      });

      return {
        success: true,
        rates: shipment.rates.map(rate => ({
          provider: 'easypost',
          provider_name: 'Premium Service',
          carrier: rate.carrier,
          service: rate.service,
          rate: rate.rate,
          currency: rate.currency,
          delivery_days: rate.delivery_days,
          delivery_date: rate.delivery_date
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
      const shipment = await this.client.Shipment.create({
        from_address: fromAddress,
        to_address: toAddress,
        parcel: parcel
      });

      const boughtShipment = await shipment.buy(
        shipment.lowestRate([service])
      );

      return {
        success: true,
        label: {
          tracking_number: boughtShipment.tracking_code,
          label_url: boughtShipment.postage_label.label_url,
          rate: boughtShipment.selected_rate.rate,
          currency: boughtShipment.selected_rate.currency,
          provider: 'easypost',
          provider_name: 'Premium Service',
          carrier: boughtShipment.selected_rate.carrier,
          service: boughtShipment.selected_rate.service
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
      const tracker = await this.client.Tracker.create({
        tracking_code: trackingNumber
      });

      return {
        success: true,
        tracking: {
          status: tracker.status,
          eta: tracker.est_delivery_date,
          tracking_details: tracker.tracking_details
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