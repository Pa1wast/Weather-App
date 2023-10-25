class WeatherDisplay {
  currentIcon = document.querySelector('[   data-current-weather-icon]');

  weatherCardDate = document.querySelectorAll('.weather-card-date');
  weatherCardIcon = document.querySelectorAll('.data-weather-card-icon');
  weatherCardTemps = document.querySelectorAll('.weather-card-temps');

  highlightTitle = document.querySelectorAll('.highlight-card-title');
  highlightDetails = document.querySelectorAll('.highlight-card-data-details');
  highlightDescription = document.querySelectorAll(
    '.highlight-card-description'
  );

  units = document.querySelector('.switch-temp-unit');
  unitC = document.querySelector('.C');
  unitF = document.querySelector('.F');

  curTemp = document.querySelector('[data-current-weather-temp]');
  curUnit = document.querySelector('[data-current-temp-unit]');

  curText = document.querySelector('[data-current-forcast-text]');
  curTextExtra = document.querySelector('[data-current-forcast-text-extra]');
  curCity = document.querySelector('[data-city-name]');

  searchBarContainer = document.querySelector('.search-bar');
  searchBar = document.querySelector('[data-search-bar]');
  searchIcon = document.querySelector('.search-icon');

  updateCurIcon(iconSrc) {
    this.currentIcon.src = iconSrc;
  }

  updateTemp(temp, unit) {
    this.curTemp.innerText = temp;
    this.curUnit.innerText = unit;
  }

  updateCurText(textArr, cityName) {
    this.curText.innerText = 'Sunrise - ' + textArr[0];
    this.curTextExtra.innerText = 'Sunset - ' + textArr[1];
    this.curCity.innerText = cityName;
  }

  updateWeatherCards(forecastHour, unit = '°C', type = 'today') {
    const curTime = new Date();
    const curHour = curTime.getHours();
    const tempHours =
      curHour >= 17
        ? [...forecastHour.slice(curHour + 1), ...forecastHour.slice(0, 17)]
        : [...forecastHour.slice(curHour + 1)];

    this.weatherCardDate.forEach((date, i) => {
      date.innerText = tempHours[i].time;
    });

    this.weatherCardTemps.forEach((temp, i) => {
      if (unit === '°C') {
        temp.innerText = forecastHour[i].tempC + '°';
      } else {
        temp.innerText = forecastHour[i].tempF + '°';
      }
    });
  }

  updateHighlightCards(weatherData, unit = '°C') {
    const tempElements = Array.from(this.highlightDetails);
    const windElements = tempElements.splice(-2);
    const highlights = Array.from(Object.values(weatherData.highlights));
    const windDetails = highlights.pop(-1);
    const highlightsC = highlights.filter((tempC, i) => {
      if (i % 2 === 0) return tempC;
    });
    const highlightsF = highlights.filter((tempF, i) => {
      if (i % 2 !== 0) return tempF;
    });
    tempElements.forEach((detail, i) => {
      if (unit === '°C' && i <= 4) {
        detail.querySelector('.data-value').innerText = Math.round(
          highlightsC[i]
        );
        detail.querySelector('.value-unit').innerText = '°C';
      } else if (unit === '°F') {
        detail.querySelector('.data-value').innerText = Math.round(
          highlightsF[i]
        );
        detail.querySelector('.value-unit').innerText = '°F';
      }
    });
    windElements.forEach((windEl, i) => {
      if (i === 0) {
        windEl.querySelector('.data-value').innerText = Math.round(
          windDetails.windSpeed
        );
      } else {
        windEl.querySelector('.data-value').innerText = Math.round(
          windDetails.windDegree
        );
      }
    });
  }

  addSwitchUnitHandler(handler) {
    this.units.addEventListener('click', e => {
      if (!e.target.classList.contains('button-switch-unit')) return;
      const buttons = Array.from(this.units.children);
      buttons.forEach(button => button.classList.remove('active-temp-unit'));
      const activeButton = e.target;
      activeButton.classList.add('active-temp-unit');
      const curUnit = activeButton.innerText;
      handler(curUnit);
    });
  }

  addSearchHandler(handler) {
    this.searchBar.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        if (!e.target.value) {
          this.ErrorMessage();
          return;
        }
        handler(e.target.value);
        e.target.value = '';
        this.ErrorMessage('hide');
      }
    });

    this.searchIcon.addEventListener('click', () => {
      const inputValue = this.searchBar.value;
      if (!inputValue) {
        this.ErrorMessage();
        return;
      }
      handler(inputValue);
      this.searchBar.value = '';
      this.ErrorMessage('hide');
    });
  }

  ErrorMessage(state = 'show') {
    if (state === 'show') {
      this.searchBarContainer.classList.add('error');
    } else if (state === 'hide') {
      this.searchBarContainer.classList.remove('error');
    }
  }
}

export default new WeatherDisplay();
