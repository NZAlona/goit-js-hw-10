import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const listUl = document.querySelector('.country-list');
const divContainer = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const inputValue = event.target.value.trim();

  clearHtmlMarkup();

  if (inputValue === '') {
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length < 10 && data.length > 1) {
        renderCountryList(data);
      }

      if (data.length === 1) {
        listUl.innerHTML = '';

        renderCountryInfo(data);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(data) {
  const markup = data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li><img src="${svg}" alt ="${official}" width=95 height = 45 <h2>${official}</h2></li>`
    )
    .join('');
  listUl.innerHTML = markup;
}

function renderCountryInfo(data) {
  const markup = data
    .map(
      ({
        name: { official },
        flags: { svg },
        population,
        capital,
        languages,
      }) =>
        `<div><img src="${svg}" alt ="${official}" width=45 height = 45> <h2> ${official}</h2>
        <span>Capital: ${capital}</span>
        <span>Population: ${population}</span>
        <span>Languages: ${Object.values(languages)}</span>
          </div>`
    )
    .join('');
  divContainer.innerHTML = markup;
}

function clearHtmlMarkup() {
  listUl.innerHTML = '';
  divContainer.innerHTML = '';
}
