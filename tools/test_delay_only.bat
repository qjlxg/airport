@echo off
rem 参数定义
set config=https://mirror.ghproxy.com/https://raw.githubusercontent.com/dongchengjie/airport/main/subs/merged/unlimited.yaml
set output=elected.yaml

set repo=https://github.com/dongchengjie/airport
set file=subs/merged/elected.yaml
for /f "usebackq delims=" %%a in ("token") do set "token=%%a"

rem 循环执行
:loop
rem 节点测试
meta_speedtest.exe --config %config% -o %output% --timeout 3000 --delay-filter 2000 --log-level debug

rem 推送到Repo
gfp.exe -r %repo% -f %file% -l ./.meta_speedtest/%output% -t %token%

rem 休眠若干秒
timeout /t 21600 >nul
goto loop