import { differenceInCalendarDays } from 'date-fns';
import * as CryptoJS from 'crypto-js';

export class CommonFunctionService {

  constructor() { }

  // public commonFunction = new CommonFunctionService(); ......declare this in your ts file

  //// Email Pattern
  // [pattern]="commonFunction.emailpattern"
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //// Name Pattern
  // [pattern]="commonFunction.namepatt"
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
  //// Mobile Number Pattern
  // [pattern]="commonFunction.mobpattern"
  panpattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
  aadharpattern = /^\d{12}$/
  mobpattern = /^[6-9]\d{9}$/;
  urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  //// Pincode Pattern
  // pinpatt = /^-?(0|[1-9]\d*)?$/;
  // [pattern]="commonFunction.pinpatt"
  pinpatt = /([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})/;

  //// Only Number Pattern
  // [pattern]="commonFunction.onlynumber"
  onlynumber = /^[0-9]*$/;

  ////  Date Format 09/12/2023
  // [nzFormat]="commonFunction.dateFormat"
  dateFormat = 'dd/MM/yyyy';

  ////  Date Format 09/DEC/2023
  // [nzFormat]="commonFunction.dateFormatMMM"
  dateFormatMMM = 'dd/MM/yyyy';

  ////  Month Format DEC
  // [nzFormat]="commonFunction.onlyMonthFormatMMM"
  onlyMonthFormatMMM = 'MMM';
  ////  Month DEC/2023
  // [nzFormat]="commonFunction.FormatMMMYYYY"
  FormatMMMYYYY = 'MMM/yyyy';

  ////  Month Format 12
  // [nzFormat]="commonFunction.onlyMonthFormatMM"
  onlyMonthFormatMM = 'MM';

  ////  Date & Time Format 09/12/2023 06:22:10
  // [nzFormat]="commonFunction.dateMMTimeSecFormat"
  dateMMTimeSecFormat = 'dd/MM/yyyy HH:mm:ss';

  ////  Date & Time Format 09/DEC/2023 06:22:10
  // [nzFormat]="commonFunction.dateMMMTimeSecFormat"
  dateMMMTimeSecFormat = 'dd/MMM/yyyy HH:mm:ss';

  ////  Date & Time Format 09/12/2023 06:22
  // [nzFormat]="commonFunction.dateMMTimeFormat"
  dateMMTimeFormat = 'dd/MM/yyyy HH:mm';

  ////  Date & Time Format 09/DEC/2023 06:22
  // [nzFormat]="commonFunction.dateMMMTimeFormat"
  dateMMMTimeFormat = 'dd/MMM/yyyy HH:mm';

  ////  Time Format 06:22:10
  timeFormatSec = 'HH:mm:ss';

  ////  Time Format 06:22
  timeFormat = 'HH:mm';

  //// Account Number Pattern
  // [pattern]="commonFunction.Accountpatt"
  Accountpatt = /^\d{9,18}$/;

  //// IFSC Code Pattern
  // [pattern]="commonFunction.IFSCpatt"
  IFSCpatt = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  //// Pincode Pattern
  // [pattern]="commonFunction.PincodePatt"
  PincodePatt = /^[1-9][0-9]{5}$/;

  //// GST Pattern
  // [pattern]="commonFunction.GSTpattern"
  GSTpattern: RegExp =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  //// Pan Card Number Pattern
  // [pattern]="commonFunction.PanPattern"
  PanPattern: RegExp = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;


  // Pattern For Vehical Number
  // [pattern]="commonFunction.vehicleNumberPattern"
  vehicleNumberPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ///Allow only characters
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }


  //   onlyas(event: any) {
  //     event = event ? event : window.event;
  //     var charCode = event.which ? event.which : event.keyCode;
  //     if (
  //       (charCode >= 65 && charCode <= 90) || // A-Z
  //       (charCode >= 97 && charCode <= 122) || // a-z
  //       (charCode >= 32 && charCode <= 47) || // Special characters between space and '/'
  //       (charCode >= 58 && charCode <= 64) || // Special characters between ':' and '@'
  //       (charCode >= 91 && charCode <= 96) || // Special characters between '[' and '`'
  //       (charCode >= 123 && charCode <= 126) // Special characters between '{' and '~'
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  // }

  onlyalpha(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 65 && charCode <= 90) || // A-Z
      (charCode >= 97 && charCode <= 122) || // a-z
      (charCode >= 32 && charCode <= 47) || // Special characters between space and '/'
      (charCode >= 58 && charCode <= 64) || // Special characters between ':' and '@'
      (charCode >= 91 && charCode <= 96) || // Special characters between '[' and '`'
      (charCode >= 123 && charCode <= 126) // Special characters between '{' and '~'
    ) {
      return true;
    } else {
      return false;
    }
  }


  onlyas(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 45) {
      return true;
    }
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }
    return false; // Disallowing other characters
  }


  ///// Allow only number and character
  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }

  ///// Allow only number and character
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  /////Only Number & One Dot

  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }

  onlynum(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    return false; // Disallowing other characters
  }
  onlynumdott(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if ((charCode >= 48 && charCode <= 57) || charCode === 45) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }

  //allow number with -
  omitwithminus(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode !== 45 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Number with decimal format
  numberWithDecimal(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      charCode === 46 && // Decimal point character code
      event.target.value.includes('.')
    ) {
      return false;
    } else if (
      charCode !== 46 && // Decimal point character code
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }

    return true;
  }

  //  Number with decimal & Minus (-) format
  numberWithDecimalWithMinus(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;

    if (
      (charCode === 46 && inputValue.includes('.')) ||
      (charCode === 45 && inputValue.includes('-'))
    ) {
      return false;
    }

    if (
      charCode !== 46 && // Decimal point character code
      charCode !== 45 && // Minus sign character code
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
  }

  secretKey = 'PockIT@321';
  decryptdata(encrypteddata: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypteddata, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
 
  encryptdata(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey);
  }

  //////////Disable After Dates
  disabledAfterDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  //////////Disable Before Dates
  disabledBeforeDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  disabledBeforeDatebefore = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;



  
}