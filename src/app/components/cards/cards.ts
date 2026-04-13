import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class ProductCardComponent {
  id = input<string>();
  title = input.required<string>();
  category = input.required<string>();
  autor = input.required<string>();
  imageSrc = input.required<string>();
  alt = input<string>('Image du produit');
  isAvailable = input.required<boolean>();
}
