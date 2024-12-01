import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pregunta1registroComponent } from './pregunta1registro.component';

describe('Pregunta1registroComponent', () => {
  let component: Pregunta1registroComponent;
  let fixture: ComponentFixture<Pregunta1registroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pregunta1registroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pregunta1registroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
