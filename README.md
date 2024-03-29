# Layout grid helper

Направляющие верстки

![alt text](screenshots.png 'Пример работы плагина')

## Установка

```
```bash
# Using pnpm
pnpm add -D layout-grid-helper

# Using yarn
yarn add --dev layout-grid-helper

# Using npm
npm install --save-dev layout-grid-helper
```

## Использование

```js
import LayoutGridHelper from 'layout-grid-helper';

const gridHelper = new LayoutGridHelper({
	prefix: 'gh',
	sides: '16px',
	gutter: '16px',
	columns: 2,
	responsible: {
		640: {
			gutter: '20px',
			container: '620px',
			sides: '0px',
			columns: 4
		},
		960: {
			container: '940px',
			columns: 9
		},
		1600: {
			container: '1580px',
			columns: 10
		}
	}
});
```

## Опции

| Имя         | Описание                   | Значение по умолчанию                               |
|-------------|----------------------------|-----------------------------------------------------|
| className   | Класс блока сетки          | layout-grid-helper                                  |
| prefix      | Префикс переменных         | gh                                                  |
| mobileFirst | Приоритет мобильной версии | true                                                |
| color       | Цвет                       | rgb(255 0 0 / 0.2)                                  |
| gutter      | Отступ между колонками     | 16px                                                |
| sides       | Отступ от края экрана      | 20px                                                |
| columns     | Количество колонок         | 4                                                   |
| container   | Ширина контейнера          | 100%                                                |
| responsible | Медиа запросы              | {[breakpoint]:{gutter?,sides?,columns?,container?}} |

## Методы

| Имя     | Описание       |
|---------|----------------|
| show    | Показать сетку |
| hide    | Скрыть сетку   |
| destroy | Удаление сетки |

## Клавиатура

```
CTRL + M - покзать/скрыть сетку
```

## Благодарность

Библиотека сделана на основе [видео](https://youtu.be/WBrngvT78gw) Вадима Макеева
