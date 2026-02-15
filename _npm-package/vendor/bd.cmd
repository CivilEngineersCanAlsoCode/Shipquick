@ECHO off
SETLOCAL
SET "dp0=%~dp0"
node "%dp0%_tools\beads\bin\bd.js" %*
