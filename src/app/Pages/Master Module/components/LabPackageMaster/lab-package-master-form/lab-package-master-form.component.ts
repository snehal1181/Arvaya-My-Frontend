import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabPackage } from '../../../Models/LabPackage';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lab-package-master-form',
  templateUrl: './lab-package-master-form.component.html',
  styleUrls: ['./lab-package-master-form.component.css'],
})
export class LabPackageMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: LabPackage = new LabPackage();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabPackage[] = [];
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
  categories: any;
  categoryIdOptions;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getLabData();
    this.getTestData();
  }
  adminId: any;
  getTestData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getTestCategoryList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.categories = data.body['data'];
        } else {
          this.categories = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  contactpattern = /^[0-9\-]$/;
  getLabData() {
    let filter = `AND IS_ACTIVE = 1`;

    let rawData = sessionStorage.getItem('labId');
    let userId = rawData ? this.commonFunction.decryptdata(rawData) : null;
    let rawData2 = sessionStorage.getItem('roleId');
    this.adminId = rawData2 ? this.commonFunction.decryptdata(rawData2) : null;
    if (this.adminId && this.adminId != '1') {
      filter += ' AND ID=' + userId;
    }
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
      !this.data.package_name?.trim() &&
      !this.data.duration?.trim() &&
      !this.data.description?.trim() &&
      !this.data.instructions?.trim() &&
      !this.data.lab_id &&
      !this.data.category_id &&
      !this.data.seq_no
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    } else if (
      !this.data.package_name ||
      this.data.package_name?.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter Package Name.', '');
    } else if (!this.data.duration || this.data.duration?.trim() == '') {
      this.isOk = false;
      this.message.error('Please enter Duration.', '');
    } else if (!this.data.description || this.data.description?.trim() == '') {
      this.isOk = false;
      this.message.error('Please enter Description.', '');
    } else if (
      !this.data.instructions ||
      this.data.instructions?.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please enter Instruction.', '');
    } else if (!this.data.lab_id) {
      this.isOk = false;
      this.message.error('Please select a Lab.', '');
    } else if (!this.data.category_id) {
      this.isOk = false;
      this.message.error('Please select a Category.', '');
    } else if (!this.data.seq_no) {
      this.isOk = false;
      this.message.error('Please enter Sequence Number.', '');
    } else {
      // If all validations pass
      this.isOk = true;
      this.isSpinning = true;

      if (this.data.id) {
        // Update logic
        this.api.updateLabPackage(this.data).subscribe(
          //   (successCode) => {
          //   if (successCode.code === '200') {
          //     this.message.success('Information updated successfully.', '');
          //     if (!addNew) this.drawerClose();
          //     this.isSpinning = false;
          //   } else {
          //     this.message.error('Information not updated.', '');
          //     this.isSpinning = false;
          //   }
          // });
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success('Lab Package Data Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Lab Package Data Updation Failed', '');
              this.isSpinning = false;
            }
          }
        );
      } else {
        // Create logic
        this.api.createLabPackage(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success('Document Type Created Successfully', '');

              this.isSpinning = false;
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new LabPackage();
                this.resetDrawer(TestMasterPage);
                this.api
                  .getLabPackage(1, 1, '', 'desc', '')
                  .subscribe((response: HttpResponse<any>) => {
                    const statusCode = response.status;
                    if (statusCode === 200) {
                      if (response.body.count == 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no = response.body.data[0].seq_no + 1;
                      }
                    } else {
                      this.message.error(`Something went wrong.`, '');
                    }
                  });
              }
              this.isSpinning = false;
            } else {
              this.message.error('Document Type Creation Failed..."', '');
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
    this.data = new LabPackage();
    TestMasterPage.form.markAsPristine();
    TestMasterPage.form.markAsUntouched();
    // this.stateSeq();
  }
}
