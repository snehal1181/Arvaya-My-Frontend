import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgxPrintModule } from 'ngx-print';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MastersRoutingModule } from './masters-routing.module';
// import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MastersComponent } from './Masters/masters.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { PincodeComponent } from './components/PincodeMaster/pincode/pincode.component';
import { PincodesComponent } from './components/PincodeMaster/pincodes/pincodes.component';

import { LanguageMasterTableComponent } from './components/Language Master/language-master-table/language-master-table.component';
import { LanguageMasterDrawerComponent } from './components/Language Master/language-master-drawer/language-master-drawer.component';
import { ListstateComponent } from './components/State/liststate/liststate.component';
import { AddstateComponent } from './components/State/addstate/addstate.component';
import { CountrymasterDrawerComponent } from './components/Country Master/countrymaster-drawer/countrymaster-drawer.component';
import { CountryMasterComponent } from './components/Country Master/country-master/country-master.component';
import { MasterMenuListComponent } from './components/master-menu-list/master-menu-list.component';
// import { MenupageComponent } from 'src/app/menupage/menupage.component';
import { ListlabComponent } from './components/Lab Master/listlab/listlab.component';
import { AddlabComponent } from './components/Lab Master/addlab/addlab.component';
import { AddTestMappingComponent } from './components/Lab Master/add-test-mapping/add-test-mapping.component';
import { AddTechnicianMappingComponent } from './components/Lab Master/add-technician-mapping/add-technician-mapping.component';
// import { AddTechniciansServiceMappingComponent } from './components/Lab Master/add-technicians-service-mapping/add-technicians-service-mapping.component';
import { MenupageComponent } from 'src/app/menupage/menupage.component';
import { HospitalClinicMasterComponent } from './components/HospitalClinicMaster/hospital-clinic-master/hospital-clinic-master.component';
import { HospitalClinicMasterFormComponent } from './components/HospitalClinicMaster/hospital-clinic-master-form/hospital-clinic-master-form.component';
import { LabTechnicianMasterComponent } from './components/LabTechnician/lab-technician-master/lab-technician-master.component';
import { LabTechnicianMasterFormComponent } from './components/LabTechnician/lab-technician-master-form/lab-technician-master-form.component';
import { LabBillCatalogueMasterComponent } from './components/LabBillCatalogue/lab-bill-catalogue-master/lab-bill-catalogue-master.component';
import { LabBillCatalogueMasterFormComponent } from './components/LabBillCatalogue/lab-bill-catalogue-master-form/lab-bill-catalogue-master-form.component';
import { AddTechniciansServiceMappingComponent } from './components/LabTechnician/add-technicians-service-mapping/add-technicians-service-mapping.component';
import { HospitalBillCatalogueMasterComponent } from './components/HospitalBillCatalogue/hospital-bill-catalogue-master/hospital-bill-catalogue-master.component';
import { HospitalBillCatalogueMasterFormComponent } from './components/HospitalBillCatalogue/hospital-bill-catalogue-master-form/hospital-bill-catalogue-master-form.component';
import { HospitalBillMasterComponent } from './components/HospitalBillMaster/hospital-bill-master/hospital-bill-master.component';
import { HospitalBillMasterFormComponent } from './components/HospitalBillMaster/hospital-bill-master-form/hospital-bill-master-form.component';
// import { TechnicialAvailabilityConfigMasterComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master/technicial-availability-config-master.component';
// import { TechnicialAvailabilityConfigMasterFormComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master-form/technicial-availability-config-master-form.component';
import { ListDoctorDataComponent } from './components/Doctor-Master/list-doctor-data/list-doctor-data.component';
import { AddDoctorDataComponent } from './components/Doctor-Master/add-doctor-data/add-doctor-data.component';
import { MedicineTypeMasterComponent } from './components/medicineTypeMaster/medicine-type-master/medicine-type-master.component';
import { MedicineTypeMasterFormComponent } from './components/medicineTypeMaster/medicine-type-master-form/medicine-type-master-form.component';
import { DrugMedicineMasterComponent } from './components/drugMedicineMaster/drug-medicine-master/drug-medicine-master.component';
import { DrugMedicineMasterFormComponent } from './components/drugMedicineMaster/drug-medicine-master-form/drug-medicine-master-form.component';
import { HospitalPatientMasterComponent } from './components/HospitalPatientMaster/hospital-patient-master/hospital-patient-master.component';
import { HospitalPatientMasterFormComponent } from './components/HospitalPatientMaster/hospital-patient-master-form/hospital-patient-master-form.component';
import { LabPatientMasterComponent } from './components/LabPatientMaster/lab-patient-master/lab-patient-master.component';
import { LabPatientMasterFormComponent } from './components/LabPatientMaster/lab-patient-master-form/lab-patient-master-form.component';
import { TestMasterComponent } from './components/TestMaster/test-master/test-master.component';
import { TestMasterFormComponent } from './components/TestMaster/test-master-form/test-master-form.component';
import { TestCategoryMasterComponent } from './components/TestCategoryMaster/test-category-master/test-category-master.component';
import { TestCategoryMasterFormComponent } from './components/TestCategoryMaster/test-category-master-form/test-category-master-form.component';
import { TestSlotMasterComponent } from './components/LabTestSlotMaster/test-slot-master/test-slot-master.component';
import { TestSlotMasterFormComponent } from './components/LabTestSlotMaster/test-slot-master-form/test-slot-master-form.component';
import { LabPackageMasterComponent } from './components/LabPackageMaster/lab-package-master/lab-package-master.component';
import { LabPackageMasterFormComponent } from './components/LabPackageMaster/lab-package-master-form/lab-package-master-form.component';
import { PatientmasteraddComponent } from './components/patientpages/patientmasteradd/patientmasteradd.component';
import { PatientmasteraddressaddComponent } from './components/patientpages/patientmasteraddressadd/patientmasteraddressadd.component';
import { PatientmasteraddresslistComponent } from './components/patientpages/patientmasteraddresslist/patientmasteraddresslist.component';
import { PatientmasterfamilyaddComponent } from './components/patientpages/patientmasterfamilyadd/patientmasterfamilyadd.component';
import { PatientmasterfamilylistComponent } from './components/patientpages/patientmasterfamilylist/patientmasterfamilylist.component';
import { PatientmasterlistComponent } from './components/patientpages/patientmasterlist/patientmasterlist.component';
import { ListDistrictComponent } from './components/District-Master/listDistrict/listDistrict.component';
import { AddDistrictComponent } from './components/District-Master/addDistrict/addDistrict.component';
import { ListspecializationMasterComponent } from './components/specialization-master/listspecialization-master/listspecialization-master.component';
import { AddSpecializationMasterComponent } from './components/specialization-master/add-specialization-master/add-specialization-master.component';
import { ListRegistrationCouncilComponent } from './components/Registration-Council/list-registration-council/list-registration-council.component';
import { AddRegistrationCouncilComponent } from './components/Registration-Council/add-registration-council/add-registration-council.component';
import { ListServiceMasterComponent } from './components/Service-Master/list-service-master/list-service-master.component';
import { AddServiceMAsterComponent } from './components/Service-Master/add-service-master/add-service-master.component';
import { AddHolidayMasterComponent } from './components/Holiday-Master/add-holiday-master/add-holiday-master.component';
import { ListHolidayMasterComponent } from './components/Holiday-Master/list-holiday-master/list-holiday-master.component';
import { ListhospitalreviewComponent } from './components/Hospital-review-Master/listhospitalreview/listhospitalreview.component';
import { ListfaqmasterComponent } from './components/FAQ-Master/listfaqmaster/listfaqmaster.component';
import { AddfaqmasterComponent } from './components/FAQ-Master/addfaqmaster/addfaqmaster.component';
import { AddDocumentComponent } from './components/DocumentType/add-document/add-document.component';
import { DocumentTableComponent } from './components/DocumentType/document-table/document-table.component';
import { ManageTableComponent } from './components/ManageTax/manage-table/manage-table.component';
import { AddManageComponent } from './components/ManageTax/add-manage/add-manage.component';
import { LabAppointmentTableComponent } from './components/LabAppointment/lab-appointment-table/lab-appointment-table.component';
import { AddLabAppointmentComponent } from './components/LabAppointment/add-lab-appointment/add-lab-appointment.component';
import { AppointmentTableComponent } from './components/AppointmentType/appointment-table/appointment-table.component';
import { AddAppointmentTypeComponent } from './components/AppointmentType/add-appointment-type/add-appointment-type.component';
import { AddPrescriptionComponent } from './components/APrescription/add-prescription/add-prescription.component';
import { PrescriptionTableComponent } from './components/APrescription/prescription-table/prescription-table.component';
import { ProcedureMasterComponent } from './components/procedureMaster/procedure-master/procedure-master.component';
import { ProcedureMasterFormComponent } from './components/procedureMaster/procedure-master-form/procedure-master-form.component';
// import { ListlabComponent } from './Masters/Lab Master/listlab/listlab.component';
// import { AddlabComponent } from './Masters/Lab Master/addlab/addlab.component';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { TechnicialAvailabilityConfigMasterComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master/technicial-availability-config-master.component';
import { TechnicialAvailabilityConfigMasterFormComponent } from './components/TechnicianAvailabilityConfig/technicial-availability-config-master-form/technicial-availability-config-master-form.component';
import { ListSymptonsComponent } from './components/Symptons Master/list-symptons/list-symptons.component';
import { AddSymptonsComponent } from './components/Symptons Master/add-symptons/add-symptons.component';
import { QualificationTypeMaster } from './Models/QualificationTypeMaster';
import { ListQualificationComponent } from './components/Qualification Master/list-qualification/list-qualification.component';
import { ListQualificationTypeComponent } from './components/Qualification Type Master/list-qualification-type/list-qualification-type.component';
import { AddQualificationTypeComponent } from './components/Qualification Type Master/add-qualification-type/add-qualification-type.component';
import { AddQualificationComponent } from './components/Qualification Master/add-qualification/add-qualification.component';
import { ListproductureComponent } from './components/Producture Master/listproducture/listproducture.component';
import { AddproductureComponent } from './components/Producture Master/addproducture/addproducture.component';
import { LabBillMaster } from './Models/LabBill';
import { ListLabbillComponent } from './components/Lab Bill/list-labbill/list-labbill.component';
import { ListLabAppointmentComponent } from './components/Lab Appointment Master/list-lab-appointment/list-lab-appointment.component';
import { ListhospitalbillComponent } from './components/Hospital Bill/listhospitalbill/listhospitalbill.component';
import { AddhospitalbillComponent } from './components/Hospital Bill/addhospitalbill/addhospitalbill.component';
import { ListHospitalBillCatlogComponent } from './components/Hospital Bill Catlog/list-hospital-bill-catlog/list-hospital-bill-catlog.component';
import { AddHospitalBillCatlogComponent } from './components/Hospital Bill Catlog/add-hospital-bill-catlog/add-hospital-bill-catlog.component';
import { HealthrecordsformComponent } from './components/HealthRecords/healthrecordsform/healthrecordsform.component';
import { HealthrecordstableComponent } from './components/HealthRecords/healthrecordstable/healthrecordstable.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DocVerificationComponent } from './components/DocumentReader/doc-verification/doc-verification.component';
import { AddLabAppointmentComponent2 } from './components/Lab Appointment Master/add-lab-appointment/add-lab-appointment2.component';
import { LabReviewComponent } from './components/lab-review/lab-review.component';
import { AddHereditaryconditionsComponent } from './components/Hereditary-Conditions-Master/add-hereditaryconditions/add-hereditaryconditions.component';
import { ListHereditaryconditionsComponent } from './components/Hereditary-Conditions-Master/list-hereditaryconditions/list-hereditaryconditions.component';
import { AddHealthsurveyquestionsComponent } from './components/Health Surveys Questions Masters/add-healthsurveyquestions/add-healthsurveyquestions.component';
import { ListHealthsurveyquestionsComponent } from './components/Health Surveys Questions Masters/list-healthsurveyquestions/list-healthsurveyquestions.component';
import { AddcityComponent } from './components/City/addcity/addcity.component';
import { ListcityComponent } from './components/City/listcity/listcity.component';
import { MainFilterComponent } from './components/main-filter/main-filter.component';
// import { NzTagModule } from 'ng-zorro-antd/tag'; // Removed duplicate
import { SecureNextDocumentsMasterComponent } from './components/secureNext/secure-next-documents-master/secure-next-documents-master.component';

@NgModule({
  declarations: [
    MastersComponent, // 1
    PincodeComponent,
    PincodesComponent,
    ListDistrictComponent,
    AddDistrictComponent,
    LanguageMasterDrawerComponent,
    LanguageMasterTableComponent,
    ListstateComponent,
    AddstateComponent,
    CountrymasterDrawerComponent, // 1
    // Removed duplicates
    CountryMasterComponent,
    // Removed duplicates
    MasterMenuListComponent,
    // Removed duplicates
    HospitalClinicMasterComponent,
    HospitalClinicMasterFormComponent,
    LabTechnicianMasterFormComponent,
    LabBillCatalogueMasterComponent,
    LabBillCatalogueMasterFormComponent,
    HospitalBillCatalogueMasterComponent,
    HospitalBillCatalogueMasterFormComponent,
    HospitalBillMasterComponent,
    HospitalBillMasterFormComponent,

    ListDoctorDataComponent,
    AddDoctorDataComponent,
    MedicineTypeMasterComponent,
    MedicineTypeMasterFormComponent,
    DrugMedicineMasterComponent,
    DrugMedicineMasterFormComponent,
    HospitalPatientMasterComponent,
    HospitalPatientMasterFormComponent,
    LabPatientMasterComponent,
    LabPatientMasterFormComponent,
    TestMasterComponent,
    TestMasterFormComponent,
    TestCategoryMasterComponent,
    TestCategoryMasterFormComponent,
    TestSlotMasterComponent,
    TestSlotMasterFormComponent,
    LabPackageMasterComponent,
    LabPackageMasterFormComponent,
    PatientmasterlistComponent,
    PatientmasteraddComponent,
    PatientmasteraddresslistComponent,
    PatientmasteraddressaddComponent,
    PatientmasterfamilylistComponent,
    PatientmasterfamilyaddComponent,
    ListlabComponent,
    AddlabComponent,
    AddTestMappingComponent,
    AddTechnicianMappingComponent,
    AddTechniciansServiceMappingComponent,
    LabTechnicianMasterComponent,
    ListspecializationMasterComponent,
    AddSpecializationMasterComponent,
    ListRegistrationCouncilComponent,
    AddRegistrationCouncilComponent,
    ListServiceMasterComponent,
    AddServiceMAsterComponent,
    AddHolidayMasterComponent,
    ListHolidayMasterComponent,
    ListhospitalreviewComponent,
    ListfaqmasterComponent,
    AddfaqmasterComponent,
    TechnicialAvailabilityConfigMasterComponent,
    TechnicialAvailabilityConfigMasterFormComponent,
    // Vedangi madam

    ManageTableComponent,
    AddManageComponent,
    LabAppointmentTableComponent,
    AddLabAppointmentComponent,
    AppointmentTableComponent,
    AddAppointmentTypeComponent,
    AddDocumentComponent,
    DocumentTableComponent,
    AddPrescriptionComponent,
    PrescriptionTableComponent,
    MenupageComponent,
    ProcedureMasterComponent,
    ProcedureMasterFormComponent,
    ListSymptonsComponent,
    AddSymptonsComponent,
    ListQualificationTypeComponent,
    AddQualificationTypeComponent,
    ListQualificationComponent,
    AddQualificationComponent,
    ListproductureComponent,
    AddproductureComponent,
    ListLabbillComponent,
    // ListlabComponent, // Removed duplicate
    ListLabAppointmentComponent,
    ListhospitalbillComponent,
    AddhospitalbillComponent,
    ListHospitalBillCatlogComponent,
    AddHospitalBillCatlogComponent,
    HealthrecordsformComponent,
    HealthrecordstableComponent,
    DocVerificationComponent,
    AddLabAppointmentComponent2,
    LabReviewComponent,
    AddHereditaryconditionsComponent,
    ListHereditaryconditionsComponent,
    AddHealthsurveyquestionsComponent,
    ListHealthsurveyquestionsComponent,
    ListcityComponent,
    AddcityComponent,
    MainFilterComponent,
    SecureNextDocumentsMasterComponent
  ],
  imports: [
    NzTagModule,
    // PickerComponent,
    CommonModule,
    NzRateModule,
    MastersRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzModalModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzTimePickerModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NgxPrintModule,
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    NzSpaceModule,
    NzEmptyModule,
    NzStepsModule,
    // NzDropDownModule, // Removed duplicate
    NzUploadModule,
    NzAlertModule,
  ],
  exports: [
    MastersComponent,
    PincodeComponent,
    PincodesComponent,
    LanguageMasterDrawerComponent,
    LanguageMasterTableComponent,
    ListstateComponent,
    AddstateComponent,
    CountryMasterComponent,
    CountrymasterDrawerComponent,
    MasterMenuListComponent,
    AddlabComponent,
  ],
})
export class MasterModule { }
