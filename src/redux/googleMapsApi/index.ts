import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface DirectionsResponse {
  distance: string;
  duration: string;
}

export const directionsApi = createApi({
  reducerPath: "directionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getDirections: builder.query<
      DirectionsResponse,
      { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; mode: string }
    >({
      queryFn: async ({ origin, destination, mode }) => {
        const directionsService = new google.maps.DirectionsService();

        let travelMode: google.maps.TravelMode;
        let transitOptions: google.maps.TransitOptions | undefined;

        switch (mode) {
          case "WALKING":
            travelMode = google.maps.TravelMode.WALKING;
            break;
          case "DRIVING":
            travelMode = google.maps.TravelMode.DRIVING;
            break;
          case "TRAIN":
            travelMode = google.maps.TravelMode.TRANSIT;
            transitOptions = { modes: [google.maps.TransitMode.TRAIN] };
            break;
          default:
            return {
              error: {
                status: "CUSTOM_ERROR" as const,
                error: "Invalid travel mode",
                data: "The provided travel mode is not supported",
              } as FetchBaseQueryError,
            };
        }

        return new Promise((resolve) => {
          directionsService.route(
            {
              origin,
              destination,
              travelMode,
              ...(transitOptions && { transitOptions }),
              region: "KG",
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                const route = result.routes[0].legs[0];
                const distance = route.distance?.text ?? "Unknown distance";
                const duration = route.duration?.text ?? "Unknown duration";
                resolve({
                  data: { distance, duration },
                });
              } else {
                resolve({
                  error: {
                    status: "CUSTOM_ERROR" as const,
                    error: `Failed to fetch directions: ${status}`,
                    data: status ?? "UNKNOWN_ERROR",
                  } as FetchBaseQueryError,
                });
              }
            }
          );
        });
      },
    }),
  }),
});

export const { useGetDirectionsQuery } = directionsApi;
