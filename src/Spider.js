const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const sequelize = require("./database");
const { News } = require("./model");

class NewsModel {
  // method findOne
  async findOne(hashcode) {
    if (!hashcode) {
      console.log("[News][Download]Hashcode is empty");
      return true;
    }

    try {
      await sequelize.authenticate();
      console.log("[News][Download]Finding data with hashcode:", hashcode); // Add log here
      const data = await News.findOne({ where: { hashcode } });
      return data;
    } catch (error) {
      console.error("[News][Download]Error finding data:", error); // Add error log here
    }
  }

  // method insert
  async insert(data) {
    try {
      await sequelize.authenticate();
      console.log("[News][Download]Inserting data:", data); // Add log here
      await News.create(data);
    } catch (error) {
      console.error("[News][Download]Error inserting data:", error); // Add error log here
    }
  }
}
class Spider {
  // constructor with a param config
  constructor(config) {
    this.config = config;
  }

  hashcode(str) {
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  // download web page by puppeteer, mock a browser to download
  async downloadPageByPuppeteer() {
    const { url } = this.config.request;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    await browser.close();
    return html;
  }

  // download web page by axios
  async downloadPageByAxios() {
    const response = await axios.request(this.config.request);
    return response.data;
  }

  // use dynamic param to determine which download method to use, return a html content
  async downloadPage() {
    const { dynamic } = this.config;
    const { url } = this.config.request;
    if (dynamic) {
      console.log("[News][Download]Using Puppeteer to download page:", url);
      return await this.downloadPageByPuppeteer(url);
    } else {
      console.log("[News][Download]Using Axios to download page:", url);
      const response = await this.downloadPageByAxios(url);
      return response;
    }
  }

  // parse html content by cheerio, and use the config to get the data
  parseHtml(html) {
    const { column } = this.config;
    const $ = cheerio.load(html);
    const ret = [];
    for (let i = 1; i <= 10; i++) {
      let data = {};
      for (let key of Object.keys(column)) {
        let ele = column[key];
        let selector = ele.css.replace("{index}", i);
        let value = ele.attr
          ? $(selector).first().attr(ele.attr)
          : $(selector).first().text();
        if (value) {
          data[key] = value.trim();
        }
      }

      // add data to ret
      ret.push(data);
    }

    return ret;
  }

  // make a function to execute the data from parseHtml, every element in the return array need add column datetime, source, hashcode, fullname
  async run() {
    const html = await this.downloadPage();
    const data = this.parseHtml(html);
    const entities = [];

    for (let d of data) {
      d.datetime = new Date().toString();
      d.source = this.config.source;
      d.fullname = this.config.fullname;
      d.hashcode = this.hashcode(`${d.title || ""}${d.content || ""}`);
      if (d.link) {
        d.link = this.config.baseurl + d.link;
      }
      console.log("[News][Download]Data:", d); // Add log here
      const entity = {
        title: d.title,
        content: d.content,
        fullname: d.fullname,
        link: d.link,
        hashcode: d.hashcode,
        source: d.source,
        datetime: d.datetime,
      };

      // filter when the title or content is empty, entities not push the element, and log it
      if (!entity.title && !entity.content) {
        console.log("[News][Download]Skipping empty title or content:", d);
        continue
      }

      entities.push(entity);
    }

    this.saveData(entities);
  }

  // make a function, to save the data to the database and prevent duplicate data by the hashcode
  async saveData(data) {
    const newsModel = new NewsModel();
    for (let d of data) {
      if (await newsModel.findOne(d.hashcode)) {
        console.log("[News][Download]Data already exists:", d.hashcode);
        continue;
      }
      await newsModel.insert(d);
    }
  }
}

// test
const cls = {
  source: "cls",
  fullname: "财联社新闻",
  request: {
    url: "https://www.cls.cn/telegraph",
    method: "GET",
    headers: {
      "User-Agent": "request",
    },
  },
  column: {
    title: {
      css: "#__next > div > div.m-auto.w-1200 > div.clearfix.content-main-box > div.f-l.content-left > div:nth-child(2) > div:nth-child({index}) > div > div.clearfix.m-b-15.f-s-16.telegraph-content-box > div > span.c-34304b > div > strong",
    },
    content: {
      css: "#__next > div > div.m-auto.w-1200 > div.clearfix.content-main-box > div.f-l.content-left > div:nth-child(2) > div:nth-child({index}) > div > div.clearfix.m-b-15.f-s-16.telegraph-content-box > div > span.c-34304b > div",
    },
    link: {
      css: "#newslist > a:nth-child({index})",
      attr: "href",
    },
  },
};
new Spider(cls).run();
