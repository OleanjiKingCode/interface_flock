import { Box, Button, type ButtonProps, Image } from "grommet";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { Close } from "grommet-icons";
import { Wallet } from "./Wallet";

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
    style={
      selected
        ? {
            backgroundColor: "#6C94EC",
            borderRadius: "20px",
            padding: "6px 16px 6px 16px",
            border: "2px solid black",
          }
        : {}
    }
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
      <div className="w-full flex flex-row">
        <Button onClick={() => setShowSidebar(false)}>
          <Close />
        </Button>
        <div className="w-[90%] flex text-center items-center justify-center ">
          <Image src="/static/images/logo.png" alt="logo" className="w-40" />
        </div>
      </div>
      <Box align="center" gap="large" margin={{ top: "xlarge" }}>
        <Wallet isSmall={true} />
        <MenuItem
          href="/cocreation"
          onClick={() => setSelected("/cocreation")}
          hoverIndicator={false}
          selected={selected === "/cocreation"}
          text="Co-create"
        />
        <MenuItem
          href="/points"
          onClick={() => setSelected("/points")}
          hoverIndicator={false}
          selected={selected === "/points"}
          text="Points"
        />
      </Box>
    </Box>
  );
};
