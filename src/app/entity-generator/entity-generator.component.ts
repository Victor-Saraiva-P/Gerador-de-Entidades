import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AtributoEntity {
  nome: string;
  tipo: string;
  // JPA annotations
  isId: boolean;
  generationType?: 'AUTO' | 'IDENTITY' | 'SEQUENCE' | 'TABLE' | 'UUID';
  isColumn: boolean;
  nullable: boolean;
  unique: boolean;
  length?: number;
  precision?: number;
  scale?: number;
  columnDefinition?: string;
  // Enum handling
  isEnum: boolean;
  enumType?: 'ORDINAL' | 'STRING';
  // Temporal
  temporalType?: 'DATE' | 'TIME' | 'TIMESTAMP';
  // Common validations
  notNull: boolean;
  notEmpty: boolean;
  notBlank: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  email: boolean;
}

@Component({
  selector: 'app-entity-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entity-generator.component.html',
  styleUrls: ['./entity-generator.component.css'],
})
export class EntityGeneratorComponent {
  entityName: string = '';
  generatedCode: string = '';
  atributos: AtributoEntity[] = [];
  tiposDisponiveis: string[] = [
    'String',
    'Integer',
    'Long',
    'Double',
    'Float',
    'Boolean',
    'Date',
    'LocalDate',
    'LocalDateTime',
    'BigDecimal',
    'UUID',
    'Enum',
  ];

  generationTypes = ['AUTO', 'IDENTITY', 'SEQUENCE', 'TABLE', 'UUID'];
  enumTypes = ['ORDINAL', 'STRING'];
  temporalTypes = ['DATE', 'TIME', 'TIMESTAMP'];

  adicionarAtributo() {
    this.atributos.push({
      nome: '',
      tipo: 'String',
      // Default values for attributes
      isId: false,
      isColumn: true,
      nullable: true,
      unique: false,
      isEnum: false,
      notNull: false,
      notEmpty: false,
      notBlank: false,
      email: false,
      length: 255,
    });
    // Generate code when attribute is added
    this.gerarCodigoEntity();
  }

  removerAtributo(index: number) {
    this.atributos.splice(index, 1);
    // Generate code when attribute is removed
    this.gerarCodigoEntity();
  }

  onTipoChange(atributo: AtributoEntity) {
    // Reset type-specific properties
    atributo.isEnum = atributo.tipo === 'Enum';
    atributo.enumType = atributo.isEnum ? 'STRING' : undefined;

    const isNumeric = [
      'Integer',
      'Long',
      'Double',
      'Float',
      'BigDecimal',
    ].includes(atributo.tipo);
    atributo.min = isNumeric ? undefined : undefined;
    atributo.max = isNumeric ? undefined : undefined;

    const isDate = ['Date', 'LocalDate', 'LocalDateTime'].includes(
      atributo.tipo
    );
    atributo.temporalType = isDate ? 'TIMESTAMP' : undefined;

    if (atributo.tipo === 'String') {
      atributo.length = 255;
    } else {
      atributo.length = undefined;
    }
    
    // Generate code when attribute type changes
    this.gerarCodigoEntity();
  }

  // Update method to generate the entity code
  gerarCodigoEntity(nomeEntidade: string = this.entityName) {
    if (!nomeEntidade || this.atributos.length === 0) {
      this.generatedCode = '';
      return;
    }
    
    // Format entity name to follow Java conventions (PascalCase)
    const formattedEntityName = this.capitalizeFirstLetter(nomeEntidade);
    
    // Start building the code
    let code = '';
    
    // Package declaration
    code += 'package com.example.entity;\n\n';
    
    // Import statements
    const imports = new Set<string>([
      'import javax.persistence.*;'
    ]);
    
    // Check if we need validation imports
    const hasValidation = this.atributos.some(attr => 
      attr.notNull || attr.notEmpty || attr.notBlank || 
      attr.email || attr.pattern || attr.min != null || attr.max != null
    );
    
    if (hasValidation) {
      imports.add('import javax.validation.constraints.*;');
    }
    
    // Check for specialized types
    if (this.atributos.some(attr => attr.tipo === 'Date')) {
      imports.add('import java.util.Date;');
    }
    
    if (this.atributos.some(attr => attr.tipo === 'LocalDate' || attr.tipo === 'LocalDateTime')) {
      imports.add('import java.time.*;');
    }
    
    if (this.atributos.some(attr => attr.tipo === 'BigDecimal')) {
      imports.add('import java.math.BigDecimal;');
    }
    
    if (this.atributos.some(attr => attr.tipo === 'UUID')) {
      imports.add('import java.util.UUID;');
    }
    
    // Add sorted imports to code
    Array.from(imports).sort().forEach(imp => {
      code += `${imp}\n`;
    });
    code += '\n';
    
    // Class declaration
    code += '@Entity\n';
    code += `public class ${formattedEntityName} {\n\n`;
    
    // Fields
    this.atributos.forEach(attr => {
      // Skip if the attribute has no name
      if (!attr.nome) return;
      
      // Format attribute name to follow Java conventions (camelCase)
      const fieldName = this.camelCase(attr.nome);
      
      // Add JPA annotations
      if (attr.isId) {
        code += '    @Id\n';
        if (attr.generationType) {
          code += `    @GeneratedValue(strategy = GenerationType.${attr.generationType})\n`;
        }
      }
      
      if (attr.isEnum) {
        code += `    @Enumerated(EnumType.${attr.enumType || 'STRING'})\n`;
      }
      
      if (attr.isColumn) {
        const columnProps = [];
        if (!attr.nullable) columnProps.push('nullable = false');
        if (attr.unique) columnProps.push('unique = true');
        if (attr.tipo === 'String' && attr.length) columnProps.push(`length = ${attr.length}`);
        if ((attr.tipo === 'BigDecimal' || attr.tipo === 'Double' || attr.tipo === 'Float') && 
            attr.precision && attr.scale) {
          columnProps.push(`precision = ${attr.precision}, scale = ${attr.scale}`);
        }
        
        if (columnProps.length > 0) {
          code += `    @Column(${columnProps.join(', ')})\n`;
        } else {
          code += '    @Column\n';
        }
      }
      
      // Add Temporal annotation if needed
      if (attr.tipo === 'Date' && attr.temporalType) {
        code += `    @Temporal(TemporalType.${attr.temporalType})\n`;
      }
      
      // Add validation annotations
      if (attr.notNull) {
        code += '    @NotNull\n';
      }
      
      if (attr.tipo === 'String') {
        if (attr.notEmpty) {
          code += '    @NotEmpty\n';
        }
        
        if (attr.notBlank) {
          code += '    @NotBlank\n';
        }
        
        if (attr.email) {
          code += '    @Email\n';
        }
        
        if (attr.pattern) {
          code += `    @Pattern(regexp = "${attr.pattern}")\n`;
        }
      }
      
      if (['Integer', 'Long', 'Double', 'Float', 'BigDecimal'].includes(attr.tipo)) {
        if (attr.min !== undefined && attr.min !== null) {
          code += `    @Min(value = ${attr.min})\n`;
        }
        
        if (attr.max !== undefined && attr.max !== null) {
          code += `    @Max(value = ${attr.max})\n`;
        }
      }
      
      // Field declaration
      code += `    private ${attr.tipo} ${fieldName};\n\n`;
    });
    
    // Getters and Setters
    this.atributos.forEach(attr => {
      if (!attr.nome) return;
      
      const fieldName = this.camelCase(attr.nome);
      const methodName = this.capitalizeFirstLetter(fieldName);
      
      // Getter
      code += `    public ${attr.tipo} get${methodName}() {\n`;
      code += `        return this.${fieldName};\n`;
      code += '    }\n\n';
      
      // Setter
      code += `    public void set${methodName}(${attr.tipo} ${fieldName}) {\n`;
      code += `        this.${fieldName} = ${fieldName};\n`;
      code += '    }\n\n';
    });
    
    // Close class
    code += '}\n';
    
    this.generatedCode = code;
  }

  // Helper method to capitalize the first letter
  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Helper method to convert to camelCase
  camelCase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  // Update code when entity name changes
  onEntityNameChange() {
    this.gerarCodigoEntity();
  }

  // Handle attribute changes
  onAttributeChange() {
    this.gerarCodigoEntity();
  }

  toggleSection(event: Event) {
    const heading = event.target as HTMLElement;

    if (heading.classList.contains('collapsed')) {
      heading.classList.remove('collapsed');
    } else {
      heading.classList.add('collapsed');
    }
  }
}