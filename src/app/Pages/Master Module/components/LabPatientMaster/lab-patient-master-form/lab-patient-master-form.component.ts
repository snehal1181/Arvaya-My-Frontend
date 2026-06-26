import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabPatient } from '../../../Models/LabPatient';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lab-patient-master-form',
  templateUrl: './lab-patient-master-form.component.html',
  styleUrls: ['./lab-patient-master-form.component.css'],
})
export class LabPatientMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input() isSavePatient: boolean;
  @Input() showdata: boolean;
  @Input()
  data: LabPatient = new LabPatient();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabPatient[] = [];
  @Input()
  drawerVisible: boolean = false;
  @Input() linkedLabId;
  @Input() LAB_NAME: string = '';
  internalLabName: string = '';


  isSpinning = false;

  public commonFunction = new CommonFunctionService();
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  strengthUnitList: any;
  typeIdList: any;
  hospitalIdList: any;
  genderList: any;
  mobpattern = /^[6-9]\d{9}$/;
  // @Input() linkedLabId

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  @Input() mobileNo
  ngOnInit(): void {

    this.internalLabName = this.LAB_NAME;

    this.getLabData();
    if (this.mobileNo) {
      this.data.mobile_number = this.mobileNo
    }
    //   this.getCountyData();// Replace with a valid default country ID
    //   if(this.data.COUNTRY_ID){
    // this.getStateData(this.data.COUNTRY_ID);}
  }
  // For Accepting Only Alphabits/ Character
  alphaOnly1(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Allow uppercase letters (A-Z) and numbers (0-9)
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 48 && charCode <= 57) // 0-9
    ) {
      event.preventDefault();
    }
  }

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(): void {
    this.drawerClose();
  }

  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, '', '', 'AND IS_ACTIVE = 1').subscribe(
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
  getStateData(value) {
    this.api
      .getState(0, 0, '', '', 'AND IS_ACTIVE = 1 AND COUNTRY_ID = ' + value)
      .subscribe(
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
  sessionValue: any = sessionStorage.getItem('userId');

  labs: any;
  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  getLabData() {
    var extraFilter = '';
    var extraFilter2 = '';
    // console.log(this.data,this.linkedLabId);

    this.data.lab_id = this.data.lab_id || this.linkedLabId || this.labID
    this.labID = this.linkedLabId || this.labID

    if (this.labID && this.decreptedroleId !== 1) {
      extraFilter = ' AND id=' + this.labID;
      // extraFilter2 = ' AND lab_id=' + this.labID;
    }
    if (!this.isSavePatient && this.decreptedroleId !== 3) {
      extraFilter = ' AND id=' + this.linkedLabId;
    }
    let filter = `AND is_active = 1` + extraFilter;
    // let rawData = sessionStorage.getItem('userId');
    // let userId = rawData ? this.commonFunction.decryptdata(rawData) : null;
    // if (userId && userId != '1') {
    //   filter+= ' AND USER_ID=' + userId;
    // }
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
  save(addNew: boolean, MedicineTypeMasterPage: NgForm): void {

    // console.log(this.data);

    var isOk = true;
    if (
      (this.data.patient_no == undefined || this.data.patient_no == null) &&
      (this.data.dob == undefined || this.data.dob == null) &&
      (this.data.lab_id == undefined || this.data.lab_id == null) &&
      (this.data.blood_group == undefined || this.data.blood_group == null) &&
      (this.data.gender == undefined || this.data.gender == null) &&
      (this.data.mobile_number == undefined || this.data.mobile_number == null) &&
      (this.data.name == undefined || this.data.name.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.lab_id == undefined || this.data.lab_id == null) {
      isOk = false;
      this.message.error('Please select Lab.', '');
    } else if (this.data.name == undefined || this.data.name == null || this.data.name == '') {
      isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.data.patient_no == undefined ||
      this.data.patient_no == null || this.data.patient_no == 0
    ) {
      isOk = false;
      this.message.error('Please Enter Patient Number', '');
    } else if (this.data.gender == undefined || this.data.gender == null) {
      isOk = false;
      this.message.error('Please Select Gender', '');
    } else if (
      this.data.mobile_number == null ||
      this.data.mobile_number == 0 ||
      this.data.mobile_number == undefined
    ) {
      isOk = false;
      this.message.error('Please Enter Mobile Number', '');
    } else if (
      !this.commonFunction.mobpattern.test(this.data.mobile_number.toString())
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.data.dob == null ||
      this.data.dob == '' ||
      this.data.dob == undefined
    ) {
      isOk = false;
      this.message.error('Please Select Date of Birth', '');
    } else if (
      this.data.blood_group == null ||
      this.data.blood_group == '' ||
      this.data.blood_group == undefined
    ) {
      isOk = false;
      this.message.error('Please Select Blood Group', '');
    }
    this.data.user_id = this.commonFunction.decryptdata(this.sessionValue);
    this.data.dob = this.datePipe.transform(this.data.dob, 'yyyy-MM-dd');
    // if (isOk && this.isSavePatient) {
    if (isOk) {
      this.isSpinning = true;
      // this.data.USER_ID = this.commonFunction.decryptdata(this.sessionValue);
      // this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');


      if (this.data.id) {
        this.api
          .updateLabPatient(this.data)
          .subscribe((response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success(
                'Lab Patient Data Updated Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Lab Patient Data Updation Failed', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api.createLabPatient(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success(
                'Lab Patient Data Created Successfully',
                ''
              );

              this.isSpinning = false;
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new LabPatient();
                this.resetDrawer(MedicineTypeMasterPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Lab Patient Data Creation Failed..."', '');
              this.isSpinning = false;
            }
          },
          (error) => {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        );
      }

    }
    // else {
    //   this.isSpinning = false;
    //   this.message.success(' Patient Added Successfully', '');
    //   this.drawerClose();
    // }
  }



  resetDrawer(MedicineTypeMasterPage: NgForm) {
    this.data = new LabPatient();
    MedicineTypeMasterPage.form.markAsPristine();
    MedicineTypeMasterPage.form.markAsUntouched();
  }
}
