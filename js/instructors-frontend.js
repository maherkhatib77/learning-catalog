/**
 * ממשק קדמי לניהול מדריכים פדגוגיים
 * instructors-frontend.js
 * 
 * מספק ממשק משתמש לניהול מדריכים
 * עובד עם instructors-backend.js
 */

class InstructorsFrontend {
    constructor() {
        this.backend = window.instructorsBackend;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilters = {};
        this.selectedInstructors = [];
        this.init();
    }

    /**
     * אתחול הממשק
     */
    async init() {
        this.setupEventListeners();
        await this.loadInstructors();
        this.loadStats();
        console.log('✅ ממשק מדריכים נטען בהצלחה');
    }

    /**
     * הגדרת מאזיני אירועים
     */
    setupEventListeners() {
        // כפתור הוספת מדריך
        const addBtn = document.getElementById('add-instructor-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddModal());
        }

        // כפתור חיפוש
        const searchBtn = document.getElementById('search-instructors-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        // שדה חיפוש
        const searchInput = document.getElementById('instructor-search');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // סינון לפי סטטוס
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }

        // סינון לפי תפקיד
        const roleFilter = document.getElementById('role-filter');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.applyFilters());
        }

        // ייצוא
        const exportBtn = document.getElementById('export-instructors-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }

        // ייבוא
        const importBtn = document.getElementById('import-instructors-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        // רענון
        const refreshBtn = document.getElementById('refresh-instructors-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadInstructors());
        }
    }

    /**
     * טעינת רשימת מדריכים
     */
    async loadInstructors() {
        try {
            this.showLoading();

            const filters = {
                ...this.currentFilters,
                page: this.currentPage,
                limit: this.itemsPerPage
            };

            const result = await this.backend.getAllInstructors(filters);
            
            if (result.success) {
                this.displayInstructors(result.data);
                this.updatePagination(result.total, result.filtered);
            } else {
                this.showError('שגיאה בטעינת המדריכים: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת המדריכים: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * הצגת רשימת מדריכים
     */
    displayInstructors(instructors) {
        const container = document.getElementById('instructors-list');
        if (!container) return;

        if (instructors.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        const html = `
            <div class="instructors-table">
                <div class="table-header">
                    <div class="table-controls">
                        <button class="btn btn-small" onclick="instructorsFrontend.selectAll()">
                            <input type="checkbox" id="select-all"> בחר הכל
                        </button>
                        <button class="btn btn-small btn-danger" onclick="instructorsFrontend.bulkDelete()">
                            מחק נבחרים
                        </button>
                    </div>
                </div>
                <div class="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" id="select-all-checkbox"></th>
                                <th>ID</th>
                                <th>שם מלא</th>
                                <th>מספר זהות</th>
                                <th>מייל</th>
                                <th>טלפון</th>
                                <th>שם משתמש</th>
                                <th>תפקיד</th>
                                <th>סטטוס</th>
                                <th>תאריך יצירה</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${instructors.map(instructor => this.getInstructorRow(instructor)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.setupTableEventListeners();
    }

    /**
     * יצירת שורת מדריך
     */
    getInstructorRow(instructor) {
        const statusClass = this.getStatusClass(instructor.status);
        const roleText = this.getRoleText(instructor.role);
        const statusText = this.getStatusText(instructor.status);

        return `
            <tr data-instructor-id="${instructor.id}">
                <td>
                    <input type="checkbox" class="instructor-checkbox" value="${instructor.id}">
                </td>
                <td>${instructor.id}</td>
                <td>
                    <div class="instructor-info">
                        <div class="instructor-avatar">
                            ${instructor.firstName.charAt(0)}${instructor.lastName.charAt(0)}
                        </div>
                        <div class="instructor-details">
                            <strong>${instructor.firstName} ${instructor.lastName}</strong>
                        </div>
                    </div>
                </td>
                <td>${instructor.idNumber}</td>
                <td>
                    <a href="mailto:${instructor.email}" class="email-link">
                        ${instructor.email}
                    </a>
                </td>
                <td>
                    <a href="tel:${instructor.phone}" class="phone-link">
                        ${instructor.phone}
                    </a>
                </td>
                <td>
                    <code>${instructor.username}</code>
                </td>
                <td>
                    <span class="role-badge role-${instructor.role}">
                        ${roleText}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td>
                    ${new Date(instructor.createdDate).toLocaleDateString('he-IL')}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-small" onclick="instructorsFrontend.viewInstructor(${instructor.id})" title="צפייה">
                            👁️
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="instructorsFrontend.editInstructor(${instructor.id})" title="עריכה">
                            ✏️
                        </button>
                        <button class="btn btn-small btn-danger" onclick="instructorsFrontend.deleteInstructor(${instructor.id})" title="מחיקה">
                            🗑️
                        </button>
                        <div class="dropdown">
                            <button class="btn btn-small dropdown-toggle" onclick="instructorsFrontend.toggleDropdown(${instructor.id})">
                                ⚙️
                            </button>
                            <div class="dropdown-menu" id="dropdown-${instructor.id}">
                                <a href="#" onclick="instructorsFrontend.resetPassword(${instructor.id})">איפוס סיסמה</a>
                                <a href="#" onclick="instructorsFrontend.toggleStatus(${instructor.id})">שינוי סטטוס</a>
                                <a href="#" onclick="instructorsFrontend.viewActivity(${instructor.id})">היסטוריית פעילות</a>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * הגדרת מאזיני אירועים לטבלה
     */
    setupTableEventListeners() {
        // בחירת הכל
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.instructor-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                this.updateSelectedInstructors();
            });
        }

        // בחירה יחידה
        const checkboxes = document.querySelectorAll('.instructor-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectedInstructors();
            });
        });
    }

    /**
     * עדכון רשימת מדריכים נבחרים
     */
    updateSelectedInstructors() {
        const checkboxes = document.querySelectorAll('.instructor-checkbox:checked');
        this.selectedInstructors = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        // עדכון UI
        const bulkActions = document.querySelector('.bulk-actions');
        if (bulkActions) {
            bulkActions.style.display = this.selectedInstructors.length > 0 ? 'block' : 'none';
        }
    }

    /**
     * הצגת מודל הוספת מדריך
     */
    showAddModal() {
        const modal = this.createInstructorModal();
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * יצירת מודל מדריך
     */
    createInstructorModal(instructor = null) {
        const isEdit = instructor !== null;
        const modalId = isEdit ? 'edit-instructor-modal' : 'add-instructor-modal';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = modalId;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEdit ? 'עריכת מדריך' : 'הוספת מדריך חדש'}</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="instructor-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">שם פרטי *</label>
                                <input type="text" class="form-input" name="firstName" value="${instructor?.firstName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">שם משפחה *</label>
                                <input type="text" class="form-input" name="lastName" value="${instructor?.lastName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">מספר זהות *</label>
                                <input type="text" class="form-input" name="idNumber" value="${instructor?.idNumber || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">כתובת מייל *</label>
                                <input type="email" class="form-input" name="email" value="${instructor?.email || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">מספר טלפון *</label>
                                <input type="tel" class="form-input" name="phone" value="${instructor?.phone || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">שם משתמש *</label>
                                <input type="text" class="form-input" name="username" value="${instructor?.username || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">סיסמה ${isEdit ? '' : '*'}</label>
                                <input type="password" class="form-input" name="password" ${isEdit ? '' : 'required'}>
                                ${isEdit ? '<small>השאר ריק אם לא רוצה לשנות</small>' : ''}
                            </div>
                            <div class="form-group">
                                <label class="form-label">תפקיד</label>
                                <select class="form-select" name="role">
                                    <option value="instructor" ${instructor?.role === 'instructor' ? 'selected' : ''}>מדריך</option>
                                    <option value="senior_instructor" ${instructor?.role === 'senior_instructor' ? 'selected' : ''}>מדריך בכיר</option>
                                    <option value="admin" ${instructor?.role === 'admin' ? 'selected' : ''}>מנהל</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">סטטוס</label>
                                <select class="form-select" name="status">
                                    <option value="active" ${instructor?.status === 'active' ? 'selected' : ''}>פעיל</option>
                                    <option value="inactive" ${instructor?.status === 'inactive' ? 'selected' : ''}>לא פעיל</option>
                                    <option value="pending" ${instructor?.status === 'pending' ? 'selected' : ''}>ממתין לאישור</option>
                                    <option value="suspended" ${instructor?.status === 'suspended' ? 'selected' : ''}>מושעה</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="instructorsFrontend.${isEdit ? 'updateInstructor' : 'createInstructor'}(${instructor?.id || 'null'})">
                        ${isEdit ? 'עדכן' : 'צור'} מדריך
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        ביטול
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * יצירת מדריך חדש
     */
    async createInstructor() {
        try {
            const form = document.getElementById('instructor-form');
            const formData = new FormData(form);
            const instructorData = Object.fromEntries(formData);

            const result = await this.backend.createInstructor(instructorData);
            
            if (result.success) {
                this.showSuccess('מדריך נוצר בהצלחה!');
                this.closeModal();
                await this.loadInstructors();
                this.loadStats();
            } else {
                this.showError('שגיאה ביצירת המדריך: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה ביצירת המדריך: ' + error.message);
        }
    }

    /**
     * עדכון מדריך
     */
    async updateInstructor(id) {
        try {
            const form = document.getElementById('instructor-form');
            const formData = new FormData(form);
            const instructorData = Object.fromEntries(formData);

            // הסרת סיסמה ריקה
            if (!instructorData.password) {
                delete instructorData.password;
            }

            const result = await this.backend.updateInstructor(id, instructorData);
            
            if (result.success) {
                this.showSuccess('מדריך עודכן בהצלחה!');
                this.closeModal();
                await this.loadInstructors();
            } else {
                this.showError('שגיאה בעדכון המדריך: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בעדכון המדריך: ' + error.message);
        }
    }

    /**
     * צפייה במדריך
     */
    async viewInstructor(id) {
        try {
            const result = await this.backend.getInstructorById(id);
            
            if (result.success) {
                this.showInstructorDetails(result.data);
            } else {
                this.showError('שגיאה בטעינת פרטי המדריך: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת פרטי המדריך: ' + error.message);
        }
    }

    /**
     * עריכת מדריך
     */
    async editInstructor(id) {
        try {
            const result = await this.backend.getInstructorById(id);
            
            if (result.success) {
                const modal = this.createInstructorModal(result.data);
                document.body.appendChild(modal);
                modal.style.display = 'block';
            } else {
                this.showError('שגיאה בטעינת פרטי המדריך: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת פרטי המדריך: ' + error.message);
        }
    }

    /**
     * מחיקת מדריך
     */
    async deleteInstructor(id) {
        if (!confirm('האם אתה בטוח שברצונך למחוק את המדריך?')) {
            return;
        }

        try {
            const result = await this.backend.deleteInstructor(id);
            
            if (result.success) {
                this.showSuccess('מדריך נמחק בהצלחה!');
                await this.loadInstructors();
                this.loadStats();
            } else {
                this.showError('שגיאה במחיקת המדריך: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה במחיקת המדריך: ' + error.message);
        }
    }

    /**
     * מחיקה מרובה
     */
    async bulkDelete() {
        if (this.selectedInstructors.length === 0) {
            this.showError('לא נבחרו מדריכים למחיקה');
            return;
        }

        if (!confirm(`האם אתה בטוח שברצונך למחוק ${this.selectedInstructors.length} מדריכים?`)) {
            return;
        }

        try {
            let successCount = 0;
            let errorCount = 0;

            for (const instructorId of this.selectedInstructors) {
                const result = await this.backend.deleteInstructor(instructorId);
                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }

            if (successCount > 0) {
                this.showSuccess(`נמחקו ${successCount} מדריכים בהצלחה`);
            }
            if (errorCount > 0) {
                this.showError(`${errorCount} מדריכים לא נמחקו`);
            }

            this.selectedInstructors = [];
            await this.loadInstructors();
            this.loadStats();
        } catch (error) {
            this.showError('שגיאה במחיקה מרובה: ' + error.message);
        }
    }

    /**
     * איפוס סיסמה
     */
    async resetPassword(id) {
        const newPassword = prompt('הכנס סיסמה חדשה (לפחות 6 תווים):');
        
        if (!newPassword) {
            return;
        }

        if (newPassword.length < 6) {
            this.showError('סיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        try {
            const result = await this.backend.resetPassword(id, newPassword);
            
            if (result.success) {
                this.showSuccess('סיסמה אופסה בהצלחה!');
            } else {
                this.showError('שגיאה באיפוס הסיסמה: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה באיפוס הסיסמה: ' + error.message);
        }
    }

    /**
     * שינוי סטטוס
     */
    async toggleStatus(id) {
        try {
            const result = await this.backend.getInstructorById(id);
            
            if (!result.success) {
                this.showError('שגיאה בטעינת פרטי המדריך');
                return;
            }

            const currentStatus = result.data.status;
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            const updateResult = await this.backend.updateInstructorStatus(id, newStatus);
            
            if (updateResult.success) {
                this.showSuccess(`סטטוס המדריך שונה ל-${newStatus}`);
                await this.loadInstructors();
                this.loadStats();
            } else {
                this.showError('שגיאה בשינוי הסטטוס: ' + updateResult.error);
            }
        } catch (error) {
            this.showError('שגיאה בשינוי הסטטוס: ' + error.message);
        }
    }

    /**
     * צפייה בפעילות
     */
    async viewActivity(id) {
        try {
            const result = await this.backend.getActivityLog(id);
            
            if (result.success) {
                this.showActivityModal(result.data);
            } else {
                this.showError('שגיאה בטעינת היסטוריית הפעילות: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בטעינת היסטוריית הפעילות: ' + error.message);
        }
    }

    /**
     * ביצוע חיפוש
     */
    async performSearch() {
        const searchInput = document.getElementById('instructor-search');
        const query = searchInput?.value?.trim();

        if (!query) {
            this.currentFilters = {};
            this.currentPage = 1;
            await this.loadInstructors();
            return;
        }

        try {
            const result = await this.backend.searchInstructors(query, this.currentFilters);
            
            if (result.success) {
                this.displayInstructors(result.data);
                this.updatePagination(result.total, result.total);
            } else {
                this.showError('שגיאה בחיפוש: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בחיפוש: ' + error.message);
        }
    }

    /**
     * החלת סינונים
     */
    async applyFilters() {
        const statusFilter = document.getElementById('status-filter')?.value;
        const roleFilter = document.getElementById('role-filter')?.value;

        this.currentFilters = {
            ...(statusFilter && { status: statusFilter }),
            ...(roleFilter && { role: roleFilter })
        };

        this.currentPage = 1;
        await this.loadInstructors();
    }

    /**
     * טעינת סטטיסטיקות
     */
    async loadStats() {
        try {
            const result = await this.backend.getInstructorStats();
            
            if (result.success) {
                this.displayStats(result.data);
            }
        } catch (error) {
            console.error('שגיאה בטעינת הסטטיסטיקות:', error);
        }
    }

    /**
     * הצגת סטטיסטיקות
     */
    displayStats(stats) {
        const statsContainer = document.getElementById('instructors-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">סך מדריכים</div>
                </div>
                <div class="stat-card stat-active">
                    <div class="stat-number">${stats.active}</div>
                    <div class="stat-label">פעילים</div>
                </div>
                <div class="stat-card stat-inactive">
                    <div class="stat-number">${stats.inactive}</div>
                    <div class="stat-label">לא פעילים</div>
                </div>
                <div class="stat-card stat-pending">
                    <div class="stat-number">${stats.pending}</div>
                    <div class="stat-label">ממתינים</div>
                </div>
                <div class="stat-card stat-recent">
                    <div class="stat-number">${stats.recentlyAdded}</div>
                    <div class="stat-label">נוספו השבוע</div>
                </div>
            </div>
        `;
    }

    /**
     * עדכון דפדוף
     */
    updatePagination(total, filtered) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(filtered / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-info">';
        paginationHTML += `מציג ${((this.currentPage - 1) * this.itemsPerPage) + 1}-${Math.min(this.currentPage * this.itemsPerPage, filtered)} מתוך ${filtered} מדריכים`;
        paginationHTML += '</div><div class="pagination-controls">';

        // כפתור הקודם
        if (this.currentPage > 1) {
            paginationHTML += `<button class="btn btn-small" onclick="instructorsFrontend.goToPage(${this.currentPage - 1})">הקודם</button>`;
        }

        // מספרי עמודים
        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="btn btn-small ${activeClass}" onclick="instructorsFrontend.goToPage(${i})">${i}</button>`;
        }

        // כפתור הבא
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="btn btn-small" onclick="instructorsFrontend.goToPage(${this.currentPage + 1})">הבא</button>`;
        }

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    /**
     * מעבר לעמוד
     */
    async goToPage(page) {
        this.currentPage = page;
        await this.loadInstructors();
    }

    /**
     * הצגת פרטי מדריך
     */
    showInstructorDetails(instructor) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>פרטי המדריך</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="instructor-profile">
                        <div class="instructor-avatar-large">
                            ${instructor.firstName.charAt(0)}${instructor.lastName.charAt(0)}
                        </div>
                        <div class="instructor-info">
                            <h4>${instructor.firstName} ${instructor.lastName}</h4>
                            <p class="instructor-role">${this.getRoleText(instructor.role)}</p>
                            <span class="status-badge ${this.getStatusClass(instructor.status)}">
                                ${this.getStatusText(instructor.status)}
                            </span>
                        </div>
                    </div>
                    <div class="instructor-details">
                        <div class="detail-row">
                            <strong>מספר זהות:</strong>
                            <span>${instructor.idNumber}</span>
                        </div>
                        <div class="detail-row">
                            <strong>מייל:</strong>
                            <span><a href="mailto:${instructor.email}">${instructor.email}</a></span>
                        </div>
                        <div class="detail-row">
                            <strong>טלפון:</strong>
                            <span><a href="tel:${instructor.phone}">${instructor.phone}</a></span>
                        </div>
                        <div class="detail-row">
                            <strong>שם משתמש:</strong>
                            <span>${instructor.username}</span>
                        </div>
                        <div class="detail-row">
                            <strong>תאריך יצירה:</strong>
                            <span>${new Date(instructor.createdDate).toLocaleDateString('he-IL')}</span>
                        </div>
                        ${instructor.lastLogin ? `
                            <div class="detail-row">
                                <strong>התחברות אחרונה:</strong>
                                <span>${new Date(instructor.lastLogin).toLocaleDateString('he-IL')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="instructorsFrontend.editInstructor(${instructor.id})">עריכה</button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">סגירה</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * הצגת מודל פעילות
     */
    showActivityModal(activities) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>היסטוריית פעילות</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="activity-list">
                        ${activities.map(activity => `
                            <div class="activity-item">
                                <div class="activity-icon">📋</div>
                                <div class="activity-content">
                                    <div class="activity-title">${activity.details}</div>
                                    <div class="activity-time">${new Date(activity.timestamp).toLocaleString('he-IL')}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">סגירה</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * הצגת מודל ייצוא
     */
    showExportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>ייצוא מדריכים</h3>
                    <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">פורמט ייצוא:</label>
                        <select class="form-select" id="export-format">
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="include-inactive"> כלול מדריכים לא פעילים
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="instructorsFrontend.exportData()">ייצא</button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">ביטול</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    /**
     * ייצוא נתונים
     */
    async exportData() {
        try {
            const format = document.getElementById('export-format').value;
            const includeInactive = document.getElementById('include-inactive').checked;

            const filters = includeInactive ? {} : { status: 'active' };
            
            const result = await this.backend.exportInstructors(format, filters);
            
            if (result.success) {
                this.downloadFile(result.data, result.filename, this.getContentType(format));
                this.showSuccess('הנתונים יוצאו בהצלחה!');
                this.closeModal();
            } else {
                this.showError('שגיאה בייצוא הנתונים: ' + result.error);
            }
        } catch (error) {
            this.showError('שגיאה בייצוא הנתונים: ' + error.message);
        }
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
     * קבלת סוג תוכן
     */
    getContentType(format) {
        const types = {
            'json': 'application/json',
            'csv': 'text/csv',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        return types[format] || 'text/plain';
    }

    /**
     * סגירת מודל
     */
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    }

    /**
     * טקסט תפקיד
     */
    getRoleText(role) {
        const roles = {
            'instructor': 'מדריך',
            'senior_instructor': 'מדריך בכיר',
            'admin': 'מנהל'
        };
        return roles[role] || role;
    }

    /**
     * טקסט סטטוס
     */
    getStatusText(status) {
        const statuses = {
            'active': 'פעיל',
            'inactive': 'לא פעיל',
            'pending': 'ממתין',
            'suspended': 'מושעה',
            'deleted': 'נמחק'
        };
        return statuses[status] || status;
    }

    /**
     * מחלקת סטטוס
     */
    getStatusClass(status) {
        return `status-${status}`;
    }

    /**
     * מצב ריק
     */
    getEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>אין מדריכים</h3>
                <p>לא נמצאו מדריכים במערכת</p>
                <button class="btn btn-primary" onclick="instructorsFrontend.showAddModal()">
                    הוסף מדריך ראשון
                </button>
            </div>
        `;
    }

    /**
     * הצגת טעינה
     */
    showLoading() {
        const container = document.getElementById('instructors-list');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>טוען מדריכים...</p>
                </div>
            `;
        }
    }

    /**
     * הסתרת טעינה
     */
    hideLoading() {
        // הטעינה תוסתר אוטומטית כשהתוכן יוצג
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

    /**
     * החלפת תפריט נפתח
     */
    toggleDropdown(id) {
        const dropdown = document.getElementById(`dropdown-${id}`);
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
}

// יצירת instance גלובלי
const instructorsFrontend = new InstructorsFrontend();

// ייצוא לשימוש במודולים אחרים
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstructorsFrontend;
}

// הוספה לחלון הגלובלי
if (typeof window !== 'undefined') {
    window.InstructorsFrontend = InstructorsFrontend;
    window.instructorsFrontend = instructorsFrontend;
}

console.log('✅ ממשק מדריכים נטען בהצלחה');
