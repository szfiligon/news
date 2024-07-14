module.exports = {
    spider: {
        cls: {
            source: 'cls',
            fullname: '财联社新闻',
            request: {
                url: 'https://www.cls.cn/telegraph',
                method: 'GET',
                headers: {
                    'User-Agent': 'request'
                }
            },
            column: {
                title: {
                    css: '#__next > div > div.m-auto.w-1200 > div.clearfix.content-main-box > div.f-l.content-left > div:nth-child(2) > div:nth-child({index}) > div > div.clearfix.m-b-15.f-s-16.telegraph-content-box > div > span.c-34304b > div > strong',
                },
                content: {
                    css: '#__next > div > div.m-auto.w-1200 > div.clearfix.content-main-box > div.f-l.content-left > div:nth-child(2) > div:nth-child({index}) > div > div.clearfix.m-b-15.f-s-16.telegraph-content-box > div > span.c-34304b > div',
                },
                link: {
                    css: '#newslist > a:nth-child({index})',
                    attr: 'href'
                }
            }
        },
        dycj: {
            source: 'dycj',
            fullname: '第一财经新闻',
            baseurl: 'https://www.yicai.com',
            request: {
                url: 'https://www.yicai.com/news/info/',
                method: 'GET',
                headers: {
                    'User-Agent': 'request'
                }
            },
            column: {
                title: {
                    css: '#newslist > a:nth-child({index}) > div > div > h2',
                },
                link: {
                    css: '#newslist > a:nth-child({index})',
                    attr: 'href'
                }
            }
        },
        qszg: {
            source: 'qszg',
            dynamic: true,
            fullname: '券商中国',
            baseurl: '',
            request: {
                url: 'https://t.10jqka.com.cn/circle/90980/',
                method: 'GET',
                headers: {
                    'User-Agent': 'request'
                }
            },
            column: {
                title: {
                    css: 'body > div.main-wrap > div.main.clearfix > div.theme-main-right > div.main-right > div.tab-change.list-content.postlist-content > ul > li:nth-child({index}) > a > div.post-title',
                },
                content: {
                    css: 'body > div.main-wrap > div.main.clearfix > div.theme-main-right > div.main-right > div.tab-change.list-content.postlist-content > ul > li:nth-child({index}) > a > div.post-content'
                },
                link: {
                    css: 'body > div.main-wrap > div.main.clearfix > div.theme-main-right > div.main-right > div.tab-change.list-content.postlist-content > ul > li:nth-child({index}) > a',
                    attr: 'href'
                }
            }
        },
    }
};
