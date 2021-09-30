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
        console.log(data);
        if (error) {
          dispatch({
            type: "ERROR",
            error,
          });
        } else {
          const { Buildings } = data;

          let meetings: MeetingsType = initDataStructure;
          let rooms: RoomsType = initDataStructure;

          /** construct buildings start */
          const buildings: BuildingsType = Buildings.reduce(
            (acc, { id, name, meetingRooms }) => {
              /** construct rooms start */
              rooms = meetingRooms.reduce(
                (acc, { id, name, floor, meetings: bMeetings }) => {
                  /** construct meetings start */
                  meetings = bMeetings.reduce((acc, meeting) => {
                    return {
                      contents: [...acc.contents, meeting.id],
                      data: {
                        ...acc.data,
                        [id]: {
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
            type: "SET_BUILDINGS",
            payload: buildings,
          });

          dispatch({
            type: "SET_ROOMS",
            payload: rooms,
          });

          dispatch({
            type: "SET_MEETINGS",
            payload: meetings,
          });
        }
      }
    }
    fetchAllData();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { ...state };
  return (
    <SmartMeetingsContext.Provider value={value}>
      {children}
    </SmartMeetingsContext.Provider>
  );
};
