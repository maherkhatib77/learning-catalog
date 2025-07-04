// נתוני פתרונות למידה מפורטים
const solutionsData = {
    solution1: {
        title: "חשיבה מתמטית יצירתית",
        id: "001",
        instructor: "ד\"ר רחל כהן",
        lecturer: "פרופ' משה לוי",
        educationLevel: "יסודי",
        subject: "מתמטיקה",
        hours: "40 שעות",
        learningMode: "פנים אל פנים",
        meetingDay: "רביעי",
        meetingTime: "16:00-18:00",
        startDate: "15/02/2025",
        contactMade: "כן",
        syllabusStatus: "סילבוס מוכן",
        goals: "פיתוח חשיבה יצירתית במתמטיקה, הכרת אסטרטגיות פתרון בעיות מתקדמות, עבודה עם כלים דיגיטליים מתקדמים, חיזוק הביטחון העצמי בפתרון בעיות מתמטיות מורכבות."
    },
    solution2: {
        title: "כתיבה יצירתית דיגיטלית",
        id: "002",
        instructor: "מרים שלום",
        lecturer: "ד\"ר יעל רוזן",
        educationLevel: "תיכון",
        subject: "שפה עברית",
        hours: "30 שעות",
        learningMode: "היברידי",
        meetingDay: "שלישי",
        meetingTime: "17:00-19:00",
        startDate: "08/03/2025",
        contactMade: "בתהליך",
        syllabusStatus: "ממתין לאישור",
        goals: "פיתוח כישורי כתיבה יצירתית באמצעות כלים דיגיטליים מתקדמים, הכרת ז'אנרים ספרותיים שונים, עבודה שיתופית ברשת, פיתוח יכולת ביקורת ועריכה עצמית."
    },
    solution3: {
        title: "מעבדה וירטואלית למדעים",
        id: "003",
        instructor: "ד\"ר אבי גולד",
        lecturer: "פרופ' שרה ברק",
        educationLevel: "על-יסודי",
        subject: "מדעים",
        hours: "60 שעות",
        learningMode: "סינכרוני",
        meetingDay: "ראשון",
        meetingTime: "18:00-20:00",
        startDate: "01/03/2025",
        contactMade: "כן",
        syllabusStatus: "סילבוס מאושר",
        goals: "הכרת מעבדה וירטואלית מתקדמת, ביצוע ניסויים דיגיטליים אינטראקטיביים, פיתוח חשיבה מדעית וחקרנית, הבנת תהליכים מדעיים מורכבים באופן ויזואלי."
    },
    solution4: {
        title: "אנגלית דרך משחקים",
        id: "004",
        instructor: "רונית לוי",
        lecturer: "ליסה ג'ונסון",
        educationLevel: "קדם-יסודי",
        subject: "אנגלית",
        hours: "25 שעות",
        learningMode: "א-סינכרוני",
        meetingDay: "עצמאי",
        meetingTime: "גמיש",
        startDate: "10/02/2025",
        contactMade: "כן",
        syllabusStatus: "סילבוס מוכן",
        goals: "למידת אנגלית בסיסית דרך משחקים אינטראקטיביים, פיתוח אוצר מילים בסיסי, הכרת צלילי השפה, עידוד אהבה לשפה הזרה בגיל הרך."
    },
    solution5: {
        title: "היסטוריה דרך סיפורים",
        id: "005",
        instructor: "תמר כהן",
        lecturer: "ד\"ר דן כהן",
        educationLevel: "תיכון",
        subject: "היסטוריה",
        hours: "35 שעות",
        learningMode: "פנים אל פנים",
        meetingDay: "חמישי",
        meetingTime: "15:30-17:30",
        startDate: "22/02/2025",
        contactMade: "כן",
        syllabusStatus: "בעדכון",
        goals: "הכרת התקופות החשובות בהיסטוריה דרך סיפורים מרתקים, פיתוח הבנה היסטורית, חיבור בין עבר להווה, פיתוח חשיבה ביקורתית על אירועים היסטוריים."
    },
    solution6: {
        title: "למידה רגשית חברתית",
        id: "006",
        instructor: "ד\"ר עינת שמש",
        lecturer: "ד\"ר מירב שלום",
        educationLevel: "חינוך מיוחד",
        subject: "כישורי חיים",
        hours: "50 שעות",
        learningMode: "היברידי",
        meetingDay: "ראשון ורביעי",
        meetingTime: "14:00-16:00",
        startDate: "05/03/2025",
        contactMade: "כן",
        syllabusStatus: "סילבוס מותאם",
        goals: "פיתוח כישורים רגשיים וחברתיים, חיזוק הביטחון העצמי, למידת דרכי התמודדות עם קשיים, פיתוח יכולות תקשורת ואמפתיה בסביבה תומכת ומותאמת."
    }
};

// מיפוי תמונות לפי תחום
const subjectImages = {
    'מתמטיקה': 'assets/images/math.png',
    'שפה עברית': 'https://cdn.pixabay.com/photo/2016/03/27/07/32/book-1282309_1280.png',
    'מדעים': 'https://cdn.pixabay.com/photo/2017/09/21/19/06/light-bulb-2773406_1280.png',
    'אנגלית': 'https://cdn.pixabay.com/photo/2014/04/02/10/45/flag-303952_1280.png',
    'היסטוריה': 'assets/images/history.png',
    'כישורי חיים': 'https://cdn.pixabay.com/photo/2017/03/05/00/34/puzzle-2117946_1280.png'
};

// פונקציות ניהול Modal
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // בדיקת פרטי התחברות
    if (username === 'Pisga' && password === 'Sara@2203') {
        alert('התחברת בהצלחה! מעביר לממשק הניהול...');
        closeLoginModal();
        // מעבר לעמוד הניהול
        window.location.href = 'admin.html?user=super-admin';
    } else {
        // בדיקה אם זה מדריך פדגוגי (לדוגמה)
        if (username === 'instructor1' && password === 'pass123') {
            alert('התחברת בהצלחה! מעביר לממשק הניהול...');
            closeLoginModal();
            window.location.href = 'admin.html?user=instructor&name=' + encodeURIComponent(username);
        } else {
            alert('שם משתמש או סיסמה שגויים. נסה שוב.');
        }
    }
}

// פונקציית סינון
function filterSolutions() {
    const searchInput = document.querySelector('.search-input').value.toLowerCase();
    const ageFilter = document.querySelectorAll('.filter-select')[0].value;
    const subjectFilter = document.querySelectorAll('.filter-select')[1].value;
    const typeFilter = document.querySelectorAll('.filter-select')[2].value;
    
    const solutions = document.querySelectorAll('.solution-card');
    let visibleCount = 0;
    
    solutions.forEach(solution => {
        const title = solution.querySelector('.solution-title').textContent.toLowerCase();
        const instructorName = solution.querySelector('.detail-value').textContent.toLowerCase();
        const age = solution.getAttribute('data-age');
        const subject = solution.getAttribute('data-subject');
        const type = solution.getAttribute('data-type');
        
        const matchesSearch = title.includes(searchInput) || instructorName.includes(searchInput);
        const matchesAge = !ageFilter || age === ageFilter;
        const matchesSubject = !subjectFilter || subject === subjectFilter;
        const matchesType = !typeFilter || type === typeFilter;
        
        if (matchesSearch && matchesAge && matchesSubject && matchesType) {
            solution.style.display = 'block';
            solution.style.animation = 'fadeIn 0.5s ease-in';
            visibleCount++;
        } else {
            solution.style.display = 'none';
        }
    });
    
    // הצגת הודעה אם לא נמצאו תוצאות
    updateSearchResults(visibleCount);
}

function updateSearchResults(count) {
    let existingMessage = document.getElementById('search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (count === 0) {
        const message = document.createElement('div');
        message.id = 'search-results-message';
        message.style.cssText = `
            text-align: center;
            padding: 40px;
            color: #718096;
            font-size: 1.2rem;
            grid-column: 1 / -1;
        `;
        message.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
            <h3>לא נמצאו תוצאות</h3>
            <p>נסה לשנות את קריטריוני החיפוש או הסנן</p>
        `;
        document.getElementById('solutions-list').appendChild(message);
    }
}

function toggleAdvancedSearch() {
    alert('חיפוש מתקדם יפותח בגרסאות עתידיות של המערכת');
}

// פונקציה לטעינת תמונות מתאימות
function loadSubjectImages() {
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        const subject = card.getAttribute('data-subject');
        const imageElement = card.querySelector('.subject-image');
        
        if (imageElement && subjectImages[subject]) {
            imageElement.src = subjectImages[subject];
            imageElement.onerror = function() {
                // אם התמונה לא נטענת, נציג איקון ברירת מחדל
                this.style.display = 'none';
                const parent = this.parentElement;
                parent.style.fontSize = '3rem';
                parent.style.color = 'white';
                
                // איקונים לפי תחום
                const icons = {
                    'מתמטיקה': '🔢',
                    'שפה עברית': '✍️',
                    'מדעים': '🔬',
                    'אנגלית': '🌍',
                    'היסטוריה': '📜',
                    'כישורי חיים': '🎨'
                };
                
                parent.textContent = icons[subject] || '📚';
            };
        }
    });
}

// פונקציות אדמין (Admin Functions)
let currentUser = {
    username: 'Pisga',
    role: 'super-admin', // 'instructor' or 'super-admin'
    name: 'Pisga',
    avatar: 'P'
};

// Initialize the admin system
function initSystem() {
    loadUserInterface();
    loadNavigationTabs();
}

// Load user interface based on role
function loadUserInterface() {
    const userRole = document.getElementById('user-role');
    const dashboardSubtitle = document.getElementById('dashboard-subtitle');
    
    if (currentUser.role === 'super-admin') {
        userRole.textContent = 'מנהל-על';
        dashboardSubtitle.textContent = 'מערכת ניהול מתקדמת - גישה מלאה';
        showSuperAdminDashboard();
    } else {
        userRole.textContent = 'מדריך פדגוגי';
        dashboardSubtitle.textContent = 'ניהול פתרונות למידה אישיים';
        showInstructorDashboard();
    }
}

// Load navigation tabs based on user role
function loadNavigationTabs() {
    const navTabs = document.getElementById('nav-tabs');
    
    if (currentUser.role === 'super-admin') {
        navTabs.innerHTML = `
            <div class="nav-tab active" onclick="showSuperAdminDashboard()">
                🏠 דף הבית
            </div>
            <div class="nav-tab" onclick="showAllSolutions()">
                📋 כל הפתרונות
            </div>
            <div class="nav-tab" onclick="showSystemSettings()">
                ⚙️ הגדרות מערכת
            </div>
            <div class="nav-tab" onclick="showReports()">
                📊 דוחות
            </div>
            <div class="nav-tab" onclick="showUserManagement()">
                👥 ניהול משתמשים
            </div>
        `;
    } else {
        navTabs.innerHTML = `
            <div class="nav-tab active" onclick="showInstructorDashboard()">
                🏠 דף הבית
            </div>
            <div class="nav-tab" onclick="showMySolutions()">
                📚 הפתרונות שלי
            </div>
            <div class="nav-tab" onclick="showAddSolutionForm()">
                ➕ פתרון חדש
            </div>
            <div class="nav-tab" onclick="showMyReports()">
                📊 הדוחות שלי
            </div>
        `;
    }
}

// Navigation functions
function showTab(tabId) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

function showSuperAdminDashboard() {
    showTab('super-admin-dashboard');
    setActiveNavTab(0);
}

function showInstructorDashboard() {
    showTab('instructor-dashboard');
    setActiveNavTab(0);
}

function showAddSolutionForm() {
    showTab('add-solution-form');
    setActiveNavTab(2);
}

function showMySolutions() {
    showTab('instructor-dashboard');
    setActiveNavTab(1);
    // Scroll to solutions table
    setTimeout(() => {
        const solutionsTable = document.querySelector('.solutions-table');
        if (solutionsTable) {
            solutionsTable.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
}

function setActiveNavTab(index) {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    if (navTabs[index]) {
        navTabs[index].classList.add('active');
    }
}

// Module management functions
function openModule(moduleId) {
    alert(`פתיחת מודול: ${moduleId}\nהמודול יפותח בגרסאות עתידיות של המערכת`);
}

// Solution management functions
function saveSolution(event) {
    event.preventDefault();
    
    // Basic validation
    const form = event.target;
    const formData = new FormData(form);
    
    // Show success message
    alert('הפתרון נשמר בהצלחה! 🎉\nהפתרון יופיע ברשימת הפתרונות שלך');
    
    // Reset form and return to dashboard
    form.reset();
    showInstructorDashboard();
}

function saveDraft() {
    alert('הטיוטה נשמרה בהצלחה! 📝\nתוכל להמשיך לערוך אותה מאוחר יותר');
}

function exportMySolutions() {
    alert('ייצוא פתרונות הלמידה:\n\n📄 PDF - מעד להדפסה\n📊 Excel - לעיבוד נתונים\n🖨️ הדפסה - ישירות למדפסת');
}

// System functions
function logout() {
    if (confirm('האם אתה בטוח שברצונך לצאת מהמערכת?')) {
        alert('יוצא מהמערכת...');
        window.location.href = 'index.html';
    }
}

// Placeholder functions for Super Admin features
function showAllSolutions() {
    alert('מודול כל הפתרונות יפותח בגרסאות עתידיות');
}

function showSystemSettings() {
    alert('הגדרות המערכת יפותחו בגרסאות עתידיות');
}

function showReports() {
    alert('מודול הדוחות יפותח בגרסאות עתידיות');
}

function showUserManagement() {
    alert('מודול ניהול המשתמשים יפותח בגרסאות עתידיות');
}

function showMyReports() {
    alert('הדוחות האישיים יפותחו בגרסאות עתידיות');
}

// Demo function to switch user role (for testing)
function switchUserRole() {
    if (currentUser.role === 'super-admin') {
        currentUser = {
            username: 'instructor1',
            role: 'instructor',
            name: 'ד"ר רחל כהן',
            avatar: 'ר'
        };
    } else {
        currentUser = {
            username: 'Pisga',
            role: 'super-admin',
            name: 'Pisga',
            avatar: 'P'
        };
    }
    
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) userNameElement.textContent = currentUser.name;
    if (userAvatarElement) userAvatarElement.textContent = currentUser.avatar;
    
    initSystem();
}

// סגירת Modal בלחיצה מחוץ לתוכן
window.onclick = function(event) {
    const modal = document.getElementById('solutionModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

// אפקטים אינטראקטיביים ואתחול
document.addEventListener('DOMContentLoaded', function() {
    // טעינת תמונות לפי תחום
    loadSubjectImages();
    
    // Initialize admin system if on admin page
    if (window.location.pathname.includes('admin.html')) {
        initSystem();
    }
    
    // אפקט hover על כרטיסים
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // אפקט על כפתורים
    const buttons = document.querySelectorAll('.login-btn, .advanced-search-btn, .modal-btn, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // אפקט ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // אנימציה לכרטיסים בעת טעינה
    solutionCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
    });

    // אפקטים על כרטיסי אדמין
    const adminCards = document.querySelectorAll('.action-card, .module-card');
    adminCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // טעינת פרמטרים מה-URL (עבור דף האדמין)
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const nameParam = urlParams.get('name');
    
    if (userParam) {
        if (userParam === 'super-admin') {
            currentUser.role = 'super-admin';
            currentUser.name = 'Pisga';
            currentUser.avatar = 'P';
        } else if (userParam === 'instructor') {
            currentUser.role = 'instructor';
            currentUser.name = nameParam || 'מדריך';
            currentUser.avatar = currentUser.name.charAt(0);
        }
        
        // עדכון ממשק המשתמש
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) userNameElement.textContent = currentUser.name;
        if (userAvatarElement) userAvatarElement.textContent = currentUser.avatar;
    }
});

// פונקציות חיפוש מתקדמות
function advancedSearch() {
    // יצירת חלון חיפוש מתקדם
    const advancedSearchHTML = `
        <div class="advanced-search-modal" id="advancedSearchModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>חיפוש מתקדם</h3>
                    <span class="close" onclick="closeAdvancedSearch()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>טווח שעות</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="number" placeholder="מ-" min="0" max="200">
                                <input type="number" placeholder="עד" min="0" max="200">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>מנחה</label>
                            <input type="text" placeholder="שם המנחה">
                        </div>
                        <div class="form-group">
                            <label>תאריך יצירה</label>
                            <input type="date">
                        </div>
                        <div class="form-group">
                            <label>סטטוס</label>
                            <select>
                                <option value="">כל הסטטוסים</option>
                                <option value="active">פעיל</option>
                                <option value="draft">טיוטה</option>
                                <option value="hidden">מוסתר</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn" onclick="performAdvancedSearch()">חפש</button>
                    <button class="btn btn-secondary" onclick="closeAdvancedSearch()">ביטול</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', advancedSearchHTML);
    document.getElementById('advancedSearchModal').style.display = 'block';
}

function closeAdvancedSearch() {
    const modal = document.getElementById('advancedSearchModal');
    if (modal) {
        modal.remove();
    }
}

function performAdvancedSearch() {
    // כאן יתבצע החיפוש המתקדם
    alert('החיפוש המתקדם יפותח בגרסאות עתידיות');
    closeAdvancedSearch();
}

// פונקציות ניהול נתונים
function exportData(format) {
    const data = {
        solutions: Object.values(solutionsData),
        exportDate: new Date().toISOString(),
        totalSolutions: Object.keys(solutionsData).length
    };
    
    if (format === 'json') {
        const dataStr = JSON.stringify(data, null, 2);
        downloadFile(dataStr, 'solutions-data.json', 'application/json');
    } else if (format === 'csv') {
        const csvData = convertToCSV(data.solutions);
        downloadFile(csvData, 'solutions-data.csv', 'text/csv');
    }
}

function convertToCSV(data) {
    const headers = ['ID', 'Title', 'Instructor', 'Lecturer', 'Education Level', 'Subject', 'Hours', 'Learning Mode'];
    const csvRows = [headers.join(',')];
    
    data.forEach(solution => {
        const row = [
            solution.id,
            `"${solution.title}"`,
            `"${solution.instructor}"`,
            `"${solution.lecturer}"`,
            `"${solution.educationLevel}"`,
            `"${solution.subject}"`,
            `"${solution.hours}"`,
            `"${solution.learningMode}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// פונקציות אנימציה
function animateElement(element, animationType = 'fadeIn') {
    element.style.animation = `${animationType} 0.5s ease-in-out`;
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// פונקציות תפעול כלליות
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e53e3e';
            field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
            isValid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
            field.style.boxShadow = '';
        }
    });
    
    return isValid;
}

function resetForm(form) {
    form.reset();
    
    // איפוס עיצוב שגיאות
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '#e2e8f0';
        field.style.boxShadow = '';
    });
}

// פונקציות שיתוף
function shareData(data, title = 'פתרון למידה') {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `צפה בפתרון הלמידה: ${data.title}`,
            url: window.location.href
        });
    } else {
        // Fallback לדפדפנים שלא תומכים
        const textArea = document.createElement('textarea');
        textArea.value = `${title}: ${data.title}\n${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('הקישור הועתק ללוח!', 'success');
    }
}

// פונקציות עזר
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// הוספת debounce לחיפוש
const debouncedFilter = debounce(filterSolutions, 300);

// עדכון פונקציית הקלדה בחיפוש
function setupSearchListeners() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedFilter);
    }
}

// הוספת listeners נוספים לטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    setupSearchListeners();
    
    // הוספת keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K לפתיחת חיפוש
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape לסגירת modals
        if (e.key === 'Escape') {
            closeModal();
            closeLoginModal();
            closeAdvancedSearch();
        }
    });
});

// עדכון פונקציית toggleAdvancedSearch
function toggleAdvancedSearch() {
    advancedSearch();
} openModal(solutionId) {
    const solution = solutionsData[solutionId];
    if (!solution) return;

    document.getElementById('modalTitle').textContent = solution.title;
    document.getElementById('modalSubtitle').textContent = `פתרון למידה מס' ${solution.id}`;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-section">
            <h3>פרטי הפתרון</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>מדריך פדגוגי:</strong>
                    <span>${solution.instructor}</span>
                </div>
                <div class="detail-item">
                    <strong>מנחה:</strong>
                    <span>${solution.lecturer}</span>
                </div>
                <div class="detail-item">
                    <strong>שלב חינוך:</strong>
                    <span>${solution.educationLevel}</span>
                </div>
                <div class="detail-item">
                    <strong>תחום דעת:</strong>
                    <span>${solution.subject}</span>
                </div>
                <div class="detail-item">
                    <strong>היקף שעות אקדמאיות:</strong>
                    <span>${solution.hours}</span>
                </div>
                <div class="detail-item">
                    <strong>אופן למידה:</strong>
                    <span>${solution.learningMode}</span>
                </div>
                <div class="detail-item">
                    <strong>יום מפגש:</strong>
                    <span>${solution.meetingDay}</span>
                </div>
                <div class="detail-item">
                    <strong>שעות מפגש:</strong>
                    <span>${solution.meetingTime}</span>
                </div>
                <div class="detail-item">
                    <strong>תאריך התחלה:</strong>
                    <span>${solution.startDate}</span>
                </div>
                <div class="detail-item">
                    <strong>קשר עם מנחה:</strong>
                    <span>${solution.contactMade}</span>
                </div>
                <div class="detail-item">
                    <strong>סטטוס סילבוס:</strong>
                    <span>${solution.syllabusStatus}</span>
                </div>
            </div>
        </div>
        
        <div class="goals-section">
            <h4>🎯 מטרות הלמידה</h4>
            <p>${solution.goals}</p>
        </div>
        
        <div class="detail-section">
            <h3>מידע נוסף</h3>
            <p style="color: #4a5568; line-height: 1.8;">
                פתרון למידה זה פותח במיוחד עבור מערכת החינוך הישראלית ומותאם לצרכים הספציפיים של שלב החינוך הרלוונטי. 
                הפתרון כולל שילוב של תיאוריה ופרקטיקה, עם דגש על למידה משמעותית וחוויתית.
                כל השעות האקדמיות במסגרת הפתרון מוכרות לגמול ע"פ תקנות משרד החינוך.
            </p>
        </div>
    `;
    
    document.getElementById('solutionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('solutionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function printModal() {
    window.print();
}

function saveAsPDF() {
    // בפעולה אמיתית כאן יהיה קוד ליצירת PDF
    alert('שמירה כקובץ PDF בתהליך... הקובץ יישמר בהורדות.');
}

// פונקציות Login
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}
