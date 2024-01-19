import { Box, Image, Text } from 'grommet';
import { FormNext } from 'grommet-icons';

export const ModelCreationStepper = ({
  selectedStep,
}: {
  selectedStep: number;
}) => {
  return (
    <Box direction="row" align="center" gap="medium" justify="center">
      <Box
        background={selectedStep === 1 ? '#6C94EC' : 'white'}
        round="large"
        elevation={selectedStep === 2 ? '' : 'small'}
        border={selectedStep === 1 ? { color: 'black', size: 'small' } : {}}
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
        direction="row"
        align="center"
        gap="small"
      >
        <Image src="model/Contribute.png" alt="contribute" />
        <Text weight="bold" color={selectedStep === 1 ? 'white' : '#879095'}>
          1. Model Definition
        </Text>
      </Box>
      <FormNext />
      <Box
        background={selectedStep === 2 ? '#6C94EC' : 'white'}
        round="large"
        elevation={selectedStep === 2 ? '' : 'small'}
        border={selectedStep === 2 ? { color: 'black', size: 'small' } : {}}
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
        direction="row"
        align="center"
        gap="small"
      >
        <Image src="model/Reward.png" alt="rewards" />
        <Text weight="bold" color={selectedStep === 2 ? 'white' : '#879095'}>
          2. Receive Rewards
        </Text>
      </Box>
    </Box>
  );
};
