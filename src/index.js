// описана инициализация приложения и основная логика страницы:
// поиск DOM-элементов на странице и навешивание на них обработчиков событий;
// обработчики отправки форм, функция-обработчик события открытия модального окна для редактирования профиля;
// функция открытия модального окна изображения карточки.
// Также находится код, который отвечает за отображение шести карточек при открытии страницы.
import './index.css'; // импорт главного файла стилей
import { initialCards } from './scripts/cards.js'; //картинки можно импортировать, вебпак добавит в переменные правильные пути
import {
  openModal,
  closeModal,
  handleOverlayClick,
} from "./scripts/components/modal.js";
import { createCard } from "./scripts/components/card.js";

//Получение DOM-элементов
const placesContainer = document.querySelector('.places__list'); //Контейнер для карточек
//Кнопки открытия модальных окон
const openButtonProfile = document.querySelector(".profile__edit-button"); // // Кнопка редактирования профиля
const openButtonCard = document.querySelector(".profile__add-button"); // // Кнопка добавления карточки
//Элементы модальных окон (попапов)
const popups = document.querySelectorAll(".popup"); // Все попапы
const popupProfile = document.querySelector(".popup_type_edit"); // Попап редактирования профиля
const popupCardAdd = document.querySelector(".popup_type_new-card"); // Попап добавления карточки
const imagePopup = document.querySelector(".popup_type_image"); // Попап просмотра изображения
//Формы и их элементы
const formElement = document.forms["edit-profile"]; // Форма редактирования профиля
const formElementCard = document.forms["new-place"]; // Форма добавления карточки
// Поля формы редактирования профиля
const nameInput = popupProfile.querySelector(".popup__input_type_name"); 
const jobInput = popupProfile.querySelector(".popup__input_type_description");
// Поля формы добавления карточки
const placeInput = formElementCard.querySelector(".popup__input_type_card-name");
const linkInput = formElementCard.querySelector(".popup__input_type_url");
//Элементы профиля
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
//Элементы попапа с изображением
const imageView = imagePopup.querySelector(".popup__image"); // Увеличенное изображение
const captionView = imagePopup.querySelector(".popup__caption"); // Подпись к изображению

//Объединяю в объект cardCallbacks для передачи в createCard
const cardCallbacks = {
  onDeleteCard: deleteCard,
  onLikeCard: likeCard,
  onOpenView: openView,
};

//Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
};

// Переключает состояние лайка
function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active'); 
};

// Открывает попап с увеличенным изображением
function openView({ name, link }) {
  imageView.src = link;
  imageView.alt = name;
  captionView.textContent = name;
  openModal(imagePopup);
};

// функция добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  // Получаем данные из формы

  const name = placeInput.value;
  const link = linkInput.value;

  // Создаем карточку
  const cardElement = createCard({ name, link }, cardCallbacks);
  // Добавляет новую карточку в начало списка
  placesContainer.prepend(cardElement); 

  // Очищаем форму и закрываем попап
  closeModal(popupCardAdd);
};

function handleFormProfileSubmit(evt) {
  evt.preventDefault(); //отменяет стандартную отправку формы.
  
  profileName.textContent = nameInput.value; // Обновляем имя профиля
  profileJob.textContent = jobInput.value; // Обновляем описание профиля
  closeModal(popupProfile);
};

// Назначаем обработчики открытия
openButtonProfile.addEventListener("click", () => {
  // Заполняет форму текущими данными
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(popupProfile);
});

openButtonCard.addEventListener("click", () => {
  formElementCard.reset(); // Очищает форму
  openModal(popupCardAdd);
});

// Назначаем обработчики закрытия 
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close"); 
  closeButton.addEventListener("click", () => {
    closeModal(popup);
  });
  popup.addEventListener("click", handleOverlayClick); // Закрытие по клику на оверлей
});

// Назначаем обработчики открытия изменения профиля
formElement.addEventListener("submit", handleFormProfileSubmit);

// Назначаем обработчики добавления карточки
formElementCard.addEventListener("submit", (evt) => {
  handleAddCardFormSubmit(evt);
});

// @todo: Вывести карточки на страницу
// заменила функцию на прямое добавление
// function addCardToContainer(containerElement, cardElement) {
//     containerElement.append(cardElement);
// }
// addCardToContainer(placesContainer, cardNode);

 initialCards.forEach((cardObj) => {
    const cardNode = createCard(cardObj, cardCallbacks);
    placesContainer.append(cardNode)
 })


