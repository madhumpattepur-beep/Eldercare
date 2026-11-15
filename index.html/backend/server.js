const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file
const dataFolder = path.join(__dirname, "data");
const dbFile = path.join(dataFolder, "db.json");

// Create database folder and file
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(
        dbFile,
        JSON.stringify({
            contacts: [],
            healthRecords: [],
            medications: [],
            sosAlerts: []
        }, null, 2)
    );
}

// Read database
function readDB() {
    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}

// Save database
function saveDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Home route
app.get("/", (req, res) => {
    res.send("ElderCare Backend is Running Successfully!");
});

// Backend status
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ElderCare backend connected successfully"
    });
});

// 1. Save emergency contact
app.post("/api/contacts", (req, res) => {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name and phone number are required"
        });
    }

    const db = readDB();

    const contact = {
        id: Date.now().toString(),
        name,
        phone,
        relationship: relationship || "",
        createdAt: new Date().toISOString()
    };

    db.contacts.push(contact);
    saveDB(db);

    res.status(201).json({
        success: true,
        message: "Emergency contact saved",
        contact
    });
});

// Get emergency contacts
app.get("/api/contacts", (req, res) => {
    const db = readDB();
    res.json({ success: true, contacts: db.contacts });
});

// 2. Save health record
app.post("/api/health-records", (req, res) => {
    const {
        patientName,
        age,
        address,
        medicalCondition,
        bloodSugar,
        heartRate,
        doctorName,
        healthNotes
    } = req.body;

    const db = readDB();

    const record = {
        id: Date.now().toString(),
        patientName: patientName || "",
        age: age || "",
        address: address || "",
        medicalCondition: medicalCondition || "",
        bloodSugar: bloodSugar || "",
        heartRate: heartRate || "",
        doctorName: doctorName || "",
        healthNotes: healthNotes || "",
        createdAt: new Date().toISOString()
    };

    db.healthRecords.push(record);
    saveDB(db);

    res.status(201).json({
        success: true,
        message: "Health record saved successfully",
        record
    });
});

// Get health records
app.get("/api/health-records", (req, res) => {
    const db = readDB();
    res.json({
        success: true,
        healthRecords: db.healthRecords
    });
});

// 3. Save medication
app.post("/api/medications", (req, res) => {
    const {
        medicineName,
        dosage,
        time,
        foodTiming,
        patientName
    } = req.body;

    if (!medicineName || !dosage || !time) {
        return res.status(400).json({
            success: false,
            message: "Medicine name, dosage and time are required"
        });
    }

    const db = readDB();

    const medication = {
        id: Date.now().toString(),
        patientName: patientName || "",
        medicineName,
        dosage,
        time,
        foodTiming: foodTiming || "",
        createdAt: new Date().toISOString()
    };

    db.medications.push(medication);
    saveDB(db);

    res.status(201).json({
        success: true,
        message: "Medication saved successfully",
        medication
    });
});

// Get medications
app.get("/api/medications", (req, res) => {
    const db = readDB();
    res.json({
        success: true,
        medications: db.medications
    });
});

// 4. Emergency SOS
app.post("/api/sos", (req, res) => {
    const { contactId, message, location } = req.body;

    const db = readDB();

    const contact = db.contacts.find(
        item => item.id === contactId
    );

    if (!contact) {
        return res.status(404).json({
            success: false,
            message: "Emergency contact not found"
        });
    }

    const alert = {
        id: Date.now().toString(),
        contactName: contact.name,
        contactPhone: contact.phone,
        message: message || "Emergency! Please help.",
        location: location || "Location unavailable",
        status: "created",
        createdAt: new Date().toISOString()
    };

    db.sosAlerts.push(alert);
    saveDB(db);

    res.status(201).json({
        success: true,
        message: "SOS alert recorded successfully. No SMS or call has been sent.",
        alert
    });
});

// Get SOS alerts
app.get("/api/sos", (req, res) => {
    const db = readDB();
    res.json({
        success: true,
        sosAlerts: db.sosAlerts
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ElderCare server running at http://localhost:${PORT}`);
});