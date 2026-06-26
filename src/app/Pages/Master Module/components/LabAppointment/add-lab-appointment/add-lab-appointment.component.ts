import { Component, Input } from '@angular/core';
import { CityMaster } from '../../../Models/City';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { LabAppointment } from '../../../Models/LabAppointment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-lab-appointment',
  templateUrl: './add-lab-appointment.component.html',
  styleUrls: ['./add-lab-appointment.component.css']
})
export class AddLabAppointmentComponent {
 @Input()
  drawerClose!: Function;
  @Input()
  data: LabAppointment = new LabAppointment();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: LabAppointment[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getPatientData();// Replace with a valid default country ID
   this.getslotData()
   this.getTestData()
   this.getPackageData()
   this.data.NEXT_FOLLOUP_DATE=this.datePipe.transform(new Date(), "yyyy-MM-dd");

  }
  // For Accepting Only Alphabits/ Character

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
  imageshow;
  imageUrl
  fileURL: any = "";
  UrlImageOne;
  PackageData: any = [];
  PatientData: any = [];
  slotData: any = [];
  testData: any = [];
  
  getPatientData() {
    const filter = `AND IS_ACTIVE = 1`;
          this.api.getAllPatientMaster(filter).subscribe(
            (data:HttpResponse<any>) => {
              if (data['status'] == 200) {
                this.PatientData = data.body['data'];
              } else {
                this.PatientData = [];
                // this.message.error('Failed To Get Country Data', '');
              }
            },
            () => {
              this.message.error('Something Went Wrong', '');
            }
          );
        
  }
  getslotData() {
    // const filter = `AND IS_ACTIVE = 1`;
    // this.api.getAllSlotMaster(filter).subscribe(
    //   (data:HttpResponse<any>) => {
    //     if (data['status'] == 200) {
    //       this.slotData = data.body['data'];
    //     } else {
    //       this.slotData = [];
    //     }
    //   },
    //   () => {
    //     this.message.error('Something Went Wrong', '');
    //   }
    // );
  }

  getTestData() {
   
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getAllTestMaster(filter).subscribe(
      (data:HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.testData = data.body['data'];
        } else {
          this.testData = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  getPackageData() {
   const filter = `AND IS_ACTIVE = 1`;
    this.api.getAllPackegeMaster(filter).subscribe(
      (data:HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.PackageData = data.body['data'];
        } else {
          this.PackageData = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  timer: any;
  save(addNew: boolean, LabAppointmentPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.PATIENT_ID == undefined || this.data.PATIENT_ID == null) &&
      (this.data.TEST_ID == undefined || this.data.TEST_ID == null) &&
      (this.data.SLOT_ID == undefined || this.data.SLOT_ID == null) &&
      (this.data.PACKAGE_ID == undefined || this.data.PACKAGE_ID == null) &&
      (this.data.NEXT_FOLLOUP_DATE == undefined || this.data.NEXT_FOLLOUP_DATE == null) &&
      (this.data.NOTES == undefined || this.data.NOTES == "" || this.data.NOTES.trim() == "")
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "");
    }
    else if (this.data.PATIENT_ID == undefined || this.data.PATIENT_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Patient', '');
    }
    else if (this.data.TEST_ID == undefined || this.data.TEST_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Test', '');
    }
    else if (this.data.SLOT_ID == undefined || this.data.SLOT_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Slot', '');
    }  else if (this.data.PACKAGE_ID == undefined || this.data.PACKAGE_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Package', '');
    }
    else if (this.data.NEXT_FOLLOUP_DATE == undefined || this.data.NEXT_FOLLOUP_DATE == null) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    }
    else if (this.data.NOTES == undefined || this.data.NOTES == "" || this.data.NOTES.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Notes', '');
    }
   
    if (this.isOk) {
      this.isSpinning = true;
      {
      
       if (this.data.ID) {
           
            this.isSpinning = true;
            if (this.fileURL != null && this.fileURL != "") {
              // this.timer = this.api.onUpload("StorageImages", this.fileURL, this.fileURL.name).subscribe((res) => {
              //     this.data.REPORT = this.UrlImageOne;
  
              //     if (res.type === HttpEventType.Response) {
              //     }
              //     if (res.type == 4 && res.status == 200) {
              //       if (res.body["code"] == 200) {
              //         this.message.success("File Uploaded Successfully...", "");
              //         this.isSpinning = false;
              //         this.data.REPORT = this.UrlImageOne;
  
                  
  
              //         // this.api.updateLabAppointment(this.data).subscribe((successCode) => {
              //         //   if (successCode.code == '200') {
              //         //     this.message.success('Information Updated Successfully', '');
              //         //     if (!addNew) this.drawerClose();
              //         //     this.isSpinning = false;
              //         //   } else {
              //         //     this.message.error('Information Not Updated', '');
              //         //     this.isSpinning = false;
              //         //   }
              //         // });
              //       }
              //     }
              //     else if (res.type == 2 && res.status != 200) {
              //       this.message.error("Failed To Upload File...", "");
              //       this.isSpinning = false;
                  
              //       this.data.REPORT = null;
              //     }
              //     else {
              //       this.isSpinning = false;
                    
              //       this.data.REPORT = null;
              //     }
              //   });
            }
            else {
              // this.api.updateLabAppointment(this.data).subscribe((successCode) => {
              //   if (successCode.code == '200') {
              //     this.message.success('Information Updated Successfully', '');
              //     if (!addNew) this.drawerClose();
              //     this.isSpinning = false;
              //   } else {
              //     this.message.error('Information Not Updated', '');
              //     this.isSpinning = false;
              //   }
              // });
            }
          } else {
  
            // this.timer = this.api
            //   .onUpload("Images", this.fileURL, this.data.REPORT)
            //   .subscribe((res) => {
            //     this.data.REPORT = this.data.REPORT;
  
            //     if (res.type === HttpEventType.Response) {
            //     }
                
            //     if (res.type == 4 && res.status == 200) {
            //       if (res.body["code"] == 200) {
            //         this.message.success("File Uploaded Successfully...", "");
            //         this.isSpinning = false;
            //         this.data.REPORT = this.UrlImageOne;
            //         // this.api.createLabAppointment(this.data).subscribe((successCode) => {
            //         //   if (successCode.code == '200') {
            //         //     this.message.success('Information Saved Successfully', '');
            //         //     this.isSpinning = false;
            //         //     if (!addNew) this.drawerClose();
            //         //     else {
            //         //       this.resetDrawer(LabAppointmentPage);
            //         //       this.data = new LabAppointment();
            //         //     }
            //         //     this.isSpinning = false;
            //         //   } else {
            //         //     this.message.error('Information Not Saved', '');
            //         //     this.isSpinning = false;
            //         //   }
            //         // });
            //       }
            //     }
            //     // } 
            //     else if (res.type == 2 && res.status != 200) {
            //       this.message.error("Failed To Upload File...", "");
            //       this.isSpinning = false;
                 
            //       this.data.REPORT = null;
            //     }
            //     else {
            //       this.isSpinning = false;
                 
            //       this.data.REPORT = null;
            //     }
            //   });
  
          }
        }
      }
    }
  

  

  
  onFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (
      event.target.files[0].type == "image/jpeg" ||
      event.target.files[0].type == "image/jpg" ||
      event.target.files[0].type == "image/png"
    ) {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL.size > maxFileSize) {
        this.message.error("File size should not exceed 1MB.", "");
        return;
      }
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split(".").pop();
        var d = this.datePipe.transform(new Date(), "yyyyMMdd");
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
        this.UrlImageOne = url;

        if (
          this.data.REPORT != undefined &&
          this.data.REPORT.trim() != ""
        ) {
          var arr = this.data.REPORT.split("/");
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.data.REPORT = this.fileURL.name;
    } else {
      this.message.error("Please Select Only Image File", "");
      this.fileURL = null;
      this.isSpinning = false;
     
      this.data.REPORT = null;
    }
  }

  resetDrawer(LabAppointmentPage: NgForm) {
    this.data = new LabAppointment();
    LabAppointmentPage.form.markAsPristine();
    LabAppointmentPage.form.markAsUntouched();
  }
  deleteCancel() {

  }
  removeImage() {
    this.data.REPORT = " ";
    this.fileURL = null;
  }

  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.REPORT = " ";
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  viewImage(imageURL: string): void {
    console.log('view');

    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = "";

  GetImage(link: string) {
    console.log('Getting Image');
    let imagePath = this.api.retriveimgUrl + "Images/" + link;
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    console.log('Image path:', imagePath);

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
}
