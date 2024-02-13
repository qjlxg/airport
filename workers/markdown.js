function toBase54(str) {
  return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(str)));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const target = params.get('target');
    if (target === null) {
      throw new Error('target is null');
    }

    switch (url.pathname) {
      case '/':
      default:
        const pos = params.get('pos') != null ? params.get('pos') : 1;
        let markdown = await fetch(target, {"method": "GET"}).then((res) => res.text());
        markdown = markdown.replaceAll('```\n', '```')
        const arr = markdown.split('```');
        if (arr.length < 3) {
          throw new Error('target is invalid');
        }
        return new Response(toBase54(arr[pos]));
    }

  },
};