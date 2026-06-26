import { Component } from '@angular/core';
import { Healthsurveyquestions } from '../../../Models/HealthSurveyQuestions';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-list-healthsurveyquestions',
  templateUrl: './list-healthsurveyquestions.component.html',
  styleUrls: ['./list-healthsurveyquestions.component.css'],
})
export class ListHealthsurveyquestionsComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Healthsurveyquestions = new Healthsurveyquestions();
  formTitle = 'Manage Health Survey Questions';
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  genderVisible: boolean;
  selectedGender: any;

  listOfGender: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
  ];
  // Main filter
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;

  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);

  filterClass: string = 'filter-invisible';
  isDeleting: boolean = false;
  savedFilters: any[] = [];
  selectedFilter: string | null = null;
  oldFilter: any[] = [];
  distinctData: any[] = [];
  filterFields: any[] = [
    {
      key: 'question',
      label: 'Question',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Question',
    },

    {
      key: 'input_type',
      label: 'Input Type',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'R', display: 'Radio Button' },
        { value: 'D', display: 'Dropdown' },
        { value: 'I', display: 'Input' },
        { value: 'DP', display: 'Datepicker' },
      ],
      placeholder: 'Select Input Type',
    },
    {
      key: 'question_for',
      label: 'Question For',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'M', display: 'Male' },
        { value: 'F', display: 'Female' },
        { value: 'O', display: 'Other' },
        { value: 'A', display: 'All' },
      ],
      placeholder: 'Select Option',
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
  // Main Filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

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

  applyfilter(item) {
    // console.log(item);

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  deleteItem(item: any): void {
    this.isDeleting = true;
    this.api.deleteFilterById(item.ID).subscribe(
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

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  openfilter() {
    this.drawerTitle = 'Country Filter';
    this.drawerFilterVisible = true;
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }

  onFilterApplied(obj) {
    console.log(obj);

    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
  }

  visible: boolean = false;
  categoryvisible: boolean = false;
  pointsvisible: boolean = false;

  // Column Filter

  questionText: string = '';
  categoryText: string = '';
  pointsText: string = '';

  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  // listOfFilter: any[] = [
  //   { text: 'Active', value: '1' },
  //   { text: 'Inactive', value: '0' }
  // ];

  filterQuery: string = '';
  columns: string[][] = [
    ['question', 'Name'],
    ['category', 'Category'],
    ['points', 'Points'],
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

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
  }

  showcolumn = [
    { label: 'Question', key: 'question', visible: true },
    { label: 'Category', key: 'category', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Question For', key: 'question_for', visible: true },

    { label: 'Points', key: 'points', visible: true },
    { label: 'Input Type', key: 'input_type', visible: true },
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
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

  inputTypeText: string = '';
  questionForText: string = '';
  inputTypeVisible: boolean = false;
  questionForVisible: boolean = false;
  QuestionAppliedStatus: boolean = false;
  CategoryAppliedStatus: boolean = false;
  InputTypeAppliedStatus: boolean = false;
  QuestionForAppliedStatus: boolean = false;
  PointsAppliedStatus: boolean = false;


  onKeyup(event?: KeyboardEvent): void {
    this.QuestionAppliedStatus = this.questionText.length >= 3;
    this.CategoryAppliedStatus = this.categoryText.length >= 1;

    this.InputTypeAppliedStatus = this.inputTypeText.length > 0;
    this.QuestionForAppliedStatus = this.questionForText.length > 0;

    // Decide when to call search()
    if (
      this.QuestionAppliedStatus ||
      this.CategoryAppliedStatus ||
      this.InputTypeAppliedStatus ||
      this.QuestionForAppliedStatus ||
      this.pointsText.length >= 3 || // if points also has search
      (this.questionText.length === 0 &&
        this.categoryText.length === 0 &&
        this.inputTypeText.length === 0 &&
        this.questionForText.length === 0 &&
        this.pointsText.length === 0) // if all cleared
    ) {
      this.search();
    }
  }

  reset(): void {
    this.searchText = '';
    this.questionText = '';
    this.questionForText = '';
    this.categoryText = '';
    this.pointsText = '';
    this.inputTypeText = '';
    this.search();
  }

  // onStatusFilterChange(selectedStatus: string) {
  //   this.statusFilter = selectedStatus;
  //   this.search(true);
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

    // Global search
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => `${column[0]} like '%${this.searchText}%'`)
          .join(' OR ') +
        ')';
    }

    // Question
    if (this.questionText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `question LIKE '%${this.questionText.trim()}%'`;
      this.QuestionAppliedStatus = true;
    } else {
      this.QuestionAppliedStatus = false;
    }

    // Category
    if (this.categoryText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `category LIKE '%${this.categoryText.trim()}%'`;
      this.CategoryAppliedStatus = true;
    } else {
      this.CategoryAppliedStatus = false;
    }

    // Points
    if (this.pointsText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `points LIKE '%${this.pointsText.trim()}%'`;

      this.PointsAppliedStatus = true
    } else {
      this.PointsAppliedStatus = false
    }

    // Input Type
    if (this.inputTypeText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `input_type = '${this.inputTypeText}'`;
      this.InputTypeAppliedStatus = true;
    } else {
      this.InputTypeAppliedStatus = false;
    }

    // Question For
    if (this.questionForText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `question_for = '${this.questionForText}'`;
      this.QuestionForAppliedStatus = true;
    } else {
      this.QuestionForAppliedStatus = false;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    // Call API with updated search query
    this.api
      .getHealthsurveyquestions(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          // console.log(data, 'dat89y76eda');
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data.tab_id;

            console.log(this.dataList, 'dataList');
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
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  add(): void {
    this.tags = [];
    this.drawerTitle = 'Add New Health Survey Question';
    this.drawerData = new Healthsurveyquestions();

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

  tags: any = [];
  edit(data: Healthsurveyquestions): void {
    console.log(data);

    this.tags = JSON.parse(data.input_value);
    this.drawerTitle = ' Update New Health Survey Question';
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

  // Main Filter code
  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }
}
