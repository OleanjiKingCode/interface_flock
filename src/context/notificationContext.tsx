import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';
import {ICourierEventMessage, IInboxMessagePreview} from '@trycourier/react-provider';

interface NotificationContextType {
  message: IInboxMessagePreview | ICourierEventMessage | undefined;
  setMessage: (message: IInboxMessagePreview | ICourierEventMessage | undefined) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: FunctionComponent<NotificationProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<IInboxMessagePreview | ICourierEventMessage | undefined>(undefined);

  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
