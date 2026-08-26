@echo off
cd C:\Users\Bruker\Claude\laban-tracker2

echo Starter Laban Show Tracker...
start "Laban Server" cmd /k "node server.js"
timeout /t 2 /nobreak > nul
start "Laban App" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
start "" "http://localhost:5173"