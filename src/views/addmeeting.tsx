import * as React from "react";
import moment from "moment";
import { useMutation } from "@apollo/client";
import styled from "styled-components";

import { SmartMeetingsContext } from "../context";
import FreeRooms from "./freerooms";
import { DATE_FORMAT, isEndTimeLessThanStartTime } from "../utils";
import { CREATE_MEETING } from "../graphql/queries";
import { StyledButton, Field } from "../styles";

const ChooseRooms = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 1px solid #c3c3c3;
`;
const StyledH2 = styled.h2`
  text-align: center;
`;
const SuccessMessage = styled.div`
  div {
    margin: 10px;
  }
  a {
    padding: 10px;
  }
`;

const StyledSecondaryButton = styled(StyledButton)`
  background: #5b5b5c;
  color: #ffffff;
  border-radius: 8px;
  &:hover {
    background: #343435;
  }
`;

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
      if (
        isEndTimeLessThanStartTime(
          formData.date,
          formData.startTime,
          formData.endTime
        )
      ) {
        alert("End time should be greater than start time");
      } else {
        setFormData(formData);
        setMeetingRoomId(null);
      }
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
    <SuccessMessage>
      <h3>{"Meeting created successfully"}</h3>
      <div>
        <a href="/">{"Go to Home"}</a>|
        <a href="/add-meeting">{"Add Meeting"}</a>
      </div>
    </SuccessMessage>
  ) : (
    <>
      <form onSubmit={handleFormSubmit}>
        <StyledH2>{"Add Meeting"}</StyledH2>
        <Field>
          <label htmlFor="meeting-title">{"Title:"}</label>
          <input
            type="text"
            id="meeting-title"
            name="meeting-title"
            required
            placeholder={"Add meeting title"}
          />
        </Field>
        <Field>
          <label htmlFor="meeting-date">{"Date:"}</label>
          <input
            type="date"
            id="meeting-date"
            name="meeting-date"
            required
            defaultValue={moment().format("YYYY-MM-DD")}
          />
        </Field>
        <Field>
          <label htmlFor="meeting-start-time">{"Start Time:"}</label>
          <input
            type="time"
            id="meeting-start-time"
            name="meeting-start-time"
            required
            defaultValue={moment().format("hh:mm")}
          />
        </Field>
        <Field>
          <label htmlFor="meeting-end-time">{"End Time:"}</label>
          <input
            type="time"
            id="meeting-end-time"
            name="meeting-end-time"
            required
            defaultValue={moment().add(1, "hours").format("hh:mm")}
          />
        </Field>
        <Field>
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
        </Field>
        <StyledSecondaryButton type="submit">
          {formData ? "Refresh Rooms" : "Next"}
        </StyledSecondaryButton>
      </form>
      {formData ? (
        <ChooseRooms>
          <FreeRooms
            {...formData}
            onRooomSelect={handleRoomSelect}
            meetingRoomId={meetingRoomId}
          />
          <StyledButton
            type="submit"
            disabled={!meetingRoomId || creatingMeeting}
            onClick={handleSave}
          >
            {"Create Meeting"}
          </StyledButton>
        </ChooseRooms>
      ) : null}
    </>
  );
};

export default AddMeeting;
