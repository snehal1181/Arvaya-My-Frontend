import { Component } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CityMaster } from '../../../Models/City';
import { TaxCatlog } from '../../../Models/ManageTax';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';
@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.css'],
})
export class ManageTableComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: TaxCatlog = new TaxCatlog();
  formTitle = 'Manage Tax Catalogs';
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
    // { label: 'Hospital', value: 'hospital_name' },
    { label: 'Tax Name', value: 'tax_name' },
    { label: 'Lab', value: 'lab_name' },
    { label: 'Tax Type', value: 'tax_type' },
    { label: 'Value', value: 'value' },
    { label: 'Status', value: 'is_active' },
  ];
  visible = false;

  // Column Filter
  taxnamelabel1: string = '';
  valuefil: any;
  selectedCountries: number[] = [];
  selectedLab: number[] = [];
  selectedStates: number[] = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  valueVisible: boolean = false;
  labVisible: boolean = false;

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['lab_name', 'lab_name'],
    // ['hospital_name', 'hospital_name'],
    ['tax_name', 'tax_name'],
    ['is_active', 'Status'],
    ['tax_type', 'tax_type'],
    ['value', 'value'],
  ];
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
  commonFunction = new CommonFunctionService();
  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    // this.getHospitalData();
    this.getLabData();
  }

  showcolumn = [
    { label: 'Hospital', key: 'hospital_name', visible: true },
    { label: 'Tax Name', key: 'tax_name', visible: true },
    { label: 'Lab', key: 'lab_name', visible: true },
    { label: 'Tax Type', key: 'tax_type', visible: true },
    { label: 'Value', key: 'value', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];
  listOfMode: any[] = [
    { text: 'Hospital', value: 'HO' },
    { text: 'Lab', value: 'LA' },
  ];
  Shortcodetext: string = '';
  listOftax: any[] = [
    { text: 'Percent', value: 'PA' },
    { text: 'Fix Amount', value: 'FA' },
  ];
  taxtext: string = '';
  onTaxFilterChange(selectedmode: string) {
    this.taxtext = selectedmode;
    this.search(true);
  }
  onModeFilterChange(selectedmode: string) {
    this.Shortcodetext = selectedmode;
    this.search(true);
  }
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  countryData: any = [];
  entityData: any = [];
  getHospitalData() {
    const filter = `AND is_active = 1`;
    this.api.getHospitalList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.entityData = data.body['data'];
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
  labData: any[] = [];

  // labId = sessionStorage.getItem('labId');
  // decreptedlabIDDString = this.labId
  //   ? this.commonFunction.decryptdata(this.labId)
  //   : '';
  // labID = parseInt(this.decreptedlabIDDString, 10);
  getLabData() {
    var extrafilter = '';
    if (this.labID && this.decreptedroleId !== 1) {
      extrafilter = ' AND id=' + this.labID;
    }

    // const filter = extrafilter;
    const filter = `AND is_active = 1` + extrafilter;
    this.api.getLabList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.labData = data.body['data'];
        } else {
          this.labData = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
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
    this.taxnamelabel1 = '';
    this.valuefil = '';
    this.Shortcodetext = '';
    this.taxtext = '';
    this.taxnamelabel = false
    this.labnamelabel = false
    this.search();
  }

  onCountryChange(): void {
    this.search();
  }
  onLabChange(): void {
    this.search();
  }
  onStateChange(): void {
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  taxnamelabel: boolean = false
  labnamelabel: boolean = false
  keyup1() {
    // console.log(this.nametext);

    if (this.taxnamelabel1.length >= 3) {
      this.taxnamelabel = true
      this.search();
    } else if (this.taxnamelabel1.length === 0) {
      this.taxnamelabel = false

      // this.dataList = [];
      this.search();
    } else if (this.taxnamelabel1.length < 3) {
      this.taxnamelabel = false

      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
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

    // City Filter
    if (this.taxnamelabel1 !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `tax_name LIKE '%${this.taxnamelabel1.trim()}%'`;
    }

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `hospital_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }

    if (this.selectedLab.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `lab_id IN (${this.selectedLab.join(',')})`; // Update with actual field name in the DB

      this.labnamelabel = true
    } else {
      this.labnamelabel = false

    }
    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }

    if (this.valuefil) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `value = ${this.valuefil}`;
    }

    // if (this.Shortcodetext !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") +
    //     `ENTITY_TYPE LIKE '%${this.Shortcodetext}%'`;
    // }
    // if (this.taxtext !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") +
    //     `TAX_TYPE LIKE '%${this.taxtext}%'`;
    // }
    if (this.taxtext) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `tax_type LIKE '%${this.taxtext}%'`;
    }
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // Call API with updated search query
    var extrafilter = ''
    if (this.labID && this.decreptedroleId !== 1) {
      extrafilter = ' AND LAB_ID=' + this.labID
    }
    this.api
      .getTaxCatlog(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extrafilter + this.filterQuery
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
    this.drawerTitle = 'Add New Tax Catalog';
    this.drawerData = new TaxCatlog();

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

  edit(data: TaxCatlog): void {
    this.drawerTitle = ' Update Tax Catalog';
    this.drawerData = Object.assign({}, data);
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
    this.drawerTitle = 'Tax Catalog Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[1]['options'] = this.labData.map((data) => ({
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
      key: 'tax_name',
      label: 'Tax Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Tax Name',
    },

    {
      key: 'lab_id',
      label: 'Lab Name',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Lab',
    },

    {
      key: 'tax_type',
      label: 'Tax Type',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'PA', display: 'Percent' },
        { value: 'FA', display: 'Fixed Amount' },
      ],
      placeholder: 'Select Tax Type',
    },

    {
      key: 'value',
      label: 'Value',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Value',
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
