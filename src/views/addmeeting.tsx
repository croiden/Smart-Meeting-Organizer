import * as React from "react";
import moment from "moment";
import { useMutation } from "@apollo/client";

import { SmartMeetingsContext } from "../context";
import FreeRooms from "./freerooms";
import { DATE_FORMAT } from "../utils";
import { CREATE_MEETING } from "../graphql/queries";

const AddMeeting = () => {
  const { buildings, largestMeetingId, updateLargestMeetingId } =
    React.useContext(SmartMeetingsContext);
  const [formData, setFormData] = React.useState<null | {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    buildingId: number;
  }>(null);
  const [meetingRoomId, setMeetingRoomId] = React.useState<number | null>(null);

  const [
    createMeeting,
    {
      data: meetingSuccessData,
      loading: creatingMeeting,
      error: meetingErrorData,
    },
  ] = useMutation(CREATE_MEETING);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { elements }: { elements: any } = e.currentTarget;
    if (elements.length >= 5) {
      const formData = {
        title: elements[0].value,
        date: moment(elements[1].value, "YYYY-MM-DD").format(DATE_FORMAT),
        startTime: elements[2].value,
        endTime: elements[3].value,
        buildingId: elements[4].value,
      };
      setFormData(formData);
    }
    return false;
  };

  const handleSave = () => {
    if (formData) {
      const { title, date, startTime, endTime } = formData;
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
    }
  };
  const handleRoomSelect = (roomId: number) => {
    setMeetingRoomId(roomId);
  };

  return meetingErrorData ? (
    <div>{`Error occurred while creating meeting`}</div>
  ) : meetingSuccessData ? (
    <>
      <div>{"Meeting created successfully"}</div>
      <div>
        <a href="/">{"Go to Home"}</a>|
        <a href="/add-meeting">{"Add Meeting"}</a>
      </div>
    </>
  ) : (
    <>
      <form onSubmit={handleFormSubmit}>
        <h1>{"Add Meeting"}</h1>
        <div>
          <label htmlFor="meeting-title">{"Title:"}</label>
          <input
            type="text"
            id="meeting-title"
            name="meeting-title"
            required
            placeholder={"Add meeting title"}
          />
        </div>
        <div>
          <label htmlFor="meeting-date">{"Date:"}</label>
          <input type="date" id="meeting-date" name="meeting-date" required />
        </div>
        <div>
          <label htmlFor="meeting-start-time">{"Start Time:"}</label>
          <input
            type="time"
            id="meeting-start-time"
            name="meeting-start-time"
            required
          />
        </div>
        <div>
          <label htmlFor="meeting-end-time">{"End Time:"}</label>
          <input
            type="time"
            id="meeting-end-time"
            name="meeting-end-time"
            required
          />
        </div>
        <div>
          <label htmlFor="meeting-buildings">{"Select Building:"}</label>
          <select name="meeting-buildings" id="meeting-buildings" required>
            <option value="">{"None"}</option>
            {buildings.contents.map((id) => {
              const { name } = buildings.data[id];
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit">{formData ? "Refresh" : "Next"}</button>
      </form>
      {formData ? (
        <>
          <FreeRooms {...formData} onRooomSelect={handleRoomSelect} />
          <button
            type="submit"
            disabled={!meetingRoomId || creatingMeeting}
            onClick={handleSave}
          >
            {"Save"}
          </button>
        </>
      ) : null}
    </>
  );
};

export default AddMeeting;
