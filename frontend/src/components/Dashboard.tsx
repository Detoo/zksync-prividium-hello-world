import { useEffect, useState } from 'react';
import type { Abi } from 'viem';
import { getAuthenticatedClient } from '../hooks/useAuth';
import erc20Abi from '../abi/ERC20.json';

const TOKEN_ADDRESS = '0x0e99AE824c2a935ae8b9232192FD4ae70D89DB5a';

interface Props {
  address: string;
  token: string;
}

export function Dashboard({ address, token }: Props) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const client = getAuthenticatedClient(token);

        const bal = await client.readContract({
          account: address as `0x${string}`,
          address: TOKEN_ADDRESS,
          abi: erc20Abi as Abi,
          functionName: 'balanceOf',
          args: [address],
        });
        setBalance(bal as bigint);

        const res = await fetch(`/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    }

    void load();
  }, [address, token]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Balance: {balance !== null ? balance.toString() : 'Loading...'}</p>
      <p>Profile: {profile !== null ? JSON.stringify(profile, null, 2) : 'Loading...'}</p>
    </div>
  );
}
