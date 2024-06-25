@echo off
echo Activation de l'environnement virtuel...
call movie_picker_env\Scripts\activate.bat

if %ERRORLEVEL% neq 0 (
    echo Erreur lors de l'activation de l'environnement virtuel.
    pause
    exit /b %ERRORLEVEL%
)

echo Environnement virtuel activé.
echo Changement de répertoire...
cd movie_picker

if %ERRORLEVEL% neq 0 (
    echo Erreur lors du changement de répertoire.
    pause
    exit /b %ERRORLEVEL%
)

echo Lancement de l'application...
python run.py

if %ERRORLEVEL% neq 0 (
    echo Erreur lors du lancement de l'application.
    pause
)

cd ..
deactivate