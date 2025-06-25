// описаны функции для работы с модальными окнами: 
const popupOpendClass = "popup_is-opened";

// Универсальная функция открытия модального окна (попапа)
export function openModal(popupElement) {
  // Добавляем обработчик закрытия по Esc
  document.addEventListener("keydown", handleEscape);
  // Добавляем класс для анимации
  popupElement.classList.add("popup_is-animated");
  // Добавление класса видимости с задержкой мс
  setTimeout(()=>{
  popupElement.classList.add(popupOpendClass)
  },10);
}

// функция закрытия модального окна (попапа)
export function closeModal(popupElement) {
  popupElement.classList.remove(popupOpendClass);
  // Удаляем обработчики закрытия
  document.removeEventListener("keydown", handleEscape);
}

// функция-обработчик события нажатия Esc 
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(`.${popupOpendClass}`);
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Обработчик закрытия по клику на оверлей
export function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}