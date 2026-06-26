import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare const google: any;

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements AfterViewInit {

  @Input() MAPlOCATION: any;
  latitude: any | null = null;
  longitude: any | null = null;

  safeUrl: SafeResourceUrl;
  safeUrl1: SafeResourceUrl;
  mapUrl: any;
  constructor(private sanitizer: DomSanitizer) { }

  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
name;
  initMap(): void {
    const mapCenter = {
      lat: this.MAPlOCATION.reduce((sum, loc) => sum + loc.latitude, 0) / this.MAPlOCATION.length,
      lng: this.MAPlOCATION.reduce((sum, loc) => sum + loc.longitude, 0) / this.MAPlOCATION.length,
    };
 
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: mapCenter,
      zoom: 14,
    });
 
    this.MAPlOCATION.forEach((location: any) => {
      this.name=location.name
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        
      });
 
      // const infoWindow = new google.maps.InfoWindow({
      //   content: `<div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
      // background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
      // <h6>${location.name}</h6></div>`,
      // });
 
      // marker.addListener('click', () => {
      //   infoWindow.open(map, marker);
      // });
    });
  }
}