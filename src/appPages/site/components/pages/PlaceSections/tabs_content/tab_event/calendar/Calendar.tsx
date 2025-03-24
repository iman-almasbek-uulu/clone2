import React, { useState } from "react";
import scss from "./Calendar.module.scss";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import RenderDays from "./renderDays/RenderDays";
import HeaderCalendar from "./headerCalendar/HeaderCalendar";

interface DatePickerProps {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  setIsDate: (date: string) => void;
  isDate: string
}

type TranslatedText = string;

const DatePicker: React.FC<DatePickerProps> = ({
  initialDate = new Date(),
  onDateChange,
  setIsDate,
  isDate
}) => {
  const [date, setDate] = useState<Date>(initialDate);

  const { t } = useTranslate();

  const months: TranslatedText[] = [
    t("Январь", "يناير", "January"),
    t("Февраль", "فبراير", "February"),
    t("Март", "مارس", "March"),
    t("Апрель", "أبريل", "April"),
    t("Май", "مايو", "May"),
    t("Июнь", "يونيو", "June"),
    t("Июль", "يوليو", "July"),
    t("Август", "أغسطس", "August"),
    t("Сентябрь", "سبتمبر", "September"),
    t("Октябрь", "أكتوبر", "October"),
    t("Ноябрь", "نوفمبر", "November"),
    t("Декабрь", "ديسمبر", "December"),
  ];

  const weekDays: TranslatedText[] = [
    t("Пн", "الاثنين", "Mon"),
    t("Вт", "الثلاثاء", "Tue"),
    t("Ср", "الأربعاء", "Wed"),
    t("Чт", "الخميس", "Thu"),
    t("Пт", "الجمعة", "Fri"),
    t("Сб", "السبت", "Sat"),
    t("Вс", "الأحد", "Sun"),
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekDay = (year: number, month: number, day: number): number => {
    const currentDate = new Date(year, month, day);
    const weekDay = currentDate.getDay();
    return weekDay === 0 ? 6 : weekDay - 1;
  };

  const handlePrevMonth = (): void => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNextMonth = (): void => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(newDate);
    onDateChange?.(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newDate = new Date(date.getFullYear(), parseInt(e.target.value));
    setDate(newDate);
    onDateChange?.(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newDate = new Date(parseInt(e.target.value), date.getMonth());
    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <div className={scss.calendar}>
      <HeaderCalendar
        months={months}
        date={date}
        handleMonthChange={handleMonthChange}
        handleYearChange={handleYearChange}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />
      <RenderDays
        weekDays={weekDays}
        getWeekDay={getWeekDay}
        getDaysInMonth={getDaysInMonth}
        date={date}
        isDate={isDate}
        setIsDate={setIsDate}
      />
    </div>
  );
};

export default DatePicker;
