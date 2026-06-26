import { Component, Input } from '@angular/core';
import { patientfamilymaster } from '../../../Models/patient';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-patientmasterfamilylist',
  templateUrl: './patientmasterfamilylist.component.html',
  styleUrls: ['./patientmasterfamilylist.component.css'],
})
export class PatientmasterfamilylistComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: any;
  @Input() patientId

  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  columns: string[][] = [
    ['NAME', 'Name'],
    ['RELATION', 'Relation'],
    ['DOB', 'Date of Birth'],
    ['BLOOD_GROUP', 'Blood Group'],
    ['GENDER', 'Gender'],
    ['MOBILE_NUMBER', 'Mobile No.'],
  ];
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  ngOnInit() {
    this.search(true);
  }
  addfamily() {
    this.familyvisible = true;
    this.familytitle = 'Add New Family Details';
    this.drawerdata = new patientfamilymaster();
  }

  edit(event: any, i) {
    // console.log(event);

    this.familyvisible = true;
    this.familytitle = 'Edit Family Details';
    this.drawerdata = Object.assign({}, event[i])
  }
  searchText: any = '';
  familytitle: string = 'Add New Family';
  familyvisible = false;
  keyup() { }

  addfamilyclose() {
    this.search(true)
    this.familyvisible = false;
  }
  drawerdata: any;

  get closeCallback() {

    return this.addfamilyclose.bind(this);
  }

  search(reset: boolean) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    this.loadingRecords = true;

    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    let likeQuery = '';
    let globalSearchQuery = '';

    // Global Search (using searchText)
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }

    // City Filter

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getPatientfamily(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND app_user_id=' + this.patientId,
        this.patientId
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.data = response.body.data;
          } else {
            this.data = [];
            this.message.error(`Something went wrong.`, '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error(
              `HTTP Error: ${err.status}. Something Went Wrong.`,
              ''
            );
          }
        }
      );
  }
}
