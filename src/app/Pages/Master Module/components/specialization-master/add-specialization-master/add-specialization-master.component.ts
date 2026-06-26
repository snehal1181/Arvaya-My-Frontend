import { Component, Input } from '@angular/core';
import { SpecializationMaster } from '../../../Models/SpecializationMaster';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { CommonFunctionService } from '../../../../../Service/CommonFunctionService';

@Component({
  selector: 'app-add-specialization-master',
  templateUrl: './add-specialization-master.component.html',
  styleUrls: ['./add-specialization-master.component.css']
})
export class AddSpecializationMasterComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: SpecializationMaster = new SpecializationMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: SpecializationMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  
  public commonFunction = new CommonFunctionService();
  SpecalizationDatabaseList : any

  specializationTypes = [
    // { id: 'H', label: 'Hospital' },
    { id: 'L', label: 'Lab' },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
  }
  // For Accepting Only Alphabits/ Character


  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, SpecializationMasterPage: NgForm): void {
    this.isOk = true;
  
    console.log(this.data);
  
    // Validate required fields
    if (
      (this.data.profession == '' || this.data.profession == null || this.data.profession == undefined) &&
      (this.data.specialization == '' || this.data.specialization == null || this.data.specialization == undefined) &&
      (this.data.specialization_type == '' || this.data.specialization_type == null || this.data.specialization_type == undefined) &&
      (this.data.seq_no == undefined || this.data.seq_no <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.profession == '' ||
      this.data.profession == null ||
      this.data.profession == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Profession', '');
    } else if (
      this.data.specialization == '' ||
      this.data.specialization == null ||
      this.data.specialization == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Specialization Name', '');
    } else if (
      this.data.specialization_type == '' ||
      this.data.specialization_type == null ||
      this.data.specialization_type == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Specialization Type', '');
    } else if (!this.data.id) { // Only check specialization when id is not present (new entry)
      this.checkSpecalization().then((isUnique: boolean) => {
        if (!isUnique) {
          this.isOk = false;
          this.message.error(
            'A specialization with the same Profession, Specialization, and Specialization Type already exists. Please choose different values.',
            ''
          );
          
        }
  
        // After checkSpecalization, proceed to save the data if everything is valid
        if (this.isOk) {
          if (this.data.seq_no == undefined || this.data.seq_no <= 0) {
            this.isOk = false;
            this.message.error('Please Enter a Valid Sequence Number', '');
          }
  
          if (this.isOk) {
            this.isSpinning = true;
            this.data.is_active = this.data.is_active ? 1 : 0;
            // Call createSpecialization if it's a new entry (no id)
            this.api.createSpecialization(this.data).subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
  
              if (statusCode === 200) {
                this.message.success('Specialization Information Saved Successfully', '');
                this.specalizationSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(SpecializationMasterPage);
                  this.data = new SpecializationMaster();
                }
              } else {
                this.message.error('Specialization Information Not Saved', '');
                this.isSpinning = false;
              }
            });
          }
        }
      }).catch((error) => {
        this.isOk = false;
        this.message.error('Error while checking specialization', '');
        console.error('Error checking specialization:', error);
      });
    } else {
      // Proceed with update if id exists (updateSpecialization)
      if (this.data.seq_no == undefined || this.data.seq_no <= 0) {
        this.isOk = false;
        this.message.error('Please Enter a Valid Sequence Number', '');
      }
  
      if (this.isOk) {
        this.isSpinning = true;
        this.data.is_active = this.data.is_active ? 1 : 0;
        this.api.updateSpecialization(this.data).subscribe((response: HttpResponse<any>) => {
          const statusCode = response.status;
  
          if (statusCode === 200) {
            this.message.success('Specialization Information Updated Successfully', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Specialization Information Not Updated', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  
  checkSpecalization(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const filter = ` AND profession='${this.data.profession}' AND specialization='${this.data.specialization}' AND specialization_type='${this.data.specialization_type}'`;
      this.api.getSpecializationTypeList(filter).subscribe(
        (response: HttpResponse<any>) => {
          const responseBody = response.body;
          const statusCode = response.status;
  
          console.log(response, response.status);
  
          if (responseBody.count !== 0) {
            resolve(false); // Duplicate found
          } else {
            resolve(true); // No duplicate
          }
        },
        (error) => {
          reject(error); // Reject the promise on error
        }
      );
    });
  }
y  

  // save(addNew: boolean, SpecializationMasterPage: NgForm): void {
  //   this.isOk = true;

  //   console.log(this.data);
    

  //   if (
  //     (this.data.PROFESSION == '' || this.data.PROFESSION == null || this.data.PROFESSION == undefined) &&
  //     (this.data.SPECIALIZATION == '' || this.data.SPECIALIZATION == null || this.data.SPECIALIZATION == undefined) &&
  //     (this.data.SPECIALIZATION_TYPE == '' || this.data.SPECIALIZATION_TYPE == null || this.data.SPECIALIZATION_TYPE == undefined) &&
  //     (this.data.SEQ_NO == undefined || this.data.SEQ_NO <= 0)
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please fill all required details', '');
  //   } else if (
  //     this.data.PROFESSION == '' || this.data.PROFESSION == null || this.data.PROFESSION == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Profession', '');
  //   } else if (
  //     this.data.SPECIALIZATION == '' || this.data.SPECIALIZATION == null || this.data.SPECIALIZATION == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Specialization', '');
  //   } else if (
  //     this.data.SPECIALIZATION_TYPE == '' || this.data.SPECIALIZATION_TYPE == null || this.data.SPECIALIZATION_TYPE == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Specialization Type', '');
  //   } else if (
  //     this.data.SEQ_NO == undefined || this.data.SEQ_NO <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter a Valid Sequence Number', '');
  //   } else {
  //     this.isOk = true; // If all validations pass
  //   }

  //   this.checkSpecalization().then((isUnique: boolean) => {

  //     console.log(isUnique);
      
  //     if (!isUnique) {
  //       this.isOk = false;
  //       this.message.error('The combination of Profession, Specialization, and Specialization Type already exists', '');
  //       return;
  //     }
  //   })
    
  //   if (this.isOk) {
  //     this.isSpinning = true;
  //     {
  //       if (this.data.ID) {
  //         this.api.updateSpecialization(this.data).subscribe( (response: HttpResponse<any>) => {
  //           const statusCode = response.status;

  //           if (statusCode === 200) {
  //             this.message.success('Specialization Information Updated Successfully', '');
  //             if (!addNew) this.drawerClose();
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Specialization Information Not Updated', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       } else {
  //         this.api.createSpecialization(this.data).subscribe( (response: HttpResponse<any>) => {
  //           const statusCode = response.status;

  //           if (statusCode === 200) {
  //             this.message.success('Specialization Information Saved Successfully', '');
  //             this.specalizationSeq();
  //             this.isSpinning = false;
  //             if (!addNew) this.drawerClose();
  //             else {
  //               this.resetDrawer(SpecializationMasterPage);
  //               this.data = new SpecializationMaster();
  //             }
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Specialization Information Not Saved', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

  // checkSpecalization(): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     const filter = `PROFESSION=${this.data.PROFESSION} AND SPECIALIZATION=${this.data.SPECIALIZATION} AND SPECIALIZATION_TYPE=${this.data.SPECIALIZATION_TYPE}`;
  //     this.api.getTechnicianServiceMapList(filter).subscribe((response: HttpResponse<any>) => {
  //       if (response.status === 200 && response.body?.count > 0) {
  //         resolve(false); // Duplicate found
  //       } else {
  //         resolve(true); // No duplicate
  //       }
  //     });
  //   });

  // }
  specalizationSeq(): void {
    this.api.getSpecialization(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  

  resetDrawer(SpecializationMasterPage: NgForm) {
    this.data = new SpecializationMaster();
    SpecializationMasterPage.form.markAsPristine();
    SpecializationMasterPage.form.markAsUntouched();
  }
}
