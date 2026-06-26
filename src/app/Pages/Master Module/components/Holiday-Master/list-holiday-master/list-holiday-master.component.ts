import { Component, Output } from '@angular/core';
import { HolidayMaster } from '../../../Models/HolidayMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-list-holiday-master',
  templateUrl: './list-holiday-master.component.html',
  styleUrls: ['./list-holiday-master.component.css'],
})
export class ListHolidayMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HolidayMaster = new HolidayMaster();
  formTitle = 'Manage Holidays';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  Shortcodetext: string = '';
  ShortCodevisible = false;
  labData: any = [];
  labData1: any = [];
  tachnicianData: any = [];

  loadLabs: boolean = false;
  hospitalData: any = [];
  loadHospitals: boolean = false;
  public commonFunction = new CommonFunctionService();

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  // Define the array type
  columns1: { label: string; value: string }[] = [];

  visible = false;
  datevisible = false;
  enddatevisible = false;

  // Column Filter
  holidayname: string = '';
  datefilter: any = '';

  selectedhospitals: number[] = [];
  selectedlabs = [];
  selectedTechnicians = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  techVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['technician_name', 'Technician'],
    ['lab_name', 'Lab'],
    // ['NAME', 'Name'],
    ['name', 'Name'],
    ['start_date', 'Start Date'],
    ['end_date', 'End Date'],
    ['is_active', 'Status'],
  ];
  adminId: any;
  technicianData: any = [];
  loadTechnicians: boolean = false;

  techniciansHolidayMappedFilter = ''
  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    // this.getHospitalData();
    if (this.decreptedroleId == 3) {
      // this.radiovalue = 'L'
      // this.radiovalue = 'T'
      this.getmapTechnician();
      this.getLabData();
    }
    else {
      this.getLabData();
      this.getTechniciann();
    }

    // Populate the array based on decreptedroleId
    if (this.decreptedroleId === 1) {
      this.columns1 = [
        // { label: 'Hospital', value: 'HOSPITAL_ID' },
        { label: 'Lab', value: 'lab_id' },
        { label: 'Holiday', value: 'name' },
        // { label: 'Date', value: 'DATE' }, // Uncomment if needed
        { label: 'Status', value: 'is_active' },
      ];
    } else if (this.decreptedroleId === 2) {
      this.columns1 = [
        // { label: 'Hospital', value: 'HOSPITAL_ID' },
        { label: 'Holiday', value: 'name' },
        // { label: 'Date', value: 'DATE' }, // Uncomment if needed
        { label: 'Status', value: 'is_active' },
      ];
    } else if (this.decreptedroleId === 3) {
      this.columns1 = [
        { label: 'Lab', value: 'lab_id' },
        { label: 'Holiday', value: 'name' },
        // { label: 'Date', value: 'DATE' }, // Uncomment if needed
        { label: 'Status', value: 'is_active' },
      ];
    }
  }

  getTechniciann() {
    this.loadTechnicians = true;
    const filter = `AND is_active = 1`; // Modify the filter as per requirements
    this.api
      .getLabTechnicians(this.pageIndex, this.pageSize, this.sortKey, '', '')
      .subscribe((response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.technicianData = responseBody.data || [];
        } else {
          this.technicianData = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.loadTechnicians = false;
      });
  }

  preventDefault(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();
    event.stopPropagation(); // Stop the event from propagating further

    document.getElementById('search')?.focus();

    if (event['key'] != 'Enter') {
      this.search();
    }
  }

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private drawerService: DrawerService
  ) { }



  showcolumn = [
    { label: 'Technician', key: 'technician_name', visible: true },
    { label: 'Lab', key: 'lab_name', visible: true },
    { label: 'Name', key: 'name', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];
  getmapTechnician() {
    this.loadTechnicians = true;
    this.api
      .getmapTechnician(this.labID)
      .subscribe((response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.technicianData = responseBody.data || [];
        } else {
          this.technicianData = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.loadTechnicians = false;
      });
  }
  getmapTechnicianForFilter() {
    return this.api.getmapTechnician(this.labID).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200 && response.body?.data) {
          const technicianData = response.body.data || [];

          return [
            ...new Set(technicianData.map(data => data.TECHNICIAN_ID))
          ];
        }
        return [];
      })
    );
  }
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';

  labID = parseInt(this.decreptedlabIDDString, 10);
  getLabData() {
    // console.log(this.decreptedlabIDDString);

    this.loadLabs = true;
    var extraFilter = '';
    if (this.labID && this.decreptedroleId !== 1) {
      extraFilter = ' AND id=' + this.labID;
    }
    const filter = `AND is_active = 1` + extraFilter;
    this.api.getLabType(filter).subscribe((response: HttpResponse<any>) => {
      // console.log(response);

      const statusCode = response.status;
      const responseBody = response.body;

      if (statusCode === 200 && responseBody?.data) {
        this.labData = responseBody.data || [];
        this.labData1 = responseBody.data || [];

        // console.log(this.labData, 'Lab');
      } else {
        this.labData = [];
        this.message.error('Failed To Get Lab Data', '');
      }
      this.loadLabs = false;
    });
  }

  getHospitalData() {
    this.loadHospitals = true;
    const filter = `AND is_active = 1`; // Modify the filter as per requirements
    this.api
      .getHospitalType(filter)
      .subscribe((response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.hospitalData = responseBody.data || [];
        } else {
          this.hospitalData = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.loadHospitals = false;
      });
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
    this.holidayname = '';
    this.Shortcodetext = '';
    this.selectedlabs = [];
    this.selectedhospitals = [];
    this.search();
  }

  citykeyup() {
    if (this.holidayname.length >= 3) {
      this.search();
    } else if (this.holidayname.length === 0) {
      this.dataList = [];
      this.search();
    } else if (this.holidayname.length < 3) {
      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
  }

  datechange(date: any) {
    if (date) {
      this.datefilter = this.datePipe.transform(
        new Date(date),
        'yyyy-MM-dd HH:mm:ss'
      );
    } else {
      this.datefilter = '';
    }

    this.search();
  }

  OnHospitalChange(): void {
    this.search();
  }

  OnLabChange(): void {
    this.search();
  }

  onShortCodeChange() {
    // this.statusFilter = selectedStatus;
    this.search();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  selectedDateRange: Date[] | null = null;
  selectedDateRange1: Date[] | null = null;
  // datevisible = false;

  onDateFilterChange(): void {
    // Optional: live filtering logic here
  }

  resetDateFilter(): void {
    this.selectedDateRange = null;
    this.datevisible = false;
    // this.fetchTableData(); // replace with your actual data fetch
  }

  applyDateFilter(): void {
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const [start, end] = this.selectedDateRange;
      const formattedStart = this.datePipe.transform(start, 'yyyy-MM-dd');
      const formattedEnd = this.datePipe.transform(end, 'yyyy-MM-dd');

      const filter = `AND strat_date BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      // this.fetchTableData(filter); // call API with filter
    }
    this.datevisible = false;
    if (this.selectedDateRange1 && this.selectedDateRange1.length === 2) {
      const [start1, end1] = this.selectedDateRange1;
      const formattedStart = this.datePipe.transform(start1, 'yyyy-MM-dd');
      const formattedEnd = this.datePipe.transform(end1, 'yyyy-MM-dd');

      const filter = `AND end_date BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      // this.fetchTableData(filter); // call API with filter
    }
    this.enddatevisible = false;
  }

  selectedlabsStatus: boolean = false
  selectedTechniciansStatus: boolean = false
  holidaynameStatus: boolean = false
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
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }

    // Name Filter
    if (this.holidayname !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.holidayname.trim()}%'`;
      this.holidaynameStatus = true
    } else {
      this.holidaynameStatus = false
    }

    // Hospital Filter
    if (this.selectedhospitals.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `hospital_id IN (${this.selectedhospitals.join(',')})`; // Update with actual field name in the DB
    }

    // Lab Filter
    if (this.selectedlabs.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `lab_id IN (${this.selectedlabs.join(',')})`; // Update with actual field name in the DB

      this.selectedlabsStatus = true
    } else {
      this.selectedlabsStatus = false
    }

    // Lab Filter
    if (this.selectedTechnicians.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `technician_id IN (${this.selectedTechnicians.join(',')})`; // Update with actual field name in the DB

      this.selectedTechniciansStatus = true
    } else {
      this.selectedTechniciansStatus = false
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    // if (this.datefilter) {
    //   const formattedDate = this.datePipe.transform(
    //     this.datefilter,
    //     'yyyy-MM-dd'
    //   );
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `DATE(DATE) = '${formattedDate}'`;
    // }

    if (
      this.selectedJobCreatedDate &&
      this.selectedJobCreatedDate.length === 2 &&
      this.selectedJobCreatedDate[0] &&
      this.selectedJobCreatedDate[1]
    ) {
      const formattedDate1 = this.datePipe.transform(
        this.selectedJobCreatedDate[0],
        'yyyy-MM-dd HH:mm:ss'
      );
      const formattedDate2 = this.datePipe.transform(
        this.selectedJobCreatedDate[1],
        'yyyy-MM-dd HH:mm:ss'
      );

      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      likeQuery += `(strat_date BETWEEN '${formattedDate1}' AND '${formattedDate2}')`;
    }

    if (
      this.selectedJobCreatedDate1 &&
      this.selectedJobCreatedDate1.length === 2 &&
      this.selectedJobCreatedDate1[0] &&
      this.selectedJobCreatedDate1[1]
    ) {
      const formattedStartDate = this.datePipe.transform(
        this.selectedJobCreatedDate1[0],
        'yyyy-MM-dd HH:mm:ss'
      );
      const formattedEndDate = this.datePipe.transform(
        this.selectedJobCreatedDate1[1],
        'yyyy-MM-dd HH:mm:ss'
      );

      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      likeQuery += `(end_date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}')`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    var extraFilter = '';
    // console.log(this.mappedTechnicianIds)
    if (this.labID && this.decreptedroleId !== 1) {
      extraFilter = ' AND lab_id=' + this.labID;
    }
    if (this.decreptedroleId === 3) {
      this.getmapTechnicianForFilter().subscribe(ids => {
        var stringifyIds = ids.join(', ')
        extraFilter += " OR technician_id IN (" + stringifyIds + ")"
        this.api
          .getHoliday(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            likeQuery + extraFilter + this.filterQuery
          )
          .subscribe((response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            this.loadingRecords = false;

            if (statusCode === 200) {
              this.TabId = responseBody.TAB_ID;
              this.totalRecords = responseBody.count || 0;
              this.dataList = responseBody.data || [];
            } else {
              this.dataList = [];
              this.message.error('Failed to get Holiday data.', '');
            }
          });
      });

    }
    else {
      this.api
        .getHoliday(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + extraFilter + this.filterQuery
        )
        .subscribe((response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          this.loadingRecords = false;

          if (statusCode === 200) {
            this.TabId = responseBody.TAB_ID;
            this.totalRecords = responseBody.count || 0;
            this.dataList = responseBody.data || [];
          } else {
            this.dataList = [];
            this.message.error('Failed to get Holiday data.', '');
          }
        });
    }
    // Call API with updated search query

  }

  add(): void {
    this.drawerTitle = 'Create New Holiday';
    this.drawerData = new HolidayMaster();

    this.drawerVisible = true;
    this.labData = [];
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

  selectedJobCreatedDate: Date[] = []; // holds the range for form input
  selectedJobCreatedDate1: Date[] = []; // holds the range for form input

  onDateRangeChange() {
    if (
      this.selectedJobCreatedDate &&
      this.selectedJobCreatedDate.length === 2
    ) {
      const [start, end] = this.selectedJobCreatedDate;
      if (start && end) {
        this.search();
        // this.isJobCreatedDateFilterApplied = true;
      }
    } else {
      this.selectedJobCreatedDate = []; // or [] if you prefer
      this.search();
      // this.isJobCreatedDateFilterApplied = false;
    }

    if (
      this.selectedJobCreatedDate1 &&
      this.selectedJobCreatedDate1.length === 2
    ) {
      const [start, end] = this.selectedJobCreatedDate1;
      if (start && end) {
        this.search();
        // this.isJobCreatedDateFilterApplied = true;
      }
    } else {
      this.selectedJobCreatedDate1 = []; // or [] if you prefer
      this.search();
      // this.isJobCreatedDateFilterApplied = false;
    }
  }

  edit(data: HolidayMaster): void {
    this.drawerTitle = ' Update Holiday';
    this.drawerData = Object.assign({}, data);

    // Save previous start and end dates
    if (data.start_date && data.end_date) {
      this.drawerData.previous_start = data.start_date;
      this.drawerData.previous_end = data.end_date;
    }

    this.drawerVisible = true;
    // this.drawerVisible = true;
    // console.log(this.drawerData.START_DATE, 'START DATE')
    // console.log(this.drawerData.END_DATE, 'END DATE')
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
      this.loadFilters();
    }
  }

  TabId: number;
  // public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  // isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = '';
  // filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];
  loadFilters() {
    this.api
      .getFilterData1(
        0,
        0,
        '',
        '',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = '';
            // console.log(this.savedFilters, 'asdasdasd');
          } else {
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
  }

  openfilter() {
    this.drawerTitle = 'Holiday Filter';
    // console.log('this.propertyData open', this.propertyData);
    let labs = this.labData.map((data) => ({
      value: data.ID,
      display: data.NAME,
    }));
    let technicians = this.technicianData.map((data) => ({
      value: this.decreptedroleIdString != '3' ? data.ID : data.TECHNICIAN_ID,
      display: this.decreptedroleIdString != '3' ? data.NAME : data.LAB_TECHNICIAN_NAME,
    }));
    this.filterFields[0]['options'] = labs;
    this.filterFields[1]['options'] = technicians;
    // console.log(
    //   "this.filterFields[0]['options']",
    //   this.filterFields[0]['options']
    // );

    this.drawerFilterVisible = true;
  }

  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'lab_id',
      label: 'Lab',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select lab',
    },
    {
      key: 'technician_id',
      label: 'Technician',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Technician',
    },
    {
      key: 'name',
      label: 'Holiday',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Holiday',
    },
    {
      key: 'start_date',
      label: 'Start Date',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select start date',
    },
    {
      key: 'end_date',
      label: 'End Date',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select end date',
    },
    {
      key: 'is_active',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];
  isDeleting: boolean = false;

  deleteItem(item: any): void {
    this.isDeleting = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';

          this.loadFilters();
          this.filterQuery = '';
          this.search(true);
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  selectedFilter: string | null = null;
  // filterQuery = '';
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  isModalVisible = false;
  selectedQuery: string = '';

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  oldFilter: any[] = [];
  distinctData: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }

  back() {
    this.drawerService.openDrawer();
  }
}
