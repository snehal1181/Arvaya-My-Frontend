import { Component, Input, SimpleChanges } from '@angular/core';
import { DistrictMaster } from '../../../Models/DistrictMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { log } from 'console';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-addDistrict',
  templateUrl: './addDistrict.component.html',
  styleUrls: ['./addDistrict.component.css'],
})
export class AddDistrictComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: DistrictMaster = new DistrictMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: DistrictMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  loadcountries: boolean = false;
  loadstates: boolean = false;
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getCountyData();
    this.checkDistrict();
  }

  close(): void {
    this.drawerClose();
  }

  countryData: any = [];
  getCountyData() {
    this.loadcountries = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      console.log(response);

      const statusCode = response.status;
      const responseBody = response.body;

      if (statusCode === 200 && responseBody?.data) {
        this.countryData = responseBody.data || [];
      } else {
        this.countryData = [];
        this.message.error('Failed To Get Country Data', '');
      }
      this.loadcountries = false;
    });
  }

  @Input() stateData: any = [];
  getStateData(value: number) {
    // console.log(value,'sdgh');

    this.loadstates = true;

    if (this.data.state_id != '') {
      this.data.state_id = '';
    }

    // Check if value is provided before making API call
    if (value) {
      const filter = `AND IS_ACTIVE = 1 AND COUNTRY_ID = ${value}`;
      this.api.getStateType(filter).subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.stateData = responseBody.data || [];
        } else {
          this.stateData = [];
          this.message.error('Failed To Get State Data', '');
        }
        this.loadstates = false;
      });
    } else {
      // If no value, reset state data
      this.data.state_id = undefined;
      this.stateData = [];
      this.loadstates = false;
    }
  }

  DistrictList = [];

  checkDistrict() {
    const filter = ``;

    this.api
      .getDistrictType(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        // console.log(response);

        if (statusCode === 200 && responseBody?.count >= 0) {
          this.DistrictList = responseBody.data;
          // console.log(this.DistrictList);
        } else {
          this.DistrictList = [];
        }
      });
  }

  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.country_id == undefined || this.data.country_id == null) &&
      (this.data.state_id == undefined || this.data.state_id == null) &&
      (this.data.name == undefined ||
        this.data.name == '' ||
        this.data.name.trim() == '')
      // && (this.data.SHORT_CODE == undefined || this.data.SHORT_CODE == "" || this.data.SHORT_CODE.trim() == "")
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.country_id == undefined ||
      this.data.country_id == null ||
      this.data.country_id <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.state_id == undefined ||
      this.data.state_id == null ||
      this.data.state_id <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == '' ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter District Name', '');
    } else if (
      this.DistrictList.some((data) => (data['name'] as string).toLowerCase() === this.data.name.toLowerCase()) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('District Name Already Exists', '');
    } else if (
      this.data.seq_no == null ||
      this.data.seq_no == undefined ||
      this.data.seq_no == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.id) {
        // Update District Data
        this.api.updateDistrict(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'District Information Updated Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('District Information Not Updated', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error(
              'An error occurred while updating District Information.',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        // Create District Data
        this.api.createDistrict(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'District Information Saved Successfully',
                ''
              );
              this.districtSeq();

              if (!addNew) {
                this.drawerClose();
              } else {
                this.resetDrawer(CityMasterPage);
                this.data = new DistrictMaster();
              }
            } else {
              this.message.error('District Information Not Saved', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error(
              'An error occurred while saving District Information.',
              ''
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }

  districtSeq(): void {
    this.api
      .getDistrict(1, 1, 'seq_no', 'desc', '')
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          if (responseBody.count === 0) {
            this.data.seq_no = 1;
          } else {
            this.data.seq_no = Number(responseBody.data[0]?.seq_no || 0) + 1; // Fallback to 0 if SEQ_NO is missing
            this.data.is_active = 1;
          }
        } else {
          this.data.seq_no = 1; // Default fallback if response is invalid
          this.data.is_active = 0; // Explicitly set inactive in case of failure
        }
      });
  }

  resetDrawer(CityMasterPage: NgForm) {
    this.data = new DistrictMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
  }
}
