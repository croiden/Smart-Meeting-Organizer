import { BuildingsType, RoomsType, MeetingsType } from "../types";
import { ApolloError } from "@apollo/client";

export type StateType = {
  buildings: BuildingsType;
  rooms: RoomsType;
  meetings: MeetingsType;
  loading: boolean;
  error?: ApolloError | undefined;
};
type Action =
  | { type: "LOADING" }
  | { type: "ERROR"; error: ApolloError | undefined }
  | { type: "SET_BUILDINGS"; payload: BuildingsType }
  | { type: "SET_ROOMS"; payload: RoomsType }
  | { type: "SET_MEETINGS"; payload: MeetingsType };

export const initDataStructure = {
  contents: [],
  data: {},
};
export const initialState: StateType = {
  buildings: initDataStructure,
  rooms: initDataStructure,
  meetings: initDataStructure,
  loading: false,
};

export default function reducer(
  state: StateType = initialState,
  action: Action
): StateType {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: undefined };
    case "ERROR":
      return { ...state, loading: false, error: action.error };
    case "SET_BUILDINGS":
      return {
        ...state,
        loading: false,
        error: undefined,
        buildings: action.payload,
      };
    case "SET_ROOMS":
      return {
        ...state,
        loading: false,
        error: undefined,
        rooms: action.payload,
      };
    case "SET_MEETINGS":
      return {
        ...state,
        loading: false,
        error: undefined,
        meetings: action.payload,
      };
    default:
      return state;
  }
}
