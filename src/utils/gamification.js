
import Storage from './storage';

// Gamification Module - XP, Levels, Badges, Streaks
const Gamification = {
    // XP required for each level (exponential growth)
    xpPerLevel: [
        0,      // Level 1
        100,    // Level 2
        250,    // Level 3
        450,    // Level 4
        700,    // Level 5
        1000,   // Level 6
        1400,   // Level 7
        1900,   // Level 8
        2500,   // Level 9
        3200,   // Level 10
        4000,   // Level 11
        5000,   // Level 12
        6200,   // Level 13
        7600,   // Level 14
        9200,   // Level 15
        11000   // Level 16+
    ],

    // Badge definitions
    badges: {
        first_quiz: {
            id: 'first_quiz',
            name: 'First Steps',
            description: 'Complete your first quiz',
            icon: '🎯',
            xpReward: 50
        },
        perfect_score: {
            id: 'perfect_score',
            name: 'Perfect Score',
            description: 'Get 100% on a quiz',
            icon: '⭐',
            xpReward: 100
        },
        streak_3: {
            id: 'streak_3',
            name: 'On Fire',
            description: 'Maintain a 3-day streak',
            icon: '🔥',
            xpReward: 75
        },
        streak_7: {
            id: 'streak_7',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🌟',
            xpReward: 150
        },
        money_master: {
            id: 'money_master',
            name: 'Money Master',
            description: 'Complete 10 quizzes',
            icon: '💰',
            xpReward: 200
        },
        investor: {
            id: 'investor',
            name: 'Investor',
            description: 'Make your first stock purchase',
            icon: '📈',
            xpReward: 100
        },
        credit_builder: {
            id: 'credit_builder',
            name: 'Credit Builder',
            description: 'Reach 700 credit score',
            icon: '💳',
            xpReward: 125
        },
        credit_excellent: {
            id: 'credit_excellent',
            name: 'Excellent Credit',
            description: 'Reach 800 credit score',
            icon: '👑',
            xpReward: 250
        },
        bookworm: {
            id: 'bookworm',
            name: 'Bookworm',
            description: 'Read 5 articles',
            icon: '📚',
            xpReward: 50
        },
        diversified: {
            id: 'diversified',
            name: 'Diversified',
            description: 'Own all 5 stocks',
            icon: '🎲',
            xpReward: 200
        },
        profit_maker: {
            id: 'profit_maker',
            name: 'Profit Maker',
            description: 'Make $100 profit in investing',
            icon: '💵',
            xpReward: 150
        }
    },

    // Calculate level from XP
    getLevel(xp) {
        for (let i = this.xpPerLevel.length - 1; i >= 0; i--) {
            if (xp >= this.xpPerLevel[i]) {
                return i + 1;
            }
        }
        return 1;
    },

    // Get XP needed for next level
    getXPForNextLevel(currentXP) {
        const currentLevel = this.getLevel(currentXP);
        if (currentLevel >= this.xpPerLevel.length) {
            const lastXP = this.xpPerLevel[this.xpPerLevel.length - 1];
            const increment = 1000 * (currentLevel - this.xpPerLevel.length + 1);
            return lastXP + increment;
        }
        return this.xpPerLevel[currentLevel];
    },

    // Calculate progress to next level (0-100%)
    getLevelProgress(xp) {
        const currentLevel = this.getLevel(xp);
        const currentLevelXP = this.xpPerLevel[currentLevel - 1] || 0;
        const nextLevelXP = this.getXPForNextLevel(xp);
        const xpInLevel = xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        return Math.min(100, (xpInLevel / xpNeeded) * 100);
    },

    // Award XP and return level up status
    async awardXP(amount) {
        const profile = await Storage.get(Storage.keys.USER_PROFILE);
        const oldLevel = this.getLevel(profile.xp);
        const newXP = profile.xp + amount;
        const newLevel = this.getLevel(newXP);

        await Storage.updateProfile({ xp: newXP, level: newLevel });

        return {
            xpAwarded: amount,
            totalXP: newXP,
            leveledUp: newLevel > oldLevel,
            oldLevel,
            newLevel
        };
    },

    // Check and award badge
    async checkAndAwardBadge(badgeId) {
        const badge = this.badges[badgeId];
        if (!badge) return null;

        const unlocked = await Storage.unlockAchievement(badgeId);
        if (unlocked) {
            await this.awardXP(badge.xpReward);
            return badge;
        }
        return null;
    },

    // Update streak based on last visit
    async updateStreak() {
        const profile = await Storage.get(Storage.keys.USER_PROFILE);
        const lastVisit = new Date(profile.lastVisit);
        const today = new Date();

        // Reset time to start of day for comparison
        lastVisit.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

        let newStreak = profile.streak || 0;

        if (daysDiff === 0) {
            // Same day, keep streak
            newStreak = profile.streak;
        } else if (daysDiff === 1) {
            // Consecutive day, increment
            newStreak = profile.streak + 1;

            // Check streak badges
            if (newStreak === 3) {
                await this.checkAndAwardBadge('streak_3');
            } else if (newStreak === 7) {
                await this.checkAndAwardBadge('streak_7');
            }
        } else {
            // Streak broken
            newStreak = 1;
        }

        await Storage.updateProfile({
            streak: newStreak,
            lastVisit: new Date().toISOString()
        });

        return newStreak;
    },

    // Get all unlocked badges
    async getUnlockedBadges() {
        const achievements = await Storage.getAchievements();
        return achievements.badges.map(id => this.badges[id]).filter(Boolean);
    },

    // Get locked badges
    async getLockedBadges() {
        const achievements = await Storage.getAchievements();
        return Object.values(this.badges).filter(badge =>
            !achievements.badges.includes(badge.id)
        );
    }
};

export default Gamification;
