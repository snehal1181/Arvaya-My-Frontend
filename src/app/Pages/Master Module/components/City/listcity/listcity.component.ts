import { Component } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse } from '@angular/common/http';
import { CityMaster } from '../../../Models/City';

@Component({
  selector: 'app-listcity',
  templateUrl: './listcity.component.html',
  styleUrls: ['./listcity.component.css']
})
export class ListcityComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: CityMaster = new CityMaster();
  formTitle = 'Manage City';
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
    // { label: 'Country', value: 'COUNTRY_ID' },
    { label: 'State', value: 'STATE_ID' },
    { label: 'District', value: 'DISTRICT_ID' },
    { label: 'City', value: 'NAME' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  visible = false;

  // Column Filter
  citytext: string = '';
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  selecteddistricts: number[] = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  districtVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' }
  ];

  filterQuery: string = '';
  columns: string[][] = [['STATE_NAME', 'State'], ['DISTRICT_NAME', 'District'], ['NAME', 'City'], ['IS_ACTIVE', 'Status']];
  adminId: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    // this.getCountyData();
    this.getStateData();
    this.getdistrictData();
  }

  showcolumn = [
    { label: 'Country', key: 'COUNTRY_NAME', visible: true },
    { label: 'State', key: 'STATE_NAME', visible: true },
    { label: 'District', key: 'DIST', visible: true },
    { label: 'City', key: 'NAME', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true }
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
  }

  // countryData: any = [];
  // getCountyData() {
  //   this.api.getAllCountryMaster(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
  //     (data) => {
  //       if (data["code"] == 200) {
  //         this.countryData = data["data"];
  //       } else {
  //         this.countryData = [];
  //         this.message.error("Failed To Get Country Data", "");
  //       }
  //     },
  //     () => {
  //       this.message.error("Something Went Wrong", "");
  //     }
  //   );
  // }

  stateData: any = [];
  getStateData() {
    this.api.getState(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
      (data) => {
        console.log(data, 'data')
        if (data["status"] == 200) {
          this.stateData = data.body["data"];
          console.log(this.stateData, 'stateData')

        } else {
          this.stateData = [];
          this.message.error("Failed To Get State Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }


  districtData: any = [];
  getdistrictData() {
    this.api.getDistrict(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
      (data) => {
        if (data["status"] == 200) {
          this.districtData = data.body["data"];
        } else {
          this.districtData = [];
          this.message.error("Failed To Get District Data", "");
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
  onDistrictChange(): void {
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
      likeQuery += (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.citytext.trim()}%'`;
    }

    // Country Filter
    // if (this.selectedCountries.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `COUNTRY_ID IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    // }

    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    if (this.selecteddistricts.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DISTRICT_ID IN (${this.selecteddistricts.join(',')})`; // Update with actual field name in the DB
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

    // Call API with updated search query
    this.api
      .getCity(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (data) => {
          console.log(data, 'dat89y76eda')
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            console.log(this.dataList, 'dataList')
          } else {
            this.dataList = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              "Network error: Please check your internet connection.",
              ""
            );
          } else {
            this.message.error("Something Went Wrong.", "");
          }
        }
      );
  }

  add(): void {
    this.drawerTitle = 'Add New City';
    this.drawerData = new CityMaster();

    this.api.getCity(1, 1, 'SEQ_NO', 'desc', '' + '').subscribe(data => {
      if (data['count'] == 0) {
        this.drawerData.SEQ_NO = 1;

      } else {
        this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
      }

    }, err => {
      console.log(err);
    })

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

  edit(data: CityMaster): void {
    this.drawerTitle = ' Update City';
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

  getComparisonOptions(selectedColumn: string): string[] {
    if (selectedColumn === 'COUNTRY_ID' || selectedColumn === 'STATE_ID' || selectedColumn === 'IS_ACTIVE' || selectedColumn === 'DISTRICT_ID') {
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

  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }

  insertSubCondition(conditionIndex: number, subConditionIndex: number) {

    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
    const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
    const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];

    if (!selection1) {
      this.message.error("Please select a column", '');
    } else if (!selection2) {
      this.message.error("Please select a comparison", '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error("Please enter a valid value with at least 1 characters", '');
    } else {

      console.log(conditionIndex, subConditionIndex);
      this.hide = false
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
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined || this.filterBox[i]['FILTER'][j]['SELECTION1'] == ''
      ||
      this.filterBox[i]['FILTER'][j][
      'SELECTION2'
      ] == undefined ||
      this.filterBox[i]['FILTER'][j][
      'SELECTION2'
      ] == '' ||
      this.filterBox[i]['FILTER'][j][
      'SELECTION3'
      ] == undefined ||
      this.filterBox[i]['FILTER'][j][
      'SELECTION3'
      ] == '' ||
      this.filterBox[i]['FILTER'][j][
      'CONDITION'
      ] == undefined ||
      this.filterBox[i]['FILTER'][j][
      'CONDITION'
      ] == null
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
  showquery: any
  isSpinner: boolean = false;
  createFilterQuery(): void {
    console.log(this.filterBox, 'filterdat');

    const lastFilterIndex = this.filterBox.length - 1; 1
    const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
    const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
    const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    console.log(selection4, 'selection4');

    if (!selection1) {
      this.message.error("Please select a column", '');
    } else if (!selection2) {
      this.message.error("Please select a comparison", '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error("Please enter a valid value with at least 1 characters", '');
    }

    else if (!selection4 && lastFilterIndex > 0) {
      this.message.error("Please Select the Operator", '');
    }

    else {

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
          }

          if (selection2 == 'Does not Contain') {
            this.query2 += `${selection1} NOT LIKE '%${selection3}%'`;
          }

          else if (selection2 == 'End With') {
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

      this.showquery = this.query
      console.log(this.showquery, 'showquery');


      var newQuery = ' AND ' + this.query
      console.log(newQuery);

      this.filterQuery1 = newQuery

      console.log(this.filterQuery1, 'this.filterQuerythis.filterQuery');

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api.getCity(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        newQuery
        // filterQuery
      ).subscribe(
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

  saveQuery() {
    // this.createFilterQuery();
    this.visiblesave = !this.visiblesave;
  }

  QUERY_NAME: string = '';
  name1: any
  name2: any
  INSERT_NAMES: any[] = [];

  handleOkTop(): void {
    // this.createFilterQuery();

    const lastFilterIndex = this.filterBox.length - 1; 1
    const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
    const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
    const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    console.log(selection4, 'selection4');

    if (!selection1) {
      this.message.error("Please select a column", '');
    } else if (!selection2) {
      this.message.error("Please select a comparison", '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error("Please enter a valid value with at least 1 characters", '');
    }

    else if (!selection4 && lastFilterIndex > 0) {
      this.message.error("Please Select the Operator", '');
    }

    else {

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
          }

          if (selection2 == 'Does not Contain') {
            this.query2 += `${selection1} NOT LIKE '%${selection3}%'`;
          }

          else if (selection2 == 'End With') {
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
      this.message.error('Please Enter Query Name', '')
    }
    else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      console.log(this.INSERT_NAMES);
      this.visiblesave = false;
      this.QUERY_NAME = ''; // Clear input after adding
    }
    this.visiblesave = false;
  }

  handleCancelTop(): void {
    this.visiblesave = false;
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(query: string, name: string): void {
    console.log(query)
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
    this.INSERT_NAMES = this.INSERT_NAMES.filter(i => i !== item);
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }


}
