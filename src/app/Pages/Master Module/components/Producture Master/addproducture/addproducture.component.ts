import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ProcedureMaster } from '../../../Models/productureMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-addproducture',
  templateUrl: './addproducture.component.html',
  styleUrls: ['./addproducture.component.css']
})
export class AddproductureComponent {


  @Input()
  drawerClose!: Function;
  @Input()
  data: ProcedureMaster = new ProcedureMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: ProcedureMaster[] = [];
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



  save(addNew: boolean, ProcedureMasterPage: NgForm): void {
    this.isOk = true;
    // if (
    //   (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
    //   (this.data.STATE_ID == undefined || this.data.STATE_ID == null) &&
    //   (this.data.NAME == undefined || this.data.NAME == "" || this.data.NAME.trim() == "")
    //   // && (this.data.SHORT_CODE == undefined || this.data.SHORT_CODE == "" || this.data.SHORT_CODE.trim() == "")
    // ) {
    //   this.isOk = false;
    //   this.message.error("Please Fill All The Required Fields ", "");
    // }

    if (this.data.name == undefined || this.data.name == "" || this.data.name.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    }

    else if (this.data.type == undefined || this.data.type == null || this.data.name.trim() == "") {
      this.isOk = false;
      this.message.error('Please Select Type', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateProcedures(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createProcedures(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new ProcedureMaster();
                  this.resetDrawer(ProcedureMasterPage);
                  this.api.getProceduress(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      if (data['count'] == 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no = data['data'][0]['seq_no'] + 1;
                      }
                    },
                    () => { }
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Saved...', '');
                this.isSpinning = false;
              }
            });
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

  resetDrawer(ProcedureMasterPage: NgForm) {
    this.data = new ProcedureMaster();
    ProcedureMasterPage.form.markAsPristine();
    ProcedureMasterPage.form.markAsUntouched();
    this.citySeq()
  }
}
