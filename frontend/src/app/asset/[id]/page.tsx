'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

export default function AssetDetailPage() {
  const params = useParams();
  const [asset, setAsset] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssetData();
  }, [params.id]);

  async function loadAssetData() {
    try {
      const assetRes = await api.getAsset(params.id as string);
      setAsset(assetRes.data);

      // Try to load associated token
      try {
        const tokensRes = await api.getTokens();
        const associatedToken = tokensRes.data.find(
          (t: any) => t.assetId === params.id
        );
        if (associatedToken) {
          setToken(associatedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    } catch (error: any) {
      alert(`Error loading asset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to Home
          </Link>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{asset.type}</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {asset.images && asset.images.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={asset.images[0]}
                  alt={asset.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{asset.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.location || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Valuation</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(asset.value)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(asset.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(asset.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Documents */}
            {asset.documents && asset.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
                <ul className="space-y-2">
                  {asset.documents.map((doc: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Token Info */}
            {token && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Token Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Symbol</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {token.symbol || 'IMEC'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per Token</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(token.pricePerToken)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Supply</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {token.totalSupply?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Market Cap</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(token.pricePerToken * token.totalSupply)}
                    </p>
                  </div>

                  <Link
                    href="/invest"
                    className="block w-full px-6 py-3 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition font-medium"
                  >
                    Invest Now
                  </Link>
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner</h2>
              <p className="text-sm text-gray-700">{asset.owner || 'N/A'}</p>
            </div>

            {/* Asset ID */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset ID</h2>
              <p className="text-xs font-mono text-gray-600 break-all">{asset.id}</p>
              <p className="text-xs text-gray-500 mt-2">
                Recorded on Hyperledger Fabric blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
