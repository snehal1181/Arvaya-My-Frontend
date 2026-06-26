export class patientmaster {
  id: any
  name: any = '';
  email: any = '';
  profile_image: any = '';
  mobile_number: any = '';
  adhar_card: any = '';
  abha_number: any = '';
  abha_type: any = '';
  abha_status: any = '';
  date_of_birth: any = '';
  gender: any = '';
  blood_group: any = '';
  total_count: any = '';
  is_active: any;
  client_id: any
}
export class patientaddressmaster {
  id: any
  type = 'P'
  line_1: any;
  line_2: any;
  country_id: any = '';
  state_id: any = '';
  district_id: any = '';
  pincode_id: any = '';
}

export class patientfamilymaster {
  name: any = '';
  relation: any = '';
  dob: any = '';
  blood_group: any = '';
  gender: any = '';
  mobile_number: any = '';
  is_active: boolean = true;
}
