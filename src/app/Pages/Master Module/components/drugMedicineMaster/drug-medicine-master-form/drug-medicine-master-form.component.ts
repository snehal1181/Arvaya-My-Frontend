import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { drugMedicine } from '../../../Models/drugMedicine';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-drug-medicine-master-form',
  templateUrl: './drug-medicine-master-form.component.html',
  styleUrls: ['./drug-medicine-master-form.component.css']
})
export class DrugMedicineMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: drugMedicine = new drugMedicine();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: drugMedicine[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  public commonFunction = new CommonFunctionService();

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  strengthUnitList: any;
  typeIdList: any;
  hospitalIdList: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
  ) { }

  ngOnInit(): void {
    //   this.getCountyData();// Replace with a valid default country ID
    //   if(this.data.COUNTRY_ID){
    // this.getStateData(this.data.COUNTRY_ID);}
    this.getHospitalData()
    this.getMedicineType()
  }
  // For Accepting Only Alphabits/ Character


  entityData: any = [];
  getHospitalData() {
    const filter = `AND is_active = 1`;
    this.api.getHospitalList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.entityData = data.body['data'];
        } else {
          this.entityData = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );

  }

  getMedicineType() {
    const filter = `AND is_active = 1`;
    this.api.MedicineTypeList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.typeIdList = data.body['data'];
        } else {
          this.typeIdList = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );

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

  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, "", "", "AND is_active = 1").subscribe(
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
    this.api.getState(0, 0, "", "", "AND is_active = 1 AND country_id = " + value).subscribe(
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

    // Validation for required fields
    if (
      !this.data.name &&
      !this.data.strength &&
      !this.data.instructions?.trim() &&
      !this.data.strength_unit &&
      !this.data.hospital_id && !this.data.type_id &&
      !this.data.dosage
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    }
    else if (!this.data.hospital_id) {
      this.isOk = false;
      this.message.error('Please select Hospital.', '');
    }
    else if (!this.data.type_id) {
      this.isOk = false;
      this.message.error('Please select Medicine Type.', '');
    } else if (!this.data.name || this.data.name.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Name.', '');
    } else if (!this.data.strength || this.data.strength?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Strength.', '');
    }
    else if (!this.data.strength_unit || this.data.strength_unit?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Strength Unit.', '');
    }
    else if (!this.data.dosage || this.data.dosage?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Dosage.', '');
    } else if (!this.data.instructions || this.data.instructions?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Instruction.', '');
    } else if (!this.data.seq_no) {
      this.isOk = false;
      this.message.error('Please enter Sequence Number.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateMedicineMaster(this.data)
            .subscribe(


              (response: HttpResponse<any>) => {
                const statusCode = response.status;
                if (statusCode === 200) {
                  this.message.success('Medicine Data Updated Successfully', '');
                  if (!addNew) this.drawerClose();
                  this.isSpinning = false;
                }
                else {
                  this.message.error('Medicine Data Updation Failed', '');
                  this.isSpinning = false;
                }
              });

        } else {
          this.api.createMedicineMaster(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success("Medicine Data Created Successfully", "");


                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new drugMedicine();
                  this.resetDrawer(MedicineTypeMasterPage);
                  this.api.getMedicineMaster(1, 1, '', 'desc', '').subscribe(
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
                this.message.error('Medicine Data Creation Failed..."', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            })
            ;
        }
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
    this.data = new drugMedicine();
    MedicineTypeMasterPage.form.markAsPristine();
    MedicineTypeMasterPage.form.markAsUntouched();
    this.citySeq()
  }



}
