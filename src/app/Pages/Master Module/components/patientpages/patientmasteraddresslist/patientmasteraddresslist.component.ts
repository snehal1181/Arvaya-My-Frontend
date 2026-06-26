import { Component, Input } from '@angular/core';
import { patientaddressmaster } from '../../../Models/patient';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-patientmasteraddresslist',
  templateUrl: './patientmasteraddresslist.component.html',
  styleUrls: ['./patientmasteraddresslist.component.css']
})
export class PatientmasteraddresslistComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: any;
  @Input() patientId
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  ngOnInit() {
    this.search(true)
  } sear
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['LINE_1', 'Address Line 1'],
    ['LINE_2', 'Address Line 2'],
    ['COUNTRY_ID', 'Country'],
    ['STATE_ID', 'State'],
    ['DISTRICT_ID', 'District'],
    ['PINCODE_ID', 'Pincode']
  ];


  addaddress() {
    this.addresstitle = 'Add New Address'
    this.drawerdata = new patientaddressmaster()
    this.addressvisible = true
  }

  drawerdata: any = []
  addressvisible = false
  edit(event: any, i) {
    this.addresstitle = 'Edit Address'
    this.drawerdata = Object.assign({}, event[i])
    this.addressvisible = true
  }
  addresstitle: string = 'Add New Address'
  searchText = ''
  addressclose() {
    this.search(true)
    this.addressvisible = false
  }

  get closeCallback() {
    return this.addressclose.bind(this);
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
      .getPatientAddress(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND app_user_id=' + this.patientId
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
