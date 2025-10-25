export interface Closure {
  _id: string;
  candidateName: string;
  company: string;
  role: string;
  source: string;
  sourcedBy: string;
  screenedBy: string;
  accountManager: string;
  ctcOffered: number;
  fixedCTC: number;
  joiningMonth: string;
  incentivePercentage: number;
  calculatedIncentive: number;
  paymentTerms: string;
  invoiceReady: boolean;
  invoiceNo?: string;
  paymentReceived: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  closureId: string;
  clientName: string;
  clientAddress: string;
  clientGSTIN?: string;
  clientStateCode?: string;
  candidateName: string;
  role: string;
  baseAmount: number;
  gstRate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  isPaid: boolean;
  paidDate?: string;
  pdfUrl?: string;
  emailSent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalClosures: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalIncentives: number;
  grossProfit: number;
  profitMargin: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  count: number;
}

export interface TopClient {
  clientName: string;
  totalRevenue: number;
  invoiceCount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface RecruiterPerformance {
  recruiterName: string;
  closuresCount: number;
  totalIncentives: number;
  totalCTC: number;
  avgIncentive: number;
}

export interface CashflowTimeline {
  timeline: {
    current: any[];
    upcoming30: any[];
    upcoming60: any[];
    overdue: any[];
  };
  summary: {
    overdueAmount: number;
    currentAmount: number;
    upcoming30Amount: number;
    upcoming60Amount: number;
  };
}

export interface GSTSummary {
  summary: {
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    totalBase: number;
    totalGST: number;
  };
  invoices: Invoice[];
}
