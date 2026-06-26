import { ChangeDetectorRef, Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { LabTestSlot } from '../../../Models/LabTestSlot';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { addDays, differenceInCalendarDays, subDays } from 'date-fns';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-test-slot-master',
  templateUrl: './test-slot-master.component.html',
  styleUrls: ['./test-slot-master.component.css'],
})
export class TestSlotMasterComponent {
  spinnnnnnn: boolean = false; // Using a more descriptive name, e.g., isLoadingTechnicians
  tableloading: boolean = false; // Using a more descriptive name, e.g., isLoadingSchedule

  selectedTechnicianId: any;
  techniciansData: any[] = [];
  originalTechniciansData: any[] = [];

  todayDate: Date = new Date();
  columns: string[] = []; // Time slots for the calendar
  sheduledata: any[] = []; // Transformed schedule data for table rows
  mainCellMergeArray: number[][] = []; // Array to store colspan values (X for start, 0 for covered)

  uniqueJobValues: any[] = []; // Used for color mapping based on SESSION_ID
  colorArray: string[] = []; // Stores generated colors

  currentPopoverData: any = {}; // Data for the popover
  jobNo: any; // Used in popover, derived from slot data
  jobNoEdit: any; // Used in popover, derived from slot data

  labId: string | null = sessionStorage.getItem('labId');
  private commonFunction: CommonFunctionService = new CommonFunctionService();

  decreptedlabIDString: string = this.labId
    ? this.commonFunction.decryptdata(this.labId)
    : '';
  labID: number = parseInt(this.decreptedlabIDString, 10);

  // --- Constructor ---
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cdr: ChangeDetectorRef, // ChangeDetectorRef for manual change detection if needed
    private datePipe: DatePipe // Injected DatePipe
  ) {}

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    // Mock sessionStorage for local testing if 'labId' is not set
    if (!sessionStorage.getItem('labId')) {
      // In a real app, you'd handle this more robustly (e.g., redirect to login)
      // For demonstration, let's assume a mock encrypted ID if not found
      sessionStorage.setItem('labId', 'mockEncryptedLabId'); // Set a mock value for testing
      this.labID = parseInt(
        this.commonFunction.decryptdata('mockEncryptedLabId'),
        10
      );
    }

    this.getTechnicianData();
    this.columns = this.generateTimeColumns();
    // console.log('Generated Columns:', this.columns);
  }

  // --- API Calls ---
  getTechnicianData(): void {
    this.spinnnnnnn = true;
    this.api.getmapTechnician(this.labID).subscribe(
      (data: any) => {
        if (data['status'] === 200) {
          this.originalTechniciansData = data.body.data;
          this.techniciansData = [...this.originalTechniciansData];

          if (this.techniciansData.length > 0) {
            // Select the first technician by default, or specific one for testing
            this.selectedTechnicianId = this.techniciansData[0]?.ID;
            this.getCalendarData(this.selectedTechnicianId, this.todayDate);
          }
        } else {
          this.message.error(
            'Server Not Found or Failed to get Technicians.',
            ''
          );
        }
        this.spinnnnnnn = false;
      },
      (err: HttpErrorResponse) => {
        this.handleHttpError(err);
        this.spinnnnnnn = false;
      }
    );
  }

  async getCalendarData(technicianId: any, date: Date): Promise<void> {
    this.tableloading = true;
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    const filterQuery = ` AND TECHNICIAN_ID=${technicianId} AND LAB_ID=${this.labID} AND DATE='${formattedDate}' AND IS_BLOCKED!=1`;

    this.api.getpatient(filterQuery).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          // Transform raw backend data into a format suitable for the table
          this.sheduledata = this.transformBackendData(response.body['data']);
          // console.log('response body data', response.body.data);
          // console.log('sheduledata (transformed)', this.sheduledata);

          // Process the transformed data to calculate cell merges (colspans)
          this.processScheduleData();
        } else {
          this.sheduledata = [];
          this.message.error('Failed to retrieve calendar data.', '');
        }
        this.tableloading = false;
        this.cdr.detectChanges(); // Manually trigger change detection after data update
      },
      (err: HttpErrorResponse) => {
        this.handleHttpError(err);
        this.tableloading = false;
      }
    );
  }

  // --- Data Transformation & Processing ---

  // Generates time slots for table columns (e.g., "00:00", "00:10", ..., "23:50")
  generateTimeColumns(): string[] {
    const columns: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        columns.push(formattedTime);
      }
    }
    return columns;
  }

  /**
   * Transforms raw backend schedule data into a row-based format suitable for the table.
   * Resolves overlaps by prioritizing earlier-starting slots.
   * Populates time slots with a comma-separated string: "SESSION_ID,SLOT_ID,SESSION_NAME"
   */
  private transformBackendData(rawData: any[]): any[] {
    const transformedRows: any[] = [];
    const technicianRowsMap: { [id: string]: any } = {}; // Use a map to build rows for technicians present in rawData

    // If rawData is empty, we return an empty array immediately.
    if (!rawData || rawData.length === 0) {
      return [];
    }

    // Ensure rawData is sorted by START time for consistent overlap resolution
    // This sorting is important regardless of how many technicians are in rawData
    rawData.sort((a, b) => {
      const aStart = new Date(`2000-01-01T${a.START}`).getTime();
      const bStart = new Date(`2000-01-01T${b.START}`).getTime();
      return aStart - bStart;
    });

    // Process each booking slot in rawData to build/update technician rows
    rawData.forEach((slot) => {
      const technicianId = slot.TECHNICIAN_ID;

      // IMPORTANT: Only create or get the row for technicians *present in rawData*
      // This implicitly handles your "if no rawdata no rows" and "transformation based on rawdata"
      if (!technicianRowsMap[technicianId]) {
        // Find the full technician details from `this.techniciansData`
        // This is necessary to get `LAB_TECHNICIAN_NAME` and `IS_SPECIAL`
        const techDetails = this.techniciansData.find(
          (tech) => tech.TECHNICIAN_ID === technicianId
        );

        if (techDetails) {
          // Initialize the technician's row if it doesn't exist in our current processing map
          technicianRowsMap[technicianId] = {
            TECHNICIAN_ID: techDetails.TECHNICIAN_ID,
            TECHNICIAN_NAME: techDetails.LAB_TECHNICIAN_NAME, // Corrected to LAB_TECHNICIAN_NAME as per your code
            IS_SPECIAL: techDetails.IS_SPECIAL || 0,
          };
          // Initialize all time columns for this specific technician to null
          this.columns.forEach((col) => {
            technicianRowsMap[technicianId][col] = null;
          });
        } else {
          console.warn(
            `Booking found for technician ID: ${technicianId}, but no matching technician details in this.techniciansData. Skipping.`
          );
          return; // Skip this booking if technician details are not found
        }
      }

      // Now populate the time slots for the current booking slot
      const startTimeStr = slot.START;
      const endTimeStr = slot.END;
      const slotId = slot.ID;
      const sessionId = slot.SESSION_ID;
      const sessionName = slot.SESSION_NAME;

      const dummyDate = '2000-01-01T';
      const startDateTime = new Date(`${dummyDate}${startTimeStr}`);
      const endDateTime = new Date(`${dummyDate}${endTimeStr}`);

      let currentIntervalMoment = new Date(startDateTime.getTime());

      while (currentIntervalMoment.getTime() <= endDateTime.getTime()) {
        const formattedInterval = this.datePipe.transform(
          currentIntervalMoment,
          'HH:mm'
        );

        if (formattedInterval && this.columns.includes(formattedInterval)) {
          // Only assign if the slot is currently empty (first booking wins for overlaps)
          if (technicianRowsMap[technicianId][formattedInterval] === null) {
            technicianRowsMap[technicianId][
              formattedInterval
            ] = `${sessionId},${slotId},${sessionName}`;
          }
        }
        currentIntervalMoment.setMinutes(
          currentIntervalMoment.getMinutes() + 10
        );
      }
    });

    // Convert the map values (the populated technician rows) into an array
    // This will only contain rows for technicians who had data in rawData
    return Object.values(technicianRowsMap);
  }

  /**
   * Processes the transformed sheduledata to calculate `colspan` values for table rendering.
   * `mainCellMergeArray[rowIndex][colIndex]` will store:
   * - `X` (where X > 0) if this cell is the START of a merge block spanning X columns.
   * - `0` if this cell is covered by a previous merge block and should NOT be rendered.
   */
  private processScheduleData(): void {
    this.mainCellMergeArray = []; // Reset merge array
    this.uniqueJobValues = []; // Reset unique job values for color mapping
    this.colorArray = []; // Reset colors

    const allSessionIds = new Set<string>(); // Use SESSION_ID for color mapping

    // First pass to collect all unique SESSION_IDs for color generation
    this.sheduledata.forEach((row) => {
      this.columns.forEach((col) => {
        const cellValue = row[col]; // e.g., "6,3,Morning"
        if (typeof cellValue === 'string') {
          const sessionId = cellValue.split(',')[0];
          allSessionIds.add(sessionId);
        }
      });
    });
    this.uniqueJobValues = Array.from(allSessionIds);

    // Generate colors for each unique SESSION_ID
    for (let i = 0; i < this.uniqueJobValues.length; i++) {
      this.colorArray.push(this.generateRandomLightColor());
    }

    // Second pass to calculate colspans for each row
    for (let rowIndex = 0; rowIndex < this.sheduledata.length; rowIndex++) {
      const row = this.sheduledata[rowIndex];
      // Initialize row with 0s. 0 means "do not render this cell, it's covered by a colspan".
      const tempCellMergeRow: number[] = new Array(this.columns.length).fill(0);
      let previousFullSlotIdentifier: string | null = null; // "SESSION_ID,SLOT_ID"
      let currentMergeCount = 0;
      let mergeBlockStartIndex = -1;

      for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
        const currentTimeSlot = this.columns[colIndex]; // e.g., "10:30"
        const currentCellValue = row[currentTimeSlot]; // e.g., "6,3,Morning" or null

        // Create a unique identifier for the current slot based on SESSION_ID and SLOT_ID
        const currentFullSlotIdentifier =
          typeof currentCellValue === 'string' &&
          currentCellValue.split(',').length > 1
            ? `${currentCellValue.split(',')[0]}`
            : null;

        if (
          currentFullSlotIdentifier !== null &&
          currentFullSlotIdentifier === previousFullSlotIdentifier
        ) {
          // If the current slot is a continuation of the previous merge block
          currentMergeCount++;
        } else {
          // If it's a new block or a break in the merge
          // Finalize the previous merge block if it existed
          if (mergeBlockStartIndex !== -1 && currentMergeCount > 0) {
            tempCellMergeRow[mergeBlockStartIndex] = currentMergeCount;
          }

          if (currentFullSlotIdentifier !== null) {
            // Start a new merge block
            currentMergeCount = 1;
            mergeBlockStartIndex = colIndex;
            tempCellMergeRow[colIndex] = 1; // Mark as start of a block (will be updated with actual colspan later)
          } else {
            // This is an empty slot (null), so no merge starts or continues here
            currentMergeCount = 0;
            mergeBlockStartIndex = -1;
            tempCellMergeRow[colIndex] = 1; // Mark as a single, non-merged empty cell (colspan 1)
          }
        }
        previousFullSlotIdentifier = currentFullSlotIdentifier;
      }

      // After the loop, handle any pending last merged block in the row
      if (mergeBlockStartIndex !== -1 && currentMergeCount > 0) {
        tempCellMergeRow[mergeBlockStartIndex] = currentMergeCount;
      }

      this.mainCellMergeArray.push(tempCellMergeRow);
    }
    // console.log(
    //   'mainCellMergeArray (calculated colspans):',
    //   this.mainCellMergeArray
    // );
  }

  // --- Helper Methods for Template ---

  // Gets the display text for a cell (e.g., "Morning", "Evening")
  getDisplayText(cellData: any): string {
    if (typeof cellData === 'string') {
      const parts = cellData.split(',');
      if (parts.length > 2) {
        const mainText = parts[2]; // This is 'Morning' or 'Evening'
        // If you want truncation based on project name length (parts[0]), re-enable this:
        // const projectName = parts[0];
        // if (projectName.length > 5) {
        //   return mainText.slice(0, 5) + '...';
        // }
        return mainText; // Return 'Morning' or 'Evening' directly
      }
    }
    return ''; // Return empty string if not a valid string or not enough parts
  }

  // Gets a specific part from the comma-separated cell data string for popover
  getPopoverPart(cellData: any, index: number): string {
    if (typeof cellData === 'string') {
      const parts = cellData.split(',');
      if (parts.length > index) {
        return parts[index];
      }
    }
    return 'N/A'; // Default if data is not a string or index is out of bounds
  }

  // Determines the background color for a cell based on SESSION_ID
  getColorName(cellValue: string): string {
    if (!cellValue) return 'transparent';
    const sessionId = cellValue.split(',')[0]; // Use SESSION_ID for color mapping
    const index = this.uniqueJobValues.indexOf(sessionId);
    // Use colors from colorArray based on index
    return index >= 0 ? this.colorArray[index] : 'rgb(207, 251, 207)'; // Fallback color
  }

  // Generates a random light color for new unique job values
  generateRandomLightColor(): string {
    const r = Math.floor(Math.random() * 155) + 100;
    const g = Math.floor(Math.random() * 155) + 100;
    const b = Math.floor(Math.random() * 155) + 100;
    return `rgb(${r},${g},${b})`;
  }

  // Updates the data for the popover when hovering over a cell
  updatePopoverContext(rowData: any, cellValue: string): void {
    if (cellValue) {
      // rowData contains TECHNICIAN_NAME, etc.
      // cellValue is the string "SESSION_ID,SLOT_ID,SESSION_NAME"
      this.currentPopoverData = {
        TECHNICIAN_NAME: rowData['TECHNICIAN_NAME'],
        slotData: cellValue, // Pass the raw string to the popover context
      };
    } else {
      this.currentPopoverData = {}; // Clear popover data if no cell value
    }
  }

  // --- Date Navigation ---
  navigateBackward(): void {
    this.todayDate = subDays(this.todayDate, 1);
    this.getCalendarData(this.selectedTechnicianId, this.todayDate);
  }

  navigateForward(): void {
    this.todayDate = addDays(this.todayDate, 1);
    this.getCalendarData(this.selectedTechnicianId, this.todayDate);
  }

  onCalendarDateChange(newDate: Date | null): void {
    if (newDate) {
      this.todayDate = newDate;
      this.getCalendarData(this.selectedTechnicianId, this.todayDate);
    }
  }

  // --- Error Handling ---
  handleHttpError(err: HttpErrorResponse): void {
    this.tableloading = false;
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        'Connection Error'
      );
    } else {
      this.message.error(
        `Error: ${err.status} - ${err.statusText || 'Something Went Wrong.'}`,
        'API Error'
      );
    }
  }

  // --- Date Picker Specific ---
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.todayDate) > 0;
  };
}
