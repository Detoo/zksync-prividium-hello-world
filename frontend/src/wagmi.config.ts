import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

export const prividiumChain = defineChain({
  id: 282,
  name: 'ZKsync OS Sandbox 10',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.zksync-os-sandbox-10.zksync.dev/rpc'],
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [prividiumChain],
  connectors: [injected()],
  transports: {
    [prividiumChain.id]: http(),
  },
});
