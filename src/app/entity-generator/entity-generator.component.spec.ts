import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityGeneratorComponent } from './entity-generator.component';

describe('EntityGeneratorComponent', () => {
  let component: EntityGeneratorComponent;
  let fixture: ComponentFixture<EntityGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
