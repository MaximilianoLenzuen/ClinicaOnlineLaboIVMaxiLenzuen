import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'bienvenida',
        loadComponent: () =>
        import('./components/bienvenida/bienvenida.component').then(
            (m) => m.BienvenidaComponent
        ),
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./components/auth/login/login.component').then(
            (m) => m.LoginComponent
        ),
    },
    {
        path: 'registro',
        loadComponent: () =>
        import('./components/auth/register/register.component').then(
            (m) => m.RegisterComponent
        ),
    },
    {
        path: 'home',
        loadComponent: () =>
        import('./components/home/home.component').then(
            (m) => m.HomeComponent
        ),
    },
    {
        path: 'bienvenida',
        loadComponent: () =>
        import('./components/bienvenida/bienvenida.component').then(
            (m) => m.BienvenidaComponent
        ),
    },
    {
        path: '**',
        redirectTo: '/bienvenida',
        pathMatch: 'full',
    },
];
