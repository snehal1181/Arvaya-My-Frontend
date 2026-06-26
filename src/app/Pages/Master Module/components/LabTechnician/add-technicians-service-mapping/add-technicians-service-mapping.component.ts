import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabMaster } from '../../../Models/LabMaster';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-technicians-service-mapping',
  templateUrl: './add-technicians-service-mapping.component.html',
  styleUrls: ['./add-technicians-service-mapping.component.css'],
})
export class AddTechniciansServiceMappingComponent {
  @Input() drawerTechnicianserviceMapping: boolean = false;
  @Input() data: LabMaster = new LabMaster();
  @Input() mapTechnicalDrawerClose!: Function;
  @Input() roleID: number;
  isSpinning = false;
  isOk = true;
  tecnicalSpecification: any;
  tecnicalSpecificationisSpinning = false;
  searchText: any = '';
  checked = false;
  forms: [];
  OriginalList: any;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  // mapTechnicalDrawerClose() {
  //   // console.log('Drawer Close');
  //   this.drawerTechnicianserviceMapping = false;
  // }
  // get closeCallbackTechnicianservice() {
  //   return this.drawerCloseTechnicianserviceMapping.bind(this);
  // }
  ngOnInit() {
    this.search(1);

  }
  onChange(result: Date): void {
    // console.log('onChange: ', result);
  }
  rougthdata() {
    // this.loadingForm = true;
    // this.api.getRoughtdata(0, 0, '', '', '').subscribe(
    //   (data) => {
    //     this.forms = data['data'];
    //     this.loadingForm = false;
    //   },
    //   (err) => {
    //     //this.loadingForm = false;
    //   }
    // );
  }
  validateData(data: {
    data: { IS_ACTIVE: boolean }[];
  }) {
    const invalidEntries = data.data.filter(
      (entry) => entry.IS_ACTIVE
    );

    if (invalidEntries.length > 0) {
      this.message.error('Please Select Association Date For The Selected Doctor .', '');
      this.tecnicalSpecificationisSpinning = false;

    }
    else {

    }

    // console.log('Validation passed.');
  }
  mapTechnicalDrawerSave() {
    this.tecnicalSpecificationisSpinning = true;
    if (this.datatoSendDoctor.length == 0) {
      this.message.error('Please Select Mapping Data', '');
      this.tecnicalSpecificationisSpinning = false;
    } else {
      // console.log(this.datatoSendDoctor);
      let data = {
        data: this.datatoSendDoctor,
      };
      // this.validateData(data);
      this.api.MapTechnicianService(data).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status == 200) {
            this.tecnicalSpecificationisSpinning = false;
            this.message.success('Service Mapped Successfully', '');
            this.drawerTechnicianserviceMapping = false;
            this.mapTechnicalDrawerClose()
          } else {
            this.tecnicalSpecificationisSpinning = false;
            this.message.error('Failed to map Service', '');
          }
        },
        (err) => {
          this.tecnicalSpecificationisSpinning = false;
          console.log(err);
        }
      );
    }
  }
  // checked = false;
  indeterminate = false;
  SELECTED_RECORDS = 0;
  RECORDS = 0;
  setOfCheckedId = new Set();
  datatoSendDoctor: any = [];
  datatoSendProcedure: any = [];
  selectedItems: any = [];
  searchText2 = '';
  sortData(sortKey, sortOrder) {
    this.dataList1.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB) * (sortOrder === 'ascend' ? 1 : -1);
    });
  }
  mappedIDs = new Set<number>();
  onAllChecked(value) {
    this.mappedIDs.clear();
    // console.log(this.datatoSendDoctor);
    if (this.datatoSendDoctor.length > 0) {
      this.datatoSendDoctor.forEach((data) => {
        this.mappedIDs.add(data.id);
      });
    }
    // console.log(this.mappedIDs);
    this.checked = value;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.selectedItems = [];
    this.datatoSendDoctor = [];
    this.dataList1.forEach((data) => {
      if (typeof data === 'object') {
        data.checked = value;
        // data.ASSOCIATION_DATE = new Date();
        data.IS_ACTIVE = value ? 1 : 0;
        const doctorData = {
          client_id: 1,
          service_id: data.id,
          lab_technician_id: this.roleID === 3 ? this.data.technician_id : this.data.id,
          is_active: value ? 1 : 0,
          seq_no: data.seq_no ? data.seq_no + 1 : 0,
        };
        if (value) {
          this.setOfCheckedId.add(data.id);
          this.selectedItems.push(data);
        }
        this.datatoSendDoctor.push(doctorData);
        // this.datatoSendDoctor.forEach(data=>{
        //   data.ASSOCIATION_DATE=this.datePipe.transform(new Date(),'yyyy-MM-dd')
        // })
      }
    });
    // console.log(this.dataList1);

    if (this.mappedIDs) {
      // this.datatoSendDoctor.forEach((data) => {
      const mappedIDsArray = Array.from(this.mappedIDs);
      this.datatoSendDoctor.forEach((data, index) => {
        if (mappedIDsArray[index] !== undefined) {
          data.id = mappedIDsArray[index];
        }
      });
      // });
    }
    localStorage.setItem('editData', JSON.stringify(this.selectedItems));
    this.updateTotalRecords();
    // this.updateCheckedSet(item.ID, checked);
  }
  keyup2() {
    if (this.searchText2.trim().length >= 3 || this.searchText2.length === 0) {
      this.searchDoctor();
    }
  }
  searchDoctor() {
    if (!this.searchText2.trim()) {
      this.dataList1 = [...this.OriginalList];
    } else {
      const searchText = this.searchText2.trim().toLowerCase();
      this.dataList1 = this.OriginalList.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchText)
      );
    }
  }
  updateTotalRecords() {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }
  onItemChecked(item, checked) {
    // Update the item properties
    // item.ASSOCIATION_DATE = new Date();
    item.IS_ACTIVE = checked ? 1 : 0;

    // Prepare the doctorData object
    const doctorData = {
      client_id: 1,
      service_id: item.id,
      lab_technician_id: this.roleID === 3 ? this.data.technician_id : this.data.id,
      is_active: checked ? 1 : 0,
      seq_no: item.seq_no + 1,
    };

    // Find index of the item in datatoSendDoctor
    const existingIndex = this.datatoSendDoctor.findIndex(
      (data) => data.service_id === item.id
    );

    if (existingIndex === -1) {
      // If the item is not in the array, add it
      this.datatoSendDoctor.push(doctorData);
    } else {
      // If the item exists, update its IS_ACTIVE property
      this.datatoSendDoctor[existingIndex].is_active = doctorData.is_active;
    }

    // Update the selectedItems array similarly
    const selectedIndex = this.selectedItems.findIndex(
      (data) => data.service_id === item.id
    );

    if (checked) {
      if (selectedIndex === -1) {
        this.selectedItems.push(doctorData);
      }
    } else {
      if (selectedIndex !== -1) {
        this.selectedItems[selectedIndex].is_active = 0;
      }
    }

    // Log the updated datatoSendDoctor array
    // console.log(this.datatoSendDoctor);

    // Update other states or UI elements
    this.updateCheckedSet(item.id, checked);
    this.updateTotalRecords();
  }

  updateCheckedSet(id, checked) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    const totalItems = this.dataList1.length;
    const selectedItems = this.setOfCheckedId.size;
    this.checked = selectedItems === totalItems;
    this.indeterminate = selectedItems > 0 && selectedItems < totalItems;
  }
  onDateChange(i, data) {
    // if (i && data && this.datatoSendDoctor.length > 0) {
    this.datatoSendDoctor[i]['ASSOCIATION_DATE'] = this.datePipe.transform(
      data,
      'yyyy-MM-dd'
    );
    // }
    // console.log(this.datatoSendDoctor[i]);
    // else{
    // }
  }

  dataList1: any = [];
  search(data: any) {
    this.tecnicalSpecificationisSpinning = true;
    let filter = " AND IS_ACTIVE=1 AND TYPE='" + 'L' + "'";
    this.api.getTechnicianServiceMapList(filter).subscribe(
      (res: HttpResponse<any>) => {
        if (res.status == 200) {
          this.tecnicalSpecificationisSpinning = false;
          this.OriginalList = res.body.data;
          this.dataList1 = res.body.data;
          let ID = this.roleID !== 3 ? this.data.id : this.data.technician_id;
          this.api.getTechnicianServiceMappedList(ID).subscribe(
            (res: HttpResponse<any>) => {
              if (res.status === 200) {
                const compareData = res.body.data || [];
                if (compareData.length > 0) {
                  this.dataList1.forEach((doctor) => {
                    const matchedData = compareData.find(
                      (mapped) => mapped.service_id === doctor.id
                    );
                    // console.log(matchedData);

                    if (matchedData) {
                      if (matchedData.is_active == 1) {
                        this.setOfCheckedId.add(matchedData.service_id);
                      }
                      doctor.checked = matchedData.is_active == 1;
                      doctor.is_active = matchedData.is_active;
                      // doctor.ASSOCIATION_DATE = matchedData.ASSOCIATION_DATE;
                      this.datatoSendDoctor.push({ ...matchedData });
                      // Id=matchedData.ID
                      this.selectedItems.push({ ...matchedData });
                    }
                    // else {
                    //   doctor.checked = false;
                    //   doctor.IS_ACTIVE = 0;
                    //   const doctorData = {
                    //     CLIENT_ID: 1,
                    //     SERVICE_ID: doctor.ID,
                    //     LAB_TECHNICIAN_ID: this.roleID === 3 ? this.data.TECHNICIAN_ID : this.data.ID,
                    //     IS_ACTIVE: 0,
                    //     SEQ_NO: data.SEQ_NO,
                    //   };
                    //   this.datatoSendDoctor.push(doctorData);
                    //   this.selectedItems.push(doctorData);
                    // }
                  });
                }
                // this.datatoSendDoctor.forEach((data) => {
                //   data.ID = ;
                // });
                // console.log(this.datatoSendDoctor);
                const totalItems = this.dataList1.length;
                const selectedItems = this.setOfCheckedId.size;
                this.checked = selectedItems === totalItems;
                this.indeterminate =
                  selectedItems > 0 && selectedItems < totalItems;
              }
            },
            () => {
              this.tecnicalSpecificationisSpinning = false;
              this.message.error('Failed to fetch mapped doctor list', '');
            }
          );
        } else {
          this.dataList1 = [];
          this.tecnicalSpecificationisSpinning = false;
        }
      },
      (err) => {
        this.tecnicalSpecificationisSpinning = false;
      }
    );
  }
}
