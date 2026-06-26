import { DatePipe } from '@angular/common';
import {
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HealthRecord } from '../../../Models/healthRecords';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { createWorker } from 'tesseract.js';
import * as dicomParser from 'dicom-parser';
@Component({
  selector: 'app-healthrecordsform',
  templateUrl: './healthrecordsform.component.html',
  styleUrls: ['./healthrecordsform.component.css'],
})
export class HealthrecordsformComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: HealthRecord = new HealthRecord();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HealthRecord[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isDocumentLoading = false;
  isOk = true;
  public commonFunction = new CommonFunctionService();
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  strengthUnitList: any;
  typeIdList: any;
  hospitalIdList: any;
  genderList: any;
  mobpattern = /^[6-9]\d{9}$/;
  availableTags: any[] = [];
  summary: string = '';
  hitypes: any = [];
  loadingHytypes = false;
  Patients: any = [];
  private http: HttpClient;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
    this.getHytpes();
    this.getPatients();
    this.getLabs();
    //   this.getCountyData();// Replace with a valid default country ID
    //   if(this.data.COUNTRY_ID){
    // this.getStateData(this.data.COUNTRY_ID);}
  }
  getPatients() {
    this.api.getpatientdata(0, 0, 'id', 'desc', ' AND is_active =1').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        // const headers = response.headers;
        if (statusCode === 200) {
          // this.loadingRecords = false;
          // this.totalRecords = response.body.count;
          this.Patients = response.body.data;
        } else {
          this.Patients = [];
          this.message.error(`Something went wrong.`, '');
          // this.loadingRecords = false;
        }
      },
      (err: HttpErrorResponse) => {
        // this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          this.message.error(
            `HTTP Error: ${err.status}. Something Went Wrong.`,
            ''
          );
        }
      }
    );
  }
  getHytpes() {
    this.loadingHytypes = true;
    this.api.getDocumentType(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1').subscribe(
      (data) => {
        if (data['status'] == 200) {
          this.hitypes = data.body['data'];
          this.loadingHytypes = false;
        } else {
          this.hitypes = [];
          this.loadingHytypes = false;
        }
      },
      (err) => {
        this.loadingHytypes = false;
      }
    );
  }
  labList: any = [];
  allLabs: any = [];

  onPatientSelect(id) {
    this.data.lab_name = ''
    if (id) {
      let finddata = this.Patients.find((data) => data.id == id);
      // console.log(finddata)
      if (finddata.lab_id) {
        this.labList = this.allLabs.filter(
          (data) => data.id == finddata.lab_id
        );
      }
      else {
        this.labList = this.allLabs
      }
    }
  }
  getLabs() {
    this.api.getLabMaster(0, 0, 'id', 'desc', ' AND is_active =1').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        // const headers = response.headers;
        if (statusCode === 200) {
          // this.loadingRecords = false;
          // this.totalRecords = response.body.count;
          this.labList = response.body.data;
          this.allLabs = response.body.data;
        } else {
          this.labList = [];
          this.message.error(`Something went wrong.`, '');
          // this.loadingRecords = false;
        }
      },
      (err: HttpErrorResponse) => {
        // this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          this.message.error(
            `HTTP Error: ${err.status}. Something Went Wrong.`,
            ''
          );
        }
      }
    );
  }
  // For Accepting Only Alphabits/ Character
  alphaOnly1(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Allow uppercase letters (A-Z) and numbers (0-9)
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 48 && charCode <= 57) // 0-9
    ) {
      event.preventDefault();
    }
  }
  documentVerificationVisible = false;
  openDocumentVerification() {
    this.documentVerificationVisible = true;
  }
  onCancel() {
    this.documentVerificationVisible = false;
  }
  // async onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (!file) return;

  //   let extractedText = '';

  //   if (file.type === 'application/pdf') {
  //     extractedText = await this.extractPdfText(file);
  //   } else if (file.type.startsWith('image/')) {
  //     extractedText = await this.extractImageText(file);
  //   } else {
  //     this.summary = 'Unsupported file type';
  //     return;
  //   }

  //   const prompt = `Summarize the following document:\n\n${extractedText.slice(
  //     0,
  //     10000
  //   )}`;
  //   this.getGeminiSummary(prompt);
  // }
  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = this.api.retriveimgUrl;
  isSummaryLoading = false;
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
      this.data.file_url = null;
      return;
    }

    const number = Math.floor(100000 + Math.random() * 900000);
    const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    let url = d ? d + number + '.' + fileExt : '';

    if (this.data.file_url?.trim()) {
      const arr = this.data.file_url.split('/');
      if (arr.length > 1) url = arr[5];
    }

    this.isSpinning = true;
    this.progressBarProfilePhoto = true;

    this.timerThree = this.api
      .onUpload('HealthRecords', this.fileList2, url)
      .subscribe(
        async (res: HttpEvent<any>) => {
          if (res instanceof HttpResponse) {
            if (res.status === 200 && res.body?.message === 'Success') {
              this.message.success(`Record uploaded successfully.`, '');
              this.isSummaryLoading = true;
              this.data.file_url = url;
              this.taskurl =
                this.imgUrl + 'HealthRecords/' + this.data.file_url;
              // 🧠 AI Summary Logic Starts Here
              let extractedText = '';

              if (file.type === 'application/pdf') {
                extractedText = await this.extractPdfText(file);
                this.data.file_type = 'PDF';
              } else if (file.type.startsWith('image/')) {
                extractedText = await this.extractImageText(file);
                this.data.file_type = 'Image';
              } else if (isDcmFile) {
                extractedText = await this.extractDicomMetadata(file); // 🆕 for DICOM
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

              this.getGeminiSummary(prompt);
            } else {
              this.isSpinning = false;
              this.message.error('Failed to upload record', '');
              this.data.file_url = null;
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
  removeLogo(data) {
    // const index = this.qualificationSelectedItems.findIndex(
    //   (doc) => doc.ID === data.ID
    // );
    // if (index !== -1) {
    //   this.qualificationSelectedItems[index].PROOF_DOCUMENT_URL = null;
    // }
    data = ' ';
    this.data.file_url = ' ';
    this.data.composition_data = '';
  }

  deleteCancel() { }
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
  getGeminiSummary(prompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

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
          this.data['summary_data'] = json.summary
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

  close(): void {
    this.drawerClose();
  }

  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, '', '', 'AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countryData = data['data'];
        } else {
          this.countryData = [];
          this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  stateData: any = [];
  getStateData(value) {
    this.api
      .getState(0, 0, '', '', 'AND IS_ACTIVE = 1 AND COUNTRY_ID = ' + value)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.stateData = data['data'];
          } else {
            this.stateData = [];
            this.message.error('Failed To Get State Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  sessionValue: any = sessionStorage.getItem('userId');

  labs: any;
  // getLabData() {
  //   const filter = `AND IS_ACTIVE = 1`;
  //   this.api.getLabList(filter).subscribe(
  //     (data: HttpResponse<any>) => {
  //       if (data['status'] == 200) {
  //         this.labs = data.body['data'];
  //       } else {
  //         this.labs = [];
  //         // this.message.error('Failed To Get Country Data', '');
  //       }
  //     },
  //     () => {
  //       this.message.error('Something Went Wrong', '');
  //     }
  //   );
  // }
  save(addNew: boolean, MedicineTypeMasterPage: NgForm): void {
    this.isOk = true;
    // if (
    //   (this.data.PATIENT_NO == undefined || this.data.PATIENT_NO == null) &&
    //   (this.data.DOB == undefined || this.data.DOB == null) &&
    //   (this.data.LAB_ID == undefined || this.data.LAB_ID == null) &&

    //   (this.data.BLOOD_GROUP == undefined || this.data.BLOOD_GROUP == null) &&
    //   (this.data.GENDER == undefined || this.data.GENDER == null) &&
    //   (this.data.MOBILE_NUMBER == undefined || this.data.MOBILE_NUMBER == null) &&
    //   (this.data.NAME == undefined || this.data.NAME == "" || this.data.NAME.trim() == "")
    // ) {
    //   this.isOk = false;
    //   this.message.error("Please Fill All The Required Fields ", "");
    // }
    // else if (!this.data.LAB_ID) {
    //   this.isOk = false;
    //   this.message.error('Please select Lab.', '');
    // }
    // else if (this.data.NAME == undefined || this.data.NAME == null) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Name', '');
    // }
    if (this.data.app_user_id == undefined || this.data.app_user_id == null) {
      this.isOk = false;
      this.message.error('Please select patient', '');
    }
    // else if (this.data.LAB_NAME == undefined || this.data.LAB_NAME == null) {
    //   this.isOk = false;
    //   this.message.error('Please select lab', '');
    // } 
    else if (
      this.data.title == undefined ||
      this.data.title == null ||
      this.data.title.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter title', '');
    }
    // else if (
    //   this.data.DESCRIPTION == undefined ||
    //   this.data.DESCRIPTION == null ||
    //   this.data.DESCRIPTION.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please enter description', '');
    // }
    else if (this.data.hi_type == undefined || this.data.hi_type == null) {
      this.isOk = false;
      this.message.error('Please select HI Type', '');
    } else if (
      this.data.creation_date == undefined ||
      this.data.creation_date == null || this.data.creation_date == ''
    ) {
      this.isOk = false;
      this.message.error('Please select creation date', '');
    }
    //  else if (
    //   this.data.REPORT_DATE == undefined ||
    //   this.data.REPORT_DATE == null
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please select report date', '');
    // } 
    else if (
      this.data.file_url == undefined ||
      this.data.file_url == null ||
      this.data.file_url.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please upload document', '');
    }
    // else if (
    //   this.data.MOBILE_NUMBER == null ||
    //   this.data.MOBILE_NUMBER == 0 ||
    //   this.data.MOBILE_NUMBER == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Mobile Number', '');
    // }
    // else if (
    //   !this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER.toString())
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Valid Mobile Number.', '');
    // }
    //  else if (
    //   this.data.BLOOD_GROUP == null ||
    //   this.data.BLOOD_GROUP == '' ||
    //   this.data.BLOOD_GROUP == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Blood Group', '');
    // }
    // else if (
    //   this.data.DOB == null ||
    //   this.data.DOB == '' ||
    //   this.data.DOB == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Date of Birth', '');
    // }

    // console.log(this.data);

    if (this.isOk) {
      this.isSpinning = true;
      this.data.user_id = this.commonFunction.decryptdata(this.sessionValue);
      this.data.creation_date = this.datePipe.transform(
        this.data.creation_date,
        'yyyy-MM-dd'
      );
      this.data.report_date = this.datePipe.transform(
        this.data.report_date,
        'yyyy-MM-dd'
      );
      this.data.tags = JSON.stringify(this.data.tags);
      {
        if (this.data.id) {
          this.api
            .updateMedicalRecord(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Medical Record Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Medical Record Updation Failed', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createMedicalRecord(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Medical record Created Successfully', '');

                this.isSpinning = false;
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new HealthRecord();
                  this.resetDrawer(MedicineTypeMasterPage);
                }
                this.isSpinning = false;
              } else {
                this.message.error('Medical Record Creation Failed..."', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  citySeq(): void {
    // this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.data.SEQ_NO = 1;
    //   } else {
    //     this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //     this.data.IS_ACTIVE = true;
    //   }
    // }, err => {
    //   console.log(err);
    // })
  }

  resetDrawer(MedicineTypeMasterPage: NgForm) {
    this.data = new HealthRecord();
    MedicineTypeMasterPage.form.markAsPristine();
    MedicineTypeMasterPage.form.markAsUntouched();
    // this.citySeq()
  }
  handleFileChange(event: any): void {
    if (event.file.status === 'done') {
      this.data.file_url = event.file.response.url; // Replace with actual path logic
    }
  }

  beforeUpload = (file: any): boolean => {
    // Optional: validation logic
    return true;
  };
}
