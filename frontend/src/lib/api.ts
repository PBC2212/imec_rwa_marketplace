/**
 * API Client
 * Handles all backend API interactions
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

class APIClient {
  private client: AxiosInstance;
  private adminClient: AxiosInstance;

  constructor() {
    // Public API client
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Admin API client (with auth)
    this.adminClient = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });
  }

  // Public API Methods

  async getFeed() {
    const response = await this.client.get('/feed');
    return response.data;
  }

  async getAssets() {
    const response = await this.client.get('/assets');
    return response.data;
  }

  async getAsset(id: string) {
    const response = await this.client.get(`/asset/${id}`);
    return response.data;
  }

  async getTokens() {
    const response = await this.client.get('/tokens');
    return response.data;
  }

  async getToken(id: string) {
    const response = await this.client.get(`/token/${id}`);
    return response.data;
  }

  async getTokenInvestors(id: string) {
    const response = await this.client.get(`/token/${id}/investors`);
    return response.data;
  }

  async getPrices() {
    const response = await this.client.get('/prices');
    return response.data;
  }

  async getStats() {
    const response = await this.client.get('/stats');
    return response.data;
  }

  // Investor API Methods

  async getInvestorPortfolio(investorId: string) {
    const response = await this.client.get(`/investor/${investorId}/portfolio`);
    return response.data;
  }

  async getInvestorBalance(investorId: string, tokenId: string) {
    const response = await this.client.get(`/investor/${investorId}/balance/${tokenId}`);
    return response.data;
  }

  async getInvestorPayouts(investorId: string) {
    const response = await this.client.get(`/investor/${investorId}/payouts`);
    return response.data;
  }

  async recordPurchase(investorId: string, data: any) {
    const response = await this.client.post(`/investor/${investorId}/purchase`, data);
    return response.data;
  }

  // Admin API Methods

  async createAsset(data: any) {
    const response = await this.adminClient.post('/admin/assets', data);
    return response.data;
  }

  async updateAsset(id: string, data: any) {
    const response = await this.adminClient.put(`/admin/assets/${id}`, data);
    return response.data;
  }

  async publishAsset(id: string) {
    const response = await this.adminClient.post(`/admin/assets/${id}/publish`);
    return response.data;
  }

  async getAllAssets() {
    const response = await this.adminClient.get('/admin/assets');
    return response.data;
  }

  async getAssetHistory(id: string) {
    const response = await this.adminClient.get(`/admin/asset/${id}/history`);
    return response.data;
  }

  async mintTokens(data: any) {
    const response = await this.adminClient.post('/admin/tokens', data);
    return response.data;
  }

  async updateTokenPrice(id: string, newPrice: number) {
    const response = await this.adminClient.post(`/admin/tokens/${id}/price`, { newPrice });
    return response.data;
  }

  async recordPayout(data: any) {
    const response = await this.adminClient.post('/admin/payouts', data);
    return response.data;
  }

  async burnTokens(id: string, amount: number) {
    const response = await this.adminClient.delete(`/admin/tokens/${id}`, { data: { amount } });
    return response.data;
  }
}

export const api = new APIClient();
export default api;
