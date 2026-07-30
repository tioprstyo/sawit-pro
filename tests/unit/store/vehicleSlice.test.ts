import vehicleReducer, {
  setVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  setLoading,
  setError,
} from '../../../src/store/vehicleSlice';
import { mockVehicle, mockVehicles } from '../../fixtures/mockData';

describe('vehicleSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  describe('setVehicles', () => {
    it('should set vehicles and clear loading state', () => {
      const state = vehicleReducer(initialState, setVehicles(mockVehicles));

      expect(state.items).toEqual(mockVehicles);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should replace existing vehicles', () => {
      const existingState = {
        items: [mockVehicle],
        loading: false,
        error: null,
      };

      const state = vehicleReducer(existingState, setVehicles(mockVehicles));

      expect(state.items).toHaveLength(2);
      expect(state.items).toEqual(mockVehicles);
    });
  });

  describe('addVehicle', () => {
    it('should add a vehicle to the list', () => {
      const state = vehicleReducer(initialState, addVehicle(mockVehicle));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockVehicle);
    });

    it('should add multiple vehicles', () => {
      let state = vehicleReducer(initialState, addVehicle(mockVehicles[0]));
      state = vehicleReducer(state, addVehicle(mockVehicles[1]));

      expect(state.items).toHaveLength(2);
    });
  });

  describe('updateVehicle', () => {
    it('should update an existing vehicle', () => {
      const existingState = {
        items: [mockVehicle],
        loading: false,
        error: null,
      };

      const updated = {
        ...mockVehicle,
        status: 'maintenance' as const,
      };

      const state = vehicleReducer(existingState, updateVehicle(updated));

      expect(state.items[0].status).toBe('maintenance');
    });

    it('should not modify state if vehicle not found', () => {
      const existingState = {
        items: [mockVehicle],
        loading: false,
        error: null,
      };

      const updated = {
        ...mockVehicle,
        id: 'non-existent',
        status: 'maintenance' as const,
      };

      const state = vehicleReducer(existingState, updateVehicle(updated));

      expect(state.items).toEqual(existingState.items);
    });
  });

  describe('deleteVehicle', () => {
    it('should remove a vehicle from the list', () => {
      const existingState = {
        items: mockVehicles,
        loading: false,
        error: null,
      };

      const state = vehicleReducer(existingState, deleteVehicle('vehicle-1'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('vehicle-2');
    });

    it('should handle deleting non-existent vehicle', () => {
      const existingState = {
        items: mockVehicles,
        loading: false,
        error: null,
      };

      const state = vehicleReducer(existingState, deleteVehicle('non-existent'));

      expect(state.items).toEqual(existingState.items);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const state = vehicleReducer(initialState, setLoading(true));
      expect(state.loading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to fetch vehicles';
      const state = vehicleReducer(initialState, setError(errorMessage));

      expect(state.error).toBe(errorMessage);
    });

    it('should clear error with null', () => {
      const errorState = { ...initialState, error: 'Some error' };
      const state = vehicleReducer(errorState, setError(null));

      expect(state.error).toBe(null);
    });
  });
});
