import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
// import { DistrictMaster } from 'src/app/Pages/Models/District';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DistrictMaster } from '../../../Models/DistrictMaster';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-listDistrict',
  templateUrl: './listDistrict.component.html',
  styleUrls: ['./listDistrict.component.css'],
})
export class ListDistrictComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: DistrictMaster = new DistrictMaster();
  formTitle = 'Manage Districts';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  Seqtext: string = '';
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'name' },
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
    { text: 'Inactive', value: '0' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['country_name', 'Country'],
    ['state_name', 'State'],
    ['name', 'District'],
    ['is_active', 'Status'],
    ['code', 'code'],
    ['seq_no', 'seq_no']

  ];
  adminId: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getCountryData();
    this.getStateData();
  }

  showcolumn = [
    { label: 'Country', key: 'country_name', visible: true },
    { label: 'State', key: 'state_name', visible: true },
    { label: 'District', key: 'name', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  countryData: any = [];
  getCountryData() {
    this.api
      .getCountryData(0, 0, 'seq_no', 'asc', ' AND is_active = 1')
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          console.log(response);

          if (statusCode === 200 && responseBody?.data) {
            this.countryData = responseBody.data || []; // Ensure fallback to empty array
          } else {
            this.countryData = [];
            this.message.error('Failed To Get Country Data', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  stateData: any = [];
  stateDataNew: any = [];
  getStateData() {
    this.api.getState(0, 0, 'seq_no', 'asc', ' AND is_active = 1').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.stateData = responseBody.data || []; // Ensure fallback for data
          this.stateDataNew = responseBody.data || []; // Ensure fallback for data
        } else {
          this.stateData = [];
          this.stateDataNew = [];
          this.message.error('Failed To Get State Data', '');
        }
      },
      (err: HttpErrorResponse) => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }


  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search();
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      // this.dataList = [];
      this.search();
    }
  }

  iscoutryfilterApplied: boolean = true;
  isstatefilterApplied: boolean = true;
  isdistrictfilterApplied: boolean = true;
  isshortcodefilterApplied: boolean = true;
  isseqfilterApplied: boolean = true;

  // citykeyup() {
  //   if (this.citytext.length >= 3) {
  //     this.search();
  //     this.isdistrictfilterApplied = true;
  //   } else if (this.citytext.length === 0) {
  //     this.dataList = [];
  //     this.search();
  //     this.isdistrictfilterApplied = false;

  //   } else if (this.citytext.length < 3) {
  //     // this.message.warning("Please Enter at least Three Characters ...", "");
  //   }
  // }


  onKeyup(event: KeyboardEvent): void {
    if (this.citytext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isdistrictfilterApplied = true;
    } else if (this.citytext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isdistrictfilterApplied = false;
    }


    if (this.Shortcodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isshortcodefilterApplied = true;
    } else if (this.Shortcodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isshortcodefilterApplied = false;
    }

    if (this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isseqfilterApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseqfilterApplied = false;
    }
  }



  onCountryChange(): void {
    this.search();
  }

  onStateChange(): void {
    this.search();
  }

  onStatusSequencechange() {
    // this.statusFilter = selectedStatus;
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

    // District Filter
    if (this.citytext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.citytext.trim()}%'`;
      this.isdistrictfilterApplied = true;
    }
    else {
      this.isdistrictfilterApplied = false;

    }

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
      this.iscoutryfilterApplied = true;
    }
    else {
      this.iscoutryfilterApplied = false;

    }

    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
      this.isstatefilterApplied = true;
    }
    else {
      this.isstatefilterApplied = false;

    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    //Short Code
    if (this.Shortcodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `code LIKE '%${this.Shortcodetext.trim()}%'`;
      this.isshortcodefilterApplied = true;
    }
    else {
      this.isshortcodefilterApplied = false;

    }

    //Seq no
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `seq_no LIKE '%${this.Seqtext.toString().trim()}%'`;
      this.isseqfilterApplied = true;
    }
    else {
      this.isseqfilterApplied = false;

    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // Call API with updated search query
    this.api
      .getDistrict(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        this.loadingRecords = false;

        if (statusCode === 200) {
          this.totalRecords = responseBody.count || 0;
          this.TabId = responseBody.TAB_ID
          this.dataList = responseBody.data || [];
        } else {
          this.dataList = [];
          this.message.error('Failed to get District data.', '');
        }
      });
  }
  reset(): void {
    this.searchText = '';
    this.Seqtext = '';
    this.citytext = '';
    this.Shortcodetext = '';
    this.selectedStates = [];
    this.selectedCountries = [];
    this.search();
  }
  add(): void {
    this.drawerTitle = 'Create New District';
    this.drawerData = new DistrictMaster();

    this.api.getDistrict(1, 1, 'seq_no', '', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Fallback to 1 if SEQ_NO is undefined
          }
        } else {
          this.drawerData.seq_no = 1; // Default value if data is not valid
        }
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching district data:', err);
      }
    );

    this.drawerVisible = true;
    this.stateData = [];
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

  edit(data: DistrictMaster): void {
    this.drawerTitle = ' Update District';
    this.drawerData = Object.assign({}, data);

    console.log(data, 'asa');

    if (data.country_id) {
      const filter = `AND IS_ACTIVE = 1 AND COUNTRY_ID = ${data.country_id}`;
      this.api.getStateType(filter).subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.stateData = responseBody.data || [];
        } else {
          this.stateData = [];
          this.message.error('Failed To Get State Data', '');
        }
        // this.loadstates = false;
      });
    }

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
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }




  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;


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

  // isModalVisible = false; // Controls modal visibility
  // selectedQuery: string = ''; // Holds the query to display

  // toggleLiveDemo(query: string, name: string): void {
  //   console.log(query);
  //   this.selectedQuery = query;
  //   console.log(this.selectedQuery);
  //   // Assign the query to display
  //   this.isModalVisible = true; // Show the modal
  // }

  // handleCancel(): void {
  //   this.isModalVisible = false; // Close the modal
  //   this.selectedQuery = ''; // Clear the selected query
  // }

  // deleteItem(item: any) {
  //   this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  // }

  // handleLiveDemoChange(event: any) {
  //   this.visible = event;
  // }
  // toggleLiveDemo1() {
  //   this.visible = false;
  // }

  back() {
    this.drawerService.openDrawer();
  }


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
    this.drawerTitle = 'District Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[0]['options'] = this.countryData.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
    this.filterFields[1]['options'] = this.stateData.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
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
      key: 'country_id',
      label: 'Country',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Country',
    },

    {
      key: 'state_id',
      label: 'State',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select State',
    },

    {
      key: 'name',
      label: 'District',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter District',
    },

    {
      key: 'code',
      label: 'Short Code',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Short Code',
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
