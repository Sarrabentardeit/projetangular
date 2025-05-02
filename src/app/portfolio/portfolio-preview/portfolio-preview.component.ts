import { Component, OnInit } from '@angular/core';
import { PortfolioProject } from '../../models/portfolio.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  ngOnInit(): void {
    const saved = localStorage.getItem('userPortfolio');
    if (saved) {
      this.projects = JSON.parse(saved);
    }

    const contact = localStorage.getItem('userContact');
    if (contact) {
      this.contactInfo = JSON.parse(contact);
    }
  }
}
