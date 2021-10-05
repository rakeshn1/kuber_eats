-- drop database if exists nubereats;
create database nubereats;
use nubereats;

CREATE TABLE users (
  id   integer not null auto_increment,
  name        varchar(255) not null,
  nickname    varchar(50),
  password    varchar(255) not null,
  number      varchar(100) ,
  email 	varchar(25) not null,
  dob 		varchar(20),
  address   varchar(255),
  imageUrl  varchar(255),
  favorites varchar(1000),
  primary key (id)
);

CREATE TABLE restaurants (
  id   integer not null auto_increment,
  title        varchar(50) not null,
  imageUrl    varchar(100),
  largeImageUrl varchar(100),
  location 	varchar(500),
  categories varchar(1000),
  tags varchar(2000),
  etaRange varchar(100),
  rawRatingStats varchar(100),
  publicContact varchar(200),
  priceBucket varchar(10),
  primary key (id)
);

CREATE TABLE Dishes (
  id   integer not null auto_increment,
  title        varchar(50) not null,
  imageUrl    varchar(100),
  ingredients 	varchar(500),
  description varchar(1000),
  price int,
  category varchar(50),
  rules varchar(100),
  customizationIds varchar(100),
  restaurantID int,
  primary key (id),
  foreign key (restaurantID) references restaurants(id)
);

CREATE TABLE orders(
  id   integer not null auto_increment,
  description varchar(1000),
  totalCost int,
  dateTime varchar(50),
  deliveryStatus varchar(50),
  status varchar(50),
  deliveryType varchar(50),
  customerID int,
  restaurantID int,
  primary key (id),
  foreign key (restaurantID) references restaurants(id),
  foreign key (customerID) references users(id)
);

ALTER table users modify number varchar(100);
ALTER table users modify email varchar(100);
ALTER table restaurants modify deliveryType varchar(200);

ALTER table restaurants add email varchar(100);
ALTER table restaurants add Password varchar(100);
ALTER table restaurants add timings varchar(100);
ALTER table restaurants add deliveryType varchar(50);
ALTER table restaurants add dietary varchar(400);

ALTER table orders modify description varchar(10000);
ALTER table orders add address varchar(500)

INSERT users VALUES
(1234,'Kylie','Tooshort',6);

UPDATE restaurants set imageUrl="qwe" where id=2;
UPDATE restaurants set deliveryType='[{ "value": "delivery", "label": "Delivery" }]' where id=2;
UPDATE restaurants set dietary='[{ "value": "vegetarian", "label": "Vegetarian" }]' where id=2;

UPDATE orders set address='{"addressLine":"338 North Market street","city":"San Jose","state":"CA","country":"United States","pinCode":"95110"}'
 where id =6;

UPDATE users set favorites = '[]' where id =1;