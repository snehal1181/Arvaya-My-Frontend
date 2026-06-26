import { Component, Input } from '@angular/core';
import { ServiceMaster } from '../../../Models/ServiceMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-service-master',
  templateUrl: './add-service-master.component.html',
  styleUrls: ['./add-service-master.component.css'],
})
export class AddServiceMAsterComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: ServiceMaster = new ServiceMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: ServiceMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  public commonFunction = new CommonFunctionService();
  serviceTypes = [
    // { ID: 'H', LABEL: 'Hospital' },
    { ID: 'L', LABEL: 'Lab' },
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {

    this.checkService()

  }

  close(): void {
    this.drawerClose();

  }

  ServiceList = [];

  checkService(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const filter = ` AND type='${this.data.type}' AND name='${this.data.name}'`;

      this.api.getTechnicianServiceMapList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const responseBody = response.body;
          const statusCode = response.status;

          ;

          if (responseBody.count !== 0) {
            resolve(false); // Duplicate found
          } else {
            resolve(true); // No duplicate
          }
        },
        (error) => {
          reject(error); // Reject the promise on error
        }
      );
    });
  }

  save(addNew: boolean, ServiceMasterPage: NgForm): void {
    this.isOk = true;

    ;

    // Validate required fields
    if (
      (this.data.name == '' || this.data.name == null || this.data.name == undefined) &&
      (this.data.seq_no == undefined || this.data.seq_no <= 0) &&
      (this.data.type == '' || this.data.type == null || this.data.type == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.type == '' ||
      this.data.type == null ||
      this.data.type == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Type', '');
    } else if (
      this.data.name == '' ||
      this.data.name == null ||
      this.data.name == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (!this.data.id) { // Only check combination when ID is not present (new entry)
      this.checkService().then((isUnique: boolean) => {
        if (!isUnique) {
          this.isOk = false;
          this.message.error(
            'A specialization with the same Name and Type already exists. Please select different values.',
            ''
          );

        }

        // After checkService, proceed to save the data if everything is valid
        if (this.isOk) {
          if (this.data.seq_no == undefined || this.data.seq_no <= 0) {
            this.isOk = false;
            this.message.error('Please Enter a Valid Sequence Number', '');
          }

          if (this.isOk) {
            this.isSpinning = true;
            // Call createServiceMaster if it's a new entry (no ID)
            this.api.createServiceMaster(this.data).subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success('Service Information Saved Successfully', '');
                this.ServiceSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(ServiceMasterPage);
                  this.data = new ServiceMaster();
                }
              } else {
                this.message.error('Service Information Not Saved', '');
                this.isSpinning = false;
              }
            });
          }
        }
      }).catch((error) => {
        this.isOk = false;
        this.message.error('Error while checking service combination', '');
        ;
      });
    } else {
      // Proceed with update if ID exists (updateServiceMaster)
      if (this.data.seq_no == undefined || this.data.seq_no <= 0) {
        this.isOk = false;
        this.message.error('Please Enter a Valid Sequence Number', '');
      }

      if (this.isOk) {
        this.isSpinning = true;
        this.api.updateServiceMaster(this.data).subscribe((response: HttpResponse<any>) => {
          const statusCode = response.status;

          if (statusCode === 200) {
            this.message.success('Service Information Updated Successfully', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Service Information Not Updated', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  ServiceSeq(): void {
    this.api.getServiceMaster(1, 1, 'seq_no', 'desc', '').subscribe(
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
        ;
      }
    );
  }

  resetDrawer(ServiceMasterPage: NgForm) {
    this.data = new ServiceMaster();
    ServiceMasterPage.form.markAsPristine();
    ServiceMasterPage.form.markAsUntouched();
  }
}
