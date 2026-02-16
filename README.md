<div align="center">

  <img src="public/logo.png" alt="NyayaSahayak Logo" width="100" />

  # NyayaSahayak (न्यायसहायक)
  
  **Simplifying Justice. Empowering Citizens.**
  
  <p>
    A Next-Gen Legal Tech Platform bridging the gap between Citizens, Legal Professionals, and Law Enforcement via AI & Real-time Data.
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-security">Security</a>
  </p>

  [![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**NyayaSahayak** is a comprehensive judicial aid platform designed to democratize access to justice in India. It replaces opaque, paper-heavy legal processes with a unified digital ecosystem.

Whether you are a **Citizen** filing an e-FIR, a **Lawyer** managing your docket, or a **Police Officer** tracking crime hotspots, NyayaSahayak provides a role-specific, secure, and AI-enhanced interface.

---

## 🚀 Key Features

### 🏛️ For Citizens
* **AI Legal Assistant:** An intelligent chatbot to draft legal documents (Affidavits, Rent Agreements) and answer legal queries in vernacular languages.
* **Digital Complaint Filing:** File FIRs and complaints online without visiting the station.
* **Safety Map & SOS:** Real-time integration with Leaflet Maps to view Safe Zones, Police Stations, and trigger SOS alerts.
* **Find a Lawyer:** Search and hire verified legal professionals based on expertise and location.

### ⚖️ For Lawyers
* **Digital Docket:** Manage case files, hearings, and client details in a centralized dashboard.
* **Smart Scheduling:** Manage court dates and client appointments with integrated calendar tools.
* **Client Requests:** Accept or reject case representations directly through the portal.

### 👮 For Police
* **Crime Heatmaps:** Visualize high-risk zones using geospatial data to optimize patrolling.
* **FIR Management:** Review, approve, or investigate incoming digital complaints.
* **Dispatch Logs:** Real-time tracking of patrol units and emergency responses.

---

## 💻 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Framer Motion (Animations) |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Backend / BaaS** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Maps / GIS** | Leaflet.js, OpenStreetMap API, Nominatim |
| **State Management** | React Context API |
| **Security** | Row Level Security (RLS), Bcrypt Hashing |

---

## 🏗 Architecture

NyayaSahayak utilizes a **Client-Serverless** architecture powered by Supabase.

*(Add your Architecture Diagram image here, e.g., `![Architecture](assets/architecture.png)`)*

1.  **Client:** React SPA handling distinct role-based routing (`/citizen`, `/lawyer`, `/police`).
2.  **Auth Layer:** Supabase GoTrue for secure JWT-based authentication.
3.  **Database:** PostgreSQL with granular RLS policies ensuring data privacy.
4.  **AI Layer:** Integration with LLMs for legal drafting and summarization.

---

## 📸 Screenshots

| Landing Page | Safety Map |
| :---: | :---: |
| *(Place Landing Page Screenshot Here)* | *(Place Map Screenshot Here)* |

| Lawyer Dashboard | AI Chatbot |
| :---: | :---: |
| *(Place Dashboard Screenshot Here)* | *(Place Chatbot Screenshot Here)* |

---

## 🛠 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn
* A Supabase project (for backend)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/nyaya-sahayak.git](https://github.com/your-username/nyaya-sahayak.git)
    cd nyaya-sahayak
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

---

## 🔒 Security & Database

We take data privacy seriously. This project implements **Row Level Security (RLS)** on PostgreSQL.

* **Users Table:** Standard Supabase Auth.
* **Lawyers Table:** Public Read access; Update access restricted to the profile owner (`auth.uid() = id`).
* **Cases/Schedules:** Strictly private. A case is only visible to the assigned **Lawyer** and the **Client**.
* **Encryption:** All sensitive passwords are hashed using **Bcrypt** (via `pgcrypto`).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

