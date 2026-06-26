import { Component } from '@angular/core';
import { HospitalClinicMaster } from '../../../Models/HospitalClinicMaster';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalDoctorMapping } from '../../../Models/HospitalDoctorMapping';
import { HospitalProcedureMapping } from '../../../Models/HospitalProcedureMapping';
import { DatePipe } from '@angular/common';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-hospital-clinic-master',
  templateUrl: './hospital-clinic-master.component.html',
  styleUrls: ['./hospital-clinic-master.component.css'],
})
export class HospitalClinicMasterComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HospitalClinicMaster = new HospitalClinicMaster();
  formTitle = "Manage Hospital's/Clinic's";
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
    ['NAME', 'Name'],
    ['CONTACT_NUMBER', 'Contact Number'],
    ['LONGITUDE', 'Longitude'],
    ['LATITUDE', 'Latitude'],
    ['REGISTRATION_PROOF', 'Registration Proof'],
    ['PHOTO', 'Photo'],
    ['WEBSITE_LINK', 'Website Link'],
    ['ADDRESS_LINE_1', 'Address Line 1'],
    ['ADDRESS_LINE_2', 'Address Line 2'],
    ['COUNTRY_NAME', 'Country'],
    ['STATE_NAME', 'State'],
    ['DISTRICT_NAME', 'District'],
    ['PINCODE_NUMBER', 'Pincode'],
  ];
  // adminId: any;
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
  public commonFunction = new CommonFunctionService()
  visible = false;
  showcloumnVisible: boolean = false;
  // Main filter
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;
  showcolumn = [
    { label: 'Name', key: 'NAME', visible: true },
    { label: 'Contact Number', key: 'CONTACT_NUMBER', visible: true },
    { label: 'Longitude', key: 'LONGITUDE', visible: true },
    { label: 'Latitude', key: 'LATITUDE', visible: true },
    { label: 'Registration Proof', key: 'REGISTRATION_PROOF', visible: true },
    { label: 'Photo', key: 'PHOTO', visible: true },
    { label: 'Website Link', key: 'WEBSITE_LINK', visible: true },
    { label: 'Address Line 1', key: 'ADDRESS_LINE_1', visible: true },
    { label: 'Address Line 2', key: 'ADDRESS_LINE_2', visible: true },
    { label: 'Country', key: 'COUNTRY_ID', visible: true },
    { label: 'State', key: 'STATE_ID', visible: true },
    { label: 'District', key: 'DISTRICT_ID', visible: true },
    { label: 'Pincode', key: 'PINCODE_ID', visible: true },
    { label: 'Is Active', key: 'IS_ACTIVE', visible: true },
  ];
  namevisible: boolean;
  nametext = '';
  contactvisible: boolean;
  contacttext = '';
  latitudevisible: boolean;
  latitudetext: any = '';
  longitudevisible: boolean;
  longitudetext: any = '';
  registrationProofvisible: boolean;
  photovisible: boolean;
  websitelinkvisible: boolean;
  addressLine1visible: boolean;
  addressLine2visible: boolean;
  selectedStates: any = [];
  selectedDistricts: any = [];
  selectedPincodes: any = [];
  districtVisible: boolean;
  pincodevisible: boolean;
  doctorList: any = [];
  seqNoVisible: boolean;
  seqNo: any;
  stateload: boolean;
  districtload: boolean;
  pincodeload: boolean;
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  TabId: number;
  userId = sessionStorage.getItem('userId');

  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  drawerFilterVisible: boolean = false;
  savedFilters: any[] = [];
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
  oldFilter: any[] = [];
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
      key: 'contact_number',
      label: 'Contact Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Contact Number',
    },
    {
      key: 'latitude',
      label: 'Latitude',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Latitude',
    },
    {
      key: 'longitude',
      label: 'Longitude',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Longitude',
    },
    {
      key: 'registration_proof',
      label: 'Registration Proof',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Registration Proof',
    },
    {
      key: 'photo',
      label: 'Photo',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Photo',
    },
    {
      key: 'website_link',
      label: 'Website Link',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Website Link',
    },
    {
      key: 'address_line_1',
      label: 'Address Line 1',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Address Line 1',
    },
    {
      key: 'address_line_2',
      label: 'Address Line 2',
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
      key: 'country_id',
      label: 'Country',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Country',
    },
    {
      key: 'state_id',
      label: 'State',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select State',
    },
    {
      key: 'district_id',
      label: 'District',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select District',
    },
    {
      key: 'pincode_id',
      label: 'Pincode',
      type: 'select',
      comparators: ['=', '!='],
      placeholder: 'Select Pincode',
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
  columns1: { label: string; value: string }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Contact Number', value: 'contact_number' },
    { label: 'Longitude', value: 'longitude' },
    { label: 'Latitude', value: 'latitude' },
    { label: 'Registration Proof', value: 'registration_proof' },
    { label: 'Photo', value: 'photo' },
    { label: 'Website Link', value: 'website_link' },
    { label: 'Address Line 1', value: 'address_line_1' },
    { label: 'Address Line 2', value: 'address_line_2' },
    { label: 'Country', value: 'country_id' },
    { label: 'State', value: 'state_id' },
    { label: 'District', value: 'district_id' },
    { label: 'Pincode', value: 'pincode_id' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    // this.adminId = Number(sessionStorage.getItem('roleId'));

    this.loadingRecords = false;
    this.getCountyData();
    this.getStateList();
    this.getDistricts();
    this.getPinCodes();
  }
  isDoctorMappingvisible = false;
  doctorMappingData = new HospitalDoctorMapping();
  mapDoctortitle = 'Map Doctors';
  mapProceduretitle = 'Map Procedure';
  mapDoctorSpinning = false;
  mapProcedureSpinning = false;
  isProcedureMappingVisible = false;
  procedureMappingData = new HospitalProcedureMapping();
  proceDureList: any = [];
  OriginalProcedureList: any = [];
  DoctorsList: any = [];
  OriginalList: any = [];
  // tecnicalSpecificationdrawerVisible: boolean = false;
  // tecnicalSpecificationisSpinning = false;
  checked = false;
  indeterminate = false;
  SELECTED_RECORDS = 0;
  RECORDS = 0;
  setOfCheckedId = new Set();
  datatoSendDoctor: any = [];
  datatoSendProcedure: any = [];
  selectedItems: any = [];
  searchText2 = '';
  checked2 = false;
  indeterminate2 = false;
  SELECTED_RECORDS2 = 0;
  RECORDS2 = 0;
  setOfCheckedId2 = new Set();
  datatoSendDoctor2: any = [];
  selectedItems2: any = [];
  searchText3 = '';



  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);




  sortData(sortKey, sortOrder) {
    this.DoctorsList.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }
  mappedIDs = new Set<number>();
  onAllChecked(value) {
    this.mappedIDs.clear();
    // console.log(this.datatoSendDoctor);
    if (this.datatoSendDoctor.length > 0) {
      this.datatoSendDoctor.forEach((data) => {
        this.mappedIDs.add(data.id || data.ID);
      });
    }
    // console.log(this.mappedIDs);
    this.checked = value;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.selectedItems = [];
    this.datatoSendDoctor = [];
    this.DoctorsList.forEach((data) => {
      if (typeof data === 'object') {
        data.checked = value;
        data.ASSOCIATION_DATE = new Date();
        data.IS_ACTIVE = value ? 1 : 0;
        const doctorData = {
          CLIENT_ID: 1,
          HOSPITAL_ID: this.doctorMappingData.HOSPITAL_ID,
          DOCTOR_ID: data.id || data.ID,
          ASSOCIATION_DATE:
            this.datePipe.transform(data.ASSOCIATION_DATE, 'yyyy-MM-dd') || '',
          IS_ACTIVE: value ? 1 : 0,
        };
        if (value) {
          this.setOfCheckedId.add(data.id || data.ID);
          this.selectedItems.push(data);
        }
        this.datatoSendDoctor.push(doctorData);
        // this.datatoSendDoctor.forEach(data=>{
        //   data.ASSOCIATION_DATE=this.datePipe.transform(new Date(),'yyyy-MM-dd')
        // })
      }
    });
    if (this.mappedIDs) {
      // this.datatoSendDoctor.forEach((data) => {
      const mappedIDsArray = Array.from(this.mappedIDs);
      this.datatoSendDoctor.forEach((data, index) => {
        if (mappedIDsArray[index] !== undefined) {
          data.id = mappedIDsArray[index];
          data.ID = mappedIDsArray[index];
        }
      });
      // });
    }
    localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    this.updateTotalRecords();
    // this.updateCheckedSet(item.ID, checked);
  }
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
        (doctor.NAME || doctor.name).toLowerCase().includes(searchText)
      );
    }
  }
  updateTotalRecords() {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }
  onItemChecked(item, checked) {
    // Update the item properties
    item.ASSOCIATION_DATE = new Date();
    item.IS_ACTIVE = checked ? 1 : 0;

    // Prepare the doctorData object
    const doctorData = {
      CLIENT_ID: 1,
      HOSPITAL_ID: this.doctorMappingData.HOSPITAL_ID,
      DOCTOR_ID: item.id || item.ID,
      ASSOCIATION_DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      IS_ACTIVE: checked ? 1 : 0,
    };

    // Find index of the item in datatoSendDoctor
    const existingIndex = this.datatoSendDoctor.findIndex(
      (data) => (data.DOCTOR_ID || data.doctor_id) === (item.id || item.ID)
    );

    if (existingIndex === -1) {
      // If the item is not in the array, add it
      this.datatoSendDoctor.push(doctorData);
    } else {
      // If the item exists, update its IS_ACTIVE property
      this.datatoSendDoctor[existingIndex].IS_ACTIVE = doctorData.IS_ACTIVE;
      this.datatoSendDoctor[existingIndex].ASSOCIATION_DATE = doctorData.ASSOCIATION_DATE
    }

    // Update the selectedItems array similarly
    const selectedIndex = this.selectedItems.findIndex(
      (data) => (data.DOCTOR_ID || data.doctor_id) === (item.id || item.ID)
    );

    if (checked) {
      if (selectedIndex === -1) {
        this.selectedItems.push(doctorData);
      }
    } else {
      if (selectedIndex !== -1) {
        this.selectedItems[selectedIndex].IS_ACTIVE = 0;
      }
    }

    // Log the updated datatoSendDoctor array
    // console.log(this.datatoSendDoctor);

    // Update other states or UI elements
    this.updateCheckedSet(item.id || item.ID, checked);
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
    // if (i && data && this.datatoSendDoctor.length > 0) {
    this.datatoSendDoctor[i]['ASSOCIATION_DATE'] = this.datePipe.transform(
      data,
      'yyyy-MM-dd'
    );
    // }
    // console.log(this.datatoSendDoctor[i]);
    // else{
    // }
  }
  MapDoctors(data: any) {
    let filter = ' AND is_active=1';
    this.isDoctorMappingvisible = true;
    this.doctorMappingData = new HospitalDoctorMapping();
    this.doctorMappingData.HOSPITAL_ID = data.id;
    this.mapDoctorSpinning = true;
    let filter2 = data.id;
    this.setOfCheckedId.clear();
    this.datatoSendDoctor = [];
    this.selectedItems = [];
    this.api.getAllDoctor(this.pageIndex, 0, '', 'desc', '').subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200) {
          console.log('dataaaaaa', data)
          this.DoctorsList = data.body.data || [];
          this.OriginalList = [...this.DoctorsList];
          // let Id
          this.mapDoctorSpinning = false;
          this.api.getMappedDoctorList(filter2).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                const compareData = res.body.data || [];
                if (compareData.length > 0) {
                  this.DoctorsList.forEach((doctor) => {
                    const matchedData = compareData.find(
                      (mapped) => (mapped.DOCTOR_ID || mapped.doctor_id) === (doctor.id || doctor.ID)
                    );
                    if (matchedData) {
                      if ((matchedData.IS_ACTIVE || matchedData.is_active) == 1) {
                        this.setOfCheckedId.add(matchedData.DOCTOR_ID || matchedData.doctor_id);
                      }
                      doctor.checked = (matchedData.IS_ACTIVE || matchedData.is_active) == 1;
                      doctor.IS_ACTIVE = matchedData.IS_ACTIVE || matchedData.is_active;
                      doctor.ASSOCIATION_DATE = matchedData.ASSOCIATION_DATE || matchedData.association_date;
                      this.datatoSendDoctor.push({ ...matchedData });
                      // Id=matchedData.ID
                      this.selectedItems.push({ ...matchedData });
                    } else {
                      doctor.checked = false;
                      doctor.IS_ACTIVE = 0;
                      const doctorData = {
                        CLIENT_ID: 1,
                        HOSPITAL_ID: this.doctorMappingData.HOSPITAL_ID,
                        DOCTOR_ID: doctor.id || doctor.ID,
                        ASSOCIATION_DATE:
                          this.datePipe.transform(new Date(), 'yyyy-MM-dd') ||
                          '',
                        IS_ACTIVE: 0,
                      };
                      this.datatoSendDoctor.push(doctorData);
                      this.selectedItems.push(doctorData);
                    }
                  });
                }
                // this.datatoSendDoctor.forEach((data) => {
                //   data.ID = ;
                // });
                // console.log(this.datatoSendDoctor);
                const totalItems = this.DoctorsList.length;
                const selectedItems = this.setOfCheckedId.size;
                this.checked = selectedItems === totalItems;
                this.indeterminate =
                  selectedItems > 0 && selectedItems < totalItems;
              }
            },
            () => {
              this.mapDoctorSpinning = false;
              this.message.error('Failed to fetch mapped doctor list', '');
            }
          );
          this.mapDoctorSpinning = false;
        } else {
          this.DoctorsList = [];
          this.OriginalList = [];
          this.mapDoctorSpinning = false;
          this.message.error('Failed to fetch doctor map list', '');
        }
      },
      () => {
        this.message.error('Something went wrong', '');
        this.mapDoctorSpinning = false;
      }
    );
  }
  lowercaseKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.lowercaseKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        newObj[key.toLowerCase()] = this.lowercaseKeys(obj[key]);
      }
      return newObj;
    }
    return obj;
  }
  validateData(data: {
    data: { IS_ACTIVE: boolean; ASSOCIATION_DATE?: string }[];
  }) {
    const invalidEntries = data.data.filter(
      (entry) => entry.IS_ACTIVE && !entry.ASSOCIATION_DATE
    );
    // console.log(invalidEntries);

    if (invalidEntries.length > 0) {
      this.message.error('Please Select Association Date For The Selected Doctor .', '');
      this.mapDoctorSpinning = false;

    }
    else {
      const lowercasedData = this.lowercaseKeys(data);
      if (lowercasedData && Array.isArray(lowercasedData.data)) {
        lowercasedData.data = lowercasedData.data.map((item: any) => {
          if (item) {
            if (item.doctor_id === undefined) {
              item.doctor_id = item.doctor_id || item.id;
            }
          }
          return item;
        });
      }
      this.api.MapDoctors(lowercasedData).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.mapDoctorSpinning = false;
            this.message.success('Doctors Mapped Successfully', '');
            this.isDoctorMappingvisible = false;
          } else {
            this.mapDoctorSpinning = false;
            this.message.error('Failed to map doctors', '');
          }
        },
        (err) => {
          this.mapDoctorSpinning = false;
          console.log(err);
        }
      );
    }

    // console.log('Validation passed.');
  }
  saveMapDoctor(boolean) {
    this.mapDoctorSpinning = true;
    const filteredDoctors = this.datatoSendDoctor.filter((item: any) => {
      const isActive = item.IS_ACTIVE === 1 || item.is_active === 1 || item.IS_ACTIVE === true || item.is_active === true;
      const hasId = item.ID || item.id;
      return isActive || hasId;
    });

    if (filteredDoctors.length == 0) {
      this.message.error('Please Select Mapping Data', '');
      this.mapDoctorSpinning = false;
    } else {
      let data = {
        data: filteredDoctors,
      };
      this.validateData(data);
    }
  }
  closeDoctorMapping() {
    this.isDoctorMappingvisible = false;
    this.doctorMappingData = new HospitalDoctorMapping();
    this.searchText2 = '';
  }
  sortData2(sortKey, sortOrder) {
    this.proceDureList.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }
  mappedIDs2 = new Set<number>();
  onAllChecked2(value) {
    this.mappedIDs2.clear();
    // console.log(this.datatoSendDoctor);
    if (this.datatoSendProcedure.length > 0) {
      this.datatoSendProcedure.forEach((data) => {
        this.mappedIDs2.add(data.id || data.ID);
      });
    }
    // console.log(this.mappedIDs);
    this.checked2 = value;
    this.indeterminate2 = false;
    this.setOfCheckedId2.clear();
    this.selectedItems2 = [];
    this.datatoSendProcedure = [];
    this.proceDureList.forEach((data) => {
      if (typeof data === 'object') {
        data.checked = value;
        // data.ASSOCIATION_DATE = new Date();
        data.IS_ACTIVE = value ? 1 : 0;
        const doctorData = {
          CLIENT_ID: 1,
          HOSPITAL_ID: this.procedureMappingData.HOSPITAL_ID,
          PROCEDURE_ID: data.id || data.ID,
          IS_ACTIVE: value ? 1 : 0,
        };
        if (value) {
          this.setOfCheckedId2.add(data.id || data.ID);
          this.selectedItems2.push(data);
        }
        this.datatoSendProcedure.push(doctorData);
        // this.datatoSendProcedures.forEach(data=>{
        //   data.ASSOCIATION_DATE=this.datePipe.transform(new Date(),'yyyy-MM-dd')
        // })
      }
    });
    if (this.mappedIDs2) {
      // this.datatoSendProcedures.forEach((data) => {
      const mappedIDsArray = Array.from(this.mappedIDs2);
      this.datatoSendProcedure.forEach((data, index) => {
        if (mappedIDsArray[index] !== undefined) {
          data.id = mappedIDsArray[index];
          data.ID = mappedIDsArray[index];
        }
      });
      // });
    }
    // localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    this.updateTotalRecords();
  }
  keyup3() {
    if (this.searchText3.trim().length >= 3 || this.searchText3.length === 0) {
      this.searchProcedure();
    }
  }
  searchProcedure() {
    if (!this.searchText3.trim()) {
      this.proceDureList = [...this.OriginalProcedureList];
    } else {
      const searchText = this.searchText3.trim().toLowerCase();
      this.proceDureList = this.OriginalProcedureList.filter((doctor) =>
        (doctor.name || doctor.NAME).toLowerCase().includes(searchText)
      );
    }
  }
  updateTotalRecords2() {
    this.SELECTED_RECORDS2 = this.setOfCheckedId2.size;
  }
  onItemChecked2(item, checked) {
    // Toggle IS_ACTIVE based on the checked status
    item.IS_ACTIVE = checked ? 1 : 0;

    // Prepare the doctorData object
    const doctorData = {
      CLIENT_ID: 1,
      HOSPITAL_ID: this.procedureMappingData.HOSPITAL_ID,
      PROCEDURE_ID: item.id || item.ID,
      IS_ACTIVE: checked ? 1 : 0,
    };

    // Find index of the item in datatoSendProcedure
    const existingIndex = this.datatoSendProcedure.findIndex(
      (data) => (data.PROCEDURE_ID || data.procedure_id) === (item.id || item.ID)
    );

    if (existingIndex === -1) {
      // If the item is not already in the array, add it
      this.datatoSendProcedure.push(doctorData);
    } else {
      // If the item exists, update its IS_ACTIVE status
      this.datatoSendProcedure[existingIndex].IS_ACTIVE = doctorData.IS_ACTIVE;
    }

    // Log the updated datatoSendProcedure array
    // console.log(this.datatoSendProcedure);

    // Update other states or UI elements
    this.updateCheckedSet2(item.id || item.ID, checked);
    this.updateTotalRecords2();
  }

  updateCheckedSet2(id, checked) {
    if (checked) {
      this.setOfCheckedId2.add(id);
    } else {
      this.setOfCheckedId2.delete(id);
    }
    const totalItems = this.proceDureList.length;
    const selectedItems = this.setOfCheckedId2.size;
    this.checked2 = selectedItems === totalItems;
    this.indeterminate2 = selectedItems > 0 && selectedItems < totalItems;
  }
  // onDateChange2(i, data) {
  //   if (i && data && this.datatoSendDoctor.length > 0) {
  //     this.datatoSendDoctor[i]['ASSOCIATION_DATE'] = this.datePipe.transform(
  //       data,
  //       'yyyy-MM-dd'
  //     );
  //   }
  //   // else{
  //   // }
  // }
  MapProcedures(data: any) {
    let filter = ' AND is_active=1';
    this.isProcedureMappingVisible = true;
    this.procedureMappingData = new HospitalProcedureMapping();
    this.procedureMappingData.HOSPITAL_ID = data.id || data.ID;
    let filter2 = data.id;
    this.setOfCheckedId2.clear();
    this.datatoSendProcedure = [];
    this.selectedItems2 = [];
    this.mapProcedureSpinning = true;
    this.api.getProcedureMapList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200) {
          this.proceDureList = data.body.data || [];
          this.OriginalProcedureList = [...this.proceDureList];
          // let Id
          this.mapProcedureSpinning = false;
          this.api.getMappedProcedureList(filter2).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                const compareData = res.body.data || [];
                if (compareData.length > 0) {
                  this.proceDureList.forEach((doctor) => {
                    const matchedData = compareData.find(
                      (mapped) => (mapped.PROCEDURE_ID || mapped.procedure_id) === (doctor.id || doctor.ID)
                    );
                    if (matchedData) {
                      if ((matchedData.IS_ACTIVE || matchedData.is_active) == 1) {
                        this.setOfCheckedId2.add(matchedData.PROCEDURE_ID || matchedData.procedure_id);
                      }
                      doctor.checked = (matchedData.IS_ACTIVE || matchedData.is_active) == 1;
                      doctor.IS_ACTIVE = matchedData.IS_ACTIVE || matchedData.is_active;
                      // doctor.ASSOCIATION_DATE = matchedData.ASSOCIATION_DATE;
                      this.datatoSendProcedure.push({ ...matchedData });
                      // Id=matchedData.ID
                      this.selectedItems2.push({ ...matchedData });
                    } else {
                      doctor.checked = false;
                      doctor.IS_ACTIVE = 0;
                      const doctorData = {
                        CLIENT_ID: 1,
                        HOSPITAL_ID: this.procedureMappingData.HOSPITAL_ID,
                        PROCEDURE_ID: doctor.id || doctor.ID,
                        // ASSOCIATION_DATE:
                        //   this.datePipe.transform(new Date(), 'yyyy-MM-dd') ||
                        //   '',
                        IS_ACTIVE: 0,
                      };
                      this.datatoSendProcedure.push(doctorData);
                      this.selectedItems2.push(doctorData);
                    }
                  });
                }
                // this.datatoSendDoctor.forEach((data) => {
                //   data.ID = ;
                // });
                // console.log(this.datatoSendDoctor);
                const totalItems = this.proceDureList.length;
                const selectedItems = this.setOfCheckedId2.size;
                this.checked2 = selectedItems === totalItems;
                this.indeterminate2 =
                  selectedItems > 0 && selectedItems < totalItems;
              }
            },
            () => {
              this.mapProcedureSpinning = false;
              this.message.error('Failed to fetch mapped procedure list', '');
            }
          );
          this.mapProcedureSpinning = false;
        } else {
          this.proceDureList = [];
          this.OriginalProcedureList = [];
          this.mapProcedureSpinning = false;
          this.message.error('Failed to fetch procedure map list', '');
        }
      },
      () => {
        this.message.error('Something went wrong', '');
        this.mapProcedureSpinning = false;
      }
    );
    // throw new Error('Method not implemented.');
  }
  saveMapProcedures(boolean) {
    this.mapProcedureSpinning = true;
    if (this.datatoSendProcedure.length == 0) {
      this.message.error('Please Select Mapping Data', '');
    } else {
      // console.log(this.datatoSendDoctor);
      let data = {
        data: this.datatoSendProcedure,
      };
      const lowercasedData = this.lowercaseKeys(data);
      this.api.MapProcedures(lowercasedData).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.mapProcedureSpinning = false;
            this.message.success('Procedures Mapped Successfully', '');
            this.isProcedureMappingVisible = false;
          } else {
            this.mapProcedureSpinning = false;
            this.message.error('Failed to map procedure', '');
          }
        },
        (err) => {
          this.mapProcedureSpinning = false;
          console.log(err);
        }
      );
    }
  }
  closeProcedureMapping() {
    this.isProcedureMappingVisible = false;
    this.procedureMappingData = new HospitalProcedureMapping();
  }
  countryData: any = [];
  stateData: any = [];
  districtData: any = [];
  pincodeData: any = [];
  countryload = false;
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
  onCountryChange(): void {
    this.search();
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
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
  registrationProofText: string = '';
  photoText: string = '';
  websiteLinkText: string = '';
  addressLine1Text: string = '';
  addressLine2Text: string = '';
  search(reset: boolean = false) {
    console.log("userId", this.USER_ID);
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
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
    }
    if (this.contacttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CONTACT_NUMBER LIKE '%${this.contacttext.trim()}%'`;
    }
    if (this.latitudetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LATITUDE LIKE '%${this.latitudetext.trim()}%'`;
    }
    if (this.longitudetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `LONGITUDE LIKE '%${this.longitudetext.trim()}%'`;
    }
    if (this.registrationProofText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `REGISTRATION_PROOF LIKE '%${this.registrationProofText.trim()}%'`;
    }
    if (this.photoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `PHOTO LIKE '%${this.photoText.trim()}%'`;
    }
    if (this.websiteLinkText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `WEBSITE_LINK LIKE '%${this.websiteLinkText.trim()}%'`;
    }
    if (this.addressLine1Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ADDRESS_LINE_1 LIKE '%${this.addressLine1Text.trim()}%'`;
    }
    if (this.addressLine2Text !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ADDRESS_LINE_2 LIKE '%${this.addressLine2Text.trim()}%'`;
    }
    // Country Filter
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_ID IN (${this.selectedCountries.join(',')})`; // Update with actual field name in the DB
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_ID IN (${this.selectedStates.join(',')})`; // Update with actual field name in the DB
    }
    // Handle selected Districts
    if (this.selectedDistricts.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DISTRICT_ID IN (${this.selectedDistricts.join(',')})`; // Update with actual field name in the DB
    }
    // Handle selected Pincodes
    if (this.selectedPincodes.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PINCODE_ID IN (${this.selectedPincodes.join(',')})`; // Update with actual field name in the DB
    }
    if (this.seqNo) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SEQ_NO=${this.seqNo}`; // Update with actual field name in the DB
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
    // this.dataList = [
    //   {
    //     NAME: 'John Doe',
    //     CONTACT_NUMBER: '123-456-7890',
    //     LONGITUDE: '78.9629',
    //     LATITUDE: '20.5937',
    //     REGISTRATION_PROOF: 'Uploaded',
    //     PHOTO: 'profile-pic.jpg',
    //     WEBSITE_LINK: 'https://www.johndoe.com',
    //     ADDRESS_LINE_1: '123 Main St',
    //     ADDRESS_LINE_2: 'Apt 101',
    //     COUNTRY: 'India',
    //     STATE: 'Maharashtra',
    //     DISTRICT: 'Sangli',
    //     PINCODE: '416416',
    //   },
    //   {
    //     NAME: 'Jane Smith',
    //     CONTACT_NUMBER: '987-654-3210',
    //     LONGITUDE: '80.2785',
    //     LATITUDE: '13.0827',
    //     REGISTRATION_PROOF: 'Uploaded',
    //     PHOTO: 'profile-pic2.jpg',
    //     WEBSITE_LINK: 'https://www.janesmith.com',
    //     ADDRESS_LINE_1: '456 Elm St',
    //     ADDRESS_LINE_2: 'Apt 202',
    //     COUNTRY: 'India',
    //     STATE: 'Karnataka',
    //     DISTRICT: 'Bangalore',
    //     PINCODE: '560001',
    //   },
    //   {
    //     NAME: 'Alice Johnson',
    //     CONTACT_NUMBER: '555-123-4567',
    //     LONGITUDE: '77.5946',
    //     LATITUDE: '12.9716',
    //     REGISTRATION_PROOF: 'Not Uploaded',
    //     PHOTO: 'profile-pic3.jpg',
    //     WEBSITE_LINK: 'https://www.alicejohnson.com',
    //     ADDRESS_LINE_1: '789 Pine St',
    //     ADDRESS_LINE_2: 'Apt 303',
    //     COUNTRY: 'India',
    //     STATE: 'Delhi',
    //     DISTRICT: 'Central Delhi',
    //     PINCODE: '110001',
    //   },
    // ];
    // Call API with updated search query
    let extraFilter = ''
    let rawData = sessionStorage.getItem('userId')
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null
    if (userId && userId != '1') {
      extraFilter = " AND user_id =" + userId
    }
    this.api
      .getHospitalClinics(
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
            this.TabId = response.body.TAB_ID || response.body.tab_id;
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
  reset(): void {
    this.searchText = '';
    this.statetext = '';
    this.search();
  }
  add(): void {
    this.drawerTitle = 'Create New Hospital/Clinic';
    this.drawerData = new HospitalClinicMaster();
    this.api.getHospitalClinics(1, 1, 'seq_no', 'desc', '' + '').subscribe(
      (data: HttpResponse<any>) => {
        if (data.body['count'] == 0) {
          this.drawerData.seq_no = 1;
        } else {
          this.drawerData.seq_no = data.body['data'][0]['seq_no'] + 1;
        }
      },
      (err) => {
        console.log(err);
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
  countryid;
  stateid;
  districtid;
  edit(data: HospitalClinicMaster): void {
    this.drawerTitle = ' Update Hospital/Clinic';
    this.drawerData = Object.assign({}, data);
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
  // Main Filter
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
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
  loadFilters() {
    this.api
      .getFilterData1(
        0,
        0,
        '',
        '',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
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
    this.drawerTitle = 'Hospital/Clinic Filter';
    this.filterFields[9]['options'] = this.countryData.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[10]['options'] = this.stateData.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[11]['options'] = this.districtData.map((data) => ({
      value: data.ID || data.id,
      display: data.NAME || data.name,
    }));
    this.filterFields[12]['options'] = this.pincodeData.map((data) => ({
      value: data.ID || data.id,
      display: data.PINCODE_NUMBER || data.pincode_number,
    }));

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

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
}
