import React from 'react';
import MetaTags from '../components/MetaTags';

export default function TermsPage() {
  return (
    <>
      <MetaTags title="Terms of Service - NOVED Labels" description="Read our terms of service to understand your rights and responsibilities." />
      <div className="max-w-3xl mx-auto py-12 px-4 text-white">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          By using NOVED Labels ("we", "us", or "our") and our services, you agree to these Terms of Service. Please read them carefully.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You must be at least 18 years old or have parental consent to use our services.</li>
          <li>You agree to provide accurate and complete information when registering.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">2. Payments & Subscriptions</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>All payments are processed securely via Stripe.</li>
          <li>Subscription fees are billed monthly and are non-refundable except as required by law.</li>
          <li>You may cancel your subscription at any time; access will continue until the end of the billing period.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">3. Prohibited Activities</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You may not use our services for any unlawful or fraudulent purpose.</li>
          <li>You may not attempt to gain unauthorized access to our systems or data.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">4. Intellectual Property</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>All content, trademarks, and data on this site are the property of NOVED Labels or its licensors.</li>
          <li>You may not copy, modify, or distribute any part of our service without permission.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">5. Limitation of Liability</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</li>
          <li>Our total liability is limited to the amount you have paid us in the past 12 months.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to Terms</h2>
        <p className="mb-4">We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms on our website.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at <a href="mailto:support@novedlabels.com" className="text-blue-400 underline">support@novedlabels.com</a>.
        </p>
      </div>
    </>
  );
} 