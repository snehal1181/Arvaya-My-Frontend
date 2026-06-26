import { Component } from '@angular/core';
import { HealthRecord } from '../../../Models/healthRecords';
import { DatePipe } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-healthrecordstable',
  templateUrl: './healthrecordstable.component.html',
  styleUrls: ['./healthrecordstable.component.css'],
})
export class HealthrecordstableComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HealthRecord = new HealthRecord();
  formTitle = 'Manage Patient Health Records';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Title', value: 'title' },
    { label: 'Lab Name', value: 'lab_name' },

    { label: 'Name', value: 'hospital_name' },
    { label: 'Date of Birth', value: 'creation_date' },
    // { label: 'Blood Group', value: 'blood_group' },
    // { label: 'Gender', value: 'gender' },
    // { label: 'Mobile Number', value: 'mobile_number' },
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
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  listOfGender: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['title', 'Title'],
    ['hospital_name', 'Name'],
    ['creation_date', 'Date of Birth'],
    ['report_date', 'Blood Group'],
    // ['gender', 'Gender'],
    // ['mobile_number', 'Mobile Number'],
    ['lab_name', 'Lab Name'],
  ];
  adminId: any;
  nameVisible: boolean;
  labnameVisible: boolean;
  hospitalIdVisible: boolean;
  patientNoVisible: boolean;
  dobVisible: boolean;
  bloodGroupVisible: boolean;
  genderVisible: boolean;
  mobileNumberVisible: boolean;
  patientNoText: string = '';
  nameText: string = '';
  LabText: string = '';
  dobText: any;
  genderList: any;
  mobileNumberText: any;
  usernameVisible = false;
  useNameText = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    // this.getLabData();
    // this.getStateData();
    this.getPatients();

  }

  getPatients() {
    this.api.getpatientdata(0, 0, 'id', 'desc', ' AND IS_ACTIVE=1').subscribe(
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
  showcolumn = [
    { label: 'Lab', key: 'lab_name', visible: true },
    { label: 'Title', key: 'title', visible: true },
    { label: 'Name', key: 'hospital_name', visible: true },
    { label: 'Date of Birth', key: 'creation_date', visible: true },
    { label: 'Blood Group', key: 'report_date', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Mobile Number', key: 'mobile_number', visible: true },
  ];

  labs: any;
  getLabData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getLabList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.labs = data.body['data'];
        } else {
          this.labs = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

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

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length === 0) {
      this.dataList = [];
      this.search();
    }
  }

  reset(): void {
    this.searchText = '';
    this.useNameText = '';
    this.LabText = '';
    this.patientNoText = '';
    this.nameText = ''
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
  normalizeTags(raw: any): string[] {
    try {
      // Handle deeply escaped strings
      while (typeof raw === 'string' && raw.includes('\\')) {
        raw = JSON.parse(raw);
      }

      // Final parse if it's still a stringified array
      if (typeof raw === 'string' && raw.startsWith('[')) {
        return JSON.parse(raw);
      }

      // If already array
      if (Array.isArray(raw)) {
        return raw;
      }
    } catch (e) {
      console.error('Failed to parse TAGS:', raw);
    }

    return [];
  }

  bloodlistt: any[] = [
    { text: 'A+', value: 'A+' },
    { text: 'A-', value: 'A-' },
    { text: 'B+', value: 'B+' },
    { text: 'B-', value: 'B-' },
    { text: 'AB+', value: 'AB+' },
    { text: 'AB-', value: 'AB-' },
    { text: 'O+', value: 'O+' },
    { text: 'O-', value: 'O-' },
  ];

  patientnameStatus: boolean = false;
  hospitalnameStatus: boolean = false;
  labnameStatus: boolean = false;
  titleStatus: boolean = false;
  onKeyup() {
    // Reset empty fields
    if (this.useNameText.length === 0) this.useNameText = '';
    if (this.nameText.length === 0) this.nameText = '';
    if (this.LabText.length === 0) this.LabText = '';
    if (this.patientNoText.length === 0) this.patientNoText = '';

    // Call search if any field has 3 or more characters
    if (this.useNameText.length >= 3) {
      this.search();
    } else if (this.nameText.length >= 3) {
      this.search();
    } else if (this.LabText.length >= 3) {
      this.search();
    } else if (this.patientNoText.length >= 3) {
      this.search();
    } else if (
      this.useNameText.length === 0 &&
      this.nameText.length === 0 &&
      this.LabText.length === 0 &&
      this.patientNoText.length === 0
    ) {
      this.search();
    }
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
    if (this.nameText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `hospital_name LIKE '%${this.nameText}%'`;

      this.hospitalnameStatus = true;
    } else {
      this.hospitalnameStatus = false;
    }

    // console.log(this.nameText);

    if (this.LabText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `lab_name LIKE '%${this.LabText}%'`; // Update with actual field name in the DB
      this.labnameStatus = true
    } else {
      this.labnameStatus = false
    }

    // if (this.dobDate) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `DATE = ${this.datePipe.transform(this.dobDate, "yyyy-MM-dd")}`;
    // }
    if (this.patientNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `title LIKE '%${this.patientNoText}%'`;
      this.titleStatus = true
    } else {
      this.titleStatus = false
    }

    if (this.useNameText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `user_name LIKE '%${this.useNameText}%'`;
      this.patientnameStatus = true;
    } else {
      this.patientnameStatus = false;
    }
    // if (this.LabText) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `LAB_NAME LIKE '%${this.LabText}%'`;
    // }
    // City Filter

    // Country Filter

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    let extraFilter = '';
    let rawData = sessionStorage.getItem('userId');
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null;
    if (userId && userId != '1') {
      extraFilter = ' AND user_id=' + userId;
    }

    // Call API with updated search query
    this.api
      .getMedicalrecords(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + this.filterQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          // console.log(response);

          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
            this.TabId = response.body.TAB_ID
            this.dataList.forEach((data) => {
              data.tags = this.normalizeTags(data.tags);
            });
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
    this.drawerTitle = 'Create New Health Record';
    this.drawerData = new HealthRecord();

    // this.api.getCity(1, 1, 'SEQ_NO', 'desc', '' + '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.drawerData.SEQ_NO = 1;

    //   } else {
    //     this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //   }

    // }, err => {
    //   console.log(err);
    // })

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

  edit(data: HealthRecord): void {
    this.drawerTitle = ' Update Health Record';
    // data.TAGS=JSON.parse(data.TAGS)
    this.drawerData = Object.assign({}, data);
    // console.log(this.drawerData);

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
      this.loadFilters()
    }
  }

  selectedFilter: string | null = null;

  TabId: number;
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

  Patients: any = [];

  openfilter() {
    this.drawerTitle = 'Healthrecords Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[0]['options'] = this.Patients.map((data) => ({
      value: data.ID,
      display: data.NAME,
    }));

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
      key: 'APP_USER_ID',
      label: 'Patient Name',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Patient Name',
    },

    {
      key: 'HOSPITAL_NAME',
      label: 'Hospital Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Hospital Name',
    },

    {
      key: 'LAB_NAME',
      label: 'Lab Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Lab Name',
    },

    {
      key: 'TITLE',
      label: 'Title',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Title',
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
