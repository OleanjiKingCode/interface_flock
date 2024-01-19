import * as React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const useConnectWallet = () => {
  const { address, isConnected } = useAccount();

  const { connectAsync, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const handleConnect = async () => {
    await connectAsync({
      connector: connectors[0],
    });
  };

  React.useEffect(() => {
    if (isConnected) {
      createCourierUser();
    }
  }, [isConnected]);

  const createCourierUser = async () => {
    try {
      if (!address) {
        throw new Error('No address found');
      }

      const response = await fetch(`${window.location.origin}/api/postCourierUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
        }),
      });

      if (response.ok) {
        console.log('Courier profile created successfully');
      } else {
        console.log('Call to courier failed.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
    wagmiDisconnect();
  };

  return {
    isConnected,
    handleConnect,
    handleDisconnect,
  };
};
