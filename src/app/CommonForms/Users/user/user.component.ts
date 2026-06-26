import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { UserMaster } from 'src/app/CommonModels/user-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { RoleMaster } from '../../models/role-master';
// import { UserMaster } from '../../models/user-master';
// import { ApiserviceService } from 'src/app/Service/apiservice.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: UserMaster = new UserMaster();
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  roles: RoleMaster[] = [];
  selectedRole: RoleMaster = new RoleMaster();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.selectedRole = new RoleMaster();
    this.loadRoles();
  }

  loadRoles() {
    this.isSpinning = true;

    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.roles = responseBody.data;
        } else {
          this.message.error('Failed to load roles. Please try again.', '');
          this.roles = [];
        }
        this.isSpinning = false;
      },

    );

  }

  close(): void {
    this.drawerClose();
  }
  passwordVisible: boolean = false;



  save(addNew: boolean): void {
    this.isSpinning = true;

    if (
      this.data.name != undefined &&
      this.data.name != '' &&
      this.data.password != undefined &&
      this.data.password != '' &&
      this.data.role_id != undefined &&
      this.data.role_id != 0 &&
      this.data.email_id != undefined &&
      this.data.email_id != '' &&
      this.data.mobile_number != undefined &&
      this.data.mobile_number != ''
    ) {
      // this.data.VENDOR_ID = 0;

      // this.data['ROLE_DATA'] = [this.data.role_id];

      if (this.data.id) {
        this.api.updateUser(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            if (statusCode === 200) {
              this.message.success('User Updated Successfully', '');
              if (!addNew) this.drawerClose();
            } else if (responseBody?.code === '403') {
              this.message.error('Mobile No. or Email Already Registered', '');
            } else {
              this.message.error('User Updation Failed', '');
            }
            this.isSpinning = false;
          },

        );
      } else {
        this.api.createUser(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;
            const responseBody = response.body;

            if (statusCode === 200) {
              this.message.success('User Created Successfully', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new UserMaster();
              }
            } else {
              this.message.error('User Creation Failed', '');
            }
            this.isSpinning = false;
          },

        );
      }

    } else {
      this.message.error('Please Fill All Required Fields', '');
      this.isSpinning = false;
    }
  }
}
