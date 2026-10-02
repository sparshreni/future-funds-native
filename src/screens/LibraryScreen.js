
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import LibraryData from '../data/library';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';
import { useToast } from '../context/ToastContext';

const LibraryScreen = ({ navigation }) => {
    const { showToast } = useToast();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);

    React.useEffect(() => {
        loadBookmarks();
    }, [modalVisible]);

    const loadBookmarks = async () => {
        const b = await Storage.getBookmarks();
        setBookmarks(b);
    };

    const getFilteredArticles = () => {
        let articles = LibraryData.articles;

        if (activeFilter !== 'all') {
            if (activeFilter === 'bookmarks') {
                articles = articles.filter(a => bookmarks.includes(a.id));
            } else {
                articles = articles.filter(a => a.category === activeFilter);
            }
        }

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            articles = articles.filter(a =>
                a.title.toLowerCase().includes(lower) ||
                a.summary.toLowerCase().includes(lower)
            );
        }

        return articles;
    };

    const handleOpenArticle = (article) => {
        setSelectedArticle(article);
        setModalVisible(true);
    };

    const handleToggleBookmark = async () => {
        await Storage.toggleBookmark(selectedArticle.id);
        const newBookmarks = await Storage.getBookmarks();
        setBookmarks(newBookmarks);
        showToast(newBookmarks.includes(selectedArticle.id) ? 'Bookmarked!' : 'Removed bookmark', 'info');
    };

    const handleFinishReading = async () => {
        await Gamification.awardXP(10);
        await Gamification.checkAndAwardBadge('bookworm');
        setModalVisible(false);
        showToast('Article completed! +10 XP', 'success');
    };

    const displayedArticles = getFilteredArticles();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Library 📚</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search topics..."
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilter === 'all' && styles.filterBtnActive]}
                        onPress={() => setActiveFilter('all')}
                    >
                        <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>All</Text>
                    </TouchableOpacity>
                    {LibraryData.categories.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.filterBtn, activeFilter === cat.id && styles.filterBtnActive]}
                            onPress={() => setActiveFilter(cat.id)}
                        >
                            <Text style={[styles.filterText, activeFilter === cat.id && styles.filterTextActive]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilter === 'bookmarks' && styles.filterBtnActive]}
                        onPress={() => setActiveFilter('bookmarks')}
                    >
                        <Text style={[styles.filterText, activeFilter === 'bookmarks' && styles.filterTextActive]}>Bookmarks</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {displayedArticles.length === 0 ? (
                    <Text style={styles.emptyText}>No articles found.</Text>
                ) : (
                    displayedArticles.map(article => {
                        const cat = LibraryData.categories.find(c => c.id === article.category);
                        return (
                            <TouchableOpacity key={article.id} onPress={() => handleOpenArticle(article)}>
                                <Card style={styles.articleCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.badge, { borderColor: cat?.color, backgroundColor: `${cat?.color}20` }]}>
                                            <Text style={[styles.badgeText, { color: cat?.color }]}>{cat?.name}</Text>
                                        </View>
                                        {bookmarks.includes(article.id) && <Text>🔖</Text>}
                                    </View>
                                    <Text style={styles.articleTitle}>{article.title}</Text>
                                    <Text style={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>
                                    <View style={styles.articleMeta}>
                                        <Text style={styles.readTime}>{article.readTime} min read</Text>
                                        <Text style={styles.readMore}>Read More →</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                {selectedArticle && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeBtn}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleToggleBookmark}>
                                <Text style={styles.bookmarkBtn}>{bookmarks.includes(selectedArticle.id) ? 'Remove Bookmark' : 'Bookmark'}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
                            <View style={styles.modalMeta}>
                                <Text style={styles.modalTime}>{selectedArticle.readTime} min read</Text>
                            </View>
                            <Text style={styles.modalBody}>{selectedArticle.content}</Text>

                            <Button
                                title="I finished reading!"
                                variant="success"
                                onPress={handleFinishReading}
                                style={{ marginTop: SPACING.xl }}
                            />
                        </ScrollView>
                    </View>
                )}
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    header: {
        padding: SPACING.md,
    },
    pageTitle: {
        fontSize: FONTS.size3xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    searchInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: SPACING.md,
        borderRadius: 24,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterContainer: {
        marginBottom: SPACING.md,
        height: 50,
    },
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: SPACING.sm,
        justifyContent: 'center',
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    filterTextActive: {
        color: 'white',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingTop: 0,
    },
    emptyText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
    articleCard: {
        marginBottom: SPACING.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    articleTitle: {
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
    },
    articleSummary: {
        color: COLORS.textDarkSecondary,
        fontSize: FONTS.sizeSm,
        marginBottom: SPACING.md,
    },
    articleMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    readTime: {
        color: COLORS.textDarkMuted,
        fontSize: 12,
    },
    readMore: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    closeBtn: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeMd,
    },
    bookmarkBtn: {
        color: COLORS.primaryLight,
        fontSize: FONTS.sizeMd,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    modalMeta: {
        marginBottom: SPACING.lg,
    },
    modalTime: {
        color: COLORS.textMuted,
        fontSize: FONTS.sizeSm,
    },
    modalBody: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizeMd,
        lineHeight: 24,
    }
});

export default LibraryScreen;
