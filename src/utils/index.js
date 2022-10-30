import moment from 'moment';

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
