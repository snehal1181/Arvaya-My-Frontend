import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HospitalBillCatalogue } from '../../../Models/HospitalBillCatlog';

@Component({
  selector: 'app-add-hospital-bill-catlog',
  templateUrl: './add-hospital-bill-catlog.component.html',
  styleUrls: ['./add-hospital-bill-catlog.component.css']
})
export class AddHospitalBillCatlogComponent {


  @Input()
  drawerClose!: Function;
  @Input()
  data: HospitalBillCatalogue = new HospitalBillCatalogue();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: HospitalBillCatalogue[] = [];
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
  labs: any;
  modes: any;
  types: any;
  packages: any;
  tests: any;
  hospitals: any;
  consultationModes: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }



  ngOnInit(): void {
    this.getdoctor();
    this.getConsultation();
    this.tax();
  }


  onTaxChange(taxId: number): void {
    const selectedTax = this.taxes.find(tax => tax.ID === taxId);
    if (selectedTax && this.data.bill_amount) {
      const taxValue = parseFloat(selectedTax.VALUE);
      const billAmount = parseFloat(this.data.bill_amount);
      this.data.total_amount = (billAmount + taxValue).toFixed(2);
    } else {
      this.data.total_amount = null;
    }
  }

  contactpattern = /^[0-9\-]$/;

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
  onCountryChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  onStateChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
  }



  doctors: any = []
  getdoctor(): void {
    const filter = ``;
    // const filter = `AND IS_ACTIVE = 1`;
    this.api.getDoctors(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.doctors = response.body.data;
          } else {
            this.doctors = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }


  consultationTypes: any = []



  getConsultation(): void {

    const filter = ``;
    this.api.getconsultationTypes(filter)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.consultationTypes = response.body.data;
          } else {
            this.consultationTypes = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }

  taxes: any = []


  tax(): void {
    //  let extraFilter=''
    // let rawData=sessionStorage.getItem('userId')
    // let userId=rawData?this.commonFunction.decryptdata(rawData):null
    // if(userId && userId!='1'){
    //   extraFilter=" AND USER_ID="+userId
    // }
    const filter = `AND is_active=1 AND hospital_id=` + 1;
    this.api.gettax('')
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            this.taxes = response.body.data;
          } else {
            this.taxes = [];
            this.message.error(`Something went wrong.`, '');
          }
        },
      );
  }



  disabledDate = (current: Date): boolean => {
    // Disable future dates
    const today = new Date();
    if (current > today) {
      return true;
    }
    return false; // Enable other dates
  };

  save(addNew: boolean, HospitalBillCataloguePage: NgForm): void {
    this.isOk = true;

    // if (this.data.DOCTOR_ID == undefined || this.data.DOCTOR_ID == null) {
    //   this.isOk = false;
    //   this.message.error('Please select Name', '');
    // }
    // else if (this.data.CONSULTATION_MODE == undefined || this.data.CONSULTATION_MODE == null) {
    //   this.isOk = false;
    //   this.message.error('Please Select Consultation Mode', '');
    // }

    // else if (
    //   this.data.CONSULTATION_TYPE_ID == null ||
    //   this.data.CONSULTATION_TYPE_ID == undefined

    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Consultation Type.', '');
    // }

    if (this.data.bill_amount == undefined || this.data.bill_amount == "" || this.data.bill_amount.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Bill Amount ', '');
    }

    else if (this.data.tax_id == undefined || this.data.tax_id == "") {
      this.isOk = false;
      this.message.error('Please Select Tax Id', '');
    }

    else if (this.data.total_amount == undefined || this.data.total_amount == null || this.data.bill_amount.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Total Amount', '');
    }

    if (this.isOk) {
      this.isSpinning = true;


      this.data.hospital_id = 1;

      {
        if (this.data.id) {
          this.api
            .updatehospitalbill(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
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
          this.api.createhospitalbill(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              const responseBody = response.body;
              console.log(statusCode, responseBody, response);
              if (statusCode === 200) {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new HospitalBillCatalogue();
                  this.resetDrawer(HospitalBillCataloguePage);
                  this.api.gethospitalbill(0, 0, '', 'desc', '').subscribe(
                    (data: HttpResponse<any>) => {
                      if (data['count'] == 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no = data['data'][0]['SEQ_NO'] + 1;
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

  resetDrawer(HospitalBillCataloguePage: NgForm) {
    this.data = new HospitalBillCatalogue();
    HospitalBillCataloguePage.form.markAsPristine();
    HospitalBillCataloguePage.form.markAsUntouched();
    // this.stateSeq();
  }

}
