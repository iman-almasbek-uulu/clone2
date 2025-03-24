import { useEffect, useState } from "react";
import scss from './NoteFaund.module.scss';

const NoteFaund = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Не рендерить на сервере
  }

  return (
    <section className={scss.NoteFaund}>
      <div className="container">
        <div className={scss.content}>
          <h1>404</h1>
          <h1>NOT FOUND</h1>
        </div>
      </div>
    </section>
  );
};

export default NoteFaund;