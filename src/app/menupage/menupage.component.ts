import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Service/api-service.service';

@Component({
  selector: 'app-menupage',
  templateUrl: './menupage.component.html',
  styleUrls: ['./menupage.component.css']
})
export class MenupageComponent implements OnInit {
  constructor(private api: ApiServiceService) {}
  menus =[]
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOninit(): void {
    this.api.getForms(0).subscribe((data) => {
      if (data['code'] == 200 && data['data']) {
        data['data'].forEach((element: any) => {
          element['children'].sort(this.sortFunction);
          if (element['children'].length == 0) delete element['children'];
        });

        this.menus = data['data'].sort(this.sortFunction);
      }
    });
  }
  
  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }
}
