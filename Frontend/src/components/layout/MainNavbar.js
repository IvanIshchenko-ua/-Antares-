import React from "react";
import { Link } from "react-router-dom";
import "../site/SitePage.css";

const MainNavbar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-left">
        <div className="dropdown">
          <a href="#">Відділи</a>
          <div className="dropdown-content">
            <Link to="/site/departments">Музичні</Link>
            <Link to="/site/departments">Художні</Link>
          </div>
        </div>
        <Link to="/site/about">Про нас</Link>
        <Link to="/site/gallery">Фото/Відео</Link>
        <Link to="/site/news">Новини</Link>
      </div>

      <div className="nav-center">
        <Link to="/site/home">
          <img src="/img/logo_nav.png" alt="Антарес" className="logo" />
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/site/transparency">Прозорість</Link>
        <Link to="/site/events">Події</Link>
        <Link to="/site/contacts">Контакти</Link>
      </div>
    </nav>
  );
};

export default MainNavbar;
