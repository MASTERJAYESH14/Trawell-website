import { Flight } from '../types';

export const searchFlights = async (from: string, to: string, date: string, passengers: number): Promise<Flight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock data based on inputs
  // In a real app, we would filter based on 'from', 'to', 'date'
  const mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'Indigo',
      flightNumber: '6E-204',
      departure: {
        code: from || 'DEL',
        city: 'Departure City',
        time: '06:00 AM',
        terminal: 'T3'
      },
      arrival: {
        code: to || 'BOM',
        city: 'Arrival City',
        time: '08:15 AM',
        terminal: 'T1'
      },
      duration: '2h 15m',
      price: 4500 * passengers,
      currency: 'INR',
      stops: 0
    },
    {
      id: '2',
      airline: 'Air India',
      flightNumber: 'AI-809',
      departure: {
        code: from || 'DEL',
        city: 'Departure City',
        time: '10:30 AM',
        terminal: 'T3'
      },
      arrival: {
        code: to || 'BOM',
        city: 'Arrival City',
        time: '01:00 PM',
        terminal: 'T2'
      },
      duration: '2h 30m',
      price: 5200 * passengers,
      currency: 'INR',
      stops: 0
    },
    {
      id: '3',
      airline: 'Vistara',
      flightNumber: 'UK-955',
      departure: {
        code: from || 'DEL',
        city: 'Departure City',
        time: '04:45 PM',
        terminal: 'T3'
      },
      arrival: {
        code: to || 'BOM',
        city: 'Arrival City',
        time: '07:10 PM',
        terminal: 'T2'
      },
      duration: '2h 25m',
      price: 6100 * passengers,
      currency: 'INR',
      stops: 0
    },
    {
       id: '4',
       airline: 'SpiceJet',
       flightNumber: 'SG-442',
       departure: {
         code: from || 'DEL',
         city: 'Departure City',
         time: '09:00 PM',
         terminal: 'T1'
       },
       arrival: {
         code: to || 'BOM',
         city: 'Arrival City',
         time: '11:20 PM',
         terminal: 'T1'
       },
       duration: '2h 20m',
       price: 3900 * passengers,
       currency: 'INR',
       stops: 0
    }
  ];

  return mockFlights;
};