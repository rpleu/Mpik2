@echo off
echo Reconstruction de la base de donnees app.db
echo.

REM Activation de l'environnement virtuel
call movie_picker_env\Scripts\activate.bat

if %ERRORLEVEL% neq 0 (
    echo Erreur lors de l'activation de l'environnement virtuel.
    pause
    exit /b %ERRORLEVEL%
)

echo Environnement virtuel active.
echo.

REM Suppression de l'ancienne base de données
if exist app\app.db (
    echo Suppression de l'ancienne base de donnees...
    del app\app.db
)

echo.
echo Creation de la nouvelle base de donnees...

REM Création de la nouvelle base de données
python -c "from app import db; db.create_all()"

if %ERRORLEVEL% neq 0 (
    echo Erreur lors de la creation de la base de donnees.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Base de donnees reconstruite avec succes !
echo.

REM Désactivation de l'environnement virtuel
call deactivate

pause