import { Component, Input } from '@angular/core';
import { patientaddressmaster, patientmaster } from '../../../Models/patient';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-patientmasteraddressadd',
  templateUrl: './patientmasteraddressadd.component.html',
  styleUrls: ['./patientmasteraddressadd.component.css']
})
export class PatientmasteraddressaddComponent {
  @Input() patientId
  @Input()
  drawerClose!: Function;
  @Input()
  data: patientaddressmaster = new patientaddressmaster();
  isSpinning = false
  isOk = true;
  countryList: any = [];
  stateList: any = [];
  districtList: any = [];
  pincodeList: any = [];
  public commonFunction = new CommonFunctionService()
  constructor(private api: ApiServiceService, private message: NzNotificationService) { }
  getCountyData() {
    const filter = `AND IS_ACTIVE = 1`;
    // this.countryload = true;
    this.api.getCountryDropdown(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.countryload = false;

          this.countryList = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.countryList = [];
          // this.countryload = false;

          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        // this.countryload = false;
      }
    );
  }
  getStateList() {
    var filter = `AND is_active = 1`;
    // this.stateload = true;
    if (this.data.id && this.data.country_id) {
      filter += ' AND country_id=' + this.data.country_id
    }

    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.stateload = false;

          this.stateList = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.stateList = [];
          // this.stateload = false;

          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        // this.stateload = false;
      }
    );
  }
  getDistricts() {
    var filter = `AND is_active = 1`;
    // this.stateload = true;
    if (this.data.id && this.data.country_id && this.data.state_id) {
      filter += ' AND country_id=' + this.data.country_id + ' AND state_id=' + this.data.state_id
    }
    // this.districtload = true;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.districtload = false;
          this.districtList = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.districtList = [];
          // this.districtload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        // this.districtList = false;
      }
    );
  }
  getPinCodes() {
    var filter = `AND is_active = 1`;
    // this.pincodeload = true;
    if (this.data.id && this.data.country_id && this.data.state_id && this.data.district_id) {
      filter += ' AND country_id=' + this.data.country_id + ' AND state_id=' + this.data.state_id + ' AND district_id=' + this.data.district_id
    }
    this.api.getPincodeType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.pincodeload = false;
          this.pincodeList = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.pincodeList = [];
          // this.pincodeload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        // this.pincodeload = false;
      }
    );
  }

  ngOnInit(): void {
    this.getCountyData();
    if (this.data.id) {
      this.getStateList()
      this.getDistricts();
      this.getPinCodes();
    }
  }

  // loadCountryList(): void {
  //   // Replace with API call to fetch countries
  //   this.countryList = [
  //     { id: 1, name: 'India' },
  //     { id: 2, name: 'United States' },
  //   ];
  // }

  onCountryChange($event: any) {
    // if (this.isEdit && this.isFirstCall) {
    this.data.state_id = null;
    this.data.district_id = null;
    this.data.pincode_id = null;
    // }
    if ($event) {
      // throw new Error('Method not implemented.');
      let filter = ' AND COUNTRY_ID= ' + $event + ' AND IS_ACTIVE=1';
      // this.stateload = true;
      this.api.getStateType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            // this.stateload = false;
            this.stateList = res.body.data;
          } else {
            // this.stateload = false;
            this.stateList = [];
          }
        },
        (err: any) => {
          // this.stateload = false;
        }
      );
    } else {
      this.data.state_id = null;
      this.data.district_id = null;
      this.data.pincode_id = null;

    }
  }
  onStateChange($event: any) {
    //  if (this.isEdit && this.isFirstCall) {
    // this.data.STATE_ID = null;
    this.data.district_id = null;
    this.data.pincode_id = null;
    // }
    // throw new Error('Method not implemented.');
    if ($event) {
      let filter = ' AND STATE_ID= ' + $event + ' AND IS_ACTIVE=1';
      // this.districtload = true;
      this.api.getDistrictType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            // this.districtload = false;
            this.districtList = res.body.data;
          } else {
            // this.districtload = false;
            this.districtList = [];
          }
        },
        (err: any) => {
          // this.districtload = false;
        }
      );
    } else {
      this.data.district_id = null;
      this.data.pincode_id = null;
    }
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
    //  if (this.isEdit && this.isFirstCall) {
    // this.data.STATE_ID = null;
    // this.data.DISTRICT_ID = null;
    this.data.pincode_id = null;
    // }
    if ($event) {
      let filter = ' AND DISTRICT_ID= ' + $event + ' AND IS_ACTIVE=1';
      // this.pincodeload = true;
      this.api.getPincodeType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            // this.pincodeload = false;
            this.pincodeList = res.body.data;
          } else {
            // this.pincodeload = false;
            this.pincodeList = [];
          }
        },
        (err: any) => {
          // this.pincodeload = false;
        }
      );
    } else {
      this.data.pincode_id = null;
    }
  }

  close(): void {
    this.drawerClose();
  }
  save(addNew: boolean, councilMasterPage: NgForm) {
    this.isOk = true;
    // console.log(this.data);

    if (
      (!this.data.type || this.data.type.trim() === '') &&
      (!this.data.line_1 || this.data.line_1.trim() === '') &&
      (!this.data.country_id || this.data.country_id === undefined) &&
      (!this.data.state_id || this.data.state_id === undefined) &&
      (!this.data.district_id || this.data.district_id === undefined) &&
      (!this.data.pincode_id || this.data.pincode_id === undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
    } else if (!this.data.type || this.data.type.trim() === '') {
      this.isOk = false;
      this.message.error('Please Select Type', '');
    } else if (!this.data.line_1 || this.data.line_1.trim() === '') {
      this.isOk = false;
      this.message.error('Please Enter Line 1', '');
    } else if (!this.data.country_id || this.data.country_id === undefined) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (!this.data.state_id || this.data.state_id === undefined) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (!this.data.district_id || this.data.district_id === undefined) {
      this.isOk = false;
      this.message.error('Please Select District', '');
    } else if (!this.data.pincode_id || this.data.pincode_id === undefined) {
      this.isOk = false;
      this.message.error('Please Enter Pincode', '');
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
      // this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');
      this.isSpinning = true;
      // let userID = sessionStorage.getItem('userId');
      // this.data['USER_ID'] = userID
      //   ? this.commonFunction.decryptdata(userID)
      //   : null;
      {
        if (this.data.id) {
          this.api.updatePatientAddress(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Address Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('User Address Information Not Updated', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        } else {
          this.api
            .createPatientAddress(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Address Information Saved Successfully',
                  ''
                );
                // this.CouncilSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(councilMasterPage);
                  this.data = new patientaddressmaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('User Address Information Not Saved', '');
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
    this.data = new patientaddressmaster();
    councilMasterPage.form.markAsPristine();
    councilMasterPage.form.markAsUntouched();
  }
}
