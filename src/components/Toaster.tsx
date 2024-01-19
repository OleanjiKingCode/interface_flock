import { Box, Text } from 'grommet';
import { Close, Checkmark, Alert } from 'grommet-icons';
import styled from 'styled-components';

interface IToasterProps {
  type: string;
  title: string;
  message: string;
}

type IToasterTypes = {
  [key: string]: {
    color: string;
    toasterIconComponent: JSX.Element;
  };
};

const toasterTypes: IToasterTypes = {
  error: {
    color: 'error',
    toasterIconComponent: <Close color="error" />,
  },
  success: {
    color: 'success',
    toasterIconComponent: <Checkmark color="success" />,
  },
  warning: {
    color: '#4B5458',
    toasterIconComponent: <Alert color="#4B5458" />,
  }
};

const Toast = styled.div`
  display: flex;
  width: 100%;
  max-width: 292px;
  max-height: 100px;
  animation: move 250ms;
  transition: transform 250ms, opacity 250ms, box-shadow 250ms ease-in-out;

  @keyframes move {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export default function Toaster({ type, title, message }: IToasterProps) {
  const { color, toasterIconComponent } =
    toasterTypes[type as keyof IToasterProps];

  return (
    <Toast>
      <Box
        role="alert"
        direction="row"
        background={{ color: color }}
        pad="16px 18px"
        border={{ side: 'all', size: '2px', color: 'black' }}
        round="10px"
        gap="15px"
        width="292px"
        align="center"
      >
        <Box>
          <Box background={{ color: 'white' }} round="full" pad="small">
            {toasterIconComponent}
          </Box>
        </Box>
        <Box style={{ maxWidth: '190px' }}>
          <Text size="16px" weight={700}>
            {title}
          </Text>
          <Text size="12px" weight={500}>
            {message}
          </Text>
        </Box>
      </Box>
    </Toast>
  );
}
