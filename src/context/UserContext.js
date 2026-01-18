
import React, { createContext, useState, useEffect, useContext } from 'react';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const profile = await Storage.initUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Failed to refresh profile', error);
        }
    };

    const init = async () => {
        setLoading(true);
        await refreshProfile();
        // Update streak on app start
        await Gamification.updateStreak();
        await refreshProfile(); // Refresh again to get updated streak in state
        setLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    const awardXP = async (amount) => {
        const result = await Gamification.awardXP(amount);
        await refreshProfile();
        return result;
    };

    const unlockAchievement = async (badgeId) => {
        const result = await Gamification.checkAndAwardBadge(badgeId);
        if (result) {
            await refreshProfile();
        }
        return result;
    };

    const getLevelInfo = () => {
        if (!userProfile) return { level: 1, progress: 0 };
        return {
            level: Gamification.getLevel(userProfile.xp),
            progress: Gamification.getLevelProgress(userProfile.xp)
        };
    };

    return (
        <UserContext.Provider value={{
            userProfile,
            loading,
            refreshProfile,
            awardXP,
            unlockAchievement,
            getLevelInfo
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
