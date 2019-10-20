var searchBtn = $('.btn');
function searchCity() {
    searchBtn.on("click", function (event) {
        var searchInput = $('#weather-search').val();
        var APIKey = "b1b590596ba62ec3375d8b2762bdd012";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + ",us&appid=" + APIKey;
        event.preventDefault();
        console.log(searchInput);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });
    });
};

searchCity();
