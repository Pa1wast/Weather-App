import * as model from './model.js';
import view from './view/view.js';
import {} from './helper.js';

async function updateDisplay() {
  await model.getDataFromUser();
  view.updateCurIcon(model.state.weatherData.icon);

  if (model.state.curUnit === '°C') {
    view.updateTemp(model.state.weatherData.tempC, '°C');
    view.updateWeatherCards(
      model.state.weatherData.forecast.forecastHour,
      '°C'
    );
    view.updateHighlightCards(model.state.weatherData, '°C');
  } else {
    view.updateTemp(model.state.weatherData.tempF, '°F');
    view.updateWeatherCards(
      model.state.weatherData.forecast.forecastHour,
      '°F'
    );
    view.updateHighlightCards(model.state.weatherData, '°F');
  }

  view.updateCurText(
    model.state.weatherData.forecast.text,
    model.state.weatherData.cityName
  );
}
updateDisplay();

function controlSwitchUnit(unit) {
  model.state.curUnit = unit;
  updateDisplay();
}

async function controlSearch(cityName) {
  try {
    await model.getData(cityName);
    updateDisplay();
  } catch (err) {
    view.ErrorMessage();
  }
}

function init() {
  view.addSwitchUnitHandler(controlSwitchUnit);
  view.addSearchHandler(controlSearch);
}

init();
