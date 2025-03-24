import scss from "./Tab_event.module.scss";
import Calendar from "./calendar/Calendar";
import Event_list from "./event_list/Event_list";
import { useState } from "react";
import Poster from "./poster/Poster";
import { useGetEventListQuery } from "@/redux/api/place";
import { usePathname } from "next/navigation";
const Tab_event = () => {
  const pathName = usePathname();
  const routeName = pathName.split("/")[2];

  const [category, setCategory] = useState("");
  const [search, setIsSearch] = useState("");
  const [ticket, setTicket] = useState("");
  const [date, setIsDate] = useState("");
  const { data: event } = useGetEventListQuery({
    category,
    search,
    date,
    ticket,
  });

  const data = event?.filter(el => el.id === +routeName)
  return (
    <div className={scss.event}>
      <div className={scss.filter}>
        <Poster setIsSearch={setIsSearch} />
        <Calendar setIsDate={setIsDate} isDate={date} />
      </div>
      <Event_list
        data={data || null}
        category={category}
        setCategory={setCategory}
        search={search}
        date={date}
        setTicket={setTicket}
        ticket={ticket}
        setIsDate={setIsDate}
      />
    </div>
  );
};

export default Tab_event;
