import { HomeActions, SET_TITLE } from "./homeTypes";

export const setTitle = (title :string) : HomeActions => ({
    type:SET_TITLE,
    title
})