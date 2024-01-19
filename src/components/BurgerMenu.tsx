import { Box, Button, type ButtonProps, Image } from 'grommet';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { Close } from 'grommet-icons';
import { Wallet } from './Wallet';

interface MenuItemProps {
  selected: boolean;
  text: string;
}
const MenuItem = ({
  selected,
  text,
  ...rest
}: MenuItemProps & ButtonProps & { onClick?: () => void }) => (
  <Button
    {...rest}
    plain
    hoverIndicator={false}
    style={selected ? { backgroundColor: '#6C94EC', borderRadius: '20px', padding: '6px 16px 6px 16px', border: '2px solid black' } : {}}
  >
    <p className={`text-${selected ? "white" : "black"}`}>{text}</p>
  </Button>
);

export const BurgerMenu = ({
  setShowSidebar,
}: {
  setShowSidebar: (show: boolean) => void;
}) => {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState(pathname);

  useEffect(() => {
    if (pathname) {
      setSelected(pathname);
    }
  }, [pathname]);

  return (
    <Box pad="large">
      <Box direction="row" gap="xlarge" align="center">
        <Button onClick={() => setShowSidebar(false)}>
          <Close />
        </Button>
        <Box width="small">
          <Image src="/static/images/logo.png" alt="logo" />
        </Box>
      </Box>
      <Box align="center" gap="large" margin={{ top: 'xlarge' }}>
        <Wallet />
        <MenuItem
          href="/cocreation"
          onClick={() => setSelected('/cocreation')}
          hoverIndicator={false}
          selected={selected === '/cocreation'}
          text="Co-create"
        />
        <MenuItem
          href="/points"
          onClick={() => setSelected('/points')}
          hoverIndicator={false}
          selected={selected === '/points'}
          text="Points"
        />
      </Box>
    </Box>
  );
};
