import { useQuery } from '@tanstack/react-query';
import { getGSTSummary } from '../services/api';

export default function GSTReport() {
  const { data: gstData, isLoading, error } = useQuery({ queryKey: ['gst-summary'], queryFn: () => getGSTSummary() });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading GST data...</div></div>;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading GST data</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">GST Summary Report</h1>
            <p className="text-orange-100 text-sm mt-1">Tax breakdown and compliance overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Base Amount Card */}
        <div className="group relative bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full"></div>
          <div className="relative">
            <div className="inline-flex p-3 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Total Base</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(gstData?.summary?.totalBase || 0)}</p>
          </div>
        </div>

        {/* Total CGST Card */}
        <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-blue-200">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 rounded-full"></div>
          <div className="relative">
            <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">CGST</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(gstData?.summary?.totalCGST || 0)}</p>
          </div>
        </div>

        {/* Total SGST Card */}
        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-green-200">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full"></div>
          <div className="relative">
            <div className="inline-flex p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">SGST</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(gstData?.summary?.totalSGST || 0)}</p>
          </div>
        </div>

        {/* Total IGST Card */}
        <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-purple-200">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full"></div>
          <div className="relative">
            <div className="inline-flex p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">IGST</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(gstData?.summary?.totalIGST || 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-l-4 border-orange-500 px-6 py-4">
          <h2 className="text-xl font-bold text-orange-700">GST Breakdown by Invoice</h2>
          <p className="text-sm text-orange-600 mt-1">Detailed tax breakdown for each invoice</p>
        </div>
        
        {gstData?.invoices && gstData.invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Base Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">CGST</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SGST</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">IGST</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gstData.invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{invoice.invoiceNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {invoice.clientName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{invoice.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.baseAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {invoice.cgst ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
                          {formatCurrency(invoice.cgst)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.sgst ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                          {formatCurrency(invoice.sgst)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.igst ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold">
                          {formatCurrency(invoice.igst)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No GST data available</p>
            <p className="text-sm text-gray-500 mt-1">Generate invoices to see GST breakdown</p>
          </div>
        )}
      </div>
    </div>
  );
}
