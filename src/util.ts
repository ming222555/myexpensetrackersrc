export type BootstrapBreakpoints = 'sm' | 'md' | 'mg' | 'lg' | 'xl' | 'xxl' | 'xxxl';

/**
 * @param size e.g. 6
 * @returns e.g. [1,2,3,4,5,6]
 */
export function createArrayofSize(size: number): number[] {
  const arr: number[] = [];
  for (let i = 1; i < size + 1; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * @param Date object
 * @returns e.g. '2:07 pm'
 */
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

/**
 * @param Date object
 * @returns e.g. '2023-06-30'
 */
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

  // 'YYYY-MM-DD'
  return date.getFullYear() + '-' + strMth + '-' + strDay;
}

/**
 * @param Date object
 * @returns e.g. 20230630
 */
export function toIntYYYYMMDD(date: Date): number {
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

  // YYYYMMDD
  return parseInt(date.getFullYear() + strMth + strDay);
}

/**
 * @param strDate e.g. '20230630'
 * @param delimiter e.g. '-'
 * @returns e.g. '2023-06-30'
 */
export function delimitYYYYMMDD(strDate: string, delimiter: string): string {
  // args
  //   strDate e.g. '20230630'
  //   delimiter e.g. '-'
  const yyyy = strDate.substring(0, 4);
  const mm = strDate.substring(4, 6);
  const dd = strDate.substring(6);
  return yyyy + delimiter + mm + delimiter + dd;
}

/**
 * @param yyyymmdd e.g. 20230630
 * @param delimiter e.g. '-'
 * @returns e.g. '06-30-2023'
 */
export function delimitMMDDYYYY(yyyymmdd: number, delimiter: string): string {
  // args
  //   yyyymmdd e.g. 20230630
  //   delimiter e.g. '-'
  const strDate = yyyymmdd + '';
  const yyyy = strDate.substring(0, 4);
  const mm = strDate.substring(4, 6);
  const dd = strDate.substring(6);
  return mm + delimiter + dd + delimiter + yyyy;
}

/**
 * @param amt e.g. '123456.99'
 * @returns empty string if regex is valid else error text
 */
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

/**
 * @param amount e.g. '123.99'
 * @returns e.g. '123'
 */
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

/**
 * @param amount e.g. '123.99'
 * @returns e.g. '99'
 */
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

/**
 * @param amount e.g. 123.1
 * @returns e.g. '123.10'
 */
export function zeroPaddMoney(amount: number): string {
  const strAmount = amount + '';

  const pos = strAmount.indexOf('.');
  if (pos === -1) {
    return strAmount;
  }
  const cents = strAmount.split('.')[1];
  if (cents.length === 1) {
    return strAmount + '0';
  }
  return strAmount;
}
