import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';
import { DatePipe } from '@angular/common';
import { differenceInCalendarDays, setHours } from 'date-fns';
// import { patientmaster } from '../../../Models/patient';
import { LabPatientMasterFormComponent } from '../../../components/LabPatientMaster/lab-patient-master-form/lab-patient-master-form.component';
import { LabPatient } from '../../../Models/LabPatient';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { LabAppointmentMaster } from '../../../Models/LabAppointmentMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import { createWorker } from 'tesseract.js';
import * as dicomParser from 'dicom-parser';
interface ConfData {
  ID: number;
  CLIENT_ID: number;
  TECHNICIAN_ID: number;
  START_TIME: string;
  END_TIME: string;
  SLOT_DURATION: number;
  MODE: string;
  PINCODE_ID: number;
  DAY_OF_WEEK: string;
  IS_ACTIVE: number;
  SESSION_NAME: string;
}

interface BookedSlot {
  DATE: string;
  START: string;
  END: string;
  IS_BLOCKED: number;
  BLOCKED_REASON: string | null;
  IS_BOOKED: number;
  SESSION_ID: any;
  DAY_OF_WEEK: string;
}

interface Slot {
  ID: number | null;
  SESSION_ID: number;
  SESSION_NAME: string;
  START: string;
  END: string;
  IS_BLOCKED: number;
  DAY_OF_WEEK: string;
  BLOCKED_REASON: string | null;
  IS_BOOKED: number;
  CREATED_MODIFIED_DATE: string;
  READ_ONLY: string;
  ARCHIVE_FLAG: string;
  CLIENT_ID: number;
  TECHNICIAN_ID: number;
  MODE: string;
  PINCODE_ID: number;
}

@Component({
  selector: 'app-add-lab-appointment2',
  templateUrl: './add-lab-appointment2.component.html',
  styleUrls: ['./add-lab-appointment2.component.css'],
})
export class AddLabAppointmentComponent2 {
  @Input() drawerClose!: Function;
  @Input() data: LabAppointmentMaster = new LabAppointmentMaster();
  @Input() dataList: any[] = [];
  @Input() data2: LabAppointmentMaster[] = [];
  @Input() drawerVisible: boolean = false;
  @Input() LAB_NAME: any;

  showdata = true
  isSpinning = false;
  isOk = true;

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  selectedOption: string;

  //

  patientData: [];
  testData: [];
  packageData: [];
  fileList2: File | null;
  progressBarProfilePhoto: boolean;
  timerThree: any;
  isSummaryLoading: boolean;
  taskurl: string;
  private http: HttpClient;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(httpBackend);
  }
  radiovalue: any = 'T';

  ngOnInit(): void {
    this.gettest();
    this.package();
    // this.getslot();
    this.generateDates();
    this.getTechniciann();
    // console.log(this.data);
    const label = new Date().toLocaleDateString('en-US', {
      weekday: 'short', // e.g., Mon, Tue
      month: 'short', // e.g., Jan, Feb
      day: 'numeric', // e.g., 1, 2
    });
    let obj = {
      LABEL: label,
      SLOT: 0,
    };
    if (this.data.id) {
      this.techID = this.data.technician_id;
      this.radiovalue = this.data.package_id ? 'P' : 'T';
    }
    this.selectDate(obj, false);
    // Log the generated slots or process them as needed
    // console.log(this.data);

    // this.onSearchNumberChange();
  }

  // get()
  // {
  //       this.api.getpatient(filter + " " + dateFilter).subscribe((response: HttpResponse<any>) => {
  //     const statusCode = response.status;
  //     if (statusCode === 200) {
  //     }
  //   }
  // }
  // For Accepting Only Alphabits/ Character
  ontypeChange(d: any) {
    if (d == 'T') {
      this.data.package_id = null;
    } else {
      this.data.test_id = null;
    }
  }
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

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // isSummaryLoading=false
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.fileList2 = file;

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isDcmFile = fileExt === 'dcm' || fileExt === 'dic';

    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf' ||
      isDcmFile;

    const isLt5MB = file.size < 5242880;

    if (!isValidType) {
      this.message.error(
        'Only JPEG/JPG/PNG/PDF/DICOM (.dcm) files are allowed.',
        ''
      );
      this.fileList2 = null;
      return;
    }

    if (!isLt5MB) {
      this.message.error('File size exceeds 5MB.', '');
      this.fileList2 = null;
      this.data.report = null;
      return;
    }

    const number = Math.floor(100000 + Math.random() * 900000);
    const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    let url = d ? d + number + '.' + fileExt : '';

    if (this.data.report?.trim()) {
      const arr = this.data.report.split('/');
      if (arr.length > 1) url = arr[5];
    }

    this.isSpinning = true;
    this.progressBarProfilePhoto = true;
    // this.data['FILE_TYPE'] = fileExt;

    this.timerThree = this.api
      .onUpload('labReport', this.fileList2, url)
      .subscribe(
        async (res: HttpEvent<any>) => {
          if (res instanceof HttpResponse) {
            if (res.status === 200 && res.body?.message === 'Success') {
              this.message.success(`Record uploaded successfully.`, '');
              this.isSummaryLoading = true;
              this.data.report = url;
              this.taskurl = this.imgUrl + 'labReport/' + this.data.report;

              // 🧠 AI Summary Logic Starts Here
              let extractedText = '';

              if (file.type === 'application/pdf') {
                extractedText = await this.extractPdfText(file);
                this.data.file_type = 'PDF';
              } else if (file.type.startsWith('image/')) {
                extractedText = await this.extractImageText(file);
                this.data.file_type = 'Image';
              } else if (isDcmFile) {
                extractedText = await this.extractDicomMetadata(file);
                this.data.file_type = 'Dicom';
              }

              const prompt = `
You are a medical data analysis AI.

Given the following medical document, provide:

1. A short summary of the patient's condition, tests, and medications.
2. A structured JSON object with the following format:

{
  "patient": {
    "name": "",
    "id": "",
    "age": "",
    "gender": "",
    "date": ""
  },
  "summary": "<One paragraph summary>",
  "tests": [ { "name": "", "value": "", "unit": "" } ],
  "vitals": [ { "name": "", "value": "", "unit": "" } ],
  "medications": [ { "name": "", "dosage": "", "frequency": "" } ]
}

Extract only available data from the document below. If a field is missing, use an empty string.

--- DOCUMENT TEXT START ---
${extractedText.slice(0, 10000)}
--- DOCUMENT TEXT END ---
`;

              this.getGeminiSummary(prompt); // call to Gemini AI for processing
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload record', '');
              this.data.report = null;
              this.taskurl = '';
            }
          }
        },
        (error) => {
          this.message.error('Error uploading document.', '');
          this.isSpinning = false;
        }
      );
  }
  async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      fullText += text + '\n';
    }

    return fullText;
  }

  async extractImageText(file: File): Promise<string> {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();

    return text;
  }
  private apiKey = 'AIzaSyA55QW6qMAu-ypwgYpgWAmPJ4qXoZVBjXY';
  summary: string = '';
  getGeminiSummary(prompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    this.http.post<any>(url, body).subscribe({
      next: (response) => {
        try {
          const text =
            response.candidates?.[0]?.content?.parts?.[0]?.text || '';

          // Try to extract JSON portion from text response
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          const jsonText = text.slice(jsonStart, jsonEnd + 1);
          const json = JSON.parse(jsonText);

          this.summary = text || 'No summary available.';
          this.data['SUMMARY_DATA'] = json.summary;
          this.data.composition_data = jsonText; // Save full JSON structure
        } catch (err) {
          this.summary = 'Could not parse structured data. Raw response:';
          this.data.composition_data =
            response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }

        this.isSpinning = false;
        this.isSummaryLoading = false;
      },
      error: (err) => {
        this.isSpinning = false;
        this.isSummaryLoading = false;
        this.summary = 'Error: ' + err.message;
      },
    });
  }
  close(): void {
    this.drawerClose();
  }
  async extractDicomMetadata(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const byteArray = new Uint8Array(e.target.result);
          const dataSet = dicomParser.parseDicom(byteArray);

          const patientName = dataSet.string('x00100010');
          const patientID = dataSet.string('x00100020');
          const studyDate = dataSet.string('x00080020');
          const modality = dataSet.string('x00080060');

          const textSummary = `
          Patient Name: ${patientName || 'N/A'}
          Patient ID: ${patientID || 'N/A'}
          Study Date: ${studyDate || 'N/A'}
          Modality: ${modality || 'N/A'}
        `;

          resolve(textSummary.trim());
        } catch (error) {
          console.error('DICOM parse error:', error);
          resolve('Unable to extract metadata from DICOM file.');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  isVisible = false;

  // Modal control functions
  slotdata: any[] = [];
  morningSlots: any[] = [];
  afternoonSlots: any[] = [];
  eveningSlots: any[] = [];
  selectedSlots: any[] = [];
  dates: { LABEL: string; SLOTS: number }[] = [];
  visibleCount = 4; // Number of cards to show initially
  selectedDate: any;

  generateDates(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const label = date.toLocaleDateString('en-US', {
        weekday: 'short', // e.g., Mon, Tue
        month: 'short', // e.g., Jan, Feb
        day: 'numeric', // e.g., 1, 2
      });
      this.dates.push({
        LABEL: label,
        SLOTS: 0, // Random slots between 1 and 10
      });
    }
  }
  getProperShowDate(date: string): any {
    let formattedtime;
    let current = new Date();
    if (date) {
      let [hours, minutes, seconds] = date.split(':').map(Number);
      current.setHours(hours, minutes, seconds ?? 0);
      // console.log(current.getHours())
      formattedtime = current;
    }
    return formattedtime;
  }
  parseLabelToDate(label: string, year?: number): Date {
    const currentYear = year || new Date().getFullYear();
    const fullDateStr = `${label}, ${currentYear}`;
    const parsedDate = new Date(fullDateStr);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }

    return parsedDate;
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  hover = false;

  dateSelected: any;
  isSlotModalVisible = false;
  normalizedSlots: any[] = [];

  openSlotModal(): void {
    this.isSlotModalVisible = true;
    this.normalizedSlots = [];

    // console.log(this.selectedSlots, this.slotMatched);

    if (Array.isArray(this.selectedSlots) && this.selectedSlots.length > 0) {
      this.normalizedSlots = this.selectedSlots.map(slot => ({
        session: slot.SESSION_NAME,
        start: slot.START,
        end: slot.END,
        mode: slot.MODE === 'IL' ? 'In Lab' : 'In Home',
        day: slot.DAY_OF_WEEK
      }));
    } else if (this.slotMatched && Object.keys(this.slotMatched).length > 0) {
      // Convert date string to a weekday name
      const dateStr = this.slotMatched.DATE;
      const dateObj = new Date(dateStr);
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      this.normalizedSlots = [{
        session: this.slotMatched.SESSION_NAME,
        start: this.slotMatched.START, // use START for consistency
        end: this.slotMatched.END,
        mode: this.slotMatched.NAME || (this.slotMatched.MODE === 'IL' ? 'In Lab' : 'In Home'),
        day: weekday // computed day name
      }];
    }

    // console.log('Normalized Slots:', this.normalizedSlots);
  }





  slotMatched: any = [];
  selectDate(date: any, isDatechanged: boolean): void {
    // console.log(isDatechanged);
    // this.data['DATE']=new Date
    const select = this.parseLabelToDate(date.LABEL);
    this.dateSelected = this.formatDate(select);
    // console.log(this.data['DATE']);
    this.generatingModelspinning = true;
    this.selectedDate = date;
    // console.log(date)
    if (this.techID && this.decreptedroleId !== 1) {
      const filter = `technicianId=${this.techID}&labId=${this.labID}`;

      this.api.AvailabilityConfiguration(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.slotdata = response.body.data;
            // let generatedslots: any = [];
            this.generatingModelspinning = false;

            const allSlots = response.body.data || [];

            // console.log(response.body.data);

            // ❌ Filter out the slot that matches SLOT_ID
            // this.slotMatched = allSlots.find(
            //   (slot: any) => slot.ID === this.data.SLOT_ID
            // );
            // console.log('Matched Slot:', this.slotMatched);
            this.getslot();
          } else {
            this.slotdata = [];
            this.generatingModelspinning = false;
            this.message.error('Something went wrong.', '');
          }
        },
        () => {
          this.generatingModelspinning = false;
          this.message.error('Failed to fetch data.', '');
        }
      );
    } else {
      if (this.data.technician_id) {
        const filter = `technicianId=${this.data.technician_id}&labId=${this.LabBindingId}`;

        this.api.AvailabilityConfiguration(filter).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.slotdata = response.body.data;
              // let generatedslots: any = [];
              // console.log(response.body.data);

              const allSlots = response.body.data || [];
              // ❌ Filter out the slot that matches SLOT_ID
              this.slotMatched = allSlots.find(
                (slot: any) => slot.ID === this.data.slot_id
              );
              // console.log('Matched Slot:', this.slotMatched);

              this.getslot();
              this.generatingModelspinning = false;
            } else {
              this.slotdata = [];
              this.generatingModelspinning = false;

              this.message.error('Something went wrong.', '');
            }
          },
          () => {
            this.generatingModelspinning = false;
            this.message.error('Failed to fetch data.', '');
          }
        );
      }
    }
    // console.log(this.selectedDate, ' this.selectedDate');
    // console.log(this.selectedDate.LABEL, ' this.selectedDate');
  }

  loadMore(): void {
    this.visibleCount += 4;
  }

  // getpatient
  slotData: any = [];

  getslot(): void {
    // const filter = `AND LAB_ID = 1 AND TECHNICIAN_ID = ` + this.techID `AND DATE = `+ ;
    // const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    this.generatingModelspinning = false;
    let dateFilter = '';
    const dateConditions: string[] = [];

    this.dates.forEach((data) => {
      const date = this.parseLabelToDate(data.LABEL);
      const da = this.formatDate(date); // assume this returns 'YYYY-MM-DD'
      dateConditions.push(`date='${da}'`);
    });

    if (dateConditions.length > 0) {
      dateFilter = 'AND (' + dateConditions.join(' OR ') + ')';
    }
    // console.log(this.dates)
    // if (this.labID && this.techID) {
    let filter = '';
    if (this.decreptedroleId !== 1) {
      filter = `AND lab_id = ${this.labID}  AND technician_id = ` + this.techID;
    } else {
      filter =
        `AND lab_id = ${this.LabBindingId}  AND technician_id = ` +
        this.data.technician_id;
    }
    //  const select = this.parseLabelToDate(date.LABEL);
    // this.dateSelected = this.formatDate(select);
    this.api
      .getpatient(filter + ' ' + dateFilter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.generatingModelspinning = false;

          this.slotData = response.body.data;
          let generatedslots: any = [];

          this.slotMatched = response.body.data.find(
            (slot: any) => slot.ID === this.data.slot_id
          );
          // console.log('Matched Slot:', this.slotMatched);
          // console.log(this.slotdata, 'this.slotdatathis.slotdata 1');
          generatedslots = this.generateSlotsForDate(
            this.slotdata,
            this.slotData
          );
          // console.log(generatedslots);

          this.filterSlots(generatedslots, false);
          // console.log(this.slotData, ' this.slotData this.slotData 2');
        } else {
          this.slotData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
    // }
  }

  techID: any;
  techid(data: any) {
    this.techID = data;

    // console.log(this.techID, ' this.techID');
  }

  showModal(): void {
    this.isVisible = true;
    // const filter = 1;
    let filter = '';
    if (this.decreptedroleId !== 1) {
      filter = `technicianId=${this.techID}&labId=${this.labID}`;
    } else {
      filter = `technicianId=${this.data.technician_id}&labId=${this.LabBindingId}`;
    }
    this.api.AvailabilityConfiguration(filter).subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.slotdata = response.body.data;
          // if()
          this.getslot();
        } else {
          this.slotdata = [];
          this.message.error('Something went wrong.', '');
        }
      },
      () => this.message.error('Failed to fetch data.', '')
    );
  }

  //

  // 1 ) this.slotdata
  // 2 )  this.slotData
  // 3 ) this.selectedDate.LABEL
  generatingModelspinning = false;
  generateSlotsForDate(
    confDataArray: ConfData[],
    bookedSlots: BookedSlot[]
    // date: string
  ): Slot[] {
    const slots: Slot[] = [];

    const getCaseInsensitiveKey = (obj: any, key: string): any => {
      if (!obj) return undefined;
      const lowerKey = key.toLowerCase();
      for (const k of Object.keys(obj)) {
        if (k.toLowerCase() === lowerKey) {
          return obj[k];
        }
      }
      return undefined;
    };

    const filteredConfData = (confDataArray || []).filter((conf) => {
      const isActive = getCaseInsensitiveKey(conf, 'is_active');
      return isActive === 1 || isActive === true;
    });

    filteredConfData.forEach((confData) => {
      const CONF_ID = getCaseInsensitiveKey(confData, 'id');
      const CLIENT_ID = getCaseInsensitiveKey(confData, 'client_id');
      const TECHNICIAN_ID = getCaseInsensitiveKey(confData, 'technician_id');
      const START_TIME = getCaseInsensitiveKey(confData, 'start_time');
      const END_TIME = getCaseInsensitiveKey(confData, 'end_time');
      const SLOT_DURATION = getCaseInsensitiveKey(confData, 'slot_duration');
      const MODE = getCaseInsensitiveKey(confData, 'mode');
      const SESSION_NAME = getCaseInsensitiveKey(confData, 'session_name');
      const DAY_OF_WEEK = getCaseInsensitiveKey(confData, 'day_of_week');
      const PINCODE_ID = getCaseInsensitiveKey(confData, 'pincode_id');

      if (!START_TIME || !END_TIME) return;

      // Parse start and end time strings to hours and minutes
      const [startHour, startMinute] = START_TIME.split(':').map(Number);
      const [endHour, endMinute] = END_TIME.split(':').map(Number);

      let current = new Date();
      current.setHours(startHour, startMinute, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMinute, 0, 0);

      while (current < end) {
        const slotStart = new Date(current);
        current.setMinutes(current.getMinutes() + SLOT_DURATION);
        const slotEnd = new Date(current);

        const slotStartTimeStr =
          slotStart.toTimeString().split(' ')[0].substring(0, 5) + ':00';
        const slotEndTimeStr =
          slotEnd.toTimeString().split(' ')[0].substring(0, 5) + ':00';

        const bookedSlot = (bookedSlots || []).find((slot) => {
          const bookedStart = slot.START.substring(0, 5); // "HH:mm"
          const bookedEnd = slot.END.substring(0, 5); // "HH:mm"
          const slotStart = slotStartTimeStr.substring(0, 5);
          const slotEnd = slotEndTimeStr.substring(0, 5);

          return (
            bookedStart === slotStart &&
            bookedEnd === slotEnd &&
            slot.SESSION_ID == CONF_ID
          );
        });

        slots.push({
          ID: null,
          SESSION_ID: CONF_ID,
          SESSION_NAME: SESSION_NAME,
          START: slotStartTimeStr,
          END: slotEndTimeStr,
          DAY_OF_WEEK: DAY_OF_WEEK,
          IS_BLOCKED: bookedSlot ? bookedSlot.IS_BLOCKED : 0,
          BLOCKED_REASON: bookedSlot ? bookedSlot.BLOCKED_REASON : null,
          IS_BOOKED: bookedSlot ? bookedSlot.IS_BOOKED : 0,
          CREATED_MODIFIED_DATE: new Date()
            .toISOString()
            .replace('T', ' ')
            .split('.')[0],
          READ_ONLY: 'N',
          ARCHIVE_FLAG: 'F',
          CLIENT_ID: CLIENT_ID,
          TECHNICIAN_ID: TECHNICIAN_ID,
          MODE: MODE,
          PINCODE_ID: PINCODE_ID,
        });
      }
    });
    return slots;
  }

  //
  @Input() LabBindingId;
  Technician: any = [];
  getTechniciann(): void {
    // const filter = `AND IS_BOOKED = 0 AND IS_BLOCKED = 0`;
    // console.log(this.labID)
    const filter = this.decreptedroleId !== 1 ? this.labID : this.LabBindingId;
    this.api.getTechniciann(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      if (statusCode === 200) {
        this.Technician = response.body.data;
      } else {
        this.Technician = [];
        this.message.error(`Something went wrong.`, '');
      }
    });
  }

  filterSlots(generatedslots: any[], isDatechanged: boolean): void {
    // const weekDays = [
    //   'Sunday',
    //   'Monday',
    //   'Tuesday',
    //   'Wednesday',
    //   'Thursday',
    //   'Friday',
    //   'Saturday',
    // ];

    // Get the selected day string (e.g., "Monday")
    const selectedLabel = this.selectedDate?.LABEL;
    if (!selectedLabel) return;
    const selectedDate = this.parseLabelToDate(selectedLabel);
    const selectedDay = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    // Set selected session slots
    this.morningSlots = generatedslots.filter(
      (slot) =>
        slot.SESSION_NAME === 'Morning' && slot.DAY_OF_WEEK === selectedDay
    );
    this.afternoonSlots = generatedslots.filter(
      (slot) =>
        slot.SESSION_NAME === 'Afternoon' && slot.DAY_OF_WEEK === selectedDay
    );
    this.eveningSlots = generatedslots.filter(
      (slot) =>
        slot.SESSION_NAME === 'Evening' && slot.DAY_OF_WEEK === selectedDay
    );

    // Loop through all dates and compute SLOTS per weekday
    this.dates.forEach((data) => {
      if (data['LABEL']) {
        const dateObj = this.parseLabelToDate(data['LABEL']);
        const weekday = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
        });

        const mslotlength = generatedslots.filter(
          (slot) =>
            slot.SESSION_NAME === 'Morning' &&
            slot.DAY_OF_WEEK === weekday &&
            !slot.IS_BOOKED &&
            !slot.IS_BLOCKED
        ).length;
        const aslotlength = generatedslots.filter(
          (slot) =>
            slot.SESSION_NAME === 'Afternoon' &&
            slot.DAY_OF_WEEK === weekday &&
            !slot.IS_BOOKED &&
            !slot.IS_BLOCKED
        ).length;
        const eslotlength = generatedslots.filter(
          (slot) =>
            slot.SESSION_NAME === 'Evening' &&
            slot.DAY_OF_WEEK === weekday &&
            !slot.IS_BOOKED &&
            !slot.IS_BLOCKED
        ).length;

        data['SLOTS'] = mslotlength + aslotlength + eslotlength;
      }
    });

    if (isDatechanged) {
      this.selectedSlots = [];
    }
  }

  isSelected(slot: any): boolean {
    return (
      this.selectedSlots.length > 0 &&
      this.selectedSlots[0].START === slot.START &&
      this.selectedSlots[0].END === slot.END
    );
  }

  toggleSlot(slot: any): void {
    // console.log(slot);

    if (this.isSelected(slot)) {
      // slot['IS_BOOKED'] = 0;
      this.selectedSlots = []; // Unselect if already selected
    } else {
      // slot['IS_BOOKED'] = 1;
      this.selectedSlots = [slot]; // Replace with new selection
      // this.slotMatched = this.selectedSlots

      // console.log(this.slotMatched);

    }
  }

  handleCancell(): void {
    this.isVisible = false;
    this.selectedSlots = [];
  }

  handleOk(): void {
    this.isVisible = false;
    if (this.selectedSlots.length > 0) {
      //this.data['SESSION_ID'] = this.selectedSlots[0]['SESSION_ID'];
      // this.data['START'] = this.selectedSlots[0]['START'];
      // this.data['END'] = this.selectedSlots[0]['END'];
      // this.data['IS_BOOKED'] = this.selectedSlots[0]['IS_BOOKED'];
      // this.data['IS_BLOCKED'] = this.selectedSlots[0]['IS_BLOCKED'];
      // this.data['BLOCKED_REASON'] = this.selectedSlots[0]['BLOCKED_REASON'];
      // this.data['DATE'] =
      this.data['session_id'] = this.selectedSlots[0]['SESSION_ID'];
      this.data['start'] = this.selectedSlots[0]['START'];
      this.data['end'] = this.selectedSlots[0]['END'];
      this.data['is_booked'] = this.selectedSlots[0]['IS_BOOKED'];
      this.data['is_blocked'] = this.selectedSlots[0]['IS_BLOCKED'];
      this.data['blocked_reason'] = this.selectedSlots[0]['BLOCKED_REASON'];
      this.data['date'] =
        this.selectedSlots[0]['CREATED_MODIFIED_DATE'].split(' ')[0];
      // console.log('Selected Slots:', this.selectedSlots);

      this.slotMatched = this.selectedSlots;
    } else {
      this.message.info('Please select atleast one slot', '');
    }
  }

  //

  // get Test
  public commonFunction = new CommonFunctionService();

  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  TesttData: any = [];
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  gettest(): void {
    const filter = ' AND is_active=1';
    if (this.decreptedroleId != 1) {
      this.api
        .getTest(filter, this.labID)
        .subscribe((response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.TesttData = response.body.data;
          } else {
            this.TesttData = [];
            this.message.error(`Something went wrong.`, '');
          }
        });
    } else {
      this.api
        .getTest(filter, this.LabBindingId)
        .subscribe((response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.TesttData = response.body.data;
          } else {
            this.TesttData = [];
            this.message.error(`Something went wrong.`, '');
          }
        });
    }
  }

  // get Test
  packagedata: any = [];
  package(): void {
    let filter = `AND IS_ACTIVE = 1`;
    let labID = this.decreptedroleId != 1 ? this.labID : this.LabBindingId;
    if (this.decreptedroleId != 1) {
      filter += ' AND LAB_ID=' + this.labID;
    }

    this.api
      .getLabPackagebyId(0, 0, 'id', 'desc', filter, labID)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.packagedata = response.body.data;
        } else {
          this.packagedata = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  filteredPatients: any[] = [];
  filteredPatients1: any[] = [];
  searchNumber: string = '';

  onSearchNumberChange(searchNumber: any): void {
    // console.log(searchNumber, 'searchNumber');

    const filter = `AND mobile_number =` + `'${searchNumber}'`;

    if (
      searchNumber !== undefined &&
      searchNumber !== null &&
      searchNumber !== ''
    ) {
      var numberfilter = ' AND mobile_number =' + `'${searchNumber}'`;
    } else {
      numberfilter = '';
    }
    if (searchNumber.length == 10) {
      this.api.getPatientNumber(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.filteredPatients = response.body.data;
            this.filteredPatients1 = response.body.data.name;

            if (this.filteredPatients.length > 0) {
              // Patient found
              this.data.name = this.filteredPatients[0].name;
              this.data.patient_id = this.filteredPatients[0].id;
              this.message.success('The patient is present.', '');
            } else {
              this.filteredPatients = [];
              // Patient not found
              this.data.name = '';
              this.message.warning(
                'The patient is unavailable to provide a mobile number.',
                ''
              );
            }

            // console.log(
            //   this.filteredPatients,
            //   'this.filteredPatients this.filteredPatients'
            // );
          } else {
            this.filteredPatients = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
        (error) => {
          this.filteredPatients = [];
          this.message.error(`Error fetching data: ${error.message}`, '');
        }
      );
    }
  }

  // image Upload code

  imgUrl;
  categories: any = [];

  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';

  deleteCancel() { }
  removeImage() {
    this.data.registration_proof = ' ';
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    // console.log('data', data);

    this.UrlImageOne = null;
    this.data.registration_proof = ' ';

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    // console.log('view');

    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  today = new Date();
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) <= 0;
  GetImage(link: string) {
    // console.log('Getting Image');
    let imagePath = this.api.retriveimgUrl + 'SubCategory/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    // console.log('Image path:', imagePath);

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  imageshow;

  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.data.date = this.dateSelected;
    this.isOk = true;
    if (
      this.data.technician_id == undefined ||
      this.data.technician_id == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Technician', '');
    } else if (
      this.radiovalue == 'T' &&
      (this.data.test_id == undefined || this.data.test_id == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Test', '');
    } else if (
      this.radiovalue == 'P' &&
      (this.data.package_id == undefined || this.data.package_id == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Package', '');
    }

    // if (
    //   this.data.NEXT_FOLLOUP_DATE == undefined ||
    //   this.data.NEXT_FOLLOUP_DATE == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Next Follow-Up Date', '');
    // }
    // if (
    //   this.data.NOTES == undefined ||
    //   this.data.NOTES == '' ||
    //   this.data.NOTES.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Notes', '');
    // }

    if (this.isOk) {
      this.isSpinning = true;
      {
        // this.data.PATIENT_ID = 'PATIENT',
        //   this.data.SLOT_ID = 'PATIENT',
        //   this.data.test_id = 'PATIENT',
        //   this.data.package_id = 'PATIENT'
        this.data.next_folloup_date = this.data.next_folloup_date
          ? this.datePipe.transform(
            this.data.next_folloup_date,
            'yyyy-MM-dd'
          ) || ''
          : null;
        // this.data['LAB_ID']=this.LabBindingId
        const payload = {
          ...this.data,
          status: this.data.status ? 1 : 0,
          is_active: this.data.is_active ? 1 : 0
        };
        if (this.data.id) {
          this.api.updateLabAppointment(payload).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error('Information Not Updated', '');
              this.isSpinning = false;
            }
          );
        } else {
          // console.log(this.data.DATE)
          this.api.createLabAppointment(payload).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new LabAppointmentMaster();
                  this.resetDrawer(CityMasterPage);
                  // this.api.getLabAppointment(0, 0, '', 'desc', '').subscribe(
                  //   (data: HttpResponse<any>) => {
                  //     // if (data['count'] == 0) {
                  //     //   this.data.SEQ_NO = 1;
                  //     // } else {
                  //     //   this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                  //     // }
                  //   },
                  //   () => {}
                  // );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Saved...', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error('Information Not Saved', '');
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  citySeq(): void {
    //   this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(
    //     (data) => {
    //       if (data['count'] == 0) {
    //         this.data.SEQ_NO = 1;
    //       } else {
    //         this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //         this.data.IS_ACTIVE = true;
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  resetDrawer(CityMasterPage: NgForm) {
    this.data = new LabAppointmentMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
    this.citySeq();
  }
  isAddPatientVisible = false;
  patientDatasend: LabPatient = new LabPatient();
  isSavePatient = false;
  mobileNo: any;
  openPatientDrawer() {
    //  this.api.getpatientdata(1, 1, 'SEQ_NO', 'desc', '' + '').subscribe(
    //   (res: HttpResponse<any>) => {
    //     if (res.body['count'] == 0) {
    //       this.patientDatasend.SEQ_NO = 1;
    //     } else {
    //       this.patientDatasend.SEQ_NO = res.body['data'][0]['SEQ_NO'] + 1;
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    this.mobileNo = this.searchNumber;
    this.isAddPatientVisible = true;
    // this.childComponent.data.MOBILE_NUMBER = this.searchNumber;
  }
  @ViewChild(LabPatientMasterFormComponent)
  childComponent!: LabPatientMasterFormComponent;
  patientDrawerClose() {
    // console.log(this.childComponent.data);s
    let obj = {
      LAB_ID: this.childComponent.data.lab_id,
      // USER_ID: 0,
      PATIENT_NO: this.childComponent.data.patient_no,
      PATIENT_NAME: this.childComponent.data.name,
      PATIENT_DOB: this.childComponent.data.dob,
      PATIENT_BLOOD_GROUP: this.childComponent.data.blood_group,
      PATIENT_GENDER: this.childComponent.data.gender,
      PATIENT_MOBILE_NUMBER: this.childComponent.data.mobile_number,
      IS_ACTIVE: this.childComponent.data.is_active,
      // CLIENT_ID: this.childComponent.data.CLIENT_ID,
    };
    this.data.name = this.childComponent.data.name;
    this.data = { ...structuredClone(this.data), ...structuredClone(obj) };
    this.data.patient_id = null;
    // console.log(this.data)
    this.patientDatasend = new LabPatient();
    this.isAddPatientVisible = false;
    this.isSavePatient = false;
  }
  get closeCallbackpateint() {
    return this.patientDrawerClose.bind(this);
  }
  removeLogo(file: any) {
    file = null;
    this.data.report = null;
    // throw new Error('Method not implemented.');
  }
}
