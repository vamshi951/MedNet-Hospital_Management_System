
# MedNet Hospital Management System

MedNet is a hospital management app for admins, doctors, nurses, and patients. It supports hospital operations like admitting patients, booking beds and ambulances, managing appointments, generating reports, and handling payments.

The frontend is now configured as an installable Progressive Web App (PWA), so after deployment it can be installed from the browser on Android, iOS, Windows, macOS, and Linux.

## To Run Locally

Clone the project

```bash
  git clone https://github.com/vamshi951/MedNet-Hospital_Management_System.git
```

Go to the project directory

```bash
  cd MedNet-Hospital_Management_System
```

Install backend dependencies

```bash
  cd Backend
  npm install
```

Create `Backend/.env` from `Backend/.env.example`, then start the backend

```bash
  npm run dev
```

Install frontend dependencies in another terminal

```bash
  cd FrontEnd
  npm install
```

Create `FrontEnd/.env` from `FrontEnd/.env.example`. For local development, use:

```bash
  REACT_APP_BASE_URL=http://localhost:8000
```

Start the frontend

```bash
  npm start
```

## Install As An App

To run MedNet on any system or mobile device, deploy both parts:

1. Deploy the backend API to a public Node.js host such as Render, Railway, Fly.io, or a VPS.
2. Use a public MongoDB Atlas database in `Backend/.env`.
3. Deploy the frontend build to Vercel, Netlify, Firebase Hosting, or any static hosting provider.
4. Set `REACT_APP_BASE_URL` on the frontend host to the public backend API URL.
5. Open the deployed frontend URL on a phone or desktop and choose "Install app" or "Add to Home Screen" from the browser menu.

## Tech Stack

**Client:** 

- **React**
- **Redux Thunk**
- **Axios**
- **Ant-Designs**

**Server:**

- **Node Js**
- **Mongo DB**
- **Express Js**
- **JWT**
- **Nodemailer**


## Features

- Admin controls
- Admitting Patients
- Booking beds and ambulance
- Creating appointments
- Generating reports 
- Overall control of hospital


## Screenshots

1.Dashboard

![31 01 2023_21 16 55_REC](https://user-images.githubusercontent.com/100460788/215808721-eb9f8778-53df-43fe-a1ab-662c0ff78c4f.png)

2.Profile

![31 01 2023_21 17 08_REC](https://user-images.githubusercontent.com/100460788/215808736-31e6dd9e-e5f3-4a48-9bbf-d505c27579c2.png)

3.Beds

![31 01 2023_21 17 21_REC](https://user-images.githubusercontent.com/100460788/215808740-af93a793-4a82-44c5-9eab-1bc11a6a6068.png)

4.Book appointment

![31 01 2023_21 17 43_REC](https://user-images.githubusercontent.com/100460788/215808744-417cbac9-eb6c-41d0-a4a9-414bb91cd03e.png)

5.Add profile

![31 01 2023_21 18 12_REC](https://user-images.githubusercontent.com/100460788/215808745-9813e61d-a13c-447f-b3c9-1f910ba8531f.png)

6.Add ambulance

![31 01 2023_21 18 30_REC](https://user-images.githubusercontent.com/100460788/215808748-9bb5d05d-afb1-41a3-9427-38089a28d0ed.png)

7.Login Page

![31 01 2023_21 15 44_REC](https://user-images.githubusercontent.com/100460788/215808752-4ebfb582-1db0-45e4-ac53-a87a5f1b75ea.png)


## Developed By

- [@Vamshi Pathlavath](https://github.com/vamshi951)

