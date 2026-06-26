import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabBillMaster } from '../../../Models/LabBill';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';



@Component({
  selector: 'app-list-labbill',
  templateUrl: './list-labbill.component.html',
  styleUrls: ['./list-labbill.component.css']
})
export class ListLabbillComponent {
  drawerVisible!: boolean;
  drawerTestMapping: boolean = false;
  drawerTechnicianMapping: boolean = false;
  drawerTechnicianserviceMapping: boolean = false;
  drawerTitle!: string;
  drawerTitle1!: string;
  drawerTitle2!: string;
  drawerTitle3!: string;
  drawerData: LabBillMaster = new LabBillMaster();
  formTitle = "Manage Lab Bill's";
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  selectedDate: any;
  dateFormatMMM = 'dd/MM/yyyy';
  isSpinning = false;



  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Qualification Type', value: 'QUALIFICATION_TYPE_ID' },
    { label: 'Name', value: 'NAME' },
    { label: 'Status', value: 'IS_ACTIVE' },

  ];
  visible = false;

  // Column Filter
  citytext: string = '';
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  isFilterApplied: any = 'default';
  listOfFilter: any[] = [
    { text: 'Success', value: 'S' },
    { text: 'Pending', value: 'P' },
    { text: 'Fail', value: 'F' }
  ];

  filterQuery: string = '';
  filterQuery1: string = '';
  columns: string[][] = [['PAYMENT_DATE', 'Payment Date'], ['PAYMENT_INFO', 'Payment Information'], ['PAYMENT_STATUS', ' Payment Status']];
  adminId: any;

  PAYMENT: any


  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe ,
        private drawerService: DrawerService
    
  ) { }

    back() {
    this.drawerService.openDrawer();
  }
  public commonFunction=new CommonFunctionService()


  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.search();
  }


  showFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    }
    else { this.filterClass = 'filter-visible'; }

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

  showcolumn = [
    { label: 'Name', key: 'NAME', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true }
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
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

  reset(): void {
    this.searchText = '';
    this.citytext = ''
    this.search();
  }


  onCountryChange(): void {
    this.search();
  }

  onStateChange(): void {
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

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
    this.filterQuery1 = ""
    console.log(this.PAYMENT, 'PAYMENTPAYMENTPAYMENT');


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
    this.selectedDate = '';
    // this.API_TYPE_ID = 0;
    this.dataList = [];
    this.isfilterapply = false;
    this.searchText = '';
    this.PAYMENT = '';
    this.filterQuery1 = ""
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
      likeQuery += (likeQuery ? ' AND ' : '') + `PAYMENT_INFO LIKE '%${this.citytext.trim()}%'`;
    }

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_ID IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }

    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }

    // Status Filter
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


    
    let extraFilter =''
    let rawData=sessionStorage.getItem('userId')
    let userId=rawData?this.commonFunction.decryptdata(rawData):null
    if(userId && userId!='1'){
      // extraFilter=" AND USER_ID="+userId
    }

    this.api
      .getLabBillreport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + this.filterQuery1 + extraFilter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;

            console.log(this.dataList, 'this.dataListthis.dataList');

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
          }
          // else {
          //   this.message.error(
          //     `HTTP Error: ${err.status}. Something Went Wrong.`,
          //     ''
          //   );
          // }
        }
      );
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

}
