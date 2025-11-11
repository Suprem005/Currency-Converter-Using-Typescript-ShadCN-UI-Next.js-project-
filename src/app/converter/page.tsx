'use client';

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
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import History from '../history/page';

type CurrencyMap = Record<string, string>;

interface ConversionPayLoad {
  from: string;
  to: string;
  amount: number;
}

const Converter = () => {
  const router = useRouter();

  const [inputAmount, setInputAmount] = useState<number | null>(null);
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('');
  const [convertCurrency, setConvertCurrency] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState<CurrencyMap>({});

  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch('https://api.frankfurter.app/currencies');
      const data = await res.json();
      setCurrencyCode(data);
    };
    fetchCurrencies();
  }, []);

  const { isPending, mutate } = useMutation({
    mutationKey: ['convert-currencies'],
    mutationFn: async ({ from, to, amount }: ConversionPayLoad) => {
      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
        );
        const data = await res.json();
        const rates = data.rates[to];
        const convertedAmount = amount * rates;
        setConvertCurrency(convertedAmount.toFixed(3));
        setBase(from);
        setTarget(to);
        setInputAmount(amount);

        return { from, to, amount, convertedAmount };
      } catch (error) {
        console.log('Failed to fetch rates!', error);
      }
    },
    onSuccess: (conversionData) => {
      const existing = JSON.parse(
        localStorage.getItem('conversionHistory') || '[]'
      );
      const updated = [...existing, conversionData];
      localStorage.setItem('conversionHistory', JSON.stringify(updated));
      <History/>
    },
  });
  return (
    // {isPending && <div className='h-2 bg-muted animate-pulse' />}

    <div className='p-6 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-mono'>CurVert:)</h1>
        <div className='space-x-2'>
          <Button variant='ghost' onClick={() => router.push('/')}>
            Home
          </Button>
          <Button variant='ghost' onClick={() => router.push('/history')}>
            History
          </Button>
        </div>
      </div>
      <Formik
        initialValues={{ amount: 0, from: '', to: ' ' }}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col justify-center items-start gap-5 p-4'>
              <div className='w-[180px]'>
                <Label htmlFor='amount'>Enter amount</Label>
                <Input
                  id='amount'
                  type='number'
                  {...formik.getFieldProps('amount')}
                />
              </div>
              <div>
                <Label>From</Label>
                <Select
                  onValueChange={(val) => formik.setFieldValue('from', val)}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select Base Country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Country</SelectLabel>
                      {Object.entries(currencyCode).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {code}:{name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To</Label>
                <Select
                  onValueChange={(val) => formik.setFieldValue('to', val)}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select Target Country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Country</SelectLabel>
                      {Object.entries(currencyCode).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {code}:{name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className='text-lg'>
                  Converted Amount: {inputAmount ?? '--'} {base ?? '--'}={' '}
                  {convertCurrency ?? '--'} {target}
                </p>
              </div>
              <div>
                <Button type='submit' variant={'default'}>
                  Convert
                </Button>
              </div>

            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Converter;
