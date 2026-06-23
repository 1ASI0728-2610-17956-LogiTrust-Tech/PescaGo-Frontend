import { VehicleAvailabilityStatus } from './vehicle-availability-status.enum';
import { VehicleType } from './vehicle-type.enum';

export interface VehicleResource {
    id: number;
    plate: string;
    vehicleType: VehicleType;
    maxWeightKg: number;
    maxVolumeM3?: number | null;
    refrigerated: boolean;
    availabilityStatus: VehicleAvailabilityStatus;
    active: boolean;
}
