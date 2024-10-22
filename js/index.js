import { searchCity, onSearchButonClicked, changeTemperatureMode, closeModal, onKeyEnterDown } from "./addEvent.mjs";

function start() {
    var cityName = localStorage.getItem('cityName');
    if(!cityName) {
        localStorage.setItem('cityName', 'Ha noi');
        cityName = 'Ha noi';
    }
    searchCity(cityName);
}
document.querySelector('i.fa-magnifying-glass').addEventListener('click', onSearchButonClicked);
document.querySelector('.search-bar input').addEventListener('keydown', onKeyEnterDown);
document.querySelector('.temperature-mode-container').addEventListener('click', changeTemperatureMode);
document.querySelector('.modal').addEventListener('click', closeModal);
start();