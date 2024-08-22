export interface RideRequest {
  passenger: Record<string, any>;
  driver: Record<string, any>;
  pickupLocation: {
    latitude: number;
    longitude: number;
    placeName: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    placeName: string;
  };
  price: number;
  _id: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  createdAt: string;
}
