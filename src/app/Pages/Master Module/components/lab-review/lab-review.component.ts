import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';
import { ExportService } from 'src/app/Service/export.service';
@Component({
  selector: 'app-lab-review',
  templateUrl: './lab-review.component.html',
  styleUrls: ['./lab-review.component.css']
})
export class LabReviewComponent {
  formTitle = 'Lab Review Report';
  dataList: any;
  exportdataList: any[] = [];
  loadingRecords = false;
  exportLoading = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  isSpinning = false;
  maxRating = 10; // Example: RATINGS out of 10
  statusFilter: boolean;
  commenttext: string = '';
  // Filter Variables
  appointmentVisible: boolean = false;
  searchAppointment: string = '';

  labVisible: boolean = false;
  selectedLabs: any[] = [];

  doctorVisible: boolean = false;
  searchDoctor: string = '';

  feedbackVisible: boolean = false;
  searchFeedback = [];

  ratingVisible: boolean = false;
  minRating: number | null = null;

  dateVisible: boolean = false;
  selectedDateRange: Date[] = [];

  activeVisible: boolean = false;
  selectedActive: any;

  onStatusFilterChange(selectedStatus: string) {
    this.selectedActive = selectedStatus;
    this.search(true);
  }

  labId: any;
  labIdList: any[] = [];
  labload: boolean = false;
  commentvisible: boolean = false;
  // Appointment Data
  appointmentId: any;
  appointmentload: boolean = false;
  appointmentList: any[] = [];
  dateFilter: any;
  // Doctor Data
  techId: any;
  doctorload: boolean = false;
  techIdList: any[] = [];
  datefilter: any;
  ratings: any;
  screenWidth = 0;
  counttype = '';
  yearFilter = '';
  classFilter = '';
  divisionFilter = '';
  roleId = Number(sessionStorage.getItem('roleId'));
  columns: string[][] = [
    ['DATE', 'Date'],
    ['FEEDBACK_TYPE', 'Feedback Type'],
    ['LAB_NAME', 'Lab Name'],
    ['TECHNICIAN_NAME', 'Technician Name'],
    ['RATINGS', 'Ratings'],
    ['COMMENTS', 'Comments'],
  ];

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  feedbackTypeData: any[] = [
    { TYPE: 'Online', value: 'ON' },
    { TYPE: 'Ofline', value: 'OF' },
  ];

  schoolid = Number(sessionStorage.getItem('schoolid'));
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private exportservice: ExportService ,
    private drawerService: DrawerService
  ) {}
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
  }
  ngOnInit(): void {
    // this.screenWidth = window.innerWidth;
    this.getLabData();
    // this.getAppointmentData();
  }

  onKeyup(event: KeyboardEvent): void {
    if (this.commenttext.length > 3 && event.key === 'Enter') {
      this.search();
    } else if (this.commenttext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }

  datechange(date: any) {
    console.log(date); // Logs the original date input

    // Transform the date if it's valid
    if (date) {
      this.datefilter = this.datePipe.transform(
        new Date(date),
        'yyyy-MM-dd HH:mm:ss'
      );
    } else {
      this.datefilter = ''; // Reset the filter if no date is provided
    }

    console.log(this.datefilter); // Logs the transformed or reset date filter

    // Trigger the search with the updated date filter
    this.search();
  }

 

  getAppointmentData() {
    this.appointmentload = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAppointmentType(filter).subscribe((response: HttpResponse<any>) => {
        console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.appointmentList = responseBody.data || [];
        } else {
          this.appointmentList = [];
          this.message.error('Failed To Get Appointment Data', '');
        }
        this.appointmentload = false;
      });
  }
  commonFunction=new CommonFunctionService()
 lab_Id = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.lab_Id
    ? this.commonFunction.decryptdata(this.lab_Id)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);

  getLabData() {
    this.labload = true;
     var extraFilter=''
    if(this.labID){
       extraFilter=' AND ID='+this.labID
    }
    const filter = `AND IS_ACTIVE = 1` + extraFilter;
    this.api.getLabList(filter).subscribe((response: HttpResponse<any>) => {
        console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.labIdList = responseBody.data || [];
        } else {
          this.labIdList = [];
          this.message.error('Failed To Get Lab Data', '');
        }
        this.labload = false;
      });
  }
  

  // Triggered when a lab is selected
  onLabChange(labId: string): void {
  // this.techIdList = []; // Clear previous doctor list
  this.techId = null; // Clear selected doctor
  console.log(labId);
  
  if (labId) {
    this.getTechnicianData(labId); // Fetch new doctor list based on lab ID
  }
}

getTechnicianData(labId: string): void {
  this.doctorload = true;
  const filter = `AND LAB_ID = '${labId}'`; // Example filter
  this.api.getmapTechnician(labId).subscribe(
    (response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;
      if (statusCode === 200 && responseBody?.data) {
        this.techIdList = responseBody.data || [];
      } else {
        this.techIdList = [];
        this.message.error('Failed to get technician data', '');
      }
      this.doctorload = false;
    },
    (err: HttpErrorResponse) => {
      this.techIdList = [];
      this.message.error(
        err.status === 0 ? 'Network error: Check your connection.' : 'Server error',
        ''
      );
      this.doctorload = false;
    }
  );
}


  currentroute = '';

  keyup(event: any) {
    this.search(true);
  }

  onKeyPressEvent() {
    document.getElementById('search')!.focus();
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  // Appointment Filter
  onAppointmentFilter(): void {
    this.applyFilter();
  }

  // lab Filter
  onLabFilterChange(): void {
    this.search();
  }

  // Doctor Filter
  onTechnicianFilter(): void {
    this.search();
  }

  // Feedback Filter
  onFeedbackFilter(data): void {
    this.searchFeedback = data;
    this.search();
  }

  // Rating Filter
  onRatingFilter(): void {
    this.search();
  }

  // Date Range Filter
  onDateFilter(): void {
    this.search();
  }

  // Active Status Filter
  onActiveFilterChange(data): void {
    this.statusFilter = data;

    this.search();
  }

  // Updated Apply Filter Method
applyFilter(): void {
  this.loadingRecords = true;
  this.filterQuery = ''; // Reset filterQuery before applying new filters

  if (this.labId) {
    this.filterQuery += ` AND LAB_ID = '${this.labId}'`;
  }
console.log(this.labId)
console.log(this.filterQuery)
  if (this.techId) {
    this.filterQuery += ` AND TECHNICIAN_ID = '${this.techId}'`;
  }

  if (!this.filterQuery) {
    this.message.error('Please select a filter to apply', '');
    this.loadingRecords = false;
    return;
  }

  console.log(this.labId , this.techId);
  
  this.filterClass = 'filter-invisible';
  this.search(true); // Trigger the search with filters
  this.loadingRecords = false;
}
maxRating1 = 10; // Example max rating value (set this to your actual max rating)

getNormalizedRating(rating: number): number {
  const maxRating = 5; // Assuming RATINGS is already on a 5-star scale
  return Math.min(Math.max(rating, 0), maxRating); // Ensure value is between 0 and maxRating
}


  search(reset: boolean = false, exportInExcel: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    this.loadingRecords = true;
    const sort = this.sortValue?.startsWith('a') ? 'asc' : 'desc';
    let filterQuery = '';

    // Search Query for general text
    if (this.searchText) {
      filterQuery +=
        ' AND (' +
        this.columns
          .map((column) => `${column[0]} LIKE '%${this.searchText}%'`)
          .join(' OR ') +
        ')';
    }

    // lab Filter
    if (this.selectedLabs && this.selectedLabs.length > 0) {
      const labIds = this.selectedLabs
        .map((id) => `'${id}'`)
        .join(',');
      filterQuery += ` AND LAB_ID IN (${labIds})`;
    }
    if (this.labId) {
      filterQuery += ` AND LAB_ID = '${this.labId}'`;
    }
    // Doctor Filter
    if (this.techId && this.techId.length > 0) {
      const doctorIds = this.techId.map((id) => `'${id}'`).join(',');
      filterQuery += ` AND TECHNICIAN_ID IN (${doctorIds})`;
    }


    // Rating Filter
    if (this.minRating) {
      filterQuery += ` AND RATINGS >= ${this.minRating}`;
    }

    // Date Filter
    if (this.datefilter) {
      const formattedDate = this.datePipe.transform(
        this.datefilter,
        'yyyy-MM-dd'
      );
      filterQuery += ` AND DATE(DATE) = '${formattedDate}'`;
    }
    if (this.searchFeedback && this.searchFeedback.length > 0) {
      filterQuery += ` AND FEEDBACK_TYPE = '${this.searchFeedback}'`;
    }

    if (this.commenttext !== '') {
      filterQuery +=
       
        `AND COMMENTS LIKE '%${this.commenttext.trim()}%'`;
    }
    const finalQuery = filterQuery.trim() ? filterQuery.trim() : '';
     var extraFilter=''
    if(this.labID){
       extraFilter=' AND LAB_ID='+this.labID
    }
    if (!exportInExcel) {
      // API Call for Table Data
      this.api
        .getLabReview(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          finalQuery + extraFilter
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            this.loadingRecords = false;

            if (statusCode === 200 && responseBody?.data) {
              this.totalRecords = responseBody.count || 0;
              this.dataList = responseBody.data || [];
            } else {
              this.dataList = [];
              this.message.error('Something Went Wrong', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.message.error(
              err.status === 0
                ? 'Network error: Please check your internet connection.'
                : 'Server Not Found',
              ''
            );
          }
        );
    } else {
      this.api
        .getLabReview(0, 0, this.sortKey, sort, finalQuery)
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            console.log('Export API Response:', responseBody);

            this.exportLoading = false;
            this.loadingRecords = false;

            if (statusCode === 200 && responseBody?.data) {
              this.exportdataList = responseBody.data || [];
              console.log('Populated Export Data List:', this.exportdataList);
              this.convertInExcel();
            } else {
              this.exportdataList = [];
              this.message.error('Something Went Wrong', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.exportLoading = false;
            this.message.error(
              err.status === 0
                ? 'Network error: Please check your internet connection.'
                : 'Server Not Found',
              ''
            );
          }
        );
    }
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.exportdataList.length > 0) {
      for (var i = 0; i < this.exportdataList.length; i++) {
        obj1['Date'] = this.datePipe.transform(
          this.exportdataList[i]['DATE'],
          'dd/MM/yyyy'
        );

        // Map Feedback Type
        if (this.exportdataList[i]['FEEDBACK_TYPE'] === 'C') {
          obj1['Feedback Type'] = 'Complaint';
        } else if (this.exportdataList[i]['FEEDBACK_TYPE'] === 'R') {
          obj1['Feedback Type'] = 'Remarks';
        } else {
          obj1['Feedback Type'] = '-';
        }

        obj1['Lab Name'] = this.exportdataList[i]['LAB_NAME'];
        obj1['Technician Name'] = this.exportdataList[i]['TECHNICIAN_NAME'];
        // Map Ratings
        const maxRating = 5; // Example maximum rating value
        obj1['Ratings'] = this.getNormalizedRating(this.exportdataList[i]['RATINGS'])
        // Map Comments
        obj1['Comments'] =
          this.exportdataList[i]['COMMENTS'] &&
          this.exportdataList[i]['COMMENTS'] !== 'null'
            ? this.exportdataList[i]['COMMENTS']
            : '-';

        arry1.push(Object.assign({}, obj1));

        if (i === this.exportdataList.length - 1) {
          this.exportservice.exportExcel(
            arry1,
            'Lab Review Report ' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('No Data', '');
    }
  }

  importInExcel() {
    this.search(true, true);
  }
  reset(): void {
    this.searchText = '';
    this.commenttext = '';
    this.search();
  }
  clearFilter() {
    this.appointmentId = null;
    this.labId = null;
    this.techId = null;
    this.ratings = null;
    this.searchText = '';
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true); // Reset search results
  }

  handleError(isExport: boolean = false) {
    this.dataList = [];
    this.exportdataList = [];
    this.message.error('Something Went Wrong', '');
    this.loadingRecords = false;
    if (isExport) this.exportLoading = false;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
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

   back() {
    this.drawerService.openDrawer();
  }
}

