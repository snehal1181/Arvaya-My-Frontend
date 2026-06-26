import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from '../../../../Service/CommonFunctionService';
import { ApiServiceService } from '../../../../Service/api-service.service';
@Component({
  selector: 'app-master-menu-list',
  templateUrl: './master-menu-list.component.html',
  styleUrls: ['./master-menu-list.component.css'],
})
export class MasterMenuListComponent implements OnInit {
  loadingRecords = true;
  forms: any[] = [];
  public commonFunction = new CommonFunctionService();
  @Output() menuClick = new EventEmitter<void>();
  onMenuClick(): void {
    this.menuClick.emit();
  }
  showclass = false;
  searchQuery = '';

  onEnterKeyPress(): void {
    // Check if the search query has at least three characters
    if (this.searchQuery.trim().length >= 3) {
      this.filterForms();
    } else {
      // Reset to original forms if less than three characters
      this.titleWiseChildren = this.forms.reduce((acc, item) => {
        const sortedChildren =
          item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
        acc[item.title] = sortedChildren;
        return acc;
      }, {});
    }
  }

  onSearchQueryChange(event): void {
    this.searchQuery = event;
    if (
      this.searchQuery.trim().length == undefined ||
      this.searchQuery.trim().length <= 3
    ) {
      this.showclass = false;
    } else {
      this.showclass = true;
    }
    // If the search query is empty, reload the entire list
    // if (this.searchQuery.trim().length === 0) {
    //   this.titleWiseChildren = this.forms.reduce((acc, item) => {
    //     const sortedChildren =
    //       item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
    //     acc[item.title] = sortedChildren;
    //     return acc;
    //   }, {});
    // }
  }
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadForms();
  }

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  titleWiseChildren: Record<string, any[]> = {};

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  loadForms() {
    console.log(this.decreptedroleIdString);

    this.loadingRecords = true;
    this.api.getForms(this.decreptedroleId).subscribe(
      (data: HttpResponse<any>) => {
        // console.log(data);

        const statusCode = data.status;
        const datalist = data.body.data;
        // console.log(datalist);

        if (statusCode === 200) {
          this.forms = datalist?.sort((a, b) => a.SEQ_NO - b.SEQ_NO);

          // Create an object that maps each title to its corresponding children
          this.titleWiseChildren = this.forms?.reduce((acc, item) => {
            // Sort children by SEQ_NO
            const sortedChildren =
              item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren; // Associate title with its sorted children
            return acc;
          }, {});
          this.loadingRecords = false;
        } else {
          this.forms = [];
          this.message.error('Something Went Wrong', '');
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
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  filterForms(): void {
    // If the search query is less than three characters, reset to original forms
    if (this.searchQuery.trim().length < 3) {
      this.titleWiseChildren = this.forms.reduce((acc, item) => {
        const sortedChildren =
          item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
        acc[item.title] = sortedChildren;
        return acc;
      }, {});
      this.showclass = false;
      return;
    }

    // Perform the filtering if the search query has at least three characters
    this.titleWiseChildren = this.forms.reduce((acc, item) => {
      const filteredChildren =
        item.children
          ?.filter((child: any) =>
            child.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];

      if (filteredChildren.length > 0) {
        acc[item.title] = filteredChildren;
      }
      this.showclass = false;
      return acc;
    }, {});
  }
}
