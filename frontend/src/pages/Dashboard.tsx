import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { getDashboardSummary, getRevenueByMonth, getTopClients, getRecruiterPerformance } from '../services/api';

export default function Dashboard() {
  const { data: summary, error: summaryError } = useQuery({ queryKey: ['dashboard-summary'], queryFn: getDashboardSummary });
  const { data: revenueData } = useQuery({ queryKey: ['revenue-by-month'], queryFn: getRevenueByMonth });
  const { data: topClients } = useQuery({ queryKey: ['top-clients'], queryFn: getTopClients });
  const { data: recruiterPerf } = useQuery({ queryKey: ['recruiter-performance'], queryFn: () => getRecruiterPerformance() });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  if (summaryError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading dashboard</p>
          <p className="text-gray-600 mt-2">Please make sure the backend server is running on port 4000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Clean Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h1>
              <p className="text-blue-100 text-sm font-medium">Complete recruitment management with real-time analytics and insights</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <p className="text-xs text-white font-semibold">Incentive Tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <p className="text-xs text-white font-semibold">GST Invoicing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <p className="text-xs text-white font-semibold">Cashflow Analysis</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
              <p className="text-xs text-white font-semibold">Performance Metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-900">Performance Metrics</h2>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-green-700">Revenue</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(summary?.totalRevenue || 0)}</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>From all closures</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-blue-700">Profit</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Gross Profit</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(summary?.grossProfit || 0)}</p>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>{summary?.profitMargin?.toFixed(1) || 0}% margin</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="bg-purple-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-purple-700">Closures</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Total Closures</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{summary?.totalClosures || 0}</p>
            <div className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Active candidates</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-orange-700">Pending</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">Pending Invoices</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{summary?.unpaidInvoices || 0}</p>
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Awaiting payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Trend</h2>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue performance</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData?.slice().reverse()}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Clients</h2>
              <p className="text-sm text-gray-500 mt-1">Highest revenue generators</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topClients?.slice(0, 5)}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="clientName" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
              <Bar dataKey="totalRevenue" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recruiter Performance */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recruiter Performance</h2>
              <p className="text-sm text-gray-500 mt-1">Top performing recruiters</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            {recruiterPerf?.slice(0, 5).map((recruiter, index) => (
              <div key={index} className="group relative bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-600 to-red-600' :
                      'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{recruiter.recruiterName}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {recruiter.closuresCount} closures
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Total Incentives</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatCurrency(recruiter.totalIncentives)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Financial Summary</h2>
              <p className="text-sm text-gray-600 mt-1">Overall business metrics</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Total Revenue
              </span>
              <span className="font-bold text-xl text-gray-900">{formatCurrency(summary?.totalRevenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Total Incentives
              </span>
              <span className="font-bold text-xl text-red-600">-{formatCurrency(summary?.totalIncentives || 0)}</span>
            </div>
            <div className="flex justify-between items-center bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-xl shadow-md border-2 border-green-200">
              <span className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Gross Profit
              </span>
              <span className="font-bold text-2xl text-green-700">{formatCurrency(summary?.grossProfit || 0)}</span>
            </div>
            <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Profit Margin
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                  {summary?.profitMargin?.toFixed(2) || '0.00'}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
