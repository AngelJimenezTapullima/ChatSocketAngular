import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-pregunta3',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './pregunta3.component.html',
  styleUrl: './pregunta3.component.css'
})
export class Pregunta3Component implements OnInit {

  messages: any[] = []; 
  message = ''; 
  userName: string = ''; 
  userEmail: string = ''; 
  profileImage: string | null = null;
  
  constructor(private socket: Socket, private http: HttpClient, private router: Router) { }

  ngOnInit(): void { 
    this.userName = localStorage.getItem('userName') || 'Anonymous';
    this.userEmail = localStorage.getItem('userEmail') || 'Anonymous';

    this.http.get<{ profileImage: string }>(`http://localhost:3000/user/${this.userEmail}`) 
    .subscribe(response => { 
      this.profileImage = response.profileImage;
    }, error => { 
      console.error('Error al cargar la imagen:', error); 
    });

    this.socket.emit('new user', {name: this.userName, email: this.userEmail, profileImage: this.profileImage});

    this.socket.on('chat message', (msg: any) => { 
      this.messages.push(msg); 
    });
  }

  sendMessage(): void { 
    if (this.message.trim() === '') { 
      return;
    }

    const msg = { text: this.message, profileImage: this.profileImage };
    this.socket.emit('chat message', msg); 
    this.message = ''; 
  }

  goToUpload(): void { 
    const email = localStorage.getItem('userEmail');
    console.log('Email enviado (Prueba):', localStorage.getItem('userEmail'));
    this.router.navigate(['/upload'], { 
      queryParams: { 
        name: this.userName, 
        email: email
      } 
    }); 
  }

  logout(): void { 
    localStorage.removeItem('userName'); 
    localStorage.removeItem('userEmail'); 
    localStorage.removeItem('profileImageUrl'); 
    this.router.navigate(['/login']); 
  }

  goToMessages(): void { this.router.navigate(['/messages']); }
}
