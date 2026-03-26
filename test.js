fetch('https://trawell-flights-api-675187781044.asia-south1.run.app/api/flights/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ origin: 'DEL', destination: 'BOM', date: '2026-03-20', passengers: 1 })
}).then(res => res.text()).then(console.log).catch(console.error);
