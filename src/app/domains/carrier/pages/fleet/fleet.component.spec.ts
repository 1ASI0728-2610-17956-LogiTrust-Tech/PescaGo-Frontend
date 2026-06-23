import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FleetComponent } from './fleet.component';
import { FleetV2Service } from '../../../../core/services/fleet-v2.service';
import { environment } from '../../../../../enviroments/enviroment';
import { VehicleAvailabilityStatus } from '../../../../shared/models/fleet/vehicle-availability-status.enum';
import { VehicleType } from '../../../../shared/models/fleet/vehicle-type.enum';
import { VehicleResource } from '../../../../shared/models/fleet/vehicle-resource.model';

describe('FleetComponent', () => {
    let component: FleetComponent;
    let fixture: ComponentFixture<FleetComponent>;
    let httpMock: HttpTestingController;

    const activeVehicle: VehicleResource = {
        id: 1,
        plate: 'ABC-123',
        vehicleType: VehicleType.TRUCK,
        maxWeightKg: 1500,
        maxVolumeM3: 12,
        refrigerated: false,
        availabilityStatus: VehicleAvailabilityStatus.AVAILABLE,
        active: true
    };

    const inactiveVehicle: VehicleResource = {
        ...activeVehicle,
        id: 2,
        plate: 'XYZ-999',
        active: false
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FleetComponent],
            providers: [
                FleetV2Service,
                provideHttpClient(),
                provideHttpClientTesting(),
                provideNoopAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FleetComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function flushInitialActiveList(vehicles: VehicleResource[] = [activeVehicle]): void {
        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        request.flush(vehicles);
        fixture.detectChanges();
    }

    it('should load active vehicles on init', () => {
        fixture.detectChanges();

        expect(component.includeInactive).toBeFalse();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        expect(request.request.method).toBe('GET');
        request.flush([activeVehicle]);

        expect(component.vehicles).toEqual([activeVehicle]);
    });

    it('should reload vehicles with includeInactive=true when toggle changes', () => {
        fixture.detectChanges();
        flushInitialActiveList();

        component.onIncludeInactiveChange(true);

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles?includeInactive=true`);
        request.flush([activeVehicle, inactiveVehicle]);

        expect(component.includeInactive).toBeTrue();
        expect(component.vehicles.length).toBe(2);
    });

    it('should show empty state when there are no vehicles', () => {
        fixture.detectChanges();
        flushInitialActiveList([]);

        const emptyState = fixture.nativeElement.querySelector('.empty-state');
        expect(emptyState.textContent).toContain('No tienes vehículos registrados');
    });

    it('should refresh list after successful vehicle creation', () => {
        fixture.detectChanges();
        flushInitialActiveList([]);

        component.openCreateForm();
        component.vehicleForm.setValue({
            plate: 'NEW-001',
            vehicleType: VehicleType.VAN,
            maxWeightKg: 900,
            maxVolumeM3: '',
            refrigerated: true,
            availabilityStatus: VehicleAvailabilityStatus.AVAILABLE
        });
        component.submitForm();

        const postRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        expect(postRequest.request.method).toBe('POST');
        postRequest.flush({ ...activeVehicle, id: 3, plate: 'NEW-001', vehicleType: VehicleType.VAN });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...activeVehicle, id: 3, plate: 'NEW-001', vehicleType: VehicleType.VAN }]);

        expect(component.showForm).toBeFalse();
        expect(component.vehicles.length).toBe(1);
    });

    it('should refresh list after successful vehicle update with mutable PUT payload only', () => {
        fixture.detectChanges();
        flushInitialActiveList([activeVehicle]);

        const expectedPayload = {
            plate: 'ABC-456',
            vehicleType: VehicleType.TRUCK,
            maxWeightKg: 1600,
            maxVolumeM3: 15,
            refrigerated: true,
            availabilityStatus: VehicleAvailabilityStatus.UNAVAILABLE
        };

        component.openEditForm(activeVehicle);
        component.vehicleForm.setValue(expectedPayload);
        component.submitForm();

        const putRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/1`);
        expect(putRequest.request.method).toBe('PUT');
        expect(putRequest.request.body).toEqual(expectedPayload);
        expect(putRequest.request.body.id).toBeUndefined();
        expect(putRequest.request.body.active).toBeUndefined();
        expect(putRequest.request.body.carrierId).toBeUndefined();
        putRequest.flush({ ...activeVehicle, ...expectedPayload });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...activeVehicle, ...expectedPayload }]);

        expect(component.vehicles[0].plate).toBe('ABC-456');
    });

    it('should call deactivate endpoint for active vehicles', () => {
        fixture.detectChanges();
        flushInitialActiveList([activeVehicle]);

        component.deactivateVehicle(activeVehicle);

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/1/deactivate`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ ...activeVehicle, active: false });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...activeVehicle, active: false }]);
    });

    it('should ignore duplicate deactivate requests while PATCH is in progress', () => {
        const fleetV2Service = TestBed.inject(FleetV2Service);
        const deactivateSpy = spyOn(fleetV2Service, 'deactivateVehicle').and.callThrough();

        fixture.detectChanges();
        flushInitialActiveList([activeVehicle]);

        component.deactivateVehicle(activeVehicle);
        component.deactivateVehicle(activeVehicle);

        expect(deactivateSpy).toHaveBeenCalledTimes(1);
        expect(component.isPatchInProgress(activeVehicle.id)).toBeTrue();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/1/deactivate`);
        request.flush({ ...activeVehicle, active: false });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...activeVehicle, active: false }]);

        expect(component.isPatchInProgress(activeVehicle.id)).toBeFalse();
    });

    it('should call activate endpoint for inactive vehicles', () => {
        fixture.detectChanges();
        flushInitialActiveList([inactiveVehicle]);

        component.activateVehicle(inactiveVehicle);

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/2/activate`);
        expect(request.request.method).toBe('PATCH');
        request.flush({ ...inactiveVehicle, active: true });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...inactiveVehicle, active: true }]);
    });

    it('should ignore duplicate activate requests while PATCH is in progress', () => {
        const fleetV2Service = TestBed.inject(FleetV2Service);
        const activateSpy = spyOn(fleetV2Service, 'activateVehicle').and.callThrough();

        fixture.detectChanges();
        flushInitialActiveList([inactiveVehicle]);

        component.activateVehicle(inactiveVehicle);
        component.activateVehicle(inactiveVehicle);

        expect(activateSpy).toHaveBeenCalledTimes(1);
        expect(component.isPatchInProgress(inactiveVehicle.id)).toBeTrue();

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles/2/activate`);
        request.flush({ ...inactiveVehicle, active: true });

        const reloadRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        reloadRequest.flush([{ ...inactiveVehicle, active: true }]);

        expect(component.isPatchInProgress(inactiveVehicle.id)).toBeFalse();
    });

    it('should show duplicate plate message on 409', () => {
        fixture.detectChanges();
        flushInitialActiveList([]);

        component.openCreateForm();
        component.vehicleForm.setValue({
            plate: 'DUP-001',
            vehicleType: VehicleType.TRUCK,
            maxWeightKg: 1000,
            maxVolumeM3: '',
            refrigerated: false,
            availabilityStatus: VehicleAvailabilityStatus.AVAILABLE
        });
        component.submitForm();

        const postRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        postRequest.flush({}, { status: 409, statusText: 'Conflict' });

        expect(component.errorMessage).toBe('La placa ya está registrada.');
    });

    it('should not send request when form is invalid', () => {
        const registerSpy = spyOn(TestBed.inject(FleetV2Service), 'registerVehicle').and.callThrough();

        fixture.detectChanges();
        flushInitialActiveList([]);

        component.openCreateForm();
        component.vehicleForm.reset({
            plate: '',
            vehicleType: '',
            maxWeightKg: '',
            maxVolumeM3: '',
            refrigerated: false,
            availabilityStatus: ''
        });
        component.submitForm();

        expect(registerSpy).not.toHaveBeenCalled();
    });

    it('should not include carrierId in form controls or POST payload', () => {
        fixture.detectChanges();
        flushInitialActiveList([]);

        expect(Object.keys(component.vehicleForm.controls)).not.toContain('carrierId');

        component.openCreateForm();
        component.vehicleForm.setValue({
            plate: 'NO-CARRIER',
            vehicleType: VehicleType.PICKUP,
            maxWeightKg: 800,
            maxVolumeM3: 5,
            refrigerated: false,
            availabilityStatus: VehicleAvailabilityStatus.UNAVAILABLE
        });
        component.submitForm();

        const postRequest = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        expect(postRequest.request.body).toEqual({
            plate: 'NO-CARRIER',
            vehicleType: VehicleType.PICKUP,
            maxWeightKg: 800,
            maxVolumeM3: 5,
            refrigerated: false,
            availabilityStatus: VehicleAvailabilityStatus.UNAVAILABLE
        });
        expect(postRequest.request.body.carrierId).toBeUndefined();
        postRequest.flush({ ...activeVehicle, id: 4, plate: 'NO-CARRIER' });

        httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`).flush([]);
    });
});
