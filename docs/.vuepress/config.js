module.exports = {
    lang: "zh-CN",
    title: "打工人上人",
    description: "这是我的第一个 VuePress 站点",
    base: "/",

    themeConfig: {
        displayAllHeaders: true,
        logo: "/images/logo.jpg",
        nav: [
            // NavbarItem
            {
                text: "概述",
                link: "/"
            },
            {
                text: "生活",
                link: "/life/"
            },
            {
                text: "技术",
                // prefix: "/technology/",
                items: [
                    {
                        text: "HTML-CSS",
                        link: "/technology/html-css/"
                    },
                    {
                        text: "JavaScript",
                        link: "/technology/javascript/"
                    },
                    {
                        text: "Webpack",
                        link: "/technology/webpack/"
                    },
                    {
                        text: "计算机网络",
                        link: "/technology/computer-network/"
                    },
                    {
                        text: "踩坑日记",
                        link: "/technology/bug/"
                    },
                ]
            },
            {
                text: "Github",
                link: "https://github.com/wzp-coding/wzp-coding.github.com",
                target: "_blank"
            }
        ],
        sidebar: {
            "/technology/html-css/":['','one','two','three'],
            "/technology/javascript/":['','one','two'],
            "/technology/webpack/":['','one'],
            "/technology/computer-network/":['','one'],
            "/technology/bug/":['','vuepress踩坑','git踩坑'],
            "/life/": ["", "one"],
            "/": [""]
        }

    },

    markdown: {
        lineNumbers: true
    },

    plugins: ["@vuepress/blog", "@vuepress/back-to-top"]
}