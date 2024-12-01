import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pregunta4Component } from './pregunta4.component';

describe('Pregunta4Component', () => {
  let component: Pregunta4Component;
  let fixture: ComponentFixture<Pregunta4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pregunta4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pregunta4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
