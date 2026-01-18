
// Quiz Question Database
const QuizData = {
    categories: [
        { id: 'budgeting', name: 'Budgeting', icon: '💵', color: '#8b5cf6' },
        { id: 'saving', name: 'Saving', icon: '🏦', color: '#06b6d4' },
        { id: 'earning', name: 'Earning', icon: '💼', color: '#10b981' },
        { id: 'credit', name: 'Credit & Debt', icon: '💳', color: '#ec4899' },
        { id: 'investing', name: 'Investing', icon: '📈', color: '#f59e0b' }
    ],

    questions: [
        // BUDGETING QUESTIONS
        {
            id: 'budget_1',
            category: 'budgeting',
            difficulty: 'elementary',
            question: 'What is a budget?',
            options: [
                'A plan for spending and saving money',
                'A type of bank account',
                'Money you borrow from friends',
                'A credit card'
            ],
            correctAnswer: 0,
            explanation: 'A budget is a plan that helps you decide how to spend and save your money wisely!'
        },
        {
            id: 'budget_2',
            category: 'budgeting',
            difficulty: 'middle',
            question: 'If you earn $50 and want to save 20%, how much should you save?',
            options: ['$5', '$10', '$15', '$20'],
            correctAnswer: 1,
            explanation: '20% of $50 is $10. To find 20%, multiply 50 × 0.20 = $10.'
        },
        {
            id: 'budget_3',
            category: 'budgeting',
            difficulty: 'high',
            question: 'What is the 50/30/20 budgeting rule?',
            options: [
                '50% needs, 30% wants, 20% savings',
                '50% savings, 30% needs, 20% wants',
                '50% wants, 30% savings, 20% needs',
                '50% rent, 30% food, 20% entertainment'
            ],
            correctAnswer: 0,
            explanation: 'The 50/30/20 rule suggests: 50% of income for needs (housing, food), 30% for wants (entertainment), and 20% for savings and debt repayment.'
        },
        {
            id: 'budget_4',
            category: 'budgeting',
            difficulty: 'elementary',
            question: 'Which of these is a NEED?',
            options: ['Video games', 'Food', 'Candy', 'Toys'],
            correctAnswer: 1,
            explanation: 'Food is a need because you must eat to survive. The others are wants - nice to have but not necessary.'
        },
        {
            id: 'budget_5',
            category: 'budgeting',
            difficulty: 'middle',
            question: 'What should you do BEFORE making a large purchase?',
            options: [
                'Buy it immediately',
                'Check your budget and compare prices',
                'Borrow money from friends',
                'Use a credit card without checking the price'
            ],
            correctAnswer: 1,
            explanation: 'Always check your budget to make sure you can afford it, and compare prices to get the best deal!'
        },

        // SAVING QUESTIONS
        {
            id: 'save_1',
            category: 'saving',
            difficulty: 'elementary',
            question: 'Why is it important to save money?',
            options: [
                'To have money for emergencies and goals',
                'To show off to friends',
                'Because banks require it',
                'So you can spend more later'
            ],
            correctAnswer: 0,
            explanation: 'Saving helps you prepare for unexpected expenses and reach your financial goals!'
        },
        {
            id: 'save_2',
            category: 'saving',
            difficulty: 'middle',
            question: 'What is compound interest?',
            options: [
                'Interest paid only on the original amount',
                'Interest earned on both the original amount and previous interest',
                'A type of savings account',
                'A fee charged by banks'
            ],
            correctAnswer: 1,
            explanation: 'Compound interest means you earn interest on your original savings PLUS interest on the interest you\'ve already earned. Your money grows faster!'
        },
        {
            id: 'save_3',
            category: 'saving',
            difficulty: 'high',
            question: 'If you save $100/month with 5% annual interest (compounded monthly), approximately how much will you have after 1 year?',
            options: ['$1,200', '$1,230', '$1,260', '$1,300'],
            correctAnswer: 1,
            explanation: 'With compound interest, you\'ll have approximately $1,230. Your savings grow faster than just $1,200 because you earn interest each month!'
        },
        {
            id: 'save_4',
            category: 'saving',
            difficulty: 'elementary',
            question: 'Where is the safest place to keep your savings?',
            options: [
                'Under your mattress',
                'In your backpack',
                'In a bank or credit union',
                'In your locker'
            ],
            correctAnswer: 2,
            explanation: 'Banks and credit unions are safe places that protect your money and even pay you interest!'
        },
        {
            id: 'save_5',
            category: 'saving',
            difficulty: 'middle',
            question: 'What is an emergency fund?',
            options: [
                'Money saved for vacation',
                'Money saved for unexpected expenses',
                'Money for buying games',
                'Money kept for donations'
            ],
            correctAnswer: 1,
            explanation: 'An emergency fund is money set aside for unexpected situations like medical bills, car repairs, or job loss.'
        },

        // EARNING QUESTIONS
        {
            id: 'earn_1',
            category: 'earning',
            difficulty: 'elementary',
            question: 'What is income?',
            options: [
                'Money you spend',
                'Money you earn or receive',
                'Money you save',
                'Money you borrow'
            ],
            correctAnswer: 1,
            explanation: 'Income is money that you earn from work, allowance, gifts, or other sources.'
        },
        {
            id: 'earn_2',
            category: 'earning',
            difficulty: 'middle',
            question: 'What are taxes?',
            options: [
                'Fees charged by stores',
                'Money the government collects to pay for public services',
                'Interest on savings',
                'Money you pay to banks'
            ],
            correctAnswer: 1,
            explanation: 'Taxes are money collected by the government to pay for schools, roads, police, and other public services we all use.'
        },
        {
            id: 'earn_3',
            category: 'earning',
            difficulty: 'high',
            question: 'What is the difference between gross pay and net pay?',
            options: [
                'They are the same thing',
                'Gross pay is after taxes, net pay is before taxes',
                'Gross pay is before taxes, net pay is after taxes',
                'Gross pay is hourly, net pay is salary'
            ],
            correctAnswer: 2,
            explanation: 'Gross pay is your total earnings before deductions. Net pay (take-home pay) is what you receive after taxes and other deductions are taken out.'
        },
        {
            id: 'earn_4',
            category: 'earning',
            difficulty: 'elementary',
            question: 'Which of these is a way to earn money as a student?',
            options: [
                'Doing chores for allowance',
                'Watching TV',
                'Playing video games',
                'Sleeping'
            ],
            correctAnswer: 0,
            explanation: 'Doing chores, babysitting, lawn mowing, or tutoring are great ways for students to earn money!'
        },
        {
            id: 'earn_5',
            category: 'earning',
            difficulty: 'middle',
            question: 'Why is it important to develop job skills?',
            options: [
                'To impress your friends',
                'To increase your earning potential',
                'Because schools require it',
                'To avoid going to college'
            ],
            correctAnswer: 1,
            explanation: 'Developing skills makes you more valuable to employers, which can lead to better jobs and higher income!'
        },

        // CREDIT & DEBT QUESTIONS
        {
            id: 'credit_1',
            category: 'credit',
            difficulty: 'middle',
            question: 'What is a credit score?',
            options: [
                'Your bank account balance',
                'A number showing how trustworthy you are with borrowed money',
                'The amount of money you have saved',
                'Your school grade average'
            ],
            correctAnswer: 1,
            explanation: 'A credit score (300-850) shows lenders how responsible you are with credit. Higher scores help you get better loans and interest rates!'
        },
        {
            id: 'credit_2',
            category: 'credit',
            difficulty: 'high',
            question: 'What is the ideal credit utilization ratio?',
            options: [
                'Below 30%',
                'Above 75%',
                '50-60%',
                '100%'
            ],
            correctAnswer: 0,
            explanation: 'Credit utilization is how much of your available credit you\'re using. Keeping it below 30% shows you\'re using credit responsibly and helps your credit score!'
        },
        {
            id: 'credit_3',
            category: 'credit',
            difficulty: 'middle',
            question: 'What happens if you only make minimum payments on a credit card?',
            options: [
                'You save money',
                'You pay off the debt quickly',
                'You pay much more in interest over time',
                'Nothing changes'
            ],
            correctAnswer: 2,
            explanation: 'Making only minimum payments means you\'ll be charged interest on the remaining balance, making the purchase cost much more over time!'
        },
        {
            id: 'credit_4',
            category: 'credit',
            difficulty: 'elementary',
            question: 'What does it mean to "borrow" money?',
            options: [
                'To receive money as a gift',
                'To take money that you must pay back',
                'To earn money from work',
                'To find money on the ground'
            ],
            correctAnswer: 1,
            explanation: 'Borrowing means taking money from someone with the promise to pay it back, often with interest.'
        },
        {
            id: 'credit_5',
            category: 'credit',
            difficulty: 'high',
            question: 'Which factor has the BIGGEST impact on your credit score?',
            options: [
                'Types of credit accounts',
                'Payment history',
                'Length of credit history',
                'New credit inquiries'
            ],
            correctAnswer: 1,
            explanation: 'Payment history (paying bills on time) makes up about 35% of your credit score - the largest factor!'
        },

        // INVESTING QUESTIONS
        {
            id: 'invest_1',
            category: 'investing',
            difficulty: 'middle',
            question: 'What is a stock?',
            options: [
                'A type of savings account',
                'A small ownership piece of a company',
                'A government bond',
                'A type of loan'
            ],
            correctAnswer: 1,
            explanation: 'When you buy stock, you own a small piece of that company. If the company does well, your stock value can increase!'
        },
        {
            id: 'invest_2',
            category: 'investing',
            difficulty: 'high',
            question: 'What does "diversification" mean in investing?',
            options: [
                'Putting all your money in one stock',
                'Spreading investments across different assets',
                'Only investing in tech companies',
                'Keeping all money in savings'
            ],
            correctAnswer: 1,
            explanation: 'Diversification means spreading your money across different investments to reduce risk. Don\'t put all your eggs in one basket!'
        },
        {
            id: 'invest_3',
            category: 'investing',
            difficulty: 'middle',
            question: 'What is the main risk of investing in stocks?',
            options: [
                'You might lose money if stock prices go down',
                'The bank might close',
                'You have to pay taxes',
                'You can\'t access your money'
            ],
            correctAnswer: 0,
            explanation: 'Stock prices can go up and down. You might lose money in the short term, but historically stocks have grown over long periods.'
        },
        {
            id: 'invest_4',
            category: 'investing',
            difficulty: 'elementary',
            question: 'What is the difference between saving and investing?',
            options: [
                'They are exactly the same',
                'Saving is for short-term goals, investing is for long-term growth',
                'Saving is riskier than investing',
                'Investing is only for rich people'
            ],
            correctAnswer: 1,
            explanation: 'Saving is keeping money safe for short-term goals. Investing is using money to buy assets (like stocks) that can grow over time, but with more risk.'
        },
        {
            id: 'invest_5',
            category: 'investing',
            difficulty: 'high',
            question: 'What is compound growth in investing?',
            options: [
                'Earning returns on your original investment only',
                'Earning returns on both your original investment and previous returns',
                'A guaranteed return',
                'Interest paid by banks'
            ],
            correctAnswer: 1,
            explanation: 'Compound growth is when your investment returns generate their own returns. Over time, this creates exponential growth - your money grows faster and faster!'
        },

        // Additional questions for variety
        {
            id: 'budget_6',
            category: 'budgeting',
            difficulty: 'middle',
            question: 'What is the first step in creating a budget?',
            options: [
                'Start spending less',
                'Track your income and expenses',
                'Open a savings account',
                'Get a credit card'
            ],
            correctAnswer: 1,
            explanation: 'You need to know where your money comes from and where it goes before you can make a plan!'
        },
        {
            id: 'save_6',
            category: 'saving',
            difficulty: 'high',
            question: 'What is the "Rule of 72"?',
            options: [
                'A budgeting method',
                'A way to estimate how long it takes money to double with compound interest',
                'The maximum credit utilization',
                'A retirement planning rule'
            ],
            correctAnswer: 1,
            explanation: 'Divide 72 by your interest rate to estimate years to double your money. At 6% interest, 72 ÷ 6 = 12 years to double!'
        },
        {
            id: 'earn_6',
            category: 'earning',
            difficulty: 'middle',
            question: 'What is passive income?',
            options: [
                'Income from a full-time job',
                'Money earned with little ongoing effort',
                'Money from doing chores',
                'Income from freelancing'
            ],
            correctAnswer: 1,
            explanation: 'Passive income is money earned from investments, rental properties, or businesses that don\'t require constant work.'
        },
        {
            id: 'credit_6',
            category: 'credit',
            difficulty: 'middle',
            question: 'At what age can you typically get your first credit card?',
            options: ['16', '18', '21', '25'],
            correctAnswer: 1,
            explanation: 'In most places, you can get your first credit card at 18, though building credit responsibly should start early!'
        },
        {
            id: 'invest_6',
            category: 'investing',
            difficulty: 'middle',
            question: 'What is a mutual fund?',
            options: [
                'Money borrowed from friends',
                'A pool of money from many investors used to buy various investments',
                'A type of savings account',
                'A government program'
            ],
            correctAnswer: 1,
            explanation: 'A mutual fund pools money from many investors to buy a diverse mix of stocks and bonds, providing instant diversification!'
        }
    ]
};

export default QuizData;
