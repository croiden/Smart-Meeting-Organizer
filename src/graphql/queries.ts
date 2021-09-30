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

export const CREATE_MEETING = gql`
  mutation createMeeting(
    $id: Int!
    $title: String!
    $date: String!
    $startTime: String!
    $endTime: String!
    $meetingRoomId: Int!
  ) {
    Meeting(
      id: $id
      title: $title
      date: $date
      startTime: $startTime
      endTime: $endTime
      meetingRoomId: $meetingRoomId
    ) {
      id
      title
    }
  }
`;
