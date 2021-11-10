const path = require('path')
const fs = require('fs')
// 读取除了README.md 和 tempalte.md的md文件
function readDirectory(relative) {
    const absolutePath = path.resolve(__dirname, relative);
    const files = fs.readdirSync(absolutePath);
    return files.filter(name => !/(^\.)|(README\.md)|(template\.md)/.test(name));
}

function genSidebar(nav, root = "../../docs") {
    const sidebar = {}
    nav.forEach(i => {
        if (i.items && i.items.length != 0) {
            const subnav = i.items;
            subnav.forEach(j => {
                const relative = root + j.link.slice(0, -1);
                sidebar[j.link] = readDirectory(relative).map(k => k.slice(0, -3));
                sidebar[j.link].unshift('');
            })
        } else {
            if (i.link != '/' && i.link[0] === '/') {
                const relative = root + i.link.slice(0, -1);
                sidebar[i.link] = readDirectory(relative).map(j => j.slice(0, -3));
                sidebar[i.link].unshift('');
            }
        }
    })
    sidebar['/'] = [""]
    console.log(sidebar);
    return sidebar;
}

const nav = [
    // NavbarItem
    {
        text: "首页",
        link: "/",
    },
    // {
    //     text: "生活",
    //     link: "/life/",
    // },
    {
        text: "技术",
        // link: "/technology/",
        items: [
            {
                text: "HTMLCSS",
                link: "/technology/html-css/",
            },
            {
                text: "JavaScript",
                link: "/technology/javascript/",
            },
            {
                text: "Webpack",
                link: "/technology/webpack/",
            },
            {
                text: "Vue",
                link: "/technology/vue/",
            },
            {
                text: "Node",
                link: "/technology/node/",
            },
            {
                text: "计算机网络",
                link: "/technology/computer-network/",
            },
            {
                text: "拓展知识",
                link: "/technology/extension/",
            },
            {
                text: "踩坑日记",
                link: "/technology/bug/",
            },
        ],
    },
    {
        text: "Github",
        link: "https://github.com/wzp-coding/blog-press",
        target: "_blank",
    },
    {
        text: "掘金",
        link: "https://juejin.cn/user/1521379825951864",
        target: "_blank",
    },
]

module.exports = { genSidebar, nav }