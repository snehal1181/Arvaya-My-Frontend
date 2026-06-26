import { ChangeDetectorRef, Component } from '@angular/core';
import { DoctorMaster } from '../../../Models/DoctorMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DomSanitizer } from '@angular/platform-browser';

interface SessionConfig {
  DAY_OF_WEEK: string;
  SESSION_NAME: string;
  IS_ACTIVE: boolean;
  START_TIME: any;
  HOSPITAL_ID: any;
  DOCTOR_ID: any;
  END_TIME: any;
  MODE: string;
  TYPE_ID: any;
  SLOT_DURATION: number | null;
  ID: any;
}
interface SessionConfig {
  DAY_OF_WEEK: string;
  SESSION_NAME: string;
  MORNING_ACTIVE?: boolean;
  MORNING_START_TIME?: string;
  MORNING_END_TIME?: string;
  MORNING_MODE?: string;
  MORNING_MODETYPE_ID?: number;
  MORNING_SLOT_DURATION?: number;
  EVENING_ACTIVE?: boolean;
  EVENING_START_TIME?: string;
  EVENING_END_TIME?: string;
  EVENING_MODE?: string;
  EVENING_MODETYPE_ID?: number;
  EVENING_SLOT_DURATION?: number;
}

interface DoctorAvailabilityConfig {
  [day: string]: SessionConfig[];
}

@Component({
  selector: 'app-list-doctor-data',
  templateUrl: './list-doctor-data.component.html',
  styleUrls: ['./list-doctor-data.component.css'],
})
export class ListDoctorDataComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  formTitle = 'Manage Doctors';
  searchText: string = '';
  sessionValue: any = sessionStorage.getItem('userId');

  searchText2: string = '';
  public commonFunction = new CommonFunctionService();
  drawerData: DoctorMaster = new DoctorMaster();
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Doctor: any[] = [];
  showcloumnVisible: boolean = false;
  drawerCountryMappingVisible = false;
  drawerTitle = 'Add New Doctor';
  drawervisible = false;
  //For Input
  countrytext: any = [];
  Doctorvisible = false;
  MobileNoVisible = false;
  EmailVisible = false;
  Shortcodetext: string = '';
  ShortCodevisible = false;
  registrationText: string = '';
  countryText: any = [];
  stateText: any = [];
  districtText: any = [];
  pincodeText: string = '';
  registrationMenu: any;
  RegistrationNumberVisible: any;
  StateNameVisible: any;
  CountryNameVisible: any;
  DistrictNameVisible: any;
  PincodeVisible: any;
  disableFutureYears = (current: Date): boolean => {
    return current && current > new Date();
  };
  preventDefault(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();
    event.stopPropagation(); // Stop the event from propagating further

    document.getElementById('search')?.focus();

    if (event['key'] != 'Enter') {
      this.search();
    }
  }

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  dataList: any = [];
  visible = false;
  filterQuery: string = '';
  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';

  ngOnInit() {
    this.getCountry();
    this.getStates();
    this.getDistricts();
    this.getPincode();
    this.onConsultationMode();
  }

  columns: [string, string][] = [
    ['name', 'name'],
    ['email_id', 'email_id'],
    ['mobile_number', 'mobile_number'],
    ['address_line_1', 'address_line_1'],
    ['address_line_2', 'address_line_2'],
    ['state_id', 'state_id'],
    ['district_id', 'district_id'],
    ['pincode_number', 'pincode_number'],
    ['gender', 'gender'],
    ['about', 'about'],
    ['identity_doc', 'identity_doc'],
    ['profile_image', 'profile_image'],
    ['registration_number', 'registration_number'],
    ['registration_council_id', 'registration_council_id'],
    ['registration_year', 'registration_year'],
    ['registration_proof', 'registration_proof'],
    ['experience', 'experience'],
  ];

  listOfFilter2: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
    { text: 'Other', value: 'O' },
  ];

  showcolumn = [
    { label: 'Name', key: 'name', visible: true },
    { label: 'Email', key: 'email_id', visible: true },
    { label: 'Mobile No.', key: 'mobile_number', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Country', key: 'country_name', visible: true },
    { label: 'State', key: 'state_name', visible: true },
    { label: 'District', key: 'district_name', visible: true },
    { label: 'Pincode', key: 'pincode_number', visible: true },
    { label: 'Registration Number', key: 'registration_number', visible: true },
  ];

  columns1: { label: string; value: string }[] = [
    { label: 'Doctor Name', value: 'name' },
    { label: 'Email', value: 'email_id' },
    { label: 'Mobile No.', value: 'mobile_number' },
    { label: 'Gender', value: 'gender' },
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'district_id' },
    { label: 'Pincode', value: 'pincode_id' },
    { label: 'Gender', value: 'gender' },
    { label: 'Registration Number', value: 'registration_number' },
  ];

  countries: any = [];
  countries1: any = [];
  pincodes: any = [];
  pincodes1: any = [];
  States: any = [];
  States1: any = [];
  districts: any = [];
  districts1: any = [];
  loadcountries: boolean = false;
  loadstates: boolean = false;
  loaddistract: boolean = false;
  loadpincode: boolean = false;
  pincodeload: boolean = false;

  getCountry() {
    this.loadcountries = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;
      if (statusCode === 200) {
        this.countries = responseBody.data || [];
        this.countries1 = responseBody.data || [];
      } else {
        this.countries = [];
        this.countries1 = [];
        this.message.error('Failed To Get Country Data', '');
      }
      this.loadcountries = false;
    });
  }

  getStates() {
    this.loadstates = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.States = response.body.data || [];
          this.States1 = response.body.data || [];
        } else {
          this.States = [];
          this.States1 = [];
          this.message.error('Failed To Get State Data', '');
        }
        this.loadstates = false;
      },
      (err: HttpErrorResponse) => {
        this.loadstates = false;
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  getDistricts() {
    this.loaddistract = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.districts = response.body.data || [];
          this.districts1 = response.body.data || [];
        } else {
          this.districts = [];
          this.districts1 = [];
          this.message.error('Failed To Get District Data', '');
        }
        this.loaddistract = false;
      },
      (err: HttpErrorResponse) => {
        this.loaddistract = false;
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  getPincode() {
    this.pincodeload = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getPincodeType(filter).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.pincodes = response.body.data || [];
          this.pincodes1 = response.body.data || [];
        } else {
          this.pincodes = [];
          this.pincodes1 = [];
        }
        this.pincodeload = false;
      },
      (err: HttpErrorResponse) => {
        this.pincodeload = false;
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  onConsultationModeData: any;
  onConsultationMode() {
    const filter = ``;
    this.api.getAppointmentTypeGetList(filter).subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.onConsultationModeData = responseBody.data || [];
        } else {
          this.onConsultationModeData = [];
          this.message.error('Failed To Get AppointmentType Data', '');
        }
      },
      (err: HttpErrorResponse) => {
        // this.loadstates = false;
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  typeFilter: string | undefined = undefined;
  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length == 0) {
      this.search();
    }
  }

  edit(data: DoctorMaster): void {
    this.drawerTitle = 'Update Doctor';
    this.drawerData = Object.assign({}, data);
    this.drawerData.registration_number = data.registration_number.toString();
    this.drawerData.country_id = data.country_id;

    //

    if (data.country_id) {
      this.States = this.States.filter(
        (item) => item.country_id == data.country_id
      );
      this.districts = this.districts.filter(
        (item) => item.state_id == data.state_id
      );

      if (data.pincode_id) {
        const filter = `AND IS_ACTIVE = 1 AND ID = ${data.pincode_id}`;

        this.api.getPincodeType(filter).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status === 200) {
              this.pincodes = response.body.data || [];
              //
            } else {
              this.pincodes = [];
            }
          },
          (err: HttpErrorResponse) => {
            this.message.error('Something Went Wrong', '');
          }
        );
      }

      // this.pincodes = this.pincodes.filter(
      //   (item) => item.ID == data.PINCODE_ID
      // );

    }
    this.drawervisible = true;

  }
  add(): void {
    this.drawerTitle = 'Create New Doctor';
    this.drawerData = new DoctorMaster();
    this.drawervisible = true;
    this.countries = [];
    this.States = [];
    this.districts = [];
    this.pincodes = [];
  }

  docnameText: string = '';
  emailtext: string = '';
  mobtext: string = '';

  onKeyup(event: KeyboardEvent): void {
    // Check for docnameText
    if (
      this.docnameText &&
      this.docnameText.length > 0 &&
      event.key === 'Enter'
    ) {
      this.search();
    } else if (
      (!this.docnameText || this.docnameText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    // Check for emailtext
    if (this.emailtext && this.emailtext.length > 0 && event.key === 'Enter') {
      this.search();
    } else if (
      (!this.emailtext || this.emailtext.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    // Check for mobtext
    if (this.mobtext && this.mobtext.length > 0 && event.key === 'Enter') {
      this.search();
    } else if (
      (!this.mobtext || this.mobtext.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    // Check for pincodeText
    if (
      this.pincodeText &&
      this.pincodeText.length > 0 &&
      event.key === 'Enter'
    ) {
      this.search();
    } else if (
      (!this.pincodeText || this.pincodeText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    // Check for registrationText
    if (
      this.registrationText &&
      this.registrationText.length > 0 &&
      event.key === 'Enter'
    ) {
      this.search();
    } else if (
      (!this.registrationText || this.registrationText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
  }

  onCountryChange(): void {
    this.search();
  }
  onStateChange(): void {
    this.search();
  }

  onDistChange(): void {
    this.search();
  }

  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onGenderFilterChange1(selectedStatus: string) {
    this.typeFilter = selectedStatus;
    this.search(true);
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    let globalSearchQuery = '';
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

    // Country Filter
    if (this.countryText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.countryText.join(',')})`; // Update with actual field name in the DB
    }

    // State Filter
    if (this.stateText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.stateText.join(',')})`; // Update with actual field name in the DB
    }

    // State Filter
    if (this.districtText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `district_id IN (${this.districtText.join(',')})`; // Update with actual field name in the DB
    }

    if (this.docnameText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.docnameText.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `email_id LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.mobtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `mobile_number LIKE '%${this.mobtext.trim()}%'`;
    }

    if (this.pincodeText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `pincode_number LIKE '%${this.pincodeText.trim()}%'`;
    }

    if (this.registrationText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `registration_number LIKE '%${this.registrationText.trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }
    if (this.typeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `gender = '${this.typeFilter}'`;
    }
    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    let extraFilter = ''
    let rawData = sessionStorage.getItem('userId')
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null
    console.log(userId, 'user_id')
    let rawData1 = sessionStorage.getItem('roleId')
    let roleId = rawData1 ? this.commonFunction.decryptdata(rawData1) : null

    // let storageKey = 'createdDoctors_' + userId;
    // let createdDoctorUserIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    // let userID = localStorage.getItem('userID')

    // if (userId && userId != '1') {
    if (roleId == '2') {
      this.api.getHospitalClinics(1, 10000, '', '', '').subscribe(
        (hospitalResponse) => {
          const hospitals = hospitalResponse.body['data'] || [];
          const matchedHospital = hospitals.find(
            (h: any) => h.user_id == userId || h.USER_ID == userId
          );
          if (matchedHospital) {
            const hospitalId = matchedHospital.id || matchedHospital.ID;
            this.api.getMappedDoctorList(hospitalId).subscribe(
              (doctorResponse) => {
                const allMapped = doctorResponse.body['data'] || [];
                const activeDoctors = allMapped.filter(
                  (doc: any) => doc.is_active == 1 || doc.IS_ACTIVE == 1 || doc.is_active === true || doc.IS_ACTIVE === true
                );
                const activeDoctorIds = activeDoctors.map((doc: any) => doc.doctor_id || doc.DOCTOR_ID);
                if (activeDoctorIds.length > 0) {
                  const filterIds = ' AND id IN (' + activeDoctorIds.join(',') + ')';
                  this.api.getAllDoctor(
                    this.pageIndex,
                    this.pageSize,
                    this.sortKey,
                    sort,
                    likeQuery + filterIds + this.filterQuery
                  ).subscribe(
                    (response) => {
                      this.loadingRecords = false;
                      const responseBody = response.body;
                      this.totalRecords = responseBody.count || 0;
                      this.TabId = responseBody.TAB_ID || responseBody.tab_id;
                      this.Doctor = responseBody.data || [];
                    },
                    (err) => {
                      this.loadingRecords = false;
                      this.Doctor = [];
                      this.totalRecords = 0;
                    }
                  );
                } else {
                  this.loadingRecords = false;
                  this.Doctor = [];
                  this.totalRecords = 0;
                }
              },
              (err) => {
                this.loadingRecords = false;
                this.Doctor = [];
                this.totalRecords = 0;
              }
            );
          } else {
            this.loadingRecords = false;
            this.Doctor = [];
            this.totalRecords = 0;
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.Doctor = [];
          this.totalRecords = 0;
        }
      );
    }
    else {
      console.log(rawData, userId);

      this.api
        .getAllDoctor(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + extraFilter + this.filterQuery
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            if (statusCode === 200) {
              this.loadingRecords = false;
              this.totalRecords = responseBody.count || 0;
              this.TabId = responseBody.TAB_ID || responseBody.tab_id;
              this.Doctor = responseBody.data || [];
            } else {
              this.loadingRecords = false;
              this.Doctor = [];
              this.message.error('Something Went Wrong ...', '');
            }
          }
          // (error: HttpErrorResponse) => {
          //   this.loadingRecords = false;
          //   if (error.status === 0) {
          //     this.message.error(
          //       'Unable to connect. Please check your internet or server connection and try again shortly.',
          //       ''
          //     );
          //   } else {
          //     this.message.error('Something Went Wrong.', '');
          //   }
          // }
        );
    }
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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

  drawerClose(): void {
    this.search();
    this.drawervisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  close() {
    this.drawervisible = false;
  }
  drawerChapterMappingClose(): void {
    this.drawerCountryMappingVisible = false;
  }

  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }

  reset(): void {
    this.searchText = '';
    this.docnameText = '';
    this.emailtext = '';
    this.mobtext = '';
    this.pincodeText = '';
    this.typeFilter = '';
    this.districtText = [];
    this.stateText = [];
    this.countryText = [];
    this.registrationText = '';

    this.search();
  }

  // Main Filter code
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  // Main Filter code
  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    '=',
    '!=',
    '<',
    '>',
    '<=',
    '>=',
    'Contains',
    'Does not Contain',
    'Start With',
    'End With',
  ];

  getComparisonOptions(selectedColumn: string): string[] {
    if (
      selectedColumn === 'COUNTRY_ID' ||
      selectedColumn === 'STATE_ID' ||
      selectedColumn === 'PINCODE_ID' ||
      selectedColumn === 'DISTRICT_ID' ||
      selectedColumn === 'GENDER'
    ) {
      return ['=', '!='];
    }
    return [
      '=',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      'Contains',
      'Does not Contain',
      'Start With',
      'End With',
    ];
  }

  columns2: string[][] = [['AND'], ['OR']];

  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter;
  }

  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;

  conditions: any[] = [];

  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: '',
      COMPARISION_VALUE: '',
      TABLE_VALUE: '',
    });
  }

  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  operators: string[] = ['AND', 'OR'];
  // QUERY_NAME: string = '';
  showQueriesArray = [];

  filterBox = [
    {
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    },
  ];

  addCondition() {
    this.filterBox.push({
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    });
  }

  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }

  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else {
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }

  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }

  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]['FILTER'].length - 1;
    if (
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == '' ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == undefined ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == null
    ) {
      isOk = false;
      this.message.error('Please check some fields are empty', '');
    } else if (
      i != 0 &&
      (this.filterBox[i]['CONDITION'] == undefined ||
        this.filterBox[i]['CONDITION'] == null ||
        this.filterBox[i]['CONDITION'] == '')
    ) {
      isOk = false;
      this.message.error('Please select operator.', '');
    }

    if (isOk) {
      this.filterBox.push({
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      });
    }
  }

  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  // loadingRecords: boolean = false;
  createFilterQuery(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.loadingRecords = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }

      this.showquery = this.query;

      var newQuery = ' AND ' + this.query;

      this.filterQuery1 = newQuery;

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      let extraFilter = ''
      let rawData = sessionStorage.getItem('userId')
      let userId = rawData ? this.commonFunction.decryptdata(rawData) : null
      if (userId && userId != '1') {
        extraFilter = " AND USER_ID=" + userId
      }
      this.api
        .getAllDoctor(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery + extraFilter
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            if (statusCode === 200) {
              this.totalRecords = responseBody['count'] || 0;
              this.Doctor = responseBody['data'] || [];
              this.loadingRecords = false;
              this.filterQuery = '';
            } else {
              this.Doctor = [];
              this.loadingRecords = false;
              this.message.error('Failed to load data', '');
            }
          },
          (error: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.message.error('Server Not Found', '');
          }
        );

      this.QUERY_NAME = '';
    }
  }

  restrictedKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'TRUNCATE',
    'ALTER',
    'CREATE',
    'RENAME',
    'GRANT',
    'REVOKE',
    'EXECUTE',
    'UNION',
    'HAVING',
    'WHERE',
    'ORDER BY',
    'GROUP BY',
    'ROLLBACK',
    'COMMIT',
    '--',
    ';',
    '/*',
    '*/',
  ];

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }

  applyFilter(i: number, j: number) {
    const currentFilter = this.filterBox[i]['FILTER'][j];

    const selection1 = currentFilter.SELECTION1;
    const selection2 = currentFilter.SELECTION2;
    const selection3 = currentFilter.SELECTION3;

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 character',
        ''
      );
    } else if (
      typeof selection3 === 'string' &&
      !this.isValidInput(selection3)
    ) {
      this.message.error(`Invalid Input: ${selection3} is not allowed.`, '');
    } else {
      const sort = this.sortValue?.startsWith('a') ? 'asc' : 'desc';

      const getComparisonFilter = (
        comparisonValue: any,
        columnName: any,
        tableValue: any
      ) => {
        switch (comparisonValue) {
          case '=':
          case '!=':
          case '<':
          case '>':
          case '<=':
          case '>=':
            return `${tableValue} ${comparisonValue} '${columnName}'`;
          case 'Contains':
            return `${tableValue} LIKE '%${columnName}%'`;
          case 'Does not Contain':
            return `${tableValue} NOT LIKE '%${columnName}%'`;
          case 'Start With':
            return `${tableValue} LIKE '${columnName}%'`;
          case 'End With':
            return `${tableValue} LIKE '%${columnName}'`;
          default:
            return '';
        }
      };

      const filterCondition = getComparisonFilter(
        selection2,
        selection3,
        selection1
      );
      const FILDATA = `AND (${filterCondition})`;

      this.loadingRecords = true;
      let extraFilter = ''
      let rawData = sessionStorage.getItem('userId')

      console.log(rawData);

      let userId = rawData ? this.commonFunction.decryptdata(rawData) : null
      if (userId && userId != '1') {
        extraFilter = " AND USER_ID=" + userId
      }
      this.api
        .getAllDoctor(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          FILDATA + extraFilter
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            if (statusCode === 200) {
              this.totalRecords = responseBody['count'] || 0;
              this.Doctor = responseBody['data'] || [];
            } else {
              this.Doctor = [];
              this.message.error('Failed to load doctor data', '');
            }
            this.loadingRecords = false;
          },
          (error: HttpErrorResponse) => {
            this.loadingRecords = false;
            this.message.error('Server Not Found', '');
          }
        );
    }
  }

  resetValues(): void {
    this.filterBox = [
      {
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      },
    ];
    this.search();
    this.hide = true;
  }

  public visiblesave = false;

  saveQuery() {
    // this.createFilterQuery();
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.visiblesave = !this.visiblesave;
    }
  }

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  handleOkTop(): void {
    // this.createFilterQuery();

    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.loadingRecords = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }
      this.loadingRecords = false;

      this.showquery = this.query;
    }

    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '');
    } else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });

      this.visiblesave = false;
      this.QUERY_NAME = ''; // Clear input after adding
    }
    // this.visiblesave = false;
  }

  handleCancelTop(): void {
    this.visiblesave = false;
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY || query;
    this.isModalVisible = true; // Show the modal
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  // Actions
  mapQualificationsDrawerVisible: boolean = false;
  mapQualificationsDrawerTitle = 'Map Qualifications';
  qualificationIndeterminate: any = [];
  checkedQualifications = false;
  qualificationSelectedItems: any = [];
  qualificationSetOfCheckedId = new Set<number>();
  totalQualificationRecords = 1;
  QUALIFICATION_SELECTED_RECORDS: any;
  QUALIFICATION_ID: any;
  qualificationLoadingRecords: boolean = false;
  qualificationPageIndex = 1;
  qualificationPageSize = 10;
  newQualificationSelectedItems: any = [];
  masterQualificationList: any[] = [];
  masterQualificationData: any = [];
  onQualificationPageDataChange(data: any) { }

  mapQualifications(data: any) {
    // Start loading
    this.qualificationLoadingRecords = true;
    this.loadingRecords = true;

    // Set title and ID
    this.QUALIFICATION_ID = data.id;
    this.mapQualificationsDrawerTitle = 'Map Qualifications To ' + data.name;

    // Fetch master qualification data
    this.api
      .getQualification(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterQualificationData = response.body?.data || [];
            console.log('this.masterQualificationData', this.masterQualificationData)
            // console.log(
            //   this.masterQualificationData,
            //   'masterQualificationData'
            // );
          } else {
            this.masterQualificationData = [];
            this.message.error(
              'Failed to load qualifications. Please try again.',
              ''
            );
          }
        },
        error: (err) => {
          this.masterQualificationData = [];
          this.message.error('Error loading qualifications.', '');
        },
        complete: () => {
          // Once master data is fetched, fetch mapped qualifications
          this.api.getMappedQualifications(data.id).subscribe({
            next: (response: HttpResponse<any>) => {
              const mappedQualifications = response.body?.data || [];
              console.log('mappedQualifications', response.body?.data)
              const mappedQualificationMap: {
                [key: string]: {
                  id: number;
                  isActive: boolean;
                  proof_document_url: string | null;
                  year_of_completion: string | null;
                  institution_name: string | null;
                };
              } = {};

              // Map the data
              for (const qualification of mappedQualifications) {
                // mappedQualificationMap[qualification.QUALIFICATION_ID] = {
                //   id: qualification.ID,
                //   isActive: qualification.IS_ACTIVE,
                //   proof_document_url: qualification.PROOF_DOCUMENT_URL || null,
                //   year_of_completion: qualification.YEAR_OF_COMPLETION || null,
                //   institution_name: qualification.INSTITUTION_NAME || '',
                const qKey = qualification.qualification_id ?? qualification.QUALIFICATION_ID;
                mappedQualificationMap[qKey] = {
                  id: qualification.id ?? qualification.ID,
                  isActive: qualification.is_active ?? qualification.IS_ACTIVE,
                  proof_document_url: qualification.proof_document_url || qualification.PROOF_DOCUMENT_URL || null,
                  year_of_completion: qualification.year_of_completion || qualification.YEAR_OF_COMPLETION || null,
                  institution_name: qualification.institution_name || qualification.INSTITUTION_NAME || '',
                };
              }

              console.log(
                mappedQualifications,
                'mappedQualifications',
                mappedQualificationMap
              );

              // Combine master and mapped qualifications
              this.qualificationSetOfCheckedId.clear();
              this.qualificationSelectedItems = [];

              for (const qualification of this.masterQualificationData) {
                const qId = qualification.id || qualification.ID;
                const mappedQualification = mappedQualificationMap[qId];
                // const isChecked =
                //   mappedQualification && mappedQualification.isActive;

                const isChecked = mappedQualification ? Number(mappedQualification.isActive) === 1 : false;

                if (isChecked) {
                  this.qualificationSetOfCheckedId.add(qId);
                }

                this.qualificationSelectedItems.push({
                  ...qualification,
                  id: qId,
                  checkedQualifications: isChecked,
                  mappedQualificationId: mappedQualification
                    ? mappedQualification.id
                    : null,
                  proof_document_url: mappedQualification
                    ? mappedQualification.proof_document_url
                    : null,
                  year_of_completion: mappedQualification
                    ? mappedQualification.year_of_completion?.toString() || null
                    : null,
                  institution_name: mappedQualification
                    ? mappedQualification.institution_name
                    : '',
                });
              }

              // Update state after data combination
              this.masterQualificationList = [
                ...this.qualificationSelectedItems,
              ];
              this.refreshQualificationCheckedStatus();

              this.qualificationLoadingRecords = false;
              this.loadingRecords = false;
              this.mapQualificationsDrawerVisible = true;

              // console.log(
              //   this.qualificationSelectedItems,
              //   'Combined Data (masterQualificationData + mappedQualifications)'
              // );
            },
            error: (err) => {
              this.qualificationLoadingRecords = false;
              this.loadingRecords = false;
              this.mapQualificationsDrawerVisible = true;
            },
          });
        },
      });
  }
  searchQualifications(searchText: any) {
    this.qualificationLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.datalist1 = this.masterQualificationList.filter((user) => {
        return user.NAME.toLowerCase().includes(searchTextLower);
      });
      this.qualificationSelectedItems = [...this.datalist1];
    } else {
      this.qualificationSelectedItems = [...this.masterQualificationList];
    }
    this.qualificationLoadingRecords = false;
  }
  onAllQualificationsChecked(value: boolean): void {
    //

    this.qualificationSetOfCheckedId.clear();
    if (value) {
      this.masterQualificationData.forEach((item) =>
        this.qualificationSetOfCheckedId.add(item.ID)
      );
    }
    this.qualificationSelectedItems.forEach(
      (item) => (item.checkedQualifications = value)
    );
    this.refreshQualificationCheckedStatus();
    this.updateTotalQualificationRecords();
  }

  onQualificationItemChecked(id: number, checked: boolean): void {
    //

    this.updateQualificationCheckedSet(id, checked);
    this.qualificationSelectedItems.forEach(
      (data) =>
      (data.checkedQualifications = this.qualificationSetOfCheckedId.has(
        data.ID
      ))
    );
    this.refreshQualificationCheckedStatus();
    this.updateTotalQualificationRecords();
  }

  updateQualificationCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.qualificationSetOfCheckedId.add(id);
    } else {
      this.qualificationSetOfCheckedId.delete(id);
    }
    //
  }

  refreshQualificationCheckedStatus(): void {
    this.checkedQualifications = this.qualificationSelectedItems.every((item) =>
      this.qualificationSetOfCheckedId.has(item.id || item.ID)
    );
    this.qualificationIndeterminate =
      this.qualificationSelectedItems.some((item) =>
        this.qualificationSetOfCheckedId.has(item.id || item.ID)
      ) && !this.checkedQualifications;
  }

  updateTotalQualificationRecords(): void {
    this.QUALIFICATION_SELECTED_RECORDS = this.qualificationSetOfCheckedId.size;
  }

  saveQualifications(): void {
    if (this.qualificationSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Qualification', '');
    } else {
      const checkedQualifications: any[] = [];
      const uncheckedQualifications: any[] = [];

      // console.log(
      //   this.masterQualificationData,
      //   'qualifications',
      //   this.qualificationSelectedItems,
      //   this.masterQualificationList
      // );

      for (let i = 0; i < this.masterQualificationData.length; i++) {
        const qualification = this.masterQualificationData[i];
        const qId = qualification.id || qualification.ID;
        const isChecked = this.qualificationSetOfCheckedId.has(qId);

        const mappedQualification = this.qualificationSelectedItems.find(
          (item) => (item.id) === qId
        );

        const mappedQualificationId =
          mappedQualification?.mappedQualificationId || null;
        const institutionName = mappedQualification?.institution_name || null;
        let yearOfCompletion = mappedQualification?.year_of_completion || null;

        // If yearOfCompletion is set, transform it using datePipe
        if (yearOfCompletion) {
          yearOfCompletion = this.datePipe.transform(yearOfCompletion, 'yyyy');
        } else {
          yearOfCompletion = null; // If no year of completion, keep it null
        }
        const proofDocumentUrl =
          mappedQualification?.proof_document_url || null;

        if (isChecked) {
          if (!institutionName) {
            this.message.error(
              `Qualification "${qualification.name}" is missing Institution Name.`,
              ''
            );
            return;
          }
          if (!yearOfCompletion) {
            this.message.error(
              `Qualification "${qualification.year_of_completion}" is missing Year of Completion.`,
              ''
            );
            return;
          }
          if (!proofDocumentUrl) {
            this.message.error(
              `Qualification "${qualification.qualidication_name}" is missing Proof Document URL.`,
              ''
            );
            return;
          }
          const qualificationObj: any = {
            qualification_id: qId,
            doctor_id: this.QUALIFICATION_ID,
            institution_name: institutionName,
            year_of_completion: yearOfCompletion,
            proof_document_url: proofDocumentUrl,
            is_active: "1",
          };
          if (mappedQualificationId) {
            qualificationObj.id = mappedQualificationId; // Include ID only if it exists
          }
          checkedQualifications.push(qualificationObj);
        } else {
          if (mappedQualificationId) {
            const qualificationObj: any = {
              qualification_id: qId,
              doctor_id: this.QUALIFICATION_ID,
              institution_name: institutionName,
              year_of_completion: yearOfCompletion,
              proof_document_url: proofDocumentUrl,
              is_active: "0",
              id: mappedQualificationId,
            };
            uncheckedQualifications.push(qualificationObj);
          }
        }
      }

      const allQualifications = [
        ...checkedQualifications,
        ...uncheckedQualifications,
      ];

      allQualifications.forEach((qualification) => {
        qualification['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allQualifications };

      this.qualificationLoadingRecords = true;
      // API call to save the mapped qualifications
      this.api.mapQualifications(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Qualifications Mapped Successfully', '');
            this.mapQualificationsDrawerVisible = false;
            this.qualificationSetOfCheckedId.clear();
            this.qualificationLoadingRecords = false;
          } else {
            this.message.error('Qualification Mapping Failed', '');
            this.qualificationLoadingRecords = false;
          }
        },
        (error) => {
          this.message.error('Qualification Mapping Failed', '');
          this.qualificationLoadingRecords = false;
        }
      );
    }
  }

  // Close Qualifications Drawer
  mapQualificationsDrawerClose() {
    this.mapQualificationsDrawerVisible = false;
    this.qualificationSetOfCheckedId.clear();
    this.searchQualifications('');
  }

  datalist1: any[] = [];
  searchText1: any;

  mapSpecializationsDrawerVisible: boolean = false;
  mapSpecializationsDrawerTitle = 'Map Specializations';
  specializationIndeterminate: any = [];
  checkedSpecializations = false;
  specializationSelectedItems: any = [];
  specializationSetOfCheckedId = new Set<number>();
  totalSpecializationRecords = 1;
  SPECIALIZATION_SELECTED_RECORDS: any;
  SPECIALIZATION_ID: any;
  specializationLoadingRecords: boolean = false;
  specializationPageIndex = 1;
  specializationPageSize = 10;
  newSpecializationSelectedItems: any = [];
  masterSpecializationList: any[] = [];
  masterSpecializationData: any = [];

  SPEC_DOCTOR_ID: any;

  mapSpecializations(data: any) {
    // Start by showing loading indicators
    this.specializationLoadingRecords = true;
    this.loadingRecords = true;
    this.searchText2 = '';

    // Set the drawer title and target doctor ID
    this.SPEC_DOCTOR_ID = data.id;
    this.mapSpecializationsDrawerTitle = 'Map Specializations To ' + data.name;

    // Fetch the master specialization data
    this.api
      .getSpecialization(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterSpecializationData = response.body?.data || [];
          } else {
            this.masterSpecializationData = [];
            this.message.error(
              'Failed to load specializations. Please try again.',
              ''
            );
          }
        },
        error: (err) => {
          this.masterSpecializationData = [];
          this.message.error('Error loading specializations.', '');
        },
        complete: () => {
          // Fetch the mapped specializations after the master data is loaded
          this.api.getMappedSpecializations(data.id).subscribe({
            next: (response: HttpResponse<any>) => {
              const mappedSpecializations = response.body?.data || [];
              const mappedSpecializationMap: {
                [key: string]: { id: number; isActive: boolean };
              } = {};

              // Map the fetched data (API returns lowercase keys)
              for (const specialization of mappedSpecializations) {
                const sKey = specialization.specialization_id ?? specialization.SPECIALIZATION_ID;
                mappedSpecializationMap[sKey] = {
                  id: specialization.id ?? specialization.ID,
                  isActive: specialization.is_active ?? specialization.IS_ACTIVE,
                };
              }

              this.specializationSetOfCheckedId.clear();
              this.specializationSelectedItems = [];

              // Combine master specialization data and mapped specializations
              for (const specialization of this.masterSpecializationData) {
                const sId = specialization.id ?? specialization.ID;
                const mappedSpecialization =
                  mappedSpecializationMap[sId];
                const isChecked =
                  mappedSpecialization && mappedSpecialization.isActive;

                if (isChecked) {
                  this.specializationSetOfCheckedId.add(sId);
                }

                this.specializationSelectedItems.push({
                  ...specialization,
                  checkedSpecializations: isChecked,
                  mappedSpecializationId: mappedSpecialization
                    ? mappedSpecialization.id
                    : null,
                });
              }

              this.masterSpecializationList = [
                ...this.specializationSelectedItems,
              ];
              this.refreshSpecializationCheckedStatus();

              // Log the combined data for debugging
              console.log(
                this.specializationSelectedItems,
                'Combined Data (masterSpecializationData + mappedSpecializations)'
              );

              // Set loading indicators and show the drawer
              this.specializationLoadingRecords = false;
              this.loadingRecords = false;
              this.mapSpecializationsDrawerVisible = true;
            },
            error: (err) => {
              this.specializationLoadingRecords = false;
              this.loadingRecords = false;
              this.mapSpecializationsDrawerVisible = true;
            },
          });
        },
      });
  }
  // Search Specializations
  searchSpecializations(searchText: any) {
    this.specializationLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.specializationSelectedItems = this.masterSpecializationList.filter(
        (user) => user.SPECIALIZATION.toLowerCase().includes(searchTextLower)
      );
    } else {
      this.specializationSelectedItems = [...this.masterSpecializationList];
    }
    this.specializationLoadingRecords = false;
  }
  onAllSpecializationsChecked(value: boolean): void {
    this.specializationSetOfCheckedId.clear();
    if (value) {
      this.masterSpecializationData.forEach((item) =>
        this.specializationSetOfCheckedId.add(item.ID)
      );
    }
    this.specializationSelectedItems.forEach(
      (item) => (item.checkedSpecializations = value)
    );
    this.refreshSpecializationCheckedStatus();
    this.updateTotalSpecializationRecords();
  }

  onSpecializationItemChecked(id: number, checked: boolean): void {
    this.updateSpecializationCheckedSet(id, checked);
    this.specializationSelectedItems.forEach(
      (data) =>
      (data.checkedSpecializations = this.specializationSetOfCheckedId.has(
        data.ID
      ))
    );
    this.refreshSpecializationCheckedStatus();
    this.updateTotalSpecializationRecords();
  }

  updateSpecializationCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.specializationSetOfCheckedId.add(id);
    } else {
      this.specializationSetOfCheckedId.delete(id);
    }
  }

  refreshSpecializationCheckedStatus(): void {
    this.checkedSpecializations = this.specializationSelectedItems.every(
      (item) => this.specializationSetOfCheckedId.has(item.ID)
    );
    this.specializationIndeterminate =
      this.specializationSelectedItems.some((item) =>
        this.specializationSetOfCheckedId.has(item.ID)
      ) && !this.checkedSpecializations;
  }

  updateTotalSpecializationRecords(): void {
    this.SPECIALIZATION_SELECTED_RECORDS =
      this.specializationSetOfCheckedId.size;
  }

  saveSpecializations(): void {
    if (this.specializationSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Specialization', '');
    } else {
      const checkedSpecializations: any[] = [];
      const uncheckedSpecializations: any[] = [];

      console.log(
        this.masterSpecializationData,
        'specal',
        this.specializationSelectedItems,
        this.masterSpecializationList
      );

      for (let i = 0; i < this.masterSpecializationData.length; i++) {
        const specialization = this.masterSpecializationData[i];
        const sId = specialization.id ?? specialization.ID;
        const isChecked = this.specializationSetOfCheckedId.has(
          sId
        );

        const mappedSpecialization = this.specializationSelectedItems.find(
          (item) => (item.id ?? item.ID) === sId
        );

        const mappedSpecializationId =
          mappedSpecialization?.mappedSpecializationId || null;

        if (isChecked) {
          const specializationObj: any = {
            specialization_id: sId,
            doctor_id: this.SPEC_DOCTOR_ID,
            is_active: 1,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include ID only if it exists
          }
          checkedSpecializations.push(specializationObj);
        } else {
          const specializationObj: any = {
            specialization_id: sId,
            doctor_id: this.SPEC_DOCTOR_ID,
            is_active: 0,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include ID only if it exists
          }
          uncheckedSpecializations.push(specializationObj);
        }
      }

      const allSpecializations = [
        ...checkedSpecializations,
        ...uncheckedSpecializations,
      ];

      allSpecializations.forEach((specialization) => {
        specialization['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allSpecializations };

      this.specializationLoadingRecords = true;
      // API call to save the mapped specializations
      this.api.MapSpecializations(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Specializations Mapped Successfully', '');
            this.mapSpecializationsDrawerVisible = false;
            this.specializationLoadingRecords = false;
            this.specializationSetOfCheckedId.clear();
          } else {
            this.message.error('Specialization Mapping Failed', '');
          }
        },
        (error) => {
          this.message.error('Specialization Mapping Failed', '');
          this.specializationLoadingRecords = false;
        }
      );
    }
  }

  // Close Specialization Drawer
  mapSpecializationsDrawerClose() {
    this.mapSpecializationsDrawerVisible = false;
    this.specializationSetOfCheckedId.clear();
    this.searchSpecializations('');
  }

  mapServicesDrawerVisible: boolean = false;
  mapServicesDrawerTitle = 'Map Services';
  serviceIndeterminate: any = [];
  checkedServices = false;
  serviceSelectedItems: any = [];
  serviceSetOfCheckedId = new Set<number>();
  totalServiceRecords = 1;
  SERVICE_SELECTED_RECORDS: any;
  SERVICE_ID: any;
  serviceLoadingRecords: boolean = false;
  servicePageIndex = 1;
  servicePageSize = 10;
  newServiceSelectedItems: any = [];
  masterServiceList: any[] = [];
  masterData: any = [];

  DOCTOR_ID: any;

  mapServices(data: any) {
    // Start by showing loading indicators
    this.serviceLoadingRecords = true;
    this.loadingRecords = true;
    this.searchText1 = '';

    // Set the drawer title and target doctor ID
    this.DOCTOR_ID = data.id;
    this.mapServicesDrawerTitle = 'Map Services To ' + data.name;

    // Fetch the master services
    this.api
      .getServiceMaster(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterData = response.body?.data || [];
          } else {
            this.masterData = [];
            this.message.error(
              'Failed to load services. Please try again.',
              ''
            );
          }
        },
        error: (err) => {
          this.masterData = [];
          this.message.error('Error loading services.', '');
        },
        complete: () => {
          // After fetching master data, fetch mapped services
          this.api.getMappedServices(data.id).subscribe({
            next: (response: HttpResponse<any>) => {
              const mappedServices = response.body?.data || [];
              const mappedServiceMap: {
                [key: string]: { id: number; isActive: boolean };
              } = {};

              // Map the services (API returns lowercase keys)
              for (const service of mappedServices) {
                const sKey = service.service_id ?? service.SERVICE_ID;
                mappedServiceMap[sKey] = {
                  id: service.id ?? service.ID,
                  isActive: service.is_active ?? service.IS_ACTIVE,
                };
              }

              this.serviceSetOfCheckedId.clear();
              this.serviceSelectedItems = [];

              // Combine master data and mapped services
              for (const service of this.masterData) {
                const svId = service.id ?? service.ID;
                const mappedService = mappedServiceMap[svId];
                const isChecked = mappedService && mappedService.isActive;

                if (isChecked) {
                  this.serviceSetOfCheckedId.add(svId);
                }

                this.serviceSelectedItems.push({
                  ...service,
                  checkedServices: isChecked,
                  mappedServiceId: mappedService ? mappedService.id : null,
                });
              }

              this.masterServiceList = [...this.serviceSelectedItems];
              this.refreshServiceCheckedStatus();

              // Set loading indicators and show drawer
              this.serviceLoadingRecords = false;
              this.loadingRecords = false;
              this.mapServicesDrawerVisible = true;

              console.log(
                this.serviceSelectedItems,
                'Combined Data (masterData + mappedServices)'
              );
            },
            error: (err) => {
              this.serviceLoadingRecords = false;
              this.loadingRecords = false;
              this.mapServicesDrawerVisible = true;
            },
          });
        },
      });
  }
  searchServices(searchText: any) {
    this.serviceLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.serviceSelectedItems = this.masterServiceList.filter((user) =>
        user.NAME.toLowerCase().includes(searchTextLower)
      );
    } else {
      this.serviceSelectedItems = [...this.masterServiceList];
    }
    this.serviceLoadingRecords = false;
  }
  onAllServicesChecked(value: boolean): void {
    this.serviceSetOfCheckedId.clear(); // Clear existing selections
    if (value) {
      this.masterData.forEach((item) =>
        this.serviceSetOfCheckedId.add(item.ID)
      );
    }
    this.serviceSelectedItems.forEach((item) => (item.checkedServices = value));
    this.refreshServiceCheckedStatus();
    this.updateTotalServiceRecords();
  }

  onServiceItemChecked(id: number, checked: boolean): void {
    this.updateServiceCheckedSet(id, checked);
    this.serviceSelectedItems.forEach(
      (data) => (data.checkedServices = this.serviceSetOfCheckedId.has(data.ID))
    );
    this.refreshServiceCheckedStatus();
    this.updateTotalServiceRecords();
  }

  updateServiceCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.serviceSetOfCheckedId.add(id);
    } else {
      this.serviceSetOfCheckedId.delete(id);
    }
  }

  // onServicePageDataChange(serviceSelectedItems: readonly any[]): void {
  //   this.refreshServiceCheckedStatus();
  // }

  refreshServiceCheckedStatus(): void {
    this.checkedServices = this.serviceSelectedItems.every(
      (item) => this.serviceSetOfCheckedId.has(item.ID) // Changed from SERVICE_ID to ID
    );
    this.serviceIndeterminate =
      this.serviceSelectedItems.some((item) =>
        this.serviceSetOfCheckedId.has(item.ID)
      ) && !this.checkedServices;
  }

  updateTotalServiceRecords(): void {
    this.SERVICE_SELECTED_RECORDS = this.serviceSetOfCheckedId.size;
  }

  save2(): void {
    //
    //
    const serviceIdsSet = new Set(); // To track unique service IDs

    if (this.serviceSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Service', '');
    } else {
      const checkedServices: any = [];
      const uncheckedServices: any = [];

      for (let i = 0; i < this.masterData.length; i++) {
        const service = this.masterData[i];
        const svId = service.id ?? service.ID;
        const isChecked = this.serviceSetOfCheckedId.has(svId);

        const mappedService = this.serviceSelectedItems.find(
          (item) => (item.id ?? item.ID) === svId
        );

        const mappedServiceId = mappedService?.mappedServiceId || null;

        if (isChecked) {
          const serviceObj: any = {
            service_id: svId,
            doctor_id: this.DOCTOR_ID,
            is_active: 1,
            seq_no: i + 1,
          };

          if (mappedServiceId) {
            serviceObj.id = mappedServiceId; // Include ID only if it exists
          }
          // Check for duplicate NAME in checkedServices
          // if (serviceIdsSet.has(serviceObj.NAME)) {
          //   this.message.error('Duplicate services found, please ensure all services are unique.', '');
          //   return; // Stop further execution if duplicate is found
          // }

          // serviceIdsSet.add(serviceObj.NAME); // Mark this SERVICE_ID as used
          checkedServices.push(serviceObj);
        } else {
          const serviceObj: any = {
            service_id: svId,
            doctor_id: this.DOCTOR_ID,
            is_active: 0,
            seq_no: i + 1,
          };

          if (mappedServiceId) {
            serviceObj.id = mappedServiceId; // Include ID only if it exists
          }

          // Check for duplicate SERVICE_ID in checkedServices
          // if (serviceIdsSet.has(serviceObj.SERVICE_ID)) {
          //   this.message.error('Duplicate services found, please ensure all services are unique.', '');
          //   return; // Stop further execution if duplicate is found
          // }

          // serviceIdsSet.add(serviceObj.SERVICE_ID); // Mark this SERVICE_ID as used
          uncheckedServices.push(serviceObj);
        }
      }

      const allServices = [...checkedServices, ...uncheckedServices];

      allServices.forEach((service) => {
        service['client_id'] = this.api.clientId;
      });

      const dataToSave = {
        data: allServices,
      };

      this.serviceLoadingRecords = true;

      // API call to save the mapped services
      this.api.MapServices(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Service Mapped Successfully', '');
            this.mapServicesDrawerVisible = false;
            this.serviceLoadingRecords = false;

            this.serviceSetOfCheckedId.clear();
          } else {
            this.message.error('Service Mapping Failed', '');
            this.serviceLoadingRecords = false;
          }
        },
        (error) => {
          this.message.error('Service Mapping Failed', '');
          this.serviceLoadingRecords = false;
        }
      );
    }
  }

  // Method to handle the confirmation
  confirm2(): void {
    this.message.success('Services mapped successfully!', '');
    this.mapServicesDrawerVisible = false;
  }

  mapServicesDrawerClose() {
    this.mapServicesDrawerVisible = false;
    this.serviceSetOfCheckedId.clear();
    this.searchServices('');
  }

  // File Upload

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = this.api.retriveimgUrl;
  editData: boolean = false;
  PROOF_DOCUMENT_URL: any;
  isSpinning: boolean = false;

  handleFileSelection(doc: any, data: any): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf, .jpg, .jpeg, .png';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) =>
      this.onFileSelected(event, doc, data)
    );
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  // import { HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';

  onFileSelected(event: any, ID: any, NAME: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf'
    ) {
      const isLt2M = event.target.files[0].size < 5242880; // 5MB restriction
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileList2.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        let url = '';
        url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();

        if (
          this.PROOF_DOCUMENT_URL != undefined &&
          this.PROOF_DOCUMENT_URL.trim() != ''
        ) {
          const arr = this.PROOF_DOCUMENT_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }

        this.isSpinning = true;
        this.progressBarProfilePhoto = true;
        this.timerThree = this.api
          .onUpload('DoctorQualificationDocuments', this.fileList2, url)
          .subscribe(
            (res: HttpEvent<any>) => {
              if (res.type === HttpEventType.UploadProgress) {
                // Handle upload progress (optional)
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;

                // You can add more logic here if you want to show progress to the user
              }

              // Handle response when it's of type HttpResponse
              if (res instanceof HttpResponse) {
                if (res.status === 200 && res.body?.message === 'Success') {
                  this.message.success(
                    NAME + ' Image uploaded successfully.',
                    ''
                  );
                  this.isSpinning = false;
                  this.PROOF_DOCUMENT_URL = url;

                  // Update URL in the documents array
                  this.qualificationSelectedItems.forEach((doc) => {
                    if (doc.ID === ID || doc.id === ID) {
                      doc.proof_document_url = this.PROOF_DOCUMENT_URL; // Update URL in documents array
                    }
                  });

                  // Update the task URL
                  this.taskurl =
                    this.imgUrl + 'VendorDocuments/' + this.PROOF_DOCUMENT_URL;
                } else {
                  this.isSpinning = false;
                  this.message.error('Failed to upload image ' + NAME, '');
                  this.PROOF_DOCUMENT_URL = null;
                  this.taskurl = '';
                }
              }
            },
            (error) => {
              this.message.error('Error uploading document.', '');
              this.isSpinning = false;
            }
          );
      } else {
        this.message.error('File size exceeds 5MB.', '');
        this.fileList2 = null;
        this.PROOF_DOCUMENT_URL = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG/PDF extensions.', '');
      this.fileList2 = null;
    }
  }

  ImageModalVisible = false;
  imageshow: any;
  sanitizedLink: any;
  viewImage(imageURL: string): void {
    this.getImage(imageURL['proof_document_url']);
  }

  // Function to retrieve and sanitize image link
  getImage(link: string): void {
    const imagePath =
      this.api.retriveimgUrl + 'DoctorQualificationDocuments/' + link;

    // Sanitize the URL to prevent security issues
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);

    this.imageshow = this.sanitizedLink;

    // Show the modal
    this.ImageModalVisible = true;
  }

  // Close the modal
  ImageModalCancel(): void {
    this.ImageModalVisible = false;
    this.imageshow = null;
  }

  removeLogo(data, data1) {
    const index = this.qualificationSelectedItems.findIndex(
      (doc) => doc.ID === data.ID || doc.id === data.id
    );
    if (index !== -1) {
      this.qualificationSelectedItems[index].proof_document_url = null;
    }
    this.PROOF_DOCUMENT_URL = '';
  }

  deleteCancel() { }

  // above old code  below new for slot

  // Component Logic for Doctor Availability Configuration
  DoctorAvailabilityModalVisible = false;
  loadDoctorAvailability = false;
  doctorAvailabilityData: any[] = [];
  selectedDoctor: any;
  // ConfigurationData: any;
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  disabledHoursForToTimeMorning(day: any): () => number[] {
    return () => {
      const startTime = this.ConfigurationData[day]?.[0].MORNING_START_TIME;
      if (!startTime) {
        return [];
      } else {
        const fromTimeHour = startTime.getHours();
        return Array.from({ length: fromTimeHour }, (_, index) => index);
      }
    };
  }

  disabledMinutesForToTimeMorning(day: any): (hour: number) => number[] {
    return (hour: number) => {
      const startTime = this.ConfigurationData[day]?.[0].MORNING_START_TIME;
      if (!startTime || hour !== startTime.getHours()) {
        return [];
      } else {
        const fromTimeMinute = startTime.getMinutes();
        return Array.from({ length: fromTimeMinute }, (_, index) => index);
      }
    };
  }

  disabledHoursForToTime(day: string): () => number[] {
    return () => {
      const eveningData = this.ConfigurationData[day]?.[1]; // Accessing the evening session
      const startTime = eveningData?.EVENING_START_TIME;

      if (!startTime) {
        return [];
      } else {
        const fromTimeHour = new Date(startTime).getHours();
        return Array.from({ length: fromTimeHour }, (_, index) => index);
      }
    };
  }

  disabledMinutesForToTime(day: string): (hour: number) => number[] {
    return (hour: number) => {
      const eveningData = this.ConfigurationData[day]?.[1]; // Accessing the evening session
      const startTime = eveningData?.EVENING_START_TIME;

      if (!startTime || hour !== new Date(startTime).getHours()) {
        return [];
      } else {
        const fromTimeMinute = new Date(startTime).getMinutes();
        return Array.from({ length: fromTimeMinute }, (_, index) => index);
      }
    };
  }

  daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  ConfigurationData: any = [];
  checked = true;
  DoctorName: any;
  openDoctorAvailabilityModal(doctor: any): void {
    this.selectedDoctor = doctor.id;
    this.loadDoctorAvailability = false;
    this.DoctorName = doctor.name;

    const daasa = 1; // Assuming this is correctly set as per your requirement
    this.api
      .getMapConfigurationData(Number(daasa), doctor.id)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body.data;

        if (statusCode === 200) {
          if (responseBody && Array.isArray(responseBody)) {
            // Initialize ConfigurationData as an empty object
            this.ConfigurationData = this.daysOfWeek.reduce((acc, day) => {
              // Find all availability records for the current day
              const dayAvailability = responseBody.filter(
                (avail: any) => avail.DAY_OF_WEEK === day
              );
              //

              // Helper function to transform times to the required format
              const formatTime = (time: string | null): string | null => {
                return time
                  ? this.datePipe.transform(
                    new Date('1970-01-01T' + time),
                    "yyyy-MM-dd'T'HH:mm"
                  )
                  : null;
              };

              // Initialize morning and evening data with default empty values
              let morningData = {
                DAY_OF_WEEK: day,
                SESSION_NAME: 'Morning',
                MORNING_ACTIVE: false,
                MORNING_START_TIME: null as string | null,
                MORNING_END_TIME: null as string | null,
                MORNING_MODE: '',
                MORNING_MODETYPE_ID: null,
                MORNING_SLOT_DURATION: null,
                DOCTOR_ID: null,
                HOSPITAL_ID: null,
                ID: null as string | null, // Initialize ID field
              };

              let eveningData = {
                DAY_OF_WEEK: day,
                SESSION_NAME: 'Evening',
                EVENING_ACTIVE: false,
                EVENING_START_TIME: null as string | null,
                EVENING_END_TIME: null as string | null,
                EVENING_MODE: '',
                EVENING_MODETYPE_ID: null,
                EVENING_SLOT_DURATION: null,
                DOCTOR_ID: null,
                HOSPITAL_ID: null,
                ID: null as string | null, // Initialize ID field
              };

              // Process all records for the day (morning and evening)
              dayAvailability.forEach((availability) => {
                if (availability.SESSION_NAME === 'Morning') {
                  morningData = {
                    DAY_OF_WEEK: day,
                    SESSION_NAME: 'Morning',
                    MORNING_ACTIVE: availability.IS_ACTIVE === 1,
                    MORNING_START_TIME: formatTime(availability.START_TIME),
                    MORNING_END_TIME: formatTime(availability.END_TIME),
                    MORNING_MODE: availability.MODE,
                    MORNING_MODETYPE_ID: availability.TYPE_ID,
                    MORNING_SLOT_DURATION: availability.SLOT_DURATION,
                    DOCTOR_ID: availability.DOCTOR_ID,
                    HOSPITAL_ID: availability.HOSPITAL_ID,
                    ID: availability.ID,
                  };
                } else if (availability.SESSION_NAME === 'Evening') {
                  eveningData = {
                    DAY_OF_WEEK: day,
                    SESSION_NAME: 'Evening',
                    EVENING_ACTIVE: availability.IS_ACTIVE === 1,
                    EVENING_START_TIME: formatTime(availability.START_TIME),
                    EVENING_END_TIME: formatTime(availability.END_TIME),
                    EVENING_MODE: availability.MODE,
                    EVENING_MODETYPE_ID: availability.TYPE_ID,
                    EVENING_SLOT_DURATION: availability.SLOT_DURATION,
                    DOCTOR_ID: availability.DOCTOR_ID,
                    HOSPITAL_ID: availability.HOSPITAL_ID,
                    ID: availability.ID,
                  };
                }
              });

              if (morningData.MORNING_MODE && morningData.MORNING_MODE !== '') {
                this.onConsultationModeChange(
                  morningData.MORNING_MODE,
                  day,
                  ''
                );
              }

              if (eveningData.EVENING_MODE && eveningData.EVENING_MODE !== '') {
                this.onConsultationModeChangeEvening(
                  eveningData.EVENING_MODE,
                  day,
                  ''
                );
              }

              // Add the day data to the accumulator
              acc[day] = [morningData, eveningData];
              return acc;
            }, {}); // Reduce to create an object
          } else {
            // If responseBody is empty, not an array, or no availability data is found, set default values
            this.ConfigurationData = this.daysOfWeek.reduce((acc, day) => {
              acc[day] = [
                {
                  DAY_OF_WEEK: day,
                  SESSION_NAME: 'Morning',
                  MORNING_ACTIVE: false,
                  MORNING_START_TIME: null,
                  MORNING_END_TIME: null,
                  MORNING_MODE: '',
                  MORNING_MODETYPE_ID: null,
                  MORNING_SLOT_DURATION: null,
                  DOCTOR_ID: null,
                  HOSPITAL_ID: null,
                },
                {
                  DAY_OF_WEEK: day,
                  SESSION_NAME: 'Evening',
                  EVENING_ACTIVE: false,
                  EVENING_START_TIME: null,
                  EVENING_END_TIME: null,
                  EVENING_MODE: '',
                  EVENING_MODETYPE_ID: null,
                  EVENING_SLOT_DURATION: null,
                  DOCTOR_ID: null,
                  HOSPITAL_ID: null,
                },
              ];
              return acc;
            }, {}); // Reduce to create an object
          }

          this.DoctorAvailabilityModalVisible = true;
        } else {
          // Error handling: message from the API might not be available or the status code could indicate failure
          this.message.error(
            'Failed to retrieve data from the server. Please try again.',
            'Error'
          );
        }
      });
  }

  consultationModes = [
    { ID: 'ON', LABEL: 'Online' },
    { ID: 'OF', LABEL: 'offline' },
  ];

  filteredAppointmentTypes: any;
  onConsultationModeChange(mode: string, index: any, day: string) {
    // if (this.ConfigurationData[day] && this.ConfigurationData[day][0].MORNING_MODETYPE_ID) {
    //   this.ConfigurationData[day][0].MORNING_MODETYPE_ID = null;
    // }

    if (mode) {
      // onConsultationModeChange

      const filter = `AND MODE = '${mode}'`;
      this.api.getAppointmentTypeGetList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.filteredAppointmentTypes = responseBody.data || [];
          } else {
            this.filteredAppointmentTypes = [];
            this.message.error('Failed To Get AppointmentType Data', '');
          }
          // this.loadstates = false;
        },
        (err: HttpErrorResponse) => {
          // this.loadstates = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.loadstates = false;
    }
  }

  filteredAppointmentTypesEvening: any;

  onConsultationModeChangeEvening(mode: string, index: any, day: any) {
    // if (this.ConfigurationData[day] && this.ConfigurationData[day][0].MORNING_MODETYPE_ID) {
    //   this.ConfigurationData[day][0].MORNING_MODETYPE_ID = null;
    // }
    if (mode) {
      // onConsultationModeChange

      const filter = `AND MODE = '${mode}'`;
      this.api.getAppointmentTypeGetList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.filteredAppointmentTypesEvening = responseBody.data || [];
          } else {
            this.filteredAppointmentTypesEvening = [];
            this.message.error('Failed To Get AppointmentType Data', '');
          }
          // this.loadstates = false;
        },
        (err: HttpErrorResponse) => {
          // this.loadstates = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.loadstates = false;
    }
  }
  getRowspan(day: string): number {
    return (
      this.ConfigurationData.filter((d) => d.DAY_OF_WEEK === day).length * 2
    );
  }

  saveTimings() {
    const output: SessionConfig[] = [];
    let isValid = true; // Flag to check completeness of active records

    // Cast ConfigurationData to the correct type
    const configurationData = this
      .ConfigurationData as DoctorAvailabilityConfig;

    // Check if any configuration is active
    const check = Object.values(configurationData).some((sessions) =>
      sessions.some(
        (session) => session.MORNING_ACTIVE || session.EVENING_ACTIVE
      )
    );

    if (!check) {
      this.message.error(
        'Please configure doctor availability for at least one day of the week (either in the morning or evening).',
        ''
      );
      return; // Exit if no active configuration
    }

    // Loop through days and their respective sessions
    // Object.entries(configurationData).forEach(([day, sessions]) => {
    //

    //   sessions.forEach((config) => {
    //     // Validate and Add Morning session
    //     if (config.SESSION_NAME === 'Morning' && config.MORNING_ACTIVE) {
    //       if (!config.MORNING_START_TIME) {
    //         this.message.error(
    //           `Please select start time for Morning session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.MORNING_END_TIME) {
    //         this.message.error(
    //           `Please select end time for Morning session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.MORNING_MODE) {
    //         this.message.error(
    //           `Please select mode for Morning session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.MORNING_MODETYPE_ID) {
    //         this.message.error(
    //           `Please select appointment type for Morning session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.MORNING_SLOT_DURATION) {
    //         this.message.error(
    //           `Please select slot duration for Morning session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else {
    //         output.push({
    //           DAY_OF_WEEK: day,
    //           SESSION_NAME: 'Morning',
    //           HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
    //           DOCTOR_ID: this.selectedDoctor,
    //           IS_ACTIVE: config.MORNING_ACTIVE,
    //           START_TIME: this.datePipe.transform(
    //             new Date(config.MORNING_START_TIME),
    //             'HH:mm:ss'
    //           ),
    //           END_TIME: this.datePipe.transform(
    //             new Date(config.MORNING_END_TIME),
    //             'HH:mm:ss'
    //           ),
    //           MODE: config.MORNING_MODE,
    //           TYPE_ID: config.MORNING_MODETYPE_ID,
    //           SLOT_DURATION: config.MORNING_SLOT_DURATION,
    //           ...(config.ID && { ID: config.ID }),
    //         });
    //       }
    //     }

    //     // Validate and Add Evening session
    //     if (config.SESSION_NAME === 'Evening' && config.EVENING_ACTIVE) {
    //       if (!config.EVENING_START_TIME) {
    //         this.message.error(
    //           `Please select start time for Evening session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.EVENING_END_TIME) {
    //         this.message.error(
    //           `Please select end time for Evening session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.EVENING_MODE) {
    //         this.message.error(
    //           `Please select mode for Evening session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.EVENING_MODETYPE_ID) {
    //         this.message.error(
    //           `Please select appointment type for Evening session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else if (!config.EVENING_SLOT_DURATION) {
    //         this.message.error(
    //           `Please select slot duration for Evening session on ${day}.`,
    //           ''
    //         );
    //         isValid = false;
    //       } else {
    //         output.push({
    //           DAY_OF_WEEK: day,
    //           SESSION_NAME: 'Evening',
    //           HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
    //           DOCTOR_ID: this.selectedDoctor,
    //           IS_ACTIVE: config.EVENING_ACTIVE,
    //           START_TIME: this.datePipe.transform(
    //             new Date(config.EVENING_START_TIME),
    //             'HH:mm:ss'
    //           ),
    //           END_TIME: this.datePipe.transform(
    //             new Date(config.EVENING_END_TIME),
    //             'HH:mm:ss'
    //           ),
    //           MODE: config.EVENING_MODE,
    //           TYPE_ID: config.EVENING_MODETYPE_ID,
    //           SLOT_DURATION: config.EVENING_SLOT_DURATION,
    //           ...(config.ID && { ID: config.ID }), // Conditionally add the ID field if config.ID exists
    //         });
    //       }
    //     }
    //   });
    // });
    Object.entries(configurationData).forEach(([day, sessions]) => {
      let morningStartTime: Date | null = null;
      let morningEndTime: Date | null = null;
      let eveningStartTime: Date | null = null;
      let eveningEndTime: Date | null = null;

      sessions.forEach((config) => {
        // Validate and Add Morning session
        if (config.SESSION_NAME === 'Morning' && config.MORNING_ACTIVE) {
          if (!config.MORNING_START_TIME) {
            this.message.error(
              `Please select start time for Morning session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.MORNING_END_TIME) {
            this.message.error(
              `Please select end time for Morning session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.MORNING_MODE) {
            this.message.error(
              `Please select mode for Morning session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.MORNING_MODETYPE_ID) {
            this.message.error(
              `Please select appointment type for Morning session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.MORNING_SLOT_DURATION) {
            this.message.error(
              `Please select slot duration for Morning session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (
            new Date(config.MORNING_START_TIME).getTime() ===
            new Date(config.MORNING_END_TIME).getTime()
          ) {
            this.message.error(
              `Start and end time for Morning session on ${day} cannot be the same.`,
              ''
            );
            isValid = false;
          } else {
            morningStartTime = new Date(config.MORNING_START_TIME);
            morningEndTime = new Date(config.MORNING_END_TIME);

            output.push({
              DAY_OF_WEEK: day,
              SESSION_NAME: 'Morning',
              HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
              DOCTOR_ID: this.selectedDoctor,
              IS_ACTIVE: config.MORNING_ACTIVE,
              START_TIME: this.datePipe.transform(morningStartTime, 'HH:mm:ss'),
              END_TIME: this.datePipe.transform(morningEndTime, 'HH:mm:ss'),
              MODE: config.MORNING_MODE,
              TYPE_ID: config.MORNING_MODETYPE_ID,
              SLOT_DURATION: config.MORNING_SLOT_DURATION,
              ...(config.ID && { ID: config.ID }),
            });
          }
        }

        // Validate and Add Evening session
        if (config.SESSION_NAME === 'Evening' && config.EVENING_ACTIVE) {
          if (!config.EVENING_START_TIME) {
            this.message.error(
              `Please select start time for Evening session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.EVENING_END_TIME) {
            this.message.error(
              `Please select end time for Evening session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.EVENING_MODE) {
            this.message.error(
              `Please select mode for Evening session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.EVENING_MODETYPE_ID) {
            this.message.error(
              `Please select appointment type for Evening session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.EVENING_SLOT_DURATION) {
            this.message.error(
              `Please select slot duration for Evening session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (
            new Date(config.EVENING_START_TIME).getTime() ===
            new Date(config.EVENING_END_TIME).getTime()
          ) {
            this.message.error(
              `Start and end time for Evening session on ${day} cannot be the same.`,
              ''
            );
            isValid = false;
          } else {
            eveningStartTime = new Date(config.EVENING_START_TIME);
            eveningEndTime = new Date(config.EVENING_END_TIME);

            // Check for conflicts with Morning session
            if (
              morningStartTime &&
              morningEndTime &&
              eveningStartTime < morningEndTime &&
              eveningEndTime > morningStartTime
            ) {
              this.message.error(
                `Evening session on ${day} conflicts with Morning session. Please adjust the times.`,
                ''
              );
              isValid = false;
            } else if (
              morningStartTime &&
              morningEndTime &&
              eveningStartTime >= morningStartTime &&
              eveningEndTime <= morningEndTime
            ) {
              this.message.error(
                `Evening session on ${day} falls completely within Morning session. Please adjust the times.`,
                ''
              );
              isValid = false;
            } else {
              output.push({
                DAY_OF_WEEK: day,
                SESSION_NAME: 'Evening',
                HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
                DOCTOR_ID: this.selectedDoctor,
                IS_ACTIVE: config.EVENING_ACTIVE,
                START_TIME: this.datePipe.transform(
                  eveningStartTime,
                  'HH:mm:ss'
                ),
                END_TIME: this.datePipe.transform(eveningEndTime, 'HH:mm:ss'),
                MODE: config.EVENING_MODE,
                TYPE_ID: config.EVENING_MODETYPE_ID,
                SLOT_DURATION: config.EVENING_SLOT_DURATION,
                ...(config.ID && { ID: config.ID }),
              });
            }
          }
        }
      });
    });

    if (!isValid) {
      return; // Exit if any validation failed
    }

    // Add CLIENT_ID to each record
    output.forEach((qualification) => {
      qualification['CLIENT_ID'] = this.api.clientId;
    });

    // Proceed with API call
    const dataToSave = {
      configurationData: output,
    };

    this.loadDoctorAvailability = true;
    this.api.MapConfigurationData(dataToSave).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.message.success(
            'Configured Doctor Availability Successfully',
            ''
          );
          this.loadDoctorAvailability = false;
          this.DoctorAvailabilityModalVisible = false;

          this.specializationSetOfCheckedId.clear();
        } else {
          this.message.error('Doctor Availability Configuration Failed', '');
        }
      },
      (error) => {
        this.message.error('Doctor Availability Configuration Failed', '');
        this.loadDoctorAvailability = false;
      }
    );
  }

  handleDoctorAvailabilityCancel(): void {
    this.DoctorAvailabilityModalVisible = false;
  }

  handleDoctorAvailabilityOk(): void {
    this.DoctorAvailabilityModalVisible = false;
    this.message.success(
      'Doctor Availability Configuration Saved Successfully!',
      ''
    );
  }

  // Method that triggers on 'Map & Close' click
  save(): void { }

  // Method to handle the confirmation
  confirm(): void {
    this.message.success('Qualifications mapped successfully!', '');
    this.mapQualificationsDrawerVisible = false;
  }

  visible1 = false;

  open(): void {
    this.visible1 = true;
  }

  close1(): void {
    this.visible1 = false;
  }

  TabId!: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  drawerFilterVisible: boolean = false;
  savedFilters: any[] = [];
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
  oldFilter: any[] = [];
  distinctData: any[] = [];

  filterFields: any[] = [
    {
      key: 'name',
      label: 'Doctor Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Doctor Name',
    },
    {
      key: 'email_id',
      label: 'Email',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Email',
    },
    {
      key: 'mobile_number',
      label: 'Mobile No.',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Mobile No.',
    },
    {
      key: 'country_id',
      label: 'Country',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Country',
    },
    {
      key: 'state_id',
      label: 'State',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select State',
    },
    {
      key: 'district_id',
      label: 'District',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select District',
    },
    {
      key: 'pincode_id',
      label: 'Pincode',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Pincode',
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'M', display: 'Male' },
        { value: 'F', display: 'Female' },
        { value: 'O', display: 'Other' },
      ],
      placeholder: 'Select Gender',
    },
    {
      key: 'registration_number',
      label: 'Registration Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Registration Number',
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
    this.drawerTitle = 'Doctor Filter';
    this.filterFields[3]['options'] = this.countries1.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[4]['options'] = this.States1.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[5]['options'] = this.districts1.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[6]['options'] = this.pincodes1.map((data) => ({
      value: data.ID || data.id,
      display: data.PINCODE_NUMBER || data.pincode_number,
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

  onFilterApplied(obj: any) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
}
