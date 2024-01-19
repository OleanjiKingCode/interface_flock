import {
  Box,
  Header,
  Image,
  Main,
  ResponsiveContext,
  Button,
  Layer,
} from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import {useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import { Menu } from './Menu';
import { Wallet } from './Wallet';
import { BurgerMenu } from './BurgerMenu';
import { useState } from 'react';
import { Footer } from './Footer';
import {toast, Toaster} from "react-hot-toast";
import {VerificationResultNotif} from "@/src/components/RAG/VerificationNotif";
import {Notification} from "@/src/components/Notification";
import {ICourierEventMessage, IInboxMessagePreview} from "@trycourier/react-provider";
import {CustomEvent} from "@libp2p/interface/events";
import {
  NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,
  NOTIFICATION_TYPE_MODEL_VERIFIED, NOTIFICATION_TYPE_REWARD_UPDATED
} from "@/src/constants/notificationTypes";
import {RAG_REWARDS} from "@/src/constants/constants";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { push, pathname } = useRouter();
  const size = useContext(ResponsiveContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifyVerified = (status:string,channel:string,reward:number) => {
    if(['SUCCESS','FAILURE'].includes(status)){
      toast(<VerificationResultNotif isSuccess={status==='SUCCESS'} channel={channel} reward={reward}/>,{
        duration: 3000,
        position: 'top-right',
        style: {
          border: '1px solid #713200',
          padding: '0px',
          margin: '0px',
          backgroundColor:'transparent',
          borderWidth:0,
          boxShadow:'none'
        },
      });
    }
  }

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const onMessageReceived=(msg:IInboxMessagePreview | ICourierEventMessage | undefined)=>{
    switch ((msg as any).data.notificationType) {
      case NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED:{
        const {contributionId,dataValidationStatus,filePath}=(msg as any).data
        console.log(`notificaiton received:${NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED}`)
        dispatchEvent(new CustomEvent(NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,{
          bubbles: true,
          detail: (msg as any).data
        }))
        notifyVerified(dataValidationStatus,`${filePath} in Contribution ${contributionId}`,RAG_REWARDS.REWARD_FOR_CONTRIBUTORS)
        break
      }
      case NOTIFICATION_TYPE_MODEL_VERIFIED:{
        const {dataValidationStatus,modelName}=(msg as any).data
        console.log(`notificaiton received:${NOTIFICATION_TYPE_MODEL_VERIFIED}`)
        dispatchEvent(new CustomEvent(NOTIFICATION_TYPE_MODEL_VERIFIED,{
          bubbles: true,
          detail: (msg as any).data
        }))
        notifyVerified(dataValidationStatus,`Model ${modelName}`,RAG_REWARDS.REWARD_FOR_MODEL_CREATION)
        break
      }
      case NOTIFICATION_TYPE_REWARD_UPDATED:{
        console.log('ryon notification received')
        dispatchEvent(new CustomEvent(NOTIFICATION_TYPE_REWARD_UPDATED,{
          bubbles: true,
          detail: (msg as any).data
        }))
        break
      }
    }
  }
  return (
    <Box background="#F8FAFB" fill>
      <Toaster gutter={0}/>
      <Header
        direction="row"
        align="center"
        justify="center"
        pad={{ vertical: 'small' }}
        border={scrolled ? "bottom" : undefined}
        gap="xlarge"
        background="#FFFFFF"
        height="xsmall"
        fill="horizontal"
        style={{ position: 'sticky', top: 0, zIndex: 1 }}
      >
        <div className={`w-5/6 flex flex-row items-center md:justify-between gap-x-4`}>
          {size === 'small' && (
            <Button onClick={() => setShowSidebar(!showSidebar)}>
              <MenuIcon />
            </Button>
          )}
          <div className={`flex ${size === 'small' && "w-full"} justify-center`}>
            <Box width={{max: "small"}}>
              <Image src="/static/images/logo.png" onClick={() => void push('/')} alt="logo" />
            </Box>          
          </div>
          {size !== 'small' && <Menu />}
          {size !== 'small' && <Wallet />}          
        </div>
      </Header>
      {showSidebar && (
        <Layer
          onEsc={() => setShowSidebar(false)}
          onClickOutside={() => setShowSidebar(false)}
          animation="slide"
          position="left"
          full="vertical"
        >
          <Box>
            <BurgerMenu setShowSidebar={setShowSidebar} />
          </Box>
        </Layer>
      )}
      <Main>
        <Box fill>{children}</Box>
      </Main>
      <Footer />
      <Notification children={null} onMessageReceived={onMessageReceived}/>
    </Box>
  );
};
