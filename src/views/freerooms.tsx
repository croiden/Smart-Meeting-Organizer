import * as React from "react";
import styled from "styled-components";

import { SmartMeetingsContext } from "../context";
import { isRoomAvailable } from "../utils";

const Container = styled.div`
  h2 {
    text-align: center;
  }
  min-width: 300px;
  padding-left: 20px;
`;
const StyledButtonRow = styled.button<{ selected: boolean }>`
  display: flex;
  width: calc(100% - 20px);
  margin: 10px;
  flex-direction: column;

  cursor: pointer;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #c5d3e8;
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#3f3f3f" : "")};
  color: ${(props) => (props.selected ? "#FFFFFF" : "")};

  &:hover {
    background-color: #d5d5d5;
    color: #000000;
  }
  h3 {
    margin-top: 0px;
  }
`;

const NoRooms = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-style: italic;
  color: grey;
`;

type Props = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  buildingId: number;
  onRooomSelect: (roomId: number) => void;
  meetingRoomId: number | null;
};
const FreeRooms = ({
  title,
  date,
  startTime,
  endTime,
  buildingId,
  onRooomSelect,
  meetingRoomId,
}: Props) => {
  const { buildings, rooms, meetings } = React.useContext(SmartMeetingsContext);
  const building = buildings.data[buildingId];

  const availableRooms = building.meetingRooms.filter((roomId) =>
    isRoomAvailable(date, startTime, endTime, rooms.data[roomId], meetings.data)
  );

  return (
    <Container>
      <h2>{"Choose Room"}</h2>
      {availableRooms.length === 0 ? (
        <NoRooms>{"No meeting rooms available"}</NoRooms>
      ) : null}
      {availableRooms.map((roomId) => {
        const { id, name, floor } = rooms.data[roomId];
        return (
          <StyledButtonRow
            key={id}
            onClick={() => {
              onRooomSelect(id);
            }}
            selected={meetingRoomId === id}
          >
            <h3>{name}</h3>
            <div>{building.name}</div>
            <div>
              {"Floor"} {floor}
            </div>
          </StyledButtonRow>
        );
      })}
    </Container>
  );
};

export default FreeRooms;
