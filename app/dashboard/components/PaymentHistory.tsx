"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, CheckCircle, ExternalLink } from "lucide-react";

interface Payment {
  _id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionHash?: string;
  createdAt: Date | string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No payments made yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, idx) => (
                <motion.div
                  key={payment._id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{formatCurrency(payment.amount)}</p>
                      <Badge variant="success" className="text-xs">{payment.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(payment.createdAt)} • {payment.paymentMethod}
                    </p>
                  </div>
                  {payment.transactionHash && (
                    <a
                      href={`https://etherscan.io/tx/${payment.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
