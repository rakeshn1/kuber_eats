import React from "react";
import "./App.css";
import { Header } from "./components/Header/Header.jsx";
import { Main } from "./components/Main/Main.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RestaurantPage } from "./components/Restaurant-page/Restaurant-page.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Basket } from "./components/Basket/Basket";
import Login from "./components/LoginPage/login";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basketOrders:
        JSON.parse(window.localStorage.getItem("basketOrders")) || [],
      isBasketOpen: false,
      isLoggedIn : false
    };
  }

  setOpenBasket = () => {
    this.setState({ isBasketOpen: !this.state.isBasketOpen });
  };

  addToBasket = newOrderArray => {
    this.setState({ basketOrders: [...newOrderArray] });
    window.localStorage.setItem(
      "basketOrders",
      JSON.stringify([...newOrderArray])
    );
  };

  setIsLoggedIn = () => {
    this.setState({ isLoggedIn: true });
  };

  removeFromBasket = dish => {
    let newArray = this.state.basketOrders.filter(basketOrder => {
      return basketOrder !== dish;
    });
    this.setState({
      basketOrders: [...newArray]
    });
    window.localStorage.setItem("basketOrders", JSON.stringify([...newArray]));
  };

  renderRestaurantPage = props => {
    return (
      <RestaurantPage
        match={props.match}
        basketOrders={this.state.basketOrders}
        addToBasket={this.addToBasket}
      />
    );
  };

  render() {
    if(!this.state.isLoggedIn){
      return(
          <Login setIsLoggedIn={this.setIsLoggedIn}/>
      )
    }else{
      return (
          <>
            <Router>
              <ScrollToTop>
                {this.state.isBasketOpen && (
                    <Basket
                        basketOrders={this.state.basketOrders}
                        setOpenBasket={this.setOpenBasket}
                        removeFromBasket={this.removeFromBasket}
                        addToBasket={this.addToBasket}
                    />
                )}
                <Header open={this.setOpenBasket} />
                <Route path="/" exact component={Main} />
                <Route
                    path="/restaurant-page/:id"
                    component={this.renderRestaurantPage}
                />
              </ScrollToTop>
            </Router>
            <Footer />
          </>
      );
    }
  }
}

export default App;
