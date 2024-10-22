import { getCurrentTime, parseAll, getItemsInformation, getTime } from "./parseDataFromResponse.mjs";
import {drawChart} from "./highChart.mjs"

export async function onSearchButonClicked(event) {
    var inputElement = event.target;
    inputElement = inputElement.parentNode.querySelector('input');
    const cityName = inputElement.value.trim();
    // const cityName = 'Ha noi';
    searchCity(cityName);
}

export async function  onKeyEnterDown(event) {
    if(event.key !== 'Enter') return;
    var inputElement = event.target;
    const cityName = inputElement.value.trim();
    // const cityName = 'Ha noi';
    searchCity(cityName);
}

export function searchCity(cityName) {
    clearIntervals();
    setInnerAll(cityName);
}

export function clearIntervals() {
    interVals.forEach(element => {
        clearInterval(element)
    })
}

export async function setInnerAll(cityName) {
    const inner = await parseAll(cityName, isCelsiusMode);
    setCurrentTime(inner);
    interVals.push(setInterval(function() {
        clearInterval(0);
        setCurrentTime(inner);
    }, 1000));
    
    //chỉnh thông tin trong mainboard
    setMainBoard(inner);
    interVals.push(setInterval(function() {
        clearInterval(1);
        setMainBoard(inner);
    }, 3600000));

    //chỉnh thông tin mặt trời
    setSunInformation(inner);

    // chỉnh thông các thẻ dự báo 3h tới
    set3HourForecast(inner);
    interVals.push(setInterval(function() {
        clearInterval(2);
        set3HourForecast(inner);
    }, 3600000));

    // chỉnh dự báo các ngày kế tiếp
    setOtherDays(inner);

    analyst(inner);
}

export function setCurrentTime(inner) {
    document.querySelector('.time').textContent = getCurrentTime(inner.timezone).currentTime;
}

//chỉnh thông tin trong mainboard
export function setMainBoard(inner) {
    document.querySelector('.city-name').textContent = inner.location.city; 
    document.querySelector('.country-name').textContent = inner.location.country; 
    document.querySelector('.date').textContent = inner.currentTime.currentDate;
    document.querySelector('.temperature-temp').textContent = inner.temperature.temp;
    document.querySelector('.temperature-max').textContent = inner.temperature.temp_max;
    document.querySelector('.temperature-min').textContent = inner.temperature.temp_min;
    document.querySelector('.weather-overview').textContent = inner.currentWeather;
}

//chỉnh thông tin mặt trời
export function setSunInformation(inner) {
    document.querySelector('.sun-rise-hour').textContent = inner.sunInformation.sunrise;
    document.querySelector('.sun-set-hour').textContent = inner.sunInformation.sunset;
    document.querySelector('.length-of-day').textContent = inner.sunInformation.lengthOfDay;
}

// chỉnh thông các thẻ dự báo 3h tới
export function set3HourForecast(inner) {
    const dt_txt = getCurrentTime(inner.timezone).dt_txt;
    const listForecast = inner.listForecast;
    var cntItem = 0;
    for(const i of listForecast) {
        if(i.dt_txt >= dt_txt) {
            const itemInformation = getItemsInformation(i, isCelsiusMode);
            document.querySelectorAll('.today-weather-forecast-item-temparature .temperature-value')[cntItem].textContent = itemInformation.temp;
            document.querySelectorAll('.today-weather-forecast-item-hour')[cntItem].textContent = itemInformation.hour;
            // chỉnh icon
            // document.querySelectorAll('.today-weather-forecast-item-temparature .temperature-value')[cntItem].textContent = itemInformation.temp;
            cntItem++;
        }
        if(cntItem>3) return;
    }
}

// vẽ biểu đồ
export function analyst(inner) {
    const currentDay = getCurrentTime(inner.timezone).dt_txt.split(' ')[0].split('-')[2];
    const listForecast = inner.listForecast;

    var categories = [];
    var temperatureData = [];
    var humidityData = [];
    var visibilityData = [];

    for(const i of listForecast) {
        if(i.dt_txt.split(' ')[0].split('-')[2] == currentDay) {
            const itemInformation = getItemsInformation(i, isCelsiusMode);
            categories.push(itemInformation.dataChart.categorie);
            temperatureData.push(itemInformation.dataChart.temp);
            humidityData.push(itemInformation.dataChart.humidity);
            visibilityData.push(itemInformation.dataChart.visibility);
        }   
    }

    // console.log(categories);
    // console.log(temperatureData);
    // console.log(humidityData);
    // console.log(visibilityData);

    drawChart(categories, temperatureData, humidityData, visibilityData);

}

// dự báo thời tiết 4 ngày tiếp theo
export function setOtherDays(inner) {
    const currentDay = getCurrentTime(inner.timezone).dt_txt.split(' ')[0].split('-')[2];
    // const currentDay = '9';
    const currentHour = getCurrentTime(inner.timezone).dt_txt.split(' ')[1].split(':')[0];
    // console.log(currentDay);
    // console.log(currentHour);
    
    const listForecast = inner.listForecast;
    var cntItem = 0;
    for(const i of listForecast) {
        if(parseInt(i.dt_txt.split(' ')[0].split('-')[2]) - parseInt(currentDay) > cntItem && i.dt_txt.split(' ')[1].split(':')[0] == '06') {
            const itemInformation = getItemsInformation(i, isCelsiusMode);
            // console.log(itemInformation);
            document.querySelectorAll('.other-days-item .dayOfWeek')[cntItem].textContent = getTime(i.dt, inner.timezone);
            document.querySelectorAll('.other-days-item .temperature-value')[cntItem].textContent = itemInformation.temp;
            // document.querySelectorAll('.other-days-item img')[cntItem].textContent = itemInformation.icon;
            cntItem++;
        }
        if(cntItem>3) return;   
    }

}

export function changeTemperatureMode() {
    // console.log(isCelsiusMode);
    if(isCelsiusMode) {
        // chỉnh giá trị nhiệt độ sang độ Kelvin
        const elms = document.querySelectorAll('.temperature-value');
        elms.forEach(element => {
            element.textContent = (parseFloat(element.textContent) + 273).toFixed(1);
        });
        // Chuyển đơn vị        
        document.querySelectorAll('.temperature-unit').forEach(element => {
            element.textContent = 'K';
        })
        // chuyển tab active
        document.querySelector('.celsius-mode').classList.remove("temperature-mode-active");
        document.querySelector('.kelvin-mode').classList.add("temperature-mode-active");
    } else {
        // chỉnh giá trị nhiệt độ sang độ C
        const elms = document.querySelectorAll('.temperature-value');
        elms.forEach(element => {
            element.textContent = (parseFloat(element.textContent) - 273).toFixed(1);
        });
        // Chuyển đơn vị
        document.querySelectorAll('.temperature-unit').forEach(element => {
            element.textContent = 'C';
        })        
        // chuyển tab active
        document.querySelector('.kelvin-mode').classList.remove("temperature-mode-active");
        document.querySelector('.celsius-mode').classList.add("temperature-mode-active");
    }
    isCelsiusMode = !isCelsiusMode;
}

export function closeModal(event) {
    var elm = event.target;
    elm.style.display = 'none';
}

var isCelsiusMode = true;
var interVals = [];

