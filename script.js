// ======================================
// ELDERCARE - COMPLETE JAVASCRIPT
// ======================================

// Get saved data safely
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ======================================
// 1. PROFILE MANAGEMENT
// ======================================

const profileForm = document.getElementById("profileForm");

if (profileForm) {
    profileForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const profile = {
            name: document.getElementById("elderName").value,
            age: document.getElementById("elderAge").value,
            address: document.getElementById("elderAddress").value,
            condition: document.getElementById("elderCondition").value
        };

        localStorage.setItem("elderProfile", JSON.stringify(profile));

        document.getElementById("profileDisplay").innerHTML = `
            <div class="record">
                <h3>${escapeHTML(profile.name)}</h3>
                <p>Age: ${escapeHTML(profile.age)}</p>
                <p>Address: ${escapeHTML(profile.address)}</p>
                <p>Medical Condition: ${escapeHTML(profile.condition)}</p>
            </div>
        `;

        alert("Profile saved successfully!");
    });
}

// Load profile
const savedProfile = JSON.parse(
    localStorage.getItem("elderProfile") || "null"
);

if (savedProfile && document.getElementById("profileDisplay")) {
    document.getElementById("profileDisplay").innerHTML = `
        <div class="record">
            <h3>${escapeHTML(savedProfile.name)}</h3>
            <p>Age: ${escapeHTML(savedProfile.age)}</p>
            <p>Address: ${escapeHTML(savedProfile.address)}</p>
            <p>Medical Condition: ${escapeHTML(savedProfile.condition)}</p>
        </div>
    `;
}

// ======================================
// 2. HEALTH RECORDS
// ======================================

const healthForm = document.getElementById("healthForm");
const healthList = document.getElementById("healthList");

function displayHealthRecords() {
    if (!healthList) return;

    const records = getData("healthRecords");

    healthList.innerHTML = "";

    records.forEach(function(record, index) {
        healthList.innerHTML += `
            <div class="record">
                <h3>Health Record ${index + 1}</h3>
                <p>Blood Pressure: ${escapeHTML(record.bp)}</p>
                <p>Blood Sugar: ${escapeHTML(record.sugar)}</p>
                <p>Heart Rate: ${escapeHTML(record.heartRate)}</p>
                <p>Doctor: ${escapeHTML(record.doctor)}</p>
                <p>Health Notes: ${escapeHTML(record.notes)}</p>
                <button onclick="deleteHealthRecord(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

if (healthForm) {
    healthForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const record = {
            bp: document.getElementById("bp").value,
            sugar: document.getElementById("sugar").value,
            heartRate: document.getElementById("heartRate").value,
            doctor: document.getElementById("doctor").value,
            notes: document.getElementById("healthNotes").value
        };

        const records = getData("healthRecords");
        records.push(record);

        saveData("healthRecords", records);

        healthForm.reset();
        displayHealthRecords();

        alert("Health record saved successfully!");
    });
}

function deleteHealthRecord(index) {
    const records = getData("healthRecords");

    records.splice(index, 1);

    saveData("healthRecords", records);
    displayHealthRecords();
}

displayHealthRecords();

// ======================================
// 3. MEDICATION REMINDERS
// ======================================

const medicineForm = document.getElementById("medicineForm");
const medicineList = document.getElementById("medicineList");

function displayMedicines() {
    if (!medicineList) return;

    const medicines = getData("medicines");

    medicineList.innerHTML = "";

    medicines.forEach(function(medicine, index) {
        medicineList.innerHTML += `
            <div class="record">
                <h3>${escapeHTML(medicine.name)}</h3>
                <p>Dosage: ${escapeHTML(medicine.dosage)}</p>
                <p>Time: ${escapeHTML(medicine.time)}</p>
                <p>Instructions: ${escapeHTML(medicine.instructions)}</p>
                <button onclick="deleteMedicine(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}

if (medicineForm) {
    medicineForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const medicine = {
            name: document.getElementById("medicineName").value,
            dosage: document.getElementById("dosage").value,
            time: document.getElementById("medicineTime").value,
            instructions: document.getElementById("medicineInstructions").value
        };

        const medicines = getData("medicines");

        medicines.push(medicine);

        saveData("medicines", medicines);

        medicineForm.reset();
        displayMedicines();

        alert("Medication reminder saved successfully!");
    });
}

function deleteMedicine(index) {
    const medicines = getData("medicines");

    medicines.splice(index, 1);

    saveData("medicines", medicines);
    displayMedicines();
}

displayMedicines();

// ======================================
// 4. MEDICATION NOTIFICATIONS
// ======================================

if ("Notification" in window) {
    Notification.requestPermission();
}

function checkMedicineReminders() {
    const medicines = getData("medicines");
    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");

    medicines.forEach(function(medicine, index) {
        const reminderKey =
            "medicineAlert_" +
            now.toDateString() + "_" + index + "_" + currentTime;

        if (
            medicine.time === currentTime &&
            !localStorage.getItem(reminderKey)
        ) {
            if (
                "Notification" in window &&
                Notification.permission === "granted"
            ) {
                new Notification("ElderCare Medicine Reminder", {
                    body: "Time to take " + medicine.name +
                          " - " + medicine.dosage
                });
            } else {
                alert("Medicine Reminder: " + medicine.name);
            }

            localStorage.setItem(reminderKey, "true");
        }
    });
}

setInterval(checkMedicineReminders, 15000);

// ======================================
// 5. EMERGENCY CONTACT
// ======================================

const contactForm = document.getElementById("contactForm");

function displayEmergencyContact() {
    const contactDisplay =
        document.getElementById("contactDisplay");

    const contact = JSON.parse(
        localStorage.getItem("emergencyContact") || "null"
    );

    if (contact && contactDisplay) {
        contactDisplay.innerHTML = `
            <div class="record">
                <h3>${escapeHTML(contact.name)}</h3>
                <p>Phone: ${escapeHTML(contact.phone)}</p>
                <p>Relationship: ${escapeHTML(contact.relationship)}</p>
            </div>
        `;
    }

    const status = document.getElementById("sosContactStatus");

    if (status) {
        status.textContent = contact
            ? "Emergency contact saved successfully."
            : "Please save an emergency contact first.";
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const contact = {
            name: document.getElementById("contactName").value,
            phone: document.getElementById("contactPhone").value,
            relationship: document.getElementById("relationship").value
        };

        localStorage.setItem(
            "emergencyContact",
            JSON.stringify(contact)
        );

        contactForm.reset();

        displayEmergencyContact();

        alert("Emergency contact saved successfully!");
    });
}

displayEmergencyContact();

// ======================================
// 6. EMERGENCY SOS
// ======================================

const sosButton = document.getElementById("sosButton");

if (sosButton) {
    sosButton.addEventListener("click", sendEmergencyAlert);
}

function sendEmergencyAlert() {

    const contact = JSON.parse(
        localStorage.getItem("emergencyContact") || "null"
    );

    if (!contact || !contact.phone) {
        alert("Please save an emergency contact first.");
        return;
    }

    let phone = contact.phone.replace(/\D/g, "");

    // Add India country code if needed
    if (phone.length === 10) {
        phone = "91" + phone;
    }

    if (phone.length < 11 || phone.length > 15) {
        alert("Please enter a valid phone number.");
        return;
    }

    const sosMessage = document.getElementById("sosMessage");

    const message =
        "EMERGENCY ALERT!\n" +
        "I need immediate help.\n" +
        "Name: " +
        (JSON.parse(localStorage.getItem("elderProfile") || "{}").name || "ElderCare User") +
        "\nPlease contact me immediately.";

    function openWhatsApp(locationText = "") {
        const finalMessage = message + locationText;

        const whatsappURL =
            "https://wa.me/" + phone +
            "?text=" + encodeURIComponent(finalMessage);

        if (sosMessage) {
            sosMessage.textContent =
                "Emergency message prepared. WhatsApp is opening.";
        }

        window.location.href = whatsappURL;
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const mapLink =
                    "https://www.google.com/maps?q=" +
                    latitude + "," + longitude;

                openWhatsApp(
                    "\nMy current location: " + mapLink
                );
            },
            function() {
                openWhatsApp(
                    "\nLocation unavailable. Please contact me."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );
    } else {
        openWhatsApp(
            "\nLocation is not supported on this device."
        );
    }
}

// ======================================
// 7. HTML TEXT SAFETY
// ======================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}