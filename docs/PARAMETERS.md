# Параметры учёта (справочник)

Перечень параметров учёта гражданина в системе ИРС. Модель расширяемая: карточка объединяет
основные сведения и связанные таблицы; архитектура рассчитана на масштаб 150+ параметров и до
20 связанных таблиц. Ниже — реализованный набор.

## Основные сведения
| Параметр | Поле | Тип | Примечание |
| --- | --- | --- | --- |
| Внутренний ID | id | number | |
| Рег. номер | registryCode | string | REG-2026-00001 |
| Фамилия | lastName | string | |
| Имя | firstName | string | |
| Отчество | middleName | string | |
| Дата рождения | birthDate | date | |
| Пол | gender | enum | Мужской/Женский |
| Статус | status | enum | Активен/Архивирован |
| Регион | region | справочник | |

## Личные данные
| Место рождения | birthPlace | string | |
| Гражданство | citizenship | справочник | |
| Семейное положение | maritalStatus | enum | |
| Детей | childrenCount | number | |
| СНИЛС | snils | маска | 123-456-789 00 |
| ИНН | inn | 12 цифр | |

## Паспорт
| Серия | passportSeries | 4 цифры | |
| Номер | passportNumber | 6 цифр | |
| Кем выдан | passportIssuedBy | string | |
| Дата выдачи | passportIssueDate | date | |
| Код подразделения | passportDivisionCode | 000-000 | |

## Контакты
| Телефон | phone | маска | |
| Доп. телефон | secondaryPhone | маска | |
| Email | email | email | |
| Предпочтительный канал | preferredContact | enum | |

## Адрес регистрации
| Город | regCity | string | |
| Улица | regStreet | string | |
| Дом | regHouse | string | |
| Квартира | regApartment | string | |
| Индекс | regPostalCode | 6 цифр | |
| Факт. адрес совпадает | actualSameAsReg | boolean | |
| Фактический адрес | actualAddress | string | |

## Социальный статус
| Занятость | employmentStatus | enum | |
| Среднемесячный доход | averageIncome | number | ₽ |
| Инвалидность | disabilityGroup | enum | нет/I/II/III |
| Категории льгот | benefitCategories | список (мультивыбор) | |
| Пенсионер | isPensioner | boolean | |
| Ветеран | isVeteran | boolean | |
| Многодетная семья | isLargeFamily | boolean | |
| Примечание | notes | text | |

## Связанные таблицы
| Таблица | Поле | Ключевые колонки |
| --- | --- | --- |
| Семья | family | родство, ФИО, дата рождения |
| Образование | education | учреждение, степень, годы |
| Занятость | employment | организация, должность, период |
| Жильё | housing | адрес, тип, площадь, форма собственности |
| Документы | documents | тип, серия/номер, кем выдан, срок |
| Льготы | benefits | вид, основание, дата, статус, сумма |
| Обращения | appeals | источник, категория, статус, ответственный, срок |
