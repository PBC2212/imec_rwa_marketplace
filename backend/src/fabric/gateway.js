/**
 * Hyperledger Fabric Gateway Connection Manager
 * Manages connections to the IMEC Token Network using Fabric SDK v2.5
 */

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

class FabricGateway {
  constructor() {
    this.gateway = null;
    this.wallet = null;
    this.connectionProfilePath = path.resolve(__dirname, '../../connection-org1.json');
    this.walletPath = path.resolve(__dirname, '../../wallet');
  }

  /**
   * Initialize the gateway connection
   */
  async connect(userId = 'admin') {
    try {
      // Load connection profile
      const connectionProfile = JSON.parse(
        fs.readFileSync(this.connectionProfilePath, 'utf8')
      );

      // Initialize wallet
      this.wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check if user exists in wallet
      const identity = await this.wallet.get(userId);
      if (!identity) {
        throw new Error(
          `Identity for user ${userId} does not exist in the wallet. ` +
          'Run enrollAdmin.js and registerUser.js first.'
        );
      }

      // Create gateway instance
      this.gateway = new Gateway();

      // Connect to gateway
      await this.gateway.connect(connectionProfile, {
        wallet: this.wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: false }
      });

      console.log(`Connected to Fabric gateway as ${userId}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to gateway: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get network instance for a specific channel
   */
  async getNetwork(channelName = 'mychannel') {
    if (!this.gateway) {
      throw new Error('Gateway not connected. Call connect() first.');
    }

    try {
      const network = await this.gateway.getNetwork(channelName);
      return network;
    } catch (error) {
      console.error(`Failed to get network: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get contract instance for chaincode interaction
   */
  async getContract(channelName = 'mychannel', chaincodeName = 'imecChaincode', contractName = '') {
    try {
      const network = await this.getNetwork(channelName);
      const contract = contractName
        ? network.getContract(chaincodeName, contractName)
        : network.getContract(chaincodeName);
      
      return contract;
    } catch (error) {
      console.error(`Failed to get contract: ${error.message}`);
      throw error;
    }
  }

  /**
   * Submit a transaction (writes to ledger)
   */
  async submitTransaction(userId, functionName, ...args) {
    let gateway = null;
    
    try {
      // Create new gateway connection for this transaction
      const connectionProfile = JSON.parse(
        fs.readFileSync(this.connectionProfilePath, 'utf8')
      );

      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const identity = await wallet.get(userId);
      
      if (!identity) {
        throw new Error(`Identity ${userId} not found in wallet`);
      }

      gateway = new Gateway();
      await gateway.connect(connectionProfile, {
        wallet: wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: false }
      });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('imecChaincode');

      // Submit transaction
      console.log(`Submitting transaction: ${functionName}(${args.join(', ')})`);
      const result = await contract.submitTransaction(functionName, ...args);

      return result.toString();
    } catch (error) {
      console.error(`Failed to submit transaction: ${error.message}`);
      throw error;
    } finally {
      if (gateway) {
        gateway.disconnect();
      }
    }
  }

  /**
   * Evaluate a transaction (reads from ledger, no state change)
   */
  async evaluateTransaction(userId, functionName, ...args) {
    let gateway = null;
    
    try {
      // Create new gateway connection for this query
      const connectionProfile = JSON.parse(
        fs.readFileSync(this.connectionProfilePath, 'utf8')
      );

      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const identity = await wallet.get(userId);
      
      if (!identity) {
        throw new Error(`Identity ${userId} not found in wallet`);
      }

      gateway = new Gateway();
      await gateway.connect(connectionProfile, {
        wallet: wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: false }
      });

      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('imecChaincode');

      // Evaluate transaction
      console.log(`Evaluating transaction: ${functionName}(${args.join(', ')})`);
      const result = await contract.evaluateTransaction(functionName, ...args);

      return result.toString();
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error.message}`);
      throw error;
    } finally {
      if (gateway) {
        gateway.disconnect();
      }
    }
  }

  /**
   * Disconnect from gateway
   */
  async disconnect() {
    if (this.gateway) {
      this.gateway.disconnect();
      console.log('Disconnected from Fabric gateway');
    }
  }

  /**
   * Check if wallet contains a user identity
   */
  async hasIdentity(userId) {
    try {
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const identity = await wallet.get(userId);
      return !!identity;
    } catch (error) {
      console.error(`Failed to check identity: ${error.message}`);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new FabricGateway();
