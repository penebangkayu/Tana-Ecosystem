'use client';

import { useConnect, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export function ConnectButton() {
  const { isConnected } = useAccount();
  
  const { 
    connect, 
    connectors, 
    isLoading, 
    pendingConnector,
    error: wagmiError
  } = useConnect({
    onError: (error) => {
      setConnectionError(error.message);
    }
  });
  
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const displayError = connectionError || wagmiError?.message;

  useEffect(() => {
    console.log('ConnectButton mounted, connectors:', connectors.map(c => ({ name: c.name, ready: c.ready })));
    // Cek ulang status setelah beberapa saat
    const timer = setTimeout(() => {
      console.log('Re-checking connectors:', connectors.map(c => ({ name: c.name, ready: c.ready })));
    }, 1000);
    return () => clearTimeout(timer);
  }, [connectors]);

  if (isConnected) return null;

  return (
    <div className="flex flex-col space-y-2 w-48">
      {connectors.map((connector) => (
        <div key={connector.id} className="relative">
          <button
            onClick={() => {
              setConnectionError(null);
              connect({ connector });
            }}
            disabled={!connector.ready || isLoading}
            className={`...`}
          >
            {connector.name}
            {isLoading && pendingConnector?.id === connector.id && ' (Connecting...)'}
            {!connector.ready && ' (Not Ready: Install/Unlock)'}
          </button>
        </div>
      ))}

      {displayError && (
        <p className="text-xs text-red-500 mt-1 text-center">
          {displayError}
        </p>
      )}

      {connectors.length === 0 && (
        <p className="text-xs text-red-500 mt-1 text-center">
          No connectors found. Check WagmiProviderWrapper.tsx config.
        </p>
      )}
    </div>
  );
}