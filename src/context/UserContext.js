
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        try {
            const profile = await Storage.initUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Failed to refresh profile', error);
        }
    }, []);

    const init = useCallback(async () => {
        setLoading(true);
        await refreshProfile();
        // Update streak on app start
        await Gamification.updateStreak();
        await refreshProfile(); // Refresh again to get updated streak in state
        setLoading(false);
    }, [refreshProfile]);

    useEffect(() => {
        init();
    }, [init]);

    const awardXP = useCallback(async (amount) => {
        const result = await Gamification.awardXP(amount);
        await refreshProfile();
        return result;
    }, [refreshProfile]);

    const unlockAchievement = useCallback(async (badgeId) => {
        const result = await Gamification.checkAndAwardBadge(badgeId);
        if (result) {
            await refreshProfile();
        }
        return result;
    }, [refreshProfile]);

    const getLevelInfo = useCallback(() => {
        if (!userProfile) return { level: 1, progress: 0 };
        return {
            level: Gamification.getLevel(userProfile.xp),
            progress: Gamification.getLevelProgress(userProfile.xp)
        };
    }, [userProfile]);

    const value = useMemo(() => ({
        userProfile,
        loading,
        refreshProfile,
        awardXP,
        unlockAchievement,
        getLevelInfo
    }), [userProfile, loading, refreshProfile, awardXP, unlockAchievement, getLevelInfo]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
