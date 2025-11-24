'use client';

import Link from 'next/link';

export default function Compliance() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compliance & Regulatory Framework</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 24, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Compliance</h2>
              <p className="text-gray-700 mb-4">
                IME Capital Trust is committed to operating with the highest standards of regulatory compliance and ethical business practices. We adhere to applicable securities laws, anti-money laundering regulations, and investor protection requirements across all jurisdictions where we operate.
              </p>
              <p className="text-gray-700 mb-4">
                Our compliance program is designed to ensure transparency, protect investors, and maintain the integrity of our tokenization platform while fostering innovation in the digital securities space.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Compliance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Securities Regulations</h3>
              <p className="text-gray-700 mb-4">
                Our tokenized assets may be considered securities under applicable laws. We comply with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>SEC Regulations (United States):</strong> Registration requirements, exemptions (Regulation D, Regulation A+, Regulation S), and ongoing reporting obligations</li>
                <li><strong>MiFID II (European Union):</strong> Markets in Financial Instruments Directive compliance for EU investors</li>
                <li><strong>FCA Requirements (United Kingdom):</strong> Financial Conduct Authority regulations for digital securities</li>
                <li><strong>Local Securities Laws:</strong> Compliance with securities regulations in each jurisdiction where we offer services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accredited Investor Requirements</h3>
              <p className="text-gray-700 mb-4">
                Depending on the offering and jurisdiction, certain investments may be limited to accredited investors who meet specific income or net worth thresholds:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Annual income exceeding $200,000 (or $300,000 with spouse) for the past two years</li>
                <li>Net worth exceeding $1,000,000 (excluding primary residence)</li>
                <li>Professional certifications or qualifications (e.g., Series 7, Series 65)</li>
                <li>Entity investors with assets exceeding $5,000,000</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Know Your Customer (KYC) and Anti-Money Laundering (AML)</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">KYC Procedures</h3>
              <p className="text-gray-700 mb-4">
                We implement robust identity verification procedures to comply with KYC requirements:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Identity Verification:</strong> Government-issued ID verification (passport, driver's license, national ID)</li>
                <li><strong>Address Verification:</strong> Utility bills, bank statements, or official documents</li>
                <li><strong>Biometric Verification:</strong> Liveness detection and facial recognition (where applicable)</li>
                <li><strong>Enhanced Due Diligence (EDD):</strong> Additional verification for high-risk investors or large transactions</li>
                <li><strong>Ongoing Monitoring:</strong> Periodic re-verification and transaction monitoring</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">AML Compliance</h3>
              <p className="text-gray-700 mb-4">
                We maintain a comprehensive AML program to prevent money laundering and terrorist financing:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Customer Risk Assessment:</strong> Risk-based approach to customer onboarding and monitoring</li>
                <li><strong>Transaction Monitoring:</strong> Automated systems to detect suspicious activities</li>
                <li><strong>Suspicious Activity Reporting (SAR):</strong> Timely filing of SARs with FinCEN and other authorities</li>
                <li><strong>Sanctions Screening:</strong> Screening against OFAC, EU, and UN sanctions lists</li>
                <li><strong>Currency Transaction Reporting (CTR):</strong> Reporting of large transactions as required</li>
                <li><strong>Record Keeping:</strong> Maintenance of transaction records for required periods</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Politically Exposed Persons (PEP)</h3>
              <p className="text-gray-700 mb-4">
                We apply enhanced due diligence for politically exposed persons and their family members, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Source of funds verification</li>
                <li>Purpose of investment documentation</li>
                <li>Senior management approval for account opening</li>
                <li>Ongoing enhanced monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection and Privacy</h2>
              <p className="text-gray-700 mb-4">
                We comply with global data protection regulations:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>GDPR (EU):</strong> General Data Protection Regulation compliance for EU residents</li>
                <li><strong>CCPA/CPRA (California):</strong> California Consumer Privacy Act and amendments</li>
                <li><strong>LGPD (Brazil):</strong> Lei Geral de Proteção de Dados compliance</li>
                <li><strong>PDPA (Singapore):</strong> Personal Data Protection Act compliance</li>
              </ul>
              <p className="text-gray-700 mb-4">
                For details on how we handle your data, please review our <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Blockchain and Technology Compliance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hyperledger Fabric Implementation</h3>
              <p className="text-gray-700 mb-4">
                Our platform is built on Hyperledger Fabric, an enterprise-grade permissioned blockchain that provides:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Privacy:</strong> Private transactions and confidential data storage</li>
                <li><strong>Permissioned Access:</strong> Controlled access to blockchain network</li>
                <li><strong>Regulatory Compliance:</strong> Ability to meet regulatory requirements for data privacy and auditability</li>
                <li><strong>Immutability:</strong> Tamper-proof transaction records</li>
                <li><strong>Transparency:</strong> Full audit trail for regulators and compliance officers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Contract Audits</h3>
              <p className="text-gray-700 mb-4">
                All smart contracts undergo rigorous security audits by independent third parties to ensure:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Code security and vulnerability assessment</li>
                <li>Compliance with regulatory requirements</li>
                <li>Accurate implementation of business logic</li>
                <li>Protection against common attack vectors</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Investor Protection</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Disclosure Requirements</h3>
              <p className="text-gray-700 mb-4">
                We provide comprehensive disclosures to investors, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Detailed asset information and documentation</li>
                <li>Risk factors and investment warnings</li>
                <li>Fee structures and costs</li>
                <li>Rights and obligations of token holders</li>
                <li>Financial statements and performance data</li>
                <li>Regulatory status and compliance information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conflicts of Interest</h3>
              <p className="text-gray-700 mb-4">
                We identify and disclose potential conflicts of interest and maintain policies to manage them appropriately.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fair Dealing</h3>
              <p className="text-gray-700 mb-4">
                We are committed to treating all investors fairly and prohibit:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Market manipulation</li>
                <li>Insider trading</li>
                <li>Front-running</li>
                <li>Misleading or deceptive conduct</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Program Structure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance Officer</h3>
              <p className="text-gray-700 mb-4">
                Our Chief Compliance Officer oversees all compliance activities and reports directly to senior management and the board of directors.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Policies and Procedures</h3>
              <p className="text-gray-700 mb-4">
                We maintain written policies and procedures covering:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>KYC/AML procedures</li>
                <li>Securities law compliance</li>
                <li>Data protection and privacy</li>
                <li>Cybersecurity and information security</li>
                <li>Business continuity and disaster recovery</li>
                <li>Conflicts of interest management</li>
                <li>Employee conduct and ethics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Training and Education</h3>
              <p className="text-gray-700 mb-4">
                All employees receive regular training on:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Compliance requirements and procedures</li>
                <li>AML/KYC protocols</li>
                <li>Fraud detection and prevention</li>
                <li>Data protection and privacy</li>
                <li>Ethical business practices</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Independent Reviews and Audits</h3>
              <p className="text-gray-700 mb-4">
                We conduct periodic independent reviews and audits of our compliance program to ensure effectiveness and identify areas for improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Registrations and Licenses</h2>
              <p className="text-gray-700 mb-4">
                IME Capital Trust maintains appropriate registrations and licenses as required:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Securities broker-dealer registration (where applicable)</li>
                <li>Alternative Trading System (ATS) registration (where applicable)</li>
                <li>Money services business (MSB) registration</li>
                <li>Virtual asset service provider (VASP) registration (where applicable)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Registration numbers and status information are available upon request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting and Cooperation</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Regulatory Reporting</h3>
              <p className="text-gray-700 mb-4">
                We file all required reports with relevant regulatory authorities, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Form D filings for Regulation D offerings</li>
                <li>Suspicious Activity Reports (SARs)</li>
                <li>Currency Transaction Reports (CTRs)</li>
                <li>Annual audited financial statements</li>
                <li>Ongoing disclosure reports</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cooperation with Authorities</h3>
              <p className="text-gray-700 mb-4">
                We maintain a cooperative relationship with regulatory authorities and law enforcement agencies, responding promptly to inquiries and providing requested information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Whistleblower Protection</h2>
              <p className="text-gray-700 mb-4">
                We encourage the reporting of potential compliance violations and provide protection for whistleblowers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Confidential reporting channels</li>
                <li>Non-retaliation policy</li>
                <li>Investigation of reported concerns</li>
                <li>Corrective action where appropriate</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To report a compliance concern, please contact: <a href="mailto:compliance@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">compliance@imecapitaltrust.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates and Changes</h2>
              <p className="text-gray-700 mb-4">
                Our compliance program is regularly reviewed and updated to reflect changes in:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Applicable laws and regulations</li>
                <li>Industry best practices</li>
                <li>Business operations and risk profile</li>
                <li>Technology and security standards</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Material changes to our compliance framework will be communicated to affected parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Our Compliance Team</h2>
              <p className="text-gray-700 mb-4">
                For questions about our compliance program or to report concerns:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Compliance Department</p>
                <p className="text-gray-700 font-semibold mb-2">IME Capital Trust</p>
                <p className="text-gray-700">Email: <a href="mailto:compliance@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">compliance@imecapitaltrust.com</a></p>
                <p className="text-gray-700">Phone: <a href="tel:+12486784819" className="text-primary-600 hover:text-primary-700">(248) 678-4819</a></p>
                <p className="text-gray-700">Confidential Hotline: [Hotline Number]</p>
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
