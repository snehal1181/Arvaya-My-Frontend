import { Component, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HospitalBillMaster } from '../../../Models/HospitalBillMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-addhospitalbill',
  templateUrl: './addhospitalbill.component.html',
  styleUrls: ['./addhospitalbill.component.css']
})
export class AddhospitalbillComponent {

  @Input()
  drawerClose!: Function;
  @Input()
  data: HospitalBillMaster = new HospitalBillMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HospitalBillMaster[] = [];
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
  labs: any;
  modes: any;
  types: any;
  packages: any;
  tests: any;
  taxes: any;
  hospitals: any;
  doctors: any;
  consultationModes: any;
  consultationTypes: any;

  paymentStatuses: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getAppointment();
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
    // throw new Error('Method not implemented.');
  }
  onStateChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
  }


  disabledDate = (current: Date): boolean => {
    // Disable future dates
    const today = new Date();
    if (current > today) {
      return true;
    }

    return false; // Enable other dates
  };


  catalogs:any =[]

  getcatalogs(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAppointmentDropdown(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.catalogs = response.body.data;
          } else {
            this.catalogs = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }

  appointments: any = []
  getAppointment(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAppointmentDropdown(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.appointments = response.body.data;
          } else {
            this.appointments = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }

  save(addNew: boolean, HospitalBillMasterPage: NgForm): void {
    this.isOk = true;

    if (this.data.CATALOG_ID == undefined || this.data.CATALOG_ID == null) {
      this.isOk = false;
      this.message.error('Please  Select Catalog', '');
    } else
      if (this.data.APPOINTMENT_ID == undefined || this.data.APPOINTMENT_ID == null) {
        this.isOk = false;
        this.message.error('Please  Select Appointment', '');

      }
      else if (this.data.PAYMENT_INFO == undefined || this.data.PAYMENT_INFO == null || this.data.PAYMENT_INFO.trim() == "") {
        this.isOk = false;
        this.message.error('Please Enter 	Payment Info', '');
      }
      else if (this.data.PAYMENT_STATUS == undefined || this.data.PAYMENT_STATUS == null) {
        this.isOk = false;
        this.message.error('Please Enter 	Payment Info', '');
      }
      else if (this.data.PAYMENT_DATE == undefined || this.data.PAYMENT_DATE == null) {
        this.isOk = false;
        this.message.error('Please  Select Payment Date', '');
      }
    if (this.isOk) {
      this.isSpinning = true;
      this.data.CATALOG_ID = 'asasa'
      {
        if (this.data.ID) {
          this.api
            .updateHospitalBill(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createHospitalBill(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new HospitalBillMaster();
                  this.resetDrawer(HospitalBillMasterPage);
                  this.api.getHospitalBill(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      if (data['count'] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                      }
                    },
                    () => { }
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Saved...', '');
                this.isSpinning = false;
              }
            });
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

  resetDrawer(HospitalBillMasterPage: NgForm) {
    this.data = new HospitalBillMaster();
    HospitalBillMasterPage.form.markAsPristine();
    HospitalBillMasterPage.form.markAsUntouched();
    // this.stateSeq();
  }

}
