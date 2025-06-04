
const cardTemplate = document.getElementById('card-template').content.querySelector('.card');
const placesContainer = document.querySelector('.places__list'); 


function deleteCard(cardElement) {
    cardElement.remove();
};

function addCardToContainer(containerElement, cardElement) {
    containerElement.append(cardElement);
}

function createCard(dataObject, deleteCardCallback) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImg = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardImg.src = dataObject.link;
    cardImg.alt = dataObject.name;
    cardTitle.textContent = dataObject.name;

    cardDeleteButton.addEventListener('click', () => {
        deleteCardCallback(cardElement);
    }) 
   return cardElement; 
}

 initialCards.forEach((cardObj) => {
    const cardNode = createCard(cardObj, deleteCard);
    console.dir(cardNode);
    addCardToContainer(placesContainer, cardNode);
 })


