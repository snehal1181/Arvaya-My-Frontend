import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  encapsulation: ViewEncapsulation.None, // Make styles global
})
export class RolesComponent implements OnInit {
  formTitle = 'Manage Roles';
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
    ['parent_name', 'Parent'],
    ['name', 'Name'],
    ['description', 'Description'],
    ['type', 'Type'],
  ];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: RoleMaster = new RoleMaster();
  drawerVisible1: boolean = false;
  drawerTitle1: string = '';
  drawerData1: RoleMaster = new RoleMaster();
  drawerData2: string[] = [];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.search();
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

    this.api
      .getAllRoles(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (response: HttpResponse<any>) => {
          const statusCode = response.status;
          const responseBody = response.body;

          if (statusCode === 200 && responseBody?.data) {
            this.loadingRecords = false;
            this.totalRecords = responseBody.count || 0;
            this.dataList = responseBody.data || [];
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },

      );

  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Roles';
    this.drawerData = new RoleMaster();
    this.drawerVisible = true;
  }

  edit(data: RoleMaster): void {
    this.drawerTitle = 'Update Roles Details';
    this.drawerData = Object.assign({}, data);
    this.drawerData.parent_id = this.drawerData.parent_id;

    this.drawerVisible = true;
  }

  MapData: any;
  loadForm: boolean = false;
  MapForms(data: RoleMaster): void {
    this.loadForm = true;
    this.MapData = data.id;

    this.api.getRoleDetails(data.id).subscribe(
      (data: HttpResponse<any>) => {

        if (data['status'] == 200) {
          this.drawerData2 = data.body['data'];
          this.loadForm = false;
        } else {
          this.message.error('Something Went Wrong', '');
          this.loadForm = false;
        }
      },
      () => {
        this.message.error('Something Went Wrong ...', '');
      }
    );

    this.drawerTitle1 = 'Forms assign for ' + data.name + '';
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
}
