import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabPackage } from '../../../Models/LabPackage';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LabPackageMapping } from '../../../Models/LabPackageMap';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';

@Component({
  selector: 'app-lab-package-master',
  templateUrl: './lab-package-master.component.html',
  styleUrls: ['./lab-package-master.component.css'],
})
export class LabPackageMasterComponent {
  closeTestMapping() {
    throw new Error('Method not implemented.');
  }

  sortData(arg0: string, $event: string | null) {
    throw new Error('Method not implemented.');
  }

  closetestMapping() {
    throw new Error('Method not implemented.');
  }
  saveMapping(arg0: boolean) {
    throw new Error('Method not implemented.');
  }
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: LabPackage = new LabPackage();
  formTitle = "Manage Lab Package's";
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
    ['package_name', 'package_name'],
    ['lab_name', 'lab_name'],
    ['description', 'description'],
    ['category_name', 'category_name'],
    ['instruction', 'instruction'],
    ['is_active', 'is_active'],
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
    { label: 'Package name', key: 'package_name', visible: true },
    { label: 'Lab', key: 'lab_name', visible: true },
    { label: 'Description', key: 'description', visible: true },
    { label: 'Category', key: 'category_name', visible: true },
    { label: 'Instruction', key: 'instructions', visible: true },

    { label: 'Status', key: 'is_active', visible: true },
  ];
  labIdOptions: any;
  modeOptions: any;
  typeOptions: any;
  packageIdOptions: any;
  testIdOptions: any;
  taxIdOptions: any;
  hospitalIdVisible: boolean;
  doctorIdVisible: boolean;
  consultationModeVisible: boolean;
  consultationTypeIdVisible: boolean;
  billAmountVisible: boolean;
  taxIdVisible: boolean;
  totalAmountVisible: boolean;
  selectedHospitalId: any;
  hospitalIdOptions: any;
  selectedDoctorId: any;
  doctorIdOptions: any;
  selectedConsultationMode: any;
  consultationModeOptions: any;
  selectedConsultationType: any;
  consultationTypeOptions: any;
  billAmountText: any;
  selectedTaxId: any;
  totalAmountText: any;
  selectedIsActive: any;
  isActiveOptions: any;
  catalogIdVisible: boolean;
  appointmentIdVisible: boolean;
  paymentInfoVisible: boolean;
  paymentStatusVisible: boolean;
  paymentDateVisible: boolean;
  selectedCatalogId: any;
  catalogIdOptions: any;
  selectedAppointmentId: any;
  appointmentIdOptions: any;
  selectedPaymentInfo: any;
  paymentInfoOptions: any;
  selectedPaymentStatus: any;
  paymentStatusOptions: any;
  paymentDateText: any;
  nameVisible: boolean;
  descriptionVisible: boolean;
  categoryIdVisible: boolean;
  instructionVisible: boolean;
  seqNoVisible: boolean;
  isActiveVisible: boolean;
  selectedName: any;
  nameOptions: any;
  seqNoText: any;
  descriptionText: any;
  selectedCategoryId: any;
  categoryIdOptions: any;
  instructionText: any;
  dateVisible: boolean;
  startTimeVisible: boolean;
  endTimeVisible: boolean;
  isBlockedVisible: boolean;
  blockedReasonVisible: boolean;
  isBookedVisible: boolean;
  selectedDate: any;
  startTime: any;
  endTime: any;
  isBlocked: any;
  blockedReasonText: any;
  isBooked: any;
  packageNameVisible: boolean;
  labIdVisible: boolean;
  instructionsVisible: boolean;
  durationVisible: boolean;
  packageName: any;
  labId: number[] = [];
  labs: any;
  description: any;
  instructions: any;
  duration: any;
  categoryId: number[] = [];
  categories: any;
  isActive: any;
  seqNo: any;
  testMappingTitle: any;
  packageList: any[];
  doctorMappingData = new LabPackageMapping();
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Package name', value: 'package_name' },
    { label: 'Lab', value: 'lab_name' },
    { label: 'Description', value: 'description' },
    { label: 'Category', value: 'category_name' },
    { label: 'Instruction', value: 'instructions' },
    { label: 'Sequence No', value: 'seq_no' },

    { label: 'Status', value: 'is_active' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  back() {
    this.drawerService.openDrawer();
  }

  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    let rawData2 = sessionStorage.getItem('roleId');
    this.adminId = rawData2 ? this.commonFunction.decryptdata(rawData2) : null;
    this.loadingRecords = false;
    // this.getCountyData();
    this.getLabData();
    this.getTestData();
  }
  lab_Id = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.lab_Id
    ? this.commonFunction.decryptdata(this.lab_Id)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  getLabData() {
    var extraFilter = '';
    var extraFilter2 = '';
    if (this.labID) {
      extraFilter = ' AND ID=' + this.labID;
      extraFilter2 = ' AND LAB_ID=' + this.labID;
    }

    const filter = `AND is_active = 1` + extraFilter;
    this.api.getLabList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.labs = data.body['data'];
        } else {
          this.labs = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  testttmap: any;
  contactpattern = /^[0-9\-]$/;
  getTestData() {
    const filter = `AND is_active = 1`;
    this.api.getTestMasterList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.testttmap = data.body['data'];
        } else {
          this.testttmap = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  drawerTitle3!: string;
  packkage;
  labbpackkage: LabPackage = new LabPackage();
  drawerTechnicianserviceMapping: boolean = false;
  testtmap = new LabPackageMapping();
  TechniciansService(data) {
    this.drawerTitle3 = 'Lab Test Mapping';
    this.drawerTechnicianserviceMapping = true;
    this.labbpackkage = Object.assign({}, data);
    this.packkage = data.id;

    console.log(this.packkage);
    const testId = data.id; // Use the test ID stored in `this.packkage`
    this.api.getTestMapList(testId).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] === 200) {
          this.packkage = data.body['data'];
          console.log(this.packkage); // Verify the fetched data
        } else {
          this.message.error('Failed to Get Test Mapping Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  drawerCloseTechnicianserviceMapping(): void {
    // this.search();
    this.drawerTechnicianserviceMapping = false;
  }

  get closeCallbackTechnicianservice() {
    return this.drawerCloseTechnicianserviceMapping.bind(this);
  }
  onAllChecked(value: boolean): void { }

  checked = false;
  selectedItems: any[] = [];
  onItemChecked(item: any, checked: boolean): void { }

  updateCheckedSet(id: number, checked: boolean): void { }
  DoctorsList: any = [
    {
      id: 1,
      name: 'Dr. John Smith',
      specialization: 'Cardiologist',
      experience: '10 years',
      availability: {
        days: ['Monday', 'Wednesday', 'Friday'],
        hours: '9:00 AM - 5:00 PM',
      },
      contact: '123-456-7890',
      email: 'john.smith@example.com',
    },
    {
      id: 2,
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrician',
      experience: '8 years',
      availability: {
        days: ['Tuesday', 'Thursday', 'Saturday'],
        hours: '10:00 AM - 4:00 PM',
      },
      contact: '234-567-8901',
      email: 'emily.davis@example.com',
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      specialization: 'Dermatologist',
      experience: '12 years',
      availability: {
        days: ['Monday', 'Tuesday', 'Friday'],
        hours: '11:00 AM - 6:00 PM',
      },
      contact: '345-678-9012',
      email: 'michael.brown@example.com',
    },
    {
      id: 4,
      name: 'Dr. Sarah Wilson',
      specialization: 'Orthopedic Surgeon',
      experience: '15 years',
      availability: {
        days: ['Wednesday', 'Thursday', 'Saturday'],
        hours: '8:00 AM - 2:00 PM',
      },
      contact: '456-789-0123',
      email: 'sarah.wilson@example.com',
    },
    {
      id: 5,
      name: 'Dr. David Johnson',
      specialization: 'General Physician',
      experience: '5 years',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        hours: '10:00 AM - 5:00 PM',
      },
      contact: '567-890-1234',
      email: 'david.johnson@example.com',
    },
  ];
  closeDoctorMapping() {
    this.isDoctorMappingvisible = false;
    this.doctorMappingData = new LabPackageMapping();
  }
  mapDoctortitle = 'Map Lab Package';
  mapProceduretitle = 'Map Procedure';
  mapDoctorSpinning = false;
  mapProcedureSpinning = false;
  isProcedureMappingVisible = false;
  isDoctorMappingvisible = false;
  MapDoctors(data: any) {
    this.isDoctorMappingvisible = true;
    this.doctorMappingData = new LabPackageMapping();
    this.doctorMappingData.package_id = data.id;
  }
  setOfCheckedId = new Set<number>();
  countryData: any = [];
  stateData: any = [];
  districtData: any = [];
  pincodeData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, '', '', 'AND is_active = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countryData = data['data'];
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

  onCountryChange(): void {
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
  mobileNoText = '';
  genderText = '';
  dobText = '';
  aboutText = '';
  experienceText = '';
  registrationNumberText = '';
  addressLine1Text: string = '';
  addressLine2Text: string = '';

  isTestMappingVisible: boolean = false;
  istestSpinning: boolean = false;

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

    if (this.categoryId.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `category_id IN (${this.categoryId.join(',')})`; // Update with actual field name in the DB
    }

    if (this.labId.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `lab_id IN (${this.labId.join(',')})`; // Update with actual field name in the DB
    }

    if (this.instructions) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `instruction LIKE '%${this.instructions}%'`;
    }
    // if (this.selectedName !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `NAME LIKE '%${this.selectedName}%'`;
    // }
    if (this.packageName) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `package_name LIKE '%${this.packageName}%'`;
    }

    if (this.duration) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `duration LIKE '%${this.duration}%'`;
    }
    // if (this.seqNoText !== '') {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `SEQ_NO LIKE '%${this.seqNoText}%'`;

    // }

    if (this.seqNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `seq_no LIKE '%${this.seqNoText}%'`;
    }
    // if (this.descriptionText !== '') {
    //   likeQuery +=
    //     (likeQuery ? ' AND ' : '') +
    //     `DESCRIPTION LIKE '%${this.descriptionText}%'`;
    // }

    if (this.description) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `description LIKE '%${this.description}%'`;
    }
    if (this.isActive) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `is_active = ${this.isActive}`;
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

    let extraFilter = '';
    let rawData = sessionStorage.getItem('labId');
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null;
    if (this.adminId && this.adminId != '1') {
      extraFilter = ' AND lab_id=' + userId;
    }
    console.log(rawData, userId);

    // Call API with updated search query
    this.api
      .getLabPackage(
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
            this.TabId = response.body.TAB_ID;
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
    this.packageName = '';
    this.instructions = '';
    this.duration = '';
    this.description = '';

    this.seqNoText = '';
    // this.statetext = '';
    this.search();
  }

  add(): void {
    this.drawerTitle = 'Create New Lab Pakage';
    this.drawerData = new LabPackage();

    this.api
      .getLabPackage(1, 1, 'seq_no', 'desc', '')
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          if (response.body.count == 0) {
            this.drawerData.seq_no = 1;
          } else {
            this.drawerData.seq_no = response.body.data[0].seq_no + 1;
          }
        } else {
          this.dataList = [];
          this.message.error(`Something went wrong.`, '');
          this.loadingRecords = false;
        }
      });

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

  edit(data: LabPackage): void {
    this.drawerTitle = ' Update Lab Test Package';
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

  // isValidInput(input: string): boolean {
  //   return !this.restrictedKeywords.some((keyword) =>
  //     input.toUpperCase().includes(keyword)
  //   );
  // }



  public visiblesave = false;


  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }



  mapTestDrawerVisible: boolean = false;
  mapTestDrawerTitle = 'Map Tests';
  testIndeterminate: any = [];
  checkedTests = false;
  testSelectedItems: any = [];
  specializationSetOfCheckedId = new Set<number>();
  totalTestRecords = 1;
  TEST_SELECTED_RECORDS: any;
  TEST_ID: any;
  testLoadingRecords: boolean = false;
  testPageIndex = 1;
  testPageSize = 10;
  newTeatSelectedItems: any = [];
  masterTestList: any[] = [];
  masterTestData: any = [];

  SPEC_DOCTOR_ID: any;

  mapSpecializations(data: any) {
    // this.loadingRecords = true;
    this.testLoadingRecords = true;
    this.SPEC_DOCTOR_ID = data.id;
    this.mapTestDrawerTitle = 'Map Test To ' + data.package_name;

    // Fetch the master specialization data
    this.api
      .getTestMaster(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            // this.testLoadingRecords = true;

            this.masterTestData = response.body?.data || [];
            console.log(this.masterTestData, 'masterTestData');
          } else {
            this.masterTestData = [];
            this.message.error('Failed to load test. Please try again.', '');
          }
        },
        error: (err) => {
          console.error(err);
          this.masterTestData = [];
          this.message.error('Error loading specializations.', '');
        },
      });

    // Fetch the already mapped specializations
    this.api.getTestMapList(data.id).subscribe({
      next: (response: HttpResponse<any>) => {
        const mappedSpecializations = response.body?.data || [];
        const mappedSpecializationMap: {
          [key: string]: { id: number; isActive: boolean };
        } = {};

        for (let i = 0; i < mappedSpecializations.length; i++) {
          const specialization = mappedSpecializations[i];
          mappedSpecializationMap[specialization.test_id] = {
            id: specialization.id,
            isActive: specialization.is_active,
          };
        }

        console.log(
          mappedSpecializations,
          'mappedSpecializations',
          mappedSpecializationMap
        );

        // Combine master data with mapped specializations
        this.specializationSetOfCheckedId.clear();
        this.testSelectedItems = [];

        for (let i = 0; i < this.masterTestData.length; i++) {
          const specialization = this.masterTestData[i];
          const mappedSpecialization =
            mappedSpecializationMap[specialization.id];
          const isChecked =
            mappedSpecialization && mappedSpecialization.isActive;

          if (isChecked) {
            this.specializationSetOfCheckedId.add(specialization.id);
          }

          this.testSelectedItems.push({
            ...specialization,
            checkedTests: isChecked,
            mappedSpecializationId: mappedSpecialization
              ? mappedSpecialization.id
              : null,
          });
        }

        if (this.testSelectedItems.length > 0) {
          this.testLoadingRecords = false;
          this.mapTestDrawerVisible = true;
        }

        console.log(
          this.testSelectedItems,
          'Combined Data (masterTestData + mappedSpecializations)'
        );
        this.testLoadingRecords = false;
        this.loadingRecords = false;
        this.masterTestList = [...this.testSelectedItems];
        this.refreshSpecializationCheckedStatus();
      },
      error: (err) => {
        console.error(err);
        this.testLoadingRecords = false;
        this.mapTestDrawerVisible = true;
      },
    });
  }

  onAllSpecializationsChecked(value: boolean): void {
    console.log(value);

    this.specializationSetOfCheckedId.clear();
    if (value) {
      console.log(this.masterTestData);

      this.masterTestData.forEach((item) =>
        this.specializationSetOfCheckedId.add(item.id)
      );
    }
    this.testSelectedItems.forEach((item) => (item.checkedTests = value));
    this.refreshSpecializationCheckedStatus();
    this.updateTotalSpecializationRecords();
  }

  onSpecializationItemChecked(id: number, checked: boolean): void {
    console.log(id, ' ', checked);

    this.updateSpecializationCheckedSet(id, checked);
    this.testSelectedItems.forEach(
      (data) =>
        (data.checkedTests = this.specializationSetOfCheckedId.has(data.id))
    );
    this.refreshSpecializationCheckedStatus();
    this.updateTotalSpecializationRecords();
  }

  updateSpecializationCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.specializationSetOfCheckedId.add(id);
    } else {
      this.specializationSetOfCheckedId.delete(id);
    }
    console.log(this.specializationSetOfCheckedId, 'updated checked status');
  }

  refreshSpecializationCheckedStatus(): void {
    this.checkedTests = this.testSelectedItems.every((item) =>
      this.specializationSetOfCheckedId.has(item.id)
    );
    this.testIndeterminate =
      this.testSelectedItems.some((item) =>
        this.specializationSetOfCheckedId.has(item.id)
      ) && !this.checkedTests;
  }

  updateTotalSpecializationRecords(): void {
    this.TEST_SELECTED_RECORDS = this.specializationSetOfCheckedId.size;
  }

  saveSpecializations(): void {
    if (this.specializationSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Specialization', '');
    } else {
      const checkedTests: any[] = [];
      const uncheckedSpecializations: any[] = [];

      console.log(
        this.masterTestData,
        'specal',
        this.testSelectedItems,
        this.masterTestList
      );

      for (let i = 0; i < this.masterTestData.length; i++) {
        const specialization = this.masterTestData[i];
        const isChecked = this.specializationSetOfCheckedId.has(
          specialization.id
        );

        const mappedSpecialization = this.testSelectedItems.find(
          (item) => item.id === specialization.id
        );

        const mappedSpecializationId =
          mappedSpecialization?.mappedSpecializationId || null;

        if (isChecked) {
          const specializationObj: any = {
            package_id: this.SPEC_DOCTOR_ID,
            test_id: specialization.id,
            is_active: 1,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include id only if it exists
          }
          checkedTests.push(specializationObj);
        } else {
          const specializationObj: any = {
            package_id: this.SPEC_DOCTOR_ID,
            test_id: specialization.id,
            is_active: 0,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include id only if it exists
          }
          uncheckedSpecializations.push(specializationObj);
        }
      }

      const allSpecializations = [...checkedTests, ...uncheckedSpecializations];

      console.log(allSpecializations, 'Data to be saved');

      allSpecializations.forEach((specialization) => {
        specialization['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allSpecializations };
      this.testLoadingRecords = true;

      // API call to save the mapped specializations
      this.api.LabTestMapping(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Test Mapped Successfully', '');
            this.mapTestDrawerVisible = false;
            this.testLoadingRecords = false;

            this.specializationSetOfCheckedId.clear();
          } else {
            this.message.error('Test Mapping Failed', '');
            this.testLoadingRecords = false;
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.testLoadingRecords = false;

          this.message.error('Test Mapping Failed', '');
        }
      );
    }
  }

  // Close Specialization Drawer
  mapSpecializationsDrawerClose() {
    this.mapTestDrawerVisible = false;
    this.specializationSetOfCheckedId.clear();
    this.searchSpecializations('');
    this.searchText2 = '';
  }
  searchSpecializations(searchText: any) {
    this.testLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.testSelectedItems = this.masterTestList.filter((user) =>
        user.name.toLowerCase().includes(searchTextLower)
      );
    } else {
      this.testSelectedItems = [...this.masterTestList];
    }
    this.testLoadingRecords = false;
  }
  //   searchSpecializations(data:any){
  //     let globalSearchQuery = '';
  //     let sort: string;
  //     try {
  //       sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //     } catch (error) {
  //       sort = '';
  //     }
  //     if (this.searchText2 !== '') {
  //       globalSearchQuery =
  //         ' AND (' +
  //         this.columnst
  //           .map((column) => {
  //             return `${column[0]} like '%${this.searchText2}%'`;
  //           })
  //           .join(' OR ') +
  //         ')';
  //     }
  // this.testLoadingRecords=true
  //     this.api.getTestMaster(this.pageIndex, this.pageSize, this.sortKey, sort, globalSearchQuery)
  //     .subscribe(
  //       (response: HttpResponse<any>) => {
  //         const statusCode = response.status;
  //         // const headers = response.headers;
  //         if (statusCode === 200) {
  //           this.testLoadingRecords = false;
  //           this.testSelectedItems = response.body.data;
  //         } else {
  //           this.testSelectedItems = [];
  //           this.message.error(`Something went wrong.`, '');
  //           this.testLoadingRecords = false;
  //         }
  //       },
  //       (err: HttpErrorResponse) => {
  //         this.testLoadingRecords = false;
  //         if (err.status === 0) {
  //           this.message.error(
  //             'Network error: Please check your internet connection.',
  //             ''
  //           );
  //         } else {
  //           this.message.error(
  //             `HTTP Error: ${err.status}. Something Went Wrong.`,
  //             ''
  //           );
  //         }
  //       }
  //     );
  //   }
  searchText2;
  columnst: string[][] = [['name', 'name']];
  keyup1() {
    if (this.searchText2.length >= 3) {
      this.searchSpecializations('');
    } else if (this.searchText2.length === 0) {
      this.testSelectedItems = [];
      this.searchSpecializations('');
    } else if (this.searchText2.length < 3) {
      // this.message.warning("Please Enter at least Three Characters ...", "");
    }
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
    this.drawerTitle = 'Lab Package Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[1]['options'] = this.labs.map((data) => ({
      value: data.id,
      display: data.name
    }));
    this.filterFields[3]['options'] = this.testttmap.map((data) => ({
      value: data.id,
      display: data.name
    }));
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
      key: 'PACKAGE_NAME',
      label: 'Package Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Package Name',
    },

    {
      key: 'LAB_ID',
      label: 'Lab',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Lab',
    },

    {
      key: 'DURATION',
      label: 'Duration',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Duration',
    },


    {
      key: 'CATEGORY_ID',
      label: 'Category',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Category',
    },


    {
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Description',
    },


    {
      key: 'INSTRUCTIONS',
      label: 'Instruction',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Instruction',
    },


    {
      key: 'SEQ_NO',
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
