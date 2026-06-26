// drawer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private drawerVisible = new BehaviorSubject<boolean>(false);
  drawerVisible$ = this.drawerVisible.asObservable();

  openDrawer() {
    this.drawerVisible.next(true);
  }

  closeDrawer() {
    this.drawerVisible.next(false);
  }
}
