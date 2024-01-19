import { Box, Button, type ButtonProps } from 'grommet';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    style={selected ? { backgroundColor: '#6C94EC', borderRadius: '20px', padding: '6px 16px 6px 16px', border: '2px solid black' } : {}}
  >
    <p className={`text-${selected ? "white" : "black"}`}>{text}</p>
  </Button>
);

export const Menu = () => {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState(pathname);

  useEffect(() => {
    if (pathname) {
      setSelected(pathname);
    }
  }, [pathname]);

  return (
    <Box>
      <Box direction="row" align="center" gap="medium">
        {/* <MenuItem
          href="/"
          onClick={() => setSelected('/')}
          hoverIndicator={false}
          selected={selected === '/'}
          text="Home"
        />
        <MenuItem
          href="/quest"
          onClick={() => setSelected('/quest')}
          hoverIndicator={false}
          selected={selected === '/quest'}
          text="Faucet"
        /> */}
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
        {/* <MenuItem
          href="/train"
          onClick={() => setSelected('/train')}
          hoverIndicator={false}
          selected={selected === '/train'}
          text="Train"
        />
        <MenuItem
          href="/marketplace"
          onClick={() => setSelected('/marketplace')}
          hoverIndicator={false}
          selected={selected === '/marketplace'}
          text="Marketplace"
        />
        <MenuItem
          href="https://flock-io.gitbook.io/flock/"
          target="_blank"
          //onClick={() => setSelected('/aboutUs')}
          hoverIndicator={false}
          selected={selected === '/aboutUs'}
          text="About Us"
        /> */}
      </Box>
    </Box>
  );
};
