import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-secure-next-documents-master',
  templateUrl: './secure-next-documents-master.component.html',
  styleUrls: ['./secure-next-documents-master.component.css'],
  providers: [DatePipe]
})
export class SecureNextDocumentsMasterComponent implements OnInit {

  formTitle = "Securenext (Powered by CMR+) Documents";
  dataList: any = [];
  fullDataList: any = []; // Store all records for filtering
  originalDataList: any = []; // Backup copy for reset functionality
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  showcloumnVisible: boolean = false;

  // Filter properties - changed to arrays for multi-select
  selectedPatients: string[] = [];
  selectedDocumentTypes: string[] = [];
  selectedDateRange: Date[] = [];
  selectedDepartments: string[] = [];

  patientList: any[] = [];
  documentTypeList: any[] = [];
  departmentList: any[] = [];
  isLoadingPatients = false;

  columns: string[][] = [
    ['DOCUMENT_DATE', 'Date of Document'],
    ['DOCUMENT_TYPE', 'Type Of Document'],
    ['PATIENT_ID', 'Patient ID'],
    ['DEPARTMENT', 'Department'],
    ['SUMMARY', 'Summary'],
    ['VIEW_DOCUMENT', 'View Document'],
  ];

  showcolumn = [
    { label: 'Date of Document', key: 'DOCUMENT_DATE', visible: true },
    { label: 'Type Of Document', key: 'DOCUMENT_TYPE', visible: true },
    { label: 'Patient ID', key: 'PATIENT_ID', visible: true },
    { label: 'Department', key: 'DEPARTMENT', visible: true },
    { label: 'Summary', key: 'SUMMARY', visible: true },
    { label: 'View Document', key: 'VIEW_DOCUMENT', visible: true },
  ];

  public commonFunction = new CommonFunctionService();

  constructor(
    private notification: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Initialize with empty data - only uploaded documents will be shown
    this.fullDataList = [];
    this.originalDataList = [];
    this.dataList = [];
    this.loadingRecords = false;
    this.totalRecords = 0;

    // Initialize empty dropdown lists
    this.getDocTypes();
    this.getDepartments();
    this.onSearchPatient('');
  }

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  getDocTypes() {
    // Extract unique document types from table data
    const uniqueTypes = [...new Set(this.fullDataList.map((item: any) => item.DOCUMENT_TYPE))];
    this.documentTypeList = uniqueTypes
      .filter(type => type) // Remove null/undefined
      .map((type, index) => ({ ID: index + 1, NAME: type }));
  }

  getDepartments() {
    // Extract unique departments from table data
    const uniqueDepts = [...new Set(this.fullDataList.map((item: any) => item.DEPARTMENT))];
    this.departmentList = uniqueDepts
      .filter(dept => dept) // Remove null/undefined
      .map((dept, index) => ({ ID: index + 1, NAME: dept }));
  }

  onSearchPatient(value: string): void {
    // Extract unique patient IDs from table data
    const uniquePatients = [...new Set(this.fullDataList.map((item: any) => item.PATIENT_ID))];

    this.isLoadingPatients = false;

    if (value && value.trim() !== '') {
      // Filter patients based on search value
      const searchLower = value.toLowerCase();
      this.patientList = uniquePatients
        .filter(id => id && String(id).toLowerCase().includes(searchLower))
        .map((id, index) => ({ ID: index + 1, NAME: id }));
    } else {
      // Show all unique patients
      this.patientList = uniquePatients
        .filter(id => id) // Remove null/undefined
        .map((id, index) => ({ ID: index + 1, NAME: id }));
    }
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    this.loadingRecords = true;

    // Start with full data list
    let filteredData = [...this.fullDataList];

    // Apply global search filter
    if (this.searchText && this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase();
      filteredData = filteredData.filter((item: any) => {
        return (
          (item.DOCUMENT_DATE && String(item.DOCUMENT_DATE).toLowerCase().includes(searchLower)) ||
          (item.DOCUMENT_TYPE && String(item.DOCUMENT_TYPE).toLowerCase().includes(searchLower)) ||
          (item.PATIENT_ID && String(item.PATIENT_ID).toLowerCase().includes(searchLower)) ||
          (item.DEPARTMENT && String(item.DEPARTMENT).toLowerCase().includes(searchLower)) ||
          (item.SUMMARY && String(item.SUMMARY).toLowerCase().includes(searchLower)) ||
          (item.NAME && String(item.NAME).toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply patient filter - multi-select
    if (this.selectedPatients && this.selectedPatients.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        this.selectedPatients.includes(String(item.PATIENT_ID))
      );
    }

    // Apply document type filter - multi-select
    if (this.selectedDocumentTypes && this.selectedDocumentTypes.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        this.selectedDocumentTypes.includes(String(item.DOCUMENT_TYPE))
      );
    }

    // Apply department filter - multi-select
    if (this.selectedDepartments && this.selectedDepartments.length > 0) {
      filteredData = filteredData.filter((item: any) =>
        this.selectedDepartments.includes(String(item.DEPARTMENT))
      );
    }

    // Apply date range filter
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const fromDate = this.datePipe.transform(this.selectedDateRange[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(this.selectedDateRange[1], 'yyyy-MM-dd');

      if (fromDate && toDate) {
        filteredData = filteredData.filter((item: any) => {
          if (!item.DOCUMENT_DATE) return false;
          return item.DOCUMENT_DATE >= fromDate && item.DOCUMENT_DATE <= toDate;
        });
      }
    }

    // Apply sorting
    if (this.sortKey) {
      filteredData.sort((a: any, b: any) => {
        const aValue = a[this.sortKey] || '';
        const bValue = b[this.sortKey] || '';

        if (this.sortValue === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Update filter indicator
    this.isfilterapply = !!(
      this.searchText ||
      (this.selectedPatients && this.selectedPatients.length > 0) ||
      (this.selectedDocumentTypes && this.selectedDocumentTypes.length > 0) ||
      (this.selectedDepartments && this.selectedDepartments.length > 0) ||
      (this.selectedDateRange && this.selectedDateRange.length === 2)
    );

    // Simulate API delay for smooth UX
    setTimeout(() => {
      this.dataList = filteredData;
      this.totalRecords = filteredData.length;
      this.loadingRecords = false;
    }, 300);
  }

  resetFilters() {
    // Clear all filter selections
    this.selectedPatients = [];
    this.selectedDocumentTypes = [];
    this.selectedDepartments = [];
    this.selectedDateRange = [];
    this.searchText = '';

    // No need to restore data - we keep the uploaded documents
    // Just refresh the dropdown lists
    this.getDocTypes();
    this.getDepartments();
    this.onSearchPatient('');

    // Reset pagination and search
    this.search(true);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length === 0) {
      this.dataList = [];
      this.search();
    }
  }

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }

  // Drawer & Stepper Logic
  uploadDrawerVisible = false;
  currentStep = 0;
  uploadedFilesList: any[] = [];
  hover = false;

  openUploadDrawer() {
    this.uploadDrawerVisible = true;
    this.currentStep = 0;
    this.uploadedFilesList = [];
  }

  closeUploadDrawer() {
    this.uploadDrawerVisible = false;
  }

  async onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const objectUrl = URL.createObjectURL(file);

        this.uploadedFilesList.push({
          NAME: file.name,
          fileUrl: objectUrl,
          uploadDate: new Date(), // Track upload date
          DOCUMENT_DATE: '',
          DOCUMENT_TYPE: '',
          PATIENT_ID: '',
          DEPARTMENT: '',
          SUMMARY: '',
          status: 'Loading...',
          uploadPercentage: 0,
          isLoading: true  // Add loading flag
        });
      }
      // Trigger change detection by reassigning array
      this.uploadedFilesList = [...this.uploadedFilesList];

      // Start AI extraction immediately for each file
      await this.extractAllFiles();
    }
  }

  async extractAllFiles() {
    for (const file of this.uploadedFilesList) {
      if (file.status !== 'Loading...') continue;

      file.status = 'Extracting...';
      this.uploadedFilesList = [...this.uploadedFilesList];

      try {
        const extractedData = await this.extractDataWithAI(file);

        file.DOCUMENT_DATE = extractedData.documentDate || this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        file.DOCUMENT_TYPE = extractedData.documentType || 'Unknown Document';
        file.PATIENT_ID = extractedData.patientId || 'N/A';
        file.DEPARTMENT = extractedData.department || 'General';
        file.SUMMARY = extractedData.summary || 'No summary available.';
        file.status = 'Ready';
        file.isLoading = false;

      } catch (error) {
        console.error('AI extraction failed:', error);
        file.status = 'Failed';
        file.isLoading = false;
        file.DOCUMENT_TYPE = 'Extraction Failed';
        file.PATIENT_ID = 'N/A';
        file.DEPARTMENT = 'N/A';
        file.SUMMARY = 'Failed to extract data. Please try again.';
      }

      this.uploadedFilesList = [...this.uploadedFilesList];
    }
  }

  isProcessing = false;

  async next() {
    if (this.currentStep === 0) {
      if (this.uploadedFilesList.length === 0) {
        this.notification.error("Validation Error", "Please select at least one file to upload.");
        return;
      }
      this.currentStep++;
      await this.processUploads();
    } else if (this.currentStep === 1) {
      this.currentStep++;
    } else {
      this.done();
    }
  }

  pre() {
    this.currentStep--;
  }

  done() {
    this.closeUploadDrawer();

    // Add uploaded files to the full data list
    const newRecords = this.uploadedFilesList.map((file, index) => ({
      ...file,
      id: this.fullDataList.length + index + 1, // Generate unique ID
      // fileUrl is already set in the file object
    }));

    // Add to full data list (for filtering)
    this.fullDataList = [...newRecords, ...this.fullDataList];

    // Update the original data list to include new uploads
    this.originalDataList = JSON.parse(JSON.stringify(this.fullDataList));

    // Refresh dropdowns with new data
    this.getDocTypes();
    this.getDepartments();
    this.onSearchPatient('');

    // Trigger search to apply any active filters
    this.search();

    this.notification.success("Success", `${newRecords.length} file(s) processed and uploaded successfully.`);

    // Reset wizard
    this.uploadedFilesList = [];
    this.currentStep = 0;
  }

  async processUploads() {
    this.isProcessing = true;

    // Process files one by one
    for (const file of this.uploadedFilesList) {
      if (file.status === 'Completed') continue;

      file.status = 'Processing...';
      file.uploadPercentage = 0;
      this.uploadedFilesList = [...this.uploadedFilesList];

      // Simulate Upload Progress
      for (let p = 0; p <= 100; p += 20) {
        file.uploadPercentage = p;
        this.uploadedFilesList = [...this.uploadedFilesList];
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Check if data was already extracted in preview (status is 'Ready')
      if (file.status === 'Ready' && file.DOCUMENT_TYPE) {
        // Data already exists - just mark as completed
        file.status = 'Completed';
        this.uploadedFilesList = [...this.uploadedFilesList];
        continue;
      }

      file.status = 'Extracting Data with AI...';
      this.uploadedFilesList = [...this.uploadedFilesList];

      try {
        // Extract data using AI only if not already extracted
        const extractedData = await this.extractDataWithAI(file);

        file.DOCUMENT_DATE = extractedData.documentDate || this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        file.DOCUMENT_TYPE = extractedData.documentType || 'Unknown Document';
        file.PATIENT_ID = extractedData.patientId || 'N/A';
        file.DEPARTMENT = extractedData.department || 'General';
        file.SUMMARY = extractedData.summary || 'No summary available.';

        file.status = 'Completed';

      } catch (error) {
        console.error('AI extraction failed:', error);
        file.status = 'Failed';

        this.notification.error(
          'Extraction Failed',
          `Failed to extract data from ${file.NAME}. Please check your API key and try again.`
        );
      }

      this.uploadedFilesList = [...this.uploadedFilesList];
    }

    this.isProcessing = false;
  }

  async extractDataWithAI(file: any): Promise<any> {
    // Generate static data based on filename (no API calls)
    const fileName = file.NAME || 'document.pdf';
    const lowerFileName = fileName.toLowerCase();

    // Simulate processing delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine document type from filename
    let documentType = 'Medical Document';
    let department = 'General';
    let summary = 'Medical document for patient care and record keeping.';

    if (lowerFileName.includes('lab') || lowerFileName.includes('blood') || lowerFileName.includes('test')) {
      documentType = 'Lab Report';
      department = 'Laboratory';
      summary = 'Complete blood count and metabolic panel showing normal ranges. All vital parameters within acceptable limits.';
    } else if (lowerFileName.includes('prescription') || lowerFileName.includes('rx') || lowerFileName.includes('medicine')) {
      documentType = 'Prescription';
      department = 'Pharmacy';
      summary = 'Medication prescription including dosage instructions and duration. Patient advised to complete full course.';
    } else if (lowerFileName.includes('xray') || lowerFileName.includes('x-ray') || lowerFileName.includes('scan')) {
      documentType = 'X-Ray Report';
      department = 'Radiology';
      summary = 'Radiological examination completed. No significant abnormalities detected in the scanned region.';
    } else if (lowerFileName.includes('discharge') || lowerFileName.includes('summary')) {
      documentType = 'Discharge Summary';
      department = 'General Ward';
      summary = 'Patient discharged in stable condition with follow-up instructions. Recovery progressing as expected.';
    } else if (lowerFileName.includes('cardio') || lowerFileName.includes('heart') || lowerFileName.includes('ecg')) {
      documentType = 'Cardiology Report';
      department = 'Cardiology';
      summary = 'Cardiac evaluation completed. ECG and stress test results indicate normal heart function.';
    } else if (lowerFileName.includes('mri') || lowerFileName.includes('ct')) {
      documentType = 'Imaging Report';
      department = 'Radiology';
      summary = 'Advanced imaging study completed. Detailed analysis shows no concerning findings.';
    }

    // Generate realistic patient ID
    const patientId = 'P' + Math.floor(10000 + Math.random() * 90000);

    // Generate date (recent date within last 30 days)
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const documentDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const formattedDate = this.datePipe.transform(documentDate, 'yyyy-MM-dd');

    return {
      documentDate: formattedDate,
      documentType: documentType,
      patientId: patientId,
      department: department,
      summary: summary
    };
  }

  async extractTextFromPDF(blobUrl: string): Promise<string> {
    try {
      const pdfjsLib = (window as any).pdfjsLib || (window as any)['pdfjs-dist/build/pdf'];

      if (!pdfjsLib) {
        console.warn('PDF.js not loaded, using filename only');
        return `Medical document file: ${blobUrl.split('/').pop() || 'unknown.pdf'}. Please analyze based on filename.`;
      }

      const response = await fetch(blobUrl);
      const arrayBuffer = await response.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from first 5 pages (to keep it manageable)
      const maxPages = Math.min(pdf.numPages, 5);

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText.substring(0, 10000); // Limit to 10k chars
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      // Return filename as fallback
      return `Document: ${blobUrl.split('/').pop()}`;
    }
  }

  async fileToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  viewDocument(data: any) {
    this.viewingDocument = data;
    this.isViewModalVisible = true;
  }

  isViewModalVisible = false;
  viewingDocument: any = null;

  closeViewModal() {
    this.isViewModalVisible = false;
    this.viewingDocument = null;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
