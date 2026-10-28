// Global workouts array
let workouts = JSON.parse(localStorage.getItem('fitTrackWorkouts')) || [];

// Runs automatically depending on which page you are on
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the form page
    const form = document.getElementById('workoutForm');
    if (form) {
        document.getElementById('date').valueAsDate = new Date();
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const newWorkout = {
                id: Date.now(),
                date: document.getElementById('date').value,
                category: document.getElementById('category').value,
                duration: document.getElementById('duration').value,
                notes: document.getElementById('notes').value
            };

            workouts.push(newWorkout);
            localStorage.setItem('fitTrackWorkouts', JSON.stringify(workouts));

            const alertBox = document.getElementById('successAlert');
            alertBox.style.display = 'block';
            setTimeout(() => alertBox.style.display = 'none', 3000);

            this.reset();
            document.getElementById('date').valueAsDate = new Date();
        });
    }

    // Check if we are on the dashboard page
    const tableBody = document.getElementById('workoutTableBody');
    if (tableBody) {
        loadDashboard();
    }
});

function loadDashboard() {
    renderStats();
    renderTable(workouts);
}

function renderStats() {
    const totalSessionsElem = document.getElementById('totalSessions');
    const totalMinutesElem = document.getElementById('totalMinutes');
    
    if (totalSessionsElem && totalMinutesElem) {
        totalSessionsElem.innerText = workouts.length;
        const totalMins = workouts.reduce((sum, item) => sum + parseInt(item.duration || 0), 0);
        totalMinutesElem.innerText = totalMins;
    }
}

function renderTable(data) {
    const tbody = document.getElementById('workoutTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No workout logs found.</td></tr>';
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${item.category}</strong></td>
            <td>${item.duration} mins</td>
            <td>${item.notes || '-'}</td>
            <td><button class="btn-delete" onclick="deleteWorkout(${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function filterWorkouts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase();
    const filtered = workouts.filter(w => 
        w.category.toLowerCase().includes(query) || 
        w.notes.toLowerCase().includes(query)
    );
    renderTable(filtered);
}

function deleteWorkout(id) {
    workouts = workouts.filter(w => w.id !== id);
    localStorage.setItem('fitTrackWorkouts', JSON.stringify(workouts));
    loadDashboard();
}
