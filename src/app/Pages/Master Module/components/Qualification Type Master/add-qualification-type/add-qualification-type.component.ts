import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { QualificationTypeMaster } from '../../../Models/QualificationTypeMaster';

@Component({
  selector: 'app-add-qualification-type',
  templateUrl: './add-qualification-type.component.html',
  styleUrls: ['./add-qualification-type.component.css'],
})
export class AddQualificationTypeComponent {
  @Input() drawerClose!: Function;
  @Input() data: QualificationTypeMaster = new QualificationTypeMaster();
  @Input() dataList: any[] = [];
  @Input() data2: QualificationTypeMaster[] = [];
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
  ) {}

  ngOnInit(): void {}
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

  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;

    if (
      this.data.type == undefined ||
      this.data.type == null ||
      String(this.data.type).trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Type', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == null ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } 

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateQualificationType(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              
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
          this.api
            .createQualificationType(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new QualificationTypeMaster();
                  this.resetDrawer(CityMasterPage);
                  this.api
                    .getQualificationTypee(0, 0, '', 'desc', '')
                    .subscribe(
                      (response: HttpResponse<any>) => {
                        const body = response.body;
                        

                        if (body?.data?.length > 0) {
                          this.data.seq_no = body.data[0].seq_no + 1;
                        } else {
                          this.data.seq_no = 1;
                        }
                      },
                      (error) => {
                        
                      }
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
    this.api.getQualificationTypee(1, 1, 'seq_no', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.data.seq_no = 1;
        } else {
          this.data.seq_no = Number(data['data'][0]['seq_no']) + 1;
          this.data.is_active = 1;
        }
      },
      (err) => {
        
      }
    );
  }

  resetDrawer(CityMasterPage: NgForm) {
    this.data = new QualificationTypeMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
    // this.citySeq()
  }
}
