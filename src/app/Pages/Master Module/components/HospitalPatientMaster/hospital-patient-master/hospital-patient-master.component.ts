import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalPatient } from '../../../Models/HospitalPatient';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-hospital-patient-master',
  templateUrl: './hospital-patient-master.component.html',
  styleUrls: ['./hospital-patient-master.component.css'],
})
export class HospitalPatientMasterComponent {
  public commonFunction = new CommonFunctionService();
  dobDate: any;
  bloodGroupList: any;
  searchPatientNo() { }
  resetPatientNo() { }
  searchName() { }
  searchLab() { }
  resetName() { }
  searchDob() { }
  resetDob() { }
  searchBloodGroup() { }
  resetBloodGroup() { }
  searchMobileNumber() { }
  resetMobileNumber() { }
  selectedStrength: any;
  strengthList: any;

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HospitalPatient = new HospitalPatient();
  formTitle = "Manage Hospital Patient's";
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
    { label: 'Patient No', value: 'PATIENT_NO' },
    { label: 'Hospital Name', value: 'HOSPITAL_NAME' },

    { label: 'Name', value: 'NAME' },
    { label: 'Date of Birth', value: 'DOB' },
    { label: 'Blood Group', value: 'BLOOD_GROUP' },
    { label: 'Gender', value: 'GENDER' },
    { label: 'Mobile Number', value: 'MOBILE_NUMBER' },
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
    ['PATIENT_NO', 'Patient No'],
    ['NAME', 'Name'],
    ['DOB', 'Date of Birth'],
    ['BLOOD_GROUP', 'Blood Group'],
    ['GENDER', 'Gender'],
    ['MOBILE_NUMBER', 'Mobile Number'],
    ['HOSPITAL_NAME', 'Hospital Name'],

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

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,

  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getHospitalData();
    // this.getStateData();
  }

  showcolumn = [
    { label: 'Hospital', key: 'HOSPITAL_NAME', visible: true },

    { label: 'Patient No', key: 'PATIENT_NO', visible: true },
    { label: 'Name', key: 'NAME', visible: true },
    { label: 'Date of Birth', key: 'DOB', visible: true },
    { label: 'Blood Group', key: 'BLOOD_GROUP', visible: true },
    { label: 'Gender', key: 'GENDER', visible: true },
    { label: 'Mobile Number', key: 'MOBILE_NUMBER', visible: true },
  ];

  entityData: any = [];
  getHospitalData() {
    let filter1 = '';
    if (this.roleID == 2) {
      filter1 = ` AND user_id = ` + this.USER_ID;
    }
    const filter = `AND is_active = 1` + filter1;
    this.api.getHospitalList(filter).subscribe(
      (data: HttpResponse<any>) => {
        console.log('entityData', data)
        if (data['status'] == 200) {
          this.entityData = data.body['data'];
          if (this.roleID == 2) {
            this.search();
          }
        } else {
          this.entityData = [];
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
  searchDosage() {
    // throw new Error('Method not implemented.');
  }
  resetDosage() {
    // throw new Error('Method not implemented.');
  }
  searchInstructions() {
    // throw new Error('Method not implemented.');
  }
  resetInstructions() {
    // throw new Error('Method not implemented.');
  }
  searchSeqNo() {
    // throw new Error('Method not implemented.');
  }
  resetSeqNo() {
    // throw new Error('Method not implemented.');
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
    { text: "A+", value: "A+" },
    { text: "A-", value: "A-" },
    { text: "B+", value: "B+" },
    { text: "B-", value: "B-" },
    { text: "AB+", value: "AB+" },
    { text: "AB-", value: "AB-" },
    { text: "O+", value: "O+" },
    { text: "O-", value: "O-" },

  ]
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
      likeQuery += `NAME LIKE = '${this.nameText}'`;
    }
    if (this.LabText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `HOSPITAL_ID IN (${this.LabText.join(',')})`; // Update with actual field name in the DB
    }

    if (this.dobDate) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DATE = '${this.datePipe.transform(this.dobDate, "yyyy-MM-dd")}'`;
    }
    if (this.patientNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PATIENT_NO = '${this.patientNoText}'`;
    }

    if (this.selectedGender) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `GENDER LIKE = '${this.selectedGender}'`;
    }
    // City Filter

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_ID IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }

    if (this.bloodGroupText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `BLOOD_GROUP LIKE '${this.bloodGroupText.join(',')}'`; // Update with actual field name in the DB
    }
    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    //  if (this.mobileNumberText) {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `MOBILE_NUMBER LIKE '%${this.mobileNumberText}%'`;
    // }

    if (this.mobileNumberText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `MOBILE_NUMBER = '${this.mobileNumberText}'`;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    let extraFilter = '';
    if (this.roleID == 2) {
      extraFilter = ' AND hospital_id =' + this.entityData[0].id
    }
    // if (this.roleId == 1) {
    //   extraFilter = ' AND ID = ' + this.data.hospital_id;
    // }
    // Call API with updated search query
    this.api.getHospitalPatient(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery + extraFilter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.TabId = response.body.TAB_ID || response.body.tab_id;
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
    this.drawerTitle = 'Create New Hospital Patient';
    this.drawerData = new HospitalPatient();

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

  edit(data: HospitalPatient): void {
    this.drawerTitle = ' Update Hospital Patient';
    this.drawerData = Object.assign({}, data);
    console.log(this.drawerData);

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
  selectedFilter: string | null = null;
  TabId!: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  roleID = parseInt(this.decreptedroleIdString, 10);

  drawerFilterVisible: boolean = false;
  savedFilters: any[] = [];
  isDeleting: boolean = false;
  oldFilter: any[] = [];
  distinctData: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  loadFilters() {
    this.api
      .getFilterData1(
        0,
        0,
        '',
        '',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      )
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = '';
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
    this.drawerTitle = 'Hospital Patient Filter';
    this.filterFields[1]['options'] = this.entityData.map((data: any) => ({
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
      key: 'PATIENT_NO',
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
      key: 'HOSPITAL_ID',
      label: 'Hospital',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Hospital',
    },
    {
      key: 'NAME',
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
      key: 'DOB',
      label: 'DOB',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select DOB',
    },
    {
      key: 'BLOOD_GROUP',
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
      key: 'GENDER',
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
      key: 'MOBILE_NUMBER',
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

  applyfilter(item: any) {
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

  onFilterApplied(obj: any) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
}