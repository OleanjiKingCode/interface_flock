import { Box, type ButtonProps } from "grommet";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface MenuItemProps {
  selected: boolean;
  text: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ selected, text, onClick }) => (
  <div
    onClick={onClick}
    className={`${
      selected
        ? "bg-blue-500 rounded-full px-4 py-1 border-2 border-black text-white"
        : ""
    } hover:bg-blue-500 hove hover:border-black hover:text-white text-black hover:px-4 hover:py-1 hover:cursor-pointer hover:rounded-full`}
  >
    <p>{text}</p>
  </div>
);

export const Menu = () => {
  const { pathname, push } = useRouter();
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
          onClick={() => {
            setSelected("/cocreation");
            push("/cocreation");
          }}
          selected={selected === "/cocreation"}
          text="Co-create"
        />
        <MenuItem
          onClick={() => {
            setSelected("/points");
            push("/points");
          }}
          selected={selected === "/points"}
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
