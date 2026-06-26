import { Component, Input } from '@angular/core';
import { RegistrationCouncil } from '../../../Models/RegistrationCouncil';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-registration-council',
  templateUrl: './add-registration-council.component.html',
  styleUrls: ['./add-registration-council.component.css'],
})
export class AddRegistrationCouncilComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: RegistrationCouncil = new RegistrationCouncil();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: RegistrationCouncil[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  stateData: any = [];
  loadstates: boolean = false;

  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getStateData();
    this.checkCouncil()
  }

  getStateData() {
    const filter = `AND is_active = 1`;
    this.api.getStateType(filter).subscribe(
      (response: HttpResponse<any>) => {
        console.log('responseeeeeeeeeeeeee', response)

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200) {
          this.stateData = responseBody['data'];
        } else {
          this.stateData = [];
          this.message.error('Failed To Get State Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  CouncilList = [];

  checkCouncil() {
    const filter = ``;

    this.api.getCouncilType(filter).subscribe((response: HttpResponse<any>) => {
      const statusCode = response.status;
      const responseBody = response.body;

      // console.log(response);

      if (statusCode === 200 && responseBody?.count >= 0) {
        this.CouncilList = responseBody.data;
        // console.log(this.CouncilList);
      } else {
        this.CouncilList = [];
      }
    });
  }


  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, councilMasterPage: NgForm): void {
    this.isOk = true;



    if (
      (this.data.state_id <= 0 ||
        this.data.state_id == '' ||
        this.data.state_id == undefined) &&
      (this.data.name == '' ||
        this.data.name == null ||
        this.data.name == undefined) &&
      (this.data.seq_no == undefined || this.data.seq_no <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.state_id <= 0 ||
      this.data.state_id == '' ||
      this.data.state_id == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (
      this.data.name == '' ||
      this.data.name == null ||
      this.data.name == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.CouncilList.some((data) => (data['name'] as string).toLowerCase() === this.data.name.toLowerCase()) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('Registration Council Already Exists', '');
    } else if (this.data.seq_no == undefined || this.data.seq_no <= 0) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Sequence Number', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateCouncilMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'Registration Council Information Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Registration Council Information Not Updated',
                  ''
                );
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createCouncilMaster(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;

              if (statusCode === 200) {
                this.message.success(
                  'Registration Council Information Saved Successfully',
                  ''
                );
                this.CouncilSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(councilMasterPage);
                  this.data = new RegistrationCouncil();
                }
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Registration Council Information Not Saved',
                  ''
                );
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  CouncilSeq(): void {
    this.api.getCouncilMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (response: HttpResponse<any>) => {
        const responseBody = response.body; // Safely access the body of the response
        if (responseBody && responseBody['count'] === 0) {
          this.data.seq_no = 1;
        } else if (responseBody && responseBody['data']?.length > 0) {
          this.data.seq_no = Number(responseBody['data'][0]['SEQ_NO']) + 1;
          this.data.is_active = true;
        }
      },
      (err) => {

      }
    );
  }

  resetDrawer(councilMasterPage: NgForm) {
    this.data = new RegistrationCouncil();
    councilMasterPage.form.markAsPristine();
    councilMasterPage.form.markAsUntouched();
  }
}
