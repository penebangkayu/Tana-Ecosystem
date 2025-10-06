import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from '@wagmi/connectors';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const phantomConnector = injected({
  name: 'Phantom',
  shimDisconnect: true,
  getProvider: () => (typeof window !== 'undefined' ? window.phantom?.ethereum : undefined),
});

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask(), phantomConnector, walletConnect({ projectId: walletConnectProjectId, showQrModal: false })],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'),
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_INFURA_KEY'),
  },
  ssr: true,
});