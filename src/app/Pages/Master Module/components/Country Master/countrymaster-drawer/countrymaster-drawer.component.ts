import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CountryData } from '../../../Models/CountryMasterData';
import { HttpResponse } from '@angular/common/http';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from '../../../../../Service/CommonFunctionService';

@Component({
  selector: 'app-countrymaster-drawer',
  templateUrl: './countrymaster-drawer.component.html',
  styleUrls: ['./countrymaster-drawer.component.css'],
})
export class CountrymasterDrawerComponent {
  @Input() data: any = CountryData;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  @Input() dataList;
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) {}

  ngOnInit() {
    this.checkCountry();
  }

  CountryList = [];

  checkCountry() {
    const filter = ``;

    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;

      // console.log(response);

      if (statusCode === 200 && responseBody?.count >= 0) {
        this.CountryList = responseBody.data;
        // console.log(this.CountryList);
      } else {
        this.CountryList = [];
      }
    });
  }
  isSpinning = false;
  isOk = true;

  save(addNew: boolean, CountryDrawer: NgForm): void {
    console.log(this.CountryList);

    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.name.trim() == '' ||
        this.data.name == null ||
        this.data.name == undefined) &&
      (this.data.seq_no == undefined ||
        this.data.seq_no == null ||
        this.data.seq_no == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Country Name.', '');
    } else if (
      this.CountryList.some(
        (data) =>
          (data['name'] as string).toLowerCase() ===
          this.data.name.toLowerCase()
      ) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('Country Name Already Exists', '');
    } else if (
      this.data.seq_no == null ||
      this.data.seq_no == undefined ||
      this.data.seq_no == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateCountryData(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              // console.log(statusCode, responseBody, response);

              if (statusCode == 200) {
                this.message.success('Country Data Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Country Data Updation Failed', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createCountryData(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;

              // console.log(statusCode, responseBody, response);

              if (statusCode == 200) {
                this.message.success('Country Data Created Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new CountryData();
                  this.resetDrawer(CountryDrawer);
                  this.api.getCountryData(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      const statusCode = data.status;
                      const responseBody = data.body;

                      // console.log(responseBody);

                      if (statusCode === 200) {
                        if (responseBody?.count == 0) {
                          this.data.seq_no = 1;
                        } else {
                          this.data.seq_no = responseBody.data[0]['seq_no'] + 1;
                        }
                      }
                    },
                    () => {}
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Country Data Creation Failed...', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  resetDrawer(CountryDrawer: NgForm) {
    this.data = new CountryData();
    CountryDrawer.form.markAsPristine();
    CountryDrawer.form.markAsUntouched();
  }
  close() {
    this.drawerClose();
  }
}
