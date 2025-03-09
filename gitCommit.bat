set /p gitComent="Please enter your comment: "
for /f %%i in ('git symbolic-ref --short HEAD') do set currentBranch=%%i
for /f "tokens=1,2 delims=-" %%a in ("%currentBranch%") do set taskName=%%a-%%b
echo "%taskName%: %gitComent%"
set "taskName=%taskName:bug/=%"
set "taskName=%taskName:feature/=%"
git commit --allow-empty -m "%taskName%: %gitComent%"
