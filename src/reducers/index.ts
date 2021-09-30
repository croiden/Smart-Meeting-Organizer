import { BuildingsType, RoomsType, MeetingsType } from "../types";
import { ApolloError } from "@apollo/client";

export type StateType = {
  buildings: BuildingsType;
  rooms: RoomsType;
  meetings: MeetingsType;
  loading: boolean;
  error?: ApolloError | undefined;
  largestMeetingId: number;
  updateLargestMeetingId?: (val: number) => void;
};
type Action =
  | { type: "LOADING" }
  | { type: "ERROR"; error: ApolloError | undefined }
  | {
      type: "SET_DATA";
      payload: {
        buildings: BuildingsType;
        rooms: RoomsType;
        meetings: MeetingsType;
      };
    }
  | {
      type: "UPDATE_LARGEST_MEETING_ID";
      payload: number;
    };

export const initDataStructure = {
  contents: [],
  data: {},
};
export const initialState: StateType = {
  buildings: initDataStructure,
  rooms: initDataStructure,
  meetings: initDataStructure,
  loading: true,
  largestMeetingId: 0,
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
    case "SET_DATA":
      return {
        ...state,
        loading: false,
        error: undefined,
        ...action.payload,
      };
    case "UPDATE_LARGEST_MEETING_ID":
      return {
        ...state,
        largestMeetingId: action.payload,
      };
    default:
      return state;
  }
}
