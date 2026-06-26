import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { appkeys } from 'src/app/app.constant';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-add-new-notification-drawer',
  templateUrl: './add-new-notification-drawer.component.html',
  styleUrls: ['./add-new-notification-drawer.component.css'],
})
export class AddNewNotificationDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  isFocused = '';

  sharingMode = '1';
  notificationType = 'C';
  USER_IDS: any = [];
  TITLE: string = '';
  DESCRIPTION: string = '';
  employeeList: any = [];
  // userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  heading = 'Select Customers';
  isSpinning = false;
  loadingList: boolean = false;
  percentImageOne: number;
  progressBarImageOne: boolean;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cookie: CookieService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.changeRadioButton('1');
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  btnIndividualStatus = false;
  btnDepartmentStatus = false;
  btnBranchStatus = false;
  btnDesignationStatus = false;
  btnEntireOrganisationStatus = false;

  disableRadioButtons() {
    if (this.roleId == 12) {
      this.btnIndividualStatus = true;
      this.btnDepartmentStatus = true;
      this.btnBranchStatus = true;
      this.btnDesignationStatus = true;
      this.btnEntireOrganisationStatus = true;
    } else {
      this.btnIndividualStatus = true;
      this.btnDepartmentStatus = false;
      this.btnBranchStatus = false;
      this.btnDesignationStatus = false;
      this.btnEntireOrganisationStatus = false;
    }
  }

  changeRadioButton(btnValue) {
    this.radiogroup = '';
    this.radiogroup1 = 'ALL';
    this.USER_IDS = [];
    this.employeeList = [];
    this.SELECT_ALL = false;

    console.log(btnValue);

    if (btnValue == '1') {
      this.heading = "Select App User's";

      this.api.getpatientdata(0, 0, '', 'desc', ' AND IS_ACTIVE=1').subscribe(
        (response: HttpResponse<any>) => {
          const responseBody = response.body;
          console.log(responseBody);

          if (responseBody['count'] !== 0) {
            this.loadingList = false;
            this.employeeList = responseBody['data'];

            // console.log(this.employeeList);
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
    } else if (btnValue == '2') {
      this.heading = 'Select Roles';

      this.api.getAllRoles(0, 0, '', 'desc', '').subscribe(
        (data) => {
          console.log(data);

          if (data.body['count'] > 0) {
            this.loadingList = false;
            this.employeeList = data.body['data'];
            // console.log(this.employeeList);
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
    }
  }

  selectedFileName: any = '';
  urlImageOne;
  imgUrl = appkeys.retriveimgUrl;
  clearImage() {
    this.selectedFileName = null;
  }
  onCancel() {
    this.selectedFileName = null;
    this.progressBarImageOne = false;
    this.isVisibleMiddle = false;
    this.myElementRef.nativeElement.value = null;
  }
  isVisibleMiddle = false;

  @ViewChild('image1') myElementRef!: ElementRef;

  showConfirm(): void {
    this.isSpinning = true;
    const file = this.referenceForFile;

    const number = Math.floor(100000 + Math.random() * 900000);
    const fileExt = file.name.split('.').pop();
    const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
    this.selectedFileName = this.urlImageOne;
    this.api
      .onUpload('notificationAttachment', file, this.urlImageOne)
      .subscribe((res) => {
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percentImageOne = percentDone;
          if (this.percentImageOne == 100) {
            this.isSpinning = false;
            this.progressBarImageOne = false;
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload Attachment...', '');
          this.isSpinning = false;
          this.progressBarImageOne = false;
          this.percentImageOne = 0;
          this.selectedFileName = null;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.isVisibleMiddle = false;
            this.message.success('Successfully Uploaded Attachment', '');
            this.isSpinning = false;
            this.selectedFileName = this.urlImageOne;
            this.progressBarImageOne = false;
          } else {
            this.isSpinning = false;
            this.progressBarImageOne = false;
            this.percentImageOne = 0;
            this.selectedFileName = null;
          }
        }
      });
  }

  referenceForFile;
  MEDIA_TYPE = '';
   onFileSelected(event: any) {
    this.isSpinning = true;
    this.referenceForFile = event.target.files[0];
    if (event) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (!fileExtension) {
        this.message.error('Invalid file selected', '');
        this.isSpinning = false;
        return;
      }

      // Define valid extensions for each media type
      const videoExtensions = ['mp4', 'avi'];
      const imageExtensions = ['jpg', 'jpeg', 'png'];
      const audioExtensions = ['mp3'];
      const documentExtensions = ['pdf', 'docx', 'txt'];

      if (this.MEDIA_TYPE === 'V' && !videoExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid video (mp4, avi)', '');
        event.target.value = null;
        this.isSpinning = false;
        return;
      }

      if (this.MEDIA_TYPE === 'I' && !imageExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid image (jpg, jpeg, png)', '');
        this.isSpinning = false;
        event.target.value = null;
        return;
      }

      if (this.MEDIA_TYPE === 'A' && !audioExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid audio file (mp3)', '');
        this.isSpinning = false;
        event.target.value = null;
        return;
      }

      if (
        this.MEDIA_TYPE === 'T' &&
        !documentExtensions.includes(fileExtension)
      ) {
        this.message.error(
          'Please upload a valid document (pdf, docx, txt)',
          ''
        );
        this.isSpinning = false;
        event.target.value = null;
        return;
      }

      // If file type is valid
      this.isSpinning = true;
    }
    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'pdf',
      'docx',
      'txt',
      'mp3',
      'mp4',
      'avi',
    ];
    const file = event.target.files[0]; // Get selected file
    // this.progressBarImageOne = true;
    if (file) {
      //
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.message.error(
          'Invalid file type! Please select a valid file.',
          ''
        );
        this.isSpinning = false;
        event.target.value = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // Optional: Limit file size to 5MB
        this.isSpinning = false;
        this.message.info('File size should not exceed 10MB!', '');
        event.target.value = null;
        return;
      }
      // else if (file.size > 1 * 1024 * 1024 && file.size < 10 * 1024 * 1024) {
      //   //
      //   this.isVisibleMiddle = true;
      //   this.isSpinning = false;
      //   // this.showConfirm(file);
      // }
      else {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = file.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload('notificationAttachment', file, this.urlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                // this.message.success('Profile Photo Uploaded Successfully...', '');
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                // this.progressBarImageOne = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
                // this.isVisibleMiddle = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      }
      // this.selectedFileName = file.name; // Store file name
    }
  }

  topicName;

  onNotificationTypeChange(eve) {}

  onTechnicianWiseChange(event) {
    // if (event) {
    //   this.api
    //     .getTechnicianData(
    //       0,
    //       0,
    //       '',
    //       'desc',
    //       ' AND TECHNICIAN_STATUS=1 AND TYPE=' + `'${event}'`
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.loadingList = false;
    //           this.employeeList = data['data'];
    //         }
    //       },
    //       (err) => {
    //         if (err['ok'] == false) this.message.error('Server Not Found', '');
    //       }
    //     );
    // }
  }

  userId = sessionStorage.getItem('userId');
  public commonFunction = new CommonFunctionService();

  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);
  save(addNew: boolean, myForm: NgForm): void {
    let isOk = true;
    this.isSpinning = true;

    // Validate form fields
    if (
      this.sharingMode === '1' &&
      (!this.USER_IDS || this.USER_IDS.length === 0)
    ) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please select App Users', '');
    } else if (
      this.sharingMode === '2' &&
      (!this.USER_IDS || this.USER_IDS.length === 0)
    ) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please select Roles', '');
    } else if (!this.TITLE?.trim()) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Valid Notification Title', '');
      return;
    } else if (!this.api.checkTextBoxIsValid(this.TITLE)) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Invalid characters in Title', '');
      return;
    } else if (!this.DESCRIPTION?.trim()) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Valid Notification Description', '');
      return;
    } else if (this.MEDIA_TYPE?.trim() !== '' && !this.selectedFileName) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Valid Attachment', '');
      return;
    }

    // Extract sender ID
    // const rawUserId = sessionStorage.getItem('userId');
    // const SENDER_ID = rawUserId ? Number(JSON.parse(atob(rawUserId))) : null;

    let finalUserData = [...this.userData];
    let finalRoleData = [...this.roleData];

    if (this.sharingMode === '1') {
      if (this.roleData.length > 0 && this.userData.length > 0) {
        finalUserData = [];
      } else if (this.roleData.length === 0 && this.userData.length === 0) {
        finalUserData = [...this.USER_IDS];
      }
    } else if (this.sharingMode === '2') {
      finalUserData = [];
      finalRoleData = [...this.USER_IDS];
    }

    const payload = {
      TITLE: this.TITLE,
      DESCRIPTION: this.DESCRIPTION,
      SENDER_ID: this.decrepteduserID,
      ATTACHMENT: this.selectedFileName || null,
      userData: finalUserData,
      roleData: finalRoleData,
    };

    console.log(payload);
 this.isSpinning = false;
    this.api.sendNotificationPayload(payload).subscribe(
      (res) => {
        this.isSpinning = false;
        if (res.status === 200) {
          this.message.success('Notifications Pushed Successfully', '');
          this.changeRadioButton(this.sharingMode);
          this.close(myForm);
        } else {
          this.message.error('Failed to Push Notifications', '');
        }
      },
      (err) => {
        this.isSpinning = false;
        this.message.error('Failed to Push Notifications', '');
      }
    );
  }

  SELECT_ALL: boolean = false;
  radiogroup = '';
  radiogroup1: any = 'ALL';
  roleData: number[] = [];
  userData: number[] = [];

  // onSelectAllChecked(switchStatus: boolean) {
  //   let ids: any = [];
  //   if (switchStatus == true) {
  //     for (let i = 0; i < this.employeeList.length; i++) {
  //       ids.push(this.employeeList[i]['USER_ID']);
  //     }
  //   } else {
  //     ids = [];
  //     this.notificationType = 'C';
  //   }
  //   this.USER_IDS = ids;
  // }

  onSelectAllChecked(switchStatus: boolean) {
    let ids: any[] = [];

    console.log(switchStatus, this.sharingMode);

    if (this.sharingMode === '1') {
      // App Users selected
      if (switchStatus === true) {
        // Get all user IDs
        for (let i = 0; i < this.employeeList.length; i++) {
          ids.push(this.employeeList[i]['ID']);
        }
        this.roleData = [4];
        this.userData = [...ids];
        this.USER_IDS = [...ids];
      } else {
        this.roleData = [];
        this.userData = [];
        this.USER_IDS = [];
      }
    } else if (this.sharingMode === '2') {
      // Roles selected
      if (switchStatus === true) {
        for (let i = 0; i < this.employeeList.length; i++) {
          ids.push(this.employeeList[i]['ID']);
        }
        this.roleData = [...ids];
        this.USER_IDS = [...ids];
        this.userData = [];
      } else {
        this.roleData = [];
        this.USER_IDS = [];
        this.userData = [];
      }
    }
  }
}
