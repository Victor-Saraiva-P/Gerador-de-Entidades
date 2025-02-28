import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entity-generator',
  standalone: true, // <-- Importante para Standalone API
  imports: [CommonModule, FormsModule], // <-- Importando FormsModule para ngModel funcionar
  templateUrl: './entity-generator.component.html',
  styleUrls: ['./entity-generator.component.css']
})
export class EntityGeneratorComponent {
  atributos: { nome: string; tipo: string }[] = [];

  adicionarAtributo() {
    this.atributos.push({ nome: '', tipo: '' });
  }

  removerAtributo(index: number) {
    this.atributos.splice(index, 1);
  }
}
