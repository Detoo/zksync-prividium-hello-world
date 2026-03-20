import { useState } from 'react';
import { useSignMessage } from 'wagmi';

interface Props {
  address: string;
  fetchSiweMessage: (address: string) => Promise<string>;
  login: (message: string, signature: string) => Promise<void>;
}

export function AuthButton({ address, fetchSiweMessage, login }: Props) {
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const message = await fetchSiweMessage(address);
      const signature = await signMessageAsync({ message });
      await login(message, signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? 'Signing...' : 'Sign In with Wallet'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
