import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HospitalBillMaster } from '../../../Models/HospitalBillMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-listhospitalbill',
  templateUrl: './listhospitalbill.component.html',
  styleUrls: ['./listhospitalbill.component.css']
})
export class ListhospitalbillComponent {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HospitalBillMaster = new HospitalBillMaster();
  formTitle = "Manage Hospital Bill's";
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  filterQuery1: string = '';


  columns: string[][] = [
    ['PAYMENT_DATE', 'Payment Date'],
    ['APPOINTMENT_NAME', 'Appointment'],
    ['PAYMENT_INFO', 'Payment Info'],
    ['PAYMENT_STATUS', 'Payment Status'],

  ];

  adminId: any;

  // Column Filter

  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Success', value: 'S' },
    { text: 'Pending', value: 'P' },
    { text: 'Fail', value: 'F' }
  ];
  visible = false;
  showcloumnVisible: boolean = false;
  // Main filter

  showcolumn = [
    { label: 'Catalog', key: 'CATALOG_NAME', visible: true },
    { label: 'Appointment', key: 'APPOINTMENT_NAME', visible: true },
    { label: 'Payment Info', key: 'PAYMENT_INFO', visible: true },
    { label: 'Payment Status', key: 'PAYMENT_STATUS', visible: true },
  ];
  labIdOptions: any;
  modeOptions: any;
  typeOptions: any;
  packageIdOptions: any;
  testIdOptions: any;
  taxIdOptions: any;
  hospitalIdVisible: boolean;
  doctorIdVisible: boolean;
  consultationModeVisible: boolean;
  consultationTypeIdVisible: boolean;
  billAmountVisible: boolean;
  taxIdVisible: boolean;
  totalAmountVisible: boolean;
  selectedHospitalId: any;
  hospitalIdOptions: any;
  selectedDoctorId: any;
  doctorIdOptions: any;
  selectedConsultationMode: any;
  consultationModeOptions: any;
  selectedConsultationType: any;
  consultationTypeOptions: any;
  billAmountText: any;
  selectedTaxId: any;
  totalAmountText: any;
  selectedIsActive: any;
  isActiveOptions: any;
  catalogIdVisible: boolean;
  appointmentIdVisible: boolean;
  paymentInfoVisible: boolean;
  paymentStatusVisible: boolean;
  paymentDateVisible: boolean;
  selectedCatalogId: any;
  selectedAppointmentId: any;
  selectedPaymentInfo: any;
  paymentInfoOptions: any;
  selectedPaymentStatus: any;
  paymentStatusOptions: any;
  paymentDateText: any;
  Nametext: string = '';
  appointment: string = '';

  selectedDate: any;
  dateFormatMMM = 'dd/MM/yyyy';
  PAYMENT: any
  isSpinning = false;


  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Catalog', value: 'CATALOG_NAME' },
    { label: 'Appointment', value: 'APPOINTMENT_NAME' },
    { label: 'Payment Info', value: 'PAYMENT_INFO' },
    { label: 'Payment Status', value: 'PAYMENT_STATUS' },
    { label: 'Status', value: 'IS_ACTIVE' },

  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    // this.getCountyData();
  }

  countryData: any = [];
  stateData: any = [];
  districtData: any = [];
  pincodeData: any = [];
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

  onCatlogChange(): void {
    this.search();
  }

  onAppointmemntChange(): void {
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length === 0) {
      this.dataList = [];
      this.search();
    } else if (this.searchText.length < 3) {
      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
  }



  catalogIdOptions: any = []

  getcatalogs(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAppointmentDropdown(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.catalogIdOptions = response.body.data;
          } else {
            this.catalogIdOptions = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }


  appointmentIdOptions: any = []
  getAppointment(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAppointmentDropdown(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.appointmentIdOptions = response.body.data;
          } else {
            this.appointmentIdOptions = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }


  disabledDate = (current: Date): boolean => {
    // Disable dates before today and more than one month ago
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Convert dates to midnight for accurate comparison
    const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    today.setHours(0, 0, 0, 0);
    oneMonthAgo.setHours(0, 0, 0, 0);

    return currentDate > today;
  };

  showFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    }
    else { this.filterClass = 'filter-visible'; }

  }



  mobileNoText = '';
  genderText = '';
  dobText = '';
  aboutText = '';
  experienceText = '';
  registrationNumberText = '';
  addressLine1Text: string = '';
  addressLine2Text: string = '';
  citytext: string = '';
  selecteCatlogs: number[] = [];
  selectedStates: number[] = [];

  isFilterApplied: any = 'default';

  formattedStartDate: any;
  formattedEndDate: any;
  dateRangeQuery: any;



  formatDatabaseDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }


  formatDatabaseDate1(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd 23:59:59') || '';
  }



  applyFilter() {
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;

    this.filterQuery1 = ''
    // console.log(this.PAYMENT, 'PAYMENTPAYMENTPAYMENT');


    // Check if a date range is selected
    if (this.selectedDate && this.selectedDate.length === 2) {
      const startDate = this.selectedDate[0];
      const endDate = this.selectedDate[1];

      // Format dates
      this.formattedStartDate = this.formatDatabaseDate(startDate);
      this.formattedEndDate = this.formatDatabaseDate1(endDate);

      // Construct date range filter
      this.dateRangeQuery = `AND PAYMENT_DATE BETWEEN '${this.formattedStartDate}' AND '${this.formattedEndDate}'`;

      if (this.dateRangeQuery != null && this.dateRangeQuery !== '') {
        this.filterQuery = this.dateRangeQuery;
      }
    }

    // Add search text to the filter if present
    if (this.searchText !== '') {
      const likeQuery = this.columns.map(column => `${column[0]} like '%${this.searchText}%'`).join(' OR ');
      this.filterQuery += this.filterQuery ? ` AND (${likeQuery})` : likeQuery;
    }

    // Perform the search
    this.search();
    this.filterClass = 'filter-invisible';
  }


  clearFilter() {
    this.filterClass = 'filter-invisible';


    this.filterQuery = '';
    this.filterQuery1 = '';
    this.selectedDate = '';
    // this.API_TYPE_ID = 0;
    this.dataList = [];
    this.isfilterapply = false;
    this.searchText = '';
    this.PAYMENT = '';
    this.selectedDate = '';

    this.search(true);;

  }




  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    let likeQuery = '';
    let globalSearchQuery = '';

    // Global Search (using searchText)
    if (this.searchText !== '') {
      globalSearchQuery = ' AND (' + this.columns.map((column) => {
        return `${column[0]} like '%${this.searchText}%'`;
      }).join(' OR ') + ')';
    }

    // City Filter
    if (this.citytext !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.citytext.trim()}%'`;
    }
    // Country Filter
    if (this.selecteCatlogs.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_ID IN (${this.selecteCatlogs.join(',')})`; // Update with actual field name in the DB
    }
    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }

    if (this.Nametext !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `PAYMENT_INFO LIKE '%${this.Nametext.trim()}%'`;
    }

    if (this.appointment !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `APPOINTMENT_NAME LIKE '%${this.appointment.trim()}%'`;
    }

    // Status Filter
    // if (this.statusFilter) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    // }

    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PAYMENT_STATUS ='${this.statusFilter}'`;
    }


    if (
      this.PAYMENT != null &&
      this.PAYMENT != undefined &&
      this.PAYMENT != ''
    ) {
      // this.filterQuery += ' AND STORAGE_TYPE_ID = ' + this.STORAGE_TYPE_ID_FILTER;
      this.filterQuery1 += " AND PAYMENT_STATUS = '" + this.PAYMENT + "'";
    }


    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getHospitalBill(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.filterQuery1)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
          } else {
            this.dataList = [];
            this.message.error(`Something went wrong.`, '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
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

  reset(): void {
    this.searchText = '';
    this.Nametext = '';
    this.appointment = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Hospital bill';
    this.drawerData = new HospitalBillMaster();

    this.api.getHospitalBill(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        console.log(responseBody);

        if (statusCode === 200) {
          if (responseBody.count === 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = responseBody.data[0]?.SEQ_NO + 1 || 1; // Ensure fallback if data is malformed
          }
        } else {
          console.error('Failed to get valid data:', responseBody);
        }
      },
      (err: HttpErrorResponse) => {
        // console.error('Error occurred while fetching state data:', err);
        this.message.error('Something Went Wrong.', '');
      }
    );

    this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    //

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

  edit(data: HospitalBillMaster): void {
    this.drawerTitle = ' Update Hospital bill';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // Main Filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }


}
