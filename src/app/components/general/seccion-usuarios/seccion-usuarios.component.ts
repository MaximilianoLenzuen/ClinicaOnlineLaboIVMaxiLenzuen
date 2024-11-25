import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { CrearAdministradorComponent } from '../../auth/crear-administrador/crear-administrador.component';
import { SweetAlertService } from '../../../services/sweetAlert.service';
import { ListarHistorialClinicoComponent } from '../../historial-clinico/listar-historial-clinico/listar-historial-clinico.component';
import { ExcelDownloadGenericService } from '../../../services/excel-download.service';
import { CrearPacienteComponent } from '../../crear-usuario-nuevo/crear-paciente/crear-paciente.component';
import { CrearEspecialistaComponent } from "../../crear-usuario-nuevo/crear-especialista/crear-especialista.component";
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrearAdministradorComponent, ListarHistorialClinicoComponent, CrearPacienteComponent, CrearEspecialistaComponent],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.scss',
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'translateY(100px)'
          }),
          stagger('100ms', [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ 
              opacity: 1, 
              transform: 'translateY(0)'
            }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SeccionUsuariosComponent {
  users$!: any;

  mostrarForm:boolean = false;

  mostrarFormPaciente:boolean = false;

  mostrarFormEspecialista:boolean = false;

  historialUsuarioID:any;

  constructor(
    private firestoreSvc: FirestoreService,
    private sweetalert:SweetAlertService,
    private excelSvc: ExcelDownloadGenericService
  ) {}

  ngOnInit(): void {
    this.firestoreSvc.getDocuments('users').subscribe(data => {
      this.users$ = data;
    });
  }

  toggleHabilitacion(user: any, bol: boolean) {
    user.verificadoAdmin = bol;
    this.firestoreSvc.updateDocument('users', user.id, user);
  }

  crearAdministrador(){
    this.mostrarForm = !this.mostrarForm;
  }

  crearPaciente(){
    this.mostrarFormPaciente = !this.mostrarFormPaciente;
  }

  crearEspecialista(){
    this.mostrarFormEspecialista = !this.mostrarFormEspecialista;
  }

  seCreoAdmin(event:any){
    if (event) {
      this.mostrarForm = !event;
      this.sweetalert.showSuccessAlert("Se creó exitosamente el administrador", "Éxito", "success");
    } else {
      this.mostrarForm = false;
      this.sweetalert.showSuccessAlert("Se cancelo o no se pudo crear el administrador", "Error", "error");
    }
  }

  seCreoPaciente(event:any){
    if (event) {
      this.mostrarFormPaciente = !event;
      this.sweetalert.showSuccessAlert("Se creó exitosamente el paciente", "Éxito", "success");
    } else {
      this.mostrarFormPaciente = false;
      this.sweetalert.showSuccessAlert("Se cancelo o no se pudo crear el paciente", "Error", "error");
    }
  }

  seCreoEspecialista(event:any){
    if (event) {
      this.mostrarFormEspecialista = !event;
      this.sweetalert.showSuccessAlert("Se creó exitosamente el especialista", "Éxito", "success");
    } else {
      this.mostrarFormEspecialista = false;
      this.sweetalert.showSuccessAlert("Se cancelo o no se pudo crear el especialista", "Error", "error");
    }
  }

  mostrarEspecialidades(especialidades:any) : string {
    let retorno = "";
    if (Array.isArray(especialidades)) {
      especialidades.forEach((especialidad:any) => {
        retorno += especialidad.nombre + ", ";
      });
    } else {
      retorno = especialidades;
    }
    return retorno;
  }

  descargarUsuariosExcel(): void {
    this.excelSvc.descargarExcel(this.users$, "Lista-de-usuarios", "Lista-de-usuarios");
  }

  descargarUsuarioExcel(usuario: any): void {
    let data:any;
    switch (usuario.userType) {
      case "paciente":
        this.firestoreSvc.getDocumentsWhere("turnos", "paciente", usuario.id).subscribe((turnos:any) => {
          this.excelSvc.descargarExcel(turnos, `Datos_${usuario.nombre}_${usuario.apellido}`, `Datos_${usuario.nombre}_${usuario.apellido}`);
        });
        break;
      case "especialista":
        data = [
          ["Nombre", usuario.nombre],
          ["Apellido", usuario.apellido],
          ["Edad", usuario.edad.toString()],
          ["Especialidades", this.mostrarEspecialidades(usuario.especialidad)],
          ["Tipo", usuario.userType],
          ["Email", usuario.email],
          ["Verificada por admin", usuario.verificadoAdmin]
        ]
        this.excelSvc.descargarExcel(data, `Datos_${usuario.nombre}_${usuario.apellido}`, `Datos_${usuario.nombre}_${usuario.apellido}`);
        break;
      case "admin":
        data = [
          ["Nombre", usuario.nombre],
          ["Apellido", usuario.apellido],
          ["Edad", usuario.edad.toString()],
          ["Tipo", usuario.userType],
          ["Email", usuario.email]
        ]
        this.excelSvc.descargarExcel(data, `Datos_${usuario.nombre}_${usuario.apellido}`, `Datos_${usuario.nombre}_${usuario.apellido}`);
        break;
    }
  }

}
