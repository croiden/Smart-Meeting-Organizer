import * as React from "react";
import { useApolloClient, ApolloError } from "@apollo/client";

import reducer, { initialState, initDataStructure } from "../reducers";
import { FETCH_ALL_DATA } from "../graphql/queries";

// types
import { ResponseType, BuildingsType, RoomsType, MeetingsType } from "../types";
import { StateType } from "../reducers/";

export const SmartMeetingsContext =
  React.createContext<StateType>(initialState);

type Props = {
  children: React.ReactNode;
};
export const SmartMeetingsProvider = ({ children }: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const client = useApolloClient();

  React.useEffect(() => {
    let ignore = false;
    dispatch({
      type: "LOADING",
    });
    async function fetchAllData() {
      const {
        error,
        data,
      }: {
        loading: boolean;
        error?: ApolloError | undefined;
        data: ResponseType;
      } = await client.query({
        query: FETCH_ALL_DATA,
      });
      if (!ignore) {
        if (error) {
          dispatch({
            type: "ERROR",
            error,
          });
        } else {
          const { Buildings } = data;

          let meetings: MeetingsType = initDataStructure;
          let rooms: RoomsType = initDataStructure;
          let largestMeetingId = 0;

          /** construct buildings start */
          const buildings: BuildingsType = Buildings.reduce(
            (acc, { id, name, meetingRooms }) => {
              /** construct rooms start */
              rooms = meetingRooms.reduce(
                (acc, { id, name, floor, meetings: bMeetings }) => {
                  /** construct meetings start */
                  meetings = bMeetings.reduce((acc, meeting) => {
                    largestMeetingId = Math.max(largestMeetingId, meeting.id);
                    return {
                      contents: [...acc.contents, meeting.id],
                      data: {
                        ...acc.data,
                        [meeting.id]: {
                          ...meeting,
                        },
                      },
                    };
                  }, meetings);
                  /** construct meetings end */

                  return {
                    contents: [...acc.contents, id],
                    data: {
                      ...acc.data,
                      [id]: {
                        id,
                        name,
                        floor,
                        meetings: bMeetings.map(({ id }) => id),
                      },
                    },
                  };
                },
                rooms
              );
              /** construct rooms end */

              return {
                contents: [...acc.contents, id],
                data: {
                  ...acc.data,
                  [id]: {
                    id,
                    name,
                    meetingRooms: meetingRooms.map(({ id }) => id),
                  },
                },
              };
            },
            initDataStructure as BuildingsType
          );
          /** construct buildings end */

          dispatch({
            type: "SET_DATA",
            payload: {
              buildings,
              rooms,
              meetings,
            },
          });
          updateLargestMeetingId(largestMeetingId);
        }
      }
    }
    fetchAllData();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLargestMeetingId = (largestMeetingId: number) => {
    dispatch({
      type: "UPDATE_LARGEST_MEETING_ID",
      payload: largestMeetingId,
    });
  };

  const value = { ...state, updateLargestMeetingId };
  return (
    <SmartMeetingsContext.Provider value={value}>
      {children}
    </SmartMeetingsContext.Provider>
  );
};
