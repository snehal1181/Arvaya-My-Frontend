import { Component, Input } from '@angular/core';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { patientmaster } from '../../../Models/patient';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-patientmasteradd',
  templateUrl: './patientmasteradd.component.html',
  styleUrls: ['./patientmasteradd.component.css'],
})
export class PatientmasteraddComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: patientmaster = new patientmaster();

  public commonFunction = new CommonFunctionService();

  ngOnInit(): void {
    // console.log(this.data);
  }
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  isOk: any=true;
  save(addNew: boolean, councilMasterPage: NgForm) {
    // this.isOk = true;
    // console.log(this.data);

    if (
      (this.data.name == undefined || this.data.name.trim() == '') &&
      (this.data.email == undefined || this.data.email.trim() == '') &&
      (this.data.profile_image == undefined ||
        this.data.profile_image == null ||
        this.data.profile_image?.trim() == '') &&
      (this.data.mobile_number == undefined ||
        this.data.mobile_number.trim() == '') &&
      (this.data.adhar_card == undefined ||
        this.data.adhar_card.trim() == '') &&
      (this.data.date_of_birth == undefined ||
        this.data.date_of_birth == null ||
        this.data.date_of_birth?.trim() == '') &&
      (this.data.gender == undefined || this.data.gender.trim() == '') &&
      (this.data.blood_group == undefined || this.data.blood_group.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
    } else if (this.data.name == undefined || this.data.name.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    }
    else if (!this.data.email || this.data.email.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    }
    else if (this.data.email.trim() && !this.commonFunction.emailpattern.test(this.data.email)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email', '');
    } 
    else if (
      this.data.mobile_number == undefined ||
      this.data.mobile_number.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number', '');
    }
    //  else if (
    //   this.data.profile_image == undefined ||
    //   this.data.profile_image == null
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Upload Profile Image', '');
    // }
    else if (
      this.data.adhar_card == undefined ||
      this.data.adhar_card.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Aadhaar Card Number', '');
    } else if (
      this.data.date_of_birth == undefined ||
      this.data.date_of_birth == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Date of Birth', '');
    } else if (this.data.gender == undefined || this.data.gender.trim() == '') {
      this.isOk = false;
      this.message.error('Please Select Gender', '');
    } else if (
      this.data.blood_group == undefined ||
      this.data.blood_group.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Blood Group', '');
    }
    //  else if (
    //   this.data.ABHA_NUMBER == undefined ||
    //   this.data.ABHA_NUMBER.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter ABHA Number', '');
    // } else if (
    //   this.data.ABHA_TYPE == undefined ||
    //   this.data.ABHA_TYPE.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select ABHA Type', '');
    // }

    if (this.isOk) {
      this.data.date_of_birth = this.datePipe.transform(
        this.data.date_of_birth,
        'yyyy-MM-dd'
      );
      this.isSpinning = true;
      // let userID = sessionStorage.getItem('userId');
      // this.data.USER_ID = userID
      //   ? this.commonFunction.decryptdata(userID)
      //   : null;
      {
        if (this.data.id) {
          this.api.updatePatient(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('User Information Not Updated', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        } else {
          this.api.createPatient(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'User Information Saved Successfully',
                  ''
                );
                this.CouncilSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(councilMasterPage);
                  this.data = new patientmaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('User Information Not Saved', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  CouncilSeq(): void {
    this.api.getpatientdata(1, 1, 'id', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const responseBody = response.body; // Safely access the body of the response
        if (responseBody && responseBody['count'] === 0) {
          this.data.total_count = 1;
        } else if (responseBody && responseBody['data']?.length > 0) {
          this.data.total_count = Number(responseBody['data'][0]['total_count']) + 1;
          this.data.is_active = true;
        }
      },
      (err) => { }
    );
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  resetDrawer(councilMasterPage: NgForm) {
    this.data = new patientmaster();
    councilMasterPage.form.markAsPristine();
    councilMasterPage.form.markAsUntouched();
  }
  isSpinning: boolean = false;
  urlImageOneShow: any;
  progressBarImageOne: boolean = false;
  percentImageOne: any;
  fileURL: any;
  UrlImageOne: any;
  timer: any;
  onFileSelected(event: any) {
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.fileURL = <File>event.target.files[0];

      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (
          this.data['profile_image'] != undefined &&
          this.data['profile_image'].trim() != ''
        ) {
          var arr = this.data['profile_image'].split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      this.timer = this.api
        .onUpload11('patientProfileImage', this.fileURL, this.UrlImageOne)
        .subscribe((res: HttpEvent<any>) => {
          console.log(res);

          switch (res.type) {
            case HttpEventType.UploadProgress:
              const percentDone = res.total
                ? Math.round((100 * res.loaded) / res.total)
                : 0;
              this.percentImageOne = percentDone;
              console.log(`Progress: ${percentDone}%`);

              if (this.percentImageOne === 100) {
                this.isSpinning = false;
                setTimeout(() => {
                  this.progressBarImageOne = false;
                }, 2000);
              }
              break;

            case HttpEventType.ResponseHeader:
              console.log('Response Headers Received:', res);
              break;

            case HttpEventType.DownloadProgress:
              console.log('Download Progress:', res.loaded, '/', res.total);
              break;

            case HttpEventType.Response:
              if (res.status === 200 && res.body?.message === 'Success') {
                this.message.success('Image Uploaded Successfully...', '');
                this.data.profile_image = this.UrlImageOne;
              } else {
                this.message.error('Failed To Upload Image...', '');
                this.resetUploadStateForField('profile_image');
              }
              break;

            default:
              console.warn('Unhandled event type:', res.type);
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data['PHOTO'] = null;
    }
  }
  resetUploadStateForField(field: string) {
    this[`fileURL${field}`] = null;
    this[`isSpinning${field}`] = false;
    this[`progressBar${field}`] = false;
    this[`percent${field}`] = 0;
    this.data[field] = null;
  }
  imageshow;
  ViewImage: any;
  ImageModalVisible = false;
  viewImage(imageURL: string): void {
    // console.log('view');

    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    // console.log('Getting Image');
    let imagePath = this.api.retriveimgUrl + 'patientProfileImage/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    // console.log('Image path:', imagePath);

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  deleteCancel() { }
  image1DeleteConfirm(data: any) {
    // console.log('data',data);

    this.UrlImageOne = null;
    this.data.profile_image = ' ';

    this.fileURL = null;
  }
  removeImage() {
    this.data.profile_image = ' ';
    this.fileURL = null;
  }
}
