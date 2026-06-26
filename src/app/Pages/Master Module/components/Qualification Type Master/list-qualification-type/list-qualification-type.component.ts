import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { QualificationTypeMaster } from '../../../Models/QualificationTypeMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';
// import { QualificationMaster } from '../../../Models/QualificationMaster';

@Component({
  selector: 'app-list-qualification-type',
  templateUrl: './list-qualification-type.component.html',
  styleUrls: ['./list-qualification-type.component.css']
})
export class ListQualificationTypeComponent {
  drawerVisible!: boolean;
  drawerTestMapping: boolean = false;
  drawerTechnicianMapping: boolean = false;
  drawerTechnicianserviceMapping: boolean = false;
  drawerTitle!: string;
  drawerTitle1!: string;
  drawerTitle2!: string;
  drawerTitle3!: string;
  drawerData: QualificationTypeMaster = new QualificationTypeMaster();
  formTitle = 'Manage Qualification Types';
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
    { label: 'Type', value: 'type' },
    { label: 'Name', value: 'name' },
    { label: 'Status', value: 'is_active' },
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
    { text: 'Inactive', value: '0' }
  ];

  filterQuery: string = '';
  columns: string[][] = [['type', 'Type'], ['name', 'Name']];
  adminId: any;

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
    this.getCountyData();
    this.search();
  }

  showcolumn = [
    { label: 'Type', key: 'type', visible: true },
    { label: 'Name', key: 'name', visible: true },
    { label: 'Status', key: 'is_active', visible: true }
  ];


  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
  }

  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.countryData = data["data"];
        } else {
          this.countryData = [];
          // this.message.error("Failed To Get Country Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
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
      likeQuery += (likeQuery ? ' AND ' : '') + `name LIKE '%${this.citytext.trim()}%'`;
    }

    // Country Filter
    // if (this.selectedCountries.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `TYPE IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    // }

    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }

      if (this.selectedCountries.length === 1) {
        likeQuery += `type = '${this.selectedCountries[0]}'`; // For a single value
      } else {
        likeQuery += `type IN (${this.selectedCountries.map(country => `'${country}'`).join(',')})`; // For multiple values
      }
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
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getQualificationTypee(
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
            this.totalRecords = response.body.count;
            this.TabId = response.body.TAB_ID
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
    this.drawerTitle = 'Create New Qualification Type';
    this.drawerData = new QualificationTypeMaster();

    this.api.getQualificationTypee(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        console.log(responseBody);

        if (statusCode == 200) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Ensure fallback if data is malformed
          }
        } else {
          console.error('Failed to get valid data:', responseBody);
        }
      },
      (err: HttpErrorResponse) => {
        // console.error('Error occurred while fetching state data:', err);
        this.message.error('Something Went Wrong.', '');
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

  edit(data: QualificationTypeMaster): void {
    this.drawerTitle = ' Update Qualification Type';
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


  // Lab Test Mapping
  TestMapping(data: any) {

    this.drawerTitle1 = "Test Mapping" + " " + data.NAME
    this.drawerTestMapping = true
  }

  drawerCloseTestMapping(): void {
    // this.search();
    this.drawerTestMapping = false;
  }

  get closeCallbackmapping() {
    return this.drawerCloseTestMapping.bind(this);
  }

  Technician(data: any) {
    this.drawerTitle2 = "Technician Mapping" + " " + data.NAME
    this.drawerTechnicianMapping = true
  }


  drawerCloseTechnicianMapping(): void {
    // this.search();
    this.drawerTechnicianMapping = false;
  }


  get closeCallbackTechnician() {
    return this.drawerCloseTechnicianMapping.bind(this);
  }


  // Technicians Service Mapping


  TechniciansService(data: any) {
    this.drawerTitle3 = "Technicians Service Mapping"
    this.drawerTechnicianserviceMapping = true
  }

  drawerCloseTechnicianserviceMapping(): void {
    // this.search();
    this.drawerTechnicianserviceMapping = false;
  }


  get closeCallbackTechnicianservice() {
    return this.drawerCloseTechnicianserviceMapping.bind(this);
  }



  // Main Filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    }
    else { this.filterClass = 'filter-visible'; }
  }


  // Main Filter code
  hide: boolean = true
  filterQuery1: any = '';
  INSERT_NAME: any
  comparisonOptions: string[] = ['=',
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

  columns2: string[][] = [
    ['AND'],
    ['OR'],
  ];

  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter
  }


  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;

  conditions: any[] = [];

  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: '',
      COMPARISION_VALUE: '',
      TABLE_VALUE: ''
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




  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any
  isSpinner: boolean = false;
  // createFilterQuery(): void {
  //   console.log(this.filterBox, 'filterdat');

  //   const lastFilterIndex = this.filterBox.length - 1; 1
  //   const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;

  //   const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
  //   const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
  //   const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];
  //   const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
  //   console.log(selection4, 'selection4');

  //   if (!selection1) {
  //     this.message.error("Please select a column", '');
  //   } else if (!selection2) {
  //     this.message.error("Please select a comparison", '');
  //   } else if (!selection3 || selection3.length < 1) {
  //     this.message.error("Please enter a valid value with at least 1 characters", '');
  //   }

  //   else if (!selection4 && lastFilterIndex > 0) {
  //     this.message.error("Please Select the Operator", '');
  //   }

  //   else {

  //     console.log(this.filterBox);

  //     this.isSpinner = true;

  //     for (let i = 0; i < this.filterBox.length; i++) {
  //       if (i != 0) {
  //         this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
  //       } else this.query = '(';

  //       this.query2 = '';
  //       for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
  //         const filter = this.filterBox[i]['FILTER'][j];
  //         if (j == 0) {
  //           //this.query2 += '(';
  //         } else {
  //           if (filter['CONDITION'] == 'AND') {
  //             this.query2 = this.query2 + ' AND ';
  //           } else {
  //             this.query2 = this.query2 + ' OR ';
  //           }
  //         }

  //         let selection1 = filter['SELECTION1'];
  //         let selection2 = filter['SELECTION2'];
  //         let selection3 = filter['SELECTION3'];

  //         if (selection2 == 'Contains') {
  //           this.query2 += `${selection1} LIKE '%${selection3}%'`;
  //         } else if (selection2 == 'End With') {
  //           this.query2 += `${selection1} LIKE '%${selection3}'`;
  //         } else if (selection2 == 'Start With') {
  //           this.query2 += `${selection1} LIKE '${selection3}%'`;
  //         } else {
  //           this.query2 += `${selection1} ${selection2} '${selection3}'`;
  //         }
  //         if (j + 1 == this.filterBox[i]['FILTER'].length) {
  //           //this.query2 += ') ';
  //           this.query += this.query2;
  //         }
  //       }

  //       if (i + 1 == this.filterBox.length) {
  //         this.query += ')';
  //         console.log(this.query, 'backend query');
  //       }
  //     }

  //     this.showquery = this.query
  //     console.log(this.showquery, 'showquery');


  //     var newQuery = ' AND ' + this.query
  //     console.log(newQuery);

  //     this.filterQuery1 = newQuery

  //     console.log(this.filterQuery1, 'this.filterQuerythis.filterQuery');

  //     let sort = ''; // Assign a default value to sort
  //     let filterQuery = '';
  //     // this.api.getLabMaster(
  //     //   this.pageIndex,
  //     //   this.pageSize,
  //     //   this.sortKey,
  //     //   sort,
  //     //   newQuery
  //     //   // filterQuery
  //     // ).subscribe(
  //     //   (data) => {
  //     //     if (data['code'] === 200) {
  //     //       this.totalRecords = data['count'];
  //     //       this.dataList = data['data'];
  //     //       this.isSpinner = false;
  //     //       this.filterQuery = '';
  //     //     } else {
  //     //       this.dataList = [];
  //     //       this.isSpinner = false;
  //     //     }
  //     //   },
  //     //   (err) => {
  //     //     if (err['ok'] === false) this.message.error('Server Not Found', '');
  //     //   }
  //     // );


  //     this.api
  //     .getQualificationTypee(
  //       this.pageIndex,
  //       this.pageSize,
  //       this.sortKey,
  //       sort,
  //       newQuery
  //     )
  //     .subscribe(
  //       (response: HttpResponse<any>) => {
  //         const statusCode = response.status;
  //         // const headers = response.headers;
  //         if (statusCode === 200) {
  //           this.loadingRecords = false;
  //           this.totalRecords = response.body.count;
  //           this.dataList = response.body.data;
  //         } else {
  //           this.dataList = [];
  //           this.message.error(`Something went wrong.`, '');
  //           this.loadingRecords = false;
  //         }
  //       },
  //       (err: HttpErrorResponse) => {
  //         this.loadingRecords = false;
  //         if (err.status === 0) {
  //           this.message.error(
  //             'Network error: Please check your internet connection.',
  //             ''
  //           );
  //         } else {
  //           this.message.error(
  //             `HTTP Error: ${err.status}. Something Went Wrong.`,
  //             ''
  //           );
  //         }
  //       }
  //     );
  //     this.QUERY_NAME = '';
  //   }
  // }

  restrictedKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER", "CREATE", "RENAME", "GRANT", "REVOKE", "EXECUTE", "UNION", "HAVING", "WHERE", "ORDER BY", "GROUP BY", "ROLLBACK", "COMMIT", "--", ";", "/*", "*/"
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
      this.message.error("Please select a column", '');
    } else if (!selection2) {
      this.message.error("Please select a comparison", '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error("Please enter a valid value with at least 1 character", '');
    } else if (typeof selection3 === 'string' && !this.isValidInput(selection3)) {
      this.message.error(`Invalid Input: ${selection3} is not allowed.`, '');
    } else {
      const sort = this.sortValue?.startsWith('a') ? 'asc' : 'desc';

      const getComparisonFilter = (comparisonValue: any, columnName: any, tableValue: any) => {
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

      const filterCondition = getComparisonFilter(selection2, selection3, selection1);
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
    this.hide = true;
  }

  public visiblesave = false;

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
    this.drawerTitle = 'Qualification Type Filter';
    //    this.filterFields[0]['options'] = this.qualificationTypeData.map((data)=>({
    //   value:data.ID,
    //   display:data.NAME
    // }));
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
