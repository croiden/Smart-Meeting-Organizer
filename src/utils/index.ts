import { MeetingsType, RoomsType, RoomType } from "../types";
import moment from "moment";

export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "hh:mm";
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

    const startTimeStamp = getTimeStamp(date, startTime);
    const endTimeStamp = getTimeStamp(date, endTime);

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

export const isRoomAvailable = (
  meetingDate: string,
  meetingStartTime: string,
  meetingEndTime: string,
  room: RoomType,
  meetingsData: MeetingsType["data"]
) => {
  const meetingStartTimeStamp = getTimeStamp(meetingDate, meetingStartTime);
  const meetingEndTimeStamp = getTimeStamp(meetingDate, meetingEndTime);

  const { meetings } = room;
  const meetingsDuringTheSameTime = meetings.filter((id) => {
    const meeting = meetingsData[id];
    const { date, startTime, endTime } = meeting;

    const startTimeStamp = getTimeStamp(date, startTime);
    const endTimeStamp = getTimeStamp(date, endTime);

    return (
      meetingStartTimeStamp < endTimeStamp &&
      meetingEndTimeStamp > startTimeStamp
    );
  });
  return meetingsDuringTheSameTime.length === 0 ? true : false;
};

const getTimeStamp = (date: string, time: string) =>
  moment(`${date} ${time}`, `${DATE_FORMAT} ${TIME_FORMAT}`).valueOf();

export const isEndTimeLessThanStartTime = (
  date: string,
  startTime: string,
  endTime: string
) => getTimeStamp(date, startTime) > getTimeStamp(date, endTime);
