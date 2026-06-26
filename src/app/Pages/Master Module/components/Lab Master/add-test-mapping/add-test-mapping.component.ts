import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';

@Component({
  selector: 'app-add-test-mapping',
  templateUrl: './add-test-mapping.component.html',
  styleUrls: ['./add-test-mapping.component.css']
})
export class AddTestMappingComponent {
  @Input() drawerTestMapping: boolean = false;
  @Input() data: LabMaster = new LabMaster();
  @Input() closeCallbackmapping!: Function;
  isSpinning = false;
  isOk = true;
  SELECTED_RECORDS: number = 0;
  checked = false;
  tecnicalSpecification: any;
  tecnicalSpecificationisSpinning = false;
  searchText:any = ""

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
  ) { }


  mapTechnicalDrawerClose() {
    this.drawerTestMapping = false;

  }


  mapTechnicalDrawerSave() {
    // console.log(this.setOfCheckedId.size,this.DESCRIPTION);

    //   if (
    //     this.setOfCheckedId.size === 0 &&
    //     (this.DESCRIPTION == null ||
    //       this.DESCRIPTION == undefined ||
    //       this.DESCRIPTION.trim() === '')
    //   ) {
    //     this.message.error(
    //       'Please Select Atleast One Technical Specification Or Add Description',
    //       ''
    //     );
    //   } else {
    //     let seenIds = new Set();

    //     let formattedData: any = this.selectedItems
    //       .filter((item: any) => {
    //         if (seenIds.has(item.TECHNICAL_SPECS_ID)) {
    //           return false;
    //         } else {
    //           seenIds.add(item.TECHNICAL_SPECS_ID);
    //           return true;
    //         }
    //       })
    //       .map((item: any) => ({
    //         TECHNICAL_SPECS_ID: item.TECHNICAL_SPECS_ID,
    //         TECHNICAL_SPECS: item.TITLE,
    //         IS_ACTIVE: item.IS_ACTIVE,
    //       }));

    //     // console.log(formattedData);

    //     if (this.DESCRIPTION) {
    //       var TempformattedData: any = [
    //         ...formattedData,
    //         {
    //           TECHNICAL_SPECS_ID: 0,
    //           TECHNICAL_SPECS: this.DESCRIPTION,
    //           IS_ACTIVE: 1,
    //         },
    //       ];
    //     } else {
    //       var TempformattedData = formattedData;
    //     }

    //     const dataToSave = {
    //       data: TempformattedData,
    //     };

    //     console.log(dataToSave, 'dataToSavedataToSavedataToSavedataToSave');

    //     this.api.MapTechnicalSpecificationCreate(dataToSave).subscribe((data) => {
    //       if (data['code'] == '200') {
    //         this.message.success(
    //           'Technical Specification Mapped Successfully',
    //           ''
    //         );

    //         this.drawerTestMapping = false;
    //         formattedData = [];
    //         TempformattedData = [];
    //         this.DESCRIPTION = '';
    //       }
    //       // else if (formattedData.length === 0) {
    //       //   this.message.error(
    //       //     'Please Map Atleast One Technical Specification',
    //       //     ''
    //       //   );
    //       // }
    //       else {
    //         this.message.error('Technical Specification Mapping Failed', '');
    //       }
    //     });
    //   }
    // }

  }


  onAllChecked(value: boolean): void {
    // this.checked = value;
    // this.indeterminate = false;

    // if (value) {
    //   this.setOfCheckedId.clear();
    //   this.selectedItems = []; // Clear selectedItems to avoid duplicates
    //   this.tecnicalSpecification.forEach((data) => {
    //     if (typeof data === 'object') {
    //       data.checked = true;
    //       this.checked = true;
    //       data.IS_ACTIVE = 1; // Set IS_ACTIVE to 1
    //       this.setOfCheckedId.add(data.TECHNICAL_SPECS_ID);
    //       this.selectedItems.push(data); // Add each item to selectedItems
    //     }
    //   });
    // } else {
    //   this.tecnicalSpecification.forEach((data) => {
    //     if (typeof data === 'object') {
    //       data.checked = false;
    //       data.IS_ACTIVE = 0; // Set IS_ACTIVE to 0
    //     }
    //   });
    //   this.setOfCheckedId.clear();
    //   this.selectedItems = []; // Clear selectedItems
    // }

    // localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    // this.updateTotalRecords();
  }

  sortData(sortKey: string, sortOrder: any): void {
    // this.tecnicalSpecification.sort((a, b) => {
    //   const valA = a[sortKey].toLowerCase();
    //   const valB = b[sortKey].toLowerCase();
    //   if (valA < valB) return sortOrder === 'ascend' ? -1 : 1;
    //   if (valA > valB) return sortOrder === 'ascend' ? 1 : -1;
    //   return 0;
    // });
  }


  selectedItems: any[] = [];
  onItemChecked(item: any, checked: boolean): void {
    // console.log(item, checked);
    // this.updateCheckedSet(item.TECHNICAL_SPECS_ID, checked);

    // if (checked) {
    //   item.IS_ACTIVE = 1;
    //   this.selectedItems.push(item);
    //   localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    // } else {
    //   item.IS_ACTIVE = 0;

    //   this.selectedItems = this.selectedItems.filter(
    //     (i) => i.TECHNICAL_SPECS_ID !== item.TECHNICAL_SPECS_ID
    //   );
    // }

    // this.tecnicalSpecification.forEach((data) => {
    //   if (typeof data === 'object') {
    //     data.checked = this.setOfCheckedId.has(data.TECHNICAL_SPECS_ID);
    //   }
    // });

    // this.updateTotalRecords();
    // this.updateSelectAllState();
  }

  search(data:any){
  }


  dataList1= [
    {
      "DURATION": "5 hours",
      "INSTRUCTIONS": "Online Class",
    },
    {
      "DURATION": "3 days",
      "INSTRUCTIONS": "Workshop",
    }
   
  ]

}
