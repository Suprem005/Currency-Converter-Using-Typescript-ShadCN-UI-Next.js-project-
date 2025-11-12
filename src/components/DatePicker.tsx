import { formatDate } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {label && <span className='text-sm font-medium'>{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            data-empty={!value}
            className='data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {value ? formatDate(value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar mode='single' selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
