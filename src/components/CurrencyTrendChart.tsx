import $axios from '@/lib/axios.instance';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// * defining shape of props for chart component
interface CurrencyTrendChartProps {
  base?: string;
  target?: string;
  startDate?: string;
  endDate?: string;
}

// * defining shape for the data in chart

interface TrendData {
  date: string;
  rate: number;
}

const CurrencyTrendChart = ({
  base = 'USD',
  target = 'AUD',
  startDate,
  endDate,
}: CurrencyTrendChartProps) => {
  const [data, setData] = useState<TrendData[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const start = startDate || '2023-01-01';
        const end = endDate || new Date().toISOString().split('T')[0];
        const { data } = await $axios.get(
          `/${start}..${end}?from=${base}&to=${target}`
        );

        // * format API response into chart friendly data

        const formatData: TrendData[] = Object.entries(data.rates).map(
          ([date, rate]) => ({
            date,
            rate: (rate as Record<string, number>)[target],
          })
        );
        setData(formatData);
      } catch (error) {
        console.log('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, [base, target, startDate, endDate]);

  return (
    <div className='m-9'>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={400}>
          <AreaChart
            data={data}
            style={{ maxWidth: '0.9', maxHeight: '70vh', aspectRatio: 1.618 }}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' fontSize={10} />
            <YAxis />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='rate'
              stroke='#8884d8'
              fill='#8884d8'
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for selected range.</p>
      )}
    </div>
  );
};

export default CurrencyTrendChart;
