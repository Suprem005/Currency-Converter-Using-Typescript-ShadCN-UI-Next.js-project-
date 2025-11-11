/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ConversionData {
  amount: number;
  from: string;
  to: string;
  convertedAmount: number;
}

const History = () => {
  const router = useRouter();

  const [history, setHistory] = useState<ConversionData[]>([]);
  // * Loading history from local storage
  useEffect(() => {
    const savedHistory: ConversionData[] = JSON.parse(
      localStorage.getItem('conversionHistory') || '[]'
    );
    setHistory(savedHistory);
  }, []);

  // * Deleting single conversion

  const handleDelete = (index: number) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
    localStorage.setItem('conversionHistory', JSON.stringify(updated));
  };

  // * clears all history

  const handleClearHistory = () => {
    localStorage.removeItem('conversionHistory');
    setHistory([]);
  };

  return (
    <div className='flex flex-col p-6 gap-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Saved Conversions</h2>
        <div className='space-x-2'>
          <Button variant='ghost' onClick={() => router.push('/')}>
            Home
          </Button>
          <Button variant='destructive' onClick={handleClearHistory}>
            Clear History
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className='text-muted-foreground'>No saved conversions yet</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Conversion History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead className='text-right'>From</TableHead>
                  <TableHead className='text-right'>To</TableHead>
                  <TableHead className='text-right'>Converted</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) =>
                  !item || item.amount == null ? null : (
                    <TableRow key={index}>
                      <TableCell className='text-right'>
                        {item.amount}
                      </TableCell>
                      <TableCell className='text-right'>{item.from}</TableCell>
                      <TableCell className='text-right'>{item.to}</TableCell>
                      <TableCell className='text-right'>
                        {item.convertedAmount}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default History;
