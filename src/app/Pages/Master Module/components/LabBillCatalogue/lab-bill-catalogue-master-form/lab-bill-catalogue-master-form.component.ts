import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { LabbillCatalogue } from '../../../Models/Labbillcatalogue';
// import { HttpResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lab-bill-catalogue-master-form',
  templateUrl: './lab-bill-catalogue-master-form.component.html',
  styleUrls: ['./lab-bill-catalogue-master-form.component.css'],
})
export class LabBillCatalogueMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: LabbillCatalogue = new LabbillCatalogue();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabbillCatalogue[] = [];
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
  labs: any = [];
  // modes: any;
  types: any;
  packages: any = [];
  tests: any;
  taxes: any;
  radiovalue: any = 'T';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getDropdowns();
    if (this.data.ID) {
      this.radiovalue = this.data.PACKAGE_ID ? 'P' : 'T';
    }
  }
  ontypeChange(d: any) {
    if (d == 'T') {
      this.data.PACKAGE_ID = null;
    } else {
      this.data.TEST_ID = null;
    }
  }
  contactpattern = /^[0-9\-]$/;
 onTaxChange(taxId: number): void {
  const selectedTax = this.taxes.find((tax) => tax.ID === taxId);
  if (selectedTax && this.data.BILL_AMOUNT) {
    const billAmount = parseFloat(this.data.BILL_AMOUNT);
    let totalPrice = billAmount;

    if (selectedTax.TAX_TYPE === 'PA') {
      const taxPercent = parseFloat(selectedTax.VALUE);
      const gstAmount = (billAmount * taxPercent) / 100;
      totalPrice += gstAmount;
    } else {
      const taxValue = parseFloat(selectedTax.VALUE);
      totalPrice += taxValue;
    }

    this.data.TOTAL_PRICE = totalPrice.toFixed(2);
  } else {
    this.data.TOTAL_PRICE = null;
  }
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
  labloading = false;
  packageloading = false;
  appointmenttypeloading = false;
  testloading = false;
  taxloading = false;
  onLabChange(data) {
    let filter = ' AND IS_ACTIVE=1 AND LAB_ID= ' + data;
    this.api.getLabPackageList(filter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.packages = res.body.data;
          this.packageloading = false;
        } else {
          this.packages = [];
          this.packageloading = false;
        }
      },
      (err) => {
        this.packages = [];
        this.packageloading = false;
      }
    );
  }
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
  getDropdowns() {
    var extraFilter = '';
    var extraFilter2 = '';
    if (this.labID && this.decreptedroleId!==1) {
      extraFilter = ' AND ID=' + this.labID;
      extraFilter2 = ' AND LAB_ID=' + this.labID;
    }
    let filter = ' AND IS_ACTIVE=1';
    this.labloading = true;
    this.packageloading = true;
    this.api.getLablist(filter + extraFilter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.labs = res.body.data;
          this.labloading = false;
        } else {
          this.labs = [];
          this.labloading = false;
        }
      },
      (err) => {
        this.labs = [];
        this.labloading = false;
      }
    );
    this.api.getLabPackageList(filter + extraFilter2).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.packages = res.body.data;
          this.packageloading = false;
        } else {
          this.packages = [];
          this.packageloading = false;
        }
      },
      (err) => {
        this.packages = [];
        this.packageloading = false;
      }
    );
    this.api.getAppointmentTypeList(filter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.types = res.body.data;
          this.appointmenttypeloading = false;
        } else {
          this.types = [];
          this.appointmenttypeloading = false;
        }
      },
      (err) => {
        this.types = [];
        this.appointmenttypeloading = false;
      }
    );
    this.api.getTestList(filter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.tests = res.body.data;
          this.testloading = false;
        } else {
          this.tests = [];
          this.testloading = false;
        }
      },
      (err) => {
        this.tests = [];
        this.testloading = false;
      }
    );
    let filter2 = ' AND IS_ACTIVE=1';
    this.api.getTaxList(filter2 + extraFilter2).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.taxes = res.body.data;
          this.taxloading = false;
        } else {
          this.taxes = [];
          this.taxloading = false;
        }
      },
      (err) => {
        this.taxes = [];
        this.taxloading = false;
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

  save(addNew: boolean, LabbillCataloguePage: NgForm): void {
    this.isOk = true;

    if (
      !this.data.LAB_ID &&
      !this.data.TEST_ID &&
      this.radiovalue == 'T' &&
      !this.data.PACKAGE_ID &&
      this.radiovalue == 'P' &&
      !this.data.MODE &&
      !this.data.BILL_AMOUNT &&
      !this.data.TAX_ID &&
      !this.data.TOTAL_PRICE
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    }
    if (!this.data.LAB_ID) {
      this.isOk = false;
      this.message.error('Please select a valid Lab.', '');
      return;
    }

    if (this.radiovalue === 'T' && !this.data.TEST_ID) {
      this.isOk = false;
      this.message.error('Please select a valid Test.', '');
      return;
    }

    if (this.radiovalue === 'P' && !this.data.PACKAGE_ID) {
      this.isOk = false;
      this.message.error('Please select a valid Package.', '');
      return;
    }

    // if (!this.data.TYPE) {
    //   this.isOk = false;
    //   this.message.error('Please specify the Type.', '');
    //   return;
    // }

    if (!this.data.MODE) {
      this.isOk = false;
      this.message.error('Please specify the Mode.', '');
      return;
    }

    if (!this.data.BILL_AMOUNT || this.data.BILL_AMOUNT == '0') {
      this.isOk = false;
      this.message.error('Please enter the Bill Amount.', '');
      return;
    }

    if (!this.data.TAX_ID) {
      this.isOk = false;
      this.message.error('Please select a Tax.', '');
      return;
    }

    if (!this.data.TOTAL_PRICE || this.data.TOTAL_PRICE == '0') {
      this.isOk = false;
      this.message.error('Please calculate the Total Price.', '');
      return;
    } else {
      // If all validations pass
      this.isOk = true;
      this.isSpinning = true;

      if (this.data.ID) {
        // Update logic
        this.api.updateLabBillCatalogue(this.data).subscribe(
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
        this.api.createLabBillCatalogue(this.data).subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              this.message.success('Information saved successfully.', '');
              this.isSpinning = false;

              if (!addNew) {
                this.drawerClose();
              } else {
                this.resetDrawer(LabbillCataloguePage);
                this.data = new LabbillCatalogue();
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

  resetDrawer(LabbillCataloguePage: NgForm) {
    this.data = new LabbillCatalogue();
    LabbillCataloguePage.form.markAsPristine();
    LabbillCataloguePage.form.markAsUntouched();
    // this.stateSeq();
  }
}
