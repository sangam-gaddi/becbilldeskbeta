"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, calculatePercentage } from "@/lib/utils";
import { CreditCard, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSummaryProps {
  totalAmount: number;
  paidAmount: number;
  selectedAmount: number;
  onPayClick: () => void;
}

export function PaymentSummary({ totalAmount, paidAmount, selectedAmount, onPayClick }: PaymentSummaryProps) {
  const router = useRouter();
  const remainingAmount = totalAmount - paidAmount;
  const percentagePaid = calculatePercentage(paidAmount, totalAmount);
  const newRemaining = remainingAmount - selectedAmount;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            <Badge variant="success" className="mt-2">{percentagePaid}% Complete</Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-600" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(remainingAmount)}</p>
            <Badge variant="warning" className="mt-2">{100 - percentagePaid}% Pending</Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
            <Badge variant="secondary" className="mt-2">Full Fee</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Selected Payment Summary */}
      {selectedAmount > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Remaining</span>
                  <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selected Amount</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">- {formatCurrency(selectedAmount)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">New Remaining</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(newRemaining)}</span>
                </div>
              </div>

              <Button 
                onClick={onPayClick} 
                className="w-full"
                size="lg"
              >
                Proceed to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
