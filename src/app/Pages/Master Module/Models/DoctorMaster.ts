export class DoctorMaster {
  id: number = 0;
  user_id: any;
  name: string = '';
  email_id: string = '';
  mobile_number: any = '';
  password: string = '';

  address_line_1: string = '';
  address_line_2: string = '';
  country_id: any = 0;

  state_id: any = 0;
  district_id: any = 0;
  pincode_id: any = 0;
  district_name: any;
  state_name: any;
  country_name: any;

  gender: string = 'M';
  about: string = '';
  identity_doc: any = null;
  profile_image: any = null;

  registration_number: string = '';
  registration_council_id: number = 0;
  registration_year: any;
  registration_proof: any = null;
  slot_duration: any
  experience: any = 0;
}
