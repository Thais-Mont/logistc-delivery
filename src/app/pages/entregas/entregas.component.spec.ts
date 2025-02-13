import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntregasComponent } from './entregas.component';
import { DeliveryService } from 'src/app/services/delivery.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [EntregasComponent],
    imports: [
      ReactiveFormsModule,
      MatTableModule,
      MatFormFieldModule,
      MatSelectModule,
      MatPaginatorModule,
      MatCardModule,
      MatInputModule,
      MatSortModule,
      HttpClientTestingModule,
      NoopAnimationsModule,
    ],
    providers: [{ provide: DeliveryService, useValue: DeliveryService }],
  }).compileComponents();
});

describe('EntregasComponent', () => {
  let component: EntregasComponent;
  let fixture: ComponentFixture<EntregasComponent>;
  let mockDeliveryService: jasmine.SpyObj<DeliveryService>;

  beforeEach(async () => {
    mockDeliveryService = jasmine.createSpyObj('DeliveryService', ['getEntregas']);
    mockDeliveryService.getEntregas.and.returnValue(of([
      {
        id: '1',
        documento: '12345',
        motorista: { nome: 'João' },
        cliente_origem: { nome: 'Empresa A', bairro: 'Centro', endereco: 'Rua X', cidade: 'Cidade Y' },
        cliente_destino: { nome: 'Empresa B', bairro: 'Bairro Z', endereco: 'Rua Y', cidade: 'Cidade X' },
        status_entrega: 'Pendente'
      },
      {
        id: '2',
        documento: '67890',
        motorista: { nome: 'Maria' },
        cliente_origem: { nome: 'Empresa C', bairro: 'Bairro A', endereco: 'Rua W', cidade: 'Cidade Z' },
        cliente_destino: { nome: 'Empresa D', bairro: 'Bairro B', endereco: 'Rua V', cidade: 'Cidade W' },
        status_entrega: 'Entregue'
      }
    ]));

    await TestBed.configureTestingModule({
      declarations: [EntregasComponent],
      imports: [
          ReactiveFormsModule,
          MatTableModule,
          MatFormFieldModule,
          MatSelectModule,
          MatPaginatorModule,
          MatCardModule,
          MatInputModule,
          MatSortModule,
      ],
      providers: [{ provide: DeliveryService, useValue: mockDeliveryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(EntregasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar entregas ao iniciar', () => {
    expect(component.entregas.length).toBe(2);
  });

  it('deve filtrar entregas pelo nome do motorista', () => {
    component.motoristaControl.setValue('João');
    component.aplicarFiltros();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].motorista.nome).toBe('João');
  });

  it('deve filtrar entregas pelo status', () => {
    component.statusControl.setValue('Entregue');
    component.aplicarFiltros();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].status_entrega).toBe('Entregue');
  });
});
