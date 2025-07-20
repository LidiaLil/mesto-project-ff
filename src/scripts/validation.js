// Функция, которая показывает класс с ошибкой
const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  //// добавляю элементу input класс ошибки popup__input_type_error
  inputElement.classList.add(validationConfig.inputErrorClass); 
  // Заменим содержимое span с ошибкой на переданный параметр
  errorElement.textContent = errorMessage;
  //  Этот класс сделает ошибку видимой, когда в поле ввода добавят некорректный текст.
  errorElement.classList.add(validationConfig.errorClass);
};


// Функция, которая удаляет класс с ошибкой
const hideInputError = (
  formElement, 
  inputElement, 
  validationConfig
) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass); // удаляю класс ошибки с элемента input
  // Скрываем сообщение об ошибке
  errorElement.classList.remove(validationConfig.errorClass);
  // Очистим ошибку
  errorElement.textContent = "";
};

//Функция hasInvalidInput только проверяет наличие невалидного поля и сигнализирует,
// можно ли разблокировать кнопку сабмита. Но она ничего не делает с самой кнопкой «Отправить».
const hasInvalidInput = (inputList) => {
  // проходим по этому массиву методом some
  return inputList.some(inputElement => {
    // Если поле не валидно, Обход массива прекратится и колбэк вернёт true
    return !inputElement.validity.valid;
  });
};



//функция toggleButtonState отключает и включает кнопку.
// принимает массив полей ввода и элемент кнопки, состояние которой нужно менять
const toggleButtonState = (
  inputList, 
  buttonElement, 
  validationConfig
) => {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // делаю кнопку неактивной
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    // иначе делаю кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

// isValid — проверяет валидность поля, внутри вызывает showInputError или hideInputError.
const isValid = (
  formElement, 
  inputElement, 
  validationConfig
) => {
  if (inputElement.validity.patternMismatch) {
        // данные атрибута доступны у элемента инпута через ключевое слово dataset.
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    // если передать пустую строку, то будут доступны
    // стандартные браузерные сообщения
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    // Если поле не проходит валидацию, покажем ошибку
    // Передадим параметром форму, в которой находится проверяемое поле, само это поле и сообщение об ошибке
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } 
  else {
    // Если проходит, скроем
    hideInputError(
      formElement, 
      inputElement, 
      validationConfig
    );
  }
};

// Добавление обработчиков всем полям формы
const setEventListeners = (
  formElement, 
  validationConfig
) => {
  // Найдём все поля формы и сделаем из них массив методом Array.from
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  // Найдём в текущей форме кнопку отправки
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  // Вызовем toggleButtonState, чтобы заблокировать кнопку до ввода данных в поля
  toggleButtonState(inputList, buttonElement, validationConfig);
  // Обойдём все элементы полученной коллекции
  inputList.forEach((inputElement) => {
    // каждому полю добавим обработчик события input
    inputElement.addEventListener("input", () => {
      // Внутри колбэка вызовем isValid,
      // передав ей форму и проверяемый элемент
      isValid(formElement, inputElement, validationConfig);
      // Вызовем toggleButtonState и передадим ей массив полей и кнопку
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

//Добавление обработчиков всем формам
export const enableValidation = (validationConfig) => {
  // Найдём все формы с указанным классом в DOM,
  // сделаем из них массив методом Array.from
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  // Переберём полученную коллекцию
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы
    setEventListeners(formElement, validationConfig);
  });
};

// очистка ошибок валидации
export const clearValidation = (
  formElement, 
  validationConfig
) => {
  // Найдём все поля формы и сделаем из них массив методом Array.from
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  // Обойдём все элементы полученной коллекции
  inputList.forEach((inputElement) => {
    // удаляю класс с ошибкой
    // Если поле не проходит валидацию, покажем ошибку, если проходит-скроет
    hideInputError(formElement, inputElement, validationConfig);
    // если передать пустую строку, то будут доступны, стандартные браузерные сообщения
    inputElement.setCustomValidity(""); 
  });
  
  // Найдём в этой форме профиля кнопку отправки
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  // делаю кнопку неактивной
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
};


