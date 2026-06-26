import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { patientmaster } from '../../../Models/patient';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-patientmasterlist',
  templateUrl: './patientmasterlist.component.html',
  styleUrls: ['./patientmasterlist.component.css'],
})
export class PatientmasterlistComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  // drawerData: CityMaster = new CityMaster();
  drawerData: any;
  formTitle = 'Manage App Users';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';

  // Main filter
  operators: string[] = ['AND', 'OR'];
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;

  public visiblesave = false;
  filterQuery1: any = '';
  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Email Id', value: 'email' },
    { label: 'Mobile No.', value: 'mobile_number' },
    { label: 'Adhar Card', value: 'adhar_card' },
    { label: 'Abha No.', value: 'abha_number' },
    { label: 'Abha Type', value: 'abha_type' },
    { label: 'Abha Status', value: 'abha_status' },
    { label: 'Date Of Birth', value: 'date_of_birth' },
    { label: 'Gender', value: 'gender' },
    { label: 'Blood Group', value: 'blood_group' },
    { label: 'Profile', value: 'profile_image' },
    { label: 'Status', value: 'is_active' },
  ];
  columns23333: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Email Id', value: 'email' },
    { label: 'Mobile No.', value: 'mobile_number' },
    { label: 'Adhar Card', value: 'adhar_card' },
    { label: 'Abha No.', value: 'abha_number' },
    { label: 'Date Of Birth', value: 'date_of_birth' },
    { label: 'Gender', value: 'gender' },
    { label: 'Blood Group', value: 'blood_group' },
  ];
  visible = false;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;

  // Column Filter
  citytext: string = '';
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  statusFilter: string | undefined = '';
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfgenderFilter: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
  ];
  listOfBloodGroups: any[] = [
    { text: 'A+', value: 'A+' },
    { text: 'A-', value: 'A-' },
    { text: 'B+', value: 'B+' },
    { text: 'B-', value: 'B-' },
    { text: 'AB+', value: 'AB+' },
    { text: 'AB-', value: 'AB-' },
    { text: 'O+', value: 'O+' },
    { text: 'O-', value: 'O-' },
  ];
  selectedDate: any;
  filterQuery: string = '';
  columns: string[][] = [
    ['name', 'Name'],
    ['email', 'Email Id'],
    ['mobile_number', 'Mobile No.'],
    ['adhar_card', 'Adhar Card'],
    ['abha_number', 'Abha No.'],
    ['abha_type', 'Abha Type'],
    ['abha_status', 'Abha Status'],
    ['date_of_birth', 'Date Of Birth'],
    ['is_active', 'Status'],
  ];
  adminId: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
  }

  showcolumn = [
    { label: 'Name', key: 'name', visible: true },
    { label: 'Email Id', key: 'email', visible: true },
    { label: 'Mobile No.', key: 'mobile_number', visible: true },
    { label: 'Adhar Card', key: 'adhar_card', visible: true },
    { label: 'Abha No.', key: 'abha_number', visible: true },
    { label: 'Abha Type', key: 'abha_type', visible: true },
    { label: 'Abha Status', key: 'abha_status', visible: true },
    { label: 'Date Of Birth', key: 'date_of_birth', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Blood Group', key: 'blood_group', visible: true },
    { label: 'Profile', key: 'profile_image', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
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
  getStateData() {
    this.api.getState(0, 0, '', '', 'AND IS_ACTIVE = 1').subscribe(
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
    // this.searchText = '';
    this.nametext = '';
    this.search();
  }
  resetemail(): void {
    // this.searchText = '';
    this.nametext = '';
    this.search();
  }
  resetmobile(): void {
    // this.searchText = '';
    this.mobiletext = '';
    this.search();
  }
  resetadhar(): void {
    // this.searchText = '';
    this.adhartext = '';
    this.search();
  }
  resetabhano(): void {
    // this.searchText = '';
    this.abhanotext = '';
    this.search();
  }

  onCountryChange(): void {
    this.search();
  }

  onStateChange(): void {
    this.search();
  }

  abhastatus: any = '';
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onStatusFilterChange11(selectedStatus: string) {
    this.abhastatus = selectedStatus;
    this.search(true);
  }
  dateofborthtext: any = [];
  abhastatusfilter: any = '';
  genderstatusfilter: any = '';
  ongenderfilter(selectedStatus: string) {
    this.genderstatusfilter = selectedStatus;
    this.search(true);
  }
  bloodgroupstatusfilter: any = '';
  onbloodgroupfilter(selectedStatus: string) {
    this.bloodgroupstatusfilter = selectedStatus;
    this.search(true);
  }
  visible88: boolean = false;
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

    // City Filter
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.nametext.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `email LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `mobile_number LIKE '%${this.mobiletext.trim()}%'`;
    }
    if (this.adhartext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `adhar_card LIKE '%${this.adhartext.trim()}%'`;
    }
    if (this.abhanotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `abha_number LIKE '%${this.abhanotext.trim()}%'`;
    }
    if (this.abhatypetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `abha_type LIKE '%${this.abhatypetext.trim()}%'`;
    }

    if (this.statusFilter !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `is_active = '${this.statusFilter}'`;
    }
    if (this.bloodgroupstatusfilter !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `blood_group in '(${this.bloodgroupstatusfilter})'`;
    }
    if (this.genderstatusfilter !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `gender = '${this.gendertext.trim()}'`;
    }
    if (this.abhastatus !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `abha_status = '${this.abhastatus.trim()}'`;
    }
    if (this.dateofborthtext.length == 2) {
      this.dateofborthtext[0] = this.datePipe.transform(
        this.dateofborthtext[0],
        'yyyy-MM-dd'
      );
      this.dateofborthtext[1] = this.datePipe.transform(
        this.dateofborthtext[1],
        'yyyy-MM-dd'
      );
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `date_of_birth BETWEEN = '${this.dateofborthtext[0]} AND ${this.dateofborthtext[1]}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getpatientdata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.TabId = response.body.TAB_ID
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

  add(): void {
    this.drawerTitle = 'Create New App User';
    this.drawerData = new patientmaster();

    this.api.getpatientdata(1, 1, 'id', 'desc', '' + '').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body['count'] == 0) {
          this.drawerData.total_count = 1;
        } else {
          this.drawerData.total_count = res.body['data'][0]['total_count'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.drawerVisible = true;
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

  edit(data: any): void {
    this.drawerTitle = 'Update App User';
    this.drawerData = Object.assign({}, data);
    console.log(this.drawerData);

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  addressdrawerVisible: boolean = false;
  addressdrawerClose(): void {
    this.search();
    this.addressdrawerVisible = false;
  }
  familydrawerVisible: boolean = false;
  familydrawerClose(): void {
    this.search();
    this.familydrawerVisible = false;
  }
  addressdrawerTitle: string = 'Address Details';
  //Drawer Methods
  get familycloseCallback() {
    return this.familydrawerClose.bind(this);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get addresscloseCallback() {
    return this.addressdrawerClose.bind(this);
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
  public commonFunction = new CommonFunctionService();
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
    this.drawerTitle = 'App User Filter';
    // console.log('this.propertyData open', this.propertyData);

    // this.filterFields[0]['options'] = this.propertyData;
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
      key: 'name',
      label: 'Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Name',
    },
    {
      key: 'email',
      label: 'Email Id',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Email Id',
    },
    {
      key: 'mobile_number',
      label: 'Mobile Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Mobile Number',
    },
    {
      key: 'date_of_birth',
      label: 'Birth date',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select birth date',
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
  gendertext: any = '';
  abhatypetext: any = '';
  abhanotext: any = '';
  adhartext: any = '';
  mobiletext: any = '';
  emailtext: any = '';
  nametext: any = '';

  addressdata: any = [];
  familydata: any = [];
  openaddress(event: any) {
    this.addressdrawerVisible = true;
    this.addressdrawerTitle = 'Address Details of ' + event.name;
    this.patientId = event.id;
  }
  familydrawerTitle: any = '';
  patientId;
  openfamily(event: any) {
    this.familydrawerVisible = true;
    this.familydrawerTitle = 'Family Details of ' + event.name;
    this.patientId = event.id;
  }

  filterdateeeeee(event: any) {
    // console.log('event', event);
    if (event.lenght == 2) {
      this.search();
    }
  }

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
}
