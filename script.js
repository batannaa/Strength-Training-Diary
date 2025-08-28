// Функция для добавления строки в таблицу силовых упражнений
function addRow() {
    const tableBody = document.getElementById('workoutBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input type="text" class="form-control" placeholder="Жим лёжа"></td>
    <td><input type="number" class="form-control" placeholder="3"></td>
    <td><input type="number" class="form-control" placeholder="12"></td>
    <td><input type="number" class="form-control" placeholder="60"></td>
    <td><input type="text" class="form-control"></td>
    `;
    tableBody.appendChild(newRow);
}

// Функция для добавления строки в таблицу кардио
function addCardioRow() {
    const tableBody = document.getElementById('cardioBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>
        <select class="form-select activity-select">
            <option selected>Выберите...</option>
            <option value="run">Бег / Running</option>
            <option value="walk">Ходьба / Walking</option>
            <option value="bike">Велосипед / Biking</option>
            <option value="ski">Лыжи / Skiing</option>
            <option value="elliptical">Эллипс / Elliptical</option>
            <option value="other">Другое / Other</option>
        </select>
        <input type="text" class="form-control activity-other-input" style="display: none; margin-top: 5px;" placeholder="Введите активность">
    </td>
    <td><input type="number" class="form-control" placeholder="30"></td>
    <td><input type="number" step="0.1" class="form-control" placeholder="5"></td>
    <td><input type="number" step="0.1" class="form-control" placeholder="10"></td>
    <td><input type="number" class="form-control" placeholder="6000"></td>
    `;
    tableBody.appendChild(newRow);
}
function updateProgressBar() {
      const workoutCount = document.querySelectorAll('#workoutBody tr').length;
      document.getElementById('weeklyProgress').value = workoutCount;
      document.getElementById('workoutCount').innerText = workoutCount;
    }
// Основной код, который запускается после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("dateInput");
    const dayOfWeekDisplay = document.getElementById("dayOfWeek");

    // Установка текущей даты по умолчанию
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.dispatchEvent(new Event('change'));

    // Обновление дня недели при смене даты
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        const daysRu = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = selectedDate.getUTCDay();
        dayOfWeekDisplay.innerText = `${daysRu[dayIndex]} / ${daysEn[dayIndex]}`;
    });

    // Обработчик для кнопки "Сохранить"
    document.getElementById('trainingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Тренировка сохранена!');
    });

    // Обработчик для выпадающего списка в кардио
    document.getElementById('cardioBody').addEventListener('change', function(event) {
        if (event.target.classList.contains('activity-select')) {
            const select = event.target;
            const otherInput = select.nextElementSibling;
            if (select.value === 'other') {
                otherInput.style.display = 'block';
                otherInput.focus();
            } else {
                otherInput.style.display = 'none';
            }
        }
    });
});
function toggleJointInfo() {
    const info = document.getElementById("jointInfo");
    info.style.display = info.style.display === "none" ? "block" : "none";
  }

  // В функции обработки формы (document.getElementById('trainingForm').addEventListener('submit', ...))
document.getElementById('trainingForm').addEventListener('submit', function (e) {
    e.preventDefault();

  const trainingData = {
    date: document.getElementById('dateInput').value,
    dayOfWeek: document.getElementById('dayOfWeek').innerText,
    cardio: [],
    jointMobility: document.getElementById('joint').checked,
    strength: [], 
    notes: document.getElementById('notes').value,

    // Новые поля для измерений
    bodyMeasurements: {
        date: document.getElementById('bodyMeasurementDate').value,
        weight: document.getElementById('weightInput').value,
        waist: document.getElementById('waistInput').value,
        hips: document.getElementById('hipsInput').value,
        chest: document.getElementById('chestInput').value,
        biceps: document.getElementById('bicepsInput').value,
        thigh: document.getElementById('thighInput').value,
        calf: document.getElementById('calfInput').value
    }
    };

    // Сбор данных кардио
    document.querySelectorAll('#cardioBody tr').forEach(row => {
        const select = row.querySelector('.activity-select');
        const activity = select.value === 'other' ? row.querySelector('.activity-other-input').value : select.value;
        trainingData.cardio.push({
            activity: activity,
            time: row.cells[1].querySelector('input').value,
            distance: row.cells[2].querySelector('input').value,
            avgSpeed: row.cells[3].querySelector('input').value,
            steps: row.cells[4].querySelector('input').value
        });
    });

    // Сбор данных силовой тренировки
    document.querySelectorAll('#workoutBody tr').forEach(row => {
        trainingData.strength.push({
            exercise: row.cells[0].querySelector('input').value,
            sets: row.cells[1].querySelector('input').value,
            reps: row.cells[2].querySelector('input').value,
            weight: row.cells[3].querySelector('input').value,
            comment: row.cells[4].querySelector('input').value
        });
    });

    // Получаем существующие тренировки или создаем новый массив
    const storedTrainings = JSON.parse(localStorage.getItem('trainingDiary')) || [];
    storedTrainings.push(trainingData);
    localStorage.setItem('trainingDiary', JSON.stringify(storedTrainings));

    alert('Тренировка сохранена!');
    // Можно очистить форму после сохранения или перенаправить на страницу прогресса
    // this.reset();
});