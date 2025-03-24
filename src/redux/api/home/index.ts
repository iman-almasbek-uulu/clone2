import {api as index} from ".."
import {HOME} from "./types"
const api = index.injectEndpoints({
    endpoints: (builder) => ({
        getAttractions: builder.query<HOME.AttractionsResponse, HOME.AttractionsRequest>({
            query: () => ({
                url: "/attractions",
                method: "GET",
            }),
            providesTags: ["attractions"]
        }),
        getCultureList: builder.query<HOME.CultureListResponse, HOME.CultureListRequest>({
            query: () => ({
                url: "/culture_list",
                method: "GET",
            }),
            providesTags: ["cultureList"]
        })
    })
})

export const {useGetAttractionsQuery, useGetCultureListQuery} = api