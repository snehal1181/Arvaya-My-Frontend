import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MastersComponent } from './Masters/masters.component';

import { PincodesComponent } from './components/PincodeMaster/pincodes/pincodes.component';
import { LanguageMasterTableComponent } from './components/Language Master/language-master-table/language-master-table.component';

import { ListstateComponent } from './components/State/liststate/liststate.component';
import { CountryMasterComponent } from './components/Country Master/country-master/country-master.component';
// import { VendorMasterData } from './Models/vendorMaterData';
import { MasterMenuListComponent } from './components/master-menu-list/master-menu-list.component';
import { ListlabComponent } from './components/Lab Master/listlab/listlab.component';
import { ListQualificationComponent } from './components/Qualification Master/list-qualification/list-qualification.component';
import { ListQualificationTypeComponent } from './components/Qualification Type Master/list-qualification-type/list-qualification-type.component';
import { ListSymptonsComponent } from './components/Symptons Master/list-symptons/list-symptons.component';
import { ListLabAppointmentComponent } from './components/Lab Appointment Master/list-lab-appointment/list-lab-appointment.component';
import { ListLabbillComponent } from './components/Lab Bill/list-labbill/list-labbill.component';
import { ListhospitalbillComponent } from './components/Hospital Bill/listhospitalbill/listhospitalbill.component';
import { ListproductureComponent } from './components/Producture Master/listproducture/listproducture.component';
import { ListHospitalBillCatlogComponent } from './components/Hospital Bill Catlog/list-hospital-bill-catlog/list-hospital-bill-catlog.component';
import { HospitalClinicMasterComponent } from './components/HospitalClinicMaster/hospital-clinic-master/hospital-clinic-master.component';
import { LabTechnicianMasterComponent } from './components/LabTechnician/lab-technician-master/lab-technician-master.component';
import { LabBillCatalogueMasterComponent } from './components/LabBillCatalogue/lab-bill-catalogue-master/lab-bill-catalogue-master.component';
import { HospitalBillCatalogueMasterComponent } from './components/HospitalBillCatalogue/hospital-bill-catalogue-master/hospital-bill-catalogue-master.component';
import { HospitalBillMasterComponent } from './components/HospitalBillMaster/hospital-bill-master/hospital-bill-master.component';
// import { TechnicialAvailabilityConfigMasterComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master/technicial-availability-config-master.component';
import { ListDoctorDataComponent } from './components/Doctor-Master/list-doctor-data/list-doctor-data.component';
// import { MedicineTypeMaster } from './Models/MedicineType';
import { MedicineTypeMasterComponent } from './components/medicineTypeMaster/medicine-type-master/medicine-type-master.component';
import { DrugMedicineMasterComponent } from './components/drugMedicineMaster/drug-medicine-master/drug-medicine-master.component';
import { HospitalPatientMasterComponent } from './components/HospitalPatientMaster/hospital-patient-master/hospital-patient-master.component';
import { TestMasterComponent } from './components/TestMaster/test-master/test-master.component';
import { TestCategoryMasterComponent } from './components/TestCategoryMaster/test-category-master/test-category-master.component';
import { TestSlotMasterComponent } from './components/LabTestSlotMaster/test-slot-master/test-slot-master.component';
import { LabPackageMasterComponent } from './components/LabPackageMaster/lab-package-master/lab-package-master.component';
import { PatientmasterlistComponent } from './components/patientpages/patientmasterlist/patientmasterlist.component';
import { ListDistrictComponent } from './components/District-Master/listDistrict/listDistrict.component';
import { ListspecializationMasterComponent } from './components/specialization-master/listspecialization-master/listspecialization-master.component';
import { ListRegistrationCouncilComponent } from './components/Registration-Council/list-registration-council/list-registration-council.component';
import { ListServiceMasterComponent } from './components/Service-Master/list-service-master/list-service-master.component';
import { ListHolidayMasterComponent } from './components/Holiday-Master/list-holiday-master/list-holiday-master.component';
import { ListhospitalreviewComponent } from './components/Hospital-review-Master/listhospitalreview/listhospitalreview.component';
import { ListfaqmasterComponent } from './components/FAQ-Master/listfaqmaster/listfaqmaster.component';
import { AppointmentTableComponent } from './components/AppointmentType/appointment-table/appointment-table.component';
import { PrescriptionTableComponent } from './components/APrescription/prescription-table/prescription-table.component';
import { DocumentTableComponent } from './components/DocumentType/document-table/document-table.component';
import { ManageTableComponent } from './components/ManageTax/manage-table/manage-table.component';
import { LabAppointmentTableComponent } from './components/LabAppointment/lab-appointment-table/lab-appointment-table.component';
import { ProcedureMasterComponent } from './components/procedureMaster/procedure-master/procedure-master.component';
import { LabPatientMasterComponent } from './components/LabPatientMaster/lab-patient-master/lab-patient-master.component';
import { TechnicialAvailabilityConfigMasterComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master/technicial-availability-config-master.component';
import { HealthrecordstableComponent } from './components/HealthRecords/healthrecordstable/healthrecordstable.component';
import { LabReviewComponent } from './components/lab-review/lab-review.component';
import { ListHereditaryconditionsComponent } from './components/Hereditary-Conditions-Master/list-hereditaryconditions/list-hereditaryconditions.component';
import { ListHealthsurveyquestionsComponent } from './components/Health Surveys Questions Masters/list-healthsurveyquestions/list-healthsurveyquestions.component';
import { ListcityComponent } from './components/City/listcity/listcity.component';
import { SecureNextDocumentsMasterComponent } from './components/secureNext/secure-next-documents-master/secure-next-documents-master.component';

const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      { path: 'pincode', component: PincodesComponent },

      { path: 'language', component: LanguageMasterTableComponent },
      { path: 'state', component: ListstateComponent },
      { path: 'district', component: ListDistrictComponent },
      { path: 'countrymaster', component: CountryMasterComponent },
      { path: 'menu', component: MasterMenuListComponent },

      { path: 'labmaster', component: ListlabComponent },
      { path: 'qualification', component: ListQualificationComponent },
      { path: 'qualification-type', component: ListQualificationTypeComponent },
      { path: 'symptons', component: ListSymptonsComponent },
      { path: 'lab_appointment', component: ListLabAppointmentComponent },
      { path: 'lab-bill', component: ListLabbillComponent },

      { path: 'procedure_master', component: ListproductureComponent },

      { path: 'lab_techician', component: LabTechnicianMasterComponent },
      {
        path: 'lab_bill_catalogue',
        component: LabBillCatalogueMasterComponent,
      },
      { path: 'medicine_type', component: MedicineTypeMasterComponent },
      { path: 'drugs_medicine', component: DrugMedicineMasterComponent },
      { path: 'hospital_patient', component: HospitalPatientMasterComponent },
      { path: 'lab_patient', component: LabPatientMasterComponent },
      { path: 'test', component: TestMasterComponent },
      { path: 'test_category', component: TestCategoryMasterComponent },
      { path: 'lab_test_slot', component: TestSlotMasterComponent },
      { path: 'lab_package', component: LabPackageMasterComponent },
      { path: 'app-user', component: PatientmasterlistComponent },
      { path: 'procedure_master', component: ProcedureMasterComponent },
      { path: 'healthrecords', component: HealthrecordstableComponent },

      // { path: "technician_availibility", component:TechnicialAvailabilityConfigMasterComponent},

      // Ashutosh

      { path: 'doctor', component: ListDoctorDataComponent },
      { path: 'specialization', component: ListspecializationMasterComponent },
      { path: 'council', component: ListRegistrationCouncilComponent },
      { path: 'service', component: ListServiceMasterComponent },
      { path: 'holiday', component: ListHolidayMasterComponent },
      { path: 'hospitalreview', component: ListhospitalreviewComponent },
      { path: 'faqmaster', component: ListfaqmasterComponent },

      // Vedangi madam

      { path: 'appointment', component: AppointmentTableComponent },
      { path: 'prescription', component: PrescriptionTableComponent },
      { path: 'documenttype', component: DocumentTableComponent },
      { path: 'taxcatlog', component: ManageTableComponent },
      { path: 'lab_review', component: LabReviewComponent },

      {
        path: 'hospital_clinic_master',
        component: HospitalClinicMasterComponent,
      },
      {
        path: 'hospital_bill_catalogue',
        component: ListHospitalBillCatlogComponent,
      },
      { path: 'hospital_bill_master', component: ListhospitalbillComponent },
      {
        path: 'technician_availibility',
        component: TechnicialAvailabilityConfigMasterComponent,
      },
      {
        path: 'hereditary-conditions',
        component: ListHereditaryconditionsComponent,
      },
      {
        path: 'health_survey_questions',
        component: ListHealthsurveyquestionsComponent,
      },
      { path: 'city', component: ListcityComponent },
      { path: 'securenext', component: SecureNextDocumentsMasterComponent },
      // { path : "inventory_transaction",component:InventoryTransactionmasterComponent},
      // { path: "inventory_master", component:InventorymasterComponent},
      // { path: "inventory_sub_category", component:InventorysubcategorymasterComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MastersRoutingModule {}
