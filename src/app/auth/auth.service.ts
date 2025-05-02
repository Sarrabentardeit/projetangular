import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'user';         // pour stocker les infos du compte
  private sessionKey = 'isLoggedIn'; // pour stocker si l'utilisateur est connecté

  // Enregistrer un nouvel utilisateur
  register(user: { name: string; email: string; password: string }): { success: boolean; message: string } {
    const existingUser = JSON.parse(localStorage.getItem(this.userKey) || 'null');
  
    if (existingUser && existingUser.email === user.email) {
      return { success: false, message: 'This email is already registered' };
    }
  
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.sessionKey, 'true');
    return { success: true, message: 'Registration successful' };
  }
  

  // Vérifier les identifiants et connecter
  login(email: string, password: string): boolean {
    const savedUser = JSON.parse(localStorage.getItem(this.userKey) || '{}');

    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem(this.sessionKey, 'true');
      return true;
    }
    return false;
  }

  // Déconnecter l'utilisateur (sans supprimer le compte)
  logout() {
    localStorage.setItem(this.sessionKey, 'false');
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return localStorage.getItem(this.sessionKey) === 'true';
  }

  // Récupère les infos de l'utilisateur
  getUser() {
    return JSON.parse(localStorage.getItem(this.userKey) || '{}');
  }
}
