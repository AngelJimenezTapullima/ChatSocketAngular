import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pregunta2',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pregunta2.component.html',
  styleUrl: './pregunta2.component.css'
})
export class Pregunta2Component {
  userName: string = ''; 
  userEmail: string = ''; 
  profileImage: string | null = null;
  selectedFile: File | null = null; 
  message = '';
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void { 
    this.userName = localStorage.getItem('userName') || ''; 
    this.userEmail = localStorage.getItem('userEmail') || ''; 

    this.route.queryParams.subscribe(params => { 
      if (params['name']) { this.userName = params['name']; } 
      if (params['email']) { this.userEmail = params['email']; } 
    });

    this.http.get<{ profileImage: string }>(`http://localhost:3000/user/${this.userEmail}`) 
    .subscribe(response => { 
      this.profileImage = response.profileImage; 
    }, error => { 
      console.error('Error al cargar la imagen:', error); 
    });
  }

  onFileSelected(event: any): void { 
    this.selectedFile = event.target.files[0]; 
  }

  onUpload(): void { 
    if (!this.selectedFile) return; 

    const formData = new FormData(); 

    formData.append('profileImage', this.selectedFile); 
    formData.append('email', this.userEmail);

    this.http.post<{ message: string, profileImage: string }>('http://localhost:3000/upload', formData) 
    .subscribe(response => { 
      this.message = response.message; 
      this.profileImage = response.profileImage;
      console.log('Archivo subido correctamente:', response.profileImage); 
    }, error => { 
      this.message = error.error.message || 'Fallo al subir el archivo'; 
    }); 
  }

  goToChat(): void { this.router.navigate(['/chat']); }
}
