import { Component, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { TaxCatlog } from '../../../Models/ManageTax';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-manage',
  templateUrl: './add-manage.component.html',
  styleUrls: ['./add-manage.component.css'],
})
export class AddManageComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: TaxCatlog = new TaxCatlog();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: TaxCatlog[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  radiovalue: any = 'L';
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    // this.getHospitalData(); // Replace with a valid default country ID
    this.getLabData();
    if (this.data.id) {
      if (this.data.lab_id === null && this.data.hospital_id === null) {
        this.radiovalue = 'A'; // All
      } else if (this.data.hospital_id) {
        this.radiovalue = 'H'; // Hospital
      } else if (this.data.lab_id) {
        this.radiovalue = 'L'; // Lab
      }
    }
  }
  // For Accepting Only Alphabits/ Character
  ontypeChange(d: any) {
    if (d === 'H') {
      this.data.lab_id = null;
      this.data.hospital_id = 0;
    } else if (d === 'L') {
      this.data.lab_id = 0;
      this.data.hospital_id = null;
    } else if (d === 'A') {
      this.data.lab_id = null;
      this.data.hospital_id = null;
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
  onlynumdott1(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    // Get the current input value
    const input = (event.target as HTMLInputElement).value;

    // Allow digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      // If input exceeds 3 characters, prevent further input
      if (input.length >= 3) {
        return false;
      }

      // Allow input if resulting value is between 1 and 100
      const newValue = parseInt(input + String.fromCharCode(charCode), 10);
      if (newValue >= 1 && newValue <= 100) {
        return true;
      } else {
        return false;
      }
    }

    // Allow one dot (but dots are irrelevant for integers between 1 and 100)
    if (charCode === 46) {
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallow other characters
  }

  onTaxTypeChange(taxType: string): void {
    if (taxType === 'PA' && this.data.value > 100) {
      this.data.value = 100; // Reset value to 100 if it exceeds the limit
    }
  }

  // Handle Value Change
  onValueChange(): void {
    if (this.data.tax_type === 'PA' && this.data.value > 100) {
      this.data.value = 100; // Enforce maximum value
    }
  }
  entityData: any = [];
  getHospitalData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getHospitalList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.entityData = data.body['data'];
        } else {
          this.entityData = [];
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  labData: any[] = [];
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
    var extrafilter = '';
    if (this.labID && this.decreptedroleId !== 1) {
      extrafilter = ' AND ID=' + this.labID;
    }

    const filter = `AND IS_ACTIVE = 1` + extrafilter;
    this.api.getLabList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.labData = data.body['data'];
        } else {
          this.labData = [];
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  save(addNew: boolean, TaxCatlogPage: NgForm): void {

    console.log(this.data, this.radiovalue);

    this.isOk = true;
    if (
      (this.data.hospital_id == undefined || this.data.hospital_id == null) &&
      (this.data.tax_name == undefined || this.data.tax_name == '') &&
      (this.data.lab_id == undefined || this.data.lab_id == null) &&
      (this.data.tax_type == undefined || this.data.tax_type == '') &&
      (this.data.value == undefined || this.data.value == null)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    }


    else if (this.radiovalue == 'H') {
      if (this.data.hospital_id == undefined || this.data.hospital_id == null || this.data.hospital_id == 0) {
        this.isOk = false;
        this.message.error('Please Select Hospital', '');
      }
    } else if (this.radiovalue == 'L') {
      if (this.data.lab_id == undefined || this.data.lab_id == null || this.data.lab_id == 0) {
        this.isOk = false;
        this.message.error('Please Select Lab', '');
      }
    }


    else if (
      this.data.tax_name == undefined ||
      this.data.tax_name == '' ||
      this.data.tax_name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Tax Name', '');
    } else if (this.data.tax_type == undefined || this.data.tax_type == null) {
      this.isOk = false;
      this.message.error('Please Select Tax Type', '');
    } else if (this.data.value == null || this.data.value == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Value', '');
    }

    if (this.data.hospital_id != null) {
      this.data.lab_id = null
    }
    else if (this.data.lab_id != null) {
      this.data.hospital_id = null
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api.updateTaxCatlog(this.data).subscribe(
            // if (successCode.code == '200') {
            //   this.message.success('Information Updated Successfully', '');
            //   if (!addNew) this.drawerClose();
            //   this.isSpinning = false;
            // } else {
            //   this.message.error('Information Not Updated', '');
            //   this.isSpinning = false;
            // }
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            }
          );
        } else {
          this.api.createTaxCatlog(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                this.isSpinning = false;

                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.resetDrawer(TaxCatlogPage);
                  this.data = new TaxCatlog();
                }
              } else {
                this.message.error('Information Not Saved', '');
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
  }

  resetDrawer(TaxCatlogPage: NgForm) {
    this.data = new TaxCatlog();
    TaxCatlogPage.form.markAsPristine();
    TaxCatlogPage.form.markAsUntouched();
  }
}
