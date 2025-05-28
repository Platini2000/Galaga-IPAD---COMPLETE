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
// --- DEEL 3      van 3 dit code blok    --- (Focus: UI in Normal 1P Results/Game Over - Links 2 levensicoontjes, Level icoontjes ZICHTBAAR)

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
        } else {
             label2P = "2UP";
             score2PValue = 0;
        }


        if (isShowingResultsScreen) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
        }
        else if (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage && !isAnyCoopPlayerGameOver) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
        }
        else if (isShowingPlayerGameOverMessage || isAnyCoopPlayerGameOver) {
            // ... (Logica P1 score en label blijft ongewijzigd) ...
        }
        else if (!isInGameState) { // Menu
            // ... (Logica P1 score en label blijft ongewijzigd) ...
        }
        else { // In game
            // ... (Logica P1 score en label blijft ongewijzigd) ...
        }


        isHighScoreBlinkingNow = false;
        if (highScoreConditionMet) {
            // ... (Logica high score blink blijft ongewijzigd) ...
        }


        if(typeof MARGIN_SIDE!=='undefined' && typeof MARGIN_TOP!=='undefined' && typeof SCORE_OFFSET_Y!=='undefined'){
            drawTopUiElement(label1P, score1PValue, 'left', MARGIN_SIDE, show1UPBlink);
            drawTopUiElement("HIGH SCORE", sessionHighScore, 'center', gameCanvas.width / 2, isHighScoreBlinkingNow);
            drawTopUiElement(label2P, score2PValue, 'right', gameCanvas.width - MARGIN_SIDE, show2UPBlink);
        }

        const inNormal2PResults = isShowingResultsScreen && isTwoPlayerMode && selectedGameMode === 'normal';
        const inNormal1PGameOverOrResults = (!isTwoPlayerMode && selectedGameMode === 'normal') &&
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
                else if (inNormal1PGameOverOrResults) { // Specifiek voor 1P Normal Game Over of Results
                    livesP1ToDisplay = defaultReserveLives; // Altijd 2 levens tonen
                }
                else if (!isInGameState || isShowingScoreScreen || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage || gameOverSequenceStartTime > 0 ) {
                    livesP1ToDisplay = (player1Lives <= 0) ? 0 : defaultReserveLives;
                } else { // In actieve game logica
                    if (isTwoPlayerMode && selectedGameMode === 'coop') {
                        livesP1ToDisplay = player1Lives > 0 ? Math.max(0, player1Lives - 1) : 0;
                    } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                        if (currentPlayer === 1) {
                            livesP1ToDisplay = playerLives > 0 ? Math.max(0, playerLives - 1) : 0;
                        } else {
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


                // --- Logica voor levensicoontjes P2 (rechtsonder) ---
                if (!inNormal2PResults && !inNormal1PGameOverOrResults) {
                    // ... (Deze P2 levens logica blijft ongewijzigd) ...
                }
            }
        }


        const iconTypes = [ { val: 50, img: level50Image }, { val: 30, img: level30Image }, { val: 20, img: level20Image }, { val: 10, img: level10Image }, { val: 5, img: level5Image }, { val: 1, img: level1Image } ];

        const drawLevelIcons = (levelValueToDisplay, isPlayer1_Coop_Or_SinglePlayer) => {
            // <<< START GEWIJZIGD DEEL (Level Iconen verbergen ALLEEN voor 2P Normal Results P1) >>>
            if (inNormal2PResults && isPlayer1_Coop_Or_SinglePlayer) {
                return; // Verberg P1 level iconen ALLEEN in 2P Normal Results
            }
            // <<< EINDE GEWIJZIGD DEEL >>>

            let actualLevelValueForDisplay = Math.max(1, levelValueToDisplay);
            if (actualLevelValueForDisplay <= 0 || typeof LEVEL_ICON_MARGIN_BOTTOM === 'undefined' || typeof LEVEL_ICON_SIZE === 'undefined' || typeof LEVEL_ICON_MARGIN_RIGHT === 'undefined' || typeof LEVEL_ICON_SPACING === 'undefined') return;
            let remainingLevelVal = actualLevelValueForDisplay;
            let iconsToDrawList = [];
            let usedIconTypes = new Set();
            const canCompleteLevel = (startLevel, startIndex, currentUsedTypesSet) => {
                // ... (Deze interne helper blijft ongewijzigd) ...
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
                // ... (Deze loop blijft ongewijzigd) ...
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
                else if (inNormal1PGameOverOrResults && isPlayer1_Coop_Or_SinglePlayer && !isTwoPlayerMode) { // <<< TOEGEVOEGD: Zorg voor correcte offset in 1P Game Over/Results >>>
                    numLifeIconsDrawn = defaultReserveLives;
                }
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
                livesWidthForOffset = -LIFE_ICON_SPACING;
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
                 // <<< SPECIFIEKE AANPASSING VOOR 1P LEVEL ICON OFFSET >>>
                 // Als het 1P is en het is game over/results, dan is numLifeIconsDrawn (voor de offset) gebaseerd op defaultReserveLives.
                 // De normale berekening voor 'startX' (hierboven voor 1P) houdt geen rekening met de levensicoontjes links.
                 // We moeten de startX dus corrigeren zodat het *naast* de levensicoontjes komt.
                 if (inNormal1PGameOverOrResults && isPlayer1_Coop_Or_SinglePlayer) {
                     startX = LIFE_ICON_MARGIN_LEFT + livesWidthForOffset + 15; // 15 is een arbitraire padding
                 }
                 // <<< EINDE SPECIFIEKE AANPASSING >>>
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
            // ... (Deze logica blijft ongewijzigd) ...
        } else { // Menu, Game Over, Results
            p1LevelToDraw = player1MaxLevelReached;
            if (isEffectivelyTwoPlayerUI || isTwoPlayerMode) {
                p2LevelToDraw = player2MaxLevelReached;
            }
        }

        drawLevelIcons(Math.max(1, p1LevelToDraw), true); // Teken voor P1 (links), tenzij verborgen
        if (isEffectivelyTwoPlayerUI || isTwoPlayerMode) {
             if (typeof p2LevelToDraw === 'number' && p2LevelToDraw > 0 && !inNormal1PGameOverOrResults) {
                 drawLevelIcons(Math.max(1, p2LevelToDraw), false);
             } else if (player2MaxLevelReached > 0 && !inNormal1PGameOverOrResults) {
                 drawLevelIcons(Math.max(1, player2MaxLevelReached), false);
             }
        }

        gameCtx.restore();

        // --- STAP 1.6: Teken Spelersschip (Hoofd + Dual) ---
        // ... (Deze sectie blijft ongewijzigd) ...

        // --- STAP 2: State-specifieke content (Menu / Game / Score) ---
        // ... (Rest van de renderGame functie blijft ongewijzigd) ...

    } catch (e) { console.error("Error in renderGame:", e, e.stack); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; try { if(gameCtx && gameCanvas) { gameCtx.fillStyle = 'red'; gameCtx.font = '20px sans-serif'; gameCtx.textAlign = 'center'; gameCtx.fillText('FATAL RENDER ERROR.', gameCanvas.width / 2, gameCanvas.height/2); } } catch(err) {} try { showMenuState(); } catch (menuErr) {} }
} // Einde renderGame


function hideCursor() { if (gameCanvas) { gameCanvas.style.cursor = 'none'; } mouseIdleTimerId = null; }

/**
 * Handles mouse move events on the canvas.
 */
function handleCanvasMouseMove(event) {
    // ... (Deze functie blijft ongewijzigd) ...
}


function mainLoop(timestamp) {
    // ... (Deze functie blijft ongewijzigd) ...
}

function startMainLoop() {
    // ... (Deze functie blijft ongewijzigd) ...
}

function initializeGame() {
    // ... (Deze functie blijft ongewijzigd) ...
}

window.addEventListener('load', initializeGame);

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---