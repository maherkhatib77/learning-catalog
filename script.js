// script.js

// סגירת Modal בלחיצה מחוץ
window.onclick = function(event) {
    const modal = document.getElementById('solutionModal');
    const loginModal = document.getElementById('loginModal');
    if (event.target === modal) closeModal();
    if (event.target === loginModal) closeLoginModal();
};

function openModal(solutionId) {
    document.getElementById('solutionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('solutionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleLogin(e) {
    e.preventDefault();
    alert('התחברת בהצלחה!');
    window.location.href = 'admin.html';
}

function logout() {
    if (confirm('להתנתק מהמערכת?')) window.location.href = 'index.html';
}

function filterSolutions() {
    // כאן תוכל להוסיף לוגיקת סינון
    console.log("סינון...");
}
