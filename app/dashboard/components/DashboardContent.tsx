"use client";

import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { EnhancedChat } from "./EnhancedChat";
import { StudentDetailsCard } from "./StudentDetailsCard";
import { FeeSelection } from "./FeeSelection";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentHistory } from "./PaymentHistory";
import { PaymentChart } from "./PaymentChart";
import { FloatingClock } from "@/components/FloatingClock";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface DashboardContentProps {
  student: any;
  payments: any[];
  totalPaid: number;
  totalFeeAmount: number;
}

export function DashboardContent({ student, payments, totalPaid, totalFeeAmount }: DashboardContentProps) {
  const router = useRouter();
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handleFeeSelectionChange = (fees: string[], amount: number) => {
    setSelectedFees(fees);
    setSelectedAmount(amount);
  };

  const handlePayClick = () => {
    if (selectedAmount > 0) {
      router.push(`/payment?amount=${selectedAmount}&fees=${selectedFees.join(",")}`);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Header - Fixed at top */}
        <DashboardHeader studentName={student.studentName} usn={student.usn} />

        {/* Main Content - Fullscreen, No Margins */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE - CHAT (1/3) - Fixed, Scrollable */}
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-1/3 border-r flex flex-col overflow-hidden"
          >
            <EnhancedChat currentUsn={student.usn} currentName={student.studentName} />
          </motion.aside>

          {/* RIGHT SIDE - MAIN CONTENT (2/3) - Scrollable */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
              {/* Student Details */}
              <StudentDetailsCard student={student} />

              {/* Fee Selection */}
              <FeeSelection onSelectionChange={handleFeeSelectionChange} />

              {/* Payment Summary & Stats */}
              <PaymentSummary
                totalAmount={totalFeeAmount}
                paidAmount={totalPaid}
                selectedAmount={selectedAmount}
                onPayClick={handlePayClick}
              />

              {/* Payment Chart */}
              <PaymentChart
                totalAmount={totalFeeAmount}
                paidAmount={totalPaid}
                selectedAmount={selectedAmount}
              />

              {/* Payment History */}
              <PaymentHistory payments={payments} />

              {/* Extra padding at bottom for floating clock */}
              <div className="h-20"></div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Clock - Fixed Position, Always Visible */}
      <FloatingClock />
    </>
  );
}
