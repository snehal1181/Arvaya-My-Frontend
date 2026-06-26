import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiStudioService {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private apiKey = 'AIzaSyA55QW6qMAu-ypwgYpgWAmPJ4qXoZVBjXY';
  private http: HttpClient;
  constructor(private httpBackend:HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  identifyFile(base64Data: string, mimeType: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const medicalDocumentTypes = [
      {
        type: 'Medical Prescription',
        mandatoryFields: [
          'Patient Name',
          'Doctor Name',
          'Date',
          'Medications',
          'Dosage',
          'Signature',
        ],
        requires: ['signature'],
      },
      {
        type: 'Lab Report',
        mandatoryFields: [
          'Patient Name',
          'Test Name',
          'Result',
          'Reference Range',
          'Date',
          'Lab Name',
        ],
        requires: ['stamp', 'signature'],
      },
      {
        type: 'Discharge Summary',
        mandatoryFields: [
          'Patient Name',
          'Hospital Name',
          'Admission Date',
          'Discharge Date',
          'Diagnosis',
          'Doctor Notes',
        ],
        requires: ['signature'],
      },
      {
        type: 'Immunization Record',
        mandatoryFields: [
          'Patient Name',
          'Vaccine Name',
          'Date Given',
          'Batch Number',
          'Provider',
        ],
        requires: ['stamp'],
      },
      {
        type: 'Radiology Report',
        mandatoryFields: [
          'Patient Name',
          'Scan Type',
          'Findings',
          'Impression',
          'Date',
        ],
        requires: ['signature'],
      },
      {
        type: 'Medical Certificate',
        mandatoryFields: [
          'Patient Name',
          'Issued By',
          'Purpose',
          'Valid Till',
          'Date',
        ],
        requires: ['signature', 'stamp'],
      },
    ];

    const promptText = `You are a medical document analysis assistant.

Here are the expected document types:
${medicalDocumentTypes.map((dt) => `- ${dt.type}`).join('\n')}

Each type includes mandatory fields and may require signature/stamp:

${medicalDocumentTypes
  .map(
    (dt) =>
      `- ${dt.type}: Fields → [${dt.mandatoryFields.join(
        ', '
      )}]; Requires → [${dt.requires.join(', ')}]`
  )
  .join('\n')}

Your task:
1️⃣ Detect the document type from the list.
2️⃣ Extract all mandatory fields.
3️⃣ Detect presence of:
- Signature
- Stamp
- QR code
- Barcode

4️⃣ If required elements (signature/stamp/QR/barcode) are missing, return:
\`\`\`json
{
  "isTypeValid": false,
  "areMandatoryFieldsPresent": false,
  "signaturePresent": false,
  "stampPresent": false,
  "qrCodePresent": false,
  "barCodePresent": false,
  "error": "Missing required elements."
}
\`\`\`

5️⃣ If all checks pass, respond in this format:
\`\`\`json
{
  "documentType": "detected type",
  "mandatoryFields": {
    "field1": "value",
    "field2": "value"
  },
  "isTypeValid": true,
  "areMandatoryFieldsPresent": true,
  "signaturePresent": true/false,
  "stampPresent": true/false,
  "qrCodePresent": true/false,
  "barCodePresent": true/false,
  "description": "Summarized content",
  "error": ""
}
\`\`\`

6️⃣ If document is not recognized, set "isTypeValid": false and provide reason in "error".
7️⃣ Always format response inside \`\`\`json code fences.`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            { text: promptText },
          ],
        },
      ],
    };

    return this.http
      .post<any>(`${this.apiUrl}?key=${this.apiKey}`, requestBody, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error calling Gemini API:', error);
          return throwError(
            () => new Error('Failed to identify medical record.')
          );
        })
      );
  }
}
