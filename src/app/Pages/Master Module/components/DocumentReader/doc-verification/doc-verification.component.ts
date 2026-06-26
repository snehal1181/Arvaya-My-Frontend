import { Component, ElementRef, ViewChild } from '@angular/core';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import { AiStudioService } from 'src/app/Service/ai-studio.service';
import { BrowserQRCodeReader } from '@zxing/browser';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import jsQR from 'jsqr';
import { Router } from '@angular/router';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DrawerService } from 'src/app/Service/drawer.service';

const documentTypesConfig = [
  {
    type: 'RERA Certificate',
    mandatoryFields: [
      'Registration Number',
      'Project Name',
      'Project Address',
      'Builder Name',
      'Period (Start and End Date) ',
    ],
    requires: ['signature'],
  },
  {
    type: 'Company Registration Certificate',
    mandatoryFields: [
      'Date of Incorporation',
      'CIN (Corporate Identity Number)',
      'Type of Entity',
      'Registered Office Address ',
      'Issuing Authority',
      'Names of Directors/Partners',
      'Digital or Physical Signature of Registrar',
    ],
    requires: ['signature'],
  },
  {
    type: 'GST Certificate',
    mandatoryFields: ['GSTIN', 'Business Name', 'Issue Date'],
    requires: ['signature', 'qrCode'],
  },
  {
    type: 'PAN Card Of Company',
    mandatoryFields: [
      'PAN Number',
      'Name of the Company',
      'Date of Issue',
      'Issuing Authority',
      'Cardholder Category',
    ],
    requires: ['qrCode'],
  },
  {
    type: 'Commencement Certificate',
    mandatoryFields: [
      'Project Name',
      'Builder Name',
      'Project Address',
      'Survey Number/CTS Number',
      'Approval to Commence Work From (start date)',
      'Issuing Authority Name and Stamp',
      'Signature of Authorised Officer',
      'Issue Date',
    ],
    requires: ['stamp', 'signature'],
  },
  {
    type: 'Encumbrance Certificate',
    mandatoryFields: [
      'Property Description',
      'Owner Name',
      'Period of Search (From – To Dates)',
      'Statement of Transactions (If No Transactions – Non Encumbrance”) ',
      'Sub-Registrar Office Name ',
      'Issue Date ',
      'Signature and Seal of Issuing Officer',
    ],
    requires: ['signature', 'stamp'],
  },
  {
    type: 'Occupancy Certificate (OC)',
    mandatoryFields: [
      'Project Name',
      'Address',
      'Builder Name',
      'Survey/Plot Number',
      'Date of Completion',
      'Confirmation',
      'Issuing Authority Name and Sealr',
      'Issue Date ',
      'Signature of Competent Authority ',
    ],
    requires: ['stamp', 'signature'],
  },
  {
    type: 'Completion Certificate',
    mandatoryFields: [
      'Project Name',
      'Address',
      'Builder Name',
      'Survey/Plot Number',
      'Date of Completion',
      'Verification of Construction ',
      'Issuing Authority Name and Stamp',
      'Issue Date ',
      'Signature of Competent Authority',
    ],
    requires: ['stamp', 'signature'],
  },
  {
    type: 'Aadhar Card',
    mandatoryFields: [
      'Name',
      'Mother Name',
      'Date of Birth',
      'Gender',
      'Aadhar No',
    ],
    requires: ['qrCode'],
  },
  {
    type: 'Voter Card',
    mandatoryFields: [
      "Elector's Name",
      'Father Name',
      'Date of Birth',
      'Gender',
      'Voter No',
    ],
    requires: ['barcode'],
  },
  {
    type: 'Council of architecture certificate',
    mandatoryFields: [
      'Name',
      'Registration Number',
      'Issue Date',
      'Valid Date',
    ],
    requires: ['stamp', 'signature'],
  },
  {
    type: 'Driving Licence',
    mandatoryFields: [
      'Name',
      'license Number',
      'Issue Date',
      'Valid Date',
      'Address',
      'PIN',
      'DOB',
      'DLR Date',
      'S/D/W Surname',
    ],
    requires: ['Signature'],
  },

  {
    type: 'QR Code',
    mandatoryFields: ['Desciption'],
    requires: ['qrCode'],
  },
];
@Component({
  selector: 'app-doc-verification',
  templateUrl: './doc-verification.component.html',
  styleUrls: ['./doc-verification.component.css'],
})
export class DocVerificationComponent {
    currentStep: number = 0; // Add this line
   selectedFile: File | null = null;
  descriptionText: string = '';
  descriptiontexttt: any = '';
  isIdentifyDisabled: boolean = true;
  isShow = false;
  videoPreviewUrl: string | null = null;

  imagePreviewUrl: any;
  pdfPreviewUrl!: any;
  qrCodeTexts: string[] = [];
  verificationMessage: any;

  formTitle = 'MedVerify AI';
  timelineSteps = [
    { label: 'Medical Record Uploaded', status: 'pending' },
    { label: 'Document Type Detection', status: 'pending' },
    { label: 'Mandatory Fields Verification', status: 'pending' },
    { label: 'Authenticity Check (QR/Signature/Stamp)', status: 'pending' },
    { label: 'Summary Generation', status: 'pending' }
  ];

  documentTypesConfig = [
    {
      type: 'Prescription',
      mandatoryFields: ['Patient Name', 'Doctor Name', 'Date', 'Medications'],
      requires: ['signature']
    },
    {
      type: 'Lab Report',
      mandatoryFields: ['Patient Name', 'Test Name', 'Result', 'Date'],
      requires: ['qrCode', 'stamp']
    },
    {
      type: 'Discharge Summary',
      mandatoryFields: ['Patient Name', 'Diagnosis', 'Treatment Given', 'Doctor Signature'],
      requires: ['signature', 'stamp']
    }
  ];

  @ViewChild('qrImage', { static: false }) qrImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private aiService: AiStudioService,
    private router: Router,
    private sanitizer: DomSanitizer ,
    private drawerService: DrawerService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.resetState();

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviewUrl = e.target.result;
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
        this.processPDF(file);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      this.videoPreviewUrl = URL.createObjectURL(file);
    }
  }

  identifyFile() {
    if (!this.selectedFile) return;

    this.setStepProcessing(0);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Data = e.target.result.split(',')[1];
      this.aiService.identifyFile(base64Data, this.selectedFile!.type).subscribe({
        next: async (response) => {
          try {
            this.setStepSuccess(0);
            this.setStepProcessing(1);

            const resultText = response.candidates[0].content.parts[0].text;
            const jsonResult = this.extractJSON(resultText);
            const config = this.documentTypesConfig.find(d => d.type === jsonResult.documentType);

            if (!config) return this.setStepFailed(1, 'Unknown document type');
            if (!jsonResult.isTypeValid) return this.setStepFailed(1, jsonResult.error);

            this.setStepSuccess(1);
            this.setStepProcessing(2);

            if (!jsonResult.areMandatoryFieldsPresent) {
              return this.setStepFailed(2, 'Missing mandatory fields: ' + jsonResult.error);
            }

            this.setStepSuccess(2);
            this.setStepProcessing(3);

            const missingElements = config.requires.filter(req => !jsonResult[req + 'Present']);
            if (missingElements.length > 0) {
              return this.setStepFailed(3, 'Missing: ' + missingElements.join(', '));
            }

            this.setStepSuccess(3);
            this.setStepProcessing(4);

            let qrCodes: string[] = [];
            if (this.selectedFile!.type.startsWith('image/')) qrCodes = await this.scanMultipleQRCodes();
            else if (this.selectedFile!.type === 'application/pdf') qrCodes = await this.processPDF(this.selectedFile);

            this.qrCodeTexts = qrCodes;
            const valuesOnly = jsonResult.mandatoryFields || {};
            this.descriptionText = JSON.stringify(valuesOnly, null, 2);
            this.descriptiontexttt = jsonResult.description;
            this.setStepSuccess(4);
          } catch (e) {
            this.setStepFailed(1, 'Processing failed');
          }
        },
        error: () => this.setStepFailed(1, 'AI service failed')
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }
getStepStatus(status: string): 'wait' | 'process' | 'finish' | 'error' {
  switch (status) {
    case 'pending':
      return 'wait';
    case 'processing':
      return 'process';
    case 'success':
      return 'finish';
    case 'failed':
      return 'error';
    default:
      return 'wait';
  }
}
  async scanMultipleQRCodes(): Promise<string[]> {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const img = this.qrImageRef.nativeElement;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const codeReader = new BrowserQRCodeReader();
    try {
      const result = await codeReader.decodeFromCanvas(canvas);
      return result?.getText() ? [result.getText()] : [];
    } catch {
      return [];
    }
  }

  // async processPDF(file: File): Promise<string[]> {
  //   const reader = new FileReader();
  //   return new Promise((resolve, reject) => {
  //     reader.onload = async (e: any) => {
  //       try {
  //         const pdf = await (window as any).pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise;
  //         const codes: string[] = [];

  //         for (let i = 1; i <= pdf.numPages; i++) {
  //           const page = await pdf.getPage(i);
  //           const canvas = document.createElement('canvas');
  //           const context = canvas.getContext('2d')!;
  //           const viewport = page.getViewport({ scale: 2 });
  //           canvas.width = viewport.width;
  //           canvas.height = viewport.height;
  //           await page.render({ canvasContext: context, viewport }).promise;
  //           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //           const code = jsQR(imageData.data, canvas.width, canvas.height);
  //           if (code?.data) codes.push(code.data.trim());
  //         }

  //         resolve(codes);
  //       } catch (err) {
  //         reject(err);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   });
  // }
  async processPDF(file: File | any): Promise<string[]> {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async (e: any) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          const detectedQRCodes: string[] = [];

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 3 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport: viewport })
              .promise;

            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code && code.data) {
              const text = code.data.trim();
              if (!detectedQRCodes.includes(text)) {
                detectedQRCodes.push(text);
              }
            }
          }

          console.log(detectedQRCodes);
          resolve(detectedQRCodes);
        } catch (err) {
          reject(err);
        }
      };

      fileReader.readAsArrayBuffer(file);
    });
  }
  extractJSON(text: string): any {
    try {
      const match = text.match(/```json\s*([\s\S]*?)```/);
      return match ? JSON.parse(match[1]) : JSON.parse(text);
    } catch {
      return null;
    }
  }

  setStepProcessing(index: number) {
    this.timelineSteps[index].status = 'processing';
  }

  setStepSuccess(index: number) {
    this.timelineSteps[index].status = 'success';
  }

  setStepFailed(index: number, message: string) {
    this.timelineSteps[index].status = 'failed';
    this.descriptionText = message;
  }

  resetState() {
    this.descriptionText = '';
    this.descriptiontexttt = '';
    this.qrCodeTexts = [];
    this.imagePreviewUrl = '';
    this.pdfPreviewUrl = '';
    this.timelineSteps.forEach(step => step.status = 'pending');
    this.isIdentifyDisabled = false;
    this.isShow = true;
  }

  downloadAsTextFile() {
    const blob = new Blob([this.descriptionText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-summary.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  back() {
    this.drawerService.openDrawer();
  }

  cleardata() {
  this.selectedFile = null;
  this.imagePreviewUrl = null;
  this.videoPreviewUrl = null;
  this.pdfPreviewUrl = null;
  this.descriptionText = '';
  this.descriptiontexttt = '';
  this.qrCodeTexts = [];
  this.isShow = false;
  this.isIdentifyDisabled = true;

  // Reset timeline steps to 'pending'
  this.timelineSteps.forEach((step) => step.status = 'pending');

  // Reset current step
  this.currentStep = 0;
}
}
