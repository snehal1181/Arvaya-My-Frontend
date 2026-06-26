import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { UserMaster } from '../../models/user-master';
// import { ApiserviceService } from 'src/app/Service/apiservice.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UserMaster } from 'src/app/CommonModels/user-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  formTitle = 'Manage Users';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['role_name', 'Role'],
    ['name', 'Name'],
    ['email_id', 'Email'],
    ['mobile_number', 'Mobile'],
  ];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: any = new UserMaster();

  constructor(private api: ApiServiceService, private message: NzNotificationService) { }

  ngOnInit() {
    // this.search();
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search(false);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    //+' AND (VENDOR_ID = 0 OR VENDOR_ID = null)'
    //   this.api
    //     .getAllUsers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery )
    //     .subscribe(
    //       (data) => {
    //         this.loadingRecords = false;
    //         this.totalRecords = data['count'];
    //         this.dataList = data['data'];
    //       },
    //       (err) => {
    //         this.loadingRecords = false;
    //       }
    //     );
    // }


    this.api
      .getAllUsers(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          // const headers = response.headers;
          if (statusCode === 200) {
            this.loadingRecords = false;
            this.totalRecords = response.body.count;
            this.dataList = response.body.data;
          } else {
            this.dataList = [];
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

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New User';
    this.drawerData = new UserMaster();
    this.drawerData.is_active = 1;
    this.drawerVisible = true;
  }

  edit(data: any): void {
    this.drawerTitle = 'Update User Details';
    this.drawerData = Object.assign({}, data);
    // if (
    //   this.drawerData.ROLE_IDS != null &&
    //   this.drawerData.ROLE_IDS != undefined &&
    //   this.drawerData.ROLE_IDS != ''
    // ) {
    //   this.drawerData.ROLE_DATA = data['ROLE_IDS'].split(',');
    //   for (var i = 0; i < this.drawerData.ROLE_DATA.length; i++) {
    //     this.drawerData.ROLE_DATA[i] = Number(this.drawerData.ROLE_DATA[i]);
    //   }
    // } else {
    // }
    this.drawerData.role_id = Number(this.drawerData.role_id);

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}