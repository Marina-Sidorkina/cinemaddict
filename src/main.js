import {getFilteredCards, setFiltersCounts} from './lib/filters';
import {setUserRank} from './lib/user-rank';
import FILTER_DATA from './data/filter';
import FiltersComponent from './components/filters';
import CardsSectionsComponent from './components/cards-sections';
import StatisticsComponent from './components/statistics';
import SearchComponent from './components/search';
import LoadInProcessComponent from './components/load-in-process';
import LoadErrorComponent from './components/load-error';
import API from './api';
import CardModel from './models/card-model';

const AUTHORIZATION = `Basic NullaAetasAdDiscendumSera`;
const END_POINT = ` https://es8-demo-srv.appspot.com/moowle`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const mainElement = document.querySelector(`main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);
const userRankElement = document.querySelector(`.profile__rating`);
const loadInProcessComponent = new LoadInProcessComponent();
const loadErrorComponent = new LoadErrorComponent();
let cardsList;
let filtersComponent;
let cardsSectionsComponent;
let statisticsComponent;
let searchComponent;

const updateCardsList = (updatedData, id, successCallback) => {
  api.updateData({id: updatedData.id, newData: CardModel.toRAW(updatedData)}).then((cardModel) => {
    const index = cardsList.findIndex((item) => item.id === id);
    cardsList[index] = Object.assign({}, cardModel);
    setFiltersCounts(cardsList);
    userRankElement.innerHTML = setUserRank(cardsList.filter((card) => card.isWatched).length);
    if (typeof successCallback === `function`) {
      successCallback();
    }
  });
};

const onFilterSelect = (id) => {
  if (cardsSectionsComponent._element) {
    cardsSectionsComponent.update(getFilteredCards(cardsList)[id]());
    document.querySelector(`.search__field`).value = ``;
  } else {
    statisticsComponent.unrender();
    mainElement.removeChild(mainElement.lastChild);
    addCards();
    cardsSectionsComponent.update(getFilteredCards(cardsList)[id]());
  }
};

const addFilters = () => {
  filtersComponent = new FiltersComponent(FILTER_DATA);
  mainElement.insertBefore(filtersComponent.render(), mainElement.firstChild);
  filtersComponent.onSelect = onFilterSelect;
  setFiltersCounts(cardsList);
  document.querySelector(`#stats`).addEventListener(`click`, onStatsClick);
};

const addCards = () => {
  cardsSectionsComponent = new CardsSectionsComponent(cardsList);
  mainElement.appendChild(cardsSectionsComponent.render());
  cardsSectionsComponent.onChange = updateCardsList;
};

const onSearch = (value) => {
  if (value) {
    cardsSectionsComponent.onSearch(value);
  } else {
    cardsSectionsComponent.updateMainBlockElement();
  }
};

const addSearch = () => {
  const container = document.querySelector(`.header`);
  const referenceElement = container.querySelector(`.profile`);
  searchComponent = new SearchComponent();
  container.insertBefore(searchComponent.render(), referenceElement);
  searchComponent.onSearch = onSearch;
};

const onStatsClick = () => {
  cardsSectionsComponent.unrender();
  mainElement.removeChild(mainElement.lastChild);
  statisticsComponent = new StatisticsComponent(cardsList);
  mainElement.appendChild(statisticsComponent.render());
  document.querySelector(`.search__field`).value = ``;
};

mainElement.appendChild(loadInProcessComponent.render());
api.getData()
  .then((data) => {
    cardsList = data;
    mainElement.removeChild(loadInProcessComponent.element);
    loadInProcessComponent.unrender();
    addCards();
    addFilters();
    footerStatisticsElement.innerHTML = `${cardsList.length} movies inside`;
    userRankElement.innerHTML = setUserRank(cardsList.filter((card) => card.isWatched).length);
  })
  .catch(() => {
    mainElement.innerHTML = ``;
    mainElement.appendChild(loadErrorComponent.render());
  });

addSearch();
