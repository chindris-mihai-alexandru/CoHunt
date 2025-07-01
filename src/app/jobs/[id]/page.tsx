import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';

const prisma = new PrismaClient();

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // Fetch job details from database
  const job = await prisma.job.findUnique({
    where: { id: params.id }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{job.company} • {job.location}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <JobDetailClient job={job} />
        </Suspense>
      </div>
    </div>
  );
}