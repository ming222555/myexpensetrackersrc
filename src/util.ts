export type BootstrapBreakpoints = 'sm' | 'sd' | 'md' | 'mg' | 'lg' | 'xl' | 'xxl' | 'xxxl';

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
 * @param yyyymmdd e.g. '20230630'
 * @returns Date object
 */
export function dateFromYYYYMMDD(yyyymmdd: string): Date {
  // args
  //   yyyymmdd e.g. '20230630'
  const strDate = yyyymmdd;
  const yyyy = strDate.substring(0, 4);
  const mm = strDate.substring(4, 6);
  const dd = strDate.substring(6);
  return new Date(yyyy + '-' + mm + '-' + dd);
}

/**
 * @param dateRange e.g. '20191001,20191231', '20191001,' or ',20191231'
 * @returns human friendly string e.g. 'Oct 1 - Dec 31', 'Oct 1 or later' or 'Dec 31 or earlier'
 */
export function humaniseDateRange(dateRange: string): string {
  const dates = dateRange.split(',');
  if (dates.length === 1 && dates[0] === '') {
    return '';
  } else {
    const dte = dates[0];
    const dte2 = dates[1];

    if (dte || dte2) {
      const getMonthAbbrev = (mm: string): string => {
        const abbrevs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return abbrevs[parseInt(mm) - 1];
      };

      let mmAbbrev = '';
      let mmAbbrev2 = '';

      if (dte && dte2) {
        // returns e.g. 'Oct 1 - Dec 31'

        mmAbbrev = getMonthAbbrev(dte.substring(4, 6));
        mmAbbrev2 = getMonthAbbrev(dte2.substring(4, 6));
        if (parseInt(dte) <= parseInt(dte2)) {
          return mmAbbrev + ' ' + parseInt(dte.substring(6)) + ' - ' + mmAbbrev2 + ' ' + parseInt(dte2.substring(6));
        }
        return mmAbbrev2 + ' ' + parseInt(dte2.substring(6)) + ' - ' + mmAbbrev + ' ' + parseInt(dte.substring(6));
      } else if (dte) {
        // returns e.g. 'Oct 1 or later'

        mmAbbrev = getMonthAbbrev(dte.substring(4, 6));
        return mmAbbrev + ' ' + parseInt(dte.substring(6)) + ' or later';
      } else if (dte2) {
        // returns e.g. 'Dec 31 or earlier'

        mmAbbrev2 = getMonthAbbrev(dte2.substring(4, 6));
        return mmAbbrev2 + ' ' + parseInt(dte2.substring(6)) + ' or earlier';
      } else {
        // here, dte and dte2 both empty strings
        // by above logic, we shdn't be here, but typescript not aware so it complains
        return '';
      }
    }
    return '';
  }
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
