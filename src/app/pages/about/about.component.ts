import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  yourName = 'Ahmed Sallam';
  bio =
    'I am a frontend developer with a passion for creating engaging and user-friendly interfaces. I enjoy building responsive and interactive web applications that provide a seamless experience for users.';
  email = 'ahsallam06@gmail.com';
  phone = '+201092068665';
  github = 'https://github.com/ahsallam05';
  linkedin = 'https://www.linkedin.com/in/ahsallam24/';
}
