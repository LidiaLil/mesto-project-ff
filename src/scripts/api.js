// 1. Перед стартом. Необходимая информация
//При каждом запросе нужно передавать токен и идентификатор группы
// базовый адрес сервера и ключ авторизации вынесены отдельно и переиспользуются;
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-42",
  headers: {
    authorization: "37615660-70b8-4471-9655-1dc0a18b5dfc",
    "Content-Type": "application/json",
  },
};
//2. Перед стартом. Как сделать запрос к серверу
// функция выполняет проверку HTTP-ответа от сервера
const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

//3. Загрузка информации о пользователе с сервера
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(checkResponse);
};

//4. Загрузка карточек с сервера
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkResponse);
};

//5. Редактирование профиля
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(checkResponse);
};

//6. Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then(checkResponse);
};

// 7. Отображение количества лайков карточки и 9. Постановка и снятие лайка
export const toggleLike = (cardId, isLiked) => {
  const endpoint = `${config.baseUrl}/cards/likes/${cardId}`;
  const fetchOptions = {
    headers: config.headers,
    method: isLiked ? "DELETE" : "PUT", // Если лайк на момент клика есть, значит будем снимать и наоборот :)
  };
  return fetch(endpoint, fetchOptions).then(checkResponse);
};

// 8. Удаление карточки
export const removeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
};

// 10. Обновление аватара пользователя
export const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
  }).then(checkResponse);
};
