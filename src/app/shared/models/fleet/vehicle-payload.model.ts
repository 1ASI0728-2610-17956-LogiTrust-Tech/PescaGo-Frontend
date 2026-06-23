import { VehicleAvailabilityStatus } from './vehicle-availability-status.enum';
import { VehicleType } from './vehicle-type.enum';

export interface VehiclePayload {
    plate: string;
    vehicleType: VehicleType;
    maxWeightKg: number;
    maxVolumeM3?: number | null;
    refrigerated: boolean;
    availabilityStatus: VehicleAvailabilityStatus;
}
