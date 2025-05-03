import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Importation du service d'authentification

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule], // Importation des modules nécessaires pour les formulaires réactifs
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    // Initialisation du formulaire de connexion avec des validations
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validation de l'email
      password: ['', Validators.required] // Validation du mot de passe
    });
  }

  // Méthode pour soumettre le formulaire de connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Appel du service d'authentification pour se connecter
      const success = this.authService.login(email, password);

      if (success) {
        // Si la connexion est réussie, rediriger vers le tableau de bord
        this.router.navigate(['/dashboard']);
      } else {
        // Sinon, afficher un message d'erreur
        alert('Identifiants invalides');
      }
    }
  }
}
