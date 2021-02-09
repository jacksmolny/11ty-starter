11ty-starter Halo-Lab

Структура:
build - папка с выходными файлами
src - папка с входными файлами
data - папка для json данных
fonts - папка для шрифтов
images - папка для картинок / иконок
favicon - используеться для хранения сгенерированных картинок / иконок для PWA
svg - папка для иконок
includes - папка для подключаемых компонентов / сцен, или комбинировааных файлов шаблонов
js - папка для js файлов
libs - папка для js файлов библиотек
layouts - папка для шаблонов страниц
[pwa.html] - шаблон для страниц c PWA модулями
pages - папка страниц html
scss - папка для scss файлов
libs - папка для css файлов библиотек
video - папка для видео файлов

{% image "src" "class" "alt" "title" %} - шорткод 11ty для подключения оптимизированных картинок
src - обязательно, путь к файлу картинки с указанием формата, указывать относительно папки [src/images/]
[пример]: {% image "image-analysis.png" %} <picture> <img src="src" /> </picture>
class - опциональный, класс для html кода картинки
[пример]: {% image "image-analysis.png" "thumbnail" %} <picture> <img class="class" /> </picture>
alt - опциональный, alt текст для html кода картинки
[пример]: {% image "image-analysis.png" "thumbnail" "it's thumbnail picture" %} <picture> <img alt="alt" /> </picture>
title - опциональный, title текст для html кода картинки
[пример]: {% image "image-analysis.png" "thumbnail" "it's thumbnail picture" "it's thumbnail title" %} <picture> <img title="title" /> </picture>

{% svg "name" %} - шорткод 11ty для подключения оптимизированных иконок
name - обязательно, имя файла без указания формата, указывать относительно папки [src/images/svg]
[пример]: {% svg "arrow-left" %} <svg>...</svg>

favicon.png - картинка которая будет использована для PWA генерациии иконок в папку [src/images/favicon]
manifest.json - обязательно внутри указать название проекта ["name": "It's my project"], в данный файл будут сгенерированы PWA пресеты
sitemap.html - файл для генерации ссылок в sitemap.xml, генерирует ссылки от названия файла в папке [src/pages]

.eleventy.js - файл конфигурации 11ty
Для генерациии правильного sitemap в выходной папке, для плагина sitemap нужно указать хост будущего сайта 88 строка - [hostname: "https://my-site.com"],
