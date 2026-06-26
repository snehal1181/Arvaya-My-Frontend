import { Component, Input } from '@angular/core';
import { HolidayMaster } from '../../../Models/HolidayMaster';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-add-holiday-master',
  templateUrl: './add-holiday-master.component.html',
  styleUrls: ['./add-holiday-master.component.css'],
})
export class AddHolidayMasterComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: HolidayMaster = new HolidayMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HolidayMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  labData: any = [];
  loadLabs: boolean = false;
  technicianData: any = [];
  loadTechnicians: boolean = false;
  public commonFunction = new CommonFunctionService();
  // change: any = 'L';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }


  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  userId = sessionStorage.getItem('userId');
  decrepteduserIdString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserid = parseInt(this.decrepteduserIdString, 10);
  ngOnInit(): void {
    // console.log(this.decrepteduserid,'userid');

    // if (this.decreptedroleId == 3) {
    //   this.radiovalue = 'L'

    //   this.getLabData();

    // }

    // else {
    //   this.radiovalue = 'T'
    //   // this.getHospitalData();
    //   this.getLabData();
    // }


    if (this.decreptedroleId == 3) {
      // this.radiovalue = 'L'

      this.radiovalue = 'T'
      this.getmapTechnician();
      this.getLabData();
    }

    else {
      this.getTechniciann();
      this.getLabData();
      // this.getHospitalData();
      // this.getLabData();
    }



    if (this.data.id) {
      this.radiovalue = this.data.technician_id ? 'T' : 'L';
    }


    // this.getTechniciann();

    if (this.data.id) {
      // console.log(this.selectedJobCreatedDate,'uyyuioS')
      this.selectedDate[0] = this.data.start_date
      this.selectedDate[1] = this.data.end_date
    }

  }
  labId = sessionStorage.getItem('labId');
  decreptedlabIDDString = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID = parseInt(this.decreptedlabIDDString, 10);
  getLabData() {
    this.loadLabs = true;
    var extraFilter = ''
    if (this.labID && this.decreptedroleId !== 1) {
      extraFilter = ' AND ID=' + this.labID
    }
    const filter = `AND IS_ACTIVE = 1` + extraFilter;
    this.api.getLabType(filter).subscribe((response: HttpResponse<any>) => {
      // console.log(response);
      const statusCode = response.status;
      const responseBody = response.body;

      if (statusCode === 200 && responseBody?.data) {
        this.labData = responseBody.data || [];
      } else {
        this.labData = [];
        this.message.error('Failed To Get Lab Data', '');
      }
      this.loadLabs = false;
    });
  }




  radiovalue: any = 'T';

  ontypeChange(d: any) {
    if (d == 'L') {
      this.data.technician_id = null;
      this.data['technician_name'] = '';
    } else {
      this.data.lab_id = null;
      this.data['lab_name'] = '';
    }
  }

  holidaychange(data: any) {
    // console.log(data);

    if (data = 'L') {
      this.data.technician_id = undefined;
    } else {
      this.data.lab_id = undefined;
    }
  }
  dateRange: Date[] = [];


  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  getTechniciann() {
    this.loadTechnicians = true;
    const filter = `AND is_active = 1`; // Modify the filter as per requirements
    this.api
      .getLabTechnicians(this.pageIndex, this.pageSize, this.sortKey, '', '')
      .subscribe((response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.technicianData = responseBody.data || [];
        } else {
          this.technicianData = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.loadTechnicians = false;
      });
  }




  getmapTechnician() {
    this.loadTechnicians = true;
    this.api
      .getmapTechnician(this.labID)
      .subscribe((response: HttpResponse<any>) => {
        // console.log(response);

        const statusCode = response.status;
        const responseBody = response.body;

        if (statusCode === 200 && responseBody?.data) {
          this.technicianData = responseBody.data || [];
        } else {
          this.technicianData = [];
          this.message.error('Failed To Get Hospital Data', '');
        }
        this.loadTechnicians = false;
      });
  }







  selectedDate: Date[] = []; // holds the range for form input


  onDateRangeChange() {
    if (
      this.selectedDate &&
      this.selectedDate.length === 2
    ) {
      const [start, end] = this.selectedDate;
      if (start && end) {
        // this.search();
        // this.isJobCreatedDateFilterApplied = true;
      }
    } else {
      this.selectedDate = []; // or [] if you prefer
      // this.search();
      // this.isJobCreatedDateFilterApplied = false;
    }
  }

  save(addNew: boolean, HolidayMasterPage: NgForm): void {
    this.isOk = true;

    if (
      (this.data.name == undefined ||
        this.data.name == '' ||
        this.data.name.trim() == '') &&
      (this.data.technician_id == undefined ||
        this.data.technician_id == null ||
        this.data.technician_id <= 0 && this.radiovalue == 'T') &&

      (this.data.lab_id == undefined ||
        this.data.lab_id == null ||
        this.data.lab_id <= 0 && this.radiovalue == 'l') &&

      // (this.data.DATE == undefined ||
      //   this.data.DATE == '' ||
      //   this.data.DATE == '')
      (!this.selectedDate || this.selectedDate.length !== 2)

    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
    }
    else if (
      (this.data.technician_id == undefined ||
        this.data.technician_id == null ||
        this.data.technician_id <= 0) && this.radiovalue == 'T'
    ) {
      this.isOk = false;
      this.message.error('Please Select Technician', '');
    }
    else if (
      (this.data.lab_id == undefined ||
        this.data.lab_id == null ||
        this.data.lab_id <= 0) && this.radiovalue == 'L'
    ) {
      this.isOk = false;
      this.message.error('Please Select Lab', '');
    } else if (
      this.data.name == undefined ||
      this.data.name == '' ||
      this.data.name.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Holiday', '');
    }
    // else if (
    //   this.data.DATE == undefined ||
    //   this.data.DATE == '' ||
    //   this.data.DATE == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Date', '');
    // }

    else if (
      !this.selectedDate ||
      this.selectedDate.length !== 2
    ) {
      this.isOk = false;
      this.message.error('Please select valid date range', '');
    }

    if (this.isOk) {
      // this.data.DATE = this.datePipe.transform(
      //   new Date(this.data.DATE),
      //   ' yyyy-MM-dd HH:mm:ss'
      // );


      // Add formatted date range
      // if (this.selectedJobCreatedDate?.length === 2) {
      //   this.data.START_DATE = this.datePipe.transform(
      //     new Date(this.selectedJobCreatedDate[0]),
      //     'yyyy-MM-dd HH:mm:ss'
      //   );
      //   this.data.END_DATE = this.datePipe.transform(
      //     new Date(this.selectedJobCreatedDate[1]),
      //     'yyyy-MM-dd HH:mm:ss'
      //   );
      // }



      if (this.selectedDate && this.selectedDate.length === 2) {
        const [start, end] = this.selectedDate;
        this.data.start_date = this.datePipe.transform(start, 'yyyy-MM-dd HH:mm');
        this.data.end_date = this.datePipe.transform(end, 'yyyy-MM-dd HH:mm');
      } else {
        this.data.start_date = null;
        this.data.end_date = null;
      }

      // if (
      //   this.selectedJobCreatedDate &&
      //   this.selectedJobCreatedDate.length === 2
      // ) {
      //   const [start, end] = this.selectedJobCreatedDate;
      //   this.data.START_DATE = start;
      //   this.data.END_DATE = end;
      // } else {
      //   this.data.START_DATE = '';
      //   this.data.END_DATE = '';
      // }

      this.data.user_id = this.userId
        ? this.commonFunction.decryptdata(this.userId)
        : '';
      this.isSpinning = true;

      if (this.data.id) {
        // Update Holiday Data
        this.api.updateHoliday(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'Holiday Information Updated Successfully',
                ''
              );

              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Holiday Information Not Updated', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error(
              'An error occurred while updating Holiday Information.',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        // Create Holiday Data
        this.api.createHoliday(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success(
                'Holiday Information Saved Successfully',
                ''
              );
              if (!addNew) {
                this.drawerClose();
              } else {
                this.resetDrawer(HolidayMasterPage);
                this.data = new HolidayMaster();
              }
            } else {
              this.message.error('Holiday Information Not Saved', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error(
              'An error occurred while saving Holiday Information.',
              ''
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }

  resetDrawer(HolidayMasterPage: NgForm) {
    this.data = new HolidayMaster();
    HolidayMasterPage.form.markAsPristine();
    HolidayMasterPage.form.markAsUntouched();
  }

  close(): void {
    this.drawerClose();
  }
}
