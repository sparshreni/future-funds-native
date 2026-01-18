
// Credit Score Scenarios - Real-life situations affecting credit
const CreditScenarios = {
    scenarios: [
        {
            id: 'credit_1',
            title: 'First Credit Card',
            situation: 'You just turned 18 and received your first credit card with a $500 limit. What\'s the best way to use it?',
            choices: [
                {
                    text: 'Use it for small purchases and pay off the full balance every month',
                    impact: 25,
                    explanation: 'Excellent choice! Paying off your full balance shows responsible credit use, builds positive payment history, and avoids interest charges. This significantly boosts your credit score!'
                },
                {
                    text: 'Max it out immediately to show you use credit',
                    impact: -40,
                    explanation: 'Bad move! Maxing out your credit card means 100% utilization, which dramatically hurts your credit score. It also makes you look risky to lenders.'
                },
                {
                    text: 'Make small purchases but only pay the minimum each month',
                    impact: -15,
                    explanation: 'Not ideal. While you\'re making payments, carrying a balance means you\'ll pay interest. Your credit utilization stays high, which slightly hurts your score.'
                },
                {
                    text: 'Don\'t use it at all and keep it in a drawer',
                    impact: 5,
                    explanation: 'Keeping it means you have available credit (good!), but not using it means you\'re missing opportunities to build positive payment history.'
                }
            ],
            difficulty: 'beginner'
        },
        {
            id: 'credit_2',
            title: 'Payment Due Date',
            situation: 'Your credit card bill of $150 is due tomorrow, but you only have $50 right now. You\'ll get paid next week. What should you do?',
            choices: [
                {
                    text: 'Pay the $50 now and pay the rest next week',
                    impact: -20,
                    explanation: 'You\'ll be charged a late fee and interest once the due date passes. This late payment could be reported to credit bureaus, hurting your score.'
                },
                {
                    text: 'Ask a family member to lend you $100 and pay the full bill on time',
                    impact: 20,
                    explanation: 'Smart! Paying on time protects your credit score. As long as you pay your family member back, this keeps your payment history perfect.'
                },
                {
                    text: 'Wait until you get paid next week',
                    impact: -35,
                    explanation: 'This late payment will hurt your credit score, cost you late fees, and start accumulating interest. Payment history is the biggest factor in your credit score!'
                },
                {
                    text: 'Pay the minimum payment ($25) on time',
                    impact: 0,
                    explanation: 'This avoids late fees, but you\'ll carry a balance and pay interest. It\'s better than being late, but not ideal for building credit.'
                }
            ],
            difficulty: 'beginner'
        },
        {
            id: 'credit_3',
            title: 'Credit Limit Increase',
            situation: 'Your credit card company offers to increase your limit from $1,000 to $3,000. You currently have a $300 balance. Should you accept?',
            choices: [
                {
                    text: 'Accept it - this will lower your credit utilization ratio',
                    impact: 15,
                    explanation: 'Great thinking! Your utilization drops from 30% to 10%, which is excellent for your credit score. Just don\'t increase your spending!'
                },
                {
                    text: 'Accept it and increase your spending since you have more credit',
                    impact: -25,
                    explanation: 'Bad idea! The higher limit helps only if you maintain low balances. Spending more defeats the purpose and can hurt your finances.'
                },
                {
                    text: 'Decline it because you don\'t need more credit',
                    impact: 0,
                    explanation: 'Safe choice, but you\'re missing an easy way to improve your credit score through better utilization. Higher limits help if you use them responsibly!'
                },
                {
                    text: 'Accept it and max out the new limit',
                    impact: -50,
                    explanation: 'Terrible choice! This shows poor financial judgment, maxes out your utilization, and puts you in debt. Your credit score will plummet.'
                }
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'credit_4',
            title: 'Multiple Applications',
            situation: 'You\'re shopping for the best credit card. Should you apply for 5 different cards to see which one approves you with the best terms?',
            choices: [
                {
                    text: 'Yes, apply for all 5 to maximize your chances',
                    impact: -30,
                    explanation: 'Bad strategy! Each application creates a "hard inquiry" on your credit report. Multiple inquiries in a short time dramatically hurt your score.'
                },
                {
                    text: 'Research and apply for just 1-2 cards you\'re likely to qualify for',
                    impact: 15,
                    explanation: 'Smart approach! Research reduces hard inquiries. 1-2 inquiries have minimal impact, showing you\'re being selective and responsible.'
                },
                {
                    text: 'Don\'t apply for any credit cards',
                    impact: 0,
                    explanation: 'Safe but missing opportunity. Having at least one credit card and using it responsibly is important for building credit history.'
                },
                {
                    text: 'Apply for one card, wait for approval, then apply for more if denied',
                    impact: 10,
                    explanation: 'Better than applying for all at once! Spacing applications reduces the impact on your credit score.'
                }
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'credit_5',
            title: 'Old Credit Card',
            situation: 'You have a credit card you opened 5 years ago but never use anymore. You\'re thinking about closing it. What should you do?',
            choices: [
                {
                    text: 'Close it - you don\'t need it',
                    impact: -20,
                    explanation: 'Closing old accounts reduces your total available credit (hurting utilization) and shortens your credit history length, both of which lower your score.'
                },
                {
                    text: 'Keep it open and use it occasionally for small purchases',
                    impact: 20,
                    explanation: 'Excellent! Keeping old accounts maintains your credit history length and available credit. Using it occasionally keeps it active.'
                },
                {
                    text: 'Keep it open but never use it',
                    impact: 10,
                    explanation: 'Decent choice! It maintains your credit history and available credit, though the card company might close inactive accounts eventually.'
                },
                {
                    text: 'Close it and open a new card instead',
                    impact: -25,
                    explanation: 'Poor decision! You lose your payment history on the old card, shorten your average account age, and create a hard inquiry for the new card.'
                }
            ],
            difficulty: 'advanced'
        },
        {
            id: 'credit_6',
            title: 'Medical Emergency',
            situation: 'You have an unexpected $2,000 medical bill. You have three options: pay with savings, put it on a credit card, or set up a payment plan with the hospital. What do you choose?',
            choices: [
                {
                    text: 'Pay with savings if you have enough in your emergency fund',
                    impact: 15,
                    explanation: 'Best choice if you have an emergency fund! You avoid debt and interest. This is exactly what emergency funds are for.'
                },
                {
                    text: 'Put it all on a credit card',
                    impact: -30,
                    explanation: 'Risky! A $2,000 balance creates high utilization and interest charges. Only do this if you can pay it off quickly.'
                },
                {
                    text: 'Set up a payment plan with the hospital',
                    impact: 10,
                    explanation: 'Good option! Medical payment plans often have low or no interest and don\'t affect your credit score as long as you make payments.'
                },
                {
                    text: 'Ignore the bill',
                    impact: -50,
                    explanation: 'Worst choice! Unpaid medical bills go to collections, which devastates your credit score for up to 7 years.'
                }
            ],
            difficulty: 'advanced'
        },
        {
            id: 'credit_7',
            title: 'Co-signing a Loan',
            situation: 'Your friend asks you to co-sign on a car loan because they have bad credit. You want to help. What should you do?',
            choices: [
                {
                    text: 'Agree to co-sign to help your friend',
                    impact: -35,
                    explanation: 'Risky! If your friend misses payments, it hurts YOUR credit score too. You\'re equally responsible for the debt. Only co-sign if you can afford to pay the loan yourself.'
                },
                {
                    text: 'Politely decline and explain the risks',
                    impact: 0,
                    explanation: 'Smart! Co-signing is a huge financial risk. Your credit and finances could be damaged if they don\'t pay. It\'s okay to say no.'
                },
                {
                    text: 'Offer to lend them money directly instead',
                    impact: 5,
                    explanation: 'Better than co-signing, but still risky. Only lend what you can afford to lose. Personal loans to friends can strain relationships.'
                },
                {
                    text: 'Co-sign but only if they set up automatic payments',
                    impact: -15,
                    explanation: 'Still risky! Automatic payments help, but if your friend\'s account lacks funds, you\'re still responsible. Jobs, emergencies, or financial changes can affect their ability to pay.'
                }
            ],
            difficulty: 'advanced'
        },
        {
            id: 'credit_8',
            title: 'Rewards Card Temptation',
            situation: 'You see a credit card offering 5% cash back on all purchases. Should you apply and start using it for everything?',
            choices: [
                {
                    text: 'Apply and use it for regular purchases you can pay off monthly',
                    impact: 20,
                    explanation: 'Excellent strategy! Rewards cards are great when you pay the full balance monthly. You earn rewards without paying interest.'
                },
                {
                    text: 'Apply and increase your spending to maximize rewards',
                    impact: -30,
                    explanation: 'Bad idea! Spending more just for rewards defeats the purpose. The 5% back doesn\'t offset overspending or potential interest charges.'
                },
                {
                    text: 'Apply and carry a balance to get more rewards over time',
                    impact: -40,
                    explanation: 'Terrible math! Interest rates (typically 15-25%) far exceed 5% cash back. You\'ll lose money and hurt your credit score with high utilization.'
                },
                {
                    text: 'Don\'t apply - rewards aren\'t worth the risk',
                    impact: 0,
                    explanation: 'Safe but overly cautious. Rewards cards are beneficial if used responsibly. Missing out on rewards means leaving free money on the table!'
                }
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'credit_9',
            title: 'Credit Report Error',
            situation: 'You check your credit report and find a late payment you know you paid on time. What should you do?',
            choices: [
                {
                    text: 'Dispute the error with the credit bureau',
                    impact: 30,
                    explanation: 'Absolutely correct! You have the right to dispute errors. Removing false late payments can significantly boost your score.'
                },
                {
                    text: 'Ignore it - it\'s just one late payment',
                    impact: -25,
                    explanation: 'Don\'t ignore it! Even one false late payment can drop your score by 50-100 points. Always dispute errors.'
                },
                {
                    text: 'Pay the creditor to remove it',
                    impact: -10,
                    explanation: 'If it\'s an error, you shouldn\'t have to pay anything. Dispute it properly through the credit bureaus instead.'
                },
                {
                    text: 'Call the creditor and ask them to fix it',
                    impact: 15,
                    explanation: 'Good start! Contacting the creditor can help, but you should also dispute directly with credit bureaus to ensure it\'s corrected everywhere.'
                }
            ],
            difficulty: 'intermediate'
        },
        {
            id: 'credit_10',
            title: 'Balance Transfer Offer',
            situation: 'You have $1,500 on a card with 22% interest. Another card offers 0% interest for 12 months if you transfer. Transfer fee is $45. What do you do?',
            choices: [
                {
                    text: 'Transfer the balance and create a plan to pay it off in 12 months',
                    impact: 25,
                    explanation: 'Excellent! The $45 fee is much less than the interest you\'d pay. A payoff plan ensures you clear the debt during the 0% period.'
                },
                {
                    text: 'Don\'t transfer - the fee isn\'t worth it',
                    impact: -15,
                    explanation: 'Bad math! At 22% interest, you\'d pay $330/year on $1,500. The $45 fee saves you hundreds of dollars!'
                },
                {
                    text: 'Transfer it but keep making minimum payments',
                    impact: 5,
                    explanation: 'You save on interest now, but minimum payments might not clear the debt before the 0% period ends. You need an aggressive payoff plan!'
                },
                {
                    text: 'Transfer it and use the old card for new purchases',
                    impact: -30,
                    explanation: 'Dangerous! You\'re not solving the debt problem, just moving it around and creating more debt. This pattern leads to financial trouble.'
                }
            ],
            difficulty: 'advanced'
        }
    ],

    // Get random scenario
    getRandomScenario() {
        const randomIndex = Math.floor(Math.random() * this.scenarios.length);
        return this.scenarios[randomIndex];
    },

    // Get scenarios by difficulty
    getScenariosByDifficulty(difficulty) {
        return this.scenarios.filter(s => s.difficulty === difficulty);
    }
};

export default CreditScenarios;
