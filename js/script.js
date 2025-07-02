"use strict";

const title = document.getElementsByTagName("h1")[0];
const buttons = document.getElementsByClassName("handler_btn");
const startBtn = buttons[0];
const resetBtn = buttons[1];
const addScreenBtn = document.querySelector(".screen-btn");
const otherItemsPercent = document.querySelectorAll(".other-items.percent");
const otherItemsNumber = document.querySelectorAll(".other-items.number");
const rangeInput = document.querySelector('.rollback input[type="range"]');
const rangeValue = document.querySelector(".rollback .range-value");
const totalInputs = document.getElementsByClassName("total-input");
let screens = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  fullPrice: 0,
  allServicePrices: 0,
  servicePercentPrice: 0,
  services: {},

  start: function () {
    appData.asking();
    appData.addPrices();
    appData.getFullPrice();
    appData.getServicePercentPrice();
    appData.getTitle();

    appData.logger();
  },

  isNumber: function (num) {
    return !isNaN(parseFloat(num) && isFinite(num));
  },

  isText: function (str) {
    return typeof str === "string" && str.trim() !== "" && !/^\d+$/.test(str);
  },

  asking: function () {
    let projectTitle;
    do {
      projectTitle = prompt(
        "Как называется ваш проект?",
        "Калькулятор верстки"
      );
    } while (!appData.isText(projectTitle));
    appData.title = projectTitle;

    for (let i = 0; i < 2; i++) {
      let name, price;

      do {
        name = prompt(
          "Какие типы экранов нужно разработать? (например: Простые, Сложные, Интерактивные)"
        );
      } while (!appData.isText(name));

      do {
        price = prompt("Сколько будет стоить данная работа?");
      } while (!appData.isNumber(price));

      appData.screens.push({ id: i, name: name, price: +price });
    }

    for (let i = 0; i < 2; i++) {
      let name, price;

      do {
        name = prompt("Какой дополнительный тип услуги нужен?");
      } while (!appData.isText(name));

      do {
        price = prompt("Сколько это будет стоить?");
      } while (!appData.isNumber(price));

      appData.services[name] = +price;
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },

  addPrices: function () {
    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
    }
    for (let key in appData.services) {
      appData.allServicePrices += appData.services[key];
    }
  },

  getFullPrice: function () {
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
  },

  getServicePercentPrice: function () {
    appData.servicePercentPrice =
      appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
  },

  getTitle: function () {
    appData.title =
      appData.title.trim()[0].toUpperCase() +
      appData.title.trim().substr(1).toLowerCase();
  },

  getRollbackMessage: function (price) {
    if (price > 30000) {
      return "Даем скидку в 10%";
    } else if (price > 15000 && price <= 30000) {
      return "Даем скидку в 5%";
    } else if (price > 0 && price <= 15000) {
      return "Скидка не предусмотрена";
    } else if (price <= 0) {
      return "Что-то пошло не так";
    }
  },

  logger: function () {
    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
  },
};

appData.start();
