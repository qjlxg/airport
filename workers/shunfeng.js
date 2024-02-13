// 响应头
const headers = {
  // 配置文件名
  'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent("⛵顺丰资源"),
  // 文件自动更新间隔（小时）
  'Profile-Update-Interval': "6",
  // 主页
  'Profile-Web-Page-Url': 'https://www.youtube.com/@SFZY666',
  // 订阅者信息
  'Subscription-Userinfo': 'upload=0; download=0; total=1098412116148224; expire=0'
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
      // 获取视频列表
      let videos = await fetch('https://www.youtube.com/@SFZY666/videos', {"method": "GET"}).then((res) => res.text());
      if(videos.indexOf('Our systems have detected unusual traffic from your computer network') > -1) {
        throw new Error('请求被拦截');
      }
      // 找到最新视频链接
      const videoId = videos.substr(videos.indexOf('"url":"/watch?v=') + 16, 11);
      if (videoId.length != 11) {
        throw new Error('获取视频链接失败');
      }
      console.log('视频ID:' + videoId);

      // 获取视频信息
      const videoLink = 'https://www.youtube.com/watch?v=' + videoId;
      let videoInfo = await fetch(videoLink, {"method": "GET"}).then((res) => res.text());

      // 获取博客链接
      videoInfo = videoInfo.substr(videoInfo.indexOf('本期免费节点获取：') + 9);
      const blogLink = videoInfo.substring(0, videoInfo.indexOf('",'));
      if (!blogLink.startsWith('http')) {
        throw new Error('获取博客链接失败');
      }
      console.log('博客链接:' + blogLink);

      // 获取clash配置文件地址
      let blogInfo = await fetch(blogLink, {"method": "GET"}).then((res) => res.text());
      blogInfo = blogInfo.substr(blogInfo.indexOf('https://drive.google.com/uc?export=download'));
      const configLink = blogInfo.substring(0, blogInfo.indexOf('<br'));
      if (!configLink.startsWith('http')) {
        throw new Error('获取配置文件链接失败');
      }
      console.log('配置文件链接:' + configLink);

      // 获取配置内容
      const content = await fetch(configLink, {"method": "GET"}).then((res) => res.text());

      // 记录最后一次请求内容、请求时间
      lastContent = content;
      lastRequest = Date.now();

      // 返回配置内容
      return new Response(content, {headers});
    } catch (error) {
      if (lastContent == null) {
        return new Response(error, {status: 500});
      } else {
        return new Response(lastContent, {headers});
      }
    }
  },
};