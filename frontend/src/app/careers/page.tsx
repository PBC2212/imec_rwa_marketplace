'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const openPositions = [
    {
      id: 1,
      title: 'Senior Blockchain Engineer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      description: 'Build and maintain our Hyperledger Fabric blockchain infrastructure and smart contracts.',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      description: 'Develop and enhance our tokenization platform using Next.js, Express, and blockchain technologies.',
    },
    {
      id: 3,
      title: 'Compliance Officer',
      department: 'Compliance',
      location: 'Hybrid',
      type: 'Full-time',
      description: 'Ensure regulatory compliance for digital securities and tokenized assets.',
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for our RWA tokenization platform.',
    },
    {
      id: 5,
      title: 'Security Engineer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      description: 'Protect our platform and user assets through security best practices and monitoring.',
    },
  ];

  const filteredPositions = selectedDepartment === 'all' 
    ? openPositions 
    : openPositions.filter(pos => pos.department === selectedDepartment);

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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto">
            Help us revolutionize real-world asset tokenization and democratize investment opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#positions" 
              className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
            >
              View Open Positions
            </a>
            <a 
              href="#culture" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition font-semibold text-lg"
            >
              Our Culture
            </a>
          </div>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Join IME Capital Trust?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
            <p className="text-gray-700">
              Work on cutting-edge blockchain technology and help shape the future of asset tokenization and digital finance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact</h3>
            <p className="text-gray-700">
              Make a real difference by democratizing access to investment opportunities and bringing transparency to asset markets.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Growth</h3>
            <p className="text-gray-700">
              Accelerate your career with opportunities to learn, lead, and grow in a fast-paced fintech environment.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div id="culture" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Competitive Salary</h3>
              <p className="text-gray-600 text-sm">Above-market compensation packages with equity options</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Health & Wellness</h3>
              <p className="text-gray-600 text-sm">Comprehensive medical, dental, and vision coverage</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Work</h3>
              <p className="text-gray-600 text-sm">Remote-first culture with flexible hours</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Budget</h3>
              <p className="text-gray-600 text-sm">Annual budget for courses, conferences, and books</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">🌴</div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlimited PTO</h3>
              <p className="text-gray-600 text-sm">Take time off when you need it</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-semibold text-gray-900 mb-2">Latest Equipment</h3>
              <p className="text-gray-600 text-sm">Top-of-the-line hardware and software tools</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Events</h3>
              <p className="text-gray-600 text-sm">Regular team building and social activities</p>
            </div>

            <div className="text-center p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Stock Options</h3>
              <p className="text-gray-600 text-sm">Share in our success with equity compensation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="positions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
        
        {/* Department Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-6 py-2 rounded-l-lg ${
                selectedDepartment === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDepartment('Engineering')}
              className={`px-6 py-2 border-x ${
                selectedDepartment === 'Engineering' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Engineering
            </button>
            <button
              onClick={() => setSelectedDepartment('Product')}
              className={`px-6 py-2 border-r ${
                selectedDepartment === 'Product' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Product
            </button>
            <button
              onClick={() => setSelectedDepartment('Compliance')}
              className={`px-6 py-2 rounded-r-lg ${
                selectedDepartment === 'Compliance' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Compliance
            </button>
          </div>
        </div>

        {/* Position Cards */}
        <div className="space-y-4">
          {filteredPositions.map((position) => (
            <div key={position.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                  <p className="text-gray-700 mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      {position.department}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {position.location}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {position.type}
                    </span>
                  </div>
                </div>
                <button className="ml-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No positions available in this department at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon or send us your resume at <a href="mailto:careers@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700">careers@imecapitaltrust.com</a></p>
          </div>
        )}
      </div>

      {/* Application Process */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Hiring Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">Submit your application and resume</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Initial Screen</h3>
              <p className="text-gray-600 text-sm">30-minute intro call with our team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Interviews</h3>
              <p className="text-gray-600 text-sm">Technical and culture fit interviews</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold text-gray-900 mb-2">Offer</h3>
              <p className="text-gray-600 text-sm">Receive and review your offer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              Email us at: <a href="mailto:careers@imecapitaltrust.com" className="text-primary-600 hover:text-primary-700 font-semibold">careers@imecapitaltrust.com</a>
            </p>
            <p className="text-gray-700">
              Or call: <a href="tel:+12486784819" className="text-primary-600 hover:text-primary-700 font-semibold">(248) 678-4819</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">© 2025 IME Capital Trust. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
              <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
