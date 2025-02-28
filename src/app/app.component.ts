import { Component } from '@angular/core';
import { EntityGeneratorComponent } from './entity-generator/entity-generator.component';

@Component({
  selector: 'app-root',
  imports: [EntityGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gerador-de-entidades';
}
