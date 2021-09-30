import { MeetingsType, RoomsType } from "../types";
import moment from "moment";

const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "hh:mm";
export const getTodaysMeetings = (meetings: MeetingsType) => {
  const { contents, data } = meetings;
  const today = moment().format(DATE_FORMAT);

  return contents.filter((id) => data[id].date === today);
};

export const getOngoingMeetings = (
  contents: MeetingsType["contents"],
  data: MeetingsType["data"]
) => {
  const currentTimeStamp = moment().valueOf();

  return contents.filter((id) => {
    const { date, startTime, endTime } = data[id];

    const startTimeStamp = moment(
      `${date} ${startTime}`,
      `${DATE_FORMAT} ${TIME_FORMAT}`
    ).valueOf();

    const endTimeStamp = moment(
      `${date} ${endTime}`,
      `${DATE_FORMAT} ${TIME_FORMAT}`
    ).valueOf();

    return (
      startTimeStamp <= currentTimeStamp && currentTimeStamp <= endTimeStamp
    );
  });
};

export const getFreeRoomsNow = (
  contents: RoomsType["contents"],
  data: RoomsType["data"],
  meetingsData: MeetingsType["data"]
) =>
  contents.filter((id) => {
    const { meetings } = data[id];
    const ongoingMeetings = getOngoingMeetings(meetings, meetingsData);
    return ongoingMeetings.length === 0;
  });
