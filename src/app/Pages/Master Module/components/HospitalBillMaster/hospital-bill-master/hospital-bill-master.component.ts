import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalBillMaster } from '../../../Models/HospitalBillMaster';

@Component({
  selector: 'app-hospital-bill-master',
  templateUrl: './hospital-bill-master.component.html',
  styleUrls: ['./hospital-bill-master.component.css'],
})
export class HospitalBillMasterComponent {
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
  columns: string[][] = [
    ['CATALOG_ID', 'Catalog ID'],
    ['APPOINTMENT_ID', 'Appointment ID'],
    ['PAYMENT_INFO', 'Payment Info'],
    ['PAYMENT_STATUS', 'Payment Status'],
    ['PAYMENT_DATE', 'Payment Date'],
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
    { label: 'Catalog', key: 'CATALOG_ID', visible: true },
    { label: 'Appointment', key: 'APPOINTMENT_ID', visible: true },
    { label: 'Payment Info', key: 'PAYMENT_INFO', visible: true },
    { label: 'Payment Status', key: 'PAYMENT_STATUS', visible: true },
    { label: 'Payment Date', key: 'PAYMENT_DATE', visible: true },
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

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Catalog', value: 'CATALOG_ID' },
    { label: 'Appointment', value: 'APPOINTMENT_ID' },
    { label: 'Payment Info', value: 'PAYMENT_INFO' },
    { label: 'Payment Status', value: 'PAYMENT_STATUS' },
    { label: 'Payment Date', value: 'PAYMENT_DATE' },
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
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // this.dataList = [
    //   {
    //     CATALOG_ID: 1001,
    //     APPOINTMENT_ID: 2001,
    //     PAYMENT_INFO: 'Credit Card',
    //     PAYMENT_STATUS: 'Completed',
    //     PAYMENT_DATE: '2024-12-01',
    //   },
    //   {
    //     CATALOG_ID: 1002,
    //     APPOINTMENT_ID: 2002,
    //     PAYMENT_INFO: 'Debit Card',
    //     PAYMENT_STATUS: 'Pending',
    //     PAYMENT_DATE: '2024-12-02',
    //   },
    //   {
    //     CATALOG_ID: 1003,
    //     APPOINTMENT_ID: 2003,
    //     PAYMENT_INFO: 'UPI',
    //     PAYMENT_STATUS: 'Failed',
    //     PAYMENT_DATE: '2024-12-03',
    //   },
    //   {
    //     CATALOG_ID: 1004,
    //     APPOINTMENT_ID: 2004,
    //     PAYMENT_INFO: 'Net Banking',
    //     PAYMENT_STATUS: 'Completed',
    //     PAYMENT_DATE: '2024-12-04',
    //   },
    //   {
    //     CATALOG_ID: 1005,
    //     APPOINTMENT_ID: 2005,
    //     PAYMENT_INFO: 'Cash',
    //     PAYMENT_STATUS: 'Pending',
    //     PAYMENT_DATE: '2024-12-05',
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
    this.drawerTitle = 'Create New Hospital bill';
    this.drawerData = new HospitalBillMaster();

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

  // Main Filter code
  // hide: boolean = true
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
    const dropdownColumns = [
      'COUNTRY_ID',
      'STATE_ID',
      'DISTRICT_ID',
      'PINCODE_ID',
      'IS_ACTIVE',
      'LAB_ID',
      'MODE',
      'TYPE',
      'PACKAGE_ID',
      'TEST_ID',
      'TAX_ID',
    ];

    if (dropdownColumns.includes(selectedColumn)) {
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
      console.log(conditionIndex, subConditionIndex);
      // this.hide = false
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }

  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    // this.hide = true;
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
    console.log(this.filterBox, 'filterBox1');

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
      console.log(this.filterBox, 'filterBox2');
    }
  }

  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
  createFilterQuery(): void {
    console.log(this.filterBox, 'filterdat');

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
    console.log(selection4, 'selection4');

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
      console.log(this.filterBox);

      this.isSpinner = true;

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
          console.log(this.query, 'backend query');
        }
      }

      this.showquery = this.query;
      console.log(this.showquery, 'showquery');

      var newQuery = ' AND ' + this.query;
      console.log(newQuery);

      this.filterQuery1 = newQuery;

      console.log(this.filterQuery1, 'this.filterQuerythis.filterQuery');

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api
        .getState(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
          // filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.isSpinner = false;
            }
          },
          (err) => {
            if (err['ok'] === false) this.message.error('Server Not Found', '');
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

  // applyFilter(i, j) {
  //   console.log(i, j);
  //   const inputValue = this.filterBox[i].FILTER[j].SELECTION3;
  //   const lastFilterIndex = this.filterBox.length - 1;
  //   const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;

  //   const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
  //   const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
  //   const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];

  //   if (!selection1) {
  //     this.message.error("Please select a column", '');
  //   } else if (!selection2) {
  //     this.message.error("Please select a comparison", '');
  //   } else if (!selection3 || selection3.length < 1) {
  //     this.message.error("Please enter a valid value with at least 1 characters", '');
  //   } else if (typeof inputValue === 'string' && !this.isValidInput(inputValue)) {
  //     // Show error message
  //     this.message.error(
  //       `Invalid Input: ${inputValue} is not allowed.`, ''
  //     );
  //   } else {

  //     console.log(this.query, 'query');
  //     console.log(this.filterBox, 'filterbox');

  //     // var DemoData:any = this.filterBox
  //     let sort: string;
  //     let filterQuery = '';

  //     try {
  //       sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //     } catch (error) {
  //       sort = '';
  //     }
  //     // Define a function to get the comparison value filter

  //     this.isSpinner = true;
  //     const getComparisonFilter = (comparisonValue: any, columnName: any, tableValue: any) => {
  //       switch (comparisonValue) {
  //         case '=':
  //         case '!=':
  //         case '<':
  //         case '>':
  //         case '<=':
  //         case '>=':
  //           return `${tableValue} ${comparisonValue} '${columnName}'`;
  //         case 'Contains':
  //           return `${tableValue} LIKE '%${columnName}%'`;
  //         case 'Does not Contain':
  //           return `${tableValue} NOT LIKE '%${columnName}%'`;
  //         case 'Start With':
  //           return `${tableValue} LIKE '${columnName}%'`;
  //         case 'End With':
  //           return `${tableValue} LIKE '%${columnName}'`;
  //         default:
  //           return '';
  //       }
  //     };

  //     // const FILDATA = this.filterBox[i]['FILTER'].map(item => {
  //     //   const filterCondition = getComparisonFilter(item.SELECTION2, item.SELECTION3, item.SELECTION1);
  //     //   return `AND (${filterCondition})`;
  //     // }).join(' ');

  //     const filtercondition = getComparisonFilter(selection2, selection3, selection1);
  //     const FILDATA = `AND (${filtercondition})`
  //     console.log(FILDATA, 'FILDATA');

  //     console.log(filterQuery, 'filterQueryfilterQuery');

  //     this.api
  //       .getState(
  //         this.pageIndex,
  //         this.pageSize,
  //         this.sortKey,
  //         sort,
  //         FILDATA
  //       )
  //       .subscribe(
  //         (data) => {
  //           if (data['code'] === 200) {
  //             this.totalRecords = data['count'];
  //             this.dataList = data['data'];
  //             this.isSpinner = false;
  //             this.filterQuery = '';
  //           } else {
  //             this.dataList = [];
  //             this.isSpinner = false;
  //           }
  //         },
  //         (err) => {
  //           if (err['ok'] === false) this.message.error('Server Not Found', '');
  //         }
  //       );
  //   }
  // }

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

      console.log(FILDATA, 'Filter Data');

      this.isSpinner = true;

      this.api
        .getState(this.pageIndex, this.pageSize, this.sortKey, sort, FILDATA)
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
            } else {
              this.dataList = [];
            }
            this.isSpinner = false;
          },
          (err) => {
            if (err['ok'] === false) {
              this.message.error('Server Not Found', '');
            }
            this.isSpinner = false;
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
    console.log(selection4, 'selection4');

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
  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
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
    console.log(selection4, 'selection4');

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
      this.isSpinner = true;

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
    }

    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '');
    } else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      console.log(this.INSERT_NAMES);
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

  toggleLiveDemo(query: string, name: string): void {
    console.log(query);
    this.selectedQuery = query;
    console.log(this.selectedQuery);
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  deleteItem(item: any) {
    this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
}
