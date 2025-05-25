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
// --- DEEL 3      van 3 dit code blok    ---

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
        const UI_FONT="20px 'Press Start 2P'";
        const TOP_UI_LABEL_COLOR_DEFAULT = "red";
        const SCORE_COLOR="white";
        gameCtx.font=UI_FONT; gameCtx.textBaseline="top";

        ui2upRect = null;

        // <<< GEWIJZIGD: Functie declaratie i.p.v. const expressie >>>
        function drawTopUiElement(label, scoreValue, labelAlign, labelX, shouldBlink = false){
            let showLabel=true;
            let blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
            let blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
            let currentLabelColor = TOP_UI_LABEL_COLOR_DEFAULT;

            if (label === "DEMO") {
                blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7;
                blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
            } else if (label === "HIGH SCORE") {
                blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
                blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
                if (isInGameState && !isManualControl) {
                    blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7;
                    blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
                } else if (isInGameState && isTwoPlayerMode && currentPlayer === 2) {
                    blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
                    blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
                }
            }

            if(shouldBlink){
                if(isPaused || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || !((now % blinkCycleDuration) < blinkOnDuration)){
                    showLabel=false;
                }
            }

            gameCtx.textAlign = labelAlign; // Eerst alignment zetten
            const labelMetrics = gameCtx.measureText(label);
            const labelWidth = labelMetrics.width;
            const labelHeight = 20;
            const labelY = MARGIN_TOP;

            if(showLabel){
                gameCtx.fillStyle=currentLabelColor;
                gameCtx.fillText(label, labelX, labelY);
            }

            const scoreString = String(scoreValue); // Zekerstellen dat het een string is
            let scoreCenterX;
            if(labelAlign==='left') scoreCenterX = labelX + labelWidth / 2;
            else if(labelAlign==='right') scoreCenterX = labelX - labelWidth / 2;
            else scoreCenterX = labelX;

            gameCtx.textAlign = 'center'; // Score altijd centreren onder het midden van het label
            const scoreMetrics = gameCtx.measureText(scoreString);
            const scoreWidth = scoreMetrics.width;
            const scoreHeight = 20;
            const scoreY = labelY + SCORE_OFFSET_Y + 5;

            gameCtx.fillStyle=SCORE_COLOR;
            gameCtx.fillText(scoreString, scoreCenterX, scoreY);

            let elementLeft, elementRight, elementTop, elementBottom;
            elementTop = labelY;
            elementBottom = scoreY + scoreHeight;

            if (labelAlign === 'left') {
                elementLeft = labelX;
                elementRight = Math.max(labelX + labelWidth, scoreCenterX + scoreWidth / 2);
            } else if (labelAlign === 'right') {
                elementRight = labelX; // labelX is het meest rechtse punt voor right-align
                elementLeft = Math.min(labelX - labelWidth, scoreCenterX - scoreWidth / 2);
            } else { // center
                elementLeft = Math.min(labelX - labelWidth / 2, scoreCenterX - scoreWidth / 2);
                elementRight = Math.max(labelX + labelWidth / 2, scoreCenterX + scoreWidth / 2);
            }

            const elementWidth = elementRight - elementLeft;
            const elementHeight = elementBottom - elementTop;

            if (label === "2UP") {
                 const paddingX = 20;
                 const paddingY = 10;
                 ui2upRect = {
                     x: elementLeft - paddingX,
                     y: elementTop - paddingY,
                     width: elementWidth + paddingX * 2,
                     height: elementHeight + paddingY * 2
                 };
            }
        };


        let score1PValue, score2PValue, sessionHighScore, label1P;
        let show1UPBlink = false, show2UPBlink = false, highScoreConditionMet = false;

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
                if (player1Score >= sessionHighScore && player1Score > 0) highScoreConditionMet = show1UPBlink;
                if (player2Score >= sessionHighScore && player2Score > 0 && player2Score > player1Score) highScoreConditionMet = show2UPBlink;

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

        if(typeof MARGIN_SIDE!=='undefined' && typeof MARGIN_TOP!=='undefined' && typeof SCORE_OFFSET_Y!=='undefined'){
            drawTopUiElement(label1P, score1PValue, 'left', MARGIN_SIDE, show1UPBlink);
            drawTopUiElement("HIGH SCORE", sessionHighScore, 'center', gameCanvas.width / 2, isHighScoreBlinkingNow);
            drawTopUiElement("2UP", score2PValue, 'right', gameCanvas.width - MARGIN_SIDE, show2UPBlink);
        }

        if (typeof shipImage !== 'undefined' && typeof LIFE_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LIFE_ICON_SIZE !== 'undefined' && typeof LIFE_ICON_MARGIN_LEFT !== 'undefined' && typeof LIFE_ICON_SPACING !== 'undefined') {
            if (shipImage.complete && shipImage.naturalHeight !== 0) {
                const lifeIconY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE;
                let livesP1ToDisplay = 0;
                let livesP2ToDisplay = 0;

                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    if (player1Lives > 0) livesP1ToDisplay = Math.max(0, player1Lives -1);
                    if (player2Lives > 0) livesP2ToDisplay = Math.max(0, player2Lives -1);
                } else {
                     if (playerLives > 0) livesP1ToDisplay = Math.max(0, playerLives - 1);
                }
                const maxLivesIcons = 5;
                for (let i = 0; i < Math.min(livesP1ToDisplay, maxLivesIcons); i++) {
                    const currentIconX = LIFE_ICON_MARGIN_LEFT + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                    gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                }
                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    const p2LivesStartX = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT - (Math.min(livesP2ToDisplay, maxLivesIcons) * (LIFE_ICON_SIZE + LIFE_ICON_SPACING)) + LIFE_ICON_SPACING;
                     for (let i = 0; i < Math.min(livesP2ToDisplay, maxLivesIcons); i++) {
                        const currentIconX = p2LivesStartX + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING);
                        gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE);
                    }
                }
            }
        }
        gameCtx.restore();


        gameCtx.save();
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            if (ship1 && player1Lives > 0 && !isPlayer1WaitingForRespawn && !isPlayer1ShipCaptured) {
                let shouldDrawP1 = true;
                if (isPlayer1Invincible) {
                    const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                    if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawP1 = false;
                }
                if (shouldDrawP1) {
                    const shipDrawX = ship1.x;
                    const shipDrawY = ship1.y;
                    if (typeof shipImage !== 'undefined' && shipImage.complete) {
                        gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height);
                        if (player1IsDualShipActive) {
                             gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship1.width, ship1.height);
                        }
                    } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship1.width, ship1.height); }
                }
            }
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
        } else {
            if (ship && !isShowingCaptureMessage) {
                let shouldDrawShip = true;
                if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isInvincible) {
                    const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS;
                    if ((now % blinkCycleTime) >= INVINCIBILITY_BLINK_ON_MS) shouldDrawShip = false;
                }
                if (shouldDrawShip) {
                    let shipDrawX = ship.x;
                    let shouldCenterSingleShip = (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0 || !isInGameState || isShowingScoreScreen || (isInGameState && isShowingIntro && !isManualControl && (introStep === 1 || introStep === 2 || introStep === 3))) && !isDualShipActive;
                    if (shouldCenterSingleShip) { shipDrawX = Math.round(gameCanvas.width / 2 - ship.width / 2); }
                    const shipDrawY = ship.y;
                    if (typeof shipImage !== 'undefined' && shipImage.complete) {
                        gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height);
                        if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isDualShipActive && !isShipCaptured) {
                            gameCtx.drawImage(shipImage, Math.round(shipDrawX + DUAL_SHIP_OFFSET_X), Math.round(shipDrawY), ship.width, ship.height);
                        }
                    } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height); }
                }
            }
        }
        if (fallingShips.length > 0 && typeof shipImage !== 'undefined' && shipImage.complete) { /* ... */ }
        gameCtx.restore();


        if (!isInGameState) {
             if (isShowingScoreScreen) { /* ... score screen ... */ }
             else {
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
                else if (isPlayerSelectMode) { drawCanvasButton("1 PLAYER", 0, selectedButtonIndex === 0); drawCanvasButton("2 PLAYER", 1, selectedButtonIndex === 1); }
                else { drawCanvasButton("START GAME", 0, selectedButtonIndex === 0); drawCanvasButton("GAME EXIT", 1, selectedButtonIndex === 1); }

                const exitButtonRect = getMenuButtonRect(1); let subtitleCenterY; if (exitButtonRect) { subtitleCenterY = exitButtonRect.y + exitButtonRect.height + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); } else { subtitleCenterY = groupStartYForLayout + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + (2 * MENU_BUTTON_HEIGHT) + MENU_BUTTON_V_GAP + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); }
                drawCanvasText( MENU_SUBTITLE_TEXT, canvasCenterX - 1, Math.round(subtitleCenterY), MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', true );
                gameCtx.restore();
            }
        } else {
            if (gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
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
            else {
                if (isShowingPlayerGameOverMessage) { /* ... */ }
                else if (gameOverSequenceStartTime > 0) { /* ... */ }
            }
        }
    } catch (e) {
        console.error("Error in renderGame:", e, e.stack);
        if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null;
        try {
            if (gameCtx && gameCanvas) {
                gameCtx.fillStyle = 'red';
                gameCtx.font = '20px sans-serif';
                gameCtx.textAlign = 'center';
                gameCtx.fillText('FATAL RENDER ERROR.', gameCanvas.width / 2, gameCanvas.height/2);
            }
        } catch(err) {}
        try { showMenuState(); } catch (menuErr) {}
    }
} // Einde renderGame


function hideCursor() { if (gameCanvas) { gameCanvas.style.cursor = 'none'; } mouseIdleTimerId = null; }

function handleCanvasMouseMove(event) {
    if (!gameCanvas) return; clearTimeout(mouseIdleTimerId); mouseIdleTimerId = null;
    let currentCursorStyle = 'default';
    const isInAnyMenuState = !isInGameState && !isShowingScoreScreen;
    let hoveringButton = false; let newSelectedButtonIndex = selectedButtonIndex;

    if (isInAnyMenuState) {
        const rect = gameCanvas.getBoundingClientRect(); const scaleX = gameCanvas.width / rect.width; const scaleY = gameCanvas.height / rect.height; const mouseX = (event.clientX - rect.left) * scaleX; const mouseY = (event.clientY - rect.top) * scaleY;
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);
        if (button0Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button0Rect)) { newSelectedButtonIndex = 0; hoveringButton = true; }
        else if (button1Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button1Rect)) { newSelectedButtonIndex = 1; hoveringButton = true; }
        else { newSelectedButtonIndex = -1; hoveringButton = false; }

        if (newSelectedButtonIndex !== selectedButtonIndex) {
            selectedButtonIndex = newSelectedButtonIndex;
            if (hoveringButton) { stopAutoDemoTimer(); }
        }
        currentCursorStyle = hoveringButton ? 'pointer' : 'default';
    } else { currentCursorStyle = 'default'; selectedButtonIndex = -1; }
    gameCanvas.style.cursor = currentCursorStyle; mouseIdleTimerId = setTimeout(hideCursor, 2000);
    if (!isInGameState) { const now = Date.now(); if (now - lastMouseMoveResetTime > 500) { if (typeof startAutoDemoTimer === 'function' && !hoveringButton) startAutoDemoTimer(); lastMouseMoveResetTime = now; } }
}

// --- <<< Touch Event Handlers TOEGEVOEGD >>> ---
/** Haalt de canvas-coördinaten op uit een touch event */
function getTouchPos(canvas, touchEvent) {
    const touchList = touchEvent.changedTouches && touchEvent.changedTouches.length > 0 ? touchEvent.changedTouches : touchEvent.touches;
    if (!canvas || !touchList || touchList.length === 0) {
        return null;
    }
    const rect = canvas.getBoundingClientRect();
    const touch = touchList[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

function handleTouchStart(event) {
    if (!gameCanvas) return;
    event.preventDefault();
    const touchPos = getTouchPos(gameCanvas, event);
    if (!touchPos) return;

    isTouching = true;
    touchStartX = touchPos.x;
    touchCurrentX = touchPos.x;
    isDraggingShip = false;
    lastTapTime = Date.now();
    touchJustFiredSingle = false;
    isTouchFiringActive = false;

    const inGameReady = isInGameState && !isPaused && ship && isManualControl && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShowingIntro && !isShipCaptured && !isShowingCaptureMessage;

    if (inGameReady) {
        const shipCenterX = ship.x + ship.width / 2;
        const shipTouchRect = {
            x: ship.x - ship.width * 0.25,
            y: ship.y - ship.height * 0.5,
            width: ship.width * 1.5,
            height: ship.height * 2
        };
        if (checkCollision({ x: touchPos.x, y: touchPos.y, width: 1, height: 1 }, shipTouchRect)) {
            shipTouchOffsetX = touchPos.x - shipCenterX;
        } else {
            shipTouchOffsetX = 0;
        }
        if (selectedFiringMode === 'rapid') {
             isTouchFiringActive = true;
             if (typeof firePlayerBullet === 'function') {
                 firePlayerBullet(false);
             }
        }
    } else {
        shipTouchOffsetX = 0;
    }
}

function handleTouchMove(event) {
    if (!isTouching || !gameCanvas) return;
    event.preventDefault();
    const touchPos = getTouchPos(gameCanvas, event);
    if (!touchPos) return;

    touchCurrentX = touchPos.x;
    const dx = Math.abs(touchCurrentX - touchStartX);
    const timeSinceTouchStart = Date.now() - lastTapTime;

    if (!isDraggingShip) {
        if (dx > MIN_DRAG_DISTANCE_FOR_TAP_CANCEL || timeSinceTouchStart > MIN_DRAG_TIME_FOR_TAP_CANCEL) {
            isDraggingShip = true;
        }
    }

    const canDragShip = isInGameState && !isPaused && ship && isManualControl && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShipCaptured && !isShowingCaptureMessage && !isWaitingForRespawn && !isCsCompletionDelayActive;

    if (isDraggingShip && canDragShip) {
        let targetShipCenterX = touchCurrentX - shipTouchOffsetX;
        let targetShipX = targetShipCenterX - ship.width / 2;

        const effectiveShipWidth = isDualShipActive ? ship.width + DUAL_SHIP_OFFSET_X : ship.width;
        ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, targetShipX));
        ship.targetX = ship.x;
    }
}


function handleTouchEnd(event) {
    if (!isTouching || !gameCanvas) return;
    event.preventDefault();

    const wasTap = !isDraggingShip;

    if (wasTap) {
        const touchPosEnd = getTouchPos(gameCanvas, event);
        if (!touchPosEnd) {
             isTouching = false; isDraggingShip = false; shipTouchOffsetX = 0; touchStartX = 0; isTouchFiringActive = false; return;
        }

        if (isInGameState && !isShowingIntro && ui2upRect && checkCollision({ x: touchPosEnd.x, y: touchPosEnd.y, width: 1, height: 1 }, ui2upRect)) {
            if (typeof stopGameAndShowMenu === 'function') {
                stopGameAndShowMenu();
                isTouching = false; isDraggingShip = false; shipTouchOffsetX = 0; touchStartX = 0; isTouchFiringActive = false;
                return;
            }
        }
        else if ((!isInGameState || isShowingScoreScreen) && !isShowingIntro) {
            if (typeof processMenuInteraction === 'function') {
                processMenuInteraction(touchPosEnd.x, touchPosEnd.y);
            }
        }
        else if (isInGameState && !isShowingIntro && isManualControl && playerLives > 0 &&
            !isPaused && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShipCaptured && !isShowingCaptureMessage && !isWaitingForRespawn && !isCsCompletionDelayActive && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !showExtraLifeMessage)
        {
             if (selectedFiringMode === 'single') {
                 if (typeof firePlayerBullet === 'function') {
                     if (!touchJustFiredSingle) {
                         if (firePlayerBullet(false)) {
                             touchJustFiredSingle = true;
                         }
                     }
                 }
             }
        }
    }

    isTouching = false;
    isDraggingShip = false;
    shipTouchOffsetX = 0;
    touchStartX = 0;
    isTouchFiringActive = false;
}

function handleTouchCancel(event) {
    if (!isTouching) return;
    event.preventDefault();
    isTouching = false;
    isDraggingShip = false;
    shipTouchOffsetX = 0;
    touchStartX = 0;
    isTouchFiringActive = false;
    touchJustFiredSingle = false;
}
// --- EINDE Touch Event Handlers ---

function mainLoop(timestamp) {
    try {
        drawStars(); if (retroGridCtx && retroGridCanvas) { drawRetroGrid(); } pollControllerForMenu();
        if (isInGameState && !isPaused) {
            if (!isManualControl && connectedGamepadIndex !== null) { const gamepads = navigator.getGamepads(); if (gamepads?.[connectedGamepadIndex]) { const gamepad = gamepads[connectedGamepadIndex]; const currentDemoButtonStates = gamepad.buttons.map(b => b.pressed); let anyButtonPressedNow = false; for (let i = 0; i < currentDemoButtonStates.length; i++) { if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue; if (currentDemoButtonStates[i] && !(previousDemoButtonStates[i] ?? false)) { anyButtonPressedNow = true; break; } } if (anyButtonPressedNow) { stopSound('menuMusicSound'); showMenuState(); requestAnimationFrame(mainLoop); return; } previousDemoButtonStates = currentDemoButtonStates.slice(); } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; } } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; }

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
        // Main loop is already running
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
            // <<< Touch event listeners TOEGEVOEGD >>>
            gameCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            gameCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
            gameCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
            gameCanvas.addEventListener('touchcancel', handleTouchCancel, { passive: false });
            // <<< EINDE Touch event listeners >>>
        } else { console.error("Cannot add canvas listeners: gameCanvas not found during init."); }
        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        window.addEventListener('resize', resizeCanvases);

        showMenuState(); // Initialiseer naar de hoofdmenu state

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
// --- END OF FILE rendering_menu.js ---