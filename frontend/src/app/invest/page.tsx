'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function InvestorPortal() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [investorId, setInvestorId] = useState('');

  useEffect(() => {
    loadTokens();
  }, []);

  async function loadTokens() {
    try {
      const res = await api.getTokens();
      setTokens(res.data);
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(tokenId: string, amount: number, price: number) {
    if (!investorId) {
      alert('Please enter your Investor ID');
      return;
    }

    try {
      await api.recordPurchase(investorId, {
        tokenId,
        amount,
        pricePerToken: price,
      });

      alert('Purchase recorded successfully on the blockchain!');
    } catch (error: any) {
      alert(`Purchase failed: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Portal</h1>
              <p className="text-sm text-gray-600 mt-1">Purchase tokenized real-world assets</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/portfolio"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
              >
                My Portfolio
              </Link>
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Investor ID Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investor ID
          </label>
          <input
            type="text"
            value={investorId}
            onChange={(e) => setInvestorId(e.target.value)}
            placeholder="Enter your investor ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">
            This ID will be recorded on the blockchain for all your purchases
          </p>
        </div>

        {/* Available Tokens */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tokens</h2>
          
          {tokens.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No tokens available for purchase yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <div key={token.tokenId} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {token.name || 'IMEC Token'}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Symbol:</span>
                        <span className="font-medium">{token.symbol || 'IMEC'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Token:</span>
                        <span className="font-semibold text-primary-600">
                          {formatCurrency(token.pricePerToken)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Supply:</span>
                        <span className="font-medium">
                          {formatNumber(token.totalSupply)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Cap:</span>
                        <span className="font-medium">
                          {formatCurrency(token.pricePerToken * token.totalSupply)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="number"
                        id={`amount-${token.tokenId}`}
                        placeholder="Enter amount"
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      
                      <button
                        onClick={() => {
                          const amountInput = document.getElementById(`amount-${token.tokenId}`) as HTMLInputElement;
                          const amount = parseInt(amountInput.value);
                          
                          if (amount > 0) {
                            handlePurchase(token.tokenId, amount, token.pricePerToken);
                          } else {
                            alert('Please enter a valid amount');
                          }
                        }}
                        disabled={!investorId}
                        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Purchase Tokens
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
