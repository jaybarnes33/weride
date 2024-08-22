import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import { getTokens } from "@/utils";
import { useRouter } from "expo-router";
import { useWebSocket } from "@/socket/SocketContext";
import useUser from "@/hooks/useUser";
import { useLocation } from "@/context/Location";

const AuthContent = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  const { webSocketManager } = useWebSocket();
  const { user } = useUser();
  const { location } = useLocation();
  React.useEffect(() => {
    (async () => {
      const tokens = await getTokens();
      if (!tokens?.accessToken) {
        push("Auth");
      }
      if (!user) return;

      webSocketManager
        .getSocket()
        ?.emit("registerClient", { id: user._id, location: location });
    })();
  }, []);
  return <>{children}</>;
};

export default AuthContent;
