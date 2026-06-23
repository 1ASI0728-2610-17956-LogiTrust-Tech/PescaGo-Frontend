import { TestBed } from '@angular/core/testing';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FleetV2Service } from './fleet-v2.service';
import { environment } from '../../../enviroments/enviroment';
import { VehicleAvailabilityStatus } from '../../shared/models/fleet/vehicle-availability-status.enum';
import { VehicleType } from '../../shared/models/fleet/vehicle-type.enum';
import { VehiclePayload } from '../../shared/models/fleet/vehicle-payload.model';

describe('FleetV2Service', () => {
    let service: FleetV2Service;
    let httpMock: HttpTestingController;

    const payload: VehiclePayload = {
        plate: 'ABC-123',
        vehicleType: VehicleType.TRUCK,
        maxWeightKg: 1500,
        maxVolumeM3: 12,
        refrigerated: false,
        availabilityStatus: VehicleAvailabilityStatus.AVAILABLE
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FleetV2Service,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(FleetV2Service);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should GET active vehicles using base fleet URL', () => {
        service.listVehicles(false).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should GET vehicles with includeInactive=true', () => {
        service.listVehicles(true).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles?includeInactive=true`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should POST register payload without carrierId', () => {
        service.registerVehicle(payload).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        expect(request.request.body).not.toEqual(jasmine.objectContaining({ carrierId: jasmine.anything() }));
        request.flush({ id: 1, ...payload, active: true });
    });

    it('should PUT update payload to vehicle endpoint', () => {
        service.updateVehicle(7, payload).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/7`);
        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(payload);
        request.flush({ id: 7, ...payload, active: true });
    });

    it('should PATCH activate endpoint', () => {
        service.activateVehicle(9).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/9/activate`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ id: 9, ...payload, active: true });
    });

    it('should PATCH deactivate endpoint', () => {
        service.deactivateVehicle(11).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/11/deactivate`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ id: 11, ...payload, active: false });
    });
});
