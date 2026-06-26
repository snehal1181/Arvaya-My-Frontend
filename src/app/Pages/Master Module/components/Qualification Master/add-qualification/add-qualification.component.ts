import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { QualificationMaster } from '../../../Models/QualificationMaster';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.css'],
})
export class AddQualificationComponent {
  @Input() drawerClose!: Function;
  @Input() data: QualificationMaster = new QualificationMaster();
  @Input() dataList: any[] = [];
  @Input() data2: QualificationMaster[] = [];
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

  ngOnInit(): void {
    this.getqualification();
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

  qualificationTypeData: any = [];
  getqualification(): void {
    const filter = `AND is_active = 1`;
    this.api
      .getQualificationType(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.qualificationTypeData = response.body.data;
        } else {
          this.qualificationTypeData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;

    if (
      this.data.qualification_type_id == undefined ||
      this.data.qualification_type_id == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Qualification Type', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == null ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.data.short_code == undefined ||
      this.data.short_code == null ||
      this.data.short_code.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateQualification(this.data)
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
            .createQualification(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new QualificationMaster();
                  this.resetDrawer(CityMasterPage);
                  this.api.getQualification(0, 0, '', 'desc', '').subscribe(
                    (response: HttpResponse<any>) => {
                      const body = response.body;
                      

                      if (body?.data?.length > 0) {
                        this.data.seq_no = body.data[0].seq_no + 1;
                      } else {
                        this.data.seq_no = 1;
                      }
                    },
                    () => {}
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
    this.api.getQualification(1, 1, 'seq_no', 'desc', '').subscribe(
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
    this.data = new QualificationMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
    // this.citySeq()
  }
}
