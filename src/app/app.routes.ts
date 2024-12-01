import { Routes } from '@angular/router';
import { Pregunta1Component } from "./pregunta1/pregunta1.component";
import { Pregunta1registroComponent } from './pregunta1registro/pregunta1registro.component';
import { Pregunta2Component } from "./pregunta2/pregunta2.component";
import { Pregunta3Component } from "./pregunta3/pregunta3.component";
import { Pregunta4Component } from "./pregunta4/pregunta4.component";

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch:'full'},
    {path : 'login', component: Pregunta1Component},
    {path : 'register', component: Pregunta1registroComponent},
    {path : 'upload', component: Pregunta2Component},
    {path : 'chat', component: Pregunta3Component}, 
    {path : 'messages', component: Pregunta4Component }
];
