import { API_KEY, getCoords, fetchApi } from './helper.js';

export const state = {
  position: {},
  weatherData: {},
  curUnit: '°C',
  date: {
    time: {
      hour: '',
      minute: '',
      seconds: '',
    },
    day: '',
  },
};

function getDate() {
  setInterval(() => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const curDay = document.querySelector('[data-current-day]');
    const curTime = document.querySelector('[data-current-time]');
    const curTimeUnit = document.querySelector('[data-current-time-unit]');

    const curDate = new Date();
    state.date = {
      time: {
        hour:
          curDate.getHours() > 12
            ? curDate.getHours() - 12
            : curDate.getHours(),
        minute: curDate.getMinutes(),
        seconds: curDate.getSeconds(),
      },
      day: days[curDate.getDay()],
    };

    curDay.innerHTML = `${state.date.day},`;

    curTime.innerHTML = `${state.date.time.hour.toString()}:${
      state.date.time.minute < 10
        ? '0' + state.date.time.minute.toString()
        : state.date.time.minute.toString()
    }:${
      state.date.time.seconds < 10
        ? '0' + state.date.time.seconds.toString()
        : state.date.time.seconds.toString()
    }`;

    curTimeUnit.innerHTML = `${curDate.getHours() >= 12 ? 'PM' : 'AM'}`;
  }, 1000);
}

getDate();

//////////////////////////////////////////////////////////

const userLocation = new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(getCoords(position, state));
    });
  } else {
    reject("Can't access your position!");
  }
});

export async function getDataFromUser() {
  await userLocation;
  const data = await fetchApi(
    state.position.latitude,
    state.position.longitude,
    API_KEY,
    'forecast'
  );

  updateState(data);
}

export async function getLocation(cityName) {
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${cityName}`
    );
    const data = await response.json();
    state.position.latitude = data[0].lat;
    state.position.longitude = data[0].lon;
    state.weatherData.cityName = data[0].display_name
      .split(' ')[0]
      .replace(',', '');
  } catch (err) {
    throw err;
  }
}

export async function getData(cityName) {
  try {
    await getLocation(cityName);
    console.log(state.position);
    const data = await fetchApi(
      state.position.latitude,
      state.position.longitude,
      API_KEY,
      'forecast'
    );
    updateState(data);
  } catch (err) {
    throw err;
  }
}

function updateState(data) {
  const curData = data.current;
  const curForecast = data.forecast;
  const curLocation = data.location;
  state.weatherData = {
    cityName: curLocation.name,
    tempC: curData.temp_c,
    tempF: curData.temp_f,

    icon: curData.condition.icon,
    description: curData.condition.text,
    highlights: {
      flTempC: curData.feelslike_c,
      flTempF: curData.feelslike_f,
      highTempC: curForecast.forecastday[0].day.maxtemp_c,
      highTempF: curForecast.forecastday[0].day.maxtemp_f,
      lowTempC: curForecast.forecastday[0].day.mintemp_c,
      lowTempF: curForecast.forecastday[0].day.mintemp_f,
      avgTempC: curForecast.forecastday[0].day.avgtemp_c,
      avgTempF: curForecast.forecastday[0].day.avgtemp_f,
      wind: {
        windSpeed: curData.wind_kph,
        windDegree: curData.wind_degree,
      },
    },
    forecast: {
      text: [
        curForecast.forecastday[0].astro.sunrise,
        curForecast.forecastday[0].astro.sunset,
      ],
      forecastHour: curForecast.forecastday[0].hour.map((obj, i) => {
        let time = obj.time.split(' ')[1];
        if (time === '00:00') time = '12:00';
        if (i < 12) {
          time = time + ' AM';
        } else {
          time !== '12:00'
            ? (time = time.slice(0, 2) - 12 + ':00 PM')
            : (time = time + ' PM');
        }
        obj = {
          time: time,
          tempC: obj.temp_c,
          tempF: obj.temp_f,
        };
        return obj;
      }),
    },
  };
}
