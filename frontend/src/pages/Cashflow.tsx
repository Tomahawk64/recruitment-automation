import { useQuery } from '@tanstack/react-query';
import { getCashflowTimeline } from '../services/api';

export default function Cashflow() {
  const { data: cashflow, isLoading, error } = useQuery({ queryKey: ['cashflow'], queryFn: getCashflowTimeline });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading cashflow data...</div></div>;
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading cashflow data</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running</p>
        </div>
      </div>
    );
  }

  // Filter overdue invoices from the invoice list
  const overdueInvoices = (cashflow as any)?.invoices?.filter((inv: any) => inv.daysOverdue > 0 && !inv.isPaid) || [];
  const pendingOnTime = (cashflow as any)?.invoices?.filter((inv: any) => inv.daysOverdue === 0 && !inv.isPaid) || [];
  
  const pendingOnTimeAmount = pendingOnTime.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Cashflow Management</h1>
            <p className="text-emerald-100 text-sm mt-1">Track payments, overdue invoices, and financial timeline</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-red-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-red-700">Overdue</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Overdue Payments</p>
            <p className="text-3xl font-bold text-red-600 mb-2">{formatCurrency(cashflow?.summary?.overdueAmount || 0)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {overdueInvoices.length} invoices
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-orange-700">Due Soon</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Due in 0-30 days</p>
            <p className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(pendingOnTimeAmount)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {pendingOnTime.length} invoices
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-yellow-700">Medium</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Due in 31-60 days</p>
            <p className="text-3xl font-bold text-yellow-600 mb-2">{formatCurrency(0)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              0 invoices
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-green-700">Comfortable</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Due in 60+ days</p>
            <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(0)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              0 invoices
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-700">Overdue Invoices</h2>
              <p className="text-sm text-red-600">Requires immediate attention</p>
            </div>
          </div>
        </div>
        
        {overdueInvoices && overdueInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Invoice No</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Client</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Amount</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {overdueInvoices.map((invoice: any) => (
                  <tr key={invoice._id} className="border-b border-gray-200 hover:bg-red-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{invoice.invoiceNo}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {invoice.clientName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{invoice.clientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-red-100 to-rose-100 border border-red-200 rounded-full">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-red-700">{invoice.daysOverdue} days</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No overdue invoices</p>
            <p className="text-sm text-gray-500 mt-1">All invoices are on track!</p>
          </div>
        )}
      </div>
    </div>
  );
}
