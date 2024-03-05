function toBase64(str) {
    return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(str)));
}

function getParam(params, paramName, defaultVal) {
    const val = params.get(paramName);
    if (val == null && defaultVal == null) {
        throw new Error(paramName + ' is null');
    }
    return val != null ? val : defaultVal;
}

export default {
    async fetch(request, env, ctx) {
        try {
            const url = new URL(request.url);
            const params = new URLSearchParams(url.search);
            switch (url.pathname) {
                case '/':
                case '/base64':
                    const t1 = getParam(params, 'target');
                    let c1 = await fetch(t1, {"method": "GET"}).then((res) => res.text());
                    return new Response(toBase64(c1));
                case '/markdown':
                    const t2 = getParam(params, 'target');
                    let c2 = await fetch(t2, {"method": "GET"}).then((res) => res.text());
                    const pos = getParam(params, 'pos', 1);
                    c2 = c2.replaceAll('```\n', '```')
                    const arr = c2.split('```');
                    if (arr.length < 3) {
                        throw new Error('invalid markdown content');
                    }
                    return new Response(toBase64(arr[pos]));
            }
        } catch (e) {
            return new Response(e.toString(), {status: 500});
        }
    },
};