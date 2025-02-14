# Описание приложения

### Русский

Это приложение для создания и прохождения тестов. В нем предусмотрены два типа пользователей:

- **Администраторы** — могут создавать, редактировать и удалять тесты и вопросы, а также проходить тесты.
- **Пользователи** — могут только проходить тесты.

## Структура тестов

Тесты содержат три типа вопросов:

1. **Один из списка** — возможность выбрать один правильный вариант из списка.
2. **Несколько из списка** — возможность выбрать несколько правильных вариантов из списка.
3. **Численный ответ** — возможность ввести правильное число.

## Экраны и компоненты

### Экран входа в приложение

Содержит форму ввода логина и пароля для авторизации. После проверки данных пользователя происходит перенаправление на главный экран (список тестов) или выводится ошибка при некорректных данных.

### Модальное окно (общий компонент)

Модальное окно подходит для использования на различных экранах и имеет следующие особенности:

- Заголовок и контентная область.
- Затемняющий фон.
- Закрытие при клике на фон, крестик, нажатии на клавишу ESC или на кнопку "Отмена" (если она есть).
- Центрируется на экране.
- Страница не скроллится при открытом модальном окне.

### Экран создания/редактирования/удаления теста и вопросов

Содержит:

- Поле для ввода названия теста.
- Кнопку "Сохранить" для сохранения вопросов.
- Список созданных вопросов.
- Кнопку для добавления вопроса.
- Dropdown для выбора типа вопроса.
- Кнопку "Удалить" для удаления теста.

Список вопросов отображается на том же экране с кнопками для редактирования и удаления. При редактировании или добавлении вопроса появляется форма ввода с соответствующими полями.

### Вопросы теста

1. **Один из списка:** Форма с инпутами для ввода вопроса и вариантов ответа. Варианты можно перетаскивать (drag and drop). Реализована валидация, запрещающая менее двух вариантов ответа и два правильных варианта.
2. **Несколько из списка:** Форма с инпутами для ввода вопроса и вариантов ответа, которые можно перетаскивать. Также реализована валидация на минимум два варианта.
3. **Численный ответ:** Форма с полем для ввода числового ответа. Реализована валидация, которая запрещает пустое поле для числового ответа.

После сохранения или удаления вопроса появляется модальное окно с подтверждением действия. При создании теста сохраняется дата для последующей сортировки.

### Главный экран (список тестов)

Содержит:

- Список тестов.
- Поле для фильтрации по названию.
- Ссылки на экраны входа и добавления теста.
- Возможность сортировки списка по дате.
- Если пользователь — администратор, то на каждом тесте есть ссылка для редактирования.

Также предусмотрена пагинация для списка тестов.

### Экран прохождения теста

Отображает вопросы и элементы управления для завершения прохождения теста. Вопросы могут быть разных типов (как описано выше).

При завершении теста рассчитывается результат (количество правильных ответов) и выводится модальное окно с результатами.

---

### English

This is an application for creating and taking tests. It has two types of users:

- **Administrators** — can create, edit, and delete tests and questions, as well as take tests.
- **Users** — can only take tests.

## Test structure

Tests consist of three types of questions:

1. **One from the list** — the ability to choose one correct answer from a list.
2. **Multiple from the list** — the ability to select multiple correct answers from a list.
3. **Numeric answer** — the ability to input a correct number.

## Screens and components

### Login screen

Contains a login and password form for authorization. After validating the user’s data, the user is redirected to the main screen (test list) or an error is displayed if the data is incorrect.

### Modal window (common component)

The modal window is suitable for use on various screens and has the following features:

- Title and content area.
- Dimmed background.
- Can be closed by clicking the background, the close button (X), pressing the ESC key, or clicking the "Cancel" button (if available).
- Centered on the screen.
- The page doesn't scroll when the modal window is open.

### Screen for creating/editing/deleting tests and questions

Contains:

- A field for entering the test title.
- A "Save" button for saving the questions.
- A list of created questions.
- A button to add a question.
- A dropdown to choose the question type.
- A "Delete" button to delete the test.

The list of questions is displayed on the same screen with buttons for editing and deleting. When editing or adding a question, a form appears with the relevant fields.

### Test questions

1. **One from the list:** A form with inputs to enter the question and answer options. The options can be dragged and dropped. Validation is implemented to ensure that there are at least two answer options and only one correct answer.
2. **Multiple from the list:** A form with inputs to enter the question and answer options, which can be dragged and dropped. Validation ensures that there are at least two answer options.
3. **Numeric answer:** A form with an input field for entering a numeric answer. Validation prevents the numeric answer field from being empty.

When saving or deleting a question, a modal window with a confirmation prompt appears. The test creation date is saved for later sorting.

### Main screen (test list)

Contains:

- A list of tests.
- A filter field for searching by title.
- Links to the login and test creation screens.
- Sorting options for the list by date.
- If the user is an administrator, there is a link to edit each test.

There is also pagination for the test list.

### Test-taking screen

Displays questions and control elements for finishing the test. Questions can be of different types (as described above).

When finishing the test, the result (number of correct answers) is calculated, and a modal window with the results is shown.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
