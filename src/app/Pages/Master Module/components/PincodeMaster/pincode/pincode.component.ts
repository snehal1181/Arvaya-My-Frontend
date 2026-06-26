import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { pincode } from '../../../Models/pincode';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from '../../../../../Service/CommonFunctionService';
declare let L: any;
@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css'],
})
export class PincodeComponent {
  @Input() drawerClose: Function;
  @Input() data: pincode;
  @Input() drawerVisible: boolean;
  loadcountries: boolean = false;
  loadstates: boolean = false;
  loaddistract: boolean = false;

  public commonFunction = new CommonFunctionService();
@Input()dataList : any 
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  @Input()district: any;
  @Input()state: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.getCountry();
    // this.getstates('')
    // this.getCityyy1('')
  }

  City1: any = [];
  CountryList: any = [];

  getCountry() {
    this.loadcountries = true;
    const filter = `AND is_active = 1`;
    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      console.log(response);

      const statusCode = response.status;
      const responseBody = response.body;

      if (statusCode === 200) {
        this.CountryList = responseBody.data || [];
      } else {
        this.CountryList = [];
        this.message.error('Failed To Get Country Data', '');
      }
      this.loadcountries = false;
    });
  }


  getstates(event: any) {
    this.loadstates = true;

    if (event) {
      this.data.state_id = null;
      this.data.district_id = null;
      this.state = [];
      this.district = [];
      const filter = `AND is_active = 1 AND country_id = ${event}`;
      this.api.getStateType(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.state = responseBody.data || [];
          } else {
            this.state = [];
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
      this.state = [];
      this.district = [];
      this.loadstates = false;

    }
  }



  getDist(event: any) {
    this.data.district_id = null;
    this.district = [];
    this.loaddistract = true
    if (event) {
      const filter = ` AND is_active = 1 AND state_id = ${event}`;
      this.api.getDistrictType(filter).subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200) {
            this.district = responseBody.data || [];
          } else {
            this.district = [];
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
      this.district = [];
      this.loaddistract = false;

    }
  }

  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    this.data = new pincode();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }

  save(addNew: boolean, accountMasterPage: NgForm): void {
    console.log(accountMasterPage.form.value);

    console.log(this.data , this.dataList);
    
    this.isOk = true;
    if (
      (this.data.country_id <= 0 ||
        this.data.country_id == '' ||
        this.data.country_id == undefined) &&
      (this.data.state_id <= 0 ||
        this.data.state_id == '' ||
        this.data.state_id == undefined) &&
      (this.data.district_id <= 0 ||
        this.data.district_id == '' ||
        this.data.district_id == undefined) &&
      (this.data.area_name == '' ||
        this.data.area_name == null ||
        this.data.area_name == undefined) &&
      (this.data.pincode_number == undefined || this.data.pincode_number == 0)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.country_id <= 0 ||
      this.data.country_id == '' ||
      this.data.country_id == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.state_id <= 0 ||
      this.data.state_id == '' ||
      this.data.state_id == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (
      this.data.district_id <= 0 ||
      this.data.district_id == '' ||
      this.data.district_id == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select District', '');
    } else if (
      this.data.area_name == '' ||
      this.data.area_name == null ||
      this.data.area_name == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Area', '');
    } else if (
      this.data.pincode_number == null ||
      this.data.pincode_number.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Pincode', '');
    }
     else if (
      !this.commonFunction.PincodePatt.test(this.data.pincode_number)
    ) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Pincode', '');
    } 
    else if((this.dataList.some(data => data.pincode_number == this.data.pincode_number) && !this.data.id))
    {
      this.isOk = false;
      this.message.error('Pincode Number Already Exists', '');
 
    }else if (
      this.data.seq_no == null ||
      this.data.seq_no == undefined ||
      this.data.seq_no == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    
    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.id) {
        this.api.updatePincode(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'Pincode Information Updated Successfully',
                ''
              );

              if (!addNew) this.drawerClose();

              this.resetDrawer(accountMasterPage);
            } else {
              this.message.error('Pincode Information Updation Failed', '');
            }

            this.isSpinning = false;
          },
          (error: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('An error occurred while updating Pincode.', '');
          }
        );
      } else {
        this.api.createPincode(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'Pincode Information Saved Successfully',
                ''
              );

              if (!addNew) {
                this.drawerClose();
                this.resetDrawer(accountMasterPage);

              } else {
                this.data = new pincode();
                this.resetDrawer(accountMasterPage);
                this.pincodeSeq();

              }
            } else {
              this.message.error('Cannot save Pincode Information', '');
            }

            this.isSpinning = false;
          },
          (error: HttpErrorResponse) => {
            this.isSpinning = false;
            this.message.error('An error occurred while saving Pincode.', '');
          }
        );
      }
    }
  }

  pincodeSeq(): void {
    this.api
      .getAllPincode(1, 1, 'seq_no', 'desc', '')
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          if (responseBody.count === 0) {
            this.data.seq_no = 1;
          } else {
            this.data.seq_no = Number(responseBody.data[0]?.seq_no || 0) + 1; // Fallback to 0 if seq_no is missing
            this.data.is_active = true;
          }
        } else {
          this.data.seq_no = 1; // Default fallback if response is invalid
          this.data.is_active = false; // Explicitly set inactive in case of failure
        }
      });
  }

  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';

  openmapModal() {
    this.mapDraweVisible = true;
    setTimeout(() => {
      this.loadMap();
    }, 5);
  }
  closemapModal() {
    this.mapDraweVisible = false;
  }

  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  loadMap() {
    let defaultLat = 20.5937; // Default latitude
    let defaultLng = 78.9629; // Default longitude
    let zoomLevel = 6; // Default zoom level

    // Check if latitude and longitude are present
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
