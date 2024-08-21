import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Geolocation from "expo-location";
import { LatLng } from "react-native-maps";

interface contextProps {
  location: LatLng;
  setLocation: Dispatch<SetStateAction<LatLng>>;
}
const LocationContext = createContext<contextProps | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Geolocation.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let { status: bg } =
          await Geolocation.requestBackgroundPermissionsAsync();
        if (bg === "granted") {
          await Geolocation.watchPositionAsync(
            {
              accuracy: 6,
            },
            (location) => {
              setLocation({
                latitude:
                  location.coords.latitude != 0
                    ? location.coords.latitude
                    : 6.5244,
                longitude:
                  location.coords.longitude != 0
                    ? location.coords.longitude
                    : -1.222,
              });
            }
          );
        }
      }
    })();
  }, []);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw Error("useLocation was called without a provider");
  }
  return context;
};
