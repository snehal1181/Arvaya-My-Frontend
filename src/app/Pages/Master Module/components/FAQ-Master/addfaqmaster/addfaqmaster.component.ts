import { Component, Input } from '@angular/core';
import { FAQMaster } from '../../../Models/FAQ-Master';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-addfaqmaster',
  templateUrl: './addfaqmaster.component.html',
  styleUrls: ['./addfaqmaster.component.css'],
})
export class AddfaqmasterComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: FAQMaster = new FAQMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: FAQMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  serviceTypes = [
    // { ID: 'H', LABEL: 'Hospital' },
    { ID: 'L', LABEL: 'Lab' },
  ];

  consultationModes = [
    { ID: 'ON', LABEL: 'Online' },
    { ID: 'OF', LABEL: 'offline' },
  ];

  appointmentTypes = [
    { ID: 'V', LABEL: 'video' },
    { ID: 'C', LABEL: 'call' },
    { ID: 'Ch', LABEL: 'chat' },
    { ID: 'Cl', LABEL: 'clinic' },
    { ID: 'H', LABEL: 'home' },
  ];
  @Input()
  filteredAppointmentTypes: any;
  onConsultationModeChange(mode: string) {

    console.log(mode);

    this.data.appoinment_type = ''

    if (this.data.question !== undefined || this.data.answer != undefined) {
      this.data.question = ''
      this.data.answer = ''
    }

    if (mode === 'ON') {
      this.filteredAppointmentTypes = this.appointmentTypes.filter((type) =>
        ['V', 'C', 'Ch'].includes(type.ID)
      );
    } else if (mode === 'OF') {
      this.filteredAppointmentTypes = this.appointmentTypes.filter((type) =>
        ['Cl', 'H'].includes(type.ID)
      );
    } else {
      this.filteredAppointmentTypes = [];
    }
  }
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, ServiceMasterPage: NgForm): void {
    this.isOk = true;

    console.log(this.data);

    if (
      (this.data.question === '' ||
        this.data.question == null ||
        this.data.question === undefined) &&
      (this.data.seq_no === undefined || this.data.seq_no <= 0) &&
      (this.data.type === '' ||
        this.data.type == null ||
        this.data.type === undefined)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.type === '' ||
      this.data.type == null ||
      this.data.type === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Service Type', '');
    } else if (
      this.data.consultation_mode === '' ||
      this.data.consultation_mode == null ||
      this.data.consultation_mode === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Consultation Mode', '');
    } else if (
      this.data.appoinment_type === '' ||
      this.data.appoinment_type == null ||
      this.data.appoinment_type === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Appointment Type', '');
    } else if (
      this.data.question === '' ||
      this.data.question == null ||
      this.data.question === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question', '');
    } else if (this.data.seq_no === undefined || this.data.seq_no <= 0) {
    } else if (
      this.data.answer === '' ||
      this.data.answer == null ||
      this.data.answer === undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Answer', '');
    } else if (this.data.seq_no === undefined || this.data.seq_no <= 0) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Sequence Number', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateFAQMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'FAQ Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('FAQ Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createFAQMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'FAQ Information Saved Successfully',
                  ''
                );
                this.FAQseq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(ServiceMasterPage);
                  this.data = new FAQMaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('FAQ Information Not Saved', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  FAQseq(): void {
    this.api.getFAQMaster(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const responseBody = response.body;
        if (responseBody && responseBody['count'] === 0) {
          this.data.seq_no = 1;
        } else if (responseBody && responseBody['data']?.length > 0) {
          this.data.seq_no = Number(responseBody['data'][0]['seq_no']) + 1;
          this.data.is_active = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resetDrawer(ServiceMasterPage: NgForm) {
    this.data = new FAQMaster();
    ServiceMasterPage.form.markAsPristine();
    ServiceMasterPage.form.markAsUntouched();
  }
}
