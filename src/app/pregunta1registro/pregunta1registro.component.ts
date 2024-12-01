import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pregunta1registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pregunta1registro.component.html',
  styleUrl: './pregunta1registro.component.css'
})
export class Pregunta1registroComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post<{ message: string }>('http://localhost:3000/register', user)
      .subscribe(response => {
        this.message = response.message; 
        setTimeout(() => { 
          this.router.navigate(['/login']); 
        }, 1000);
      }, error => { 
        this.message = error.error.message || 'Registro fallido'; 
      });
  }

  login() { 
    this.router.navigate(['/login']); 
  }
}
