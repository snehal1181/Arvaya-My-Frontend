import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { ApiServiceService } from '../Service/api-service.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexResponsive
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis | ApexYAxis[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  responsive: ApexResponsive[];
  colors: string[];
  labels: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public revenueChartOptions: Partial<ChartOptions> | any;
  public patientGenderChartOptions: Partial<ChartOptions> | any;
  public appointmentChartOptions: Partial<ChartOptions> | any;
  public testChartOptions: Partial<ChartOptions> | any;

  public commonFunction = new CommonFunctionService();

  userName = sessionStorage.getItem('userName');
  decreptedUserName = this.userName
    ? this.commonFunction.decryptdata(this.userName)
    : '';
  emailId = sessionStorage.getItem('emailId');
  decryptedEmail = this.emailId
    ? this.commonFunction.decryptdata(this.emailId)
    : '';

  // Dashboard Stats
  totalPatients = 0;
  totalDoctors = 0;
  totalLabs = 0;
  totalAppointments = 0;
  totalTechnicians = 0;
  recentAppointments: any[] = [];
  technicianHolidays: any[] = [];
  patientReports: any[] = [];
  availableTests: any[] = [];
  availablePackages: any[] = [];
  retriveimgUrl = this.api.retriveimgUrl;

  constructor(private api: ApiServiceService, private datePipe: DatePipe, private router: Router) {
    this.initCharts();
  }

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchPatientReports();
    this.fetchAvailableTests();
    this.fetchAvailablePackages();
  }

  fetchDashboardData() {
    // 1. Fetch Patients
    this.api.getpatientdata(1, 10, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        this.totalPatients = res.body.totalCount || res.body.count || 0;
        this.updatePieChart();
      }
    });

    // 2. Fetch Doctors
    this.api.getAllDoctor(1, 10, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        this.totalDoctors = res.body.totalCount || res.body.count || 0;
      }
    });

    // 3. Fetch Labs
    this.api.getLabMaster(1, 10, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        console.log('labbbbbbbbbbbbbbbbb', res.body);
        this.totalLabs = res.body.totalCount || res.body.count || 0;
      }
    });

    // 4. Fetch Technicians
    this.api.getLabTechnicians(1, 10, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        this.totalTechnicians = res.body.totalCount || res.body.count || 0;
      }
    });

    // 4.5 Fetch Appointments (used for revenue)
    this.api.getHospitalBill(1, 10, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        const bills = res.body.data || [];
        this.totalAppointments = res.body.totalCount || res.body.count || 0;
        this.updateLineChart(bills);
      }
    });

    // 5. Fetch Upcoming Lab Appointments for Chart
    this.api.getLabAppointment(1, 100, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allAppointments = res.body.data || [];
        const upcomingAppointments = allAppointments.filter((app: any) => {
          if (!app.TEST_DATE) return false;
          const appDate = new Date(app.TEST_DATE);
          return appDate >= today;
        });

        // Sort by date ascending
        upcomingAppointments.sort((a: any, b: any) => new Date(a.TEST_DATE).getTime() - new Date(b.TEST_DATE).getTime());

        this.updateAppointmentChart(upcomingAppointments);
      }
    });

    // 6. Fetch Technician Holidays
    this.api.getHoliday(1, 100, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        const todayStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
        const upcomingHolidays = (res.body.data || [])
          .filter((holiday: any) => {
            if (!holiday.start_date) return false;
            const holidayDateStr = this.datePipe.transform(holiday.start_date, 'yyyy-MM-dd') || '';
            return holidayDateStr > todayStr;
          });

        // Sort upcoming holidays by start date ascending
        upcomingHolidays.sort((a: any, b: any) => {
          const timeA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const timeB = b.start_date ? new Date(b.start_date).getTime() : 0;
          return timeA - timeB;
        });

        this.technicianHolidays = upcomingHolidays.slice(0, 5).map((holiday: any) => ({
          labName: holiday.LAB_NAME || '-',
          technicianName: holiday.technician_name || '-',
          holiday: holiday.name || '-',
          startDate: holiday.start_date
            ? this.datePipe.transform(holiday.start_date, 'dd/MM/yyyy')
            : '-',
          endDate: holiday.end_date
            ? this.datePipe.transform(holiday.end_date, 'dd/MM/yyyy')
            : '-'
        }));
      }
    });
  }

  fetchPatientReports() {
    this.api.getMedicalrecords(1, 5, '', 'desc', '').subscribe((res: any) => {
      if (res && res.body) {
        this.patientReports = (res.body.data || []).slice(0, 5).map((report: any) => ({
          userName: report.user_name || 'Unknown Patient',
          reportType: report.report_name || 'Medical Report',
          fileUrl: report.file_url,
          testName: report.test_name || 'General Checkup'
        }));
      }
    });
  }

  downloadReport(fileUrl: string) {
    if (fileUrl) {
      const fullUrl = this.retriveimgUrl + 'HealthRecords/' + fileUrl;
      window.open(fullUrl, '_blank');
    }
  }

  fetchAvailableTests() {
    this.api.getTest('', 2).subscribe((res: any) => {
      if (res && res.body) {
        this.availableTests = (res.body.data || []).slice(0, 5).map((test: any) => ({
          testName: test.test_name || 'Unknown Test',
          category: test.category_name || 'General'
        }));
        this.updateTestChart();
      }
    });
  }

  fetchAvailablePackages() {
    this.api.getLabPackage(1, 5, '', 'desc', '').subscribe((res: any) => {
      console.log('redddddddddddd', res);
      if (res && res.body) {
        this.availablePackages = (res.body.data || []).slice(0, 5).map((pkg: any) => ({
          packageName: pkg.package_name || 'Unknown Package',
          price: pkg.price || 0
        }));
      }
    });
  }

  updateTestChart() {
    const series = this.availableTests.map(() => 1);
    const labels = this.availableTests.map(t => t.testName);

    this.testChartOptions = {
      series: series.length > 0 ? series : [1],
      chart: {
        type: 'donut',
        height: 200,
        animations: { enabled: true }
      },
      labels: labels.length > 0 ? labels : ['No Data'],
      colors: ['#4361ee', '#1a1c23', '#6956e3', '#feb019', '#f72585'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            labels: {
              show: true,
              name: { show: true, fontSize: '14px', color: '#8d99ae', offsetY: -10 },
              value: { show: true, fontSize: '20px', fontWeight: 700, color: '#1a1c23', offsetY: 10, formatter: () => this.availableTests.length.toString() },
              total: { show: true, label: 'Tests', fontSize: '14px', color: '#8d99ae', formatter: () => this.availableTests.length.toString() }
            }
          }
        }
      },
      stroke: { width: 0 }
    };
  }

  initCharts() {
    this.revenueChartOptions = {
      series: [{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] }],
      chart: { height: 350, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
      colors: ['#008FFB'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] }
      },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      grid: { borderColor: '#f1f1f1' },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
    };

    this.patientGenderChartOptions = {
      series: [44, 55, 13],
      chart: { height: 350, type: 'pie' },
      labels: ['Male', 'Female', 'Other'],
      colors: ['#008FFB', '#FF4560', '#FEB019'],
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }],
      legend: { position: 'bottom' }
    };

    this.appointmentChartOptions = {
      series: [{ name: 'Appointments', data: [] }],
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 0.1 }
      },
      // colors: ['#4361ee'],
      colors: ['#4361ee'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {

        //  type: 'gradient',
        // gradient: {
        //   shadeIntensity: 1,
        //   opacityFrom: 0.5,
        //   opacityTo: 0.1,
        //   stops: [0, 90, 100]
        // }
        type: 'solid',
        opacity: 0.095
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          show: true,
          style: { colors: '#8d99ae', fontSize: '12px' }
        },
        axisBorder: { show: true, color: '#aeaeaeff' },
        axisTicks: { show: true, color: '#aeaeaeff' },
        tickPlacement: 'on'
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: { formatter: (val: any) => Math.floor(val).toString() },
        title: { text: 'No. of Appointments', style: { color: '#8d99ae', fontWeight: 500 } },
        axisBorder: { show: true, color: '#aeaeaeff' },
        axisTicks: { show: true, color: '#aeaeaeff' }
      },
      grid: { borderColor: '#b5b5b5ff', strokeDashArray: 4, position: 'back' },
      markers: { size: 4, colors: ['#4361ee '], strokeColors: '#fff', strokeWidth: 2, hover: { size: 6 } },
      tooltip: {
        shared: true,
        intersect: false,
        followCursor: false,
        fixed: {
          enabled: true,
          position: 'top',
          offsetY: -30,
        },
        y: {
          formatter: (val: any) => {
            return val + " Appointments";
          }
        },
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          const date = w.globals.categoryLabels[dataPointIndex];
          const appointments = (this.appointmentChartOptions as any).detailedData ? (this.appointmentChartOptions as any).detailedData[date] || [] : [];

          let tooltipHtml = `<div class="custom-tooltip">
            <div class="tooltip-header">${date}</div>
            <div class="tooltip-body">`;

          if (appointments.length === 0) {
            tooltipHtml += `<div style="text-align: center; color: #718096; padding: 10px; font-size: 13px;">No appointments scheduled</div>`;
          } else {
            appointments.forEach((app: any) => {
              tooltipHtml += `
                <div class="appointment-card">
                  <div class="detail-row">
                    <span class="detail-label">Lab:</span>
                    <span class="detail-value">${app.labName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Tech:</span>
                    <span class="detail-value">${app.techName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Slot:</span>
                    <span class="detail-value">${app.slot}</span>
                  </div>
                </div>`;
            });
          }

          tooltipHtml += `</div></div>`;
          return tooltipHtml;
        }
      }


    };
  }

  updateAppointmentChart(appointments: any[]) {
    // Generate today and next 5 dates
    const dates: string[] = [];
    const grouped: any = {};

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const formattedDate = this.datePipe.transform(d, 'dd/MM/YY') || 'Unknown';
      dates.push(formattedDate);
      grouped[formattedDate] = [];
    }

    // Fill grouped data
    appointments.forEach((app: any) => {
      const appDate = this.datePipe.transform(app.TEST_DATE, 'dd/MM/YY');
      if (appDate && grouped[appDate] !== undefined) {
        grouped[appDate].push({
          labName: app.LAB_NAME || 'Main Lab',
          techName: app.TECHNICIAN_NAME || 'N/A',
          slot: app.SLOT_NAME || app.TIME_SLOT || 'N/A'
        });
      }
    });

    const counts = dates.map(d => grouped[d].length);

    this.appointmentChartOptions.series = [{ name: 'Appointments', data: counts }];
    this.appointmentChartOptions = {
      ...this.appointmentChartOptions,
      xaxis: {
        ...this.appointmentChartOptions.xaxis,
        categories: dates
      },
      detailedData: grouped
    };
  }

  updateLineChart(bills: any[]) {
    if (bills.length > 0) {
      const data = bills.map(b => b.TOTAL_AMOUNT || Math.floor(Math.random() * 1000));
      this.revenueChartOptions.series = [{ name: 'Revenue', data: data.slice(0, 7) }];
    }
  }

  updatePieChart() {
    const m = Math.floor(this.totalPatients * 0.45);
    const f = Math.floor(this.totalPatients * 0.50);
    const o = this.totalPatients - m - f;
    this.patientGenderChartOptions.series = [m, f, o];
  }

  onViewAllReports() {
    this.router.navigate(['/masters/healthrecords']);
  }
}
