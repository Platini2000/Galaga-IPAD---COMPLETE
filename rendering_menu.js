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
// --- DEEL 3      van 3 dit code blok    --- (Focus op renderGame voor CO-OP schip rendering)

function renderGame() {
    try {
        if (!gameCtx || !gameCanvas) { if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; return; }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        const now = Date.now();

        // --- STAP 1: Teken UI (Score, Levens, Level) ---
        // ... (UI rendering blijft ongewijzigd, maar moet later P1/P2 levens/scores tonen) ...
        // Voor nu focussen we op de schepen. De UI voor P2 levens/scores kan later worden toegevoegd.
        gameCtx.save();
        const UI_FONT="20px 'Press Start 2P'"; const LABEL_COLOR="red"; const SCORE_COLOR="white"; /* ... etc. ... */
        // ... (de drawTopUiElement en gerelateerde logica blijft zoals het was)
        let score1PValue, score2PValue, sessionHighScore, label1P;
        let show1UPBlink = false, show2UPBlink = false, highScoreConditionMet = false;
        // Logic to determine score1PValue, score2PValue, etc. (ongewijzigd voor nu, maar moet CO-OP scores reflecteren)
        if (isShowingResultsScreen) { /* ... */ }
        else if (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage) { /* ... */ }
        else if (isShowingPlayerGameOverMessage) { /* ... */ }
        else if (!isInGameState) { /* ... */ }
        else { /* ... */
            sessionHighScore = highScore || 0;
            if (!isManualControl) { /* AI ... */ }
            else if (isTwoPlayerMode && selectedGameMode === 'coop') { // CO-OP SCORES
                score1PValue = player1Score;
                score2PValue = player2Score;
                sessionHighScore = Math.max(highScore, player1Score, player2Score);
                label1P = "1UP";
                show1UPBlink = !isShowingIntro && !isPaused && player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn;
                show2UPBlink = !isShowingIntro && !isPaused && player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn;
                // High score blink: check if P1 of P2 de high score heeft
                if (player1Score >= sessionHighScore && player1Score > 0) highScoreConditionMet = show1UPBlink;
                if (player2Score >= sessionHighScore && player2Score > 0 && player2Score > player1Score) highScoreConditionMet = show2UPBlink; // P2 blinkt alleen als P2 de HS heeft en hoger is dan P1

            } else if (isTwoPlayerMode && selectedGameMode === 'normal') { // Alternating
                score1PValue = (currentPlayer === 1) ? score : player1Score;
                score2PValue = (currentPlayer === 2) ? score : player2Score;
                sessionHighScore = Math.max(highScore, player1Score, player2Score, score);
                label1P = "1UP";
                show1UPBlink = !isShowingIntro && !isPaused && currentPlayer === 1 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn;
                show2UPBlink = !isShowingIntro && !isPaused && currentPlayer === 2 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn;
                highScoreConditionMet = !isPaused && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore;
            } else { // 1P
                score1PValue = score; score2PValue = 0; /* ... */ label1P = "1UP"; /* ... */
            }
        }
        let isHighScoreBlinkingNow = false; if (highScoreConditionMet) { /* ... */ }
        if(typeof MARGIN_SIDE!=='undefined' && typeof MARGIN_TOP!=='undefined' && typeof SCORE_OFFSET_Y!=='undefined'){ drawTopUiElement(label1P, score1PValue, 'left', MARGIN_SIDE, show1UPBlink); drawTopUiElement("HIGH SCORE", sessionHighScore, 'center', gameCanvas.width / 2, isHighScoreBlinkingNow); drawTopUiElement("2UP", score2PValue, 'right', gameCanvas.width - MARGIN_SIDE, show2UPBlink); }

        // Levens iconen (moet P1 en P2 apart tonen in CO-OP)
        if (typeof shipImage !== 'undefined' && typeof LIFE_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LIFE_ICON_SIZE !== 'undefined' && typeof LIFE_ICON_MARGIN_LEFT !== 'undefined' && typeof LIFE_ICON_SPACING !== 'undefined') {
            if (shipImage.complete && shipImage.naturalHeight !== 0) {
                const lifeIconY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE;
                let livesP1ToDisplay = 0;
                let livesP2ToDisplay = 0; // Voor CO-OP

                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    if (player1Lives > 0) livesP1ToDisplay = Math.max(0, player1Lives -1); // -1 omdat actieve schip niet telt
                    if (player2Lives > 0) livesP2ToDisplay = Math.max(0, player2Lives -1);
                } else { // 1P of 2P Alternating
                     if (playerLives > 0) livesP1ToDisplay = Math.max(0, playerLives - 1);
                }
                // ... (verdere logica om P1 en P2 levens apart te tekenen)
                // Voor nu, alleen P1:
                const maxLivesIcons = 5;
                for (let i = 0; i < Math.min(livesP1ToDisplay, maxLivesIcons); i++) {
                    const currentIconX = LIFE_ICON_MARGIN_LEFT + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                    gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                }
                // Toon P2 levens rechtsonder in CO-OP
                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    const p2LivesStartX = gameCanvas.width - LIFE_ICON_MARGIN_RIGHT - (Math.min(livesP2ToDisplay, maxLivesIcons) * (LIFE_ICON_SIZE + LIFE_ICON_SPACING)) + LIFE_ICON_SPACING;
                     for (let i = 0; i < Math.min(livesP2ToDisplay, maxLivesIcons); i++) {
                        const currentIconX = p2LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                        gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                }
            }
        }
        // ... (level iconen ongewijzigd) ...
        gameCtx.restore();


        // --- STAP 1.6: Teken Spelersschip (Hoofd + Dual) ---
        gameCtx.save();
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            // Teken Schip 1 (P1)
            if (ship1 && player1Lives > 0 && !isPlayer1WaitingForRespawn && !isPlayer1ShipCaptured) {
                let shouldDrawP1 = true;
                if (isPlayer1Invincible) {
                    const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                    if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP1 = false;
                }
                if (shouldDrawP1) {
                    const shipDrawX = ship1.x;
                    const shipDrawY = ship1.y; // Y is al correct gezet
                    if (typeof shipImage !== 'undefined' && shipImage.complete) {
                        gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height);
                        if (player1IsDualShipActive) {
                             gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship1.width, ship1.height);
                        }
                    } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height); }
                }
            }
            // Teken Schip 2 (P2)
            if (ship2 && player2Lives > 0 && !isPlayer2WaitingForRespawn && !isPlayer2ShipCaptured) {
                let shouldDrawP2 = true;
                if (isPlayer2Invincible) {
                    const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                    if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP2 = false;
                }
                if (shouldDrawP2) {
                    const shipDrawX = ship2.x;
                    const shipDrawY = ship2.y;
                    if (typeof shipImage !== 'undefined' && shipImage.complete) {
                        gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship2.width, ship2.height);
                         if (player2IsDualShipActive) {
                             gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship2.width, ship2.height);
                        }
                    } else { gameCtx.fillStyle = "green"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship2.width, ship2.height); }
                }
            }
        } else { // 1P of 2P Alternating (gebruik het 'ship' object)
            if (ship && !isShowingCaptureMessage) {
                let shouldDrawShip = true;
                if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isInvincible) {
                    const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                    if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawShip = false;
                }
                if (shouldDrawShip) {
                    let shipDrawX = ship.x;

                    // --- START GEWIJZIGDE CENTRERINGSLOGICA VOOR INTRO ---
                    let isShipActuallyAIControlledDuringIntro = false;
                    if (isInGameState && isShowingIntro && (introStep === 1 || introStep === 2 || introStep === 3)) {
                        if (!isManualControl) { // Pure AI Demo
                            isShipActuallyAIControlledDuringIntro = true;
                        } else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) { // AI P2's beurt in 1P vs AI Normal
                            isShipActuallyAIControlledDuringIntro = true;
                        }
                        // In P1 vs AI Normal, als currentPlayer === 1, is het schip NIET AI-gestuurd, dus wordt het niet gecentreerd.
                    }

                    let shouldCenterSingleShip = (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0 || !isInGameState || isShowingScoreScreen || isShipActuallyAIControlledDuringIntro) && !isDualShipActive;
                    // --- EINDE GEWIJZIGDE CENTRERINGSLOGICA VOOR INTRO ---

                    if (shouldCenterSingleShip) { shipDrawX = Math.round(gameCanvas.width / 2 - ship.width / 2); }

                    const shipDrawY = ship.y; // Y is al correct
                    if (typeof shipImage !== 'undefined' && shipImage.complete) {
                        gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height);
                        if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isDualShipActive && !isShipCaptured) {
                            gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship.width, ship.height);
                        }
                    } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height); }
                }
            }
        }
        // Vallende schepen (ongewijzigd)
        if (fallingShips.length > 0 && typeof shipImage !== 'undefined' && shipImage.complete) { /* ... */ }
        gameCtx.restore();


        // --- STAP 2: State-specifieke content (Menu / Game / Score) ---
        if (!isInGameState) { // Menu of Score Screen
            // ... (Menu rendering logica zoals eerder gecorrigeerd, met logo en ondertitel altijd zichtbaar in menu states) ...
             if (isShowingScoreScreen) { /* ... score screen ... */ }
             else { // Hoofdmenu of een sub-menu (Player, Game Mode, Firing Mode)
                gameCtx.save();
                const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height; const canvasCenterX = canvasWidth / 2;
                if (selectedButtonIndex === -1 && (isPlayerSelectMode || isFiringModeSelectMode || isGameModeSelectMode || (!isPlayerSelectMode && !isFiringModeSelectMode && !isGameModeSelectMode))) { selectedButtonIndex = 0; }
                let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT; let actualLogoWidth = actualLogoHeight * (logoImage.naturalWidth / logoImage.naturalHeight || 1); if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR; actualLogoWidth = logoImage.naturalWidth * LOGO_SCALE_FACTOR; }
                const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT);
                const totalContentHeightForLayout = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight;
                let groupStartYForLayout = (canvasHeight - totalContentHeightForLayout) / 2 - 70; groupStartYForLayout += MENU_GENERAL_Y_OFFSET;
                const logoDrawX = canvasCenterX - actualLogoWidth / 2; const logoDrawY = groupStartYForLayout + MENU_LOGO_EXTRA_Y_OFFSET;
                if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { gameCtx.drawImage(logoImage, Math.round(logoDrawX), Math.round(logoDrawY), actualLogoWidth, actualLogoHeight); }
                else { drawCanvasText("LOGO", canvasCenterX, logoDrawY + actualLogoHeight / 2, "30px Arial", "grey"); }

                if (isGameModeSelectMode) { drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0); drawCanvasButton("CO-OP GAME", 1, selectedButtonIndex === 1); }
                else if (isFiringModeSelectMode) { drawCanvasButton("EASY", 0, selectedButtonIndex === 0); drawCanvasButton("NORMAL", 1, selectedButtonIndex === 1); }
                else if (isPlayerSelectMode) { drawCanvasButton("PLAYER 1", 0, selectedButtonIndex === 0); drawCanvasButton("PLAYER 2", 1, selectedButtonIndex === 1); }
                else { drawCanvasButton("START GAME", 0, selectedButtonIndex === 0); drawCanvasButton("GAME EXIT", 1, selectedButtonIndex === 1); }

                const exitButtonRect = getMenuButtonRect(1); let subtitleCenterY; if (exitButtonRect) { subtitleCenterY = exitButtonRect.y + exitButtonRect.height + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); } else { subtitleCenterY = groupStartYForLayout + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); }
                drawCanvasText( MENU_SUBTITLE_TEXT, canvasCenterX - 1, Math.round(subtitleCenterY), MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', true );
                gameCtx.restore();
            }
        } else { // --- Game bezig OF Game Over / Results ---
            // --- STAP 2.1: Gameplay Actief (of PAUSED) ---
            if (gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
                // ... (Rendering kogels, vijanden, capture beam, explosies, scores, sparks, berichten - ongewijzigd) ...
                 gameCtx.save();
                 let showBullets = !showReadyMessage && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !isCsCompletionDelayActive && !isShowingIntro && !isShowingCaptureMessage;
                 if (showBullets) { bullets.forEach(b => { /* ... */ }); enemyBullets.forEach(eb => { /* ... */ }); }
                 enemies.forEach(e => { /* ... */ });
                 if (captureBeamActive && capturingBossId && captureBeamProgress > 0) { /* ... */ }
                 renderExplosions(); renderFloatingScores(); renderHitSparks();
                 let messageDrawn = false; const midScreenY = gameCanvas.height / 2; /* ... etc. ... */
                 if (isPaused) { /* ... */ } else if (isShowingCaptureMessage) { /* ... */ } /* ... etc. ... */
                 gameCtx.restore();
            }
            // --- STAP 2.2: Game Over State (Player X of Final) ---
            else {
                // ... (Game Over / Results rendering - ongewijzigd) ...
                if (isShowingPlayerGameOverMessage) { /* ... */ }
                else if (gameOverSequenceStartTime > 0) { /* ... */ }
            }
        }
    } catch (e) { /* ... error handling (ongewijzigd) ... */ console.error("Error in renderGame:", e, e.stack); /* ... */ }
} // Einde renderGame

// ... (hideCursor, handleCanvasMouseMove, mainLoop, startMainLoop, initializeGame - ongewijzigd) ...

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---