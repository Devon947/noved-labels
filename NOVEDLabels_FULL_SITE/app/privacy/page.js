import React from 'react';
import MetaTags from '../components/MetaTags';

export default function PrivacyPage() {
  return (
    <>
      <MetaTags title="Privacy Policy - NOVED Labels" description="Read our privacy policy to learn how we protect your data." />
      <div className="max-w-3xl mx-auto py-12 px-4 text-white">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          NOVED Labels ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Personal information (such as name, email, address) you provide when registering or using our services.</li>
          <li>Payment and billing information processed securely via Stripe.</li>
          <li>Usage data and analytics to improve our services.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To provide and maintain our services.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate with you about your account or updates.</li>
          <li>To improve our website and offerings.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Share Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>We do not sell your personal information.</li>
          <li>We may share information with trusted third parties (such as payment processors) as needed to provide our services.</li>
          <li>We may disclose information if required by law.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You may access, update, or delete your personal information at any time by contacting us.</li>
          <li>You may opt out of marketing communications at any time.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@novedlabels.com" className="text-blue-400 underline">support@novedlabels.com</a>.
        </p>
      </div>
    </>
  );
} 