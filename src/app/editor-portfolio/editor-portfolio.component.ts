import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RouterModule } from '@angular/router';

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

  @ViewChild('templateRef', { read: ElementRef }) templateRef!: ElementRef;

  constructor(private fb: FormBuilder) {
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

    const saved = localStorage.getItem('userPortfolio');
    if (saved) {
      this.projects = JSON.parse(saved);
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
    if (this.portfolioForm.valid) {
      const project: PortfolioProject = {
        title: this.portfolioForm.value.title,
        description: this.portfolioForm.value.description,
        technologies: this.portfolioForm.value.technologies,
        link: this.portfolioForm.value.link,
        imageUrl: this.previewUrl
      };

      this.projects.push(project);
      localStorage.setItem('userPortfolio', JSON.stringify(this.projects));

      // ✅ Save contact info
      const contact = {
        name: this.portfolioForm.value.contactName,
        email: this.portfolioForm.value.contactEmail,
        message: this.portfolioForm.value.contactMessage
      };
      localStorage.setItem('userContact', JSON.stringify(contact));

      this.portfolioForm.reset();
      this.previewUrl = '';
    }
  }

  deleteProject(index: number) {
    this.projects.splice(index, 1);
    localStorage.setItem('userPortfolio', JSON.stringify(this.projects));
  }

  exportPDF() {
    const element = this.templateRef.nativeElement;
    html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('portfolio.pdf');
    });
  }
}
