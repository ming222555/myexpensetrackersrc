export function createArrayofSize(size: number): number[] {
  const arr: number[] = [];
  for (let i = 1; i < size + 1; i++) {
    arr.push(i);
  }
  return arr;
}

export function formatAMPM(date: Date): string {
  // https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const szMinutes = minutes < 10 ? '0' + minutes : minutes + '';
  const strTime = hours + ':' + szMinutes + ' ' + ampm;
  return strTime;
}

export function formatYYYYMMDD(date: Date): string {
  const mth = date.getMonth() + 1;
  let strMth = mth + '';
  if (mth < 10) {
    strMth = '0' + mth;
  }

  const day = date.getDate();
  let strDay = day + '';
  if (day < 10) {
    strDay = '0' + day;
  }

  // YYYY-MM-DD
  return date.getFullYear() + '-' + strMth + '-' + strDay;
}
