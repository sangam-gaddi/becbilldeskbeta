export interface SelectedFees {
  collegeFees: boolean;
  developmentFees: boolean;
  examinationFees: boolean;
  hostelFees: {
    selected: boolean;
    blockType?: 'N-Block' | 'V-Block' | 'PG';
  };
}

export interface PaymentData {
  studentId: string;
  usn: string;
  feeCategories: SelectedFees;
  totalAmount: number;
  paymentMethod: string;
}

export interface StudentData {
  usn: string;
  studentName: string;
  department: string;
  paymentCategory: 'KCET' | 'COMEDK' | 'Management';
  semester: number;
  email?: string;
}
