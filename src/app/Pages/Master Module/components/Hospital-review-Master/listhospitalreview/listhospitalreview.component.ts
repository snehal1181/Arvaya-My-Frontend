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
  selector: 'app-listhospitalreview',
  templateUrl: './listhospitalreview.component.html',
  styleUrls: ['./listhospitalreview.component.css'],
})
export class ListhospitalreviewComponent {
  formTitle = 'Hospital Review Report';
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
  public commonFunction = new CommonFunctionService();

  hospitalVisible: boolean = false;
  selectedHospitals: any[] = [];

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

  // Hospitals
  hospitalId: any;
  hospitalIdList: any[] = [];
  hospitalload: boolean = false;
  commentvisible: boolean = false;
  // Appointment Data
  appointmentId: any;
  appointmentload: boolean = false;
  appointmentList: any[] = [];
  dateFilter: any;
  // Doctor Data
  doctorId: any;
  doctorload: boolean = false;
  doctorIdList: any[] = [];
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
    ['HOSPITAL_NAME', 'Hospital Name'],
    ['DOCTOR_NAME', 'Doctor Name'],
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
    this.getHospitalData();
    // this.getAppointmentData();
    // this.getDoctorData();
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
    this.api
      .getAppointmentType(filter)
      .subscribe((response: HttpResponse<any>) => {
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

  getHospitalData() {
    this.hospitalload = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getHospitalType(filter)
      .subscribe((response: HttpResponse<any>) => {
        console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.hospitalIdList = responseBody.data || [];
        } else {
          this.hospitalIdList = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.hospitalload = false;
      });
  }
  // getDoctorData() {
  //   this.doctorload = true;
  //   const filter = ``;
  //   this.api.getDoctorType(filter).subscribe((response: HttpResponse<any>) => {
  //     console.log(response);
  //     const statusCode = response.status;
  //     const responseBody = response.body;

  //     if (statusCode === 200 && responseBody?.data) {
  //       this.doctorIdList = responseBody.data || [];
  //     } else {
  //       this.doctorIdList = [];
  //       this.message.error('Failed To Get Doctor Data', '');
  //     }
  //     this.doctorload = false;
  //   });
  // }

  // Triggered when a hospital is selected
onHospitalChange(hospitalId: string): void {
  // this.doctorIdList = []; // Clear previous doctor list
  this.doctorId = null; // Clear selected doctor
  console.log(hospitalId);
  
  if (hospitalId) {
    this.getDoctorData(hospitalId); // Fetch new doctor list based on hospital ID
  }
}

// Fetch doctor list based on selected hospital
getDoctorData(hospitalId: string): void {
  this.doctorload = true;
  // const filter = `AND HOSPITAL_ID = '${hospitalId}'`; // Example filter
  const filter = `AND USER_ID = '${hospitalId}'`; // Example filter
  this.api.getDoctorType(filter).subscribe(
    (response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;
      if (statusCode === 200 && responseBody?.data) {
        this.doctorIdList = responseBody.data || [];
      } else {
        this.doctorIdList = [];
        this.message.error('Failed to get doctor data', '');
      }
      this.doctorload = false;
    },
    (err: HttpErrorResponse) => {
      this.doctorIdList = [];
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
    // console.log('dfghjk');
  }

  // Appointment Filter
  onAppointmentFilter(): void {
    this.applyFilter();
  }

  // Hospital Filter
  onHospitalFilterChange(): void {
    this.search();
  }

  // Doctor Filter
  onDoctorFilter(): void {
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

  if (this.hospitalId) {
    this.filterQuery += ` AND HOSPITAL_ID = '${this.hospitalId}'`;
  }

  if (this.doctorId) {
    this.filterQuery += ` AND DOCTOR_ID = '${this.doctorId}'`;
  }

  if (!this.filterQuery) {
    this.message.error('Please select a filter to apply', '');
    this.loadingRecords = false;
    return;
  }

  console.log(this.hospitalId , this.doctorId);
  
  this.filterClass = 'filter-invisible';
  this.search(true); // Trigger the search with filters
  this.loadingRecords = false;
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

    // Hospital Filter
    if (this.selectedHospitals && this.selectedHospitals.length > 0) {
      const hospitalIds = this.selectedHospitals
        .map((id) => `'${id}'`)
        .join(',');
      filterQuery += ` AND HOSPITAL_ID IN (${hospitalIds})`;
    }

    // Doctor Filter
    if (this.doctorId && this.doctorId.length > 0) {
      const doctorIds = this.doctorId.map((id) => `'${id}'`).join(',');
      filterQuery += ` AND DOCTOR_ID IN (${doctorIds})`;
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

    
    let extraFilter=''
    let rawData=sessionStorage.getItem('userId')
    let userId=rawData?this.commonFunction.decryptdata(rawData):null
    if(userId && userId!='1'){
      extraFilter=" AND USER_ID="+userId
    }


    if (!exportInExcel) {
      // API Call for Table Data
      this.api
        .getHospitalReview(
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
        .getHospitalReview(0, 0, this.sortKey, sort, finalQuery + extraFilter)
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
        if (this.exportdataList[i]['FEEDBACK_TYPE'] === 'ON') {
          obj1['Feedback Type'] = 'Online';
        } else if (this.exportdataList[i]['FEEDBACK_TYPE'] === 'OF') {
          obj1['Feedback Type'] = 'Offline';
        } else {
          obj1['Feedback Type'] = '-';
        }

        obj1['Hospital Name'] = this.exportdataList[i]['HOSPITAL_NAME'];
        obj1['Doctor Name'] = this.exportdataList[i]['DOCTOR_NAME'];

        // Map Ratings
        const maxRating = 5; // Example maximum rating value
        obj1['Ratings'] = (
          (this.exportdataList[i]['RATINGS'] / this.maxRating) *
          maxRating
        ).toFixed(1);

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
            'Feedback Report ' +
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
    this.hospitalId = null;
    this.doctorId = null;
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
