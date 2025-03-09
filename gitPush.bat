for /f %%i in ('git symbolic-ref --short HEAD') do set currentBranch=%%i
git push -u origin %currentBranch% 