import { getCurrentWeather, getWeatheForecast } from "./getApiResponse.mjs";

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
};

const dataCurrentWeather = JSON.parse(`
  {
    "coord": {
        "lon": 105.8412,
        "lat": 21.0245
    },
    "weather": [
        {
            "id": 500,
            "main": "Rain",
            "description": "mưa nhẹ",
            "icon": "10d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 303.15,
        "feels_like": 305.98,
        "temp_min": 303.15,
        "temp_max": 303.15,
        "pressure": 1014,
        "humidity": 60,
        "sea_level": 1014,
        "grnd_level": 1013
    },
    "visibility": 10000,
    "wind": {
        "speed": 1.99,
        "deg": 120,
        "gust": 2.55
    },
    "rain": {
        "1h": 0.15
    },
    "clouds": {
        "all": 18
    },
    "dt": 1729305511,
    "sys": {
        "type": 1,
        "id": 9308,
        "country": "VN",
        "sunrise": 1729292004,
        "sunset": 1729333768
    },
    "timezone": 25200,
    "id": 1581130,
    "name": "Hà Nội",
    "cod": 200
}`);
// console.log(dataCurrentWeather);

// lấy thời gian hiện tại

export function getCurrentTime(timezone) {
    // lấy giờ theo timezone
    const localDate = new Date((new Date()).getTime()+timezone*1000);
    const day = localDate.getUTCDate().toString().padStart(2, '0');
    const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0'); 
    const year = localDate.getUTCFullYear();
    const weekday = weekdayNames[localDate.getDay()];
    const hours = localDate.getUTCHours().toString().padStart(2, '0');
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = localDate.getUTCSeconds().toString().padStart(2, '0');
    
    return {
        dt_txt: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        currentTime: `${hours}:${minutes}:${seconds}`,
        currentDate: `${weekday} - ${day}, ${months[month]},${year}`
    }
}
// console.log(getCurrentTime(dataCurrentWeather.timezone))

export function getTime(dt, timezone) {
    const localTime = new Date((dt + timezone) * 1000);
    const day = localTime.getUTCDate().toString().padStart(2, '0');
    const month = (localTime.getUTCMonth() + 1).toString().padStart(2, '0'); 
    const weekday = weekdayNames[localTime.getDay()];
    // const year = localTime.getUTCFullYear();
    // const hours = localTime.getUTCHours().toString().padStart(2, '0');
    // const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    // const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');
    
    return `${weekday} - ${day}, ${months[month]}`;

}

// lấy thời gian mọc lặn của mặt trời dựa theo timezone
export function getSunInformation(sunrise, sunset, timezone) {
  const gioMoc = new Date((sunrise + timezone) * 1000);
  const gioLan = new Date((sunset + timezone) * 1000);
  const doDai = new Date((sunset - sunrise)*1000);
//   console.log(gioMoc);
//   console.log(gioLan);

  return {
    sunrise: `${gioMoc.getUTCHours()    }:${gioMoc.getUTCMinutes()}`,
    sunset: `${gioLan.getUTCHours()}:${gioLan.getUTCMinutes()}`,
    lengthOfDay: `${doDai.getUTCHours()}h ${gioLan.getUTCMinutes()}m`
  }
}
// console.log(getSunInformation(dataCurrentWeather.sys.sunrise, dataCurrentWeather.sys.sunset, dataCurrentWeather.timezone));

// lấy nhiệt độ từ main của data, chuyển sang chế độ nhiệt độ hiện tại
export function getTemperature(anyData, isCelsiusMode) {
  var temp = anyData.temp;
  var feels_like = anyData.feels_like;
  var temp_min = anyData.temp_min;
  var temp_max = anyData.temp_max;
  if(isCelsiusMode) {
    temp -= 273;        
    feels_like -= 273;
    temp_min -= 273;
    temp_max -= 273;
  } 
  return {
    temp: temp.toFixed(1),
    feels_like: feels_like.toFixed(1),
    temp_min: temp_min.toFixed(1),
    temp_max: temp_max.toFixed(1)
  }
}
// console.log(getTemperature(dataCurrentWeather.main, true));

export function getCurrentLocation(data) {
    const city = data.name;
    const country = data.sys.country;
    return {
        city : city,
        country : country
    }
}

// lấy thông tin cho 1 thẻ item 3hours
export function getItemsInformation(item, isCelsiusMode) {
    const icon = item.weather[0].icon;
    const hour = item.dt_txt.split(" ")[1].split(":")[0] + "H";
    const categorie = item.dt_txt.split(" ")[1].split(":")[0] + "h";
    var temp = parseFloat(item.main.temp);
    const humidity = (item.main.humidity);
    const visibility = parseInt(item.visibility)/1000;
    if(isCelsiusMode) temp -= 273;
    temp = temp.toFixed(1);  
    temp = parseFloat(temp);  

    const res = {
        icon,
        hour,
        temp,
        dataChart: {
            temp, humidity, visibility, categorie
        }
    }
    return res;
}

export async function parseAll(cityName, isCelsiusMode) {
    const dataCurrentWeather = await getCurrentWeather(cityName);
    const dataForecast5days = await getWeatheForecast(cityName);
    // const dataForecast5days = JSON.parse(localStorage.getItem('dataForecast5days'));
    // console.log(dataCurrentWeather);
    console.log(dataForecast5days);
    
    if(dataCurrentWeather.cod == '200' && dataForecast5days.cod == '200'){
        localStorage.setItem('cityName', cityName);
        const timezone = dataCurrentWeather.timezone;
        const location = getCurrentLocation(dataCurrentWeather);
        const currentTime = getCurrentTime(dataCurrentWeather.timezone);
        const temperature = getTemperature(dataCurrentWeather.main, isCelsiusMode);
        const sunInformation = getSunInformation(dataCurrentWeather.sys.sunrise, dataCurrentWeather.sys.sunset, dataCurrentWeather.timezone);
        const listForecast = dataForecast5days.list;
        const currentWeather = dataCurrentWeather.weather[0].main;

        return {
            currentWeather,
            timezone,
            location,
            currentTime,
            temperature,
            sunInformation,
            listForecast
        };

    } else {
        // hiện modal thành phố không hợp lệ
        // document.querySelector();
        // alert(dataCurrentWeather.message);
        var elm = document.querySelector('.modal');
        elm.style.display = 'flex';
        elm.querySelector('.modal-message').textContent = dataCurrentWeather.message;
        return await parseAll(localStorage.getItem('cityName'), isCelsiusMode);
    }
}