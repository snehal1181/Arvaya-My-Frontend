import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { CityMaster } from '../../../Models/City';
import { LabMaster } from '../../../Models/LabMaster';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare let L: any;

@Component({
  selector: 'app-addlab',
  templateUrl: './addlab.component.html',
  styleUrls: ['./addlab.component.css'],
})
export class AddlabComponent {
  @Input() drawerClose!: Function;
  @Input() data: LabMaster = new LabMaster();
  @Input() dataList: any[] = [];
  @Input() data2: LabMaster[] = [];
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;

  @Input() districtData: any;
  @Input() stateData: any;
  passwordVisible = false;
  isChangeable = true;

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;
  urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  // mapDraweVisible = false;
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }

  // public commonFunction = new CommonFunctionService();
  sessionValue: any = Number(sessionStorage.getItem('userId'));

  ngOnInit(): void {
    this.getCountyData(); // Replace with a valid default country ID
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = { lat: position.coords.latitude, lng: position.coords.longitude }
          // initMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation failed, falling back to default:', error);
          // initMap(20.5937, 78.9629); // Default to India center
        }
      );
    } else {
      // initMap(20.5937, 78.9629); // Default if geolocation not supported
    }
  }

  // Map

  // mapDrawerTitle = 'Select Location';
  // mapOptions: any;
  // maps: any;
  // marker: any;
  // mapss: any;
  // markers: any;

  // openmapModal() {
  //   this.mapDraweVisible = true;
  //   setTimeout(() => {
  //     this.loadMap();
  //   }, 10);
  // }

  // closemapModal() {
  //   this.mapDraweVisible = false;
  // }

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

  countryData: any = [];
  getCountyData(): void {
    const filter = `AND IS_ACTIVE = 1`;
    this.api
      .getCountrydropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.countryData = response.body.data;
        } else {
          this.countryData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }
  // stateData: any = [];
  getStateData(value: any): void {
    const filter = `AND IS_ACTIVE = 1 AND COUNTRY_ID = ${value}`;
    this.api
      .getStatedropdown(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        if (statusCode === 200) {
          this.stateData = response.body.data;
        } else {
          this.stateData = [];
          this.message.error(`Something went wrong.`, '');
        }
      });
  }

  //   loadMap() {
  //     let defaultLat: any = 20.5937; // Default latitude
  //     let defaultLng: any = 78.9629; // Default longitude
  //     let zoomLevel: any = 6; // Default zoom level

  //     // Check if LATITUDE and LONGITUDE are present
  //     if (this.data.LATITUDE && this.data.LONGITUDE) {
  //       defaultLat = this.data.LATITUDE;
  //       defaultLng = this.data.LONGITUDE;
  //       zoomLevel = 13; // Zoom in more when a location is set
  //     }
  //     this.mapss = L.map('map').setView([defaultLat, defaultLng], zoomLevel);
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(this.mapss);

  //     if (this.data.LATITUDE && this.data.LONGITUDE) {
  //       this.addMarker(this.data.LATITUDE, this.data.LONGITUDE);
  //     }
  //     this.addSearchControl();
  //     // Add a click event to the map
  //     this.mapss.on('click', (e: any) => {
  //       const lat = e.latlng.lat; // Latitude
  //       const lng = e.latlng.lng;
  //       this.data.LATITUDE = lat;
  //       this.data.LONGITUDE = lng;
  //       this.data.LATITUDE = lat;
  //       this.data.LONGITUDE = lng;
  //       this.addMarker(e.latlng.lat, e.latlng.lng);
  //     });
  //   }

  //   addMarker(lat: number, lng: number) {
  //     // Check if a marker already exists; if so, remove it
  //     if (this.markers) {
  //       this.markers.remove(); // Remove the existing marker
  //     }

  //     // Add a new marker at the clicked location
  //     this.markers = L.marker([lat, lng]).addTo(this.mapss);
  //   }

  //   varm: any;
  //   addSearchControl() {
  //     const searchControl = L.control({ position: 'topright' });
  //     searchControl.onAdd = (map: any) => {
  //       this.varm = map;
  //       const div = L.DomUtil.create('div', 'search-control');

  //       div.innerHTML = `
  //             <nz-row >
  //   <nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="24" [nzMd]="24" [nzLg]="24" [nzXl]="24">
  //     <nz-input-group>
  //       <input
  //         nz-input
  //         id="locationInput"
  //         placeholder="Enter location"
  //         name="searchl"
  //         autocomplete="off"
  //         style="padding: 3px 10px; height: 35px; border: 1px solid #0c8dc9; border-radius: 8px 8px 8px 8px; flex: 1;"
  //       />

  //     </nz-input-group>
  //     <nz-button
  //         nzType="default"
  //         id="searchButton"
  //         (click)="onSearch()">
  //         <img style="border-radius: 8px 8px 8px 8px;border: 1px solid #0c8dc9;" src='/assets/search.jpeg' width="35px"
  //               height="35px">
  //       </nz-button>
  //   </nz-col>
  // </nz-row>

  //         `;

  //       L.DomEvent.disableClickPropagation(div);
  //       L.DomEvent.disableScrollPropagation(div);

  //       // Event listener for the search button
  //       div
  //         .querySelector('#searchButton')
  //         .addEventListener('click', () => this.searchLocation());

  //       return div;
  //     };

  //     searchControl.addTo(this.mapss);
  //   }

  //   searchLocation() {
  //     const locationInput = (
  //       document.getElementById('locationInput') as HTMLInputElement
  //     ).value;

  //     if (locationInput) {
  //       // Use Nominatim API to search for the location
  //       const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
  //         locationInput
  //       )}&format=json&addressdetails=1`;

  //       fetch(url)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           if (data.length > 0) {
  //             const lat = parseFloat(data[0].lat); // Get latitude
  //             const lng = parseFloat(data[0].lon); // Get longitude

  //             // Move the map to the new location and add a marker
  //             this.mapss.setView([lat, lng], 13); // Zoom level can be adjusted

  //             this.data.LATITUDE = lat;
  //             this.data.LONGITUDE = lng;
  //             this.addMarker(lat, lng);
  //           } else {
  //             this.message.error(
  //               'Location not found. Please try another location search.',
  //               ''
  //             );
  //           }
  //         })
  //         .catch((err) => {
  //           this.varm = err;
  //           this.message.error(
  //             'An error occurred while searching for the location.',
  //             ''
  //           );
  //         });
  //     } else {
  //       this.message.info('Please enter a location to search.', '');
  //     }
  //   }

  //   clearSearchBox() {
  //     const locationInput = document.getElementById(
  //       'locationInput'
  //     ) as HTMLInputElement;
  //     if (locationInput) {
  //       locationInput.value = ''; // Clear the search box value
  //     }
  //     this.closemapModal();
  //   }

  // districtData: any = []
  getDistrict(value: any): void {
    const filter = `AND IS_ACTIVE = 1 AND STATE_ID = ${value}`;
    this.api.getdistrict(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      if (statusCode === 200) {
        this.districtData = response.body.data;
      } else {
        this.districtData = [];
        this.message.error(`Something went wrong.`, '');
      }
    });
  }

  // image Upload code

  // REGISTRATION_PROOF
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  ViewImage: any;
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
        .onUpload('labRegistrationProof', this.fileURL, this.UrlImageOne)
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
                  this.message.success(
                    'Registration Proof Uploaded Successfully...',
                    ''
                  );
                  this.data.registration_proof = this.UrlImageOne;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetUploadStateForField('registration_proof');
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Image...', '');
            this.resetUploadStateForField('registration_proof');
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.resetUploadStateForField('registration_proof');
    }
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

  imageshow;
  ImageModalVisible = false;

  GetImage(link: string, imageType: string) {
    console.log('Getting Image');
    let imagePath = '';

    if (imageType === 'registrationProof') {
      imagePath = this.api.retriveimgUrl + 'doctorRegistrationProof/' + link;
    } else if (imageType === 'idProof') {
      imagePath = this.api.retriveimgUrl + 'labRegistrationProof/' + link;
    } else if (imageType === 'profilePhoto') {
      imagePath = this.api.retriveimgUrl + 'labPhoto/' + link;
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

  resetUploadStateForField(field: string) {
    this[`fileURL${field}`] = null;
    this[`isSpinning${field}`] = false;
    this[`progressBar${field}`] = false;
    this[`percent${field}`] = 0;
    this.data[field] = null;
  }

  //  Profile

  UrlProfileImage: any;
  profileprogressBarPhoto: boolean = false;
  profilepercentPhoto = 0;
  timerPhoto: any;
  urlProfileImageShow: boolean = false;
  fileURLProfileImage: any = '';
  progressBarPhoto: any;
  percentPhoto: any;

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
        .onUpload('labPhoto', this.fileURLProfileImage, this.UrlProfileImage)
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
                  this.message.success(' Image Uploaded Successfully...', '');
                  this.data.photo = this.UrlProfileImage;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetUploadStateForField('photo');
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Profile Image...', '');
            this.resetUploadStateForField('photo');
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.resetUploadStateForField('photo');
    }
  }

  profilephotoDeleteConfirm(data: any) {
    this.resetUploadStateForField('photo');
  }

  profileremovePhoto() {
    this.resetUploadStateForField('photo');
  }

  //

  deleteCancel() { }

  IdentityDeleteConfirm(data: any) {
    this.resetUploadStateForField('registration_proof');
  }

  removeImageIdentity() {
    this.resetUploadStateForField('registration_proof');
  }

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  // End Image Upload
  isValidContactNumber(contact: string): boolean {
    const contactPattern =
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,5}\)?[\s-]?)?\d{6,10}$/;
    return contactPattern.test(contact.trim());
  }
  save(addNew: boolean, CityMasterPage: NgForm): void {
    this.isOk = true;
    // if (this.data.NAME == undefined || this.data.NAME == null || this.data.NAME.trim() == "") {
    //   this.isOk = false;
    //   this.message.error('Please Enter Lab Name', '');
    // }

    // else if (
    //   this.data.CONTACT_NUMBER == null ||
    //   this.data.CONTACT_NUMBER == undefined ||
    //   this.data.CONTACT_NUMBER <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Contact Number.', '');
    // }

    // else if (this.data.REGISTRATION_PROOF == undefined || this.data.REGISTRATION_PROOF == "" || this.data.REGISTRATION_PROOF.trim() == "") {
    //   this.isOk = false;
    //   this.message.error('Please Upload Registration Proof', '');
    // }

    // else if (this.data.PHOTO == undefined || this.data.PHOTO == "" || this.data.PHOTO.trim() == "") {
    //   this.isOk = false;
    //   this.message.error('Please Upload Photo Proof', '');
    // }

    // else if (this.data.ADDRESS_LINE_1 == undefined || this.data.ADDRESS_LINE_1 == null || this.data.ADDRESS_LINE_1.trim() == "") {
    //   this.isOk = false;
    //   this.message.error('Please Enter Address Line 1', '');
    // }

    // else if (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) {
    //   this.isOk = false;
    //   this.message.error('Please Select Country', '');
    // }

    // else if (this.data.STATE_ID == undefined || this.data.STATE_ID == null) {
    //   this.isOk = false;
    //   this.message.error('Please Select State', '');
    // }

    // else if (this.data.DISTRICT_ID == undefined || this.data.DISTRICT_ID == null) {
    //   this.isOk = false;
    //   this.message.error('Please Select District', '');
    // }

    // if (!this.data.EMAIL_ID && !this.data.ID) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Email Id', '');
    //   return;
    // }

    // if (this.data.EMAIL_ID && !this.data.ID) {
    //   if (!this.commonFunction.emailpattern.test(this.data.EMAIL_ID)) {
    //     this.isOk = false;
    //     this.message.error('Please Enter Valid Email Id.', '');
    //     return;
    //   }
    // }

    // if (!this.data.MOBILE_NUMBER && !this.data.ID) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Mobile Number.', '');
    //   return;
    // }
    // if (this.data.MOBILE_NUMBER && !this.data.ID) {
    //   if (!this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER)) {
    //     this.isOk = false;
    //     this.message.error('Please Enter Valid Mobile Number.', '');
    //     return;
    //   }
    // }

    // if (!this.data.PASSWORD && !this.data.ID) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Password', '');
    //   return;
    // }

    if (!this.data.name?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter Lab Name', '');
    } else if (!this.data.contact_number || this.data.contact_number <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Contact Number.', '');
    } else if (
      this.data.contact_number &&
      !this.data.id &&
      !this.isValidContactNumber(this.data.contact_number)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Contact Number.', '');
      return;
    } else if (!this.data.registration_proof?.trim()) {
      this.isOk = false;
      this.message.error('Please Upload Registration Proof', '');
    } else if (!this.data.photo?.trim()) {
      this.isOk = false;
      this.message.error('Please Upload Photo Proof', '');
    } else if (!this.data.email_id && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Email Id', '');
      return;
    } else if (
      this.data.email_id &&
      !this.data.id &&
      !this.commonFunction.emailpattern.test(this.data.email_id)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email Id.', '');
      return;
    } else if (!this.data.mobile_number && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
      return;
    } else if (
      this.data.mobile_number &&
      !this.data.id &&
      !this.commonFunction.mobpattern.test(this.data.mobile_number)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
      return;
    } else if (!this.data.password && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
      return;
    } else if (!this.data.address_line_1?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter Address Line 1', '');
    } else if (this.data.country_id == null) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (this.data.state_id == null) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (this.data.district_id == null) {
      this.isOk = false;
      this.message.error('Please Select District', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      // this.data.USER_ID = this.commonFunction.decryptdata(this.sessionValue);
      // this.data.USER_ID = 1;

      // }
      {
        if (this.data.id) {
          this.api
            .updateLabMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);
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
          let rawData = sessionStorage.getItem('userId');
          let userId = rawData
            ? this.commonFunction.decryptdata(rawData)
            : null;
          // if (userId && userId != '1') {
          this.data.user_id = Number(userId);
          // console.log(userId);
          this.api
            .createLabMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new LabMaster();
                  this.resetDrawer(CityMasterPage);
                  this.api.getLabMaster(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      if (data['count'] == 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no = data['data'][0]['seq_no'] + 1;
                      }
                    },
                    () => { }
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
    this.api.getState(1, 1, 'seq_no', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.data.seq_no = 1;
        } else {
          this.data.seq_no = Number(data['data'][0]['seq_no']) + 1;
          this.data.is_active = 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resetDrawer(CityMasterPage: NgForm) {
    this.data = new LabMaster();
    CityMasterPage.form.markAsPristine();
    CityMasterPage.form.markAsUntouched();
    this.citySeq();
  }
  @ViewChild('searchBox') searchBoxRef!: ElementRef;
  @ViewChild('mapContainer') mapContainerRef!: ElementRef;

  map!: google.maps.Map;
  searchBox!: google.maps.places.SearchBox;
  marker!: google.maps.Marker;

  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom = 12;
  selectedMarker: google.maps.LatLngLiteral | null = null;
  mapDraweVisible = false;

  ngAfterViewInit() {
    // Initialize map when modal is opened
  }

  openmapModal() {
    this.mapDraweVisible = true;
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }

  saveSelectedLocation() {
    if (this.selectedMarker) {
      this.data.latitude = this.selectedMarker.lat.toString();
      this.data.longitude = this.selectedMarker.lng.toString();
    }
    this.mapDraweVisible = false;
  }

  initializeMap() {
    if (!this.mapContainerRef || !this.searchBoxRef) return;

    // Initialize Google Map
    this.map = new google.maps.Map(this.mapContainerRef.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      mapTypeId: 'roadmap',
    });

    // Initialize Search Box
    const input = this.searchBoxRef.nativeElement;
    this.searchBox = new google.maps.places.SearchBox(input);

    // Place the search box outside the map
    this.map.controls[google.maps.ControlPosition.TOP_LEFT];

    // Initialize Marker (hidden initially)
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.center,
      visible: false, // Hide until a location is selected
    });

    // Handle place selection
    this.searchBox.addListener('places_changed', () => {
      this.setPlaceFromSearchBox();
    });

    // Handle Enter Key Search
    input.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.setPlaceFromSearchBox();
      }
    });

    // Add marker on map click
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.selectedMarker = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        this.marker.setPosition(this.selectedMarker);
        this.marker.setVisible(true);
        this.map.setCenter(this.selectedMarker);
      }
    });
  }

  setPlaceFromSearchBox() {
    const places = this.searchBox.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (place.geometry?.location) {
      this.selectedMarker = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      // Set marker position
      this.marker.setPosition(this.selectedMarker);
      this.marker.setVisible(true);

      // Center map to the selected location
      this.map.setCenter(this.selectedMarker);
    }
  }
}
