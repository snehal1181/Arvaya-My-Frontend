export class LabMaster {
    id: number;
    name: string = '';
    address: string = '';
    contact_number: any
    longitude:any;
    latitude: any;
    registration_proof: any
    photo: any
    website_link: string = '';
    country: any
    state: any
    district: any
    is_active: any = 1;
    seq_no: number;
    user_id: any;
    address_line_1: any;
    address_line_2: any;
    country_id: any;
    state_id: any;
    district_id: any;
    patient_id:any;
    // test mapping

    test_id: any;
    lab_id: any
    instructions: any
    duration: any


    // Lab Technician Mapping

    technician_id: any;
    association_date: any;

    // Lab - Technicians Service Mapping

    lab_service_id: any;
    lab_technicion_id: any;

    // 

    service_name:any
    pin_code:any;
    email_id: any;
    password: any;
    mobile_number: any;
}