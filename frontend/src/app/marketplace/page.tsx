'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginModal from '@/components/LoginModal';
import { api } from '@/lib/api';

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, assetsRes] = await Promise.all([
          api.getStats(),
          api.getAssets(),
        ]);

        setStats(statsRes.data);
        setAssets(assetsRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IMEC RWA Marketplace</h1>
              <p className="text-sm text-gray-600 mt-1">Powered by Hyperledger Fabric 2.5.0</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/invest"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Invest
              </Link>
              <Link
                href="/admin"
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats.totalAssets)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Published Assets</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {formatNumber(stats.publishedAssets)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats.totalTokens)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Market Cap</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(stats.totalMarketCap)}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Assets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assets</h2>
        
        {assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No assets available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Link
                key={asset.id}
                href={`/asset/${asset.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {asset.images && asset.images[0] && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={asset.images[0]}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {asset.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {asset.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{asset.type}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {formatCurrency(asset.value)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">
              © 2025 IMEC RWA Marketplace. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Built on Hyperledger Fabric 2.5.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
