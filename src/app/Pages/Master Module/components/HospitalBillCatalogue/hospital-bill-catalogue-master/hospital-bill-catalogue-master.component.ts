import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalBillCatalogue } from '../../../Models/Hospitalbillcatalogue';

@Component({
  selector: 'app-hospital-bill-catalogue-master',
  templateUrl: './hospital-bill-catalogue-master.component.html',
  styleUrls: ['./hospital-bill-catalogue-master.component.css'],
})
export class HospitalBillCatalogueMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HospitalBillCatalogue = new HospitalBillCatalogue();
  public commonFunction = new CommonFunctionService();
  formTitle = 'Manage Hospital Bill Catalogue';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  columns: string[][] = [
    ['HOSPITAL_ID', 'Hospital ID'],
    ['DOCTOR_ID', 'Doctor ID'],
    ['CONSULTATION_MODE', 'Consultation Mode'],
    ['CONSULTATION_TYPE_ID', 'Consultation Type ID'],
    ['BILL_AMOUNT', 'Bill Amount'],
    ['TAX_ID', 'Tax ID'],
    ['TOTAL_AMOUNT', 'Total Amount'],
    // ['IS_ACTIVE', 'Is Active'],
  ];

  adminId: any;

  // Column Filter

  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  visible = false;
  showcloumnVisible: boolean = false;
  // Main filter
  showcolumn = [
    { label: 'Hospital', key: 'HOSPITAL_ID', visible: true },
    { label: 'Doctor', key: 'DOCTOR_ID', visible: true },
    { label: 'Consultation Mode', key: 'CONSULTATION_MODE', visible: true },
    { label: 'Consultation Type', key: 'CONSULTATION_TYPE_ID', visible: true },
    { label: 'Bill Amount', key: 'BILL_AMOUNT', visible: true },
    { label: 'Tax', key: 'TAX_ID', visible: true },
    { label: 'Total Amount', key: 'TOTAL_AMOUNT', visible: true },
    { label: 'Is Active', key: 'IS_ACTIVE', visible: true },
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


  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Hospital', value: 'HOSPITAL_ID' },
    { label: 'Doctor', value: 'DOCTOR_ID' },
    { label: 'Consultation Mode', value: 'CONSULTATION_MODE' },
    { label: 'Consultation Type', value: 'CONSULTATION_TYPE_ID' },
    { label: 'Bill Amount', value: 'BILL_AMOUNT' },
    { label: 'Tax', value: 'TAX_ID' },
    { label: 'Total Amount', value: 'TOTAL_AMOUNT' },
    { label: 'Is Active', value: 'IS_ACTIVE' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
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

  onCountryChange(): void {
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
  mobileNoText = '';
  genderText = '';
  dobText = '';
  aboutText = '';
  experienceText = '';
  registrationNumberText = '';
  addressLine1Text: string = '';
  addressLine2Text: string = '';
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    this.loadingRecords = false;

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

    // if (this.nametext !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
    // }
    // if (this.mobileNoText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `CONTACT_NUMBER LIKE '%${this.mobileNoText.trim()}%'`;
    // }

    // if (this.genderText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `GENDER LIKE '%${this.genderText.trim()}%'`;
    // }

    // if (this.dobText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `DOB LIKE '%${this.dobText.trim()}%'`;
    // }

    // if (this.aboutText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `ABOUT LIKE '%${this.aboutText.trim()}%'`;
    // }

    // if (this.experienceText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `EXPERIENCE LIKE '%${this.experienceText.trim()}%'`;
    // }

    // if (this.registrationNumberText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `REGISTRATION_NUMBER LIKE '%${this.registrationNumberText.trim()}%'`;
    // }

    // if (this.addressLine1Text !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `ADDRESS_LINE_1 LIKE '%${this.addressLine1Text.trim()}%'`;
    // }

    // if (this.addressLine2Text !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `ADDRESS_LINE_2 LIKE '%${this.addressLine2Text.trim()}%'`;
    // }
    // // Country Filter
    // if (this.selectedCountries.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `COUNTRY_ID IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    // }
    // if (this.selectedStates.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    // }

    // // Handle selected Districts
    // if (this.selectedDistricts.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `DISTRICT_ID IN (${this.selectedDistricts.join(',')})`; // Update with actual field name in the DB
    // }

    // // Handle selected Pincodes
    // if (this.selectedPincodes.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `PINCODE IN (${this.selectedPincodes.join(',')})`; // Update with actual field name in the DB
    // }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '') + this.filterQuery;

    // this.dataList = [
    //   {
    //     HOSPITAL_ID: 201,
    //     DOCTOR_ID: 301,
    //     CONSULTATION_MODE: "Online",
    //     CONSULTATION_TYPE_ID: 101,
    //     BILL_AMOUNT: 800.0,
    //     TAX_ID: 401,
    //     TOTAL_AMOUNT: 880.0,
    //     IS_ACTIVE: true,
    //   },
    //   {
    //     HOSPITAL_ID: 202,
    //     DOCTOR_ID: 302,
    //     CONSULTATION_MODE: "Offline",
    //     CONSULTATION_TYPE_ID: 102,
    //     BILL_AMOUNT: 1000.0,
    //     TAX_ID: 402,
    //     TOTAL_AMOUNT: 1100.0,
    //     IS_ACTIVE: true,
    //   },
    //   {
    //     HOSPITAL_ID: 203,
    //     DOCTOR_ID: 303,
    //     CONSULTATION_MODE: "Online",
    //     CONSULTATION_TYPE_ID: 103,
    //     BILL_AMOUNT: 1200.0,
    //     TAX_ID: 403,
    //     TOTAL_AMOUNT: 1320.0,
    //     IS_ACTIVE: false,
    //   },
    //   {
    //     HOSPITAL_ID: 204,
    //     DOCTOR_ID: 304,
    //     CONSULTATION_MODE: "Offline",
    //     CONSULTATION_TYPE_ID: 104,
    //     BILL_AMOUNT: 1500.0,
    //     TAX_ID: 404,
    //     TOTAL_AMOUNT: 1650.0,
    //     IS_ACTIVE: true,
    //   },
    //   {
    //     HOSPITAL_ID: 205,
    //     DOCTOR_ID: 305,
    //     CONSULTATION_MODE: "Online",
    //     CONSULTATION_TYPE_ID: 105,
    //     BILL_AMOUNT: 2000.0,
    //     TAX_ID: 405,
    //     TOTAL_AMOUNT: 2200.0,
    //     IS_ACTIVE: false,
    //   },
    // ];
    // Call API with updated search query
    // this.api
    //   .getState(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.loadingRecords = false;
    //         this.totalRecords = data['count'];
    //         this.dataList = data['data'];
    //       } else {
    //         this.dataList = [];
    //         this.message.error('Something Went Wrong', '');
    //         this.loadingRecords = false;
    //       }
    //     },
    //     (err: HttpErrorResponse) => {
    //       this.loadingRecords = false;
    //       if (err.status === 0) {
    //         this.message.error(
    //           "Network error: Please check your internet connection.",
    //           ""
    //         );
    //       } else {
    //         this.message.error("Something Went Wrong.", "");
    //       }
    //     }
    //   );
  }

  reset(): void {
    this.searchText = '';
    // this.statetext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Hospital bill catalogue';
    this.drawerData = new HospitalBillCatalogue();

    // this.api.getState(1, 1, 'SEQ_NO', 'desc', '' + '').subscribe(data => {
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

  edit(data: HospitalBillCatalogue): void {
    this.drawerTitle = ' Update Hospital bill catalogue';
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

  // Main Filter code
  TabId: number = 29;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);

  drawerFilterVisible: boolean = false;
  savedFilters: any[] = [];

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
    this.search(true);
  }

  openfilter() {
    this.drawerTitle = 'Hospital Bill Catalogue Filter';
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
      key: 'HOSPITAL_ID',
      label: 'Hospital',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Hospital'
    },
    {
      key: 'DOCTOR_ID',
      label: 'Doctor',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Doctor'
    },
    {
      key: 'CONSULTATION_MODE',
      label: 'Consultation Mode',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Consultation Mode'
    },
    {
      key: 'CONSULTATION_TYPE_ID',
      label: 'Consultation Type',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Consultation Type'
    },
    {
      key: 'BILL_AMOUNT',
      label: 'Bill Amount',
      type: 'text',
      comparators: ['=', '!=', '<', '>', '<=', '>='],
      placeholder: 'Enter Bill Amount'
    },
    {
      key: 'TAX_ID',
      label: 'Tax',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Tax'
    },
    {
      key: 'TOTAL_AMOUNT',
      label: 'Total Amount',
      type: 'text',
      comparators: ['=', '!=', '<', '>', '<=', '>='],
      placeholder: 'Enter Total Amount'
    },
    {
      key: 'IS_ACTIVE',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' }
      ],
      placeholder: 'Select Status'
    }
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
      (err) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error('Unable to connect. Please check your internet or server connection and try again shortly.', '');
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  selectedFilter: string | null = null;

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
