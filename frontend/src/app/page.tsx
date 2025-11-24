'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin' | 'investor'>('investor');

  const handleLogin = (type: 'user' | 'admin' | 'investor') => {
    setLoginType(type);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginType={loginType}
      />

      {/* Header/Navigation */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">IMEC Capital</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary-600 transition">Home</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition">About Us</a>
              <a href="#rwa" className="text-gray-700 hover:text-primary-600 transition">RWA Investing</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition">Contact</a>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLogin('investor')}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition"
              >
                Login
              </button>
              <button
                onClick={() => handleLogin('investor')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Tokenize Real World Assets with Blockchain Technology
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Unlock liquidity and democratize access to real estate, commodities, and other high-value assets through secure, transparent tokenization on Hyperledger Fabric.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleLogin('investor')}
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
                >
                  Start Investing
                </button>
                <a
                  href="#rwa"
                  className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold text-lg text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Platform Access</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => handleLogin('investor')}
                    className="w-full py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Investor Login
                  </button>
                  <button
                    onClick={() => handleLogin('user')}
                    className="w-full py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    User Login
                  </button>
                  <button
                    onClick={() => handleLogin('admin')}
                    className="w-full py-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition font-semibold flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About IMEC Capital Tokenization</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're pioneering the future of asset ownership through blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-gray-600">Built on Hyperledger Fabric blockchain for maximum security and transparency</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fractional Ownership</h3>
              <p className="text-gray-600">Invest in high-value assets with lower capital requirements</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Liquidity</h3>
              <p className="text-gray-600">Trade tokenized assets 24/7 with improved market liquidity</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  IMEC Capital Tokenization is dedicated to democratizing access to premium real-world assets through innovative blockchain technology. We bridge traditional finance with decentralized systems, creating opportunities for both institutional and retail investors.
                </p>
                <p className="text-gray-600">
                  Our platform leverages Hyperledger Fabric to ensure enterprise-grade security, compliance, and scalability, while maintaining the transparency and efficiency that blockchain technology provides.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg text-center shadow">
                  <p className="text-3xl font-bold text-primary-600 mb-2">$100M+</p>
                  <p className="text-gray-600">Assets Tokenized</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow">
                  <p className="text-3xl font-bold text-primary-600 mb-2">500+</p>
                  <p className="text-gray-600">Active Investors</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow">
                  <p className="text-3xl font-bold text-primary-600 mb-2">50+</p>
                  <p className="text-gray-600">Asset Types</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center shadow">
                  <p className="text-3xl font-bold text-primary-600 mb-2">99.9%</p>
                  <p className="text-gray-600">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RWA Investing Section */}
      <section id="rwa" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What is RWA Investing?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real World Asset (RWA) tokenization brings traditional assets onto the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2">Asset Selection</h4>
                    <p className="text-gray-600">High-value real-world assets are carefully vetted and selected for tokenization</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2">Tokenization</h4>
                    <p className="text-gray-600">Assets are converted into digital tokens on our secure Hyperledger Fabric blockchain</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2">Investment</h4>
                    <p className="text-gray-600">Investors purchase tokens representing fractional ownership of the asset</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-2">Returns & Liquidity</h4>
                    <p className="text-gray-600">Earn dividends and trade tokens on our secondary market</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Asset Classes</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
                  <h4 className="text-lg font-semibold mb-2">🏢 Real Estate</h4>
                  <p className="text-gray-600">Commercial properties, residential complexes, and development projects</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
                  <h4 className="text-lg font-semibold mb-2">💎 Commodities</h4>
                  <p className="text-gray-600">Precious metals, energy resources, and agricultural products</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
                  <h4 className="text-lg font-semibold mb-2">🎨 Art & Collectibles</h4>
                  <p className="text-gray-600">Fine art, rare collectibles, and luxury items</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
                  <h4 className="text-lg font-semibold mb-2">⚡ Infrastructure</h4>
                  <p className="text-gray-600">Renewable energy projects, transportation, and utilities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Investing?</h3>
            <p className="text-xl mb-8 opacity-90">Join hundreds of investors tokenizing real-world assets</p>
            <button
              onClick={() => handleLogin('investor')}
              className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
            >
              Create Investor Account
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We're here to help</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone</h4>
                    <a href="tel:+12486784819" className="text-primary-600 hover:text-primary-700 text-lg">
                      (248) 678-4819
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Email</h4>
                    <a href="mailto:info@imecapitaltokenization.com" className="text-primary-600 hover:text-primary-700 text-lg">
                      info@imecapitaltokenization.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Quick Access</h4>
                <p className="text-gray-600 mb-4">Already have an account? Login to your dashboard</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleLogin('investor')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                  >
                    Investor Login
                  </button>
                  <button
                    onClick={() => handleLogin('user')}
                    className="px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition text-sm font-medium"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => handleLogin('admin')}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm font-medium"
                  >
                    Admin Login
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">IMEC Capital</h3>
              <p className="text-gray-400">Tokenizing real-world assets for the future of finance</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">For Investors</a></li>
                <li><a href="#" className="hover:text-white transition">For Asset Owners</a></li>
                <li><a href="#" className="hover:text-white transition">Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 IMEC Capital Tokenization. All rights reserved.</p>
            <p className="mt-2 text-sm">Built on Hyperledger Fabric 2.2+ Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
