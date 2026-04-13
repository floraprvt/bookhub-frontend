import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

export interface UserToEdit {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html'
})
export class EditUser implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signal pour stocker l'utilisateur en cours d'édition
  user = signal<UserToEdit | null>(null);

  // Les rôles définis dans le cahier des charges
  availableRoles = ['USER', 'LIBRARIAN', 'ADMIN'];

  ngOnInit() {
    // 1. Récupérer l'ID depuis l'URL
    const userId = this.route.snapshot.paramMap.get('id');
    
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(id: string) {
    // 2. Simulation de récupération en BDD (A remplacer par ton Service plus tard)
    // Ici on simule qu'on a trouvé l'utilisateur correspondant à l'ID
    this.user.set({
      id: id,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      role: 'USER'
    });
  }

  saveChanges() {
    console.log("Nouvelles données sauvegardées :", this.user());
    alert('Rôle mis à jour avec succès !');
    
    // 3. Retourner à la liste des administrateurs
    this.router.navigate(['/admin']);
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}