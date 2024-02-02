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

export function isNonValidRegexMonetaryAmout(amt: string): string {
  // return empty string '' if valid
  // else error text if non valid
  //
  // https://www.codeproject.com/Questions/656212/Regex-expression-for-0-10-numbers-with-two-decimal
  // https://itecnote.com/tecnote/javascript-regex-for-6-digits-before-and-2-digits-after-decimal/
  const regexpression = /^\d{1,6}(\.\d{1,2})?$/;
  const isValid = regexpression.test(amt);

  if (isValid) {
    return '';
  }

  const toFloat = parseFloat(amt);

  if (isNaN(toFloat)) {
    return 'Value must be valid number ######.##';
  }

  const posDec = amt.indexOf('.');

  if (posDec > -1 && amt.substring(posDec).length > 3) {
    return 'At most 2 decimal digits are allowed';
  }

  return 'Value must be valid number ######.##';
}

export function extractDollarFromAmount(amount: string): string {
  if (!amount) {
    return '';
  }
  const pos = amount.indexOf('.');
  if (pos > -1) {
    const [dollars] = amount.split('.');
    return dollars;
  }
  return amount;
}

export function extractCentFromAmount(amount: string): string {
  if (!amount) {
    return '';
  }
  const pos = amount.indexOf('.');
  if (pos === -1) {
    return '';
  }
  const cents = amount.split('.')[1];
  if (cents.length === 1) {
    return cents + '0';
  }
  return cents;
}
