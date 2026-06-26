import { Component, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { PrescriptionMaster } from '../../../Models/Prescription';
import { DatePipe } from "@angular/common";
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: PrescriptionMaster = new PrescriptionMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: PrescriptionMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  public commonFunction = new CommonFunctionService();

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getCountyData();// Replace with a valid default country ID
   this.data.DATE=this.datePipe.transform(new Date(), "yyyy-MM-dd");
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
    this.api.getAllDrugMaster(0, 0, "", "", "AND IS_ACTIVE = 1").subscribe(
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
    // this.api.getState(0, 0, "", "", "AND IS_ACTIVE = 1 AND COUNTRY_ID = " + value).subscribe(
    //   (data) => {
    //     if (data["code"] == 200) {
    //       this.stateData = data["data"];
    //     } else {
    //       this.stateData = [];
    //       this.message.error("Failed To Get State Data", "");
    //     }
    //   },
    //   () => {
    //     this.message.error("Something Went Wrong", "");
    //   }
    // );
  }

  save(addNew: boolean, PrescriptionPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.DRUG_ID == undefined || this.data.DRUG_ID == null) &&
      (this.data.DATE == undefined || this.data.DATE == null) &&
      (this.data.INSTRUCTION == undefined || this.data.INSTRUCTION == "" || this.data.INSTRUCTION.trim() == "")
      // && (this.data.SHORT_CODE == undefined || this.data.SHORT_CODE == "" || this.data.SHORT_CODE.trim() == "")
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "");
    }
    else if (this.data.DRUG_ID == undefined || this.data.DRUG_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Drug', '');
    }
 
    else if (this.data.INSTRUCTION == undefined || this.data.INSTRUCTION == "" || this.data.INSTRUCTION.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Instruction', '');
    }
    else if (this.data.DATE == undefined || this.data.DATE == null) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    }
    
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatePresciption(this.data).subscribe(
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
                              this.message.success('Prescription Data Updated Successfully', '');
                                if (!addNew) this.drawerClose();
                                this.isSpinning = false;
                            }
                            else {
                                this.message.error('Prescription Data Updation Failed', '');
                                this.isSpinning = false;
                              }
                        });
         
        } else {
          this.api.createPresciption(this.data).subscribe(
          //   (successCode) => {
          //   if (successCode.code == '200') {
          //     this.message.success('Information Saved Successfully', '');
          //     this.isSpinning = false;
          //     if (!addNew) this.drawerClose();
          //     else {
          //       this.resetDrawer(PrescriptionPage);
          //       this.data = new PrescriptionMaster();
          //     }
          //     this.isSpinning = false;
          //   } else {
          //     this.message.error('Information Not Saved', '');
          //     this.isSpinning = false;
          //   }
          // }
           (response: HttpResponse<any>) => {
                        const statusCode = response.status;
                        if (statusCode === 200) {
                          this.message.success('Prescription Data Saved Successfully', '');
                          this.isSpinning = false;
                    
                          if (!addNew) {
                            this.drawerClose();
                          } else {
                            this.resetDrawer(PrescriptionPage);
                            this.data = new PrescriptionMaster();
                          }
                        } else {
                          this.message.error('Prescription Data Creation Failed', '');
                          this.isSpinning = false;
                        }
                      },
                      (error) => {
                        this.message.error('Something Went Wrong', '');
                        this.isSpinning = false;
                      }
                    );
        ;
        }
      }
    }
  }

 
  resetDrawer(PrescriptionPage: NgForm) {
    this.data = new PrescriptionMaster();
    PrescriptionPage.form.markAsPristine();
    PrescriptionPage.form.markAsUntouched();
   
  }

}
