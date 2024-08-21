// WebSocketManager.ts

import io, { Socket } from "socket.io-client";

class WebSocketManager {
  private socket: Socket | null = null;
  private connected = false;

  // Connect to the backend WebSocket server
  connect(url: string) {
    this.socket = io(url);
    this.connected = true;

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.connected = false;
    });

    this.socket.on("error", (e) => console.log(e));
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connected = false;
  }

  // Get the WebSocket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if the WebSocket is connected
  isConnected(): boolean {
    return this.connected;
  }
}

export default WebSocketManager;
