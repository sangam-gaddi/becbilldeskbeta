export interface FeeBreakdown {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export interface FeeType {
  id: string;
  name: string;
  total: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  breakdown: FeeBreakdown[];
  icon: string;
  color: string;
}

export const FEE_STRUCTURE: FeeType[] = [
  {
    id: 'tuition',
    name: 'Tuition Fee',
    total: 75000,
    dueDate: '2025-01-30',
    status: 'pending',
    icon: '📚',
    color: 'from-blue-500 to-indigo-600',
    breakdown: [
      { id: 'tuition-1', category: 'Course Fee', amount: 50000, description: 'Semester course charges' },
      { id: 'tuition-2', category: 'Lab Fee', amount: 15000, description: 'Laboratory equipment & materials' },
      { id: 'tuition-3', category: 'Library Fee', amount: 5000, description: 'Access to digital & physical library' },
      { id: 'tuition-4', category: 'Sports Fee', amount: 5000, description: 'Sports facilities & equipment' },
    ],
  },
  {
    id: 'development',
    name: 'Development Fee',
    total: 15000,
    dueDate: '2025-01-30',
    status: 'pending',
    icon: '',
    color: 'from-purple-500 to-pink-600',
    breakdown: [
      { id: 'dev-1', category: 'Infrastructure', amount: 8000, description: 'Campus development & maintenance' },
      { id: 'dev-2', category: 'Technology Upgrade', amount: 5000, description: 'IT infrastructure & software' },
      { id: 'dev-3', category: 'Green Campus', amount: 2000, description: 'Environmental initiatives' },
    ],
  },
  {
    id: 'hostel',
    name: 'Hostel Fee',
    total: 45000,
    dueDate: '2025-02-15',
    status: 'pending',
    icon: '',
    color: 'from-green-500 to-emerald-600',
    breakdown: [
      { id: 'hostel-1', category: 'Accommodation', amount: 25000, description: 'Room rent for semester' },
      { id: 'hostel-2', category: 'Mess Charges', amount: 15000, description: 'Food & dining services' },
      { id: 'hostel-3', category: 'Maintenance', amount: 3000, description: 'Hostel upkeep & cleaning' },
      { id: 'hostel-4', category: 'Security Deposit', amount: 2000, description: 'Refundable at year end' },
    ],
  },
  {
    id: 'examination',
    name: 'Examination Fee',
    total: 5000,
    dueDate: '2025-02-28',
    status: 'pending',
    icon: '',
    color: 'from-orange-500 to-red-600',
    breakdown: [
      { id: 'exam-1', category: 'Registration', amount: 2000, description: 'Exam registration charges' },
      { id: 'exam-2', category: 'Valuation', amount: 2000, description: 'Answer sheet evaluation' },
      { id: 'exam-3', category: 'Certificate', amount: 1000, description: 'Mark sheets & certificates' },
    ],
  },
];

export function getFeeById(id: string): FeeType | undefined {
  return FEE_STRUCTURE.find(fee => fee.id === id);
}

export function calculateTotal(feeIds: string[]): number {
  return feeIds.reduce((total, id) => {
    const fee = getFeeById(id);
    return total + (fee?.total || 0);
  }, 0);
}