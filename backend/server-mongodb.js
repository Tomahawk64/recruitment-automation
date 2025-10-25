const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://recruitment-automation-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
  gstRate: { type: Number, default: 0.18 },
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalAmount: Number,
  invoiceDate: { type: Date, default: Date.now },
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

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Recruitment Automation API is running',
    developer: {
      name: 'Prince Kushwaha',
      mobile: '+91 9999631770',
      email: 'princekkushwaha@outlook.com',
      note: 'Developed for Recruitment Process Assignment'
    }
  });
});

// Developer Info Endpoint
app.get('/api/developer', (req, res) => {
  res.json({
    success: true,
    developer: {
      name: 'Prince Kushwaha',
      mobile: '+91 9999631770',
      email: 'princekkushwaha@outlook.com',
      github: 'Available on request',
      linkedin: 'Available on request',
      project: 'Recruitment Automation System',
      purpose: 'Assignment for Recruitment Process',
      techStack: {
        backend: 'Node.js + Express + MongoDB',
        frontend: 'React + TypeScript + Tailwind CSS',
        features: [
          'CRUD Operations for Closures',
          'Invoice Generation with PDF',
          'Incentive Calculation Engine',
          'Cloudflare R2 Integration',
          'EmailJS Integration',
          'GST Calculation & Reporting',
          'Cashflow Tracking',
          'Dashboard Analytics'
        ]
      }
    }
  });
});

// Closures endpoints
app.get('/api/closures', async (req, res) => {
  try {
    const closures = await Closure.find().sort({ createdAt: -1 });
    res.json({ success: true, count: closures.length, data: closures });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/closures/:id', async (req, res) => {
  try {
    const closure = await Closure.findById(req.params.id);
    if (!closure) return res.status(404).json({ success: false, error: 'Closure not found' });
    res.json({ success: true, data: closure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/closures', async (req, res) => {
  try {
    const { fixedCTC, monthlyBonus = 0 } = req.body;
    const incentiveData = calculateIncentive(fixedCTC);
    
    const closureData = {
      ...req.body,
      incentivePercentage: incentiveData.percentage,
      calculatedIncentive: Math.floor(incentiveData.amount),
      monthlyBonus,
      totalIncentive: Math.floor(incentiveData.amount + monthlyBonus)
    };
    
    const closure = await Closure.create(closureData);
    res.status(201).json({ success: true, data: closure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Invoices endpoints
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/invoices/generate/:closureId', async (req, res) => {
  try {
    const closure = await Closure.findById(req.params.closureId);
    if (!closure) return res.status(404).json({ success: false, error: 'Closure not found' });

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ closureId: closure._id });
    if (existingInvoice) {
      return res.status(400).json({ success: false, error: 'Invoice already exists for this closure' });
    }

    // Generate invoice number
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNo = `INV-2025-${String(invoiceCount + 1).padStart(3, '0')}`;

    // Calculate GST
    const baseAmount = closure.calculatedIncentive;
    const clientStateCode = '27'; // Random for demo
    const localStateCode = '29'; // Karnataka

    let cgst = 0, sgst = 0, igst = 0;
    if (clientStateCode === localStateCode) {
      cgst = baseAmount * 0.09;
      sgst = baseAmount * 0.09;
    } else {
      igst = baseAmount * 0.18;
    }

    const totalAmount = baseAmount + cgst + sgst + igst;
    const invoiceDate = new Date();
    const dueDate = addMonths(invoiceDate, 1);

    const invoiceData = {
      invoiceNo,
      closureId: closure._id,
      clientName: closure.company,
      clientAddress: '123 Business Park, Bangalore, Karnataka 560001',
      clientGSTIN: '29ABCDE1234F1Z5',
      clientStateCode,
      candidateName: closure.candidateName,
      role: closure.role,
      baseAmount,
      gstRate: 0.18,
      cgst: Math.floor(cgst),
      sgst: Math.floor(sgst),
      igst: Math.floor(igst),
      totalAmount: Math.floor(totalAmount),
      invoiceDate,
      dueDate,
      paymentTerms: 'Net 30',
      isPaid: false,
      pdfUrl: `https://example.com/invoices/${invoiceNo}.pdf`,
      emailSent: false
    };

    const invoice = await Invoice.create(invoiceData);
    
    // Update closure with invoice info
    closure.invoiceReady = true;
    closure.invoiceNo = invoiceNo;
    await closure.save();
    
    console.log(`✅ Invoice ${invoiceNo} generated for closure: ${closure.candidateName}`);
    
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/invoices/:id/paid', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paidDate: new Date() },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
    console.log(`✅ Invoice ${invoice.invoiceNo} marked as paid`);
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PDF Download endpoint
app.get('/api/invoices/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });

    // Generate HTML invoice
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .header h1 { color: #2563eb; font-size: 32px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .details-section { flex: 1; }
    .details-section h3 { color: #2563eb; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
    .details-section p { color: #333; font-size: 13px; line-height: 1.6; margin: 3px 0; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .invoice-table th { background: #2563eb; color: white; padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; }
    .invoice-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; color: #333; font-size: 14px; }
    .invoice-table tr:last-child td { border-bottom: none; }
    .text-right { text-align: right; }
    .totals { margin-top: 20px; display: flex; justify-content: flex-end; }
    .totals-table { width: 350px; }
    .totals-table tr td { padding: 8px; font-size: 14px; }
    .totals-table tr:last-child { font-weight: bold; font-size: 16px; background: #f3f4f6; }
    .totals-table tr:last-child td { border-top: 2px solid #2563eb; padding: 12px 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .company-info { background: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .company-info h4 { color: #2563eb; font-size: 16px; margin-bottom: 8px; }
    .company-info p { color: #666; font-size: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <h1>INVOICE</h1>
      <p>Recruitment Solutions Pvt Ltd</p>
      <p>Professional Recruitment Services</p>
    </div>

    <!-- Company Info -->
    <div class="company-info">
      <h4>From:</h4>
      <p><strong>Recruitment Solutions Pvt Ltd</strong></p>
      <p>123 Business Park, Electronic City</p>
      <p>Bangalore, Karnataka 560100</p>
      <p>GSTIN: 29ABCDE1234F1Z5</p>
      <p>Email: billing@recruitmentsolutions.com</p>
      <p>Phone: +91 80 1234 5678</p>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details">
      <div class="details-section">
        <h3>Bill To:</h3>
        <p><strong>${invoice.clientName}</strong></p>
        <p>${invoice.clientAddress || 'Address on file'}</p>
        <p>GSTIN: ${invoice.clientGSTIN || 'N/A'}</p>
      </div>
      <div class="details-section" style="text-align: right;">
        <h3>Invoice Details:</h3>
        <p><strong>Invoice #:</strong> ${invoice.invoiceNo}</p>
        <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
        <div class="status-badge ${invoice.isPaid ? 'status-paid' : 'status-pending'}">
          ${invoice.isPaid ? '✓ PAID' : '⏳ PENDING'}
        </div>
      </div>
    </div>

    <!-- Invoice Items -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Recruitment Fee - ${invoice.role}</strong><br>
            <small style="color: #666;">Candidate: ${invoice.candidateName}</small><br>
            <small style="color: #666;">Successfully placed at ${invoice.clientName}</small>
          </td>
          <td class="text-right">${invoice.baseAmount.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <table class="totals-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">₹${invoice.baseAmount.toLocaleString('en-IN')}</td>
        </tr>
        ${invoice.cgst > 0 ? `
        <tr>
          <td>CGST (9%):</td>
          <td class="text-right">₹${invoice.cgst.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>SGST (9%):</td>
          <td class="text-right">₹${invoice.sgst.toLocaleString('en-IN')}</td>
        </tr>
        ` : ''}
        ${invoice.igst > 0 ? `
        <tr>
          <td>IGST (18%):</td>
          <td class="text-right">₹${invoice.igst.toLocaleString('en-IN')}</td>
        </tr>
        ` : ''}
        <tr>
          <td><strong>Total Amount:</strong></td>
          <td class="text-right"><strong>₹${invoice.totalAmount.toLocaleString('en-IN')}</strong></td>
        </tr>
      </table>
    </div>

    ${invoice.notes ? `
    <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
      <strong style="color: #92400e;">Notes:</strong>
      <p style="color: #92400e; margin-top: 5px;">${invoice.notes}</p>
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p><strong>Payment Instructions:</strong></p>
      <p>Bank: HDFC Bank | Account Name: Recruitment Solutions Pvt Ltd</p>
      <p>Account Number: 1234567890 | IFSC Code: HDFC0001234</p>
      <p style="margin-top: 15px;">Thank you for your business!</p>
      <p style="margin-top: 5px; font-size: 11px;">This is a computer-generated invoice and does not require a signature.</p>
      <p style="margin-top: 10px; color: #2563eb;"><strong>Contact:</strong> Prince Kushwaha | +91 9999631770 | princekkushwaha@outlook.com</p>
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="${invoice.invoiceNo}.html"`);
    res.send(html);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const totalClosures = await Closure.countDocuments();
    const invoices = await Invoice.find();
    
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.isPaid).length;
    const unpaidInvoices = invoices.filter(inv => !inv.isPaid).length;
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidRevenue = invoices.filter(inv => inv.isPaid).reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingRevenue = invoices.filter(inv => !inv.isPaid).reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    const closures = await Closure.find();
    const totalIncentives = closures.reduce((sum, c) => sum + (c.totalIncentive || 0), 0);
    const grossProfit = totalRevenue - totalIncentives;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        totalClosures,
        totalInvoices,
        paidInvoices,
        unpaidInvoices,
        overdueInvoices: 0, // Calculate if needed
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        totalIncentives,
        grossProfit,
        profitMargin,
        // Legacy fields for backward compatibility
        pendingInvoices: unpaidInvoices,
        paidAmount: paidRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/revenue/monthly', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const monthlyRevenue = {};
    
    invoices.forEach(inv => {
      const month = inv.invoiceDate.toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.totalAmount;
    });
    
    const data = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/clients/top', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const clientRevenue = {};
    
    invoices.forEach(inv => {
      clientRevenue[inv.clientName] = (clientRevenue[inv.clientName] || 0) + inv.totalAmount;
    });
    
    const data = Object.entries(clientRevenue)
      .map(([clientName, totalRevenue]) => ({ clientName, totalRevenue }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/recruiters/performance', async (req, res) => {
  try {
    const closures = await Closure.find();
    const recruiterStats = {};
    
    closures.forEach(c => {
      if (!recruiterStats[c.sourcedBy]) {
        recruiterStats[c.sourcedBy] = { totalClosures: 0, totalIncentives: 0 };
      }
      recruiterStats[c.sourcedBy].totalClosures++;
      recruiterStats[c.sourcedBy].totalIncentives += c.totalIncentive || 0;
    });
    
    const data = Object.entries(recruiterStats).map(([recruiterName, stats]) => ({
      recruiterName,
      ...stats
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/cashflow', async (req, res) => {
  try {
    const unpaidInvoices = await Invoice.find({ isPaid: false });
    const today = new Date();
    
    const timeline = {
      overdue: [],
      current: [],
      upcoming30: [],
      upcoming60: []
    };
    
    let overdueAmount = 0, currentAmount = 0, upcoming30Amount = 0, upcoming60Amount = 0;
    
    unpaidInvoices.forEach(inv => {
      const dueDate = new Date(inv.dueDate);
      const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 0) {
        // Overdue
        overdueAmount += inv.totalAmount;
        timeline.overdue.push(inv);
      } else if (daysDiff <= 30) {
        // Due in 0-30 days
        currentAmount += inv.totalAmount;
        timeline.current.push(inv);
      } else if (daysDiff <= 60) {
        // Due in 31-60 days
        upcoming30Amount += inv.totalAmount;
        timeline.upcoming30.push(inv);
      } else {
        // Due in 60+ days
        upcoming60Amount += inv.totalAmount;
        timeline.upcoming60.push(inv);
      }
    });
    
    res.json({
      success: true,
      data: {
        timeline,
        summary: {
          overdueAmount,
          currentAmount,
          upcoming30Amount,
          upcoming60Amount,
          totalOutstanding: overdueAmount + currentAmount + upcoming30Amount + upcoming60Amount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/gst', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    
    const totalCGST = invoices.reduce((sum, inv) => sum + (inv.cgst || 0), 0);
    const totalSGST = invoices.reduce((sum, inv) => sum + (inv.sgst || 0), 0);
    const totalIGST = invoices.reduce((sum, inv) => sum + (inv.igst || 0), 0);
    const totalGST = totalCGST + totalSGST + totalIGST;
    const totalBase = invoices.reduce((sum, inv) => sum + (inv.baseAmount || 0), 0);
    
    res.json({
      success: true,
      data: {
        summary: {
          totalBase,
          totalCGST,
          totalSGST,
          totalIGST,
          totalGST
        },
        invoices: invoices.map(inv => ({
          invoiceNo: inv.invoiceNo,
          clientName: inv.clientName,
          baseAmount: inv.baseAmount,
          cgst: inv.cgst || 0,
          sgst: inv.sgst || 0,
          igst: inv.igst || 0,
          totalAmount: inv.totalAmount
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Additional endpoints for frontend compatibility
app.get('/api/cashflow', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ dueDate: 1 });
    const today = new Date();
    
    let paidRevenue = 0, pendingRevenue = 0, overdueAmount = 0, overdueCount = 0;
    
    const invoiceList = invoices.map(inv => {
      const dueDate = new Date(inv.dueDate);
      const daysOverdue = inv.isPaid ? 0 : Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      
      if (inv.isPaid) {
        paidRevenue += inv.totalAmount;
      } else {
        pendingRevenue += inv.totalAmount;
        if (daysOverdue > 0) {
          overdueAmount += inv.totalAmount;
          overdueCount++;
        }
      }
      
      return {
        ...inv.toObject(),
        daysOverdue: daysOverdue > 0 ? daysOverdue : 0
      };
    });
    
    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: paidRevenue + pendingRevenue,
          paidRevenue,
          pendingRevenue,
          overdueAmount,
          overdueCount
        },
        invoices: invoiceList
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/gst/summary', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    
    const totalCGST = invoices.reduce((sum, inv) => sum + (inv.cgst || 0), 0);
    const totalSGST = invoices.reduce((sum, inv) => sum + (inv.sgst || 0), 0);
    const totalIGST = invoices.reduce((sum, inv) => sum + (inv.igst || 0), 0);
    const totalGST = totalCGST + totalSGST + totalIGST;
    const totalBase = invoices.reduce((sum, inv) => sum + (inv.baseAmount || 0), 0);
    
    res.json({
      success: true,
      data: {
        summary: {
          totalBase,
          totalCGST,
          totalSGST,
          totalIGST,
          totalGST
        },
        invoices: invoices.map(inv => ({
          invoiceNo: inv.invoiceNo,
          clientName: inv.clientName,
          baseAmount: inv.baseAmount,
          cgst: inv.cgst || 0,
          sgst: inv.sgst || 0,
          igst: inv.igst || 0,
          totalGST: (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0),
          totalAmount: inv.totalAmount,
          invoiceDate: inv.invoiceDate
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log('   RECRUITMENT AUTOMATION SYSTEM');
      console.log('   ========================================');
      console.log(`   Server running on port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/health`);
      console.log(`   Developer Info: http://localhost:${PORT}/api/developer`);
      console.log('   ========================================');
      console.log('   👨‍💻 Developed by: Prince Kushwaha');
      console.log('   📱 Mobile: +91 9999631770');
      console.log('   📧 Email: princekkushwaha@outlook.com');
      console.log('   📝 Assignment for Recruitment Process');
      console.log('   ========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();
