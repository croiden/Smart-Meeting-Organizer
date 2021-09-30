import { gql } from "@apollo/client";

export const FETCH_ALL_DATA = gql`
  query getAllData {
    Buildings {
      id
      name
      meetingRooms {
        id
        name
        floor
        meetings {
          id
          title
          date
          startTime
          endTime
        }
      }
    }
  }
`;
