import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import scss from './HeaderCalendar.module.scss';

interface HeaderCalendarProps {
    months: string[];
    date: Date;
    handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
}

const HeaderCalendar: React.FC<HeaderCalendarProps> = ({months, date, handleMonthChange, handleYearChange, handlePrevMonth, handleNextMonth}) => {


    return (
        <div className={scss.header}>
        <div className={scss.selected}>
          <select
            value={date.getMonth()}
            onChange={handleMonthChange}
            className={scss.select}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={date.getFullYear()}
            onChange={handleYearChange}
            className={scss.select}
          >
            {Array.from(
              { length: 10 },
              (_, i) => date.getFullYear() - 5 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className={scss.navigation}>
          <button onClick={handlePrevMonth} className={scss.navButton}>
            <ChevronLeft className={scss.icon} />
          </button>
          <button onClick={handleNextMonth} className={scss.navButton}>
            <ChevronRight className={scss.icon} />
          </button>
        </div>
      </div>
    );
};

export default HeaderCalendar;