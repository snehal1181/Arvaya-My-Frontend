import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabTechnician } from '../../../Models/LabTechicianMaster';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lab-technician-master-form',
  templateUrl: './lab-technician-master-form.component.html',
  styleUrls: ['./lab-technician-master-form.component.css'],
})
export class LabTechnicianMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: LabTechnician = new LabTechnician();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabTechnician[] = [];
  public commonFunction = new CommonFunctionService();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  progressBarPhoto: any;
  percentPhoto: any;
  filePhotoURL: any;
  urlPhoto: any;
  urlPhotoShow: boolean;
  stateload: boolean;
  States: any = [];
  districtload: boolean;
  districts: any = [];
  pincodeload: boolean;
  pincodes: any = [];
  countryload: boolean;
  countries: any = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  @Input() countryid;
  @Input() stateid;
  @Input() districtid;
  ngOnInit(): void {
    this.getCountyData();
    // this.getStateList();
    // this.getDistricts();
    // this.getPinCodes();
    // if (this.countryid & this.stateid && this.districtid) {
    //   this.onCountryChange(this.countryid);
    //   this.onStateChange(this.stateid);
    //   this.onDistrictChange(this.districtid);
    // }
    if (this.data.id) {
      this.getStateList()
      this.getDistricts();
      this.getPinCodes();
    }
  }
  contactpattern = /^[0-9\-]$/;

  // For Accepting Only Alphabits/ Character
  onKeyPress(event: KeyboardEvent): boolean {
    const allowedChars = /^[0-9\-]$/; // Only digits and dashes
    const key = event.key;

    if (!allowedChars.test(key)) {
      // this.errorMessage = 'Only numbers and dashes are allowed';
      event.preventDefault();
      return false;
    }

    // this.errorMessage = ''; // Clear error if valid
    return true;
  }

  close(): void {
    this.drawerClose();
  }
  onCountryChange($event: any) {
    this.data.state_id = null;
    this.data.district_id = null;
    this.data.pincode_id = null;
    if ($event) {
      // throw new Error('Method not implemented.');
      let filter = ' AND COUNTRY_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.stateload = true;
      this.api.getStateType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.stateload = false;
            this.States = res.body.data;
          } else {
            this.stateload = false;
            this.States = [];
          }
        },
        (err: any) => {
          this.stateload = false;
        }
      );
    } else {
      this.data.state_id = null;
      this.data.district_id = null;
      this.data.pincode_id = null;
    }
  }
  onStateChange($event: any) {
    // throw new Error('Method not implemented.');
    this.data.district_id = null;
    this.data.pincode_id = null;
    if ($event) {
      let filter = ' AND STATE_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.districtload = true;
      this.api.getDistrictType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.districtload = false;
            this.districts = res.body.data;
          } else {
            this.districtload = false;
            this.districts = [];
          }
        },
        (err: any) => {
          this.districtload = false;
        }
      );
    } else {
      this.data.district_id = null;
      this.data.pincode_id = null;
    }
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
    this.data.pincode_id = null;
    if ($event) {
      let filter = ' AND DISTRICT_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.pincodeload = true;
      this.api.getPincodeType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.pincodeload = false;
            this.pincodes = res.body.data;
          } else {
            this.pincodeload = false;
            this.pincodes = [];
          }
        },
        (err: any) => {
          this.pincodeload = false;
        }
      );
    } else {
      this.data.pincode_id = null;
    }
  }

  countryData: any = [];

  getCountyData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.countryload = true;
    this.api.getCountryDropdown(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.countryload = false;

          this.countries = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.countries = [];
          this.countryload = false;

          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.countryload = false;
      }
    );
  }
  // getStateList() {
  //   const filter = `AND IS_ACTIVE = 1`;
  //   this.stateload = true;
  //   this.api.getStateType(filter).subscribe(
  //     (response: HttpResponse<any>) => {
  //       // console.log(response);

  //       const statusCode = response.status;
  //       const responseBody = response.body;

  //       if (statusCode === 200 && responseBody?.data) {
  //         this.stateload = false;

  //         this.States = responseBody.data || []; // Ensure fallback to empty array if data is not available
  //       } else {
  //         this.States = [];
  //         this.stateload = false;

  //         // this.message.error('Failed To Get Country Data', '');
  //       }
  //     },
  //     (err: any) => {
  //       this.stateload = false;
  //     }
  //   );
  // }
  // getDistricts() {
  //   const filter = `AND IS_ACTIVE = 1`;
  //   this.districtload = true;
  //   this.api.getDistrictType(filter).subscribe(
  //     (response: HttpResponse<any>) => {
  //       // console.log(response);

  //       const statusCode = response.status;
  //       const responseBody = response.body;

  //       if (statusCode === 200 && responseBody?.data) {
  //         this.districtload = false;
  //         this.districts = responseBody.data || []; // Ensure fallback to empty array if data is not available
  //       } else {
  //         this.districts = [];
  //         this.districtload = false;
  //         // this.message.error('Failed To Get Country Data', '');
  //       }
  //     },
  //     (err: any) => {
  //       this.districtload = false;
  //     }
  //   );
  // }
  // getPinCodes() {
  //   const filter = `AND IS_ACTIVE = 1`;
  //   this.pincodeload = true;
  //   this.api.getPincodeType(filter).subscribe(
  //     (response: HttpResponse<any>) => {
  //       // console.log(response);

  //       const statusCode = response.status;
  //       const responseBody = response.body;

  //       if (statusCode === 200 && responseBody?.data) {
  //         this.pincodeload = false;
  //         this.pincodes = responseBody.data || []; // Ensure fallback to empty array if data is not available
  //       } else {
  //         this.pincodes = [];
  //         this.pincodeload = false;
  //         // this.message.error('Failed To Get Country Data', '');
  //       }
  //     },
  //     (err: any) => {
  //       this.pincodeload = false;
  //     }
  //   );
  // }
  getStateList() {
    var filter = `AND IS_ACTIVE = 1`;
    // this.stateload = true;
    if (this.data.id && this.data.country_id) {
      filter += ' AND COUNTRY_ID=' + this.data.country_id
    }

    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.stateload = false;

          this.States = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.States = [];
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
    var filter = `AND IS_ACTIVE = 1`;
    // this.stateload = true;
    if (this.data.id && this.data.country_id && this.data.state_id) {
      filter += ' AND COUNTRY_ID=' + this.data.country_id + ' AND STATE_ID=' + this.data.state_id
    }
    // this.districtload = true;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.districtload = false;
          this.districts = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.districts = [];
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
    var filter = `AND IS_ACTIVE = 1`;
    // this.pincodeload = true;
    if (this.data.id && this.data.country_id && this.data.state_id && this.data.district_id) {
      filter += ' AND COUNTRY_ID=' + this.data.country_id + ' AND STATE_ID=' + this.data.state_id + ' AND DISTRICT_ID=' + this.data.district_id
    }
    this.api.getPincodeType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          // this.pincodeload = false;
          this.pincodes = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.pincodes = [];
          // this.pincodeload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        // this.pincodeload = false;
      }
    );
  }
  disabledDate = (current: Date): boolean => {
    // Disable future dates
    const today = new Date();
    if (current > today) {
      return true;
    }

    // Disable weekends (Saturday and Sunday)
    // const day = current.getDay();
    // if (day === 0 || day === 6) {
    //   return true; // Disable Sunday (0) and Saturday (6)
    // }

    // You can add more conditions if needed (e.g., disable specific dates)
    return false; // Enable other dates
  };
  roleId = sessionStorage.getItem('roleId');
  decrepteduserIDString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  roleID = parseInt(this.decrepteduserIDString, 10);
  labId = sessionStorage.getItem('labId');
  decreptedlabIDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDString, 10);
  save(addNew: boolean, LabTechnicianPage: NgForm): void {
    this.isOk = true;

    // Validation for required fields
    if (
      !this.data.name?.trim() &&
      !this.data.mobile_no?.trim() &&
      !this.data.address_line_1?.trim() &&
      !this.data.address_line_2?.trim() &&
      !this.data.country_id &&
      !this.data.state_id &&
      !this.data.district_id &&
      !this.data.pincode_id &&
      !this.data.gender &&
      !this.data.dob &&
      !this.data.registration_number?.trim()
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    } else if (!this.data.name || this.data.name?.trim() == '') {
      this.isOk = false;
      this.message.error('Please enter Name.', '');
    } else if (!this.data.mobile_no || this.data.mobile_no?.trim() == '') {
      this.isOk = false;
      this.message.error('Please enter Mobile number.', '');
    } else if (!this.data.mobile_no.match(/^\d{10}$/)) {
      this.isOk = false;
      this.message.error('Please enter a valid 10-digit mobile number.', '');
    } else if (!this.data.gender) {
      this.isOk = false;
      this.message.error('Please select gender.', '');
    } else if (!this.data.dob) {
      this.isOk = false;
      this.message.error('Please select date of birth.', '');
    } else if (!this.data.registration_number?.trim()) {
      this.isOk = false;
      this.message.error('Please enter a registration number.', '');
    } else if (!this.data.experience?.trim()) {
      this.isOk = false;
      this.message.error('Please enter Experience.', '');
    } else if (!this.data.address_line_1?.trim()) {
      this.isOk = false;
      this.message.error('Please enter Address Line 1.', '');
    } else if (!this.data.country_id) {
      this.isOk = false;
      this.message.error('Please select a country.', '');
    } else if (!this.data.state_id) {
      this.isOk = false;
      this.message.error('Please select a state.', '');
    } else if (!this.data.district_id) {
      this.isOk = false;
      this.message.error('Please select a district.', '');
    } else if (!this.data.pincode_id) {
      this.isOk = false;
      this.message.error('Please select a valid pincode.', '');
    } else {
      // If all validations pass
      this.isOk = true;
      this.isSpinning = true;
      let rawData = sessionStorage.getItem('userId');
      this.data.user_id = rawData
        ? this.commonFunction.decryptdata(rawData)
        : null;
      this.data.dob = this.datePipe.transform(this.data.dob, 'yyyy-MM-dd');
      if (this.data.id) {
        if (this.roleID == 3) {
          this.data.id = this.data['technician_id'];
        }
        // Update logic
        this.api.updateLabTechnician(this.data).subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              this.message.success('Information updated successfully.', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Information not updated.', '');
            }
            this.isSpinning = false;
          },
          (error) => {
            this.message.error('Failed to update information.', '');
            this.isSpinning = false;
          }
        );
      } else {
        // Create logic
        if (this.roleID !== 3) {
          this.api.createLabTechnicians(this.data).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                this.message.success('Information saved successfully.', '');
                this.isSpinning = false;

                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.resetDrawer(LabTechnicianPage);
                  this.data = new LabTechnician();
                }
              } else {
                this.message.error('Information not saved.', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Failed to save information.', '');
              this.isSpinning = false;
            }
          );
        }
        else {
          this.data['lab_id'] = this.labID
          this.api.createLabTechniciansLab(this.data).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                this.message.success('Information saved successfully.', '');
                this.isSpinning = false;

                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.resetDrawer(LabTechnicianPage);
                  this.data = new LabTechnician();
                }
              } else {
                this.message.error('Information not saved.', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Failed to save information.', '');
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  // stateSeq(): void {
  //   this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(
  //     (data) => {
  //       if (data['count'] == 0) {
  //         this.data.SEQ_NO = 1;
  //       } else {
  //         this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
  //         this.data.IS_ACTIVE = true;
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  resetDrawer(LabTechnicianPage: NgForm) {
    this.data = new LabTechnician();
    LabTechnicianPage.form.markAsPristine();
    LabTechnicianPage.form.markAsUntouched();
    // this.stateSeq();
  }
}
