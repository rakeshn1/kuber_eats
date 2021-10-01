import React from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import { Main } from "./components/Main/Main.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RestaurantPage } from "./components/Restaurant-page/Restaurant-page.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Basket } from "./components/Basket/Basket";
import Login from "./components/LoginPage/login";

const Dashboard = properties => {
  return (
    <>
      <Router>
        <ScrollToTop>
          {properties.obj.state.isBasketOpen && (
            <Basket
              basketOrders={properties.obj.state.basketOrders}
              setOpenBasket={properties.obj.setOpenBasket}
              removeFromBasket={properties.obj.removeFromBasket}
              addToBasket={properties.obj.addToBasket}
            />
          )}
          <Header open={properties.obj.setOpenBasket} />
          <Route path="/" exact component={Main} />
          <Route
            path="/restaurant-page/:id"
            component={properties.obj.renderRestaurantPage}
          />
        </ScrollToTop>
      </Router>
      <Footer />
    </>
  );
};

export default Dashboard;
