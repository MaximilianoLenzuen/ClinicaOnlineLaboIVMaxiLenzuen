import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../services/sweetAlert.service';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent {
  operand1!: number;
  operand2!: number;
  operator!: string;
  userAnswer: string = '';
  correctAnswer!: number;
  captchaVerified: boolean = false;
  captchaImage: string = '';

  captchaOptions = [
    { src: 'img/1por2.png', answer: 2 },
    { src: 'img/1mas9.png', answer: 10 },
    { src: 'img/1menos9.png', answer: -8 }
  ];


  @Output() verificacion = new EventEmitter<boolean>();

  constructor(private sweet: SweetAlertService) { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const randomIndex = Math.floor(Math.random() * this.captchaOptions.length);
    const selectedCaptcha = this.captchaOptions[randomIndex];
    this.captchaImage = selectedCaptcha.src;
    this.correctAnswer = selectedCaptcha.answer;
  }
  verifyCaptcha(): void {
    const userResponse = parseInt(this.userAnswer, 10);
    if (userResponse === this.correctAnswer) {
      this.captchaVerified = true;
      this.verificacion.emit(true);
      this.sweet.showSuccessAlert("Captcha completado con éxito", "Éxito!", 'success');
    } else {
      this.sweet.showSuccessAlert("Vuelva a intentarlo", "Error", 'error');
      this.verificacion.emit(false);
      this.generateCaptcha(); // Generar un nuevo CAPTCHA
      this.userAnswer = ''; // Limpiar la respuesta del usuario
    }
  }
}
