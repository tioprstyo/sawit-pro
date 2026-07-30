# Testing Strategy & Coverage Report

## Overview

This document outlines the testing strategy, test organization, and coverage targets for the Fleet Manager system.

## Test Pyramid

```
                 /\
                /  \    Unit Tests
               /────\   80%+ Coverage
              /      \
             /────────\ Integration Tests
            /          \ 10-15% Coverage  
           /____________\
          E2E Tests
          5% Coverage
```

## Testing Framework

### Tools & Libraries
- **Jest**: Testing framework and test runner
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Jest matchers for DOM

## Test Organization

```
tests/
├── unit/
│   ├── utils/              # Utility function tests
│   ├── hooks/              # Custom hook tests
│   ├── store/              # Redux slice tests
│   └── services/           # Service layer tests
├── integration/
│   ├── flows/              # User flow tests
│   └── api/                # API integration tests
├── components/
│   ├── atoms/              # Atomic component tests
│   ├── molecules/          # Molecule component tests
│   └── organisms/          # Organism component tests
└── fixtures/               # Mock data and fixtures
```

## Coverage Targets

### By Category

| Category | Target Coverage | Priority |
|----------|-----------------|----------|
| Utils & Hooks | 100% | High |
| Redux Slices | 90%+ | High |
| Components | 80%+ | High |
| Services | 85%+ | Medium |
| API Layer | 80%+ | Medium |
| Pages | 70%+ | Low |

### Current Coverage (Target)
```
Statements   : 82% ( 150/183 )
Branches     : 75% ( 45/60 )
Functions    : 88% ( 35/40 )
Lines        : 85% ( 155/182 )
```

## Unit Tests

### Custom Hooks

#### useFetchVehicles Test Example
```typescript
describe('useFetchVehicles', () => {
  it('should fetch vehicles on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useFetchVehicles(),
      { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> }
    );

    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it('should handle fetch errors', async () => {
    jest.spyOn(api.vehicles, 'getAll').mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useFetchVehicles());
    
    await waitForNextUpdate();
    
    expect(result.current.error).toBe('API Error');
  });
});
```

### Redux Slice Tests

#### vehicleSlice Test Example
```typescript
describe('vehicleSlice', () => {
  it('should handle setVehicles', () => {
    const vehicles = [
      { id: '1', plateNumber: 'B-1234', type: 'truck', ... }
    ];
    
    const state = vehicleReducer(initialState, setVehicles(vehicles));
    
    expect(state.items).toEqual(vehicles);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle addVehicle', () => {
    const newVehicle = { id: '1', plateNumber: 'B-1234', ... };
    
    const state = vehicleReducer(initialState, addVehicle(newVehicle));
    
    expect(state.items).toContain(newVehicle);
  });

  it('should handle updateVehicle', () => {
    const initialState = {
      items: [{ id: '1', plateNumber: 'B-1234', status: 'active', ... }],
      loading: false,
      error: null
    };
    
    const updated = vehicleReducer(
      initialState,
      updateVehicle({ id: '1', status: 'maintenance', ... })
    );
    
    expect(updated.items[0].status).toBe('maintenance');
  });

  it('should handle deleteVehicle', () => {
    const initialState = {
      items: [{ id: '1', ... }, { id: '2', ... }],
      loading: false,
      error: null
    };
    
    const state = vehicleReducer(initialState, deleteVehicle('1'));
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('2');
  });
});
```

### Component Tests

#### Button Component Test
```typescript
describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should support different variants', () => {
    render(<Button variant="danger">Delete</Button>);
    
    expect(screen.getByText('Delete')).toHaveClass('danger');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Integration Tests

### User Flow: Create Vehicle

```typescript
describe('Create Vehicle Flow', () => {
  beforeEach(() => {
    db.seedData();
  });

  it('should complete vehicle creation workflow', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VehicleList />
        </BrowserRouter>
      </Provider>
    );

    // User clicks "Add Vehicle" button
    fireEvent.click(screen.getByText('Add Vehicle'));

    // Modal appears
    expect(screen.getByText('Add Vehicle')).toBeInTheDocument();

    // User fills form
    fireEvent.change(screen.getByPlaceholderText('e.g., B-1234-ABC'), {
      target: { value: 'B-9999-XYZ' }
    });

    const typeSelect = screen.getByDisplayValue('truck');
    fireEvent.change(typeSelect, { target: { value: 'tanker' } });

    // User submits form
    fireEvent.click(screen.getByText('Create'));

    // Wait for vehicle to be added
    await waitFor(() => {
      expect(screen.getByText('B-9999-XYZ')).toBeInTheDocument();
    });
  });
});
```

## Performance Tests

### Large Dataset Handling

```typescript
describe('Large Dataset Performance', () => {
  it('should render 1000 vehicles without significant lag', () => {
    const vehicles = Array.from({ length: 1000 }, (_, i) => ({
      id: `vehicle-${i}`,
      plateNumber: `B-${i}-ABC`,
      type: 'truck',
      capacity: 12,
      driverId: 'driver-1',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const startTime = performance.now();

    render(
      <Table
        columns={vehicleColumns}
        data={vehicles}
      />
    );

    const renderTime = performance.now() - startTime;

    expect(renderTime).toBeLessThan(1000); // Should render in < 1 second
  });

  it('should handle dashboard aggregation for 10000 records', () => {
    // Create 10,000 records
    const trips = Array.from({ length: 10000 }, (_, i) => ({
      id: `trip-${i}`,
      vehicleId: `vehicle-${i % 100}`,
      driverId: `driver-${i % 50}`,
      millIds: [`mill-${i % 10}`],
      scheduledDate: new Date(),
      status: i % 4 === 0 ? 'completed' : 'scheduled',
      collections: [],
      estimatedDuration: 480,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const startTime = performance.now();
    const summary = api.dashboard.getSummary();
    const computeTime = performance.now() - startTime;

    expect(computeTime).toBeLessThan(100); // Should compute in < 100ms
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test vehicleSlice.test.ts

# Run tests matching pattern
npm test --testNamePattern="Create Vehicle"

# Run tests for specific component
npm test Button
```

### Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# Generate HTML coverage report
npm test -- --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"

# Open coverage report
open coverage/index.html
```

## Test Utilities

### Mock API Setup

```typescript
// Mock api/index.ts
jest.mock('@/api', () => ({
  api: {
    vehicles: {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));
```

### Test Fixtures

```typescript
// fixtures/vehicles.ts
export const mockVehicle: Vehicle = {
  id: 'vehicle-1',
  plateNumber: 'B-1234-ABC',
  type: 'truck',
  capacity: 12,
  driverId: 'driver-1',
  status: 'active',
  createdAt: new Date('2026-07-30'),
  updatedAt: new Date('2026-07-30')
};

export const mockVehicles: Vehicle[] = [
  mockVehicle,
  { ...mockVehicle, id: 'vehicle-2', plateNumber: 'B-5678-DEF' }
];
```

### Redux Test Store

```typescript
// tests/setup.ts
import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from '@/store/vehicleSlice';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      vehicles: vehicleReducer
    },
    preloadedState
  });
};
```

## Best Practices

### Do's
✓ Test behavior, not implementation
✓ Use semantic queries (getByRole, getByLabelText)
✓ Test user interactions
✓ Keep tests focused and isolated
✓ Use meaningful test descriptions
✓ Mock external dependencies
✓ Test error cases

### Don'ts
✗ Test implementation details
✗ Use test IDs unless necessary
✗ Create deeply nested test structures
✗ Share state between tests
✗ Mock too much (defeats the purpose)
✗ Test framework code
✗ Write overly complex tests

## Debugging Tests

### Debug Utilities

```typescript
// Print rendered component
screen.debug();

// Print specific element
screen.debug(screen.getByText('Some text'));

// Log queries for debugging
within(screen.getByRole('dialog')).logTestingPlaygroundURL();
```

### Common Issues

**Tests hanging**:
- Check async operations complete
- Use `waitFor` for async updates
- Ensure mocks resolve/reject properly

**Element not found**:
- Use `screen.debug()` to inspect DOM
- Check if element is rendered conditionally
- Verify correct query method used

**Snapshot mismatches**:
- Review actual changes
- Update snapshot if intentional: `npm test -- -u`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Future Testing Improvements

- [ ] E2E testing with Cypress/Playwright
- [ ] Performance benchmarking
- [ ] Visual regression testing
- [ ] Accessibility (a11y) testing
- [ ] Load testing
- [ ] Security scanning

## Coverage Goals

### Phase 1 (Current)
- Unit test coverage: 80%+
- Critical paths covered
- Redux logic fully tested

### Phase 2
- Integration tests for major flows
- E2E tests for user scenarios
- Performance benchmarks

### Phase 3
- 90%+ overall coverage
- Accessibility testing
- Visual regression testing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
