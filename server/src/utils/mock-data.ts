export const mockData = {
  drivers: [
    { id: "driver-1", name: "Tio 1", licenseNumber: "DL001", phoneNumber: "08219540831", status: "available" },
    { id: "driver-2", name: "Andi 2", licenseNumber: "DL002", phoneNumber: "08553035110", status: "available" },
    { id: "driver-3", name: "Agus 3", licenseNumber: "DL003", phoneNumber: "08797808098", status: "sick" },
    { id: "driver-4", name: "Hendra 4", licenseNumber: "DL004", phoneNumber: "08398362082", status: "on_trip" },
    { id: "driver-5", name: "Ahmad 5", licenseNumber: "DL005", phoneNumber: "08883543540", status: "sick" },
  ],
  vehicles: [
    { id: "vehicle-1", plateNumber: "BK-1000-AF", type: "trailer", capacity: 12, driverId: "driver-1", status: "maintenance" },
    { id: "vehicle-2", plateNumber: "BK-1001-BG", type: "truck", capacity: 12, driverId: "driver-2", status: "active" },
    { id: "vehicle-3", plateNumber: "BK-1002-CH", type: "truck", capacity: 12, driverId: "driver-3", status: "maintenance" },
  ],
  mills: [
    { id: "mill-1", name: "Mill A", latitude: -6.2088, longitude: 106.8456, address: "Jakarta" },
    { id: "mill-2", name: "Mill B", latitude: -6.3155, longitude: 106.8256, address: "Bekasi" },
  ],
  trips: [
    { id: "trip-1", vehicleId: "vehicle-1", startLocation: "Jakarta", endLocation: "Bandung", date: "2024-01-01", status: "completed" },
  ],
  tripMills: [
    { tripId: "trip-1", millId: "mill-1" },
  ],
};
