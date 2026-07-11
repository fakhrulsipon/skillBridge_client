"use client"
import React from 'react'
import { motion } from 'framer-motion'

import TutorSidebar from '@/components/shared/TutorSidebar'
import StudentSidebar from '@/components/shared/StudentSidebar'
import AdminSidebar from '@/components/shared/AdminSidebar'
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout = ({
  tutor,
  student,
  admin,
}: {
  tutor: React.ReactNode;
  student: React.ReactNode;
  admin: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas">
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row">
        {user?.role === 'TUTOR' && <TutorSidebar />}
        {user?.role === 'STUDENT' && <StudentSidebar />}
        {user?.role === 'ADMIN' && <AdminSidebar />}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div className="min-h-[calc(100vh-4rem)]">
            {user?.role === 'TUTOR' && tutor}
            {user?.role === 'STUDENT' && student}
            {user?.role === 'ADMIN' && admin}
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default DashboardLayout
