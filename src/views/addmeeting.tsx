import * as React from "react";
import moment from "moment";

import { SmartMeetingsContext } from "../context";
import FreeRooms from "./freerooms";
import { DATE_FORMAT } from "../utils";

const AddMeeting = () => {
  const { buildings } = React.useContext(SmartMeetingsContext);
  const [formData, setFormData] = React.useState<null | {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    buildingId: number;
  }>(null);

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
  return (
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
      {formData ? <FreeRooms {...formData} /> : null}
    </>
  );
};

export default AddMeeting;
