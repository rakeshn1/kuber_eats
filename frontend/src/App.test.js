import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import store from "./redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import UserOrders from "./components/Orders/UserOrders";
import Main from "./components/Main/Main";
import UserProfile from "./components/Profile/UserProfile";

describe("Ui pages testing", () => {
  test("Job seeker landing page", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Restaurants")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for restaurant or cuisine")
    ).toBeInTheDocument();
    // expect(await screen.findByText('Taco')).toBeInTheDocument()
    // screen.debug();
  });
  test("Company review page", () => {
    render(
      <Provider store={store}>
        {/*<BrowserRouter>*/}
        <UserOrders />
        {/*</BrowserRouter>*/}
      </Provider>
    );
    expect(
      screen.getByText("Filter orders based on order status:")
    ).toBeInTheDocument();
    expect(screen.getByText("Select...")).toBeInTheDocument();
    //screen.debug();
  });
  test("Company salaries page", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProfile />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Nick name")).toBeInTheDocument();
    //screen.debug();
  });

  test("Sign up page", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProfile />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Nick name")).toBeInTheDocument();
    //screen.debug();
  });

  test("Company salaries page", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProfile />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Nick name")).toBeInTheDocument();
    //screen.debug();
  });
});
