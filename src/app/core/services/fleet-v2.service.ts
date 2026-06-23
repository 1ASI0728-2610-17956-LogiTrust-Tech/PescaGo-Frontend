import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { VehiclePayload } from '../../shared/models/fleet/vehicle-payload.model';
import { VehicleResource } from '../../shared/models/fleet/vehicle-resource.model';

@Injectable({
    providedIn: 'root'
})
export class FleetV2Service {

    private readonly baseUrl = `${environment.apiV2Url}/fleet/vehicles`;

    constructor(private http: HttpClient) {}

    listVehicles(includeInactive = false): Observable<VehicleResource[]> {
        const url = includeInactive
            ? `${this.baseUrl}?includeInactive=true`
            : this.baseUrl;
        return this.http.get<VehicleResource[]>(url);
    }

    registerVehicle(payload: VehiclePayload): Observable<VehicleResource> {
        return this.http.post<VehicleResource>(this.baseUrl, payload);
    }

    updateVehicle(id: number, payload: VehiclePayload): Observable<VehicleResource> {
        return this.http.put<VehicleResource>(`${this.baseUrl}/${id}`, payload);
    }

    activateVehicle(id: number): Observable<VehicleResource> {
        return this.http.patch<VehicleResource>(`${this.baseUrl}/${id}/activate`, {});
    }

    deactivateVehicle(id: number): Observable<VehicleResource> {
        return this.http.patch<VehicleResource>(`${this.baseUrl}/${id}/deactivate`, {});
    }
}
