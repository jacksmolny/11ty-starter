const htmlmin = require("html-minifier");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const svg = require("@jamshop/eleventy-plugin-svg");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

const getImageFormatFromSrc = (src) => {
  const format = path.extname(src).split(".")[1];

  switch (format) {
    case "jpeg":
    case "jpg":
      return ["jpeg", "webp"];
    case "webp":
      return ["webp"];
    case "png":
      return ["png", "webp"];
  }
}

const getImageShortcode = (src, cs, alt, title) => {
  const source = path.join(__dirname, "src/images/" , src);
  const format = getImageFormatFromSrc(src);
  const options = {
    widths: [null],
    formats: format,
    outputDir: "./build/images/",
    urlPath: "./images/",
    sharpOptions: {
      quality: 80,
      progressive: true
    },
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
  
      return `${name}.${format}`;
    }
  };
  const image_attributs = {
    class: cs || "",
    alt: alt || "",
    title: title || "",
    loading: "lazy",
    decoding: "async",
    whitespaceMode: "inline"
  };
  const metadata = Image.statsSync(source, options);

  Image(source, options);

  return Image.generateHTML(metadata, image_attributs);
}

module.exports = function(config) {
  config.addNunjucksShortcode("image", getImageShortcode);

  config.addPlugin(svg, { input: "src/images/svg" });
  config.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://11ty-starter.com",
    },
  });

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

  config.setWatchThrottleWaitTime(100);
  
  config.addPassthroughCopy({ "src/scss/libs": "css/lib" });
  config.addPassthroughCopy({ "src/js/libs": "js/lib" });
  config.addPassthroughCopy( "src/manifest.json" );
  config.addPassthroughCopy( "src/browserconfig.xml" );
  config.addPassthroughCopy({ "src/images/favicon": "images/favicon" });
  config.addPassthroughCopy({ "src/fonts": "fonts" });
  config.addPassthroughCopy({ "src/video": "video" });

  config.addWatchTarget("src/pages/");
  config.addWatchTarget("src/templates/");
  config.addWatchTarget("src/scss/**/*.scss");
  config.addWatchTarget("src/js/**/*.js");

  return {
    dir: {
      input: "src",
      output: "build",
      includes: "templates",
      data: "../data",
    },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
};