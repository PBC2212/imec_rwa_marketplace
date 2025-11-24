'use client';

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="IME Capital Trust" 
              className="h-12 w-12"
            />
            <h1 className="text-2xl font-bold text-primary-600">IME Capital Trust</h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 24, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and IME Capital Trust ("Company," "we," "us," or "our") regarding your use of our real-world asset tokenization platform and related services (collectively, the "Services").
              </p>
              <p className="text-gray-700 mb-4">
                BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR SERVICES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p className="text-gray-700 mb-4">To use our Services, you must:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using our Services under applicable laws</li>
                <li>Complete our KYC/AML verification process</li>
                <li>Be an accredited investor (where required by law)</li>
                <li>Comply with all applicable securities laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration and Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                You must create an account to access certain features. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Verification</h3>
              <p className="text-gray-700 mb-4">
                We require identity verification to comply with KYC/AML regulations. You agree to provide all requested documentation and information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Platform Services</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Asset Tokenization</h3>
              <p className="text-gray-700 mb-4">
                Our platform facilitates the tokenization of real-world assets on Hyperledger Fabric blockchain. Tokenized assets represent fractional ownership interests in underlying physical assets.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Token Trading</h3>
              <p className="text-gray-700 mb-4">
                Subject to applicable securities laws, you may buy, sell, or transfer tokens through our platform. All transactions are recorded on the blockchain and are irreversible.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Wallet Services</h3>
              <p className="text-gray-700 mb-4">
                We provide blockchain wallet services to hold your tokens. You are responsible for maintaining the security of your wallet credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Investment Risks</h2>
              <p className="text-gray-700 mb-4">
                <strong>INVESTING IN TOKENIZED ASSETS INVOLVES SIGNIFICANT RISK. YOU MAY LOSE SOME OR ALL OF YOUR INVESTMENT.</strong>
              </p>
              <p className="text-gray-700 mb-4">You acknowledge and accept the following risks:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Market Risk:</strong> Asset values may fluctuate significantly</li>
                <li><strong>Liquidity Risk:</strong> You may not be able to sell tokens quickly or at favorable prices</li>
                <li><strong>Technology Risk:</strong> Blockchain technology is subject to technical failures</li>
                <li><strong>Regulatory Risk:</strong> Laws governing tokenized assets are evolving</li>
                <li><strong>Counterparty Risk:</strong> Asset owners or operators may default on obligations</li>
                <li><strong>Loss of Private Keys:</strong> Lost wallet credentials cannot be recovered</li>
                <li><strong>Smart Contract Risk:</strong> Code vulnerabilities may result in loss of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Fees and Payments</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Platform Fees</h3>
              <p className="text-gray-700 mb-4">
                We charge fees for certain services, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Transaction fees for buying or selling tokens</li>
                <li>Asset management fees (if applicable)</li>
                <li>Withdrawal fees</li>
                <li>Other fees as disclosed on our platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Payment Terms</h3>
              <p className="text-gray-700 mb-4">
                All fees are non-refundable unless otherwise stated. We may change our fee structure with 30 days' notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Engage in market manipulation or fraudulent activities</li>
                <li>Use our Services for money laundering or terrorist financing</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reverse engineer or copy our platform</li>
                <li>Use automated systems (bots) without permission</li>
                <li>Interfere with the proper functioning of our Services</li>
                <li>Impersonate any person or entity</li>
                <li>Transmit malware or harmful code</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Our Property</h3>
              <p className="text-gray-700 mb-4">
                All content, features, and functionality of our Services are owned by IME Capital Trust and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 Limited License</h3>
              <p className="text-gray-700 mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 No Warranties</h3>
              <p className="text-gray-700 mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IME CAPITAL TRUST SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR INVESTMENTS.
              </p>
              <p className="text-gray-700 mb-4">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless IME Capital Trust and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Your use of our Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 By You</h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time by contacting us. You remain liable for all transactions completed before termination.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 By Us</h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your access immediately if you violate these Terms, engage in prohibited activities, or for any other reason at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">12.1 Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by the laws of [Jurisdiction], without regard to conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">12.2 Arbitration</h3>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association], except where prohibited by law.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">12.3 Class Action Waiver</h3>
              <p className="text-gray-700 mb-4">
                You agree to resolve disputes individually and waive the right to participate in class actions or class-wide arbitration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. General Provisions</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.1 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, along with our Privacy Policy and other policies, constitute the entire agreement between you and IME Capital Trust.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.2 Amendments</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes. Your continued use after changes constitutes acceptance.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.3 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision is found unenforceable, the remaining provisions shall remain in full effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.4 Waiver</h3>
              <p className="text-gray-700 mb-4">
                Our failure to enforce any provision shall not constitute a waiver of that provision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">IME Capital Trust</p>
                <p className="text-gray-700">Email: <a href="mailto:legal@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">legal@imecapitaltrust.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+12486784819" className="text-primary-600 hover:text-primary-700">(248) 678-4819</a></p>
                <p className="text-gray-700">Address: [Company Address]</p>
              </div>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <p className="text-sm text-gray-700">
                <strong>Important Notice:</strong> By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 IME Capital Trust. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
