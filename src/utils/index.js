import moment from 'moment';

const week = () =>
  Array.from([1, 2, 3, 4, 5, 6, 7], i =>
    new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + i),
    ).toDateString(),
  );

export const iconChannels = {
  FACEBOOK: 'facebook.svg',
  ZALO: 'zalo.svg',
  LIVECHAT: 'livechat.svg',
};

const renderFormatTypes = dateFromNow => {
  const [typeDate] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ].filter(elm => dateFromNow.includes(elm));

  if (['second', 'minute', 'hour'].includes(typeDate)) {
    return 'HH:mm';
  }

  if (['day', 'week', 'month', 'year'].includes(typeDate)) {
    return 'DD/MM/YYYY';
  }

  return 'DD/MM/YYYY';
};

export const convertTimeToDate = time => {
  if (moment(time).isValid()) {
    const dateFromNow = moment(time).fromNow();
    const formatType = renderFormatTypes(dateFromNow);
    return moment(time).format(formatType);
  }
  return '';
};

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const diffTimeInMinutes = (ts1, ts2) => {
  const diffMs = new Date(ts2) - new Date(ts1);
  const diffMins = Math.round(diffMs / 1000 / 60);
  return diffMins;
};

export const formatDate = date => {
  const dateNow = new Date();
  if (date.toDateString() !== dateNow.toDateString()) {
    return converDate(date);
  }
  const hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes}`;
  return strTime;
};

export const converDate = time => {
  var inWeek = week().findIndex(value => value === time.toDateString());
  var hours = time.getHours();
  var minutes = time.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  hours = hours < 10 ? '0' + hours : hours;
  var strTime = hours + ':' + minutes;
  if (inWeek > -1) {
    switch (inWeek) {
      case 0:
        return 'T2 ' + strTime;
      case 1:
        return 'T3 ' + strTime;
      case 2:
        return 'T4 ' + strTime;
      case 3:
        return 'T5 ' + strTime;
      case 4:
        return 'T6 ' + strTime;
      case 5:
        return 'T7 ' + strTime;
      case 6:
        return 'CN ' + strTime;
    }
  }
  if (typeof time == 'object') {
    return (
      `${time.getDate() / 10 >= 1 ? time.getDate() : '0' + time.getDate()}/${
        (time.getMonth() + 1) / 10 >= 1
          ? time.getMonth() + 1
          : `0${time.getMonth() + 1}`
      }/${time.getFullYear()}` +
      ' ' +
      strTime
    );
  }
  return '';
};
