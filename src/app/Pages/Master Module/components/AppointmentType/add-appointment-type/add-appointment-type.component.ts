import { Component, Input } from "@angular/core"; 
import { NgForm } from "@angular/forms";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
import { AppointmentData } from "../../../Models/AppointmentType";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: 'app-add-appointment-type',
  templateUrl: './add-appointment-type.component.html',
  styleUrls: ['./add-appointment-type.component.css']
})
export class AddAppointmentTypeComponent {
  @Input() data: any = AppointmentData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) {}
  isSpinning = false;
  isOk = true;
  resetDrawer(CountryDrawer: NgForm) {
    this.data = new AppointmentData();
    CountryDrawer.form.markAsPristine();
    CountryDrawer.form.markAsUntouched();
  }
  save(addNew: boolean, CountryDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.name.trim() == "" ||
        this.data.name == null ||
        this.data.name == undefined) &&
      (this.data.mode == undefined ||
        this.data.mode == null ||
        this.data.mode == 0)
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "");
    } else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name.trim() == ""
    ) {
      this.isOk = false;
      this.message.error(" Please Enter Appointment Type.", "");
    } else if (
      this.data.mode == null ||
      this.data.mode == undefined ||
      this.data.mode == 0
    ) {
      this.isOk = false;
      this.message.error("Please Enter Mode.", "");
    }
    else if (this.data.seq_no == undefined || this.data.seq_no == null || !this.data.seq_no) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateAppointmentTypeData(this.data)
            .subscribe(
             

              (response: HttpResponse<any>) => {
                const statusCode = response.status;
                if (statusCode === 200) {
                  this.message.success('Appointment Type Data Updated Successfully', '');
                    if (!addNew) this.drawerClose();
                    this.isSpinning = false;
                }
                else {
                    this.message.error('Appointment Type Data Updation Failed', '');
                    this.isSpinning = false;
                  }
            });
            
        } else {
          this.api.createAppointmentTypeData(this.data).subscribe(
                    (response: HttpResponse<any>) => {
                            const statusCode = response.status;
                            if (statusCode === 200) {
                              this.message.success("Appointment Type Data Created Successfully", "");
                             
                        
                              if (!addNew) {
                                this.drawerClose();
                              } else {
                                this.data = new AppointmentData();
                                this.resetDrawer(CountryDrawer);
                                this.api.getAppointmentTypeData(1, 1, '', 'desc', '').subscribe(
                                  (response: HttpResponse<any>) => {
                                       const statusCode = response.status;
                                       if (statusCode === 200) {
                                         if(response.body.count == 0 ){
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
                              this.message.error('Appointment Type Data Creation Failed..."', '');
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
  close() {
    this.drawerClose();
  }
  getErrorMessage(control: any): string {
    if (control.errors?.["required"] && control.touched) {
      return "Please enter a appointment type Name.";
    }
    if (control.errors?.["maxlength"] && control.touched) {
      return " Appointment type name is too long.";
    }
    return "";
  }
}

