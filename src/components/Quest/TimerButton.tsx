import { Box, Button } from 'grommet';
import { useEffect, useState } from 'react';
import Tag from '../Tag';

interface ITimerButtonProps {
  label: string;
  onClick(): void;
  isLoading: boolean;
  disable?: boolean;
}

export default function TimerButton({ label, onClick, isLoading, disable }: ITimerButtonProps) {
  const [timer, setTimer] = useState<number>(10);
  const handleButtonClick = () => {
    setTimer(10);
    onClick();
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, timer]);

  if (!isLoading) {
    return (
      <Box>
        <Button
          primary
          label={label}
          onClick={handleButtonClick}
          size="small"
          style={{ width: '80px', marginRight: '10px' }} 
          // disabled={disable}
        />
      </Box>
    );
  } else {
    return (
      <Box style={{width: '80px'}}>
        <Tag label={`${timer}`} type="black" timer />
      </Box>
    );
  }
}
