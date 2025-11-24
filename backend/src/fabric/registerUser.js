/**
 * Register User
 * Registers a new user with the CA and stores identity in wallet
 */

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerUser(userId, userRole = 'client') {
  try {
    // Load connection profile
    const ccpPath = path.resolve(__dirname, '../../connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Get CA info
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create wallet
    const walletPath = path.resolve(__dirname, '../../wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check if user already exists
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`Identity ${userId} already exists in the wallet`);
      return;
    }

    // Check if admin exists
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('Admin identity does not exist. Run enrollAdmin.js first.');
      return;
    }

    // Build user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user
    const secret = await ca.register(
      {
        affiliation: 'org1.department1',
        enrollmentID: userId,
        role: userRole,
      },
      adminUser
    );

    // Enroll the user
    const enrollment = await ca.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId}`);
  } catch (error) {
    console.error(`Failed to register user ${userId}: ${error.message}`);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  const userId = process.argv[2] || 'user1';
  const userRole = process.argv[3] || 'client';
  registerUser(userId, userRole);
}

module.exports = registerUser;
