import * as React from "react";
import { useMutation } from "@apollo/client";

import { SmartMeetingsContext } from "../context";
import { isRoomAvailable } from "../utils";
import { CREATE_MEETING } from "../graphql/queries";

type Props = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  buildingId: number;
};
const FreeRooms = ({ title, date, startTime, endTime, buildingId }: Props) => {
  const [meetingRoomId, setMeetingRoomId] = React.useState<number | null>(null);
  const {
    buildings,
    rooms,
    meetings,
    largestMeetingId,
    updateLargestMeetingId,
  } = React.useContext(SmartMeetingsContext);
  const building = buildings.data[buildingId];

  const [
    createMeeting,
    {
      data: meetingSuccessData,
      loading: creatingMeeting,
      error: meetingErrorData,
    },
  ] = useMutation(CREATE_MEETING);

  const availableRooms = building.meetingRooms.filter((roomId) =>
    isRoomAvailable(date, startTime, endTime, rooms.data[roomId], meetings.data)
  );

  const handleSave = () => {
    createMeeting({
      variables: {
        id: largestMeetingId + 1,
        title,
        date,
        startTime,
        endTime,
        meetingRoomId,
      },
    });
    updateLargestMeetingId && updateLargestMeetingId(largestMeetingId + 1);
  };

  return meetingErrorData ? (
    <div>{`Error occurred while creating meeting`}</div>
  ) : meetingSuccessData ? (
    <div>{"Meeting created successfully"}</div>
  ) : (
    <div>
      <h1>{"Please select one of the Free Rooms"}</h1>
      {availableRooms.length === 0 ? (
        <div>{"No meeting rooms available"}</div>
      ) : null}
      {availableRooms.map((roomId) => {
        const { id, name } = rooms.data[roomId];
        return (
          <div key={id}>
            <button
              onClick={() => {
                setMeetingRoomId(id);
              }}
            >
              {name}
            </button>
          </div>
        );
      })}
      <button
        type="submit"
        disabled={!meetingRoomId || creatingMeeting}
        onClick={handleSave}
      >
        {"Save"}
      </button>
    </div>
  );
};

export default FreeRooms;
