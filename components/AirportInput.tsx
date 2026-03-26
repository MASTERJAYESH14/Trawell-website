import React, { useState, useEffect, useRef } from 'react';
import { Plane, MapPin } from 'lucide-react';

export interface Airport {
  code: string;
  name: string;
  city_name?: string;
  country_name?: string;
}

interface AirportInputProps {
  value: string;
  onChange: (iata: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const AirportInput: React.FC<AirportInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  icon, 
  label,
  labelClassName = "block text-sm font-medium text-gray-700 mb-2",
  inputClassName = "w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-trawell-orange focus:border-transparent outline-none text-gray-800 font-medium bg-white"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayValue = isOpen ? searchTerm : (searchTerm || value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${searchTerm}&locale=en&types[]=city&types[]=airport`);
        const data = await response.json();
        setResults(data);
        if (document.activeElement === wrapperRef.current?.querySelector('input')) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Autocomplete Error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelect = (airport: Airport) => {
    onChange(airport.code);
    setSearchTerm(airport.city_name || airport.name);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 min-w-[140px] relative" ref={wrapperRef}>
      <label className={labelClassName}>{label}</label>
      <div className="relative">
        {icon || <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />}
        <input 
          type="text" 
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            // Select all text on focus for easy replacement
            setTimeout(() => {
              const input = wrapperRef.current?.querySelector('input');
              if (input) input.select();
            }, 10);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isOpen && results.length > 0) {
              e.preventDefault();
              handleSelect(results[0]);
            }
          }}
          placeholder={placeholder}
          className={inputClassName}
          required
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
          {results.map((airport, index) => (
            <li 
              key={`${airport.code}-${index}`}
              onClick={() => handleSelect(airport)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-800 truncate">{airport.name}</p>
                  {(airport.city_name || airport.country_name) && (
                    <p className="text-xs text-gray-500 truncate">
                      {[airport.city_name, airport.country_name].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600 flex-shrink-0 ml-2">
                {airport.code}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
