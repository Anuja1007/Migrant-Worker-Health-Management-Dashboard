import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Bell,
  Settings,
  Download,
  Filter
} from 'lucide-react';
import patientsData from '../data/patients.json';

// Define color palettes matching the reference design
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  chart: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
};

interface Patient {
  patient_id: string;
  name: string;
  tb_type: string;
  drug_resistance: string;
  treatment_outcome: string;
  diagnosis_date: string;
  age: number;
  gender: string;
  state_of_origin: string;
  district_in_kerala: string;
  [key: string]: any;
}

const Dashboard: React.FC = () => {
  // Process TB Type Distribution
  const getTBTypeData = () => {
    const tbTypes: { [key: string]: number } = {};
    
    patientsData.forEach((patient: Patient) => {
      const type = patient.tb_type.startsWith('Extrapulmonary') ? 'Extrapulmonary' : 'Pulmonary';
      tbTypes[type] = (tbTypes[type] || 0) + 1;
    });
    
    return Object.entries(tbTypes).map(([name, value]) => ({ name, value }));
  };

  // Process Drug Resistance Distribution
  const getDrugResistanceData = () => {
    const drugResistance: { [key: string]: number } = {};
    
    patientsData.forEach((patient: Patient) => {
      drugResistance[patient.drug_resistance] = (drugResistance[patient.drug_resistance] || 0) + 1;
    });
    
    return Object.entries(drugResistance).map(([name, value]) => ({ name, value }));
  };

  // Process Treatment Outcomes
  const getTreatmentOutcomesData = () => {
    const outcomes: { [key: string]: number } = {};
    
    patientsData.forEach((patient: Patient) => {
      outcomes[patient.treatment_outcome] = (outcomes[patient.treatment_outcome] || 0) + 1;
    });
    
    return Object.entries(outcomes).map(([name, value]) => ({ name, value }));
  };

  // Process Cases by Month
  const getCasesByMonthData = () => {
    const monthsData: { [key: string]: number } = {};
    
    patientsData.forEach((patient: Patient) => {
      const date = new Date(patient.diagnosis_date);
      const monthYear = date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      monthsData[monthYear] = (monthsData[monthYear] || 0) + 1;
    });
    
    // Sort by date
    const sortedData = Object.entries(monthsData)
      .map(([month, cases]) => ({ month, cases }))
      .sort((a, b) => new Date(a.month + ' 1').getTime() - new Date(b.month + ' 1').getTime());
    
    return sortedData;
  };

  // Get recent patients for activity table
  const getRecentPatients = () => {
    return patientsData
      .sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime())
      .slice(0, 5);
  };

  const tbTypeData = getTBTypeData();
  const drugResistanceData = getDrugResistanceData();
  const treatmentOutcomesData = getTreatmentOutcomesData();
  const casesByMonthData = getCasesByMonthData();
  const recentPatients = getRecentPatients();

  const totalPatients = patientsData.length;
  const activeCases = patientsData.filter(p => p.treatment_outcome === 'On treatment').length;
  const curedCases = patientsData.filter(p => p.treatment_outcome === 'Cured').length;
  const drugResistantCases = patientsData.filter(p => p.drug_resistance !== 'Drug-sensitive').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MH</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Migrant Worker Health Management
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-8">
                <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-4">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 pb-4">Reports</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 pb-4">Analytics</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 pb-4">Settings</a>
              </nav>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Overview of migrant worker health metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Registered Workers</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalPatients.toLocaleString()}</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Infectious Diseases</h3>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-600">{totalPatients}</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Vaccination Coverage</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-600">85%</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Active Cases</h3>
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{activeCases}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Disease Trends */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Disease Trends</h3>
                <p className="text-sm text-gray-500">Infectious Disease Cases Over Time</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-green-600">+15%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={casesByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, fill: COLORS.primary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Disease Distribution</h3>
                <p className="text-sm text-gray-500">Distribution of Diseases by Type</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-red-600">-5%</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tbTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Drug Resistance */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Drug Resistance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={drugResistanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {drugResistanceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Treatment Outcomes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Treatment Outcomes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treatmentOutcomesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill={COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <tr key={patient.patient_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.patient_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.treatment_outcome === 'Cured' 
                          ? 'bg-green-100 text-green-800'
                          : patient.treatment_outcome === 'On treatment'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {patient.treatment_outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.diagnosis_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.district_in_kerala}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button className="hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;