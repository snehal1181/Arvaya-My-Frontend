import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

export interface FilterCondition {
  field: string; // Field key
  comparator: string; // Comparison operator, e.g., '=', '>', '<'
  value: any; // Value to compare with
}

export interface ConditionGroup {
  operator: 'AND' | 'OR'; // Logical operator for the group
  conditions: { condition: FilterCondition; operator?: 'AND' | 'OR' }[]; // List of conditions in the group with logical operators
  groups?: ConditionGroup[]; // Nested condition groups
}

export interface FilterField {
  key: string; // Unique identifier for the field
  label: string; // Label displayed to the user
  type: 'text' | 'number' | 'date' | 'select' | 'time' | 'datetime'; // Field type
  comparators: string[]; // List of comparators applicable to the field
  options?: { value: any; display: string }[]; // Options for select type fields
  placeholder?: string; // Placeholder for input fields
}

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.css'],
  providers: [DatePipe],
})
export class MainFilterComponent {
  @Input() fields: FilterField[] = [];
  @Input() filterGroups: ConditionGroup[] = [];
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    public datePipe: DatePipe
  ) {
    if (this.filterGroups.length === 0) {
      this.filterGroups.push({
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      });
    }
  }

  ngOnInit() {
    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
    // console.log(this.filterGroups);
  }
  @Output() filterApplied = new EventEmitter<any>();

  handleOk() {
    if (this.name == null || this.name == undefined || this.name.trim() == '') {
      this.message.error('Enter name for filter.', '');
    } else {
      // this.isVisible = false;
      this.name = this.name.trim();

      // Start loading
      //this.loading = true;
      // Generate the query string from filter groups
      var query = this.convertToQuery(this.filterGroups);

      // Pass the query to saveFilter
      this.saveFilter(query, false);
    }
  }

  addGroup() {
    var groupIndex = this.filterGroups.length - 1;
    var j = this.filterGroups[groupIndex].conditions.length - 1;
    if (!this.filterGroups[groupIndex].conditions[j]['operator']) {
      this.message.error('Please fill all fields first', '');
    } else if (!this.filterGroups[groupIndex].conditions[j].condition.field) {
      this.message.error('Please fill all fields first', '');
    } else if (
      !this.filterGroups[groupIndex].conditions[j].condition.comparator
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
        undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please fill all fields first', '');
    } else {
      this.filterGroups.push({
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      });
    }
  }

  removeGroup(groupIndex: number) {
    this.filterGroups.splice(groupIndex, 1);
  }

  addCondition(groupIndex: number, j) {
    if (!this.filterGroups[groupIndex].conditions[j]['operator']) {
      this.message.error('Please select a operator', '');
    } else if (!this.filterGroups[groupIndex].conditions[j].condition.field) {
      this.message.error('Please select a field', '');
    } else if (
      !this.filterGroups[groupIndex].conditions[j].condition.comparator
    ) {
      this.message.error('Please select comparator', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
        undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please enter value', '');
    } else {
      this.filterGroups[groupIndex].conditions.push({
        condition: {
          field: '',
          comparator: '',
          value: '',
        },
        operator: 'AND',
      });
    }
  }

  removeCondition(groupIndex: number, conditionIndex: number) {
    this.filterGroups[groupIndex].conditions.splice(conditionIndex, 1);
  }

  removeNestedGroup(groupIndex: number, nestedGroupIndex: number) {
    this.filterGroups[groupIndex].groups!.splice(nestedGroupIndex, 1);
  }

  getComparators(fieldKey: string): string[] {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.comparators || [];
  }

  getPlaceholder(fieldKey: string): string {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.placeholder || '';
  }

  getOptions(fieldKey: string): { value: any; display: string }[] {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.options || [];
  }

  isInputField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'text' || field?.type === 'number';
  }

  isDateField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'date';
  }

  isTimeField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'time';
  }

  isSelectField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'select';
  }

  onFieldChange(condition: FilterCondition) {
    // Reset comparator and value when the field changes
    condition.comparator = '';
    condition.value = '';
  }

  resetFilters() {
    this.filterGroups = [];
    this.filterGroups.push({
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    });
  }

  //   convertToQuery(filterGroups: ConditionGroup[]): string {
  //     const processGroup = (group: ConditionGroup): string => {
  //       console.log(group,'group111111111111');

  //       const conditions = group.conditions.map((conditionObj) => {
  //         const { field, comparator, value } = conditionObj.condition;
  //         let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings

  //         if (field === 'JOB_CREATED_DATE') {
  //           // Wrap the date field in DATE() and format the value
  //           const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
  //           processedValue = formattedDate ? `'${formattedDate}'` : null;
  //           return `DATE(${field}) ${comparator} ${processedValue}`;
  //         } else {
  //           // Process other fields
  //           processedValue = typeof value === 'string' ? `'${value}'` : value;
  //         }

  //         if (field === 'ASSIGNED_DATE') {
  //           // Wrap the date field in DATE() and format the value
  //           const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
  //           processedValue = formattedDate ? `'${formattedDate}'` : null;
  //           return `DATE(${field}) ${comparator} ${processedValue}`;
  //         } else {
  //           // Process other fields
  //           processedValue = typeof value === 'string' ? `'${value}'` : value;
  //         }

  //         if (field === 'SCHEDULED_DATE_TIME') {
  //           // Wrap the date field in DATE() and format the value
  //           const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
  //           processedValue = formattedDate ? `'${formattedDate}'` : null;
  //           return `DATE(${field}) ${comparator} ${processedValue}`;
  //         } else {
  //           // Process other fields
  //           processedValue = typeof value === 'string' ? `'${value}'` : value;
  //         }

  //         if (field === 'START_TIME') {
  //           const formattedTime = this.datePipe.transform(value, 'HH:mm:00');
  //           processedValue = formattedTime ? `'${formattedTime}'` : null;
  //           return `${field} ${comparator} ${processedValue}`;
  //         }

  //         if (field === 'END_TIME') {
  //           const formattedTime = this.datePipe.transform(value, 'HH:mm:00');
  //           processedValue = formattedTime ? `'${formattedTime}'` : null;
  //           return `${field} ${comparator} ${processedValue}`;
  //         }

  //         switch (comparator) {
  //           case 'Contains':
  //             return `${field} LIKE '%${value}%'`;
  //           case 'Does Not Contains':
  //             return `${field} NOT LIKE '%${value}%'`;
  //           case 'Starts With':
  //             return `${field} LIKE '${value}%'`;
  //           case 'Ends With':
  //             return `${field} LIKE '%${value}'`;
  //           default:
  //             return `${field} ${comparator} ${processedValue}`;
  //         }
  //       });
  // var operator :any;
  //       const operatornew = group.conditions.map((opertorobj)=>{
  //         operator = opertorobj.operator;

  //       })
  //       console.log(operator,'operatoroperatoroperatoroperator');
  //       const nestedGroups = (group.groups || []).map(processGroup);

  //       // Combine conditions and nested group queries using the group's operator
  //       const allClauses = [...conditions, ...nestedGroups];

  //       return `(${allClauses.join(` ${operator} `)})`;
  //     };

  //     console.log('filterGroups', filterGroups);
  //     return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with 'AND'
  //   }
  isDateTimeField(fieldKey: string): boolean {
    const field = this.fields.find((f) => f.key === fieldKey);
    return field?.type === 'datetime';
  }
  convertToQuery(filterGroups: ConditionGroup[]): string {
    // console.log(filterGroups);

    const processGroup = (group: ConditionGroup): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings
        if (field === 'AVAILABLE_FROM') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (field === 'FROM_DATE' || field === 'START_DATE') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (field === 'TO_DATE' || field === 'END_DATE') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (field === 'ASSIGNED_DATE') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }
        if (field === 'PROPERTY_BUILT_DATE') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }

        if (field === 'SCHEDULED_DATE_TIME') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }
        if (field === 'DATE_OF_BIRTH' || field === 'DOB') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `DATE(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }
        if (field === 'START_TIME') {
          const formattedTime = this.datePipe.transform(value, 'HH:mm:00'); // Format time as 'HH:mm:00'
          if (formattedTime) {
            processedValue = `time_format('${formattedTime}', '%H:%i')`;
            return `${field} ${comparator} ${processedValue}`;
          }
          return null; // Return null if the value cannot be formatted
        }

        if (field === 'END_TIME') {
          const formattedTime = this.datePipe.transform(value, 'HH:mm:00'); // Format time as 'HH:mm:00'
          if (formattedTime) {
            processedValue = `time_format('${formattedTime}', '%H:%i')`;
            return `${field} ${comparator} ${processedValue}`;
          }
          return null; // Return null if the value cannot be formatted
        }
        if (field === 'DATE_TIME') {
          // Wrap the date field in DATE() and format the value
          const formattedDate = this.datePipe.transform(
            value,
            'yyyy-MM-dd HH:mm:ss'
          );
          processedValue = formattedDate ? `'${formattedDate}'` : null;
          return `(${field}) ${comparator} ${processedValue}`;
        } else {
          // Process other fields
          processedValue = typeof value === 'string' ? `'${value}'` : value;
        }
        switch (comparator) {
          case 'Contains':
            return `${field} LIKE '%${value}%'`;
          case 'Does Not Contains':
            return `${field} NOT LIKE '%${value}%'`;
          case 'Starts With':
            return `${field} LIKE '${value}%'`;
          case 'Ends With':
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });

      const nestedGroups = (group.groups || []).map(processGroup);
      // Join conditions with their respective operators, but no operator before the first condition
      const allClauses = conditions.map((condition, index) => {
        const operator = group.conditions[index]?.operator;
        // Only prepend the operator if it's not the first condition (index > 0)
        if (operator && index > 0) {
          return `${operator} ${condition}`;
        } else {
          return condition; // No operator for the first condition
        }
      });

      return allClauses.length > 0
        ? `(${allClauses.join(' ')})` // Join without additional operator between clauses
        : '';
    };

    // Manually join top-level groups with their respective operator
    let queryParts: string[] = [];

    filterGroups.forEach((group, index) => {
      const groupQuery = processGroup(group); // Process each group
      if (index > 0) {
        // Add the operator (AND/OR) for subsequent groups
        queryParts.push(` ${group.operator} `);
      }
      // console.log(groupQuery)
      queryParts.push(groupQuery); // Add the processed query for the group
    });
    // console.log(queryParts);

    // Return the combined query
    return queryParts.join('');
    // return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with 'AND'
  }

  name = '';
  isVisible: boolean = false;
  openNameModal() {
    var groupIndex = this.filterGroups.length - 1;
    var j =
      this.filterGroups[this.filterGroups.length - 1].conditions.length - 1;

    if (
      this.filterGroups[groupIndex].conditions[j]['operator'] == undefined ||
      this.filterGroups[groupIndex].conditions[j]['operator'] == null
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.field ==
        undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.field == null
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.comparator ==
        undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.comparator ==
        null ||
      this.filterGroups[groupIndex].conditions[j].condition.comparator == ''
    ) {
      this.message.error('Please fill all fields first', '');
    } else if (
      this.filterGroups[groupIndex].conditions[j].condition.value ==
        undefined ||
      this.filterGroups[groupIndex].conditions[j].condition.value == null ||
      this.filterGroups[groupIndex].conditions[j].condition.value == ''
    ) {
      this.message.error('Please fill all fields first', '');
    } else {
      this.isVisible = true;
      this.name = '';
    }
  }
  @Input() drawerClose;
  @Input() drawerVisible: boolean = false;

  handleCancel() {
    this.isVisible = false;
  }

  loading: boolean = false;

  userId = sessionStorage.getItem('userId');
  @Input() TabId: number;
  //currentTabId = this.TabId; // Holds the current tab ID
  currentUserId: number; // Holds the current user ID
  currentClientId = 1; // Holds the current client ID
  filterQuery;
  role = sessionStorage.getItem('role');
  decreptedroleString = this.role
    ? this.commonFunction.decryptdata(this.role)
    : '';
  saveFilter(query: string, addNew: boolean) {
    if (!this.name || this.name.trim() === '') {
      this.message.error('Please enter a valid filter name.', '');
      return;
    }
    let filterData;
    if (this.decreptedroleString == 'B') {
      filterData = {
        TAB_ID: this.TabId,
        APP_USER_ID: this.commonFunction.decryptdata(this.userId || ''),
        CLIENT_ID: this.currentClientId,
        FILTER_NAME: this.name.trim(),
        FILTER_QUERY: query,
        FILTER_JSON: JSON.stringify(this.filterGroups),
      };
    } else {
      filterData = {
        TAB_ID: this.TabId,
        USER_ID: this.commonFunction.decryptdata(this.userId || ''),
        CLIENT_ID: this.currentClientId,
        FILTER_NAME: this.name.trim(),
        FILTER_QUERY: query,
        FILTER_JSON: JSON.stringify(this.filterGroups),
      };
    }

    this.loading = true;
    this.api.createFilterData(filterData).subscribe(
      (response) => {
        // Stop loading
        if (response.code === 200) {
          this.message.success('Filter saved successfully.', '');
          this.loading = false;
          this.drawerClose(); // Close drawer
          this.isVisible = false; // Close modal
        } else {
          this.message.error('Failed to save the filter.', '');
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false; // Stop loading
        this.message.error('An error occurred while saving the filter.', '');
      }
    );
  }
}
