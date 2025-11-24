'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

export default function PortfolioPage() {
  const [investorId, setInvestorId] = useState('');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadPortfolio() {
    if (!investorId) {
      alert('Please enter your Investor ID');
      return;
    }

    setLoading(true);
    try {
      const [portfolioRes, payoutsRes] = await Promise.all([
        api.getInvestorPortfolio(investorId),
        api.getInvestorPayouts(investorId),
      ]);

      setPortfolio(portfolioRes.data);
      setPayouts(payoutsRes.data || []);
    } catch (error: any) {
      alert(`Error loading portfolio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
              <p className="text-sm text-gray-600 mt-1">View your token holdings and payouts</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Investor ID Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Investor ID
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={investorId}
              onChange={(e) => setInvestorId(e.target.value)}
              placeholder="e.g., investor001"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && loadPortfolio()}
            />
            <button
              onClick={loadPortfolio}
              disabled={loading || !investorId}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Portfolio'}
            </button>
          </div>
        </div>

        {/* Portfolio Display */}
        {portfolio && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Holdings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {portfolio.holdings?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Different tokens</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">
                  {formatCurrency(
                    portfolio.holdings?.reduce(
                      (sum: number, h: any) => sum + (h.amount * h.pricePerToken || 0),
                      0
                    ) || 0
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current market value</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600">Total Payouts Received</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(
                    payouts.reduce((sum, p) => sum + (p.amount || 0), 0)
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
              </div>
            </div>

            {/* Holdings */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Token Holdings</h2>
              
              {!portfolio.holdings || portfolio.holdings.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600">No token holdings yet.</p>
                  <Link
                    href="/invest"
                    className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Start Investing
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price per Token
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {portfolio.holdings.map((holding: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {holding.tokenId}
                            </div>
                            <div className="text-xs text-gray-500">
                              {holding.symbol || 'IMEC'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(holding.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(holding.pricePerToken || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                            {formatCurrency((holding.amount || 0) * (holding.pricePerToken || 0))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {holding.assetId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Payout History */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payout History</h2>
              
              {payouts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600">No payouts received yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payouts.map((payout: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payout.date || payout.payoutDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payout.assetId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payout.tokenId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(payout.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Dividend
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* Empty State */}
        {!portfolio && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">Enter your Investor ID to view your portfolio.</p>
            <p className="text-sm text-gray-500">
              Don't have any investments yet? <Link href="/invest" className="text-primary-600 hover:text-primary-700">Start investing</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
