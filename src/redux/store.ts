import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import translateSlice from "./translate/translateSlice";
import { weatherApi } from "./weatherApi";
import { directionsApi } from "./googleMapsApi";
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [directionsApi.reducerPath]: directionsApi.reducer,
    translate: translateSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(weatherApi.middleware)
      .concat(directionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
