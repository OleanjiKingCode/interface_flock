import { Box, Button, DropButton, Heading, Layer, Text } from 'grommet';
import { useContext, useEffect, useState } from 'react';
import truncateEthAddress from 'truncate-eth-address';
import { useAccount } from 'wagmi';
import { WalletContext } from '../context/walletContext';
import { useIsMounted } from '../hooks';
import { MaticIcon } from './Icons/MaticIcon';
import { Down } from 'grommet-icons';
import { useConnectWallet } from '../hooks/useConnectWallet';
import useEventListener from '../hooks/useEventListener';
import { NOTIFICATION_TYPE_REWARD_UPDATED } from '../constants/notificationTypes';

export function Wallet() {
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [localWindow,setWindow]=useState<Window>()
  const [userPoints, setUserPoints] = useState(0);
  const { handleConnect, handleDisconnect } = useConnectWallet();

  const { nativeTokenBalance, FLCTokenBalance } =
    useContext(WalletContext);
  const mounted = useIsMounted();

  const { address } = useAccount();

  const getPoints=async ()=>{
    try{
      const response=await fetch(`${window.location.origin}/api/rag/getMyPoints?wallet=${address?.toLowerCase()}`)
      const result=await response.json()
      setUserPoints(result.totalRewardAmount)
    } catch (e) {
      console.log(e)
    }
  }

  const handleEvent = (data: any) => {
    getPoints().then()
  };
  useEventListener(NOTIFICATION_TYPE_REWARD_UPDATED, handleEvent, localWindow);

  const roundedFLCBalance = FLCTokenBalance
    ? Math.round(Number(FLCTokenBalance.formatted) * 100) / 100
    : 0;

  const roundedMaticBalance = nativeTokenBalance
    ? Math.round(Number(nativeTokenBalance.formatted) * 10000) / 10000
    : 0;

  useEffect(() => {
    if (address) {
      getPoints()
    }
    if(window){
      setWindow(window)
    }
  }, [address]);

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <Box direction="row" gap="medium">
        {address && (
          <Box
            round="large"
            background="rgba(108,148,236,1)"
            pad="xsmall"
            border={{ color: 'black', size: 'small' }}
            justify='center'
          >
            <Button
              secondary
              size="small"
              icon={<MaticIcon />}
              label="Mumbai"
              color="white"
            ></Button>
          </Box>
        )}
        {address ? (
          <Box
            round="large"
            background="rgba(108,148,236,1)"
            pad="xsmall"
            border={{ color: 'black', size: 'small' }}
          >
            <Box direction="row" gap="small">
              <Button 
                secondary
                color="white"
                pad="xsmall"
                label={`${userPoints} POINTS`}
              />
              {/* <DropButton
                secondary
                reverse
                icon={<Down />}
                color="white"
                label={`${roundedMaticBalance} MATIC`}
                pad="xsmall"
                open={isWalletOpen}
                dropAlign={{ top: 'bottom' }}
                dropContent={
                  <Box background="white" pad="small" gap="small">
                    <Box
                      round="small"
                      background="#E0E4E7"
                      color="black"
                      pad="xsmall"
                    >
                      <Text weight="bold">{roundedFLCBalance} FLC</Text>
                    </Box>
                  </Box>
                }
                onClick={() => setIsWalletOpen(true)}
                dropProps={{
                  background: { color: 'white' },
                  onClickOutside: () => setIsWalletOpen(false),
                  margin: { top: 'xsmall' },
                  round: 'small',
                }}
              /> */}
              <Button
                secondary
                color="white"
                label={truncateEthAddress(address)}
                pad="xsmall"
                reverse
                icon={<Down />}
                onClick={
                  address
                    ? () => {
                        setShowWalletSettings(true);
                      }
                    : () => {
                        handleConnect();
                      }
                }
              />
            </Box>
          </Box>
        ) : (
          <Button
            primary
            label="Connect Wallet"
            pad={{vertical: 'xsmall', horizontal: '18px'}}
            onClick={handleConnect}
          />
        )}
      </Box>
      {showWalletSettings && (
        <Layer onEsc={() => setShowWalletSettings(false)}>
          <Box align="center" justify="center" pad="large" gap="medium">
            <Heading level="3">Wallet Settings</Heading>
            <Box align="start" gap="xsmall">
              <Text>
                <b>Wallet Address:</b> {address}
              </Text>
              <Text>
                <b>FLock(FLC) Balance: </b>
                {roundedFLCBalance} $F
              </Text>
              <Text>
                <b>MATIC Balance: </b>
                {roundedMaticBalance} $MATIC
              </Text>
            </Box>
            <Box direction="row" alignSelf="end" gap="small">
              <Button
                secondary
                label="Go Back"
                onClick={() => setShowWalletSettings(false)}
              />
              <Button
                primary
                label="Disconnect"
                onClick={() => {
                  handleDisconnect();
                  setShowWalletSettings(false);
                }}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
}

export default Wallet;
