// built to open and close the sidebar for tour guide
import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private drawerCheckbox: ElementRef<HTMLInputElement> | null = null;

  setDrawerCheckbox(element: ElementRef<HTMLInputElement>) {
    this.drawerCheckbox = element;
  }

  openSidebar() {
    const drawerCheckbox = document.getElementById('my-drawer-2') as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = true;
    }
  }

  closeSidebar() {
    const drawerCheckbox = document.getElementById('my-drawer-2') as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  }
}