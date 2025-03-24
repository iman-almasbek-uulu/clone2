namespace AIRLINE {
  export type Tickets = {
    id: number;
    ticket: number;
    directions: string;
  }[];

  export type AirResponse = {
    id: string;
    name: string;
    description: string;
    website: string;
    airline_tickets: Tickets;
  };
}

// Экспортируем пространство имен для использования в других файлах
export { AIRLINE };