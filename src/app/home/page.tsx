'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import Dashboard from '../dashboard/page';

const Home = () => {
  const router = useRouter();
  return (
    <div className='p-6 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-mono'>CurVert:)</h1>
        <div className='space-x-2'>
          <Button variant='ghost' onClick={() => router.push('/converter')}>
            Convert
          </Button>
          <Button variant='ghost' onClick={() => router.push('/history')}>
            History
          </Button>
        </div>
      </div>

      <div>
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
