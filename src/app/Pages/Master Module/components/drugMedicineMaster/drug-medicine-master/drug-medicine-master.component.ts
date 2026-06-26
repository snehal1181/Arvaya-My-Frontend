import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { drugMedicine } from '../../../Models/drugMedicine';
import { drugSymptomMapping } from '../../../Models/drugSymptomMapping';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-drug-medicine-master',
  templateUrl: './drug-medicine-master.component.html',
  styleUrls: ['./drug-medicine-master.component.css'],
})
export class DrugMedicineMasterComponent {
  selectedStrength: any;
  strengthList: any;
  data: drugSymptomMapping = new drugSymptomMapping();
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: drugMedicine = new drugMedicine();
  formTitle = "Manage Medicine's";
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
    { label: 'Name', value: 'name' },
    { label: 'Hospital', value: 'hospital_name' },
    { label: 'Type', value: 'medicine_name' },
    { label: 'Strength', value: 'strength' },
    { label: 'Strength Unit', value: 'strength_unit' },
    { label: 'Dosage', value: 'dosage' },
    { label: 'Instructions', value: 'instructions' },
    { label: 'Active Status', value: 'is_active' },
    { label: 'Sequence Number', value: 'seq_no' },
  ];
  visible = false;

  // Column Filter
  citytext: string = '';
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['name', 'Name'],
    ['hospital_name', 'Hospital'],
    ['medicine_name', 'Medicine Type'],
    ['strength', 'Strength'],
    ['strength_unit', 'Strength Unit'],
    ['dosage', 'Dosage'],
    ['instructions', 'Instructions'],
    ['is_active', 'Active Status'],
    ['seq_no', 'Sequence Number'],
  ];
  adminId: any;
  nameVisible: boolean;
  hospitalIdVisible: boolean;
  typeIdVisible: boolean;
  strengthVisible: boolean;
  strengthUnitVisible: boolean;
  dosageVisible: boolean;
  instructionsVisible: boolean;
  statusVisible: boolean;
  seqNoVisible: boolean;

  selectedHospitalId: number[] = [];
  hospitalList: any;
  selectedTypeId: number[] = [];
  typeList: any;
  selectedStatus: any;
  statusList: any;
  selectedStrengthUnit: any;
  strengthUnitList: any;
  dosageText: any;
  instructionsText: any;
  seqNoText: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getHospitalData()
    this.getMedicineType()
  }

  showcolumn = [
    { label: 'Name', key: 'name', visible: true },
    { label: 'Hospital Name', key: 'hospital_name', visible: true },
    { label: 'Medicine Type', key: 'medicine_name', visible: true },
    { label: 'Strength', key: 'strength', visible: true },
    { label: 'Strength Unit', key: 'strength_unit', visible: true },
    { label: 'Dosage', key: 'dosage', visible: true },
    { label: 'Instructions', key: 'instructions', visible: true },
    { label: 'Sequence No', key: 'seq_no', visible: true },

    { label: 'Active Status', key: 'is_active', visible: true },
  ];

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  countryData: any = [];
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

  stateData: any = [];
  getStateData() {
    this.api.getState(0, 0, '', '', 'AND is_active = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.stateData = data['data'];
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
  searchDosage() {
    // throw new Error('Method not implemented.');
  }
  resetDosage() {
    // throw new Error('Method not implemented.');
  }
  searchInstructions() {
    // throw new Error('Method not implemented.');
  }
  resetInstructions() {
    // throw new Error('Method not implemented.');
  }
  searchSeqNo() {
    // throw new Error('Method not implemented.');
  }
  resetSeqNo() {
    // throw new Error('Method not implemented.');
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
  typeIdList
  getMedicineType() {
    const filter = `AND is_active = 1`;
    this.api.MedicineTypeList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.typeIdList = data.body['data'];
        } else {
          this.typeIdList = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );

  }
  isSymptomsVisible = false;
  symptomsMappingTitle = 'Map Symptoms'
  isSymptomSpinning = false
  symptomsList: any = []
  openSymptomMapping(data) {
    this.data = new drugSymptomMapping()
    this.data.DRUG_ID = data.ID
    this.isSymptomsVisible = true;
  }
  closeSymptomMapping() {
    this.isSymptomsVisible = false;
  }
  saveMapping(boolean) {

  }
  checked = false;
  indeterminate = false;
  SELECTED_RECORDS: number = 0;
  RECORDS: number = 0;
  setOfCheckedId = new Set<number>();
  sortData(sortKey: string, sortOrder: any): void {
    // this.tecnicalSpecification.sort((a, b) => {
    //   const valA = a[sortKey].toLowerCase();
    //   const valB = b[sortKey].toLowerCase();
    //   if (valA < valB) return sortOrder === 'ascend' ? -1 : 1;
    //   if (valA > valB) return sortOrder === 'ascend' ? 1 : -1;
    //   return 0;
    // });
  }
  onAllChecked(value: boolean): void {
    this.checked = value;
    this.indeterminate = false;

    if (value) {
      this.setOfCheckedId.clear();
      this.selectedItems = []; // Clear selectedItems to avoid duplicates
      // this.tecnicalSpecification.forEach((data) => {
      //   if (typeof data === 'object') {
      //     data.checked = true;
      //     this.checked = true;
      //     data.IS_ACTIVE = 1; // Set IS_ACTIVE to 1
      //     this.setOfCheckedId.add(data.TECHNICAL_SPECS_ID);
      //     this.selectedItems.push(data); // Add each item to selectedItems
      //   }
      // });
    } else {
      // this.tecnicalSpecification.forEach((data) => {
      //   if (typeof data === 'object') {
      //     data.checked = false;
      //     data.IS_ACTIVE = 0; // Set IS_ACTIVE to 0
      //   }
      // });
      this.setOfCheckedId.clear();
      this.selectedItems = []; // Clear selectedItems
    }

    localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    this.updateTotalRecords();
  }

  updateTotalRecords(): void {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }

  selectedItems: any[] = [];
  onItemChecked(item: any, checked: boolean): void {
    // console.log(item, checked);
    this.updateCheckedSet(item.TECHNICAL_SPECS_ID, checked);

    if (checked) {
      item.IS_ACTIVE = 1;
      this.selectedItems.push(item);
      localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    } else {
      item.IS_ACTIVE = 0;

      this.selectedItems = this.selectedItems.filter(
        (i) => i.TECHNICAL_SPECS_ID !== item.TECHNICAL_SPECS_ID
      );
    }

    // this.tecnicalSpecification.forEach((data) => {
    //   if (typeof data === 'object') {
    //     data.checked = this.setOfCheckedId.has(data.TECHNICAL_SPECS_ID);
    //   }
    // });

    this.updateTotalRecords();
    // this.updateSelectAllState();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    // const item = this.tecnicalSpecification.find(
    //   (item) => item.TERMS_ID === id
    // );
    // if (item) {
    //   item.IS_ACTIVE = checked ? 1 : 0;
    //   item.checked = checked;
    // }
    // if (checked) {
    //   this.setOfCheckedId.add(id);
    // } else {
    //   this.setOfCheckedId.delete(id);
    // }

    // this.checked = this.tecnicalSpecification.every((item) =>
    //   this.setOfCheckedId.has(item.TECHNICAL_SPECS_ID)
    // );
    this.indeterminate = !this.checked && this.setOfCheckedId.size > 0;
  }
  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }
  reset(): void {
    this.searchText = '';
    this.citytext = '';
    this.seqNoText = ''
    this.instructionsText = ''
    this.dosageText = ''
    this.selectedStrengthUnit = ''
    this.selectedStrength = ''
    this.search();
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
    if (this.citytext) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `name  = '${this.citytext}'`;
    }

    if (this.selectedHospitalId.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `hospital_id IN (${this.selectedHospitalId.join(',')})`; // Update with actual field name in the DB
    }




    // Country Filter
    if (this.selectedTypeId.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `type_id IN (${this.selectedTypeId.join(',')})`; // Update with actual field name in the DB
    }

    // State Filter
    if (this.selectedStrength) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `strength = '${this.selectedStrength}'`;
    }
    if (this.selectedStrengthUnit) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `strength_unit = '${this.selectedStrengthUnit}'`;
    }
    if (this.dosageText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `dosage  = '${this.dosageText}'`;
    }
    if (this.instructionsText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `instructions  = '${this.instructionsText}'`;
    }
    if (this.seqNoText) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `seq_no LIKE '%${this.seqNoText}%'`;
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

    if (this.filterQuery) {
      likeQuery += this.filterQuery;
    }

    // Call API with updated search query
    this.api.getMedicineMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
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
    this.drawerTitle = 'Create New Medicine';
    this.drawerData = new drugMedicine();

    this.api.getMedicineMaster(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          if (response.body.count == 0) {
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

  edit(data: drugMedicine): void {
    this.drawerTitle = ' Update Medicine';
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

  getComparisonOptions(selectedColumn: string): string[] {
    if (
      selectedColumn === 'country_id' ||
      selectedColumn === 'state_id' ||
      selectedColumn === 'is_active'
    ) {
      return ['=', '!='];
    }
    return [
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
  }

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

  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }

  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else {
      console.log(conditionIndex, subConditionIndex);
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }

  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }

  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]['FILTER'].length - 1;
    if (
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == '' ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == undefined ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == null
    ) {
      isOk = false;
      this.message.error('Please check some fields are empty', '');
    } else if (
      i != 0 &&
      (this.filterBox[i]['CONDITION'] == undefined ||
        this.filterBox[i]['CONDITION'] == null ||
        this.filterBox[i]['CONDITION'] == '')
    ) {
      isOk = false;
      this.message.error('Please select operator.', '');
    }
    console.log(this.filterBox, 'filterBox1');

    if (isOk) {
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
      console.log(this.filterBox, 'filterBox2');
    }
  }

  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
  createFilterQuery(): void {
    console.log(this.filterBox, 'filterdat');

    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    console.log(selection4, 'selection4');

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      console.log(this.filterBox);

      this.isSpinner = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
          console.log(this.query, 'backend query');
        }
      }

      this.showquery = this.query;
      console.log(this.showquery, 'showquery');

      var newQuery = ' AND ' + this.query;
      console.log(newQuery);

      this.filterQuery1 = newQuery;

      console.log(this.filterQuery1, 'this.filterQuerythis.filterQuery');

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api.getMedicineMaster(this.pageIndex, this.pageSize, this.sortKey, sort, newQuery)
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            // const headers = response.headers;
            if (statusCode === 200) {
              this.loadingRecords = false;
              this.totalRecords = response.body.count;
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


      this.QUERY_NAME = '';
    }
  }


  createFilterQuery1(selectedQueryIndex: number): void {
    console.log(this.filterBox, 'filterBox Data');
    console.log("Available Queries:", this.INSERT_NAMES);

    // Check if `filterBox` is empty
    if (
      this.filterBox.length === 0 ||
      (this.filterBox.length === 1 &&
        this.filterBox[0]['FILTER'].length === 1 &&
        !this.filterBox[0]['FILTER'][0]['SELECTION1'] &&
        !this.filterBox[0]['FILTER'][0]['SELECTION2'] &&
        !this.filterBox[0]['FILTER'][0]['SELECTION3'])
    ) {
      // Use the selected query from `INSERT_NAMES`
      if (this.INSERT_NAMES.length > 0) {
        if (selectedQueryIndex >= 0 && selectedQueryIndex < this.INSERT_NAMES.length) {
          this.query = this.INSERT_NAMES[selectedQueryIndex].query; // Use the selected query
          console.log("Using selected query:", this.query);
        } else {
          this.message.error('Invalid query selection', '');
          return;
        }
      } else {
        this.message.error('No valid query to execute', '');
        return;
      }
    } else {
      // Generate query based on `filterBox`
      this.query = '';
      for (let i = 0; i < this.filterBox.length; i++) {
        if (i !== 0) {
          this.query += `) ${this.filterBox[i]['CONDITION']} (`; // Add AND/OR condition
        } else {
          this.query = '('; // Start query with an opening parenthesis
        }

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j !== 0) {
            // Add AND/OR condition for subfilters
            this.query2 += filter['CONDITION'] === 'AND' ? ' AND ' : ' OR ';
          }

          const selection1 = filter['SELECTION1'];
          const selection2 = filter['SELECTION2'];
          const selection3 = filter['SELECTION3'];

          // Build the query based on the selection type
          if (selection2 === 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 === 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 === 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
        }
        this.query += this.query2;
      }
      this.query += ')'; // Close the query
      console.log(this.query, 'Generated Query');
    }

    // Append the query to `newQuery`
    const newQuery = ' AND ' + this.query;
    console.log("Final Query to Send:", newQuery);

    // Call the API
    this.api.getMedicineMaster(this.pageIndex, this.pageSize, this.sortKey, '', newQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
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

    this.QUERY_NAME = ''; // Clear the query name
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

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }

  applyFilter(i: number, j: number) {
    const currentFilter = this.filterBox[i]['FILTER'][j];

    const selection1 = currentFilter.SELECTION1;
    const selection2 = currentFilter.SELECTION2;
    const selection3 = currentFilter.SELECTION3;

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 character',
        ''
      );
    } else if (
      typeof selection3 === 'string' &&
      !this.isValidInput(selection3)
    ) {
      this.message.error(`Invalid Input: ${selection3} is not allowed.`, '');
    } else {
      const sort = this.sortValue?.startsWith('a') ? 'asc' : 'desc';

      const getComparisonFilter = (
        comparisonValue: any,
        columnName: any,
        tableValue: any
      ) => {
        switch (comparisonValue) {
          case '=':
          case '!=':
          case '<':
          case '>':
          case '<=':
          case '>=':
            return `${tableValue} ${comparisonValue} '${columnName}'`;
          case 'Contains':
            return `${tableValue} LIKE '%${columnName}%'`;
          case 'Does not Contain':
            return `${tableValue} NOT LIKE '%${columnName}%'`;
          case 'Start With':
            return `${tableValue} LIKE '${columnName}%'`;
          case 'End With':
            return `${tableValue} LIKE '%${columnName}'`;
          default:
            return '';
        }
      };

      const filterCondition = getComparisonFilter(
        selection2,
        selection3,
        selection1
      );
      const FILDATA = `AND (${filterCondition})`;

      console.log(FILDATA, 'Filter Data');

      this.isSpinner = true;

      this.api.getMedicineMaster(this.pageIndex, this.pageSize, this.sortKey, sort, FILDATA)
        .subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            // const headers = response.headers;
            if (statusCode === 200) {
              this.loadingRecords = false;
              this.totalRecords = response.body.count;
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
  }

  resetValues(): void {
    this.filterBox = [
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
    this.search();
    this.hide = true;
  }

  public visiblesave = false;

  saveQuery() {
    // this.createFilterQuery();
    this.visiblesave = !this.visiblesave;
  }

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  handleOkTop(): void {
    // this.createFilterQuery();

    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    console.log(selection4, 'selection4');

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.isSpinner = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }

      this.showquery = this.query;
    }

    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '');
    } else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      console.log(this.INSERT_NAMES);
      this.visiblesave = false;
      this.QUERY_NAME = ''; // Clear input after adding
    }
    this.visiblesave = false;
  }

  handleCancelTop(): void {
    this.visiblesave = false;
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(query: string, name: string): void {
    console.log(query);
    this.selectedQuery = query;
    console.log(this.selectedQuery);
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  // deleteItem(item: any) {
  //   this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  // }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
  searchText1: any;
  mapSymptomsDrawerVisible: boolean = false;
  mapSymptomsDrawerTitle = 'Map Symptoms';
  symptomsIndeterminate: any = [];
  checkedSymptoms = false;
  symptomSelectedItems: any = [];
  symptomSetOfCheckedId = new Set<number>();
  totalSymptomsRecords = 1;
  SYMPTOMS_SELECTED_RECORDS: any;
  SYMPTONS_ID: any;
  symptomsLoadingRecords: boolean = false;
  symptomPageIndex = 1;
  symptomPageSize = 10;
  newSymptomItems: any = [];
  masterSymptomsList: any[] = [];
  masterData: any = [];

  DRUG_ID: any;

  mapServices(data: any) {
    // Start by showing loading indicators
    this.symptomsLoadingRecords = true;
    this.loadingRecords = true;

    // Set the drawer title and target doctor ID
    this.DRUG_ID = data.id;
    this.mapSymptomsDrawerTitle = 'Map Symptoms To ' + data.name;

    // Fetch the master symptoms
    this.api.SymptomsList(0, 0, this.sortKey, 'asc', 'AND is_active = 1').subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.masterData = response.body?.data || [];
        } else {
          this.masterData = [];
          this.message.error('Failed to load symptoms. Please try again.', '');
        }
        console.log(" this.masterData", this.masterData)
      },
      error: (err) => {
        console.error(err);
        this.masterData = [];
        this.message.error('Error loading symptoms.', '');
      },
      complete: () => {
        // After fetching master data, fetch mapped symptoms
        this.api.getSymptomsMapList(data.id).subscribe({
          next: (response: HttpResponse<any>) => {
            const mappedSymptoms = response.body?.data || [];
            const mappedSymptomMap: { [key: string]: { id: number; isActive: any } } = {};

            // Map the symptoms
            for (const symptom of mappedSymptoms) {
              const symId = symptom.SYMPTONS_ID !== undefined ? symptom.SYMPTONS_ID :
                (symptom.symptons_id !== undefined ? symptom.symptons_id : symptom.symptoms_id);
              const isActive = symptom.IS_ACTIVE !== undefined ? symptom.IS_ACTIVE :
                (symptom.is_active !== undefined ? symptom.is_active : symptom.is_actve);
              const recId = symptom.ID !== undefined ? symptom.ID : symptom.id;

              if (symId !== undefined) {
                mappedSymptomMap[symId] = {
                  id: recId,
                  isActive: isActive,
                };
              }
            }

            this.symptomSetOfCheckedId.clear();
            this.symptomSelectedItems = [];

            // Combine master data and mapped symptoms
            for (const symptom of this.masterData) {
              const mappedSymptoms = mappedSymptomMap[symptom.id];
              const isChecked = mappedSymptoms && (mappedSymptoms.isActive == 1 || mappedSymptoms.isActive === true || mappedSymptoms.isActive === '1');

              if (isChecked) {
                this.symptomSetOfCheckedId.add(symptom.id);
              }

              this.symptomSelectedItems.push({
                ...symptom,
                checkedSymptoms: !!isChecked,
                mappedSymptomsId: mappedSymptoms ? mappedSymptoms.id : null,
                initialChecked: !!isChecked,
              });
            }

            this.masterSymptomsList = [...this.symptomSelectedItems];
            this.refreshSymptomCheckedStatus();

            // Set loading indicators and show drawer
            this.symptomsLoadingRecords = false;
            this.loadingRecords = false;
            this.mapSymptomsDrawerVisible = true;

            console.log(this.symptomSelectedItems, 'Combined Data (masterData + mappedSymptoms)');
          },
          error: (err) => {
            console.error(err);
            this.symptomsLoadingRecords = false;
            this.loadingRecords = false;
            this.mapSymptomsDrawerVisible = true;
          },
        });
      },
    });
  }


  onAllSymptomsChecked(value: boolean): void {
    this.symptomSetOfCheckedId.clear(); // Clear existing selections
    if (value) {
      this.masterData.forEach((item) =>
        this.symptomSetOfCheckedId.add(item.id)
      );
    }
    this.symptomSelectedItems.forEach((item) => (item.checkedSymptoms = value));
    this.refreshSymptomCheckedStatus();
    this.updateTotalSymptomRecords();
  }

  onSymptomItemChecked(id: number, checked: boolean): void {
    console.log(id, ' ', checked);

    this.updateSymptomCheckedSet(id, checked);
    this.symptomSelectedItems.forEach(
      (data) => (data.checkedSymptoms = this.symptomSetOfCheckedId.has(data.id))
    );
    this.refreshSymptomCheckedStatus();
    this.updateTotalSymptomRecords();
  }

  updateSymptomCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.symptomSetOfCheckedId.add(id);
    } else {
      this.symptomSetOfCheckedId.delete(id);
    }

    console.log(this.symptomSetOfCheckedId, 'updated checked status');
  }


  refreshSymptomCheckedStatus(): void {
    this.checkedSymptoms = this.symptomSelectedItems.every(
      (item) => this.symptomSetOfCheckedId.has(item.id) // Changed from SYMPTONS_ID to id
    );
    this.symptomsIndeterminate =
      this.symptomSelectedItems.some((item) =>
        this.symptomSetOfCheckedId.has(item.id)
      ) && !this.checkedSymptoms;
  }

  updateTotalSymptomRecords(): void {
    this.SYMPTOMS_SELECTED_RECORDS = this.symptomSetOfCheckedId.size;
  }

  save2(): void {


    if (this.symptomSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Symptoms', '');
    } else {
      const checkedSymptoms: any = [];
      const uncheckedSymptoms: any = [];

      console.log(this.masterData, this.masterSymptomsList);

      for (let i = 0; i < this.masterData.length; i++) {
        const symptoms = this.masterData[i];
        const isChecked = this.symptomSetOfCheckedId.has(symptoms.id);

        const mappedService = this.masterSymptomsList.find(
          (item) => item.id === symptoms.id
        );

        const mappedSymptomsId = mappedService?.mappedSymptomsId || null;
        const initialChecked = !!mappedService?.initialChecked;

        if (isChecked) {
          const symptomsObj: any = {
            symptons_id: symptoms.id,
            drug_id: this.DRUG_ID,
            is_active: 1,
            seq_no: i + 1,
          };
          if (mappedSymptomsId) {
            symptomsObj.id = mappedSymptomsId; // Include ID only if it exists
          }
          checkedSymptoms.push(symptomsObj);
        } else if (initialChecked) {
          if (mappedSymptomsId) {
            const symptomsObj: any = {
              symptons_id: symptoms.id,
              drug_id: this.DRUG_ID,
              is_active: 0,
              seq_no: i + 1,
              id: mappedSymptomsId
            };
            uncheckedSymptoms.push(symptomsObj);
          }
        }
      }

      const allSymptomss = [...checkedSymptoms, ...uncheckedSymptoms];

      console.log(allSymptomss, 'Data to be saved');

      allSymptomss.forEach((symptoms) => {
        symptoms['client_id'] = this.api.clientId;
      });

      const dataToSave = {
        data: allSymptomss,
      };

      this.symptomsLoadingRecords = true;

      // API call to save the mapped symptoms
      this.api.SymptomsMapping(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Symptoms Mapped Successfully', '');
            this.mapSymptomsDrawerVisible = false;
            this.symptomsLoadingRecords = false;

            this.symptomSetOfCheckedId.clear();
          } else {
            this.message.error('Symptoms Mapping Failed', '');
            this.symptomsLoadingRecords = false;
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.message.error('Symptoms Mapping Failed', '');
          this.symptomsLoadingRecords = false;
        }
      );
    }
  }

  // Method to handle the confirmation
  confirm2(): void {
    this.message.success('Symptoms mapped successfully!', '');
    this.mapSymptomsDrawerVisible = false;
  }

  mapSymptomDrawerClose() {
    this.mapSymptomsDrawerVisible = false;
    this.symptomSetOfCheckedId.clear();
    this.searchSymptoms('');
  }

  searchSymptoms(searchText: any) {
    this.symptomsLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.symptomSelectedItems = this.masterSymptomsList.filter((user) =>
        user.NAME.toLowerCase().includes(searchTextLower)
      );
    } else {
      this.symptomSelectedItems = [...this.masterSymptomsList];
    }
    this.symptomsLoadingRecords = false;
  }
  isDeleting: boolean = false;
  savedFilters: any[] = [];
  selectedFilter: string | null = null;
  drawerFilterVisible: boolean = false;
  TabId: number = 85;

  filterFields: any[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Name',
    },
    {
      key: 'hospital_name',
      label: 'Hospital Name',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Hospital Name',
    },
    {
      key: 'medicine_name',
      label: 'Medicine Type',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Type',
    },
    {
      key: 'strength',
      label: 'Strength',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Strength',
    },
    {
      key: 'strength_unit',
      label: 'Strength Unit',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Strength Unit',
    },
    {
      key: 'dosage',
      label: 'Dosage',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Dosage',
    },
    {
      key: 'instructions',
      label: 'Instructions',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
      placeholder: 'Enter Instructions',
    },
    {
      key: 'seq_no',
      label: 'Sequence Number',
      type: 'text',
      comparators: ['=', '!=', 'Contains', 'Does Not Contains', 'Starts With', 'Ends With'],
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

  loadFilters() {
    this.api
      .getFilterData1(
        0,
        0,
        '',
        '',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${Number(sessionStorage.getItem('roleId'))}`
      )
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = '';
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
    this.drawerTitle = 'Medicine Filter';
    this.drawerFilterVisible = true;
  }

  drawerflterClose(): void {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

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
      (err) => {
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

  applyfilter(item: any) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  oldFilter: any[] = [];
  onFilterApplied(obj: any) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
}
