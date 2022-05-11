import { TimeSpan } from '../../models';

export const getDate = (date: string | Date): string => {
  if (date == null) return '';
  const separator = '/';

  let day: string = '00';
  let month: string = '00';
  let year: string = '00';

  if (date instanceof Date) {
    const tmpDate = date as unknown as Date;
    day = getTwoDigits(tmpDate.getDate());
    month = getTwoDigits(tmpDate.getMonth() + 1);
    year = getTwoDigits(tmpDate.getFullYear());
  } else {
    const tmpDate = new Date(date);
    day = getTwoDigits(tmpDate.getDate());
    month = getTwoDigits(tmpDate.getMonth() + 1);
    year = getTwoDigits(tmpDate.getFullYear());
  }
  return `${day}${separator}${month}${separator}${year}`;
};

export const getTimeSpan = (date: string | Date): string => {
  if (date == null) return '';

  const separator = ':';
  let hour: string = '00';
  let minute: string = '00';

  if (date instanceof Date) {
    const tmpDate: Date = date as unknown as Date;
    hour = getTwoDigits(tmpDate.getHours());
    minute = getTwoDigits(tmpDate.getMinutes());
  } else {
    const splited: string[] = date.split(':');
    hour = getTwoDigits(Number(splited[0]));
    minute = getTwoDigits(Number(splited[1]));
  }
  return `${hour}${separator}${minute}`;
};

export const getDateWithoutTime = (date: Date): string => {
  if (date == null) return '';
  const separator = {
    DATE: '/',
    HOUR: ':',
  };

  const day = getTwoDigits(date.getDate());
  const month = getTwoDigits(date.getMonth() + 1);
  const year = getTwoDigits(date.getFullYear());

  return `${day}${separator.DATE}${month}${separator.DATE}${year}`;
};

export const getTwoDigits = (value: number): string => {
  if (value < 10) return `0${value}`;
  return `${value}`;
};

export const dateEarlierThanNow = (dateToCompare: Date, hours: string): boolean => {
  let todayWithoutTime: Date = new Date(),
    today: Date = new Date();
  todayWithoutTime.setHours(0, 0, 0);

  if (!dateEarlierThanToday(dateToCompare)) return false;
  else if (dateToCompare.getDate() === todayWithoutTime.getDate()) {
    const splited: string[] = hours.split(':');
    if (today.getHours() < Number(splited[0])) return false;
    else if (today.getHours() === Number(splited[0]) && today.getMinutes() < Number(splited[1])) return false;
  }
  return true;
};

export const dateEarlierThanToday = (dateToCompare: Date): boolean => {
  let today: Date = new Date();
  if (
    dateToCompare.getFullYear() > today.getFullYear() ||
    (dateToCompare.getFullYear() === today.getFullYear() && dateToCompare.getMonth() > today.getMonth()) ||
    (dateToCompare.getFullYear() === today.getFullYear() &&
      dateToCompare.getMonth() === today.getMonth() &&
      dateToCompare.getDate() > today.getDate())
  )
    return false;
  return true;
};

export const getTimeString = (time: TimeSpan): string => {
  return `${time.Hours >= 10 ? time.Hours : '0' + time.Hours}:${
    time.Minutes >= 10 ? time.Minutes : '0' + time.Minutes
  }`;
};
