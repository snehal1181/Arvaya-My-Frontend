import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from '../Service/api-service.service';
import { UserMaster } from '../CommonModels/user-master';
import { environment } from 'src/environments/environment.prod';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { CommonFunctionService } from '../Service/CommonFunctionService';

export class PasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  OTP: any;
  RID: any;
  VID: any;
}

export class ChangePasswordData {
  TYPE: string;
  TYPE_VALUE: any;
  PASSWORD: any;
  CONFIRM_PASSWORD: any;
  VID: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: UserMaster = new UserMaster();
  passwordData = new PasswordData();
  changePasswordData = new ChangePasswordData();
  EMAIL_ID = '';
  PASSWORD = '';
  NEW_PASSWORD = '';
  supportKey = '';
  ORGANIZATION_ID: number | undefined;
  passwordVisible: boolean = false;
  newpasswordVisible: boolean = false;
  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;
  isOk: boolean = true;
  roleId = localStorage.getItem('roleId');

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) { }

  currentApplicationVersion: any;
  public commonFunction = new CommonFunctionService();
  showOTP: boolean = false;
  TYPE_VALUE: any;
  TYPE = 'E';
  OTP: any = 'false';

  ngOnInit(): void {
    // this.currentApplicationVersion = environment.appVersioning.appVersion;
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      this.router.navigate(['/login']);
    } else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }



  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please Enter  Email ID and Password.', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (!this.commonFunction.emailpattern.test(this.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter a Valid Email ID', '');
    } else if (this.PASSWORD == null || this.PASSWORD.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else {
      this.isloginSpinning = true;

      this.api.login(this.EMAIL_ID, this.PASSWORD).subscribe(
        (data: HttpResponse<any>) => {
          const statusCode = data.status;
          const datalist = data.body;

          if (statusCode === 200) {
            this.isloginSpinning = false;
            this.message.success('Successfully Logged In', '');

            const subscribedChannels =
              datalist['SUBSCRIBED_CHANNELS'];

            if (subscribedChannels && Array.isArray(subscribedChannels)) {
              sessionStorage.setItem(
                'subscribedChannels',
                JSON.stringify(subscribedChannels)
              );

              sessionStorage.setItem(
                'subscribedChannels1',
                JSON.stringify(subscribedChannels)
              );
            }

            this.cookie.set(
              'token',
              datalist['token'],
              365,
              '/',
              '',
              false,
              'Strict'
            );

            sessionStorage.setItem(
              'userId',
              this.commonFunction.encryptdata(
                (datalist['UserData'][0]['user_id']).toString()
              )
            );

            sessionStorage.setItem(
              'userName',
              this.commonFunction.encryptdata(
                datalist['UserData'][0]['name']
              )
            );

            sessionStorage.setItem(
              'roleId',
              this.commonFunction.encryptdata(
                (datalist['UserData'][0]['role_id']).toString()
              )
            );

            sessionStorage.setItem(
              'labId',
              this.commonFunction.encryptdata(
                (datalist['UserData'][0]['lab_id'])?.toString()
              )
            );

            sessionStorage.setItem(
              'emailId',
              this.commonFunction.encryptdata(
                datalist['UserData'][0]['email_id']
              )
            );

            if (datalist['UserData'][0]['last_login_datetime']) {
              sessionStorage.setItem(
                'lastlogindate',
                this.commonFunction.encryptdata(
                  datalist['UserData'][0]['last_login_datetime']
                )
              );
            }

            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });

          } else {
            this.isloginSpinning = false;
            this.message.error('You have entered wrong credentials', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.isloginSpinning = false;

          if (err.error instanceof ErrorEvent) {
            this.message.error(
              'Network error: Please check your connection and try again.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong...', '');
          }
        }
      );
    }
  }

}