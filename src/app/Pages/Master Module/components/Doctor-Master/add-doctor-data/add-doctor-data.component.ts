import { Component, Input } from '@angular/core';
import { DoctorMaster } from '../../../Models/DoctorMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { appkeys } from 'src/app/app.constant';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-doctor-data',
  templateUrl: './add-doctor-data.component.html',
  styleUrls: ['./add-doctor-data.component.css'],
})
export class AddDoctorDataComponent {
  @Input() drawerClose!: Function;
  @Input() data: DoctorMaster = new DoctorMaster();
  @Input() drawerVisible: boolean = false;
  @Input() dataList: any[] = [];
  @Input() isSpinning = false;
  registrationPattern = /^[A-Za-z0-9]{4}-[A-Z]{2}-\d{4}$/;
  experiencePattern = '^d+(.d{1})?$';
  passwordVisible = false;

  roundExperience() {
    let experience = this.data.experience;

    if (experience) {
      experience = experience.replace(/[^0-9.]/g, '');

      const parts = experience.split('.');

      if (parts.length === 2) {
        const decimalPart = parts[1];

        if (parseInt(decimalPart) >= 12) {
          this.data.experience = Math.ceil(parseFloat(experience)).toString();
        } else {
          this.data.experience = experience;
        }
      } else {
        this.data.experience = experience;
      }
    }
  }
  disableFutureYears = (current: Date): boolean => {
    return current && current > new Date();
  };

  roleid: any;

  sessionValue: any = sessionStorage.getItem('userId');

  // Declare the arrays for Country, State, District, and Pincode
  @Input()
  countries: any[] = [];
  @Input()
  states: any[] = [];
  @Input()
  districts: any[] = [];
  @Input() pincodes: any[] = [];

  loadcountries: boolean = false;
  loadstates: boolean = false;
  loaddistract: boolean = false;
  loadpincode: boolean = false;
  pincodeload: boolean = false;

  loadCouncils: boolean = false;
  councils: any[] = [];


  progressBarPhoto: any;
  percentPhoto: any;
  filePhotoURL: any;
  urlPhoto: any;
  urlPhotoShow: boolean;

  @Input()
  isEdit = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  public commonFunction = new CommonFunctionService();

  ngOnInit() {
    this.getCountry();
    this.getCouncil();
  }

  // Method to get country data
  getCouncil() {
    this.loadCouncils = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getCouncilType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;
      if (statusCode === 200) {
        this.councils = responseBody.data || [];
      } else {
        this.councils = [];
        this.message.error('Failed To Get Council Data', '');
      }
      this.loadCouncils = false;
    });
  }

  // Method to get country data
  getCountry() {
    this.loadcountries = true;
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;
      if (statusCode === 200) {
        this.countries = responseBody.data || [];
      } else {
        this.countries = [];
        this.message.error('Failed To Get Country Data', '');
      }
      this.loadcountries = false;
    });
  }

  // Method to get state data based on country selection
  getstates(event: any) {
    this.loadstates = true;
    if (event) {
      this.data.state_id = null;
      this.data.district_id = null;
      this.data.pincode_id = null;

      this.states = [];
      this.districts = [];
      this.pincodes = [];
      const filter = `AND IS_ACTIVE = 1 AND COUNTRY_ID = ${event}`;
      this.api.getStateType(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;
          if (statusCode === 200) {
            this.states = responseBody.data || [];
          } else {
            this.states = [];
            this.message.error('Failed To Get State Data', '');
          }
          this.loadstates = false;
        },
        (err: HttpErrorResponse) => {
          this.loadstates = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.data.state_id = null;
      this.data.district_id = null;
      this.data.pincode_id = null;

      this.states = [];
      this.districts = [];
      this.pincodes = [];
      this.loadstates = false;
    }
  }

  // Method to get district data based on state selection
  getDist(event: any) {
    this.data.district_id = null;
    this.districts = [];
    this.loaddistract = true;
    if (event) {
      const filter = ` AND IS_ACTIVE = 1 AND STATE_ID = ${event}`;
      this.api.getDistrictType(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;
          if (statusCode === 200) {
            this.districts = responseBody.data || [];
          } else {
            this.districts = [];
            this.message.error('Failed To Get District Data', '');
          }
          this.loaddistract = false;
        },
        (err: HttpErrorResponse) => {
          this.loaddistract = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.data.district_id = null;
      this.districts = [];
      this.loaddistract = false;
    }
  }

  onDistrictChange(distId: number) {
    console.log(distId);

    if (distId) {
      this.pincodeload = true;
      this.data.pincode_id = null;
      this.pincodes = [];
      const filter = ` AND IS_ACTIVE = 1 AND DISTRICT_ID = ${distId}`;
      this.api.getPincodeType(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.pincodes = responseBody.data || [];
            console.log(responseBody.data);
          } else {
            this.pincodes = [];
          }
          this.pincodeload = false;
        },
        (err: HttpErrorResponse) => {
          this.pincodeload = false;
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      this.pincodeload = false;
      this.data.pincode_id = null;
      this.pincodes = [];
    }
  }

  // Identity
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    const file = event.target.files[0];

    if (allowedTypes.includes(file.type)) {
      this.fileURL = <File>file;

      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }

      if (this.fileURL != null) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.UrlImageOne = `${d}${number}.${fileExt}`;
      }

      this.progressBarImageOne = true;
      this.isSpinning = true;

      this.timer = this.api
        .onUpload('doctorIdProof', this.fileURL, this.UrlImageOne)
        .subscribe(
          (res: HttpEvent<any>) => {
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
                  this.data.identity_doc = this.UrlImageOne;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetUploadStateForField('identity_doc');
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Image...', '');
            this.resetUploadStateForField('IDENTITY_DOC');
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.resetUploadStateForField('IDENTITY_DOC');
    }
  }

  //  Profile

  UrlProfileImage: any;
  profileprogressBarPhoto: boolean = false;
  profilepercentPhoto = 0;
  timerPhoto: any;
  urlProfileImageShow: boolean = false;
  fileURLProfileImage: any = '';

  onPhotoFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const file = event.target.files[0];

    if (allowedTypes.includes(file.type)) {
      this.fileURLProfileImage = <File>file;

      if (this.fileURLProfileImage.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }

      if (this.fileURLProfileImage != null) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileURLProfileImage.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.UrlProfileImage = `${d}${number}.${fileExt}`;
      }

      this.progressBarPhoto = true;
      this.isSpinning = true;

      this.timerPhoto = this.api
        .onUpload(
          'doctorProfilePhoto',
          this.fileURLProfileImage,
          this.UrlProfileImage
        )
        .subscribe(
          (res: HttpEvent<any>) => {
            console.log(res);

            switch (res.type) {
              case HttpEventType.UploadProgress:
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
                this.percentPhoto = percentDone;
                console.log(`Progress: ${percentDone}%`);

                if (this.percentPhoto === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarPhoto = false;
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
                  this.message.success(
                    'Profile Image Uploaded Successfully...',
                    ''
                  );
                  this.data.profile_image = this.UrlProfileImage;
                } else {
                  this.message.error('Failed To Upload Profile Image...', '');
                  this.resetUploadStateForField('profile_image');
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Profile Image...', '');
            this.resetUploadStateForField('PROFILE_IMAGE');
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.resetUploadStateForField('PROFILE_IMAGE');
    }
  }

  imageshow;
  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    // console.log('data',data);

    this.UrlImageOne = null;
    this.data.registration_proof = ' ';

    this.fileURL = null;
  }

  deleteCancel() { }
  removeImage() {
    this.data.registration_proof = ' ';
    this.fileURL = null;
  }

  UrlRegistrationProof: any;
  progressBarImageTwo: boolean = false;
  percentImageTwo = 0;
  timer2: any;
  urlRegistrationProofShow: boolean = false;
  fileRegistrationProofURL: any = '';

  onFileSelectedRegistrationProof(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    const file = event.target.files[0];

    if (allowedTypes.includes(file.type)) {
      this.fileRegistrationProofURL = <File>file;

      if (this.fileRegistrationProofURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }

      if (this.fileRegistrationProofURL != null) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.fileRegistrationProofURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.UrlRegistrationProof = `${d}${number}.${fileExt}`;
      }

      this.progressBarImageTwo = true;
      this.isSpinning = true;

      this.timer2 = this.api
        .onUpload(
          'doctorRegistrationProof',
          this.fileRegistrationProofURL,
          this.UrlRegistrationProof
        )
        .subscribe(
          (res: HttpEvent<any>) => {
            console.log(res);

            switch (res.type) {
              case HttpEventType.UploadProgress:
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
                this.percentImageTwo = percentDone;
                console.log(`Progress: ${percentDone}%`);

                if (this.percentImageTwo === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarImageTwo = false;
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
                  this.message.success('Document Uploaded Successfully...', '');
                  this.data.registration_proof = this.UrlRegistrationProof;
                } else {
                  this.message.error('Failed To Upload Document...', '');
                  this.resetUploadStateForField('registration_proof');
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Document...', '');
            this.resetUploadStateForField('registration_proof');
          }
        );
    } else {
      this.message.error(
        'Please Select a valid file (PNG, JPG, JPEG, PDF)',
        ''
      );
      this.resetUploadStateForField('registration_proof');
    }
  }

  resetUploadStateForField(field: string) {
    this[`fileURL${field}`] = null;
    this[`isSpinning${field}`] = false;
    this[`progressBar${field}`] = false;
    this[`percent${field}`] = 0;
    this.data[field] = null;
  }

  IdentityDeleteConfirm(data: any) {
    this.resetUploadStateForField('identity_doc');
  }

  removeImageIdentity() {
    this.resetUploadStateForField('identity_doc');
  }

  profilephotoDeleteConfirm(data: any) {
    this.resetUploadStateForField('profile_image');
  }

  profileremovePhoto() {
    this.resetUploadStateForField('profile_image');
  }

  image2DeleteConfirm(data: any) {
    this.resetUploadStateForField('registration_proof');
  }

  removeImageRegistrationProof() {
    this.resetUploadStateForField('registration_proof');
  }

  viewImage(imageURL: string, imageType: string): void {
    console.log('view');

    if (imageType === 'registrationProof') {
      this.ViewImage = 1;
    } else if (imageType === 'idProof') {
      this.ViewImage = 2;
    } else if (imageType === 'profilePhoto') {
      this.ViewImage = 3;
    }

    this.GetImage(imageURL, imageType);
  }

  sanitizedLink: any = '';
  sanitizedLinkRegistrationProof: any = '';
  sanitizedLinkProfilePhoto: any = '';
  GetImage(link: string, imageType: string) {
    console.log('Getting Image');
    let imagePath = '';

    if (imageType === 'registrationProof') {
      imagePath = this.api.retriveimgUrl + 'doctorRegistrationProof/' + link;
    } else if (imageType === 'idProof') {
      imagePath = this.api.retriveimgUrl + 'doctorIdProof/' + link;
    } else if (imageType === 'profilePhoto') {
      imagePath = this.api.retriveimgUrl + 'doctorProfilePhoto/' + link;
    }

    if (imageType === 'registrationProof') {
      this.sanitizedLinkRegistrationProof =
        this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
      this.imageshow = this.sanitizedLinkRegistrationProof;
    } else if (imageType === 'idProof') {
      this.sanitizedLink =
        this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
      this.imageshow = this.sanitizedLink;
    } else if (imageType === 'profilePhoto') {
      this.sanitizedLinkProfilePhoto =
        this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
      this.imageshow = this.sanitizedLinkProfilePhoto;
    }

    console.log('Image path:', imagePath);

    this.ImageModalVisible = true;
  }

  save(addNew: boolean, form: NgForm): void {
    //
    let isOk = true;

    if (
      (this.data.name == '' ||
        this.data.name == null ||
        this.data.name == undefined) &&
      (this.data.email_id == '' ||
        this.data.email_id == null ||
        this.data.email_id == undefined) &&
      (this.data.mobile_number <= 0 ||
        this.data.mobile_number == null ||
        this.data.mobile_number == undefined) &&
      (this.data.identity_doc == '' ||
        this.data.identity_doc == null ||
        this.data.identity_doc == undefined) &&
      (this.data.address_line_1 == '' ||
        this.data.address_line_1 == null ||
        this.data.address_line_1 == undefined) &&
      (this.data.registration_number == '' ||
        this.data.registration_number == null ||
        this.data.registration_number == undefined) &&
      (this.data.registration_council_id <= 0 ||
        this.data.registration_council_id == null ||
        this.data.registration_council_id == undefined) &&
      (this.data.registration_year == '' ||
        this.data.registration_year == null ||
        this.data.registration_year == undefined) &&
      (this.data.registration_proof == '' ||
        this.data.registration_proof == null ||
        this.data.registration_proof == undefined) &&
      (this.data.experience <= 0 ||
        this.data.experience == null ||
        this.data.experience == undefined) &&
      (this.data.country_id <= 0 ||
        this.data.country_id == null ||
        this.data.country_id == undefined) &&
      (this.data.state_id <= 0 ||
        this.data.state_id == null ||
        this.data.state_id == undefined) &&
      (this.data.district_id <= 0 ||
        this.data.district_id == null ||
        this.data.district_id == undefined) &&
      (this.data.pincode_id <= 0 ||
        this.data.pincode_id == null ||
        this.data.pincode_id == undefined)
    ) {
      isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == null ||
      this.data.name.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Doctor Name ', '');
    }
    else if (
      this.data.mobile_number == null ||
      this.data.mobile_number == undefined ||
      this.data.mobile_number <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(this.data.mobile_number.toString())
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    }

    else if (
      this.data.identity_doc == undefined ||
      this.data.identity_doc == null ||
      this.data.identity_doc.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Upload Identity Document', '');
    }
    else if (
      this.data.registration_number == undefined ||
      this.data.registration_number == null ||
      this.data.registration_number == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Registration Number', '');
    } else if (
      this.data.registration_number == undefined ||
      this.data.registration_number == null ||
      this.data.registration_number == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Registration Number', '');
    } else if (!/^[A-Za-z0-9]{4}-[A-Z]{2}-\d{4}$/.test(this.data.registration_number)) {
      isOk = false;
      this.message.error('Invalid Registration Number Format. Please enter in the format 1234-MH-2023 (ID-State-Year Code).', '');
    }

    else if (
      this.data.registration_council_id == undefined ||
      this.data.registration_council_id == null ||
      this.data.registration_council_id <= 0
    ) {
      isOk = false;
      this.message.error('Please Select Registration Council', '');
    }
    else if (
      this.data.registration_year == undefined ||
      this.data.registration_year == null ||
      this.data.registration_year == ''
    ) {
      isOk = false;
      this.message.error('Please Select Registration Year', '');
    }
    else if (
      this.data.registration_proof == undefined ||
      this.data.registration_proof == null ||
      this.data.registration_proof.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Upload Registration Proof Document', '');
    }
    else if (
      this.data.experience == undefined ||
      this.data.experience == null ||
      this.data.experience <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Experience', '');
    }
    else if (
      this.data.address_line_1 == undefined ||
      this.data.address_line_1 == null ||
      this.data.address_line_1.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Address 1', '');
    } else if (
      this.data.country_id == undefined ||
      this.data.country_id == null ||
      this.data.country_id <= 0
    ) {
      isOk = false;
      this.message.error(' Please Select Country', '');
    } else if (
      this.data.state_id == undefined ||
      this.data.state_id == null ||
      this.data.state_id <= 0
    ) {
      isOk = false;
      this.message.error(' Please Select State', '');
    } else if (
      this.data.district_id == undefined ||
      this.data.district_id == null ||
      this.data.district_id <= 0
    ) {
      isOk = false;
      this.message.error(' Please Select District', '');
    } else if (
      this.data.pincode_id == null ||
      this.data.pincode_id == undefined ||
      this.data.pincode_id <= 0
    ) {
      isOk = false;
      this.message.error('Please Select Pincode', '');
    } else if (
      !this.data.id &&
      (this.data.password == undefined ||
        this.data.password == null ||
        this.data.password.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (
      !this.data.id &&
      this.data.password &&
      this.data.password.length < 8
    ) {
      isOk = false;
      this.message.error('Password must be at least 8 characters', '');
    }



    // console.log(this.data.REGISTRATION_YEAR);

    if (isOk) {
      // this.data.USER_ID = this.commonFunction.decryptdata(this.sessionValue);
      this.data.registration_year = this.datePipe.transform(
        this.data.registration_year,
        'yyyy'
      );

      this.isSpinning = true;

      if (this.data.id) {
        this.api.updateDoctor(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              const responseBody = response.body;
              this.message.success('Doctor Details Updated Successfully', '');
              if (!addNew) this.drawerClose();
            }
            // else if (statusCode && statusCode.code === '300') {
            //   this.message.error(
            //     'Mobile Number or Email ID Already Exist...',
            //     ''
            //   );
            // }
            else {
              this.message.error('Doctor Details Updation Failed', '');
            }
            this.isSpinning = false;
          },
          (error: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong...', '');
          }
        );
      } else {
        this.api.createDoctor(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              const responseBody = response.body;

              // let creatorId = this.commonFunction.decryptdata(sessionStorage.getItem('userId') || '');
              // let storageKey = 'createdDoctors_' + creatorId;
              // let existingUserIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
              // if (!existingUserIDs.includes(responseBody.user_id)) {
              //     existingUserIDs.push(responseBody.user_id);
              // }
              // localStorage.setItem(storageKey, JSON.stringify(existingUserIDs));
              // localStorage.setItem('userID', responseBody.user_id); // Keeping for backward compatibility

              this.message.success('Doctor Details Created Successfully', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new DoctorMaster();
                this.resetDrawer(form);
              }
            }
            // else if (responseBody && responseBody.code === '300') {
            //   this.message.error(
            //     'Mobile Number or Email ID Already Exist...',
            //     ''
            //   );
            // }
            else {
              this.message.error('Doctor Details Creation Failed', '');
            }
            this.isSpinning = false;
          },
          (error: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong...', '');
          }
        );
      }
    }
  }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(doctorPage: NgForm) {
    this.data = new DoctorMaster();
    this.passwordVisible = false;
    doctorPage.form.markAsPristine();
    doctorPage.form.markAsUntouched();
  }
}
