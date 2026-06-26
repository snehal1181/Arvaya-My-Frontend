import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LanguageMasterData } from '../../../Models/LanguageMasterData';
import { CommonFunctionService } from '../../../../../Service/CommonFunctionService';
import { ApiServiceService } from '../../../../../Service/api-service.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-language-master-drawer',
  templateUrl: './language-master-drawer.component.html',
  styleUrls: ['./language-master-drawer.component.css'],
})
export class LanguageMasterDrawerComponent {
  isSpinning = false;
  isOk = true;

  ngOnInit(): void {
    this.checkLang();
  }

  LangList = [];

  checkLang() {
    const filter = ``;

    this.api
      .getLanguageList(filter)
      .subscribe((response: HttpResponse<any>) => {
        const statusCode = response.status;
        const responseBody = response.body;

        // console.log(response);

        if (statusCode === 200 && responseBody?.count >= 0) {
          this.LangList = responseBody.data;
          // console.log(this.LangList);
        } else {
          this.LangList = [];
        }
      });
  }
  public commonFunction = new CommonFunctionService();
  @Input() data: any = LanguageMasterData;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  resetDrawer(Languagemaster: NgForm) {
    this.data = new LanguageMasterData();
    Languagemaster.form.markAsPristine();
    Languagemaster.form.markAsUntouched();
  }

  save(addNew: boolean, Languagemaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.name == '' ||
      this.data.name == null ||
      this.data.name == undefined
      //  &&
      // (this.data.SHORT_CODE == '' ||
      // this.data.SHORT_CODE == null ||
      // this.data.SHORT_CODE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Language', '');
    }
    // else if (
    //   this.data.SHORT_CODE == null ||
    //   this.data.SHORT_CODE == undefined ||
    //   this.data.SHORT_CODE == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Short Code', '');
    // }
    else if (
      this.LangList.some(
        (data) =>
          (data['name'] as string).toLowerCase() ===
          this.data.name.toLowerCase()
      ) &&
      !this.data.id
    ) {
      this.isOk = false;
      this.message.error('Language Already Exists', '');
    } else if (
      this.data.seq_no == null ||
      this.data.seq_no == undefined ||
      this.data.seq_no == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.id) {
        this.api.updateLanguage(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success('Language Updated Successfully', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Language Updation Failed', '');
            }
            this.isSpinning = false;
          },
          (err: HttpErrorResponse) => {
            this.message.error(
              'An error occurred while updating the Language.',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        this.api.createLanguage(this.data).subscribe(
          (response: HttpResponse<any>) => {
            const statusCode = response.status;

            if (statusCode === 200) {
              this.message.success('Language Created Successfully', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new LanguageMasterData();
                this.resetDrawer(Languagemaster);

                // Fetch the new seq_no
                this.api.getLanguageData(1, 1, 'seq_no', 'desc', '').subscribe(
                  (response: HttpResponse<any>) => {
                    const statusCode = response.status;
                    const responseBody = response.body;

                    if (statusCode === 200) {
                      if (responseBody['count'] === 0) {
                        this.data.seq_no = 1;
                      } else {
                        this.data.seq_no =
                          responseBody['data'][0]['seq_no'] + 1;
                      }
                    } else {
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err: HttpErrorResponse) => {
                    this.message.error('Error fetching SEQ_NO', '');
                  }
                );
              }
            } else {
              this.message.error('Language Creation Failed', '');
            }
            this.isSpinning = false;
          },
          (err: HttpErrorResponse) => {
            this.message.error(
              'An error occurred while creating the Language.',
              ''
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }

  close() {
    this.drawerClose();
  }
}
