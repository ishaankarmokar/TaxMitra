# TaxMitra: A Comprehensive Tax Management Platform

TaxMitra is a robust, full-stack web application built to simplify and automate the Indian tax filing process for both taxpayers and consultants. It supports income tax and GST filing, connects users with consultants, and offers dashboards with real-time notifications.

> **Visuals and screenshots are included in the attached project report: [`DBMS_TaxMitra_Report.pdf`](./DBMS_TaxMitra_Report.pdf)**

---


## Project Structure

```plaintext
TaxMitra/
├── consultant_hub.html        # Consultant dashboard
├── dashboard.html             # Main user dashboard
├── gst_management.html        # GST management interface
├── index.html                 # Homepage
├── login.html                 # Login interface
├── register.html              # Registration form
├── tax_filing.html            # Tax filing workflow
├── seed-tax-slabs.js          # Tax slab seeding script
├── server.js                  # Node.js Express backend
├── taxmitra_schema.sql        # MySQL database schema
├── package.json               # Project dependencies
├── package-lock.json          # Dependency lock file
├── DBMS_TaxMitra_Report.pdf   # Detailed technical report
├── drawSQL-image-export-4.png # ERD / Schema visual
└── node_modules/              # Node dependencies
```
---

## Features

### For Taxpayers
- Register & login securely
- Add income sources and deductions
- Auto-calculate tax based on latest slabs
- Register for GST and file GST returns
- Download tax reports
- View a personal dashboard with reminders

### For Consultants
- Register & login securely
- Manage assigned taxpayers
- Assist in tax/GST filing and invoice generation
- Communicate with clients through platform

### For Admins
- Manage users and tax slabs
- Generate system-wide reports
- Audit and monitor system performance

---


## Architecture Overview

TaxMitra is built using a **three-tier architecture**:

- **Presentation Layer**: HTML, CSS, JavaScript interfaces for all user roles
- **Application Layer**: Node.js (Express) backend with JWT-based authentication and REST APIs
- **Data Layer**: MySQL database for persistent, structured storage

> 📎 ER diagram and schema are included as `drawSQL-image-export-4.png` and `taxmitra_schema.sql`

---


## Data Model

| Table Name                 | Primary Key     |
|---------------------------|-----------------|
| Users                     | user_id         |
| Taxpayers                 | taxpayer_id     |
| Consultants               | consultant_id   |
| Income Sources            | income_id       |
| Deductions                | deduction_id    |
| Tax Filings               | filing_id       |
| Invoices                  | invoice_id      |
| Taxpayer Consultant Map   | mapping_id      |
| Audit Logs                | log_id          |
| Taxpayer Summary          | summary_id      |
| GST Registrations         | gst_id          |
| GST Returns               | return_id       |

**Normalization:**  
- ✅ 1NF – Atomic values  
- ✅ 2NF – Full functional dependency  
- ✅ 3NF – No transitive dependency  
- ✅ BCNF – All determinants are superkeys

---


## Setup Instructions

### Prerequisites
- Node.js and npm
- MySQL Server

### Installation
git clone https://github.com/your-username/TaxMitra.git<br>
cd TaxMitra<br>
npm install<br>

### MySQL Setup
mysql -u root -p < taxmitra_schema.sql

### Modify DB connection settings in server.js if needed.
Run the Server
node server.js

Then open index.html in a browser or use a local server (like Live Server in VSCode).

---


## Report
Detailed technical documentation is provided in DBMS_TaxMitra_Report.pdf, including:

Motivation and background<br>
System architecture<br>
ER diagrams<br>
Database normalization<br>
Screenshots and results<br>
Performance metrics and feedback<br>

---


## UN SDG Alignment

SDG 8: Decent Work and Economic Growth<br>
SDG 9: Industry, Innovation, and Infrastructure<br>
SDG 16: Peace, Justice, and Strong Institutions<br>

---


## Authors

Ishaan Karmokar <br>
Aditya Bhansali<br>
Edwin Ben Paul<br>

Under the guidance of: Dr. Diana Olivia and Mrs. Swathi B P
Institution: Manipal Institute of Technology

---


## License
This project is for academic purposes. For use or contributions, please contact the authors.
