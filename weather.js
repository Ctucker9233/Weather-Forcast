var searchBtn = $('.btn');
var weatherEl = $('.weather-info');
function searchCity() {
    searchBtn.on("click", function (event) {
        var searchInput = $('#weather-search').val();
        var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput +",us&units=imperial" + "&appid=" + APIKey;
        event.preventDefault();
        console.log(searchInput);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            currentConditions(response);
        });
    });
};

function currentConditions(response){
    var currentDay = moment().format('MM/DD/YYYY');
    var titleEl = $('<div>').attr("class", "title")
    var weatherIcon = response.weather[0].icon;
    var cityName = $("<h3>" + response.name + " " + currentDay + "</h3>")
    var weatherImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ weatherIcon + "@2x.png")
    cityName.append(weatherImg)
    titleEl.append(cityName)
    weatherEl.append(titleEl);
    
}
searchCity();
//"https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput +"&units=imperial" + "&appid=" + APIKey;
