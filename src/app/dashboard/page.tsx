'use client';
import CurrencyTrendChart from '@/components/CurrencyTrendChart';
import DatePicker from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchCurrency } from '@/utils/fetchCurrency';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type CurrencyMap = Record<string, string>;

interface DashboardFormValues {
  from: string;
  to: string;
  baseDate: Date;
  targetDate: Date;
}

const Dashboard = () => {
  //* Setting states: done

  const [base, setBase] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currencyCode, setCurrencyCode] = useState<CurrencyMap>({});

  // * currency code fetched and state is set

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await fetchCurrency();
      setCurrencyCode(data);
    };
    fetchCurrencies();
  }, []);

  const { isPending, mutate } = useMutation({
    mutationKey: ['chart-data'],
    mutationFn: async ({
      from,
      to,
      baseDate,
      targetDate,
    }: DashboardFormValues) => {
      const formattedStartDate = baseDate?.toISOString().split('T')[0];
      const formattedEndDate = targetDate?.toISOString().split('T')[0];

      return {
        base: from,
        target: to,
        startingDate: formattedStartDate,
        endingDate: formattedEndDate,
      };
    },

    onSuccess: ({ base, target, startingDate, endingDate }) => {
      setBase(base);
      setTarget(target);
      setStartDate(startingDate);
      setEndDate(endingDate);
    },
  });

  return (
    <div className='flex flex-col mt-8 p-6'>
      {isPending && (
        <div className='h-2 w-full bg-muted animate-pulse rounded' />
      )}

      <Formik<DashboardFormValues>
        initialValues={{
          from: '',
          to: '',
          baseDate: new Date('2022-01-01'),
          targetDate: new Date('2023-01-01'),
        }}
        onSubmit={(values) => mutate(values)}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            <h2 className='text-2xl font-semibold pb-3'>
              Currency Exchange Rate Analysis
            </h2>

            {/* FROM */}
            <div>
              <Label className='pb-4'>From</Label>
              <Select
                onValueChange={(val) => formik.setFieldValue('from', val)}
                value={formik.values.from}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Base Country' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currencyCode).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {code}:{name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TO */}
            <div>
              <Label className='pb-4'>To</Label>
              <Select
                onValueChange={(val) => formik.setFieldValue('to', val)}
                value={formik.values.to}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Base Country' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currencyCode).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {code}:{name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATE PICKER */}

            <div>
              <DatePicker
                label='Start Date'
                value={formik.values.baseDate}
                onChange={(date) => formik.setFieldValue('baseDate', date)}
              />
            </div>
            <div>
              <DatePicker
                label='End Date'
                value={formik.values.targetDate}
                onChange={(date) => formik.setFieldValue('targetDate', date)}
              />
            </div>
            {/* SUBMIT */}
            <div>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Analyzing...' : 'Analyze'}
              </Button>

              {/* CHART */}
              {base && target && startDate && endDate && (
                <CurrencyTrendChart
                  base={base}
                  target={target}
                  startDate={startDate}
                  endDate={endDate}
                />
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Dashboard;
