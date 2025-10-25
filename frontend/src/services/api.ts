import api from '../lib/api';
import { Closure, Invoice, DashboardSummary, RevenueByMonth, TopClient, RecruiterPerformance, CashflowTimeline, GSTSummary } from '../types';

// Closures
export const getClosures = async (): Promise<Closure[]> => {
  const { data } = await api.get('/closures');
  return data.data;
};

export const getClosureById = async (id: string): Promise<Closure> => {
  const { data } = await api.get(`/closures/${id}`);
  return data.data;
};

export const createClosure = async (closure: Partial<Closure>): Promise<Closure> => {
  const { data } = await api.post('/closures', closure);
  return data.data;
};

export const updateClosure = async (id: string, closure: Partial<Closure>): Promise<Closure> => {
  const { data } = await api.put(`/closures/${id}`, closure);
  return data.data;
};

export const deleteClosure = async (id: string): Promise<void> => {
  await api.delete(`/closures/${id}`);
};

export const bulkCreateClosures = async (closures: Partial<Closure>[]): Promise<Closure[]> => {
  const { data } = await api.post('/closures/bulk', { closures });
  return data.data;
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await api.get('/invoices');
  return data.data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const { data } = await api.get(`/invoices/${id}`);
  return data.data;
};

export const generateInvoice = async (closureId: string): Promise<Invoice> => {
  const { data } = await api.post(`/invoices/generate/${closureId}`);
  return data.data;
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
  const { data } = await api.put(`/invoices/${id}`, invoice);
  return data.data;
};

export const markInvoicePaid = async (id: string): Promise<Invoice> => {
  const { data } = await api.put(`/invoices/${id}/paid`);
  return data.data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await api.delete(`/invoices/${id}`);
};

export const getOverdueInvoices = async (): Promise<Invoice[]> => {
  const { data } = await api.get('/invoices/overdue');
  return data.data;
};

// Dashboard
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get('/dashboard/summary');
  return data.data;
};

export const getRevenueByMonth = async (): Promise<RevenueByMonth[]> => {
  const { data } = await api.get('/dashboard/revenue/monthly');
  return data.data;
};

export const getTopClients = async (): Promise<TopClient[]> => {
  const { data } = await api.get('/dashboard/clients/top');
  return data.data;
};

export const getRecruiterPerformance = async (month?: string): Promise<RecruiterPerformance[]> => {
  const { data } = await api.get('/dashboard/recruiters/performance', {
    params: { month }
  });
  return data.data;
};

export const getCashflowTimeline = async (): Promise<CashflowTimeline> => {
  const { data } = await api.get('/cashflow');
  return data.data;
};

export const getGSTSummary = async (startDate?: string, endDate?: string): Promise<GSTSummary> => {
  const { data } = await api.get('/gst/summary', {
    params: { startDate, endDate }
  });
  return data.data;
};
