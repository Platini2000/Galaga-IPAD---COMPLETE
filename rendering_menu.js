// --- START OF FILE rendering_menu.js ---
// --- DEEL 1      van 3 dit code blok    ---

// --- Menu/UI Constanten ---
const MENU_LOGO_APPROX_HEIGHT = 85;
const MENU_SUBTITLE_TEXT = "Written By Platini2000(c)";
const MENU_SUBTITLE_FONT = "18px 'Arial Black', Gadget, sans-serif"; // Groter
const MENU_SUBTITLE_COLOR = "red"; // Aangepaste kleur
const MENU_BUTTON_FONT = "22px 'Arial Black', Gadget, sans-serif";
const MENU_BUTTON_COLOR = "white";
const MENU_BUTTON_COLOR_HOVER = 'rgba(0, 191, 255, 0.9)'; // Deep sky blue hover
const MENU_BUTTON_WIDTH = 300;
const MENU_BUTTON_HEIGHT = 55;
const MENU_LOGO_BOTTOM_TO_START_GAP = 5;
const MENU_BUTTON_V_GAP = -15;
const MENU_BUTTON_SUBTITLE_V_GAP = -0;
const MENU_SCORE_FONT = "20px 'Press Start 2P'";
const MENU_SCORE_COLOR = "white";
const MENU_SCORE_LABEL_COLOR = "red";
const GAME_OVER_FONT = "bold 18px 'Press Start 2P'";
const GAME_OVER_COLOR = "rgba(0, 191, 255, 0.9)"; // Cyaan
const GAME_OVER_SHADOW = true;
const DEMO_TEXT_LINE1_FONT = "bold 18px 'Press Start 2P'";
const DEMO_TEXT_COLOR = "rgba(0, 191, 255, 0.9)"; // Cyaan
const DEMO_TEXT_BLINK_ON_MS = 1000;
const DEMO_TEXT_BLINK_OFF_MS = 1000;
const DEMO_TEXT_BLINK_CYCLE_MS = DEMO_TEXT_BLINK_ON_MS + DEMO_TEXT_BLINK_OFF_MS;
const LOGO_SCALE_FACTOR = 0.45;
const MENU_LOGO_EXTRA_Y_OFFSET = 0;
const MENU_GENERAL_Y_OFFSET = 50;
const INTRO_TEXT_FONT = "bold 18px 'Press Start 2P'";
const INTRO_TEXT_COLOR_NORMAL = "rgba(0, 191, 255, 0.9)"; // Cyaan
const INTRO_TEXT_COLOR_DARK_YELLOW = "yellow";
const INTRO_TEXT_COLOR_CS_TEXT = INTRO_TEXT_COLOR_NORMAL;
const PERFECT_TEXT_COLOR = "red";
const EXTRA_LIFE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const READY_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_BONUS_SCORE_TEXT_COLOR = INTRO_TEXT_COLOR_DARK_YELLOW;
const CS_CLEAR_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_HITS_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_CLEAR_SCORE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const PAUSE_TEXT_FONT = INTRO_TEXT_FONT;
const PAUSE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const PAUSE_TEXT_SHADOW = true;

// GAME_OVER_DURATION is defined in setup_utils.js
const RESULTS_SCREEN_DURATION = 20000;
const PLAYER_GAME_OVER_MESSAGE_DURATION = 5000;

// --- Score Screen Constanten ---
const SCORE_SCREEN_TEXT_FONT = INTRO_TEXT_FONT;
const SCORE_SCREEN_TEXT_COLOR_TOP = INTRO_TEXT_COLOR_NORMAL;
const SCORE_SCREEN_TEXT_COLOR_BONUS = INTRO_TEXT_COLOR_DARK_YELLOW;
const SCORE_SCREEN_LINE_V_SPACING = 40;
const SCORE_SCREEN_ICON_TEXT_H_SPACING = 15;
const SCORE_SCREEN_VERTICAL_OFFSET = 75;

// --- Resultaten Scherm Kleuren & Layout ---
const RESULTS_HEADER_COLOR = "red";
const RESULTS_VALUE_COLOR_YELLOW = INTRO_TEXT_COLOR_DARK_YELLOW;
const RESULTS_LABEL_COLOR = "white";
const RESULTS_VALUE_COLOR_CYAN = INTRO_TEXT_COLOR_NORMAL;
const RESULTS_LINE_V_SPACING_SINGLE = 35;
const RESULTS_LINE_V_SPACING_DOUBLE = 90;
const RESULTS_START_Y = 175;
const RESULTS_FOOTER_FONT = MENU_SUBTITLE_FONT;
const RESULTS_FOOTER_COLOR = RESULTS_HEADER_COLOR;

// --- Verticale Offset voor CS berichten ---
const CS_MESSAGE_VERTICAL_OFFSET = 30;

// --- Helper Functie voor Hoogte ---
function getSubtitleApproxHeight(font) { const sizeMatch = font.match(/(\d+)px/); return sizeMatch?.[1] ? parseInt(sizeMatch[1], 10) : 25; }

// --- Helper Functie voor Tijd Formattering ---
/** Formatteert milliseconden naar een "MM:SS" string. */
function formatMillisecondsToMMSS(ms) { if (ms <= 0 || typeof ms !== 'number' || !isFinite(ms)) { return "00:00"; } const totalSeconds = Math.floor(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; const paddedMinutes = String(minutes).padStart(2, '0'); const paddedSeconds = String(seconds).padStart(2, '0'); return `${paddedMinutes}:${paddedSeconds}`; }

// --- Menu State & Interactie ---
let isTransitioningToDemoViaScoreScreen = false;

/** Berekent de rechthoek (positie en grootte) voor een menuknop.
 *  Layout is altijd gebaseerd op het hoofdmenu met 2 knoppen.
 *  De tekst binnen deze knoppen verandert, niet hun positie.
 */
function getMenuButtonRect(buttonIndex) {
    if (!gameCtx || !gameCanvas || gameCanvas.width === 0 || gameCanvas.height === 0) return null;
    const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height;
    const buttonX = (canvasWidth / 2 - MENU_BUTTON_WIDTH / 2) - 1;

    let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT;
    if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) {
        actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR;
    }
    const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT);

    const numberOfButtons = 2; // Altijd 2 knoppen qua layout
    const totalContentHeight = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP +
                             (numberOfButtons * MENU_BUTTON_HEIGHT) + ((numberOfButtons - 1) * MENU_BUTTON_V_GAP) +
                             MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight;

    let groupStartY = (canvasHeight - totalContentHeight) / 2 - 70;
    groupStartY += MENU_GENERAL_Y_OFFSET;

    const firstButtonTopY = groupStartY + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP;
    const buttonY = firstButtonTopY + buttonIndex * (MENU_BUTTON_HEIGHT + MENU_BUTTON_V_GAP);

    if (buttonIndex === 0 || buttonIndex === 1) {
        return { x: buttonX, y: Math.round(buttonY), width: MENU_BUTTON_WIDTH, height: MENU_BUTTON_HEIGHT };
    }
    return null;
}


/**
 * Verwerkt controller input in het menu, score screen, of game over/results sequence.
 */
function pollControllerForMenu() {
    try {
        if (audioContext && audioContext.state === 'suspended' && (connectedGamepadIndex !== null || connectedGamepadIndexP2 !== null) ) {
             audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed by controller interaction."); });
        }
        if (connectedGamepadIndex === null && connectedGamepadIndexP2 === null) { joystickMovedVerticallyLastFrame = false; if(previousButtonStates.length > 0) previousButtonStates = []; if(previousGameButtonStates.length > 0) previousGameButtonStates = []; if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; return; }
        let primaryGamepadIndex = connectedGamepadIndex !== null ? connectedGamepadIndex : connectedGamepadIndexP2;
        if (primaryGamepadIndex === null) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads?.[primaryGamepadIndex]) return;
        const gamepad = gamepads[primaryGamepadIndex];
        const currentButtonStates = gamepad.buttons.map(b => b.pressed);
        const currentGeneralButtonStates = currentButtonStates;
        const currentGameButtonStates = currentButtonStates;
        let actionTakenThisFrame = false;
        const now = Date.now();
        let blockAllMenuInput = false;
        if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) { blockAllMenuInput = true; }
        if (blockAllMenuInput) { if (connectedGamepadIndex !== null) { previousButtonStates = currentGeneralButtonStates.slice(); previousGameButtonStates = currentGameButtonStates.slice(); } if (connectedGamepadIndexP2 !== null) { const gamepadsP2 = navigator.getGamepads(); if (gamepadsP2?.[connectedGamepadIndexP2]) { previousGameButtonStatesP2 = gamepadsP2[connectedGamepadIndexP2].buttons.map(b => b.pressed); } } return; }

        if (isInGameState && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
            const trianglePressedNow = currentGameButtonStates[PS5_BUTTON_TRIANGLE];
            const trianglePressedLast = previousGameButtonStates[PS5_BUTTON_TRIANGLE] ?? false;
            if (trianglePressedNow && !trianglePressedLast) {
                if(typeof stopGameAndShowMenu === 'function') stopGameAndShowMenu();
                actionTakenThisFrame = true;
            }

            if (!actionTakenThisFrame) {
                const r1PressedNow = currentGameButtonStates[PS5_BUTTON_R1];
                const r1PressedLast = previousGameButtonStates[PS5_BUTTON_R1] ?? false;
                if (r1PressedNow && !r1PressedLast) {
                    if(typeof togglePause === 'function') togglePause();
                    actionTakenThisFrame = true;
                }
            }
        }

        if (!actionTakenThisFrame) {
             const canConsiderReturningToMenu = isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen;
            if (canConsiderReturningToMenu) {
                let anyButtonPressedNow = false;
                for (let i = 0; i < currentGeneralButtonStates.length; i++) {
                    if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue;
                    const wasPressedLast = previousButtonStates[i] ?? false;
                    if (currentGeneralButtonStates[i] && !wasPressedLast) {
                        anyButtonPressedNow = true;
                        break;
                    }
                }
                if (anyButtonPressedNow) {
                    if(typeof showMenuState === 'function') showMenuState(); // Gaat direct naar hoofdmenu
                    actionTakenThisFrame = true;
                }
            }
            else if (!isInGameState && !actionTakenThisFrame) {
                const crossPressedNow = currentGeneralButtonStates[PS5_BUTTON_CROSS];
                const crossPressedLast = previousButtonStates[PS5_BUTTON_CROSS] ?? false;
                const circlePressedNow = currentGeneralButtonStates[PS5_BUTTON_CIRCLE];
                const circlePressedLast = previousButtonStates[PS5_BUTTON_CIRCLE] ?? false;
                const axisY = gamepad.axes[PS5_LEFT_STICK_Y] ?? 0;
                const dpadUp = currentGeneralButtonStates[PS5_DPAD_UP];
                const dpadDown = currentGeneralButtonStates[PS5_DPAD_DOWN];
                let verticalInput = 0;
                if (axisY < -AXIS_DEAD_ZONE_MENU || dpadUp) verticalInput = -1;
                else if (axisY > AXIS_DEAD_ZONE_MENU || dpadDown) verticalInput = 1;
                let currentJoystickMoved = (verticalInput !== 0);
                if (currentJoystickMoved && !joystickMovedVerticallyLastFrame) { let newIndex = selectedButtonIndex; const numButtons = 2; if (newIndex === -1) { newIndex = (verticalInput === 1) ? 0 : numButtons - 1; } else { newIndex += verticalInput; } if (newIndex < 0) newIndex = numButtons - 1; if (newIndex >= numButtons) newIndex = 0; if (newIndex !== selectedButtonIndex) { selectedButtonIndex = newIndex; startAutoDemoTimer(); } }
                joystickMovedVerticallyLastFrame = currentJoystickMoved;
                 if (crossPressedNow && !crossPressedLast) {
                     stopAutoDemoTimer();
                     if (isPlayerSelectMode) {
                        if (selectedButtonIndex === 0) { // P1
                            isPlayerSelectMode = false;
                            isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 0;
                        } else { // P2
                            isPlayerSelectMode = false;
                            isGameModeSelectMode = true; isTwoPlayerMode = true; selectedButtonIndex = 0;
                        }
                     } else if (isOnePlayerGameTypeSelectMode) { // 1P: Kiezen tussen "NORMAL GAME" en "GAME Vs AI"
                        if (selectedButtonIndex === 0) { // "NORMAL GAME" (1P Klassiek) gekozen
                            isOnePlayerGameTypeSelectMode = false;
                            isFiringModeSelectMode = true; // Direct naar firing mode
                            selectedOnePlayerGameVariant = 'CLASSIC_1P';
                            isTwoPlayerMode = false; isPlayerTwoAI = false; selectedButtonIndex = 0;
                        } else { // "GAME Vs AI" (1P) gekozen
                            isOnePlayerGameTypeSelectMode = false;
                            isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = 0; // Naar Normal/Coop selectie voor vs AI
                        }
                     } else if (isOnePlayerVsAIGameTypeSelectMode) { // Nieuwe state: 1P -> GAME Vs AI -> Kies Normal/Coop
                        if (selectedButtonIndex === 0) { // "NORMAL GAME" (vs AI)
                            selectedOnePlayerGameVariant = '1P_VS_AI_NORMAL';
                            selectedGameMode = 'normal'; // <<<< TOEGEVOEGD
                        } else { // "CO-OP GAME" (vs AI)
                            selectedOnePlayerGameVariant = '1P_VS_AI_COOP';
                            selectedGameMode = 'coop';   // <<<< TOEGEVOEGD
                        }
                        isOnePlayerVsAIGameTypeSelectMode = false;
                        isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = true; selectedButtonIndex = 0;
                     } else if (isGameModeSelectMode) { // 2P (Human): NORMAL GAME / CO-OP GAME
                        if (selectedButtonIndex === 0) { selectedGameMode = 'normal'; }
                        else { selectedGameMode = 'coop'; }
                        isGameModeSelectMode = false;
                        isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = false; selectedButtonIndex = 0;
                     } else if (isFiringModeSelectMode) { // Firing mode
                         if (selectedButtonIndex === 0) { selectedFiringMode = 'rapid'; } else { selectedFiringMode = 'single'; }
                         baseStartGame(true);
                     } else { // Hoofdmenu
                         if (selectedButtonIndex === 0) { // START GAME
                            isPlayerSelectMode = true; selectedButtonIndex = 0;
                        }
                         else if (selectedButtonIndex === 1) { exitGame(); }
                     }
                    actionTakenThisFrame = true; startAutoDemoTimer();
                 }
                 if (!actionTakenThisFrame && circlePressedNow && !circlePressedLast) { // Terugknop (Circle)
                      stopAutoDemoTimer();
                      if (isFiringModeSelectMode) {
                        isFiringModeSelectMode = false;
                        if (selectedOnePlayerGameVariant === 'CLASSIC_1P') { // Van klassiek 1P firing mode terug
                            isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 0; // Terug naar 1P: Normal/GameVsAI (Normal geselecteerd)
                        } else if (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                            isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = (selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? 1 : 0); // Terug naar vsAI type selectie
                        } else if (isTwoPlayerMode && !isPlayerTwoAI) { // Was 2P Human
                            isGameModeSelectMode = true; selectedButtonIndex = (selectedGameMode === 'coop' ? 1 : 0); // Terug naar 2P game mode selectie
                        } else { // Fallback
                             isPlayerSelectMode = false; isOnePlayerGameTypeSelectMode = false; isOnePlayerVsAIGameTypeSelectMode = false; isGameModeSelectMode = false; selectedButtonIndex = 0;
                        }
                        selectedOnePlayerGameVariant = ''; isPlayerTwoAI = false; // Reset variant en AI vlag bij teruggaan
                      } else if (isOnePlayerVsAIGameTypeSelectMode) { // Van 1P vs AI (Normal/Coop) terug
                        isOnePlayerVsAIGameTypeSelectMode = false;
                        isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 1; // Terug naar 1P: Normal/GameVsAI (GameVsAI geselecteerd)
                      } else if (isOnePlayerGameTypeSelectMode) { // Van 1P: Normal/GameVsAI terug
                        isOnePlayerGameTypeSelectMode = false;
                        isPlayerSelectMode = true; selectedButtonIndex = 0; // Terug naar P1/P2 (P1 geselecteerd)
                      } else if (isGameModeSelectMode) { // 2P Normal/Coop selectie
                        isGameModeSelectMode = false;
                        isPlayerSelectMode = true; selectedButtonIndex = 1; // Terug naar P1/P2 (P2 geselecteerd)
                      } else if (isPlayerSelectMode) { // P1/P2 selectie
                        isPlayerSelectMode = false; selectedButtonIndex = 0; // Terug naar hoofdmenu
                      } else { triggerFullscreen(); } // Hoofdmenu -> fullscreen (playSound('menuMusicSound') gebeurt in triggerFullscreen)
                      actionTakenThisFrame = true; startAutoDemoTimer();
                 }
            }
        }
         if (connectedGamepadIndex !== null) { previousButtonStates = currentGeneralButtonStates.slice(); previousGameButtonStates = currentGameButtonStates.slice(); }
         if (connectedGamepadIndexP2 !== null) { const gamepadsP2 = navigator.getGamepads(); if (gamepadsP2?.[connectedGamepadIndexP2]) { previousGameButtonStatesP2 = gamepadsP2[connectedGamepadIndexP2].buttons.map(b => b.pressed); } }
    } catch (e) { console.error("Error in pollControllerForMenu:", e); previousButtonStates = []; previousGameButtonStates = []; previousGameButtonStatesP2 = []; selectedButtonIndex = -1; joystickMovedVerticallyLastFrame = false; }
}


/** Start de timer die naar het score screen leidt, of een van de demo's. */
function initiateScoreScreenThenDemo() {
    if (!isInGameState && !isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen) {
        isTransitioningToDemoViaScoreScreen = true;
        showScoreScreen();

        if (autoStartTimerId) {
            clearTimeout(autoStartTimerId);
            autoStartTimerId = null;
        }

        autoStartTimerId = setTimeout(() => {
            if (isShowingScoreScreen) {
                isPlayerSelectMode = false;
                isFiringModeSelectMode = false;
                isGameModeSelectMode = false;
                isOnePlayerGameTypeSelectMode = false;
                // isOnePlayerNormalGameSubTypeSelectMode is verwijderd
                isOnePlayerVsAIGameTypeSelectMode = false;
                selectedOnePlayerGameVariant = '';
                isPlayerTwoAI = false;

                demoModeCounter++;
                if (demoModeCounter % 2 === 1) {
                    if (typeof startCoopAIDemo === 'function') startCoopAIDemo();
                    else startAIDemo();
                } else {
                    startAIDemo();
                }
            }
            isTransitioningToDemoViaScoreScreen = false;
        }, SCORE_SCREEN_DURATION);
    } else {
         if (autoStartTimerId) {
            clearTimeout(autoStartTimerId);
            autoStartTimerId = null;
         }
         isTransitioningToDemoViaScoreScreen = false;
    }
}

function startAutoDemoTimer() {
    try {
        stopAutoDemoTimer();
        isTransitioningToDemoViaScoreScreen = false;

        autoStartTimerId = setTimeout(() => {
            initiateScoreScreenThenDemo();
        }, MENU_INACTIVITY_TIMEOUT);
    } catch (e) {
        console.error("Error starting auto demo timer:", e);
        isTransitioningToDemoViaScoreScreen = false;
    }
}


/** Stopt de timer voor menu inactiviteit / score screen. */
function stopAutoDemoTimer() {
    try {
        if (autoStartTimerId) {
            clearTimeout(autoStartTimerId);
            autoStartTimerId = null;
        }
        isTransitioningToDemoViaScoreScreen = false;
    } catch (e) {
        console.error("Error stopping auto demo timer:", e);
    }
}

// --- EINDE deel 1      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---






// --- START OF FILE rendering_menu.js ---
// --- DEEL 2      van 3 dit code blok    ---

function showMenuState() {
    try {
       if (wasLastGameAIDemo) {
           highScore = 20000;
       }
       wasLastGameAIDemo = false;
       isCoopAIDemoActive = false;
       aiPlayerActivelySeekingCaptureById = null;

       initialGameStartSoundPlayedThisSession = false;
       coopStartSoundPlayedThisSession = false;
       gameJustStartedAndWaveLaunched = false;

       isInGameState = false;
       isShowingScoreScreen = false; scoreScreenStartTime = 0;
       isManualControl = false; isShowingDemoText = false;
       isPaused = false;

       isPlayerSelectMode = false;
       isOnePlayerGameTypeSelectMode = false;
       isOnePlayerVsAIGameTypeSelectMode = false;
       isGameModeSelectMode = false;
       isFiringModeSelectMode = false;
       selectedOnePlayerGameVariant = '';
       isPlayerTwoAI = false;

       selectedFiringMode = 'rapid';
       selectedGameMode = 'normal';
       isTwoPlayerMode = false; currentPlayer = 1;
       showCsHitsMessage = false; csHitsMessageStartTime = 0; showPerfectMessage = false; perfectMessageStartTime = 0; showCsBonusScoreMessage = false; csBonusScoreMessageStartTime = 0; showCSClearMessage = false; csClearMessageStartTime = 0; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showExtraLifeMessage = false; extraLifeMessageStartTime = 0;
       showReadyMessage = false; readyMessageStartTime = 0; readyForNextWave = false; readyForNextWaveReset = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = '';
       player1TriggeredHighScoreSound = false;
       player2TriggeredHighScoreSound = false;
       isShowingCoopPlayersReady = false;
       coopPlayersReadyStartTime = 0;
       isTransitioningToDemoViaScoreScreen = false;


       stopAllGameSoundsInternal();
       isGridSoundPlaying = false;

       playerLives = 3; score = 0; level = 1;
       player1Lives = 3; player2Lives = 3; player1Score = 0; player2Score = 0; player1ShotsFired = 0; player2ShotsFired = 0; player1EnemiesHit = 0; player2EnemiesHit = 0; player1MaxLevelReached = 1; player2MaxLevelReached = 1;
       scoreEarnedThisCS = 0; enemies = []; bullets = []; enemyBullets = []; explosions = []; isShowingIntro = false; introStep = 0; isChallengingStage = false; challengingStageEnemiesHit = 0; currentGridOffsetX = 0; gridMoveDirection = 1; currentWaveDefinition = null; isEntrancePhaseActive = false; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; if(typeof enemySpawnTimeouts !== 'undefined' && Array.isArray(enemySpawnTimeouts)){ enemySpawnTimeouts.forEach(clearTimeout); } enemySpawnTimeouts = []; lastEnemyDetachTime = 0; selectedButtonIndex = 0;
       joystickMovedVerticallyLastFrame = false; previousButtonStates = []; previousGameButtonStates = []; previousDemoButtonStates = []; previousGameButtonStatesP2 = [];
       isShowingResultsScreen = false;
       gameOverSequenceStartTime = 0; gameStartTime = 0; forceCenterShipNextReset = false; player1CompletedLevel = -1;
       p1JustFiredSingle = false; p2JustFiredSingle = false;
       p1FireInputWasDown = false; p2FireInputWasDown = false;

       if (ship && typeof ship === 'object' && ship.hasOwnProperty('x') && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
            ship.x = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2);
            ship.targetX = ship.x;
            ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
       } else if (ship !== null) {
       }


       clearTimeout(mouseIdleTimerId);
       mouseIdleTimerId = setTimeout(hideCursor, 2000);

       playSound('menuMusicSound', true, 0.2);
       startAutoDemoTimer();
   } catch(e) {
       console.error("Error in showMenuState:", e);
       gameJustStartedAndWaveLaunched = false;
       wasLastGameAIDemo = false; initialGameStartSoundPlayedThisSession = false; isInGameState = false; isShowingScoreScreen = false; isPaused = false;
       isPlayerSelectMode = false; isOnePlayerGameTypeSelectMode = false; isOnePlayerVsAIGameTypeSelectMode = false; isGameModeSelectMode = false; isFiringModeSelectMode = false;
       selectedGameMode = 'normal'; selectedOnePlayerGameVariant = ''; isPlayerTwoAI = false;
       isTwoPlayerMode = false; currentPlayer = 1; isShowingPlayerGameOverMessage = false;
       isCoopAIDemoActive = false; aiPlayerActivelySeekingCaptureById = null;
       coopStartSoundPlayedThisSession = false;
       player1TriggeredHighScoreSound = false;
       player2TriggeredHighScoreSound = false;
       isShowingCoopPlayersReady = false; coopPlayersReadyStartTime = 0;
       isTransitioningToDemoViaScoreScreen = false;
       clearTimeout(mouseIdleTimerId); mouseIdleTimerId = null;
       if(mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null;
       alert("Error returning to menu. Please refresh the page."); document.body.innerHTML = '<p style="color:white;">Error returning to menu. Please refresh.</p>';
   }
}

/** Start de AI demo modus. */
function startAIDemo() {
    if (isInGameState) return;
    stopSound('menuMusicSound');
    isShowingScoreScreen = false;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = false;
    isGameModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;
    selectedFiringMode = 'rapid';

    isTwoPlayerMode = false;
    selectedGameMode = 'normal';
    isManualControl = false;
    isShowingDemoText = true;
    isCoopAIDemoActive = false;
    aiPlayerActivelySeekingCaptureById = null;
    wasLastGameAIDemo = true;
    coopStartSoundPlayedThisSession = false;

    baseStartGame(false);
    gameJustStarted = true;
}

/** Start de CO-OP AI demo modus. */
function startCoopAIDemo() {
    if (isInGameState) return;
    stopSound('menuMusicSound');
    isShowingScoreScreen = false;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = false;
    isGameModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;
    selectedFiringMode = 'rapid';

    isTwoPlayerMode = true;
    selectedGameMode = 'coop';
    isManualControl = false;
    isShowingDemoText = true;
    isCoopAIDemoActive = true; 
    aiPlayerActivelySeekingCaptureById = null;
    wasLastGameAIDemo = true;

    baseStartGame(false);
    gameJustStarted = true;
}


function startGame1P() {
    if (isInGameState) return;
    isPlayerSelectMode = false;
    isOnePlayerGameTypeSelectMode = true;
    isGameModeSelectMode = false;
    isFiringModeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;

    isTwoPlayerMode = false;
    selectedGameMode = 'normal'; 
    isCoopAIDemoActive = false;
    aiPlayerActivelySeekingCaptureById = null;
    selectedButtonIndex = 0;
    coopStartSoundPlayedThisSession = false;
    startAutoDemoTimer();
}

function startGame2P() {
    if (isInGameState) return;
    isPlayerSelectMode = false;
    isGameModeSelectMode = true; 
    isFiringModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;

    isTwoPlayerMode = true; 
    selectedGameMode = 'normal'; 
    isCoopAIDemoActive = false;
    aiPlayerActivelySeekingCaptureById = null;
    selectedButtonIndex = 0;
    coopStartSoundPlayedThisSession = false;
    startAutoDemoTimer();
}


function baseStartGame(setManualControl) {
    try {
        if (!gameCanvas || !gameCtx) { console.error("Cannot start game - canvas not ready."); showMenuState(); return; }
        if (setManualControl) {
            stopSound('menuMusicSound');
        }
        stopAutoDemoTimer();
        isInGameState = true; isShowingScoreScreen = false;
        isPlayerSelectMode = false;
        isOnePlayerGameTypeSelectMode = false;
        isOnePlayerVsAIGameTypeSelectMode = false;
        isGameModeSelectMode = false;
        isFiringModeSelectMode = false;

        gameJustStartedAndWaveLaunched = false;
        isTransitioningToDemoViaScoreScreen = false;


        isManualControl = setManualControl;
        isShowingDemoText = !setManualControl;
        isPaused = false;
        previousButtonStates = []; previousGameButtonStates = []; previousDemoButtonStates = []; previousGameButtonStatesP2 = [];
        p1JustFiredSingle = false; p2JustFiredSingle = false;
        p1FireInputWasDown = false; p2FireInputWasDown = false;

        if (setManualControl) {
            wasLastGameAIDemo = false;
            if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                isCoopAIDemoActive = false; 
            } else {
                isCoopAIDemoActive = false; 
            }
            aiPlayerActivelySeekingCaptureById = null;
        } else { 
            isPlayerTwoAI = false; 
            selectedOnePlayerGameVariant = ''; 
        }


        clearTimeout(mouseIdleTimerId);
        mouseIdleTimerId = setTimeout(hideCursor, 2000);

        if (typeof window.resetGame === 'function') {
            window.resetGame();
        } else {
            console.error("FATAL: window.resetGame function is not defined or not a function! Cannot start game properly.");
            alert("Critical error: Game logic (window.resetGame) not loaded correctly!");
            showMenuState();
            return;
        }

        isShowingCoopPlayersReady = false;

        const needsL1StartSound = level === 1 && !initialGameStartSoundPlayedThisSession;
        let playStartSoundForThisGame = false;

        if (isManualControl) {
            if (selectedOnePlayerGameVariant === 'CLASSIC_1P') {
                if (needsL1StartSound) playStartSoundForThisGame = true;
            } else if (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                 if (needsL1StartSound) playStartSoundForThisGame = true;
                 if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { 
                    isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
                 }
            } else if (isTwoPlayerMode && !isPlayerTwoAI && selectedGameMode === 'normal') {
                if (needsL1StartSound) playStartSoundForThisGame = true;
            } else if (isTwoPlayerMode && !isPlayerTwoAI && selectedGameMode === 'coop') {
                if (needsL1StartSound && !coopStartSoundPlayedThisSession) playStartSoundForThisGame = true;
                isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
            }
        } else { 
            if (needsL1StartSound) playStartSoundForThisGame = true;
            if (isCoopAIDemoActive) { 
                 isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
            }
        }

        if (playStartSoundForThisGame) {
            playSound('startSound', false, 0.4);
            initialGameStartSoundPlayedThisSession = true;
            if (selectedGameMode === 'coop' || isCoopAIDemoActive || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                coopStartSoundPlayedThisSession = true;
            }
        }


        gameStartTime = Date.now();
        leftPressed = false; rightPressed = false; shootPressed = false;
        p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
        keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
        keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
        selectedButtonIndex = -1;


        if (mainLoopId === null) {
             if (typeof window.startMainLoop === 'function') window.startMainLoop(); else startMainLoop();
        }
    } catch (e) {
        console.error("Error in baseStartGame:", e);
        gameJustStartedAndWaveLaunched = false;
        wasLastGameAIDemo = false; initialGameStartSoundPlayedThisSession = false;
        isCoopAIDemoActive = false; aiPlayerActivelySeekingCaptureById = null;
        isPlayerTwoAI = false;
        coopStartSoundPlayedThisSession = false;
        isShowingCoopPlayersReady = false; coopPlayersReadyStartTime = 0;
        isTransitioningToDemoViaScoreScreen = false;
        clearTimeout(mouseIdleTimerId); mouseIdleTimerId = null;
        alert("Critical error starting game!"); showMenuState();
    }
}
function stopGameAndShowMenu() {
    isPaused = false;
    if (isManualControl) {
        if (typeof window.saveHighScore === 'function') window.saveHighScore(); else saveHighScore();
    }
    showMenuState(); 
}
function exitGame() {
    isPaused = false;
    stopAutoDemoTimer();
    if (typeof window.saveHighScore === 'function') window.saveHighScore(); else saveHighScore();
    isInGameState = false;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = false;
    isGameModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;
    showMenuState(); 
    try {
        window.close();
        setTimeout(() => { if(!isInGameState) showMenuState(); }, 200);
    } catch(e) {
        console.error("window.close() failed:", e);
        showMenuState();
    }
}
function triggerGameOver() { if (typeof window.triggerFinalGameOverSequence === 'function') window.triggerFinalGameOverSequence(); else triggerFinalGameOverSequence(); }


/** Activeert de score screen state. */
function showScoreScreen() {
    if (isInGameState || isShowingScoreScreen) return;

    isShowingScoreScreen = true;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = false;
    isGameModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;
    scoreScreenStartTime = Date.now();
    selectedButtonIndex = -1;

    clearTimeout(mouseIdleTimerId);
    mouseIdleTimerId = setTimeout(hideCursor, 2000);
}


// --- Canvas Event Handlers ---

/**
 * Helper functie om een stap terug te gaan in het menu.
 */
function goBackInMenu() {
    if (isFiringModeSelectMode) {
        isFiringModeSelectMode = false;
        if (selectedOnePlayerGameVariant === 'CLASSIC_1P') {
            isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 0;
        } else if (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
            isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = (selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? 1 : 0);
        } else if (isTwoPlayerMode && !isPlayerTwoAI) { // Human 2P
            isGameModeSelectMode = true; selectedButtonIndex = (selectedGameMode === 'coop' ? 1 : 0);
        } else { // Fallback naar player select als de vorige staat onduidelijk is
            isPlayerSelectMode = true; selectedButtonIndex = 0; // Ga naar P1/P2 selectie, P1 geselecteerd
        }
        selectedOnePlayerGameVariant = ''; isPlayerTwoAI = false; selectedGameMode = 'normal'; // Reset
    } else if (isOnePlayerVsAIGameTypeSelectMode) {
        isOnePlayerVsAIGameTypeSelectMode = false; isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 1; // Terug naar 1P: Normal/GameVsAI (GameVsAI geselecteerd)
    } else if (isOnePlayerGameTypeSelectMode) {
        isOnePlayerGameTypeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 0; // Terug naar P1/P2 (P1 geselecteerd)
    } else if (isGameModeSelectMode) {
        isGameModeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 1; // Terug naar P1/P2 (P2 geselecteerd)
    } else if (isPlayerSelectMode) {
        isPlayerSelectMode = false; selectedButtonIndex = 0; // Terug naar hoofdmenu
    } else { // In hoofdmenu: klik/tap naast knoppen triggert fullscreen
        triggerFullscreen();
    }
    startAutoDemoTimer(); // Reset inactiviteitstimer
}


/**
 * Handles touch events on the canvas, routing them to menu or game logic.
 * @param {Event} event - The touch or mouse event.
 * @param {'start'|'move'|'end'} type - The type of event.
 * @param {boolean} [isTap=false] - True if the 'end' event is considered a tap (relevant for touchend).
 */
function handleCanvasTouch(event, type, isTap = false) {
    if (!gameCanvas) return;

    let clientX, clientY;
    if (event.type.startsWith('touch')) {
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else if (event.changedTouches && event.changedTouches.length > 0) {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
        } else {
            return; 
        }
    } else if (event.type.startsWith('mouse')) { // Muis event
        clientX = event.clientX;
        clientY = event.clientY;
    } else {
        return;
    }

    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const interactionX = (clientX - rect.left) * scaleX;
    const interactionY = (clientY - rect.top) * scaleY;

    const now = Date.now();
    if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) {
        touchedMenuButtonIndex = -1;
        return;
    }

    if (isInGameState) {
        // Game-specifieke touch/muis logica in game_logic.js
    } else if (isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen) {
        if (type === 'end' && isTap) { 
            if (typeof showMenuState === 'function') showMenuState();
        }
    } else if (!isShowingScoreScreen) { // Menu
        stopAutoDemoTimer();
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);
        let currentHoverButton = -1;

        if (button0Rect && checkCollision({ x: interactionX, y: interactionY, width: 1, height: 1 }, button0Rect)) {
            currentHoverButton = 0;
        } else if (button1Rect && checkCollision({ x: interactionX, y: interactionY, width: 1, height: 1 }, button1Rect)) {
            currentHoverButton = 1;
        }

        if (type === 'start') { 
            isTouchActiveMenu = true; 
            touchedMenuButtonIndex = currentHoverButton;
            selectedButtonIndex = currentHoverButton;
        } else if (type === 'move') { 
            if (event.type === 'mousemove') { 
                selectedButtonIndex = currentHoverButton; 
            } else { 
                if (touchedMenuButtonIndex !== -1 && currentHoverButton !== touchedMenuButtonIndex) {
                    selectedButtonIndex = -1;
                } else if (touchedMenuButtonIndex !== -1) { 
                    selectedButtonIndex = currentHoverButton;
                }
            }
        } else if (type === 'end' && event.type.startsWith('touch')) { 
            isTouchActiveMenu = false; 
            if (isTap && currentHoverButton !== -1 && currentHoverButton === touchedMenuButtonIndex) {
                selectedButtonIndex = currentHoverButton; 
                if (isPlayerSelectMode) {
                    if (selectedButtonIndex === 0) { startGame1P(); } else { startGame2P(); }
                } else if (isOnePlayerGameTypeSelectMode) {
                    if (selectedButtonIndex === 0) { isOnePlayerGameTypeSelectMode = false; isFiringModeSelectMode = true; selectedOnePlayerGameVariant = 'CLASSIC_1P'; selectedGameMode = 'normal'; isTwoPlayerMode = false; isPlayerTwoAI = false; selectedButtonIndex = 0; }
                    else { isOnePlayerGameTypeSelectMode = false; isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = 0; }
                } else if (isOnePlayerVsAIGameTypeSelectMode) {
                    if (selectedButtonIndex === 0) { selectedOnePlayerGameVariant = '1P_VS_AI_NORMAL'; selectedGameMode = 'normal'; }
                    else { selectedOnePlayerGameVariant = '1P_VS_AI_COOP'; selectedGameMode = 'coop'; }
                    isOnePlayerVsAIGameTypeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = true; selectedButtonIndex = 0;
                } else if (isGameModeSelectMode) {
                    if (selectedButtonIndex === 0) { selectedGameMode = 'normal'; } else { selectedGameMode = 'coop'; }
                    isGameModeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = false; selectedButtonIndex = 0;
                } else if (isFiringModeSelectMode) {
                    if (selectedButtonIndex === 0) { selectedFiringMode = 'rapid'; } else { selectedFiringMode = 'single'; }
                    baseStartGame(true);
                } else { 
                    if (selectedButtonIndex === 0) { isPlayerSelectMode = true; selectedButtonIndex = 0; }
                    else if (selectedButtonIndex === 1) { if (typeof exitGame === 'function') exitGame(); }
                }
            } else if (isTap && currentHoverButton === -1 && touchedMenuButtonIndex === -1) {
                // <<< GEWIJZIGD: Roep goBackInMenu aan bij tap naast knoppen >>>
                goBackInMenu();
                // <<< EINDE GEWIJZIGD >>>
            }
            touchedMenuButtonIndex = -1; 
        }
        
        if (type !== 'end' && currentHoverButton !== -1) { 
             stopAutoDemoTimer();
        } else if (type === 'end' || (type === 'move' && currentHoverButton === -1)) { 
             startAutoDemoTimer();
        }
    }
}

/**
 * Handles click events on the canvas.
 */
function handleCanvasClick(event) {
    if (!gameCanvas) return;
     if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed by canvas click."); });
    }

    if (isInGameState) {
        if (isPaused) { if(typeof togglePause === 'function') togglePause(); return; }
    } else if (isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen) {
        if (typeof showMenuState === 'function') showMenuState();
    } else if (!isShowingScoreScreen) { // Menu
        stopAutoDemoTimer();

        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const scaleY = gameCanvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        let clickedButton = -1;
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);

        if (button0Rect && checkCollision({ x: clickX, y: clickY, width: 1, height: 1 }, button0Rect)) {
            clickedButton = 0;
        } else if (button1Rect && checkCollision({ x: clickX, y: clickY, width: 1, height: 1 }, button1Rect)) {
            clickedButton = 1;
        }

        if (clickedButton !== -1) {
            selectedButtonIndex = clickedButton; 

            if (isPlayerSelectMode) {
                if (selectedButtonIndex === 0) { startGame1P(); } else { startGame2P(); }
            } else if (isOnePlayerGameTypeSelectMode) {
                if (selectedButtonIndex === 0) { isOnePlayerGameTypeSelectMode = false; isFiringModeSelectMode = true; selectedOnePlayerGameVariant = 'CLASSIC_1P'; selectedGameMode = 'normal'; isTwoPlayerMode = false; isPlayerTwoAI = false; selectedButtonIndex = 0; }
                else { isOnePlayerGameTypeSelectMode = false; isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = 0; }
            } else if (isOnePlayerVsAIGameTypeSelectMode) {
                if (selectedButtonIndex === 0) { selectedOnePlayerGameVariant = '1P_VS_AI_NORMAL'; selectedGameMode = 'normal'; }
                else { selectedOnePlayerGameVariant = '1P_VS_AI_COOP'; selectedGameMode = 'coop'; }
                isOnePlayerVsAIGameTypeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = true; selectedButtonIndex = 0;
            } else if (isGameModeSelectMode) {
                if (selectedButtonIndex === 0) { selectedGameMode = 'normal'; } else { selectedGameMode = 'coop'; }
                isGameModeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = false; selectedButtonIndex = 0;
            } else if (isFiringModeSelectMode) {
                if (selectedButtonIndex === 0) { selectedFiringMode = 'rapid'; } else { selectedFiringMode = 'single'; }
                baseStartGame(true);
            } else { 
                if (selectedButtonIndex === 0) { isPlayerSelectMode = true; selectedButtonIndex = 0; }
                else if (selectedButtonIndex === 1) { if (typeof exitGame === 'function') exitGame(); }
            }
        } else { 
            // <<< GEWIJZIGD: Roep goBackInMenu aan bij klik naast knoppen >>>
            goBackInMenu();
            // <<< EINDE GEWIJZIGD >>>
        }
        startAutoDemoTimer(); 
    }
}


// --- Rendering Functies ---
function createExplosion(x, y) { try { playSound('explosionSound', false, 0.4); let particles = []; for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) { const angle = Math.random() * Math.PI * 2; const speed = Math.random() * (EXPLOSION_MAX_SPEED - EXPLOSION_MIN_SPEED) + EXPLOSION_MIN_SPEED; particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: EXPLOSION_PARTICLE_RADIUS, alpha: 1.0 }); } explosions.push({ creationTime: Date.now(), duration: EXPLOSION_DURATION, particles: particles }); } catch (e) { console.error("Error creating explosion:", e); } }


// --- EINDE deel 2      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---








// --- START OF FILE rendering_menu.js ---
// --- DEEL 3      van 3 dit code blok    --- (Focus: UI in Normal 1P Results/Game Over - Links 2 levensicoontjes)

/** Rendert de actieve explosies op het game canvas. */
function renderExplosions() { try { if (!gameCtx) return; gameCtx.save(); gameCtx.globalCompositeOperation = 'lighter'; explosions.forEach(explosion => { explosion.particles.forEach(p => { const drawAlpha = p.alpha * EXPLOSION_MAX_OPACITY; if (drawAlpha > 0.01) { gameCtx.beginPath(); gameCtx.arc(Math.round(p.x), Math.round(p.y), p.radius, 0, Math.PI * 2); gameCtx.fillStyle = `rgba(255, 200, 80, ${drawAlpha.toFixed(3)})`; gameCtx.fill(); } }); }); gameCtx.restore(); } catch (e) { console.error("Error rendering explosions:", e); } }

/** Helper functie om tekst te tekenen op het canvas met opties. */
function drawCanvasText(text, x, y, font, color, align = 'center', baseline = 'middle', shadow = false) { if (!gameCtx) return; gameCtx.save(); gameCtx.font = font; gameCtx.fillStyle = color; gameCtx.textAlign = align; gameCtx.textBaseline = baseline; if (shadow) { gameCtx.shadowColor = 'rgba(0, 0, 0, 0.8)'; gameCtx.shadowBlur = 8; gameCtx.shadowOffsetX = 3; gameCtx.shadowOffsetY = 3; } gameCtx.fillText(text, x, y); gameCtx.restore(); }

/** Tekent een menuknop met hover state. */
function drawCanvasButton(text, index, isSelected) { if (!gameCtx) return; const rect = getMenuButtonRect(index); if (!rect) return; gameCtx.save(); drawCanvasText( text, rect.x + rect.width / 2, rect.y + rect.height / 2, MENU_BUTTON_FONT, isSelected ? MENU_BUTTON_COLOR_HOVER : MENU_BUTTON_COLOR, 'center', 'middle' ); gameCtx.restore(); }

/** Rendert de actieve floating score teksten op het game canvas. */
function renderFloatingScores() { try { if (!gameCtx || !floatingScores || floatingScores.length === 0) return; const now = Date.now(); gameCtx.save(); gameCtx.globalAlpha = FLOATING_SCORE_OPACITY; floatingScores.forEach(fs => { if (now >= fs.displayStartTime) { drawCanvasText(fs.text, fs.x, fs.y, FLOATING_SCORE_FONT, fs.color, 'center', 'middle', false); } }); gameCtx.globalAlpha = 1.0; gameCtx.restore(); } catch (e) { console.error("Error rendering floatingScores:", e); } }

/**
 * Rendert de hit spark particles (met nieuwe look)
 */
function renderHitSparks() { if (!gameCtx || !hitSparks || hitSparks.length === 0) return; gameCtx.save(); gameCtx.globalCompositeOperation = 'lighter'; hitSparks.forEach(s => { if (s && s.alpha > 0.01) { gameCtx.fillStyle = s.color; gameCtx.globalAlpha = s.alpha; gameCtx.beginPath(); const currentSize = s.size * Math.sqrt(s.alpha); gameCtx.arc(Math.round(s.x), Math.round(s.y), Math.max(0.5, currentSize / 2), 0, Math.PI * 2); gameCtx.fill(); } }); gameCtx.globalAlpha = 1.0; gameCtx.restore(); }


/**
 * Tekent de volledige game scène.
 */
function renderGame() {
    try {
        if (!gameCtx || !gameCanvas) {
            if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; return;
        }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        const now = Date.now();

        // --- STAP 1: Teken UI (Score, Levens, Level) ---
        gameCtx.save();
        const UI_FONT="20px 'Press Start 2P'"; const LABEL_COLOR="red"; const SCORE_COLOR="white";
        const maxLivesIcons = 5;
        const defaultReserveLives = 2;
        gameCtx.font=UI_FONT; gameCtx.textBaseline="top";

        const drawTopUiElement=(label, scoreValue, labelAlign, labelX, shouldBlink = false)=>{
             // ... (Deze functie blijft ongewijzigd) ...
             let showLabel=true; let blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5; let blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
             if (label === "DEMO" || label === "DEMO-1" || label === "DEMO-2" || label === "AI P2") {
                 blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7; blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
             }
             else if (label === "HIGH SCORE") {
                 blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5; blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
                 if (isInGameState && (!isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop'))) {
                      blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7; blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
                 }
             }
             let isAnyPlayerGameOverMsgShowing = isShowingPlayerGameOverMessage || (isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage));
             if(shouldBlink){ if(isPaused || gameOverSequenceStartTime > 0 || isAnyPlayerGameOverMsgShowing || !((now % blinkCycleDuration) < blinkOnDuration)){ showLabel=false; } }

             if(showLabel){ gameCtx.fillStyle=LABEL_COLOR; gameCtx.textAlign=labelAlign; gameCtx.fillText(label, labelX, MARGIN_TOP); }
             const labelWidth=gameCtx.measureText(label).width;
             let scoreCenterX;
             if(labelAlign==='left')scoreCenterX=labelX+labelWidth/2;
             else if(labelAlign==='right')scoreCenterX=labelX-labelWidth/2;
             else scoreCenterX=labelX;
             gameCtx.fillStyle=SCORE_COLOR; gameCtx.textAlign='center';
             let scoreOffsetY=MARGIN_TOP+SCORE_OFFSET_Y+5;
             if(label==="HIGH SCORE"){scoreCenterX=labelX;}
             const scoreText = (typeof scoreValue === 'number') ? scoreValue.toFixed(0) : String(scoreValue);
             gameCtx.fillText(scoreText, scoreCenterX, scoreOffsetY);
        };

        let score1PValue, score2PValue, sessionHighScore, label1P, label2P = "2UP";
        let show1UPBlink = false, show2UPBlink = false, highScoreConditionMet = false;
        let isAnyCoopPlayerGameOver = isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage);


        score2PValue = 0;
        const isEffectivelyTwoPlayerUI = isTwoPlayerMode || (isPlayerTwoAI && selectedGameMode === 'coop');

        if (isEffectivelyTwoPlayerUI) {
            // ... (Logica voor P2 score en label blijft ongewijzigd) ...
            if (selectedGameMode === 'coop' && isInGameState) {
                score2PValue = player2Score;
                if (isCoopAIDemoActive) label2P = "DEMO-2";
                else if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') label2P = "AI P2";
                else label2P = "2UP";
            }
            else if (selectedGameMode === 'normal' && isInGameState) {
                score2PValue = (currentPlayer === 2) ? score : player2Score;
                if (isPlayerTwoAI) {
                    label2P = "AI P2";
                }
            }
            else if (isShowingResultsScreen || (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage && !isAnyCoopPlayerGameOver) || isShowingPlayerGameOverMessage || isAnyCoopPlayerGameOver) {
                score2PValue = player2Score || 0;
                if (isCoopAIDemoActive && wasLastGameAIDemo) label2P = "DEMO-2";
                else if (isPlayerTwoAI && wasLastGameAIDemo && selectedGameMode === 'coop') {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && wasLastGameAIDemo) {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode === 'coop') {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && !wasLastGameAIDemo) {
                    label2P = "AI P2";
                }
            } else if (!isInGameState ) {
                 score2PValue = 0;
                 if (isPlayerSelectMode && selectedButtonIndex === 1) label2P = "2UP";
                 else if ((isOnePlayerVsAIGameTypeSelectMode && selectedButtonIndex === 1) || (isFiringModeSelectMode && isPlayerTwoAI && selectedGameMode === 'coop')) label2P = "AI P2";
                 else if ((isOnePlayerVsAIGameTypeSelectMode && selectedButtonIndex === 0 && isFiringModeSelectMode && isPlayerTwoAI) || (isFiringModeSelectMode && isPlayerTwoAI && selectedGameMode === 'normal') ) label2P = "AI P2";
                 else label2P = "2UP";
            }
        } else {
             label2P = "2UP";
             score2PValue = 0;
        }


        if (isShowingResultsScreen) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO" :
                      ((isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO-1" : "1UP");
            if (isPlayerTwoAI && !isCoopAIDemoActive && wasLastGameAIDemo && selectedGameMode === 'normal') label1P = "1UP";

            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage && !isAnyCoopPlayerGameOver) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO" :
                      ((isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO-1" : "1UP");
            if (isPlayerTwoAI && !isCoopAIDemoActive && wasLastGameAIDemo && selectedGameMode === 'normal') label1P = "1UP";

            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (isShowingPlayerGameOverMessage || isAnyCoopPlayerGameOver) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO-1" : "1UP";
             if (isPlayerTwoAI && !isCoopAIDemoActive && selectedGameMode === 'normal' && playerWhoIsGameOver === 1) label1P = "1UP";

            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (!isInGameState) { // Menu
            // ... (Logica P1 score en label blijft ongewijzigd) ...
            score1PValue = 0; sessionHighScore = highScore || 20000; label1P = "1UP";
            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else { // In game
            // ... (Logica P1 score en label blijft ongewijzigd) ...
            sessionHighScore = highScore || 0;
            const baseBlinkCondition = !isPaused && !isShowingCoopPlayersReady;

            if (isCoopAIDemoActive) {
                score1PValue = player1Score;
                sessionHighScore = Math.max(highScore, player1Score, player2Score);
                label1P = "DEMO-1";
                show1UPBlink = baseBlinkCondition && !isShowingIntro && player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage;
                show2UPBlink = baseBlinkCondition && !isShowingIntro && player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage;
                if (player1Score >= sessionHighScore && player1Score > 0 && !isPlayer1ShowingGameOverMessage) highScoreConditionMet = show1UPBlink;
                if (player2Score >= sessionHighScore && player2Score > 0 && player2Score >= player1Score && !isPlayer2ShowingGameOverMessage) highScoreConditionMet = show2UPBlink;

            } else if (!isManualControl) {
                score1PValue = score; sessionHighScore = Math.max(sessionHighScore, score); label1P = "DEMO";
                show1UPBlink = baseBlinkCondition && !isShowingIntro && !isShipCaptured && playerLives > 0 && !isAnyCoopPlayerGameOver;
                highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isAnyCoopPlayerGameOver;
            } else {
                label1P = "1UP";
                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    score1PValue = player1Score; sessionHighScore = Math.max(highScore, player1Score, player2Score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage;
                    show2UPBlink = baseBlinkCondition && !isShowingIntro && player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && (isPlayerTwoAI ? player2Lives > 0 : true) ;
                    if (player1Score >= sessionHighScore && player1Score > 0 && !isPlayer1ShowingGameOverMessage) highScoreConditionMet = show1UPBlink;
                    if (player2Score >= sessionHighScore && player2Score > 0 && player2Score >= player1Score && !isPlayer2ShowingGameOverMessage && (isPlayerTwoAI ? player2Lives > 0 : true)) highScoreConditionMet = show2UPBlink;
                } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                    score1PValue = (currentPlayer === 1) ? score : player1Score; sessionHighScore = Math.max(highScore, player1Score, player2Score, score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && currentPlayer === 1 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage;
                    show2UPBlink = baseBlinkCondition && !isShowingIntro && currentPlayer === 2 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage && (isPlayerTwoAI ? playerLives > 0 : true);
                    highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isShowingPlayerGameOverMessage;
                } else {
                    score1PValue = score; sessionHighScore = Math.max(sessionHighScore, score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage;
                    highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isShowingPlayerGameOverMessage;
                }
            }
        }


        isHighScoreBlinkingNow = false;
        if (highScoreConditionMet) {
            // ... (Logica high score blink blijft ongewijzigd) ...
            if (!isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop') ) {
                 isHighScoreBlinkingNow = (player1Score >= sessionHighScore && player1Score > 0 && show1UPBlink && !isPlayer1ShowingGameOverMessage) ||
                                       ((isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop')) && player2Score >= sessionHighScore && player2Score > 0 && show2UPBlink && !isPlayer2ShowingGameOverMessage);
                 if (!isCoopAIDemoActive && !isManualControl && !isPlayerTwoAI) isHighScoreBlinkingNow = show1UPBlink;
            }
            else if (isTwoPlayerMode && selectedGameMode === 'coop') {
                 isHighScoreBlinkingNow = (player1Score >= sessionHighScore && player1Score > 0 && show1UPBlink && !isPlayer1ShowingGameOverMessage) || (player2Score >= sessionHighScore && player2Score > 0 && show2UPBlink && !isPlayer2ShowingGameOverMessage);
            }
            else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                isHighScoreBlinkingNow = (score >= sessionHighScore && score > 0 && ((currentPlayer === 1 && show1UPBlink) || (currentPlayer === 2 && show2UPBlink && (!isPlayerTwoAI || (isPlayerTwoAI && playerLives > 0)) )) && !isShowingPlayerGameOverMessage);
            }
            else { isHighScoreBlinkingNow = show1UPBlink; }
        }


        if(typeof MARGIN_SIDE!=='undefined' && typeof MARGIN_TOP!=='undefined' && typeof SCORE_OFFSET_Y!=='undefined'){
            drawTopUiElement(label1P, score1PValue, 'left', MARGIN_SIDE, show1UPBlink);
            drawTopUiElement("HIGH SCORE", sessionHighScore, 'center', gameCanvas.width / 2, isHighScoreBlinkingNow);
            drawTopUiElement(label2P, score2PValue, 'right', gameCanvas.width - MARGIN_SIDE, show2UPBlink);
        }

        const inNormal2PResults = isShowingResultsScreen && isTwoPlayerMode && selectedGameMode === 'normal';
        // <<< NIEUWE VLAG voor 1P Normal Game Over / Results >>>
        const inNormal1PGameOverOrResults = (!isTwoPlayerMode || (isTwoPlayerMode && selectedGameMode !== 'coop')) && // Zeker zijn dat het GEEN COOP is
                                           (isShowingResultsScreen || (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage));

        if (typeof shipImage !== 'undefined' && typeof LIFE_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LIFE_ICON_SIZE !== 'undefined' && typeof LIFE_ICON_MARGIN_LEFT !== 'undefined' && typeof LIFE_ICON_SPACING !== 'undefined' ) {
            if (shipImage.complete && shipImage.naturalHeight !== 0) {
                const lifeIconY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE;
                let livesP1ToDisplay = 0;
                let livesP2ToDisplay = 0; // Voor P2 levens rechtsonder

                // --- Logica voor levensicoontjes P1 (links) ---
                if (inNormal2PResults) {
                    livesP1ToDisplay = defaultReserveLives;
                }
                // <<< START GEWIJZIGD DEEL (1P Levens) >>>
                else if (inNormal1PGameOverOrResults && !isTwoPlayerMode) { // Specifiek voor 1P Normal Game Over of Results
                    livesP1ToDisplay = defaultReserveLives; // Altijd 2 levens tonen
                }
                // <<< EINDE GEWIJZIGD DEEL (1P Levens) >>>
                else if (!isInGameState || isShowingScoreScreen || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage || gameOverSequenceStartTime > 0 ) {
                    // Algemene "out-of-active-gameplay" of "game over" states voor andere modes
                    livesP1ToDisplay = (player1Lives <= 0) ? 0 : defaultReserveLives;
                } else { // In actieve game logica
                    if (isTwoPlayerMode && selectedGameMode === 'coop') {
                        livesP1ToDisplay = player1Lives > 0 ? Math.max(0, player1Lives - 1) : 0;
                    } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                        if (currentPlayer === 1) {
                            livesP1ToDisplay = playerLives > 0 ? Math.max(0, playerLives - 1) : 0;
                        } else { // Huidige speler is 2, toon P1's reserve levens
                            livesP1ToDisplay = player1Lives > 0 ? Math.max(0, player1Lives - 1) : 0;
                        }
                    }
                    else { // 1P Actieve Game
                        livesP1ToDisplay = playerLives > 0 ? Math.max(0, playerLives - 1) : 0;
                    }
                }

                // Teken P1 levens links onder (indien > 0)
                if (livesP1ToDisplay > 0) {
                    let p1LivesStartX = LIFE_ICON_MARGIN_LEFT;
                    for (let i = 0; i < Math.min(livesP1ToDisplay, maxLivesIcons); i++) {
                        const currentIconX = p1LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                        gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                }
                // --- EINDE LOGICA P1 LEVENS ---


                // --- Logica voor levensicoontjes P2 (rechtsonder) - blijft grotendeels ongewijzigd ---
                if (!inNormal2PResults && !inNormal1PGameOverOrResults) { // <<< GEWIJZIGD: P2 Levens niet tonen in 1P Game Over/Results >>>
                    if (!isInGameState || isShowingScoreScreen || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage || gameOverSequenceStartTime > 0 ) {
                         if (isEffectivelyTwoPlayerUI || (!isInGameState && (!isPlayerSelectMode || selectedButtonIndex === 1 )) ) {
                            livesP2ToDisplay = (player2Lives <= 0) ? 0 : defaultReserveLives;
                        }
                    } else { // In game logic
                        if (isTwoPlayerMode && selectedGameMode === 'coop') {
                            livesP2ToDisplay = player2Lives > 0 ? Math.max(0, player2Lives - 1) : 0;
                        } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                            if (currentPlayer === 2) {
                                livesP2ToDisplay = playerLives > 0 ? Math.max(0, playerLives - 1) : 0;
                            } else {
                                livesP2ToDisplay = player2Lives > 0 ? Math.max(0, player2Lives - 1) : 0;
                            }
                        }
                    }

                     const p2LivesIconsToDraw = Math.min(livesP2ToDisplay, maxLivesIcons);
                     const showP2LivesInMenuGeneral = (!isInGameState &&
                                                ( (isPlayerSelectMode && selectedButtonIndex === 1) ||
                                                  (isGameModeSelectMode && (selectedButtonIndex === 0 || selectedButtonIndex === 1)) ||
                                                  (isFiringModeSelectMode && isTwoPlayerMode && !isPlayerTwoAI)
                                                )
                                               );
                     const showP2LivesInMenuForAICoop = (!isInGameState &&
                                                ( (isOnePlayerVsAIGameTypeSelectMode && selectedButtonIndex === 1) ||
                                                  (isFiringModeSelectMode && isPlayerTwoAI && selectedGameMode === 'coop')
                                                )
                                               );

                     if (p2LivesIconsToDraw > 0 && ( (isEffectivelyTwoPlayerUI && isInGameState) || showP2LivesInMenuGeneral || showP2LivesInMenuForAICoop ) ) {
                         const p2LivesTotalWidth = p2LivesIconsToDraw * LIFE_ICON_SIZE + Math.max(0, p2LivesIconsToDraw - 1) * LIFE_ICON_SPACING;
                         const p2LivesStartX = gameCanvas.width - (typeof LEVEL_ICON_MARGIN_RIGHT !== 'undefined' ? LEVEL_ICON_MARGIN_RIGHT : MARGIN_SIDE) - p2LivesTotalWidth;
                         for (let i = 0; i < p2LivesIconsToDraw; i++) {
                             const currentIconX = p2LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                             gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                         }
                     }
                } // Einde 'if (!inNormal2PResults && !inNormal1PGameOverOrResults)' voor P2 levens
            }
        }


        const iconTypes = [ { val: 50, img: level50Image }, { val: 30, img: level30Image }, { val: 20, img: level20Image }, { val: 10, img: level10Image }, { val: 5, img: level5Image }, { val: 1, img: level1Image } ];

        const drawLevelIcons = (levelValueToDisplay, isPlayer1_Coop_Or_SinglePlayer) => {
            // <<< START GEWIJZIGD DEEL (Level Iconen verbergen) >>>
            if ((inNormal2PResults && isPlayer1_Coop_Or_SinglePlayer) ||
                (inNormal1PGameOverOrResults && isPlayer1_Coop_Or_SinglePlayer && !isTwoPlayerMode) ) {
                return; // Verberg P1 level iconen in 2P Normal Results EN in 1P Normal Game Over/Results
            }
            // <<< EINDE GEWIJZIGD DEEL (Level Iconen verbergen) >>>

            let actualLevelValueForDisplay = Math.max(1, levelValueToDisplay);
            if (actualLevelValueForDisplay <= 0 || typeof LEVEL_ICON_MARGIN_BOTTOM === 'undefined' || typeof LEVEL_ICON_SIZE === 'undefined' || typeof LEVEL_ICON_MARGIN_RIGHT === 'undefined' || typeof LEVEL_ICON_SPACING === 'undefined') return;
            let remainingLevelVal = actualLevelValueForDisplay;
            let iconsToDrawList = [];
            let usedIconTypes = new Set();
            const canCompleteLevel = (startLevel, startIndex, currentUsedTypesSet) => {
                let tempRemaining = startLevel;
                let tempUsedTypes = new Set(currentUsedTypesSet);
                for (let i = startIndex; i < iconTypes.length; i++) {
                    const iconVal = iconTypes[i].val;
                    if (tempRemaining >= iconVal) {
                        const wouldExceedLimit = tempUsedTypes.size >= 3 && !tempUsedTypes.has(iconVal);
                        if (!wouldExceedLimit || iconVal === 1) {
                            const howMany = Math.floor(tempRemaining / iconVal);
                            tempRemaining -= howMany * iconVal;
                            tempUsedTypes.add(iconVal);
                            if (tempRemaining === 0) return true;
                        }
                    }
                }
                return tempRemaining === 0;
            };
            for (let i = 0; i < iconTypes.length - 1; i++) {
                const currentIcon = iconTypes[i];
                const iconVal = currentIcon.val;
                const iconImg = currentIcon.img;
                if (remainingLevelVal >= iconVal) {
                    const howManyCanFit = Math.floor(remainingLevelVal / iconVal);
                    for (let numCurrentIcon = howManyCanFit; numCurrentIcon >= 1; numCurrentIcon--) {
                        const potentialRemaining = remainingLevelVal - (numCurrentIcon * iconVal);
                        let hypotheticalUsedTypes = new Set(usedIconTypes);
                        hypotheticalUsedTypes.add(iconVal);
                        if (hypotheticalUsedTypes.size <= 3 || (hypotheticalUsedTypes.size > 3 && hypotheticalUsedTypes.has(1) && iconVal === 1) ) {
                             if (canCompleteLevel(potentialRemaining, i + 1, hypotheticalUsedTypes)) {
                                for (let k = 0; k < numCurrentIcon; k++) {
                                    iconsToDrawList.push(iconImg);
                                }
                                remainingLevelVal = potentialRemaining;
                                usedIconTypes.add(iconVal);
                                break;
                            }
                        }
                    }
                }
                if (remainingLevelVal === 0) break;
            }
            if (remainingLevelVal > 0) {
                for (let k = 0; k < remainingLevelVal; k++) {
                    iconsToDrawList.push(level1Image);
                }
                remainingLevelVal = 0;
            }
            if (iconsToDrawList.length === 0 && actualLevelValueForDisplay > 0) {
                for(let fb = 0; fb < actualLevelValueForDisplay; fb++) iconsToDrawList.push(level1Image);
            }
            if (iconsToDrawList.length === 0) return;
            const totalIcons = iconsToDrawList.length;
            const totalWidth = totalIcons * LEVEL_ICON_SIZE + Math.max(0, totalIcons - 1) * LEVEL_ICON_SPACING;
            const iconY = gameCanvas.height - LEVEL_ICON_MARGIN_BOTTOM - LEVEL_ICON_SIZE;
            let startX;
            let livesWidthForOffset = 0;
            const playerLivesForOffset = isPlayer1_Coop_Or_SinglePlayer ? player1Lives : player2Lives;
            const currentActivePlayerForOffset = isPlayer1_Coop_Or_SinglePlayer ? 1 : 2;
            let numLifeIconsDrawn = 0;
            const isGameOverOrResults = gameOverSequenceStartTime > 0 || isShowingResultsScreen ||
                                     (isShowingPlayerGameOverMessage && playerWhoIsGameOver === currentActivePlayerForOffset) ||
                                     (isPlayer1ShowingGameOverMessage && isPlayer1_Coop_Or_SinglePlayer) ||
                                     (isPlayer2ShowingGameOverMessage && !isPlayer1_Coop_Or_SinglePlayer);

            if (!isInGameState || isShowingScoreScreen || isGameOverOrResults) {
                if (inNormal2PResults && isPlayer1_Coop_Or_SinglePlayer) {
                    numLifeIconsDrawn = defaultReserveLives;
                } else if (inNormal2PResults && !isPlayer1_Coop_Or_SinglePlayer) {
                    numLifeIconsDrawn = 0;
                }
                // <<< START GEWIJZIGD DEEL (Level icon offset voor 1P) >>>
                else if (inNormal1PGameOverOrResults && isPlayer1_Coop_Or_SinglePlayer && !isTwoPlayerMode) {
                    // Voor 1P Normal Game Over/Results, baseer offset op de 2 getoonde levens.
                    numLifeIconsDrawn = defaultReserveLives;
                }
                // <<< EINDE GEWIJZIGD DEEL (Level icon offset voor 1P) >>>
                else {
                    numLifeIconsDrawn = (playerLivesForOffset <= 0) ? 0 : defaultReserveLives;
                }
            } else if (isInGameState) { // In-game
                 const actualPlayerLivesInGame = (isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === currentActivePlayerForOffset) ? playerLives : playerLivesForOffset;
                 numLifeIconsDrawn = actualPlayerLivesInGame > 0 ? Math.max(0, actualPlayerLivesInGame - 1) : 0;
            }
            numLifeIconsDrawn = Math.min(numLifeIconsDrawn, maxLivesIcons);


            if (numLifeIconsDrawn > 0) {
                livesWidthForOffset = numLifeIconsDrawn * LIFE_ICON_SIZE + (numLifeIconsDrawn -1) * LIFE_ICON_SPACING;
            } else {
                livesWidthForOffset = -LIFE_ICON_SPACING; // Als er geen levensicoontjes zijn, geen extra gap
            }


            if (isTwoPlayerMode && selectedGameMode === 'coop' ) {
                const coopLevelIconOffset = 15;
                if (isPlayer1_Coop_Or_SinglePlayer) {
                    startX = LIFE_ICON_MARGIN_LEFT + livesWidthForOffset + coopLevelIconOffset;
                } else {
                    const p2LivesStartXArea = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - livesWidthForOffset;
                    startX = p2LivesStartXArea - totalWidth - coopLevelIconOffset;
                }
            } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                const normalLevelIconOffset = 15;
                 if (isPlayer1_Coop_Or_SinglePlayer) {
                    startX = LIFE_ICON_MARGIN_LEFT + livesWidthForOffset + normalLevelIconOffset;
                } else {
                    const p2LivesStartXArea = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - livesWidthForOffset;
                    startX = p2LivesStartXArea - totalWidth - normalLevelIconOffset;
                }
            } else { // 1P
                 startX = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - totalWidth;
            }

            let currentX = startX;
            for (const iconImage of iconsToDrawList) {
                if (iconImage && iconImage.complete && iconImage.naturalHeight !== 0) {
                    gameCtx.drawImage(iconImage, Math.round(currentX), Math.round(iconY), LEVEL_ICON_SIZE, LEVEL_ICON_SIZE);
                }
                currentX += LEVEL_ICON_SIZE + LEVEL_ICON_SPACING;
            }
        };

        // Bepaal welke level waarde getoond moet worden voor P1 en P2
        let p1LevelToDraw, p2LevelToDraw;

        if (isInGameState && !isShowingPlayerGameOverMessage && !isPlayer1ShowingGameOverMessage && !isPlayer2ShowingGameOverMessage && gameOverSequenceStartTime === 0) {
            if (isTwoPlayerMode && selectedGameMode === 'normal') {
                p1LevelToDraw = (currentPlayer === 1) ? level : player1MaxLevelReached;
                p2LevelToDraw = (currentPlayer === 2) ? level : player2MaxLevelReached;
            } else if (isTwoPlayerMode && selectedGameMode === 'coop') {
                p1LevelToDraw = player1Lives > 0 ? level : player1MaxLevelReached;
                p2LevelToDraw = player2Lives > 0 ? level : player2MaxLevelReached;
            } else {
                p1LevelToDraw = level;
            }
        } else { // Menu, Game Over, Results
            p1LevelToDraw = player1MaxLevelReached;
            if (isEffectivelyTwoPlayerUI || isTwoPlayerMode) {
                p2LevelToDraw = player2MaxLevelReached;
            }
        }

        drawLevelIcons(Math.max(1, p1LevelToDraw), true); // Teken voor P1 (links), tenzij verborgen
        if (isEffectivelyTwoPlayerUI || isTwoPlayerMode) { // Als het een 2-speler context is
             if (typeof p2LevelToDraw === 'number' && p2LevelToDraw > 0) {
                 drawLevelIcons(Math.max(1, p2LevelToDraw), false); // Teken voor P2 (rechts)
             } else if (player2MaxLevelReached > 0) {
                 drawLevelIcons(Math.max(1, player2MaxLevelReached), false); // Fallback naar max level P2
             }
        }

        gameCtx.restore();

        // --- STAP 1.6: Teken Spelersschip (Hoofd + Dual) ---
        // ... (Deze sectie blijft ongewijzigd) ...
        gameCtx.save();
        let drawMenuShip = false;
        let gameIsEffectivelyOverOrInMenu = !isInGameState || isShowingScoreScreen || isShowingResultsScreen || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage;

        if (gameIsEffectivelyOverOrInMenu) {
            drawMenuShip = true;
        }

        const isShowingCSBonusScreen = showCsBonusScoreMessage || showPerfectMessage;

        if (drawMenuShip) {
            const menuShipX = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2);
            const menuShipY = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
            if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                gameCtx.drawImage(shipImage, menuShipX, menuShipY, SHIP_WIDTH, SHIP_HEIGHT);
            } else {
                gameCtx.fillStyle = "blue"; gameCtx.fillRect(menuShipX, menuShipY, SHIP_WIDTH, SHIP_HEIGHT);
            }
        } else if (isInGameState && !isShowingPlayerGameOverMessage && !isPlayer1ShowingGameOverMessage && !isPlayer2ShowingGameOverMessage && gameOverSequenceStartTime === 0) {
            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                const p1ActiveAndAlive = ship1 && player1Lives > 0;
                const p2ActiveAndAlive = ship2 && player2Lives > 0;

                if (p1ActiveAndAlive && (!isPlayer1ShipCaptured || (isPlayer1ShipCaptured && !isShowingCaptureMessage))) {
                    let shouldDrawP1 = true;
                    if ((isPlayer1Invincible || isPlayer1WaitingForRespawn) && !isShowingCoopPlayersReady && !isShowingCaptureMessage) {
                        const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                        if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP1 = false;
                    }
                    if (isShowingCSBonusScreen) {
                        if (isCoopAIDemoActive && !p2ActiveAndAlive) {  }
                        else if (isCoopAIDemoActive && p1ActiveAndAlive && p2ActiveAndAlive) {  }
                        else if (isCoopAIDemoActive) { shouldDrawP1 = false; }
                    }


                    if (shouldDrawP1) {
                        const shipDrawX = ship1.x; const shipDrawY = ship1.y;
                        if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                            gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height);
                            if (player1IsDualShipActive) { gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship1.width, ship1.height); }
                        } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height); }
                    }
                }
                if (p2ActiveAndAlive && (!isPlayer2ShipCaptured || (isPlayer2ShipCaptured && !isShowingCaptureMessage))) {
                     let shouldDrawP2 = true;
                    if ((isPlayer2Invincible || isPlayer2WaitingForRespawn) && !isShowingCoopPlayersReady && !isShowingCaptureMessage) {
                        const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                        if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP2 = false;
                    }
                    if (isShowingCSBonusScreen) {
                        if (isCoopAIDemoActive) {
                            if (!p1ActiveAndAlive) {  }
                            else if (p1ActiveAndAlive && p2ActiveAndAlive) {  }
                            else { shouldDrawP2 = false; }
                        }
                    }

                    if (shouldDrawP2) {
                        const shipDrawX = ship2.x; const shipDrawY = ship2.y;
                        if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                            gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship2.width, ship2.height);
                            if (player2IsDualShipActive) { gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship2.width, ship2.height); }
                        } else { gameCtx.fillStyle = "green"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship2.width, ship2.height); }
                    }
                }
            } else {
                 if (ship && playerLives > 0 && !isShipCaptured && !isShowingCaptureMessage) {
                    let shouldDrawShip = true;
                    if (isInvincible || isWaitingForRespawn) {
                        const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                        if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawShip = false;
                    }
                     if (shouldDrawShip && !(isShowingCSBonusScreen && (!isManualControl || (isPlayerTwoAI && selectedGameMode==='normal') ) && !isCoopAIDemoActive )) {
                        let shipDrawX = ship.x;
                        let shouldCenterSingleShipIntro = (isShowingIntro && (!isManualControl || (isPlayerTwoAI && selectedGameMode === 'normal')) && selectedGameMode !== 'coop') && !isDualShipActive;
                        if (shouldCenterSingleShipIntro) {
                            shipDrawX = Math.round(gameCanvas.width / 2 - ship.width / 2);
                        }
                        const shipDrawY = ship.y;
                        if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                            gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height);
                            if (isDualShipActive) {
                                gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship.width, ship.height);
                            }
                        } else {
                            gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height);
                        }
                    }
                }
            }
        }
        // Vallende schepen
        if (fallingShips.length > 0 && typeof shipImage !== 'undefined' && shipImage.complete) { fallingShips.forEach(fs => { if (fs) { gameCtx.save(); const centerX = fs.x + fs.width / 2; const centerY = fs.y + fs.height / 2; gameCtx.translate(centerX, centerY); gameCtx.rotate(fs.rotation || 0); const drawX = -fs.width / 2; const drawY = -fs.height / 2; const drawW = fs.width; const drawH = fs.height; gameCtx.drawImage(shipImage, drawX, drawY, drawW, drawH); if (typeof fs.tintProgress === 'number' && fs.tintProgress > 0.01) { gameCtx.save(); gameCtx.globalAlpha = fs.tintProgress; gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(drawX, drawY, drawW, drawH); gameCtx.restore(); } gameCtx.restore(); } }); }
        gameCtx.restore();


        // --- STAP 2: State-specifieke content (Menu / Game / Score) ---
        // ... (Rest van de renderGame functie blijft ongewijzigd) ...
        if (!isInGameState) {
             if (isShowingScoreScreen) {
                if (typeof LIFE_ICON_SIZE !== 'undefined') {
                    gameCtx.save();
                    const centerX = gameCanvas.width / 2;
                    let scoreScreenBaseY = gameCanvas.height * 0.25 + SCORE_SCREEN_VERTICAL_OFFSET + SCORE_SCREEN_LINE_V_SPACING;
                    let alignedIconStartX = 0;
                    let yPos1 = scoreScreenBaseY + 0;
                    drawCanvasText("PUSH START BUTTON", centerX, yPos1 - 30, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_TOP, 'center', 'middle', true);
                    let yPos2 = yPos1 + SCORE_SCREEN_LINE_V_SPACING * 1.8;
                    const text1 = ` 1ST LIFE BONUS FOR ${EXTRA_LIFE_THRESHOLD_1} PTS`;
                    gameCtx.font = SCORE_SCREEN_TEXT_FONT;
                    const text1Width = gameCtx.measureText(text1).width;
                    const totalWidth1 = LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING + text1Width;
                    alignedIconStartX = (centerX - totalWidth1 / 2) - 30;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                        gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos2 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                    drawCanvasText(text1, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos2, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos3 = yPos2 + SCORE_SCREEN_LINE_V_SPACING * 1.0;
                    const text2 = ` 2ND LIFE BONUS FOR ${EXTRA_LIFE_THRESHOLD_2} PTS`;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                        gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos3 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                    drawCanvasText(text2, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos3, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos4 = yPos3 + SCORE_SCREEN_LINE_V_SPACING * 1.0;
                    const text3 = ` EXT LIFE FOR EVERY ${RECURRING_EXTRA_LIFE_INTERVAL} PTS`;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) {
                        gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos4 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                    drawCanvasText(text3, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos4, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos5 = yPos4 + SCORE_SCREEN_LINE_V_SPACING * 1.8;
                    drawCanvasText("2025   Platini2000(c)   LTD", centerX - 10, yPos5 + 30, MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', false);
                    gameCtx.restore();
                }
             } else {
                gameCtx.save(); const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height; const canvasCenterX = canvasWidth / 2;
                if (selectedButtonIndex === -1 &&
                    (isPlayerSelectMode || isOnePlayerGameTypeSelectMode || isOnePlayerVsAIGameTypeSelectMode || isGameModeSelectMode || isFiringModeSelectMode ||
                     (!isPlayerSelectMode && !isOnePlayerGameTypeSelectMode && !isOnePlayerVsAIGameTypeSelectMode && !isGameModeSelectMode && !isFiringModeSelectMode) )) {
                    selectedButtonIndex = 0;
                }

                let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT; let actualLogoWidth = actualLogoHeight * (logoImage.naturalWidth / logoImage.naturalHeight || 1); if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR; actualLogoWidth = logoImage.naturalWidth * LOGO_SCALE_FACTOR; } const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT); const totalContentHeightForLayout = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight; let groupStartYForLayout = (canvasHeight - totalContentHeightForLayout) / 2 - 70; groupStartYForLayout += MENU_GENERAL_Y_OFFSET; const logoDrawX = canvasCenterX - actualLogoWidth / 2; const logoDrawY = groupStartYForLayout + MENU_LOGO_EXTRA_Y_OFFSET; if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { gameCtx.drawImage(logoImage, Math.round(logoDrawX), Math.round(logoDrawY), actualLogoWidth, actualLogoHeight); } else { drawCanvasText("LOGO", canvasCenterX, logoDrawY + actualLogoHeight / 2, "30px Arial", "grey"); }

                if (isPlayerSelectMode) {
                    drawCanvasButton("PLAYER 1", 0, selectedButtonIndex === 0);
                    drawCanvasButton("PLAYER 2", 1, selectedButtonIndex === 1);
                } else if (isOnePlayerGameTypeSelectMode) {
                    drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0);
                    drawCanvasButton("GAME Vs AI", 1, selectedButtonIndex === 1);
                } else if (isOnePlayerVsAIGameTypeSelectMode) {
                    drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0);
                    drawCanvasButton("CO-OP GAME", 1, selectedButtonIndex === 1);
                } else if (isGameModeSelectMode) {
                    drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0);
                    drawCanvasButton("CO-OP GAME", 1, selectedButtonIndex === 1);
                } else if (isFiringModeSelectMode) {
                    drawCanvasButton("EASY", 0, selectedButtonIndex === 0);
                    drawCanvasButton("NORMAL", 1, selectedButtonIndex === 1);
                } else {
                    drawCanvasButton("START GAME", 0, selectedButtonIndex === 0);
                    drawCanvasButton("GAME EXIT", 1, selectedButtonIndex === 1);
                }

                const exitButtonRect = getMenuButtonRect(1); let subtitleCenterY; if (exitButtonRect) { subtitleCenterY = exitButtonRect.y + exitButtonRect.height + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); } else { subtitleCenterY = groupStartYForLayout + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); } drawCanvasText( MENU_SUBTITLE_TEXT, canvasCenterX - 1, Math.round(subtitleCenterY), MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', true ); gameCtx.restore();
            }
        } else {
            const noGlobalGameOverOrResults = gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShowingResultsScreen;
            // isAnyCoopPlayerGameOver is defined in UI section.

            if (noGlobalGameOverOrResults || isAnyCoopPlayerGameOver) {
                 gameCtx.save();
                 let showBullets = !showReadyMessage && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !isCsCompletionDelayActive && !isShowingIntro && !isShowingCaptureMessage && !isShowingCoopPlayersReady && !isAnyCoopPlayerGameOver;
                 if (showBullets) { bullets.forEach(b => { if (b) { if (typeof bulletImage !== 'undefined' && bulletImage.complete) { gameCtx.drawImage(bulletImage, Math.round(b.x), Math.round(b.y), b.width, b.height); } else { gameCtx.fillStyle = "yellow"; gameCtx.fillRect(Math.round(b.x), Math.round(b.y), b.width, b.height); } } }); enemyBullets.forEach(eb => { if (eb) { if (typeof enemyBulletImage !== 'undefined' && enemyBulletImage.complete && enemyBulletImage.naturalWidth > 0) { gameCtx.drawImage(enemyBulletImage, Math.round(eb.x), Math.round(eb.y), eb.width, eb.height); } else { gameCtx.fillStyle = "white"; gameCtx.fillRect(Math.round(eb.x), Math.round(eb.y), eb.width, eb.height); } } }); }

                 if (!isShowingCoopPlayersReady) {
                    enemies.forEach(e => { if (e && e.y < gameCanvas.height + e.height * 2 && e.y > -e.height * 2) { gameCtx.save(); try { let currentEnemyImage = null; let fallbackColor = "grey"; const useSecondFrame = !isPaused && (now % (ENEMY_ANIMATION_INTERVAL_MS * 2)) >= ENEMY_ANIMATION_INTERVAL_MS; if (e.type === ENEMY3_TYPE) { currentEnemyImage = useSecondFrame ? bossGalagaImage2 : bossGalagaImage; fallbackColor = "purple"; } else if (e.type === ENEMY2_TYPE) { currentEnemyImage = useSecondFrame ? butterflyImage2 : butterflyImage; fallbackColor = "cyan"; } else { currentEnemyImage = useSecondFrame ? beeImage2 : beeImage; fallbackColor = "red"; } const drawX = Math.round(e.x); const drawY = Math.round(e.y); const drawW = e.width; const drawH = e.height; const needsTint = (e.type === ENEMY3_TYPE && e.isDamaged); const shouldRotateEnemy = !isPaused && (e.state === 'attacking' || e.state === 'following_bezier_path' || e.state === 'following_entrance_path') && e.y > -e.height * 0.5 && (Math.abs(e.velocityX) > 0.1 || Math.abs(e.velocityY) > 0.1); const shouldDrawCapturedShipAnim = e.state === 'showing_capture_message' && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.capturedShipDimensions && typeof e.capturedShipX === 'number' && typeof e.capturedShipY === 'number' && typeof e.captureAnimationRotation === 'number'; const shouldDrawStaticCapturedShip = e.state !== 'showing_capture_message' && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.capturedShipDimensions; const capturedW = (shouldDrawCapturedShipAnim || shouldDrawStaticCapturedShip) ? e.capturedShipDimensions.width : 0; const capturedH = (shouldDrawCapturedShipAnim || shouldDrawStaticCapturedShip) ? e.capturedShipDimensions.height : 0; let capturedX = 0; let capturedY = 0; if (shouldDrawCapturedShipAnim) { capturedX = Math.round(e.capturedShipX); capturedY = Math.round(e.capturedShipY); } else if (shouldDrawStaticCapturedShip) { capturedX = Math.round(e.x + CAPTURED_SHIP_OFFSET_X); capturedY = Math.round(e.y + CAPTURED_SHIP_OFFSET_Y); } const drawEnemyAndTint = (imgX, imgY, imgW, imgH) => { if (typeof currentEnemyImage !== 'undefined' && currentEnemyImage.complete && currentEnemyImage.naturalHeight !== 0) { gameCtx.drawImage(currentEnemyImage, imgX, imgY, imgW, imgH); } else { gameCtx.fillStyle = fallbackColor; gameCtx.fillRect(imgX, imgY, imgW, imgH); } if (needsTint) { gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillStyle = 'rgba(0, 0, 139, 0.5)'; gameCtx.fillRect(imgX, imgY, imgW, imgH); gameCtx.globalCompositeOperation = 'source-over'; } }; if (shouldRotateEnemy) { const centerX = drawX + drawW / 2; const centerY = drawY + drawH / 2; gameCtx.translate(centerX, centerY); let angle = Math.atan2(e.velocityY, e.velocityX) + Math.PI / 2; if (e.type === ENEMY3_TYPE && e.state === 'attacking') angle += Math.PI; gameCtx.rotate(angle); drawEnemyAndTint(-drawW / 2, -drawH / 2, drawW, drawH); if (shouldDrawStaticCapturedShip && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.globalAlpha = 0.8; const rotatedOffsetX = CAPTURED_SHIP_OFFSET_X; const rotatedOffsetY = CAPTURED_SHIP_OFFSET_Y; gameCtx.drawImage(shipImage, rotatedOffsetX - capturedW / 2, rotatedOffsetY - capturedH / 2, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(rotatedOffsetX - capturedW / 2, rotatedOffsetY - capturedH / 2, capturedW, capturedH); gameCtx.restore(); } gameCtx.rotate(-angle); gameCtx.translate(-centerX, -centerY); } else { drawEnemyAndTint(drawX, drawY, drawW, drawH); if (shouldDrawStaticCapturedShip && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.globalAlpha = 0.8; gameCtx.drawImage(shipImage, capturedX, capturedY, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(capturedX, capturedY, capturedW, capturedH); gameCtx.restore(); } } if (shouldDrawCapturedShipAnim && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.save(); const animCenterX = capturedX + capturedW / 2; const animCenterY = capturedY + capturedH / 2; gameCtx.translate(animCenterX, animCenterY); gameCtx.rotate(e.captureAnimationRotation); gameCtx.globalAlpha = 0.8; gameCtx.drawImage(shipImage, -capturedW / 2, -capturedH / 2, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(-capturedW / 2, -capturedH / 2, capturedW, capturedH); gameCtx.restore(); gameCtx.restore(); } } catch (drawError) { console.error(`Error drawing enemy:`, drawError); gameCtx.fillStyle = "orange"; gameCtx.fillRect(Math.round(e.x), Math.round(e.y), e.width, e.height); } finally { gameCtx.restore(); } } });
                 }
                 if (captureBeamActive && capturingBossId && captureBeamProgress > 0 && !isShowingCoopPlayersReady) { gameCtx.save(); const pulseAlpha = 0.4 + (Math.sin(now * CAPTURE_BEAM_PULSE_SPEED) + 1) / 2 * 0.6; const fadeAlpha = captureBeamProgress; gameCtx.globalAlpha = fadeAlpha * pulseAlpha; const capturingBoss = enemies.find(e => e.id === capturingBossId); if (capturingBoss) { const beamSourceX = capturingBoss.x + BOSS_WIDTH / 2; const beamVisualStartY = capturingBoss.y + BOSS_HEIGHT; const beamVisualEndY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE - 10; const topWidth = BOSS_WIDTH * CAPTURE_BEAM_WIDTH_TOP_FACTOR; const bottomWidth = SHIP_WIDTH * CAPTURE_BEAM_WIDTH_BOTTOM_FACTOR; if (beamVisualStartY < beamVisualEndY) { const grad = gameCtx.createLinearGradient(beamSourceX, beamVisualStartY, beamSourceX, beamVisualEndY); grad.addColorStop(0, CAPTURE_BEAM_COLOR_START); grad.addColorStop(1, CAPTURE_BEAM_COLOR_END); gameCtx.fillStyle = grad; gameCtx.beginPath(); gameCtx.moveTo(beamSourceX - topWidth / 2, beamVisualStartY); gameCtx.lineTo(beamSourceX + topWidth / 2, beamVisualStartY); gameCtx.lineTo(beamSourceX + bottomWidth / 2, beamVisualEndY); gameCtx.lineTo(beamSourceX - bottomWidth / 2, beamVisualEndY); gameCtx.closePath(); gameCtx.fill(); } } gameCtx.restore(); }
                 if (!isShowingCoopPlayersReady) { renderExplosions(); renderFloatingScores(); renderHitSparks(); }

                 let messageDrawnThisCycle = false;
                 const midScreenY = gameCanvas.height / 2;
                 const midScreenX = gameCanvas.width / 2;
                 const hitsText = `NUMBER OF HITS ${challengingStageEnemiesHit}`;
                 const clearBonusText = `BONUS ${scoreEarnedThisCS}`;
                 const lineSpacingGameOver = RESULTS_LINE_V_SPACING_SINGLE;

                 if (isPaused) {
                    drawCanvasText("PAUSED", midScreenX, midScreenY, PAUSE_TEXT_FONT, PAUSE_TEXT_COLOR, 'center', 'middle', PAUSE_TEXT_SHADOW);
                    messageDrawnThisCycle = true;
                 }
                 else if (isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage)) {
                    const messageCenterY_CoopGO = gameCanvas.height * 0.45;
                    if (isPlayer1ShowingGameOverMessage && !isPlayer2ShowingGameOverMessage) {
                        const p1goLabel = isCoopAIDemoActive ? "DEMO-1" : (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? "PLAYER 1" : "PLAYER 1");
                        drawCanvasText(p1goLabel.toUpperCase(), midScreenX, messageCenterY_CoopGO - lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                        drawCanvasText("GAME OVER", midScreenX, messageCenterY_CoopGO + lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                        messageDrawnThisCycle = true;
                    } else if (isPlayer2ShowingGameOverMessage && !isPlayer1ShowingGameOverMessage) {
                        const p2goLabel = isCoopAIDemoActive ? "DEMO-2" : (isPlayerTwoAI ? "AI PLAYER 2" : "PLAYER 2");
                        drawCanvasText(p2goLabel.toUpperCase(), midScreenX, messageCenterY_CoopGO - lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                        drawCanvasText("GAME OVER", midScreenX, messageCenterY_CoopGO + lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                        messageDrawnThisCycle = true;
                    }
                 }
                 else if (isShowingCoopPlayersReady) {
                    const coopReadyText = isCoopAIDemoActive ? "DEMO PLAYERS READY!" : ((isPlayerTwoAI && selectedGameMode === 'coop') ? "PLAYER & AI READY!" : "PLAYERS READY!");
                    drawCanvasText(coopReadyText, midScreenX, midScreenY, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); messageDrawnThisCycle = true;
                 }
                 else if (isShowingCaptureMessage) {
                    drawCanvasText("FIGHTER CAPTURED", midScreenX, midScreenY, INTRO_TEXT_FONT, "red", 'center', 'middle', true);
                    messageDrawnThisCycle = true;
                 }
                 else if (!isManualControl && isInGameState && isShowingDemoText) {
                    const isBlockingMessageActiveForDemoText = isShowingIntro ||
                                              showCsBonusScoreMessage || showPerfectMessage || showCsHitsMessage || showCSClearMessage ||
                                              showExtraLifeMessage ||
                                              showReadyMessage ||
                                              isCsCompletionDelayActive;

                     if (!isBlockingMessageActiveForDemoText) {
                         const demoBlinkCycle = DEMO_TEXT_BLINK_CYCLE_MS;
                         const demoBlinkOn = DEMO_TEXT_BLINK_ON_MS;
                         if ((now % demoBlinkCycle) < demoBlinkOn) {
                             drawCanvasText("PUSH START BUTTON", midScreenX, midScreenY, DEMO_TEXT_LINE1_FONT, DEMO_TEXT_COLOR, 'center', 'middle', true);
                             messageDrawnThisCycle = true;
                         }
                     }
                 }

                 if (!messageDrawnThisCycle) {
                     if (showCsBonusScoreMessage || showPerfectMessage || showCsHitsMessage) { drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; if (showCsBonusScoreMessage || showPerfectMessage) { drawCanvasText("PERFECT !", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, PERFECT_TEXT_COLOR, 'center', 'middle', true); } if (showCsBonusScoreMessage) { drawCanvasText("SPECIAL BONUS 10000 PTS", midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_BONUS_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                     else if (showCSClearMessage) { drawCanvasText("STAGE CLEARED", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; if (showCsHitsForClearMessage) { drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); } if (showCsScoreForClearMessage) { drawCanvasText(clearBonusText, midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                     else if (showExtraLifeMessage) { drawCanvasText("EXTRA LIFE", midScreenX, midScreenY, INTRO_TEXT_FONT, EXTRA_LIFE_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; }
                     else if (isShowingIntro && !isShowingCoopPlayersReady) {
                        let introText = ""; let introColor = INTRO_TEXT_COLOR_NORMAL;
                        if (introStep === 1) {
                            if (!(selectedGameMode === 'coop' && level === 1)) {
                                introText = (!isManualControl && !isCoopAIDemoActive && !isPlayerTwoAI) ? "DEMO" :
                                            (isCoopAIDemoActive ? "DEMO-1" :
                                            ((isTwoPlayerMode && selectedGameMode === 'normal' && !isPlayerTwoAI) ? `PLAYER ${currentPlayer}` :
                                            ((isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL') ? `PLAYER ${currentPlayer}` : "PLAYER 1") ));
                                 if (isManualControl && isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) introText = "AI PLAYER 2";
                            }
                        }
                        else if (introStep === 2) { introText = "STAGE " + level; }
                        else if (introStep === 3) { introText = "CHALLENGING STAGE"; introColor = INTRO_TEXT_COLOR_CS_TEXT; if (!csIntroSoundPlayed) { playSound('entranceSound', false, 0.4); csIntroSoundPlayed = true; } }
                        if (introText) { drawCanvasText(introText, midScreenX, midScreenY, INTRO_TEXT_FONT, introColor, 'center', 'middle', true); messageDrawnThisCycle = true; }
                     }
                     else if (showReadyMessage) { drawCanvasText("READY?", midScreenX, midScreenY, INTRO_TEXT_FONT, READY_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; }
                 }
                 gameCtx.restore();
            }
            else {
                if (isShowingPlayerGameOverMessage && selectedGameMode === 'normal') {
                     const playerText = (isPlayerTwoAI && playerWhoIsGameOver === 2) ? `AI PLAYER 2` : `PLAYER ${playerWhoIsGameOver}`;
                     const lineSpacing = RESULTS_LINE_V_SPACING_SINGLE; const messageCenterY = gameCanvas.height * 0.45; drawCanvasText(playerText, gameCanvas.width / 2, messageCenterY - lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); drawCanvasText("GAME OVER", gameCanvas.width / 2, messageCenterY + lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                }
                else if (gameOverSequenceStartTime > 0) {
                    const elapsedTime = now - gameOverSequenceStartTime;
                    const isShowingGameOverText = elapsedTime < GAME_OVER_DURATION;
                    const isShowingResultsScreenActive = elapsedTime >= GAME_OVER_DURATION;

                    if (isShowingGameOverText && !isTwoPlayerMode && !isCoopAIDemoActive && !isPlayerTwoAI && selectedGameMode !== 'coop') {
                        drawCanvasText("GAME OVER", gameCanvas.width / 2, gameCanvas.height / 2, GAME_OVER_FONT, GAME_OVER_COLOR, 'center', 'middle', GAME_OVER_SHADOW);
                    } else if (isShowingGameOverText && isCoopAIDemoActive && player1Lives <= 0 && player2Lives <=0) {
                         drawCanvasText("GAME OVER", gameCanvas.width / 2, gameCanvas.height / 2, GAME_OVER_FONT, GAME_OVER_COLOR, 'center', 'middle', GAME_OVER_SHADOW);
                    }
                    else if (isShowingResultsScreenActive) {
                        gameCtx.save(); const centerX = gameCanvas.width / 2; const canvasWidth = gameCanvas.width; let initialY = RESULTS_START_Y + RESULTS_LINE_V_SPACING_SINGLE;
                        const drawPlayerResultsColumn = (playerIdentifier, scoreVal, shotsVal, hitsVal, ratioVal, lastLevel, columnX, startY) => {
                            let currentColumnY = startY; const STAGE_LABEL_COLOR = RESULTS_VALUE_COLOR_YELLOW; const LEVEL_NUMBER_COLOR = RESULTS_VALUE_COLOR_CYAN;
                            drawCanvasText("- RESULTS -", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_HEADER_COLOR, 'center', 'top', true); currentColumnY += getSubtitleApproxHeight(INTRO_TEXT_FONT) + RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText(playerIdentifier, columnX, currentColumnY, INTRO_TEXT_FONT, 'white', 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("STAGE", columnX, currentColumnY, INTRO_TEXT_FONT, STAGE_LABEL_COLOR, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8; drawCanvasText(lastLevel.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, LEVEL_NUMBER_COLOR, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("SCORE", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8; drawCanvasText(scoreVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("SHOTS FIRED", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8; drawCanvasText(shotsVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("NUMBER OF HITS", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8; drawCanvasText(hitsVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("HIT-MISS-RATIO", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8; drawCanvasText(ratioVal, columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += (RESULTS_LINE_V_SPACING_SINGLE * 1.5) - 10;
                            drawCanvasText("Platini2000(c) LTD", columnX, currentColumnY, RESULTS_FOOTER_FONT, RESULTS_FOOTER_COLOR, 'center', 'middle', false);
                        };
                        if (isTwoPlayerMode || (wasLastGameAIDemo && isPlayerTwoAI) ) {
                            const shots1 = player1ShotsFired || 0; const hits1 = player1EnemiesHit || 0; const ratio1 = shots1 > 0 ? Math.round((hits1 / shots1) * 100) + "%" : "0%";
                            const shots2 = player2ShotsFired || 0; const hits2 = player2EnemiesHit || 0; const ratio2 = shots2 > 0 ? Math.round((hits2 / shots2) * 100) + "%" : "0%";
                            const columnWidth = canvasWidth * 0.4; const columnGap = canvasWidth * 0.1; const leftColumnX = centerX - columnGap / 2 - columnWidth / 2 + (columnWidth * 0.1); const rightColumnX = centerX + columnGap / 2 + columnWidth / 2 - (columnWidth * 0.1);

                            const p1Identifier = (isCoopAIDemoActive && wasLastGameAIDemo) ? "DEMO-1" : "PLAYER 1";
                            let p2Identifier = "PLAYER 2";
                            if (isCoopAIDemoActive && wasLastGameAIDemo) p2Identifier = "DEMO-2";
                            else if (isPlayerTwoAI && wasLastGameAIDemo) p2Identifier = "AI PLAYER 2";
                            else if (isPlayerTwoAI && !wasLastGameAIDemo) p2Identifier = "AI PLAYER 2";

                            drawPlayerResultsColumn(p1Identifier, player1Score, shots1, hits1, ratio1, player1MaxLevelReached, leftColumnX, initialY);
                            drawPlayerResultsColumn(p2Identifier, player2Score, shots2, hits2, ratio2, player2MaxLevelReached, rightColumnX, initialY);

                            let winnerNum = 0;
                            let winnerLabel = "";
                            if (player1Score > player2Score) {
                                winnerNum = 1;
                                winnerLabel = p1Identifier;
                            } else if (player2Score > player1Score) {
                                winnerNum = 2;
                                winnerLabel = p2Identifier;
                            }

                            if (winnerNum > 0) {
                                let yPosForWinsText = initialY + getSubtitleApproxHeight(INTRO_TEXT_FONT) + RESULTS_LINE_V_SPACING_SINGLE * 2;
                                drawCanvasText(winnerLabel, centerX, yPosForWinsText, INTRO_TEXT_FONT, 'white', 'center', 'middle', true);
                                drawCanvasText("WINS", centerX, yPosForWinsText + RESULTS_LINE_V_SPACING_SINGLE, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', true);
                            }
                        } else {
                             const shotsValue = player1ShotsFired || 0; const hitsValue = player1EnemiesHit || 0; const finalScore = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !isPlayerTwoAI) ? score : player1Score; const finalLevel = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !isPlayerTwoAI) ? level : player1MaxLevelReached; const ratioValue = shotsValue > 0 ? Math.round((hitsValue / shotsValue) * 100) + "%" : "0%";
                             const playerIdentifier = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !isPlayerTwoAI) ? "DEMO" : "PLAYER 1";
                             drawPlayerResultsColumn(playerIdentifier, finalScore, shotsValue, hitsValue, ratioValue, finalLevel, centerX, initialY);
                        }
                        gameCtx.restore();
                    }
                }
            }
        }
    } catch (e) { console.error("Error in renderGame:", e, e.stack); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; try { if(gameCtx && gameCanvas) { gameCtx.fillStyle = 'red'; gameCtx.font = '20px sans-serif'; gameCtx.textAlign = 'center'; gameCtx.fillText('FATAL RENDER ERROR.', gameCanvas.width / 2, gameCanvas.height/2); } } catch(err) {} try { showMenuState(); } catch (menuErr) {} }
} // Einde renderGame


function hideCursor() { if (gameCanvas) { gameCanvas.style.cursor = 'none'; } mouseIdleTimerId = null; }

/**
 * Handles mouse move events on the canvas.
 */
function handleCanvasMouseMove(event) {
    if (!gameCanvas) return;

    if (isTouchActiveGame && isInGameState) {
        return;
    }

    clearTimeout(mouseIdleTimerId);
    mouseIdleTimerId = null;
    let currentCursorStyle = 'default';

    const isInAnyMenuState = !isInGameState && !isShowingScoreScreen;

    if (isInAnyMenuState) {
        if (typeof handleCanvasTouch === 'function') {
            handleCanvasTouch(event, 'move');
        }

        if (selectedButtonIndex !== -1) {
            currentCursorStyle = 'pointer';
        }
    } else {
        selectedButtonIndex = -1;
    }

    gameCanvas.style.cursor = currentCursorStyle;
    mouseIdleTimerId = setTimeout(hideCursor, 2000);

    if (!isInGameState) {
        const now = Date.now();
        if (now - lastMouseMoveResetTime > 500) {
            if (typeof startAutoDemoTimer === 'function' && selectedButtonIndex === -1) {
                 startAutoDemoTimer();
            }
            lastMouseMoveResetTime = now;
        }
    }
}


function mainLoop(timestamp) {
    try {
        drawStars(); if (retroGridCtx && retroGridCanvas) { drawRetroGrid(); } pollControllerForMenu();
        if (isInGameState && !isPaused) {
            if (!isManualControl && connectedGamepadIndex !== null) { const gamepads = navigator.getGamepads(); if (gamepads?.[connectedGamepadIndex]) { const gamepad = gamepads[connectedGamepadIndex]; const currentDemoButtonStates = gamepad.buttons.map(b => b.pressed); let anyButtonPressedNow = false; for (let i = 0; i < currentDemoButtonStates.length; i++) { if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue; if (currentDemoButtonStates[i] && !(previousDemoButtonStates[i] ?? false)) { anyButtonPressedNow = true; break; } } if (anyButtonPressedNow) { isCoopAIDemoActive = false; isPlayerTwoAI = false; showMenuState(); requestAnimationFrame(mainLoop); return; } previousDemoButtonStates = currentDemoButtonStates.slice(); } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; } } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; }

            if(typeof window.runSingleGameUpdate === 'function') {
                window.runSingleGameUpdate(timestamp);
            }
            else { console.error("FATAL: window.runSingleGameUpdate is not defined!"); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; showMenuState(); requestAnimationFrame(mainLoop); return; }

            if (gameOverSequenceStartTime > 0) { const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION; if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; } }
        } else if (isShowingScoreScreen) {
            if(typeof renderGame === 'function') {
                renderGame();
            }
        } else if (isInGameState && gameOverSequenceStartTime > 0) {
            if(typeof renderGame === 'function') {
                renderGame();
            }
            const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION; if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; }
        } else if (isInGameState && isPaused) {
            if(typeof renderGame === 'function') {
                renderGame();
            }
        } else if (isInGameState && isCsCompletionDelayActive) {
            if(typeof window.runSingleGameUpdate === 'function') window.runSingleGameUpdate(timestamp);
            else if (typeof renderGame === 'function') renderGame();
        } else if (isInGameState && (isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage) ) {
            if(typeof window.runSingleGameUpdate === 'function') window.runSingleGameUpdate(timestamp);
            else if (typeof renderGame === 'function') renderGame();
        }
        else { // Menu state
            if(typeof renderGame === 'function') {
                renderGame();
            }
        }
        mainLoopId = requestAnimationFrame(mainLoop);
    } catch (e) {
        console.error("!!! CRITICAL ERROR IN mainLoop:", e, e.stack); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; isPaused = false;
        stopAllGameSoundsInternal();
        isGridSoundPlaying = false;
        try { showMenuState(); } catch(menuErr) { console.error("Failed to return to menu after loop error:", menuErr); document.body.innerHTML = '<p style="color:white;">CRITICAL LOOP ERROR. Please refresh.</p>';}
    }
}

function startMainLoop() {
    if (mainLoopId === null) {
        gridOffsetY = 0;
        mainLoop();
    } else {
    }
}

function initializeGame() {
    try {
        if (typeof initializeDOMElements === 'function') {
            if (!initializeDOMElements()) {
                console.error("DOM element initialization failed."); return;
            }
        } else { console.error("initializeDOMElements function not found!"); return; }

        if (typeof window.loadHighScore === 'function') window.loadHighScore(); else if (typeof loadHighScore === 'function') loadHighScore(); else console.warn("loadHighScore function not found.");

        if (typeof window.defineNormalWaveEntrancePaths === 'function') window.defineNormalWaveEntrancePaths(); else if (typeof defineNormalWaveEntrancePaths === 'function') defineNormalWaveEntrancePaths(); else console.error("defineNormalWaveEntrancePaths not found!");
        if (typeof window.defineChallengingStagePaths === 'function') window.defineChallengingStagePaths(); else if (typeof defineChallengingStagePaths === 'function') defineChallengingStagePaths(); else console.error("defineChallengingStagePaths not found!");

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        if (gameCanvas) {
            gameCanvas.addEventListener('click', handleCanvasClick);
            gameCanvas.addEventListener('mousemove', handleCanvasMouseMove);
        } else { console.error("Cannot add canvas listeners: gameCanvas not found during init."); }
        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        window.addEventListener('resize', resizeCanvases);

        showMenuState();

        if (typeof resizeCanvases === 'function') {
            resizeCanvases();
        } else console.error("resizeCanvases not found!");

        startMainLoop();
    } catch (e) {
        console.error("FATAL INITIALIZATION ERROR:", e, e.stack);
        document.body.innerHTML = `<div style="color:white; padding: 20px; font-family: sans-serif;"><h1>Fatal Initialization Error</h1><p>The game could not be started. Please check the browser console (F12) for details.</p><p>Error: ${e.message}</p></div>`;
        if (mainLoopId) { cancelAnimationFrame(mainLoopId); mainLoopId = null; }
    }
}

window.addEventListener('load', initializeGame);

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---