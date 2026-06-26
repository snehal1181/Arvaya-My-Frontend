import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { StateMaster } from '../../../Models/state';
import { HttpResponse } from '@angular/common/http';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
// import { StateMaster } from '../../Models/state';

@Component({
  selector: 'app-addstate',
  templateUrl: './addstate.component.html',
  styleUrls: ['./addstate.component.css'],
})
export class AddstateComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: StateMaster = new StateMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: StateMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  public commonFunction = new CommonFunctionService();



  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getCountyData();
    this.checkState();
  }

  close(): void {
    this.drawerClose();
  }

  countryData: any = [];

  getCountyData() {
    const filter = `AND IS_ACTIVE = 1`;

    this.api.getCountryType(filter).subscribe((response: HttpResponse<any>) => {
      console.log(response);

      const statusCode = response.status;
      const responseBody = response.body;

      if (statusCode === 200 && responseBody?.data) {
        this.countryData = responseBody.data || []; // Ensure fallback to empty array if data is not available
      } else {
        this.countryData = [];
        this.message.error('Failed To Get Country Data', '');
      }
    });
  }

  StateList = [];

  checkState() {
    const filter = ``;

    this.api.getStateType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;

      // console.log(response);

      if (statusCode === 200 && responseBody?.count >= 0) {
        this.StateList = responseBody.data;
        // console.log(this.StateList);
      } else {
        this.StateList = [];
      }
    });
  }
  save(addNew: boolean, StateMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.country_id == undefined || this.data.country_id == null) &&
      (this.data.name == undefined ||
        this.data.name == '' ||
        this.data.name.trim() == '')
      // && (this.data.CODE == undefined || this.data.CODE == "" || this.data.CODE.trim() == "")
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.country_id == undefined ||
      this.data.country_id == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == '' ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter State Name', '');
    } else if (
      this.StateList.some((data) => (data['name'] as string).toLowerCase() === this.data.name.toLowerCase()) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('State Name Already Exists', '');
    }
     else if (
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
            .updateState(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'State Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('State Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createState(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'State Information Saved Successfully',
                  ''
                );
                this.stateSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(StateMasterPage);
                  this.data = new StateMaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('State Information Not Saved', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  stateSeq(): void {
    this.api.getState(1, 1, 'seq_no', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const responseBody = response.body; // Safely access the body of the response
        if (responseBody && responseBody['count'] === 0) {
          this.data.seq_no = 1;
        } else if (responseBody && responseBody['data']?.length > 0) {
          this.data.seq_no = Number(responseBody['data'][0]['seq_no']) + 1;
          this.data.is_active = 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resetDrawer(StateMasterPage: NgForm) {
    this.data = new StateMaster();
    StateMasterPage.form.markAsPristine();
    StateMasterPage.form.markAsUntouched();
  }
}
