import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { pincode } from '../../../Models/pincode';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';
@Component({
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.css'],
})
export class PincodesComponent {
  formTitle = 'Manage Pincodes';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  selectedCountries: any = [];
  columns: string[][] = [
    ['country_name', 'Country'],
    ['state_name', 'State'],
    ['district_name', 'District'],
    ['pincode_number', 'Pincode'],
    ['area_name', 'Area Name'],
  ];
  time = new Date();
  features = [];
  visible = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: pincode = new pincode();
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  distVisible: boolean = false;
  areaVisible: boolean = false;
  filterClass: string = 'filter-invisible';
  areatext: string = '';

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private drawerService: DrawerService
  ) { }
  columns1: { label: string; value: string }[] = [
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'district_id' },
    { label: 'Pincode', value: 'pincode_number' },
    { label: 'Area', value: 'area_name' },
    { label: 'Status', value: 'is_active' },
  ];
  ngOnInit() {
    // this.search();
    this.getStateData();
    this.getCountryData();
    this.getDistData();
    // this.getPincodeData();
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

  iscountryfilterApplied: boolean = false;
  isstatefilterApplied: boolean = false;
  isdistrictfilterApplied: boolean = false;
  ispincodefilterApplied: boolean = false;
  isareafilterApplied: boolean = false;


  onKeyup(event: KeyboardEvent): void {
    if (this.areatext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isareafilterApplied = true;
    } else if (this.areatext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isareafilterApplied = false;

    }

    if (this.pincodetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.ispincodefilterApplied = true;
    } else if (this.pincodetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ispincodefilterApplied = false;
    }
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
  countryData: any = [];
  getCountryData() {
    const filter = `AND is_active = 1`;
    this.api.getCountryType(filter).subscribe(
      (response: HttpResponse<any>) => {
        console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.countryData = responseBody['data'];
        } else {
          this.countryData = [];
          this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  // pincodeData: any = [];
  // getPincodeData() {
  //   // console.log('demosdd');

  //   const filter = `AND IS_ACTIVE = 1`;
  //   this.api.getPincodeType(filter).subscribe(
  //     (response: HttpResponse<any>) => {
  //       // console.log(response);

  //       const statusCode = response.status;
  //       const responseBody = response.body;

  //       if (statusCode === 200) {
  //         this.pincodeData = responseBody['data'];
  //       } else {
  //         this.pincodeData = [];
  //         this.message.error('Failed To Get Pincode Data', '');
  //       }
  //     },
  //     () => {
  //       this.message.error('Something Went Wrong', '');
  //     }
  //   );
  // }

  stateData: any = [];
  getStateData() {
    const filter = `AND is_active = 1`;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

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

  distData: any = [];
  getDistData() {
    // console.log('this.getDistData');

    const filter = `AND is_active = 1`;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.distData = responseBody['data'];
          // console.log(this.distData, 'distData');
        } else {
          this.distData = [];
          this.message.error('Failed To Get District Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);
    console.log('sortOrder :' + sortOrder);
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
  selectedStates: any = [];
  selectedDist: any = [];
  selectedPincodes: any = [];

  pincodetext: string = '';
  // distkeyup() {
  //   if (this.disttext.length >= 3) {
  //     this.search();
  //   } else if (this.disttext.length === 0) {
  //     this.dataList = [];
  //     this.search();
  //   } else if (this.disttext.length < 3) {
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

    // Country Filter
    if (this.areatext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `area_name LIKE '%${this.areatext.trim()}%'`;
    }

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
      this.iscountryfilterApplied = true;
    }
    else {
      this.iscountryfilterApplied = false;;

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

    if (this.selectedDist.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `district_id IN (${this.selectedDist.join(',')})`; // Update with actual field name in the DB
      this.isdistrictfilterApplied = true;
    }
    else {
      this.isdistrictfilterApplied = false;
    }

    // City Filter
    if (this.pincodetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `pincode_number LIKE '%${this.pincodetext.trim()}%'`;
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

    // Call API for Pincode data
    this.api
      .getAllPincode(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          this.loadingRecords = false;

          if (statusCode === 200) {
            this.TabId = responseBody.tab_id;
            this.totalRecords = responseBody.count || 0;
            this.dataList = responseBody.data || [];
          } else {
            this.dataList = [];
            this.message.error('Failed to get Pincode data.', '');
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
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Pincode';
    this.drawerData = new pincode();

    this.api
      .getAllPincode(1, 1, 'seq_no', '', '')
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        this.loadingRecords = false;

        if (statusCode === 200 && responseBody?.data) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Fallback to 1 if seq_no is undefined
          }
        } else {
          this.drawerData.seq_no = 1; // Default value if data is not valid
        }
      });

    this.drawerVisible = true;
  }
  districtData: any = [];
  EditstateData: any = [];

  edit(data: pincode): void {
    this.drawerTitle = 'Update Pincode Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    // console.log(data.COUNTRY_ID, ' ', data.STATE_ID, ' ', this.stateData);

    if (data.country_id) {
      this.EditstateData = this.stateData.filter(
        (item) => item.country_id === data.country_id
      );

      // console.log(this.EditstateData);

      if (data.state_id) {
        this.districtData = this.distData.filter(
          (item) => item.state_id === data.state_id
        );

        console.log(this.districtData);
      } else {
        this.districtData = [];
      }
    } else {
      this.EditstateData = [];
      this.districtData = [];
    }
  }

  close(): void {
    this.visible = false;
  }

  close1(accountMasterPage: NgForm) {
    this.drawerVisible1 = false;
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  nametext: string = '';
  emailtext: string = '';
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  PINCODEVisible: boolean = false;

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onSortClick(event: MouseEvent) {
    event.stopPropagation(); // Prevent sort from firing when clicking the header
  }
  showcolumn = [
    { label: 'Country Name', key: 'country_name', visible: true },
    { label: 'State Name', key: 'state_name', visible: true },
    { label: 'District Name', key: 'district_name', visible: true },
    { label: 'Pincode', key: 'pincode_number', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  onStateChange(): void {
    this.search();
  }

  onDistChange(): void {
    this.search();
  }

  reset(): void {
    this.searchText = '';
    // this.nametext = '';
    this.selectedDist = [];
    this.selectedStates = [];
    this.selectedCountries = [];
    this.pincodetext = '';
    this.areatext = '';

    this.search();
  }

  reset1(): void {
    this.searchText = '';
    this.emailtext = '';
    this.search();
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
    this.drawerTitle = 'Pincode Filter';
    // console.log('this.propertyData open', this.propertyData);
    this.filterFields[0]['options'] = this.countryData.map((data) => ({
      value: data.id,
      display: data.name,
    }));
    this.filterFields[1]['options'] = this.stateData.map((data) => ({
      value: data.id,
      display: data.name,
    }));
    this.filterFields[2]['options'] = this.distData.map((data) => ({
      value: data.id,
      display: data.name,
    }));
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
      key: 'country_id',
      label: 'Country',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select country',
    },
    {
      key: 'state_id',
      label: 'State',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select state',
    },
    {
      key: 'district_id',
      label: 'District',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select district',
    },
    {
      key: 'pincode_number',
      label: 'Pincode',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Pincode',
    },
    {
      key: 'area_name',
      label: 'Area',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Area',
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
  isfilterapply: boolean = false;
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
