import { useState } from 'react';
import { createPublicClient, http } from 'viem';
import { prividiumChain } from '../wagmi.config';

const DOMAIN = 'user-panel.zksync-os-sandbox-10.zksync.dev';

export function getAuthenticatedClient(token: string) {
  return createPublicClient({
    chain: prividiumChain,
    transport: http(`/rpc`, {
      fetchOptions: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }),
  });
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  async function fetchSiweMessage(address: string): Promise<string> {
    const res = await fetch(`/api/siwe-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, domain: DOMAIN }),
    });
    const data = await res.json() as { msg: string };
    return data.msg;
  }

  async function login(message: string, signature: string): Promise<void> {
    const res = await fetch(`/api/auth/login/crypto-native`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });
    const data = await res.json() as { token: string; expiresAt: string };
    setToken(data.token);
  }

  function logout() {
    setToken(null);
  }

  return { token, fetchSiweMessage, login, logout };
}
