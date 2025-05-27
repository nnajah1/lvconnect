

import React from 'react';
import { Button } from '@/components/ui/button'; 
import { useNavigate } from 'react-router-dom'; 

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-muted flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl p-4 rounded-lg shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-gray-700 text-sm">
              We value your privacy and are committed to protecting your personal information.
              This privacy policy explains how we collect, use, and safeguard your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p className="text-gray-700 text-sm">
              We may collect personal data including your name, email address, and any other
              information you voluntarily provide when using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p className="text-gray-700 text-sm">
              Your information is used to provide and improve our services, communicate with you,
              and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p className="text-gray-700 text-sm">
              We implement appropriate security measures to protect your data from unauthorized access,
              alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p className="text-gray-700 text-sm">
              You have the right to access, correct, or delete your personal information. Contact us
              to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Updates to This Policy</h2>
            <p className="text-gray-700 text-sm">
              We may update this policy from time to time. Any changes will be posted on this page
              with an updated effective date.
            </p>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => navigate(-1)} variant="outline">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
