class MockService {
  constructor() {
    this.subscriptions = new Map();
    this.payments = new Map();
    this.webhooks = [];
  }

  // Mock Stripe-like functionality
  async createSubscription(customerId, planId) {
    const subscription = {
      id: `sub_${Date.now()}`,
      customer: customerId,
      plan: planId,
      status: 'active',
      current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,
      created: Date.now()
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async cancelSubscription(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.status = 'canceled';
      subscription.canceled_at = Date.now();
      this.subscriptions.set(subscriptionId, subscription);
    }
    return subscription;
  }

  // Mock Coinbase-like functionality
  async createCharge(amount, currency, metadata) {
    const charge = {
      id: `ch_${Date.now()}`,
      amount,
      currency,
      metadata,
      status: 'pending',
      created: Date.now(),
      timeline: [{
        status: 'pending',
        time: Date.now()
      }]
    };
    this.payments.set(charge.id, charge);
    return charge;
  }

  async confirmCharge(chargeId) {
    const charge = this.payments.get(chargeId);
    if (charge) {
      charge.status = 'confirmed';
      charge.timeline.push({
        status: 'confirmed',
        time: Date.now()
      });
      this.payments.set(chargeId, charge);
    }
    return charge;
  }

  // Mock webhook functionality
  async simulateWebhook(type, data) {
    const webhook = {
      id: `evt_${Date.now()}`,
      type,
      data,
      created: Date.now()
    };
    this.webhooks.push(webhook);
    return webhook;
  }

  // Mock analytics
  async trackEvent(category, action, properties = {}) {
    console.log('Analytics Event:', {
      category,
      action,
      properties,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  // Mock email service
  async sendEmail(to, subject, template, data) {
    console.log('Email would be sent:', {
      to,
      subject,
      template,
      data,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  // Mock health check
  async checkHealth() {
    return {
      status: 'healthy',
      services: {
        mock: 'healthy'
      },
      timestamp: new Date().toISOString()
    };
  }
}

export const mockService = new MockService(); 