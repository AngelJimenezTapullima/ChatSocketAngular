import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pregunta4',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './pregunta4.component.html',
  styleUrl: './pregunta4.component.css'
})
export class Pregunta4Component {
  messages: any[] = []; 
  
  constructor(private http: HttpClient, private router: Router) { } 
  
  ngOnInit(): void { 
    this.loadMessages(); 
  } 
  
  loadMessages(): void { 
    this.http.get<any[]>('http://localhost:3000/messages') 
    .subscribe(messages => { 
      this.messages = messages; 
    }, error => { 
      console.error('Fallo al cargar los mensajes:', error); 
    }); 
  }

  goToChat(): void { this.router.navigate(['/chat']); }
}
