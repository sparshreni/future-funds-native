
// Library Content Data
const LibraryData = {
    categories: [
        { id: 'budgeting', name: 'Budgeting', color: '#8b5cf6' },
        { id: 'saving', name: 'Saving', color: '#06b6d4' },
        { id: 'credit', name: 'Credit', color: '#ec4899' },
        { id: 'investing', name: 'Investing', color: '#f59e0b' }
    ],
    articles: [
        {
            id: 'art_1',
            category: 'budgeting',
            title: 'The 50/30/20 Rule',
            summary: 'A simple way to manage your money by dividing it into three buckets.',
            readTime: 3,
            content: `The 50/30/20 rule is a popular budgeting method that splits your monthly income into three categories:

**50% - Needs**
Half of your income should go towards necessities. This includes housing, electricity, groceries, and transportation. These are payments that you absolutely must make.

**30% - Wants**
This portion is for your personal lifestyle/entertainment choices. Examples include dining out, hobbies, subscriptions (like Netflix), and shopping.

**20% - Savings**
The remaining 20% should go towards your savings goals and debt repayment. This helps you build an emergency fund and plan for the future.

By following this rule, you can enjoy your life today while still preparing for tomorrow!`
        },
        {
            id: 'art_2',
            category: 'saving',
            title: 'Power of Compound Interest',
            summary: 'Learn how your money can grow exponentially over time.',
            readTime: 4,
            content: `Compound interest is often called the "eighth wonder of the world". It is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.

**How it works**
If you save $100 and earn 10% interest, you have $110. The next year, you earn 10% on $110, which is $11. Now you have $121. Your money is making money!

**Start Early**
The biggest factor in compound interest is TIME. The earlier you start saving, even if it's a small amount, the more time your money has to grow.

• **Example:** Investing $100/month starting at age 25 can grow to significantly more by age 65 than starting at age 35 with $200/month!`
        },
        {
            id: 'art_3',
            category: 'credit',
            title: 'Credit Score Basics',
            summary: 'Understanding what a credit score is and why it matters.',
            readTime: 5,
            content: `Your credit score is a three-digit number, typically between 300 and 850, that tells lenders how likely you are to pay back borrowed money.

**Key Factors:**
• **Payment History (35%)**: Do you pay your bills on time?
• **Amounts Owed (30%)**: How much of your available credit are you using? (Utilization)
• **Length of Credit History (15%)**: How long have you had credit accounts?
• **New Credit (10%)**: Have you applied for many new accounts recently?
• **Credit Mix (10%)**: Do you have a mix of credit cards, loans, mortgages, etc?

**Why it matters:**
A good score helps you get approved for loans, credit cards, and apartments. It also gets you lower interest rates, which saves you thousands of dollars over time!`
        },
        {
            id: 'art_4',
            category: 'investing',
            title: 'Stocks vs. Bonds',
            summary: 'Comparing the two main types of investments.',
            readTime: 4,
            content: `Stocks and bonds are the vegetables and meat of the investing world.

**Stocks (Equities)**
When you buy a stock, you are buying a tiny piece of ownership in a company.
• **Risk:** High. Prices can go up and down a lot only in the short term.
• **Reward:** High potential returns. Historically, stocks have grown about 10% per year on average.

**Bonds (Fixed Income)**
When you buy a bond, you are lending money to a company or government for a set period. They pay you interest in return.
• **Risk:** Lower. They are generally safer than stocks.
• **Reward:** Lower returns than stocks, but more steady and predictable.

**The Mix**
Most investors hold a mix of both. Young investors often have more stocks for growth, while older investors have more bonds for stability.`
        }
    ],

    getArticlesByCategory(categoryId) {
        return this.articles.filter(a => a.category === categoryId);
    },

    getArticle(id) {
        return this.articles.find(a => a.id === id);
    },

    searchArticles(query) {
        const lowerQuery = query.toLowerCase();
        return this.articles.filter(a =>
            a.title.toLowerCase().includes(lowerQuery) ||
            a.summary.toLowerCase().includes(lowerQuery)
        );
    }
};

export default LibraryData;
