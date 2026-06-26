import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { TestMaster } from '../../../Models/TestMaster';
import { HttpResponse } from '@angular/common/http';
import { isArray } from 'util';

@Component({
  selector: 'app-test-master-form',
  templateUrl: './test-master-form.component.html',
  styleUrls: ['./test-master-form.component.css'],
})
export class TestMasterFormComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: TestMaster = new TestMaster();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: TestMaster[] = [];
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
  taxes: any;
  hospitals: any;
  doctors: any;
  consultationModes: any;
  consultationTypes: any;
  catalogs: any;
  appointments: any;
  paymentStatuses: any;
  categoryOptions: any;
  activeStatusOptions: any;
  @Input() selectedValues: string[] = [];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getTestData();
    // this.checkOptionsOne.forEach(option => {
    //   option.checked = this.selectedValues.includes(option.value);
    // });
    // if(this.data.ID){
    //   // console.log(this.data.TEST_FOR);
    //   if(!Array.isArray(this.data.TEST_FOR)){
    //     this.data.TEST_FOR=this.data.TEST_FOR.split(',')
    //   }
    //   // if()
    //   this.checkOptionsOne=this.checkOptionsOne.map(option=>({
    //     ...option,
    //     checked: this.data.TEST_FOR.includes(option.value)
    //   }))
    //   // this.checkboxEvent(this.data.TEST_FOR)
    // }
  }
  categoryIdOptions: any[] = []
  contactpattern = /^[0-9\-]$/;
  getTestData() {
    const filter = `AND IS_ACTIVE = 1`;
    this.api.getTestCategoryList(filter).subscribe(
      (data: HttpResponse<any>) => {
        if (data['status'] == 200) {
          this.categoryIdOptions = data.body['data'];
        } else {
          this.categoryIdOptions = [];
          // this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
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
    // throw new Error('Method not implemented.');
  }
  onStateChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  onDistrictChange($event: any) {
    // throw new Error('Method not implemented.');
  }
  checkboxEvent(event) {
    if (event && event.length > 0) {
      // Filter items with 'checked: true' and map their 'value' property
      this.data.test_for = event
        .filter((item) => item.checked) // Keep only items where checked is true
        .map((item) => item.value); // Extract the 'value' property
    } else {
      this.data.test_for = []; // Reset if no valid items are present
    }
    // console.log(this.data.TEST_FOR); // Check the result
  }
  checkOptionsOne = [
    { label: 'Male', value: 'M', checked: false },
    { label: 'Female', value: 'F', checked: false },
  ];
  countryData: any = [];
  getCountyData() {
    this.api.getAllCountryMaster(0, 0, '', '', 'AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countryData = data['data'];
        } else {
          this.countryData = [];
          this.message.error('Failed To Get Country Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  disabledDate = (current: Date): boolean => {
    // Disable future dates
    const today = new Date();
    if (current > today) {
      return true;
    }

    // Disable weekends (Saturday and Sunday)
    // const day = current.getDay();
    // if (day === 0 || day === 6) {
    //   return true; // Disable Sunday (0) and Saturday (6)
    // }

    // You can add more conditions if needed (e.g., disable specific dates)
    return false; // Enable other dates
  };

  save(addNew: boolean, TestMasterPage: NgForm): void {
    this.isOk = true;

    // Validation for required fields
    if (
      !this.data.name &&
      !this.data.description?.trim() &&
      !this.data.instruction?.trim() &&
      !this.data.samples &&
      !this.data.category_id &&
      !this.data.test_for
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields.', '');
    } else if (!this.data.name || this.data.name.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Name.', '');
    } else if (!this.data.description || this.data.description?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Description.', '');
    } else if (!this.data.instruction || this.data.instruction?.trim() === '') {
      this.isOk = false;
      this.message.error('Please enter Instruction.', '');
    } else if (!this.data.samples || this.data.samples === '') {
      this.isOk = false;
      this.message.error('Please select Samples.', '');
    } else if (!this.data.category_id) {
      this.isOk = false;
      this.message.error('Please select Test Category.', '');
    } else if (!this.data.test_for) {
      this.isOk = false;
      this.message.error('Please select Test For.', '');
    } else if (!this.data.seq_no) {
      this.isOk = false;
      this.message.error('Please enter Sequence Number.', '');
    } else {
      if (this.data.samples != null) {
        this.data.samples = this.data.samples.toString();

      }
      // if(this.data.TEST_FOR != null ){
      //   this.data.TEST_FOR = this.data.TEST_FOR.toString();

      // }

      // If all validations pass, check if the name already exists
      this.isSpinning = true;

      this.api.getTestMaster(1, 1000, 'name', 'asc', '').subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          if (statusCode === 200) {
            const existingNames = response.body.data.map((test: any) => ({
              id: test.id,
              name: test.name.toLowerCase().trim(),
            }));

            // Check if name exists (excluding the current record during update)
            const isDuplicate = existingNames.some(
              (test) =>
                test.name === this.data.name.toLowerCase().trim() &&
                test.id !== this.data.id // Exclude current record during update
            );

            if (isDuplicate) {
              this.isOk = false;
              this.message.error('The Name is already present. Please choose a different name.', '');
              this.isSpinning = false;
            } else {
              // Proceed with save logic
              if (this.data.id) {
                // Update logic
                this.api.updateTestMaster(this.data).subscribe(
                  (response: HttpResponse<any>) => {
                    const statusCode = response.status;
                    if (statusCode === 200) {
                      this.message.success('Test Data Updated Successfully', '');
                      if (!addNew) this.drawerClose();
                    } else {
                      this.message.error('Test Data Updation Failed', '');
                    }
                    this.isSpinning = false;
                  },
                  (error) => {
                    this.message.error('Something Went Wrong', '');
                    this.isSpinning = false;
                  }
                );
              } else {
                // Create logic
                this.api.createTestMaster(this.data).subscribe(
                  (response: HttpResponse<any>) => {
                    const statusCode = response.status;
                    if (statusCode === 200) {
                      this.message.success('Test Data Created Successfully', '');
                      if (!addNew) {
                        this.drawerClose();
                      } else {
                        this.data = new TestMaster();
                        this.resetDrawer(TestMasterPage);
                        this.api.getTestMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
                          (response: HttpResponse<any>) => {
                            const statusCode = response.status;
                            if (statusCode === 200) {
                              if (response.body.count === 0) {
                                this.data.seq_no = 1;
                              } else {
                                this.data.seq_no = response.body.data[0].seq_no + 1;
                              }
                            } else {
                              this.message.error('Something went wrong.', '');
                            }
                          }
                        );
                      }
                    } else {
                      this.message.error('Test Data Creation Failed', '');
                    }
                    this.isSpinning = false;
                  },
                  (error) => {
                    this.message.error('Something Went Wrong', '');
                    this.isSpinning = false;
                  }
                );
              }
            }
          } else {
            this.message.error('Something Went Wrong While Fetching Data', '');
            this.isSpinning = false;
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.isSpinning = false;
        }
      );
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

  resetDrawer(TestMasterPage: NgForm) {
    this.data = new TestMaster();
    TestMasterPage.form.markAsPristine();
    TestMasterPage.form.markAsUntouched();
    // this.stateSeq();
  }
}
