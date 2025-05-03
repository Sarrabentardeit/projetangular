import { Component, OnInit } from '@angular/core';
import { PortfolioProject } from '../../models/portfolio.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-portfolio-preview',
  standalone: true,
  templateUrl: './portfolio-preview.component.html',
  styleUrls: ['./portfolio-preview.component.css'],
  imports: [CommonModule, RouterModule],
})
export class PortfolioPreviewComponent implements OnInit {
  projects: PortfolioProject[] = [];
  contactInfo = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const email = this.authService.getUserEmail(); // ✅ dynamique

    if (email) {
      const saved = localStorage.getItem(`${email}_userPortfolio`);
      if (saved) {
        this.projects = JSON.parse(saved);
      }

      const contact = localStorage.getItem(`${email}_userContact`);
      if (contact) {
        this.contactInfo = JSON.parse(contact);
      }
    } else {
      alert('Aucun utilisateur connecté.');
    }
  }
}
