import { useAccount } from 'wagmi';
import { useAuth } from './hooks/useAuth';
import { ConnectWallet } from './components/ConnectWallet';
import { AuthButton } from './components/AuthButton';
import { Dashboard } from './components/Dashboard';

export function App() {
  const { address, isConnected } = useAccount();
  const { token, fetchSiweMessage, login, logout } = useAuth();

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1>Prividium</h1>
      <ConnectWallet />

      {isConnected && address && !token && (
        <AuthButton
          address={address}
          fetchSiweMessage={fetchSiweMessage}
          login={login}
        />
      )}

      {isConnected && address && token && (
        <>
          <button onClick={logout} style={{ marginBottom: 16 }}>
            Sign Out
          </button>
          <Dashboard address={address} token={token} />
        </>
      )}
    </div>
  );
}
