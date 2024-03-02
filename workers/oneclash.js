// 响应头
const headers = {
    // 配置文件名
    'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent("😺oneClash"),
    // 文件自动更新间隔（小时）
    'Profile-Update-Interval': "6",
    // 主页
    'Profile-Web-Page-Url': 'https://oneclash.cc/',
    // 订阅者信息
    'Subscription-Userinfo': ''
};

var lastContent = null;
var lastRequest = 0;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 避免频繁请求
        const force = url.pathname === '/force';
        if (!force && Date.now() - lastRequest <= 6 * 3600 * 1000 && lastContent != null) {
            lastRequest = Date.now();
            return new Response(lastContent, {headers});
        }

        try {
            // 获取当前日期
            const currentDate = new Date();
            // 年份
            const year = currentDate.getFullYear();
            // 月份
            const month = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
            // 日期
            const date = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();

            // 获取clash配置文件地址
            let configLink = "https://node.oneclash.cc/" + year + "/" + month + "/" + year + month + date + ".yaml"
            console.log('配置文件链接:' + configLink);

            // 获取配置内容
            let content = null;
            await fetch(configLink, {"method": "GET"}).then((res) => {
                if (res.ok) {
                    content = res.text();
                    // 记录最后一次请求内容、请求时间
                    lastContent = content;
                    lastRequest = Date.now();
                }
            });

            // 返回配置内容
            return new Response(lastContent, {headers});
        } catch (error) {
            if (lastContent == null) {
                return new Response(error, {status: 500});
            } else {
                return new Response(lastContent, {headers});
            }
        }
    },
};