export type ResponseType = {
  Buildings: Array<{
    id: number;
    name: string;
    meetingRooms: Array<{
      id: number;
      name: string;
      floor: number;
      meetings: Array<MeetingType>;
    }>;
  }>;
};

export type BuildingType = {
  id: number;
  name: string;
  meetingRooms: Array<number>;
};
export type RoomType = {
  id: number;
  name: string;
  floor: number;
  meetings: Array<number>;
};
export type MeetingType = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
};

export type BuildingsType = {
  contents: Array<number>;
  data: { [key: number]: BuildingType };
};
export type RoomsType = {
  contents: Array<number>;
  data: { [key: number]: RoomType };
};
export type MeetingsType = {
  contents: Array<number>;
  data: { [key: number]: MeetingType };
};
