import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const weatherApi = createApi({
    reducerPath: "weatherApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.openweathermap.org/data/2.5/" }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: ({lat, lon}) => `weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`,
        }),
    })
});

export const { useGetWeatherQuery } = weatherApi;