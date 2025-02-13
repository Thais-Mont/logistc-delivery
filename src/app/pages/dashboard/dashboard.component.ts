import { Component, OnInit } from '@angular/core';
import { DeliveryService } from 'src/app/services/delivery.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  motoristasEntregas = new MatTableDataSource<any>([]);
  motoristasInsucesso = new MatTableDataSource<any>([]);
  bairrosEntregas = new MatTableDataSource<any>([]);

  displayedColumnsMotoristas = ['nome', 'totalEntregas', 'entregasRealizadas'];
  displayedColumnsInsucesso = ['nome', 'entregasInsucesso'];
  displayedColumnsBairros = ['bairro', 'totalEntregas', 'entregasRealizadas'];

  viewMode: { [key: string]: 'table' | 'chart' } = {
    motoristas: 'table',
    insucessos: 'table',
    bairros: 'table',
  };

  motoristasChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  insucessosChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  bairrosChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };


  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

carregarDados(): void {
  this.deliveryService.getAndamentoPorMotorista().subscribe((data) => {
    this.motoristasEntregas.data = data.map((item) => ({
      nome: item.nome,
      totalEntregas: item.total,
      entregasRealizadas: item.realizadas,
    }));
    this.atualizarGraficoMotoristas();
  });

  this.deliveryService.getInsucessoPorMotorista().subscribe((data) => {
    this.motoristasInsucesso.data = data.map((item) => ({
      nome: item.nome,
      entregasInsucesso: item.insucessos,
    }));
    this.atualizarGraficoInsucessos();
  });

  this.deliveryService.getAndamentoPorBairro().subscribe((data) => {
    this.bairrosEntregas.data = data.map((item) => ({
      bairro: item.bairro,
      totalEntregas: item.total,
      entregasRealizadas: item.realizadas,
    }));
    this.atualizarGraficoBairros();
  });
}


  atualizarGraficoMotoristas(): void {
    const dados = this.motoristasEntregas.data;

    this.motoristasChartData = {
      labels: dados.map((m: any) => m.nome),
      datasets: [
        {
          label: 'Total de Entregas',
          data: dados.map((m: any) => m.totalEntregas),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Entregas Realizadas',
          data: dados.map((m: any) => m.entregasRealizadas),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
      ]
    };
  }

  atualizarGraficoInsucessos(): void {
    const dados = this.motoristasInsucesso.data;

    this.insucessosChartData = {
      labels: dados.map((m: any) => m.nome),
      datasets: [
        {
          label: 'Entregas com Insucesso',
          data: dados.map((m: any) => m.entregasInsucesso),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
  }

  atualizarGraficoBairros(): void {
    const dados = this.bairrosEntregas.data;

    this.bairrosChartData = {
      labels: dados.map((b: any) => b.bairro),
      datasets: [
        {
          label: 'Total de Entregas',
          data: dados.map((b: any) => b.totalEntregas),
          backgroundColor: [
            '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff',
          ],
        }
      ]
    };
  }

  

  toggleView(section: string) {
    this.viewMode[section] = this.viewMode[section] === 'table' ? 'chart' : 'table';
  }
}
