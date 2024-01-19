import { Button } from 'grommet';
import React from 'react';

interface SecondaryButtonProps {
  href?: string;
  disabled?: boolean;
  [key: string]: any; 
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  href,
  disabled = false, // default value for disabled
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement |  HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault(); // Prevents the default action if the button is disabled
      return;
    }
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <Button
      secondary
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    />
  );
};
