import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalPatient } from '../../../Models/HospitalPatient';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hospital-patient-master-form',
  templateUrl: './hospital-patient-master-form.component.html',
  styleUrls: ['./hospital-patient-master-form.component.css']
})
export class HospitalPatientMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: HospitalPatient = new HospitalPatient();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HospitalPatient[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  public commonFunction = new CommonFunctionService()
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  strengthUnitList: any;
  typeIdList: any;
  hospitalIdList: any;
  genderList: any;
  mobpattern = /^[6-9]\d{9}$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,

  ) { }

  ngOnInit(): void {
    this.getHospitalData()
    //   this.getCountyData();// Replace with a valid default country ID
    //   if(this.data.COUNTRY_ID){
    // this.getStateData(this.data.COUNTRY_ID);}
  }
  // For Accepting Only Alphabits/ Character

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
    this.api.getAllCountryMaster(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.countryData = data["data"];
        } else {
          this.countryData = [];
          this.message.error("Failed To Get Country Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }

  stateData: any = [];
  getStateData(value) {
    this.api.getState(0, 0, "", "", "AND IS_ACTIVE = 1 AND COUNTRY_ID = " + value).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.stateData = data["data"];
        } else {
          this.stateData = [];
          this.message.error("Failed To Get State Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }
  sessionValue: any = sessionStorage.getItem('userId');
  alphaOnly1(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Allow uppercase letters (A-Z) and numbers (0-9)
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 48 && charCode <= 57)    // 0-9
    ) {
      event.preventDefault();
    }
  }
  entityData: any = [];

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);

  getHospitalData() {
    let filter1 = '';
    if (this.decreptedroleId == 2) {
      filter1 = `AND user_id =` + this.commonFunction.decryptdata(this.sessionValue);
    }
    const filter = `AND is_active = 1` + filter1;
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
  save(addNew: boolean, MedicineTypeMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.patient_no == undefined || this.data.patient_no == null) &&
      (this.data.dob == undefined || this.data.dob == null) &&
      (this.data.hospital_id == undefined || this.data.hospital_id == null) &&

      (this.data.blood_group == undefined || this.data.blood_group == null) &&
      (this.data.gender == undefined || this.data.gender == null) &&
      (this.data.mobile_number == undefined || this.data.mobile_number == null) &&
      (this.data.name == undefined || this.data.name == "" || this.data.name.trim() == "")
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "");
    }
    else if (!this.data.hospital_id) {
      this.isOk = false;
      this.message.error('Please select Hospital.', '');
    }
    else if (this.data.name == undefined || this.data.name == null) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    }
    else if (this.data.patient_no == undefined || this.data.patient_no == null) {
      this.isOk = false;
      this.message.error('Please Enter Patient Number', '');
    }
    else if (
      this.data.mobile_number == null ||
      this.data.mobile_number == 0 ||
      this.data.mobile_number == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number', '');
    }
    else if (
      !this.commonFunction.mobpattern.test(this.data.mobile_number.toString())
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.data.dob == null ||
      this.data.dob == '' ||
      this.data.dob == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Date of Birth', '');
    }
    else if (
      this.data.blood_group == null ||
      this.data.blood_group == '' ||
      this.data.blood_group == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Blood Group', '');
    }

    else if (this.data.gender == undefined || this.data.gender == null) {
      this.isOk = false;
      this.message.error('Please Select Gender', '');
    }



    if (this.isOk) {
      this.isSpinning = true;
      this.data.user_id = this.commonFunction.decryptdata(this.sessionValue);
      this.data.dob = this.datePipe.transform(this.data.dob, "yyyy-MM-dd")

      {
        if (this.data.id) {
          this.api.updateHospitalPatient(this.data).subscribe(

            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Hospital Patient Data Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              }
              else {
                this.message.error('Hospital Patient Data Updation Failed', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createHospitalPatient(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success("Hospital Patient Data Created Successfully", "");

                this.isSpinning = false;
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new HospitalPatient();
                  this.resetDrawer(MedicineTypeMasterPage);

                }
                this.isSpinning = false;
              } else {
                this.message.error('Hospital Patient Data Creation Failed..."', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            })

        }
      }
    }
  }

  citySeq(): void {
    // this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.data.SEQ_NO = 1;
    //   } else {
    //     this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //     this.data.IS_ACTIVE = true;
    //   }
    // }, err => {
    //   console.log(err);
    // })
  }

  resetDrawer(MedicineTypeMasterPage: NgForm) {
    this.data = new HospitalPatient();
    MedicineTypeMasterPage.form.markAsPristine();
    MedicineTypeMasterPage.form.markAsUntouched();
    this.citySeq()
  }
}
