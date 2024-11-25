/*
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';
import { LoadingComponent } from '../../loading/loading.component';
import { SeleccionarEspecialidadComponent } from '../seleccionar-especialidad/seleccionar-especialidad.component';
import { ListadoEspecialidadesComponent } from '../listado-especialidades/listado-especialidades.component';
import { CaptchaComponent } from '../captcha/captcha.component';
import { SweetAlertService } from '../../../services/sweetAlert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, 
            FormsModule,
            RouterLink, 
            LoadingComponent, 
            SeleccionarEspecialidadComponent,
            ListadoEspecialidadesComponent,
            CaptchaComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPassword: boolean = false;
  errMsgEmail!: string;
  errMsgPass!: string;
  errMsgPass2!: string;
  errMsg!: string;
  res!: boolean;
  msgRes: string = "Redirigiendo en 3 segundos...";
  redirigir: boolean = true;
  selectedPaciente:any = undefined;

  especialidades:any;
  crearEspecialidad:boolean = false;
  eliminarEspecialidad:boolean = false;

  isLoading:boolean = false;

  captcha:boolean = false;

  errorStates = {
    email: false,
    pass: false,
    pass2: false,
    userType: false,
    nombre: false,
    apellido: false,
    edad: false,
    dni: false,
    img: false,
    img2: false,
    obraSocial: false,
    especialidad: false
  };
  
  @Output() register = new EventEmitter<any>();

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private sweetAlert:SweetAlertService,private router:Router) {}

  //? Register with firebase
  firebaseService = inject(AuthService);
  firestoreService = inject(FirestoreService);

  async onSubmit(formData: any) {
    this.errorStates = {
      email: false,
      pass: false,
      pass2: false,
      userType: false,
      nombre: false,
      apellido: false,
      edad: false,
      dni: false,
      img: false,
      img2: false,
      obraSocial: false,
      especialidad: false
    };
    
    this.errMsgEmail = "";
    this.errMsgPass = "";
    this.errMsgPass2 = "";
    this.errMsg = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const dniRegex = /^\d{7,8}$/; // Ejemplo: DNI de 7 u 8 dígitos
    let err: boolean = false;
  
    // Validaciones de email y contraseña
    if (!formData.email) {
      this.errorStates.email = true;
      this.errMsgEmail = "Ingrese un email.";
      err = true;
    } else if (!emailRegex.test(formData.email)) {
      this.errorStates.email = true;
      this.errMsgEmail = "Ingrese un email válido.";
      err = true;
    }
  
    if (!formData.password) {
      this.errorStates.pass = true;
      this.errMsgPass = "Ingrese una contraseña.";
      err = true;
    } else if (formData.password.length < 6) {
      this.errorStates.pass = true;
      this.errMsgPass = "La contraseña debe tener al menos 6 caracteres.";
      err = true;
    }
  
    if (!formData.confirmPassword) {
      this.errorStates.pass2 = true;
      this.errMsgPass2 = "Ingrese nuevamente la contraseña.";
      err = true;
    } else if (formData.password !== formData.confirmPassword) {
      this.errorStates.pass = true;
      this.errorStates.pass2 = true;
      this.errMsg = "Las contraseñas no coinciden.";
      err = true;
    }
  
    // Validaciones de nombres y apellidos
    if (!formData.nombre || !nameRegex.test(formData.nombre)) {
      this.errorStates.nombre = true;
      this.errMsg = "El nombre es obligatorio y solo debe contener letras.";
      err = true;
    }
  
    if (!formData.apellido || !nameRegex.test(formData.apellido)) {
      this.errorStates.apellido = true;
      this.errMsg = "El apellido es obligatorio y solo debe contener letras.";
      err = true;
    }
  
    // Validación de edad
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0 || formData.edad > 99) {
      this.errorStates.edad = true;
      this.errMsg = "Ingrese una edad válida (entre 1 y 120).";
      err = true;
    }
  
    // Validación de DNI
    if (!formData.dni || !dniRegex.test(formData.dni)) {
      this.errorStates.dni = true;
      this.errMsg = "Ingrese un DNI válido (7 u 8 dígitos).";
      err = true;
    }
  
    // Validaciones específicas de usuarios
    if (formData.userType === 'paciente') {
      if (!formData.obraSocial || formData.obraSocial.trim() === "") {
        this.errorStates.obraSocial = true;
        this.errMsg = "Ingrese una obra social válida.";
        err = true;
      }
      if (!formData.img) {
        this.errorStates.img = true;
        this.errMsg = "Seleccione una imagen.";
        err = true;
      }
      if (!formData.img2) {
        this.errorStates.img2 = true;
        this.errMsg = "Seleccione la segunda imagen.";
        err = true;
      }
    } else if (formData.userType === 'especialista') {
      if (!this.especialidades || this.especialidades.length === 0) {
        this.errorStates.especialidad = true;
        this.errMsg = "Seleccione al menos una especialidad.";
        err = true;
      }
      if (!formData.img) {
        this.errorStates.img = true;
        this.errMsg = "Seleccione una imagen.";
        err = true;
      }
    }
  
    // Captcha validation
    if (!this.captcha) {
      this.sweetAlert.showSuccessAlert("Complete el captcha", "Complete el captcha", "error");
      err = true;
    }
  

    if (!err && !this.submitDisabled) {
      this.submitDisabled = true;
      this.isLoading = true;
      this.firebaseService.signUp(formData, this.imgFile, this.img2File)
      .then((resp: any) => {
        this.submitDisabled = false;
        this.isLoading = false;
        console.log(resp);
        this.res = true;
        let counter = 2;
        const interval = setInterval(() => {
          this.msgRes = `Redirigiendo en ${counter} segundos...`; // Actualiza el mensaje con el contador
          counter--;
          if (counter < 0) {
            clearInterval(interval);
            this.msgRes = "Redirigiendo...";
            if (this.redirigir) {
              formData.verificadoAdmin = false;
              this.firebaseService.signIn(formData);
              this.register.emit(false);
            }
          }
        }, 1000);
      })
      .catch((err: any) => {
        this.submitDisabled = false;
        this.isLoading = false;
        console.log(err);
        switch (err.message.trim()) {
          case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            this.errMsg = "La contraseña debe tener al menos 6 caracteres.";
            this.errorStates.pass = true;
            this.errorStates.pass2 = true;
            break;
          case "Firebase: The email address is already in use by another account. (auth/email-already-in-use).":
            this.errorStates.email = true;
            this.errMsgEmail = "El email ya está registrado.";
            break;
        }
      });
    }
  }
  submitDisabled:boolean = false;

  imgFile: File | null = null;
  img2File: File | null = null;
  onImageSelected(event: any, imgType: string) {
    if (imgType === 'img') {
      this.imgFile = event.target.files[0];
    } else if (imgType === 'img2') {
      this.img2File = event.target.files[0];
      
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onUserTypeChange(event: any) {
    const userType = event.target.value;
    this.selectedPaciente = userType === 'paciente';
  }

  onEspecialidadCreada($event: any) {
    this.crearEspecialidad = false;
    this.especialidades = $event;
  }
  
  mostrarEspecialidades() : string { 
    let retorno = "";
    if (this.especialidades) {
      this.especialidades.forEach((esp:any) => {
        if (!retorno) {
          retorno = esp.nombre;
        } else {
          retorno += ` - ${esp.nombre} `;
        }
      });
    }
    return retorno;
  }

  actualizarEspecialidades(nuevasEspecialidades: string[]): void {
    this.eliminarEspecialidad = false;
    this.especialidades = nuevasEspecialidades;
    if (this.especialidades) {
      if (this.especialidades.length == 0) {
        this.especialidades = false;
      }
    } 
  }
}
  */
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';
import { LoadingComponent } from '../../loading/loading.component';
import { SeleccionarEspecialidadComponent } from '../seleccionar-especialidad/seleccionar-especialidad.component';
import { ListadoEspecialidadesComponent } from '../listado-especialidades/listado-especialidades.component';
import { CaptchaComponent } from '../captcha/captcha.component';
import { SweetAlertService } from '../../../services/sweetAlert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, 
            FormsModule,
            RouterLink, 
            LoadingComponent, 
            SeleccionarEspecialidadComponent,
            ListadoEspecialidadesComponent,
            CaptchaComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPassword: boolean = false;
  errMsgEmail!: string;
  errMsgPass!: string;
  errMsgPass2!: string;
  errMsg!: string;
  res!: boolean;
  msgRes: string = "Redirigiendo en 3 segundos...";
  redirigir: boolean = true;
  selectedPaciente:any = undefined;

  especialidades:any;
  crearEspecialidad:boolean = false;
  eliminarEspecialidad:boolean = false;

  isLoading:boolean = false;

  captcha:boolean = false;

  errorStates = {
    email: false,
    pass: false,
    pass2: false,
    userType: false,
    nombre: false,
    apellido: false,
    edad: false,
    dni: false,
    img: false,
    img2: false,
    obraSocial: false,
    especialidad: false
  };
  
  @Output() register = new EventEmitter<any>();

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private sweetAlert:SweetAlertService,private router:Router) {}

  //? Register with firebase
  firebaseService = inject(AuthService);
  firestoreService = inject(FirestoreService);

  async onSubmit(formData: any) {
    this.errorStates = {
      email: false,
      pass: false,
      pass2: false,
      userType: false,
      nombre: false,
      apellido: false,
      edad: false,
      dni: false,
      img: false,
      img2: false,
      obraSocial: false,
      especialidad: false
    };
    
    this.errMsgEmail = "";
    this.errMsgPass = "";
    this.errMsgPass2 = "";
    this.errMsg = "";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let err: boolean = false;

    if (!formData.email) {
      this.errorStates.email = !formData.email;
      this.errMsgEmail = "Ingrese un email.";
      err = true;
    }
    if (!formData.password) {
      this.errorStates.pass = !formData.password;
      this.errMsgPass = "Ingrese una contraseña.";
      err = true;
    }
    if (!formData.confirmPassword) {
      this.errorStates.pass2 = !formData.confirmPassword;
      this.errMsgPass2 = "Ingrese nuevamente la contraseña.";
      err = true;
    }
 
    if (this.selectedPaciente) {
      formData.userType = "paciente";
    } else {
      formData.userType = "especialista";
    }

  // Validar campos comunes
  if (!formData.nombre) {
    this.errorStates.nombre = true;
    this.errMsg = "Complete todos los campos.";
    err = true;
  }
  if (!formData.apellido) {
    this.errorStates.apellido = true;
    this.errMsg = "Complete todos los campos.";
    err = true;
  }
  if (!formData.edad) {
    this.errorStates.edad = true;
    this.errMsg = "Complete todos los campos.";
    err = true;
  }
  if (!formData.dni) {
    this.errorStates.dni = true;
    this.errMsg = "Complete todos los campos.";
    err = true;
  }

  // Validar campos específicos para pacientes
  if (formData.userType === 'paciente') {
    if (!formData.obraSocial) {
      this.errorStates.obraSocial = true;
      this.errMsg = "Complete todos los campos.";
      err = true;
    }
    if (!formData.img) {
      this.errorStates.img = true;
      this.errMsg = "Complete todos los campos.";
      err = true;
    }
    if (!formData.img2) {
      this.errorStates.img2 = true;
      this.errMsg = "Complete todos los campos.";
      err = true;
    }
  }

  // Validar campos específicos para especialistas
  if (formData.userType === 'especialista') {
    if (!this.especialidades) {
      this.errorStates.especialidad = true;
      this.errMsg = "Complete todos los campos.";
      err = true;
    } else {
      formData.especialidad = this.especialidades;
    }

    if (!formData.img) {
      this.errorStates.img = true;
      this.errMsg = "Seleccione una imagen.";
      err = true;
    }
  }

    if (!regex.test(formData.email)) {
      this.errorStates.email = true;
      this.errMsgEmail = "Ingrese un email valido.";
      err = true;
    }

    if (formData.password !== formData.confirmPassword) {
      this.errorStates.pass = true;
      this.errorStates.pass2 = true;
      this.errMsg = "Las contraseñas no coinciden.";
      return;
    }

    if (!this.captcha) {
      this.sweetAlert.showSuccessAlert("Complete el captcha", "Complete el captcha", "error");
      err = true;
      return;
    }

    if (!err && !this.submitDisabled) {
      this.submitDisabled = true;
      this.isLoading = true;
      this.firebaseService.signUp(formData, this.imgFile, this.img2File)
      .then((resp: any) => {
        this.submitDisabled = false;
        this.isLoading = false;
        console.log(resp);
        this.res = true;
        let counter = 2;
        const interval = setInterval(() => {
          this.msgRes = `Redirigiendo en ${counter} segundos...`; // Actualiza el mensaje con el contador
          counter--;
          if (counter < 0) {
            clearInterval(interval);
            this.msgRes = "Redirigiendo...";
            if (this.redirigir) {
              formData.verificadoAdmin = false;
              this.firebaseService.signIn(formData);
              this.register.emit(false);
            }
          }
        }, 1000);
      })
      .catch((err: any) => {
        this.submitDisabled = false;
        this.isLoading = false;
        console.log(err);
        switch (err.message.trim()) {
          case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            this.errMsg = "La contraseña debe tener al menos 6 caracteres.";
            this.errorStates.pass = true;
            this.errorStates.pass2 = true;
            break;
          case "Firebase: The email address is already in use by another account. (auth/email-already-in-use).":
            this.errorStates.email = true;
            this.errMsgEmail = "El email ya está registrado.";
            break;
        }
      });
    }
  }
  submitDisabled:boolean = false;

  imgFile: File | null = null;
  img2File: File | null = null;
  onImageSelected(event: any, imgType: string) {
    if (imgType === 'img') {
      this.imgFile = event.target.files[0];
    } else if (imgType === 'img2') {
      this.img2File = event.target.files[0];
      
    }
  }

  onUserTypeChange(event: any) {
    const userType = event.target.value;
    this.selectedPaciente = userType === 'paciente';
  }

  onEspecialidadCreada($event: any) {
    this.crearEspecialidad = false;
    this.especialidades = $event;
  }
  
  mostrarEspecialidades() : string { 
    let retorno = "";
    if (this.especialidades) {
      this.especialidades.forEach((esp:any) => {
        if (!retorno) {
          retorno = esp.nombre;
        } else {
          retorno += ` - ${esp.nombre} `;
        }
      });
    }
    return retorno;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  actualizarEspecialidades(nuevasEspecialidades: string[]): void {
    this.eliminarEspecialidad = false;
    this.especialidades = nuevasEspecialidades;
    if (this.especialidades) {
      if (this.especialidades.length == 0) {
        this.especialidades = false;
      }
    } 
  }
}