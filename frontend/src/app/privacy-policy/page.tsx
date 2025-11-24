'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 24, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to IME Capital Trust ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform for real-world asset tokenization.
              </p>
              <p className="text-gray-700 mb-4">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Government-issued identification documents for KYC/AML compliance</li>
                <li>Financial information including bank account details and investment history</li>
                <li>Blockchain wallet addresses</li>
                <li>Tax identification numbers and related documentation</li>
                <li>Employment and income information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Transaction Information</h3>
              <p className="text-gray-700 mb-4">We collect information about your transactions on our platform:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Asset purchases and sales</li>
                <li>Token transfers and holdings</li>
                <li>Payment methods and transaction history</li>
                <li>Blockchain transaction records</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Technical Information</h3>
              <p className="text-gray-700 mb-4">We automatically collect certain information:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Compliance:</strong> To comply with KYC, AML, and regulatory requirements</li>
                <li><strong>Transaction Processing:</strong> To process your investments and token transfers</li>
                <li><strong>Communication:</strong> To send you updates, notifications, and marketing materials</li>
                <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
                <li><strong>Analytics:</strong> To improve our services and user experience</li>
                <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Third-Party Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party service providers who assist us in:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Identity verification and KYC/AML compliance</li>
                <li>Payment processing</li>
                <li>Blockchain infrastructure services (e.g., Spydra)</li>
                <li>Analytics and marketing services</li>
                <li>Legal and compliance services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law or to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Comply with legal processes or government requests</li>
                <li>Enforce our terms and conditions</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate potential violations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Blockchain Transparency</h3>
              <p className="text-gray-700 mb-4">
                Please note that transactions on the Hyperledger Fabric blockchain are recorded permanently and may be visible to authorized network participants.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure blockchain infrastructure on Hyperledger Fabric</li>
                <li>Employee training on data protection</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-Out:</strong> Opt-out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at: <a href="mailto:privacy@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">privacy@imecapitaltrust.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Provide our services to you</li>
                <li>Comply with legal and regulatory requirements (typically 7 years for financial records)</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="text-gray-700 mb-4">
                After this period, we will securely delete or anonymize your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content</li>
                <li>Enhance security</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. However, disabling cookies may affect platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Posting the updated policy on our platform</li>
                <li>Sending you an email notification</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">IME Capital Trust</p>
                <p className="text-gray-700">Email: <a href="mailto:privacy@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">privacy@imecapitaltrust.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+12486784819" className="text-primary-600 hover:text-primary-700">(248) 678-4819</a></p>
                <p className="text-gray-700">Address: [Company Address]</p>
              </div>
            </section>
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
