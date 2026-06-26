import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { patientmaster } from '../../../Models/patient';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patientmasterfamilyadd',
  templateUrl: './patientmasterfamilyadd.component.html',
  styleUrls: ['./patientmasterfamilyadd.component.css'],
})
export class PatientmasterfamilyaddComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: any;
  isOk = true;
  isSpinning = false;
  @Input() patientId
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    // console.log(this.patientId);
  }
  public commonFunction = new CommonFunctionService();
  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, councilMasterPage: NgForm) {
    this.isOk = true;
    // console.log(this.data);

    if (
      (!this.data.name || this.data.name.trim() === '') &&
      (!this.data.relation || this.data.relation.trim() === '') &&
      (!this.data.dob) &&
      (!this.data.blood_group || this.data.blood_group.trim() === '') &&
      (!this.data.gender || this.data.gender.trim() === '') &&
      (!this.data.mobile_number || this.data.mobile_number.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
    } else if (!this.data.name || this.data.name.trim() === '') {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (!this.data.relation || this.data.relation.trim() === '') {
      this.isOk = false;
      this.message.error('Please Select Relation', '');
    } else if (!this.data.dob) {
      this.isOk = false;
      this.message.error('Please Select Date of Birth', '');
    } else if (!this.data.blood_group || this.data.blood_group.trim() === '') {
      this.isOk = false;
      this.message.error('Please Select Blood Group', '');
    } else if (!this.data.gender || this.data.gender.trim() === '') {
      this.isOk = false;
      this.message.error('Please Select Gender', '');
    } else if (
      !this.data.mobile_number ||
      this.data.mobile_number.trim() === ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number', '');
    } else {
      this.isOk = true;
      // Additional success handling logic
    }

    //  else if (
    //   this.data.ABHA_NUMBER == undefined ||
    //   this.data.ABHA_NUMBER.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter ABHA Number', '');
    // } else if (
    //   this.data.ABHA_TYPE == undefined ||
    //   this.data.ABHA_TYPE.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select ABHA Type', '');
    // }

    if (this.isOk) {
      this.data['app_user_id'] = this.patientId
      this.data.dob = this.datePipe.transform(this.data.dob, 'yyyy-MM-dd');
      this.isSpinning = true;
      // let userID = sessionStorage.getItem('userId');
      // this.data.USER_ID = userID
      //   ? this.commonFunction.decryptdata(userID)
      //   : null;
      {
        if (this.data.id) {
          this.api.updatePatientFamily(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Family Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('User Family Information Not Updated', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        } else {
          this.api
            .createPatientFamily(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Family Information Saved Successfully',
                  ''
                );
                // this.CouncilSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(councilMasterPage);
                  this.data = new patientmaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('User Family Information Not Saved', '');
                this.isSpinning = false;
              }
            }, (err) => {
              this.isSpinning = false;

            });
        }
      }
    }
  }
  resetDrawer(councilMasterPage: NgForm) {
    this.data = new patientmaster();
    councilMasterPage.form.markAsPristine();
    councilMasterPage.form.markAsUntouched();
  }

  CouncilSeq(): void {
    this.api.getPatientfamily(1, 1, 'SEQ_NO', 'desc', '', this.patientId).subscribe(
      (response: HttpResponse<any>) => {
        const responseBody = response.body; // Safely access the body of the response
        if (responseBody && responseBody['count'] === 0) {
          this.data.SEQ_NO = 1;
        } else if (responseBody && responseBody['data']?.length > 0) {
          this.data.SEQ_NO = Number(responseBody['data'][0]['SEQ_NO']) + 1;
          this.data.IS_ACTIVE = true;
        }
      },
      (err) => { }
    );
  }
}
