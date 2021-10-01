import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { SmartMeetingsContext } from "../context";
import {
  getTodaysMeetings,
  getOngoingMeetings,
  getFreeRoomsNow,
} from "../utils";
import { StyledButton } from "../styles";

const Container = styled.div`
  width: 100%;
`;
const Row = styled.div`
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #d0d0d0;
  text-align: left;
`;

const Main = () => {
  const { loading, error, buildings, rooms, meetings } =
    React.useContext(SmartMeetingsContext);

  const [noOfFreeRooms, setNoOfFreeRooms] = React.useState(0);
  const [noOfTodaysMeetings, setNoOfTodaysMeetings] = React.useState(0);
  const [noOfOngoingMeetings, setNoOfOngoingMeetings] = React.useState(0);

  const history = useHistory();

  React.useEffect(() => {
    function calculateNumbers() {
      const todaysMeetings = getTodaysMeetings(meetings);
      setNoOfTodaysMeetings(todaysMeetings.length);

      const ongoingMeetings = getOngoingMeetings(
        meetings.contents,
        meetings.data
      );
      setNoOfOngoingMeetings(ongoingMeetings.length);

      const freeRoomsNow = getFreeRoomsNow(
        rooms.contents,
        rooms.data,
        meetings.data
      );
      setNoOfFreeRooms(freeRoomsNow.length);
    }
    calculateNumbers();

    let timer = setInterval(() => {
      calculateNumbers();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [meetings, rooms]);

  const handleAddMeeting = () => {
    history.push("/add-meeting");
  };

  if (error) {
    return <div>{"Error occurred..."}</div>;
  }
  return (
    <Container>
      <Row>
        <h2>{"Buildings"}</h2>
        <p>
          {"Total"} {loading ? "..." : buildings.contents.length}
        </p>
      </Row>
      <Row>
        <h2>{"Rooms"}</h2>
        <p>
          {"Total"} {loading ? "..." : rooms.contents.length}
        </p>
        <p>
          {"Free Now"} {loading ? "..." : noOfFreeRooms}
        </p>
      </Row>
      <Row>
        <h2>{"Meetings"}</h2>
        <p>
          {"Total"} {loading ? "..." : noOfTodaysMeetings} {"Today"}
        </p>
        <p>
          {"Total"} {loading ? "..." : noOfOngoingMeetings} {"going on now"}
        </p>
      </Row>
      <StyledButton onClick={handleAddMeeting}>{"Add a Meeting"}</StyledButton>
    </Container>
  );
};

export default Main;
