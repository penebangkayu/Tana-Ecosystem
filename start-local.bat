@echo off
REM ===== Start Backend =====
echo Starting Backend...
start cmd /k "cd backend && uvicorn main:app --reload"

REM ===== Wait a few seconds to ensure backend is ready =====
timeout /t 5

REM ===== Start Frontend =====
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

REM ===== Open Browser =====
echo Opening browser at http://localhost:3000
start http://localhost:3000
