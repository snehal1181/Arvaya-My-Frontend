import { Component } from '@angular/core';
import { ServiceMaster } from '../../../Models/ServiceMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-list-service-master',
  templateUrl: './list-service-master.component.html',
  styleUrls: ['./list-service-master.component.css'],
})
export class ListServiceMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: ServiceMaster = new ServiceMaster();
  formTitle = 'Manage Services';
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
    // ['COUNTRY_NAME', 'Country'],
    ['name', 'Service'],
    ['is_active', 'Active Status'],
  ];

  preventDefault(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();
    event.stopPropagation(); // Stop the event from propagating further

    document.getElementById('search')?.focus();

    if (event['key'] != 'Enter') {
      this.search();
    }
  }
  adminId: any;
  Seqtext: any;
  nameVisible: any;
  Seqvisible = false;
  // Column Filter

  seqVisible: boolean = false;
  statusFilter: string | undefined = undefined;
  serviceTypeVisible: boolean = false;
  nameText: string = '';
  visible = false;
  selectedServiceType: any;
  ServiceType: any;

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Service Name', value: 'name' },
    { label: 'Sequence No.', value: 'seq_no' },
    { label: 'Active Status', value: 'is_active' },
  ];
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  serviceTypes = [
    // { ID: 'H', LABEL: 'Hospital' },
    { ID: 'L', LABEL: 'Lab' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router ,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onServiceTypeChange(selected: any): void {
    this.ServiceType = selected;

    this.search();
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

  serviceTypeStatus : boolean = false
  namedataStatus : boolean = false
  seqVisibleStatus : boolean = false
  onKeyup(event: KeyboardEvent): void {
    // console.log(event, '  ', event.key);

  
    // Check for nameText
    if (this.nameText && this.nameText.length > 0 && event.key === 'Enter') {
      this.search();
      this.namedataStatus = true
    } else if (
      (!this.nameText || this.nameText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.namedataStatus = false
      this.search();
    }

      // Check for Seqtext
    if (this.Seqtext && this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.seqVisibleStatus = true
    } else if (
      (!this.Seqtext || this.Seqtext.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.seqVisibleStatus = false
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

    // NAME Filter
    if (
      this.nameText != null &&
      this.nameText != undefined &&
      this.nameText != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.nameText.trim()}%'`;
    }

    // TYPE Filter
    if (
      this.selectedServiceType != null &&
      this.selectedServiceType != undefined &&
      this.selectedServiceType != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `type LIKE '%${this.ServiceType.trim()}%'`;
              this.serviceTypeStatus = true

    }else
    {
      this.serviceTypeStatus = false
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

    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // console.log(likeQuery);

    this.api
      .getServiceMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + " AND type='L'" + this.filterQuery
      )
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.loadingRecords = false;
          this.TabId = responseBody.tab_id;
          this.totalRecords = responseBody.count || 0;
          this.dataList = responseBody.data || [];
        } else {
          this.dataList = [];
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      });
  }

  reset(): void {
    this.searchText = '';
    this.selectedServiceType = '';
    this.nameText = '';
    // this.specializationTypeText = '';

  this.serviceTypeStatus  = false
  this.namedataStatus  = false
  this.seqVisibleStatus  = false
    this.Seqtext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Service';
    this.drawerData = new ServiceMaster();

    this.api.getServiceMaster(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        // console.log(responseBody);

        if (statusCode === 200) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1;
          }
          this.drawerVisible = true;
        } else {
          // console.error('Failed to get valid data:', responseBody);
          this.message.error('Something Went Wrong.', '');
        }
      },
      (err: HttpErrorResponse) => {
        // console.error('Error occurred while fetching Service data:', err);
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

  edit(data: ServiceMaster): void {
    this.drawerTitle = ' Update Service';
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
      this.loadFilters()
    }
  }
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
    this.drawerTitle = 'Service Filter';
    // console.log('this.propertyData open', this.propertyData);

    // this.filterFields[0]['options'] = this.propertyData;
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
      label: 'Service Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Service',
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

  selectedFilter: string | null = null;
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
    back() {
    this.drawerService.openDrawer();
  }
}
