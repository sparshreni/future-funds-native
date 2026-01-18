
import Storage from './storage';

// Stock Data for Paper Trading
// Ported from web app
const StockData = {
    stocks: [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            sector: 'Technology',
            description: 'Technology company known for iPhone, Mac, and other consumer electronics',
            basePrice: 175.50,
            volatility: 0.02, // 2% daily volatility
            color: '#A3AAAE',
            about: 'Apple designs, manufactures, and markets smartphones, computers, tablets, and more. It\'s one of the world\'s most valuable companies.'
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            sector: 'Technology',
            description: 'Software, cloud computing, and gaming company',
            basePrice: 380.75,
            volatility: 0.018,
            color: '#00A4EF',
            about: 'Microsoft makes Windows, Office, Xbox, and Azure cloud services. It\'s a leader in software and cloud computing.'
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc. (Google)',
            sector: 'Technology',
            description: 'Internet services, advertising, and technology company',
            basePrice: 140.25,
            volatility: 0.022,
            color: '#4285F4',
            about: 'Google\'s parent company, Alphabet, runs the search engine, YouTube, Android, and cloud services. It dominates online advertising.'
        },
        {
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            sector: 'E-commerce & Cloud',
            description: 'E-commerce, cloud computing, and digital streaming company',
            basePrice: 155.80,
            volatility: 0.025,
            color: '#FF9900',
            about: 'Amazon is the world\'s largest online retailer and also provides cloud computing services (AWS) used by many businesses.'
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            sector: 'Automotive',
            description: 'Electric vehicles, battery energy storage, and solar panels',
            basePrice: 242.50,
            volatility: 0.04, // More volatile
            color: '#E82127',
            about: 'Tesla makes electric cars and renewable energy products. It\'s led innovation in the electric vehicle market.'
        }
    ],

    // Price history management (simulated)
    priceHistory: {},

    // Initialize price history for a stock
    initializePriceHistory(symbol) {
        if (!this.priceHistory[symbol]) {
            const stock = this.stocks.find(s => s.symbol === symbol);
            this.priceHistory[symbol] = [{
                date: new Date().toISOString(),
                price: stock.basePrice,
                change: 0,
                changePercent: 0
            }];
        }
    },

    // Generate new price based on volatility (Simulated)
    generatePrice(symbol) {
        const stock = this.stocks.find(s => s.symbol === symbol);
        if (!stock) return null;

        this.initializePriceHistory(symbol);
        const lastPrice = this.getCurrentPrice(symbol);

        // Random walk: price change based on volatility
        const changePercent = (Math.random() - 0.5) * 2 * stock.volatility;
        const change = lastPrice * changePercent;
        const newPrice = Math.max(lastPrice + change, stock.basePrice * 0.5); // Prevent going too low

        const priceData = {
            date: new Date().toISOString(),
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat((changePercent * 100).toFixed(2))
        };

        this.updatePriceHistory(symbol, priceData);
        return priceData;
    },

    // Helper to update history
    updatePriceHistory(symbol, priceData) {
        if (!this.priceHistory[symbol]) this.initializePriceHistory(symbol);
        this.priceHistory[symbol].push(priceData);
        if (this.priceHistory[symbol].length > 100) {
            this.priceHistory[symbol].shift();
        }
    },

    // Get current price
    getCurrentPrice(symbol) {
        this.initializePriceHistory(symbol);
        const history = this.priceHistory[symbol];
        return history[history.length - 1].price;
    },

    // Get stock by symbol
    getStock(symbol) {
        return this.stocks.find(s => s.symbol === symbol);
    },

    // Get all stocks with current prices
    getAllStocksWithPrices() {
        return this.stocks.map(stock => {
            this.initializePriceHistory(stock.symbol);
            const currentPrice = this.getCurrentPrice(stock.symbol);
            const history = this.priceHistory[stock.symbol];
            const lastUpdate = history[history.length - 1];

            return {
                ...stock,
                currentPrice,
                change: lastUpdate.change,
                changePercent: lastUpdate.changePercent
            };
        });
    },

    // Simulate market update (call this periodically)
    async updateMarket() {
        const useRealTime = await Storage.get(Storage.keys.USE_REAL_TIME);
        const apiKey = await Storage.get(Storage.keys.STOCK_API_KEY);

        if (useRealTime && apiKey) {
            await this.fetchRealTimePrices(apiKey);
        } else {
            this.stocks.forEach(stock => {
                this.generatePrice(stock.symbol);
            });
        }
    },

    // Fetch real-time prices from Finnhub
    async fetchRealTimePrices(apiKey) {
        for (const stock of this.stocks) {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${apiKey}`);
                if (!response.ok) throw new Error('API Error');

                const data = await response.json();

                // Finnhub response: c = current price, d = change, dp = percent change
                if (data.c) {
                    const priceData = {
                        date: new Date().toISOString(),
                        price: parseFloat(data.c),
                        change: parseFloat(data.d),
                        changePercent: parseFloat(data.dp)
                    };
                    this.updatePriceHistory(stock.symbol, priceData);
                }
            } catch (error) {
                console.warn(`Failed to fetch data for ${stock.symbol}, using simulation fallback.`);
                this.generatePrice(stock.symbol);
            }
        }
    },

    // Get price history for a stock
    getPriceHistory(symbol, count = 30) {
        this.initializePriceHistory(symbol);
        const history = this.priceHistory[symbol];
        return history.slice(-count);
    }
};

// Initialize all stocks with base prices
StockData.stocks.forEach(stock => {
    StockData.initializePriceHistory(stock.symbol);
});

export default StockData;
