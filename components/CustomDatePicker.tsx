import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  className?: string;
  iconClassName?: string;
  required?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  minDate,
  placeholderText,
  className,
  iconClassName,
  required
}) => {
  return (
    <div className="relative w-full">
      <Calendar className={iconClassName || "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10"} />
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        placeholderText={placeholderText}
        dateFormat="dd MMM yyyy"
        required={required}
        className={className || "w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-trawell-orange focus:border-transparent outline-none text-gray-800 font-medium bg-white"}
        calendarClassName="trawell-calendar"
      />
    </div>
  );
};
