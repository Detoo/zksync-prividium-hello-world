import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import erc20Abi from './abi/ERC20.json';

const PRIVIDIUM_API = 'https://api.zksync-os-sandbox-10.zksync.dev';
const PRIVATE_KEY = process.env.PRIVATE_KEY_MAIN;
const DOMAIN = 'user-panel.zksync-os-sandbox-10.zksync.dev';

// Current valid token used to interact with API
let currentToken: string = '';
// Expiration of current token
let tokenExpiresAt: Date = new Date(1, 1, 1);
let currentAccount;

async function authenticate() {
  currentAccount = privateKeyToAccount(PRIVATE_KEY);
  console.log("Authenticating account:", currentAccount.address);

  // Step 1: Request SIWE message
  const siweResponse = await fetch(`${PRIVIDIUM_API}/api/siwe-messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: currentAccount.address,
      domain: DOMAIN
    })
  });
  const siweData = await siweResponse.json();

  // Step 2: Sign the message
  const signature = await currentAccount.signMessage({
    message: siweData.msg
  });

  // Step 3: Exchange for token
  const loginResponse = await fetch(`${PRIVIDIUM_API}/api/auth/login/crypto-native`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: siweData.msg,
      signature: signature
    })
  });
  const loginResp = await loginResponse.json();
  const { token, expiresAt } = loginResp;

  currentToken = token;
  tokenExpiresAt = new Date(expiresAt);

  console.log("currentToken:", currentToken);
  console.log("tokenExpiresAt:", tokenExpiresAt);
}

async function callRpc(token: string, method: string, params: unknown[] = []) {
  if (new Date() > tokenExpiresAt) {
    await authenticate();
  }

  const response = await fetch(`${PRIVIDIUM_API}/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1
    })
  });
  return response.json();
}

async function getMyProfile() {
  if (new Date() > tokenExpiresAt) {
    await authenticate();
  }

  const response = await fetch(`${PRIVIDIUM_API}/api/profiles/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${currentToken}`
    }
  });
  return response.json();
}

async function main() {
  // Authenticate
  await authenticate();

  // Call balanceOf via viem publicClient
  const publicClient = createPublicClient({
    transport: http(`${PRIVIDIUM_API}/rpc`, {
      fetchOptions: {
        headers: { Authorization: `Bearer ${currentToken}` }
      }
    })
  });

  const balance = await publicClient.readContract({
    account: currentAccount.address,
    address: '0x0e99AE824c2a935ae8b9232192FD4ae70D89DB5a',
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [
      // '0x5ff4e90Efa2B88cf3cA92D63d244a78a88219Abf'
      currentAccount.address
    ]
  });
  console.log('balance:', balance);

  // Call REST endpoint
  const profile = await getMyProfile();
  console.log("profile:", profile);
}

main().catch(console.error);
