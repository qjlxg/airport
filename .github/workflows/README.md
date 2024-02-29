## 注意事项

1. 使用Workflow需要为机器人**github-actions**授予读写权限，允许其访问仓库。
   1. 打开仓库
   2. 打开**Settings**-->**Actions**-->**General**
   3. 找到**Workflow permissions**选项，勾选**Read and write permissions**
   4. 点击**Save**保存
2. Github Action的Runners服务器集群使用的Azure提供的服务，位于不同的地域，详见[ip-addresses](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners#ip-addresses)。
