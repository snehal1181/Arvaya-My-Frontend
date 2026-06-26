import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabPatient } from '../../../Models/LabPatient';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-lab-patient-master',
  templateUrl: './lab-patient-master.component.html',
  styleUrls: ['./lab-patient-master.component.css'],
})
export class LabPatientMasterComponent {
  dobDate: any;
  bloodGroupList: any;
  isSavePatient = true;
  selectedStrength: any;
  strengthList: any;

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: LabPatient = new LabPatient();
  formTitle = "Manage Lab Patient's";
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
    { label: 'Patient No', value: 'patient_no' },
    { label: 'Lab Name', value: 'lab_name' },

    { label: 'Name', value: 'name' },
    { label: 'Date of Birth', value: 'dob' },
    { label: 'Blood Group', value: 'blood_group' },
    { label: 'Gender', value: 'gender' },
    { label: 'Mobile Number', value: 'mobile_number' },
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
    ['patient_no', 'Patient No'],
    ['name', 'Name'],
    ['dob', 'Date of Birth'],
    ['blood_group', 'Blood Group'],
    ['gender', 'Gender'],
    ['mobile_number', 'Mobile Number'],
    ['lab_name', 'Lab Name'],
  ];
  adminId: any;
  nameVisible: boolean;
  labnameVisible: boolean;
  hospitalIdVisible: boolean;
  typeIdVisible: boolean;
  strengthVisible: boolean;
  strengthUnitVisible: boolean;
  dosageVisible: boolean;
  instructionsVisible: boolean;
  statusVisible: boolean;
  seqNoVisible: boolean;

  selectedHospitalId: any;
  hospitalList: any;
  selectedTypeId: any;
  typeList: any;
  selectedStatus: any;
  statusList: any;
  selectedStrengthUnit: any;
  strengthUnitList: any;
  dosageText: any;
  instructionsText: any;
  seqNoText: any;
  patientNoVisible: boolean;
  dobVisible: boolean;
  bloodGroupVisible: boolean;
  genderVisible: boolean;
  mobileNumberVisible: boolean;
  patientNoText: any;
  nameText: any;
  LabText: number[] = [];
  dobText: any;
  bloodGroupText: any;
  selectedGender: any;
  genderList: any;
  mobileNumberText: any;
  showdata = false;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router,
    private drawerService: DrawerService
  ) {}

  back() {
    this.drawerService.openDrawer();
  }

  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getLabData();
    // this.getStateData();
  }

  showcolumn = [
    { label: 'Lab', key: 'lab_name', visible: true },

    { label: 'Patient No', key: 'patient_no', visible: true },
    { label: 'Name', key: 'name', visible: true },
    { label: 'Date of Birth', key: 'dob', visible: true },
    { label: 'Blood Group', key: 'blood_group', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Mobile Number', key: 'mobile_number', visible: true },
  ];

  labs: any;
  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  getLabData() {
    var extraFilter = '';
    var extraFilter2 = '';
    if (this.labID && this.decreptedroleId !== 1) {
      extraFilter = ' AND id=' + this.labID;
      extraFilter2 = ' AND lab_id=' + this.labID;
    }

    const filter = `AND is_active = 1` + extraFilter;
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
    this.citytext = '';
    this.patientNoText = '';
    this.nameText = '';
    this.mobileNumberText = '';
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
      likeQuery += `name LIKE = '${this.nameText}'`;
    }
    if (this.LabText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `lab_id IN (${this.LabText.join(',')})`; // Update with actual field name in the DB
    }

    if (this.dobDate) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `dob = '${this.datePipe.transform(
        this.dobDate,
        'yyyy-MM-dd'
      )}'`;
    }
    if (this.patientNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `patient_no = '${this.patientNoText}'`;
    }

    if (this.selectedGender) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `gender LIKE = '${this.selectedGender}'`;
    }
    // City Filter

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }

    if (this.bloodGroupText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `blood_group LIKE '${this.bloodGroupText.join(',')}'`; // Update with actual field name in the DB
    }
    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    if (this.mobileNumberText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `mobile_number  = '${this.mobileNumberText}'`;
    }
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
      extraFilter = ' AND lab_id=' + this.labID;
    }

    // Call API with updated search query
    this.api
      .getLabPatient(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = Number(response.body.total_count);
            this.dataList = response.body.data;
            this.TabId = response.body.tab_id;
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
    this.drawerTitle = 'Create New Lab Patient';
    this.drawerData = new LabPatient();
    this.drawerVisible = true;
  }

  edit(data: LabPatient): void {
    this.drawerTitle = 'Update Lab Patient';
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
        ` AND tab_id = ${this.TabId} AND user_id = ${this.USER_ID}`
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
    this.drawerTitle = 'Lab Patient Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[1]['options'] = this.labs.map((data) => ({
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
      key: 'patient_no',
      label: 'Patient No',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],

      placeholder: 'Enter Patient No',
    },

    {
      key: 'lab_id',
      label: 'Lab',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Lab',
    },

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
      key: 'dob',
      label: 'DOB',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select DOB',
    },
    {
      key: 'blood_group',
      label: 'Blood Group',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'A+', display: 'A+' },
        { value: 'A-', display: 'A-' },
        { value: 'B+', display: 'B+' },
        { value: 'B-', display: 'B-' },
        { value: 'AB+', display: 'AB+' },
        { value: 'AB-', display: 'AB-' },
        { value: 'O+', display: 'O+' },
        { value: 'O-', display: 'O-' },
      ],
      placeholder: 'Select Blood Group',
    },

    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'F', display: 'Female' },
        { value: 'M', display: 'Male' },
        { value: 'O', display: 'Other' },
      ],
      placeholder: 'Select Gender',
    },

    {
      key: 'mobile_number',
      label: 'Mobile No',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Mobile No',
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
