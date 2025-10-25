/**
 * Real-World Scenario Data Seeding Script
 * Creates comprehensive demo data that showcases all features and metrics
 * 
 * Scenario: ConsultBae Recruitment Firm - Q4 2024 to Q1 2025 Operations
 * - 30 closures across 3 months with varied recruiters
 * - Mix of payment statuses (paid, pending, overdue)
 * - Different CTC ranges to show all incentive slabs
 * - Multiple states for GST variety (CGST/SGST and IGST)
 * - Recruiter bonuses triggered (≥5 joiners for some recruiters)
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB Schemas
const closureSchema = new mongoose.Schema({
  candidateName: String,
  company: String,
  role: String,
  source: String,
  sourcedBy: String,
  screenedBy: String,
  accountManager: String,
  ctcOffered: Number,
  fixedCTC: Number,
  joiningMonth: String,
  incentivePercentage: Number,
  calculatedIncentive: Number,
  monthlyBonus: { type: Number, default: 0 },
  totalIncentive: Number,
  paymentTerms: { type: String, default: 'Net 30' },
  invoiceReady: { type: Boolean, default: false },
  invoiceNo: String,
  paymentReceived: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  closureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Closure', required: true },
  clientName: String,
  clientAddress: String,
  clientGSTIN: String,
  clientStateCode: String,
  candidateName: String,
  role: String,
  baseAmount: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalAmount: Number,
  invoiceDate: Date,
  dueDate: Date,
  paymentTerms: { type: String, default: 'Net 30' },
  isPaid: { type: Boolean, default: false },
  paidDate: Date,
  pdfUrl: String,
  emailSent: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

const Closure = mongoose.model('Closure', closureSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Helper Functions
const calculateIncentive = (fixedCTC) => {
  if (fixedCTC < 600000) return { percentage: 5, amount: fixedCTC * 0.05 };
  if (fixedCTC <= 1000000) return { percentage: 7, amount: fixedCTC * 0.07 };
  return { percentage: 10, amount: fixedCTC * 0.10 };
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Real-world data pools
const recruiters = [
  'Priya Sharma',      // Will have 8 closures (bonus eligible)
  'Rajesh Kumar',      // Will have 7 closures (bonus eligible)
  'Anita Desai',       // Will have 6 closures (bonus eligible)
  'Vikram Singh',      // Will have 5 closures (bonus eligible)
  'Neha Patel'         // Will have 4 closures (not eligible)
];

const accountManagers = ['Amit Kumar', 'Sneha Gupta', 'Rohit Verma'];

const companies = [
  { name: 'TechCorp Solutions', state: '29', gstin: '29ABCDE1234F1Z5', address: 'Bangalore, Karnataka 560001' },
  { name: 'InfoSys Digital', state: '29', gstin: '29FGHIJ5678K2L3', address: 'Mysore, Karnataka 570001' },
  { name: 'Wipro Technologies', state: '29', gstin: '29MNOPQ9012R3S4', address: 'Bangalore, Karnataka 560100' },
  { name: 'CloudNet Systems', state: '27', gstin: '27TUVWX3456Y7Z8', address: 'Mumbai, Maharashtra 400001' },
  { name: 'DataMind Analytics', state: '27', gstin: '27ABCXY7890D1E2', address: 'Pune, Maharashtra 411001' },
  { name: 'FinTech Innovations', state: '06', gstin: '06FGHPQ2345K6L7', address: 'Chennai, Tamil Nadu 600001' },
  { name: 'CyberSec Corp', state: '19', gstin: '19MNORS8901T2U3', address: 'Kolkata, West Bengal 700001' },
  { name: 'AI Ventures', state: '07', gstin: '07VWXYZ4567A8B9', address: 'Delhi 110001' },
  { name: 'BlockChain Labs', state: '36', gstin: '36CDEFG0123H4I5', address: 'Hyderabad, Telangana 500001' },
  { name: 'MegaTech Industries', state: '09', gstin: '09JKLMN6789O1P2', address: 'Lucknow, Uttar Pradesh 226001' }
];

const roles = [
  { title: 'Senior Software Engineer', ctcRange: [800000, 1200000] },
  { title: 'Full Stack Developer', ctcRange: [600000, 900000] },
  { title: 'DevOps Engineer', ctcRange: [700000, 1100000] },
  { title: 'Data Analyst', ctcRange: [400000, 700000] },
  { title: 'Product Manager', ctcRange: [1000000, 1500000] },
  { title: 'UI/UX Designer', ctcRange: [500000, 800000] },
  { title: 'QA Engineer', ctcRange: [450000, 650000] },
  { title: 'Business Analyst', ctcRange: [550000, 850000] },
  { title: 'Team Lead', ctcRange: [1200000, 1800000] },
  { title: 'Technical Architect', ctcRange: [1500000, 2500000] }
];

const candidates = [
  'Arjun Mehta', 'Divya Iyer', 'Karthik Reddy', 'Pooja Nair', 'Sanjay Malhotra',
  'Aarti Joshi', 'Ravi Shankar', 'Meera Krishnan', 'Aditya Kapoor', 'Nisha Agarwal',
  'Rohan Deshmukh', 'Kavya Srinivas', 'Akash Verma', 'Shreya Bhat', 'Manoj Kumar',
  'Lakshmi Menon', 'Varun Chatterjee', 'Priyanka Das', 'Suresh Naik', 'Anjali Rao',
  'Deepak Singh', 'Gayatri Pillai', 'Harish Jain', 'Ishita Sharma', 'Jayant Kulkarni',
  'Kirti Patel', 'Lokesh Reddy', 'Manisha Khanna', 'Naveen Kumar', 'Oindrila Banerjee'
];

const sources = ['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Company Website'];

// Generate realistic closures
const generateClosures = () => {
  const closures = [];
  let candidateIndex = 0;

  // Distribution: Priya(8), Rajesh(7), Anita(6), Vikram(5), Neha(4) = 30 total
  const recruiterDistribution = [
    { recruiter: 'Priya Sharma', count: 8, joiningMonth: '2024-11' },
    { recruiter: 'Rajesh Kumar', count: 7, joiningMonth: '2024-12' },
    { recruiter: 'Anita Desai', count: 6, joiningMonth: '2025-01' },
    { recruiter: 'Vikram Singh', count: 5, joiningMonth: '2024-12' },
    { recruiter: 'Neha Patel', count: 4, joiningMonth: '2025-01' }
  ];

  recruiterDistribution.forEach(({ recruiter, count, joiningMonth }) => {
    for (let i = 0; i < count; i++) {
      const role = getRandomItem(roles);
      const company = getRandomItem(companies);
      const fixedCTC = Math.floor(Math.random() * (role.ctcRange[1] - role.ctcRange[0]) + role.ctcRange[0]);
      const ctcOffered = Math.floor(fixedCTC * 1.12); // 12% variable component
      const incentiveData = calculateIncentive(fixedCTC);
      
      // Calculate monthly bonus for eligible recruiters (≥5 joiners)
      const monthlyBonus = count >= 5 ? 2000 : 0;

      closures.push({
        candidateName: candidates[candidateIndex++],
        company: company.name,
        role: role.title,
        source: getRandomItem(sources),
        sourcedBy: recruiter,
        screenedBy: recruiter,
        accountManager: getRandomItem(accountManagers),
        ctcOffered,
        fixedCTC,
        joiningMonth,
        incentivePercentage: incentiveData.percentage,
        calculatedIncentive: Math.floor(incentiveData.amount),
        monthlyBonus,
        totalIncentive: Math.floor(incentiveData.amount + monthlyBonus),
        paymentTerms: Math.random() > 0.7 ? 'Net 45' : 'Net 30',
        invoiceReady: false, // Will be updated when invoice is created
        paymentReceived: false,
        notes: i === 0 && count >= 5 ? `${recruiter} achieved ${count} joiners - Bonus eligible!` : ''
      });
    }
  });

  return closures;
};

// Generate realistic invoices with payment status distribution
const generateInvoices = (closures) => {
  const invoices = [];
  const today = new Date();
  
  // Payment status distribution:
  // - 40% Paid (12 invoices)
  // - 35% Pending on time (10 invoices)
  // - 15% Overdue by 5-15 days (5 invoices)
  // - 10% Overdue by 15-30 days (3 invoices)
  
  const statusDistribution = [
    { status: 'paid', count: 12, daysAgo: [45, 90] },
    { status: 'pending', count: 10, daysAgo: [0, 20] },
    { status: 'overdue-mild', count: 5, daysAgo: [35, 45] },
    { status: 'overdue-severe', count: 3, daysAgo: [50, 75] }
  ];

  let closureIndex = 0;
  let invoiceCounter = 1;

  statusDistribution.forEach(({ status, count, daysAgo }) => {
    for (let i = 0; i < count && closureIndex < closures.length; i++) {
      const closure = closures[closureIndex++];
      const company = companies.find(c => c.name === closure.company);
      
      const daysBack = Math.floor(Math.random() * (daysAgo[1] - daysAgo[0]) + daysAgo[0]);
      const invoiceDate = new Date(today);
      invoiceDate.setDate(invoiceDate.getDate() - daysBack);
      
      const paymentDays = closure.paymentTerms === 'Net 45' ? 45 : 30;
      const dueDate = addDays(invoiceDate, paymentDays);
      
      const baseAmount = closure.calculatedIncentive;
      const localStateCode = '29'; // Karnataka (company location)
      
      let cgst = 0, sgst = 0, igst = 0;
      if (company.state === localStateCode) {
        cgst = Math.floor(baseAmount * 0.09);
        sgst = Math.floor(baseAmount * 0.09);
      } else {
        igst = Math.floor(baseAmount * 0.18);
      }
      
      const totalAmount = baseAmount + cgst + sgst + igst;
      
      const isPaid = status === 'paid';
      const paidDate = isPaid ? addDays(dueDate, -Math.floor(Math.random() * 5)) : null;

      invoices.push({
        invoiceNo: `INV-2025-${String(invoiceCounter++).padStart(3, '0')}`,
        closureId: null, // Will be set after closure is saved
        clientName: company.name,
        clientAddress: company.address,
        clientGSTIN: company.gstin,
        clientStateCode: company.state,
        candidateName: closure.candidateName,
        role: closure.role,
        baseAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        invoiceDate,
        dueDate,
        paymentTerms: closure.paymentTerms,
        isPaid,
        paidDate,
        pdfUrl: `https://example.com/invoices/INV-2025-${String(invoiceCounter - 1).padStart(3, '0')}.pdf`,
        emailSent: true,
        notes: isPaid ? 'Payment received on time' : (status.includes('overdue') ? 'Payment overdue - follow up required' : '')
      });
    }
  });

  return invoices;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('\n🚀 REAL-WORLD SCENARIO DATA SEEDING');
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    console.log('\n🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Closure.deleteMany({});
    await Invoice.deleteMany({});
    console.log('✅ Database cleared\n');

    // Generate closures
    console.log('📝 Generating closures...');
    const closuresData = generateClosures();
    const createdClosures = await Closure.insertMany(closuresData);
    console.log(`✅ Created ${createdClosures.length} closures\n`);

    // Display recruiter summary
    console.log('👥 RECRUITER PERFORMANCE SUMMARY:');
    console.log('─'.repeat(60));
    const recruiterStats = {};
    createdClosures.forEach(c => {
      if (!recruiterStats[c.sourcedBy]) {
        recruiterStats[c.sourcedBy] = {
          closures: 0,
          totalIncentive: 0,
          bonusEligible: false
        };
      }
      recruiterStats[c.sourcedBy].closures++;
      recruiterStats[c.sourcedBy].totalIncentive += c.totalIncentive;
      if (recruiterStats[c.sourcedBy].closures >= 5) {
        recruiterStats[c.sourcedBy].bonusEligible = true;
      }
    });

    Object.entries(recruiterStats).forEach(([name, stats]) => {
      const bonusStatus = stats.bonusEligible ? '🎉 BONUS ELIGIBLE' : '⏳ Not eligible';
      const bonusAmount = stats.bonusEligible ? stats.closures * 2000 : 0;
      console.log(`   ${name}:`);
      console.log(`      Closures: ${stats.closures}`);
      console.log(`      Base Incentive: ₹${stats.totalIncentive.toLocaleString('en-IN')}`);
      console.log(`      Monthly Bonus: ₹${bonusAmount.toLocaleString('en-IN')} ${bonusStatus}`);
      console.log(`      Total Earnings: ₹${(stats.totalIncentive + bonusAmount).toLocaleString('en-IN')}`);
      console.log('');
    });

    // Generate invoices
    console.log('📄 Generating invoices...');
    const invoicesData = generateInvoices(createdClosures);
    
    // Link invoices to closures
    for (let i = 0; i < invoicesData.length; i++) {
      invoicesData[i].closureId = createdClosures[i]._id;
      
      // Update closure with invoice info
      createdClosures[i].invoiceReady = true;
      createdClosures[i].invoiceNo = invoicesData[i].invoiceNo;
      createdClosures[i].paymentReceived = invoicesData[i].isPaid;
      await createdClosures[i].save();
    }
    
    const createdInvoices = await Invoice.insertMany(invoicesData);
    console.log(`✅ Created ${createdInvoices.length} invoices\n`);

    // Calculate and display metrics
    console.log('📊 BUSINESS METRICS SUMMARY:');
    console.log('─'.repeat(60));
    
    const totalRevenue = createdInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidRevenue = createdInvoices.filter(inv => inv.isPaid).reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    
    const totalIncentives = createdClosures.reduce((sum, c) => sum + c.totalIncentive, 0);
    const grossProfit = totalRevenue - totalIncentives;
    const profitMargin = (grossProfit / totalRevenue * 100).toFixed(2);
    
    const today = new Date();
    const overdueInvoices = createdInvoices.filter(inv => !inv.isPaid && new Date(inv.dueDate) < today);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    const totalGST = createdInvoices.reduce((sum, inv) => sum + (inv.cgst + inv.sgst + inv.igst), 0);
    const totalCGST = createdInvoices.reduce((sum, inv) => sum + inv.cgst, 0);
    const totalSGST = createdInvoices.reduce((sum, inv) => sum + inv.sgst, 0);
    const totalIGST = createdInvoices.reduce((sum, inv) => sum + inv.igst, 0);

    console.log('💰 REVENUE:');
    console.log(`   Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`   Paid: ₹${paidRevenue.toLocaleString('en-IN')} (${(paidRevenue/totalRevenue*100).toFixed(1)}%)`);
    console.log(`   Pending: ₹${pendingRevenue.toLocaleString('en-IN')} (${(pendingRevenue/totalRevenue*100).toFixed(1)}%)`);
    console.log(`   Overdue: ₹${overdueAmount.toLocaleString('en-IN')} (${overdueInvoices.length} invoices)\n`);
    
    console.log('💸 EXPENSES (Incentives):');
    console.log(`   Total Incentives: ₹${totalIncentives.toLocaleString('en-IN')}\n`);
    
    console.log('📈 PROFIT & LOSS:');
    console.log(`   Gross Profit: ₹${grossProfit.toLocaleString('en-IN')}`);
    console.log(`   Profit Margin: ${profitMargin}%\n`);
    
    console.log('🧾 GST SUMMARY:');
    console.log(`   Total GST: ₹${totalGST.toLocaleString('en-IN')}`);
    console.log(`   CGST: ₹${totalCGST.toLocaleString('en-IN')}`);
    console.log(`   SGST: ₹${totalSGST.toLocaleString('en-IN')}`);
    console.log(`   IGST: ₹${totalIGST.toLocaleString('en-IN')}\n`);
    
    console.log('📦 DATA DISTRIBUTION:');
    console.log(`   Total Closures: ${createdClosures.length}`);
    console.log(`   Total Invoices: ${createdInvoices.length}`);
    console.log(`   Paid Invoices: ${createdInvoices.filter(i => i.isPaid).length}`);
    console.log(`   Pending Invoices: ${createdInvoices.filter(i => !i.isPaid).length}`);
    console.log(`   Overdue Invoices: ${overdueInvoices.length}\n`);
    
    console.log('🎯 INCENTIVE SLAB DISTRIBUTION:');
    const slab5 = createdClosures.filter(c => c.incentivePercentage === 5).length;
    const slab7 = createdClosures.filter(c => c.incentivePercentage === 7).length;
    const slab10 = createdClosures.filter(c => c.incentivePercentage === 10).length;
    console.log(`   Slab A (5%): ${slab5} closures (CTC < ₹6L)`);
    console.log(`   Slab B (7%): ${slab7} closures (CTC ₹6L-₹10L)`);
    console.log(`   Slab C (10%): ${slab10} closures (CTC ≥ ₹10L)\n`);
    
    console.log('🌍 GST TYPE DISTRIBUTION:');
    const intraState = createdInvoices.filter(i => i.cgst > 0).length;
    const interState = createdInvoices.filter(i => i.igst > 0).length;
    console.log(`   Intra-State (CGST+SGST): ${intraState} invoices`);
    console.log(`   Inter-State (IGST): ${interState} invoices\n`);

    console.log('=' .repeat(60));
    console.log('✅ REAL-WORLD SCENARIO DATA SEEDING COMPLETE!\n');
    console.log('🎯 All features are now demonstrated:');
    console.log('   ✅ Incentive calculation (all 3 slabs used)');
    console.log('   ✅ Monthly recruiter bonus (4 recruiters eligible)');
    console.log('   ✅ Invoice generation (30 invoices)');
    console.log('   ✅ Payment tracking (paid, pending, overdue)');
    console.log('   ✅ GST calculation (both types: CGST+SGST & IGST)');
    console.log('   ✅ P&L dashboard (revenue, expenses, profit)');
    console.log('   ✅ Cashflow timeline (with overdue tracking)');
    console.log('   ✅ All stat cards populated\n');
    
    console.log('🚀 Start servers and test at http://localhost:3000\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
