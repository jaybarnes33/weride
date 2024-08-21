// WebSocketContext.tsx

import React, { ReactNode, createContext, useContext } from "react";
import WebSocketManager from "./Socket";

interface WebSocketContextType {
  webSocketManager: WebSocketManager;
  children?: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<WebSocketContextType> = ({
  children,
  webSocketManager,
}) => {
  return (
    <WebSocketContext.Provider value={{ webSocketManager }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider.");
  }
  return context;
};
