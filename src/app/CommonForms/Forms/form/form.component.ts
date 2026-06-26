import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormMaster } from 'src/app/CommonModels/form-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: FormMaster = new FormMaster();
  isSpinning = false;
  forms: FormMaster[] = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    this.isSpinning = true;
    let filterQuery = 'and parent_id=0';

    this.api.getAllForms(0, 0, '', '', filterQuery).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.forms = response.body['data'];
          this.isSpinning = false;
        }
        else{
          this.forms=[]
          this.isSpinning = false;

        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }

  close(): void {
    this.drawerClose();
  }
  isOk = true;
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true; // Assuming isOk is used for overall validation status

    // Check if all required fields are filled
    if (
      (this.data.name == null ||
        this.data.name == undefined ||
        this.data.name.trim() == '') &&
      (this.data.link == null ||
        this.data.link == undefined ||
        this.data.link.trim() == '') &&
      (this.data.icon == null ||
        this.data.icon == undefined ||
        this.data.icon.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
      this.isSpinning = false;

      return;
    }

    // Further validation specifically for NAME
    if (!this.data.name?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Name', '');
      this.isSpinning = false;
      return;
    } else if (!this.data.link?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Link', '');
      this.isSpinning = false;
    } else if (!this.data.icon?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Icon', '');
      this.isSpinning = false;
    }

    // Proceed with save operation
    if (this.isOk) {
      if (this.data.id) {
        this.api.updateForm(this.data).subscribe(
          (response: HttpResponse<any>) => {
            // console.log(response);
            
            if (response['status'] == 200) {
              this.message.success('Form Updated Successfully...', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Form Updation Failed...', '');
            }
            this.isSpinning = false;
          },
          (err: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong ...', '');
          }
        );
      } else {
        this.api.createForm(this.data).subscribe(
          (response: HttpResponse<any>) => {
            if (response['status'] == 200) {
              this.message.success('Form Created Successfully...', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new FormMaster();
                this.resetDrawer(websitebannerPage);
              }

              this.loadForms();
            } else {
              this.message.error('Form Creation Failed...', '');
            }
            this.isSpinning = false;
          },
          (err: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong ...', '');
          }
        );
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new FormMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
