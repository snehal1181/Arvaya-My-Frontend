import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CountryData } from "../../../Models/CountryMasterData";
import { AppointmentData } from "../../../Models/AppointmentType";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
import { Router } from "@angular/router";
import { DrawerService } from "src/app/Service/drawer.service";
@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css']
})
export class AppointmentTableComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService ,
     private router: Router ,
     private drawerService: DrawerService
  ) {}

   back() {
    this.drawerService.openDrawer();
  }
  formTitle = "Manage Appointment Type's";
  searchText: string = "";
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = "name";
  sortValue: string = "desc";
  loadingRecords = false;
  totalRecords = 1;
  Country: any[] = [];
  columns: string[][] = [["name", "name"],["mode", "mode"],["is_active", "is_active"]];
  drawerCountryMappingVisible = false;
  drawerTitle = "Add New Country";
  drawerData: AppointmentData = new AppointmentData();
  drawervisible = false;
  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length == 0) {
      this.search();
    }
  }
  langseqtext: string = '';
appointmentdataStatus : boolean = false
langseqtextStatus : boolean = false
   onKeyup(event: KeyboardEvent): void {
    if (this.appointmentdata.length >= 3 && event.key === 'Enter') {
      this.search();
      this.appointmentdataStatus = true;
    } else if (this.appointmentdata.length == 0 && event.key === 'Backspace') {
      this.search();
      this.appointmentdataStatus = false;
    }
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc";
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
   
    var likeQuery = "";
    
    let globalSearchQuery = "";
    if (this.searchText !== "") {
      globalSearchQuery =
        " AND (" +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(" OR ") +
        ")";
    }

    if (this.appointmentdata !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `name LIKE '%${this.appointmentdata.trim()}%'`;
        this.appointmentdataStatus = true
    }else
    {
              this.appointmentdataStatus = false

    }
    // if (this.Shortcodetext !== "" || this.Shortcodetext !== null) {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") +
    //     `mode LIKE '%${this.Shortcodetext}%'`;
    // }

    
    if (this.Shortcodetext) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery +=`mode LIKE '%${this.Shortcodetext}%'`;
    }
    if (this.langseqtext !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `seq_no LIKE '%${this.langseqtext.trim()}%'`;
      this.langseqtextStatus = true

    }else
    {
            this.langseqtextStatus = false

    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `is_active = ${this.statusFilter}`;
    }
    this.loadingRecords = true;
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
   



      this.api
      .getAppointmentTypeData(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery)
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
  sort(params: NzTableQueryParams) {
    // this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || "id";
    const sortOrder = (currentSort && currentSort.value) || "desc";
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
  edit(data: AppointmentData): void {
    this.drawerTitle = "Update Appointment Type";
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
  }
  add(): void {
    this.drawerTitle = "Create New Appointment Type";
    this.drawerData = new AppointmentData();
    this.drawervisible = true;
   
    this.api.getAppointmentTypeData(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
           const statusCode = response.status;
           if (statusCode === 200) {
             if(response.body.count == 0 ){
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
  }
  //For Input
  appointmentdata: string = "";
  Countryvisible = false;
  Shortcodetext: string = "";
  ShortCodevisible = false;

  reset(): void {
    this.searchText = "";
    this.appointmentdata = "";
    this.Shortcodetext = "";
    this.search();
  }
  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onModeFilterChange(selectedmode:string){
    this.Shortcodetext = selectedmode;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  listOfMode: any[] = [
    { text: "In lab", value: "IL" },
    { text: "In Home", value: "IH" },
    { text: "Online", value: "ON" },
    { text: "Offline", value: "OF" },
  ];

  dataList: any = [];
  visible = false;
  filterQuery: string = "";
  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = "filter-invisible";
  columns1: { label: string; value: string }[] = [
    { label: "Appointment Type", value: "name" },
    { label: "Mode", value: "mode" },
    { label: "Sequance No", value: "seq_no" },

    { label: "Status", value: "is_active" },

  ];

  // Main Filter code
  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
      this.loadFilters()
    }
  }

  // Main Filter code
  hide: boolean = true;
  filterQuery1: any = "";
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    "=",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
    "Contains",
    "Does not Contain",
    "Start With",
    "End With",
  ];


  columns2: string[][] = [["AND"], ["OR"]];

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
  langseqVisible:boolean =false;

  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: "",
      COMPARISION_VALUE: "",
      TABLE_VALUE: "",
    });
  }

  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  operators: string[] = ["AND", "OR"];
  // QUERY_NAME: string = '';
  showQueriesArray = [];

  filterBox = [
    {
      CONDITION: "",
      FILTER: [
        {
          CONDITION: "",
          SELECTION1: "",
          SELECTION2: "",
          SELECTION3: "",
        },
      ],
    },
  ];

  addCondition() {
    this.filterBox.push({
      CONDITION: "",
      FILTER: [
        {
          CONDITION: "",
          SELECTION1: "",
          SELECTION2: "",
          SELECTION3: "",
        },
      ],
    });
  }




  /*******  Create filter query***********/
  query = "";
  query2 = "";
  showquery: any;
  isSpinner: boolean = false;


  restrictedKeywords = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "TRUNCATE",
    "ALTER",
    "CREATE",
    "RENAME",
    "GRANT",
    "REVOKE",
    "EXECUTE",
    "UNION",
    "HAVING",
    "WHERE",
    "ORDER BY",
    "GROUP BY",
    "ROLLBACK",
    "COMMIT",
    "--",
    ";",
    "/*",
    "*/",
  ];

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }
 

  public visiblesave = false;


  // QUERY_NAME: string = "";
  // name1: any;
  // name2: any;
  // INSERT_NAMES: any[] = [];











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
      this.drawerTitle = 'Appointment Type Filter';
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
        label: 'Appointment Type',
        type: 'text',
        comparators: [
          '=',
          '!=',
          'Contains',
          'Does Not Contains',
          'Starts With',
          'Ends With',
        ],
        placeholder: 'Enter Appointment Type',
      },

       {
        key: 'mode',
        label: 'Mode',
        type: 'select',
        comparators: ['=', '!='],
        options: [
          { value: 'IL', display: 'In Lab' },
          { value: 'IH', display: 'In Home' },
          { value: 'ON', display: 'Online' },
          { value: 'OF', display: 'Offline' },
        ],
        placeholder: 'Select Mode',
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

