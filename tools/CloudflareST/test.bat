@echo off
.\CloudflareST.exe -n 200 -t 10 -dn 50 -tl 200 -p 0 -o result.csv
setlocal enabledelayedexpansion
set skip_line=0
for /f "usebackq tokens=*" %%a in ("result.csv") do (
  if !skip_line! neq 0 (for /f "tokens=1 delims=," %%b in ("%%a") do (echo %%b>> cloudflare_official.txt))
  set /a "skip_line+=1"
)