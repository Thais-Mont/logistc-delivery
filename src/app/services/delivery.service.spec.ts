import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { DeliveryService } from 'src/app/services/delivery.service';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ChartData } from 'chart.js';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDeliveryService: jasmine.SpyObj<DeliveryService>;

  beforeEach(async () => {
    mockDeliveryService = jasmine.createSpyObj('DeliveryService', [
      'getAndamentoPorMotorista',
      'getInsucessoPorMotorista',
      'getAndamentoPorBairro',
    ]);

    mockDeliveryService.getAndamentoPorMotorista.and.returnValue(
      of([
        { nome: 'João', total: 10, realizadas: 8 },
        { nome: 'Maria', total: 15, realizadas: 12 },
      ])
    );

    mockDeliveryService.getInsucessoPorMotorista.and.returnValue(
      of([
        { nome: 'João', insucessos: 2 },
        { nome: 'Maria', insucessos: 3 },
      ])
    );

    mockDeliveryService.getAndamentoPorBairro.and.returnValue(
      of([
        { bairro: 'Centro', total: 5, realizadas: 4 },
        { bairro: 'Jardins', total: 7, realizadas: 6 },
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [MatTableModule, NoopAnimationsModule, MatIconModule],
      providers: [{ provide: DeliveryService, useValue: mockDeliveryService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados ao iniciar', () => {
    expect(mockDeliveryService.getAndamentoPorMotorista).toHaveBeenCalled();
    expect(mockDeliveryService.getInsucessoPorMotorista).toHaveBeenCalled();
    expect(mockDeliveryService.getAndamentoPorBairro).toHaveBeenCalled();

    expect(component.motoristasEntregas.data).toEqual([
      { nome: 'João', totalEntregas: 10, entregasRealizadas: 8 },
      { nome: 'Maria', totalEntregas: 15, entregasRealizadas: 12 },
    ]);

    expect(component.motoristasInsucesso.data).toEqual([
      { nome: 'João', entregasInsucesso: 2 },
      { nome: 'Maria', entregasInsucesso: 3 },
    ]);

    expect(component.bairrosEntregas.data).toEqual([
      { bairro: 'Centro', totalEntregas: 5, entregasRealizadas: 4 },
      { bairro: 'Jardins', totalEntregas: 7, entregasRealizadas: 6 },
    ]);
  });

  it('deve atualizar os gráficos corretamente', () => {
    component.atualizarGraficoMotoristas();
    component.atualizarGraficoInsucessos();
    component.atualizarGraficoBairros();

    expect(component.motoristasChartData).toEqual({
      labels: ['João', 'Maria'],
      datasets: [
        {
          label: 'Total de Entregas',
          data: [10, 15],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Entregas Realizadas',
          data: [8, 12],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    } as ChartData<'bar'>);

    expect(component.insucessosChartData).toEqual({
      labels: ['João', 'Maria'],
      datasets: [
        {
          label: 'Entregas com Insucesso',
          data: [2, 3],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    } as ChartData<'bar'>);

    expect(component.bairrosChartData).toEqual({
      labels: ['Centro', 'Jardins'],
      datasets: [
        {
          label: 'Total de Entregas',
          data: [5, 7],
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#ffce56',
            '#4bc0c0',
            '#9966ff',
          ],
        },
      ],
    } as ChartData<'pie'>);
  });

  it('deve alternar entre tabela e gráfico', () => {
    expect(component.viewMode['motoristas']).toBe('table');
    component.toggleView('motoristas');
    expect(component.viewMode['motoristas']).toBe('chart');
    component.toggleView('motoristas');
    expect(component.viewMode['motoristas']).toBe('table');
  });

  it('deve exibir os dados nas tabelas corretamente', () => {
    fixture.detectChanges();

    const tableElements = fixture.nativeElement.querySelectorAll('table');
    expect(tableElements.length).toBe(3);

    const primeiraTabela = tableElements[0];
    const linhasPrimeiraTabela = primeiraTabela.querySelectorAll('tr');
    expect(linhasPrimeiraTabela.length).toBe(3);

    const segundaTabela = tableElements[1];
    const linhasSegundaTabela = segundaTabela.querySelectorAll('tr');
    expect(linhasSegundaTabela.length).toBe(3);

    const terceiraTabela = tableElements[2];
    const linhasTerceiraTabela = terceiraTabela.querySelectorAll('tr');
    expect(linhasTerceiraTabela.length).toBe(3);
  });
});
