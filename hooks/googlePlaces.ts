import { useLocation } from "@/context/Location";
import { useState, useEffect } from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";

const useGooglePlaces = () => {
  const [places, setPlaces] = useState<
    { data: GooglePlaceData; details: GooglePlaceDetail }[] | []
  >([]);
  const [loading, setLoading] = useState(false);
  const { location } = useLocation();
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.EXPO_PUBLIC_MAPS_KEY}&place_id=${placeId}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        return data.result;
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      setError(error as Error);
      return null;
    }
  };

  const search = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.EXPO_PUBLIC_MAPS_KEY}&input=${query}&country=gh&location=${location.latitude},${location.longitude}&radius=800`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const detailedPlaces = await Promise.all(
          data.predictions.map(async (prediction: GooglePlaceData) => {
            const details = await fetchPlaceDetails(prediction.place_id);
            return { data: prediction, details };
          })
        );

        setPlaces(
          detailedPlaces as {
            data: GooglePlaceData;
            details: GooglePlaceDetail;
          }[]
        );
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.length) {
      return setPlaces([]);
    }
    search(searchQuery);
  }, [searchQuery]);

  return { places, loading, error, searchQuery, setSearchQuery };
};

export default useGooglePlaces;
