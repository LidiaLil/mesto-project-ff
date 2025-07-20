// описаны функции для работы с карточками: функция создания карточки, функции-обработчики событий удаления и лайка карточки;
// добавление карточек на страницу выполнено перебором массива с данными карточек с помощью цикла. используется метод .forEach или цикл for…of.
import { toggleLike, removeCard } from "../api";
import { openModal, closeModal } from "./modal";

const cardTemplate = document
  .getElementById("card-template")
  .content.querySelector(".card");

//Функция удаления карточки
export function deleteCard(cardElement, cardId) {
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
}

// Функция переключения лайка
export function likeCard(likeButton, cardId, isLiked, likeCounter) {
  // вызов API для обновления лайка на сервере
  toggleLike(cardId, isLiked)
    .then((updatedCard) => {
      // обновление состояния лайков
      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((error) => console.log(`Не удалось поставить лайк: ${error}`));
}

//Основная функция создания карточки
export function createCard(
  dataObject,
  { onDeleteCard, onLikeCard, onOpenView },
  userId
) {
  const cardElement = cardTemplate.cloneNode(true); // Клонируем шаблон
  // Получаем элементы карточки
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter"); // Добавляем счетчик лайков
  // Заполняем данными
  cardImage.src = dataObject.link;
  cardImage.alt = `Фотография ${dataObject.name}`; // Улучшенный alt
  cardTitle.textContent = dataObject.name;
  likeCounter.textContent = dataObject.likes.length || ""; //покажет кол-во лайков или, если их нет, то пустую строку

  // видимость кнопки удаления
  if (dataObject.owner._id !== userId) {
    cardDeleteButton.style.display = "none"; // Скрываю кнопку, если пользователь не == владелец
  }

  // обновление состояния лайков
  const isLiked = dataObject.likes.some((like) => like._id === userId);
  likeButton.classList.toggle("card__like-button_is-active", isLiked);

  // Назначаем обработчики событий
  cardDeleteButton.addEventListener("click", () => {
    onDeleteCard(cardElement, dataObject._id); // Передаю ID карточки
  });

  likeButton.addEventListener("click", () => {
    const currentIsLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    onLikeCard(likeButton, dataObject._id, currentIsLiked, likeCounter);
  });

  cardImage.addEventListener("click", () => {
    onOpenView(dataObject);
  });

  return cardElement;
}
