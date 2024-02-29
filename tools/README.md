## meta_speedtest.exe

> 节点测速软件，可以对节点进行延迟测速、下载速度测速，并提供对节点重命名

### 实例

```bash
# 通过url指定配置文件、延迟测试超时3秒，超过2秒的排除掉，节点重命名添加"优选"两个字前缀
.\meta_speedtest.exe -c http://www.example.com/clash.yaml -t 3000 --delay-filter 2000 --rename-tag "优选"

# 通过路径指定配置文件、延迟测试超时3秒，进行下载速度测试，下载速度低于1MB/s的排除掉，使用loyalsoldier规则集
.\meta_speedtest.exe -c D:\config.yaml -t 3000 --download --down-filter 8388608 --rule loyalsoldier
```

### 应用参数

| 参数                | 必填 | 默认值                         | 说明                                                         |
| ------------------- | ---- | ------------------------------ | ------------------------------------------------------------ |
| -c, --config        | 是   |                                | clash/节点池配置文件路径（或HTTP链接地址）                   |
| -i, --identifier    | 否   | server_port                    | 节点去重策略<br />server：server相同视为重复<br />server_port：server+port相同视为重复 |
| -t, --timeout       | 否   | 3000                           | 请求超时（ms）                                               |
| -u, --delay-url     | 否   | https://www.google.com/gen_204 | 延迟测试链接                                                 |
| --delay-threads     | 否   | 64                             | 延迟测试线程数                                               |
| -f, --delay-filter  | 否   | 5000                           | 延迟过滤器，延迟大于该值的节点将会被排除                     |
| -d, --download      | 否   | 否                             | 是否测试下载速度                                             |
| --download-duration | 否   | 15000                          | 测试下载时长(ms)                                             |
| -F, --down-filter   | 否   |                                | 下载过滤器，bps低于该值的节点将会被排除                      |
| --use-history       | 否   | 否                             | 是否使用上一次的测试结果数据（一般用于测试后发现不够严格，加大限制再次进行测试，使用上一次的测试结果跳过测试直接筛选） |
| -s, --sort          | 否   | delay                          | 节点排序策略<br />delay：延迟低优先<br />speed：下载速度快优先 |
| --top               | 否   |                                | 保留排序后前若干个结果（默认保留所有过滤后的结果）           |
| --rename            | 否   | 是                             | 是否节点重命名                                               |
| -T, --rename-tag    | 否   |                                | 节点重命名标签                                               |
| -r, --rule          | 否   | acl4ssr                        | 结果配置使用规则集<br />acl4ssr：[acl4ssr](https://github.com/ACL4SSR/ACL4SSR/tree/master)<br />loyalsoldier：[loyalsoldier](https://github.com/Loyalsoldier/clash-rules) |
| -o, --output        | 否   |                                | 输出文件名（默认与测试的配置文件同名）                       |
| --log-level         | 否   | info                           | 日志级别（trace, debug, info, warn, error, fatal）           |
| --pause             | 否   | 否                             | 程序结束时pause                                              |

## gfp.exe

> Github文件推送器，使用http协议调用Restful API实现，无需安装Git

### 实例

```bash
# 将D:\xyz.yaml文件推送到用户username的example仓库下的subs目录下的demo.yaml（如果仓库不存在改文件，则创建新文件）
.\gfp.exe -r https://github.com/username/example -f subs/demo.yaml -l D:\xyz.yaml -t abcdefg

# 作用同上，担心本地无法正常访问Github，使用代理服务器127.0.0.1:1234
.\gfp.exe -r https://github.com/username/example -f subs/demo.yaml -l D:\xyz.yaml -t abcdefg --p -H 127.0.0.1 -P 1234
```

### 应用参数

| 参数             | 必填 | 默认值                              | 说明                                      |
| ---------------- | ---- | ----------------------------------- | ----------------------------------------- |
| -r, --repo       | 是   |                                     | 仓库地址                                  |
| -b, --branch     | 否   | main                                | 代码分支                                  |
| -f, --file       | 是   |                                     | 仓库文件（相对）路径，**文件可以不存在**  |
| -l, --local      | 是   |                                     | 本地文件路径（相对/绝对路径均可）         |
| -t, --token      | 是   |                                     | GitHub API Token（详见下方**创建token**） |
| -m, --message    | 否   | Added/Updated by Github File Pusher | 提交信息                                  |
| -c, --committer  | 否   | Github File Pusher                  | 提交者名称                                |
| -e, --email      | 否   | github@example.com                  | 提交者邮箱                                |
| -p, --proxy      | 否   | 否                                  | 使用代理                                  |
| -H, --proxy-host | 否   | 127.0.0.1                           | 代理服务器                                |
| -P, --proxy-port | 否   | 7890                                | 代理端口                                  |
| -T, --timeout    | 否   | 30000                               | 请求超时（ms）                            |
| --pause          | 否   |                                     | 否程序结束时pause                         |

### 创建token

1. 打开[token设置](https://github.com/settings/tokens)
2. 点击右上角**Generate new token** 按钮，选择**Generate new token (classic)**
3. 为token取名
4. 选择Expiration过期时长，**No expiration**表示永不过期
5. 为token创建相应的权限
   1. 如果是public仓库，勾选**public_repo                    Access public repositories**足矣
   2. 如果是私有仓库，勾选**repo                    Full control of private repositories**
6. 点击底部**Generate token**按钮创建token
