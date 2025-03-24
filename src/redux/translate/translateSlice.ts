import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialType {
    currentLang: string
}
const initialState: InitialType = {
    currentLang: typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en"
}


const languageSlice = createSlice({
    name: "translate",
    initialState,
    reducers: {
        setLanguage: (state,action: PayloadAction<string>) => {
            state.currentLang = action.payload
        }
    }
})

export const {setLanguage} = languageSlice.actions
export default languageSlice.reducer 