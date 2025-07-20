import { toggleLike } from "../api";

const cardTemplate = document
  .getElementById("card-template")
  .content.querySelector(".card");


//Основная функция создания карточки
export function createCard(
  dataObject,
  { 
    onDeleteCard, 
    onLikeCard, 
    onOpenView 
  },
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
};

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
};