import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, switchMap } from 'rxjs';
import {environment} from "../../../enviroments/enviroment";
import {User, UserCreate} from "../../shared/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // Método para validar Usuario

    authenticateUser(email: string, password: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/authentication`, {
            params: { email, password }
        });
    }

    // Método para Registrar Usuario y Carrier o Entrepreneur

    registerCarrier(user: UserCreate, carrier: any): Observable<any> {
        // Primero crea el usuario, luego el carrier
        return this.http.post(`${this.apiUrl}/users`, user).pipe(
            switchMap((createdUser: any) => {
                carrier.userId = createdUser.id; // Relaciona el carrier con el usuario creado
                return this.http.post(`${this.apiUrl}/carriers`, carrier);
            })
        );
    }

    registerEntrepreneur(user: UserCreate, entrepreneur: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, user).pipe(
            switchMap((createdUser: any) => {
                entrepreneur.userId = createdUser.id;
                return this.http.post(`${this.apiUrl}/entreprenuers`, entrepreneur); // Cambiar aquí
            })
        );
    }

    // Método para Recuperar Carrier o Entrepreneur por UserID

    getCarrierById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/carriers/${id}`).pipe(
            map((carrier) => {
                if (carrier) {
                    return carrier; // Devuelve el carrier encontrado
                } else {
                    throw new Error('No se encontró un carrier con este ID.');
                }
            })
        );
    }

    getEntrepreneurById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/entreprenuers/${id}`).pipe(
            map((entrepreneur) => {
                if (entrepreneur) {
                    return entrepreneur; // Devuelve el entrepreneur encontrado
                } else {
                    throw new Error('No se encontró un entrepreneur con este ID.');
                }
            })
        );
    }

    // Metodo para obtener todos los carriers disponibles

    getProcessedCarriers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/carriers`).pipe(
            map((carriers) =>
                carriers.map((carrier) => ({
                    ...carrier,
                    districts: [], // Agregar distritos vacíos
                    selected: false, // Agregar propiedad selected
                }))
            )
        );
    }

    // Crea solicutud de servicio

    createRequest(request: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/requests`, request);
    }

    // Recuper solicutud de servicio por Entrepreneur o Carrier ID

    getRequestsByEntrepreneurId(entrepreneurId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/requests/entrepreneur/${entrepreneurId}`);
    }

    getRequestsByCarrierId(carrierId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/requests/carrier/${carrierId}`);
    }

    // Recuper / editar solicutud de servicio por Request ID

    getRequestById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/requests/${id}`).pipe(
            map((request) => {
                if (request) {
                    return request; // Devuelve la solicitud encontrada
                } else {
                    throw new Error('No se encontró una solicitud con este ID.');
                }
            })
        );
    }

    editRequestById(id: number, updatedRequest: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/requests/${id}`, updatedRequest);
    }

    // Crear Recibo de pago

    createReceipt(receipt: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/receipts`, receipt);
    }

    // HiredServices

    createHiredService(hiredService: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/hired-services`, hiredService);
    }

    editServiceById(id: number, updatedService: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/hired-services/${id}`, updatedService);
    }

    getHiredServicesByEntrepreneurId(entrepreneurId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/hired-services/entrepreneur/${entrepreneurId}`);
    }

    getHiredServicesByCarrierId(carrierId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/hired-services/carrier/${carrierId}`);
    }

}
