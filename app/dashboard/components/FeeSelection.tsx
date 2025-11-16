"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { BookOpen, Bus, Home, GraduationCap, Activity, FileText } from "lucide-react";

interface FeeType {
  id: string;
  name: string;
  amount: number;
  description: string;
  icon: any;
  category: "academic" | "transport" | "hostel" | "other";
}

const feeTypes: FeeType[] = [
  { id: "tuition", name: "Tuition Fee", amount: 85000, description: "Semester tuition fees", icon: GraduationCap, category: "academic" },
  { id: "exam", name: "Examination Fee", amount: 2500, description: "Semester exam fees", icon: FileText, category: "academic" },
  { id: "library", name: "Library Fee", amount: 1000, description: "Library access & resources", icon: BookOpen, category: "academic" },
  { id: "lab", name: "Laboratory Fee", amount: 5000, description: "Lab equipment & materials", icon: Activity, category: "academic" },
  { id: "transport", name: "Transport Fee", amount: 12000, description: "College bus service", icon: Bus, category: "transport" },
  { id: "hostel", name: "Hostel Fee", amount: 45000, description: "Accommodation & meals", icon: Home, category: "hostel" },
];

interface FeeSelectionProps {
  onSelectionChange: (selected: string[], total: number) => void;
}

export function FeeSelection({ onSelectionChange }: FeeSelectionProps) {
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  const handleToggle = (feeId: string) => {
    const newSelected = selectedFees.includes(feeId)
      ? selectedFees.filter(id => id !== feeId)
      : [...selectedFees, feeId];
    
    setSelectedFees(newSelected);
    
    const total = feeTypes
      .filter(fee => newSelected.includes(fee.id))
      .reduce((sum, fee) => sum + fee.amount, 0);
    
    onSelectionChange(newSelected, total);
  };

  const calculateTotal = () => {
    return feeTypes
      .filter(fee => selectedFees.includes(fee.id))
      .reduce((sum, fee) => sum + fee.amount, 0);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Select Fee Types</CardTitle>
          <CardDescription>Choose the fees you want to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feeTypes.map((fee, idx) => (
              <motion.div
                key={fee.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-all cursor-pointer"
                onClick={() => handleToggle(fee.id)}
              >
                <Checkbox
                  checked={selectedFees.includes(fee.id)}
                  onCheckedChange={() => handleToggle(fee.id)}
                />
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                    <fee.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{fee.name}</p>
                      <Badge variant="secondary" className="text-xs">{fee.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{fee.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(fee.amount)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedFees.length > 0 && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Selected Amount</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedFees.length} fee(s) selected</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
