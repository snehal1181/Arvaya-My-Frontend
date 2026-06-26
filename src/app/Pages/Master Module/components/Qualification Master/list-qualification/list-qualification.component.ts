import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { QualificationMaster } from '../../../Models/QualificationMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';


@Component({
  selector: 'app-list-qualification',
  templateUrl: './list-qualification.component.html',
  styleUrls: ['./list-qualification.component.css']
})
export class ListQualificationComponent {

  drawerVisible!: boolean;
  drawerTestMapping: boolean = false;
  drawerTechnicianMapping: boolean = false;
  drawerTechnicianserviceMapping: boolean = false;
  drawerTitle!: string;
  drawerTitle1!: string;
  drawerTitle2!: string;
  drawerTitle3!: string;
  drawerData: QualificationMaster = new QualificationMaster();
  formTitle = ' Manage Qualifications';
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
    { label: 'Qualification Type', value: 'qualification_type_id' },
    { label: 'Name', value: 'name' },
    { label: 'Status', value: 'is_active' },
  ];
  visible = false;

  // Column Filter
  nametext: string = '';
  QualificationType: number[] = [];
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
  columns: string[][] = [['name', 'Name'], ['short_code', 'Short Code'], ['is_active', 'Status']];
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
    this.getqualification();
    this.search();
  }

  showcolumn = [
    { label: 'Qualification Type', key: 'qualification_name', visible: true },
    { label: 'Name', key: 'name', visible: true },
    { label: 'Status', key: 'is_active', visible: true }
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
  }

  qualificationTypeData: any = []
  getqualification(): void {
    const filter = `AND is_active = 1`;
    this.api.getQualificationType(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.qualificationTypeData = response.body.data;
          } else {
            this.qualificationTypeData = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
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

  namedataStatus: boolean = false
  keyup1() {
    // console.log(this.nametext);

    if (this.nametext.length >= 3) {
      this.namedataStatus = true
      this.search();
    } else if (this.nametext.length === 0) {
      this.namedataStatus = false

      // this.dataList = [];
      this.search();
    } else if (this.nametext.length < 3) {
      this.namedataStatus = false

      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
  }

  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.namedataStatus = false;
    this.QualificationnamedataStatus = false;
    this.search(true);
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

  QualificationnamedataStatus: boolean = false
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
    if (this.nametext !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `name LIKE '%${this.nametext.trim()}%'`;
    }

    // Country Filter
    if (this.QualificationType.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `qualification_type_id IN (${this.QualificationType.join(',')})`; // Update with actual field name in the DB

      this.QualificationnamedataStatus = true
    } else {
      this.QualificationnamedataStatus = false

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
      .getQualification(
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
            this.tab_id = response.body.tab_id;
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
    this.drawerTitle = 'Create New Qualification ';
    this.drawerData = new QualificationMaster();

    this.api.getQualification(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;



        if (statusCode === 200) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Ensure fallback if data is malformed
          }
        } else {

        }
      },
      (err: HttpErrorResponse) => {
        // 
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

  edit(data: QualificationMaster): void {
    this.drawerTitle = ' Update Qualification';
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

  restrictedKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER", "CREATE", "RENAME", "GRANT", "REVOKE", "EXECUTE", "UNION", "HAVING", "WHERE", "ORDER BY", "GROUP BY", "ROLLBACK", "COMMIT", "--", ";", "/*", "*/"
  ];

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }


  public visiblesave = false;



  // QUERY_NAME: string = '';
  // name1: any
  // name2: any
  // INSERT_NAMES: any[] = [];




  // handleLiveDemoChange(event: any) {
  //   this.visible = event;
  // }
  // toggleLiveDemo1() {
  //   this.visible = false;
  // }




  selectedFilter: string | null = null;


  tab_id: number;
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
        ` AND tab_id = ${this.tab_id} AND user_id = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = '';
            // 
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
    this.drawerTitle = 'Qualification Filter';
    this.filterFields[0]['options'] = this.qualificationTypeData.map((data) => ({
      value: data.id,
      display: data.name
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
      key: 'qualification_type_id',
      label: 'Qualification Type',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Qualification Type',
    },

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
    this.selectedFilter = item.id;
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
