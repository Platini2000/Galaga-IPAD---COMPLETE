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

       // Reset alle menu state flags naar hoofdmenu
       isPlayerSelectMode = false;
       isOnePlayerGameTypeSelectMode = false;
       isOnePlayerVsAIGameTypeSelectMode = false;
       isGameModeSelectMode = false;
       isFiringModeSelectMode = false;
       selectedOnePlayerGameVariant = ''; // Wordt gereset
       isPlayerTwoAI = false; // Wordt gereset

       selectedFiringMode = 'rapid';
       selectedGameMode = 'normal'; // Default naar normal
       isTwoPlayerMode = false; currentPlayer = 1;
       showCsHitsMessage = false; csHitsMessageStartTime = 0; showPerfectMessage = false; perfectMessageStartTime = 0; showCsBonusScoreMessage = false; csBonusScoreMessageStartTime = 0; showCSClearMessage = false; csClearMessageStartTime = 0; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showExtraLifeMessage = false; extraLifeMessageStartTime = 0;
       showReadyMessage = false; readyMessageStartTime = 0; readyForNextWave = false; readyForNextWaveReset = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = '';
       player1TriggeredHighScoreSound = false;
       player2TriggeredHighScoreSound = false;
       isShowingCoopPlayersReady = false;
       coopPlayersReadyStartTime = 0;
       isTransitioningToDemoViaScoreScreen = false;


       stopAllGameSoundsInternal(); // Gebruikt nu Web Audio API
       isGridSoundPlaying = false;
       // Individuele stopSound calls voor specifieke scenario's niet meer nodig hier, stopAllGameSoundsInternal dekt het.

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
    isCoopAIDemoActive = true; // <<<< Belangrijk voor COOP AI Demo
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
    selectedGameMode = 'normal'; // Default, kan overschreven worden door submenus
    isCoopAIDemoActive = false;
    aiPlayerActivelySeekingCaptureById = null;
    selectedButtonIndex = 0;
    coopStartSoundPlayedThisSession = false;
    startAutoDemoTimer();
}

function startGame2P() {
    if (isInGameState) return;
    isPlayerSelectMode = false;
    isGameModeSelectMode = true; // Gaat naar 2P game mode selectie (Normal/Coop)
    isFiringModeSelectMode = false;
    isOnePlayerGameTypeSelectMode = false;
    isOnePlayerVsAIGameTypeSelectMode = false;
    selectedOnePlayerGameVariant = '';
    isPlayerTwoAI = false;

    isTwoPlayerMode = true; // Markeer als 2-speler game
    selectedGameMode = 'normal'; // Default, kan overschreven worden
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
            // isCoopAIDemoActive wordt hier NIET gezet; dat gebeurt alleen in startCoopAIDemo.
            // Voor "1P vs AI COOP", isCoopAIDemoActive blijft false.
            // isPlayerTwoAI en selectedOnePlayerGameVariant zijn al correct ingesteld via menu.
            // selectedGameMode is ook al correct ingesteld via menu (normal/coop).
            if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                isCoopAIDemoActive = false; // Zekerstellen dat het geen demo is.
                // selectedGameMode zou hier 'coop' moeten zijn.
            } else {
                isCoopAIDemoActive = false; // Voor alle andere manual games.
            }
            aiPlayerActivelySeekingCaptureById = null;
        } else { // Pure AI Demo (1P of COOP AI Demo)
            isPlayerTwoAI = false; // Reset voor pure AI demo
            selectedOnePlayerGameVariant = ''; // Reset voor pure AI demo
            // isCoopAIDemoActive wordt gezet door startCoopAIDemo
            // selectedGameMode wordt 'normal' of 'coop' gezet door startAIDemo/startCoopAIDemo
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
                 if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { // Voor 1P vs AI COOP
                    isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
                 }
            } else if (isTwoPlayerMode && !isPlayerTwoAI && selectedGameMode === 'normal') {
                if (needsL1StartSound) playStartSoundForThisGame = true;
            } else if (isTwoPlayerMode && !isPlayerTwoAI && selectedGameMode === 'coop') {
                if (needsL1StartSound && !coopStartSoundPlayedThisSession) playStartSoundForThisGame = true;
                isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
            }
        } else { // AI Demo (1P of Coop)
            if (needsL1StartSound) playStartSoundForThisGame = true;
            if (isCoopAIDemoActive) { // Geldt alleen voor COOP AI Demo
                 isShowingCoopPlayersReady = true; coopPlayersReadyStartTime = Date.now();
            }
        }

        if (playStartSoundForThisGame) {
            playSound('startSound', false, 0.4);
            initialGameStartSoundPlayedThisSession = true;
            // Markeer coopStartSound als afgespeeld als de gamemode 'coop' is,
            // of als het de COOP AI Demo is, of als het 1P_VS_AI_COOP is.
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
    showMenuState(); // playSound('menuMusicSound') wordt hierin aangeroepen
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
    showMenuState(); // playSound('menuMusicSound') wordt hierin aangeroepen
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
function handleCanvasClick(event) {
    if (!gameCanvas) return;
     if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed by canvas click."); });
    }
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    // Definieer clickX en clickY hier voor de scope van handleCanvasClick
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    const now = Date.now();
    let blockAllClickInput = false;
    if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) {
        blockAllClickInput = true;
    }
    if (blockAllClickInput) { return; }

    if (isInGameState) {
        if (isPaused) { if(typeof togglePause === 'function') togglePause(); return; }
        if (!isManualControl) {
            if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                // AI P2 is active, P1 (mens) kan niet stoppen met klikken.
            } else {
                isCoopAIDemoActive = false;
                aiPlayerActivelySeekingCaptureById = null;
                isPlayerTwoAI = false; // Als uit AI demo wordt gegaan, is P2 niet meer AI.
                if(typeof stopGameAndShowMenu === 'function') stopGameAndShowMenu();
            }
        }
    } else if (isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen) {
        if (typeof showMenuState === 'function') showMenuState();
    } else if (!isShowingScoreScreen) { // Menu
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);
        // Gebruik de hierboven gedefinieerde clickX en clickY
        let clickedButton0 = button0Rect && checkCollision({ x: clickX, y: clickY, width: 1, height: 1 }, button0Rect);
        let clickedButton1 = button1Rect && checkCollision({ x: clickX, y: clickY, width: 1, height: 1 }, button1Rect);

        stopAutoDemoTimer();

        if (isPlayerSelectMode) {
            if (clickedButton0) { startGame1P(); }
            else if (clickedButton1) { startGame2P(); }
            else { isPlayerSelectMode = false; selectedButtonIndex = 0; startAutoDemoTimer(); }
        } else if (isOnePlayerGameTypeSelectMode) {
            if (clickedButton0) {
                isOnePlayerGameTypeSelectMode = false;
                isFiringModeSelectMode = true;
                selectedOnePlayerGameVariant = 'CLASSIC_1P';
                selectedGameMode = 'normal'; // Voor 1P classic
                isTwoPlayerMode = false;
                isPlayerTwoAI = false;
                selectedButtonIndex = 0;
            } else if (clickedButton1) {
                isOnePlayerGameTypeSelectMode = false;
                isOnePlayerVsAIGameTypeSelectMode = true; // Ga naar 1P vs AI type selectie
                selectedButtonIndex = 0;
            } else { isOnePlayerGameTypeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 0; startAutoDemoTimer(); }
        } else if (isOnePlayerVsAIGameTypeSelectMode) { // 1P vs AI: Normal of Coop
            if (clickedButton0) {
                selectedOnePlayerGameVariant = '1P_VS_AI_NORMAL';
                selectedGameMode = 'normal';
            } else if (clickedButton1) {
                selectedOnePlayerGameVariant = '1P_VS_AI_COOP';
                selectedGameMode = 'coop';
            } else {
                isOnePlayerVsAIGameTypeSelectMode = false; isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 1; startAutoDemoTimer(); return;
            }
            isOnePlayerVsAIGameTypeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = true; selectedButtonIndex = 0;
        } else if (isGameModeSelectMode) { // 2P Human: Normal of Coop
            if (clickedButton0) { selectedGameMode = 'normal'; }
            else if (clickedButton1) { selectedGameMode = 'coop'; }
            else { isGameModeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 1; startAutoDemoTimer(); return; }
            isGameModeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = false; selectedButtonIndex = 0;
        } else if (isFiringModeSelectMode) {
            if (clickedButton0) { selectedFiringMode = 'rapid'; }
            else if (clickedButton1) { selectedFiringMode = 'single'; }
            else {
                isFiringModeSelectMode = false;
                if (selectedOnePlayerGameVariant === 'CLASSIC_1P') {
                    isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 0;
                } else if (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                    isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = (selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? 1 : 0);
                } else if (isTwoPlayerMode && !isPlayerTwoAI) { // Human 2P
                    isGameModeSelectMode = true; selectedButtonIndex = (selectedGameMode === 'coop' ? 1 : 0);
                } else { // Fallback
                    isPlayerSelectMode = false; selectedButtonIndex = 0;
                }
                startAutoDemoTimer(); return;
            }
            baseStartGame(true);
        } else { // Hoofdmenu
            if (clickedButton0) {
                isPlayerSelectMode = true; selectedButtonIndex = 0;
            } else if (clickedButton1) {
                if (typeof exitGame === 'function') exitGame();
            } else {
                triggerFullscreen();
            }
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
        if (!gameCtx || !gameCanvas) { if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; return; }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        const now = Date.now();

        // --- STAP 1: Teken UI (Score, Levens, Level) ---
        gameCtx.save();
        const UI_FONT="20px 'Press Start 2P'"; const LABEL_COLOR="red"; const SCORE_COLOR="white";
        gameCtx.font=UI_FONT; gameCtx.textBaseline="top";

        const drawTopUiElement=(label, scoreValue, labelAlign, labelX, shouldBlink = false)=>{
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

             let actualLabelWidth = 0;
             if(showLabel){
                 gameCtx.fillStyle=LABEL_COLOR;
                 gameCtx.textAlign=labelAlign;
                 gameCtx.fillText(label, labelX, MARGIN_TOP);
                 actualLabelWidth = gameCtx.measureText(label).width; // Meet de breedte van het getekende label
             } else {
                 // Als het label niet getoond wordt (knipperend), meet dan toch de breedte voor positionering van de score
                 gameCtx.font = UI_FONT; // Zorg dat het juiste font gebruikt wordt voor meten
                 actualLabelWidth = gameCtx.measureText(label).width;
             }

             // <<< NIEUW: Update ui2upRect als dit het 2UP label is >>>
             if (label === "2UP" || label === "AI P2" || label === "DEMO-2") {
                 const scoreTextForWidth = (typeof scoreValue === 'number') ? scoreValue.toFixed(0) : String(scoreValue);
                 const scoreWidth = gameCtx.measureText(scoreTextForWidth).width;
                 const totalElementWidth = Math.max(actualLabelWidth, scoreWidth) + 20; // +20 voor wat padding
                 let elementStartX = labelX;
                 if (labelAlign === 'right') {
                     elementStartX = labelX - totalElementWidth;
                 } else if (labelAlign === 'center') {
                     elementStartX = labelX - totalElementWidth / 2;
                 } // Voor 'left' is labelX al de start
                 ui2upRect = {
                     x: elementStartX,
                     y: MARGIN_TOP - 5, // Iets boven de tekst
                     width: totalElementWidth,
                     height: SCORE_OFFSET_Y + getSubtitleApproxHeight(UI_FONT) + 10 // Hoogte van label + score + padding
                 };
             }
             // <<< EINDE NIEUW >>>


             let scoreCenterX;
             if(labelAlign==='left')scoreCenterX=labelX+actualLabelWidth/2;
             else if(labelAlign==='right')scoreCenterX=labelX-actualLabelWidth/2;
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
            if (selectedGameMode === 'coop' && isInGameState) {
                score2PValue = player2Score;
                if (isCoopAIDemoActive) label2P = "DEMO-2";
                else if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') label2P = "AI P2";
                else label2P = "2UP";
            }
            else if (selectedGameMode === 'normal' && isInGameState && isTwoPlayerMode) { // Alleen voor daadwerkelijke 2P Normal
                score2PValue = (currentPlayer === 2) ? score : player2Score;
                if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL') { // Specifiek voor 1P vs AI Normal
                    label2P = "AI P2";
                } else { // Human 2P Normal
                    label2P = "2UP";
                }
            }
            else if (isShowingResultsScreen || (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage && !isAnyCoopPlayerGameOver) || isShowingPlayerGameOverMessage || isAnyCoopPlayerGameOver) {
                score2PValue = player2Score || 0;
                if (isCoopAIDemoActive && wasLastGameAIDemo) label2P = "DEMO-2";
                else if (isPlayerTwoAI && wasLastGameAIDemo && selectedGameMode === 'coop') {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && wasLastGameAIDemo && selectedGameMode === 'normal') {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode === 'coop') {
                    label2P = "AI P2";
                } else if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode === 'normal') {
                    label2P = "AI P2";
                } else { // Human 2P
                    label2P = "2UP";
                }
            } else if (!isInGameState ) { // Menu state
                 score2PValue = 0;
                 if (isPlayerSelectMode && selectedButtonIndex === 1) label2P = "2UP"; // 2P Human gekozen
                 else if (isGameModeSelectMode && selectedButtonIndex === 1 && isTwoPlayerMode && !isPlayerTwoAI) label2P = "2UP"; // 2P Human Coop
                 else if (isGameModeSelectMode && selectedButtonIndex === 0 && isTwoPlayerMode && !isPlayerTwoAI) label2P = "2UP"; // 2P Human Normal
                 else if (isOnePlayerVsAIGameTypeSelectMode && selectedButtonIndex === 1) label2P = "AI P2"; // 1P vs AI COOP
                 else if (isOnePlayerVsAIGameTypeSelectMode && selectedButtonIndex === 0) label2P = "AI P2"; // 1P vs AI Normal
                 else if (isFiringModeSelectMode && isPlayerTwoAI && selectedGameMode === 'coop') label2P = "AI P2";
                 else if (isFiringModeSelectMode && isPlayerTwoAI && selectedGameMode === 'normal') label2P = "AI P2";
                 else if (isFiringModeSelectMode && isTwoPlayerMode && !isPlayerTwoAI) label2P = "2UP";
                 else label2P = "2UP"; // Default
            }
        } else { // Classic 1P
             label2P = "2UP";
             score2PValue = 0;
        }


        if (isShowingResultsScreen) {
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO" :
                      ((isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop' && wasLastGameAIDemo)) ? "DEMO-1" : "1UP");
            if (isPlayerTwoAI && !isCoopAIDemoActive && wasLastGameAIDemo && selectedGameMode === 'normal') label1P = "1UP";
            if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode !== 'coop') label1P = "1UP"; // 1P vs AI Normal gespeeld

            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage && !isAnyCoopPlayerGameOver) {
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO" :
                      ((isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop' && wasLastGameAIDemo)) ? "DEMO-1" : "1UP");
            if (isPlayerTwoAI && !isCoopAIDemoActive && wasLastGameAIDemo && selectedGameMode === 'normal') label1P = "1UP";
            if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode !== 'coop') label1P = "1UP";

            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (isShowingPlayerGameOverMessage || isAnyCoopPlayerGameOver) {
            score1PValue = player1Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue);
            label1P = (isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'coop' )) ? "DEMO-1" : "1UP";
            if (isPlayerTwoAI && selectedGameMode === 'normal' && (playerWhoIsGameOver === 1 || currentPlayer === 1)) label1P = "1UP";


            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else if (!isInGameState) { // Menu
            score1PValue = 0; sessionHighScore = highScore || 20000; label1P = "1UP";
            highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false;
        }
        else { // In game
            sessionHighScore = highScore || 0;
            const baseBlinkCondition = !isPaused && !isShowingCoopPlayersReady;

            if (isCoopAIDemoActive) {
                score1PValue = player1Score;
                sessionHighScore = Math.max(highScore, player1Score, player2Score);
                label1P = "DEMO-1";
                show1UPBlink = baseBlinkCondition && !isShowingIntro && player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture;
                show2UPBlink = baseBlinkCondition && !isShowingIntro && player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture;
                if (player1Score >= sessionHighScore && player1Score > 0 && !isPlayer1ShowingGameOverMessage) highScoreConditionMet = show1UPBlink;
                if (player2Score >= sessionHighScore && player2Score > 0 && player2Score >= player1Score && !isPlayer2ShowingGameOverMessage) highScoreConditionMet = show2UPBlink;

            } else if (!isManualControl) { // Pure 1P AI Demo
                score1PValue = score; sessionHighScore = Math.max(sessionHighScore, score); label1P = "DEMO";
                show1UPBlink = baseBlinkCondition && !isShowingIntro && !isShipCaptured && playerLives > 0 && !isAnyCoopPlayerGameOver && !isShowingPlayerGameOverMessage;
                highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isAnyCoopPlayerGameOver && !isShowingPlayerGameOverMessage;
            } else { // Manual control games
                label1P = "1UP";
                if (isTwoPlayerMode && selectedGameMode === 'coop') { // Menselijke CO-OP of 1P vs AI in CO-OP
                    score1PValue = player1Score; sessionHighScore = Math.max(highScore, player1Score, player2Score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture;
                    show2UPBlink = baseBlinkCondition && !isShowingIntro && player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture && (isPlayerTwoAI ? player2Lives > 0 : true) ;
                    if (player1Score >= sessionHighScore && player1Score > 0 && !isPlayer1ShowingGameOverMessage) highScoreConditionMet = show1UPBlink;
                    if (player2Score >= sessionHighScore && player2Score > 0 && player2Score >= player1Score && !isPlayer2ShowingGameOverMessage && (isPlayerTwoAI ? player2Lives > 0 : true)) highScoreConditionMet = show2UPBlink;
                } else if (isTwoPlayerMode && selectedGameMode === 'normal') { // Human 2P Normal, 1P vs AI Normal
                    score1PValue = (currentPlayer === 1) ? score : player1Score; sessionHighScore = Math.max(highScore, player1Score, player2Score, score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && currentPlayer === 1 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage;
                    show2UPBlink = baseBlinkCondition && !isShowingIntro && currentPlayer === 2 && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage && (isPlayerTwoAI ? playerLives > 0 : true);
                    highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isShowingPlayerGameOverMessage;
                } else { // Klassieke 1P Manual
                    score1PValue = score; sessionHighScore = Math.max(sessionHighScore, score);
                    show1UPBlink = baseBlinkCondition && !isShowingIntro && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage;
                    highScoreConditionMet = baseBlinkCondition && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore && !isShowingPlayerGameOverMessage;
                }
            }
        }


        let isHighScoreBlinkingNow = false;
        if (highScoreConditionMet) {
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

        if (typeof shipImage !== 'undefined' && typeof LIFE_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LIFE_ICON_SIZE !== 'undefined' && typeof LIFE_ICON_MARGIN_LEFT !== 'undefined' && typeof LIFE_ICON_SPACING !== 'undefined' && typeof LEVEL_ICON_MARGIN_RIGHT !== 'undefined') {
            if (shipImage.complete && shipImage.naturalHeight !== 0) {
                const lifeIconY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE;
                const maxLivesIcons = 5;
                const defaultReserveLives = 2;
                let livesP1ToDisplay = 0;
                let livesP2ToDisplay = 0;

                if (!isInGameState || isShowingScoreScreen || isShowingResultsScreen || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage) {
                    livesP1ToDisplay = defaultReserveLives;
                    if (isEffectivelyTwoPlayerUI || (!isInGameState && (!isPlayerSelectMode || selectedButtonIndex === 1 )) ) {
                        livesP2ToDisplay = defaultReserveLives;
                    } else {
                        livesP2ToDisplay = 0;
                    }
                    if (!isInGameState && isPlayerSelectMode && selectedButtonIndex === 0) livesP2ToDisplay = 0;
                    if (!isInGameState && isOnePlayerGameTypeSelectMode && !isPlayerTwoAI && selectedOnePlayerGameVariant !== '1P_VS_AI_COOP') livesP2ToDisplay = 0;
                    if (!isInGameState && isOnePlayerVsAIGameTypeSelectMode ) {
                         if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') livesP2ToDisplay = defaultReserveLives;
                         else livesP2ToDisplay = 0;
                    }
                } else { // In Game
                    if (isTwoPlayerMode && selectedGameMode === 'coop') {
                        if (player1Lives > 0 ) {
                            livesP1ToDisplay = (player1Lives >= 3) ? defaultReserveLives : Math.max(0, player1Lives - 1);
                        } else { livesP1ToDisplay = 0; }

                        if (player2Lives > 0 ) {
                            livesP2ToDisplay = (player2Lives >= 3) ? defaultReserveLives : Math.max(0, player2Lives - 1);
                        } else { livesP2ToDisplay = 0; }

                    } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                        if (currentPlayer === 1) {
                            livesP1ToDisplay = (playerLives >= 3) ? defaultReserveLives : Math.max(0, playerLives - 1);
                            livesP2ToDisplay = (player2Lives >= 3) ? defaultReserveLives : Math.max(0, player2Lives-1);
                             if (isPlayerTwoAI && player2Lives <=0) livesP2ToDisplay = 0;
                        } else {
                            livesP1ToDisplay = (player1Lives >= 3) ? defaultReserveLives : Math.max(0, player1Lives-1);
                            livesP2ToDisplay = (playerLives >= 3) ? defaultReserveLives : Math.max(0, playerLives - 1);
                        }
                    }
                    else { // 1P Klassiek (of 1P AI Demo)
                        if (playerLives > 0 ) {
                            livesP1ToDisplay = (playerLives >= 3) ? defaultReserveLives : Math.max(0, playerLives - 1);
                        } else { livesP1ToDisplay = 0; }
                        livesP2ToDisplay = 0;
                    }
                }


                let p1LivesStartX = LIFE_ICON_MARGIN_LEFT;
                for (let i = 0; i < Math.min(livesP1ToDisplay, maxLivesIcons); i++) {
                    const currentIconX = p1LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                    gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                }

                const p2LivesIconsToDraw = Math.min(livesP2ToDisplay, maxLivesIcons);
                const showP2LivesInMenuGeneral = (!isInGameState &&
                                           ( (isPlayerSelectMode && selectedButtonIndex === 1) ||
                                             (isGameModeSelectMode && selectedButtonIndex === 1 && isTwoPlayerMode && !isPlayerTwoAI) ||
                                             (isGameModeSelectMode && selectedButtonIndex === 0 && isTwoPlayerMode && !isPlayerTwoAI) ||
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
                    const p2LivesStartX = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - p2LivesTotalWidth;
                    for (let i = 0; i < p2LivesIconsToDraw; i++) {
                        const currentIconX = p2LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                        gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                }
            }
        }

        const iconTypes = [ { val: 50, img: level50Image }, { val: 30, img: level30Image }, { val: 20, img: level20Image }, { val: 10, img: level10Image }, { val: 5, img: level5Image }, { val: 1, img: level1Image } ];
        const drawLevelIcons = (levelValueToDisplay, isPlayer1_Coop_Or_SinglePlayer) => {
            if (levelValueToDisplay <= 0 || typeof LEVEL_ICON_MARGIN_BOTTOM === 'undefined' || typeof LEVEL_ICON_SIZE === 'undefined' || typeof LEVEL_ICON_MARGIN_RIGHT === 'undefined' || typeof LEVEL_ICON_SPACING === 'undefined') return;
            let remainingLevelVal = levelValueToDisplay;
            let iconsToDrawList = [];
            let usedIconTypes = new Set();
            const canCompleteLevel = (startLevel, startIndex, currentUsedTypes) => { let tempRemaining = startLevel; let tempUsedTypes = new Set(currentUsedTypes); for (let i = startIndex; i < iconTypes.length; i++) { const iconVal = iconTypes[i].val; if (tempRemaining >= iconVal) { const canAddThisType = tempUsedTypes.size < 3 || tempUsedTypes.has(iconVal); if (!canAddThisType) continue; const howMany = Math.floor(tempRemaining / iconVal); tempRemaining -= howMany * iconVal; tempUsedTypes.add(iconVal); if (tempRemaining === 0) return true; } } return tempRemaining === 0; };
            for (let i = 0; i < iconTypes.length - 1; i++) { const currentIcon = iconTypes[i]; const iconVal = currentIcon.val; const iconImg = currentIcon.img; if (remainingLevelVal >= iconVal) { const howMany = Math.floor(remainingLevelVal / iconVal); const potentialRemaining = remainingLevelVal - howMany * iconVal; let hypotheticalUsedTypes = new Set(usedIconTypes); hypotheticalUsedTypes.add(iconVal); if (canCompleteLevel(potentialRemaining, i + 1, hypotheticalUsedTypes)) { for (let k = 0; k < howMany; k++) { iconsToDrawList.push(iconImg); } remainingLevelVal = potentialRemaining; usedIconTypes.add(iconVal); if (remainingLevelVal === 0) break; } } }
            if (remainingLevelVal > 0) { const canAddOnes = usedIconTypes.size < 3 || usedIconTypes.has(1); if (canAddOnes) { for (let k = 0; k < remainingLevelVal; k++) { iconsToDrawList.push(level1Image); } usedIconTypes.add(1); remainingLevelVal = 0; } else { /* console.warn(`Could not add ${remainingLevelVal} level 1 icons due to 3-type limit. Used types:`, usedIconTypes); */ } }
            if (iconsToDrawList.length === 0 && levelValueToDisplay > 0) { iconsToDrawList.push(level1Image); }

            if (iconsToDrawList.length === 0) return;

            const totalIcons = iconsToDrawList.length;
            const totalWidth = totalIcons * LEVEL_ICON_SIZE + Math.max(0, totalIcons - 1) * LEVEL_ICON_SPACING;
            const iconY = gameCanvas.height - LEVEL_ICON_MARGIN_BOTTOM - LEVEL_ICON_SIZE;
            let startX;
            const coopLevelIconOffset = 100;

            if (isTwoPlayerMode && selectedGameMode === 'coop' ) {
                if (isPlayer1_Coop_Or_SinglePlayer) {
                    let p1LivesWidth = 0;
                    if (player1Lives > 0 && isInGameState) {
                         const livesP1ToDisplay = (player1Lives >= 3) ? 2 : Math.max(0, player1Lives -1);
                         p1LivesWidth = Math.min(livesP1ToDisplay, 5) * (LIFE_ICON_SIZE + LIFE_ICON_SPACING) - (livesP1ToDisplay > 0 ? LIFE_ICON_SPACING : 0);
                    }
                    startX = LIFE_ICON_MARGIN_LEFT + p1LivesWidth + coopLevelIconOffset;
                } else { // P2 Level iconen links van P2 levens
                    let p2LivesWidth = 0;
                    if (player2Lives > 0 && isInGameState) {
                         const livesP2ToDisplay = (player2Lives >= 3) ? 2 : Math.max(0, player2Lives -1);
                         p2LivesWidth = Math.min(livesP2ToDisplay, 5) * (LIFE_ICON_SIZE + LIFE_ICON_SPACING) - (livesP2ToDisplay > 0 ? LIFE_ICON_SPACING : 0);
                    }
                    const p2LivesStartX = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - p2LivesWidth;
                    startX = p2LivesStartX - totalWidth - coopLevelIconOffset;
                }
            } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
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


        let levelP1ToDisplay = 1, levelP2ToDisplay = 0;

        if (gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage) {
            levelP1ToDisplay = Math.max(1, player1MaxLevelReached);
            if (isEffectivelyTwoPlayerUI) levelP2ToDisplay = Math.max(1, player2MaxLevelReached);
        } else if (!isInGameState || isShowingScoreScreen) {
            levelP1ToDisplay = 1;
            if (isEffectivelyTwoPlayerUI || (!isInGameState && (!isPlayerSelectMode || selectedButtonIndex === 1)) ) levelP2ToDisplay = 1;
            else levelP2ToDisplay = 0;

            if (!isInGameState && isPlayerSelectMode && selectedButtonIndex === 0) levelP2ToDisplay = 0;
            if (!isInGameState && isOnePlayerGameTypeSelectMode && !isPlayerTwoAI && selectedOnePlayerGameVariant !== '1P_VS_AI_COOP') levelP2ToDisplay = 0;
            if (!isInGameState && isOnePlayerVsAIGameTypeSelectMode ) {
                 if (selectedOnePlayerGameVariant === '1P_VS_AI_COOP') levelP2ToDisplay = 1;
                 else levelP2ToDisplay = 0;
            }

        } else if (isInGameState) {
            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                levelP1ToDisplay = player1Lives > 0 ? (player1MaxLevelReached > 0 ? player1MaxLevelReached : 1) : player1MaxLevelReached;
                levelP2ToDisplay = player2Lives > 0 ? (player2MaxLevelReached > 0 ? player2MaxLevelReached : 1) : player2MaxLevelReached;
                if (player1Lives <= 0 && player1MaxLevelReached <= 0) levelP1ToDisplay = 0;
                if (player2Lives <= 0 && player2MaxLevelReached <= 0) levelP2ToDisplay = 0;
            } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                 levelP1ToDisplay = (currentPlayer === 1) ? level : player1MaxLevelReached;
                 levelP2ToDisplay = (currentPlayer === 2) ? level : player2MaxLevelReached;
            }
            else { // 1P Classic
                levelP1ToDisplay = level;
                levelP2ToDisplay = 0;
            }
        }

        drawLevelIcons(levelP1ToDisplay, true);
        if (levelP2ToDisplay > 0 ) {
            drawLevelIcons(levelP2ToDisplay, false);
        }
        gameCtx.restore();


        // --- STAP 1.6: Teken Spelersschip (Hoofd + Dual) ---
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
            if (isTwoPlayerMode && selectedGameMode === 'coop') { // Human COOP, 1P_VS_AI_COOP, COOP AI Demo
                const p1ActiveAndAlive = ship1 && player1Lives > 0;
                const p2ActiveAndAlive = ship2 && player2Lives > 0;

                if (p1ActiveAndAlive && (!isPlayer1ShipCaptured || (isPlayer1ShipCaptured && !isShowingCaptureMessage)) && !player1NeedsRespawnAfterCapture) {
                    let shouldDrawP1 = true;
                    if ((isPlayer1Invincible || isPlayer1WaitingForRespawn) && !isShowingCoopPlayersReady && !isShowingCaptureMessage) {
                        const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                        if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP1 = false;
                    }
                    if (isShowingCSBonusScreen) {
                        if (isCoopAIDemoActive && !p2ActiveAndAlive) { /* P1 mag getoond als P2 dood is in demo */ }
                        else if (isCoopAIDemoActive && p1ActiveAndAlive && p2ActiveAndAlive) { /* Beide mogen getoond */ }
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
                if (p2ActiveAndAlive && (!isPlayer2ShipCaptured || (isPlayer2ShipCaptured && !isShowingCaptureMessage)) && !player2NeedsRespawnAfterCapture) {
                     let shouldDrawP2 = true;
                    if ((isPlayer2Invincible || isPlayer2WaitingForRespawn) && !isShowingCoopPlayersReady && !isShowingCaptureMessage) {
                        const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                        if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP2 = false;
                    }
                    if (isShowingCSBonusScreen) {
                        if (isCoopAIDemoActive) {
                            if (!p1ActiveAndAlive) { /* P2 mag getoond als P1 dood is in demo */ }
                            else if (p1ActiveAndAlive && p2ActiveAndAlive) { /* Beide mogen getoond */ }
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
            } else { // 1P Classic, 1P vs AI (Normal), 2P Human (Normal)
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


        if (fallingShips.length > 0 && typeof shipImage !== 'undefined' && shipImage.complete) { fallingShips.forEach(fs => { if (fs) { gameCtx.save(); const centerX = fs.x + fs.width / 2; const centerY = fs.y + fs.height / 2; gameCtx.translate(centerX, centerY); gameCtx.rotate(fs.rotation || 0); const drawX = -fs.width / 2; const drawY = -fs.height / 2; const drawW = fs.width; const drawH = fs.height; gameCtx.drawImage(shipImage, drawX, drawY, drawW, drawH); if (typeof fs.tintProgress === 'number' && fs.tintProgress > 0.01) { gameCtx.save(); gameCtx.globalAlpha = fs.tintProgress; gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(drawX, drawY, drawW, drawH); gameCtx.restore(); } gameCtx.restore(); } }); }
        gameCtx.restore();


        // --- STAP 2: State-specifieke content (Menu / Game / Score) ---
        if (!isInGameState) { // Menu of Score Screen
             if (isShowingScoreScreen) { /* ... score screen ... */ if (typeof LIFE_ICON_SIZE !== 'undefined') { gameCtx.save(); const centerX = gameCanvas.width / 2; let scoreScreenBaseY = gameCanvas.height * 0.25 + SCORE_SCREEN_VERTICAL_OFFSET + SCORE_SCREEN_LINE_V_SPACING; let alignedIconStartX = 0; let yPos1 = scoreScreenBaseY + 0; drawCanvasText("PUSH START BUTTON", centerX, yPos1 - 30, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_TOP, 'center', 'middle', true); let yPos2 = yPos1 + SCORE_SCREEN_LINE_V_SPACING * 1.8; const text1 = ` 1ST LIFE BONUS FOR ${EXTRA_LIFE_THRESHOLD_1} PTS`; gameCtx.font = SCORE_SCREEN_TEXT_FONT; const text1Width = gameCtx.measureText(text1).width; const totalWidth1 = LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING + text1Width; alignedIconStartX = (centerX - totalWidth1 / 2) - 30; if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos2 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); } drawCanvasText(text1, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos2, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false); let yPos3 = yPos2 + SCORE_SCREEN_LINE_V_SPACING * 1.0; const text2 = ` 2ND LIFE BONUS FOR ${EXTRA_LIFE_THRESHOLD_2} PTS`; if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos3 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); } drawCanvasText(text2, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos3, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false); let yPos4 = yPos3 + SCORE_SCREEN_LINE_V_SPACING * 1.0; const text3 = ` EXT LIFE FOR EVERY ${RECURRING_EXTRA_LIFE_INTERVAL} PTS`; if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos4 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); } drawCanvasText(text3, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos4, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false); let yPos5 = yPos4 + SCORE_SCREEN_LINE_V_SPACING * 1.8; drawCanvasText("2025   Platini2000(c)   LTD", centerX - 10, yPos5 + 30, MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', false); gameCtx.restore(); } }
             else { // Hoofdmenu of een sub-menu
                gameCtx.save(); const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height; const canvasCenterX = canvasWidth / 2;
                if (selectedButtonIndex === -1 && (isPlayerSelectMode || isFiringModeSelectMode || isOnePlayerGameTypeSelectMode || isOnePlayerVsAIGameTypeSelectMode || isGameModeSelectMode || (!isPlayerSelectMode && !isFiringModeSelectMode && !isOnePlayerGameTypeSelectMode && !isOnePlayerVsAIGameTypeSelectMode && !isGameModeSelectMode))) { selectedButtonIndex = 0; }
                let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT; let actualLogoWidth = actualLogoHeight * (logoImage.naturalWidth / logoImage.naturalHeight || 1); if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR; actualLogoWidth = logoImage.naturalWidth * LOGO_SCALE_FACTOR; }
                const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT);
                const totalContentHeightForLayout = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight;
                let groupStartYForLayout = (canvasHeight - totalContentHeightForLayout) / 2 - 70; groupStartYForLayout += MENU_GENERAL_Y_OFFSET;
                const logoDrawX = canvasCenterX - actualLogoWidth / 2; const logoDrawY = groupStartYForLayout + MENU_LOGO_EXTRA_Y_OFFSET;
                if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { gameCtx.drawImage(logoImage, Math.round(logoDrawX), Math.round(logoDrawY), actualLogoWidth, actualLogoHeight); }
                else { drawCanvasText("LOGO", canvasCenterX, logoDrawY + actualLogoHeight / 2, "30px Arial", "grey"); }

                if (isOnePlayerGameTypeSelectMode) { drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0); drawCanvasButton("GAME VS AI", 1, selectedButtonIndex === 1); }
                else if (isOnePlayerVsAIGameTypeSelectMode) { drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0); drawCanvasButton("CO-OP GAME", 1, selectedButtonIndex === 1); }
                else if (isGameModeSelectMode) { drawCanvasButton("NORMAL GAME", 0, selectedButtonIndex === 0); drawCanvasButton("CO-OP GAME", 1, selectedButtonIndex === 1); }
                else if (isFiringModeSelectMode) { drawCanvasButton("EASY", 0, selectedButtonIndex === 0); drawCanvasButton("NORMAL", 1, selectedButtonIndex === 1); }
                else if (isPlayerSelectMode) { drawCanvasButton("PLAYER 1", 0, selectedButtonIndex === 0); drawCanvasButton("PLAYER 2", 1, selectedButtonIndex === 1); }
                else { drawCanvasButton("START GAME", 0, selectedButtonIndex === 0); drawCanvasButton("GAME EXIT", 1, selectedButtonIndex === 1); }

                const exitButtonRect = getMenuButtonRect(1); let subtitleCenterY; if (exitButtonRect) { subtitleCenterY = exitButtonRect.y + exitButtonRect.height + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); } else { subtitleCenterY = groupStartYForLayout + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); }
                drawCanvasText( MENU_SUBTITLE_TEXT, canvasCenterX - 1, Math.round(subtitleCenterY), MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', true );
                gameCtx.restore();
            }
        } else { // --- Game bezig OF Game Over / Results ---
            const noGlobalGameOverOrResults = gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShowingResultsScreen;
            const isAnyCoopPlayerGameOverMsgActive = isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage);

            // --- STAP 2.1: Gameplay Actief (of PAUSED, of COOP Game Over bericht) ---
            if (noGlobalGameOverOrResults || isAnyCoopPlayerGameOverMsgActive) {
                 gameCtx.save();
                 let showBullets = !showReadyMessage && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !isCsCompletionDelayActive && !isShowingIntro && !isShowingCaptureMessage && !isShowingCoopPlayersReady && !isAnyCoopPlayerGameOverMsgActive;
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
                 const playerGameOverYOffset = lineSpacingGameOver * 2;

                 if (!isManualControl && isInGameState && isShowingDemoText) {
                    const isBlockingMessageActive = isShowingIntro ||
                                                  isShowingCaptureMessage ||
                                                  showCsBonusScoreMessage || showPerfectMessage || showCsHitsMessage || showCSClearMessage ||
                                                  showExtraLifeMessage ||
                                                  showReadyMessage ||
                                                  isShowingCoopPlayersReady ||
                                                  isCsCompletionDelayActive ||
                                                  isShowingPlayerGameOverMessage ||
                                                  isAnyCoopPlayerGameOverMsgActive;

                     if (!isBlockingMessageActive) {
                         const demoBlinkCycle = DEMO_TEXT_BLINK_CYCLE_MS;
                         const demoBlinkOn = DEMO_TEXT_BLINK_ON_MS;
                         if ((now % demoBlinkCycle) < demoBlinkOn) {
                             drawCanvasText("PUSH START BUTTON", midScreenX, midScreenY, DEMO_TEXT_LINE1_FONT, DEMO_TEXT_COLOR, 'center', 'middle', true);
                             messageDrawnThisCycle = true;
                         }
                     }
                 }

                 if (!messageDrawnThisCycle) {
                     if (isPaused) { drawCanvasText("PAUSED", midScreenX, midScreenY, PAUSE_TEXT_FONT, PAUSE_TEXT_COLOR, 'center', 'middle', PAUSE_TEXT_SHADOW); messageDrawnThisCycle = true; }
                     else if (isShowingCoopPlayersReady) {
                        const coopReadyText = isCoopAIDemoActive ? "DEMO PLAYERS READY!" : ((isPlayerTwoAI && selectedGameMode === 'coop') ? "PLAYER & AI READY!" : "PLAYERS READY!");
                        drawCanvasText(coopReadyText, midScreenX, midScreenY, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); messageDrawnThisCycle = true;
                     }
                     else if (isShowingCaptureMessage) { drawCanvasText("FIGHTER CAPTURED", midScreenX, midScreenY, INTRO_TEXT_FONT, "red", 'center', 'middle', true); messageDrawnThisCycle = true; }
                     else if (showCsBonusScoreMessage || showPerfectMessage || showCsHitsMessage) { drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; if (showCsBonusScoreMessage || showPerfectMessage) { drawCanvasText("PERFECT !", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, PERFECT_TEXT_COLOR, 'center', 'middle', true); } if (showCsBonusScoreMessage) { drawCanvasText("SPECIAL BONUS 10000 PTS", midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_BONUS_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                     else if (showCSClearMessage) { drawCanvasText("STAGE CLEARED", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; if (showCsHitsForClearMessage) { drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); } if (showCsScoreForClearMessage) { drawCanvasText(clearBonusText, midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                     else if (showExtraLifeMessage) { drawCanvasText("EXTRA LIFE", midScreenX, midScreenY, INTRO_TEXT_FONT, EXTRA_LIFE_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; }
                     else if (isShowingIntro && !isShowingCoopPlayersReady) {
                        let introText = ""; let introColor = INTRO_TEXT_COLOR_NORMAL;
                        if (introStep === 1) {
                            if (!(selectedGameMode === 'coop' && level === 1)) { // Alleen Player X tonen als het niet Coop L1 intro is
                                introText = (!isManualControl && !isCoopAIDemoActive && !isPlayerTwoAI) ? "DEMO" :
                                            (isCoopAIDemoActive ? "DEMO-1" :
                                            ((isTwoPlayerMode && selectedGameMode === 'normal' && !isPlayerTwoAI) ? `PLAYER ${currentPlayer}` :
                                            ((isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL') ? `PLAYER ${currentPlayer}` : "PLAYER 1") ));
                                 if (isManualControl && isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) introText = "AI PLAYER 2";
                            }
                        }
                        else if (introStep === 2) { introText = "STAGE " + level; }
                        else if (introStep === 3) { introText = "CHALLENGING STAGE"; introColor = INTRO_TEXT_COLOR_CS_TEXT; if (!csIntroSoundPlayed) { playSound(entranceSound); csIntroSoundPlayed = true; } }
                        if (introText) { drawCanvasText(introText, midScreenX, midScreenY, INTRO_TEXT_FONT, introColor, 'center', 'middle', true); messageDrawnThisCycle = true; }
                     }
                     else if (showReadyMessage) { drawCanvasText("READY?", midScreenX, midScreenY, INTRO_TEXT_FONT, READY_TEXT_COLOR, 'center', 'middle', true); messageDrawnThisCycle = true; }
                     else if (isTwoPlayerMode && selectedGameMode === 'coop') { // COOP Game Over Messages
                        const playerGameOverTextBaseY = gameCanvas.height * 0.45 + playerGameOverYOffset;
                        if (isPlayer1ShowingGameOverMessage && !isPlayer2ShowingGameOverMessage) {
                            const p1goLabel = isCoopAIDemoActive ? "DEMO-1" : (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? "PLAYER 1" : "PLAYER 1");
                            drawCanvasText(p1goLabel.toUpperCase(), midScreenX, playerGameOverTextBaseY - lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                            drawCanvasText("GAME OVER", midScreenX, playerGameOverTextBaseY + lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                            messageDrawnThisCycle = true;
                        } else if (isPlayer2ShowingGameOverMessage && !isPlayer1ShowingGameOverMessage) {
                            const p2goLabel = isCoopAIDemoActive ? "DEMO-2" : (isPlayerTwoAI ? "AI PLAYER 2" : "PLAYER 2");
                            drawCanvasText(p2goLabel.toUpperCase(), midScreenX, playerGameOverTextBaseY - lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                            drawCanvasText("GAME OVER", midScreenX, playerGameOverTextBaseY + lineSpacingGameOver / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                            messageDrawnThisCycle = true;
                        }
                     }
                }
                 gameCtx.restore();
            }
            // --- STAP 2.2: Game Over State (Player X of Final) ---
            else {
                if (isShowingPlayerGameOverMessage && selectedGameMode === 'normal') { // Alleen voor 2P Normal (Player X Game Over)
                     const playerText = (isPlayerTwoAI && playerWhoIsGameOver === 2) ? `AI PLAYER 2` : `PLAYER ${playerWhoIsGameOver}`;
                     const lineSpacing = RESULTS_LINE_V_SPACING_SINGLE; const messageCenterY = gameCanvas.height * 0.45; drawCanvasText(playerText, gameCanvas.width / 2, messageCenterY - lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); drawCanvasText("GAME OVER", gameCanvas.width / 2, messageCenterY + lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true);
                }
                else if (gameOverSequenceStartTime > 0) { // Final Game Over of Results
                    const elapsedTime = now - gameOverSequenceStartTime;
                    const isShowingGameOverText = elapsedTime < GAME_OVER_DURATION;
                    const isShowingResultsScreenActive = elapsedTime >= GAME_OVER_DURATION;

                    const isTrueSinglePlayerGameOver = !isTwoPlayerMode && !isPlayerTwoAI && selectedGameMode === 'normal';
                    const is1PvsAINormalP1GameOver = isTwoPlayerMode && isPlayerTwoAI && selectedGameMode === 'normal' && player1Lives <= 0 && player2Lives > 0; // Alleen als P1 specifiek dood is in 1P vs AI Normal

                    if (isShowingGameOverText && (isTrueSinglePlayerGameOver || is1PvsAINormalP1GameOver )) {
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
                        if (isTwoPlayerMode || (wasLastGameAIDemo && isPlayerTwoAI && selectedGameMode === 'coop') ) { // COOP AI Demo valt hier ook onder
                            const shots1 = player1ShotsFired || 0; const hits1 = player1EnemiesHit || 0; const ratio1 = shots1 > 0 ? Math.round((hits1 / shots1) * 100) + "%" : "0%";
                            const shots2 = player2ShotsFired || 0; const hits2 = player2EnemiesHit || 0; const ratio2 = shots2 > 0 ? Math.round((hits2 / shots2) * 100) + "%" : "0%";
                            const columnWidth = canvasWidth * 0.4; const columnGap = canvasWidth * 0.1; const leftColumnX = centerX - columnGap / 2 - columnWidth / 2 + (columnWidth * 0.1); const rightColumnX = centerX + columnGap / 2 + columnWidth / 2 - (columnWidth * 0.1);

                            const p1Identifier = (isCoopAIDemoActive && wasLastGameAIDemo) ? "DEMO-1" : "PLAYER 1";
                            let p2Identifier = "PLAYER 2";
                            if (isCoopAIDemoActive && wasLastGameAIDemo) p2Identifier = "DEMO-2";
                            else if (isPlayerTwoAI && wasLastGameAIDemo && selectedGameMode === 'coop') p2Identifier = "AI PLAYER 2"; // 1P vs AI COOP demo
                            else if (isPlayerTwoAI && wasLastGameAIDemo && selectedGameMode === 'normal') p2Identifier = "AI PLAYER 2"; // 1P vs AI Normal demo
                            else if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode === 'coop') p2Identifier = "AI PLAYER 2"; // 1P vs AI Coop (Human P1)
                            else if (isPlayerTwoAI && !wasLastGameAIDemo && selectedGameMode === 'normal') p2Identifier = "AI PLAYER 2"; // 1P vs AI Normal (Human P1)


                            drawPlayerResultsColumn(p1Identifier, player1Score, shots1, hits1, ratio1, player1MaxLevelReached, leftColumnX, initialY);
                            drawPlayerResultsColumn(p2Identifier, player2Score, shots2, hits2, ratio2, player2MaxLevelReached, rightColumnX, initialY);

                            let winnerNum = 0; let winnerLabel = "";
                            if (player1Score > player2Score) { winnerNum = 1; winnerLabel = p1Identifier; }
                            else if (player2Score > player1Score) { winnerNum = 2; winnerLabel = p2Identifier; }

                            if (winnerNum > 0) {
                                let yPosForWinsText = initialY + getSubtitleApproxHeight(INTRO_TEXT_FONT) + RESULTS_LINE_V_SPACING_SINGLE * 2;
                                drawCanvasText(winnerLabel, centerX, yPosForWinsText, INTRO_TEXT_FONT, 'white', 'center', 'middle', true);
                                drawCanvasText("WINS", centerX, yPosForWinsText + RESULTS_LINE_V_SPACING_SINGLE, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', true);
                            }
                        } else { // Klassieke 1P of 1P AI Demo (niet COOP AI Demo)
                             const shotsValue = player1ShotsFired || 0; const hitsValue = player1EnemiesHit || 0; const finalScore = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? score : player1Score; const finalLevel = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? level : player1MaxLevelReached; const ratioValue = shotsValue > 0 ? Math.round((hitsValue / shotsValue) * 100) + "%" : "0%";
                             const playerIdentifier = (!isManualControl && wasLastGameAIDemo && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop')) ? "DEMO" : "PLAYER 1";
                             drawPlayerResultsColumn(playerIdentifier, finalScore, shotsValue, hitsValue, ratioValue, finalLevel, centerX, initialY);
                        }
                        gameCtx.restore();
                    }
                }
            }
        }
    } catch (e) { /* ... error handling (ongewijzigd) ... */ console.error("Error in renderGame:", e, e.stack); /* ... */ }
} // Einde renderGame

// --- Cursor Handling & Mouse Idle ---
function hideCursor() { if (gameCanvas) { gameCanvas.style.cursor = 'none'; } mouseIdleTimerId = null; }

function handleCanvasMouseMove(event) {
    if (!gameCanvas) return;
    if (mouseIdleTimerId) clearTimeout(mouseIdleTimerId); // Reset de timer bij elke beweging

    let currentCursorStyle = 'default';
    const isInAnyMenuState = !isInGameState && !isShowingScoreScreen;
    let hoveringButton = false;
    let newSelectedButtonIndex = selectedButtonIndex;

    if (isInAnyMenuState) {
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const scaleY = gameCanvas.height / rect.height;
        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);

        if (button0Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button0Rect)) {
            newSelectedButtonIndex = 0;
            hoveringButton = true;
        } else if (button1Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button1Rect)) {
            newSelectedButtonIndex = 1;
            hoveringButton = true;
        } else {
            newSelectedButtonIndex = -1; // Geen knop gehoverd
            hoveringButton = false;
        }

        if (newSelectedButtonIndex !== selectedButtonIndex) {
            selectedButtonIndex = newSelectedButtonIndex;
            if (hoveringButton) {
                stopAutoDemoTimer(); // Stop demo timer als een knop wordt gehoverd
            }
        }
        currentCursorStyle = hoveringButton ? 'pointer' : 'default';
    } else { // In game or score screen
        currentCursorStyle = 'none'; // Cursor verbergen tijdens gameplay
        selectedButtonIndex = -1;
    }

    gameCanvas.style.cursor = currentCursorStyle;

    // Start de timer opnieuw om de cursor te verbergen na inactiviteit
    mouseIdleTimerId = setTimeout(hideCursor, 2000); // Verberg cursor na 2 seconden inactiviteit

    // Reset de auto demo timer als de muis beweegt in het menu en niet over een knop
    if (!isInGameState && !hoveringButton) {
        const now = Date.now();
        if (now - lastMouseMoveResetTime > 500) { // Voorkom te vaak resetten
            if (typeof startAutoDemoTimer === 'function') startAutoDemoTimer();
            lastMouseMoveResetTime = now;
        }
    }
}


function mainLoop(timestamp) {
    try {
        drawStars(); if (retroGridCtx && retroGridCanvas) { drawRetroGrid(); }
        pollControllerForMenu(); // Handelt controller input af voor menu/speciale game acties

        if (isInGameState && !isPaused) {
            // Demo mode exit check via controller (ongewijzigd)
            if (!isManualControl && connectedGamepadIndex !== null) { const gamepads = navigator.getGamepads(); if (gamepads?.[connectedGamepadIndex]) { const gamepad = gamepads[connectedGamepadIndex]; const currentDemoButtonStates = gamepad.buttons.map(b => b.pressed); let anyButtonPressedNow = false; for (let i = 0; i < currentDemoButtonStates.length; i++) { if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue; if (currentDemoButtonStates[i] && !(previousDemoButtonStates[i] ?? false)) { anyButtonPressedNow = true; break; } } if (anyButtonPressedNow) { isCoopAIDemoActive = false; isPlayerTwoAI = false; showMenuState(); requestAnimationFrame(mainLoop); return; } previousDemoButtonStates = currentDemoButtonStates.slice(); } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; } } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; }

            if(typeof window.runSingleGameUpdate === 'function') {
                window.runSingleGameUpdate(timestamp);
            }
            else { console.error("FATAL: window.runSingleGameUpdate is not defined!"); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; showMenuState(); requestAnimationFrame(mainLoop); return; }

            // Game Over sequence timer (ongewijzigd)
            if (gameOverSequenceStartTime > 0) { const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION; if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; } }
        } else if (isShowingScoreScreen) { // Score screen wordt getoond
            if(typeof renderGame === 'function') {
                renderGame(); // Render het score screen
            }
        } else if (isInGameState && gameOverSequenceStartTime > 0) { // Tijdens de "GAME OVER" tekst of Results
            if(typeof renderGame === 'function') {
                renderGame();
            }
            const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION; if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; }
        } else if (isInGameState && isPaused) { // Game is gepauzeerd
            if(typeof renderGame === 'function') {
                renderGame();
            }
        } else if (isInGameState && isCsCompletionDelayActive) { // Tijdens CS completion delay
            if(typeof window.runSingleGameUpdate === 'function') window.runSingleGameUpdate(timestamp);
            else if (typeof renderGame === 'function') renderGame();
        } else if (isInGameState && (isShowingPlayerGameOverMessage || isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage) ) { // Tijdens Player X Game Over message
            if(typeof window.runSingleGameUpdate === 'function') window.runSingleGameUpdate(timestamp);
            else if (typeof renderGame === 'function') renderGame();
        }
        else { // Menu state
            if(typeof renderGame === 'function') {
                renderGame();
            }
        }
        mainLoopId = requestAnimationFrame(mainLoop);
    } catch (e) { /* ... error handling ongewijzigd ... */ console.error("!!! CRITICAL ERROR IN mainLoop:", e, e.stack); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; isPaused = false; stopAllGameSoundsInternal(); isGridSoundPlaying = false; try { showMenuState(); } catch(menuErr) { console.error("Failed to return to menu after loop error:", menuErr); document.body.innerHTML = '<p style="color:white;">CRITICAL LOOP ERROR. Please refresh.</p>';} }
}

function startMainLoop() { /* ... ongewijzigd ... */ if (mainLoopId === null) { gridOffsetY = 0; mainLoop(); } else { /* Main loop is already running */ } }

function initializeGame() { /* ... ongewijzigd, inclusief canvas listeners ... */ try { if (typeof initializeDOMElements === 'function') { if (!initializeDOMElements()) { console.error("DOM element initialization failed."); return; } } else { console.error("initializeDOMElements function not found!"); return; } if (typeof window.loadHighScore === 'function') window.loadHighScore(); else if (typeof loadHighScore === 'function') loadHighScore(); else console.warn("loadHighScore function not found."); if (typeof window.defineNormalWaveEntrancePaths === 'function') window.defineNormalWaveEntrancePaths(); else if (typeof defineNormalWaveEntrancePaths === 'function') defineNormalWaveEntrancePaths(); else console.error("defineNormalWaveEntrancePaths not found!"); if (typeof window.defineChallengingStagePaths === 'function') window.defineChallengingStagePaths(); else if (typeof defineChallengingStagePaths === 'function') defineChallengingStagePaths(); else console.error("defineChallengingStagePaths not found!"); window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp); if (gameCanvas) { gameCanvas.addEventListener('click', handleCanvasClick); gameCanvas.addEventListener('mousemove', handleCanvasMouseMove); } else { console.error("Cannot add canvas listeners: gameCanvas not found during init."); } setupInitialEventListeners(); showMenuState(); if (typeof resizeCanvases === 'function') { resizeCanvases(); } else console.error("resizeCanvases not found!"); startMainLoop(); } catch (e) { console.error("FATAL INITIALIZATION ERROR:", e, e.stack); document.body.innerHTML = `<div style="color:white; padding: 20px; font-family: sans-serif;"><h1>Fatal Initialization Error</h1><p>The game could not be started. Please check the browser console (F12) for details.</p><p>Error: ${e.message}</p></div>`; if (mainLoopId) { cancelAnimationFrame(mainLoopId); mainLoopId = null; } } }

window.addEventListener('load', initializeGame);

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---