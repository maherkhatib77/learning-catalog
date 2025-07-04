/**
 * מודול Backend לניהול מדריכים פדגוגיים
 * instructors-backend.js
 * 
 * מספק פונקציות CRUD מלאות לניהול מדריכים
 * תומך בוולידציה, הצפנה, וניהול שגיאות
 */

class InstructorsBackend {
    constructor() {
        this.dataFile = 'data/instructors.json';
        this.instructors = [];
        this.isLoaded = false;
        this.init();
    }

    /**
     * אתחול המודול
     */
    async init() {
        try {
            await this.loadData();
            console.log('✅ מודול מדריכים נטען בהצלחה');
        } catch (error) {
            console.error('❌ שגיאה בטעינת מודול מדריכים:', error);
            this.createDefaultData();
        }
    }

    /**
     * טעינת נתונים מקובץ JSON
     */
    async loadData() {
        try {
            const response = await fetch(this.dataFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.instructors = data.instructors || [];
            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error('שגיאה בטעינת נתונים:', error);
            throw error;
        }
    }

    /**
     * שמירת נתונים (סימולציה - בפועל ישמור בשרת)
     */
    async saveData() {
        try {
            const data = {
                instructors: this.instructors,
                metadata: {
                    totalRecords: this.instructors.length,
                    lastUpdated: new Date().toISOString(),
                    version: "1.0"
                }
            };
            
            // סימולציה של שמירה
            localStorage.setItem('instructors_backup', JSON.stringify(data));
            console.log('✅ נתונים נשמרו בהצלחה');
            return true;
        } catch (error) {
            console.error('❌ שגיאה בשמירת נתונים:', error);
            throw error;
        }
    }

    /**
     * יצירת נתונים ברירת מחדל
     */
    createDefaultData() {
        this.instructors = [
            {
                id: 1,
                firstName: "רחל",
                lastName: "כהן",
                idNumber: "123456789",
                email: "rachel.cohen@education.gov.il",
                phone: "050-1234567",
                username: "rachel_cohen",
                password: this.hashPassword("password123"),
                role: "instructor",
                status: "active",
                createdDate: new Date().toISOString()
            }
        ];
        this.isLoaded = true;
    }

    /**
     * קבלת כל המדריכים
     */
    async getAllInstructors(filters = {}) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            let filteredInstructors = [...this.instructors];

            // סינון לפי סטטוס
            if (filters.status) {
                filteredInstructors = filteredInstructors.filter(
                    instructor => instructor.status === filters.status
                );
            }

            // סינון לפי תפקיד
            if (filters.role) {
                filteredInstructors = filteredInstructors.filter(
                    instructor => instructor.role === filters.role
                );
            }

            // חיפוש לפי טקסט
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredInstructors = filteredInstructors.filter(instructor =>
                    instructor.firstName.toLowerCase().includes(searchTerm) ||
                    instructor.lastName.toLowerCase().includes(searchTerm) ||
                    instructor.email.toLowerCase().includes(searchTerm) ||
                    instructor.username.toLowerCase().includes(searchTerm)
                );
            }

            // מיון
            if (filters.sortBy) {
                filteredInstructors.sort((a, b) => {
                    const aValue = a[filters.sortBy];
                    const bValue = b[filters.sortBy];
                    
                    if (filters.sortOrder === 'desc') {
                        return bValue > aValue ? 1 : -1;
                    }
                    return aValue > bValue ? 1 : -1;
                });
            }

            // חלוקה לעמודים
            if (filters.page && filters.limit) {
                const startIndex = (filters.page - 1) * filters.limit;
                const endIndex = startIndex + filters.limit;
                filteredInstructors = filteredInstructors.slice(startIndex, endIndex);
            }

            return {
                success: true,
                data: filteredInstructors,
                total: this.instructors.length,
                filtered: filteredInstructors.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת מדריך לפי ID
     */
    async getInstructorById(id) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const instructor = this.instructors.find(inst => inst.id === parseInt(id));
            
            if (!instructor) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            // הסרת סיסמה מהתגובה
            const { password, ...instructorWithoutPassword } = instructor;

            return {
                success: true,
                data: instructorWithoutPassword
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * יצירת מדריך חדש
     */
    async createInstructor(instructorData) {
        try {
            // וולידציה
            const validation = this.validateInstructorData(instructorData);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: 'נתונים לא תקינים',
                    details: validation.errors
                };
            }

            // בדיקת ייחודיות
            const duplicateCheck = await this.checkDuplicates(instructorData);
            if (!duplicateCheck.isUnique) {
                return {
                    success: false,
                    error: 'נתונים כבר קיימים במערכת',
                    details: duplicateCheck.conflicts
                };
            }

            // יצירת מדריך חדש
            const newInstructor = {
                id: this.generateNextId(),
                firstName: instructorData.firstName.trim(),
                lastName: instructorData.lastName.trim(),
                idNumber: instructorData.idNumber.trim(),
                email: instructorData.email.trim().toLowerCase(),
                phone: instructorData.phone.trim(),
                username: instructorData.username.trim().toLowerCase(),
                password: this.hashPassword(instructorData.password),
                role: instructorData.role || 'instructor',
                status: instructorData.status || 'pending',
                createdDate: new Date().toISOString()
            };

            this.instructors.push(newInstructor);
            await this.saveData();

            // החזרת המדריך ללא סיסמה
            const { password, ...instructorWithoutPassword } = newInstructor;

            return {
                success: true,
                data: instructorWithoutPassword,
                message: 'מדריך נוצר בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון מדריך קיים
     */
    async updateInstructor(id, updateData) {
        try {
            const instructorIndex = this.instructors.findIndex(inst => inst.id === parseInt(id));
            
            if (instructorIndex === -1) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            // וולידציה של נתונים לעדכון
            const validation = this.validateInstructorData(updateData, false);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: 'נתונים לא תקינים',
                    details: validation.errors
                };
            }

            // עדכון השדות
            const currentInstructor = this.instructors[instructorIndex];
            const updatedInstructor = {
                ...currentInstructor,
                ...updateData,
                id: currentInstructor.id, // שמירת ID מקורי
                createdDate: currentInstructor.createdDate, // שמירת תאריך יצירה
                updatedDate: new Date().toISOString()
            };

            // הצפנת סיסמה אם עודכנה
            if (updateData.password) {
                updatedInstructor.password = this.hashPassword(updateData.password);
            }

            this.instructors[instructorIndex] = updatedInstructor;
            await this.saveData();

            // החזרת המדריך ללא סיסמה
            const { password, ...instructorWithoutPassword } = updatedInstructor;

            return {
                success: true,
                data: instructorWithoutPassword,
                message: 'מדריך עודכן בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * מחיקת מדריך
     */
    async deleteInstructor(id) {
        try {
            const instructorIndex = this.instructors.findIndex(inst => inst.id === parseInt(id));
            
            if (instructorIndex === -1) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            // מחיקה רכה - שינוי סטטוס
            this.instructors[instructorIndex].status = 'deleted';
            this.instructors[instructorIndex].deletedDate = new Date().toISOString();
            
            await this.saveData();

            return {
                success: true,
                message: 'מדריך נמחק בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * שחזור מדריך שנמחק
     */
    async restoreInstructor(id) {
        try {
            const instructorIndex = this.instructors.findIndex(inst => inst.id === parseInt(id));
            
            if (instructorIndex === -1) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            this.instructors[instructorIndex].status = 'active';
            delete this.instructors[instructorIndex].deletedDate;
            
            await this.saveData();

            return {
                success: true,
                message: 'מדריך שוחזר בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון סטטוס מדריך
     */
    async updateInstructorStatus(id, newStatus) {
        try {
            const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'deleted'];
            
            if (!validStatuses.includes(newStatus)) {
                return {
                    success: false,
                    error: 'סטטוס לא תקין'
                };
            }

            const instructorIndex = this.instructors.findIndex(inst => inst.id === parseInt(id));
            
            if (instructorIndex === -1) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            this.instructors[instructorIndex].status = newStatus;
            this.instructors[instructorIndex].statusUpdatedDate = new Date().toISOString();
            
            await this.saveData();

            return {
                success: true,
                message: `סטטוס מדריך עודכן ל-${newStatus}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * חיפוש מדריכים
     */
    async searchInstructors(query, filters = {}) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const searchTerm = query.toLowerCase();
            let results = this.instructors.filter(instructor => {
                const matchesSearch = 
                    instructor.firstName.toLowerCase().includes(searchTerm) ||
                    instructor.lastName.toLowerCase().includes(searchTerm) ||
                    instructor.email.toLowerCase().includes(searchTerm) ||
                    instructor.username.toLowerCase().includes(searchTerm) ||
                    instructor.idNumber.includes(searchTerm) ||
                    instructor.phone.includes(searchTerm);

                // החלת סינונים נוספים
                if (filters.status && instructor.status !== filters.status) {
                    return false;
                }
                
                if (filters.role && instructor.role !== filters.role) {
                    return false;
                }

                return matchesSearch;
            });

            // הסרת סיסמאות מהתוצאות
            results = results.map(({ password, ...instructor }) => instructor);

            return {
                success: true,
                data: results,
                total: results.length,
                query: query
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת סטטיסטיקות מדריכים
     */
    async getInstructorStats() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const stats = {
                total: this.instructors.length,
                active: this.instructors.filter(inst => inst.status === 'active').length,
                inactive: this.instructors.filter(inst => inst.status === 'inactive').length,
                pending: this.instructors.filter(inst => inst.status === 'pending').length,
                suspended: this.instructors.filter(inst => inst.status === 'suspended').length,
                deleted: this.instructors.filter(inst => inst.status === 'deleted').length,
                byRole: {
                    instructor: this.instructors.filter(inst => inst.role === 'instructor').length,
                    senior_instructor: this.instructors.filter(inst => inst.role === 'senior_instructor').length,
                    admin: this.instructors.filter(inst => inst.role === 'admin').length
                },
                recentlyAdded: this.instructors.filter(inst => {
                    const createdDate = new Date(inst.createdDate);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdDate > thirtyDaysAgo;
                }).length
            };

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * אימות פרטי התחברות
     */
    async authenticateInstructor(username, password) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const instructor = this.instructors.find(inst => 
                inst.username === username.toLowerCase() && 
                inst.status === 'active'
            );

            if (!instructor) {
                return {
                    success: false,
                    error: 'שם משתמש לא נמצא או חשבון לא פעיל'
                };
            }

            // בדיקת סיסמה
            const isPasswordValid = this.verifyPassword(password, instructor.password);
            
            if (!isPasswordValid) {
                return {
                    success: false,
                    error: 'סיסמה שגויה'
                };
            }

            // עדכון תאריך התחברות אחרון
            const instructorIndex = this.instructors.findIndex(inst => inst.id === instructor.id);
            this.instructors[instructorIndex].lastLogin = new Date().toISOString();
            await this.saveData();

            // החזרת נתונים ללא סיסמה
            const { password: _, ...instructorData } = instructor;

            return {
                success: true,
                data: instructorData,
                message: 'התחברות מוצלחת'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * וולידציה של נתוני מדריך
     */
    validateInstructorData(data, isNew = true) {
        const errors = [];

        // בדיקת שדות חובה
        if (isNew || data.firstName !== undefined) {
            if (!data.firstName || data.firstName.trim().length < 2) {
                errors.push('שם פרטי חייב להכיל לפחות 2 תווים');
            }
        }

        if (isNew || data.lastName !== undefined) {
            if (!data.lastName || data.lastName.trim().length < 2) {
                errors.push('שם משפחה חייב להכיל לפחות 2 תווים');
            }
        }

        if (isNew || data.idNumber !== undefined) {
            if (!data.idNumber || !this.validateIsraeliId(data.idNumber)) {
                errors.push('מספר זהות לא תקין');
            }
        }

        if (isNew || data.email !== undefined) {
            if (!data.email || !this.validateEmail(data.email)) {
                errors.push('כתובת מייל לא תקינה');
            }
        }

        if (isNew || data.phone !== undefined) {
            if (!data.phone || !this.validatePhone(data.phone)) {
                errors.push('מספר טלפון לא תקין');
            }
        }

        if (isNew || data.username !== undefined) {
            if (!data.username || data.username.trim().length < 3) {
                errors.push('שם משתמש חייב להכיל לפחות 3 תווים');
            }
        }

        if (isNew || data.password !== undefined) {
            if (!data.password || data.password.length < 6) {
                errors.push('סיסמה חייבת להכיל לפחות 6 תווים');
            }
        }

        if (data.role !== undefined) {
            const validRoles = ['instructor', 'senior_instructor', 'admin'];
            if (!validRoles.includes(data.role)) {
                errors.push('תפקיד לא תקין');
            }
        }

        if (data.status !== undefined) {
            const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
            if (!validStatuses.includes(data.status)) {
                errors.push('סטטוס לא תקין');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * בדיקת כפילויות
     */
    async checkDuplicates(data, excludeId = null) {
        const conflicts = [];

        // בדיקת מספר זהות
        if (data.idNumber) {
            const existingId = this.instructors.find(inst => 
                inst.idNumber === data.idNumber && 
                inst.id !== excludeId
            );
            if (existingId) {
                conflicts.push('מספר זהות כבר קיים במערכת');
            }
        }

        // בדיקת מייל
        if (data.email) {
            const existingEmail = this.instructors.find(inst => 
                inst.email.toLowerCase() === data.email.toLowerCase() && 
                inst.id !== excludeId
            );
            if (existingEmail) {
                conflicts.push('כתובת מייל כבר קיימת במערכת');
            }
        }

        // בדיקת שם משתמש
        if (data.username) {
            const existingUsername = this.instructors.find(inst => 
                inst.username.toLowerCase() === data.username.toLowerCase() && 
                inst.id !== excludeId
            );
            if (existingUsername) {
                conflicts.push('שם משתמש כבר קיים במערכת');
            }
        }

        return {
            isUnique: conflicts.length === 0,
            conflicts: conflicts
        };
    }

    /**
     * וולידציה של מספר זהות ישראלי
     */
    validateIsraeliId(id) {
        if (!id || id.length !== 9) return false;
        
        const digits = id.split('').map(Number);
        let sum = 0;
        
        for (let i = 0; i < 9; i++) {
            let digit = digits[i];
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        
        return sum % 10 === 0;
    }

    /**
     * וולידציה של כתובת מייל
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * וולידציה של מספר טלפון
     */
    validatePhone(phone) {
        const phoneRegex = /^0\d{1,2}-?\d{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * הצפנת סיסמה
     */
    hashPassword(password) {
        // סימולציה של הצפנה - בפועל ישתמש ב-bcrypt
        return `$2b$10${btoa(password).slice(0, 50)}XXXXX`;
    }

    /**
     * אימות סיסמה
     */
    verifyPassword(password, hashedPassword) {
        // סימולציה של אימות - בפועל ישתמש ב-bcrypt
        return this.hashPassword(password) === hashedPassword;
    }

    /**
     * יצירת ID חדש
     */
    generateNextId() {
        if (this.instructors.length === 0) return 1;
        return Math.max(...this.instructors.map(inst => inst.id)) + 1;
    }

    /**
     * ייצוא נתונים לפורמטים שונים
     */
    async exportInstructors(format = 'json', filters = {}) {
        try {
            const result = await this.getAllInstructors(filters);
            if (!result.success) {
                throw new Error(result.error);
            }

            const instructors = result.data.map(({ password, ...instructor }) => instructor);

            switch (format.toLowerCase()) {
                case 'json':
                    return {
                        success: true,
                        data: JSON.stringify(instructors, null, 2),
                        filename: `instructors_${new Date().toISOString().split('T')[0]}.json`
                    };

                case 'csv':
                    const csvData = this.convertToCSV(instructors);
                    return {
                        success: true,
                        data: csvData,
                        filename: `instructors_${new Date().toISOString().split('T')[0]}.csv`
                    };

                case 'excel':
                    // סימולציה - בפועל ישתמש בספריה מתאימה
                    return {
                        success: true,
                        data: this.convertToExcel(instructors),
                        filename: `instructors_${new Date().toISOString().split('T')[0]}.xlsx`
                    };

                default:
                    throw new Error('פורמט לא נתמך');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * המרה ל-CSV
     */
    convertToCSV(instructors) {
        const headers = ['ID', 'שם פרטי', 'שם משפחה', 'מספר זהות', 'מייל', 'טלפון', 'שם משתמש', 'תפקיד', 'סטטוס', 'תאריך יצירה'];
        
        const csvRows = [headers.join(',')];
        
        instructors.forEach(instructor => {
            const row = [
                instructor.id,
                `"${instructor.firstName}"`,
                `"${instructor.lastName}"`,
                `"${instructor.idNumber}"`,
                `"${instructor.email}"`,
                `"${instructor.phone}"`,
                `"${instructor.username}"`,
                `"${instructor.role}"`,
                `"${instructor.status}"`,
                `"${new Date(instructor.createdDate).toLocaleDateString('he-IL')}"`
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    /**
     * המרה ל-Excel (סימולציה)
     */
    convertToExcel(instructors) {
        // בפועל ישתמש בספריה כמו SheetJS
        return this.convertToCSV(instructors);
    }

    /**
     * ייבוא נתונים מקובץ
     */
    async importInstructors(fileContent, format = 'json') {
        try {
            let instructorsToImport = [];

            switch (format.toLowerCase()) {
                case 'json':
                    const jsonData = JSON.parse(fileContent);
                    instructorsToImport = Array.isArray(jsonData) ? jsonData : jsonData.instructors || [];
                    break;

                case 'csv':
                    instructorsToImport = this.parseCSV(fileContent);
                    break;

                default:
                    throw new Error('פורמט לא נתמך');
            }

            const results = {
                success: 0,
                failed: 0,
                errors: []
            };

            for (const instructorData of instructorsToImport) {
                try {
                    const result = await this.createInstructor(instructorData);
                    if (result.success) {
                        results.success++;
                    } else {
                        results.failed++;
                        results.errors.push({
                            data: instructorData,
                            error: result.error
                        });
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        data: instructorData,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                results: results,
                message: `יובאו ${results.success} מדריכים בהצלחה, ${results.failed} כשלו`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * פיענוח CSV
     */
    parseCSV(csvContent) {
        const lines = csvContent.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const instructors = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
            const instructor = {};

            headers.forEach((header, index) => {
                instructor[header] = values[index];
            });

            instructors.push(instructor);
        }

        return instructors;
    }

    /**
     * איפוס סיסמה
     */
    async resetPassword(id, newPassword) {
        try {
            const instructorIndex = this.instructors.findIndex(inst => inst.id === parseInt(id));
            
            if (instructorIndex === -1) {
                return {
                    success: false,
                    error: 'מדריך לא נמצא'
                };
            }

            if (!newPassword || newPassword.length < 6) {
                return {
                    success: false,
                    error: 'סיסמה חייבת להכיל לפחות 6 תווים'
                };
            }

            this.instructors[instructorIndex].password = this.hashPassword(newPassword);
            this.instructors[instructorIndex].passwordResetDate = new Date().toISOString();
            
            await this.saveData();

            return {
                success: true,
                message: 'סיסמה אופסה בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת היסטוריית פעולות (לוג)
     */
    async getActivityLog(instructorId = null, limit = 50) {
        try {
            // סימולציה של לוג פעילות
            const activities = [
                {
                    id: 1,
                    instructorId: instructorId,
                    action: 'login',
                    timestamp: new Date().toISOString(),
                    details: 'התחברות למערכת'
                },
                {
                    id: 2,
                    instructorId: instructorId,
                    action: 'profile_update',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    details: 'עדכון פרופיל'
                }
            ];

            return {
                success: true,
                data: activities.slice(0, limit)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * יצירת דוח מפורט
     */
    async generateReport(type = 'summary', filters = {}) {
        try {
            const stats = await this.getInstructorStats();
            const instructors = await this.getAllInstructors(filters);

            const report = {
                type: type,
                generatedAt: new Date().toISOString(),
                stats: stats.data,
                instructors: instructors.data,
                summary: {
                    totalInstructors: instructors.data.length,
                    activePercentage: Math.round((stats.data.active / stats.data.total) * 100),
                    recentlyAdded: stats.data.recentlyAdded
                }
            };

            return {
                success: true,
                data: report
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// יצירת instance גלובלי
const instructorsBackend = new InstructorsBackend();

// ייצוא לשימוש במודולים אחרים
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstructorsBackend;
}

// הוספה לחלון הגלובלי לשימוש בדפדפן
if (typeof window !== 'undefined') {
    window.InstructorsBackend = InstructorsBackend;
    window.instructorsBackend = instructorsBackend;
}

console.log('✅ מודול Backend למדריכים נטען בהצלחה');
