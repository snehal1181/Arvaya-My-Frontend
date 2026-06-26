import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { TestMaster } from '../../../Models/TestMaster';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-test-master',
  templateUrl: './test-master.component.html',
  styleUrls: ['./test-master.component.css']
})
export class TestMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: TestMaster = new TestMaster();
  formTitle = "Manage Test's";
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
    ['name', 'NAME'],
    ['description', 'Description'],
    ['test_category_name', 'Category'],
    ['instruction', 'Instruction'],
    ['samples', 'Samples'],

    ['test_for', 'Test For'],
  ];
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Category', value: 'test_category_name' },
    { label: 'Instruction', value: 'instruction' },
    { label: 'Samples', value: 'samples' },
    { label: 'Test For', value: 'test_for' },
    { label: 'Sequence No', value: 'seq_no' },

    { label: 'Status', value: 'is_active' },

  ];
  adminId: any;

  // Column Filter
  labData: any[] = [];


  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  visible = false;
  showcloumnVisible: boolean = false;
  // Main filter

  showcolumn = [
    { label: 'NAME', key: 'name', visible: true },
    { label: 'Description', key: 'description', visible: true },
    { label: 'Category', key: 'test_category_name', visible: true },
    { label: 'Instruction', key: 'instruction', visible: true },
    { label: 'Samples', key: 'samples', visible: true },
    { label: 'Test For', key: 'test_for', visible: true },
    { label: 'Sequence No', key: 'seq_no', visible: true },

    { label: 'Status', key: 'is_active', visible: true },

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
  catalogIdOptions: any;
  selectedAppointmentId: any;
  appointmentIdOptions: any;
  selectedPaymentInfo: any;
  paymentInfoOptions: any;
  selectedPaymentStatus: any;
  paymentStatusOptions: any;
  paymentDateText: any;
  nameVisible: boolean;
  descriptionVisible: boolean;
  categoryIdVisible: boolean;
  instructionVisible: boolean;
  detailsVisible: boolean;
  seqNoVisible: boolean;
  isActiveVisible: boolean;
  selectedName: any;
  nameOptions: any;
  seqNoText: any;
  descriptionText: string = '';
  selectedCategoryId: number[] = [];
  categoryIdOptions: any;
  instructionText: any;
  Providetext: any
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  listOfMode: any[] = [
    { text: "Male", value: "M" },
    { text: "Female", value: "F" },
    { text: "Other", value: "O" },
    { text: "All", value: "A" },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  back() {
    this.drawerService.openDrawer();
  }
  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getTestData();
  }

  countryData: any = [];
  stateData: any = [];
  districtData: any = [];
  pincodeData: any = [];

  listOftestt: any[] = [
    { text: "Male", value: "M" },
    { text: "Female", value: "F" },
    { text: "Other", value: "O" },
    { text: "All", value: "A" },
  ];

  onModeFilterChange(selectedmode: string) {
    this.Shortcodetext = selectedmode;
    this.search(true);
  }
  getTestData() {
    const filter = `AND is_active = 1`;
    this.api.getTestCategoryList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.categoryIdOptions = data.body['data'];
        } else {
          this.categoryIdOptions = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, '', '', 'AND is_active = 1').subscribe(
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

  bloodlistt: any[] = [
    { text: "Blood", value: "BLOOD" },
    { text: "Urine", value: "URINE" },
    { text: "Swab", value: "SWAB" },


  ]
  mobileNoText = '';
  genderText = '';
  dobText = '';
  aboutText = '';
  experienceText = '';
  registrationNumberText = '';
  addressLine1Text: string = '';
  addressLine2Text: string = '';
  Shortcodetext: string = "";
  bloodGroupText = []
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
    // if (this.instructionText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') + `INSTRUCTION LIKE '%${this.instructionText}%'`;
    // }

    if (this.instructionText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `instruction LIKE '%${this.instructionText}%'`;
    }

    if (this.Providetext) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `provide_details LIKE '%${this.Providetext}%'`;
    }
    if (this.bloodGroupText.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `samples LIKE '${this.bloodGroupText.join(',')}'`; // Update with actual field name in the DB
    }
    // if (this.selectedName !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `NAME LIKE '%${this.selectedName}%'`;
    // }
    if (this.selectedName) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `name LIKE '%${this.selectedName}%'`;
    }



    // if (this.seqNoText !== '') {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `SEQ_NO LIKE '%${this.seqNoText}%'`;

    // }

    if (this.seqNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `seq_no LIKE '%${this.seqNoText}%'`;
    }
    // if (this.descriptionText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `DESCRIPTION LIKE '%${this.descriptionText}%'`;
    // }

    if (this.descriptionText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `description LIKE '%${this.descriptionText}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }
    // Country Filter
    if (this.selectedCategoryId.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `category_id IN (${this.selectedCategoryId.join(',')})`; // Update with actual field name in the DB
    }
    if (this.Shortcodetext) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `test_for LIKE '%${this.Shortcodetext}%'`;
    }

    // Handle selected Districts


    // Status Filter


    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');


    // Call API with updated search query
    this.api.getTestMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
            this.TabId = response.body.TAB_ID
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
    this.descriptionText = "";
    this.instructionText = ""
    this.seqNoText = ""
    this.selectedName = ""
    this.Shortcodetext = "";
    this.bloodGroupText = []
    // this.statetext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Test';
    this.drawerData = new TestMaster();

    this.api.getTestMaster(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          if (response.body.count == 0) {
            this.drawerData.seq_no = 1;
          }
          else {
            this.drawerData.seq_no = response.body.data[0].seq_no + 1;
          }

        } else {
          this.dataList = [];
          this.message.error(`Something went wrong.`, '');
          this.loadingRecords = false;
        }
      },
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
  checkOptionsOne: any
  selectedValues: string[] = [];
  edit(data: TestMaster): void {

    console.log(data);

    this.drawerTitle = ' Update Test';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    // this.selectedValues = Array.isArray(data.TEST_FOR) ? data.TEST_FOR : data.TEST_FOR.split(',');

    // console.log( this.drawerData)

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
  hide: boolean = true
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



  public visiblesave = false;


  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display




  selectedFilter: string | null = null;


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
    this.drawerTitle = 'Test Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[2]['options'] = this.categoryIdOptions.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
    // this.filterFields[1]['options'] = this.stateData.map((data)=>({
    //   value:data.ID,
    //   display:data.NAME
    // }));
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
      key: 'description',
      label: 'Description',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Description',
    },

    {
      key: 'category_id',
      label: 'Category',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Category',
    },

    {
      key: 'instruction',
      label: 'Instruction',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Instruction',
    },
    {
      key: 'samples',
      label: 'Samples',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'Blood', display: 'Blood' },
        { value: 'Urine', display: 'Urine' },
        { value: 'Swab', display: 'Swab' },
      ],
      placeholder: 'Select Samples',
    },
    {
      key: 'test_for',
      label: 'Test For',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'F', display: 'Female' },
        { value: 'M', display: 'Male' },
        { text: "Other", value: "O" },
        { text: "All", value: "A" },
      ],
      placeholder: 'Select Test For',
    },

    {
      key: 'seq_no',
      label: 'Sequence Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Sequence Number',
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

  // filterQuery = '';
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  ;

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
