import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Directive({
    selector: '[appZoomOnHover]',
    standalone: true
  })
  export class ZoomOnHoverDirective {
    @HostBinding('style.transition') transition = 'transform 0.3s ease';
  
    @HostListener('mouseenter') onMouseEnter() {
      this.zoom(1.5);
    }
  
    @HostListener('mouseleave') onMouseLeave() {
      this.zoom(1);
    }
  
    private zoom(scale: number) {
      this.host.nativeElement.style.transform = `scale(${scale})`;
    }
  
    constructor(private host: ElementRef) {}
  }