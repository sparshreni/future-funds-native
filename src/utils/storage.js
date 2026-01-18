
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Module - AsyncStorage wrapper with error handling
const Storage = {
    // Keys for storage
    keys: {
        USER_PROFILE: 'futurefunds_user_profile',
        QUIZ_HISTORY: 'futurefunds_quiz_history',
        CREDIT_HISTORY: 'futurefunds_credit_history',
        PORTFOLIO: 'futurefunds_portfolio',
        ACHIEVEMENTS: 'futurefunds_achievements',
        BOOKMARKS: 'futurefunds_bookmarks',
        STOCK_API_KEY: 'futurefunds_stock_api_key',
        USE_REAL_TIME: 'futurefunds_use_real_time'
    },

    // Get item from storage
    async get(key, defaultValue = null) {
        try {
            const item = await AsyncStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue;
        }
    },

    // Set item in storage
    async set(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },

    // Remove item from storage
    async remove(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },

    // Clear all FutureFunds data
    async clearAll() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const appKeys = keys.filter(k => Object.values(this.keys).includes(k));
            await AsyncStorage.multiRemove(appKeys);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    // Initialize default user profile
    async initUserProfile() {
        let profile = await this.get(this.keys.USER_PROFILE);

        if (!profile) {
            profile = {
                gradeLevel: null,
                onboardingComplete: false,
                xp: 0,
                level: 1,
                streak: 0,
                lastVisit: new Date().toISOString(),
                creditScore: 650,
                portfolioBalance: 1000,
                portfolioValue: 1000,
                createdAt: new Date().toISOString()
            };
            await this.set(this.keys.USER_PROFILE, profile);
        }

        return profile;
    },

    // Update user profile
    async updateProfile(updates) {
        const profile = await this.get(this.keys.USER_PROFILE);
        const updatedProfile = { ...profile, ...updates };
        await this.set(this.keys.USER_PROFILE, updatedProfile);
        return updatedProfile;
    },

    // Get quiz history
    async getQuizHistory() {
        return await this.get(this.keys.QUIZ_HISTORY, []);
    },

    // Add quiz result
    async addQuizResult(result) {
        const history = await this.getQuizHistory();
        history.push({
            ...result,
            timestamp: new Date().toISOString()
        });
        await this.set(this.keys.QUIZ_HISTORY, history);
    },

    // Get credit history
    async getCreditHistory() {
        return await this.get(this.keys.CREDIT_HISTORY, []);
    },

    // Add credit event
    async addCreditEvent(event) {
        const history = await this.getCreditHistory();
        history.push({
            ...event,
            timestamp: new Date().toISOString()
        });
        await this.set(this.keys.CREDIT_HISTORY, history);
    },

    // Get portfolio
    async getPortfolio() {
        return await this.get(this.keys.PORTFOLIO, {
            cash: 1000,
            stocks: {},
            transactions: []
        });
    },

    // Update portfolio
    async updatePortfolio(portfolio) {
        await this.set(this.keys.PORTFOLIO, portfolio);
    },

    // Get achievements
    async getAchievements() {
        return await this.get(this.keys.ACHIEVEMENTS, {
            badges: [],
            unlockedAt: {}
        });
    },

    // Unlock achievement
    async unlockAchievement(badgeId) {
        const achievements = await this.getAchievements();
        if (!achievements.badges.includes(badgeId)) {
            achievements.badges.push(badgeId);
            achievements.unlockedAt[badgeId] = new Date().toISOString();
            await this.set(this.keys.ACHIEVEMENTS, achievements);
            return true;
        }
        return false;
    },

    // Get bookmarks
    async getBookmarks() {
        return await this.get(this.keys.BOOKMARKS, []);
    },

    // Toggle bookmark
    async toggleBookmark(resourceId) {
        const bookmarks = await this.getBookmarks();
        const index = bookmarks.indexOf(resourceId);

        if (index > -1) {
            bookmarks.splice(index, 1);
        } else {
            bookmarks.push(resourceId);
        }

        await this.set(this.keys.BOOKMARKS, bookmarks);
        return bookmarks;
    }
};

export default Storage;
