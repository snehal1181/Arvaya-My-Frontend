// import { StateMaster } from '../../Models/state';

import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StateMaster } from '../../../Models/state';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-liststate',
  templateUrl: './liststate.component.html',
  styleUrls: ['./liststate.component.css'],
})
export class ListstateComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: StateMaster = new StateMaster();
  formTitle = 'Manage States';
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
    ['name', 'State Name'],
    ['code', 'Code'],
    ['country_name', 'Country'],
    ['seq_no', 'Sequence Number'],
    ['is_active', 'Active Status'],
  ];
  adminId: any;
  Seqtext: string = '';
  Shortcodetext: string = '';
  ShortCodevisible = false;
  Seqvisible = false;

  // Column Filter
  selectedCountries: number[] = [];
  countryVisible: boolean = false;
  statetext: string = '';
  stateVisible: boolean = false;
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  visible = false;
  iscoutryfilterApplied: boolean = false;
  isstatefilterApplied: boolean = false;
  isshortcodefilterApplied: boolean = false;
  isseqnofilterApplied: boolean = false;

  onKeyup(event: KeyboardEvent): void {
    console.log(this.statetext, this.Shortcodetext, this.Seqtext,);

    if (this.statetext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isstatefilterApplied = true;
    } else if (this.statetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isstatefilterApplied = false;
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
      this.isseqnofilterApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isseqnofilterApplied = false;
    }
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
  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'name' },
    { label: 'Status', value: 'is_active' },
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
    this.getCountyData();
  }

  countryData: any = [];
  getCountyData() {
    this.api.getCountryData(0, 0, '', 'asc', 'AND IS_ACTIVE = 1').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        // console.log(statusCode, responseBody);

        if (statusCode === 200) {
          this.countryData = responseBody.data || []; // Fallback to empty array if data is not available
        } else {
          this.countryData = [];
          this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: HttpErrorResponse) => {
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

  onCountryChange(): void {
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
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

  // statekeyup() {
  //   if (this.statetext.length >= 3) {
  //     this.search();
  //   } else if (this.statetext.length === 0) {
  //     this.dataList = [];
  //     this.search();
  //   } else if (this.statetext.length < 3) {
  //     // this.message.warning("Please Enter at least Three Characters ...", "");
  //   }
  // }

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
    if (this.statetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.statetext.trim()}%'`;
      this.isstatefilterApplied = true;
    }
    else {
      this.isstatefilterApplied = false;
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

    //Short Code
    if (this.Shortcodetext && this.Shortcodetext.trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `code LIKE '%${this.Shortcodetext.trim()}%'`;
    } else {
      this.isshortcodefilterApplied = false
    }

    //Seq no
    if (this.Seqtext && this.Seqtext.trim() !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `seq_no LIKE '%${this.Seqtext.trim()}%'`;
    } else {
      this.isseqnofilterApplied = false
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

    // console.log(likeQuery);

    // Call API with updated search query
    this.api
      .getState(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.loadingRecords = false;
          this.TabId = responseBody.TAB_ID;
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
    this.statetext = '';
    this.Shortcodetext = '';
    this.selectedCountries = [];
    this.Seqtext = '';
    this.statusFilter = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New State';
    this.drawerData = new StateMaster();

    this.api.getState(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        console.log(responseBody);

        if (statusCode === 200) {
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

  edit(data: StateMaster): void {
    this.drawerTitle = ' Update State';
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
    this.drawerTitle = 'State Filter';
    // console.log('this.propertyData open', this.propertyData);
    this.filterFields[0]['options'] = this.countryData.map((data) => ({
      value: data.id,
      display: data.name,
    }));
    // this.filterFields[1]['options'] = this.stateData.map((data) => ({
    //   value: data.ID,
    //   display: data.NAME,
    // }));
    // this.filterFields[2]['options'] = this.distData.map((data) => ({
    //   value: data.ID,
    //   display: data.NAME,
    // }));
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
      key: 'country_name',
      label: 'Country',
      type: 'text',
      comparators: ['=', '!='],
      placeholder: 'Enter country',
    },
    {
      key: 'name',
      label: 'State',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter State',
    },
    {
      key: 'code',
      label: 'Short code',
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
  // isfilterapply: boolean = false;
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
