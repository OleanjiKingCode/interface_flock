import { Box, Button } from 'grommet';
import ClaimStep from './ClaimStep';
import { useIsMounted } from '../hooks';
import TimerButton from './TimerButton';
import { toasts } from '../constants/toastMessages';
import { IStepProps } from '../pages/quest';
import { useAccount } from 'wagmi';
import { useContext } from 'react';
import { WalletContext } from '../context/walletContext';

export default function FollowTwitter({ step, status, onSubmit }: IStepProps) {
  const { address } = useAccount();
  const mounted = useIsMounted();
  const { publicKey, userToken } = useContext(WalletContext);

  const handleFollowButton = () => {
    window.open(process.env.NEXT_PUBLIC_TWITTER_FOLLOW_LINK, '_blank');
  };

  const handleVerifyButton = async () => {
    const response = await fetch('/api/quest/oauth/twitterVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        auth_key: publicKey,
        wallet: (address as string)?.toLocaleLowerCase(),
      }),
    });

    if (response.status === 200) {
      onSubmit({ toast: toasts.twitterConnectionSuccess });
    } else {
      onSubmit({ error: true, toast: toasts.twitterFollowFailed });
    }
  };

  if (!mounted) {
    return <></>;
  }

  return (
    <ClaimStep
      label="Follow @flock_io on Twitter"
      step={step}
      status={status}
      minWidth="160px"
    >
      {status === 'active' && (
        <Box direction="row" gap="xsmall">
          <Button
            primary
            label="Follow Now"
            onClick={handleFollowButton}
            style={{ boxShadow: '3px 4px 0px 0px #000' }}
            size="questButton"
          />
          <TimerButton label="Verify" onClick={handleVerifyButton} />
        </Box>
      )}
    </ClaimStep>
  );
}
