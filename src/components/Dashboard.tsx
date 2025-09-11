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
import patientsData from '../data/patients.json';

// Define color palettes
const COLORS = {
  primary: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  secondary: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  accent: ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA']
};

interface Patient {
  patient_id: string;
  tb_type: string;
  drug_resistance: string;
  treatment_outcome: string;
  diagnosis_date: string;
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

  const tbTypeData = getTBTypeData();
  const drugResistanceData = getDrugResistanceData();
  const treatmentOutcomesData = getTreatmentOutcomesData();
  const casesByMonthData = getCasesByMonthData();

  const renderCustomTooltip = (active: any, payload: any, label: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MH</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Migrant Health Dashboard – Kerala
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Digital Health Record Management System for Migrant Workers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">TB</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patientsData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Cured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsData.filter(p => p.treatment_outcome === 'Cured').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">◐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">On Treatment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsData.filter(p => p.treatment_outcome === 'On treatment').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">!</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Drug Resistant</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsData.filter(p => p.drug_resistance !== 'Drug-sensitive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TB Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">TB Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tbTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={({ active, payload, label }) => 
                  renderCustomTooltip(active, payload, label)
                } />
                <Bar dataKey="value" fill={COLORS.primary[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Drug Resistance Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
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
                    <Cell key={`cell-${index}`} fill={COLORS.secondary[index % COLORS.secondary.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Treatment Outcomes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Treatment Outcomes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treatmentOutcomesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={({ active, payload, label }) => 
                  renderCustomTooltip(active, payload, label)
                } />
                <Bar dataKey="value" fill={COLORS.accent[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cases by Month */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cases by Diagnosis Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={casesByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={({ active, payload, label }) => 
                  renderCustomTooltip(active, payload, label)
                } />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke={COLORS.primary[0]}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary[0], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: COLORS.primary[1] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;