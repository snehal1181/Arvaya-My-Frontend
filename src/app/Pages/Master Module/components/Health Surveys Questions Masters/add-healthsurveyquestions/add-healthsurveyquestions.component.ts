import { Component, Input } from '@angular/core';
import { Healthsurveyquestions } from '../../../Models/HealthSurveyQuestions';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-add-healthsurveyquestions',
  templateUrl: './add-healthsurveyquestions.component.html',
  styleUrls: ['./add-healthsurveyquestions.component.css'],
})
export class AddHealthsurveyquestionsComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: Healthsurveyquestions = new Healthsurveyquestions();
  @Input()
  dataList: any[] = [];
  @Input()
  data2: Healthsurveyquestions[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;

  public commonFunction = new CommonFunctionService();
  inputText: string = '';
  inputTags: string[] = [];
  filteredOptions: any[] = [];

  optionList: any = [];

  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {}
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

  tagInput: string = '';

  @Input()tags: any = [];


addTag(): void {
  const value = this.tagInput.trim();

  // ✅ Safety check
  if (!Array.isArray(this.tags)) {
    this.tags = [];
  }

  if (value && !this.tags.includes(value)) {
    this.tags.push(value);
  }

  this.tagInput = '';
}


  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  save(addNew: boolean, healthsurveyquestions: NgForm): void {
    this.isOk = true;
    if (
      // (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
      (this.data.question == undefined ||
        this.data.question == '' ||
        this.data.question.trim() == '') &&
      (this.data.category == undefined ||
        this.data.category == '' ||
        this.data.category.trim() == '') &&
      !this.data.points
      // && (this.data.SHORT_CODE == undefined || this.data.SHORT_CODE == "" || this.data.SHORT_CODE.trim() == "")
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.question == undefined ||
      this.data.question == '' ||
      this.data.question.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question', '');
    } else if (
      this.data.category == undefined ||
      this.data.category == '' ||
      this.data.category.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Category', '');
    } else if (!this.data.points || this.data.points == '0') {
      this.isOk = false;
      this.message.error('Please Enter Points', '');
    } else if (
      this.data.input_type == undefined ||
      this.data.input_type == '' ||
      this.data.input_type.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Input Type', '');
    } else if (
      (this.data.input_type === 'R' || this.data.input_type === 'D') &&
      this.tags.length === 0
    ) {
      this.isOk = false;
      this.message.error('Please Add at least one Input Value', '');
    } else if (
      this.data.input_type === 'I' &&
      (!this.data.input_value || this.data.input_value.trim() === '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Input Value', '');
    }

    this.data.input_value = JSON.stringify(this.tags);

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateHealthsurveyquestions(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createHealthsurveyquestions(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Saved Successfully', '');
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(healthsurveyquestions);
                  this.data = new Healthsurveyquestions();
                }
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Saved', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  resetDrawer(healthsurveyquestions: NgForm) {
    this.data = new Healthsurveyquestions();
    healthsurveyquestions.form.markAsPristine();
    healthsurveyquestions.form.markAsUntouched();
        this.tags = []

    // this.citySeq()
  }
}
