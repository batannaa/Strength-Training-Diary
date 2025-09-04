// ======== Global Variables ========
const isDiaryPage = document.getElementById("trainingForm");
const isProgressPage = document.getElementById("progressPage");

// ======== Diary Page Logic ========
if (isDiaryPage) {
  const trainingForm = document.getElementById("trainingForm");
  const cardioTable = document.querySelector("#cardioTable tbody");
  const strengthTable = document.querySelector("#strengthTable tbody");
  let currentEditIndex = -1;

  trainingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const entry = {
      date: document.getElementById("trainingDate").value,
      activity: document.getElementById("activity").value || null,
      time: document.getElementById("time").value || null,
      distance: document.getElementById("distance").value || null,
      speed: document.getElementById("speed").value || null,
      steps: document.getElementById("steps").value || null,
      exercise: document.getElementById("exercise").value || null,
      sets: document.getElementById("sets").value || null,
      reps: document.getElementById("reps").value || null,
      weight: document.getElementById("weight").value || null,
      notesEx: document.getElementById("notesEx").value || null,
      notes: document.getElementById("notes").value || null,
    };

    if (!entry.activity && !entry.exercise) {
      alert("Please enter a cardio activity or a strength exercise to save.");
      return;
    }

    let trainings = JSON.parse(localStorage.getItem("trainings") || "[]");
    if (currentEditIndex !== -1) {
      trainings[currentEditIndex] = entry;
      currentEditIndex = -1;
      document.querySelector(".glow-btn").textContent = "Save Training";
    } else {
      trainings.push(entry);
    }

    localStorage.setItem("trainings", JSON.stringify(trainings));
    renderTrainings();
    trainingForm.reset();
  });

  function renderTrainings() {
    cardioTable.innerHTML = "";
    strengthTable.innerHTML = "";
    const trainings = JSON.parse(localStorage.getItem("trainings") || "[]");

    trainings.reverse().forEach((t, originalIndex) => {
      const index = trainings.length - 1 - originalIndex;

      if (t.activity) {
        const cardioRow = document.createElement("tr");
        cardioRow.innerHTML = `
                    <td>${t.date}</td>
                    <td>${t.activity}</td>
                    <td>${t.time}</td>
                    <td>${t.distance}</td>
                    <td>${t.speed}</td>
                    <td>${t.steps}</td>
                    <td class="action-buttons">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
        cardioTable.appendChild(cardioRow);
        addEditDeleteButtons(cardioRow, t, index);
      }

      if (t.exercise) {
        const strengthRow = document.createElement("tr");
        strengthRow.innerHTML = `
                    <td>${t.date}</td>
                    <td>${t.exercise}</td>
                    <td>${t.sets}</td>
                    <td>${t.reps}</td>
                    <td>${t.weight}</td>
                    <td>${t.notesEx}</td>
                    <td class="action-buttons">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
        strengthTable.appendChild(strengthRow);
        addEditDeleteButtons(strengthRow, t, index);
      }
    });
  }

  function addEditDeleteButtons(row, data, index) {
    row
      .querySelector(".edit-btn")
      .addEventListener("click", () => handleEdit(data, index));
    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => handleDelete(index));
  }

  function handleEdit(data, index) {
    document.getElementById("trainingDate").value = data.date;
    document.getElementById("activity").value = data.activity || "";
    document.getElementById("time").value = data.time || "";
    document.getElementById("distance").value = data.distance || "";
    document.getElementById("speed").value = data.speed || "";
    document.getElementById("steps").value = data.steps || "";
    document.getElementById("exercise").value = data.exercise || "";
    document.getElementById("sets").value = data.sets || "";
    document.getElementById("reps").value = data.reps || "";
    document.getElementById("weight").value = data.weight || "";
    document.getElementById("notesEx").value = data.notesEx || "";
    document.getElementById("notes").value = data.notes || "";

    currentEditIndex = index;
    document.querySelector(".glow-btn").textContent = "Save Changes";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
      let trainings = JSON.parse(localStorage.getItem("trainings") || "[]");
      trainings.splice(index, 1);
      localStorage.setItem("trainings", JSON.stringify(trainings));
      renderTrainings();
    }
  }

  renderTrainings();
}

// ======== Progress Page Logic ========
if (isProgressPage) {
  const measureForm = document.getElementById("measureForm");
  const photoForm = document.getElementById("photoForm");
  const measurementsTable = document.getElementById("measurementsTable");
  const photoInput = document.getElementById("photoInput");
  const photoGallery = document.getElementById("photoGallery");
  const userHeightInput = document.getElementById("userHeight");
  const saveHeightBtn = document.getElementById("saveHeightBtn");

  // Summary Cards
  const currentWeightEl = document.getElementById("currentWeight");
  const weightChangeEl = document.getElementById("weightChange");
  const currentBmiEl = document.getElementById("currentBmi");
  const bmiInterpretationEl = document.getElementById("bmiInterpretation");

  // Photo Comparison Elements
  const photoComparisonSection = document.getElementById(
    "photoComparisonSection"
  );
  const photoSelect1 = document.getElementById("photoSelect1");
  const photoSelect2 = document.getElementById("photoSelect2");
  const comparePhoto1 = document.getElementById("comparePhoto1");
  const comparePhoto2 = document.getElementById("comparePhoto2");
  const noPhotosMessage = document.getElementById("noPhotosMessage");

  // Modal Elements
  const modal = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalCloseBtn = document.querySelector(".modal-close");

  // Load and display height on page load
  let userHeight = localStorage.getItem("userHeight") || "";
  if (userHeight) {
    userHeightInput.value = userHeight;
  }

  // Save height
  saveHeightBtn.addEventListener("click", () => {
    userHeight = userHeightInput.value;
    if (userHeight > 0) {
      localStorage.setItem("userHeight", userHeight);
      alert("Your height has been saved!");
      renderMeasurements();
    } else {
      alert("Please enter a valid height.");
    }
  });

  // Body Measurements
  measureForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = {
      date: document.getElementById("measureDate").value,
      weight: document.getElementById("weight").value || null,
      waist: document.getElementById("waist").value || null,
      chest: document.getElementById("chest").value || null,
      hips: document.getElementById("hips").value || null,
      biceps: document.getElementById("biceps").value || null,
    };

    if (!entry.date) {
      alert("Please select a date.");
      return;
    }

    let measurements = JSON.parse(localStorage.getItem("measurements") || "[]");
    measurements.push(entry);
    localStorage.setItem("measurements", JSON.stringify(measurements));
    renderMeasurements();
    measureForm.reset();
  });

  function calculateBmi(weight, height) {
    if (!weight || !height) return null;
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(2);
  }

  function getBmiInterpretation(bmi) {
    if (bmi === null) return "Enter your height and weight";
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    if (bmi >= 30) return "Obese";
  }

  function renderMeasurements() {
    measurementsTable.innerHTML = "";
    const measurements = JSON.parse(
      localStorage.getItem("measurements") || "[]"
    );

    // Sort by date to get most recent
    measurements.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update summary cards
    if (measurements.length > 0) {
      const latest = measurements[0];
      currentWeightEl.textContent = `${latest.weight || "—"} kg`;

      const bmi = calculateBmi(latest.weight, userHeight);
      currentBmiEl.textContent = bmi || "—";
      bmiInterpretationEl.textContent = getBmiInterpretation(bmi);

      if (measurements.length > 1) {
        const first = measurements[measurements.length - 1];
        const weightChange = latest.weight - first.weight;
        if (weightChange > 0) {
          weightChangeEl.innerHTML = `<span style="color:#4caf50;">+${weightChange.toFixed(
            1
          )} kg</span>`;
        } else if (weightChange < 0) {
          weightChangeEl.innerHTML = `<span style="color:#d32f2f;">${weightChange.toFixed(
            1
          )} kg</span>`;
        } else {
          weightChangeEl.textContent = "No change";
        }
      } else {
        weightChangeEl.textContent = "Log more data for change";
      }
    } else {
      currentWeightEl.textContent = "— kg";
      weightChangeEl.textContent = "No data yet";
      currentBmiEl.textContent = "—";
      bmiInterpretationEl.textContent = "Enter your height and weight";
    }

    // Render table rows
    measurements.forEach((m, index) => {
      const bmi = calculateBmi(m.weight, userHeight);
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${m.date}</td>
                <td>${m.weight || "—"}</td>
                <td>${bmi || "—"}</td>
                <td>${m.waist || "—"}</td>
                <td>${m.hips || "—"}</td>
                <td>${m.chest || "—"}</td>
                <td>${m.biceps || "—"}</td>
                <td class="action-buttons">
                    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
      // Note: The index here is based on the sorted array, need to find original index for splice
      row
        .querySelector(".delete-btn")
        .addEventListener("click", () => handleDeleteMeasurement(index));
      measurementsTable.appendChild(row);
    });
  }

  function handleDeleteMeasurement(index) {
    if (confirm("Are you sure you want to delete this measurement?")) {
      let measurements = JSON.parse(
        localStorage.getItem("measurements") || "[]"
      );
      measurements.splice(index, 1);
      localStorage.setItem("measurements", JSON.stringify(measurements));
      renderMeasurements();
    }
  }

  // Photo Progress
  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = photoInput.files[0];
    const date = document.getElementById("photoDate").value;
    const weight = document.getElementById("photoWeight").value;

    if (!file || !date || !weight) {
      alert("Please provide a date, weight, and a photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const photos = JSON.parse(localStorage.getItem("photos") || "[]");
      photos.push({
        date: date,
        weight: weight,
        photoUrl: event.target.result,
      });
      localStorage.setItem("photos", JSON.stringify(photos));
      renderPhotos();
      photoForm.reset();
    };
    reader.readAsDataURL(file);
  });

  function renderPhotos() {
    photoGallery.innerHTML = "";
    photoSelect1.innerHTML = "";
    photoSelect2.innerHTML = "";
    const photos = JSON.parse(localStorage.getItem("photos") || "[]");

    if (photos.length === 0) {
      noPhotosMessage.style.display = "block";
      photoComparisonSection.style.display = "none";
    } else {
      noPhotosMessage.style.display = "none";
      if (photos.length >= 2) {
        photoComparisonSection.style.display = "block";
      } else {
        photoComparisonSection.style.display = "none";
      }
    }

    photos.forEach((photoObj, index) => {
      const photoWrapper = document.createElement("div");
      photoWrapper.classList.add("photo-wrapper");

      const img = document.createElement("img");
      img.src = photoObj.photoUrl;
      img.alt = `Progress photo from ${photoObj.date}`;

      const details = document.createElement("div");
      details.classList.add("photo-details");
      details.innerHTML = `<span>${photoObj.date}</span><span>${photoObj.weight} kg</span>`;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      deleteBtn.classList.add("delete-photo-btn");
      deleteBtn.addEventListener("click", () => handleDeletePhoto(index));

      photoWrapper.appendChild(img);
      photoWrapper.appendChild(details);
      photoWrapper.appendChild(deleteBtn);
      photoGallery.appendChild(photoWrapper);

      // Add event listener for modal
      img.addEventListener("click", () => openModal(photoObj));

      // Populate comparison dropdowns
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${photoObj.date} (${photoObj.weight} kg)`;
      photoSelect1.appendChild(option.cloneNode(true));
      photoSelect2.appendChild(option);
    });

    // Select first and last photos by default
    if (photos.length >= 2) {
      photoSelect1.value = 0;
      photoSelect2.value = photos.length - 1;
    }

    updateComparison();
  }

  function handleDeletePhoto(index) {
    if (confirm("Are you sure you want to delete this photo?")) {
      let photos = JSON.parse(localStorage.getItem("photos") || "[]");
      photos.splice(index, 1);
      localStorage.setItem("photos", JSON.stringify(photos));
      renderPhotos();
    }
  }

  function openModal(photoObj) {
    modal.style.display = "flex";
    modalImage.src = photoObj.photoUrl;
    modalCaption.innerHTML = `Date: ${photoObj.date} | Weight: ${photoObj.weight} kg`;
  }

  modalCloseBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  function updateComparison() {
    const photos = JSON.parse(localStorage.getItem("photos") || "[]");
    const index1 = photoSelect1.value;
    const index2 = photoSelect2.value;

    if (photos[index1]) {
      comparePhoto1.innerHTML = `<img src="${photos[index1].photoUrl}" alt="Photo 1">`;
    } else {
      comparePhoto1.innerHTML = `<span class="placeholder-text">Select a photo</span>`;
    }

    if (photos[index2]) {
      comparePhoto2.innerHTML = `<img src="${photos[index2].photoUrl}" alt="Photo 2">`;
    } else {
      comparePhoto2.innerHTML = `<span class="placeholder-text">Select a photo</span>`;
    }
  }

  photoSelect1.addEventListener("change", updateComparison);
  photoSelect2.addEventListener("change", updateComparison);

  renderMeasurements();
  renderPhotos();
}

// ======== PDF Export Functionality ========
const pdfBtn = document.getElementById("exportPdfBtn");
if (pdfBtn) {
  pdfBtn.addEventListener("click", generatePDF);
}

async function generatePDF() {
  const { jspdf } = window;
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  let y = 20;

  const addText = (text, size, isBold = false) => {
    doc.setFont(undefined, isBold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.text(text, 10, y);
    y += size === 18 ? 15 : 10;
  };

  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]");
  const measurements = JSON.parse(localStorage.getItem("measurements") || "[]");
  const photos = JSON.parse(localStorage.getItem("photos") || "[]");

  // Training Report
  addText("Training Report", 24, true);

  addText("Cardio Training", 16, true);
  if (trainings.some((t) => t.activity)) {
    trainings
      .filter((t) => t.activity)
      .forEach((t) => {
        doc.text(
          `${t.date} | ${t.activity} | Time: ${t.time} min | Dist: ${t.distance} km | Speed: ${t.speed} km/h | Steps: ${t.steps}`,
          10,
          y
        );
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
  } else {
    doc.text("No cardio data available.", 10, y);
    y += 8;
  }

  y += 10;
  addText("Strength Training", 16, true);
  if (trainings.some((t) => t.exercise)) {
    trainings
      .filter((t) => t.exercise)
      .forEach((t) => {
        doc.text(
          `${t.date} | ${t.exercise} ${t.sets}x${t.reps} @${t.weight}kg | Notes: ${t.notesEx}`,
          10,
          y
        );
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
  } else {
    doc.text("No strength data available.", 10, y);
    y += 8;
  }

  y += 10;
  addText("Reflections & Goals", 16, true);
  if (trainings.some((t) => t.notes)) {
    trainings
      .filter((t) => t.notes)
      .forEach((t) => {
        doc.text(`${t.date}: ${t.notes}`, 10, y, { maxWidth: 180 });
        y += 12;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
  } else {
    doc.text("No reflections available.", 10, y);
    y += 8;
  }

  // Add Body Measurements
  if (measurements.length > 0) {
    doc.addPage();
    y = 20;
    addText("Body Measurements", 24, true);
    measurements.forEach((m) => {
      doc.text(
        `${m.date} | Waist: ${m.waist} cm | Chest: ${m.chest} cm | Hips: ${m.hips} cm | Biceps: ${m.biceps} cm`,
        10,
        y
      );
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  doc.save("training_and_progress_report.pdf");
}

// ======== Intersection Observer Animation ========
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".animate").forEach((element) => {
  observer.observe(element);
});

// ======== Calculators Page Logic ========
const isCalculatorsPage = document.getElementById("calculatorsPage");

if (isCalculatorsPage) {
  const bmiHeightInput = document.getElementById("bmiHeight");
  const bmiWeightInput = document.getElementById("bmiWeight");
  const calculateBmiBtn = document.getElementById("calculateBmiBtn");
  const bmiResultDiv = document.getElementById("bmiResult");

  const waterWeightInput = document.getElementById("waterWeight");
  const calculateWaterBtn = document.getElementById("calculateWaterBtn");
  const waterResultDiv = document.getElementById("waterResult");

  calculateBmiBtn.addEventListener("click", () => {
    const heightCm = parseFloat(bmiHeightInput.value);
    const weightKg = parseFloat(bmiWeightInput.value);

    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      bmiResultDiv.innerHTML =
        '<span class="error-text">Please enter valid height and weight values.</span>';
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = "";

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = "Normal Weight";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
    } else {
      category = "Obesity";
    }

    bmiResultDiv.innerHTML = `Your BMI: <strong>${bmi.toFixed(
      2
    )}</strong> (${category})`;
  });

  calculateWaterBtn.addEventListener("click", () => {
    const weightKg = parseFloat(waterWeightInput.value);

    if (isNaN(weightKg) || weightKg <= 0) {
      waterResultDiv.innerHTML =
        '<span class="error-text">Please enter your weight.</span>';
      return;
    }

    // Recommended range: 30-40 ml per 1 kg of body weight
    const minWater = ((weightKg * 30) / 1000).toFixed(1);
    const maxWater = ((weightKg * 40) / 1000).toFixed(1);

    waterResultDiv.innerHTML = `Recommended Daily Water Intake: <strong>${minWater} - ${maxWater} liters</strong>.`;
  });
}
const bmrGenderSelect = document.getElementById("bmrGender");
const bmrAgeInput = document.getElementById("bmrAge");
const bmrHeightInput = document.getElementById("bmrHeight");
const bmrWeightInput = document.getElementById("bmrWeight");
const calculateBmrBtn = document.getElementById("calculateBmrBtn");
const bmrResultDiv = document.getElementById("bmrResult");

calculateBmrBtn.addEventListener("click", () => {
  const gender = bmrGenderSelect.value;
  const age = parseFloat(bmrAgeInput.value);
  const height = parseFloat(bmrHeightInput.value);
  const weight = parseFloat(bmrWeightInput.value);

  if (
    isNaN(age) ||
    isNaN(height) ||
    isNaN(weight) ||
    age <= 0 ||
    height <= 0 ||
    weight <= 0
  ) {
    bmrResultDiv.innerHTML =
      '<span class="error-text">Please enter all values.</span>';
    return;
  }

  let bmr = 0;
  // Mifflin-St Jeor Equation
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // female
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  bmrResultDiv.innerHTML = `Your Basal Metabolic Rate (BMR) is <strong>${bmr.toFixed(
    0
  )}</strong> calories per day.`;
});
