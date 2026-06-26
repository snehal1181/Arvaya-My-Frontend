export class HealthRecord {
  id: any;
  user_id: string = '';
  file_type: string = '';
  title: string = '';
  status: any = true;
  hospital_id: number;
  hospital_name: string = '';
  lab_id: number;
  lab_name: string = '';
  hi_type: number;
  creation_date: any = ''; // or Date
  composition_data: string = '';
  file_url: any = '';
  description: string = '';
  report_date: any = ''; // or Date
  is_synced_abha: any = true;
  tags: any;
  record_type: string = 'P';
  client_id: string = '';
  app_user_id: any;
  constructor(data?: Partial<HealthRecord>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}