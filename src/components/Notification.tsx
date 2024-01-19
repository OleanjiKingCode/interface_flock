import {
  CourierProvider, ICourierEventMessage,
  IInboxMessagePreview,
} from '@trycourier/react-provider';
import { useAccount } from 'wagmi';
import { useNotification } from '../context/notificationContext';

interface Props {
  children: React.ReactNode;
  onMessageReceived: (msg:IInboxMessagePreview | ICourierEventMessage | undefined) => void;
}

export const Notification = ({ children, onMessageReceived }: Props) => {
  const { address } = useAccount();
  const { setMessage } = useNotification();

  const handleOnMessage = (message: IInboxMessagePreview | ICourierEventMessage | undefined) => {
    console.log("message from courier", message);
    if (onMessageReceived) {
      onMessageReceived(message); // Call the callback function
    }
    setMessage(message);
    return message;
  };

  return (
    // Note: Do not use wsOptions inside, it will swallow the messages as it will go though the wsOptions
    // if there are multiple msgs at the same time
    <CourierProvider
      userId={address?.toLowerCase()}
      clientKey={process.env.NEXT_PUBLIC_COURIER_CLIENT_KEY}
      onMessage={handleOnMessage}
    >
      {children}
    </CourierProvider>
  );
};
