import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { FormMaster } from 'src/app/CommonModels/form-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: RoleMaster = new RoleMaster();
  isSpinning = false;
  @Input() drawerVisible: boolean = false;
  roles: RoleMaster[] = [];
  forms: FormMaster[] = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  close(): void {
    this.drawerClose();
  }
  selectedRoleName: any;
  onChange(selectedId: number): void {
    // Find the selected role by ID
    const selectedRole = this.roles.find((role) => role.id === selectedId);

    // If found, you can use its name property
    if (selectedRole) {
      this.selectedRoleName = selectedRole.name;
      this.data.parent_name = this.selectedRoleName;
    } else {
    }
  }
  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (roles) => {
        this.roles = roles['data'];
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }
  isOk: boolean = true;
  save(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;
    // Perform initial validation checks
    if (
      (this.data.name == null ||
        this.data.name == undefined ||
        this.data.name.trim() == '') &&
      (this.data.type == null ||
        this.data.type == undefined ||
        this.data.type.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.parent_id == null ||
      this.data.parent_id == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Parent Role', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;

      this.message.error('Please Enter Name.', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.type == null ||
      this.data.type == undefined ||
      this.data.type.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Type.', '');
      this.isSpinning = false;
      return;
    }

    // If all validations pass, proceed with the API request
    if (this.data.id) {
      this.api.updateRole(this.data).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;
    
          if (statusCode === 200) {
            this.message.success('Role Updated Successfully...', '');
    
            if (!addNew) this.drawerClose();
    
            this.isSpinning = false;
          } else {
            this.message.error('Role Updation Failed...', '');
            this.isSpinning = false;
          }
        },
       
      );
    } else {
      this.api.createRole(this.data).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;
    
          if (statusCode === 200) {
            this.message.success('Role Created Successfully...', '');
    
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new RoleMaster();
            }
    
            this.loadRoles();
            this.isSpinning = false;
          } else {
            this.message.error('Role Creation Failed...', '');
            this.isSpinning = false;
          }
        },
       
      );
    }
    
  }
}
