import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HospitalBillCatalogue } from '../../../Models/Hospitalbillcatalogue';

@Component({
  selector: 'app-hospital-bill-catalogue-master-form',
  templateUrl: './hospital-bill-catalogue-master-form.component.html',
  styleUrls: ['./hospital-bill-catalogue-master-form.component.css']
})
export class HospitalBillCatalogueMasterFormComponent {
 @Input()
  drawerClose!: Function;
  @Input()
  data: HospitalBillCatalogue = new HospitalBillCatalogue();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HospitalBillCatalogue[] = [];
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

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // this.getCountyData();
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

  save(addNew: boolean, HospitalBillCataloguePage: NgForm): void {
    this.isOk = true;

    // Validation for required fields
    // if (
    //   !this.data.NAME?.trim() &&
    //   !this.data.MOBILE_NO?.trim() &&
    //   !this.data.ADDRESS_LINE_1?.trim() &&
    //   !this.data.ADDRESS_LINE_2?.trim() &&
    //   !this.data.COUNTRY_ID &&
    //   !this.data.STATE_ID &&
    //   !this.data.DISTRICT_ID &&
    //   !this.data.PINCODE_ID &&
    //   !this.data.GENDER &&
    //   !this.data.DOB &&
    //   !this.data.REGISTRATION_NUMBER?.trim()
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please fill all the required fields.', '');
    // } else if (!this.data.NAME || this.data.NAME?.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please enter Name.', '');
    // } else if (!this.data.MOBILE_NO || this.data.MOBILE_NO?.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please enter Mobile number.', '');
    // } else if (!this.data.MOBILE_NO.match(/^\d{10}$/)) {
    //   this.isOk = false;
    //   this.message.error('Please enter a valid 10-digit mobile number.', '');
    // } else if (!this.data.GENDER) {
    //   this.isOk = false;
    //   this.message.error('Please select gender.', '');
    // } else if (!this.data.DOB) {
    //   this.isOk = false;
    //   this.message.error('Please select date of birth.', '');
    // } else if (!this.data.REGISTRATION_NUMBER?.trim()) {
    //   this.isOk = false;
    //   this.message.error('Please enter a registration number.', '');
    // } else if (!this.data.ADDRESS_LINE_1?.trim()) {
    //   this.isOk = false;
    //   this.message.error('Please enter Address Line 1.', '');
    // } else if (!this.data.COUNTRY_ID) {
    //   this.isOk = false;
    //   this.message.error('Please select a country.', '');
    // } else if (!this.data.STATE_ID) {
    //   this.isOk = false;
    //   this.message.error('Please select a state.', '');
    // } else if (!this.data.DISTRICT_ID) {
    //   this.isOk = false;
    //   this.message.error('Please select a district.', '');
    // } else if (!this.data.PINCODE_ID) {
    //   this.isOk = false;
    //   this.message.error('Please select a valid pincode.', '');
    // } else {
    //   // If all validations pass
    //   this.isOk = true;
    //   this.isSpinning = true;

    //   if (this.data.ID) {
    //     // Update logic
    //     // this.api.updateState(this.data).subscribe((successCode) => {
    //     //   if (successCode.code === '200') {
    //     //     this.message.success('Information updated successfully.', '');
    //     //     if (!addNew) this.drawerClose();
    //     //     this.isSpinning = false;
    //     //   } else {
    //     //     this.message.error('Information not updated.', '');
    //     //     this.isSpinning = false;
    //     //   }
    //     // });
    //   } else {
    //     // Create logic
    //     // this.api.createState(this.data).subscribe((successCode) => {
    //     //   if (successCode.code === '200') {
    //     //     this.message.success('Information saved successfully.', '');
    //     //     this.isSpinning = false;
    //     //     if (!addNew) this.drawerClose();
    //     //     else {
    //     //       this.resetDrawer(HospitalBillCataloguePage);
    //     //       this.data = new HospitalBillCatalogue();
    //     //     }
    //     //   } else {
    //     //     this.message.error('Information not saved.', '');
    //     //     this.isSpinning = false;
    //     //   }
    //     // });
    //   }
    // }
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

  resetDrawer(HospitalBillCataloguePage: NgForm) {
    this.data = new HospitalBillCatalogue();
    HospitalBillCataloguePage.form.markAsPristine();
    HospitalBillCataloguePage.form.markAsUntouched();
    // this.stateSeq();
  }
}
