const staticIpList = [
    'cloudflare.cfgo.cc:2053#官方优选',
    'skk.moe:443#官方优选',
    'icook.hk:8443#官方优选',
    'icook.tw:2096#官方优选',
    'cfip.xxxxxxxx.tk:8443#官方优选',
]

function contentToArr(content) {
    const arr = [];
    try {
        const lines = content.split('\n');
        for (let line of lines) {
            const match = line.match(/^([a-zA-Z0-9\-\.]+)(:(\d+))?(#(.+)$)?/);
            if (match) {
                arr.push({ip: match[1], port: match[3] ? parseInt(match[3]) : 8443, remark: match[5] ? match[5] : ''});
            }
        }
    } catch (err) {
        console.log("staticList Error：" + err.toString());
    }
    return arr;
}

async function cmliu() {
    const arr = [];
    try {
        const ct = await fetch("https://addressesapi.090227.xyz/ct", {method: 'GET'}).then(res => res.text());
        const cmcc = await fetch("https://addressesapi.090227.xyz/cmcc", {method: 'GET'}).then(res => res.text());
        return contentToArr(ct + '\n' + cmcc);
    } catch (err) {
        console.log("cloudFlareYes Error：" + err.toString());
    }
    return arr;
}

async function cloudFlareYes() {
    const arr = [];
    try {
        const content = await fetch("https://api.hostmonit.com/get_optimization_ip", {
            method: 'POST', body: "{\"key\":\"iDetkOys\"}"
        }).then(res => res.text());
        let list = JSON.parse(content).info;
        for (let item of list) {
            arr.push({ip: item.ip, port: item.port ? parseInt(item.port) : 443, remark: item.line ? item.line : ''});
        }
    } catch (err) {
        console.log("cloudFlareYes Error：" + err.toString());
    }
    return arr;
}

export default {
    async fetch(request, env, ctx) {
        let arr = [];
        try {
            const url = new URL(request.url);
            const params = new URLSearchParams(url.search);
            // 静态列表
            arr = arr.concat(contentToArr(staticIpList.join('\n')));
            // cmliu
            arr = arr.concat(await cmliu());
            // CloudFlareYes
            arr = arr.concat(await cloudFlareYes());

            // 去重、排序
            arr = arr
                .filter((obj, index, self) => index === self.findIndex(o => o.ip === obj.ip && o.port === obj.port))
                .map((obj) => {
                    obj.remark = obj.remark === 'CM' ? '移动优选' : obj.remark;
                    obj.remark = obj.remark === 'CU' ? '联通优选' : obj.remark;
                    obj.remark = obj.remark === 'CT' ? '电信优选' : obj.remark;
                    obj.remark = obj.remark === 'CMCC' ? '电信优选' : obj.remark;
                    return obj;
                })
                .sort((o1, o2) => {
                    const remarkComparison = o1.remark.localeCompare(o2.remark);
                    if (remarkComparison !== 0) {
                        return remarkComparison;
                    }
                    const ipComparison = o1.ip.localeCompare(o2.ip);
                    if (ipComparison !== 0) {
                        return ipComparison;
                    }
                    return o1.port.localeCompare(o2.port);
                });

            // 返回结果
            return new Response(arr.map((item) => {
                let line = item.ip;
                line += item.port ? ':' + item.port : '8443';
                line += item.remark ? '#' + item.remark : '';
                return line;
            }).join('\n'));
        } catch (e) {
            return new Response(e.toString(), {status: 500});
        }
    },
};