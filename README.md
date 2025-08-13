# GreenCart Logistics – Delivery Simulation & KPI Dashboard
## Overview 
A full-stack tool for managers at the fictional eco-friendly delivery company GreenCart Logistics.

Simulates delivery operations.

Calculates KPIs (Profit, Efficiency, On-time vs Late Deliveries, Fuel Costs).

Supports CRUD for Drivers, Routes, and Orders.

Responsive, real-time dashboard for desktop & mobile.

## Tech Stack
Frontend: React (Hooks), Chart.js

Backend: Node.js, Express

Database: MongoDB (Cloud-hosted)

Authentication: JWT, bcrypt

## Deployment:
 Vercel/Netlify (frontend), Render/Railway (backend)

## Features
Dashboard: Profit, Efficiency Score, Charts for deliveries and fuel cost.

Simulation: Input drivers, start time, max hours → returns KPI results.

Management: CRUD for Drivers, Routes, Orders.

Authentication: Manager login with JWT & hashed passwords.

Persistence: Stores simulation results with timestamp.

## Setup
Backend:

- cd backend
- npm install
### create .env with PORT, MONGO_URI, JWT_SECRET
npm start
Frontend:

- cd frontend
- npm install
### create .env with REACT_APP_API_URL
- npm start

### Deployment
Frontend: [https://green-cart-logistics-delivery-simul.vercel.app/]

Backend: [ttps://greencart-logistics-delivery-simulation-pk8w.onrender.com]

Database: MongoDB Atlas

### APIEndpoints:
 /api/drivers, /api/routes, /api/orders, /api/simulation

### Example Simulation Request:

POST /api/simulation
{
  "availableDrivers": 5,
  "routeStartTime": "09:00",
  "maxHoursPerDriver": 8
}
- Response:

- "totalProfit": 12500,
- "efficiencyScore": 92,
- "onTimeDeliveries": 46,
- "lateDeliveries": 4,
- "fuelCost": 320

## Author
Suyash Gandhi
- Email : suyash25gandhi@gmail.com 
- LinkedIn : https://www.linkedin.com/in/suyash-gandhi-8899302a6/ 

