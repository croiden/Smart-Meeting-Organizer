import * as React from "react";
import { SmartMeetingsContext } from "../context";
import {
  getTodaysMeetings,
  getOngoingMeetings,
  getFreeRoomsNow,
} from "../utils";

const Main = () => {
  const { loading, error, buildings, rooms, meetings } =
    React.useContext(SmartMeetingsContext);

  const [noOfFreeRooms, setNoOfFreeRooms] = React.useState(0);
  const [noOfTodaysMeetings, setNoOfTodaysMeetings] = React.useState(0);
  const [noOfOngoingMeetings, setNoOfOngoingMeetings] = React.useState(0);

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

  if (error) {
    return <div>{"Error occurred..."}</div>;
  }
  if (loading) {
    return <div>{"Loading... Please wait..."}</div>;
  }
  return (
    <div>
      <div>
        <h1>{"Buildings"}</h1>
        <p>
          {"Total"} {buildings.contents.length}
        </p>
      </div>
      <div>
        <h1>{"Rooms"}</h1>
        <p>
          {"Total"} {rooms.contents.length}
        </p>
        <p>
          {"Free Now"} {noOfFreeRooms}
        </p>
      </div>
      <div>
        <h1>{"Meetings"}</h1>
        <p>
          {"Total"} {noOfTodaysMeetings} {"Today"}
        </p>
        <p>
          {"Total"} {noOfOngoingMeetings} {"going on now"}
        </p>
      </div>
      <button>{"Add a Meeting"}</button>
    </div>
  );
};

export default Main;
