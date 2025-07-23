"use strict";

const title = document.getElementsByTagName("h1")[0];
const buttonPlus = document.querySelector(".screen-btn");

const otherItemsPercent = document.querySelectorAll(".other-items.percent");
const otherItemsNumber = document.querySelectorAll(".other-items.number");

const inputRange = document.querySelector(".rollback input");
const inputRangeValue = document.querySelector(".rollback .range-value");

const startBtn = document.getElementsByClassName("handler_btn")[0];
const resetBtn = document.getElementsByClassName("handler_btn")[1];

const total = document.getElementsByClassName("total-input")[0];
const totalCount = document.getElementsByClassName("total-input")[1];
const totalCountOther = document.getElementsByClassName("total-input")[2];
const fullTotalCount = document.getElementsByClassName("total-input")[3];
const totalCountRollback = document.getElementsByClassName("total-input")[4];

let screens = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  fullPrice: 0,
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  servicePercentPrice: 0,
  servicesPercent: {},
  servicesNumber: {},

  init() {
    this.addTitle();
    this.toggleStartButton();
    startBtn.addEventListener("click", this.start.bind(this));
    resetBtn.addEventListener("click", this.reset.bind(this));
    buttonPlus.addEventListener("click", this.addScreenBlock.bind(this));

    inputRange.addEventListener("input", () => {
      inputRangeValue.textContent = inputRange.value + "%";
      this.rollback = parseInt(inputRange.value);
    });

    screens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      select.addEventListener("change", this.toggleStartButton.bind(this));
      input.addEventListener("input", this.toggleStartButton.bind(this));
    });
  },

  toggleStartButton() {
    const screensValid = [...document.querySelectorAll(".screen")].every(
      (screen) => {
        const select = screen.querySelector("select");
        const input = screen.querySelector("input");
        return (
          select.value !== "" &&
          input.value.trim() !== "" &&
          !isNaN(input.value)
        );
      }
    );
    startBtn.disabled = !screensValid;
  },

  addTitle() {
    document.title = title.textContent;
  },

  start() {
    this.screens = [];
    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;

    this.addScreens();
    this.addServices();
    this.addPrices();
    this.showResult();

    this.lockInputs();
    startBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
  },

  showResult() {
    total.value = this.screenPrice;
    totalCountOther.value =
      this.servicePricesPercent + this.servicePricesNumber;
    fullTotalCount.value = this.fullPrice;
    totalCountRollback.value = this.servicePercentPrice;
  },

  isText(str) {
    return typeof str === "string" && str.trim() !== "" && !/^\d+$/.test(str);
  },

  addScreens() {
    screens = document.querySelectorAll(".screen");

    screens.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;

      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      });
    });
  },

  addScreenBlock() {
    const cloneScreen = screens[0].cloneNode(true);
    screens[screens.length - 1].after(cloneScreen);

    screens = document.querySelectorAll(".screen");

    const select = cloneScreen.querySelector("select");
    const input = cloneScreen.querySelector("input");

    select.addEventListener("change", this.toggleStartButton.bind(this));
    input.addEventListener("input", this.toggleStartButton.bind(this));

    this.toggleStartButton();
  },

  addServices() {
    otherItemsPercent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  addPrices() {
    this.screens.forEach((screen) => {
      this.screenPrice += +screen.price;
    });
    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }
    for (let key in this.servicesPercent) {
      this.servicePricesPercent +=
        this.screenPrice * (this.servicesPercent[key] / 100);
    }
    this.fullPrice =
      this.servicePricesNumber + this.servicePricesPercent + this.screenPrice;

    this.servicePercentPrice =
      this.fullPrice - (this.fullPrice * this.rollback) / 100;

    const totalCountScreens = this.screens.reduce(
      (sum, screen) => sum + screen.count,
      0
    );
    totalCount.value = totalCountScreens;
  },

  reset() {
    this.title = "";
    this.screens = [];
    this.screenPrice = 0;
    this.rollback = 10;
    this.fullPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.servicePercentPrice = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};

    screens = document.querySelectorAll(".screen");
    screens.forEach((screen, index) => {
      if (index > 0) screen.remove();
    });

    screens = document.querySelectorAll(".screen");

    screens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      select.value = "";
      input.value = "";
      select.disabled = false;
      input.disabled = false;
    });

    [...otherItemsPercent, ...otherItemsNumber].forEach((item) => {
      const checkbox = item.querySelector("input[type=checkbox]");
      const input = item.querySelector("input[type=text]");
      checkbox.checked = false;
      input.value = "";
      input.disabled = false;
    });

    total.value = "";
    totalCount.value = "";
    totalCountOther.value = "";
    fullTotalCount.value = "";
    totalCountRollback.value = "";

    inputRange.value = 10;
    inputRangeValue.textContent = "10%";

    startBtn.style.display = "inline-block";
    resetBtn.style.display = "none";

    this.toggleStartButton();
  },

  lockInputs() {
    screens.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      select.disabled = true;
      input.disabled = true;
    });

    [...otherItemsPercent, ...otherItemsNumber].forEach((item) => {
      const input = item.querySelector("input[type=text]");
      input.disabled = true;
    });
  },
};

appData.init();
