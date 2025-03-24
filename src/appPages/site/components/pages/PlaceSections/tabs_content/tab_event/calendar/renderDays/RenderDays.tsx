import scss from "./RenderDays.module.scss";
interface RenderDaysProps {
  weekDays: string[];
  getWeekDay: (year: number, month: number, day: number) => number;
  getDaysInMonth: (year: number, month: number) => number;
  date: Date;
  setIsDate: (date: string) => void;
  isDate: string;
}

const RenderDays: React.FC<RenderDaysProps> = ({
  weekDays,
  getWeekDay,
  getDaysInMonth,
  date,
  setIsDate,
  isDate,
}) => {
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
  const days: React.ReactNode[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const weekDay =
      weekDays[getWeekDay(date.getFullYear(), date.getMonth(), i)];
    days.push(
      <div
        onClick={() => {
          setIsDate(formattedDate === isDate ? "" : formattedDate);
        }}
        key={i}
        style={
          formattedDate === isDate
            ? { background: "#004A60", color: "white" }
            : {}
        }
        className={scss.day}
      >
        <div
          style={formattedDate === isDate ? { color: "white" } : {}}
          className={scss.weekday}
        >
          {weekDay}
        </div>
        <div
          style={formattedDate === isDate ? { color: "white" } : {}}
          className={scss.date}
        >
          {i}
        </div>
      </div>
    );
  }

  return <div className={scss.days}>{days}</div>;
};

export default RenderDays;
