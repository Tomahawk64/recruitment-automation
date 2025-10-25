import { useState } from 'react';
import { X } from 'lucide-react';

interface AddClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function AddClosureModal({ isOpen, onClose, onSubmit, isLoading }: AddClosureModalProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    company: '',
    role: '',
    source: 'LinkedIn',
    sourcedBy: '',
    screenedBy: '',
    accountManager: '',
    ctcOffered: '',
    fixedCTC: '',
    joiningMonth: '',
    paymentTerms: 'Net 30',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string numbers to actual numbers
    const submitData = {
      ...formData,
      ctcOffered: Number(formData.ctcOffered),
      fixedCTC: Number(formData.fixedCTC)
    };
    
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      {/* Background overlay */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal - Compact Design */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Closure</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Candidate Name *</label>
                <input
                  type="text"
                  name="candidateName"
                  required
                  value={formData.candidateName}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                >
                  <option>LinkedIn</option>
                  <option>Naukri</option>
                  <option>Referral</option>
                  <option>Direct</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sourced By *</label>
                <input
                  type="text"
                  name="sourcedBy"
                  required
                  value={formData.sourcedBy}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Screened By</label>
                <input
                  type="text"
                  name="screenedBy"
                  value={formData.screenedBy}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Account Manager</label>
                <input
                  type="text"
                  name="accountManager"
                  value={formData.accountManager}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">CTC Offered *</label>
                <input
                  type="number"
                  name="ctcOffered"
                  required
                  value={formData.ctcOffered}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                  placeholder="1500000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fixed CTC *</label>
                <input
                  type="number"
                  name="fixedCTC"
                  required
                  value={formData.fixedCTC}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                  placeholder="1200000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Joining Month *</label>
                <input
                  type="month"
                  name="joiningMonth"
                  required
                  value={formData.joiningMonth}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                >
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>Net 60</option>
                  <option>Net 90</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm px-2 py-1.5 border"
                />
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Closure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
