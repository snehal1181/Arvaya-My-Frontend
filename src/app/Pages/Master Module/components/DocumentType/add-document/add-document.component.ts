import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { DocumentType } from '../../../Models/DocumentType';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css'],
})
export class AddDocumentComponent {
  isSpinning = false;
  isOk = true;

  ngOnInit(): void {}

  public commonFunction = new CommonFunctionService();
  @Input() data: any = DocumentType;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}

  resetDrawer(Languagemaster: NgForm) {
    this.data = new DocumentType();
    Languagemaster.form.markAsPristine();
    Languagemaster.form.markAsUntouched();
  }

  save(addNew: boolean, Languagemaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    console.log(this.data);
    
    if (
      (this.data.name == '' ||
        this.data.name == null ||
        this.data.name == undefined) && 
         (this.data.image_url == '' ||
        this.data.image_url == null ||
        this.data.image_url == undefined)
     
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    }
   else if (
      this.data.name == null ||
      this.data.name == undefined ||
      this.data.name == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Document Type', '');
    } else if (!this.data.image_url || this.data.image_url?.trim() == '') {
      this.isOk = false;
      this.message.error('Please Upload Image.', '');
      return;
    } else if (this.data.seq_no == null || this.data.seq_no == undefined) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.id) {
          this.api
            .updateDocumentType(this.data)
            .subscribe((response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Document Type Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Document Type Updation Failed', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.createDocumentType(this.data).subscribe(
            (response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                this.message.success('Document Type Created Successfully', '');

                this.isSpinning = false;
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new DocumentType();
                  this.resetDrawer(Languagemaster);
                  this.api
                    .getDocumentType(1, 1, '', 'desc', '')
                    .subscribe((response: HttpResponse<any>) => {
                      const statusCode = response.status;
                      if (statusCode == 200) {
                        if (response.body.count == 0) {
                          this.data.seq_no = 1;
                        } else {
                          this.data.seq_no = response.body.data[0].seq_no + 1;
                        }
                      } else {
                        this.message.error(`Something went wrong.`, '');
                      }
                    });
                }
                this.isSpinning = false;
              } else {
                this.message.error('Document Type Creation Failed..."', '');
                this.isSpinning = false;
              }
            },
            (error) => {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  close() {
    this.drawerClose();
  }
  urlPhoto: any;
  filePhotoURL: any;
  photoDeleteConfirm(data: any) {
    this.urlPhoto = null;
    this.data.image_url = ' ';
    this.filePhotoURL = null;
  }

  progressBarPhoto: any;
  percentPhoto: any;
  urlPhotoShow: boolean;
  ViewImage: any;

  onPhotoFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024;

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.filePhotoURL = <File>event.target.files[0];
      if (this.filePhotoURL.size > maxFileSize) {
        this.message.error('File size should not exceed 1MB.', '');
        return;
      }
      if (this.filePhotoURL != null) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.filePhotoURL.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        let url = d == null ? '' : d + number + '.' + fileExt;

        this.urlPhoto = url;
        if (
          this.data.image_url != undefined &&
          this.data.image_url.trim() != ''
        ) {
          const arr = this.data.image_url.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarPhoto = true;
      this.urlPhotoShow = true;
      this.isSpinning = true;
      this.api
        .onUpload('HiTypeImage', this.filePhotoURL, this.urlPhoto)
        .subscribe(
          (res: HttpEvent<any>) => {
            switch (res.type) {
              case 1:
                HttpEventType.UploadProgress;
                const percentDone = res.total
                  ? Math.round((100 * res.loaded) / res.total)
                  : 0;
                this.percentPhoto = percentDone;
                // console.log(`Progress: ${percentDone}%`);

                if (this.percentPhoto === 100) {
                  this.isSpinning = false;
                  setTimeout(() => {
                    this.progressBarPhoto = false;
                  }, 2000);
                }
                break;

              case 2:
                HttpEventType.ResponseHeader;
                // console.log('Response Headers Received:', res);
                // You can handle any specific logic for response headers if needed
                break;

              case 3:
                HttpEventType.DownloadProgress;
                // console.log('Download Progress:', res.loaded, '/', res.total);
                break;

              case 4:
                HttpEventType.Response;
                if (res.status === 200 && res.body?.message === 'Success') {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.data.image_url = this.urlPhoto;
                } else {
                  this.message.error('Failed To Upload Image...', '');
                  this.resetPhotoUploadState();
                }
                break;

              default:
                console.warn('Unhandled event type:', res.type);
            }
          },
          (error) => {
            this.message.error('Failed To Upload Image...', '');
            this.resetPhotoUploadState();
          }
        );
    } else {
      this.message.error('Please Select Only Image File', '');
      this.filePhotoURL = null;
      this.isSpinning = false;
      this.progressBarPhoto = false;
      this.percentPhoto = 0;
      this.data.IMAGE_URL = null;
    }
  }

  resetPhotoUploadState(): void {
    this.isSpinning = false; // Stop the spinner
    this.progressBarPhoto = false; // Hide the progress bar
    this.percentPhoto = 0; // Reset progress percentage
    this.data.image_url = null; // Clear the file reference
  }

  viewImage(imageURL: string): void {
    // console.log('view');

    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';
  imageshow;
  ImageModalVisible = false;

  GetImage(link: string) {
    // console.log('Getting Image');
    let imagePath = this.api.retriveimgUrl + 'HiTypeImage/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    // console.log('Image path:', imagePath);

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  removePhoto() {
    this.data.image_url = ' ';
    this.filePhotoURL = null;
  }

  deleteCancel() {}

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
}
