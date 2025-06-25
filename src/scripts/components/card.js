// описаны функции для работы с карточками: функция создания карточки, функции-обработчики событий удаления и лайка карточки;
// добавление карточек на страницу выполнено перебором массива с данными карточек с помощью цикла. используется метод .forEach или цикл for…of.
const cardTemplate = document.getElementById('card-template').content.querySelector('.card');

//Функция удаления карточки
export function deleteCard(cardElement) {
    cardElement.remove();
};

// Переключает состояние лайка
export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active'); 
};

//Основная функция создания карточки
export function createCard(dataObject, {onDeleteCard, onLikeCard, onOpenView}) {
    const cardElement = cardTemplate.cloneNode(true);  // Клонируем шаблон
    // Получаем элементы карточки
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    // Заполняем данными
    cardImage.src = dataObject.link;
    cardImage.alt = dataObject.name;
    cardTitle.textContent = dataObject.name;
    // Назначаем обработчики событий
    cardDeleteButton.addEventListener('click', () => {
        onDeleteCard(cardElement);
    });

    likeButton.addEventListener('click', () => {
        onLikeCard(likeButton);
    });

    cardImage.addEventListener("click", () => {
    onOpenView(dataObject);
    });

    return cardElement; 
}