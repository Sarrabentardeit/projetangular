import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Template1Component } from './templates/template1/template1.component';
import { Template2Component } from './templates/template2/template2.component';
import { Template3Component } from './templates/template3/template3.component';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Template1Component, Template2Component, Template3Component],
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.css']
})
export class CvEditorComponent implements OnInit {
  cvForm: FormGroup;
  selectedTemplate: string = '';
  profileImageUrl: string = 'img/profile.jpg';

  @ViewChild('templateComponent', { read: ElementRef }) templateComponent!: ElementRef;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      birthday: ['', Validators.required],
      education: ['', Validators.required],
      languages: ['', Validators.required],
      experience: ['', Validators.required],
      skills: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTemplate = params['template'];
    });
  }

  onSubmit() {
    if (this.cvForm.valid) {
      console.log(this.cvForm.value);
    } else {
      alert('Please fill in all fields correctly!');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageUrl = URL.createObjectURL(file);
    }
  }

  generatePDF() {
    if (!this.templateComponent) {
      alert('No template selected for download.');
      return;
    }
  
    const element = this.templateComponent.nativeElement; // Correction ici ✅
  
    html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      pdf.save('my_cv.pdf');
    });
  }
}