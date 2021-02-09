const htmlmin = require("html-minifier");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const svg = require("@jamshop/eleventy-plugin-svg");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

/**
 * Получаем формат / форматы картинки для функции getImageShortcode
 * @param {string} src
 */
const getImageFormatFromSrc = (src) => {
  const format = path.extname(src).split(".")[1];

  switch (format) {
    case "jpeg":
    case "jpg":
      return ["jpeg", "webp"];
    case "webp":
      return ["webp"];
    case "avif":
      return ["avif"];
    case "png":
      return ["png", "webp"];
  }
};

/**
 * Получаем html сгенерированную строку для подключения с помощью 11ty-shortcode
 * @param {string} src
 * @param {string} className
 * @param {string} alt
 * @param {string} title
 */
const getImageShortcode = (src, className = "", alt = "", title = "") => {
  const source = path.join(__dirname, "src/images/", src);
  const format = getImageFormatFromSrc(src);
  const options = {
    widths: [null],
    formats: format,
    outputDir: "./build/images/",
    urlPath: "./images/",
    sharpPngOptions: {
      quality: 100,
      progressive: true,
    },
    sharpJpegOptions: {
      quality: 100,
      progressive: true,
    },
    sharpWebpOptions: {
      quality: 100,
      progressive: true,
    },
    sharpAvifOptions: {
      quality: 100,
      progressive: true,
    },
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);

      return `${name}.${format}`;
    },
  };
  const image_attributs = {
    class: className,
    alt: alt,
    title: title,
    loading: "lazy",
    decoding: "async",
    whitespaceMode: "inline",
  };
  const metadata = Image.statsSync(source, options);

  Image(source, options);

  return Image.generateHTML(metadata, image_attributs);
};

module.exports = function (config) {
  // Определяем имя [image / svg / sitemap] для дальнейшего использования в 11ty-shortcode
  config.addNunjucksShortcode("image", getImageShortcode);
  // Добавляем плагин для генерации инлайновых / оптимизированных svg с помощью 11ty-shortcode
  config.addPlugin(svg, { input: "src/images/svg" });
  // Добавляем плагин для генерации sitemap в выходной папке. Обязательно указываем hostname для генерации правильных url в файле sitemap.html
  config.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://localhost:3000",
    },
  });
  // Оптимизация выходных html файлов в raw вид
  config.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }

    return content;
  });
  // Добавляем 100мс задержки при работе 11ty-watch, нужно что-бы при частых обновлениях кода не выбило call-stack-count ошибку
  config.setWatchThrottleWaitTime(100);
  // Определяем папки / пути для копирования в выходную папку build
  config.addPassthroughCopy({ "src/scss/libs": "css/lib" }); // CSS - библиотеки используемые для разработки
  config.addPassthroughCopy({ "src/js/libs": "js/lib" }); // JS - библиотеки используемые для разработки
  config.addPassthroughCopy("src/manifest.json"); // Файл manifest нужен для PWA рейтинга
  config.addPassthroughCopy({ "src/images/favicon": "images/favicon" }); // Favicon - папка в которую генерируются иконки для PWA рейтинга
  config.addPassthroughCopy({ "src/fonts": "fonts" }); // Fonts - папка с шрийтами используемыми для разработки
  config.addPassthroughCopy({ "src/video": "video" }); // Video - папка с видео используемыми для разработки
  // Определяем папки [pages / includes / layouts / data / scss / js] для 11ty-watch наблюдения
  config.addWatchTarget("src/pages/");
  config.addWatchTarget("src/includes/");
  config.addWatchTarget("src/layouts/");
  config.addWatchTarget("src/data/");
  config.addWatchTarget("src/scss/**/*.scss");
  config.addWatchTarget("src/js/**/*.js");

  return {
    dir: {
      input: "src", // Папка входного каталога
      output: "build", // Папка выходного каталога
      includes: "includes", // Папка подключаемых в разработке компонентов
      layouts: "layouts", // Папка подключаемых в разработке теплейтов
      data: "data", // Папка подключаемых в разработке json файлов с данными
    },
    htmlTemplateEngine: "njk", // Определяем ядро обработчика для темплейтов / компонентов
    templateFormats: ["html", "njk"], // Определяем формат файлов используемых темплейтов
  };
};
