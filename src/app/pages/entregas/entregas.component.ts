import { Component, OnInit } from '@angular/core';
import { DeliveryService, Entrega } from 'src/app/services/delivery.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css'],
})

export class EntregasComponent implements OnInit {
  entregas: Entrega[] = [];
  displayedColumns: string[] = ['id', 'documento', 'motorista', 'cliente_origem', 'cliente_destino', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  motoristaControl = new FormControl('');
  statusControl = new FormControl('Todos');
  statusList: string[] = ['Todos', 'Pendente', 'Em trânsito', 'Entregue', 'Insucesso'];

  totalEntregas = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.carregarEntregas();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  carregarEntregas(): void {
    this.deliveryService.getEntregas().subscribe((data) => {
      this.entregas = data;
      this.totalEntregas = data.length;
      this.aplicarFiltros();
    });
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status?.toLowerCase().trim(); // Evita erro se for null/undefined
    switch (normalizedStatus) {
      case 'pendente':
        return 'status-pendente';
      case 'em trânsito':
        return 'status-transito';
      case 'entregue':
        return 'status-entregue';
      default:
        return 'status-insucesso';
    }
  }

  aplicarFiltros(): void {
    let filteredData = this.entregas;
    const motoristaFiltro = this.motoristaControl.value?.trim().toLowerCase() || '';
    const statusFiltro = this.statusControl.value?.trim().toUpperCase() || 'TODOS';

    if (motoristaFiltro) {
      filteredData = filteredData.filter(entrega =>
        entrega.motorista?.nome?.toLowerCase().includes(motoristaFiltro)
      );
    }

    if (statusFiltro !== 'TODOS') {
      filteredData = filteredData.filter(entrega =>
        entrega.status_entrega?.trim().toUpperCase() === statusFiltro
      );
    }

    this.dataSource.data = filteredData.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }


  atualizarLista(): void {
    this.pageIndex = 0;
    this.aplicarFiltros();
  }

  mudarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.aplicarFiltros();
  }
}
