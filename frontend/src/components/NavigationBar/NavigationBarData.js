import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";
import * as BiIcons from "react-icons/bi";

export const NavigationBarData = [
  {
    title: "Home",
    path: "/dashBoard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text"
  },
  {
    title: "Profile",
    path: "/userProfile",
    icon: <CgIcons.CgProfile />,
    cName: "nav-text"
  },
  {
    title: "Orders",
    path: "/userOrders",
    icon: <BiIcons.BiReceipt />,
    cName: "nav-text"
  },
  {
    title: "Favorites",
    path: "/userFavorites",
    icon: <IoIcons.IoMdHeart />,
    cName: "nav-text"
  }
];

export const RestaurantNavigationBarData = [
  {
    title: "Home",
    path: "/restaurantDashBoard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text"
  },
  {
    title: "Dishes",
    path: "/dishes",
    icon: <CgIcons.CgProfile />,
    cName: "nav-text"
  },
  {
    title: "Orders",
    path: "/restaurantOrders",
    icon: <BiIcons.BiReceipt />,
    cName: "nav-text"
  },
  {
    title: "Add Dish",
    path: "/addDish",
    icon: <AiIcons.AiOutlinePlusSquare />,
    cName: "nav-text"
  }
];
