import { Component } from '@angular/core';
import { RegistrationCouncil } from '../../../Models/RegistrationCouncil';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-list-registration-council',
  templateUrl: './list-registration-council.component.html',
  styleUrls: ['./list-registration-council.component.css'],
})
export class ListRegistrationCouncilComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: RegistrationCouncil = new RegistrationCouncil();
  formTitle = 'Manage Council Registrations';
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
    ['seq_no', 'Sequence Number'],
    ['state_name', 'state'],
    ['name', 'Councile'],
    ['is_active', 'Active Status'],
  ];

  adminId: any;
  Seqtext: any;
  nameVisible: any;
  Seqvisible = false;
  // Column Filter

  seqVisible: boolean = false;
  statusFilter: string | undefined = undefined;
  nameText: string = '';
  visible = false;

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'State Name', value: 'state_id' },
    { label: 'Council Name', value: 'name' },

    { label: 'Sequence No.', value: 'seq_no' },
    { label: 'Active Status', value: 'is_active' },
  ];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getStateData();
  }

  preventDefault(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();
    event.stopPropagation(); // Stop the event from propagating further

    document.getElementById('search')?.focus();

    if (event['key'] != 'Enter') {
      this.search();
    }
  }

  stateData: any = [];
  selectedStates: any = [];
  stateVisible: boolean = false;
  showcolumn = [
    // { label: 'Country Name', key: 'COUNTRY_NAME', visible: true },
    { label: 'State Name', key: 'state_name', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
    { label: 'Sequence Number', key: 'seq_no', visible: true },
    { label: 'Name', key: 'name', visible: true },
  ];

  getStateData() {
    const filter = `AND is_active = 1`;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {


        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.stateData = responseBody['data'];
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
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  onStateChange(): void {
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
  onKeyup(event: KeyboardEvent): void {


    // Check for Seqtext
    if (this.Seqtext && this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
    } else if (
      (!this.Seqtext || this.Seqtext.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }

    // Check for nameText
    if (this.nameText && this.nameText.length > 0 && event.key === 'Enter') {
      this.search();
    } else if (
      (!this.nameText || this.nameText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id'; // Sorting by SEQ_NO for specialization
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

    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    // NAME Filter
    if (
      this.nameText != null &&
      this.nameText != undefined &&
      this.nameText != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.nameText.trim()}%'`;
    }

    // Status Filter
    if (
      (this.statusFilter !== undefined) != null &&
      this.statusFilter != undefined &&
      this.statusFilter != ''
    ) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    //Seq no
    if (this.Seqtext && this.Seqtext.toString().trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `seq_no LIKE '%${this.Seqtext.toString().trim()}%'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');



    // Call API with updated search query
    this.api
      .getCouncilMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.loadingRecords = false;
          this.totalRecords = responseBody.count || 0; // Fallback for count
          this.dataList = responseBody.data || []; // Fallback for data
        } else {
          this.dataList = [];
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      });
  }

  reset(): void {
    this.searchText = '';
    this.Seqtext = '';
    this.nameText = '';
    this.selectedStates = '';
    this.statusFilter = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Council';
    this.drawerData = new RegistrationCouncil();

    this.api.getCouncilMaster(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;



        if (statusCode === 200) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Ensure fallback if data is malformed
          }

          this.drawerVisible = true;

        } else {
          console.error('Failed to get valid data:', responseBody);
        }
      },
      (err: HttpErrorResponse) => {
        // console.error('Error occurred while fetching Councile data:', err);
        this.message.error('Something Went Wrong.', '');
      }
    );

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

  edit(data: RegistrationCouncil): void {
    this.drawerTitle = ' Update Council';
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
    if (selectedColumn === 'IS_ACTIVE') {
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
  isSpinner: boolean = false;
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


      var newQuery = ' AND ' + this.query;


      this.filterQuery1 = newQuery;



      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api
        .getCouncilMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
          // filterQuery
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            this.isSpinner = false; // Ensure spinner is hidden after response

            if (statusCode === 200) {
              this.totalRecords = responseBody.count || 0; // Fallback for count
              this.dataList = responseBody.data || []; // Fallback for data
              this.isfilterapply = true; // Mark filter applied
              this.filterQuery = ''; // Clear filter query after success
            } else {
              this.dataList = [];
              this.isfilterapply = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.isSpinner = false; // Ensure spinner is hidden on error
            if (err.status === 0) {
              this.message.error(
                'Network error: Please check your internet connection.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong', '');
            }
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



      this.isSpinner = true;

      this.api
        .getCouncilMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          FILDATA
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            this.isSpinner = false; // Ensure the spinner is hidden after the response

            if (statusCode === 200) {
              this.totalRecords = responseBody.count || 0; // Fallback for count
              this.dataList = responseBody.data || []; // Fallback for data
              this.isfilterapply = true; // Mark filter as applied
            } else {
              this.dataList = [];
              this.isfilterapply = false; // Reset filter status
            }
          },
          (err: HttpErrorResponse) => {
            this.isSpinner = false; // Hide the spinner on error
            if (err.status === 0) {
              this.message.error(
                'Network error: Please check your internet connection.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong', '');
            }
          }
        );
    }
  }

  resetValues(): void {
    this.filterClass = 'filter-invisible';
    this.isfilterapply = false;
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

    this.selectedQuery = query;

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

  back() {
    this.drawerService.openDrawer();
  }
}
