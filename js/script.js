const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoText = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = wrapper.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;

const APIKey = "f8fb56c86275090acf437d3ea0529617";

inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value isn't empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser not support geolocation API");
  }
});

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords; // getting { lat and lon } of the user device from { coords } obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
  fetchData();
}

function onError(error) {
  infoText.innerText = error.message;
  infoText.classList.add("error");
}

function fetchData() {
  infoText.innerText = "Getting weather details...";
  infoText.classList.add("pending");

  //   getting api response and returning it with parsing into js obj and in anther
  // then function calling weatherDetails function with passing api result as an argument
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoText.innerText = "Something went wrong";
      (infoText.classList.replace = "pending", "error");
    });
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoText.className.replace("pending", "error");
    infoText.innerText = `( ${inputField.value} ) isn't a valid city name`;
  } else {
    // let's get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // using custom icon according to the id which api return us
    if (id == 800) {
      wIcon.src = "/imgs/icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "/imgs/icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "/imgs/icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "/imgs/icons/haze.svg";
    } else if (id >= 801 && id <= 884) {
      wIcon.src = "/imgs/icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "/imgs/icons/rain.svg";
    }

    // let's pass these values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = feels_like;
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    infoText.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
