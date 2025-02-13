import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Entrega {
  id: string;
  documento: string;
  motorista: { nome: string };
  cliente_origem: { nome: string; bairro: string; endereco: string; cidade: string };
  cliente_destino: { nome: string; bairro: string; endereco: string; cidade: string };
  status_entrega: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private entregasUrl = 'http://localhost:3000/entregas';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Erro ao buscar dados. Tente novamente mais tarde.'));
  }

  getEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.entregasUrl).pipe(
      catchError(this.handleError) 
    );
  }

  getEntregasPorMotorista(nomeMotorista: string): Observable<Entrega[]> {
    return this.getEntregas().pipe(
      map((entregas) =>
        entregas.filter((entrega) => entrega.motorista.nome === nomeMotorista)
      ),
      catchError(this.handleError)
    );
  }

  getEntregasPorStatus(status: string): Observable<Entrega[]> {
    return this.getEntregas().pipe(
      map((entregas) =>
        entregas.filter((entrega) => entrega.status_entrega === status)
      ),
      catchError(this.handleError)
    );
  }

  getAndamentoPorMotorista(): Observable<{ nome: string; total: number; realizadas: number }[]> {
    return this.getEntregas().pipe(
      map((entregas) => {
        const motoristasMap = new Map<string, { total: number; realizadas: number }>();

        entregas.forEach((entrega) => {
          const motorista = entrega.motorista.nome;
          if (!motoristasMap.has(motorista)) {
            motoristasMap.set(motorista, { total: 0, realizadas: 0 });
          }
          const dadosMotorista = motoristasMap.get(motorista)!;
          dadosMotorista.total++;
          if (entrega.status_entrega === 'ENTREGUE') {
            dadosMotorista.realizadas++;
          }
        });

        return Array.from(motoristasMap.entries()).map(([nome, { total, realizadas }]) => ({
          nome,
          total,
          realizadas,
        }));
      }),
      catchError(this.handleError)
    );
  }

  getInsucessoPorMotorista(): Observable<{ nome: string; insucessos: number }[]> {
    return this.getEntregas().pipe(
      map((entregas) => {
        const motoristasMap = new Map<string, number>();

        entregas.forEach((entrega) => {
          if (entrega.status_entrega === 'INSUCESSO') {
            const motorista = entrega.motorista.nome;
            motoristasMap.set(motorista, (motoristasMap.get(motorista) || 0) + 1);
          }
        });

        return Array.from(motoristasMap.entries()).map(([nome, insucessos]) => ({
          nome,
          insucessos,
        }));
      }),
      catchError(this.handleError)
    );
  }

  getAndamentoPorBairro(): Observable<{ bairro: string; total: number; realizadas: number }[]> {
    return this.getEntregas().pipe(
      map((entregas) => {
        const bairrosMap = new Map<string, { total: number; realizadas: number }>();

        entregas.forEach((entrega) => {
          const bairro = entrega.cliente_destino.bairro;
          if (!bairrosMap.has(bairro)) {
            bairrosMap.set(bairro, { total: 0, realizadas: 0 });
          }
          const dadosBairro = bairrosMap.get(bairro)!;
          dadosBairro.total++;
          if (entrega.status_entrega === 'ENTREGUE') {
            dadosBairro.realizadas++;
          }
        });

        return Array.from(bairrosMap.entries()).map(([bairro, { total, realizadas }]) => ({
          bairro,
          total,
          realizadas,
        }));
      }),
      catchError(this.handleError)
    );
  }
}
