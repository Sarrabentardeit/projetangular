import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface PortfolioProject {
  title: string;
  description: string;
  technologies: string;
  link: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-editor-portfolio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editor-portfolio.component.html',
  styleUrls: ['./editor-portfolio.component.css']
})
export class EditorPortfolioComponent {
  portfolioForm: FormGroup;
  projects: PortfolioProject[] = [];
  previewUrl: string = '';
  userEmail: string = '';

  @ViewChild('templateRef', { read: ElementRef }) templateRef!: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      technologies: ['', Validators.required],
      link: ['', Validators.required],
      image: [null],
      contactName: [''],
      contactEmail: [''],
      contactMessage: ['']
    });

    // ✅ Récupérer l'email de l'utilisateur connecté
    const email = this.authService.getUserEmail();
    if (email) {
      this.userEmail = email;

      // Charger les projets pour cet utilisateur
      const saved = localStorage.getItem(`${email}_userPortfolio`);
      if (saved) {
        this.projects = JSON.parse(saved);
      }

      // Charger les informations de contact
      const contact = localStorage.getItem(`${email}_userContact`);
      if (contact) {
        const savedContact = JSON.parse(contact);
        this.portfolioForm.patchValue({
          contactName: savedContact.name,
          contactEmail: savedContact.email,
          contactMessage: savedContact.message
        });
      }
    } else {
      alert("Aucun utilisateur connecté.");
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.portfolioForm.valid && this.userEmail) {
      const project: PortfolioProject = {
        title: this.portfolioForm.value.title,
        description: this.portfolioForm.value.description,
        technologies: this.portfolioForm.value.technologies,
        link: this.portfolioForm.value.link,
        imageUrl: this.previewUrl
      };

      this.projects.push(project);
      localStorage.setItem(`${this.userEmail}_userPortfolio`, JSON.stringify(this.projects));

      const contact = {
        name: this.portfolioForm.value.contactName,
        email: this.portfolioForm.value.contactEmail,
        message: this.portfolioForm.value.contactMessage
      };

      if (contact.name && contact.email && contact.message) {
        localStorage.setItem(`${this.userEmail}_userContact`, JSON.stringify(contact));
      }

      this.portfolioForm.reset();
      this.previewUrl = '';
    }
  }

  deleteProject(index: number) {
    this.projects.splice(index, 1);
    if (this.userEmail) {
      localStorage.setItem(`${this.userEmail}_userPortfolio`, JSON.stringify(this.projects));
    }
  }

}