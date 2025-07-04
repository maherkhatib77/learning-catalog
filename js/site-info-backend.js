/**
 * מודול Backend למידע כללי לאתר
 * site-info-backend.js
 * 
 * מספק פונקציות לניהול מידע כללי של האתר
 * כולל פרטי קשר, שעות פעילות, קישורים וכד'
 */

class SiteInfoBackend {
    constructor() {
        this.dataFile = 'data/site-info.json';
        this.siteInfo = null;
        this.additionalInfo = null;
        this.isLoaded = false;
        this.cache = new Map();
        this.init();
    }

    /**
     * אתחול המודול
     */
    async init() {
        try {
            await this.loadData();
            this.startCacheRefresh();
            console.log('✅ מודול מידע כללי נטען בהצלחה');
        } catch (error) {
            console.error('❌ שגיאה בטעינת מודול מידע כללי:', error);
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
            this.siteInfo = data.siteInfo || {};
            this.additionalInfo = data.additionalInfo || {};
            this.isLoaded = true;
            this.updateCache();
            return true;
        } catch (error) {
            console.error('שגיאה בטעינת נתונים:', error);
            throw error;
        }
    }

    /**
     * שמירת נתונים
     */
    async saveData() {
        try {
            const data = {
                siteInfo: {
                    ...this.siteInfo,
                    lastUpdate: new Date().toISOString()
                },
                additionalInfo: this.additionalInfo,
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    version: "1.0"
                }
            };
            
            // סימולציה של שמירה - בפועל ישמור בשרת
            localStorage.setItem('siteInfo_backup', JSON.stringify(data));
            this.updateCache();
            console.log('✅ מידע כללי נשמר בהצלחה');
            return true;
        } catch (error) {
            console.error('❌ שגיאה בשמירת מידע כללי:', error);
            throw error;
        }
    }

    /**
     * יצירת נתונים ברירת מחדל
     */
    createDefaultData() {
        this.siteInfo = {
            id: 1,
            title: "קטלוג פתרונות למידה",
            academicYear: "תשפ\"ה - 2024/2025",
            copyright: "© 2025 קטלוג פתרונות למידה | כל הזכויות שמורות",
            phone: "03-1234567",
            email: "info@learning-catalog.co.il",
            address: "רחוב החינוך 15, תל אביב",
            workingHours: {
                sunday: "08:00-17:00",
                monday: "08:00-17:00", 
                tuesday: "08:00-17:00",
                wednesday: "08:00-17:00",
                thursday: "08:00-17:00",
                friday: "08:00-13:00",
                saturday: "סגור"
            },
            wazeLink: "https://waze.com/ul/h9bj6hfgpv",
            googleMapsLink: "https://maps.google.com/maps?q=32.0853,34.7818",
            lastUpdate: new Date().toISOString()
        };

        this.additionalInfo = {
            logo: "assets/images/logo.png",
            favicon: "assets/images/favicon.ico",
            socialMedia: {
                facebook: "",
                twitter: "",
                linkedin: "",
                youtube: ""
            },
            supportHours: {
                phone: "א'-ה' 08:00-17:00, ו' 08:00-13:00",
                email: "24/7 - מענה תוך 24 שעות",
                chat: "א'-ה' 09:00-16:00"
            },
            emergencyContacts: {
                technical: "054-9876543",
                administrative: "052-1234567"
            },
            languages: ["he", "ar", "en"],
            defaultLanguage: "he",
            timezone: "Asia/Jerusalem",
            currency: "ILS",
            version: "2.1.0",
            maintenanceMode: false,
            notifications: {
                enabled: true,
                types: ["system", "updates", "maintenance"]
            }
        };

        this.isLoaded = true;
        this.updateCache();
    }

    /**
     * קבלת כל המידע הכללי
     */
    async getAllSiteInfo() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            return {
                success: true,
                data: {
                    siteInfo: this.siteInfo,
                    additionalInfo: this.additionalInfo
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון מידע כללי
     */
    async updateSiteInfo(updates) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            // וולידציה
            const validation = this.validateSiteInfo(updates);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: 'נתונים לא תקינים',
                    details: validation.errors
                };
            }

            // עדכון הנתונים
            this.siteInfo = {
                ...this.siteInfo,
                ...updates,
                lastUpdate: new Date().toISOString()
            };

            await this.saveData();

            return {
                success: true,
                data: this.siteInfo,
                message: 'מידע כללי עודכן בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון מידע נוסף
     */
    async updateAdditionalInfo(updates) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            this.additionalInfo = {
                ...this.additionalInfo,
                ...updates
            };

            await this.saveData();

            return {
                success: true,
                data: this.additionalInfo,
                message: 'מידע נוסף עודכן בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת מידע ספציפי
     */
    async getSiteInfoField(fieldName) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const value = this.siteInfo[fieldName] || this.additionalInfo[fieldName];
            
            if (value === undefined) {
                return {
                    success: false,
                    error: 'שדה לא נמצא'
                };
            }

            return {
                success: true,
                data: value
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון שדה ספציפי
     */
    async updateSiteInfoField(fieldName, value) {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            // בדיקה איפה השדה קיים
            if (this.siteInfo.hasOwnProperty(fieldName)) {
                this.siteInfo[fieldName] = value;
            } else if (this.additionalInfo.hasOwnProperty(fieldName)) {
                this.additionalInfo[fieldName] = value;
            } else {
                // שדה חדש - נוסיף למידע כללי
                this.siteInfo[fieldName] = value;
            }

            this.siteInfo.lastUpdate = new Date().toISOString();
            await this.saveData();

            return {
                success: true,
                message: `שדה ${fieldName} עודכן בהצלחה`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת שעות פעילות
     */
    async getWorkingHours() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const workingHours = this.siteInfo.workingHours || {};
            const today = new Date().toLocaleDateString('he-IL', { weekday: 'long' });
            const dayMap = {
                'יום ראשון': 'sunday',
                'יום שני': 'monday',
                'יום שלישי': 'tuesday',
                'יום רביעי': 'wednesday',
                'יום חמישי': 'thursday',
                'יום שישי': 'friday',
                'יום שבת': 'saturday'
            };

            const todayHours = workingHours[dayMap[today]] || 'לא מוגדר';

            return {
                success: true,
                data: {
                    all: workingHours,
                    today: todayHours,
                    isOpen: this.isCurrentlyOpen(workingHours)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * בדיקה האם המקום פתוח כרגע
     */
    isCurrentlyOpen(workingHours) {
        const now = new Date();
        const day = now.toLocaleDateString('he-IL', { weekday: 'long' });
        const dayMap = {
            'יום ראשון': 'sunday',
            'יום שני': 'monday',
            'יום שלישי': 'tuesday',
            'יום רביעי': 'wednesday',
            'יום חמישי': 'thursday',
            'יום שישי': 'friday',
            'יום שבת': 'saturday'
        };

        const todayHours = workingHours[dayMap[day]];
        if (!todayHours || todayHours === 'סגור') {
            return false;
        }

        const [start, end] = todayHours.split('-');
        const currentTime = now.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return currentTime >= start && currentTime <= end;
    }

    /**
     * קבלת פרטי קשר
     */
    async getContactInfo() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const contactInfo = {
                phone: this.siteInfo.phone,
                email: this.siteInfo.email,
                address: this.siteInfo.address,
                workingHours: this.siteInfo.workingHours,
                wazeLink: this.siteInfo.wazeLink,
                googleMapsLink: this.siteInfo.googleMapsLink,
                socialMedia: this.additionalInfo.socialMedia,
                emergencyContacts: this.additionalInfo.emergencyContacts
            };

            return {
                success: true,
                data: contactInfo
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון פרטי קשר
     */
    async updateContactInfo(contactData) {
        try {
            const updates = {};
            
            // עדכון שדות במידע כללי
            if (contactData.phone) updates.phone = contactData.phone;
            if (contactData.email) updates.email = contactData.email;
            if (contactData.address) updates.address = contactData.address;
            if (contactData.workingHours) updates.workingHours = contactData.workingHours;
            if (contactData.wazeLink) updates.wazeLink = contactData.wazeLink;
            if (contactData.googleMapsLink) updates.googleMapsLink = contactData.googleMapsLink;

            // עדכון מידע כללי
            if (Object.keys(updates).length > 0) {
                await this.updateSiteInfo(updates);
            }

            // עדכון מידע נוסף
            const additionalUpdates = {};
            if (contactData.socialMedia) additionalUpdates.socialMedia = contactData.socialMedia;
            if (contactData.emergencyContacts) additionalUpdates.emergencyContacts = contactData.emergencyContacts;

            if (Object.keys(additionalUpdates).length > 0) {
                await this.updateAdditionalInfo(additionalUpdates);
            }

            return {
                success: true,
                message: 'פרטי קשר עודכנו בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת הגדרות מערכת
     */
    async getSystemSettings() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            const settings = {
                title: this.siteInfo.title,
                academicYear: this.siteInfo.academicYear,
                copyright: this.siteInfo.copyright,
                language: this.additionalInfo.defaultLanguage,
                timezone: this.additionalInfo.timezone,
                currency: this.additionalInfo.currency,
                version: this.additionalInfo.version,
                maintenanceMode: this.additionalInfo.maintenanceMode,
                notifications: this.additionalInfo.notifications
            };

            return {
                success: true,
                data: settings
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * עדכון הגדרות מערכת
     */
    async updateSystemSettings(settings) {
        try {
            const siteInfoUpdates = {};
            const additionalInfoUpdates = {};

            // חלוקת העדכונים
            if (settings.title) siteInfoUpdates.title = settings.title;
            if (settings.academicYear) siteInfoUpdates.academicYear = settings.academicYear;
            if (settings.copyright) siteInfoUpdates.copyright = settings.copyright;

            if (settings.language) additionalInfoUpdates.defaultLanguage = settings.language;
            if (settings.timezone) additionalInfoUpdates.timezone = settings.timezone;
            if (settings.currency) additionalInfoUpdates.currency = settings.currency;
            if (settings.version) additionalInfoUpdates.version = settings.version;
            if (settings.maintenanceMode !== undefined) additionalInfoUpdates.maintenanceMode = settings.maintenanceMode;
            if (settings.notifications) additionalInfoUpdates.notifications = settings.notifications;

            // ביצוע העדכונים
            if (Object.keys(siteInfoUpdates).length > 0) {
                await this.updateSiteInfo(siteInfoUpdates);
            }

            if (Object.keys(additionalInfoUpdates).length > 0) {
                await this.updateAdditionalInfo(additionalInfoUpdates);
            }

            return {
                success: true,
                message: 'הגדרות מערכת עודכנו בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * בדיקת מצב תחזוקה
     */
    async isMaintenanceMode() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            return {
                success: true,
                data: this.additionalInfo.maintenanceMode || false
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * הפעלה/כיבוי מצב תחזוקה
     */
    async toggleMaintenanceMode(enabled) {
        try {
            await this.updateAdditionalInfo({
                maintenanceMode: enabled
            });

            return {
                success: true,
                message: `מצב תחזוקה ${enabled ? 'הופעל' : 'בוטל'}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * וולידציה של מידע כללי
     */
    validateSiteInfo(data) {
        const errors = [];

        // בדיקת שדות חובה
        if (data.title && data.title.trim().length < 3) {
            errors.push('כותרת האתר חייבת להכיל לפחות 3 תווים');
        }

        if (data.email && !this.validateEmail(data.email)) {
            errors.push('כתובת מייל לא תקינה');
        }

        if (data.phone && !this.validatePhone(data.phone)) {
            errors.push('מספר טלפון לא תקין');
        }

        if (data.wazeLink && !this.validateURL(data.wazeLink)) {
            errors.push('קישור וויז לא תקין');
        }

        if (data.googleMapsLink && !this.validateURL(data.googleMapsLink)) {
            errors.push('קישור גוגל מפות לא תקין');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * וולידציה של מייל
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * וולידציה של טלפון
     */
    validatePhone(phone) {
        const phoneRegex = /^0\d{1,2}-?\d{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * וולידציה של URL
     */
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * עדכון מטמון
     */
    updateCache() {
        this.cache.set('siteInfo', this.siteInfo);
        this.cache.set('additionalInfo', this.additionalInfo);
        this.cache.set('lastUpdate', new Date().toISOString());
    }

    /**
     * קבלה מהמטמון
     */
    getFromCache(key) {
        return this.cache.get(key);
    }

    /**
     * רענון מטמון אוטומטי
     */
    startCacheRefresh() {
        setInterval(async () => {
            try {
                await this.loadData();
                console.log('🔄 מטמון מידע כללי רוענן');
            } catch (error) {
                console.error('שגיאה ברענון מטמון:', error);
            }
        }, 5 * 60 * 1000); // כל 5 דקות
    }

    /**
     * ייצוא הגדרות
     */
    async exportSettings() {
        try {
            const allData = await this.getAllSiteInfo();
            if (!allData.success) {
                throw new Error(allData.error);
            }

            const exportData = {
                ...allData.data,
                exportDate: new Date().toISOString(),
                version: this.additionalInfo.version
            };

            return {
                success: true,
                data: JSON.stringify(exportData, null, 2),
                filename: `site-settings-${new Date().toISOString().split('T')[0]}.json`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * ייבוא הגדרות
     */
    async importSettings(settingsData) {
        try {
            const data = typeof settingsData === 'string' ? JSON.parse(settingsData) : settingsData;
            
            if (data.siteInfo) {
                await this.updateSiteInfo(data.siteInfo);
            }

            if (data.additionalInfo) {
                await this.updateAdditionalInfo(data.additionalInfo);
            }

            return {
                success: true,
                message: 'הגדרות יובאו בהצלחה'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * איפוס להגדרות ברירת מחדל
     */
    async resetToDefault() {
        try {
            this.createDefaultData();
            await this.saveData();

            return {
                success: true,
                message: 'המערכת אופסה להגדרות ברירת מחדל'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * קבלת מידע על גרסה
     */
    async getVersionInfo() {
        try {
            if (!this.isLoaded) {
                await this.loadData();
            }

            return {
                success: true,
                data: {
                    version: this.additionalInfo.version,
                    lastUpdate: this.siteInfo.lastUpdate,
                    supportedLanguages: this.additionalInfo.languages,
                    timezone: this.additionalInfo.timezone
                }
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
const siteInfoBackend = new SiteInfoBackend();

// ייצוא לשימוש במודולים אחרים
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteInfoBackend;
}

// הוספה לחלון הגלובלי לשימוש בדפדפן
if (typeof window !== 'undefined') {
    window.SiteInfoBackend = SiteInfoBackend;
    window.siteInfoBackend = siteInfoBackend;
}

console.log('✅ מודול Backend למידע כללי נטען בהצלחה');
