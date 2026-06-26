import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { TechnicianAvailability } from '../../../Models/TechnicianavailabiltiyConfig';

@Component({
  selector: 'app-technicial-availability-config-master-form',
  templateUrl: './technicial-availability-config-master-form.component.html',
  styleUrls: ['./technicial-availability-config-master-form.component.css'],
})
export class TechnicialAvailabilityConfigMasterFormComponent {

  // Component Logic for Doctor Availability Configuration
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  ConfigurationData: any = [];
  errorMessage: any;
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  ngOnInit() {
    this.ConfigurationData = [
      {
        SESSION_NAME: 'Morning',
        START_TIME: new Date('2024-12-12T08:00:00'), // Set static start time
        END_TIME: new Date('2024-12-12T12:00:00'), // Set static end time
        MODE_ID: 'offline',
        TYPE_ID: 'clinic',
        SLOT_DURATION: 15,
        DAY_OF_WEEK: ['Monday', 'Thursday'], // Populate selected days
      },
      {
        SESSION_NAME: 'Evening',
        START_TIME: new Date('2024-12-12T16:00:00'), // Set static start time
        END_TIME: new Date('2024-12-12T18:00:00'), // Set static end time
        MODE_ID: 'online',
        TYPE_ID: 'video',
        SLOT_DURATION: 30,
        DAY_OF_WEEK: ['Tuesday', 'Friday'], // Populate selected days
      },
    ];

    // Initialize data object for the session and set the days to true based on DAY_OF_WEEK
    this.ConfigurationData.forEach((session) => {
      this.days.forEach((day) => {
        // Set the day checkbox to true if the day is in DAY_OF_WEEK
        session['day_' + day] = session.DAY_OF_WEEK.includes(day);
      });
    });
  }
  extractHoursAndMinutes(date: Date): { hours: number; minutes: number } {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  }

  // Helper function to convert a time into the number of minutes since midnight
  convertToMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }

   // Disable times that are before the current time for Start Time
   disabledStartTime = (current: Date): boolean => {
    return current && current < new Date(); // Disable past times
  };

  // Disable End Time selection that is before or equal to Start Time
  disabledEndTime = (current: Date, index: number): boolean => {
    const startTime = new Date(this.ConfigurationData[index].START_TIME);
    return current && current <= startTime; // Disable times before Start Time
  };
  
  // Method to handle time change
  onTimeChange(i: number): void {
    const selectedStartTime = new Date(this.ConfigurationData[i].START_TIME);
    const selectedEndTime = new Date(this.ConfigurationData[i].END_TIME);

    console.log('Selected Start Time:', selectedStartTime);
    console.log('Selected End Time:', selectedEndTime);

    // Check for time conflict
    if (this.checkTimeConflict(selectedStartTime, selectedEndTime, i)) {
      this.errorMessage =
        'The selected time range conflicts with an existing session for the same day.';
    } else {
      this.errorMessage = ''; // Clear error message if no conflict
    }
  }

  // Method to handle day change
  disabledHours
  disabledMinutes
  disabledSeconds
  onDayChange(i: number): void {
    // Get the selected days from the form
    const selectedDays = this.days.filter(
      (day) => this.ConfigurationData[i]['day_' + day]
    );
    const selectedStartTime = new Date(this.ConfigurationData[i].START_TIME);
    const selectedEndTime = new Date(this.ConfigurationData[i].END_TIME);

    console.log(this.ConfigurationData);

    // Update the DAY_OF_WEEK for the current session
    this.ConfigurationData[i].DAY_OF_WEEK = selectedDays;

    // Check for conflicts with other sessions on the same day
    for (let j = 0; j < this.ConfigurationData.length; j++) {
      if (i === j) continue; // Skip the current session itself
      const session = this.ConfigurationData[j];
      const sessionDays = session.DAY_OF_WEEK;
      // console.log(session);
      if (selectedDays.some((day) => sessionDays.includes(day))) {
        if (this.checkTimeConflict(selectedStartTime, selectedEndTime, j)) {
          this.errorMessage =
            'The selected time range conflicts with an existing session on the same day.';
          return; // Exit early if a conflict is found
        }
      }
      
    }

    // If no conflict is found, clear the error message
    this.errorMessage = '';
  }

  // Method to check if the selected time conflicts with existing times
  checkTimeConflict(
    selectedStartTime: Date,
    selectedEndTime: Date,
    index: number
  ): boolean {
    const selectedStartInMinutes = this.convertToMinutes(selectedStartTime);
    const selectedEndInMinutes = this.convertToMinutes(selectedEndTime);

    console.log(this.ConfigurationData);

    const selectedDayOfWeek = this.ConfigurationData[index].DAY_OF_WEEK;
    console.log(
      selectedEndInMinutes,
      selectedStartInMinutes,
      selectedDayOfWeek,
      index
    );

    // Check for conflicts with existing sessions for the same day
    for (let i = 0; i < this.ConfigurationData.length; i++) {
      if (i !== index) {
        // Skip the current session
        const session = this.ConfigurationData[i];
        const sessionStartTime = new Date(session.START_TIME);
        const sessionEndTime = new Date(session.END_TIME);
        const sessionStartInMinutes = this.convertToMinutes(sessionStartTime);
        const sessionEndInMinutes = this.convertToMinutes(sessionEndTime);
        const sessionDayOfWeek = session.DAY_OF_WEEK;

        console.log(
          sessionStartInMinutes,
          sessionEndInMinutes,
          sessionDayOfWeek,
          i
        );

        // Check if the session days match
        const hasMatchingDay = selectedDayOfWeek.some((day) =>
          sessionDayOfWeek.includes(day)
        );

        console.log(hasMatchingDay);

        if (hasMatchingDay) {
          // Check for time overlap (when one session starts before the other ends and vice versa)
          if (
            (selectedStartInMinutes < sessionEndInMinutes &&
              selectedEndInMinutes > sessionStartInMinutes) ||
            (sessionStartInMinutes < selectedEndInMinutes &&
              sessionEndInMinutes > selectedStartInMinutes)
          ) {
            // console.log('Conflict detected');
            this.message.error("The selected time overlaps with an existing session. Please choose a different time.", '');

            return true; // Conflict detected
          }
        }
      }
    }
    return false; // No conflict
  }

  addMoreTimings() {
    let isOk = true;

    // Iterate through each existing configuration and validate fields
    for (let i = 0; i < this.ConfigurationData.length; i++) {
      const currentSession = this.ConfigurationData[i];

      // Validate SESSION_NAME
      if (
        !currentSession.SESSION_NAME ||
        currentSession.SESSION_NAME.trim() === ''
      ) {
        isOk = false;
        this.message.error(
          `Please Enter a Session Name for Slot ${i + 1}.`,
          ''
        );
        break;
      }

      // Validate START_TIME
      if (!currentSession.START_TIME) {
        isOk = false;
        this.message.error(
          `Please Select a Start Time for Slot ${i + 1}.`,
          ''
        );
        break;
      }

      // Validate END_TIME
      if (!currentSession.END_TIME) {
        isOk = false;
        this.message.error(`Please Select an End Time for Slot ${i + 1}.`, '');
        break;
      }


       // Validate MODE_ID
       if (!currentSession.MODE_ID) {
        isOk = false;
        this.message.error(`Please Select a Mode for Slot ${i + 1}.`, '');
        break;
      }

      // Validate TYPE_ID
      if (!currentSession.TYPE_ID) {
        isOk = false;
        this.message.error(`Please Select a Type for Slot ${i + 1}.`, '');
        break;
      }

      // Validate SLOT_DURATION
      if (
        !currentSession.SLOT_DURATION ||
        isNaN(currentSession.SLOT_DURATION) ||
        currentSession.SLOT_DURATION <= 0
      ) {
        isOk = false;
        this.message.error(
          `Please Enter a valid Slot Duration for Slot ${i + 1}.`,
          ''
        );
        break;
      }

      // Ensure START_TIME is before END_TIME
      if (currentSession.START_TIME >= currentSession.END_TIME) {
        isOk = false;
        this.message.error(
          `Start Time must be earlier than End Time for Slot ${i + 1}.`,
          ''
        );
        break;
      }

     
    }

    if (isOk) {
      // Add a new empty configuration
      this.ConfigurationData.push({
        SESSION_NAME: '',
        START_TIME: null,
        END_TIME: null,
        MODE_ID: '',
        TYPE_ID: '',
        SLOT_DURATION: null,
        DAY_OF_WEEK: [],
      });

      this.days.forEach((day) => {
        this.ConfigurationData[this.ConfigurationData.length - 1][
          'day_' + day
        ] = false;
      });
    }
  }

  removeTiming(index: number) {
    // Ensure there is at least one item in the ConfigurationData array
    if (this.ConfigurationData.length > 1) {
      this.ConfigurationData.splice(index, 1);
    } else {
      this.message.error('At least one timing should be present.', '');
    }
  }

  saveTimings() {
    // Check if ConfigurationData has more than 1 timing
    if (this.ConfigurationData.length <= 0) {
      this.message.error('Please add at least one timing before saving.', '');
      return; // Stop further execution if the check fails
    }

    console.log(this.ConfigurationData);

    const formattedData = this.ConfigurationData.map((session) => ({
      HOSPITAL_ID: '1', // Replace with actual hospital ID
      DOCTOR_ID: '1', // Replace with actual doctor ID
      SESSION_NAME: session.SESSION_NAME,
      START_TIME: this.datePipe.transform(session.START_TIME, 'HH:mm:ss'),
      END_TIME: this.datePipe.transform(session.END_TIME, 'HH:mm:ss'),
      MODE_ID: session.MODE_ID,
      TYPE_ID: session.TYPE_ID,
      SLOT_DURATION: session.SLOT_DURATION,
      DAY_OF_WEEK: this.days.filter((day) => session['day_' + day]),
    }));

    console.log('Formatted Data:', formattedData);
    // this.DoctorAvailabilityModalVisible = false;

    // API call to save data (uncomment when actual API is available)
    // this.api.saveDoctorAvailability(formattedData).subscribe(response => {
    //   this.message.success('Session data saved successfully!');
    // });
  }
  close() {
    // throw new Error('Method not implemented.');
    }
    data: any=new TechnicianAvailability();
    save(arg0: boolean,_t189: NgForm) {
    // throw new Error('Method not implemented.');
    }
}
