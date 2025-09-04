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
      activity: document.getElementById("activity").value || "—",
      time: document.getElementById("time").value || "—",
      distance: document.getElementById("distance").value || "—",
      speed: document.getElementById("speed").value || "—",
      steps: document.getElementById("steps").value || "—",
      exercise: document.getElementById("exercise").value || "—",
      sets: document.getElementById("sets").value || "—",
      reps: document.getElementById("reps").value || "—",
      weight: document.getElementById("weight").value || "—",
      notesEx: document.getElementById("notesEx").value || "—",
      notes: document.getElementById("notes").value || "—",
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
  const userHeightInput = document.getElementById("userHeight");
  const saveHeightBtn = document.getElementById("saveHeightBtn");
  const photoGallery = document.getElementById("photoGallery");

  // Summary Cards
  const currentWeightEl = document.getElementById("currentWeight");
  const weightChangeEl = document.getElementById("weightChange");
  const currentBmiEl = document.getElementById("currentBmi");
  const bmiInterpretationEl = document.getElementById("bmiInterpretation");

  // Photo Capture Elements
  const cameraStream = document.getElementById("cameraStream");
  const photoCanvas = document.getElementById("photoCanvas");
  const capturedPhoto = document.getElementById("capturedPhoto");
  const photoInput = document.getElementById("photoInput");
  const toggleCameraBtn = document.getElementById("toggleCameraBtn");
  const savePhotoBtn = document.getElementById("savePhotoBtn");
  const retakePhotoBtn = document.getElementById("retakePhotoBtn");
  let stream = null;
  let currentPhotoBase64 = null;

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

    measurements.sort((a, b) => new Date(b.date) - new Date(a.date));

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

  // Photo Progress Logic
  let isCameraOn = false;

  toggleCameraBtn.addEventListener("click", async () => {
    if (!isCameraOn) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        cameraStream.srcObject = stream;
        cameraStream.style.display = "block";
        toggleCameraBtn.textContent = "Take Photo";
        isCameraOn = true;
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please check your permissions.");
      }
    } else {
      // Take photo
      photoCanvas.width = cameraStream.videoWidth;
      photoCanvas.height = cameraStream.videoHeight;
      photoCanvas
        .getContext("2d")
        .drawImage(cameraStream, 0, 0, photoCanvas.width, photoCanvas.height);
      currentPhotoBase64 = photoCanvas.toDataURL("image/jpeg", 0.8);
      capturedPhoto.src = currentPhotoBase64;

      cameraStream.style.display = "none";
      capturedPhoto.style.display = "block";
      toggleCameraBtn.style.display = "none";
      savePhotoBtn.style.display = "block";
      retakePhotoBtn.style.display = "block";

      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      isCameraOn = false;
    }
  });

  retakePhotoBtn.addEventListener("click", () => {
    capturedPhoto.style.display = "none";
    cameraStream.style.display = "block";
    savePhotoBtn.style.display = "none";
    retakePhotoBtn.style.display = "none";
    toggleCameraBtn.style.display = "block";
    currentPhotoBase64 = null;
    toggleCameraBtn.click(); // Re-start camera stream
  });

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentPhotoBase64 = event.target.result;
      // Display captured photo instead of stream
      cameraStream.style.display = "none";
      capturedPhoto.src = currentPhotoBase64;
      capturedPhoto.style.display = "block";

      // Show save/retake buttons
      toggleCameraBtn.style.display = "none";
      savePhotoBtn.style.display = "block";
      retakePhotoBtn.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("photoDate").value;
    const weight = document.getElementById("photoWeight").value;

    if (!currentPhotoBase64 || !date || !weight) {
      alert("Please capture or upload a photo, and enter date and weight.");
      return;
    }

    const photos = JSON.parse(localStorage.getItem("photos") || "[]");
    photos.push({
      date: date,
      weight: weight,
      photoUrl: currentPhotoBase64,
    });
    localStorage.setItem("photos", JSON.stringify(photos));
    renderPhotos();
    photoForm.reset();

    // Reset to initial state
    capturedPhoto.style.display = "none";
    toggleCameraBtn.style.display = "block";
    savePhotoBtn.style.display = "none";
    retakePhotoBtn.style.display = "none";
    currentPhotoBase64 = null;
  });

  function renderPhotos() {
    photoGallery.innerHTML = "";
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

    photoSelect1.innerHTML = "";
    photoSelect2.innerHTML = "";

    // Sort photos by date descending
    photos.sort((a, b) => new Date(b.date) - new Date(a.date));

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

      img.addEventListener("click", () => openModal(photoObj));

      const option = document.createElement("option");
      option.value = photoObj.date;
      option.textContent = `${photoObj.date} (${photoObj.weight} kg)`;
      photoSelect1.appendChild(option.cloneNode(true));
      photoSelect2.appendChild(option);
    });

    // Select first and last photos by default
    if (photos.length >= 2) {
      photoSelect1.value = photos[photos.length - 1].date;
      photoSelect2.value = photos[0].date;
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
    const date1 = photoSelect1.value;
    const date2 = photoSelect2.value;

    const photo1 = photos.find((p) => p.date === date1);
    const photo2 = photos.find((p) => p.date === date2);

    if (photo1) {
      comparePhoto1.innerHTML = `<img src="${photo1.photoUrl}" alt="Photo 1">`;
    } else {
      comparePhoto1.innerHTML = `<span class="placeholder-text">Select a photo</span>`;
    }

    if (photo2) {
      comparePhoto2.innerHTML = `<img src="${photo2.photoUrl}" alt="Photo 2">`;
    } else {
      comparePhoto2.innerHTML = `<span class="placeholder-text">Select a photo</span>`;
    }
  }

  photoSelect1.addEventListener("change", updateComparison);
  photoSelect2.addEventListener("change", updateComparison);

  // Initial render
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
  let y = 20; // Начальная Y-координата
  const margin = 15; // Отступы слева и справа
  const pageHeight = doc.internal.pageSize.height; // Высота страницы

  // --- Helper function to add text and manage page breaks ---
  const addSectionTitle = (title, size = 18, align = "left", yOffset = 15) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    y += yOffset;
    if (y > pageHeight - margin) {
      // Проверка на выход за пределы страницы
      doc.addPage();
      y = margin; // Сброс Y на новую страницу
    }
    if (align === "center") {
      doc.text(title, doc.internal.pageSize.width / 2, y, { align: "center" });
    } else {
      doc.text(title, margin, y);
    }
    y += 10; // Отступ после заголовка
  };

  const addTextLine = (
    text,
    size = 10,
    fontStyle = "normal",
    yOffset = 7,
    maxWidth = 180
  ) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(size);
    if (y > pageHeight - margin - yOffset) {
      // Проверка на выход за пределы страницы перед добавлением текста
      doc.addPage();
      y = margin;
    }
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * yOffset; // Увеличиваем Y на высоту текста
  };

  const addSeparator = () => {
    y += 5;
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setLineWidth(0.2);
    doc.line(margin, y, doc.internal.pageSize.width - margin, y);
    y += 5;
  };

  const formatValue = (value, unit = "") => {
    return value !== null && value !== "" ? `${value} ${unit}` : "—";
  };

  // --- Load Data ---
  const trainings = JSON.parse(localStorage.getItem("trainings") || "[]");
  const measurements = JSON.parse(localStorage.getItem("measurements") || "[]");
  const photos = JSON.parse(localStorage.getItem("photos") || "[]"); // Фотографии тоже
  const userHeight = localStorage.getItem("userHeight") || 0;

  // --- Cover Page (Optional, but adds to "diary" feel) ---
  addSectionTitle("My Fitness & Progress Diary", 28, "center", 50);
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    doc.internal.pageSize.width / 2,
    y + 20,
    { align: "center" }
  );
  y += 40;

  // Add a simple aesthetic element
  doc.setDrawColor(0, 0, 0); // Black color
  doc.rect(
    margin,
    margin,
    doc.internal.pageSize.width - 2 * margin,
    pageHeight - 2 * margin,
    "S"
  ); // Simple border

  doc.addPage();
  y = margin; // Reset Y for new page

  // --- Training Report ---
  addSectionTitle("Training Report", 24);
  addSeparator();

  addSectionTitle("Cardio Training", 16);
  const cardioTrainings = trainings.filter((t) => t.activity);
  if (cardioTrainings.length > 0) {
    cardioTrainings.forEach((t) => {
      const text = `${t.date} | ${formatValue(
        t.activity
      )} | Time: ${formatValue(t.time, "min")} | Dist: ${formatValue(
        t.distance,
        "km"
      )} | Speed: ${formatValue(t.speed, "km/h")} | Steps: ${formatValue(
        t.steps
      )}`;
      addTextLine(text);
    });
  } else {
    addTextLine("No cardio data available.");
  }
  addSeparator();

  addSectionTitle("Strength Training", 16);
  const strengthTrainings = trainings.filter((t) => t.exercise);
  if (strengthTrainings.length > 0) {
    strengthTrainings.forEach((t) => {
      const text = `${t.date} | ${formatValue(t.exercise)} ${formatValue(
        t.sets
      )}x${formatValue(t.reps)} @${formatValue(
        t.weight,
        "kg"
      )} | Notes: ${formatValue(t.notesEx)}`;
      addTextLine(text);
    });
  } else {
    addTextLine("No strength data available.");
  }
  addSeparator();

  addSectionTitle("Reflections & Goals", 16);
  const reflections = trainings.filter((t) => t.notes);
  if (reflections.length > 0) {
    reflections.forEach((t) => {
      addTextLine(`${t.date}: ${formatValue(t.notes)}`, 10, "normal", 7, 180); // MaxWidth for notes
    });
  } else {
    addTextLine("No reflections or goals recorded.");
  }
  addSeparator();

  // --- Body Measurements ---
  if (measurements.length > 0) {
    doc.addPage();
    y = margin;
    addSectionTitle("Body Measurements", 24);
    addSeparator();

    measurements.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

    measurements.forEach((m) => {
      const bmi =
        m.weight && userHeight > 0
          ? (m.weight / ((userHeight / 100) * (userHeight / 100))).toFixed(2)
          : "—";
      const text = `${m.date} | Weight: ${formatValue(
        m.weight,
        "kg"
      )} | BMI: ${bmi} | Waist: ${formatValue(
        m.waist,
        "cm"
      )} | Chest: ${formatValue(m.chest, "cm")} | Hips: ${formatValue(
        m.hips,
        "cm"
      )} | Biceps: ${formatValue(m.biceps, "cm")}`;
      addTextLine(text, 10, "normal", 7, 180); // MaxWidth for measurements
    });
    addSeparator();
  }

  // --- Photo Gallery (This is complex and might need more advanced libraries for complex layouts) ---
  if (photos.length > 0) {
    doc.addPage();
    y = margin;
    addSectionTitle("Photo Progress Gallery", 24);
    addSeparator();
    addTextLine(
      "Note: Photos are scaled to fit. For high-res comparison, use the web app.",
      8,
      "italic"
    );
    y += 5; // Extra space after note

    const imgWidth = 80;
    const imgHeight = 100; // Adjust as needed
    let x = margin;
    let photosPerRow = Math.floor(
      (doc.internal.pageSize.width - 2 * margin) / (imgWidth + 10)
    ); // 10px spacing

    for (const photoObj of photos) {
      if (y + imgHeight + 20 > pageHeight - margin) {
        // 20 for text below image
        doc.addPage();
        y = margin;
        x = margin;
      }

      try {
        // `addImage` takes base64 string, x, y, width, height
        doc.addImage(photoObj.photoUrl, "JPEG", x, y, imgWidth, imgHeight);
        addTextLine(
          `${photoObj.date} | ${formatValue(photoObj.weight, "kg")}`,
          8,
          "normal",
          5,
          imgWidth
        );
        y += imgHeight + 15; // Move y below image and text

        x += imgWidth + 10; // Move x for next image
        if (x + imgWidth > doc.internal.pageSize.width - margin) {
          // If next image goes off page
          x = margin; // Reset x for new row
        } else {
          y -= imgHeight + 15; // If not new row, reset y to align with current row
        }
      } catch (error) {
        console.error("Error adding image to PDF:", error);
        addTextLine(`[Image failed to load: ${photoObj.date}]`, 10, "italic");
        y += imgHeight + 15;
      }
    }
    addSeparator();
  }

  doc.save("fitness_progress_diary.pdf");
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
