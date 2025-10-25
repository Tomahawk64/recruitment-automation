import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClosures, generateInvoice, createClosure } from '../services/api';
import { Closure } from '../types';
import { useState } from 'react';
import AddClosureModal from '../components/AddClosureModal';

export default function Closures() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: closures, isLoading, error } = useQuery({ queryKey: ['closures'], queryFn: getClosures });

  const generateInvoiceMutation = useMutation({
    mutationFn: (closureId: string) => generateInvoice(closureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['closures'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to generate invoice');
    }
  });

  const createClosureMutation = useMutation({
    mutationFn: (data: any) => createClosure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['closures'] });
      toast.success('Closure created successfully!');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create closure');
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading closures...</div></div>;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading closures</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Recruitment Closures</h1>
              <p className="text-purple-100 text-sm mt-1">Manage candidate placements and track incentives</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Closure
          </button>
        </div>
      </div>

      <AddClosureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createClosureMutation.mutate}
        isLoading={createClosureMutation.isPending}
      />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fixed CTC</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Incentive</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sourced By</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {closures?.map((closure: Closure) => (
              <tr key={closure._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {closure.candidateName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-900">{closure.candidateName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{closure.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{closure.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(closure.fixedCTC)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-green-600">{formatCurrency(closure.calculatedIncentive)}</span>
                    <span className="text-xs text-gray-500">{closure.incentivePercentage}% slab</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold text-xs">
                      {closure.sourcedBy.charAt(0)}
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{closure.sourcedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {closure.invoiceReady ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {closure.invoiceNo}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {!closure.invoiceReady && (
                    <button
                      onClick={() => generateInvoiceMutation.mutate(closure._id)}
                      disabled={generateInvoiceMutation.isPending}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
