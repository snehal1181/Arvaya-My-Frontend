import { Component, Input } from '@angular/core';
import { HereditaryConditions } from '../../../Models/hereditary-conditions';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-hereditaryconditions',
  templateUrl: './add-hereditaryconditions.component.html',
  styleUrls: ['./add-hereditaryconditions.component.css']
})
export class AddHereditaryconditionsComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: HereditaryConditions = new HereditaryConditions();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HereditaryConditions[] = [];
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



  save(addNew: boolean, hereditaryConditions: NgForm): void {
    this.isOk = true;
    if (
      // (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
      (this.data.name == undefined || this.data.name == "" || this.data.name.trim() == "") &&
      (this.data.description == undefined || this.data.description == "" || this.data.description.trim() == "")
      // && (this.data.SHORT_CODE == undefined || this.data.SHORT_CODE == "" || this.data.SHORT_CODE.trim() == "")
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "");
    }


    else if (this.data.name == undefined || this.data.name == "" || this.data.name.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    }
    else if (this.data.description == undefined || this.data.description == "" || this.data.description.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Description', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api.updateHereditaryConditions(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Not Updated', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createHereditaryConditions(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Saved Successfully', '');
              this.isSpinning = false;
              if (!addNew) this.drawerClose();
              else {
                this.resetDrawer(hereditaryConditions);
                this.data = new HereditaryConditions();
              }
              this.isSpinning = false;
            } else {
              this.message.error('Information Not Saved', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }



  resetDrawer(hereditaryConditions: NgForm) {
    this.data = new HereditaryConditions();
    hereditaryConditions.form.markAsPristine();
    hereditaryConditions.form.markAsUntouched();
    // this.citySeq()
  }

}
