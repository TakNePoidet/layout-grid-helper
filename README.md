# Grid Helper

Впомогательная сетка для верскии


## Установка

```bash
npm install https://github.com/TakNePoidet/grid-helper.git --save-dev
```

или

```bash
yarn add -D https://github.com/TakNePoidet/grid-helper.git
```

## Использование
```js
import GridHelper from 'grid-helper';

const gridHelper = GridHelper({
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
gridHelper.init();
```

## Опции

| Имя  | Описание | Значение по умолчанию  |
| ----- | ------------ | -------- |
| className | Класс блока сетки | grid-helper |
| prefix | Пруфикс переменных | gh |
| mobileFirst | Приоритет мобильной версии | true |
| color | Цвет | rgb(255 0 0 / 0.2) |
| gutter | Отступ между колонками | 16px |
| sides | Отсуп от края экрана | 20px |
| columns | Количево колонок | 4 |
| container | Ширина контейнера | 100% |
| responsible | Медиа запросы | {[breakpoint]:{gutter?,sides?,columns?,container?}} |

## Методы
| Имя  | Описание |
| --  | -- |
| init | Установка сетки |
| show | Показать сетку |
| hide | Скрыть сетку |
| destroy | Удаление сетки |

## Клавиатура

```
CTRL + M - покзать/скрыть сетку 
```
