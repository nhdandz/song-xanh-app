@echo off
echo ====================================
echo Regenerating Prisma Client
echo ====================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Removing old Prisma client...
if exist "node_modules\.prisma" (
    rmdir /S /Q "node_modules\.prisma"
    echo Removed node_modules\.prisma
) else (
    echo node_modules\.prisma does not exist
)

echo.
echo Step 3: Generating new Prisma client...
call npx prisma generate

echo.
echo ====================================
echo Done! You can now run: npm run dev
echo ====================================
pause
