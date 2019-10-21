var searchBtn = $('.btn');
var weatherEl = $('.weather-info');
function searchCity() {
    searchBtn.on("click", function () {
        weatherEl.empty();
        var searchInput = $('#weather-search').val();
        var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + ",us&units=imperial" + "&appid=" + APIKey;
        console.log(searchInput);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            currentConditions(response);
            uvIndex(response);
        });
    });
};

function currentConditions(response) {
    var value = response.dt;
    var currentDay = moment.unix(value).format("MM/DD/YYYY");
    var titleEl = $('<div>').attr("class", "title");
    var weatherIcon = response.weather[0].icon;
    var cityName = $("<h3>" + response.name + " " + currentDay + "</h3>")
    var weatherImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")
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
        if (uvValue >= 0 && uvValue <= 2.9){
            uvP2.attr("class", "low");
        }
        else if(uvValue >= 3.0 && uvValue <= 5.9){
            uvP2.attr("class", "moderate");
        }
        else if(uvValue >= 6.0 && uvValue <= 7.9){
            uvP2.attr("class", "high");
        }
        else if(uvValue >= 8.0 && uvValue <= 10.9){
            uvP2.attr("class", "very-high");
        }
        else if(uvValue >= 11.0){
            uvP2.attr("class", "extreme");
        }

    })
}
searchCity();
//"https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput +"&units=imperial" + "&appid=" + APIKey;
