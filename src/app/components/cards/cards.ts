import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Author, Category } from '../../interface';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class ProductCardComponent {
  id = input<string>();
  title = input.required<string>();
  categories = input.required<Category[]>();
  authors = input.required<Author[]>();
  imageSrc = input.required<string>();
  alt = input<string>('Image du produit');
  isAvailable = input.required<boolean>();
}
