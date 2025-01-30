import { addYears, getYear } from "date-fns";

export interface Holiday {
  date: string;
  title: string;
}

export const generateHolidaysForYear = (year: number): Holiday[] => {
  return [
    { date: `${year}-01-01`, title: "New Year's Day" },
    { date: `${year}-01-15`, title: "Martin Luther King Jr. Day" },
    { date: `${year}-02-14`, title: "Valentine's Day" },
    { date: `${year}-02-19`, title: "Presidents' Day" },
    { date: `${year}-03-17`, title: "St. Patrick's Day" },
    { date: `${year}-04-01`, title: "April Fool's Day" },
    { date: `${year}-05-27`, title: "Memorial Day" },
    { date: `${year}-06-19`, title: "Juneteenth" },
    { date: `${year}-07-04`, title: "Independence Day" },
    { date: `${year}-09-02`, title: "Labor Day" },
    { date: `${year}-10-31`, title: "Halloween" },
    { date: `${year}-11-11`, title: "Veterans Day" },
    { date: `${year}-11-28`, title: "Thanksgiving" },
    { date: `${year}-12-25`, title: "Christmas" },
    { date: `${year}-12-31`, title: "New Year's Eve" },
  ];
};

export const generateDefaultEvents = (year: number) => [
  {
    id: "default-1",
    title: "Team Meeting",
    time: `${year}-02-20T10:00:00`,
    type: "meeting" as const,
  },
  {
    id: "default-2",
    title: "Project Review",
    time: `${year}-02-22T14:00:00`,
    type: "meeting" as const,
  },
  {
    id: "default-3",
    title: "Weekly Sync",
    time: `${year}-02-26T11:00:00`,
    type: "meeting" as const,
  },
  {
    id: "default-4",
    title: "Monthly Planning",
    time: `${year}-03-01T09:00:00`,
    type: "meeting" as const,
  },
  {
    id: "default-5",
    title: "Quarterly Review",
    time: `${year}-03-15T13:00:00`,
    type: "meeting" as const,
  },
];

export const getEventsForNextYears = (startYear: number, numberOfYears: number = 3) => {
  let allHolidays: Holiday[] = [];
  let allEvents: any[] = [];

  for (let i = 0; i < numberOfYears; i++) {
    const year = startYear + i;
    allHolidays = [...allHolidays, ...generateHolidaysForYear(year)];
    allEvents = [...allEvents, ...generateDefaultEvents(year)];
  }

  return {
    holidays: allHolidays,
    events: allEvents,
  };
};