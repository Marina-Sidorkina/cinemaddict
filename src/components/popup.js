import {createPopupTemplate, createCommentTemplate} from '../templates/popup';
import {createElement} from '../lib/element';
import BaseComponent from './base';

const KeyCode = {
  ESC: 27,
  ENTER: 13
};
const CommentBorderSetting = {
  ERROR: `3px solid #8B0000`,
  DEFAULT: `1px solid #979797`
};
const RatingElementColor = {
  DEFAULT: `#d8d8d8`,
  ERROR: `#8B0000`,
  CHECKED: `#ffe800`
};

export default class PopupComponent extends BaseComponent {
  constructor(data) {
    super(data);

    this.setState({
      isOnWatchlist: data.isOnWatchlist,
      isWatched: data.isWatched,
      isFavorite: data.isFavorite
    });

    this._onClose = null;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
    this._onRatingChange = this._onRatingChange.bind(this);
    this._onCommentsKeydown = this._onCommentsKeydown.bind(this);
    this._onCommentRemove = this._onCommentRemove.bind(this);
    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onAddToWatchListButtonClick = this._onAddToWatchListButtonClick.bind(this);
    this._onAddToFavoriteButtonClick = this._onAddToFavoriteButtonClick.bind(this);
    this._onCommentFormInput = this._onCommentFormInput.bind(this);
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onCommentSubmit(fn) {
    this._onCommentSubmit = fn;
  }

  set onRatingSubmit(fn) {
    this._onRatingSubmit = fn;
  }

  _toggleCardProperty(propertyName) {
    const value = !this._state[propertyName];
    this.setState({propertyName: value});
    this._data[propertyName] = value;

  }
  _onMarkAsWatchedButtonClick() {
    this._toggleCardProperty(`isWatched`);
    this._element.querySelector(`.film-details__watched-status`)
      .innerHTML = this._data.isWatched ? `Already watched` : `Will watch`;
  }

  _onAddToWatchListButtonClick() {
    this._toggleCardProperty(`isOnWatchlist`);
  }

  _onAddToFavoriteButtonClick() {
    this._toggleCardProperty(`isFavorite`);
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._data.commentsAmount = this._data.popup.commentsList.length;
    if (typeof this._onClose === `function`) {
      this._onClose(this._data);
    }
  }

  _onEscClick(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this._data.commentsAmount = this._data.popup.commentsList.length;
      if (typeof this._onClose === `function`) {
        this._onClose(this._data);
      }
    }
  }

  _setRatingElementsDisbility(value) {
    this._element.querySelectorAll(`.film-details__user-rating-input`)
      .forEach((item) => {
        item.disabled = value;
      });
  }

  showNewRating() {
    this._element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${this._data.popup.yourRating}`;
    this._setRatingElementsDisbility(false);
    this._element.querySelector(`[for="${this._ratingElement.id}"]`)
      .style.backgroundColor = RatingElementColor.CHECKED;
  }

  showRatingSubmitError() {
    const labelElement = this._element.querySelector(`[for="${this._ratingElement.id}"]`);
    this._element
      .querySelector(`[value="${this._previousRatingValue}"]`).checked = true;
    this._data.popup.yourRating = this._previousRatingValue;
    labelElement.classList.add(`shake`);
    this._setRatingElementsDisbility(false);
    labelElement.style.backgroundColor = RatingElementColor.ERROR;
  }

  _onRatingChange(evt) {
    this._previousRatingValue = this._data.popup.yourRating;
    this._data.popup.yourRating = evt.target.value;
    this._ratingElement = evt.target;
    this._setRatingElementsDisbility(true);
    this._element.querySelectorAll(`.film-details__user-rating-label`).forEach((element) => {
      element.style.backgroundColor = RatingElementColor.DEFAULT;
    });
    if (typeof this._onRatingSubmit === `function`) {
      this._onRatingSubmit(this._data, this);
    }
  }

  _createComment(comment) {
    return createElement(
        createCommentTemplate(comment)
    );
  }

  _getEmojiValue() {
    const emojiElement = this._element.querySelector(`.film-details__emoji-list`);
    const inputElements = emojiElement.querySelectorAll(`input`);
    const checkedElement = Array.from(inputElements).find((element) => element.checked);
    return checkedElement.value;
  }

  _isYourComment() {
    return this._data.popup.commentsList.some((comment) => comment.author === `Your comment`);
  }

  _onCommentFormInput() {
    this._element.querySelector(`.film-details__comment-input`)
      .style.border = CommentBorderSetting.DEFAULT;
  }

  _addComment(comment) {
    this._data.popup.commentsList.push({
      comment,
      author: `Your comment`,
      date: new Date(),
      emotion: this._getEmojiValue()
    });
  }

  _onCommentsKeydown(evt) {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    if (evt.keyCode === KeyCode.ENTER && evt.ctrlKey && inputElement.value) {
      inputElement.style.border = CommentBorderSetting.DEFAULT;
      this._addComment(inputElement.value);
      inputElement.removeEventListener(`input`, this._onCommentFormInput);
      inputElement.disabled = true;
      if (typeof this._onCommentSubmit === `function`) {
        this._onCommentSubmit(this._data, this);
      }
    }
  }

  _onCommentRemove() {
    if (this._isYourComment()) {
      this._data.popup.commentsList.pop();
      const containerElement = this._element.querySelector(`.film-details__comments-list`);
      containerElement
        .removeChild(containerElement.querySelector(`.film-details__comment:last-child`));
      this._element.querySelector(`.film-details__comments-count`)
        .innerHTML = this._data.popup.commentsList.length;
      if (!this._isYourComment()) {
        this._element
          .querySelector(`.film-details__user-rating-controls`)
          .classList.add(`visually-hidden`);
      }
    }
  }

  enableCommentForm() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    inputElement.disabled = false;
    this._element.querySelector(`.film-details__comments-list`)
      .appendChild(this._createComment({comment: inputElement.value, author: `Your comment`,
        date: new Date(), emotion: this._getEmojiValue()}));
    this._element.querySelector(`.film-details__user-rating-controls`)
      .classList.remove(`visually-hidden`);
    this._element.querySelector(`.film-details__watched-status`)
      .innerHTML = this._data.isWatched ? `Already watched` : `Will watch`;
    this._element.querySelector(`.film-details__comments-count`)
      .innerHTML = this._data.popup.commentsList.length;
    inputElement.value = ``;
  }

  showCommentSubmitError() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    this._data.popup.commentsList.pop();
    inputElement.style.border = CommentBorderSetting.ERROR;
    this._element.querySelector(`.film-details__add-emoji-label`).classList.add(`shake`);
    inputElement.disabled = false;
    inputElement.addEventListener(`input`, this._onCommentFormInput);
  }

  createListeners() {
    if (this._element) {
      this
        ._element
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, this._onCloseButtonClick);
      this
        ._element
        .querySelectorAll(`.film-details__user-rating-input`)
        .forEach((input) => {
          input.addEventListener(`click`, this._onRatingChange);
        });
      this
        ._element
        .querySelector(`.film-details__comments-wrap`)
        .addEventListener(`keydown`, this._onCommentsKeydown);
      this
        ._element.querySelector(`#list`)
        .addEventListener(`change`, this._onAddToWatchListButtonClick);
      this
        ._element.querySelector(`#watched`)
        .addEventListener(`change`, this._onMarkAsWatchedButtonClick);
      this
        ._element.querySelector(`#favorite`)
        .addEventListener(`change`, this._onAddToFavoriteButtonClick);
      this
        ._element.querySelector(`.film-details__watched-reset`)
        .addEventListener(`click`, this._onCommentRemove);
      window.addEventListener(`keydown`, this._onEscClick);
    }
  }

  removeListeners() {
    this
      ._element
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this
      ._element
      .querySelectorAll(`.film-details__user-rating-input`)
      .forEach((input) => {
        input.removeEventListener(`click`, this._onRatingChange);
      });
    this
      ._element
      .querySelector(`.film-details__comments-wrap`)
      .removeEventListener(`keydown`, this._onCommentsKeydown);
    this
      ._element.querySelector(`#list`)
      .removeEventListener(`change`, this._onAddToWatchListButtonClick);
    this
      ._element.querySelector(`#watched`)
      .removeEventListener(`change`, this._onMarkAsWatchedButtonClick);
    this
      ._element.querySelector(`#favorite`)
      .removeEventListener(`change`, this._onAddToFavoriteButtonClick);
    this
      ._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onCommentRemove);
    window.removeEventListener(`keydown`, this._onEscClick);
  }
}
