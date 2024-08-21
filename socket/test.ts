import WebSocketManager from "./Socket";

export const testWebSocketManager = () => {
  try {
    const webSocketManager = new WebSocketManager();
    const conn = webSocketManager.connect("ws://localhost:8000");
    console.log(webSocketManager.isConnected());
  } catch (error) {
    console.log(error);
  }
};

testWebSocketManager();
