import { Component } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { CityMaster } from '../../../Models/City';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LabMaster } from '../../../Models/LabMaster';
import { DatePipe } from '@angular/common';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabAppointmentMaster } from '../../../Models/LabAppointmentMaster';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';
@Component({
  selector: 'app-listlab',
  templateUrl: './listlab.component.html',
  styleUrls: ['./listlab.component.css'],
})
export class ListlabComponent {
  drawerVisible!: boolean;
  drawerTestMapping: boolean = false;
  drawerTechnicianMapping: boolean = false;
  drawerTechnicianserviceMapping: boolean = false;
  drawerTitle!: string;
  drawerTitle1!: string;
  drawerTitle2!: string;
  drawerTitle3!: string;
  drawerData: LabMaster = new LabMaster();
  formTitle = "Manage Lab's";
  dataList: any = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  loadcountries: boolean = false;

  // Main filter
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'district_id' },
    { label: 'Status', value: 'is_active' },
  ];
  visible = false;

  // Column Filter
  Nametext: string = '';
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  selectedDistrict: number[] = [];
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  DistrictVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  filterQuery: string = '';
  columns: string[][] = [
    ['country_name', 'Country'],
    ['state_name', 'State'],
    ['name', 'Name'],
    ['district_name', 'District'],
    ['is_active', 'Status'],
  ];
  adminId: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router,
    private drawerService: DrawerService
  ) { }

  back() {
    this.drawerService.openDrawer();
  }
  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getCountyData();
    this.getStateData();
    this.getDistrict();
    this.search();
  }

  showcolumn = [
    { label: 'Name', key: 'name', visible: true },
    { label: 'Country', key: 'country_name', visible: true },
    { label: 'State', key: 'state_name', visible: true },
    { label: 'District', key: 'district_name', visible: true },
    { label: 'Status', key: 'is_active', visible: true },
  ];

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  countryData: any = [];
  getCountyData(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getCountrydropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.countryData = response.body.data;
        } else {
          this.countryData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  stateData: any = [];
  getStateData(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getStatedropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.stateData = response.body.data;
        } else {
          this.stateData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  districtData: any = [];
  getDistrict(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getdistrict(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      if (statusCode === 200) {
        this.districtData = response.body.data;
      } else {
        this.districtData = [];
        this.message.error(`Something went wrong.`, '');
      }
    });
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

  reset(): void {
    this.searchText = '';
    this.Nametext = '';
    this.search();
  }

  onCountryChange(): void {
    this.search();
  }

  onStateChange(): void {
    this.search();
  }
  onDistrictChange(): void {
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);


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
    if (this.Nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.Nametext.trim()}%'`;
    }

    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }

    // State Filter
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }

    if (this.selectedDistrict.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `district_id IN (${this.selectedDistrict.join(',')})`; // Update with actual field name in the DB
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
    let rawData = sessionStorage.getItem('userId');
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null;
    if (userId && userId != '1') {
      extraFilter = ' AND user_id=' + userId;
    }
    // console.log(rawData , userId);
    this.api
      .getLabMaster(
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
            this.TabId = response.body.tab_id
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
    this.drawerTitle = 'Create New Lab';
    this.drawerData = new LabMaster();

    this.api.getLabMaster(1, 1, 'seq_no', 'desc', '').subscribe(
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

  districtData1: any = [];
  EditstateData: any = [];
  edit(data: LabMaster): void {
    this.drawerTitle = ' Update Lab';
    this.drawerData = Object.assign({}, data);
    console.log(this.drawerData);

    this.drawerVisible = true;

    console.log(data.country_id, ' ', data.state_id, ' ', this.stateData);

    if (data.country_id) {
      this.EditstateData = this.stateData.filter(
        (item) => item.country_id === data.country_id
      );

      console.log(this.EditstateData);

      if (data.state_id) {
        this.districtData1 = this.districtData.filter(
          (item) => item.state_id === data.state_id
        );

        console.log(this.districtData1);
      } else {
        this.districtData1 = [];
      }
    } else {
      this.EditstateData = [];
      this.districtData1 = [];
    }
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  //......................... Start Lab Test Mapping ...........................

  LAB_ID: any;
  qualificationSelectedItems: any = [];
  qualificationLoadingRecords: boolean = false;
  checkedQualifications = false;
  qualificationIndeterminate: any = [];
  qualificationSetOfCheckedId = new Set<number>();
  masterQualificationData: any = [];
  QUALIFICATION_SELECTED_RECORDS: any;
  masterQualificationList: any[] = [];
  TEST_ID: any;

  TestMapping(data: any) {
    this.drawerTitle1 = 'Test Mapping';
    this.drawerTestMapping = true;

    this.TEST_ID = data.id;
    // Fetch master qualification data
    this.api
      .getTestMaster(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterQualificationData = response.body?.data || [];
            console.log(
              this.masterQualificationData,
              'masterQualificationData'
            );
          } else {
            this.masterQualificationData = [];
            this.message.error(
              'Failed to load qualifications. Please try again.',
              ''
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.masterQualificationData = [];
          this.message.error('Error loading qualifications.', '');
        },
        complete: () => {
          // Once master data is fetched, fetch mapped qualifications
          this.api.getMappedtest(data.id).subscribe({
            next: (response: HttpResponse<any>) => {
              const mappedQualifications = response.body?.data || [];
              const mappedQualificationMap: {
                [key: string]: {
                  id: number;
                  isActive: boolean;
                  instructions: string | null;
                  duration: string | null;
                  // INSTITUTION_NAME: string | null;
                };
              } = {};

              // Map the data
              for (const qualification of mappedQualifications) {
                mappedQualificationMap[qualification.test_id] = {
                  id: qualification.id,
                  isActive: qualification.is_active,
                  instructions: qualification.instructions || null,
                  duration: qualification.duration || null,
                  // INSTITUTION_NAME: qualification.INSTITUTION_NAME || '',
                };
              }

              console.log(
                mappedQualifications,
                'mappedQualifications',
                mappedQualificationMap
              );

              // Combine master and mapped qualifications
              this.qualificationSetOfCheckedId.clear();
              this.qualificationSelectedItems = [];

              for (const qualification of this.masterQualificationData) {
                const mappedQualification =
                  mappedQualificationMap[qualification.id];
                const isChecked =
                  mappedQualification && mappedQualification.isActive;

                if (isChecked) {
                  this.qualificationSetOfCheckedId.add(qualification.id);
                }

                this.qualificationSelectedItems.push({
                  ...qualification,
                  checkedQualifications: isChecked,
                  mappedQualificationId: mappedQualification
                    ? mappedQualification.id
                    : null,
                  instructions: mappedQualification
                    ? mappedQualification.instructions
                    : null,
                  duration: mappedQualification
                    ? mappedQualification.duration?.toString() || null
                    : null,
                  // INSTITUTION_NAME: mappedQualification ? mappedQualification.INSTITUTION_NAME : '',
                });
              }

              // Update state after data combination
              this.masterQualificationList = [
                ...this.qualificationSelectedItems,
              ];
              this.refreshQualificationCheckedStatus();

              this.qualificationLoadingRecords = false;
              this.loadingRecords = false;
              // this.mapQualificationsDrawerVisible = true;
              this.drawerTestMapping = true;

              console.log(
                this.qualificationSelectedItems,
                'Combined Data (masterQualificationData + mappedQualifications)'
              );
            },
            error: (err) => {
              console.error(err);
              this.qualificationLoadingRecords = false;
              this.loadingRecords = false;
              this.drawerTestMapping = true;
            },
          });
        },
      });
  }

  mapTestDrawerClose() {
    this.drawerTestMapping = false;
  }

  mapTechnicalDrawerSave() {
    if (this.qualificationSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Test', '');
    } else {
      const checkedQualifications: any[] = [];
      const uncheckedQualifications: any[] = [];
      console.log(
        this.masterQualificationData,
        'qualifications',
        this.qualificationSelectedItems,
        this.masterQualificationList
      );

      for (let i = 0; i < this.masterQualificationData.length; i++) {
        const qualification = this.masterQualificationData[i];
        const isChecked = this.qualificationSetOfCheckedId.has(
          qualification.id
        );

        const mappedQualification = this.qualificationSelectedItems.find(
          (item) => item.id === qualification.id
        );

        const mappedQualificationId =
          mappedQualification?.mappedQualificationId || null;
        let Durationforvalidation = mappedQualification?.duration || null;

        const instructionforvalidation =
          mappedQualification?.instructions || null;

        if (isChecked) {
          if (!Durationforvalidation) {
            this.message.error(`Duration is missing for Mapping test.`, '');
            return;
          }
          if (!instructionforvalidation) {
            this.message.error(`Instructions is missing for Mapping test.`, '');
            return;
          }
          const qualificationObj: any = {
            test_id: qualification.id,
            lab_id: this.TEST_ID,
            duration: Durationforvalidation,
            instructions: instructionforvalidation,
            is_active: 1,
          };
          if (mappedQualificationId) {
            qualificationObj.id = mappedQualificationId; // Include id only if it exists
          }
          checkedQualifications.push(qualificationObj);
        } else {
          const qualificationObj: any = {
            test_id: qualification.id,
            lab_id: this.TEST_ID,
            duration: Durationforvalidation,
            instructions: instructionforvalidation,
            is_active: 0,
          };
          if (mappedQualificationId) {
            qualificationObj.id = mappedQualificationId; // Include id only if it exists
          }
          uncheckedQualifications.push(qualificationObj);
        }
      }

      const allQualifications = [
        ...checkedQualifications,
        ...uncheckedQualifications,
      ];

      console.log(allQualifications, 'Data to be saved');

      allQualifications.forEach((qualification) => {
        qualification['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allQualifications };

      this.qualificationLoadingRecords = true;
      // API call to save the mapped qualifications
      this.api.maptest(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Test Mapped Successfully', '');
            this.drawerTestMapping = false;
            // this.mapQualificationsDrawerVisible = false;
            this.qualificationSetOfCheckedId.clear();
            this.qualificationLoadingRecords = false;
          } else {
            this.message.error('Test Mapping Failed', '');
            this.qualificationLoadingRecords = false;
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.message.error('Test Mapping Failed', '');
          this.qualificationLoadingRecords = false;
        }
      );
    }
  }

  refreshQualificationCheckedStatus(): void {
    this.checkedQualifications = this.qualificationSelectedItems.every((item) =>
      this.qualificationSetOfCheckedId.has(item.id)
    );
    this.qualificationIndeterminate =
      this.qualificationSelectedItems.some((item) =>
        this.qualificationSetOfCheckedId.has(item.id)
      ) && !this.checkedQualifications;
  }

  updateTotalQualificationRecords(): void {
    this.QUALIFICATION_SELECTED_RECORDS = this.qualificationSetOfCheckedId.size;
  }

  onAllQualificationsChecked(value: boolean): void {
    console.log(value);

    this.qualificationSetOfCheckedId.clear();
    if (value) {
      console.log(this.masterQualificationData);

      this.masterQualificationData.forEach((item) =>
        this.qualificationSetOfCheckedId.add(item.id)
      );
    }
    this.qualificationSelectedItems.forEach(
      (item) => (item.checkedQualifications = value)
    );
    this.refreshQualificationCheckedStatus();
    this.updateTotalQualificationRecords();
  }

  updateQualificationCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.qualificationSetOfCheckedId.add(id);
    } else {
      this.qualificationSetOfCheckedId.delete(id);
    }
    console.log(this.qualificationSetOfCheckedId, 'updated checked status');
  }

  onQualificationItemChecked(id: number, checked: boolean): void {
    console.log(id, ' ', checked);

    this.updateQualificationCheckedSet(id, checked);
    this.qualificationSelectedItems.forEach(
      (data) =>
      (data.checkedQualifications = this.qualificationSetOfCheckedId.has(
        data.id
      ))
    );
    this.refreshQualificationCheckedStatus();
    this.updateTotalQualificationRecords();
  }

  disableFutureYears = (current: Date): boolean => {
    return current && current > new Date();
  };

  confirm(): void {
    this.message.success('Test mapped successfully!', '');
    this.drawerTestMapping = false;
  }

  datalist1: any[] = [];
  searchText1: any;

  searchQualifications(searchText: any) {
    console.log(searchText);

    this.qualificationLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.datalist1 = this.masterQualificationList.filter((user) => {
        return (
          user.duration.toLowerCase().includes(searchTextLower) ||
          user.instructions.toLowerCase().includes(searchTextLower)
        );
      });
      this.qualificationSelectedItems = [...this.datalist1];
    } else {
      this.qualificationSelectedItems = [...this.masterQualificationList];
    }
    this.qualificationLoadingRecords = false;
  }

  //................. End Lab Test Mapping.......................

  // .................... Start Lab Technician Mapping Start...............

  searchText2 = '';
  DoctorsList: any = [];
  OriginalList: any = [];
  mapDoctorSpinning = false;
  checked = false;
  indeterminate = false;
  mappedIDs = new Set<number>();
  datatoSendDoctor: any = [];
  setOfCheckedId = new Set();
  selectedItems: any = [];
  doctorMappingData = new LabMaster();
  SELECTED_RECORDS = 0;

  keyup2() {
    if (this.searchText2.trim().length >= 3 || this.searchText2.length === 0) {
      this.searchDoctor();
    }
  }

  searchDoctor() {
    if (!this.searchText2.trim()) {
      this.DoctorsList = [...this.OriginalList];
    } else {
      const searchText = this.searchText2.trim().toLowerCase();
      this.DoctorsList = this.OriginalList.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchText)
      );
    }
  }

  preventDefault(event) {
    document.getElementById('search')?.focus();
    // event.preventDefault()
  }
  updateTotalRecords() {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }

  onAllChecked(value) {
    this.mappedIDs.clear();
    if (this.datatoSendDoctor.length > 0) {
      this.datatoSendDoctor.forEach((data) => {
        const idVal = data.id !== undefined ? data.id : data.ID;
        if (idVal !== undefined && idVal !== null) {
          this.mappedIDs.add(idVal);
        }
      });
    }
    this.checked = value;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.selectedItems = [];
    this.datatoSendDoctor = [];
    this.DoctorsList.forEach((data) => {
      if (typeof data === 'object') {
        data.checked = value;
        data.association_date = new Date();
        data.is_active = value ? 1 : 0;
        const doctorData = {
          client_id: 1,
          technician_id: data.id,
          lab_id: this.doctorMappingData.lab_id,
          association_date:
            this.datePipe.transform(data.association_date, 'yyyy-MM-dd') || '',
          is_active: value ? 1 : 0,
        };
        if (value) {
          this.setOfCheckedId.add(data.id);
          this.selectedItems.push(data);
        }
        this.datatoSendDoctor.push(doctorData);
      }
    });
    if (this.mappedIDs.size > 0) {
      const mappedIDsArray = Array.from(this.mappedIDs);
      this.datatoSendDoctor.forEach((data, index) => {
        if (mappedIDsArray[index] !== undefined) {
          data.id = mappedIDsArray[index];
        }
      });
    }
    localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    this.updateTotalRecords();
  }

  sortData(sortKey, sortOrder) {
    this.DoctorsList.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }

  onItemChecked(item, checked) {
    // Update the item properties
    item.association_date = new Date();
    item.is_active = checked ? 1 : 0;

    // Prepare the doctorData object
    const doctorData = {
      client_id: 1,
      technician_id: item.id,
      lab_id: this.doctorMappingData.lab_id,
      association_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      is_active: checked ? 1 : 0,
    };

    // Find index of the item in datatoSendDoctor using either TECHNICIAN_ID or technician_id
    const existingIndex = this.datatoSendDoctor.findIndex(
      (data) => (data.technician_id === item.id || data.TECHNICIAN_ID === item.id)
    );

    if (existingIndex === -1) {
      // If the item is not in the array, add it
      this.datatoSendDoctor.push(doctorData);
    } else {
      // If the item exists, update its properties safely
      const target = this.datatoSendDoctor[existingIndex];
      if ('is_active' in target) {
        target.is_active = checked ? 1 : 0;
      }
      if ('IS_ACTIVE' in target) {
        target.IS_ACTIVE = checked ? 1 : 0;
      }
      const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if ('association_date' in target) {
        target.association_date = formattedDate;
      }
      if ('ASSOCIATION_DATE' in target) {
        target.ASSOCIATION_DATE = formattedDate;
      }
    }

    // Update the selectedItems array similarly
    const selectedIndex = this.selectedItems.findIndex(
      (data) => (data.technician_id === item.id || data.TECHNICIAN_ID === item.id)
    );

    if (checked) {
      if (selectedIndex === -1) {
        this.selectedItems.push(doctorData);
      } else {
        const target = this.selectedItems[selectedIndex];
        if ('is_active' in target) {
          target.is_active = 1;
        }
        if ('IS_ACTIVE' in target) {
          target.IS_ACTIVE = 1;
        }
      }
    } else {
      if (selectedIndex !== -1) {
        const target = this.selectedItems[selectedIndex];
        if ('is_active' in target) {
          target.is_active = 0;
        }
        if ('IS_ACTIVE' in target) {
          target.IS_ACTIVE = 0;
        }
      }
    }
    this.updateCheckedSet(item.id, checked);
    this.updateTotalRecords();
  }

  updateCheckedSet(id, checked) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    const totalItems = this.DoctorsList.length;
    const selectedItems = this.setOfCheckedId.size;
    this.checked = selectedItems === totalItems;
    this.indeterminate = selectedItems > 0 && selectedItems < totalItems;
  }

  onDateChange(i, data) {
    const formattedDate = this.datePipe.transform(data, 'yyyy-MM-dd');
    if (this.datatoSendDoctor[i]) {
      if ('association_date' in this.datatoSendDoctor[i]) {
        this.datatoSendDoctor[i]['association_date'] = formattedDate;
      }
      if ('ASSOCIATION_DATE' in this.datatoSendDoctor[i]) {
        this.datatoSendDoctor[i]['ASSOCIATION_DATE'] = formattedDate;
      }
    }
  }

  Technician(data: any) {
    let filter = '';
    this.drawerTitle2 = 'Map Technician';
    this.drawerTechnicianMapping = true;
    this.doctorMappingData = new LabMaster();
    this.doctorMappingData.lab_id = data.id;
    this.mapDoctorSpinning = true;
    let filter2 = data.id;
    this.setOfCheckedId.clear();
    this.datatoSendDoctor = [];
    this.selectedItems = [];
    this.api.getTechnician(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200) {
          this.DoctorsList = data.body.data || [];
          this.OriginalList = [...this.DoctorsList];
          this.mapDoctorSpinning = false;
          this.api.getmapTechnician(filter2).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                const compareData = res.body.data || [];
                this.DoctorsList.forEach((doctor) => {
                  const matchedData = compareData.find(
                    (mapped) => (mapped.technician_id === doctor.id || mapped.TECHNICIAN_ID === doctor.id)
                  );
                  if (matchedData) {
                    const isActive = matchedData.is_active !== undefined ? matchedData.is_active : matchedData.IS_ACTIVE;
                    const techId = matchedData.technician_id !== undefined ? matchedData.technician_id : matchedData.TECHNICIAN_ID;
                    const assocDate = matchedData.association_date !== undefined ? matchedData.association_date : matchedData.ASSOCIATION_DATE;

                    if (isActive == 1) {
                      this.setOfCheckedId.add(techId);
                    }
                    doctor.checked = isActive == 1;
                    doctor.is_active = isActive;
                    doctor.association_date = assocDate;
                    this.datatoSendDoctor.push({ ...matchedData });
                    this.selectedItems.push({ ...matchedData });
                  } else {
                    doctor.checked = false;
                    doctor.is_active = 0;
                    const doctorData = {
                      client_id: 1,
                      technician_id: doctor.id,
                      lab_id: this.doctorMappingData.lab_id,
                      association_date:
                        this.datePipe.transform(new Date(), 'yyyy-MM-dd') ||
                        '',
                      is_active: 0,
                    };
                    this.datatoSendDoctor.push(doctorData);
                    this.selectedItems.push(doctorData);
                  }
                });
                const totalItems = this.DoctorsList.length;
                const selectedItems = this.setOfCheckedId.size;
                this.checked = selectedItems === totalItems;
                this.indeterminate =
                  selectedItems > 0 && selectedItems < totalItems;
              }
            },
            () => {
              this.mapDoctorSpinning = false;
              this.message.error('Failed to fetch mapped Technician list', '');
            }
          );
          this.mapDoctorSpinning = false;
        } else {
          this.DoctorsList = [];
          this.OriginalList = [];
          this.mapDoctorSpinning = false;
          this.message.error('Failed to fetch Technician map list', '');
        }
      },
      () => {
        this.message.error('Something went wrong', '');
        this.mapDoctorSpinning = false;
      }
    );
  }

  closeDoctorMapping() {
    this.drawerTechnicianMapping = false;
    this.doctorMappingData = new LabMaster();
    this.searchText2 = '';
  }

  saveMapDoctor(boolean) {
    this.mapDoctorSpinning = true;
    if (this.datatoSendDoctor.length == 0) {
      this.message.error('Please Select Mapping Data', '');
      this.mapDoctorSpinning = false;
    } else {
      let data = {
        data: this.datatoSendDoctor,
      };
      this.validateData(data);
    }
  }

  validateData(data: any) {
    const invalidEntries = data.data.filter(
      (entry) => {
        const isActive = entry.is_active !== undefined ? entry.is_active : entry.IS_ACTIVE;
        const assocDate = entry.association_date !== undefined ? entry.association_date : entry.ASSOCIATION_DATE;
        return isActive == 1 && !assocDate;
      }
    );

    if (invalidEntries.length > 0) {
      this.message.error(
        'Please Select Association Date For The Selected Technician .',
        ''
      );
      this.mapDoctorSpinning = false;
    } else {
      this.api.MapTechnicianAddbulk(data).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.mapDoctorSpinning = false;
            this.message.success('Technician Mapped Successfully', '');
            this.drawerTechnicianMapping = false;
          } else {
            this.mapDoctorSpinning = false;
            this.message.error('Failed to map Technician', '');
          }
        },
        (err) => {
          this.mapDoctorSpinning = false;
          console.log(err);
        }
      );
    }
  }

  // ....................End  Lab Technician Mapping Start...............

  drawerCloseTestMapping(): void {
    // this.search();
    this.drawerTestMapping = false;
  }

  get closeCallbackmapping() {
    return this.drawerCloseTestMapping.bind(this);
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
    this.drawerTitle3 = 'Technicians Service Mapping';
    this.drawerTechnicianserviceMapping = true;
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
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters()

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

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  drawerTitleAppointMent;
  drawerDataAppointMent: LabAppointmentMaster = new LabAppointmentMaster();
  drawerCloseAppointMent() {
    this.drawerVisibleAppointment = false;
    this.search();
  }
  drawerVisibleAppointment = false;
  labID;

  LAB_NAME: any;
  BookLabAppointment(data) {
    //  console.log(data)
    this.LAB_NAME = data.name;
    this.drawerVisibleAppointment = true;
    this.drawerDataAppointMent = new LabAppointmentMaster();
    this.labID = data.id;
    this.drawerTitleAppointMent = 'Book Lab Appointment';
  }

  get closeCallbackAppointMent() {
    return this.drawerCloseAppointMent.bind(this);
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
    this.drawerTitle = 'Lab Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[1]['options'] = this.countryData.map((data) => ({
      value: data.ID,
      display: data.NAME,
    }));
    this.filterFields[2]['options'] = this.stateData.map((data) => ({
      value: data.ID,
      display: data.NAME,
    }));
    this.filterFields[3]['options'] = this.districtData.map((data) => ({
      value: data.ID,
      display: data.NAME,
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
      key: 'country_name',
      label: 'Country',
      type: 'text',
      comparators: ['=', '!='],
      placeholder: 'Enter Country',
    },
    // {
    //   key: 'COUNTRY_ID',
    //   label: 'Country',
    //   type: 'select',
    //   comparators: ['=', '!='],
    //   placeholder: 'Select Country',
    // },

    {
      key: 'state_name',
      label: 'State',
      type: 'text',
      comparators: ['=', '!='],
      placeholder: 'Enter State',
    },

    {
      key: 'district_name',
      label: 'District',
      type: 'text',
      comparators: ['=', '!='],
      placeholder: 'Enter District',
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

  // filterQuery = '';
  applyfilter(item) {
    console.log(item);

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.id;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

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
