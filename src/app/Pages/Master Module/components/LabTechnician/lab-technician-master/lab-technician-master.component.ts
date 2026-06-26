import { Component, Input } from '@angular/core';
import { LabTechnician } from '../../../Models/LabTechicianMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/Service/drawer.service';
interface AvailabilityPayload {
  day_of_week: string;
  session_name: string;
  is_active: number;
  start_time: any;
  lab_id: any;
  technician_id: any;
  end_time: any;
  mode: string;
  type_id: any;
  slot_duration: number | null;
  id?: any;
  client_id?: number;
}
interface SessionConfig {
  day_of_week: string;
  session_name: string;
  is_active?: boolean;
  start_time?: any;
  end_time?: any;
  mode?: string;
  type_id?: number;
  slot_duration?: number;
  lab_id?: number;
  technician_id?: number;
  id?: any;
}
interface DoctorAvailabilityConfig {
  [day: string]: SessionConfig[];
}
@Component({
  selector: 'app-lab-technician-master',
  templateUrl: './lab-technician-master.component.html',
  styleUrls: ['./lab-technician-master.component.css'],
})

export class LabTechnicianMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: LabTechnician = new LabTechnician();
  formTitle = "Manage Technicians";
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
    ['name', 'Name'],
    // ['lab_technician_name', 'Name'],
    ['address_line_1', 'Address Line 1'],
    ['address_line_2', 'Address Line 2'],
    ['country_name', 'Country'],
    ['state_name', 'State'],
    ['district_name', 'District'],
    ['pincode_number', 'Pincode'],
    ['mobile_no', 'Mobile Number'],
    ['gender', 'Gender'],
    ['dob', 'Date of Birth'],
    ['about', 'About'],
    ['experience', 'Experience'],
    ['registration_number', 'Registration Number'],
  ];
  adminId: any;
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
  genderFilter: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
    { text: 'Other', value: 'O' },
  ];
  indeterminate: boolean;
  onGenderFilterChange(data) {
    this.genderText = data;
  }
  visible = false;
  showcloumnVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  // Main filter
  showcolumn = [
    { label: 'Name', key: 'name', visible: true },
    { label: 'Address Line 1', key: 'address_line_1', visible: true },
    { label: 'Address Line 2', key: 'address_line_2', visible: true },
    { label: 'Country', key: 'country_id', visible: true },
    { label: 'State', key: 'state_id', visible: true },
    { label: 'District', key: 'district_id', visible: true },
    { label: 'Pincode', key: 'pincode_id', visible: true },
    { label: 'Mobile Number', key: 'mobile_no', visible: true },
    { label: 'Gender', key: 'gender', visible: true },
    { label: 'Date of Birth', key: 'dob', visible: true },
    { label: 'About', key: 'about', visible: true },
    { label: 'Experience', key: 'experience', visible: true },
    { label: 'Registration Number', key: 'registration_number', visible: true },
  ];
  namevisible: boolean;
  nametext = '';
  mobilenovisible: boolean;
  mobilenotext = '';
  genderVisible = false;
  dobVisible = false;
  aboutVisible = false;
  experienceVisible = false;
  registrationNumberVisible = false;
  addressLine1visible: boolean;
  addressLine2visible: boolean;
  selectedStates: any = [];
  selectedDistricts: any = [];
  selectedPincodes: any = [];
  districtVisible: boolean;
  pincodevisible: boolean;
  countryload: boolean;
  stateload: boolean;
  districtload: boolean;
  pincodeload: boolean;
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  @Input() data: LabMaster = new LabMaster();
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Address Line 1', value: 'address_line_1' },
    { label: 'Address Line 2', value: 'address_line_2' },
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'district_id' },
    { label: 'Pincode', value: 'pincode_id' },
    { label: 'Mobile Number', value: 'mobile_no' },
    { label: 'Gender', value: 'gender' },
    { label: 'Date of Birth', value: 'dob' },
    { label: 'About', value: 'about' },
    { label: 'Experience', value: 'experience' },
    { label: 'Registration Number', value: 'registration_number' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router,
    private drawerService: DrawerService

  ) { }

  back() {
    this.drawerService.openDrawer();
  }
  sessionValue: any
  rawData = sessionStorage.getItem('labId');

  ngOnInit(): void {
    this.adminId = Number(sessionStorage.getItem('roleId'));
    this.loadingRecords = false;
    this.getCountyData();
    this.getStateList();
    this.getDistricts();
    this.getPinCodes();
    // console.log(this.roleID, 'roleId');
    if (this.roleID == 1) {
      this.sessionValue = null
    }
    else {

      this.sessionValue = this.rawData
        ? this.commonFunction.decryptdata(this.rawData)
        : null;
    }

  }
  countryData: any = [];
  stateData: any = [];
  districtData: any = [];
  pincodeData: any = [];
  getCountyData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.countryload = true;
    this.api.getCountryDropdown(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.countryData = data.body['data'];
          this.countryload = false;
        } else {
          this.countryData = [];
          this.countryload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
        this.countryload = false;
      }
    );
  }


  getStateList() {
    const filter = `AND IS_ACTIVE = 1`;
    this.stateload = true;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;
        if (statusCode === 200 && responseBody?.data) {
          this.stateload = false;
          this.stateData = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.stateData = [];
          this.stateload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.stateload = false;
      }
    );
  }
  getDistricts() {
    const filter = `AND IS_ACTIVE = 1`;
    this.districtload = true;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;
        if (statusCode === 200 && responseBody?.data) {
          this.districtload = false;
          this.districtData = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.districtData = [];
          this.districtload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.districtload = false;
      }
    );
  }



  getPinCodes() {
    const filter = `AND IS_ACTIVE = 1`;
    this.pincodeload = true;
    this.api.getPincodeType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);
        const statusCode = response.status;
        const responseBody = response.body;
        if (statusCode === 200 && responseBody?.data) {
          this.pincodeload = false;
          this.pincodeData = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.pincodeData = [];
          this.pincodeload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.pincodeload = false;
      }
    );
  }



  onCountryChange(): void {
    this.search();
  }
  drawerTitle3!: string;
  techicianMappingData = new LabMaster();
  drawerTechnicianserviceMapping: boolean = false;
  TechniciansService(data: any) {
    this.drawerTitle3 = 'Technicians Service Mapping';
    this.techicianMappingData = Object.assign({}, data);
    this.drawerTechnicianserviceMapping = true;
  }
  drawerCloseTechnicianserviceMapping(): void {
    // this.search();

    this.drawerTechnicianserviceMapping = false;
  }
  get closeCallbackTechnicianservice() {
    return this.drawerCloseTechnicianserviceMapping.bind(this);
  }
  originalDataLocationList: any = [];
  labtechniciainslocationtitle = 'Map Technician Location';
  labtechnicianlocationVisible = false;
  labLocationMapSpinning = false;
  searchtext3 = '';
  datatoSendLocation: any = [];
  changeEvent(districtId) {
    this.data.district_id = districtId;
    this.labLocationMapSpinning = true;
    if (districtId) {
      let filter = ' AND is_active=1 AND district_id=' + districtId;
      this.api.getTechnicianLocationList(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.labLocationMapSpinning = false;
            this.labLocationdataList = res.body.data || [];
            let id = this.roleID === 3 ? this.data.technician_id : this.data.id;
            this.api.getTechnicianLocationMappedList(id).subscribe(
              (mappedRes: HttpResponse<any>) => {
                if (mappedRes.status === 200) {
                  const compareData = mappedRes.body.data || [];
                  this.datatoSendLocation = [];
                  this.selectedItems = [];
                  this.setOfCheckedId.clear();
                  this.labLocationdataList.forEach((doctor) => {
                    const matchedData = compareData.find(
                      (mapped) => mapped.pincode_id === doctor.id && mapped.lab_technician_id === id
                    );

                    if (matchedData) {
                      if (matchedData.is_active == 1) {
                        this.setOfCheckedId.add(matchedData.pincode_id);
                      }
                      doctor.checked = matchedData.is_active == 1;
                      doctor.is_active = matchedData.is_active;
                      this.datatoSendLocation.push({ ...matchedData });
                      this.selectedItems.push({ ...matchedData });
                    } else {
                      doctor.checked = false;
                      doctor.is_active = 0;
                    }
                  });
                  const totalItems = this.labLocationdataList.length;
                  const selectedItems = this.setOfCheckedId.size;
                  this.checked = totalItems > 0 && selectedItems === totalItems;
                  this.indeterminate =
                    selectedItems > 0 && selectedItems < totalItems;
                }
              },
              () => {
                this.labLocationMapSpinning = false;
                this.message.error('Failed to fetch mapped location list', '');
              }
            );
          } else {
            this.labLocationMapSpinning = false;
            this.labLocationdataList = [];
          }
        },
        (err) => {
          this.labLocationMapSpinning = false;
          this.labLocationdataList = [];
        }
      );
    } else {
      this.labLocationMapSpinning = false;
      this.labLocationdataList = [];
    }
  }
  ViewlabTechnicianLocation(data: any) {
    this.data.id = data.id;
    this.data.technician_id = data.technician_id;

    this.labtechniciainslocationtitle = 'Map Technician Location';
    this.labtechnicianlocationVisible = true;
    this.labLocationMapSpinning = true;
    let filter = ' AND is_active=1';
    if (data.district_id) {
      this.data.district_id = data.district_id;
      filter = ' AND is_active=1 AND district_id=' + data.district_id;
    } else {
      filter = ' AND is_active=1';
    }
    this.api.getTechnicianLocationList(filter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status == 200) {
          this.labLocationMapSpinning = false;
          this.originalDataLocationList = res.body.data || [];
          this.labLocationdataList = res.body.data || [];
          let ID = this.roleID === 3 ? data.technician_id : data.id;
          this.api.getTechnicianLocationMappedList(ID).subscribe(
            (mappedRes: HttpResponse<any>) => {
              if (mappedRes.status === 200) {
                const compareData = mappedRes.body.data || [];
                this.datatoSendLocation = [];
                this.selectedItems = [];
                this.setOfCheckedId.clear();
                this.labLocationdataList.forEach((doctor) => {
                  const matchedData = compareData.find(
                    (mapped) => mapped.pincode_id === doctor.id && mapped.lab_technician_id === ID
                  );

                  if (matchedData) {
                    if (matchedData.is_active == 1) {
                      this.setOfCheckedId.add(matchedData.pincode_id);
                    }
                    doctor.checked = matchedData.is_active == 1;
                    doctor.is_active = matchedData.is_active;
                    this.datatoSendLocation.push({ ...matchedData });
                    this.selectedItems.push({ ...matchedData });
                  } else {
                    doctor.checked = false;
                    doctor.is_active = 0;
                  }
                });
                const totalItems = this.labLocationdataList.length;
                const selectedItems = this.setOfCheckedId.size;
                this.checked = totalItems > 0 && selectedItems === totalItems;
                this.indeterminate =
                  selectedItems > 0 && selectedItems < totalItems;
              }
            },
            () => {
              this.labLocationMapSpinning = false;
              this.message.error('Failed to fetch mapped location list', '');
            }
          );
        } else {
          this.labLocationdataList = [];
          this.labLocationMapSpinning = false;
        }
      },
      (err) => {
        this.labLocationMapSpinning = false;
      }
    );
  }
  drawerCloselabTechnicianLocation(): void {
    // this.search();
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.labLocationdataList = [];
    this.labtechnicianlocationVisible = false;
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  sortData(sortKey, sortOrder) {
    this.labLocationdataList.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }
  mappedIDs = new Set<number>();
  onAllChecked(value) {
    this.mappedIDs.clear();
    if (this.datatoSendLocation.length > 0) {
      this.datatoSendLocation.forEach((data) => {
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
    this.datatoSendLocation = [];
    this.labLocationdataList.forEach((data) => {
      if (typeof data === 'object') {
        data.checked = value;
        data.is_active = value ? 1 : 0;
        const doctorData = {
          client_id: 1,
          pincode_id: data.id,
          lab_technician_id: this.roleID === 3 ? this.data.technician_id : this.data.id,
          is_active: value ? 1 : 0,
          seq_no: data.seq_no,
        };
        if (value) {
          this.setOfCheckedId.add(data.id);
          this.selectedItems.push(doctorData);
        }
        this.datatoSendLocation.push(doctorData);
      }
    });

    if (this.mappedIDs.size > 0) {
      const mappedIDsArray = Array.from(this.mappedIDs);
      this.datatoSendLocation.forEach((data, index) => {
        if (mappedIDsArray[index] !== undefined) {
          data.id = mappedIDsArray[index];
        }
      });
    }
    localStorage.setItem('editData', JSON.stringify(this.selectedItems));
  }

  onItemChecked(item, checked) {
    item.is_active = checked ? 1 : 0;

    const doctorData = {
      client_id: 1,
      pincode_id: item.id,
      lab_technician_id: this.roleID === 3 ? this.data.technician_id : this.data.id,
      is_active: checked ? 1 : 0,
      seq_no: item.seq_no,
    };

    const existingIndex = this.datatoSendLocation.findIndex(
      (data) => data.pincode_id === item.id
    );

    if (existingIndex === -1) {
      this.datatoSendLocation.push(doctorData);
    } else {
      this.datatoSendLocation[existingIndex].is_active = doctorData.is_active;
      this.datatoSendLocation[existingIndex].seq_no = item.seq_no;
    }

    const selectedIndex = this.selectedItems.findIndex(
      (data) => data.pincode_id === item.id
    );

    if (checked) {
      if (selectedIndex === -1) {
        this.selectedItems.push(doctorData);
      }
    } else {
      if (selectedIndex !== -1) {
        this.selectedItems[selectedIndex].is_active = 0;
      }
    }

    this.updateCheckedSet(item.id, checked);
  }

  updateCheckedSet(id, checked) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    const totalItems = this.labLocationdataList.length;
    const selectedItems = this.setOfCheckedId.size;
    this.checked = selectedItems === totalItems;
    this.indeterminate = selectedItems > 0 && selectedItems < totalItems;
  }
  selectedItems: any[] = [];
  setOfCheckedId = new Set();

  labLocationdataList: any = [];
  isSpinning = false;
  isOk = true;

  checked = false;
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

  roleId = sessionStorage.getItem('roleId');
  decrepteduserIDString = this.roleId ? this.commonFunction.decryptdata(this.roleId) : '';
  roleID = parseInt(this.decrepteduserIDString, 10);


  //  public commonFunction = new CommonFunctionService()

  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId ? this.commonFunction.decryptdata(this.labId) : '';
  labID = parseInt(this.decreptedlabIDDString, 10);

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
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `name LIKE '%${this.nametext.trim()}%'`;
    }
    if (this.mobileNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `mobile_no LIKE '%${this.mobileNoText.trim()}%'`;
    }
    if (this.genderText !== '') {
      likeQuery += (likeQuery ? ' AND ' : '') + `gender = '${this.genderText}'`;
    }
    if (this.dobText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `dob LIKE '%${this.dobText.trim()}%'`;
    }
    if (this.aboutText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `about LIKE '%${this.aboutText.trim()}%'`;
    }
    if (this.experienceText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `experience LIKE '%${this.experienceText.trim()}%'`;
    }
    if (this.registrationNumberText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `registration_number LIKE '%${this.registrationNumberText.trim()}%'`;
    }
    if (this.addressLine1Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `address_line_1 LIKE '%${this.addressLine1Text.trim()}%'`;
    }
    if (this.addressLine2Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `address_line_2 LIKE '%${this.addressLine2Text.trim()}%'`;
    }
    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `country_id IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `state_id IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    // Handle selected Districts
    if (this.selectedDistricts.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `district_id IN (${this.selectedDistricts.join(',')})`; // Update with actual field name in the DB
    }
    // Handle selected Pincodes
    if (this.selectedPincodes.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `pincode_id IN (${this.selectedPincodes.join(',')})`; // Update with actual field name in the DB
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

    // Call API with updated search query


    if (this.roleID === 1) {

      this.api
        .getLabTechnicians(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
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

    else {
      this.api
        .getLabTechnicianMapping(
          // this.pageIndex,
          // this.pageSize,
          // this.sortKey,
          // sort,
          // likeQuery
          this.labID
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            // console.log(response, 'response')
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




  searchLocation() {
    if (!this.searchtext3.trim()) {
      this.labLocationdataList = [...this.originalDataLocationList];
    } else {
      const searchText = this.searchtext3.trim().toLowerCase();
      this.labLocationdataList = this.originalDataLocationList.filter(
        (doctor) => doctor.area_name.toLowerCase().includes(searchText)
      );
    }
  }
  mapTechnicalLoactionDrawerSave() {
    this.labLocationMapSpinning = true;
    if (this.datatoSendLocation.length == 0) {
      this.message.error('Please Select Mapping Data', '');
      this.labtechnicianlocationVisible = false;
    } else {
      // console.log(this.datatoSendLocation);
      let data = {
        data: this.datatoSendLocation,
      };
      // this.validateData(data);
      this.api.MapTechnicianLocation(data).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.labLocationMapSpinning = false;
            this.message.success('Location Mapped Successfully', '');
            this.drawerTechnicianserviceMapping = false;
            this.drawerCloselabTechnicianLocation();
          } else {
            this.labLocationMapSpinning = false;
            this.message.error('Failed to map Location', '');
          }
        },
        (err) => {
          this.labLocationMapSpinning = false;
          console.log(err);
        }
      );
    }
  }
  reset(): void {
    this.searchText = '';
    this.statetext = '';
    this.search();
  }
  add(): void {
    this.drawerTitle = 'Create New Technician';
    this.drawerData = new LabTechnician();
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
  countryid;
  stateid;
  districtid;
  edit(data: LabTechnician): void {
    this.drawerTitle = ' Update Technician';
    this.drawerData = Object.assign({}, data);
    if (this.roleID != 1) {
      this.drawerData.name = this.drawerData.lab_technician_name
    }
    this.drawerVisible = true;
    this.countryid = data.country_id;
    this.stateid = data.state_id;
    this.districtid = data.district_id;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  disableFutureYears = (current: Date): boolean => {
    return current && current > new Date();
  };
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
    // console.log(selection4, 'selection4');
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
          }


          else if (selection2 == 'End With') {
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
      // console.log(this.INSERT_NAMES);
      this.visiblesave = false;
      this.QUERY_NAME = ''; // Clear input after adding
    }
    // this.visiblesave = false;
  }
  handleCancelTop(): void {
    this.visiblesave = false;
  }
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = this.api.retriveimgUrl;
  editData: boolean = false;
  searchText2: string = '';
  PROOF_DOCUMENT_URL: any;
  handleFileSelection(data: any): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf, .jpg, .jpeg, .png';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) =>
      this.onFileSelected(event, data)
    );
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  onFileSelected(event: any, data: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf'
    ) {
      const isLt2M = event.target.files[0].size < 5242880; // 5MB restriction
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileList2.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        let url = '';
        url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();

        if (
          data.proof_document_url != undefined &&
          data.proof_document_url.trim() != ''
        ) {
          const arr = data.proof_document_url.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }

        this.isSpinning = true;
        this.progressBarProfilePhoto = true;
        this.timerThree = this.api
          .onUpload('TechnicianProof', this.fileList2, url)
          .subscribe(
            (res: HttpEvent<any>) => {
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
              }

              if (res instanceof HttpResponse) {
                if (res.status === 200 && res.body?.message === 'Success') {
                  this.message.success(
                    data.qualification_name + ' Image uploaded successfully.',
                    ''
                  );
                  this.isSpinning = false;
                  data.proof_document_url = url;

                  // Update the task URL (if needed, though taskurl seems global and maybe unused or used for something else)
                  this.taskurl =
                    this.imgUrl + 'TechnicianProof/' + url;
                } else {
                  this.isSpinning = false;
                  this.message.error('Failed to upload image ' + data.qualification_name, '');
                  data.proof_document_url = null;
                  this.taskurl = '';
                }
              }
            },
            (error) => {
              this.message.error('Error uploading document.', '');
              this.isSpinning = false;
            }
          );
      } else {
        this.message.error('File size exceeds 5MB.', '');
        this.fileList2 = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG/PDF extensions.', '');
      this.fileList2 = null;
    }
  }

  removeLogo(data: any) {
    data.proof_document_url = null;
  }
  ImageModalVisible = false;
  imageshow: any;
  sanitizedLink: any;
  viewImage(imageURL: string): void {
    // console.log('viewImage called', imageURL);
    this.getImage(imageURL['proof_document_url']);
  }
  // Function to retrieve and sanitize image link
  getImage(link: string): void {
    // console.log('Getting Image');
    const imagePath =
      this.api.retriveimgUrl + 'TechnicianProof/' + link;
    // Sanitize the URL to prevent security issues
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    // console.log(this.sanitizer);
    this.imageshow = this.sanitizedLink;
    // console.log('Image path:', imagePath);
    // Show the modal
    this.ImageModalVisible = true;
  }
  // Close the modal
  ImageModalCancel(): void {
    this.ImageModalVisible = false;
    this.imageshow = null;
  }
  deleteCancel() { }
  TechnicianAvailabilityModalVisible = false;
  loadTechnicianAvailability = false;

  // doctorAvailabilityData: any[] = [];
  selectedTechnician: any;
  ConfigurationData: any = [];
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  disabledHoursForToTimeMorning(day: any): () => number[] {
    return () => {
      const startTime = this.ConfigurationData[day]?.[0]?.start_time;
      if (!startTime) {
        return [];
      } else {
        const dateObj = startTime instanceof Date ? startTime : new Date(startTime);
        const fromTimeHour = dateObj.getHours();
        return Array.from({ length: fromTimeHour }, (_, index) => index);
      }
    };
  }

  disabledMinutesForToTimeMorning(day: any): (hour: number) => number[] {
    return (hour: number) => {
      const startTime = this.ConfigurationData[day]?.[0]?.start_time;
      if (!startTime) {
        return [];
      } else {
        const dateObj = startTime instanceof Date ? startTime : new Date(startTime);
        if (hour !== dateObj.getHours()) {
          return [];
        } else {
          const fromTimeMinute = dateObj.getMinutes();
          return Array.from({ length: fromTimeMinute }, (_, index) => index);
        }
      }
    };
  }

  disabledHoursForToTime(day: string): () => number[] {
    return () => {
      const eveningData = this.ConfigurationData[day]?.[1]; // Accessing the evening session
      const startTime = eveningData?.start_time;

      if (!startTime) {
        return [];
      } else {
        const dateObj = startTime instanceof Date ? startTime : new Date(startTime);
        const fromTimeHour = dateObj.getHours();
        return Array.from({ length: fromTimeHour }, (_, index) => index);
      }
    };
  }

  disabledMinutesForToTime(day: string): (hour: number) => number[] {
    return (hour: number) => {
      const eveningData = this.ConfigurationData[day]?.[1]; // Accessing the evening session
      const startTime = eveningData?.start_time;

      if (!startTime) {
        return [];
      } else {
        const dateObj = startTime instanceof Date ? startTime : new Date(startTime);
        if (hour !== dateObj.getHours()) {
          return [];
        } else {
          const fromTimeMinute = dateObj.getMinutes();
          return Array.from({ length: fromTimeMinute }, (_, index) => index);
        }
      }
    };
  }
  selectedDoctor: any;
  // sessionValue: any = sessionStorage.getItem('userId');
  daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];



  Technician = '';
  customdrop = '';
  // technicians = ''


  technicians: any = [];
  lab_id: any = [];















  // onTechnicianselect(selectedId: any){
  //   this.api.getLabTecnicianMapping(  this.pageIndex,
  //       this.pageSize,
  //       this.sortKey,
  //       '',
  //       ' AND')
  // }


  getCaseInsensitiveKey(obj: any, key: string): any {
    if (!obj) return undefined;
    const lowerKey = key.toLowerCase();
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase() === lowerKey) {
        return obj[k];
      }
    }
    return undefined;
  }

  mapConfigurationResponse(responseBody: any[]): any {
    return this.daysOfWeek.reduce((acc, day) => {
      // Find all availability records for the current day
      const dayAvailability = responseBody.filter((avail: any) => {
        const dOfWeek = this.getCaseInsensitiveKey(avail, 'day_of_week');
        return dOfWeek && dOfWeek.toLowerCase() === day.toLowerCase();
      });

      // Helper function to parse time string/Date and return a Date object
      const parseTime = (time: any): Date | null => {
        if (!time) return null;
        if (time instanceof Date) return time;
        if (typeof time === 'string' && time.includes('T')) {
          return new Date(time);
        }
        const parts = String(time).split(':');
        if (parts.length >= 2) {
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
          const d = new Date();
          d.setHours(hours, minutes, seconds, 0);
          return d;
        }
        return null;
      };

      // Initialize morning and evening data with default empty values
      let morningData = {
        day_of_week: day,
        session_name: 'Morning',
        is_active: false,
        start_time: null as Date | null,
        end_time: null as Date | null,
        mode: '',
        type_id: null,
        slot_duration: null,
        lab_id: null,
        technician_id: null,
        id: null as any,
      };

      let eveningData = {
        day_of_week: day,
        session_name: 'Evening',
        is_active: false,
        start_time: null as Date | null,
        end_time: null as Date | null,
        mode: '',
        type_id: null,
        slot_duration: null,
        lab_id: null,
        technician_id: null,
        id: null as any,
      };

      // Process all records for the day (morning and evening)
      dayAvailability.forEach((availability) => {
        const sessionName = this.getCaseInsensitiveKey(availability, 'session_name');
        const isActive = this.getCaseInsensitiveKey(availability, 'is_active');
        const startTime = this.getCaseInsensitiveKey(availability, 'start_time');
        const endTime = this.getCaseInsensitiveKey(availability, 'end_time');
        const mode = this.getCaseInsensitiveKey(availability, 'mode');
        const typeId = this.getCaseInsensitiveKey(availability, 'type_id');
        const slotDuration = this.getCaseInsensitiveKey(availability, 'slot_duration');
        const labId = this.getCaseInsensitiveKey(availability, 'lab_id');
        const technicianId = this.getCaseInsensitiveKey(availability, 'technician_id');
        const id = this.getCaseInsensitiveKey(availability, 'id');

        if (sessionName === 'Morning') {
          morningData = {
            day_of_week: day,
            session_name: 'Morning',
            is_active: isActive === 1 || isActive === true,
            start_time: parseTime(startTime),
            end_time: parseTime(endTime),
            mode: mode || '',
            type_id: typeId,
            slot_duration: slotDuration,
            lab_id: labId,
            technician_id: technicianId,
            id: id,
          };
        } else if (sessionName === 'Evening') {
          eveningData = {
            day_of_week: day,
            session_name: 'Evening',
            is_active: isActive === 1 || isActive === true,
            start_time: parseTime(startTime),
            end_time: parseTime(endTime),
            mode: mode || '',
            type_id: typeId,
            slot_duration: slotDuration,
            lab_id: labId,
            technician_id: technicianId,
            id: id,
          };
        }
      });

      if (morningData.mode && morningData.mode !== '') {
        this.onConsultationModeChange(morningData.mode, day, '');
      }

      if (eveningData.mode && eveningData.mode !== '') {
        this.onConsultationModeChangeEvening(eveningData.mode, day, '');
      }

      // Add the day data to the accumulator
      acc[day] = [morningData, eveningData];
      return acc;
    }, {});
  }

  getDefaultConfigurationData(): any {
    return this.daysOfWeek.reduce((acc, day) => {
      acc[day] = [
        {
          day_of_week: day,
          session_name: 'Morning',
          is_active: false,
          start_time: null,
          end_time: null,
          mode: '',
          type_id: null,
          slot_duration: null,
          lab_id: null,
          technician_id: null,
          id: null,
        },
        {
          day_of_week: day,
          session_name: 'Evening',
          is_active: false,
          start_time: null,
          end_time: null,
          mode: '',
          type_id: null,
          slot_duration: null,
          lab_id: null,
          technician_id: null,
          id: null,
        },
      ];
      return acc;
    }, {});
  }

  loadtechnician: boolean = false
  onTechnicianselect(technicianId: string): void {
    const selectedTech = this.roleID === 1 ? this.technicians.find(tech => tech.id === technicianId) :
      this.technicians.find(tech => tech.lab_id == this.sessionValue);

    if (!selectedTech) {
      this.message.warning('Technician not found', '');
      return;
    }

    if (this.data.technician_id !== selectedTech.technician_id) {
      // Clear previous selection
      this.data.technician_id = null;
      this.lab_id = null;
    }

    // Set new values
    this.data.technician_id = selectedTech.technician_id;
    this.lab_id = this.roleID == 1 ? selectedTech.lab_id : this.sessionValue;

    this.loadtechnician = true;
    this.api
      .getTechnicianConfigurationData(this.lab_id, selectedTech.technician_id)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body?.data;
        if (statusCode === 200) {
          this.loadtechnician = false;
          if (responseBody && Array.isArray(responseBody) && responseBody.length > 0) {
            this.ConfigurationData = this.mapConfigurationResponse(responseBody);
          } else {
            this.ConfigurationData = this.getDefaultConfigurationData();
          }
          this.TechnicianAvailabilityModalVisible = true;
        }
        else {
          this.loadtechnician = false;
          this.message.error('Failed to load configuration', '');
        }
      });
  }


  //  

  openTechnicianAvailabilityModal(tech: any): void {
    this.Technician = tech.name;

    this.data.technician_id = null;
    this.ConfigurationData = {};
    this.lab_id = null; // Also clear lab ID if it's tied to previous technician
    this.technicians = [];
    this.selectedTechnician = tech;
    this.selectedDoctor = this.roleID == 1 ? tech.id : tech.technician_id;
    this.loadTechnicianAvailability = false;
    this.TechnicianAvailabilityModalVisible = true;

    let daasa;
    if (this.roleID != 1) {
      daasa = Number(this.sessionValue);
      this.Technician = tech.lab_technician_name;
    }
    else {
      daasa = null;
    }

    this.api.getLabTecnicianMapping(this.pageIndex,
      this.pageSize,
      this.sortKey,
      '',
      ' AND technician_id =' + this.selectedDoctor).subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.technicians = responseBody.data || [];
          if (this.roleID === 1) {
            this.lab_id = this.technicians?.[0]?.lab_id;
          }
          else {
            this.onTechnicianselect(this.selectedDoctor);
          }
        } else {
          this.technicians = [];
          this.message.error('Failed To Get Mapping Data', '');
        }

        if (this.roleID === 1) {
          if (this.technicians.length > 0) {
            this.data.technician_id = this.technicians[0].id;
          }
          this.api
            .getTechnicianConfigurationData(this.lab_id, tech.id)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body?.data;

              if (statusCode === 200) {
                if (responseBody && Array.isArray(responseBody) && responseBody.length > 0) {
                  this.ConfigurationData = this.mapConfigurationResponse(responseBody);
                } else {
                  this.ConfigurationData = this.getDefaultConfigurationData();
                }
                this.TechnicianAvailabilityModalVisible = true;
              } else {
                this.message.error(
                  'Failed to retrieve data from the server. Please try again.',
                  'Error'
                );
              }
            });
        }
        else {
          this.api
            .getTechnicianConfigurationData(this.sessionValue, tech.technician_id)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body?.data;

              if (statusCode === 200) {
                if (responseBody && Array.isArray(responseBody) && responseBody.length > 0) {
                  this.ConfigurationData = this.mapConfigurationResponse(responseBody);
                } else {
                  this.ConfigurationData = this.getDefaultConfigurationData();
                }
                this.TechnicianAvailabilityModalVisible = true;
              } else {
                this.message.error(
                  'Failed to retrieve data from the server. Please try again.',
                  'Error'
                );
              }
            });
        }
      });
  }

















  // openTechnicianAvailabilityModal(tech: any): void {
  //   this.selectedTechnician = tech;
  //   this.selectedDoctor = tech.ID;
  //   // this.TechnicianAvailabilityModalVisible = true;
  //   this.loadTechnicianAvailability = false;
  //   this.Technician = tech.NAME;
  //   // Example data where DAY_OF_WEEK is an array of selected days
  //   const daasa = 1; // Assuming this is correctly set as per your requirement



  //   // getCountyData() {
  //   //   const filter = `AND IS_ACTIVE = 1`;

  //     this.api.getLabTecnicianMapping(  this.pageIndex,
  //       this.pageSize,
  //       this.sortKey,
  //       '',
  //       '').subscribe((response: HttpResponse<any>) => {
  //       console.log(response);

  //       const statusCode = response.status;
  //       const responseBody = response.body;

  //       if (statusCode === 200 && responseBody?.data) {
  //         this.technicians = responseBody.data || []; // Ensure fallback to empty array if data is not available
  //       } else {
  //         this.technicians = [];
  //         this.message.error('Failed To Get Country Data', '');
  //       }
  //     });
  //   // }


  //   // this.api
  //   //   .getLabTecnicianMapping(
  //   //     this.pageIndex,
  //   //     this.pageSize,
  //   //     this.sortKey,
  //   //     '',
  //   //     ''
  //   //   )
  //   //   .subscribe(
  //   //     (response: HttpResponse<any>) => {
  //   //       const statusCode = response.status;
  //   //       // const headers = response.headers;
  //   //       if (statusCode === 200) {
  //   //         // this.loadingRecords = false;
  //   //         // this.totalRecords = response.body.count;
  //   //         this.technicians = response.body.data;

  //   //         console.log(this.dataList, ' this.dataList');

  //   //       } else {
  //   //         this.dataList = [];
  //   //         this.message.error(`Something went wrong.`, '');
  //   //         this.loadingRecords = false;
  //   //       }
  //   //     },
  //   //     (err: HttpErrorResponse) => {
  //   //       this.loadingRecords = false;
  //   //       if (err.status === 0) {
  //   //         this.message.error(
  //   //           'Network error: Please check your internet connection.',
  //   //           ''
  //   //         );
  //   //       } else {
  //   //         this.message.error(
  //   //           `HTTP Error: ${err.status}. Something Went Wrong.`,
  //   //           ''
  //   //         );
  //   //       }
  //   //     }
  //   //   );


  //   this.api
  //     .getTechnicianConfigurationData(Number(daasa), tech.ID)
  //     .subscribe((response: HttpResponse<any>) => {
  //       const statusCode = response.status;
  //       const responseBody = response.body.data;
  //       console.log(responseBody);

  //       if (statusCode === 200) {
  //         if (responseBody && Array.isArray(responseBody)) {
  //           // console.log(responseBody, 'sdhsgdh');



  //           // Initialize ConfigurationData as an empty object
  //           this.ConfigurationData = this.daysOfWeek.reduce((acc, day) => {
  //             // console.log(acc, 'acc', 'day', day);




  //             // Find all availability records for the current day
  //             const dayAvailability = responseBody.filter(
  //               (avail: any) => avail.DAY_OF_WEEK === day
  //             );
  //             // console.log(dayAvailability);

  //             // Helper function to transform times to the required format
  //             const formatTime = (time: string | null): string | null => {
  //               return time
  //                 ? this.datePipe.transform(
  //                   new Date('1970-01-01T' + time),
  //                   "yyyy-MM-dd'T'HH:mm"
  //                 )
  //                 : null;
  //             };

  //             // Initialize morning and evening data with default empty values
  //             let morningData = {
  //               DAY_OF_WEEK: day,
  //               SESSION_NAME: 'Morning',
  //               MORNING_ACTIVE: false,
  //               MORNING_START_TIME: null as string | null,
  //               MORNING_END_TIME: null as string | null,
  //               MORNING_MODE: '',
  //               MORNING_MODETYPE_ID: null,
  //               MORNING_SLOT_DURATION: null,
  //               LAB_ID: null,
  //               TECHNICIAN_ID: null,
  //               ID: null as string | null, // Initialize ID field
  //             };

  //             let eveningData = {
  //               DAY_OF_WEEK: day,
  //               SESSION_NAME: 'Evening',
  //               EVENING_ACTIVE: false,
  //               EVENING_START_TIME: null as string | null,
  //               EVENING_END_TIME: null as string | null,
  //               EVENING_MODE: '',
  //               EVENING_MODETYPE_ID: null,
  //               EVENING_SLOT_DURATION: null,
  //               LAB_ID: null,
  //               TECHNICIAN_ID: null,
  //               ID: null as string | null, // Initialize ID field
  //             };

  //             // Process all records for the day (morning and evening)
  //             dayAvailability.forEach((availability) => {
  //               if (availability.SESSION_NAME === 'Morning') {
  //                 morningData = {
  //                   DAY_OF_WEEK: day,
  //                   SESSION_NAME: 'Morning',
  //                   MORNING_ACTIVE: availability.IS_ACTIVE === 1,
  //                   MORNING_START_TIME: formatTime(availability.START_TIME),
  //                   MORNING_END_TIME: formatTime(availability.END_TIME),
  //                   MORNING_MODE: availability.MODE,
  //                   MORNING_MODETYPE_ID: availability.TYPE_ID,
  //                   MORNING_SLOT_DURATION: availability.SLOT_DURATION,
  //                   LAB_ID: availability.LAB_ID,
  //                   TECHNICIAN_ID: availability.TECHNICIAN_ID,
  //                   ID: availability.ID,
  //                 };
  //               } else if (availability.SESSION_NAME === 'Evening') {
  //                 eveningData = {
  //                   DAY_OF_WEEK: day,
  //                   SESSION_NAME: 'Evening',
  //                   EVENING_ACTIVE: availability.IS_ACTIVE === 1,
  //                   EVENING_START_TIME: formatTime(availability.START_TIME),
  //                   EVENING_END_TIME: formatTime(availability.END_TIME),
  //                   EVENING_MODE: availability.MODE,
  //                   EVENING_MODETYPE_ID: availability.TYPE_ID,
  //                   EVENING_SLOT_DURATION: availability.SLOT_DURATION,
  //                   LAB_ID: availability.LAB_ID,
  //                   TECHNICIAN_ID: availability.TECHNICIAN_ID,
  //                   ID: availability.ID,
  //                 };
  //               }
  //             });

  //             if (morningData.MORNING_MODE && morningData.MORNING_MODE !== '') {
  //               this.onConsultationModeChange(morningData.MORNING_MODE, day, '');
  //             }

  //             if (eveningData.EVENING_MODE && eveningData.EVENING_MODE !== '') {
  //               this.onConsultationModeChangeEvening(eveningData.EVENING_MODE, day, '');
  //             }

  //             // Add the day data to the accumulator
  //             acc[day] = [morningData, eveningData];
  //             return acc;
  //           }, {}); // Reduce to create an object

  //           // console.log(this.ConfigurationData, 'Generated Configuration Data');
  //         } else {
  //           // If responseBody is empty, not an array, or no availability data is found, set default values
  //           this.ConfigurationData = this.daysOfWeek.reduce((acc, day) => {
  //             acc[day] = [
  //               {
  //                 DAY_OF_WEEK: day,
  //                 SESSION_NAME: 'Morning',
  //                 MORNING_ACTIVE: false,
  //                 MORNING_START_TIME: null,
  //                 MORNING_END_TIME: null,
  //                 MORNING_MODE: '',
  //                 MORNING_MODETYPE_ID: null,
  //                 MORNING_SLOT_DURATION: null,
  //                 LAB_ID: null,
  //                 TECHNICIAN_ID: null,
  //               },
  //               {
  //                 DAY_OF_WEEK: day,
  //                 SESSION_NAME: 'Evening',
  //                 EVENING_ACTIVE: false,
  //                 EVENING_START_TIME: null,
  //                 EVENING_END_TIME: null,
  //                 EVENING_MODE: '',
  //                 EVENING_MODETYPE_ID: null,
  //                 EVENING_SLOT_DURATION: null,
  //                 LAB_ID: null,
  //                 TECHNICIAN_ID: null,
  //               },
  //             ];
  //             return acc;
  //           }, {}); // Reduce to create an object
  //         }

  //         this.TechnicianAvailabilityModalVisible = true;
  //       } else {
  //         // Error handling: message from the API might not be available or the status code could indicate failure
  //         this.message.error(
  //           'Failed to retrieve data from the server. Please try again.',
  //           'Error'
  //         );
  //       }
  //     });
  // }





  handleTechnicianAvailabilityCancel(): void {
    this.TechnicianAvailabilityModalVisible = false;
  }
  handleTechnicianAvailabilityOk(): void {
    this.TechnicianAvailabilityModalVisible = false;
    this.message.success(
      'Technician Availability Configuration Saved Successfully!',
      ''
    );
  }
  filteredAppointmentTypes: any;
  onConsultationModeChange(mode: string, index: any, day: string) {
    // console.log(this.ConfigurationData[day]);

    // if (this.ConfigurationData[day] && this.ConfigurationData[day][0].MORNING_MODETYPE_ID) {
    //   this.ConfigurationData[day][0].MORNING_MODETYPE_ID = null;
    // }

    if (mode) {
      // onConsultationModeChange

      const filter = `AND mode = '${mode}'`;
      this.api.getAppointmentTypeGetList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.filteredAppointmentTypes = responseBody.data || [];
          } else {
            this.filteredAppointmentTypes = [];
            this.message.error('Failed To Get AppointmentType Data', '');
          }
          // this.loadstates = false;
        },
        (err: HttpErrorResponse) => {
          // this.loadstates = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      // this.loadstates = false;
    }
  }

  filteredAppointmentTypesEvening: any;

  onConsultationModeChangeEvening(mode: string, index: any, day: any) {
    // console.log(mode, index);

    // if (this.ConfigurationData[day] && this.ConfigurationData[day][0].MORNING_MODETYPE_ID) {
    //   this.ConfigurationData[day][0].MORNING_MODETYPE_ID = null;
    // }
    if (mode) {
      // onConsultationModeChange

      const filter = `AND mode = '${mode}'`;
      this.api.getAppointmentTypeGetList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.filteredAppointmentTypesEvening = responseBody.data || [];
          } else {
            this.filteredAppointmentTypesEvening = [];
            this.message.error('Failed To Get AppointmentType Data', '');
          }
          // this.loadstates = false;
        },
        (err: HttpErrorResponse) => {
          // this.loadstates = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      // this.loadstates = false;
    }
  }
  getRowspan(day: string): number {
    return (
      this.ConfigurationData.filter((d) => d.DAY_OF_WEEK === day).length * 2
    );
  }

  consultationModes = [
    { ID: 'IL', LABEL: 'In Lab' },
    { ID: 'IH', LABEL: 'In Home' },
  ];
  // saveTimings() {
  //   const output: SessionConfig[] = [];
  //   let isValid = true; // Flag to check completeness of active records

  //   console.log(this.ConfigurationData);

  //   // Cast ConfigurationData to the correct type
  //   const configurationData = this
  //     .ConfigurationData as DoctorAvailabilityConfig;

  //   // Check if any configuration is active
  //   const check = Object.values(configurationData).some((sessions) =>
  //     sessions.some(
  //       (session) => session.MORNING_ACTIVE || session.EVENING_ACTIVE
  //     )
  //   );

  //   if (!check) {
  //     this.message.error(
  //       'Please configure doctor availability for at least one day of the week (either in the morning or evening).',
  //       ''
  //     );
  //     return; // Exit if no active configuration
  //   }

  //   // Loop through days and their respective sessions
  //   Object.entries(configurationData).forEach(([day, sessions]) => {
  //     console.log(day, sessions);

  //     sessions.forEach((config) => {
  //       // Validate and Add Morning session
  //       if (config.SESSION_NAME === 'Morning' && config.MORNING_ACTIVE) {
  //         if (!config.MORNING_START_TIME) {
  //           this.message.error(
  //             `Please select start time for Morning session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.MORNING_END_TIME) {
  //           this.message.error(
  //             `Please select end time for Morning session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.MORNING_MODE) {
  //           this.message.error(
  //             `Please select mode for Morning session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.MORNING_MODETYPE_ID) {
  //           this.message.error(
  //             `Please select appointment type for Morning session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.MORNING_SLOT_DURATION) {
  //           this.message.error(
  //             `Please select slot duration for Morning session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else {
  //           output.push({
  //             DAY_OF_WEEK: day,
  //             SESSION_NAME: 'Morning',
  //             HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
  //             LAB_TECHNICIAN_ID: this.selectedDoctor,
  //             IS_ACTIVE: config.MORNING_ACTIVE,
  //             START_TIME: this.datePipe.transform(
  //               new Date(config.MORNING_START_TIME),
  //               'HH:mm:ss'
  //             ),
  //             END_TIME: this.datePipe.transform(
  //               new Date(config.MORNING_END_TIME),
  //               'HH:mm:ss'
  //             ),
  //             MODE: config.MORNING_MODE,
  //             TYPE_ID: config.MORNING_MODETYPE_ID,
  //             SLOT_DURATION: config.MORNING_SLOT_DURATION,
  //             ...(config.ID && { ID: config.ID }),
  //           });
  //         }
  //       }

  //       // Validate and Add Evening session
  //       if (config.SESSION_NAME === 'Evening' && config.EVENING_ACTIVE) {
  //         if (!config.EVENING_START_TIME) {
  //           this.message.error(
  //             `Please select start time for Evening session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.EVENING_END_TIME) {
  //           this.message.error(
  //             `Please select end time for Evening session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.EVENING_MODE) {
  //           this.message.error(
  //             `Please select mode for Evening session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.EVENING_MODETYPE_ID) {
  //           this.message.error(
  //             `Please select appointment type for Evening session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else if (!config.EVENING_SLOT_DURATION) {
  //           this.message.error(
  //             `Please select slot duration for Evening session on ${day}.`,
  //             ''
  //           );
  //           isValid = false;
  //         } else {
  //           output.push({
  //             DAY_OF_WEEK: day,
  //             SESSION_NAME: 'Evening',
  //             HOSPITAL_ID: this.commonFunction.decryptdata(this.sessionValue),
  //             LAB_TECHNICIAN_ID: this.selectedDoctor,
  //             IS_ACTIVE: config.EVENING_ACTIVE,
  //             START_TIME: this.datePipe.transform(
  //               new Date(config.EVENING_START_TIME),
  //               'HH:mm:ss'
  //             ),
  //             END_TIME: this.datePipe.transform(
  //               new Date(config.EVENING_END_TIME),
  //               'HH:mm:ss'
  //             ),
  //             MODE: config.EVENING_MODE,
  //             TYPE_ID: config.EVENING_MODETYPE_ID,
  //             SLOT_DURATION: config.EVENING_SLOT_DURATION,
  //             ...(config.ID && { ID: config.ID }), // Conditionally add the ID field if config.ID exists
  //           });
  //         }
  //       }
  //     });
  //   });

  //   if (!isValid) {
  //     return; // Exit if any validation failed
  //   }

  //   console.log('Generated Output:', output);

  //   // Add CLIENT_ID to each record
  //   output.forEach((qualification) => {
  //     qualification['CLIENT_ID'] = this.api.clientId;
  //   });

  //   // Proceed with API call
  //   const dataToSave = {
  //     configurationData: output,
  //   };

  //   this.loadDoctorAvailability = true;
  //   this.api.MapConfigurationData(dataToSave).subscribe(
  //     (response: HttpResponse<any>) => {
  //       if (response.status === 200) {
  //         this.message.success(
  //           'Configured Doctor Availability Successfully',
  //           ''
  //         );
  //         this.loadDoctorAvailability = false;
  //         this.DoctorAvailabilityModalVisible = false;

  //         this.specializationSetOfCheckedId.clear();
  //       } else {
  //         this.message.error('Doctor Availability Configuration Failed', '');
  //       }
  //     },
  //     (error) => {
  //       console.error('API Error:', error);
  //       this.message.error('Doctor Availability Configuration Failed', '');
  //       this.loadDoctorAvailability = false;
  //     }
  //   );
  // }
  errorMessage: any;
  // Method to extract hours and minutes from a given Date object
  extractHoursAndMinutes(date: Date): { hours: number; minutes: number } {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  }
  // Helper function to convert a time into the number of minutes since midnight
  convertToMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }
  // Disable times that are before the current time for Start Time
  disabledStartTime = (current: Date): boolean => {
    return current && current < new Date(); // Disable past times
  };
  // Disable End Time selection that is before or equal to Start Time
  disabledEndTime = (current: Date, index: number): boolean => {
    const startTime = new Date(this.ConfigurationData[index].start_time);
    return current && current <= startTime; // Disable times before Start Time
  };

  // Method to handle time change
  onTimeChange(i: number): void {
    const selectedStartTime = new Date(this.ConfigurationData[i].start_time);
    const selectedEndTime = new Date(this.ConfigurationData[i].end_time);
    // console.log('Selected Start Time:', selectedStartTime);
    // console.log('Selected End Time:', selectedEndTime);
    // Check for time conflict
    if (this.checkTimeConflict(selectedStartTime, selectedEndTime, i)) {
      this.errorMessage =
        'The selected time range conflicts with an existing session for the same day.';
    } else {
      this.errorMessage = ''; // Clear error message if no conflict
    }
  }
  // Method to handle day change
  onDayChange(i: number): void {
    // Get the selected days from the form
    const selectedDays = this.days.filter(
      (day) => this.ConfigurationData[i]['day_' + day]
    );
    const selectedStartTime = new Date(this.ConfigurationData[i].start_time);
    const selectedEndTime = new Date(this.ConfigurationData[i].end_time);
    // console.log(this.ConfigurationData);
    // Update the DAY_OF_WEEK for the current session
    this.ConfigurationData[i].day_of_week = selectedDays;
    // Check for conflicts with other sessions on the same day
    for (let j = 0; j < this.ConfigurationData.length; j++) {
      if (i === j) continue; // Skip the current session itself
      const session = this.ConfigurationData[j];
      const sessionDays = session.day_of_week;
      if (selectedDays.some((day) => sessionDays.includes(day))) {
        if (this.checkTimeConflict(selectedStartTime, selectedEndTime, j)) {
          this.errorMessage =
            'The selected time range conflicts with an existing session on the same day.';
          return; // Exit early if a conflict is found
        }
      }
    }
    // If no conflict is found, clear the error message
    this.errorMessage = '';
  }
  // Method to check if the selected time conflicts with existing times
  checkTimeConflict(
    selectedStartTime: Date,
    selectedEndTime: Date,
    index: number
  ): boolean {
    const selectedStartInMinutes = this.convertToMinutes(selectedStartTime);
    const selectedEndInMinutes = this.convertToMinutes(selectedEndTime);
    // console.log(this.ConfigurationData);
    const selectedDayOfWeek = this.ConfigurationData[index].day_of_week;
    // console.log(
    //   selectedEndInMinutes,
    //   selectedStartInMinutes,
    //   selectedDayOfWeek,
    //   index
    // );
    // Check for conflicts with existing sessions for the same day
    for (let i = 0; i < this.ConfigurationData.length; i++) {
      if (i !== index) {
        // Skip the current session
        const session = this.ConfigurationData[i];
        const sessionStartTime = new Date(session.start_time);
        const sessionEndTime = new Date(session.end_time);
        const sessionStartInMinutes = this.convertToMinutes(sessionStartTime);
        const sessionEndInMinutes = this.convertToMinutes(sessionEndTime);
        const sessionDayOfWeek = session.day_of_week;
        // console.log(
        //   sessionStartInMinutes,
        //   sessionEndInMinutes,
        //   sessionDayOfWeek,
        //   i
        // );
        // Check if the session days match
        const hasMatchingDay = selectedDayOfWeek && sessionDayOfWeek && selectedDayOfWeek.some((day) =>
          sessionDayOfWeek.includes(day)
        );
        // console.log(hasMatchingDay);
        if (hasMatchingDay) {
          // Check for time overlap (when one session starts before the other ends and vice versa)
          if (
            (selectedStartInMinutes < sessionEndInMinutes &&
              selectedEndInMinutes > sessionStartInMinutes) ||
            (sessionStartInMinutes < selectedEndInMinutes &&
              sessionEndInMinutes > selectedStartInMinutes)
          ) {
            // console.log('Conflict detected');
            this.message.error(
              'The selected time overlaps with an existing session. Please choose a different time.',
              ''
            );
            return true; // Conflict detected
          }
        }
      }
    }
    return false; // No conflict
  }
  addMoreTimings() {
    let isOk = true;
    // Iterate through each existing configuration and validate fields
    for (let i = 0; i < this.ConfigurationData.length; i++) {
      const currentSession = this.ConfigurationData[i];
      // Validate SESSION_NAME
      if (
        !currentSession.session_name ||
        currentSession.session_name.trim() === ''
      ) {
        isOk = false;
        this.message.error(
          `Please Enter a Session Name for Slot ${i + 1}.`,
          ''
        );
        break;
      }
      // Validate START_TIME
      if (!currentSession.start_time) {
        isOk = false;
        this.message.error(`Please Select a Start Time for Slot ${i + 1}.`, '');
        break;
      }
      // Validate END_TIME
      if (!currentSession.end_time) {
        isOk = false;
        this.message.error(`Please Select an End Time for Slot ${i + 1}.`, '');
        break;
      }
      // Validate MODE_ID
      if (!currentSession.mode) {
        isOk = false;
        this.message.error(`Please Select a Mode for Slot ${i + 1}.`, '');
        break;
      }
      // Validate TYPE_ID

      // if (!currentSession.TYPE_ID) {
      //   isOk = false;
      //   this.message.error(`Please Select a Type for Slot ${i + 1}.`, '');
      //   break;
      // }

      // Validate SLOT_DURATION
      if (
        !currentSession.slot_duration ||
        isNaN(currentSession.slot_duration) ||
        currentSession.slot_duration <= 0
      ) {
        isOk = false;
        this.message.error(
          `Please Enter a valid Slot Duration for Slot ${i + 1}.`,
          ''
        );
        break;
      }
      // Ensure START_TIME is before END_TIME
      if (currentSession.start_time >= currentSession.end_time) {
        isOk = false;
        this.message.error(
          `Start Time must be earlier than End Time for Slot ${i + 1}.`,
          ''
        );
        break;
      }
    }
    if (isOk) {
      // Add a new empty configuration
      this.ConfigurationData.push({
        session_name: '',
        start_time: null,
        end_time: null,
        mode_id: '',
        type_id: '',
        slot_duration: null,
        day_of_week: [],
      });
      this.days.forEach((day) => {
        this.ConfigurationData[this.ConfigurationData.length - 1][
          'day_' + day
        ] = false;
      });
    }
  }
  removeTiming(index: number) {
    // Ensure there is at least one item in the ConfigurationData array
    if (this.ConfigurationData.length > 1) {
      this.ConfigurationData.splice(index, 1);
    } else {
      this.message.error('At least one timing should be present.', '');
    }
  }

  saveTimings() {
    const output: AvailabilityPayload[] = [];
    let isValid = true; // Flag to check completeness of active records

    // Cast ConfigurationData to the correct type
    const configurationData = this.ConfigurationData;

    // Check if any configuration is active
    const hasActive = Object.values(configurationData).some((sessions: any) =>
      sessions.some((session: any) => session.is_active)
    );

    // Check if any existing configuration is being deactivated (unmapped)
    const hasExistingToDeactivate = Object.values(configurationData).some((sessions: any) =>
      sessions.some((session: any) => !session.is_active && session.id)
    );

    if (!hasActive && !hasExistingToDeactivate) {
      this.message.error(
        'Please configure doctor availability for at least one day of the week (either in the morning or evening).',
        ''
      );
      return; // Exit if no active configuration and nothing to deactivate
    }

    // Loop through days and their respective sessions
    Object.entries(configurationData).forEach(([day, sessions]: [string, any]) => {
      sessions.forEach((config: any) => {
        // Validate and Add session
        if (config.is_active) {
          if (!config.start_time) {
            this.message.error(
              `Please select start time for ${config.session_name} session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.end_time) {
            this.message.error(
              `Please select end time for ${config.session_name} session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.mode) {
            this.message.error(
              `Please select mode for ${config.session_name} session on ${day}.`,
              ''
            );
            isValid = false;
          } else if (!config.slot_duration) {
            this.message.error(
              `Please select slot duration for ${config.session_name} session on ${day}.`,
              ''
            );
            isValid = false;
          } else {
            // Check start time < end time
            const startMinutes = this.convertToMinutes(new Date(config.start_time));
            const endMinutes = this.convertToMinutes(new Date(config.end_time));
            if (startMinutes >= endMinutes) {
              this.message.error(
                `Start Time must be earlier than End Time for ${config.session_name} session on ${day}.`,
                ''
              );
              isValid = false;
            } else {
              output.push({
                day_of_week: day,
                session_name: config.session_name,
                lab_id: this.sessionValue ? Number(this.sessionValue) : this.lab_id,
                technician_id: this.selectedDoctor,
                is_active: 1,
                start_time: this.datePipe.transform(
                  new Date(config.start_time),
                  'HH:mm:ss'
                ),
                end_time: this.datePipe.transform(
                  new Date(config.end_time),
                  'HH:mm:ss'
                ),
                mode: config.mode,
                type_id: config.type_id,
                slot_duration: Number(config.slot_duration),
                ...(config.id && { id: config.id }),
              });
            }
          }
        } else if (config.id) {
          // If the record exists in the DB (has id) but is unchecked, send it with is_active = 0
          output.push({
            day_of_week: day,
            session_name: config.session_name,
            lab_id: this.sessionValue ? Number(this.sessionValue) : this.lab_id,
            technician_id: this.selectedDoctor,
            is_active: 0,
            start_time: config.start_time ? this.datePipe.transform(
              new Date(config.start_time),
              'HH:mm:ss'
            ) : null,
            end_time: config.end_time ? this.datePipe.transform(
              new Date(config.end_time),
              'HH:mm:ss'
            ) : null,
            mode: config.mode || null,
            type_id: config.type_id || null,
            slot_duration: config.slot_duration ? Number(config.slot_duration) : null,
            id: config.id,
          });
        }
      });
    });

    if (!isValid) {
      return; // Exit if any validation failed
    }

    // Add client_id to each record
    output.forEach((qualification) => {
      qualification['client_id'] = this.api.clientId;
    });

    // Proceed with API call
    const dataToSave = {
      configurationData: output,
    };

    this.loadTechnicianAvailability = true;
    this.api.MapTechnicianConfigurationData(dataToSave).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.message.success(
            'Configured Technician Availability Successfully',
            ''
          );
          this.loadTechnicianAvailability = false;
          this.TechnicianAvailabilityModalVisible = false;
        } else {
          this.message.error(
            'Technician Availability Configuration Failed',
            ''
          );
          this.loadTechnicianAvailability = false;
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.message.error('Technician Availability Configuration Failed', '');
        this.loadTechnicianAvailability = false;
      }
    );
  }


  mapQualificationsDrawerVisible: boolean = false;
  mapQualificationsDrawerTitle = 'Map Qualifications';
  qualificationIndeterminate: any = [];
  checkedQualifications = false;
  qualificationSelectedItems: any = [];
  qualificationSetOfCheckedId = new Set<number>();
  totalQualificationRecords = 1;
  QUALIFICATION_SELECTED_RECORDS: any;
  QUALIFICATION_ID: any;
  qualificationLoadingRecords: boolean = false;
  qualificationPageIndex = 1;
  qualificationPageSize = 10;
  newQualificationSelectedItems: any = [];
  masterQualificationList: any[] = [];
  masterQualificationData: any = [];
  onQualificationPageDataChange(data: any) { }
  mapQualifications(data: any) {
    // Start loading
    this.qualificationLoadingRecords = true;
    this.loadingRecords = true;

    // Set title and ID
    this.QUALIFICATION_ID = this.roleID === 3 ? data.technician_id : data.id;
    this.mapQualificationsDrawerTitle = 'Map Qualifications To ' + (data.name ? data.name : data.lab_technician_name);

    // Fetch master qualification data
    this.api
      .getQualification(0, 0, this.sortKey, 'asc', 'AND is_active = 1')
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterQualificationData = response.body?.data || [];
            // console.log(
            //   this.masterQualificationData,
            //   'masterQualificationData'
            // );
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
          if (this.roleID === 3) {
            this.api.getLabTechnicainQualification(data.technician_id).subscribe({
              next: (response: HttpResponse<any>) => {
                const mappedQualifications = response.body?.data || [];
                console.log('mappedQualifications', mappedQualifications)
                const mappedQualificationMap: {
                  [key: string]: {
                    id: number;
                    isActive: boolean;
                    proof_document_url: string | null;
                    year_of_completion: string | null;
                    institution_name: string | null;
                  };
                } = {};

                // Map the data
                for (const qualification of mappedQualifications) {
                  const qId = qualification.qualification_id || qualification.QUALIFICATION_ID;
                  mappedQualificationMap[qId] = {
                    id: qualification.id || qualification.ID,
                    isActive: qualification.is_active === 1 || qualification.IS_ACTIVE === 1,
                    proof_document_url: qualification.proof_document_url || qualification.PROOF_DOCUMENT_URL || null,
                    year_of_completion: qualification.year_of_completion || null,
                    institution_name: qualification.institution_name || qualification.INSTITUTION_NAME || '',
                  };
                }

                // console.log(
                //   mappedQualifications,
                //   'mappedQualifications',
                //   mappedQualificationMap
                // );

                // Combine master and mapped qualifications
                this.qualificationSetOfCheckedId.clear();
                this.qualificationSelectedItems = [];

                for (const qualification of this.masterQualificationData) {
                  const qualificationId = qualification.id || qualification.ID;
                  const mappedQualification =
                    mappedQualificationMap[qualificationId];
                  const isChecked =
                    mappedQualification && mappedQualification.isActive;

                  if (isChecked) {
                    this.qualificationSetOfCheckedId.add(qualificationId);
                  }

                  this.qualificationSelectedItems.push({
                    ...qualification,
                    checkedQualifications: isChecked,
                    mappedQualificationId: mappedQualification
                      ? mappedQualification.id
                      : null,
                    proof_document_url: mappedQualification
                      ? mappedQualification.proof_document_url
                      : null,
                    year_of_completion: mappedQualification
                      ? mappedQualification.year_of_completion?.toString() || null
                      : null,
                    institution_name: mappedQualification
                      ? mappedQualification.institution_name
                      : '',
                  });
                }

                // Update state after data combination
                this.masterQualificationList = [
                  ...this.qualificationSelectedItems,
                ];
                this.refreshQualificationCheckedStatus();

                this.qualificationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapQualificationsDrawerVisible = true;

                // console.log(
                //   this.qualificationSelectedItems,
                //   'Combined Data (masterQualificationData + mappedQualifications)'
                // );
              },
              error: (err) => {
                console.error(err);
                this.qualificationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapQualificationsDrawerVisible = true;
              },
            });
          }
          else {
            // Once master data is fetched, fetch mapped qualifications
            this.api.getLabTechnicainQualification(data.id).subscribe({
              next: (response: HttpResponse<any>) => {
                const mappedQualifications = response.body?.data || [];
                const mappedQualificationMap: {
                  [key: string]: {
                    id: number;
                    isActive: boolean;
                    proof_document_url: string | null;
                    year_of_completion: string | null;
                    institution_name: string | null;
                  };
                } = {};

                // Map the data
                for (const qualification of mappedQualifications) {
                  const qId = qualification.qualification_id || qualification.QUALIFICATION_ID;
                  mappedQualificationMap[qId] = {
                    id: qualification.id || qualification.ID,
                    isActive: qualification.is_active === 1 || qualification.IS_ACTIVE === 1,
                    proof_document_url: qualification.proof_document_url || qualification.PROOF_DOCUMENT_URL || null,
                    year_of_completion: qualification.year_of_completion || null,
                    institution_name: qualification.institution_name || qualification.INSTITUTION_NAME || '',
                  };
                }

                // console.log(
                //   mappedQualifications,
                //   'mappedQualifications',
                //   mappedQualificationMap
                // );

                // Combine master and mapped qualifications
                this.qualificationSetOfCheckedId.clear();
                this.qualificationSelectedItems = [];

                for (const qualification of this.masterQualificationData) {
                  const qualificationId = qualification.id || qualification.ID;
                  const mappedQualification =
                    mappedQualificationMap[qualificationId];
                  const isChecked =
                    mappedQualification && mappedQualification.isActive;

                  if (isChecked) {
                    this.qualificationSetOfCheckedId.add(qualificationId);
                  }

                  this.qualificationSelectedItems.push({
                    ...qualification,
                    checkedQualifications: isChecked,
                    mappedQualificationId: mappedQualification
                      ? mappedQualification.id
                      : null,
                    proof_document_url: mappedQualification
                      ? mappedQualification.proof_document_url
                      : null,
                    year_of_completion: mappedQualification
                      ? mappedQualification.year_of_completion?.toString() || null
                      : null,
                    institution_name: mappedQualification
                      ? mappedQualification.institution_name
                      : '',
                  });
                }

                // Update state after data combination
                this.masterQualificationList = [
                  ...this.qualificationSelectedItems,
                ];
                this.refreshQualificationCheckedStatus();

                this.qualificationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapQualificationsDrawerVisible = true;

                // console.log(
                //   this.qualificationSelectedItems,
                //   'Combined Data (masterQualificationData + mappedQualifications)'
                // );
              },
              error: (err) => {
                console.error(err);
                this.qualificationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapQualificationsDrawerVisible = true;
              },
            });
          }
        },
      });
  }

  onAllQualificationsChecked(value: boolean): void {
    // console.log(value);
    this.qualificationSetOfCheckedId.clear();
    if (value) {
      // console.log(this.masterQualificationData);
      this.masterQualificationData.forEach((item) =>
        this.qualificationSetOfCheckedId.add(item.id || item.ID)
      );
    }
    this.qualificationSelectedItems.forEach(
      (item) => (item.checkedQualifications = value)
    );
    this.refreshQualificationCheckedStatus();
    this.updateTotalQualificationRecords();
  }
  onQualificationItemChecked(id: number, checked: boolean): void {
    // console.log(id, ' ', checked);
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
  updateQualificationCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.qualificationSetOfCheckedId.add(id);
    } else {
      this.qualificationSetOfCheckedId.delete(id);
    }
    // console.log(this.qualificationSetOfCheckedId, 'updated checked status');
  }
  refreshQualificationCheckedStatus(): void {
    this.checkedQualifications = this.qualificationSelectedItems.every((item) =>
      this.qualificationSetOfCheckedId.has(item.id || item.ID)
    );
    this.qualificationIndeterminate =
      this.qualificationSelectedItems.some((item) =>
        this.qualificationSetOfCheckedId.has(item.id || item.ID)
      ) && !this.checkedQualifications;
  }
  updateTotalQualificationRecords(): void {
    this.QUALIFICATION_SELECTED_RECORDS = this.qualificationSetOfCheckedId.size;
  }
  saveQualifications(): void {
    const checkedQualifications: any[] = [];
    const uncheckedQualifications: any[] = [];

    for (let i = 0; i < this.masterQualificationData.length; i++) {
      const qualification = this.masterQualificationData[i];
      const qualificationId = qualification.id || qualification.ID;
      const isChecked = this.qualificationSetOfCheckedId.has(qualificationId);

      const mappedQualification = this.qualificationSelectedItems.find(
        (item) => (item.id || item.ID) === qualificationId
      );
      const mappedQualificationId =
        mappedQualification?.mappedQualificationId || null;
      const institutionName = mappedQualification?.institution_name || null;
      let yearOfCompletion = mappedQualification?.year_of_completion || null;

      if (yearOfCompletion) {
        yearOfCompletion = this.datePipe.transform(yearOfCompletion, 'yyyy');
      } else {
        yearOfCompletion = null;
      }

      const proofDocumentUrl =
        mappedQualification?.proof_document_url || null;

      if (isChecked) {
        if (!institutionName) {
          this.message.error(
            `Qualification "${qualification.QUALIFICATION_NAME || qualification.qualification_name || qualification.name}" is missing Institution Name.`,
            ''
          );
          return;
        }
        if (!yearOfCompletion) {
          this.message.error(
            `Qualification "${qualification.QUALIFICATION_NAME || qualification.qualification_name || qualification.name}" is missing Year of Completion.`,
            ''
          );
          return;
        }
        if (!proofDocumentUrl) {
          this.message.error(
            `Qualification "${qualification.QUALIFICATION_NAME || qualification.qualification_name || qualification.name}" is missing Proof Document URL.`,
            ''
          );
          return;
        }

        const qualificationObj: any = {
          qualification_id: qualificationId,
          lab_technician_id: this.QUALIFICATION_ID,
          institution_name: institutionName,
          year_of_completion: yearOfCompletion,
          proof_document_url: proofDocumentUrl,
          is_active: 1,
        };
        if (mappedQualificationId) {
          qualificationObj.id = mappedQualificationId;
        }
        checkedQualifications.push(qualificationObj);
      } else if (mappedQualificationId) {
        // Send unmapped record ONLY if it has an existing mapping ID
        const qualificationObj: any = {
          qualification_id: qualificationId,
          lab_technician_id: this.QUALIFICATION_ID,
          institution_name: institutionName,
          year_of_completion: yearOfCompletion,
          proof_document_url: proofDocumentUrl,
          is_active: 0,
          id: mappedQualificationId,
        };
        uncheckedQualifications.push(qualificationObj);
      }
    }

    const allQualifications = [
      ...checkedQualifications,
      ...uncheckedQualifications,
    ];

    if (allQualifications.length === 0) {
      this.message.error('Please Check Atleast One Qualification', '');
    } else {
      allQualifications.forEach((qualification) => {
        qualification['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allQualifications };
      this.qualificationLoadingRecords = true;
      // API call to save the mapped qualifications
      this.api.MapLabTechnicianQualification(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Qualifications Mapped Successfully', '');
            this.mapQualificationsDrawerVisible = false;
            this.qualificationSetOfCheckedId.clear();
            this.qualificationLoadingRecords = false;
          } else {
            this.message.error('Qualification Mapping Failed', '');
            this.qualificationLoadingRecords = false;
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.message.error('Qualification Mapping Failed', '');
          this.qualificationLoadingRecords = false;
        }
      );
    }
  }
  // Close Qualifications Drawer
  mapQualificationsDrawerClose() {
    this.mapQualificationsDrawerVisible = false;
    this.qualificationSetOfCheckedId.clear();
    this.searchQualifications('');
  }
  datalist1: any[] = [];
  searchText1: any;
  searchQualifications(searchText: any) {
    // console.log(searchText);
    this.qualificationLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.datalist1 = this.masterQualificationList.filter((user) => {
        return user.NAME.toLowerCase().includes(searchTextLower);
      });
      this.qualificationSelectedItems = [...this.datalist1];
      this.masterQualificationList.forEach((item) => {
        item.checkedQualifications = this.qualificationSetOfCheckedId.has(
          item.id || item.ID
        );
      });
    } else {
      this.qualificationSelectedItems = [...this.masterQualificationList];
      this.masterQualificationList.forEach((item) => {
        item.checkedQualifications = this.qualificationSetOfCheckedId.has(
          item.id || item.ID
        );
      });
    }
    this.qualificationLoadingRecords = false;
  }
  mapSpecializationsDrawerVisible: boolean = false;
  mapSpecializationsDrawerTitle = 'Map Specializations';
  specializationIndeterminate: any = [];
  checkedSpecializations = false;
  specializationSelectedItems: any = [];
  specializationSetOfCheckedId = new Set<number>();
  totalSpecializationRecords = 1;
  SPECIALIZATION_SELECTED_RECORDS: any;
  SPECIALIZATION_ID: any;
  specializationLoadingRecords: boolean = false;
  specializationPageIndex = 1;
  specializationPageSize = 10;
  newSpecializationSelectedItems: any = [];
  masterSpecializationList: any[] = [];
  masterSpecializationData: any = [];

  SPEC_DOCTOR_ID: any;

  mapSpecializations(data: any) {
    // Start by showing loading indicators
    this.specializationLoadingRecords = true;
    this.loadingRecords = true;
    this.searchText2 = ''

    // Set the drawer title and target doctor ID
    this.SPEC_DOCTOR_ID = this.roleID !== 3 ? data.id : data.technician_id;
    this.mapSpecializationsDrawerTitle = 'Map Specializations To ' + (data.name ? data.name : data.lab_technician_name);

    // Fetch the master specialization data
    this.api
      .getSpecialization(0, 0, this.sortKey, 'asc', 'AND is_active = 1 AND specialization_type=' + "'L'")
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.masterSpecializationData = response.body?.data || [];
          } else {
            this.masterSpecializationData = [];
            this.message.error(
              'Failed to load specializations. Please try again.',
              ''
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.masterSpecializationData = [];
          this.message.error('Error loading specializations.', '');
        },
        complete: () => {
          if (this.roleID === 3) {
            this.api.getLabTechnicainMappedSpecialization(data.technician_id).subscribe({
              next: (response: HttpResponse<any>) => {
                const mappedSpecializations = response.body?.data || [];
                const mappedSpecializationMap: {
                  [key: string]: { id: number; isActive: boolean };
                } = {};

                // Map the fetched data
                for (const specialization of mappedSpecializations) {
                  const specId = specialization.specialization_id || specialization.SPECIALIZATION_ID;
                  mappedSpecializationMap[specId] = {
                    id: specialization.id || specialization.ID,
                    isActive: specialization.is_active === 1 || specialization.IS_ACTIVE === 1,
                  };
                }

                this.specializationSetOfCheckedId.clear();
                this.specializationSelectedItems = [];

                // Combine master specialization data and mapped specializations
                for (const specialization of this.masterSpecializationData) {
                  const specializationId = specialization.id || specialization.ID;
                  const mappedSpecialization =
                    mappedSpecializationMap[specializationId];
                  const isChecked =
                    mappedSpecialization && mappedSpecialization.isActive;

                  if (isChecked) {
                    this.specializationSetOfCheckedId.add(specializationId);
                  }

                  this.specializationSelectedItems.push({
                    ...specialization,
                    id: specializationId,
                    checkedSpecializations: isChecked,
                    mappedSpecializationId: mappedSpecialization
                      ? mappedSpecialization.id
                      : null,
                  });
                }

                this.masterSpecializationList = [
                  ...this.specializationSelectedItems,
                ];
                this.refreshSpecializationCheckedStatus();

                // Log the combined data for debugging
                // console.log(
                //   this.specializationSelectedItems,
                //   'Combined Data (masterSpecializationData + mappedSpecializations)'
                // );

                // Set loading indicators and show the drawer
                this.specializationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapSpecializationsDrawerVisible = true;
              },
              error: (err) => {
                console.error(err);
                this.specializationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapSpecializationsDrawerVisible = true;
              },
            });
          }
          else {
            // Fetch the mapped specializations after the master data is loaded
            this.api.getLabTechnicainMappedSpecialization(data.id).subscribe({
              next: (response: HttpResponse<any>) => {
                const mappedSpecializations = response.body?.data || [];
                const mappedSpecializationMap: {
                  [key: string]: { id: number; isActive: boolean };
                } = {};

                // Map the fetched data
                for (const specialization of mappedSpecializations) {
                  const specId = specialization.specialization_id || specialization.SPECIALIZATION_ID;
                  mappedSpecializationMap[specId] = {
                    id: specialization.id || specialization.ID,
                    isActive: specialization.is_active === 1 || specialization.IS_ACTIVE === 1,
                  };
                }

                this.specializationSetOfCheckedId.clear();
                this.specializationSelectedItems = [];

                // Combine master specialization data and mapped specializations
                for (const specialization of this.masterSpecializationData) {
                  const specializationId = specialization.id || specialization.ID;
                  const mappedSpecialization =
                    mappedSpecializationMap[specializationId];
                  const isChecked =
                    mappedSpecialization && mappedSpecialization.isActive;

                  if (isChecked) {
                    this.specializationSetOfCheckedId.add(specializationId);
                  }

                  this.specializationSelectedItems.push({
                    ...specialization,
                    id: specializationId,
                    checkedSpecializations: isChecked,
                    mappedSpecializationId: mappedSpecialization
                      ? mappedSpecialization.id
                      : null,
                  });
                }

                this.masterSpecializationList = [
                  ...this.specializationSelectedItems,
                ];
                this.refreshSpecializationCheckedStatus();

                // Log the combined data for debugging
                // console.log(
                //   this.specializationSelectedItems,
                //   'Combined Data (masterSpecializationData + mappedSpecializations)'
                // );

                // Set loading indicators and show the drawer
                this.specializationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapSpecializationsDrawerVisible = true;
              },
              error: (err) => {
                console.error(err);
                this.specializationLoadingRecords = false;
                this.loadingRecords = false;
                this.mapSpecializationsDrawerVisible = true;
              },
            });
          }
        },
      });
  }
  // Search Specializations
  searchSpecializations(searchText: any) {
    this.specializationLoadingRecords = true;
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      this.specializationSelectedItems = this.masterSpecializationList.filter(
        (user) => (user.specialization || user.SPECIALIZATION).toLowerCase().includes(searchTextLower)
      );
    } else {
      this.specializationSelectedItems = [...this.masterSpecializationList];
    }
    this.specializationLoadingRecords = false;
  }
  onAllSpecializationsChecked(value: boolean): void {
    // console.log(value);

    this.specializationSetOfCheckedId.clear();
    if (value) {
      // console.log(this.masterSpecializationData);

      this.masterSpecializationData.forEach((item) =>
        this.specializationSetOfCheckedId.add(item.id || item.ID)
      );
    }
    this.specializationSelectedItems.forEach(
      (item) => (item.checkedSpecializations = value)
    );
    this.refreshSpecializationCheckedStatus();
    this.updateTotalSpecializationRecords();
  }

  onSpecializationItemChecked(id: number, checked: boolean): void {
    // console.log(id, ' ', checked);

    this.updateSpecializationCheckedSet(id, checked);
    this.specializationSelectedItems.forEach(
      (data) =>
      (data.checkedSpecializations = this.specializationSetOfCheckedId.has(
        data.id || data.ID
      ))
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
    // console.log(this.specializationSetOfCheckedId, 'updated checked status');
  }

  refreshSpecializationCheckedStatus(): void {
    this.checkedSpecializations = this.specializationSelectedItems.every(
      (item) => this.specializationSetOfCheckedId.has(item.id || item.ID)
    );
    this.specializationIndeterminate =
      this.specializationSelectedItems.some((item) =>
        this.specializationSetOfCheckedId.has(item.id || item.ID)
      ) && !this.checkedSpecializations;
  }

  updateTotalSpecializationRecords(): void {
    this.SPECIALIZATION_SELECTED_RECORDS =
      this.specializationSetOfCheckedId.size;
  }

  saveSpecializations(): void {
    if (this.specializationSetOfCheckedId.size === 0) {
      this.message.error('Please Check Atleast One Specialization', '');
    } else {
      const checkedSpecializations: any[] = [];
      const uncheckedSpecializations: any[] = [];

      // console.log(
      //   this.masterSpecializationData,
      //   'specal',
      //   this.specializationSelectedItems,
      //   this.masterSpecializationList
      // );

      for (let i = 0; i < this.masterSpecializationData.length; i++) {
        const specialization = this.masterSpecializationData[i];
        const specializationStatus = specialization.id || specialization.ID;
        const isChecked = this.specializationSetOfCheckedId.has(
          specializationStatus
        );

        const mappedSpecialization = this.specializationSelectedItems.find(
          (item) => (item.id || item.ID) === specializationStatus
        );

        const mappedSpecializationId =
          mappedSpecialization?.mappedSpecializationId || null;

        if (isChecked) {
          const specializationObj: any = {
            specialization_id: specializationStatus,
            lab_technician_id: this.SPEC_DOCTOR_ID,
            is_active: 1,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include ID only if it exists
          }
          checkedSpecializations.push(specializationObj);
        } else {
          const specializationObj: any = {
            specialization_id: specializationStatus,
            lab_technician_id: this.SPEC_DOCTOR_ID,
            is_active: 0,
          };
          if (mappedSpecializationId) {
            specializationObj.id = mappedSpecializationId; // Include ID only if it exists
          }
          uncheckedSpecializations.push(specializationObj);
        }
      }

      const allSpecializations = [
        ...checkedSpecializations,
        ...uncheckedSpecializations,
      ];

      // console.log(allSpecializations, 'Data to be saved');

      allSpecializations.forEach((specialization) => {
        specialization['client_id'] = this.api.clientId;
      });

      const dataToSave = { data: allSpecializations };

      this.specializationLoadingRecords = true;
      // API call to save the mapped specializations
      this.api.MapLabTechnicianSpecializations(dataToSave).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.message.success('Specializations Mapped Successfully', '');
            this.mapSpecializationsDrawerVisible = false;
            this.specializationLoadingRecords = false;
            this.specializationSetOfCheckedId.clear();
          } else {
            this.message.error('Specialization Mapping Failed', '');
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.message.error('Specialization Mapping Failed', '');
          this.specializationLoadingRecords = false;
        }
      );
    }
  }

  // Close Specialization Drawer
  mapSpecializationsDrawerClose() {
    this.mapSpecializationsDrawerVisible = false;
    this.specializationSetOfCheckedId.clear();
    this.searchSpecializations('');
  }
  // Search Specializations
  // searchSpecializations(searchText: any) {
  //   this.specializationLoadingRecords = true;
  //   if (searchText) {
  //     const searchTextLower = searchText.toLowerCase();
  //     this.specializationSelectedItems = this.masterSpecializationList.filter(
  //       (user) => user.NAME.toLowerCase().includes(searchTextLower)
  //     );
  //   } else {
  //     this.specializationSelectedItems = [...this.masterSpecializationList];
  //   }
  //   this.specializationLoadingRecords = false;
  // }
  confirm(): void {
    this.message.success('Qualifications mapped successfully!', '');
    this.mapQualificationsDrawerVisible = false;
  }







  selectedFilter: string | null = null;


  TabId: number;
  userId = sessionStorage.getItem('userId');
  decrepteduserID1String = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserID1String, 10);
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
    this.drawerTitle = 'Lab Technician Filter';
    // console.log('this.propertyData open', this.propertyData);

    this.filterFields[9]['options'] = this.countryData.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
    this.filterFields[10]['options'] = this.stateData.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
    this.filterFields[11]['options'] = this.districtData.map((data) => ({
      value: data.ID,
      display: data.NAME
    }));
    this.filterFields[12]['options'] = this.pincodeData.map((data) => ({
      value: data.ID,
      display: data.PINCODE_NUMBER
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
      key: 'NAME',
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
      key: 'MOBILE_NO',
      label: 'Mobile No.',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Mobile No.',
    },

    {
      key: 'GENDER',
      label: 'Gender',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: 'F', display: 'Female' },
        { value: 'M', display: 'Male' },
        { value: 'O', display: 'Other' },
      ],
      placeholder: 'Select Gender',
    },

    {
      key: 'DOB',
      label: 'DOB',
      type: 'date',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Select DOB',
    },

    {
      key: 'ABOUT',
      label: 'About',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter About',
    },

    {
      key: 'EXPERIENCE',
      label: 'Experience',
      type: 'text',
      comparators: ['=', '!=', '>', '<', '>=', '<='],
      placeholder: 'Enter Experience',
    },


    {
      key: 'REGISTRATION_NUMBER',
      label: 'Registration Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Registration Number',
    },


    {
      key: 'ADDRESS_LINE_1',
      label: 'Address line 1',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Address line 1',
    },


    {
      key: 'ADDRESS_LINE_2',
      label: 'Address line 2',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Address Line 2',
    },
    {
      key: 'COUNTRY_ID',
      label: 'Country',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Country',
    },

    {
      key: 'STATE_ID',
      label: 'State',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select State',
    },
    {
      key: 'DISTRICT_ID',
      label: 'District',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select District',
    },


    {
      key: 'PINCODE_ID',
      label: 'Pincode',
      type: 'select',
      comparators: [
        '=',
        '!='
      ],
      placeholder: 'Select Pincode',
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
