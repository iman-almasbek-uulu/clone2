import {api as index} from ".."
import {AIRLINE} from "./types"
const api = index.injectEndpoints({
    endpoints: (build) => ({
        getAirTickets: build.query<AIRLINE.AirResponse, void> ({
            query: () => ({
                url: "airline_tickets",
                method: "GET"
            }),
            providesTags: ["airline"]
        })
        
    })
})


export const  {useGetAirTicketsQuery} = api