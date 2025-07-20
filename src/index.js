import "./index.css"; // импорт главного файла стилей
//import { initialCards } from './scripts/cards.js'; //картинки можно импортировать, вебпак добавит в переменные правильные пути
import {
  openModal,
  closeModal,
  handleOverlayClick,
} from "./scripts/components/modal.js";
import { createCard } from "./scripts/components/card.js";
import { enableValidation, clearValidation } from "./scripts/validation.js";
import {
  getUserInfo,
  getCardList,
  updateUserInfo,
  addNewCard,
  updateAvatar,
  toggleLike, 
  removeCard
} from "./scripts/api.js";

//Получение DOM-элементов
const placesContainer = document.querySelector(".places__list"); //Контейнер для карточек
//Кнопки открытия модальных окон
const profileEditButton = document.querySelector(".profile__edit-button"); // // Кнопка редактирования профиля
const newCardButton = document.querySelector(".profile__add-button"); // // Кнопка добавления карточки
//Элементы модальных окон (попапов)
const popups = document.querySelectorAll(".popup"); // Все попапы
const popupProfile = document.querySelector(".popup_type_edit"); // Попап редактирования профиля
const popupCardAdd = document.querySelector(".popup_type_new-card"); // Попап добавления карточки
//Элементы попапа с изображением
const imagePopup = document.querySelector(".popup_type_image"); // Попап просмотра изображения
const imageView = imagePopup.querySelector(".popup__image"); // Увеличенное изображение
const captionView = imagePopup.querySelector(".popup__caption"); // Подпись к изображению
//Формы и их элементы
const profileForm = document.forms["edit-profile"]; // Форма редактирования профиля
const newCardForm = document.forms["new-place"]; // Форма добавления карточки
// Поля формы редактирования профиля
const nameInput = popupProfile.querySelector(".popup__input_type_name");
const jobInput = popupProfile.querySelector(".popup__input_type_description");
// Элементы попапа аватара
const popupAvatar = document.querySelector(".popup_type_edit-avatar");
const avatarForm = document.forms["edit-avatar"]; //
const avatarInput = avatarForm.querySelector('input[name="avatar"]'); //ссылка на аватар
const avatarError = avatarForm.querySelector(".form__input_avatar-error");
const profileImage = document.querySelector(".profile__image"); // Контейнер аватара
// Поля формы добавления карточки
const placeInput = newCardForm.querySelector(".popup__input_type_card-name");
const linkInput = newCardForm.querySelector(".popup__input_type_url");
//Элементы профиля
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

let userId; //идентификатор текущего пользователя (для определения своих карточек)

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

// getUserInfo()
//   .then((user) => {
//     console.log(user); // чтобы увидеть данные в консоли
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Используйте этот массив при отображении предзагруженных карточек
//Функция отрисовки карточек
function renderCards(cards, userId) {
  cards.forEach((card) => {
    // создаю DOM-элемент для каждой карточки
    const cardElement = createCard(card, cardCallbacks, userId);
    // добавляю в контейнер
    placesContainer.append(cardElement);
  });
}

//передается массив промисов, которые должны быть выполнены, т.е. наши запросы
Promise.all([getUserInfo(), getCardList()]) 
  .then(([userData, cards]) => {
    //в блок .then мы попадем когда оба запроса будут выполнены. 
    // userData-результат getUserInfo(), cards - результат getCardList()
    userId = userData._id; //// Сохраняем ID пользователя
    //Обновление профиля в интерфейсе
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    // Обновление аватара
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    }
    // Отрисовываем карточки
    renderCards(cards, userId);
  })

  .catch((err) => {
    console.error("Ошибка обновления:", err);
  });

// Открывает попап с увеличенным изображением
function openView({ name, link }) {
  imageView.src = link;
  imageView.alt = name;
  captionView.textContent = name;
  openModal(imagePopup);
};
//Функция удаления карточки
function deleteCard(cardElement, cardId) {
  const confirmPopup = document.querySelector(".popup_type_confirm");
  const confirmButton = confirmPopup.querySelector(".popup__button");

  // Обработчик подтверждения удаления
  const handleConfirm = (evt) => {
    evt.preventDefault();
    // Блокируем кнопку
    confirmButton.textContent = "Удаление...";
    confirmButton.disabled = true;

    // Отправляем запрос на сервер
    removeCard(cardId)
      .then(() => {
        // Удаляем карточку из DOM после успешного ответа
        cardElement.remove();
        closeModal(confirmPopup);
      })
      .catch((error) => {
        console.log(`Ошибка при удалении карточки: ${error}`);
      })
      .finally(() => {
        confirmButton.textContent = "Да";
        confirmButton.disabled = false;
      });
  };

  // Вешаем обработчик на форму подтверждения
  //флаг {once: true} для автоматического удаления обработчиков после срабатывания.
  confirmPopup.addEventListener("submit", handleConfirm, { once: true });

  openModal(confirmPopup); // Показываем попап подтверждения
};

// Функция переключения лайка
function likeCard(likeButton, cardId, isLiked, likeCounter) {
  // вызов API для обновления лайка на сервере
  toggleLike(cardId, isLiked)
    .then((updatedCard) => {
      // обновление состояния лайков
      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((error) => console.log(`Не удалось поставить лайк: ${error}`));
};

//Объединяю в объект cardCallbacks для передачи в createCard
const cardCallbacks = {
  onDeleteCard: deleteCard,
  onLikeCard: likeCard,
  onOpenView: openView,
};

// функция добавления карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); //отменяет стандартную отправку формы.
  // Получаем данные из формы
  const name = placeInput.value;
  const link = linkInput.value;

  // Блокируем кнопку отправки
  const submitButton = evt.target.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  // Отправляем данные на сервер
  addNewCard(name, link)
    .then((cardData) => {
      // Создаем карточку с данными от сервера
      const cardElement = createCard(cardData, cardCallbacks, userId);
      placesContainer.prepend(cardElement);

      // Очищаем форму и закрываем попап
      newCardForm.reset();
      closeModal(popupCardAdd);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      // Разблокируем кнопку в любом случае
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });
}

//Обработчик отправки формы профиля
function handleFormProfileSubmit(evt) {
  evt.preventDefault(); //отменяет стандартную отправку формы.
  //выберите элементы, куда должны быть вставлены начения полей
  const name = nameInput.value;
  const about = jobInput.value;

  // Блокируем кнопку отправки
  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  // Отправляем данные на сервер
  updateUserInfo(name, about)
    .then((userData) => {
      // Обновляем интерфейс данными с сервера
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      // profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

      closeModal(popupProfile);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
      // Можно добавить вывод ошибки для пользователя
    })
    .finally(() => {
      // Восстанавливаем кнопку
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Обработчик отправки аватара
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector(".popup__button");
  const originalText = submitButton.textContent;

  // Блокируем кнопку
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  updateAvatar(avatarInput.value)
    .then((userData) => {
      // Обновляем аватар на странице
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.error("Ошибка обновления аватара:", err);
      avatarError.textContent = "Не удалось обновить аватар";
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Назначаем обработчик
avatarForm.addEventListener("submit", handleAvatarSubmit);

// Обработчик клика на аватар
profileImage.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(popupAvatar);
});

// обработчик открытия hредактирования профиля
profileEditButton.addEventListener("click", () => {
  // Заполняет форму текущими данными
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(popupProfile);
});

newCardButton.addEventListener("click", () => {
  newCardForm.reset(); // Очищает форму
  openModal(popupCardAdd);
  clearValidation(newCardForm, validationConfig);
});

// Назначаем обработчики закрытия
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  closeButton.addEventListener("click", () => {
    closeModal(popup);
  });
  popup.addEventListener("click", handleOverlayClick); // Закрытие по клику на оверлей

  //плавное открытие с помощью класса анимации
  //Класс анимации нужно повесить в DOM только один раз при загрузке страницы,
  //либо добавить прямо в html для каждого popup(но в этом случае будет баг с мерцанием)
  popup.classList.add("popup_is-animated");
});

// Назначаем обработчики открытия изменения профиля
profileForm.addEventListener("submit", handleFormProfileSubmit);

// Назначаем обработчики добавления карточки
newCardForm.addEventListener("submit", (evt) => {
  handleAddCardFormSubmit(evt);
});
