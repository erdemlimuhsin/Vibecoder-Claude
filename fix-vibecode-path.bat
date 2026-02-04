@echo off
echo === Corrigindo PATH do VibeCode ===
echo.

REM Adicionar PATH do npm ao sistema
for /f "delims=" %%i in ('npm config get prefix') do set NPM_PATH=%%i

echo Caminho npm: %NPM_PATH%
echo.

REM Adicionar ao PATH da sessão atual
set PATH=%PATH%;%NPM_PATH%

echo PATH atualizado para esta sessão!
echo.

REM Testar
echo Testando comando vibecode...
where vibecode
echo.

if %ERRORLEVEL% EQU 0 (
    echo [OK] Comando vibecode encontrado!
    echo.
    echo Execute: vibecode --version
) else (
    echo [ERRO] Comando ainda não encontrado.
    echo.
    echo SOLUCAO PERMANENTE:
    echo 1. Abra: Painel de Controle ^> Sistema ^> Configuracoes Avancadas
    echo 2. Clique em "Variaveis de Ambiente"
    echo 3. Em "Variaveis do usuario", edite PATH
    echo 4. Adicione: %NPM_PATH%
    echo 5. Clique OK e reinicie o terminal
)

echo.
pause
