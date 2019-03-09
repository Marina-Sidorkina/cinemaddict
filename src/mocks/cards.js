import {generateRandomNumber} from '../utils.js';
import {generateRandomBoolean} from '../utils.js';
import {getRandomArrayElement} from '../utils.js';
import {createNumberRange} from '../utils.js';
import {generateRandomFixedValue} from '../utils.js';

const DESCRIPTION_LIMIT_MIN = 1;
const DESCRIPTION_LIMIT_MAX = 3;

const YEARS_LIMIT_MIN = 2010;
const YEARS_LIMIT_MAX = 2019;

const RATING_LIMIT_MIN = 0.1;
const RATING_LIMIT_MAX = 10;

const HOURS_LIMIT_MIN = 1;
const HOURS_LIMIT_MAX = 5;

const MINUTES_LIMIT_MIN = 0;
const MINUTES_LIMIT_MAX = 59;

const COMMENTS_LIMIT_MIN = 0;
const COMMENTS_LIMIT_MAX = 15;

const DAY_LIMIT_MIN = 1;
const DAY_LIMIT_MAX = 29;

const DURATION_LIMIT_MIN = 60;
const DURATION_LIMIT_MAX = 180;

const GENRES_LIMIT = 3;

const MONTHS = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

const IMAGES = [
  `./images/posters/three-friends.jpg`,
  `./images/posters/moonrise.jpg`,
  `./images/posters/fuga-da-new-york.jpg`,
  `./images/posters/blue-blazes.jpg`,
  `./images/posters/accused.jpg`,
  `./images/posters/blackmail.jpg`
];

const TITLES = [
  `Lorem ipsum rutrum quisque malesuada donec malesuada`,
  `Lorem ipsum ligula risus sodales commodo sit`,
  `Lorem ipsum sagittis fusce, sodales magna mauris`,
  `Lorem ipsum vivamus ipsum vitae maecenas et`,
  `Lorem ipsum maecenas: ligula justo arcu porta`,
  `Lorem ipsum at: arcu, tempus urna vivamus`,
  `Lorem, ipsum pharetra quam ut pharetra duis`,
  `Inani utroque ad eos. Eam te veri.`,
  `Lorem ipsum dolor sit amet, at eam.`,
  `Lorem ipsum dolor sit amet, malis harum.`,
  `Lorem ipsum dolor sit amet, principes signiferumque.`,
  `Aliquam tincidunt, ex vitae laoreet lacinia, tortor.`,
  `Ius sumo prodesset ex, has ea consul.`,
  `Ut pro nemore essent omittam, per mollis.`
];

const GENRES = [
  `Comedy`,
  `Adventure`,
  `Musical`,
  `Crime`,
  `Western`,
  `Epic`,
  `Drama`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const DIRECTORS = [
  `Muhammad Byrd`,
  `Miah Olsen`,
  `Lorelai Wu`,
  `Lucas Miles`,
  `Danielle Santana`,
  `Matias Mccarthy`,
  `Skyler Crosby`,
  `Kelton Craig`,
  `Elias Roberts`,
  `Tucker Rogers`,
  `Saige Reilly`,
  `Cecilia Mcmillan`,
  `Tabitha Thompson`,
  `Israel Solis`,
  `Madalynn Mcknight`
];

const WRITERS = [
  `Rosemary Foley`,
  `Dorian Barajas`,
  `Destiney Sims`,
  `Deandre Adams`,
  `Raven Lawrence`,
  `Cara Bowen`,
  `Kennedi Ayers`,
  `Winston Atkinson`,
  `Nick Kim`,
  `Charlize Zuniga`,
  `Elianna Velasquez`,
  `Keely Rasmussen`,
  `Makena Neal`,
  `Savanah Cisneros`,
  `Alani Walls`
];

const ACTORS = [
  `Aidan Cervantes`,
  `Kai Rodgers`,
  `Ariella Lutz`,
  `Danielle Franco`,
  `Javon Archer`,
];

const COUNTRIES = [
  `RU`,
  `US`,
  `GB`,
  `ES`,
  `IT`,
  `PL`,
  `FR`
];

const generateDescription = () => DESCRIPTIONS.sort(() => Math.random() - 0.5).slice(0, generateRandomNumber(DESCRIPTION_LIMIT_MIN, DESCRIPTION_LIMIT_MAX)).join(` `);

const generateCard = () => (
  {
    title: getRandomArrayElement(TITLES),
    rating: generateRandomFixedValue(RATING_LIMIT_MIN, RATING_LIMIT_MAX),
    year: generateRandomNumber(YEARS_LIMIT_MIN, YEARS_LIMIT_MAX),
    duration: {
      hours: generateRandomNumber(HOURS_LIMIT_MIN, HOURS_LIMIT_MAX),
      minutes: generateRandomNumber(MINUTES_LIMIT_MIN, MINUTES_LIMIT_MAX)
    },
    genre: getRandomArrayElement(GENRES),
    image: getRandomArrayElement(IMAGES),
    description: generateDescription(),
    comments: generateRandomNumber(COMMENTS_LIMIT_MIN, COMMENTS_LIMIT_MAX),
    popup: {
      director: getRandomArrayElement(DIRECTORS),
      writers: getRandomArrayElement(WRITERS),
      actors: createNumberRange(GENRES_LIMIT).map(() => getRandomArrayElement(ACTORS)).join(`, `),
      releaseDay: generateRandomNumber(DAY_LIMIT_MIN, DAY_LIMIT_MAX) + ` `
        + getRandomArrayElement(MONTHS) + ` ` + generateRandomNumber(YEARS_LIMIT_MIN, YEARS_LIMIT_MAX) + ` (`
        + getRandomArrayElement(COUNTRIES) + `)`,
      runtime: generateRandomNumber(DURATION_LIMIT_MIN, DURATION_LIMIT_MAX),
      country: getRandomArrayElement(COUNTRIES),
      genres: createNumberRange(GENRES_LIMIT).map(() => getRandomArrayElement(GENRES)),
      ageLimit: generateRandomBoolean() ? `18+` : `0+`,
      original: `Здесь будет название`,
      comments: [
        {
          text: `So long-long story, boring!`,
          author: `Tim Macoveev`,
          date: `3 days ago`,
          emoji: `😴`
        }
      ]
    }
  }
);

export const generateCards = (limit) => createNumberRange(limit).map(generateCard);
