// מנהל הנתונים הראשי
class DataManager {
    constructor() {
        this.cache = {};
        this.baseUrl = './data/';
    }

    // טעינת נתונים מקובץ JSON
    async loadData(filename) {
        try {
            if (this.cache[filename]) {
                return this.cache[filename];
            }

            const response = await fetch(`${this.baseUrl}${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.cache[filename] = data;
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    // טעינת פתרונות למידה
    async loadSolutions() {
        const data = await this.loadData('solutions.json');
        return data ? data.solutions : [];
    }

    // טעינת מדריכים
    async loadInstructors() {
        const data = await this.loadData('instructors.json');
        return data ? data.instructors : [];
    }

    // טעינת מנחים
    async loadLecturers() {
        const data = await this.loadData('lecturers.json');
        return data ? data.lecturers : [];
    }

    // טעינת שלבי חינוך
    async loadEducationLevels() {
        const data = await this.loadData('education-levels.json');
        return data ? data.levels : [];
    }

    // שמירת נתונים מקומיים
    saveLocalData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving local data:', error);
            return false;
        }
    }

    // טעינת נתונים מקומיים
    loadLocalData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading local data:', error);
            return null;
        }
    }
}

// יצירת instance גלובלי
window.dataManager = new DataManager();
