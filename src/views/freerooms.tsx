import * as React from "react";

import { SmartMeetingsContext } from "../context";
import { isRoomAvailable } from "../utils";

type Props = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  buildingId: number;
  onRooomSelect: (roomId: number) => void;
};
const FreeRooms = ({
  title,
  date,
  startTime,
  endTime,
  buildingId,
  onRooomSelect,
}: Props) => {
  const { buildings, rooms, meetings } = React.useContext(SmartMeetingsContext);
  const building = buildings.data[buildingId];

  const availableRooms = building.meetingRooms.filter((roomId) =>
    isRoomAvailable(date, startTime, endTime, rooms.data[roomId], meetings.data)
  );

  return (
    <div>
      <h1>{"Please select one of the Free Rooms"}</h1>
      {availableRooms.length === 0 ? (
        <div>{"No meeting rooms available"}</div>
      ) : null}
      {availableRooms.map((roomId) => {
        const { id, name, floor } = rooms.data[roomId];
        return (
          <div key={id}>
            <button
              onClick={() => {
                onRooomSelect(id);
              }}
            >
              {name}
            </button>
            <div>{building.name}</div>
            <div>
              {"Floor"} {floor}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FreeRooms;
