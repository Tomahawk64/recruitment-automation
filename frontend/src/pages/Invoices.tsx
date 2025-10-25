import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInvoices, markInvoicePaid } from '../services/api';
import { Invoice } from '../types';
import { format } from 'date-fns';

export default function Invoices() {
  const queryClient = useQueryClient();
  const { data: invoices, isLoading, error } = useQuery({ queryKey: ['invoices'], queryFn: getInvoices });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice marked as paid!');
    },
    onError: () => {
      toast.error('Failed to update invoice');
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  const handleDownloadPDF = (invoiceId: string, invoiceNo: string) => {
    const pdfUrl = `http://localhost:4000/api/invoices/${invoiceId}/pdf`;
    window.open(pdfUrl, '_blank');
    toast.success(`Opening invoice ${invoiceNo}`);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading invoices...</div></div>;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading invoices</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Invoice Management</h1>
              <p className="text-cyan-100 text-sm mt-1">Track and manage all your billing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Invoice No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices?.map((invoice: Invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{invoice.invoiceNo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {invoice.clientName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{invoice.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {invoice.candidateName.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700">{invoice.candidateName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.isPaid ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleDownloadPDF(invoice._id, invoice.invoiceNo)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      PDF
                    </button>
                    {!invoice.isPaid && (
                      <button
                        onClick={() => markPaidMutation.mutate(invoice._id)}
                        disabled={markPaidMutation.isPending}
                        className="inline-flex items-center px-3 py-2 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
