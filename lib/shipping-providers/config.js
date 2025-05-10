export const shippingProviders = {
  easypost: {
    name: 'EasyPost',
    logo: '/images/providers/easypost.svg',
    features: [
      'Multiple carrier options',
      'Real-time tracking',
      'Address verification',
      'Batch label creation'
    ],
    apiKeyRequired: true,
    website: 'https://www.easypost.com',
    supported_carriers: [
      'USPS',
      'UPS',
      'FedEx',
      'DHL'
    ]
  },
  pirateship: {
    name: 'PirateShip',
    logo: '/images/providers/pirateship.svg',
    features: [
      'USPS Commercial Plus® Pricing',
      'Free address verification',
      'No markup on labels',
      'No monthly fees'
    ],
    apiKeyRequired: true,
    website: 'https://www.pirateship.com',
    supported_carriers: [
      'USPS'
    ]
  },
  stampscom: {
    name: 'Stamps.com',
    logo: '/images/providers/stamps.svg',
    features: [
      'USPS postage printing',
      'Discounted rates',
      'Business tools',
      'Integration options'
    ],
    apiKeyRequired: true,
    website: 'https://www.stamps.com',
    supported_carriers: [
      'USPS'
    ]
  },
  shippo: {
    name: 'Shippo',
    logo: '/images/providers/shippo.svg',
    features: [
      'Multi-carrier shipping',
      'Pay-as-you-go pricing',
      'Order management',
      'Returns management'
    ],
    apiKeyRequired: true,
    website: 'https://goshippo.com',
    supported_carriers: [
      'USPS',
      'UPS',
      'FedEx',
      'DHL'
    ]
  }
}; 