import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HospitalClinicMaster } from '../../../Models/HospitalClinicMaster';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
declare let L: any;
@Component({
  selector: 'app-hospital-clinic-master-form',
  templateUrl: './hospital-clinic-master-form.component.html',
  styleUrls: ['./hospital-clinic-master-form.component.css'],
})
export class HospitalClinicMasterFormComponent {
  @Input() countryid;
  @Input() stateid;
  @Input() districtid;
  @Input()
  drawerClose!: Function;
  passwordVisible = false;
  isChangeable = true;

  @Input()
  data: HospitalClinicMaster = new HospitalClinicMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HospitalClinicMaster[] = [];
  public commonFunction = new CommonFunctionService();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  progressBarPhoto: any;
  percentPhoto: any;
  filePhotoURL: any;
  urlPhoto: any;
  urlPhotoShow: boolean;
  stateload: boolean;
  States: any = [];
  districtload: boolean;
  districts: any = [];
  pincodeload: boolean;
  pincodes: any = [];
  countryload: boolean;
  countries: any = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getCountyData();
    this.getStateList();
    this.getDistricts();
    this.getPinCodes();
    if (this.countryid & this.stateid && this.districtid) {
      this.onCountryChange(this.countryid);
      this.onStateChange(this.stateid);
      this.onDistrictChange(this.districtid);
    }
  }
  contactpattern = /^[0-9\-]$/;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  // For Accepting Only Alphabits/ Character
  onKeyPress(event: KeyboardEvent): boolean {
    const allowedChars = /^[0-9\-]$/; // Only digits and dashes
    const key = event.key;

    if (!allowedChars.test(key)) {
      // this.errorMessage = 'Only numbers and dashes are allowed';
      event.preventDefault();
      return false;
    }

    // this.errorMessage = ''; // Clear error if valid
    return true;
  }

  close(): void {
    this.drawerClose();
  }
  onCountryChange($event: any) {
    if ($event) {
      // throw new Error('Method not implemented.');
      let filter = ' AND COUNTRY_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.stateload = true;
      this.api.getStateType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.stateload = false;
            this.States = res.body.data;
          } else {
            this.stateload = false;
            this.States = [];
          }
        },
        (err: any) => {
          this.stateload = false;
        }
      );
    } else {
      this.data.state_id = null;
      this.data.district_id = null;
      this.data.pincode_id = null;
    }
  }
  onStateChange($event: any) {
    // throw new Error('Method not implemented.');
    if ($event) {
      let filter = ' AND STATE_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.districtload = true;
      this.api.getDistrictType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.districtload = false;
            this.districts = res.body.data;
          } else {
            this.districtload = false;
            this.districts = [];
          }
        },
        (err: any) => {
          this.districtload = false;
        }
      );
    } else {
      this.data.district_id = null;
      this.data.pincode_id = null;
    }
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
    if ($event) {
      let filter = ' AND DISTRICT_ID= ' + $event + ' AND IS_ACTIVE=1';
      this.pincodeload = true;
      this.api.getPincodeType(filter).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200 && res.body.count > 0) {
            this.pincodeload = false;
            this.pincodes = res.body.data;
          } else {
            this.pincodeload = false;
            this.pincodes = [];
          }
        },
        (err: any) => {
          this.pincodeload = false;
        }
      );
    } else {
      this.data.pincode_id = null;
    }
  }

  countryData: any = [];
  getCountyData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.countryload = true;
    this.api.getCountryDropdown(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.countryload = false;

          this.countries = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.countries = [];
          this.countryload = false;

          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.countryload = false;
      }
    );
  }
  getStateList() {
    const filter = `AND IS_ACTIVE = 1`;
    this.stateload = true;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.stateload = false;

          this.States = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.States = [];
          this.stateload = false;

          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.stateload = false;
      }
    );
  }
  getDistricts() {
    const filter = `AND IS_ACTIVE = 1`;
    this.districtload = true;
    this.api.getDistrictType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.districtload = false;
          this.districts = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.districts = [];
          this.districtload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.districtload = false;
      }
    );
  }
  getPinCodes() {
    const filter = `AND IS_ACTIVE = 1`;
    this.pincodeload = true;
    this.api.getPincodeType(filter).subscribe(
      (response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.pincodeload = false;
          this.pincodes = responseBody.data || []; // Ensure fallback to empty array if data is not available
        } else {
          this.pincodes = [];
          this.pincodeload = false;
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      (err: any) => {
        this.pincodeload = false;
      }
    );
  }
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.UrlImageOne = url;
        if (
          this.data.registration_proof != undefined &&
          this.data.registration_proof.trim() != ''
        ) {
          var arr = this.data.registration_proof.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarImageOne = true;
      this.urlImageOneShow = true;
      this.isSpinning = true;
      // console.log(this.fileURL);

      this.timer = this.api
        .onUpload('HospitalRegistrationPhoto', this.fileURL, this.UrlImageOne)
        .subscribe(
          (res: HttpEvent<any>) => {
            // console.log(res);

            switch (res.type) {
              case 1:
                HttpEventType.UploadProgress;
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
                this.percentImageOne = percentDone;
                // console.log(`Progress: ${percentDone}%`);

                if (this.percentImageOne === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarImageOne = false;
                  }, 2000);
                }
                break;

              case 2:
                HttpEventType.ResponseHeader;
                // console.log('Response Headers Received:', res);
                // You can handle any specific logic for response headers if needed
                break;

              case 3:
                HttpEventType.DownloadProgress;
                // console.log('Download Progress:', res.loaded, '/', res.total);
                break;

              case 4:
                HttpEventType.Response;
                if (res.status === 200 && res.body?.message === 'Success') {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.data.registration_proof = this.UrlImageOne;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetUploadState();
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            console.error('Upload failed:', error);
            this.message.error('Failed To Upload Image...', '');
            this.resetUploadState();
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.registration_proof = null;
    }
  }
  resetUploadState(): void {
    this.isSpinning = false; // Stop the spinner
    this.progressBarImageOne = false; // Hide the progress bar
    this.percentImageOne = 0; // Reset the progress percentage
    this.data.registration_proof = null; // Clear the uploaded file reference
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
  viewImage(imageURL: string): void {
    // console.log('view');

    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    // console.log('Getting Image');
    let imagePath =
      this.api.retriveimgUrl + 'HospitalRegistrationPhoto/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    // console.log('Image path:', imagePath);

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  deleteCancel() { }
  removeImage() {
    this.data.registration_proof = ' ';
    this.fileURL = null;
  }
  removePhoto() {
    this.data.photo = ' ';
    this.filePhotoURL = null;
  }

  onPhotoFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.filePhotoURL = <File>event.target.files[0];
      if (this.filePhotoURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.filePhotoURL != null) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.filePhotoURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        let url = d == null ? '' : d + number + '.' + fileExt;

        this.urlPhoto = url;
        if (this.data.photo != undefined && this.data.photo.trim() != '') {
          const arr = this.data.photo.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarPhoto = true;
      this.urlPhotoShow = true;
      this.isSpinning = true;
      this.api
        .onUpload('HospitalPhoto', this.filePhotoURL, this.urlPhoto)
        .subscribe(
          (res: HttpEvent<any>) => {
            switch (res.type) {
              case 1:
                HttpEventType.UploadProgress;
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
                this.percentPhoto = percentDone;
                // console.log(`Progress: ${percentDone}%`);

                if (this.percentPhoto === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarPhoto = false;
                  }, 2000);
                }
                break;

              case 2:
                HttpEventType.ResponseHeader;
                // console.log('Response Headers Received:', res);
                // You can handle any specific logic for response headers if needed
                break;

              case 3:
                HttpEventType.DownloadProgress;
                // console.log('Download Progress:', res.loaded, '/', res.total);
                break;

              case 4:
                HttpEventType.Response;
                if (res.status === 200 && res.body?.message === 'Success') {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.data.photo = this.urlPhoto;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetPhotoUploadState();
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            this.message.error('Failed To Upload Image...', '');
            this.resetPhotoUploadState();
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.filePhotoURL = null;
      this.isSpinning = false;
      this.progressBarPhoto = false;
      this.percentPhoto = 0;
      this.data.photo = null;
    }
  }
  resetPhotoUploadState(): void {
    this.isSpinning = false; // Stop the spinner
    this.progressBarPhoto = false; // Hide the progress bar
    this.percentPhoto = 0; // Reset progress percentage
    this.data.photo = null; // Clear the file reference
  }
  photoDeleteConfirm(data: any) {
    this.urlPhoto = null;
    this.data.photo = ' ';
    this.filePhotoURL = null;
  }

  save(addNew: boolean, HospitalClinicMasterPage: NgForm): void {
    this.isOk = true;

    // Validation for required fields
    if (
      !this.data.name?.trim() &&
      !this.data.contact_number?.trim() &&
      !this.data.registration_proof?.trim() &&
      !this.data.photo?.trim() &&
      !this.data.address_line_1?.trim() &&
      !this.data.address_line_2?.trim() &&
      !this.data.country_id &&
      !this.data.state_id &&
      !this.data.district_id
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
      return;
    }
    if (!this.data.contact_number) {
      this.isOk = false;
      this.message.error('Please enter contact number.', '');
      return;
    }
    // if (!this.commonFunction.mobpattern.test(this.data.CONTACT_NUMBER)) {
    //   this.isOk = false;
    //   this.message.error('Please enter a valid contact number.', '');
    //   return;
    // }
    // Validation for specific fields

    if (
      !this.data.registration_proof ||
      this.data.registration_proof?.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload Registration Proof.', '');
      return;
    }
    if (!this.data.photo || this.data.photo?.trim() == '') {
      this.isOk = false;
      this.message.error('Please Upload Photo.', '');
      return;
    }
    if (this.data.website_link) {
      if (!this.commonFunction.urlPattern.test(this.data.website_link)) {
        this.isOk = false;
        this.message.error('Please enter valid website.', '');
        return;
      }
    }
    if (!this.data.address_line_1 || this.data.address_line_1?.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Address Line 1.', '');
      return;
    }
    if (!this.data.address_line_2 || this.data.address_line_2?.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Address Line 2.', '');
      return;
    }
    if (!this.data.country_id) {
      this.isOk = false;
      this.message.error('Please select a country.', '');
      return;
    }

    if (!this.data.state_id) {
      this.isOk = false;
      this.message.error('Please select a state.', '');
      return;
    }

    if (!this.data.district_id) {
      this.isOk = false;
      this.message.error('Please select a district.', '');
      return;
    }

    if (!this.data.email_id && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Email Id', '');
      return;
    }

    if (this.data.email_id && !this.data.id) {
      if (!this.commonFunction.emailpattern.test(this.data.email_id)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Email Id.', '');
        return;
      }
    }

    if (!this.data.contact_number && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
      return;
    }
    if (this.data.contact_number && !this.data.id) {
      if (!this.commonFunction.mobpattern.test(this.data.contact_number)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Mobile Number.', '');
        return;
      }
    }

    if (!this.data.password && !this.data.id) {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
      return;
    }

    // Proceed if all validations pass
    if (this.isOk) {
      this.isSpinning = true;
      // let rawData = sessionStorage.getItem('userId');
      // this.data.USER_ID = rawData
      //   ? this.commonFunction.decryptdata(rawData)
      //   : null;
      if (this.data.id) {
        // Update logic
        this.api.updateHospitalClinic(this.data).subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              this.message.success('Information updated successfully.', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Information not updated.', '');
            }
            this.isSpinning = false;
          },
          (error) => {
            this.message.error('Failed to update information.', '');
            this.isSpinning = false;
          }
        );
      } else {
        // Create logic
        this.api.createHospitalClinics(this.data).subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              this.message.success('Information saved successfully.', '');
              this.isSpinning = false;

              if (!addNew) {
                this.drawerClose();
              } else {
                this.resetDrawer(HospitalClinicMasterPage);
                this.data = new HospitalClinicMaster();
                if (res.body.data.count == 0) {
                  this.data.seq_no = 1;
                } else {
                  this.data.seq_no = res.body.data.data[0]['seq_no'] + 1;
                }
              }
            } else {
              this.message.error('Information not saved.', '');
              this.isSpinning = false;
            }
          },
          (error) => {
            this.message.error('Failed to save information.', '');
            this.isSpinning = false;
          }
        );
      }
    }
  }

  // stateSeq(): void {
  //   this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(
  //     (data) => {
  //       if (data['count'] == 0) {
  //         this.data.SEQ_NO = 1;
  //       } else {
  //         this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
  //         this.data.IS_ACTIVE = true;
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  resetDrawer(HospitalClinicMasterPage: NgForm) {
    this.data = new HospitalClinicMaster();
    HospitalClinicMasterPage.form.markAsPristine();
    HospitalClinicMasterPage.form.markAsUntouched();
    // this.stateSeq();
  }

  // Map
  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';
  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  openmapModal() {
    this.mapDraweVisible = true;
    setTimeout(() => {
      this.loadMap();
    }, 5);
  }
  closemapModal() {
    this.mapDraweVisible = false;
  }
  loadMap() {
    let defaultLat = 20.5937; // Default latitude
    let defaultLng = 78.9629; // Default longitude
    let zoomLevel = 6; // Default zoom level

    // Check if LATITUDE and LONGITUDE are present
    if (this.data.latitude && this.data.longitude) {
      defaultLat = this.data.latitude;
      defaultLng = this.data.longitude;
      zoomLevel = 13; // Zoom in more when a location is set
    }
    this.mapss = L.map('map').setView([defaultLat, defaultLng], zoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapss);

    if (this.data.latitude && this.data.longitude) {
      this.addMarker(this.data.latitude, this.data.longitude);
    }
    this.addSearchControl();
    // Add a click event to the map
    this.mapss.on('click', (e: any) => {
      const lat = e.latlng.lat; // Latitude
      const lng = e.latlng.lng;
      this.data.latitude = lat;
      this.data.longitude = lng;
      this.data.latitude = lat;
      this.data.longitude = lng;
      this.addMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  addMarker(lat: number, lng: number) {
    // Check if a marker already exists; if so, remove it
    if (this.markers) {
      this.markers.remove(); // Remove the existing marker
    }

    // Add a new marker at the clicked location
    this.markers = L.marker([lat, lng]).addTo(this.mapss);
  }
  varm: any;
  addSearchControl() {
    const searchControl = L.control({ position: 'topright' });
    searchControl.onAdd = (map: any) => {
      this.varm = map;
      const div = L.DomUtil.create('div', 'search-control');

      div.innerHTML = `
            <nz-row >
  <nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="24" [nzMd]="24" [nzLg]="24" [nzXl]="24">
    <nz-input-group>
      <input
        nz-input
        id="locationInput"
        placeholder="Enter location"
        name="searchl"
        autocomplete="off"
        style="padding: 3px 10px; height: 35px; border: 1px solid #0c8dc9; border-radius: 8px 8px 8px 8px; flex: 1;"
      />
     
    </nz-input-group>
    <nz-button
        nzType="default"
        id="searchButton"
        (click)="onSearch()">
        <img style="border-radius: 8px 8px 8px 8px;border: 1px solid #0c8dc9;" src='/assets/search.jpeg' width="35px"
              height="35px">
      </nz-button>
  </nz-col>
</nz-row>
 
        `;

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      // Event listener for the search button
      div
        .querySelector('#searchButton')
        .addEventListener('click', () => this.searchLocation());

      return div;
    };

    searchControl.addTo(this.mapss);
  }

  searchLocation() {
    const locationInput = (
      document.getElementById('locationInput') as HTMLInputElement
    ).value;

    if (locationInput) {
      // Use Nominatim API to search for the location
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationInput
      )}&format=json&addressdetails=1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat); // Get latitude
            const lng = parseFloat(data[0].lon); // Get longitude

            // Move the map to the new location and add a marker
            this.mapss.setView([lat, lng], 13); // Zoom level can be adjusted

            this.data.latitude = lat;
            this.data.longitude = lng;
            this.addMarker(lat, lng);
          } else {
            this.message.error(
              'Location not found. Please try another location search.',
              ''
            );
          }
        })
        .catch((err) => {
          this.varm = err;
          this.message.error(
            'An error occurred while searching for the location.',
            ''
          );
        });
    } else {
      this.message.info('Please enter a location to search.', '');
    }
  }
  clearSearchBox() {
    const locationInput = document.getElementById(
      'locationInput'
    ) as HTMLInputElement;
    if (locationInput) {
      locationInput.value = ''; // Clear the search box value
    }
    this.closemapModal();
  }
}
