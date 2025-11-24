'use client';

import Link from 'next/link';

export default function Security() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Trust</h1>
          <p className="text-gray-600 mb-8">Our commitment to protecting your assets and data</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Overview</h2>
              <p className="text-gray-700 mb-4">
                At IME Capital Trust, security is not just a feature—it's the foundation of everything we do. We employ enterprise-grade security measures, industry best practices, and cutting-edge technology to protect your investments and personal information.
              </p>
              <p className="text-gray-700 mb-4">
                Our multi-layered security approach combines blockchain technology, advanced encryption, rigorous access controls, and continuous monitoring to ensure the highest level of protection for your digital assets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Blockchain Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hyperledger Fabric Architecture</h3>
              <p className="text-gray-700 mb-4">
                Our platform is built on Hyperledger Fabric 2.2+, an enterprise-grade permissioned blockchain that provides:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Immutability:</strong> All transactions are cryptographically secured and cannot be altered or deleted</li>
                <li><strong>Distributed Consensus:</strong> Multiple nodes validate transactions before they are committed to the ledger</li>
                <li><strong>Permissioned Access:</strong> Only authorized participants can access the network</li>
                <li><strong>Private Transactions:</strong> Confidential transactions are visible only to authorized parties</li>
                <li><strong>Audit Trail:</strong> Complete transaction history is maintained for compliance and verification</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Contract Security</h3>
              <p className="text-gray-700 mb-4">
                All smart contracts undergo rigorous security audits:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Independent third-party security audits before deployment</li>
                <li>Formal verification of critical contract logic</li>
                <li>Protection against common vulnerabilities (reentrancy, overflow, etc.)</li>
                <li>Access control mechanisms to prevent unauthorized operations</li>
                <li>Emergency pause functionality for critical situations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Managed Infrastructure</h3>
              <p className="text-gray-700 mb-4">
                We leverage Spydra's managed Fabric infrastructure, which provides:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>99.9% uptime SLA with redundant nodes</li>
                <li>Automatic failover and disaster recovery</li>
                <li>Regular security patches and updates</li>
                <li>24/7 infrastructure monitoring</li>
                <li>DDoS protection and network security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Encryption</h3>
              <p className="text-gray-700 mb-4">
                We protect your data with military-grade encryption:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>In Transit:</strong> TLS 1.3 encryption for all data transmitted between clients and servers</li>
                <li><strong>At Rest:</strong> AES-256 encryption for all stored data</li>
                <li><strong>End-to-End:</strong> Private keys and sensitive data are encrypted end-to-end</li>
                <li><strong>Key Management:</strong> Hardware Security Modules (HSMs) for cryptographic key storage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Isolation</h3>
              <p className="text-gray-700 mb-4">
                Your data is protected through multiple isolation layers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Dedicated database instances for different data classifications</li>
                <li>Network segmentation and firewalls</li>
                <li>Containerized application environments</li>
                <li>Private blockchain channels for sensitive transactions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Backup and Recovery</h3>
              <p className="text-gray-700 mb-4">
                We maintain comprehensive backup and disaster recovery procedures:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Automated daily backups with encryption</li>
                <li>Geographically distributed backup storage</li>
                <li>Regular restoration testing</li>
                <li>Blockchain ledger redundancy across multiple nodes</li>
                <li>Recovery Time Objective (RTO): 4 hours</li>
                <li>Recovery Point Objective (RPO): 1 hour</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Control</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Factor Authentication (MFA)</h3>
              <p className="text-gray-700 mb-4">
                We require multi-factor authentication for all user accounts:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>SMS-based one-time passwords (OTP)</li>
                <li>Authenticator apps (Google Authenticator, Authy)</li>
                <li>Hardware security keys (YubiKey, Titan)</li>
                <li>Biometric authentication (where supported)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Based Access Control (RBAC)</h3>
              <p className="text-gray-700 mb-4">
                Access to platform features and data is controlled through RBAC:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Principle of least privilege</li>
                <li>Separation of duties for critical operations</li>
                <li>Regular access reviews and audits</li>
                <li>Automatic session timeouts</li>
                <li>IP whitelisting for administrative access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Wallet Security</h3>
              <p className="text-gray-700 mb-4">
                Digital asset wallets are protected with multiple security layers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Private keys stored in Hardware Security Modules (HSMs)</li>
                <li>Multi-signature requirements for large transactions</li>
                <li>Cold storage for majority of assets</li>
                <li>Hot wallet insurance coverage</li>
                <li>Transaction velocity limits and alerts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Development Lifecycle</h3>
              <p className="text-gray-700 mb-4">
                Security is integrated into every phase of development:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Security requirements in design phase</li>
                <li>Secure coding standards and guidelines</li>
                <li>Automated security testing in CI/CD pipeline</li>
                <li>Code review by security experts</li>
                <li>Dependency scanning and vulnerability management</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Penetration Testing</h3>
              <p className="text-gray-700 mb-4">
                We conduct regular security assessments:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Annual third-party penetration testing</li>
                <li>Quarterly vulnerability assessments</li>
                <li>Bug bounty program for responsible disclosure</li>
                <li>Red team exercises to test incident response</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Web Application Security</h3>
              <p className="text-gray-700 mb-4">
                Our web applications are protected against common vulnerabilities:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Protection against OWASP Top 10 vulnerabilities</li>
                <li>Cross-Site Scripting (XSS) prevention</li>
                <li>SQL injection prevention</li>
                <li>Cross-Site Request Forgery (CSRF) protection</li>
                <li>Clickjacking protection</li>
                <li>Content Security Policy (CSP) implementation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Monitoring and Detection</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Security Operations Center (SOC)</h3>
              <p className="text-gray-700 mb-4">
                Our SOC provides round-the-clock monitoring:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Real-time threat detection and alerting</li>
                <li>Security Information and Event Management (SIEM)</li>
                <li>Intrusion Detection and Prevention Systems (IDS/IPS)</li>
                <li>Log aggregation and analysis</li>
                <li>Automated incident response workflows</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fraud Detection</h3>
              <p className="text-gray-700 mb-4">
                Advanced fraud detection systems protect against malicious activity:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Machine learning-based anomaly detection</li>
                <li>Behavioral analytics for user activity</li>
                <li>Transaction pattern analysis</li>
                <li>Automated blocking of suspicious accounts</li>
                <li>KYC/AML monitoring and sanctions screening</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Threat Intelligence</h3>
              <p className="text-gray-700 mb-4">
                We stay ahead of emerging threats through:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Integration with threat intelligence feeds</li>
                <li>Participation in information sharing communities</li>
                <li>Regular threat modeling exercises</li>
                <li>Proactive vulnerability scanning</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Incident Response</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Incident Response Plan</h3>
              <p className="text-gray-700 mb-4">
                We maintain a comprehensive incident response plan:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Preparation:</strong> Regular training and simulation exercises</li>
                <li><strong>Detection:</strong> 24/7 monitoring and alerting</li>
                <li><strong>Containment:</strong> Rapid isolation of affected systems</li>
                <li><strong>Eradication:</strong> Removal of threats and vulnerabilities</li>
                <li><strong>Recovery:</strong> Restoration of services and data</li>
                <li><strong>Lessons Learned:</strong> Post-incident analysis and improvements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Communication</h3>
              <p className="text-gray-700 mb-4">
                In the event of a security incident, we commit to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Prompt notification of affected users</li>
                <li>Transparent communication about the incident</li>
                <li>Regular updates during investigation and remediation</li>
                <li>Detailed post-incident reports</li>
                <li>Compliance with breach notification requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance and Certifications</h2>
              <p className="text-gray-700 mb-4">
                We maintain industry-standard security certifications:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>SOC 2 Type II:</strong> Audited controls for security, availability, and confidentiality</li>
                <li><strong>ISO 27001:</strong> Information Security Management System certification (in progress)</li>
                <li><strong>PCI DSS:</strong> Payment Card Industry Data Security Standard (where applicable)</li>
                <li><strong>GDPR:</strong> Compliance with EU data protection regulations</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Certification reports are available to qualified parties under NDA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Security Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Security is a shared responsibility. We recommend that you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Use Strong Passwords:</strong> Create unique, complex passwords for your account</li>
                <li><strong>Enable MFA:</strong> Always use multi-factor authentication</li>
                <li><strong>Secure Your Devices:</strong> Keep software updated and use antivirus protection</li>
                <li><strong>Beware of Phishing:</strong> Verify the authenticity of emails and links</li>
                <li><strong>Protect Private Keys:</strong> Never share wallet private keys or recovery phrases</li>
                <li><strong>Use Secure Networks:</strong> Avoid public Wi-Fi for financial transactions</li>
                <li><strong>Monitor Your Account:</strong> Regularly review account activity</li>
                <li><strong>Report Suspicious Activity:</strong> Contact us immediately if you notice anything unusual</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Research and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsible Disclosure Program</h3>
              <p className="text-gray-700 mb-4">
                We welcome reports from security researchers and offer:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Bug bounty rewards for qualifying vulnerabilities</li>
                <li>Recognition in our security hall of fame</li>
                <li>Safe harbor for good-faith security research</li>
                <li>Prompt investigation and remediation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Report</h3>
              <p className="text-gray-700 mb-4">
                To report a security vulnerability:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">Email: <a href="mailto:security@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">security@imecapitaltrust.com</a></p>
                <p className="text-gray-700">PGP Key: [PGP Key Fingerprint]</p>
                <p className="text-gray-700 mt-2">Please include:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                  <li>Detailed description of the vulnerability</li>
                  <li>Steps to reproduce</li>
                  <li>Potential impact</li>
                  <li>Any proof-of-concept code</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Security Team</h2>
              <p className="text-gray-700 mb-4">
                For security-related inquiries or to report concerns:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Security Team</p>
                <p className="text-gray-700 font-semibold mb-2">IME Capital Trust</p>
                <p className="text-gray-700">Email: <a href="mailto:security@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">security@imecapitaltrust.com</a></p>
                <p className="text-gray-700">Security Hotline: [Hotline Number]</p>
                <p className="text-gray-700">Response Time: Within 24 hours for critical issues</p>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <p className="text-sm text-gray-700">
                <strong>Security is Our Priority:</strong> We continuously invest in security measures to protect your assets and data. If you have questions or concerns about our security practices, please don't hesitate to contact us.
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
