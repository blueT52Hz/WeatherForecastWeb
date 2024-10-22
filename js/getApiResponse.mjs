const APIKey = '23b893bc8c8380a5ae163c63810a9fdc';

export async function getCurrentWeather(cityName) {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`);
    var data = await response.json();
    return data;
}

export async function getWeatheForecast(cityName) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}`);
    var data = await response.json();
    return data;
}

export async function getWeatherMap() {
    const response = await fetch(`https://tile.openweathermap.org/map/temp_new/1/1/1.png?appid=520b9065603ed5b0471d438bcadccaf9`);
    // var data = await response.json();
    return  response;
}

