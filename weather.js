var searchBtn = $('.btn');
var weatherEl = $('.weather-info');
var sidebarEl = $('.search-history');


searchBtn.on("click", function () {
    weatherEl.empty();
    var searchInput = $('#weather-search').val();
    var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + ",us&units=imperial&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + ",US&units=imperial&appid=" + APIKey;
    console.log(searchInput);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        currentConditions(response);
        uvIndex(response);
        addHistory(response)
    });
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecast) {
        console.log(forecast);
        weeklyForecast(forecast);
    });
});

$('div').on("click", ".card", function (event) {
    event.stopPropagation();
    weatherEl.empty();
    var historyInput = $(this)[0].innerHTML;
    console.log(historyInput)
    var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + historyInput + ",us&units=imperial" + "&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + historyInput + ",US&units=imperial&timezone=utc-9&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (historyResponse) {
        console.log(historyResponse);
        currentConditions(historyResponse);
        uvIndex(historyResponse);
    });
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecast) {
        console.log(forecast);
        weeklyForecast(forecast);
    });
})

function currentConditions(response) {
    var value = response.dt;
    var currentDay = moment.unix(value).format("MM/DD/YYYY");
    var titleEl = $('<div>').attr("class", "title");
    var weatherIcon = response.weather[0].icon;
    var cityName = $("<h3>" + response.name + " " + currentDay + "</h3>")
    var weatherImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png").attr("class", "weatherIcon")
    var temperatureEl = $('<div>').attr("class", "temperature").append($("<p> Temperature: " + response.main.temp + "&#8457</p>"))
    var humidityEl = $('<div>').attr("class", "humidity").append($("<p> Humidity: " + response.main.humidity + "%</p>"))
    var windEl = $("<div>").attr("class", "wind").append($("<p> Wind Speed: " + response.wind.speed + " MPH</p>"));
    cityName.append(weatherImg)
    titleEl.append(cityName)
    weatherEl.append(titleEl);
    weatherEl.append(temperatureEl);
    weatherEl.append(humidityEl);
    weatherEl.append(windEl);
}

function uvIndex(cityCoords) {
    var latValue = cityCoords.coord.lat;
    var lonValue = cityCoords.coord.lon;
    var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + lonValue;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (getUV) {
        var uvValue = parseFloat(getUV.value);
        var uvDiv = $('<div>').attr("class", "uv");
        var uvP1 = $('<p>UV Index: </p>').css("display", "inline");
        var uvP2 = $('<p>' + uvValue + '</p>').css("display", "inline");
        uvDiv.append(uvP1).append(uvP2);
        weatherEl.append(uvDiv);
        if (uvValue >= 0 && uvValue <= 2.9) {
            uvP2.attr("class", "low");
        }
        else if (uvValue >= 3.0 && uvValue <= 5.9) {
            uvP2.attr("class", "moderate");
        }
        else if (uvValue >= 6.0 && uvValue <= 7.9) {
            uvP2.attr("class", "high");
        }
        else if (uvValue >= 8.0 && uvValue <= 10.9) {
            uvP2.attr("class", "very-high");
        }
        else if (uvValue >= 11.0) {
            uvP2.attr("class", "extreme");
        }

    })
}
function addHistory(response) {
    var cityStorage = localStorage.getItem("city");
    var citySearched = response.name;
    console.log(citySearched);
    console.log(cityStorage);
    if (typeof (cityStorage) === null) {
        cityStorage = [];
        cityStorage.push(citySearched);
        localStorage.setItem("city", JSON.stringify(cityStorage))
        searchHistory()
    }
    else if (typeof (cityStorage) === "undefined") {
        cityStorage = [];
        cityStorage.push(citySearched);
        localStorage.setItem("city", JSON.stringify(cityStorage))
        searchHistory()
    }
    else if (typeof (cityStorage) === 'string') {
        cityStorage = JSON.parse(localStorage.getItem("city"));
        if (cityStorage.includes(citySearched)) {
            searchHistory()
        }
        else {
            cityStorage.push(citySearched);
            localStorage.setItem("city", JSON.stringify(cityStorage));
            searchHistory()
        }
    }
    else {
        cityStorage = JSON.parse(localStorage.getItem("city"));
        if (cityStorage.includes(citySearched)) {
            searchHistory()
        }
        else {
            cityStorage.push(response.name);
            localStorage.setItem("city", JSON.stringify(cityStorage));
            searchHistory()
        }
    }
}

function searchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));
    console.log(searchHistory);
    console.log(typeof searchHistory);
    if (typeof searchHistory === null) {
        alert("No cities saved in history");
    }
    else if (typeof searchHistory === "undefined") {
        alert("No cities saved in history");
    }
    else if (typeof searchHistory === 'string') {
        searchHistory = JSON.parse(searchHistory);
        renderCity(searchHistory);
    }
    else {
        renderCity(searchHistory);
    }
};

function renderCity(searchHistory) {
    console.log(searchHistory)
    sidebarEl.empty()
    $.each(searchHistory, function (i) {
        var cityName = searchHistory[i];
        var cityCard = $('<div>' + cityName + "</div>").attr('class', 'card text-center align-middle').attr("id", "cityName");
        sidebarEl.prepend(cityCard);
    })
};

function weeklyForecast(forecast) {
    var forecastCol1 = $('#forecast-day1')
    forecastCol1.empty();
    var forecastCol2 = $('#forecast-day2');
    forecastCol2.empty();
    var forecastCol3 = $('#forecast-day3');
    forecastCol3.empty();
    var forecastCol4 = $('#forecast-day4');
    forecastCol4.empty();
    var forecastCol5 = $('#forecast-day5');
    forecastCol5.empty();
    var weatherList = forecast.list;
    var today = moment().utc().startOf('day')
    var dayOneUTC = moment(today).utc().add(1, "day").startOf('day');
    var dayOne = moment(today).startOf('day').add(1, "day").format('MM/DD/YYYY');
    console.log(dayOne);
    var dayOneStart = moment(dayOneUTC).unix();
    var dayOneEnd = moment(dayOneUTC).endOf('day').unix();
    var dayTwoUTC = moment(today).add(2, "day").startOf('day');
    var dayTwo = moment(today).startOf('day').add(2, "day").format('MM/DD/YYYY');
    console.log(dayTwo);
    var dayTwoStart = moment(dayTwoUTC).unix();
    var dayTwoEnd = moment(dayTwoUTC).endOf('day').unix();
    var dayThreeUTC = moment(today).utc().add(3, "day").startOf('day');
    var dayThree = moment(today).startOf('day').add(3, "day").format('MM/DD/YYYY');
    console.log(dayThree);
    var dayThreeStart = moment(dayThreeUTC).unix();
    var dayThreeEnd = moment(dayThreeUTC).endOf('day').unix();
    var dayFourUTC = moment(today).utc().add(4, "day").startOf('day');
    var dayFour = moment(today).startOf('day').add(4, "day").format('MM/DD/YYYY');
    console.log(dayFour);
    var dayFourStart = moment(dayFourUTC).unix();
    var dayFourEnd = moment(dayFourUTC).endOf('day').unix();
    var dayFiveUTC = moment(today).utc().add(5, "day").startOf('day');
    var dayFive = moment(today).startOf('day').add(5, "day").format('MM/DD/YYYY');
    console.log(dayFive);
    var dayFiveStart = moment(dayFiveUTC).unix();
    var dayFiveEnd = moment(dayFiveUTC).endOf('day').unix();
    var forecastDay1 = $("<h5>").text(dayOne);
    var forecastDay2 = $("<h5>").text(dayTwo);
    var forecastDay3 = $("<h5>").text(dayThree);
    var forecastDay4 = $("<h5>").text(dayFour);
    var forecastDay5 = $("<h5>").text(dayFive);
    var hour;
    forecastCol1.append(forecastDay1);
    forecastCol2.append(forecastDay2);
    forecastCol3.append(forecastDay3);
    forecastCol4.append(forecastDay4);
    forecastCol5.append(forecastDay5);
    console.log(dayOne)
    console.log(dayOneEnd);
    console.log(weatherList);
    for (i = 0; i < weatherList.length; i++) {
        var value = weatherList[i].dt
        var forecastDate;
        var forecastIcon;
        var forecastImg;
        var forecastTemp;
        var forecastHumidity;
        if (weatherList[i].dt >= dayOneStart && weatherList[i].dt <= dayOneEnd) {
            console.log("Day 1" + weatherList[i].dt);
            console.log(dayOneStart);
            hour = moment(value, "X").format();
            hourTZ = moment(hour).format('hh:mm A');
            forecastDate = $("<p>").text(hourTZ).css("border-top", "1px white solid");
            forecastCol1.append(forecastDate);
            forecastIcon = weatherList[i].weather[0].icon;
            forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png").attr("class", "forecastIcon");
            forecastCol1.append(forecastImg);
            forecastTemp = $('<p>' + weatherList[i].main.temp + '&#8457</p>');
            forecastCol1.append(forecastTemp);
            forecastHumidity = $('<p>Humidity: ' + weatherList[i].main.humidity + "%</p>")
            forecastCol1.append(forecastHumidity);
        }
        else if (weatherList[i].dt >= dayTwoStart && weatherList[i].dt <= dayTwoEnd) {
            console.log("Day 2" + weatherList[i].dt);
            console.log(dayTwoStart);
            hour = moment(value, "X").format();
            hourTZ = moment(hour).format('hh:mm A');
            forecastDate = $("<p>").text(hourTZ).css("border-top", "1px white solid");;
            forecastCol2.append(forecastDate);
            forecastIcon = weatherList[i].weather[0].icon;
            forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png").attr("class", "forecastIcon");
            forecastCol2.append(forecastImg);
            forecastTemp = $('<p>' + weatherList[i].main.temp + '&#8457</p>');
            forecastCol2.append(forecastTemp);
            forecastHumidity = $('<p>Humidity: ' + weatherList[i].main.humidity + "%</p>")
            forecastCol2.append(forecastHumidity);
        }
        else if (weatherList[i].dt >= dayThreeStart && weatherList[i].dt <= dayThreeEnd) {
            console.log("Day 2" + weatherList[i].dt);
            console.log(dayThreeStart);
            hour = moment(value, "X").format();
            hourTZ = moment(hour).format('hh:mm A');
            forecastDate = $("<p>").text(hourTZ).css("border-top", "1px white solid");;
            forecastCol3.append(forecastDate);
            forecastIcon = weatherList[i].weather[0].icon;
            forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png").attr("class", "forecastIcon");
            forecastCol3.append(forecastImg);
            forecastTemp = $('<p>' + weatherList[i].main.temp + '&#8457</p>');
            forecastCol3.append(forecastTemp);
            forecastHumidity = $('<p>Humidity: ' + weatherList[i].main.humidity + "%</p>")
            forecastCol3.append(forecastHumidity);
        }
        else if (weatherList[i].dt >= dayFourStart && weatherList[i].dt <= dayFourEnd) {
            console.log("Day 4" + weatherList[i].dt);
            console.log(dayFourStart);
            hour = moment(value, "X").format();
            hourTZ = moment(hour).format('hh:mm A');
            forecastDate = $("<p>").text(hourTZ).css("border-top", "1px white solid");;
            forecastCol4.append(forecastDate);
            forecastIcon = weatherList[i].weather[0].icon;
            forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png").attr("class", "forecastIcon");
            forecastCol4.append(forecastImg);
            forecastTemp = $('<p>' + weatherList[i].main.temp + '&#8457</p>');
            forecastCol4.append(forecastTemp);
            forecastHumidity = $('<p>Humidity: ' + weatherList[i].main.humidity + "%</p>")
            forecastCol4.append(forecastHumidity);
        }
        else if (weatherList[i].dt >= dayFiveStart && weatherList[i].dt <= dayFiveEnd) {
            console.log("Day 5" + weatherList[i].dt);
            console.log(dayFiveStart);
            hour = moment(value, "X").format();
            hourTZ = moment(hour).format('hh:mm A');
            forecastDate = $("<p>").text(hourTZ).css("border-top", "1px white solid");;
            forecastCol5.append(forecastDate);
            forecastIcon = weatherList[i].weather[0].icon;
            forecastImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png").attr("class", "forecastIcon");
            forecastCol5.append(forecastImg);
            forecastTemp = $('<p>' + weatherList[i].main.temp + '&#8457</p>');
            forecastCol5.append(forecastTemp);
            forecastHumidity = $('<p>Humidity: ' + weatherList[i].main.humidity + "%</p>")
            forecastCol5.append(forecastHumidity);
        }

    }

};

function defaultWeather() {
    weatherEl.empty();
    var defaultWeather = JSON.parse(localStorage.getItem("city"));
    console.log(defaultWeather)
    var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + defaultWeather[0] + ",us&units=imperial" + "&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + defaultWeather[0] + ",US&units=imperial&timezone=utc-9&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (defaultResponse) {
        console.log(defaultResponse);
        currentConditions(defaultResponse);
        uvIndex(defaultResponse);
    });
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecast) {
        console.log(forecast);
        weeklyForecast(forecast);
    });

}
defaultWeather();
searchHistory();

