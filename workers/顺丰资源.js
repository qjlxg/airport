export default {
  async fetch(request, env, ctx) {
    // 获取视频列表
    let videos = await fetch('https://www.youtube.com/@SFZY666/videos', {
        "method": "GET"
      })
      .then((res) => res.text());
    // 找到最新视频链接
    const videoId = videos.substr(videos.indexOf('"url":"/watch?v=') + 16, 11);
    console.log('视频ID:' + videoId);
    const videoLink = 'https://www.youtube.com/watch?v=' + videoId;
    // 获取视频信息
    let videoInfo = await fetch(videoLink, {
        "method": "GET"
      })
      .then((res) => res.text());
    videoInfo = videoInfo.substr(videoInfo.indexOf('本期免费节点获取：') + 9);
    // 获取博客链接
    const blogLink = videoInfo.substring(0, videoInfo.indexOf('",'));
    console.log('博客链接:' + blogLink);
    // 获取clash配置文件地址
    let blogInfo = await fetch(blogLink, {
        "method": "GET"
      })
      .then((res) => res.text());
    blogInfo = blogInfo.substr(blogInfo.indexOf('https://drive.google.com/uc?export=download'));
    const configLink = blogInfo.substring(0, blogInfo.indexOf('<br'));
    console.log('配置链接:' + configLink);
    // 获取配置内容
    const content = await fetch(configLink, {
        "method": "GET"
      })
      .then((res) => res.text());
    // 设置响应头
    const headers = {
      // 配置文件名
      'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent("顺丰资源"),
      // 文件自动更新间隔（小时）
      'Profile-Update-Interval': "6",
      // 主页
      'Profile-Web-Page-Url': 'https://www.youtube.com/@SFZY666'
    };
    return new Response(content, {
      headers
    });
  },
};