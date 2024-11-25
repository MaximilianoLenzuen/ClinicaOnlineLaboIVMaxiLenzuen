import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../services/sweetAlert.service';
import { DateFormateadaPipe } from '../../../pipes/date-formateada.pipe';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { LoadingComponent } from '../../loading/loading.component';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger, 
  keyframes,
  group,
  sequence
} from '@angular/animations';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DateFormateadaPipe, LoadingComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.scss',
  animations: [
    // Animación para especialidades - efecto volteo 3D con escala
    trigger('especialidadesAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translateY(200px) rotateX(90deg) scale(0.5)',
            transformOrigin: 'bottom'
          }),
          stagger('100ms', [
            animate('700ms cubic-bezier(0.2, 0.8, 0.4, 1)', keyframes([
              style({ 
                opacity: 0.3, 
                transform: 'translateY(100px) rotateX(45deg) scale(0.8)',
                offset: 0.4 
              }),
              style({ 
                opacity: 0.6, 
                transform: 'translateY(20px) rotateX(20deg) scale(1.1)',
                offset: 0.7 
              }),
              style({ 
                opacity: 1, 
                transform: 'translateY(0) rotateX(0) scale(1)',
                offset: 1 
              })
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    
    // Animación para especialistas - efecto espiral desde abajo
    trigger('especialistasAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translateY(200px) rotate(180deg) scale(0)',
            transformOrigin: 'center'
          }),
          stagger('150ms', [
            animate('800ms cubic-bezier(0.3, 0, 0.3, 1)', keyframes([
              style({ 
                opacity: 0.4,
                transform: 'translateY(150px) rotate(90deg) scale(0.3)',
                offset: 0.3 
              }),
              style({ 
                opacity: 0.8,
                transform: 'translateY(50px) rotate(-20deg) scale(1.2)',
                offset: 0.6 
              }),
              style({ 
                opacity: 1,
                transform: 'translateY(0) rotate(0) scale(1)',
                offset: 1 
              })
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    
    // Animación para fechas - efecto rebote elástico
    trigger('fechasAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translateY(300px)',
            transformOrigin: 'bottom'
          }),
          stagger('60ms', [
            animate('900ms cubic-bezier(0.68, -0.6, 0.32, 1.6)', keyframes([
              style({ 
                opacity: 0.3,
                transform: 'translateY(200px) scale(0.8)',
                offset: 0.2 
              }),
              style({ 
                opacity: 0.6,
                transform: 'translateY(-40px) scale(1.1)',
                offset: 0.6 
              }),
              style({ 
                opacity: 0.8,
                transform: 'translateY(15px) scale(0.95)',
                offset: 0.8 
              }),
              style({ 
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                offset: 1 
              })
            ]))
          ])
        ], { optional: true })
      ])
    ]),
    
    // Animación para horarios - efecto onda expansiva
    trigger('horariosAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ 
            opacity: 0,
            transform: 'translateY(100px) scale(0.3)',
            filter: 'blur(10px)'
          }),
          stagger('80ms', [
            sequence([
              animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
                style({ 
                  opacity: 0.4,
                  transform: 'translateY(80px) scale(0.5)',
                  filter: 'blur(8px)',
                  offset: 0.2 
                }),
                style({ 
                  opacity: 0.8,
                  transform: 'translateY(40px) scale(1.2)',
                  filter: 'blur(4px)',
                  offset: 0.6 
                }),
                style({ 
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                  filter: 'blur(0px)',
                  offset: 1 
                })
              ])),
              animate('200ms ease-out', style({
                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
              }))
            ])
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SolicitarTurnoComponent {
  especialidadSeleccionada: string = '';
  especialistaSeleccionado: any;
  otraEspecialidadSeleccionada: string = '';
  fechaSeleccionada: string = '';
  especialidad:any;
  especialistaAux:any;
  especialistaAux2:any;
  fechasDisponibles: Date[] = [];
  turnosDisponibles: any[] = [];
  especialidadesDelEspecialista :any[] = [];
  especialidadesMapeadas :any[] = [];
  
  especialistas: any[] = [];
  pacientes: any[] = [];

  especialidades:any[] = [
    { id: 1, nombre: 'Cardiología', imagen: 'img/cardiologia.png' },
    { id: 2, nombre: 'Dermatología', imagen: 'img/dermatologia.png' },
    { id: 3, nombre: 'Endocrinología', imagen: 'img/endocrinologia.png' },
    { id: 4, nombre: 'Gastroenterología', imagen: 'img/gastroenterologia.png' },
    { id: 5, nombre: 'Ginecología', imagen: 'img/ginecologia.png' },
    { id: 6, nombre: 'Neurología', imagen: 'img/neurologia.png' },
    { id: 7, nombre: 'Odontología', imagen: '' },
    { id: 8, nombre: 'Oftalmología', imagen: 'img/oftalmologia.png' },
    { id: 9, nombre: 'Programador', imagen: 'img/sinFoto.png' }
  ];



  paso:string = "Seleccione un especialista";

  firestoreSvc = inject(FirestoreService);
  sweetAlert = inject(SweetAlertService);

  isLoading:boolean = false;

  @Input() user:any;

  errorStates = {
    especialidad: false,
    otraEspecialidad: false,
    especialista: false,
    fecha: false,
    horario: false,
    paciente: false
  };


  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.cargarFechasDisponibles();
    this.cargarPacientes();
    this.cargarEspecialistas();
  }

  cargarPacientes(): void {
    this.firestoreSvc.getDocumentsWhere("users", "userType", "paciente").subscribe((pacientes) => {
      this.pacientes = pacientes;
    });
  }

  cargarEspecialistas(): void {
    this.firestoreSvc.getDocumentsWhere("users", "userType", "especialista").subscribe((especialistas) => {
      this.especialistas = especialistas;
    });
  }

  cargarFechasDisponibles(): void {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 15); 

    this.fechasDisponibles = this.getFechasEntre(hoy, limite);
  }

  getFechasEntre(fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas: Date[] = [];
    let fechaActual = new Date(fechaInicio);

    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return fechas;
  }

  pacienteSeleccionado:any;
  errMsg: string = "";
  solicitarTurno(): void {
    this.isLoading = true;
    this.errMsg = "";
    this.errorStates = {
      especialidad: false,
      otraEspecialidad: false,
      especialista: false,
      fecha: false,
      horario: false,
      paciente: false
    };
    var especialidad = this.especialidadSeleccionada;
    if (this.especialidadSeleccionada === "Otra") {
      especialidad = this.otraEspecialidadSeleccionada;
    }
    var userID = this.user.id;
    if (this.user.userType === "admin"){
      userID = this.pacienteSeleccionado;
    }
    if (this.especialidad && this.especialistaSeleccionado && this.fechaSeleccionada && this.horarioSeleccionado) {
      this.firestoreSvc.addDocument("turnos", {
        especialidad: especialidad,
        especialista: this.especialistaSeleccionado,
        fecha: this.fechaSeleccionada,
        horario: this.horarioSeleccionado,
        paciente: userID,
        estado: 'Pendiente'
      }).then(() => {
        this.isLoading = false;
        this.sweetAlert.showSuccessAlert("Se pidió el turno con éxito", "Éxito", "success");

        this.paso = "Selecciona una especialidad";
        this.especialidad = "";
        this.horarioSeleccionado = "";
        this.especialistaSeleccionado = '';
        this.especialidadSeleccionada = '';
        this.otraEspecialidadSeleccionada = '';
        this.fechaSeleccionada = '';
        this.horarios = [];
      }).catch((error) => {
        console.error('Error al solicitar el turno:', error);
        this.isLoading = false;
        this.sweetAlert.showSuccessAlert("Error al solicitar el turno", "Error", "error");
      });
    } else {
      this.isLoading = false;
    }
  }

  otraEspecialidad: boolean = false;
  @ViewChild('especialidadPersonalizadaInput') especialidadPersonalizadaInput!: ElementRef;

  async onEspecialidadChange(event: any) {
    this.especialidadSeleccionada = event;
    
    this.otraEspecialidad = this.especialidadSeleccionada === 'Otra';
    if (this.otraEspecialidad) {
      setTimeout(() => {
        this.especialidadPersonalizadaInput.nativeElement.focus();
      }, 100);
    } else {
      this.firestoreSvc.getDocument("users", this.especialistaSeleccionado).subscribe(especialista => {
        if (especialista) {


          /*
          this.especialidad = especialista.especialidad.find((especialidad: any) => especialidad["nombre"] === this.especialidadSeleccionada);
          if (this.especialidad) {
            let dias = new Set<string>();
            this.especialidad.horarios.forEach((horario: any) => {
              dias.add(horario.dia);
            });
            
            this.fechasDisponibles = this.obtenerFechasProximas(Array.from(dias));
            
            
            
          } else {
            this.fechasDisponibles = [];
          }
          */
          this.especialidad = especialista.especialidad.find((especialidad: any) => especialidad["nombre"] === this.especialidadSeleccionada);
          if (this.especialidad) {
            let dias = new Set<string>();
            this.especialidad.horarios.forEach((horario: any) => {
              dias.add(horario.dia);
            });
            
            this.fechasDisponibles = this.obtenerFechasProximas(Array.from(dias));
            
            
            
          } else {
            this.fechasDisponibles = [];
          }


        }
      })

      this.isLoading = true;
      this.otraEspecialidadSeleccionada = "";
      this.isLoading = false;
      this.paso = "Seleccione una fecha";
    }
  }

  inputOtra:any;
  onOtraEspecialidadChange() {
    this.otraEspecialidadSeleccionada = this.inputOtra;
    debugger;
    if (this.inputOtra) {
      this.firestoreSvc.getDocumentsWhereArrayElementMatches("users", "especialidad", "nombre", this.otraEspecialidadSeleccionada).subscribe(especialistas => {
        this.especialistas = especialistas;
      })
      this.otraEspecialidad = false;
      this.paso = "Seleccione un especialista";
    } else {
      this.sweetAlert.showSuccessAlert("Ingrese la especialidad", "Error", "error");
    }
  }
  
 


  onEspecialistaChange($event:any): void {
    /*
    this.fechasDisponibles = [];
    this.especialistaSeleccionado = $event;
    var auxespecialidad:any = this.especialidadSeleccionada;
    this.firestoreSvc.getDocument("users", this.especialistaSeleccionado).subscribe(especialista => {
      debugger;
      if (especialista) {
        this.especialidadesDelEspecialista = especialista.especialidad;
      }
      if (especialista) {
        this.especialidadesMapeadas = this.especialidades.filter(esp => 
          especialista.especialidad.some((espDB: { nombre: any; }) => espDB.nombre === esp.nombre)
        );
      }
        
    })
    this.paso = "Selecciona una especialidad";
    */
    this.fechasDisponibles = [];
    this.especialistaSeleccionado = $event;
    var auxespecialidad: any = this.especialidadSeleccionada;
    
    this.firestoreSvc.getDocument("users", this.especialistaSeleccionado).subscribe(especialista => {
      if (especialista) {
        this.especialidadesDelEspecialista = especialista.especialidad;
  
        // Mapear especialidades del especialista con las del array
        this.especialidadesMapeadas = this.especialidades.filter(esp => 
          especialista.especialidad.some((espDB: { nombre: any; }) => espDB.nombre === esp.nombre)
        );
  
        // Si no se encuentra ninguna especialidad, usar la opción "Otra"
        if (this.especialidadesMapeadas.length === 0) {
          this.especialidadesMapeadas = [{
            id: 9,
            nombre: 'Otra',
            imagen: 'img/sinFoto.png'
          }];
        }
      } else {
        // Si el especialista no existe, usar directamente la opción "Otra"
        this.especialidadesMapeadas = [{
          id: 9,
          nombre: 'Otra',
          imagen: 'img/sinFoto.png'
        }];
      }
    });
  
    this.paso = "Selecciona una especialidad";
  }

  obtenerFechasProximas(diasSemana: string[]): Date[] {
    const diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 15); // Próximos 15 días
  
    const fechasProximas: Date[] = [];
  
    for (let i = 0; i <= 15; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const diaSemana = diasDeLaSemana[fecha.getDay()];
  
      if (diasSemana.includes(diaSemana)) {
        fechasProximas.push(fecha);
      }
    }
  
    return fechasProximas;
  }
  

  horarios:any = [];
  onTurnoChange(fecha: any) {
    const formatearFecha = this.trasnformarFecha(fecha);
    const diaSeleccionado = formatearFecha.split(",")[0]; // Obteniendo el día en formato "09"
    const horario = this.especialidad.horarios.find((horario: any) => horario.dia === diaSeleccionado);

    
    if (horario) {
        this.obtenerTurnosReservados(formatearFecha)
        .subscribe((reservados: any) => {
          this.horarios = this.filtrarHorariosDisponibles(horario.horaInicio, horario.horaFin, reservados);
          console.log("HORARIOS: " , this.horarios);
        });
        this.fechaSeleccionada = formatearFecha;
        this.paso = "Seleccione un horario";
    } else {
        this.horarios = [];
    }
}

trasnformarFecha(fecha:Date):string {
  const diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const mesesDelAno = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  const diaSemana = diasDeLaSemana[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = mesesDelAno[fecha.getMonth()];
  const ano = fecha.getFullYear();
  
  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}


  obtenerTurnosReservados(fecha: string): Observable<string[]> {
    return this.firestore.collection('turnos', ref =>
      ref.where('fecha', '==', `${fecha}`)
         .where('estado', '!=', 'Cancelado')
    ).valueChanges()
     .pipe(
       map((turnos: any[]) => turnos.map(turno => turno.horario))
     );
  }

  filtrarHorariosDisponibles(horaInicio: string, horaFin: string, horariosReservados: string[]): string[] {
    
    const turnos: string[] = [];
    let [inicioHora, inicioMinuto] = horaInicio.split(':').map(Number);
    let [finHora, finMinuto] = horaFin.split(':').map(Number);

    let inicioTotalMinutos = inicioHora * 60 + inicioMinuto;
    const finTotalMinutos = finHora * 60 + finMinuto;

    while (inicioTotalMinutos + 30 <= finTotalMinutos) {
      const horas = Math.floor(inicioTotalMinutos / 60).toString().padStart(2, '0');
      const minutos = (inicioTotalMinutos % 60).toString().padStart(2, '0');
      const turno = `${horas}:${minutos}`;
      if (!horariosReservados.includes(turno)) {
        turnos.push(turno);
      }
      inicioTotalMinutos += 30;
    }

    return turnos;
  }

  horarioSeleccionado:any;
  onHorarioSelected(horario:any):void {
    this.horarioSeleccionado = horario;
    this.paso = "Confirme su turno";
  }

  formatHora(hora: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    const amPm = horas >= 12 ? 'PM' : 'AM';
    const horasFormateadas = horas % 12 || 12; // Convierte 0 a 12 para el formato de 12 horas
    return `${this.pad(horasFormateadas)}:${this.pad(minutos)} ${amPm}`;
}

  pad(numero: number): string {
      return numero.toString().padStart(2, '0');
  }

  atrasPaso(){
    switch (this.paso) {
      case "Confirme su turno":
        this.paso = "Seleccione un horario";
        this.horarioSeleccionado = "";
        break;
      case "Seleccione un horario":
        this.paso = "Seleccione una fecha";
        this.fechaSeleccionada = ""
        break;
      case "Seleccione una fecha":
        this.paso = "Seleccione un especialista";
        this.especialistaSeleccionado = "";
        break;
      case "Seleccione un especialista":
        this.paso = "Selecciona una especialidad";
        this.especialidadSeleccionada = "";
        this.especialidad = "";
        break;
    }
  }
}
