import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Paragraph,
  TextInput,
  Text,
} from 'grommet';
import { Layout, PrimaryButton, Tasks } from '../components';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { FLOCK_ABI } from '../contracts/flock';
import { MIGRATE_TOKENS_ABI } from '../contracts/migrateTokens';
import { use, useEffect, useState, useContext } from 'react';
import { WalletContext } from '../context/walletContext';
import { useIsMounted } from '../hooks';

export default function FaucetPage() {
  const { address } = useAccount();
  const [amount, setAmount] = useState<number>(0);
  const [errors, setErrors] = useState<any>({});
  const { FLCTokenBalance, FLOTokenBalance } = useContext(WalletContext);

  const mounted = useIsMounted();

  const { data, write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS as `0x${string}`,
    abi: FLOCK_ABI,
    functionName: 'mint',
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleMint = async () => {
    write?.({ args: [address, amount * 10 ** 18] });
  };

  useEffect(() => {
    setAmount(0);
  }, [isSuccess]);

  const hasErrors = Object.keys(errors).length > 0;

  if (!mounted) {
    return <></>;
  }

  return (
    <Layout>
      <Box width="100%" gap="large">
        <Box
          background="#EEEEEE"
          direction="row-responsive"
          align="center"
          justify="center"
          width="100%"
          pad={{ vertical: 'large', horizontal: 'large' }}
        >
          <Box>
            <Box direction="row-responsive" gap="xsmall">
              <Heading level="2">FLock (FLC) tokens faucet </Heading>
            </Box>
            <Paragraph>
              Mint your FLC tokens for participating in the FLock network.
            </Paragraph>
            <Paragraph>
              Contract Address:{' '}
              <Text wordBreak="break-word">{process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS}</Text>
            </Paragraph> 
          </Box>
        </Box>
        <Box
          width="100%"
          align="center"
          pad="large"
          background="white"
          justify="center"
          round="small"
        >
          <Form
            onValidate={(validationResults) => {
              setErrors(validationResults.errors);
            }}
          >
            <FormField
              name="amount"
              htmlFor="amount"
              label="Amount"
              required
              validateOn="blur"
            >
              <TextInput
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </FormField>
            <Box direction="row" align="end" justify="end">
              <Button
                primary
                onClick={handleMint}
                disabled={!address || amount === 0 || hasErrors || isLoading}
                label={isLoading ? 'Minting...' : 'Mint'}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layout>
  );
}
