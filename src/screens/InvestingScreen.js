
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Dimensions, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import StockData from '../utils/stockData';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';
import { useUser } from '../context/UserContext';

const screenWidth = Dimensions.get('window').width;

const InvestingScreen = ({ navigation }) => {
    const { refreshProfile } = useUser();
    const [loading, setLoading] = useState(true);
    const [portfolio, setPortfolio] = useState({ cash: 1000, stocks: {}, transactions: [] });
    const [stocks, setStocks] = useState([]);
    const [totalValue, setTotalValue] = useState(1000);
    const [selectedStock, setSelectedStock] = useState(null);
    const [tradeAction, setTradeAction] = useState(null); // 'buy' or 'sell'
    const [tradeQuantity, setTradeQuantity] = useState('1');
    const [chartStock, setChartStock] = useState(null);

    const loadData = useCallback(async () => {
        // Update market first
        await StockData.updateMarket();

        const port = await Storage.getPortfolio();
        const allStocks = StockData.getAllStocksWithPrices();

        let stockVal = 0;
        Object.entries(port.stocks).forEach(([symbol, quantity]) => {
            const stock = allStocks.find(s => s.symbol === symbol);
            if (stock) {
                stockVal += stock.currentPrice * quantity;
            }
        });

        const currentTotalValue = port.cash + stockVal;

        setPortfolio(port);
        setStocks(allStocks);
        setTotalValue(currentTotalValue);

        // Update profile total value
        await Storage.updateProfile({ portfolioValue: currentTotalValue });
        refreshProfile();
        setLoading(false);
    }, [refreshProfile]);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000); // Live update
        return () => clearInterval(interval);
    }, [loadData]);

    const handleTrade = async () => {
        const qty = parseInt(tradeQuantity);
        if (isNaN(qty) || qty <= 0) {
            Alert.alert("Invalid Quantity", "Please enter a valid number.");
            return;
        }

        const price = selectedStock.currentPrice;
        const totalCost = qty * price;
        const newPortfolio = { ...portfolio };
        const symbol = selectedStock.symbol;

        if (tradeAction === 'buy') {
            if (totalCost > newPortfolio.cash) {
                Alert.alert("Insufficient Funds", "You don't have enough cash.");
                return;
            }
            newPortfolio.cash -= totalCost;
            newPortfolio.stocks[symbol] = (newPortfolio.stocks[symbol] || 0) + qty;

            // Check badges
            await Gamification.checkAndAwardBadge('investor');
            if (Object.keys(newPortfolio.stocks).length >= 5) {
                await Gamification.checkAndAwardBadge('diversified');
            }

        } else {
            const owned = newPortfolio.stocks[symbol] || 0;
            if (qty > owned) {
                Alert.alert("Insufficient Shares", "You don't own enough shares.");
                return;
            }
            newPortfolio.cash += totalCost;
            newPortfolio.stocks[symbol] = owned - qty;
            if (newPortfolio.stocks[symbol] <= 0) delete newPortfolio.stocks[symbol];

            // Check profit badge logic roughly
            // Simplified: if selling for profit... (logic omitted for brevity as per original)
        }

        newPortfolio.transactions.push({
            type: tradeAction,
            symbol,
            quantity: qty,
            price,
            date: new Date().toISOString()
        });

        await Storage.updatePortfolio(newPortfolio);
        setPortfolio(newPortfolio);
        setSelectedStock(null);
        setTradeAction(null);
        setTradeQuantity('1');
        loadData(); // manual reload
        Alert.alert("Success", `Successfully ${tradeAction === 'buy' ? 'bought' : 'sold'} ${qty} shares of ${symbol}`);
    };

    const getChartData = (symbol) => {
        const history = StockData.getPriceHistory(symbol, 20); // 20 points
        return {
            labels: [], // Hide labels for clean look
            datasets: [{
                data: history.map(h => h.price),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2
            }]
        };
    };

    const openTradeModal = (stock, action) => {
        setSelectedStock(stock);
        setTradeAction(action);
        setTradeQuantity('1');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}>
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Paper Trading 📈</Text>
                </View>

                {/* Portfolio Summary */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Value</Text>
                        <Text style={styles.statValue}>${totalValue.toFixed(2)}</Text>
                        <Text style={[styles.statChange, { color: totalValue >= 1000 ? COLORS.success : COLORS.danger }]}>
                            {totalValue >= 1000 ? '+' : ''}${(totalValue - 1000).toFixed(2)}
                            {/* calc percent */}
                        </Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statLabel}>Cash</Text>
                        <Text style={styles.statValue}>${portfolio.cash.toFixed(2)}</Text>
                    </Card>
                </View>

                {/* Stock List */}
                <Text style={styles.sectionTitle}>Market</Text>
                {stocks.map(stock => (
                    <Card key={stock.symbol} style={styles.stockCard}>
                        <View style={styles.stockHeader}>
                            <View>
                                <Text style={[styles.symbol, { color: stock.color }]}>{stock.symbol}</Text>
                                <Text style={styles.name}>{stock.name}</Text>
                                <Text style={styles.ownedText}>
                                    {portfolio.stocks[stock.symbol] ? `${portfolio.stocks[stock.symbol]} shares` : 'No position'}
                                </Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>${stock.currentPrice.toFixed(2)}</Text>
                                <Text style={[styles.change, { color: stock.change >= 0 ? COLORS.success : COLORS.danger }]}>
                                    {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <Button title="Chart" size="sm" variant="outline" onPress={() => setChartStock(stock)} style={styles.actionBtn} />
                            <Button title="Buy" size="sm" variant="success" onPress={() => openTradeModal(stock, 'buy')} style={styles.actionBtn} />
                            <Button
                                title="Sell"
                                size="sm"
                                variant="danger"
                                disabled={!portfolio.stocks[stock.symbol]}
                                onPress={() => openTradeModal(stock, 'sell')}
                                style={styles.actionBtn}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>

            {/* Trade Modal */}
            <Modal
                visible={!!selectedStock && !!tradeAction}
                transparent
                animationType="slide"
            >
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        {selectedStock && (
                            <>
                                <Text style={[styles.modalTitle, { color: selectedStock.color }]}>
                                    {tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}
                                </Text>
                                <Text style={styles.modalPrice}>Current Price: ${selectedStock.currentPrice.toFixed(2)}</Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Quantity</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={tradeQuantity}
                                        onChangeText={setTradeQuantity}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <Text style={styles.summary}>
                                    Total: ${(parseInt(tradeQuantity || 0) * selectedStock.currentPrice).toFixed(2)}
                                </Text>

                                <View style={styles.modalActions}>
                                    <Button title="Cancel" variant="outline" onPress={() => { setSelectedStock(null); setTradeAction(null); }} style={{ flex: 1 }} />
                                    <View style={{ width: 10 }} />
                                    <Button title="Confirm" variant={tradeAction === 'buy' ? 'success' : 'danger'} onPress={handleTrade} style={{ flex: 1 }} />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Chart Modal */}
            <Modal
                visible={!!chartStock}
                presentationStyle="pageSheet"
                animationType="slide"
                onRequestClose={() => setChartStock(null)}
            >
                <View style={styles.chartModal}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>{chartStock?.name} ({chartStock?.symbol})</Text>
                        <Button title="Close" size="sm" variant="outline" onPress={() => setChartStock(null)} />
                    </View>
                    {chartStock && (
                        <View style={styles.chartContainer}>
                            <LineChart
                                data={getChartData(chartStock.symbol)}
                                width={screenWidth - 32}
                                height={220}
                                chartConfig={{
                                    backgroundColor: COLORS.bgMedium,
                                    backgroundGradientFrom: COLORS.bgMedium,
                                    backgroundGradientTo: COLORS.bgLight,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },

                                    propsForDots: {
                                        r: 4,
                                        strokeWidth: 1,
                                        stroke: chartStock.color
                                    },
                                    propsForBackgroundLines: {
                                        strokeDasharray: "" // solid lines
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16
                                }}
                            />
                            <Text style={styles.chartDesc}>{chartStock.description}</Text>
                        </View>
                    )}
                </View>
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
    },
    statsGrid: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        marginBottom: 0,
        alignItems: 'center',
    },
    statLabel: {
        color: COLORS.textDarkSecondary,
        fontSize: FONTS.sizeXs,
    },
    statValue: {
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    statChange: {
        fontSize: FONTS.sizeSm,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
        marginBottom: SPACING.sm,
    },
    stockCard: {
        marginHorizontal: SPACING.md,
    },
    stockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    symbol: {
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
    },
    name: {
        color: COLORS.textDarkSecondary,
        fontSize: FONTS.sizeSm,
    },
    ownedText: {
        color: COLORS.primary,
        fontSize: FONTS.sizeXs,
        fontWeight: '600',
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    change: {
        fontSize: FONTS.sizeSm,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionBtn: {
        flex: 1,
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    modalContent: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 16,
        padding: SPACING.lg,
        borderColor: COLORS.border,
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    modalPrice: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: COLORS.textPrimary,
        padding: SPACING.sm,
        borderRadius: 8,
        fontSize: FONTS.sizeLg,
    },
    summary: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: SPACING.lg,
    },
    modalActions: {
        flexDirection: 'row',
    },
    chartModal: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
        padding: SPACING.md,
        paddingTop: 50,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    chartTitle: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizexl,
        fontWeight: 'bold',
    },
    chartDesc: {
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        lineHeight: 22,
    },
    chartContainer: {
        alignItems: 'center',
    }
});

export default InvestingScreen;
