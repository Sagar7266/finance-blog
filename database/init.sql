-- ============================================
-- Finance Blog - MySQL Database Setup Script
-- ============================================

CREATE DATABASE IF NOT EXISTS finance_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finance_blog;

-- ============================================
-- SEED DATA (Run after app starts & tables created)
-- ============================================

-- Default Admin User (password: Admin@123)
INSERT IGNORE INTO users (username, email, password, full_name, role, active, created_at, updated_at)
VALUES (
  'admin',
  'admin@financeblog.in',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ioctKIXnkBx./Y3LGgxmH9JMGm2y',
  'Admin User',
  'ADMIN',
  1,
  NOW(),
  NOW()
);

-- Default Author (password: Author@123)
INSERT IGNORE INTO users (username, email, password, full_name, role, active, bio, created_at, updated_at)
VALUES (
  'rahul_sharma',
  'rahul@financeblog.in',
  '$2a$10$8K1p/a0dL0gE7uoheE.hpO.p7IXz6QVuqlNMjMRj7.bXHv/YkVa3C',
  'Rahul Sharma',
  'AUTHOR',
  1,
  'Senior Financial Advisor with 10+ years experience in Indian markets. SEBI Registered. CA by qualification.',
  NOW(),
  NOW()
);

-- Categories
INSERT IGNORE INTO categories (name, slug, description, icon, color, created_at, updated_at) VALUES
('Investing', 'investing', 'Stock market, mutual funds, SIP, equity, and investment strategies for Indian investors', '📈', '#10B981', NOW(), NOW()),
('Loans', 'loans', 'Home loan, personal loan, car loan, business loan guides and tips', '🏦', '#3B82F6', NOW(), NOW()),
('Tax', 'tax', 'Income tax, GST, tax saving, ITR filing, 80C deductions and more', '📋', '#F59E0B', NOW(), NOW()),
('Credit Cards', 'credit-cards', 'Best credit cards in India, rewards, cashback, and credit score tips', '💳', '#EF4444', NOW(), NOW()),
('Insurance', 'insurance', 'Life insurance, health insurance, term plans, and ULIP guides', '🛡️', '#8B5CF6', NOW(), NOW()),
('Personal Finance', 'personal-finance', 'Budgeting, saving, financial planning, and money management', '💰', '#EC4899', NOW(), NOW());

-- Sample Blog Posts
INSERT IGNORE INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, featured, view_count, read_time, tags, category_id, author_id, published_at, created_at, updated_at)
VALUES (
  'Best SIP Mutual Funds to Invest in 2024 for Indian Investors',
  'best-sip-mutual-funds-2024',
  '<h2>Introduction to SIP Investing</h2><p>Systematic Investment Plan (SIP) is one of the most popular ways to invest in mutual funds in India. It allows you to invest a fixed amount regularly, typically monthly, in a mutual fund scheme.</p><h2>Top SIP Funds for 2024</h2><p>Based on historical performance, expense ratio, and fund manager track record, here are our top picks:</p><h3>1. Mirae Asset Large Cap Fund</h3><p>This fund has consistently outperformed its benchmark over 5+ years. It focuses on large-cap stocks which provide stability.</p><ul><li>5-Year Returns: 15.2% CAGR</li><li>Expense Ratio: 0.55%</li><li>Min SIP: ₹500/month</li></ul><h3>2. Axis Bluechip Fund</h3><p>One of the most popular large-cap funds with consistent performance and experienced fund management team.</p><ul><li>5-Year Returns: 14.8% CAGR</li><li>Expense Ratio: 0.49%</li><li>Min SIP: ₹500/month</li></ul><h3>3. Parag Parikh Flexi Cap Fund</h3><p>A unique fund that invests across market caps including international stocks for diversification.</p><ul><li>5-Year Returns: 18.5% CAGR</li><li>Expense Ratio: 0.63%</li><li>Min SIP: ₹1000/month</li></ul><h2>How to Start SIP Investment</h2><p>Starting a SIP is easy. You can do it through:</p><ol><li>AMC websites directly</li><li>MF Central platform</li><li>Mobile apps like Groww, Zerodha Coin, ET Money</li></ol><h2>Tax Implications</h2><p>Long-term capital gains (LTCG) on equity mutual funds are taxed at 10% above ₹1 lakh per year. Short-term gains are taxed at 15%.</p>',
  'Discover the best SIP mutual funds for 2024. Expert analysis of top-performing funds for Indian investors with detailed returns, expense ratios, and investment tips.',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  'Best SIP Mutual Funds 2024 India - Top Picks',
  'Discover the best SIP mutual funds for 2024. Expert analysis with returns data for Indian investors.',
  'PUBLISHED', 1, 1240, 7,
  'SIP, Mutual Funds, Investment, 2024, India',
  1, 2, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, featured, view_count, read_time, tags, category_id, author_id, published_at, created_at, updated_at)
VALUES (
  'Home Loan Tax Benefits Under Section 80C and 24B - Complete Guide 2024',
  'home-loan-tax-benefits-80c-24b',
  '<h2>Home Loan Tax Benefits in India</h2><p>If you have taken a home loan in India, you are eligible for significant tax deductions under the Income Tax Act. This guide covers all the tax benefits available to home loan borrowers.</p><h2>Section 24(b) - Interest Deduction</h2><p>Under Section 24(b), you can claim a deduction of up to <strong>₹2 lakh</strong> per year on the interest paid on your home loan for a self-occupied property.</p><h3>Key Points:</h3><ul><li>Maximum deduction: ₹2 lakh per annum</li><li>Applicable for self-occupied property</li><li>No limit for let-out property (actual interest paid)</li><li>Construction must be completed within 5 years</li></ul><h2>Section 80C - Principal Repayment</h2><p>The principal repayment component of your EMI qualifies for deduction under Section 80C, up to the overall limit of ₹1.5 lakh.</p><h3>What is included:</h3><ul><li>Principal repayment of home loan</li><li>Stamp duty and registration charges (one-time)</li><li>Combined with other 80C investments like PPF, ELSS, etc.</li></ul><h2>First-Time Home Buyers - Section 80EEA</h2><p>First-time home buyers can claim an additional deduction of ₹1.5 lakh on interest under Section 80EEA, subject to conditions.</p><h2>Joint Home Loan Tax Benefits</h2><p>If you have a joint home loan with your spouse or family member, both co-borrowers can independently claim tax deductions on their respective shares.</p>',
  'Complete guide to home loan tax benefits in India 2024. Learn how to save tax under Section 80C, 24B, and 80EEA with practical examples.',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  'Home Loan Tax Benefits 2024 - Section 80C & 24B Guide',
  'Complete guide to home loan tax benefits. Save tax under Section 80C, 24B, and 80EEA.',
  'PUBLISHED', 1, 890, 8,
  'Home Loan, Tax, 80C, 24B, Tax Benefits',
  3, 2, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, featured, view_count, read_time, tags, category_id, author_id, published_at, created_at, updated_at)
VALUES (
  'Best Credit Cards in India 2024 - Top Picks for Rewards and Cashback',
  'best-credit-cards-india-2024',
  '<h2>Best Credit Cards in India for 2024</h2><p>Choosing the right credit card can help you maximize rewards, earn cashback, and enjoy exclusive benefits. Here are our top picks for 2024.</p><h2>Best Overall: HDFC Regalia Credit Card</h2><p>The HDFC Regalia is considered one of the best premium credit cards in India offering:</p><ul><li>4 reward points per ₹150 spent</li><li>12 complimentary airport lounge visits</li><li>Annual fee: ₹2,500 (waived on ₹3L spend)</li><li>Welcome bonus: 2,500 reward points</li></ul><h2>Best Cashback: Amazon Pay ICICI Credit Card</h2><p>Perfect for frequent Amazon shoppers:</p><ul><li>5% cashback on Amazon (Prime members)</li><li>2% cashback on paying via Amazon Pay</li><li>1% cashback on all other purchases</li><li>No annual fee</li></ul><h2>Best for Travel: SBI Card ELITE</h2><p>Ideal for frequent travelers:</p><ul><li>5X rewards on dining, movies, and international spends</li><li>6 complimentary lounge visits per quarter</li><li>Welcome gift: e-vouchers worth ₹5,000</li></ul><h2>How to Choose the Right Credit Card</h2><p>Consider these factors when choosing a credit card:</p><ol><li>Spending patterns (fuel, groceries, travel, online)</li><li>Annual fee vs. benefits</li><li>Credit limit requirements</li><li>Interest rates (if you carry balance)</li></ol><h2>Credit Score Tips</h2><p>Always pay your full outstanding amount to avoid interest charges. Maintain credit utilization below 30% for a good CIBIL score.</p>',
  'Find the best credit cards in India for 2024. Compare rewards, cashback, travel benefits, and annual fees to choose the perfect card for you.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  'Best Credit Cards India 2024 - Top Rewards & Cashback Cards',
  'Compare the best credit cards in India 2024. Find top rewards, cashback, and travel cards.',
  'PUBLISHED', 1, 2100, 9,
  'Credit Cards, Rewards, Cashback, HDFC, ICICI',
  4, 2, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, featured, view_count, read_time, tags, category_id, author_id, published_at, created_at, updated_at)
VALUES (
  'How to File ITR Online 2024 - Step by Step Guide for Salaried Employees',
  'how-to-file-itr-online-2024-salaried',
  '<h2>Filing Income Tax Return (ITR) Online in 2024</h2><p>Filing your Income Tax Return (ITR) online is mandatory for most taxpayers in India. This step-by-step guide will help salaried employees file their ITR-1 (Sahaj) form easily.</p><h2>Documents Required</h2><ul><li>Form 16 from employer</li><li>Form 26AS (Annual Information Statement)</li><li>Bank statements</li><li>Investment proofs (80C, 80D, etc.)</li><li>Home loan interest certificate (if applicable)</li></ul><h2>Step-by-Step Filing Process</h2><h3>Step 1: Login to Income Tax Portal</h3><p>Go to incometax.gov.in and login with your PAN and password. If new, register first.</p><h3>Step 2: Select Assessment Year</h3><p>Choose AY 2024-25 for filing returns for FY 2023-24.</p><h3>Step 3: Choose ITR Form</h3><p>For salaried employees with income only from salary and one house property, choose ITR-1 (Sahaj).</p><h3>Step 4: Pre-fill Data</h3><p>The portal pre-fills most data from Form 16 and Form 26AS. Verify all pre-filled data carefully.</p><h3>Step 5: Enter Deductions</h3><p>Enter your eligible deductions under Chapter VI-A (80C, 80D, 80G, etc.)</p><h3>Step 6: Verify Tax Computation</h3><p>Check the tax payable or refund due. Pay any outstanding tax demand.</p><h3>Step 7: E-Verify</h3><p>E-verify using Aadhaar OTP, net banking, or bank account. This completes your filing.</p><h2>Important Deadlines</h2><p>The due date for filing ITR for non-audit cases is July 31, 2024.</p>',
  'Step-by-step guide to file ITR online in 2024 for salaried employees. Learn how to file ITR-1, claim deductions, and e-verify your return.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  'How to File ITR Online 2024 - Salaried Employee Guide',
  'Step-by-step guide to file ITR online for salaried employees. Claim all deductions and get maximum refund.',
  'PUBLISHED', 0, 3450, 10,
  'ITR, Income Tax, Tax Filing, Salaried, 2024',
  3, 2, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, featured, view_count, read_time, tags, category_id, author_id, published_at, created_at, updated_at)
VALUES (
  'Term Life Insurance vs Whole Life Insurance - Which is Better for Indians?',
  'term-vs-whole-life-insurance-india',
  '<h2>Term Life Insurance vs Whole Life Insurance</h2><p>Choosing between term and whole life insurance is one of the most important financial decisions. This guide helps you understand both and choose wisely.</p><h2>Term Life Insurance</h2><p>Term insurance provides pure life cover for a specific period (term). If the insured dies during the term, nominees receive the sum assured.</p><h3>Pros:</h3><ul><li>Very affordable premiums</li><li>High coverage at low cost</li><li>Simple and transparent</li><li>Suitable for income replacement</li></ul><h3>Cons:</h3><ul><li>No maturity benefit if you survive</li><li>Coverage ends at term expiry</li></ul><h3>Example:</h3><p>₹1 Crore term cover for a 30-year-old non-smoker may cost just ₹8,000-12,000 per year for 30 years.</p><h2>Whole Life Insurance</h2><p>Whole life insurance provides lifelong coverage and also builds a cash value component over time.</p><h3>Pros:</h3><ul><li>Lifelong coverage</li><li>Builds cash value/savings</li><li>Can borrow against policy</li></ul><h3>Cons:</h3><ul><li>Much higher premiums</li><li>Returns are lower than mutual funds</li><li>Complex structure</li></ul><h2>Our Recommendation</h2><p>For most Indians, <strong>term insurance + separate investment</strong> is the best strategy. Buy adequate term coverage and invest the premium difference in equity mutual funds for better wealth creation.</p><h2>Top Term Insurance Plans in India 2024</h2><ol><li>LIC Tech Term</li><li>HDFC Click 2 Protect Life</li><li>ICICI Prudential iProtect Smart</li><li>SBI eShield Next</li></ol>',
  'Confused between term and whole life insurance? This guide compares both types, with India-specific examples to help you make the right choice.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
  'Term vs Whole Life Insurance India 2024 - Which is Better?',
  'Compare term and whole life insurance for Indians. Find the best insurance plan for your needs.',
  'PUBLISHED', 0, 780, 8,
  'Insurance, Term Insurance, Life Insurance, LIC',
  5, 2, NOW(), NOW(), NOW()
);

-- Sample approved comments
INSERT IGNORE INTO comments (content, author_name, author_email, post_id, status, created_at)
VALUES
('Very helpful article! I just started my SIP journey with Axis Bluechip. Thank you!', 'Priya Patel', 'priya@example.com', 1, 'APPROVED', NOW()),
('Great breakdown of the tax sections. This saved me a lot of confusion during filing.', 'Amit Kumar', 'amit@example.com', 2, 'APPROVED', NOW()),
('I got the Amazon Pay ICICI card based on this recommendation. Best decision ever!', 'Sneha Verma', 'sneha@example.com', 3, 'APPROVED', NOW()),
('This ITR guide is exactly what I needed. Filed my first ITR successfully!', 'Rajesh Singh', 'rajesh@example.com', 4, 'APPROVED', NOW()),
('Excellent comparison. I was about to buy an endowment plan but you saved me!', 'Deepak Nair', 'deepak@example.com', 5, 'APPROVED', NOW()),
('Can you also cover ELSS funds in detail? Great content overall.', 'Kavya Reddy', 'kavya@example.com', 1, 'PENDING', NOW());

COMMIT;
