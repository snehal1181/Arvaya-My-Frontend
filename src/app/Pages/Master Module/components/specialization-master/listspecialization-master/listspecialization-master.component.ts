import { Component } from '@angular/core';
import { SpecializationMaster } from '../../../Models/SpecializationMaster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-listspecialization-master',
  templateUrl: './listspecialization-master.component.html',
  styleUrls: ['./listspecialization-master.component.css'],
})
export class ListspecializationMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: SpecializationMaster = new SpecializationMaster();
  formTitle = 'Manage Specializations';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  professionText: string = '';
  specializationTypeText: string = '';
  specializationText: string = '';
  columns: string[][] = [
    ['profession', 'Profession'],
    ['specialization_type', 'Specialization Type'],
    ['specialization', 'Specialization'],
    ['is_active', 'Active Status'],
    ['seq_no', 'Sequence Number'],
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

  specializationTypes = [
    // { id: 'H', label: 'Hospital' },
    { id: 'L', label: 'Lab' },
  ];
  adminId: any;
  Seqtext: any;
  selectedSpecializationType: any;
  professionVisible: any;
  ShortCodevisible = false;
  Seqvisible = false;
  // Column Filter
  specializationTypeVisible: boolean = false;
  specializationVisible: boolean = false;
  seqVisible: boolean = false;
  // specializationTypeVisible : boolean = false

  selectedCountries: number[] = [];
  countryVisible: boolean = false;
  Specializationtext: string = '';
  SpecializationVisible: boolean = false;
  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  visible = false;

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Profession', value: 'profession' },
    { label: 'Specialization', value: 'specialization' },
    { label: 'Specialization Type', value: 'specialization_type' },
    { label: 'Sequence No.', value: 'seq_no' },
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
  }

  onSpecializationTypeChange(selected: any): void {
    this.specializationTypeText = selected;

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

  professionTextStatus: boolean = false;
  specializationTextStatus: boolean = false;
  seqTextStatus: boolean = false;
  selectedSpecializationTypeStatus: boolean = false;
  onKeyup(event: KeyboardEvent): void {
    // Check for Seqtext
    if (
      this.professionText &&
      this.professionText.length > 0 &&
      event.key === 'Enter'
    ) {
      this.professionTextStatus = true;
      this.search();
    } else if (
      (!this.professionText || this.professionText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.professionTextStatus = false;

      this.search();
    }

    // Check for nameText
    if (
      this.specializationText &&
      this.specializationText.length > 0 &&
      event.key === 'Enter'
    ) {
      this.specializationTextStatus = true;
      this.search();
    } else if (
      (!this.specializationText || this.specializationText.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.specializationTextStatus = false;
      this.search();
    }
    // Check for nameText
    if (this.Seqtext && this.Seqtext.length > 0 && event.key === 'Enter') {
      this.seqTextStatus = true;
      this.search();
    } else if (
      (!this.Seqtext || this.Seqtext.length === 0) &&
      event.key === 'Backspace'
    ) {
      this.seqTextStatus = false;
      this.search();
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

    // PROFESSION Filter
    if (
      this.professionText != null &&
      this.professionText != undefined &&
      this.professionText != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `profession LIKE '%${this.professionText.trim()}%'`;
    }

    // SPECIALIZATION Filter
    if (
      this.specializationText != null &&
      this.specializationText != undefined &&
      this.specializationText != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `specialization LIKE '%${this.specializationText.trim()}%'`;
    }

    // SPECIALIZATION_TYPE Filter
    if (
      this.selectedSpecializationType != null &&
      this.selectedSpecializationType != undefined &&
      this.selectedSpecializationType != ''
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `specialization_type LIKE '%${this.specializationTypeText.trim()}%'`;
      this.selectedSpecializationTypeStatus = true;
    } else {
      this.selectedSpecializationTypeStatus = false;
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
      .getSpecialization(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.loadingRecords = false;
          this.TabId = responseBody.tab_id;
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
    this.specializationText = '';
    this.professionText = '';
    this.specializationTypeText = '';
    this.statusFilter = '';
    this.Seqtext = '';
    this.professionTextStatus = false;
    this.specializationTextStatus = false;
    this.seqTextStatus = false;
    this.selectedSpecializationTypeStatus = false;
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Specialization';
    this.drawerData = new SpecializationMaster();

    this.api.getSpecialization(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        //

        if (statusCode === 200) {
          if (responseBody.count === 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = responseBody.data[0]?.seq_no + 1 || 1; // Ensure fallback if data is malformed
          }

          this.drawerVisible = true;
        } else {
          // ;
          this.message.error('Something Went Wrong.', '');
        }
      },
      (err: HttpErrorResponse) => {
        // ;
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

  edit(data: SpecializationMaster): void {
    this.drawerTitle = ' Update Specialization';
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
      this.loadFilters();
    }
  }

  isDeleting: boolean = false;

  deleteItem(item: any): void {
    this.isDeleting = true;
    this.api.deleteFilterById(item.id).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.id !== item.id
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
  back() {
    this.drawerService.openDrawer();
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
        ` AND tab_id = ${this.TabId} AND user_id = ${this.USER_ID}`
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
    this.drawerTitle = 'App User Filter';
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
      key: 'profession',
      label: 'Profession',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Profession',
    },
    {
      key: 'specialization',
      label: 'Specialization',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter specialization',
    },
    {
      key: 'specialization_type',
      label: 'Specialization type',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'L', display: 'Lab' },
        { value: 'H', display: 'Hospital' },
      ],
      placeholder: 'Select Status',
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
}
