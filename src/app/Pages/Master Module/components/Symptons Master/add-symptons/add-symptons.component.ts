import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SymptonsMaster } from '../../../Models/symptonsMaster';


@Component({
  selector: 'app-add-symptons',
  templateUrl: './add-symptons.component.html',
  styleUrls: ['./add-symptons.component.css']
})
export class AddSymptonsComponent {

  @Input() drawerClose!: Function;
  @Input() data: SymptonsMaster = new SymptonsMaster();
  @Input() dataList: any[] = [];
  @Input() data2: SymptonsMaster[] = [];
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getSymptomsData(0);
    
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


  symptomTypeData: any = []
  getSymptomsData(value: any): void {
    const filter = ` `;
    this.api.getSymptons(0,0,'id','desc','')
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.symptomTypeData = response.body.data;
            // console.log(this.symptomTypeData);
            
          } else {
            this.symptomTypeData = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }

  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;
  
    // console.log(this.symptomTypeData);
    
    if (this.data.name == undefined || this.data.name == null || this.data.name.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    }else if (
      this.symptomTypeData.some((data) => (data['name'] as string).toLowerCase() === this.data.name.toLowerCase()) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('Symptom Name Already Exists', '');
    }
  
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateSymptons(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);
              if (statusCode == 200) {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createSymptons(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);
              if (statusCode == 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new SymptonsMaster();
                  this.resetDrawer(CityMasterPage);
                  this.api.getSymptons(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      // console.log(data);
                      
                      if (data.body.count == 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no = data.body.data[0]['seq_no'] + 1;
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



  resetDrawer(CityMasterPage: NgForm) {
    this.data = new SymptonsMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
    // this.citySeq()
  }
}
