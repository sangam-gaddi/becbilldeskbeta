"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { getInitials } from "@/lib/utils";

interface StudentDetailsProps {
  student: {
    usn: string;
    studentName: string;
    email: string;
    phone?: string;
    department: string;
    semester: number;
    section?: string;
    dateOfBirth?: Date | string;
    address?: string;
    admissionYear?: number;
    currentYear?: number;
  };
}

export function StudentDetailsCard({ student }: StudentDetailsProps) {
  const detailItems = [
    { icon: Hash, label: "USN", value: student.usn },
    { icon: User, label: "Name", value: student.studentName },
    { icon: Mail, label: "Email", value: student.email },
    { icon: Phone, label: "Phone", value: student.phone || "Not provided" },
    { icon: GraduationCap, label: "Department", value: student.department },
    { icon: BookOpen, label: "Semester", value: `Semester ${student.semester}` },
    { icon: Calendar, label: "Section", value: student.section || "Not assigned" },
    { icon: Calendar, label: "Admission Year", value: student.admissionYear || "N/A" },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {getInitials(student.studentName)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{student.studentName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{student.usn}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{student.department}</Badge>
                <Badge variant="outline">Sem {student.semester}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium mt-0.5 truncate">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
