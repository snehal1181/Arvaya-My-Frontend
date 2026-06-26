import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { appkeys } from '../app.constant';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  clientId: number = 1;
  cloudID: any;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  gmUrl = appkeys.gmUrl;
  applicationId = 1;
  baseUrl = appkeys.baseUrl;
  url = appkeys.url;
  retriveimgUrl = appkeys.retriveimgUrl;
  imgUrl = appkeys.imgUrl;
  imgUrl1 = appkeys.imgUrl1;
  dateforlog =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  emailId = sessionStorage.getItem('emailId');
  userId = Number(sessionStorage.getItem('userId'));
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  constructor(private cookie: CookieService, private httpClient: HttpClient) { }
  APIKEY = "WGykEs0b241gNKcDshYU9C4I0Ft1JoSb"
  APPLICATION_KEY = 'ZU63HDzj79PEFzz5'

  // For  Testing server
  // APPLICATION_KEY = 'Xkit6MeT1Et4ZA2N'
  // APIKEY = 'JP76Ol1r5lMvzljKmeaTdP9EthTYzKFH'
  getheader() {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'APIKEY',
      applicationkey: 'APPLICATION_KEY',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }
  login(email: string, password: string): Observable<any> {
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post(
      this.baseUrl + 'user/login',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createUser(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/create',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  loggerInit() {
    this.options1 = {
      headers: this.httpHeaders1,
    };
    var data = {
      CLIENT_ID: this.clientId,
    };
    return this.httpClient.post(
      this.gmUrl + 'device/init',
      JSON.stringify(data)
    );
  }
  getAllForms(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/form/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createForm(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/form/create',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateForm(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/form/update',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  getAllRoles(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/role/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createRole(application: any): Observable<any> {
    application.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/role/create',
      JSON.stringify(application),
      { observe: 'response' }
    );
  }
  updateRole(application: any): Observable<any> {
    application.client_id = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/role/update',
      JSON.stringify(application),
      { observe: 'response' }
    );
  }
  updateUser(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/user/update',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  // getRoleDetails(roleId: number) {
  //   var data = {
  //     ROLE_ID: roleId,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/roleDetails/getData',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  getAllUsers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  addRoleDetails(roleId: number, data1: string[]): Observable<any> {

    var data = {
      role_id: roleId,
      client_id: this.clientId,
      data: data1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/roleDetails/addBulk',
      data,
      { observe: 'response' }
    );
  }
  sendOTP(TYPE: any, TYPE_VALUE): Observable<any> {
    var data = {
      TYPE: TYPE,
      TYPE_VALUE: TYPE_VALUE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/sendOtpToDevice',
      JSON.stringify(data)
    );
  }
  confirmOTP(passwordData: any): Observable<any> {
    var data = {
      TYPE: passwordData.TYPE,
      TYPE_VALUE: passwordData.TYPE_VALUE,
      OTP: passwordData.OTP,
      RID: passwordData.RID,
      VID: passwordData.VID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/verifyOtp',
      JSON.stringify(data)
    );
  }
  changePassword(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/changePassword',
      JSON.stringify(user)
    );
  }
  forgetPasswordAdmin(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/forgetPasswordAdmin',
      JSON.stringify(data)
    );
  }
  deleteAllCookies() {
    // Retrieve all cookies
    const cookies: string[] = document.cookie.split(';');
    // Iterate over each cookie
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const cookieName =
        eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      // Explicitly delete the cookie with the root path '/'
      this.cookie.delete(cookieName, '/');
    }
  }
  // Country Master List
  // getCountryType(filter: string): Observable<any> {
  //   const params = new HttpParams().set('filter', filter);
  //   return this.httpClient.get<any>(`${this.url}country/getList`, {
  //     params: params,
  //     observe: 'response',
  //   });
  // }
  getCountryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'country/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  createCountryData(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'country/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  updateCountryData(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'country/upsert',
      JSON.stringify(user),
      {
        observe: 'response',
      }
    );
  }
  // District Master List
  getStateType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}state/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getDistrictType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}district/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getDistrict(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'district/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createDistrict(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'district/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateDistrict(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'district/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  // State get, create, update
  getState(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'state/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  createState(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'state/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  updateState(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'state/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Pincode
  getPincodeType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}pincode/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAllPincode(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any[]>(
      this.url + 'pincode/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  createPincode(pincode: any): Observable<any> {
    pincode.client_id = this.clientId;
    return this.httpClient.post<any[]>(
      this.url + 'pincode/upsert',
      JSON.stringify(pincode),
      {
        observe: 'response',
      }
    );
  }
  updatePincode(pincode: any): Observable<any> {
    pincode.client_id = this.clientId;
    return this.httpClient.post<any[]>(
      this.url + 'pincode/upsert',
      JSON.stringify(pincode),
      {
        observe: 'response',
      }
    );
  }
  // Language Master

  getLanguageList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}language/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getLanguageData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/language/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  createLanguage(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/language/upsert',
      JSON.stringify(form),
      {
        observe: 'response',
      }
    );
  }
  updateLanguage(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/language/upsert',
      JSON.stringify(user),
      {
        observe: 'response',
      }
    );
  }
  // Specialization get, create, update
  // Get Specialization List
  // Create Specialization
  createSpecialization(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'specialization/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update Specialization
  updateSpecialization(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'specialization/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // CouncilMaster get, create, update
  // Get CouncilMaster List

  // Country Master List

  getCouncilType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}registrationCouncile/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getCouncilMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'registrationCouncile/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Create CouncilMaster
  createCouncilMaster(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'registrationCouncile/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update CouncilMaster
  updateCouncilMaster(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'registrationCouncile/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // ServiceMaster get, create, update
  // Get ServiceMaster List
  getServiceMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'service/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Create ServiceMaster
  createServiceMaster(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'service/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update ServiceMaster
  updateServiceMaster(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'service/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Get FAQMaster List
  getFAQMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'faq/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Create FAQMaster
  createFAQMaster(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'faq/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update FAQMaster
  updateFAQMaster(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'faq/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Hospital Master List
  getHospitalType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}hospital/getList`, {
      params: params,
      observe: 'response',
    });
  }
  // Appointment Master List
  getAppointmentType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}appointment/getList`, {
      params: params,
      observe: 'response',
    });
  }
  // Doctor Master List
  getDoctorType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}doctor/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getHospitalReview(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hospitalReview/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createHospitalReview(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'hospitalReview/create',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateHospitalReview(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'hospitalReview/update',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  // Lab Master List
  getLabType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}lab/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getHoliday(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'holiday/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createHoliday(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'holiday/markHoliday',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateHoliday(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'holiday/updateHoliday',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getDesignationData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/designation/get',
      JSON.stringify(data)
    );
  }
  // For Testing server
  onuploadheader() {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'APIKEY',
      applicationkey: 'APPLICATION_KEY',
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders,
    };
  }

  getAllCityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data)
    );
  }
  CreateCityMaster(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(user)
    );
  }
  UpdateCityMaster(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(user)
    );
  }
  getAllStateMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'State/get',
      JSON.stringify(data)
    );
  }
  getAllCountryMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'country/get',
      JSON.stringify(data)
    );
  }

  getCountryType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}country/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAllPincodeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'pincode/get',
      JSON.stringify(data)
    );
  }
  // getAllPincode(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<OrganizationMaster[]> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<OrganizationMaster[]>(
  //     this.url + 'pincode/get',
  //     JSON.stringify(data)
  //   );
  // }
  // City get, create, update
  getCity(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data)
    );
  }
  createCity(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(data)
    );
  }
  updateCity(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(data)
    );
  }
  getRolesData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/role/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getAppLanguageData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/appLanguage/get',
      JSON.stringify(data)
    );
  }
  createAppLanguageData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appLanguage/create',
      JSON.stringify(data)
    );
  }
  updateAppLanguageData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'appLanguage/update',
      JSON.stringify(user)
    );
  }
  // Lab Master
  // getLabMaster(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'lab/get',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  // getpatientdata(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'patient/get',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  // createLabMaster(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'lab/create',
  //     JSON.stringify(data)
  //   );
  // }
  // updateLabMaster(data: any): Observable<any> {
  //   return this.httpClient.put<any>(
  //     this.url + 'lab/update',
  //     JSON.stringify(data)
  //   );
  // }
  //

  // Doctor Master
  getAllDoctor(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'doctor/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createDoctor(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'doctor/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateDoctor(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'doctor/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getMappedQualifications(id: any): Observable<any> {
    console.log(id);
    return this.httpClient.get<any>(
      `${this.url}doctor/${id}/getQualification`,
      {
        observe: 'response',
      }
    );
  }
  mapQualifications(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'doctor/mapQualifications',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  // Get Specialization List
  getSpecialization(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'specialization/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  //
  getRoleDetails(roleId: number) {
    var data = {
      role_id: roleId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/roleDetails/getData',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getForms(roleId: any): Observable<any> {
    // console.log(roleId);
    let filter = roleId;
    // Create HttpParams with only roleId
    // const params = new HttpParams().set('filter',filter)
    // Send the request with the roleId as query parameter
    return this.httpClient.get<any>(`${this.url}role/getForms/${filter}`, {
      // params: params,
      observe: 'response',
    });
  }
  getCountryDropdown(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}country/getList`, {
      params: params,
      observe: 'response',
    });
  }
  //Hospital Master
  getHospitalClinics(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hospital/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createHospitalClinics(data: any): Observable<any> {
    data.client_id = this.clientId;
    data.is_active = data.is_active ? 1 : 0;
    return this.httpClient.post<any>(
      this.url + 'hospital/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateHospitalClinic(data: any): Observable<any> {
    data.client_id = this.clientId;
    data.is_active = data.is_active ? 1 : 0;
    return this.httpClient.post<any>(
      this.url + 'hospital/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getpatientdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appUser/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  onUpload11(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    // this.options1 = {
    //   headers: this.httpHeaders1,
    //   observe:'response'
    // };

    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(appkeys.imgUrl + folderName, fd, {
      headers: this.httpHeaders1, // Assuming this is set in `onuploadheader`
      observe: 'events', // Observe the full HTTP response
      reportProgress: true,
    });
  }
  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.onuploadheader();
    // this.httpHeaders1 = new HttpHeaders({
    //   Accept: 'application/json',
    //   APIKEY: 'T6iGIHV1ec17p478s0gdRqrOjpr3cxL5',
    //   // 'APPLICATION_KEY': this.applicationKey,
    //   Token: this.cookie.get('token'),
    //   supportkey: this.cookie.get('supportKey'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    // console.log();
    return this.httpClient.post<any>(appkeys.imgUrl + folderName, fd, {
      headers: this.httpHeaders1, // Assuming this is set in `onuploadheader`
      observe: 'events', // Observe the full HTTP response
      reportProgress: true,
    });
  }
  // Lab Technician
  getLabTechnicians(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'labTechnician/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createLabTechnicians(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'labTechnician/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createLabTechniciansLab(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'lab/createTechnician',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateLabTechnician(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'labTechnician/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  // Lab Bill Catalogue
  getLabBillCatalogue(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'labBillCatalog/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createLabBillCatalogue(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'labBillCatalog/create',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateLabBillCatalogue(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'labBillCatalog/update',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getLablist(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}lab/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getLabPackageList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}labPackage/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAppointmentTypeList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}appointmentType/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getTestList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}test/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getTaxList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}taxCatalog/getList`, {
      params: params,
      observe: 'response',
    });
  }
  createAppointmentTypeData(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appointmentType/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updateAppointmentTypeData(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appointmentType/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getAppointmentTypeData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'appointmentType/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getPresciption(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createPresciption(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  updatePresciption(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getAllDrugMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getDocumentType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/documentType/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createDocumentType(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/documentType/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateDocumentType(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/documentType/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getTaxCatlog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/taxCatalog/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createTaxCatlog(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/taxCatalog/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateTaxCatlog(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/taxCatalog/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  // getLabAppointment(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/labAppointment/get',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  // createLabAppointment(form: any): Observable<any> {
  //   form.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/labAppointment/create',
  //     JSON.stringify(form),
  //     { observe: 'response' }
  //   );
  // }
  // updateLabAppointment(user: any): Observable<any> {
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.baseUrl + 'api/labAppointment/update',
  //     JSON.stringify(user),
  //     { observe: 'response' }
  //   );
  // }
  getHospitalList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}hospital/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getLabList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}lab/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAllPatientMaster(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}patient/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAllTestMaster(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}test/getList`, {
      params: params,
      observe: 'response',
    });
  }

  updateFilterData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'saveFilter/update',
      JSON.stringify(data),
      this.options
    );
  }
  getAllPackegeMaster(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}test/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getAllSlotMaster(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}slot/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getLabPackage(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPackage/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getLabPackagebyId(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    id
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.get<any>(
      this.baseUrl + `api/lab/${id}/getPackage`,
      // JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createLabPackage(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPackage/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateLabPackage(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPackage/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getTestCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/testCategory/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createTestCategory(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/testCategory/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateTestCategory(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/testCategory/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getTestcategoryList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}testCategory/getList`, {
      params: params,
      observe: 'response',
    });
  }
  // getTestMaster(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/test/get',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  createTestMaster(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/test/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateTestMaster(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/test/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getDoctorMapList(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}doctor/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getMappedDoctorList(filter): Observable<any> {
    // const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(
      `${this.url}hospital/${filter}/getDoctors`,
      {
        // params: params,
        observe: 'response',
      }
    );
  }
  MapDoctors(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hospital/mapDoctors',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  getProcedureMapList(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}procedure/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getMappedProcedureList(filter): Observable<any> {
    // const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(
      `${this.url}hospital/${filter}/getProcedures`,
      {
        // params: params,
        observe: 'response',
      }
    );
  }
  MapProcedures(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hospital/mapProcedures',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  getProcedures(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/procedure/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createProcedure(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/procedure/create',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  updateProcedure(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/procedure/update',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getMappedSpecializations(id: any): Observable<any> {
    console.log(id);
    return this.httpClient.get<any>(
      `${this.url}doctor/${id}/getSpecilization`,
      {
        observe: 'response',
      }
    );
  }
  MapSpecializations(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'doctor/mapSpecializations',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  // getQualification(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'qualification/get',
  //     JSON.stringify(data),
  //     { observe: 'response' }
  //   );
  // }
  getTechnicianServiceMapList(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}service/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getTechnicianServiceMappedList(id): Observable<any> {
    // const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/${id}/getServices`,
      {
        // params: params,
        observe: 'response',
      }
    );
  }
  MapTechnicianService(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labTechnician/mapService',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  getTechnicianLocationList(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}pincode/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getTechnicianLocationMappedList(id): Observable<any> {
    // const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/${id}/getLocation`,
      {
        // params: params,
        observe: 'response',
      }
    );
  }
  MapTechnicianLocation(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labTechnician/mapPincode',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }
  getLabTechnicainMappedSpecialization(id: any): Observable<any> {
    // console.log(id);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/${id}/getSpecialization`,
      {
        observe: 'response',
      }
    );
  }
  MapLabTechnicianSpecializations(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'labTechnician/mapSpecialization',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getLabTechnicainQualification(id: any): Observable<any> {
    // console.log(id);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/${id}/getQualification`,
      {
        observe: 'response',
      }
    );
  }
  MapLabTechnicianQualification(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'labTechnician/mapQualification',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getAppointmentTypeGetList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}appointmentType/getList`, {
      params: params,
      observe: 'response',
    });
  }
  getMappedServices(id: any): Observable<any> {
    console.log(id);
    return this.httpClient.get<any>(`${this.url}doctor/${id}/getServices`, {
      observe: 'response',
    });
  }

  MapServices(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'doctor/mapService',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  MapConfigurationData(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'doctor/markAvailability',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getMapConfigurationData(hospitalid: any, doctorid: any): Observable<any> {
    // console.log(hospitalid , ' ', doctorid);
    return this.httpClient.get<any>(
      `${this.url}doctor/availabilityConfiguration?hospitalId=${hospitalid}&doctorId=${doctorid}`,
      {
        observe: 'response',
      }
    );
  }
  MapTechnicianConfigurationData(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'labTechnician/markAvailability',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getTechnicianConfigurationData(
    labId: any,
    technicianId: any
  ): Observable<any> {
    // console.log(hospitalid , ' ', doctorid);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/availabilityConfiguration?labId=${labId}&technicianId=${technicianId}`,
      {
        observe: 'response',
      }
    );
  }

  // Mapping Get

  // Lab Master
  getLabMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'lab/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createLabMaster(data: any): Observable<any> {
    // console.log('create Lab Master');
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'lab/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateLabMaster(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/lab/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }

  // Country get

  getCountrydropdown(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}country/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // State get
  getStatedropdown(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}state/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // Distraict get

  getdistrict(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}district/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // Qualification Type Master dropdown Get

  getQualificationType(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}qualificationType/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // Qualification Master

  getQualification(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'qualification/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createQualification(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'qualification/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateQualification(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'qualification/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // Qualification Type Master

  getQualificationTypee(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'qualificationType/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createQualificationType(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'qualificationType/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateQualificationType(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'qualificationType/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // Symptons Master

  getSymptons(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'symptoms/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createSymptons(data: any): Observable<any> {
    data.client_id = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'symptoms/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateSymptons(data: any): Observable<any> {
    // data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'symptoms/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // Lab Appointment Master

  getLabAppointment(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'labAppointment/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createLabAppointment(data: any): Observable<any> {
    data.client_id = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'labAppointment/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateLabAppointment(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'labAppointment/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  //patient get for master

  getpatient(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}labTestSlots/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // Test get for master

  getTest(filter: any, labId): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    // console.log(filter);

    return this.httpClient.get<any>(`${this.url}lab/${labId}/getTest`, {
      params: params,
      observe: 'response',
    });
  }

  // Package get for master

  getpackage(filter: any, id): Observable<any> {
    // const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}labPackage/${id}/getTest`, {
      // params: params,
      observe: 'response',
    });
  }

  getPatientNumber(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}labPatient/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // get Techniciann

  AvailabilityConfiguration(filter: any): Observable<any> {
    // const params = new HttpParams().set('filter', filter);
    // console.log(filter);
    // /api/labTechnician/availabilityConfiguration/?technicianId=1&labId=1
    // console.log(filter);
    return this.httpClient.get<any>(
      `${this.url}labTechnician/availabilityConfiguration/?${filter}`,
      {
        // params: params,
        observe: 'response',
      }
    );
  }

  getTechniciann(filter: any): Observable<any> {
    // const params = new HttpParams().set('filter', filter);

    // console.log(filter);

    return this.httpClient.get<any>(`${this.url}lab/${filter}/getTecnician`, {
      // params: params,
      observe: 'response',
    });
  }

  // Lab Bill Master

  getLabBillreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'labBill/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // get  Test Master
  getTestMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'test/get',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }

  getMappedtest(id: any): Observable<any> {
    console.log(id);
    return this.httpClient.get<any>(`${this.url}lab/${id}/getTest`, {
      observe: 'response',
    });
  }

  maptest(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'lab/mapTest',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  //

  // getTechnician(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   const data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'labTechnician/get',
  //     JSON.stringify(data),
  //     {
  //       observe: 'response',
  //     }
  //   );
  // }

  getTechnician(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}labTechnician/getList`, {
      params: params,
      observe: 'response',
    });
  }

  // labTechnician/getList

  getmapTechnician(id: any): Observable<any> {
    // console.log(id);
    return this.httpClient.get<any>(`${this.url}lab/${id}/getTecnician`, {
      observe: 'response',
    });
  }

  MapTechnicianAddbulk(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'lab/mapTechnician',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // Hospital Bill Master

  getHospitalBill(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'hospitalBill/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createHospitalBill(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'hospitalBill/create',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateHospitalBill(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'hospitalBill/update',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getDoctors(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}doctor/getList`, {
      params: params,
      observe: 'response',
    });
  }

  getconsultationTypes(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}appointmentType/getList`, {
      params: params,
      observe: 'response',
    });
  }

  gettax(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}taxCatalog/getList`, {
      params: params,
      observe: 'response',
    });
  }

  gethospitalbill(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hospitalBillCatalog/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createhospitalbill(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'hospitalBillCatalog/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updatehospitalbill(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'hospitalBillCatalog/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getAppointmentDropdown(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}district/getList`, {
      params: params,
      observe: 'response',
    });
  }

  //

  // procedure Master

  getProceduress(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'procedure/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createProcedures(data: any): Observable<any> {
    data.client_id = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'procedure/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  updateProcedures(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'procedure/upsert',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getTestCategoryList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}testCategory/getList`, {
      params: params,
      observe: 'response',
    });
  }

  getTestMasterList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}test/getList`, {
      params: params,
      observe: 'response',
    });
  }

  LabTestMapping(form: any): Observable<any> {
    form;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPackage/mapTest',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  // getTestMapList(testId: string) {
  //   const url = `labPackage/${testId}/getTest`; // Construct URL dynamically
  //   return this.httpClient.get<any>(url);
  // }

  getTestMapList(testId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}labPackage/${testId}/getTest`, {
      observe: 'response',
    });
  }

  getLabSlot(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labTestSlots/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createLabSlot(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labTestSlots/create',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateLabSlot(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/labTestSlots/update',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }

  MedicineTypeList(filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.httpClient.get<any>(`${this.url}medicineType/getList`, {
      params: params,
      observe: 'response',
    });
  }

  getMedicineType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/medicineType/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createMedicineType(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/medicineType/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateMedicineType(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/medicineType/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  SymptomsList(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/symptoms/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  getSymptomsMapList(testId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}drugs/${testId}/getSymptoms`, {
      observe: 'response',
    });
  }

  SymptomsMapping(form: any): Observable<any> {
    form;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/drugs/mapSymptoms',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  getMedicineMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/drugs/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createMedicineMaster(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/drugs/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateMedicineMaster(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/drugs/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getLabPatient(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPatient/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createLabPatient(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPatient/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateLabPatient(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/labPatient/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getHospitalPatient(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hospitalPatient/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createHospitalPatient(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hospitalPatient/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateHospitalPatient(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hospitalPatient/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  createPatient(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appUser/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update ServiceMaster
  updatePatient(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'appUser/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  getPatientfamily(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    id: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + `familyDetails/get`,
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createPatientFamily(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'familyDetails/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update ServiceMaster
  updatePatientFamily(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'familyDetails/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  getPatientAddress(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'addressDetails/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  createPatientAddress(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'addressDetails/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  // Update ServiceMaster
  updatePatientAddress(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'addressDetails/upsert',
      JSON.stringify(data),
      {
        observe: 'response',
      }
    );
  }
  getSpecializationTypeList(filter): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.httpClient.get<any>(`${this.url}specialization/getList`, {
      params: params,
      observe: 'response',
    });
  }

  getMedicalrecords(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/patientHealthRecord/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  createMedicalRecord(form: any): Observable<any> {
    form.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/patientHealthRecord/upsert',
      JSON.stringify(form),
      { observe: 'response' }
    );
  }

  updateMedicalRecord(user: any): Observable<any> {
    user.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/patientHealthRecord/upsert',
      JSON.stringify(user),
      { observe: 'response' }
    );
  }
  getLabTechnicianMapping(id: any): Observable<any> {
    // var data = {
    //   pageIndex: pageIndex,
    //   pageSize: pageSize,
    //   sortKey: sortKey,
    //   sortValue: sortValue,
    //   filter: filter,
    // };

    return this.httpClient.get<any>(
      this.url + `lab/${id}/getTecnician`,
      // JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getLabReview(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'labReview/get',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }
  getLabTecnicianMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/lab/getLabTecnicianMapping',
      JSON.stringify(data),
      { observe: 'response' }
    );
  }

  // Hereditary Conditions get, create, update
  getHereditaryConditions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hereditaryConditions/get',
      JSON.stringify(data)
    );
  }
  createHereditaryConditions(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'hereditaryConditions/upsert',
      JSON.stringify(data)
    );
  }
  updateHereditaryConditions(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'hereditaryConditions/upsert',
      JSON.stringify(data)
    );
  }

  //Health Survey Questions get, create, update
  getHealthsurveyquestions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'healthSurveyQuestions/get',
      JSON.stringify(data)
    );
  }
  createHealthsurveyquestions(data: any): Observable<any> {
    data.client_id = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'healthSurveyQuestions/upsert',
      JSON.stringify(data)
    );
  }
  updateHealthsurveyquestions(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'healthSurveyQuestions/upsert',
      JSON.stringify(data)
    );
  }
  getFilterData1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'saveFilter/get',
      JSON.stringify(data),
      this.options
    );
  }
  getFilterData(
    TAB_ID: number,
    USER_ID: number,
    CLIENT_ID: number,
    filter: string
  ): Observable<any> {
    const data = {
      TAB_ID: TAB_ID,
      USER_ID: USER_ID,
      CLIENT_ID: CLIENT_ID,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/saveFilter/get',
      JSON.stringify(data),
      this.options
    );
  }
  // createFilterData(data: any): Observable<any> {
  //   return this.httpClient.post<any>(
  //     this.url + 'saveFilter/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  createFilterData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'saveFilter/create',
      JSON.stringify(data),
      this.options
    );
  }
  deleteFilterById(id: number): Observable<any> {
    // API endpoint with the id as a path parameter
    const url = `${this.baseUrl}api/saveFilter/delete/${id}`;
    // Make the POST API call
    return this.httpClient.post<any>(
      url, // API URL
      {}, // Empty body (if no additional payload is required)
      this.options // HTTP options (e.g., headers)
    );
  }

  checkTextBoxIsValid(value: any) {
    const expression = /^[A-Za-z0-9 ]*$/;
    return expression.test(String('' + value).toLowerCase());
  }

  notiDetailsAddBulk(
    // empID: number,

    title: string,

    desc: string,

    sharingType: number,

    nData: any,

    orgId: any,

    TYPE: any,

    ATTACHMENT: string,

    MEDIA_TYPE: string,

    SENDER_ID: any,

    NOTIFICATION_TYPE: string,

    TOPIC_NAME: string
  ): Observable<any> {
    var data = {
      TITLE: title,

      DESCRIPTION: desc,

      data: nData,

      SHARING_TYPE: sharingType,

      // CUSTOMER_ID: empID,

      ATTACHMENT: ATTACHMENT,

      CLIENT_ID: this.clientId,

      ORG_ID: 1,

      IS_PANEL: 1,

      TYPE: TYPE,

      MEDIA_TYPE: MEDIA_TYPE,

      SENDER_ID: SENDER_ID,

      NOTIFICATION_TYPE: NOTIFICATION_TYPE,

      TOPIC_NAME: TOPIC_NAME,
    };

    return this.httpClient.post<[]>(
      this.url + 'notification/sendNotification',

      JSON.stringify(data),

      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  sendNotificationPayload(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/bulkNotification/BulkNotification',
      JSON.stringify(payload),
      { observe: 'response' }
    );
  }

  subscribeToMultipleTopics(topics: string[]): Observable<any> {
    const fcmToken = this.cookie.get('CLOUD_ID');
    if (!fcmToken) {
      console.error('No FCM token available!');
      return of(null);
    }
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'bulkNotification/subscribe',
      { token: fcmToken, topics },
      this.options
    );
  }

  NonSubscribedChannels(
    data: any
  ): Observable<any> {
    var datas = {
      filter: data
    }
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/get',
      JSON.stringify(datas),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  unsubscribeToMultipleTopics(topics: string[]): Observable<any> {
    const fcmToken = this.cookie.get('CLOUD_ID');
    if (!fcmToken) {
      console.error('No FCM token available!');
      return of(null);
    }

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'bulkNotification/unsubscribe',
      { token: fcmToken, topics },
      this.options
    );
  }

  getnotifications(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'APIKEY',
      applicationkey: 'APPLICATION_KEY',
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: headers,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/notification/get',
      JSON.stringify(data),
      { observe: 'response', headers }
    );
  }
}
