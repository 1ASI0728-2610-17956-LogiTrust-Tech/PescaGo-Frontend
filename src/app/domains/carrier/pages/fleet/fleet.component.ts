import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import { FleetV2Service } from '../../../../core/services/fleet-v2.service';
import { VehicleResource } from '../../../../shared/models/fleet/vehicle-resource.model';
import { VehiclePayload } from '../../../../shared/models/fleet/vehicle-payload.model';
import { VehicleType } from '../../../../shared/models/fleet/vehicle-type.enum';
import { VehicleAvailabilityStatus } from '../../../../shared/models/fleet/vehicle-availability-status.enum';

@Component({
    selector: 'app-fleet',
    imports: [
        NgIf,
        NgFor,
        ReactiveFormsModule,
        MatButton,
        MatCheckbox,
        MatFormField,
        MatInput,
        MatLabel,
        MatSelect,
        MatOption,
        MatSlideToggle,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef
    ],
    templateUrl: './fleet.component.html',
    standalone: true,
    styleUrl: './fleet.component.css'
})
export class FleetComponent implements OnInit {
    readonly vehicleTypes = Object.values(VehicleType);
    readonly availabilityStatuses = Object.values(VehicleAvailabilityStatus);
    readonly displayedColumns = [
        'plate',
        'vehicleType',
        'maxWeightKg',
        'maxVolumeM3',
        'refrigerated',
        'availabilityStatus',
        'active',
        'actions'
    ];

    vehicles: VehicleResource[] = [];
    includeInactive = false;
    showForm = false;
    editingVehicleId: number | null = null;
    isSubmitting = false;
    isLoading = false;
    patchInProgressVehicleId: number | null = null;
    errorMessage: string | null = null;
    vehicleForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private fleetV2Service: FleetV2Service
    ) {
        this.vehicleForm = this.createVehicleForm();
    }

    ngOnInit(): void {
        this.loadVehicles();
    }

    loadVehicles(): void {
        this.isLoading = true;
        this.errorMessage = null;

        this.fleetV2Service.listVehicles(this.includeInactive).subscribe({
            next: (vehicles) => {
                this.vehicles = vehicles;
                this.isLoading = false;
            },
            error: (error: unknown) => {
                this.isLoading = false;
                this.errorMessage = this.mapFleetError(error);
            }
        });
    }

    onIncludeInactiveChange(includeInactive: boolean): void {
        this.includeInactive = includeInactive;
        this.loadVehicles();
    }

    openCreateForm(): void {
        this.editingVehicleId = null;
        this.showForm = true;
        this.errorMessage = null;
        this.vehicleForm.reset({
            plate: '',
            vehicleType: '',
            maxWeightKg: '',
            maxVolumeM3: '',
            refrigerated: false,
            availabilityStatus: VehicleAvailabilityStatus.AVAILABLE
        });
    }

    openEditForm(vehicle: VehicleResource): void {
        this.editingVehicleId = vehicle.id;
        this.showForm = true;
        this.errorMessage = null;
        this.vehicleForm.reset({
            plate: vehicle.plate,
            vehicleType: vehicle.vehicleType,
            maxWeightKg: vehicle.maxWeightKg,
            maxVolumeM3: vehicle.maxVolumeM3 ?? '',
            refrigerated: vehicle.refrigerated,
            availabilityStatus: vehicle.availabilityStatus
        });
    }

    cancelForm(): void {
        this.showForm = false;
        this.editingVehicleId = null;
        this.vehicleForm.reset();
    }

    submitForm(): void {
        if (this.vehicleForm.invalid || this.isSubmitting) {
            this.vehicleForm.markAllAsTouched();
            return;
        }

        const payload = this.buildPayload();
        this.isSubmitting = true;
        this.errorMessage = null;

        const request$ = this.editingVehicleId === null
            ? this.fleetV2Service.registerVehicle(payload)
            : this.fleetV2Service.updateVehicle(this.editingVehicleId, payload);

        request$.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.cancelForm();
                this.loadVehicles();
            },
            error: (error: unknown) => {
                this.isSubmitting = false;
                this.errorMessage = this.mapFleetError(error);
            }
        });
    }

    formatAvailability(value: VehicleAvailabilityStatus): string {
        return value === VehicleAvailabilityStatus.AVAILABLE ? 'Disponible' : 'No disponible';
    }

    isPatchInProgress(vehicleId: number): boolean {
        return this.patchInProgressVehicleId === vehicleId;
    }

    activateVehicle(vehicle: VehicleResource): void {
        if (this.patchInProgressVehicleId !== null) {
            return;
        }

        this.patchInProgressVehicleId = vehicle.id;
        this.errorMessage = null;
        this.fleetV2Service.activateVehicle(vehicle.id).subscribe({
            next: () => {
                this.patchInProgressVehicleId = null;
                this.loadVehicles();
            },
            error: (error: unknown) => {
                this.patchInProgressVehicleId = null;
                this.errorMessage = this.mapFleetError(error);
            }
        });
    }

    deactivateVehicle(vehicle: VehicleResource): void {
        if (this.patchInProgressVehicleId !== null) {
            return;
        }

        this.patchInProgressVehicleId = vehicle.id;
        this.errorMessage = null;
        this.fleetV2Service.deactivateVehicle(vehicle.id).subscribe({
            next: () => {
                this.patchInProgressVehicleId = null;
                this.loadVehicles();
            },
            error: (error: unknown) => {
                this.patchInProgressVehicleId = null;
                this.errorMessage = this.mapFleetError(error);
            }
        });
    }

    formatVehicleType(value: VehicleType): string {
        const labels: Record<VehicleType, string> = {
            [VehicleType.TRUCK]: 'Camión',
            [VehicleType.VAN]: 'Furgoneta',
            [VehicleType.PICKUP]: 'Pickup',
            [VehicleType.OTHER]: 'Otro'
        };
        return labels[value] ?? value;
    }

    private createVehicleForm(): FormGroup {
        return this.fb.group({
            plate: ['', Validators.required],
            vehicleType: ['', Validators.required],
            maxWeightKg: ['', [Validators.required, Validators.min(0.01)]],
            maxVolumeM3: ['', this.optionalPositiveVolumeValidator],
            refrigerated: [false, Validators.required],
            availabilityStatus: [VehicleAvailabilityStatus.AVAILABLE, Validators.required]
        });
    }

    private optionalPositiveVolumeValidator(control: AbstractControl) {
        const value = control.value;
        if (value === null || value === '' || value === undefined) {
            return null;
        }

        return Number(value) > 0 ? null : { positiveVolume: true };
    }

    private buildPayload(): VehiclePayload {
        const raw = this.vehicleForm.getRawValue();
        const maxVolume = raw.maxVolumeM3 === '' || raw.maxVolumeM3 === null || raw.maxVolumeM3 === undefined
            ? null
            : Number(raw.maxVolumeM3);

        return {
            plate: String(raw.plate).trim(),
            vehicleType: raw.vehicleType,
            maxWeightKg: Number(raw.maxWeightKg),
            maxVolumeM3: maxVolume,
            refrigerated: Boolean(raw.refrigerated),
            availabilityStatus: raw.availabilityStatus
        };
    }

    private mapFleetError(error: unknown): string {
        if (!(error instanceof HttpErrorResponse)) {
            return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }

        switch (error.status) {
            case 400:
                return 'Revisa los datos ingresados.';
            case 401:
                return 'La sesión expiró. Inicia sesión nuevamente.';
            case 403:
                return 'No tienes permiso para gestionar esta flota.';
            case 404:
                return 'No se encontró el vehículo o tu perfil Carrier.';
            case 409:
                return 'La placa ya está registrada.';
            default:
                return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
    }
}
