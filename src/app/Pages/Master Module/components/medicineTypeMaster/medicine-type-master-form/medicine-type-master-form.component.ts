import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpResponse } from '@angular/common/http';
import { MedicineTypeMaster } from '../../../Models/MedicineType';
@Component({
  selector: 'app-medicine-type-master-form',
  templateUrl: './medicine-type-master-form.component.html',
  styleUrls: ['./medicine-type-master-form.component.css']
})
export class MedicineTypeMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: MedicineTypeMaster = new MedicineTypeMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: MedicineTypeMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
  ) { }

  ngOnInit(): void {
    //   this.getCountyData();// Replace with a valid default country ID
    //   if(this.data.COUNTRY_ID){
    // this.getStateData(this.data.COUNTRY_ID);}
  }
  // For Accepting Only Alphabits/ Character

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

  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.countryData = data["data"];
        } else {
          this.countryData = [];
          this.message.error("Failed To Get Country Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }

  stateData: any = [];
  getStateData(value) {
    this.api.getState(0, 0, "", "", "AND IS_ACTIVE = 1 AND COUNTRY_ID = " + value).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.stateData = data["data"];
        } else {
          this.stateData = [];
          this.message.error("Failed To Get State Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }

  save(addNew: boolean, MedicineTypeMasterPage: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.data.name == '' ||
        this.data.name == null ||
        this.data.name == undefined)

    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Document Type', '');
    }

    else if (
      this.data.seq_no == null ||
      this.data.seq_no == undefined

    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.id) {
        this.api.updateMedicineType(this.data).subscribe(

          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success('Medicine Type Data Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            }
            else {
              this.message.error('Medicine Type Updation Failed', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api.createMedicineType(this.data).subscribe(

          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            if (statusCode === 200) {
              this.message.success("Medicine Type Data Created Successfully", "");

              this.isSpinning = false;
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new MedicineTypeMaster();
                this.resetDrawer(MedicineTypeMasterPage);
                this.api.getMedicineType(1, 1, '', 'desc', '').subscribe(
                  (response: HttpResponse<any>) => {
                    const statusCode = response.status;
                    if (statusCode === 200) {
                      if (response.body.count == 0) {
                        this.data.seq_no = 1;
                      }
                      else {
                        this.data.seq_no = response.body.data[0].seq_no + 1;
                      }

                    } else {

                      this.message.error(`Something went wrong.`, '');

                    }
                  },
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error('Medicine Type Data Creation Failed..."', '');
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

  citySeq(): void {
    // this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.data.SEQ_NO = 1;
    //   } else {
    //     this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //     this.data.IS_ACTIVE = true;
    //   }
    // }, err => {
    //   console.log(err);
    // })
  }

  resetDrawer(MedicineTypeMasterPage: NgForm) {
    this.data = new MedicineTypeMaster();
    MedicineTypeMasterPage.form.markAsPristine();
    MedicineTypeMasterPage.form.markAsUntouched();
    this.citySeq()
  }
}
