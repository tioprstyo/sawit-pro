import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Vehicle, Driver } from '../../types';
import { VehicleType, VehicleStatus } from '../../types';
import { Modal, FormField } from '../molecules';
import { Input } from '../atoms';
import { api } from '../../api';
import { addVehicle, updateVehicle } from '../../store/vehicleSlice';
import styles from './VehicleForm.module.css';

interface VehicleFormProps {
  vehicle: Vehicle | null;
  drivers: Driver[];
  onClose: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, drivers, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    type: vehicle?.type || VehicleType.TRUCK,
    capacity: vehicle?.capacity || 12,
    driverId: vehicle?.driverId || '',
    status: vehicle?.status || VehicleStatus.ACTIVE,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'Plate number is required';
    }
    if (!formData.driverId) {
      newErrors.driverId = 'Driver is required';
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (vehicle) {
        const updated = await api.vehicles.update(vehicle.id, formData);
        if (updated) {
          dispatch(updateVehicle(updated));
        }
      } else {
        const newVehicle = await api.vehicles.create(formData as any);
        dispatch(addVehicle(newVehicle));
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      title={vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText={vehicle ? 'Update' : 'Create'}
      isLoading={loading}
    >
      <div className={styles.form}>
        <FormField label="Plate Number" error={errors.plateNumber}>
          <Input
            type="text"
            placeholder="e.g., B-1234-ABC"
            value={formData.plateNumber}
            onChange={e => setFormData({ ...formData, plateNumber: e.target.value })}
          />
        </FormField>

        <FormField label="Type">
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as VehicleType })}
            className={styles.select}
          >
            <option value={VehicleType.TRUCK}>Truck</option>
            <option value={VehicleType.TANKER}>Tanker</option>
            <option value={VehicleType.FLATBED}>Flatbed</option>
          </select>
        </FormField>

        <FormField label="Capacity (tons)" error={errors.capacity}>
          <Input
            type="number"
            min="1"
            value={formData.capacity}
            onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
          />
        </FormField>

        <FormField label="Driver" error={errors.driverId}>
          <select
            value={formData.driverId}
            onChange={e => setFormData({ ...formData, driverId: e.target.value })}
            className={styles.select}
          >
            <option value="">Select a driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status">
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
            className={styles.select}
          >
            <option value={VehicleStatus.ACTIVE}>Active</option>
            <option value={VehicleStatus.INACTIVE}>Inactive</option>
            <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
            <option value={VehicleStatus.IN_USE}>In Use</option>
          </select>
        </FormField>
      </div>
    </Modal>
  );
};

export default VehicleForm;
