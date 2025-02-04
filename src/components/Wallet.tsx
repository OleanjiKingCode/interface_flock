import { Box, Button, Heading, Layer, Text } from "grommet";
import { useContext, useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
import { WalletContext } from "../context/walletContext";
import { useIsMounted } from "../hooks";
import { MaticIcon } from "./Icons/MaticIcon";
import { Down } from "grommet-icons";
import { useConnectWallet } from "../hooks/useConnectWallet";
import useEventListener from "../hooks/useEventListener";
import { NOTIFICATION_TYPE_REWARD_UPDATED } from "../constants/notificationTypes";

interface IWalletProps {
  isSmall: boolean;
}

export function Wallet({ isSmall }: IWalletProps) {
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [localWindow, setWindow] = useState<Window>();
  const [userPoints, setUserPoints] = useState(0);
  const { handleConnect, handleDisconnect } = useConnectWallet();

  const { nativeTokenBalance, FLCTokenBalance } = useContext(WalletContext);
  const mounted = useIsMounted();

  const { address } = useAccount();

  const getPoints = async () => {
    try {
      const response = await fetch(
        `${
          window.location.origin
        }/api/rag/getMyPoints?wallet=${address?.toLowerCase()}`
      );
      const result = await response.json();
      setUserPoints(result.totalRewardAmount);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEvent = (data: any) => {
    getPoints().then();
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
      getPoints();
    }
    if (window) {
      setWindow(window);
    }
  }, [address]);

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-row gap-7 items-center justify-center ">
        {address && (
          <>
            {isSmall ? (
              <div className="rounded-3xl bg-[rgba(108,148,236,1)] flex flex-row gap-3 items-center justify-center px-2  py-1 border-black border-[2px] cursor-pointer">
                <div className="text-black font-medium flex gap-2 items-center justify-center bg-white px-2 py-1 rounded-full border-black border-[2px] cursor-pointer">
                  <MaticIcon />
                  <p className="max-[425px]:hidden text-base">Mumbai</p>
                </div>
              </div>
            ) : (
              <div className=" max-[882px]:hidden rounded-3xl bg-[rgba(108,148,236,1)] flex flex-row gap-3 items-center justify-center px-2  py-1 border-black border-[2px] cursor-pointer">
                <div className="text-black font-medium flex gap-2 items-center justify-center bg-white px-2 py-1 rounded-full border-black border-[2px] cursor-pointer">
                  <MaticIcon />
                  <p className=" max-[1011px]:hidden flex text-base">Mumbai</p>
                </div>
              </div>
            )}
          </>
        )}
        {address ? (
          <div className="rounded-3xl bg-[rgba(108,148,236,1)] w-full flex flex-row gap-3 items-center justify-center px-2 py-1 border-black border-[2px]">
            <div className="text-black font-medium bg-white px-2 py-1 rounded-full border-black border-[2px] cursor-pointer">
              <p className="max-[935px]:text-[12px]  max-[935px]:font-bold text-base">{`${userPoints} POINTS`}</p>
            </div>

            <div
              onClick={
                address
                  ? () => setShowWalletSettings(true)
                  : () => handleConnect()
              }
              className="flex flex-row gap-2 justify-center items-center text-black font-medium bg-white px-2 py-1 rounded-full border-black border-[2px] cursor-pointer"
            >
              <p className="max-[935px]:text-[12px]  max-[935px]:font-bold text-base">
                {truncateEthAddress(address)}
              </p>
              <Down size="small" style={{ fontWeight: "bold" }} />
            </div>
          </div>
        ) : (
          <Button
            primary
            label="Connect Wallet"
            pad={{ vertical: "xsmall", horizontal: "18px" }}
            onClick={handleConnect}
          />
        )}
      </div>
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
