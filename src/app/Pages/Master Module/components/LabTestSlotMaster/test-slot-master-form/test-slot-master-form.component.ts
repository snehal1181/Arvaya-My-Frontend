import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabTestSlot } from '../../../Models/LabTestSlot';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-test-slot-master-form',
  templateUrl: './test-slot-master-form.component.html',
  styleUrls: ['./test-slot-master-form.component.css']
})
export class TestSlotMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: LabTestSlot = new LabTestSlot();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabTestSlot[] = [];
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
  catalogs: any;
  appointments: any;
  paymentStatuses: any;
  categoryOptions: any;
  activeStatusOptions: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
     private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    // this.getCountyData();
    this.data.DATE=this.datePipe.transform(new Date(), "yyyy-MM-dd");
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

  save(addNew: boolean, TestMasterPage: NgForm): void {
    this.isOk = true;

    // Validation for required fields
    if (
      !this.data.DATE &&
      !this.data.START &&
      !this.data.END &&
      !this.data.BLOCKED_REASON
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    }  else if (this.data.DATE == undefined || this.data.DATE == null) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    } else if (this.data.START == undefined || this.data.START == null) {
      this.isOk = false;
      this.message.error('Please Select Start Time', '');
    }
    else if (this.data.END == undefined || this.data.END == null) {
      this.isOk = false;
      this.message.error('Please Select End Time', '');
    }
    // else if (!this.data.BLOCKED_REASON?.trim()) {
    //   this.isOk = false;
    //   this.message.error('Please enter Bloacked Reason', '');
    // } 
    if(this.data.IS_BLOCKED == false){
      this.data.BLOCKED_REASON=""
    }
    else {
      this.data.START = this.datePipe.transform(this.data.START, "HH:mm:00")
      this.data.END = this.datePipe.transform(this.data.END, "HH:mm:00")

     
      // If all validations pass
      this.isOk = true;
      this.isSpinning = true;
  // this.data.SESSION_ID=1
     if (this.data.ID) {
              this.api.updateLabSlot(this.data).subscribe(
               
                (response: HttpResponse<any>) => {
                  const statusCode = response.status;
                  if (statusCode === 200) {
                    this.message.success('Lab Slot Test Data Updated Successfully', '');
                    if (!addNew) this.drawerClose();
                    this.isSpinning = false;
                  }
                  else {
                    this.message.error('Lab Slot Test DataUpdation Failed', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.api.createLabSlot(this.data).subscribe(
              
    
                (response: HttpResponse<any>) => {
                  const statusCode = response.status;
                  if (statusCode === 200) {
                    this.message.success("Lab Slot Test Data Created Successfully", "");
    
                    this.isSpinning = false;
                    if (!addNew) {
                      this.drawerClose();
                    } else {
                      this.data = new LabTestSlot();
                      this.resetDrawer(TestMasterPage);
                    
                    }
                    this.isSpinning = false;
                  } else {
                    this.message.error('Lab Slot Test Data Creation Failed..."', '');
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

  resetDrawer(TestMasterPage: NgForm) {
    this.data = new LabTestSlot();
    TestMasterPage.form.markAsPristine();
    TestMasterPage.form.markAsUntouched();
    // this.stateSeq();
  }
}
