import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabbillCatalogue } from '../../../Models/Labbillcatalogue';
// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-lab-bill-catalogue-master',
  templateUrl: './lab-bill-catalogue-master.component.html',
  styleUrls: ['./lab-bill-catalogue-master.component.css'],
})
export class LabBillCatalogueMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: LabbillCatalogue = new LabbillCatalogue();
  formTitle = 'Manage Lab Bill Catalogues';
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
    ['LAB_ID', 'Lab ID'],
    ['MODE', 'Mode'],
    // ['TYPE', 'Type'],
    ['PACKAGE_ID', 'Package ID'],
    ['TEST_ID', 'Test ID'],
    ['TAX_ID', 'Tax ID'],
    ['BILL_AMOUNT', 'Bill Amount'],
    ['TOTAL_PRICE', 'Total Price'],
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
    { label: 'Lab', key: 'LAB_ID', visible: true },
    { label: 'Mode', key: 'MODE', visible: true },
    // { label: 'Type', key: 'TYPE', visible: true },
    { label: 'Package', key: 'PACKAGE_ID', visible: true },
    { label: 'Test', key: 'TEST_ID', visible: true },
    { label: 'Tax', key: 'TAX_ID', visible: true },
    { label: 'Bill Amount', key: 'BILL_AMOUNT', visible: true },
    { label: 'Total Price', key: 'TOTAL_PRICE', visible: true },
    { label: 'Is Active', key: 'IS_ACTIVE', visible: true },
  ];
  labIdVisible: boolean;
  modeVisible: boolean;
  typeVisible: boolean;
  packageIdVisible: boolean;
  testIdVisible: boolean;
  taxIdVisible: boolean;
  billAmountVisible: boolean;
  totalPriceVisible: boolean;
  isActiveVisible: boolean;
  selectedLabId: any;
  labIdOptions: any;
  selectedMode: any;
  modeOptions: any=[
    { text: 'Online', value: 'ON' },
    { text: 'Offline', value: 'OF' },
  ]
  ;
  selectedPackage: any;
  packageIdOptions: any;
  selectedType: any;
  typeOptions: any;
  selectedTestId: any;
  testIdOptions: any;
  selectedTaxId: any;
  taxIdOptions: any;
  billAmountText: any;
  totalPriceText: any;

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Lab', value: 'LAB_ID' },
    { label: 'Mode', value: 'MODE' },
    // { label: 'Type', value: 'TYPE' },
    { label: 'Package', value: 'PACKAGE_ID' },
    { label: 'Test', value: 'TEST_ID' },
    { label: 'Tax', value: 'TAX_ID' },
    { label: 'Bill Amount', value: 'BILL_AMOUNT' },
    { label: 'Total Price', value: 'TOTAL_PRICE' },
    { label: 'Is Active', value: 'IS_ACTIVE' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService ,
     private router: Router ,
     private drawerService: DrawerService
  ) {}
  back() {
    this.drawerService.openDrawer();
  }


  public commonFunction=new CommonFunctionService()

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getDropdowns();
    
  }
roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
 getDropdowns(){
   var extraFilter=''
   var extraFilter2=""
    if(this.labID && this.decreptedroleId!==1){
       extraFilter=' AND ID='+this.labID
       extraFilter2=' AND LAB_ID='+this.labID
    }
   let filter=" AND IS_ACTIVE=1"
   this.api.getLabType(filter + extraFilter).subscribe((res:HttpResponse<any>)=>{
    if(res.status==200){
      this.labIdOptions=res.body.data
    }
    else{
      this.labIdOptions=[]
    }
   })
   this.api.getLabPackageList(filter + extraFilter2).subscribe((res:HttpResponse<any>)=>{
    if(res.status==200){
      this.packageIdOptions=res.body.data
    }
    else{
      this.packageIdOptions=[]
    }
   })
   this.api.getTestMasterList(filter).subscribe((res:HttpResponse<any>)=>{
    if(res.status==200){
      this.testIdOptions=res.body.data
    }
    else{
      this.testIdOptions=[]
    }
   })
   let filter2=" AND IS_ACTIVE=1"
   this.api.getTaxList(filter2 + extraFilter2).subscribe((res:HttpResponse<any>)=>{
    if(res.status==200){
      this.taxIdOptions=res.body.data
    }
    else{
      this.taxIdOptions=[]
    }
   })
 }


  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
   
    this.search(true);
  }
  onModeChange(selectedStatus: string) {
    this.selectedMode = selectedStatus;
   
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
   labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  
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

    if (this.billAmountText?.trim()) {
      likeQuery += `BILL_AMOUNT LIKE '%${this.billAmountText.trim()}%' `;
    }
    if (this.totalPriceText?.trim()) {
      likeQuery += (likeQuery ? ' AND ' : '') + `TOTAL_PRICE LIKE '%${this.totalPriceText.trim()}%' `;
    }
  
    // Dropdown Filters
    if (this.selectedLabId?.length) {
      likeQuery += (likeQuery ? ' AND ' : '') + `LAB_ID IN (${this.selectedLabId.join(',')}) `;
    }
    if (this.selectedMode) {
      likeQuery += (likeQuery ? ' AND ' : '') + `MODE = '${this.selectedMode}' `;
    }
    if (this.selectedPackage?.length) {
      likeQuery += (likeQuery ? ' AND ' : '') + `PACKAGE_ID IN (${this.selectedPackage.join(',')}) `;
    }
    // if (this.selectedType) {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `TYPE = '${this.selectedType}' `;
    // }
    if (this.selectedTestId?.length) {
      likeQuery += (likeQuery ? ' AND ' : '') + `TEST_ID IN (${this.selectedTestId.join(',')}) `;
    }
    if (this.selectedTaxId?.length) {
      likeQuery += (likeQuery ? ' AND ' : '') + `TAX_ID IN (${this.selectedTaxId.join(',')}) `;
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


    
    let extraFilter =''
    let rawData=sessionStorage.getItem('roleId')
    let userId=rawData?this.commonFunction.decryptdata(rawData):null
    if(userId && userId!='1'){
      extraFilter=" AND LAB_ID="+this.labID
    }

    // Call API with updated search query
    this.api
      .getLabBillCatalogue(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + this.filterQuery
      )
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
    // this.statetext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Lab bill catalogue';
    this.drawerData = new LabbillCatalogue();

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

  edit(data: LabbillCatalogue): void {
    this.drawerTitle = ' Update Lab bill catalogue';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    // this.selectedType
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


  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }
 



  

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
      this.drawerTitle = 'Lab Bill Catalogue Filter';
      // console.log('this.propertyData open', this.propertyData);
  
      this.filterFields[0]['options'] = this.labIdOptions.map((data)=>({
        value:data.ID,
        display:data.NAME
      }));
      this.filterFields[2]['options'] = this.packageIdOptions.map((data)=>({
        value:data.ID,
        display:data.PACKAGE_NAME
      }));
      this.filterFields[3]['options'] = this.testIdOptions.map((data)=>({
        value:data.ID,
        display:data.NAME
      }));
      this.filterFields[4]['options'] = this.taxIdOptions.map((data)=>({
        value:data.ID,
        display:data.TAX_NAME
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
        key: 'LAB_ID',
        label: 'Lab',
        type: 'select',
        comparators: [
          '=',
          '!='
        ],
        placeholder: 'Select lab',
      },

       {
        key: 'MODE',
        label: 'Mode',
        type: 'select',
        comparators: ['=', '!='],
        options: [
          { value: 'ON', display: 'Online' },
          { value: 'OF', display: 'Offline' },
        ],
        placeholder: 'Select Mode',
      },

      {
        key: 'PACKAGE_ID',
        label: 'Package',
        type: 'select',
        comparators: [
          '=',
          '!='
        ],
        placeholder: 'Select Package',
      },

      {
        key: 'TEST_ID',
        label: 'Test',
        type: 'select',
        comparators: [
          '=',
          '!='
        ],
        placeholder: 'Select Test',
      },
      
      {
        key: 'TAX_ID',
        label: 'Tax',
        type: 'select',
        comparators: [
          '=',
          '!='
        ],
        placeholder: 'Select Tax',
      },

      {
        key: 'BILL_AMOUNT',
        label: 'Bill Amount',
        type: 'text',
        comparators: [
          '=',
          '!=',
          'Contains',
          'Does Not Contains',
          'Starts With',
          'Ends With',
        ],
        placeholder: 'Enter Bill Amount',
      },

      {
        key: 'TOTAL_PRICE',
        label: 'Total Price',
        type: 'text',
        comparators: [
          '=',
          '!=',
          'Contains',
          'Does Not Contains',
          'Starts With',
          'Ends With',
        ],
        placeholder: 'Enter Total Price',
      },

    
      {
        key: 'IS_ACTIVE',
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
