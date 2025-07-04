/**
 * ממשק קדמי למידע כללי של האתר
 * site-info-frontend.js
 * 
 * מספק ממשק משתמש לניהול מידע כללי
 * עובד עם site-info-backend.js
 */

class SiteInfoFrontend {
    constructor() {
        this.backend = window.siteInfoBackend;
        this.currentData = null;
        this.isEditing = false;
        this.init();
    }

    /**
     * אתחול הממשק
     */
    async init() {
        await this.loadSiteInfo();
        this.setupEventListeners();
        this.applyGlobalSiteInfo();
        console.log('✅ ממשק מידע כללי נטען בהצלחה');
    }

    /**
     * הגדרת מאזיני אירועים
     */
    setupEventListeners() {
        // כפתור עריכה
        const editBtn = document.getElementById('edit-site-info-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.showEditModal());
        }

        // כפתור הגדרות מערכת
        const settingsBtn = document.getElementById('system-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSystemSettings());
        }

        // כפתור פרטי קשר
        const contactBtn = document.getElementById('contact-info-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => this.showContactModal());
        }

// כפתור ייצוא
        const exportBtn = document.getElementById('export-site-info-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSiteInfo());
        }

        // כפתור ייבוא
        const importBtn = document.getElementById('import-site-info-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        // כפתור מצב תחזוקה
        const maintenanceBtn = document.getElementById('maintenance-mode-btn');
        if (maintenanceBtn) {
            maintenanceBtn.addEventListener('click', () => this.toggleMaintenanceMode());
        }

        // רענון אוטומטי
        setInterval(() => {
            this.refreshSiteInfo();
        }, 5 * 60 * 1000); // כל 5 דקות
    }

    /**
     * טעינת מידע כללי
     */
    async loadSiteInfo() {
        try {
            const result = await this.backend.getAllSiteInfo();
            
            if (result.success) {
                this.currentData = result.data;
                this.displaySiteInfo();
                this.updateStatus();
            } else {
                this.showError('שגיאה בטעינת מידע כללי: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת מידע כללי: ' + error.message);
        }
    }

    /**
     * הצגת מידע כללי
     */
    displaySiteInfo() {
        if (!this.currentData) return;

        const { siteInfo, additionalInfo } = this.currentData;
        
        // עדכון כרטיסי מידע
        this.updateInfoCards(siteInfo, additionalInfo);
        
        // עדכון פרטי קשר
        this.updateContactDisplay(siteInfo);
        
        // עדכון הגדרות מערכת
        this.updateSystemDisplay(siteInfo, additionalInfo);
        
        // עדכון שעות פעילות
        this.updateWorkingHoursDisplay(siteInfo.workingHours);
    }

    /**
     * עדכון כרטיסי מידע
     */
    updateInfoCards(siteInfo, additionalInfo) {
        const cardsContainer = document.getElementById('site-info-cards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = `
            <div class="info-cards-grid">
                <div class="info-card">
                    <div class="card-icon">🏛️</div>
                    <div class="card-content">
                        <h3>מידע כללי</h3>
                        <p><strong>כותרת:</strong> ${siteInfo.title}</p>
                        <p><strong>שנת לימודים:</strong> ${siteInfo.academicYear}</p>
                        <p><strong>גרסה:</strong> ${additionalInfo.version}</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="card-icon">📞</div>
                    <div class="card-content">
                        <h3>פרטי קשר</h3>
                        <p><strong>טלפון:</strong> ${siteInfo.phone}</p>
                        <p><strong>מייל:</strong> ${siteInfo.email}</p>
                        <p><strong>כתובת:</strong> ${siteInfo.address}</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="card-icon">⏰</div>
                    <div class="card-content">
                        <h3>שעות פעילות</h3>
                        <p><strong>היום:</strong> ${this.getTodayHours(siteInfo.workingHours)}</p>
                        <p><strong>סטטוס:</strong> ${this.getOpenStatus(siteInfo.workingHours)}</p>
                    </div>
                </div>

                <div class="info-card">
                    <div class="card-icon">🔧</div>
                    <div class="card-content">
                        <h3>מצב מערכת</h3>
                        <p><strong>תחזוקה:</strong> ${additionalInfo.maintenanceMode ? 'מופעל' : 'כבוי'}</p>
                        <p><strong>שפה:</strong> ${additionalInfo.defaultLanguage}</p>
                        <p><strong>עדכון אחרון:</strong> ${new Date(siteInfo.lastUpdate).toLocaleDateString('he-IL')}</p>
                    </div>
                </div>
            </div>
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
}

// יצירת instance גלובלי
const siteInfoFrontend = new SiteInfoFrontend();

// ייצוא לשימוש במודולים אחרים
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteInfoFrontend;
}

// הוספה לחלון הגלובלי
if (typeof window !== 'undefined') {
    window.SiteInfoFrontend = SiteInfoFrontend;
    window.siteInfoFrontend = siteInfoFrontend;
}

console.log('✅ ממשק מידע כללי נטען בהצלחה');
    }

    /**
     * עדכון תצוגת פרטי קשר
     */
    updateContactDisplay(siteInfo) {
        const contactSection = document.getElementById('contact-info-section');
        if (!contactSection) return;

        contactSection.innerHTML = `
            <div class="contact-info">
                <h3>פרטי קשר</h3>
                <div class="contact-details">
                    <div class="contact-item">
                        <strong>📞 טלפון:</strong>
                        <a href="tel:${siteInfo.phone}">${siteInfo.phone}</a>
                    </div>
                    <div class="contact-item">
                        <strong>📧 מייל:</strong>
                        <a href="mailto:${siteInfo.email}">${siteInfo.email}</a>
                    </div>
                    <div class="contact-item">
                        <strong>📍 כתובת:</strong>
                        <span>${siteInfo.address}</span>
                    </div>
                    <div class="contact-links">
                        <a href="${siteInfo.wazeLink}" target="_blank" class="btn btn-small">
                            🚗 וויז
                        </a>
                        <a href="${siteInfo.googleMapsLink}" target="_blank" class="btn btn-small">
                            🗺️ גוגל מפות
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * עדכון תצוגת שעות פעילות
     */
    updateWorkingHoursDisplay(workingHours) {
        const hoursSection = document.getElementById('working-hours-section');
        if (!hoursSection) return;

        const daysInHebrew = {
            sunday: 'ראשון',
            monday: 'שני',
            tuesday: 'שלישי',
            wednesday: 'רביעי',
            thursday: 'חמישי',
            friday: 'שישי',
            saturday: 'שבת'
        };

        let hoursHTML = '<div class="working-hours"><h3>שעות פעילות</h3>';
        
        for (const [day, hours] of Object.entries(workingHours)) {
            const dayName = daysInHebrew[day];
            const isToday = this.isToday(day);
            
            hoursHTML += `
                <div class="hours-item ${isToday ? 'today' : ''}">
                    <span class="day">${dayName}</span>
                    <span class="hours">${hours}</span>
                </div>
            `;
        }
        
        hoursHTML += '</div>';
        hoursSection.innerHTML = hoursHTML;
    }

    /**
     * הצגת מודל עריכה
     */
    showEditModal() {
        const modal = this.createEditModal();
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * יצירת מודל עריכה
     */
    createEditModal() {
        const { siteInfo } = this.currentData;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'edit-site-info-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>עריכת מידע כללי</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="site-info-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">כותרת האתר *</label>
                                <input type="text" class="form-input" name="title" value="${siteInfo.title}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">שנת לימודים *</label>
                                <input type="text" class="form-input" name="academicYear" value="${siteInfo.academicYear}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">זכויות יוצרים</label>
                                <input type="text" class="form-input" name="copyright" value="${siteInfo.copyright}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">טלפון *</label>
                                <input type="tel" class="form-input" name="phone" value="${siteInfo.phone}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">מייל *</label>
                                <input type="email" class="form-input" name="email" value="${siteInfo.email}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">כתובת *</label>
                                <input type="text" class="form-input" name="address" value="${siteInfo.address}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">קישור וויז</label>
                                <input type="url" class="form-input" name="wazeLink" value="${siteInfo.wazeLink}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">קישור גוגל מפות</label>
                                <input type="url" class="form-input" name="googleMapsLink" value="${siteInfo.googleMapsLink}">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>שעות פעילות</h4>
                            <div class="working-hours-grid">
                                ${this.createWorkingHoursInputs(siteInfo.workingHours)}
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="siteInfoFrontend.saveSiteInfo()">
                        💾 שמור שינויים
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ❌ ביטול
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * יצירת שדות שעות פעילות
     */
    createWorkingHoursInputs(workingHours) {
        const daysInHebrew = {
            sunday: 'ראשון',
            monday: 'שני',
            tuesday: 'שלישי',
            wednesday: 'רביעי',
            thursday: 'חמישי',
            friday: 'שישי',
            saturday: 'שבת'
        };

        let html = '';
        for (const [day, hours] of Object.entries(workingHours)) {
            html += `
                <div class="working-hours-item">
                    <label class="form-label">${daysInHebrew[day]}</label>
                    <input type="text" class="form-input" name="workingHours_${day}" value="${hours}" placeholder="08:00-17:00 או 'סגור'">
                </div>
            `;
        }
        return html;
    }

    /**
     * שמירת מידע כללי
     */
    async saveSiteInfo() {
        try {
            const form = document.getElementById('site-info-form');
            const formData = new FormData(form);
            
            // הכנת נתונים לשמירה
            const siteInfoData = {
                title: formData.get('title'),
                academicYear: formData.get('academicYear'),
                copyright: formData.get('copyright'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                wazeLink: formData.get('wazeLink'),
                googleMapsLink: formData.get('googleMapsLink'),
                workingHours: {
                    sunday: formData.get('workingHours_sunday'),
                    monday: formData.get('workingHours_monday'),
                    tuesday: formData.get('workingHours_tuesday'),
                    wednesday: formData.get('workingHours_wednesday'),
                    thursday: formData.get('workingHours_thursday'),
                    friday: formData.get('workingHours_friday'),
                    saturday: formData.get('workingHours_saturday')
                }
            };

            const result = await this.backend.updateSiteInfo(siteInfoData);
            
            if (result.success) {
                this.showSuccess('מידע כללי עודכן בהצלחה!');
                this.closeModal();
                await this.loadSiteInfo();
                this.applyGlobalSiteInfo();
            } else {
                this.showError('שגיאה בעדכון מידע כללי: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בעדכון מידע כללי: ' + error.message);
        }
    }

    /**
     * הצגת הגדרות מערכת
     */
    async showSystemSettings() {
        try {
            const result = await this.backend.getSystemSettings();
            
            if (result.success) {
                this.displaySystemSettingsModal(result.data);
            } else {
                this.showError('שגיאה בטעינת הגדרות מערכת: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת הגדרות מערכת: ' + error.message);
        }
    }

    /**
     * הצגת מודל הגדרות מערכת
     */
    displaySystemSettingsModal(settings) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>הגדרות מערכת</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="system-settings-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">שפה ברירת מחדל</label>
                                <select class="form-select" name="language">
                                    <option value="he" ${settings.language === 'he' ? 'selected' : ''}>עברית</option>
                                    <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>ערבית</option>
                                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>אנגלית</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">אזור זמן</label>
                                <select class="form-select" name="timezone">
                                    <option value="Asia/Jerusalem" ${settings.timezone === 'Asia/Jerusalem' ? 'selected' : ''}>ישראל</option>
                                    <option value="Europe/London" ${settings.timezone === 'Europe/London' ? 'selected' : ''}>לונדון</option>
                                    <option value="America/New_York" ${settings.timezone === 'America/New_York' ? 'selected' : ''}>ניו יורק</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">מטבע</label>
                                <select class="form-select" name="currency">
                                    <option value="ILS" ${settings.currency === 'ILS' ? 'selected' : ''}>שקל חדש</option>
                                    <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>דולר אמריקאי</option>
                                    <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>יורו</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" name="maintenanceMode" ${settings.maintenanceMode ? 'checked' : ''}>
                                    מצב תחזוקה
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="siteInfoFrontend.saveSystemSettings()">
                        💾 שמור הגדרות
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ❌ ביטול
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * שמירת הגדרות מערכת
     */
    async saveSystemSettings() {
        try {
            const form = document.getElementById('system-settings-form');
            const formData = new FormData(form);
            
            const settings = {
                language: formData.get('language'),
                timezone: formData.get('timezone'),
                currency: formData.get('currency'),
                maintenanceMode: formData.has('maintenanceMode')
            };

            const result = await this.backend.updateSystemSettings(settings);
            
            if (result.success) {
                this.showSuccess('הגדרות מערכת עודכנו בהצלחה!');
                this.closeModal();
                await this.loadSiteInfo();
            } else {
                this.showError('שגיאה בעדכון הגדרות מערכת: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בעדכון הגדרות מערכת: ' + error.message);
        }
    }

    /**
     * ייצוא מידע כללי
     */
    async exportSiteInfo() {
        try {
            const result = await this.backend.exportSettings();
            
            if (result.success) {
                this.downloadFile(result.data, result.filename, 'application/json');
                this.showSuccess('מידע כללי יוצא בהצלחה!');
            } else {
                this.showError('שגיאה בייצוא מידע כללי: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בייצוא מידע כללי: ' + error.message);
        }
    }

    /**
     * הצגת מודל ייבוא
     */
    showImportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>ייבוא מידע כללי</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">בחר קובץ הגדרות (JSON)</label>
                        <input type="file" class="form-input" id="import-file" accept=".json">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="backup-current"> 
                            יצירת גיבוי לפני הייבוא
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="siteInfoFrontend.importSiteInfo()">
                        📥 ייבא
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ❌ ביטול
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * ייבוא מידע כללי
     */
    async importSiteInfo() {
        try {
            const fileInput = document.getElementById('import-file');
            const backupCurrent = document.getElementById('backup-current').checked;
            
            if (!fileInput.files.length) {
                this.showError('אנא בחר קובץ לייבוא');
                return;
            }

            // יצירת גיבוי אם נדרש
            if (backupCurrent) {
                await this.exportSiteInfo();
            }

            const file = fileInput.files[0];
            const content = await this.readFile(file);
            
            const result = await this.backend.importSettings(content);
            
            if (result.success) {
                this.showSuccess('מידע כללי יובא בהצלחה!');
                this.closeModal();
                await this.loadSiteInfo();
                this.applyGlobalSiteInfo();
            } else {
                this.showError('שגיאה בייבוא מידע כללי: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בייבוא מידע כללי: ' + error.message);
        }
    }

    /**
     * קריאת קובץ
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * הפעלה/כיבוי מצב תחזוקה
     */
    async toggleMaintenanceMode() {
        try {
            const result = await this.backend.isMaintenanceMode();
            
            if (result.success) {
                const currentMode = result.data;
                const newMode = !currentMode;
                
                const confirmMessage = newMode 
                    ? 'האם אתה בטוח שברצונך להפעיל מצב תחזוקה?'
                    : 'האם אתה בטוח שברצונך לבטל מצב תחזוקה?';
                
                if (confirm(confirmMessage)) {
                    const toggleResult = await this.backend.toggleMaintenanceMode(newMode);
                    
                    if (toggleResult.success) {
                        this.showSuccess(toggleResult.message);
                        await this.loadSiteInfo();
                    } else {
                        this.showError('שגיאה בשינוי מצב תחזוקה: ' + toggleResult.error);
                    }
                }
            }
        } catch (error) {
            this.showError('שגיאה בשינוי מצב תחזוקה: ' + error.message);
        }
    }

    /**
     * החלת מידע כללי על כל האתר
     */
    applyGlobalSiteInfo() {
        if (!this.currentData) return;

        const { siteInfo } = this.currentData;
        
        // עדכון כותרת העמוד
        document.title = siteInfo.title;
        
        // עדכון כל הכותרות באתר
        const titleElements = document.querySelectorAll('.site-title');
        titleElements.forEach(el => {
            el.textContent = siteInfo.title;
        });

        // עדכון פרטי קשר בכל האתר
        const phoneElements = document.querySelectorAll('.site-phone');
        phoneElements.forEach(el => {
            el.textContent = siteInfo.phone;
            el.href = `tel:${siteInfo.phone}`;
        });

        const emailElements = document.querySelectorAll('.site-email');
        emailElements.forEach(el => {
            el.textContent = siteInfo.email;
            el.href = `mailto:${siteInfo.email}`;
        });

        // עדכון זכויות יוצרים
        const copyrightElements = document.querySelectorAll('.site-copyright');
        copyrightElements.forEach(el => {
            el.textContent = siteInfo.copyright;
        });

        // עדכון שנת לימודים
        const academicYearElements = document.querySelectorAll('.academic-year');
        academicYearElements.forEach(el => {
            el.textContent = siteInfo.academicYear;
        });
    }

    /**
     * רענון מידע כללי
     */
    async refreshSiteInfo() {
        try {
            await this.loadSiteInfo();
            this.applyGlobalSiteInfo();
        } catch (error) {
            console.error('שגיאה ברענון מידע כללי:', error);
        }
    }

    /**
     * עדכון סטטוס
     */
    updateStatus() {
        const statusElement = document.getElementById('site-status');
        if (!statusElement) return;

        const { additionalInfo } = this.currentData;
        const isMaintenanceMode = additionalInfo.maintenanceMode;
        
        statusElement.innerHTML = `
            <div class="status-indicator ${isMaintenanceMode ? 'maintenance' : 'normal'}">
                <span class="status-dot"></span>
                <span class="status-text">
                    ${isMaintenanceMode ? 'מצב תחזוקה' : 'מערכת פעילה'}
                </span>
            </div>
        `;
    }

    /**
     * קבלת שעות היום
     */
    getTodayHours(workingHours) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayMap = {
            sunday: 'sunday',
            monday: 'monday',
            tuesday: 'tuesday',
            wednesday: 'wednesday',
            thursday: 'thursday',
            friday: 'friday',
            saturday: 'saturday'
        };
        
        return workingHours[dayMap[today]] || 'לא מוגדר';
    }

    /**
     * קבלת סטטוס פתוח/סגור
     */
    getOpenStatus(workingHours) {
        const isOpen = this.backend.isCurrentlyOpen(workingHours);
        return isOpen ? '🟢 פתוח' : '🔴 סגור';
    }

    /**
     * בדיקה האם היום הנוכחי
     */
    isToday(day) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return day === today;
    }

    /**
     * הורדת קובץ
     */
    downloadFile(content, filename, contentType) {
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

    /**
     * סגירת מודל
     */
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    }

    /**
     * הצגת הודעת שגיאה
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * הצגת הודעת הצלחה
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * הצגת הודעה
     */
    showNotification(message, type = 'info') {
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
        /**
 * ממשק קדמי למידע כללי של האתר
 * site-info-frontend.js
 * 
 * מספק ממשק משתמש לניהול מידע כללי
 * עובד עם site-info-backend.js
 */

class SiteInfoFrontend {
    constructor() {
        this.backend = window.siteInfoBackend;
        this.currentData = null;
        this.isEditing = false;
        this.init();
    }

    /**
     * אתחול הממשק
     */
    async init() {
        await this.loadSiteInfo();
        this.setupEventListeners();
        this.applyGlobalSiteInfo();
        console.log('✅ ממשק מידע כללי נטען בהצלחה');
    }

    /**
     * הגדרת מאזיני אירועים
     */
    setupEventListeners() {
        // כפתור עריכה
        const editBtn = document.getElementById('edit-site-info-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.showEditModal());
        }

        // כפתור הגדרות מערכת
        const settingsBtn = document.getElementById('system-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSystemSettings());
        }

        // כפתור פרטי קשר
        const contactBtn = document.getElementById('contact-info-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => this.showContactModal());
        }
