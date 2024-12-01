import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pregunta1',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pregunta1.component.html',
  styleUrl: './pregunta1.component.css'
})
export class Pregunta1Component {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ message: string, name: string, email: string, profileImageUrl: string }>('http://localhost:3000/login', user)
      .subscribe(response => {
        this.message = response.message;
        localStorage.setItem('userName', response.name); 
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('profileImageUrl', response.profileImageUrl);
        this.router.navigate(['/chat']);
      }, error => {
        this.message = error.error.message || 'Logeo fallido';
      });
  }

  registro() { 
    this.router.navigate(['/register']); 
  }
}
