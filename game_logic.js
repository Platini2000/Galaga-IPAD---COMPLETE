// --- START OF FILE game_logic.js ---
// --- DEEL 1      van 8 dit code blok    ---


function generateAttackPathInternal(enemy) { // Hernoemd naar Internal
    try {
        if (!enemy || !gameCanvas) {
            return [];
        }

        const enemyWidth = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
        const enemyHeight = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);
        const margin = enemyWidth * 0.5;

        const canvasW = gameCanvas.width;
        const canvasH = gameCanvas.height;
        let generatedSegments = [];

        const initialP0 = { x: enemy.x, y: enemy.y };
        const upwardArcHeight = Math.min(canvasH * 0.06, enemyHeight * 1.8);
        const upwardArcWidth = Math.min(canvasW * 0.04, enemyWidth * 1.2);
        const diveDirection = (enemy.x + enemyWidth / 2 < canvasW / 2) ? 1 : -1;
        const upwardEndPoint = {
            x: initialP0.x - diveDirection * upwardArcWidth * 0.6,
            y: initialP0.y - upwardArcHeight
        };
        upwardEndPoint.x = Math.max(margin, Math.min(canvasW - margin - enemyWidth, upwardEndPoint.x));
        upwardEndPoint.y = Math.max(margin, upwardEndPoint.y);
        const initialP1 = {
            x: initialP0.x + diveDirection * upwardArcWidth * 0.1,
            y: initialP0.y - upwardArcHeight * 1.4
        };
        const initialP2 = {
            x: upwardEndPoint.x + diveDirection * upwardArcWidth * 0.3,
            y: initialP0.y - upwardArcHeight * 1.5
        };
        const initialUpwardSegment = { p0: initialP0, p1: initialP1, p2: initialP2, p3: upwardEndPoint };
        generatedSegments.push(initialUpwardSegment);

        const startPoint = upwardEndPoint;
        const diveDepthBase = canvasH * 0.45;
        const loopWidthBase = canvasW * 0.22;
        const loopHeightBase = canvasH * 0.28;
        const controlTightnessX = 0.5;
        const controlTightnessY = 0.6;
        const bottomAvoidAttackY = canvasH * 0.85;
        const attackPatternType = Math.floor(Math.random() * 3);
        let diveSegments = [];

        if (attackPatternType === 0) { // Patroon 0: Dive with a loop and exit
            const diveDepth = diveDepthBase + Math.random() * canvasH * 0.1; const loopWidth = loopWidthBase + Math.random() * canvasW * 0.08; const loopHeight = loopHeightBase + Math.random() * canvasH * 0.08;
            const divePointX = startPoint.x + diveDirection * loopWidth * 0.5; const divePointY = Math.min(bottomAvoidAttackY, startPoint.y + diveDepth);
            const loopTopX = divePointX + diveDirection * loopWidth * 0.5; const loopTopY = Math.max(startPoint.y + 20, divePointY - loopHeight);
            const returnPointX = loopTopX - diveDirection * loopWidth * 0.9; const returnPointY = Math.max(startPoint.y + 40, loopTopY + loopHeight * 0.6);
            const exitPointX = returnPointX - diveDirection * loopWidth * 0.3; const exitPointY = canvasH + enemyHeight * 2;
            const clampedDivePointX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, divePointX));
            const clampedLoopTopX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loopTopX));
            const clampedReturnPointX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, returnPointX));
            const p1_seg1 = { x: startPoint.x, y: startPoint.y + diveDepth * controlTightnessY * 0.5 };
            const p2_seg1 = { x: clampedDivePointX - diveDirection * loopWidth * controlTightnessX, y: divePointY };
            const seg1_p3 = { x: clampedDivePointX, y: divePointY };
            const p1_seg2 = { x: clampedDivePointX + diveDirection * loopWidth * controlTightnessX, y: divePointY };
            const p2_seg2 = { x: clampedLoopTopX, y: loopTopY + loopHeight * controlTightnessY };
            const seg2_p3 = { x: clampedLoopTopX, y: loopTopY };
            const p1_seg3 = { x: clampedLoopTopX, y: loopTopY - loopHeight * controlTightnessY * 0.5 };
            const p2_seg3 = { x: clampedReturnPointX + diveDirection * loopWidth * controlTightnessX, y: returnPointY };
            const seg3_p3 = { x: clampedReturnPointX, y: returnPointY };
            const p1_seg4 = { x: seg3_p3.x, y: seg3_p3.y + canvasH * 0.1 };
            const p2_seg4 = { x: exitPointX, y: exitPointY - canvasH * 0.2 };
            const seg4_p3 = { x: exitPointX, y: exitPointY };
            diveSegments = [ { p0: startPoint, p1: p1_seg1, p2: p2_seg1, p3: seg1_p3 }, { p0: seg1_p3, p1: p1_seg2, p2: p2_seg2, p3: seg2_p3 }, { p0: seg2_p3, p1: p1_seg3, p2: p2_seg3, p3: seg3_p3 }, { p0: seg3_p3, p1: p1_seg4, p2: p2_seg4, p3: seg4_p3 } ];
        } else if (attackPatternType === 1) { // Patroon 1: Wider curve, less looping
            const diveDepth = diveDepthBase * 0.8 + Math.random() * canvasH * 0.1; const curveWidth = loopWidthBase * 1.2 + Math.random() * canvasW * 0.1; const curveHeight = loopHeightBase * 0.7 + Math.random() * canvasH * 0.1;
            const midPoint1X = startPoint.x + diveDirection * curveWidth * 0.4; const midPoint1Y = Math.min(bottomAvoidAttackY - curveHeight*0.5, startPoint.y + diveDepth * 0.6);
            const midPoint2X = midPoint1X + diveDirection * curveWidth * 0.6; const midPoint2Y = Math.min(bottomAvoidAttackY, midPoint1Y + curveHeight);
            const exitPointX = midPoint2X - diveDirection * curveWidth * 0.5; const exitPointY = canvasH + enemyHeight * 2;
            const clampedMid1X = Math.max(margin, Math.min(canvasW - margin - enemyWidth, midPoint1X));
            const clampedMid2X = Math.max(margin, Math.min(canvasW - margin - enemyWidth, midPoint2X));
            const p1_seg1 = { x: startPoint.x - diveDirection * curveWidth * 0.1, y: startPoint.y + diveDepth * 0.3 };
            const p2_seg1 = { x: clampedMid1X - diveDirection * curveWidth * controlTightnessX * 0.8, y: midPoint1Y + curveHeight * controlTightnessY * 0.4 };
            const seg1_p3 = { x: clampedMid1X, y: midPoint1Y };
            const p1_seg2 = { x: clampedMid1X + diveDirection * curveWidth * controlTightnessX * 0.8, y: midPoint1Y - curveHeight * controlTightnessY * 0.4 };
            const p2_seg2 = { x: clampedMid2X + diveDirection * curveWidth * controlTightnessX * 0.6, y: midPoint2Y + curveHeight * controlTightnessY * 0.5 };
            const seg2_p3 = { x: clampedMid2X, y: midPoint2Y };
            const p1_seg3 = { x: clampedMid2X - diveDirection * curveWidth * 0.2, y: midPoint2Y + canvasH * 0.1 };
            const p2_seg3 = { x: exitPointX, y: exitPointY - canvasH * 0.3 };
            const seg3_p3 = { x: exitPointX, y: exitPointY };
            diveSegments = [ { p0: startPoint, p1: p1_seg1, p2: p2_seg1, p3: seg1_p3 }, { p0: seg1_p3, p1: p1_seg2, p2: p2_seg2, p3: seg2_p3 }, { p0: seg2_p3, p1: p1_seg3, p2: p2_seg3, p3: seg3_p3 } ];
        } else { // Patroon 2: Double small loop
            const diveDepth = diveDepthBase * 0.6 + Math.random() * canvasH * 0.05; const loopWidth = loopWidthBase * 0.7 + Math.random() * canvasW * 0.05; const loopHeight = loopHeightBase * 0.6 + Math.random() * canvasH * 0.05; const loopOffsetY = loopHeight * 1.5;
            const loop1TopX = startPoint.x + diveDirection * loopWidth * 0.5; const loop1TopY = Math.min(bottomAvoidAttackY - loopOffsetY, startPoint.y + diveDepth);
            const loop1BottomX = loop1TopX + diveDirection * loopWidth * 0.5; const loop1BottomY = loop1TopY + loopHeight;
            const loop2TopX = loop1BottomX - diveDirection * loopWidth * 0.8; const loop2TopY = Math.min(bottomAvoidAttackY, loop1BottomY + loopOffsetY * 0.7);
            const loop2BottomX = loop2TopX + diveDirection * loopWidth * 0.4; const loop2BottomY = loop2TopY + loopHeight * 0.8;
            const exitPointX = loop2BottomX; const exitPointY = canvasH + enemyHeight * 2;
            const clpL1TX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop1TopX));
            const clpL1BX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop1BottomX));
            const clpL2TX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop2TopX));
            const clpL2BX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop2BottomX));
            const p1_L1_1 = { x: startPoint.x, y: startPoint.y + diveDepth*0.5 };
            const p2_L1_1 = { x: clpL1TX - diveDirection * loopWidth * controlTightnessX, y: loop1TopY + loopHeight*controlTightnessY*0.3 };
            const p3_L1_1 = { x: clpL1TX, y: loop1TopY };
            const p1_L1_2 = { x: clpL1TX + diveDirection * loopWidth * controlTightnessX, y: loop1TopY - loopHeight*controlTightnessY*0.3 };
            const p2_L1_2 = { x: clpL1BX + diveDirection * loopWidth * controlTightnessX, y: loop1BottomY + loopHeight*controlTightnessY*0.5 };
            const p3_L1_2 = { x: clpL1BX, y: loop1BottomY };
            const p1_L2_1 = { x: clpL1BX - diveDirection * loopWidth * controlTightnessX, y: loop1BottomY - loopHeight*controlTightnessY*0.5 };
            const p2_L2_1 = { x: clpL2TX - diveDirection * loopWidth * controlTightnessX, y: loop2TopY + loopHeight*controlTightnessY*0.4 };
            const p3_L2_1 = { x: clpL2TX, y: loop2TopY };
            const p1_L2_2 = { x: clpL2TX + diveDirection * loopWidth * controlTightnessX, y: loop2TopY - loopHeight*controlTightnessY*0.4 };
            const p2_L2_2 = { x: clpL2BX + diveDirection * loopWidth * controlTightnessX, y: loop2BottomY + loopHeight*controlTightnessY*0.6 };
            const p3_L2_2 = { x: clpL2BX, y: loop2BottomY };
            const p1_EXIT = { x: clpL2BX - diveDirection*loopWidth*0.1, y: loop2BottomY + canvasH*0.05 };
            const p2_EXIT = { x: exitPointX, y: exitPointY - canvasH*0.2 };
            const p3_EXIT = { x: exitPointX, y: exitPointY };
            diveSegments = [ {p0: startPoint, p1: p1_L1_1, p2: p2_L1_1, p3: p3_L1_1}, {p0: p3_L1_1, p1: p1_L1_2, p2: p2_L1_2, p3: p3_L1_2}, {p0: p3_L1_2, p1: p1_L2_1, p2: p2_L2_1, p3: p3_L2_1}, {p0: p3_L2_1, p1: p1_L2_2, p2: p2_L2_2, p3: p3_L2_2}, {p0: p3_L2_2, p1: p1_EXIT, p2: p2_EXIT, p3: p3_EXIT}, ];
        }
        generatedSegments.push(...diveSegments);
        return generatedSegments;
    } catch (e) {
         console.error(`[DEBUG] Error generating attack path for enemy ${enemy?.id}:`, e);
         return [];
    }
}
window.generateAttackPath = generateAttackPathInternal;


// --- Functie Definities voor Reset & Game Flow ---

/** Helper functie om alle berichtvlaggen te resetten. */
function resetAllMessagesInternal() {
    showReadyMessage = false;
    isShowingIntro = false;
    showCsHitsMessage = false;
    showPerfectMessage = false;
    showCsBonusScoreMessage = false;
    showCSClearMessage = false;
    showCsHitsForClearMessage = false;
    showCsScoreForClearMessage = false;
    showExtraLifeMessage = false;
    isShowingCaptureMessage = false;
    isShowingPlayerGameOverMessage = false;
    isShowingCoopPlayersReady = false;

    csHitsMessageStartTime = 0;
    perfectMessageStartTime = 0;
    csBonusScoreMessageStartTime = 0;
    csClearMessageStartTime = 0;
    extraLifeMessageStartTime = 0;
    readyMessageStartTime = 0;
    captureMessageStartTime = 0;
    playerGameOverMessageStartTime = 0;
    csCompletionDelayStartTime = 0;
    introDisplayStartTime = 0;
    coopPlayersReadyStartTime = 0;
}
window.resetAllMessages = resetAllMessagesInternal;

/** Helper functie om game geluiden te stoppen. */
function stopAllGameSoundsInternal() {
    // Stop alle geluiden via hun sound ID's.
    // soundPaths is gedefinieerd in setup_utils.js
    if (typeof soundPaths === 'object' && soundPaths !== null && typeof stopSound === 'function') {
        for (const soundId in soundPaths) {
            stopSound(soundId);
        }
    }
    isGridSoundPlaying = false; // Reset specifieke vlaggen
}
window.stopAllGameSounds = stopAllGameSoundsInternal;

/**
 * Reset de volledige game state naar beginwaarden.
 */
function resetGameInternal() {
    score = 0;
    level = 1;
    playerLives = 3;

    if (isTwoPlayerMode) {
        player1Lives = 3;
        player2Lives = 3;
        player1Score = 0;
        player2Score = 0;
        currentPlayer = 1;
        player1CompletedLevel = -1;
        player1MaxLevelReached = 1;
        player2MaxLevelReached = 1;
        if (player1LifeThresholdsMet instanceof Set) player1LifeThresholdsMet.clear(); else player1LifeThresholdsMet = new Set();
        if (player2LifeThresholdsMet instanceof Set) player2LifeThresholdsMet.clear(); else player2LifeThresholdsMet = new Set();

        player1IsDualShipActive = false;
        player2IsDualShipActive = false;
        isPlayer1ShipCaptured = false;
        isPlayer2ShipCaptured = false;
        isPlayer1WaitingForRespawn = false;
        isPlayer2WaitingForRespawn = false;
        isPlayer1Invincible = false;
        isPlayer2Invincible = false;
        player1RespawnTime = 0;
        player2RespawnTime = 0;
        player1InvincibilityEndTime = 0;
        player2InvincibilityEndTime = 0;
        player1CaptureRespawnX = 0;
        player2CaptureRespawnX = 0;
        player1NeedsRespawnAfterCapture = false;
        player2NeedsRespawnAfterCapture = false;

        if (selectedGameMode === 'coop') { // Geldt voor Human COOP, 1P vs AI COOP, COOP AI Demo
            playerLives = 0;
            if (gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
                const p1InitialX = gameCanvas.width / 2 - gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                const p2InitialX = gameCanvas.width / 2 + gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                const shipBaseY = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;

                ship1 = { x: p1InitialX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: p1InitialX, id: 'p1' };
                ship2 = { x: p2InitialX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: p2InitialX, id: 'p2' };

                if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                    smoothedShip1X = p1InitialX;
                    smoothedShip2X = p2InitialX;
                    aiShip1TargetEnemy = null;
                    aiShip2TargetEnemy = null;
                    aiShip1CanShootTime = 0;
                    aiShip2CanShootTime = 0;
                    aiShip1LastShotTime = 0;
                    aiShip2LastShotTime = 0;
                    aiPlayerActivelySeekingCaptureById = null;
                    coopAICaptureDiveAnticipationActive = false;
                    coopAICaptureDiveAnticipationEndTime = 0;
                }
            }
            ship = null;
        } else { // selectedGameMode === 'normal' (Human 2P Normal, 1P vs AI Normal)
            if (!ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
                 ship = { x: Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2), y: gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: 0, id: 'main' };
                 ship.targetX = ship.x;
            } else if (ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
                 ship.x = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2);
                 ship.targetX = ship.x;
                 ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
            }
            ship1 = null;
            ship2 = null;
        }
    } else { // 1P Classic
        player1Lives = 3;
        player1Score = 0;
        player1MaxLevelReached = 1;
        if (player1LifeThresholdsMet instanceof Set) player1LifeThresholdsMet.clear(); else player1LifeThresholdsMet = new Set();

        if (!ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
             ship = { x: Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2), y: gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: 0, id: 'main' };
             ship.targetX = ship.x;
        } else if (ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
             ship.x = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2);
             ship.targetX = ship.x;
             ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
        }
        ship1 = null; ship2 = null;
    }

    isShipCaptured = false;
    isWaitingForRespawn = false;
    respawnTime = 0;
    isInvincible = false;
    invincibilityEndTime = 0;
    isDualShipActive = false;
    if (!isTwoPlayerMode) player1IsDualShipActive = false;

    fallingShips = [];
    visualOffsetX = -20;

    gameOverSequenceStartTime = 0;
    isShowingResultsScreen = false;
    gameStartTime = Date.now();
    gameJustStarted = true;
    gameJustStartedAndWaveLaunched = false;

    currentGridOffsetX = 0;
    gridMoveDirection = 1;
    gridJustCompleted = false;
    isGridBreathingActive = false;
    gridBreathStartTime = 0;
    currentGridBreathFactor = 0;
    lastGridFireCheckTime = 0;

    player1ShotsFired = 0;
    player2ShotsFired = 0;
    player1EnemiesHit = 0;
    player2EnemiesHit = 0;
    scoreEarnedThisCS = 0;
    challengingStageEnemiesHit = 0;

    aiNeedsStabilization = true;
    aiStabilizationEndTime = 0;
    smoothedShipX = undefined;
    aiCanShootTime = 0;
    aiLastShotTime = 0;
    // aiPlayerActivelySeekingCaptureById en coopAICapture... zijn al gereset in de COOP specifieke if-tak
    if (!(selectedGameMode === 'coop' && (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')))) {
        aiPlayerActivelySeekingCaptureById = null;
        coopAICaptureDiveAnticipationActive = false;
        coopAICaptureDiveAnticipationEndTime = 0;
    }


    playerLastShotTime = 0;
    player1LastShotTime = 0;
    player2LastShotTime = 0;
    p1FireInputWasDown = false; p2FireInputWasDown = false;
    p1JustFiredSingle = false; p2JustFiredSingle = false;

    player1TriggeredHighScoreSound = false;
    player2TriggeredHighScoreSound = false;

    isShowingCoopPlayersReady = false;
    coopPlayersReadyStartTime = 0;

    resetWaveInternal();
}
window.resetGame = resetGameInternal;


/**
 * Reset de state voor een nieuwe wave (ronde).
 */
function resetWaveInternal() {
    isWaveTransitioning = false;
    readyForNextWave = false;
    readyForNextWaveReset = false;
    isEntrancePhaseActive = true;
    firstEnemyLanded = false;
    captureAttemptMadeThisLevel = false;
    gameJustStartedAndWaveLaunched = false;
    aiPlayerActivelySeekingCaptureById = null;
    coopAICaptureDiveAnticipationActive = false;
    coopAICaptureDiveAnticipationEndTime = 0;
    player1CaptureRespawnX = 0;
    player2CaptureRespawnX = 0;
    player1NeedsRespawnAfterCapture = false;
    player2NeedsRespawnAfterCapture = false;


    enemies = [];
    bullets = [];
    enemyBullets = [];
    explosions = [];
    floatingScores = [];
    hitSparks = [];

    if (Array.isArray(enemySpawnTimeouts)) {
        enemySpawnTimeouts.forEach(clearTimeout);
    }
    enemySpawnTimeouts = [];
    squadronCompletionStatus = {};
    squadronEntranceFiringStatus = {};
    totalEnemiesScheduledForWave = 0;
    enemiesSpawnedThisWave = 0;

    const currentWaveType = getWaveTypeInternal(level);
    isChallengingStage = currentWaveType === 'challenging_stage';
    isFullGridWave = currentWaveType === 'full_grid';

    challengingStageEnemiesHit = 0;
    scoreEarnedThisCS = 0;
    csCurrentChainHits = 0;
    csCurrentChainScore = 0;
    csLastHitTime = 0;
    csLastChainHitPosition = null;


    if (isFullGridWave || isChallengingStage) {
        isEntrancePhaseActive = false;
    }

    const wasShowingDemoText = isShowingDemoText;
    resetAllMessagesInternal();
    if (wasShowingDemoText) {
        isShowingDemoText = true;
    }

    // --- AANGEPASTE INTRODUCTIE LOGICA ---
    if (selectedGameMode === 'coop' && level === 1) { // Geldt voor Human COOP, 1P vs AI COOP, COOP AI Demo
        // "PLAYERS READY" wordt al getoond via baseStartGame.
        // Na "PLAYERS READY", zal runSingleGameUpdate overgaan naar de "STAGE 1" intro.
        isShowingIntro = false; // Wordt true na PLAYERS READY in runSingleGameUpdate
        introStep = 2; // Klaarzetten voor STAGE 1
    } else if ((isTwoPlayerMode && selectedGameMode === 'normal') ||
               (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL')) {
        introStep = 1;
        isShowingIntro = true;
        if (!isManualControl) isShowingDemoText = true;
    } else if (isChallengingStage) {
        introStep = 3;
        isShowingIntro = true;
        if (!isManualControl) isShowingDemoText = true;
    } else if (level === 1 && !isTwoPlayerMode) { // 1P Classic (level 1)
        introStep = 1;
        isShowingIntro = true;
        if (!isManualControl) isShowingDemoText = true;
    } else { // 1P Classic (level > 1), of COOP modes (level > 1), of 1P vs AI Normal (level > 1)
        introStep = 2;
        isShowingIntro = true;
        if (!isManualControl) isShowingDemoText = true;
    }
    // --- EINDE AANGEPASTE INTRODUCTIE LOGICA ---


    if (isShowingIntro && !(selectedGameMode === 'coop' && level === 1)) {
        introDisplayStartTime = Date.now();
    }
    playerIntroSoundPlayed = false;
    stageIntroSoundPlayed = false;
    csIntroSoundPlayed = false;

    currentWaveDefinition = generateWaveDefinitionInternal(level);

    // Correcte positionering van schepen bij aanvang van een wave
    if (selectedGameMode === 'coop') { // Geldt voor Human COOP, 1P vs AI COOP, COOP AI Demo
        if (gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) {
            const p1Active = ship1 && player1Lives > 0;
            const p2Active = ship2 && player2Lives > 0;
            const shipBaseY = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;

            if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                if (p1Active && p2Active) {
                    const p1InitialX = gameCanvas.width / 2 - gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                    if(ship1) { ship1.targetX = p1InitialX; ship1.x = p1InitialX; smoothedShip1X = p1InitialX; ship1.y = shipBaseY;}
                    const p2InitialX = gameCanvas.width / 2 + gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                    if(ship2) { ship2.targetX = p2InitialX; ship2.x = p2InitialX; smoothedShip2X = p2InitialX; ship2.y = shipBaseY;}
                } else if (p1Active && ship1) {
                    const p1EffectiveWidth = player1IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                    const centeredX1 = Math.round(gameCanvas.width / 2 - p1EffectiveWidth / 2);
                    ship1.targetX = centeredX1; ship1.x = centeredX1; smoothedShip1X = centeredX1; ship1.y = shipBaseY;
                } else if (p2Active && ship2) {
                    const p2EffectiveWidth = player2IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                    const centeredX2 = Math.round(gameCanvas.width / 2 - p2EffectiveWidth / 2);
                    ship2.targetX = centeredX2; ship2.x = centeredX2; smoothedShip2X = centeredX2; ship2.y = shipBaseY;
                }
            } else { // Human COOP (forceCenterShipNextReset wordt false gezet, dus X blijft waar het was, alleen Y reset)
                 if (p1Active && ship1) ship1.y = shipBaseY;
                 if (p2Active && ship2) ship2.y = shipBaseY;
            }
        }
    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
        if (ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0 && (forceCenterShipNextReset || !isManualControl || (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2))) {
            let effectiveWidthForCentering = ship.width;
            if (isDualShipActive) effectiveWidthForCentering = DUAL_SHIP_OFFSET_X + SHIP_WIDTH;
            ship.x = Math.round(gameCanvas.width / 2 - effectiveWidthForCentering / 2);
            ship.targetX = ship.x;
            ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
            if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) smoothedShipX = ship.x;
        } else if (ship && gameCanvas && gameCanvas.width > 0) {
            ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;
        }
    }
    forceCenterShipNextReset = false;

    if (!isManualControl && aiNeedsStabilization && selectedGameMode !== 'coop' && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2)) {
        aiStabilizationEndTime = Date.now() + AI_STABILIZATION_DURATION;
        if (ship) smoothedShipX = ship.x;
    } else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2 && aiNeedsStabilization) {
        aiStabilizationEndTime = Date.now() + AI_STABILIZATION_DURATION;
        if (ship) smoothedShipX = ship.x;
    }
}
window.resetWave = resetWaveInternal;

/**
 * Bepaalt het type wave voor een gegeven level.
 */
function getWaveTypeInternal(level) {
    const patternIndex = (level - 1) % 4;
    switch (patternIndex) {
        case 0: return 'full_grid';
        case 1: return 'entrance_flight_1';
        case 2: return 'challenging_stage';
        case 3: return 'entrance_flight_2';
        default: return 'unknown';
    }
}
window.getWaveType = getWaveTypeInternal;

/**
 * Genereert de *structuur* (layout) voor een gegeven wave level.
 */
function generateWaveDefinitionInternal(level) {
    let waveDef = [];
    currentWavePatternIndex = -1;
    const waveType = getWaveTypeInternal(level);

    if (typeof waveEntrancePatterns === 'undefined' || !Array.isArray(waveEntrancePatterns) || waveEntrancePatterns.length < 2) {
        return [];
    }

    if (waveType === 'challenging_stage') {
        waveDef = [];
    } else if (waveType === 'full_grid') {
        currentWavePatternIndex = 0;
        const selectedPattern = waveEntrancePatterns[0];
        if (!selectedPattern || selectedPattern.length === 0) {
            waveDef = [];
        } else {
            try {
                waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => {
                    if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') {
                        value.hasCapturedShip = false;
                    }
                    return value;
                });
            } catch (e) { waveDef = []; }
        }
    } else if (waveType === 'entrance_flight_1') {
        currentWavePatternIndex = 0;
        const selectedPattern = waveEntrancePatterns[0];
         if (!selectedPattern || selectedPattern.length === 0) {
            waveDef = [];
        } else {
            try {
                waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => {
                    if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') {
                        value.hasCapturedShip = false;
                    }
                    return value;
                });
            } catch (e) { waveDef = []; }
        }
    } else if (waveType === 'entrance_flight_2') {
        currentWavePatternIndex = 1;
        const selectedPattern = waveEntrancePatterns[1];
        if (!selectedPattern || selectedPattern.length === 0) {
            waveDef = [];
        } else {
            try {
                waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => {
                    if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') {
                        value.hasCapturedShip = false;
                    }
                    return value;
                });
            } catch (e) { waveDef = []; }
        }
    } else {
        waveDef = [];
    }

    if (waveType !== 'challenging_stage') {
        if (typeof normalWaveEntrancePaths === 'undefined' || Object.keys(normalWaveEntrancePaths).length === 0) {
             return waveDef;
        }
        for (let i = waveDef.length - 1; i >= 0; i--) {
            const squadron = waveDef[i];
            if (!normalWaveEntrancePaths?.[squadron.pathId]) {
                waveDef.splice(i, 1);
                continue;
            }
            if (squadron.enemies && Array.isArray(squadron.enemies)) {
                for (let j = squadron.enemies.length - 1; j >= 0; j--) {
                    const enemy = squadron.enemies[j];
                    if (!enemy || !normalWaveEntrancePaths?.[enemy.entrancePathId]) {
                        squadron.enemies.splice(j, 1);
                    }
                    if (enemy && enemy.type === ENEMY3_TYPE && typeof enemy.hasCapturedShip === 'undefined') {
                        enemy.hasCapturedShip = false;
                    }
                }
                if (squadron.enemies.length === 0) {
                    waveDef.splice(i, 1);
                }
            } else {
                 waveDef.splice(i, 1);
            }
        }
    }
    return waveDef;
}
window.generateWaveDefinition = generateWaveDefinitionInternal;


// ...
// --- EINDE deel 1      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---








// --- START OF FILE game_logic.js ---
// --- DEEL 2      van 8 dit code blok    --- (<<< REVISE: REMOVED triggerImmediateCaptureDive call from startFullGridWave >>>)


const createBulletSimple = (targetEnemy, overrideStartPos = null) => {
    let currentTargetShip = null;
    let gameActiveForTargeting = false;

    if (isTwoPlayerMode && selectedGameMode === 'coop') {
        const p1Active = ship1 && player1Lives > 0 && !isPlayer1WaitingForRespawn && !isPlayer1ShipCaptured;
        const p2Active = ship2 && player2Lives > 0 && !isPlayer2WaitingForRespawn && !isPlayer2ShipCaptured;

        if (p1Active && p2Active) {
            currentTargetShip = Math.random() < 0.5 ? ship1 : ship2;
            gameActiveForTargeting = true;
        } else if (p1Active) {
            currentTargetShip = ship1;
            gameActiveForTargeting = true;
        } else if (p2Active) {
            currentTargetShip = ship2;
            gameActiveForTargeting = true;
        }
    } else { // 1P of Alternating 2P
        if (ship && playerLives > 0 && !isShipCaptured && !isWaitingForRespawn) {
            currentTargetShip = ship;
            gameActiveForTargeting = true;
        }
    }

    if (!targetEnemy || !isInGameState || !gameActiveForTargeting || !currentTargetShip) {
        return false;
    }

    const effectiveBulletSpeed = scaleValue(level, BASE_ENEMY_BULLET_SPEED, MAX_ENEMY_BULLET_SPEED);
    const startX = overrideStartPos ? overrideStartPos.x : targetEnemy.x + targetEnemy.width / 2;
    const startY = overrideStartPos ? overrideStartPos.y : targetEnemy.y + targetEnemy.height / 2;
    let bulletVx = 0;
    let bulletVy = effectiveBulletSpeed;

    const dx = (currentTargetShip.x + currentTargetShip.width / 2) - startX;
    const dy = (currentTargetShip.y + currentTargetShip.height / 2) - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
        let aimFactor = 0;
        if (!isChallengingStage) {
            aimFactor = scaleValue(level, BASE_ENEMY_AIM_FACTOR, MAX_ENEMY_AIM_FACTOR);
        }
        let targetAngle = Math.atan2(dy, dx);
        bulletVx = Math.cos(targetAngle) * effectiveBulletSpeed * aimFactor;
        bulletVy = Math.sqrt(effectiveBulletSpeed ** 2 - bulletVx ** 2); // Herbereken Vy
        bulletVy = Math.max(effectiveBulletSpeed * (1.0 - aimFactor) * 0.5, bulletVy); // Min. neerwaartse snelheid
        if (dy < 0 && bulletVy > 0) { // Als doelwit boven is en kogel naar beneden gaat
             // Dit is meestal niet gewenst, tenzij de aimFactor heel laag is.
             // Als aimFactor hoog is, zou Math.sin(targetAngle) * effectiveBulletSpeed beter zijn.
             // Voor nu, als het doelwit significant boven is, forceer Vy negatief als Vx dat toelaat.
             // Of, als dy < 0, forceer vy positief (naar beneden)
        }
        if (dy < 0) bulletVy = Math.abs(bulletVy); // Zorg dat het altijd naar beneden gaat als doelwit boven is

        enemyBullets.push({
            x: startX - ENEMY_BULLET_WIDTH / 2,
            y: startY,
            width: ENEMY_BULLET_WIDTH,
            height: ENEMY_BULLET_HEIGHT,
            vx: bulletVx,
            vy: bulletVy,
            type: targetEnemy.type
        });
        return true;
    }
    return false;
};


/**
 * Hulpfunctie om een ENKEL squadron te plannen voor ENTRANCE FLIGHT waves.
 */
function scheduleSingleEntranceSquadron(squadronData, sqIdx, startDelay) { if (isFullGridWave || isChallengingStage) { console.warn(`[scheduleSingleEntranceSquadron] Called inappropriately for non-entrance wave type (Level ${level}, isFullGrid: ${isFullGridWave}, isCS: ${isChallengingStage}). Skipping.`); if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; } } return false; } const pathSource = normalWaveEntrancePaths; const pathId = squadronData.pathId; const pathSegments = pathSource[pathId]; if (!pathSegments || pathSegments.length === 0) { console.error(`Entrance Wave: Path ${pathId} for squadron ${sqIdx} invalid! Skipping squadron.`); if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; } } return false; } const squadronStartTimeoutId = setTimeout(() => { const sqTimeoutIdx = enemySpawnTimeouts.indexOf(squadronStartTimeoutId); if (sqTimeoutIdx > -1) enemySpawnTimeouts.splice(sqTimeoutIdx, 1);
    let gameCanContinue = false;
    if (isTwoPlayerMode && selectedGameMode === 'coop') { gameCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); }
    else { gameCanContinue = playerLives > 0 && !isShipCaptured; }

    if (isPaused || !isInGameState || !isEntrancePhaseActive || isChallengingStage || isWaveTransitioning || !gameCanContinue || isFullGridWave) { if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; } } return; } try { if (squadronEntranceFiringStatus[sqIdx]) { squadronEntranceFiringStatus[sqIdx].scheduledStartTime = Date.now() + startDelay; squadronEntranceFiringStatus[sqIdx].hasFired = false; } else { console.warn(`[scheduleSingleEntranceSquadron] Firing status for squadron ${sqIdx} not found.`); squadronEntranceFiringStatus[sqIdx] = { hasFired: false, scheduledStartTime: Date.now() + startDelay }; } const spawnDelayBetweenEnemies = ENEMY_SPAWN_DELAY_IN_SQUADRON; const spawnDelayBetweenPairs = spawnDelayBetweenEnemies * 2; const verySmallDelayForPair = 1; squadronData.enemies.forEach((enemyDef, enemyIndex) => { if (!enemyDef || !enemyDef.type || typeof enemyDef.gridRow === 'undefined' || typeof enemyDef.gridCol === 'undefined' || !enemyDef.entrancePathId) { console.error(`Entrance Wave: Invalid enemy def in squadron ${sqIdx} (Path ${pathId}), index ${enemyIndex}. Skipping.`); enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } return; } const enemyAssignedPath = pathSource[enemyDef.entrancePathId]; if (!enemyAssignedPath || enemyAssignedPath.length === 0) { console.warn(`Entrance Wave: Assigned entrance path "${enemyDef.entrancePathId}" for enemy in squadron ${sqIdx}, index ${enemyIndex} not found. Enemy will follow squadron path "${pathId}".`); } let individualSpawnDelay = 0; const waveTypeForTiming = getWaveType(level); const useWave2SpawnTiming = (waveTypeForTiming === 'entrance_flight_2') && (sqIdx === 2 || sqIdx === 3); if (useWave2SpawnTiming) { const pairIndex = Math.floor(enemyIndex / 2); if (enemyIndex % 2 === 0) { individualSpawnDelay = pairIndex * spawnDelayBetweenPairs; } else { individualSpawnDelay = pairIndex * spawnDelayBetweenPairs + verySmallDelayForPair; } } else { individualSpawnDelay = enemyIndex * ENEMY_SPAWN_DELAY_IN_SQUADRON; } const enemyTimeoutId = setTimeout(() => { const enTimeoutIdx = enemySpawnTimeouts.indexOf(enemyTimeoutId); if (enTimeoutIdx > -1) enemySpawnTimeouts.splice(enTimeoutIdx, 1);
    let spawnCanContinue = false;
    if (isTwoPlayerMode && selectedGameMode === 'coop') { spawnCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); }
    else { spawnCanContinue = playerLives > 0 && !isShipCaptured; }
    if (isPaused || !isInGameState || !isEntrancePhaseActive || isChallengingStage || isWaveTransitioning || !spawnCanContinue || isFullGridWave) { enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } return; } try { let enemyType = enemyDef.type; let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1; let enemyWidth, enemyHeight; if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; } else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; } else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; } let startX = 0, startY = 0; if (pathSegments && pathSegments[0]?.p0) { startX = pathSegments[0].p0.x; startY = pathSegments[0].p0.y; } else { throw new Error(`Invalid start segment for squadron path ${pathId}`); } let targetGridX, targetGridY; try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemyDef.gridRow, enemyDef.gridCol, enemyWidth); targetGridX = finalTargetX; targetGridY = finalTargetY; } catch(e) { console.error(`Error getting target grid pos for new enemy ${enemyDef.type} at [${enemyDef.gridRow},${enemyDef.gridCol}]`, e); targetGridX = gameCanvas?.width / 2 || 200; targetGridY = ENEMY_TOP_MARGIN + enemyDef.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); } let initialPathT = 0; const isPairingSquadron = useWave2SpawnTiming; const isSecondInPairCheck = isPairingSquadron && (enemyIndex % 2 !== 0); if (isSecondInPairCheck) { initialPathT = -ENTRANCE_PAIR_PATH_T_OFFSET; } else { initialPathT = -enemyIndex * PATH_T_OFFSET_PER_ENEMY; } const newEnemy = { x: startX, y: startY, width: enemyWidth, height: enemyHeight, targetGridX: targetGridX, targetGridY: targetGridY, speed: 0, state: 'following_entrance_path', gridRow: enemyDef.gridRow, gridCol: enemyDef.gridCol, type: enemyType, health: enemyHealth, isDamaged: false, velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0, targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0, attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null, entrancePathId: pathId, pathSegmentIndex: 0, pathT: initialPathT, squadronId: sqIdx, squadronEnemyIndex: enemyIndex, id: `enemy-entr-${sqIdx}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, justReturned: false, canFireThisDive: false, attackType: 'normal', hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined, capturedShipX: undefined, capturedShipY: undefined, capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined, captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: 1.0 }; enemies.push(newEnemy); enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } if (enemyIndex === 0) { let fireDelayMs = 1500; if (sqIdx === 0 || sqIdx === 1) { fireDelayMs = 250; } const firstEnemyId = newEnemy.id; const firstEnemyFireTimeout = setTimeout(() => { const tIdx = enemySpawnTimeouts.indexOf(firstEnemyFireTimeout); if(tIdx > -1) enemySpawnTimeouts.splice(tIdx, 1);
    let fireCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { fireCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); } else { fireCanContinue = playerLives > 0 && !isShipCaptured; }
    if (isPaused || !isInGameState || !fireCanContinue || isChallengingStage || isWaveTransitioning || isFullGridWave) return; fireFixedEnemyBurst(firstEnemyId, null, 0, 3); }, fireDelayMs); enemySpawnTimeouts.push(firstEnemyFireTimeout); } } catch (spawnError) { console.error(`Entrance Wave: Error during enemy spawn execution (Sq ${sqIdx}, Idx ${enemyIndex}, Path ${pathId}):`, spawnError); enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } } }, individualSpawnDelay); enemySpawnTimeouts.push(enemyTimeoutId); }); } catch (squadronProcessError) { console.error(`Entrance Wave: Error processing enemies for squadron ${sqIdx} (Path ${pathId}):`, squadronProcessError); if(squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; } } } }, startDelay); enemySpawnTimeouts.push(squadronStartTimeoutId); return true; };


/**
 * Plant de squadrons voor een "Entrance Flight" wave.
 */
function scheduleEntranceFlightWave() {
    if (isFullGridWave || isChallengingStage || !currentWaveDefinition || currentWaveDefinition.length === 0) {
        console.warn(`[scheduleEntranceFlightWave] Called inappropriately or with no definition. Level ${level}, isFullGrid: ${isFullGridWave}, isCS: ${isChallengingStage}, def length: ${currentWaveDefinition?.length}`);
        isEntrancePhaseActive = false;
        isWaveTransitioning = true; readyForNextWaveReset = true;
        return;
    }

    enemySpawnTimeouts.forEach(clearTimeout);
    enemySpawnTimeouts = [];
    totalEnemiesScheduledForWave = 0;
    enemiesSpawnedThisWave = 0;
    squadronCompletionStatus = {};
    squadronEntranceFiringStatus = {};

    let cumulativeDelay = 0;
    let totalSquadronsScheduled = 0;

    currentWaveDefinition.forEach((squadronData, squadronIndex) => {
        if (squadronData && squadronData.enemies && Array.isArray(squadronData.enemies) && squadronData.enemies.length > 0) {
            totalEnemiesScheduledForWave += squadronData.enemies.length;
            squadronCompletionStatus[squadronIndex] = { completed: 0, total: squadronData.enemies.length, hasFiredPostLanding: false };
            squadronEntranceFiringStatus[squadronIndex] = { hasFired: false, scheduledStartTime: 0 };

            if (scheduleSingleEntranceSquadron(squadronData, squadronIndex, cumulativeDelay)) {
                totalSquadronsScheduled++;
            }
            cumulativeDelay += NORMAL_WAVE_SQUADRON_INTERVAL;
        } else {
            console.warn(`Entrance Wave: Squadron ${squadronIndex} is empty or invalid.`);
        }
    });

    if (totalSquadronsScheduled === 0 && totalEnemiesScheduledForWave === 0) {
        console.warn(`Entrance Wave: No squadrons or enemies scheduled for level ${level}. Transitioning.`);
        isEntrancePhaseActive = false;
        isWaveTransitioning = true; readyForNextWaveReset = true;
    } else {
        isEntrancePhaseActive = true;
    }
}


/**
 * Start de sequentie voor een Challenging Stage.
 */
function startChallengingStageSequence() { currentWaveDefinition = []; isEntrancePhaseActive = false; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; squadronEntranceFiringStatus = {}; if (Object.keys(challengingStagePaths).length === 0) { defineChallengingStagePaths(); } if (Object.keys(challengingStagePaths).length === 0) { console.error("CRITICAL: Failed to define CS paths!"); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && ((isTwoPlayerMode && selectedGameMode === 'coop' && (player1Lives > 0 || player2Lives > 0)) || (!isTwoPlayerMode && playerLives > 0)))) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); return; } const fixedPathSequence = [ 'CS3_DiveLoopL_Sharp', 'CS3_DiveLoopR_Sharp', 'CS_HorizontalFlyByL', 'CS_HorizontalFlyByR' ]; const loopAttackPaths = [ 'CS_LoopAttack_TL', 'CS_LoopAttack_TR', 'CS_LoopAttack_BL', 'CS_LoopAttack_BR' ]; const requiredPaths = [...fixedPathSequence, ...loopAttackPaths]; for (const pathId of requiredPaths) { if (!challengingStagePaths.hasOwnProperty(pathId)) { console.error(`CRITICAL: Required CS path "${pathId}" not found! Aborting CS.`); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && ((isTwoPlayerMode && selectedGameMode === 'coop' && (player1Lives > 0 || player2Lives > 0)) || (!isTwoPlayerMode && playerLives > 0)))) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); return; } } let finalPathIdsForStage = [...fixedPathSequence]; let shuffledLoopPaths = [...loopAttackPaths].sort(() => Math.random() - 0.5); finalPathIdsForStage.push(...shuffledLoopPaths); currentWaveDefinition = []; for (let i = 0; i < CHALLENGING_STAGE_SQUADRON_COUNT; i++) { const pathId = finalPathIdsForStage[i]; const squadron = { pathId: pathId, enemies: [] }; for (let j = 0; j < CHALLENGING_STAGE_SQUADRON_SIZE; j++) { let enemyType = (j < Math.floor(CHALLENGING_STAGE_SQUADRON_SIZE / 2)) ? ENEMY1_TYPE : ENEMY2_TYPE; squadron.enemies.push({ type: enemyType, entrancePathId: pathId }); } currentWaveDefinition.push(squadron); } challengingStageTotalEnemies = CHALLENGING_STAGE_ENEMY_COUNT; totalEnemiesScheduledForWave = challengingStageTotalEnemies; enemiesSpawnedThisWave = 0; if (currentWaveDefinition.length > 0) { isEntrancePhaseActive = true; enemySpawnTimeouts = []; let totalTimeoutsScheduled = 0; const CS3_START_SHIFT_X = -28; const csLevelIndex = Math.floor(Math.max(0, level - 3) / 4) + 1; const effectiveBaseSpeedMultiplier = scaleValue(csLevelIndex, BASE_CS_SPEED_MULTIPLIER, MAX_CS_SPEED_MULTIPLIER); currentWaveDefinition.forEach((squadronData, squadronIndex) => { let startDelay = 0; if (squadronIndex <= 1) { startDelay = 0; } else if (squadronIndex <= 3) { startDelay = CHALLENGING_STAGE_SQUADRON_INTERVAL; } else { startDelay = (squadronIndex - 2) * CHALLENGING_STAGE_SQUADRON_INTERVAL; } let currentSpeedMultiplier = effectiveBaseSpeedMultiplier; if (squadronIndex === 2 || squadronIndex === 3) { currentSpeedMultiplier *= CS_HORIZONTAL_FLYBY_SPEED_FACTOR; } const squadronStartTimeoutId = setTimeout(() => { const sqIdx = enemySpawnTimeouts.indexOf(squadronStartTimeoutId); if (sqIdx > -1) enemySpawnTimeouts.splice(sqIdx, 1);
    let csGameCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { csGameCanContinue = player1Lives > 0 || player2Lives > 0; } else { csGameCanContinue = playerLives > 0; }
    if (!isPaused && isInGameState && isEntrancePhaseActive && isChallengingStage && !isWaveTransitioning && csGameCanContinue) { try { const pathId = squadronData.pathId; const pathSource = challengingStagePaths; const pathSegments = pathSource[pathId]; if (!pathSegments || pathSegments.length === 0) { console.error(`CS: Path ${pathId} for squadron ${squadronIndex} invalid! Skipping.`); enemiesSpawnedThisWave += squadronData.enemies.length; return; } let spawnDelayBetweenEnemies = CS_ENEMY_SPAWN_DELAY_IN_SQUADRON; if (squadronIndex >= 2 && squadronIndex <= 3) { spawnDelayBetweenEnemies = CS_HORIZONTAL_FLYBY_SPAWN_DELAY; } else if (squadronIndex >= 4) { spawnDelayBetweenEnemies = CS_LOOP_ATTACK_SPAWN_DELAY; } squadronData.enemies.forEach((enemyDef, enemyIndex) => { if (!enemyDef || !enemyDef.type) { console.error(`CS: Invalid enemy def in squadron ${squadronIndex}, index ${enemyIndex}. Skipping.`); enemiesSpawnedThisWave++; return; } const spawnDelay = enemyIndex * spawnDelayBetweenEnemies; const enemyTimeoutId = setTimeout(() => { const enIdx = enemySpawnTimeouts.indexOf(enemyTimeoutId); if (enIdx > -1) enemySpawnTimeouts.splice(enIdx, 1);
    let csSpawnCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { csSpawnCanContinue = player1Lives > 0 || player2Lives > 0; } else { csSpawnCanContinue = playerLives > 0; }
    if (isPaused || !isInGameState || !isEntrancePhaseActive || !isChallengingStage || isWaveTransitioning || !csSpawnCanContinue ) { enemiesSpawnedThisWave++; return; } try { let enemyType = enemyDef.type; let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1; let enemyWidth, enemyHeight; if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; } else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; } else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; } let startX = 0, startY = 0; if (pathSegments[0]?.p0) { startX = pathSegments[0].p0.x; startY = pathSegments[0].p0.y; } else { throw new Error(`Invalid start segment for path ${pathId}`); } if (squadronIndex === 0 || squadronIndex === 1) { startX += CS3_START_SHIFT_X; } const initialPathT_CS = -enemyIndex * PATH_T_OFFSET_PER_ENEMY; const newEnemy = { x: startX, y: startY, width: enemyWidth, height: enemyHeight, targetGridX: 0, targetGridY: 0, speed: 0, state: 'following_bezier_path', gridRow: -1, gridCol: -1, type: enemyType, health: enemyHealth, isDamaged: false, velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0, targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0, attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null, entrancePathId: pathId, pathSegmentIndex: 0, pathT: initialPathT_CS, squadronId: squadronIndex, id: `enemy-cs-${squadronIndex}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, justReturned: false, canFireThisDive: false, attackType: 'normal', hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined, capturedShipX: undefined, capturedShipY: undefined, capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined, captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: currentSpeedMultiplier }; enemies.push(newEnemy); enemiesSpawnedThisWave++; } catch (spawnError) { console.error(`CS: Error during enemy spawn execution (Sq ${squadronIndex}, Idx ${enemyIndex}, Path ${pathId}):`, spawnError); enemiesSpawnedThisWave++; } }, spawnDelay); enemySpawnTimeouts.push(enemyTimeoutId); totalTimeoutsScheduled++; }); } catch (squadronSpawnError) { console.error(`CS: Error setting up spawns for squadron ${squadronIndex}:`, squadronSpawnError); enemiesSpawnedThisWave += squadronData.enemies.length;} } else { if(squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; } } }, startDelay); enemySpawnTimeouts.push(squadronStartTimeoutId); }); } else { console.warn("CS: No squadrons generated. Skipping CS sequence."); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && ((isTwoPlayerMode && selectedGameMode === 'coop' && (player1Lives > 0 || player2Lives > 0)) || (!isTwoPlayerMode && playerLives > 0)))) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); } }


/**
 * Vuur een burst van vijandelijke kogels af, met een GESCHAALD aantal kogels.
 */
function fireEnemyBurst(enemyId, requiredState, initialDelayMs) {
    let fireBurstCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { fireBurstCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); } else { fireBurstCanContinue = playerLives > 0 && !isShipCaptured; }
    if (!enemyId || isPaused || !isInGameState || !fireBurstCanContinue || isChallengingStage || isWaveTransitioning) { return; } const bulletCount = Math.round(scaleValue(level, BASE_ENEMY_BULLET_BURST_COUNT, MAX_ENEMY_BULLET_BURST_COUNT)); for (let i = 0; i < bulletCount; i++) { const totalDelay = initialDelayMs + i * ENTRANCE_FIRE_BURST_DELAY_MS; const burstTimeoutId = setTimeout(() => { try { const fireTimeoutIdx = enemySpawnTimeouts.indexOf(burstTimeoutId); if (fireTimeoutIdx > -1) { enemySpawnTimeouts.splice(fireTimeoutIdx, 1); }
    let currentFireCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { currentFireCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); } else { currentFireCanContinue = playerLives > 0 && !isShipCaptured; }
    if (isPaused || !isInGameState || !currentFireCanContinue || isChallengingStage || isWaveTransitioning) { return; } const currentEnemy = enemies.find(e => e && e.id === enemyId); if (currentEnemy && currentEnemy.state === requiredState) { if (createBulletSimple(currentEnemy)) { if (i === 0) { playSound('enemyShootSound', false, 0.4); } currentEnemy.lastFiredTime = Date.now(); } } } catch (fireError) { console.error(`Error during enemy burst firing (bullet ${i + 1}/${bulletCount}) for ${enemyId}:`, fireError); } }, totalDelay); enemySpawnTimeouts.push(burstTimeoutId); } }

/**
 * Vuur een burst van een VAST aantal vijandelijke kogels af.
 */
function fireFixedEnemyBurst(enemyId, requiredState, initialDelayMs, fixedBulletCount) {
    let fireFixedCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { fireFixedCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); } else { fireFixedCanContinue = playerLives > 0 && !isShipCaptured; }
    if (!enemyId || isPaused || !isInGameState || !fireFixedCanContinue || isChallengingStage || isWaveTransitioning || fixedBulletCount <= 0) { return; } for (let i = 0; i < fixedBulletCount; i++) { const totalDelay = initialDelayMs + i * ENTRANCE_FIRE_BURST_DELAY_MS; const burstTimeoutId = setTimeout(() => { try { const fireTimeoutIdx = enemySpawnTimeouts.indexOf(burstTimeoutId); if (fireTimeoutIdx > -1) { enemySpawnTimeouts.splice(fireTimeoutIdx, 1); }
    let currentFixedFireCanContinue = false; if (isTwoPlayerMode && selectedGameMode === 'coop') { currentFixedFireCanContinue = (player1Lives > 0 && !isPlayer1ShipCaptured) || (player2Lives > 0 && !isPlayer2ShipCaptured); } else { currentFixedFireCanContinue = playerLives > 0 && !isShipCaptured; }
    if (isPaused || !isInGameState || !currentFixedFireCanContinue || isChallengingStage || isWaveTransitioning) { return; } const currentEnemy = enemies.find(e => e && e.id === enemyId); if (currentEnemy) { if (createBulletSimple(currentEnemy)) { if (i === 0) { playSound('enemyShootSound', false, 0.4); } currentEnemy.lastFiredTime = Date.now(); } } else { } } catch (fireError) { console.error(`Error during FIXED enemy burst firing (bullet ${i + 1}/${fixedBulletCount}) for ${enemyId}:`, fireError); } }, totalDelay); enemySpawnTimeouts.push(burstTimeoutId); } }


/**
 * Plaatst alle vijanden direct in de grid voor "Full Grid" waves.
 * <<< GEWIJZIGD: Aanroep van triggerImmediateCaptureDive verwijderd. >>>
 * <<< GEWIJZIGD: Log '[startFullGridWave] Placed ...' verwijderd. >>>
 */
function startFullGridWave() {
    if (!currentWaveDefinition || currentWaveDefinition.length === 0 || !isFullGridWave) {
        console.error("Attempted to start Full Grid wave without valid definition or when not in Full Grid mode.");
        isWaveTransitioning = true; readyForNextWaveReset = true;
        return;
    }
    playSound('entranceSound', false, 0.4);
    enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = [];
    totalEnemiesScheduledForWave = 0;
    enemiesSpawnedThisWave = 0;
    squadronCompletionStatus = {};
    squadronEntranceFiringStatus = {};
    let totalEnemiesPlaced = 0;
    currentWaveDefinition.forEach((squadronData, squadronIndex) => {
        let enemiesInSquadron = 0;
        if (squadronData && squadronData.enemies && Array.isArray(squadronData.enemies)) {
            enemiesInSquadron = squadronData.enemies.length;
            squadronData.enemies.forEach((enemyDef, enemyIndex) => {
                try {
                    if (!enemyDef || !enemyDef.type || typeof enemyDef.gridRow === 'undefined' || typeof enemyDef.gridCol === 'undefined') {
                        console.error(`Full Grid: Invalid enemy def in squadron ${squadronIndex}, index ${enemyIndex}. Skipping.`);
                        return;
                    }
                    let enemyType = enemyDef.type;
                    let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1;
                    let enemyWidth, enemyHeight;
                    if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; }
                    else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; }
                    else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; }
                    let targetGridX, targetGridY;
                    try {
                        const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemyDef.gridRow, enemyDef.gridCol, enemyWidth);
                        targetGridX = finalTargetX;
                        targetGridY = finalTargetY;
                    } catch(e) {
                        console.error(`Full Grid: Error getting target grid pos for enemy ${enemyDef.type} at [${enemyDef.gridRow},${enemyDef.gridCol}]`, e);
                        targetGridX = gameCanvas?.width / 2 || 200;
                        targetGridY = ENEMY_TOP_MARGIN + enemyDef.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING);
                    }
                    const newEnemy = {
                        x: targetGridX, y: targetGridY, width: enemyWidth, height: enemyHeight,
                        targetGridX: targetGridX, targetGridY: targetGridY,
                        speed: 0, state: 'in_grid', gridRow: enemyDef.gridRow, gridCol: enemyDef.gridCol,
                        type: enemyType, health: enemyHealth, isDamaged: false,
                        velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0,
                        targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0,
                        attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null,
                        entrancePathId: null, pathSegmentIndex: 0, pathT: 0, squadronId: squadronIndex, squadronEnemyIndex: enemyIndex,
                        id: `enemy-grid-${squadronIndex}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                        justReturned: false, canFireThisDive: false, attackType: 'normal',
                        hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined,
                        capturedShipX: undefined, capturedShipY: undefined,
                        capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined,
                        captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: 1.0
                    };
                    enemies.push(newEnemy);
                    totalEnemiesPlaced++;
                } catch (placementError) { console.error(`Full Grid: Error placing enemy (Sq ${squadronIndex}, Idx ${enemyIndex}):`, placementError); }
            });
        } else { console.warn(`Full Grid: Squadron ${squadronIndex} has invalid enemy data.`); }
        squadronCompletionStatus[squadronIndex] = { completed: enemiesInSquadron, total: enemiesInSquadron };
    });
    totalEnemiesScheduledForWave = totalEnemiesPlaced;
    enemiesSpawnedThisWave = totalEnemiesPlaced;
    isEntrancePhaseActive = false;
    gridJustCompleted = true;
    if (!isGridSoundPlaying) {
        isGridSoundPlaying = true;
        playSound('gridBackgroundSound', true, 0.1);
    }
    if (GRID_BREATH_ENABLED && !isGridBreathingActive) {
        isGridBreathingActive = true;
        gridBreathStartTime = Date.now();
        currentGridBreathFactor = 0;
    }

    lastGridFireCheckTime = Date.now();
    firstEnemyLanded = true;
    // Geen triggerImmediateCaptureDive hier; dat gebeurt na de introductie messages, indien van toepassing.
}

// --- EINDE deel 2      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









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
                    let shouldCenterSingleShip = (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0 || !isInGameState || isShowingScoreScreen || (isInGameState && isShowingIntro && !isManualControl && (introStep === 1 || introStep === 2 || introStep === 3))) && !isDualShipActive;
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
                else if (isPlayerSelectMode) { drawCanvasButton("1 PLAYER", 0, selectedButtonIndex === 0); drawCanvasButton("2 PLAYER", 1, selectedButtonIndex === 1); }
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









// --- START OF FILE game_logic.js ---
// --- DEEL 4      van 8 dit code blok    ---

function handleEnemyHit(enemy, shootingPlayerId = null) {
    if (!enemy) return { destroyed: false, pointsAwarded: 0 };
    const now = Date.now();
    let points = 0; let destroyed = false; let wasBossDamagedBeforeHit = enemy.isDamaged; let playHitSoundId = null; let playHitSoundVolume = 1.0;
    const enemyWidthForCalc = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
    const enemyHeightForCalc = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);
    const bossHadCapturedShipInitially = enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip;
    const bossHadDimensionsInitially = enemy.type === ENEMY3_TYPE && enemy.capturedShipDimensions;

    let wasPartnershipCapturedByThisBoss = false;
    let partnerWhoWasCapturedId = null; // Houd bij WIE gevangen was door DEZE boss

    if (bossHadCapturedShipInitially) {
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            if (isPlayer1ShipCaptured && capturedBossIdWithMessage === enemy.id) {
                wasPartnershipCapturedByThisBoss = true;
                partnerWhoWasCapturedId = 'player1';
            } else if (isPlayer2ShipCaptured && capturedBossIdWithMessage === enemy.id) {
                wasPartnershipCapturedByThisBoss = true;
                partnerWhoWasCapturedId = 'player2';
            }
        } else if (!isTwoPlayerMode && isShipCaptured && capturedBossIdWithMessage === enemy.id) {
            wasPartnershipCapturedByThisBoss = true;
            // In 1P, de "partner" is de speler zelf. shootingPlayerId is relevant.
        }
    }


    const sparkX = enemy.x + enemyWidthForCalc / 2; const sparkY = enemy.y + enemyHeightForCalc * 0.2;
    createHitSparks(sparkX, sparkY);
    enemy.health--;
    if (enemy.type === ENEMY3_TYPE) { enemy.isDamaged = (enemy.health < ENEMY3_MAX_HITS); }

    if (enemy.health <= 0) {
        destroyed = true;
        if (isChallengingStage) {
            challengingStageEnemiesHit++;
        }

        if (bossHadCapturedShipInitially && bossHadDimensionsInitially) {
            let fallingShipTargetPlayerId = null;

            // Priority 1: Return ship to its original owner if a specific partnership was involved
            if (wasPartnershipCapturedByThisBoss && partnerWhoWasCapturedId) {
                fallingShipTargetPlayerId = partnerWhoWasCapturedId;
            } else {
                // Priority 2: AI Dual ship gives neutral/other's ship to its partner
                let assignedByAIDualRule = false;
                if (isCoopAIDemoActive) {
                    if (shootingPlayerId === 'player1' && player1IsDualShipActive) {
                        fallingShipTargetPlayerId = 'player2'; // AI P1 dual shot, ship goes to AI P2
                        assignedByAIDualRule = true;
                    } else if (shootingPlayerId === 'player2' && player2IsDualShipActive) {
                        fallingShipTargetPlayerId = 'player1'; // AI P2 dual shot, ship goes to AI P1
                        assignedByAIDualRule = true;
                    }
                } else if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                    if (shootingPlayerId === 'ai_p2' && player2IsDualShipActive) {
                        fallingShipTargetPlayerId = 'player1'; // AI P2 dual shot, ship goes to Human P1
                        assignedByAIDualRule = true;
                    } else if (shootingPlayerId === 'player1' && player1IsDualShipActive) { // Human P1 is dual
                        fallingShipTargetPlayerId = 'ai_p2'; // Human P1 dual shot, ship goes to AI P2
                        assignedByAIDualRule = true;
                    }
                }

                if (!assignedByAIDualRule) {
                    // Priority 3: Default to the shooter if no other rules applied for neutral ship
                    fallingShipTargetPlayerId = shootingPlayerId;
                }
            }
            // Fallback if no target was assigned (should ideally not happen if shootingPlayerId is valid)
            if (fallingShipTargetPlayerId === null && shootingPlayerId) {
                fallingShipTargetPlayerId = shootingPlayerId;
            }


            if (enemy.capturedShipDimensions) {
                const capturedW = enemy.capturedShipDimensions.width;
                const capturedH = enemy.capturedShipDimensions.height;
                const fallingShipX = enemy.x + (enemyWidthForCalc - capturedW) / 2 + CAPTURED_SHIP_OFFSET_X;
                const fallingShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y;
                const alreadyFalling = fallingShips.some(fs => Math.abs(fs.x - fallingShipX) < 1 && Math.abs(fs.y - fallingShipY) < 1);
                if (!alreadyFalling) {
                    fallingShips.push({
                        x: fallingShipX,
                        y: fallingShipY,
                        width: capturedW,
                        height: capturedH,
                        creationTime: now,
                        tintProgress: 1.0,
                        rotation: 0,
                        rotationDirection: (Math.random() < 0.5 ? -1 : 1),
                        totalRotation: 0,
                        rotationCompleted: false,
                        targetPlayerId: fallingShipTargetPlayerId
                    });
                }
            } else { console.error("[handleEnemyHit] CRITICAL: Boss destroyed, had ship initially but dimensions missing!"); }
            enemy.hasCapturedShip = false; enemy.capturedShipDimensions = null;
        } else if (bossHadCapturedShipInitially && !bossHadDimensionsInitially) {
            console.error(`[handleEnemyHit] CRITICAL: Boss ${enemy.id} destroyed, had ship initially but dimensions missing! Resetting state anyway.`);
            enemy.hasCapturedShip = false; enemy.capturedShipDimensions = null;
        }

        if (isChallengingStage) {
            let baseScore = 100;
            const previousLastHitTime = csLastHitTime;
            csLastHitTime = now;
            csLastChainHitPosition = { x: enemy.x, y: enemy.y };
            if (csCurrentChainHits > 0 && (now - previousLastHitTime < CS_CHAIN_BREAK_TIME_MS)) {
                csCurrentChainHits++;
            } else {
                csCurrentChainHits = 1;
                csCurrentChainScore = 0;
            }
            if (csCurrentChainHits >= CS_CHAIN_SCORE_THRESHOLD) {
                baseScore *= 2;
            }
            points = baseScore;
            csCurrentChainScore += points;
            scoreEarnedThisCS += points;
            playHitSoundId = 'explosionSound'; playHitSoundVolume = 0.4;
        }
        else {
            if (enemy.state === 'in_grid') {
                points = (enemy.type === ENEMY1_TYPE) ? 50 : (enemy.type === ENEMY2_TYPE ? 80 : 0);
                if (enemy.type === ENEMY3_TYPE) { points = 150; }
                playHitSoundId = 'explosionSound'; playHitSoundVolume = 0.4;
            }
            else { // Enemy is attacking or in entrance path
                points = (enemy.type === ENEMY1_TYPE) ? 100 : (enemy.type === ENEMY2_TYPE ? 160 : 0);
                if (enemy.type === ENEMY3_TYPE) {
                    if (bossHadCapturedShipInitially) {
                        const rescueBonusOptions = [1000, 1500, 2000, 3000];
                        points = rescueBonusOptions[Math.floor(Math.random() * rescueBonusOptions.length)];
                        playHitSoundId = 'bossHit2Sound'; playHitSoundVolume = 0.4;
                    } else if (wasBossDamagedBeforeHit) {
                        points = 400;
                        playHitSoundId = 'bossHit2Sound'; playHitSoundVolume = 0.4;
                    } else {
                        points = 0; // Boss destroyed on first hit while attacking (shouldn't happen with 2 HP)
                        console.warn(`[Destroyed Boss Score - Attack] Boss destroyed on first hit? Awarding ${points} points. Health was: ${enemy.health + 1}`);
                        playHitSoundId = 'explosionSound'; playHitSoundVolume = 0.4;
                    }
                } else { // Bee or Butterfly destroyed while attacking
                    playHitSoundId = 'explosionSound'; playHitSoundVolume = 0.4;
                }
                if (destroyed && points > 0) {
                    const previousNormalLastHitTime = normalWaveLastHitTime;
                    normalWaveLastHitTime = now;
                    normalWaveLastChainHitPosition = { x: enemy.x, y: enemy.y };
                    if (normalWaveLastChainHitPosition && (now - previousNormalLastHitTime < NORMAL_WAVE_CHAIN_BREAK_TIME_MS)) {
                        normalWaveCurrentChainHits++;
                    } else {
                        normalWaveCurrentChainHits = 1;
                        normalWaveCurrentChainScore = 0;
                    }
                    if (NORMAL_WAVE_CHAIN_BONUS_ENABLED && normalWaveCurrentChainHits >= NORMAL_WAVE_CHAIN_SCORE_THRESHOLD) {
                        const chainBonusOptions = [300, 600, 1000, 1500, 2000, 3000];
                        const bonusIndex = Math.min(chainBonusOptions.length - 1, normalWaveCurrentChainHits - NORMAL_WAVE_CHAIN_SCORE_THRESHOLD);
                        const chainBonus = chainBonusOptions[bonusIndex];
                        points += chainBonus;
                        normalWaveCurrentChainScore += chainBonus;
                    }
                }
            }
        }

        if (points > 0) {
            let playerSpecificEnemiesHitIncrementer = null;

            if (isCoopAIDemoActive) { // COOP AI DEMO
                if (shootingPlayerId === 'player1') {
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) { highScore = player1Score; if (!player1TriggeredHighScoreSound) { player1TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); } }
                    checkAndAwardExtraLife(1);
                } else if (shootingPlayerId === 'player2') {
                    player2Score += points; playerSpecificEnemiesHitIncrementer = () => player2EnemiesHit++;
                    if (player2Score > highScore) { highScore = player2Score; if (!player2TriggeredHighScoreSound) { player2TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); } }
                    checkAndAwardExtraLife(2);
                } else { // Fallback for CO-OP AI demo if shooterId is somehow null
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) highScore = player1Score;
                    checkAndAwardExtraLife(1);
                }
            } else if (!isManualControl) { // Standaard 1P AI Demo (niet COOP AI Demo)
                score += points;
                player1Score = score;
                playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                if (score > highScore) {
                    highScore = score;
                    if (!player1TriggeredHighScoreSound) { player1TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }
                }
                checkAndAwardExtraLife(1);
            } else if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { // 1P vs AI COOP
                if (shootingPlayerId === 'player1') { // P1 (mens) schoot
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) { highScore = player1Score; if (!player1TriggeredHighScoreSound) { player1TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }}
                    checkAndAwardExtraLife(1);
                } else if (shootingPlayerId === 'ai_p2') { // AI P2 schoot
                    player2Score += points; playerSpecificEnemiesHitIncrementer = () => player2EnemiesHit++;
                    if (player2Score > highScore) { highScore = player2Score; if (!player2TriggeredHighScoreSound) { player2TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }}
                    checkAndAwardExtraLife(2);
                } else { // Fallback als shooterId onbekend is in 1P vs AI COOP
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) highScore = player1Score;
                    checkAndAwardExtraLife(1);
                }
            } else if (isTwoPlayerMode && selectedGameMode === 'coop') { // Manual CO-OP (Human P1 & Human P2)
                if (shootingPlayerId === 'player1') {
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) { highScore = player1Score; if (!player1TriggeredHighScoreSound) { player1TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }}
                    checkAndAwardExtraLife(1);
                } else if (shootingPlayerId === 'player2') {
                    player2Score += points; playerSpecificEnemiesHitIncrementer = () => player2EnemiesHit++;
                    if (player2Score > highScore) { highScore = player2Score; if (!player2TriggeredHighScoreSound) { player2TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }}
                    checkAndAwardExtraLife(2);
                } else { // Fallback voor manual CO-OP als shooterId null is
                    player1Score += points; playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    if (player1Score > highScore) { highScore = player1Score; if (!player1TriggeredHighScoreSound) { player1TriggeredHighScoreSound = true; playSound('hiScoreSound', false, 0.2); }}
                    checkAndAwardExtraLife(1);
                }
            } else { // 1P Classic, 1P_VS_AI_NORMAL (Alternating), 2P_NORMAL (Alternating)
                score += points;
                let playerSpecificScore = score;
                let setPlayerSpecificHSTriggerFlag = null;
                let playerNumForLifeCheck = currentPlayer;

                if (currentPlayer === 1 || !isTwoPlayerMode) {
                    player1Score = score;
                    playerSpecificEnemiesHitIncrementer = () => player1EnemiesHit++;
                    setPlayerSpecificHSTriggerFlag = () => { player1TriggeredHighScoreSound = true; };
                } else { // currentPlayer === 2
                    player2Score = score;
                    playerSpecificEnemiesHitIncrementer = () => player2EnemiesHit++;
                    setPlayerSpecificHSTriggerFlag = () => { player2TriggeredHighScoreSound = true; };
                }

                if (playerSpecificScore > highScore) {
                    highScore = playerSpecificScore;
                    const currentHSTriggerFlag = (currentPlayer === 1 || !isTwoPlayerMode) ? player1TriggeredHighScoreSound : player2TriggeredHighScoreSound;
                    if (!currentHSTriggerFlag && setPlayerSpecificHSTriggerFlag) {
                        setPlayerSpecificHSTriggerFlag();
                        playSound('hiScoreSound', false, 0.2);
                    }
                }
                checkAndAwardExtraLife(playerNumForLifeCheck);
            }


            if (playerSpecificEnemiesHitIncrementer && !isChallengingStage) {
                 playerSpecificEnemiesHitIncrementer();
            }

            const scoreColor = (enemy.state === 'in_grid' || isChallengingStage) ? FLOATING_SCORE_COLOR_GRID : FLOATING_SCORE_COLOR_ACTIVE;
            floatingScores.push({ text: points.toString(), x: enemy.x + enemyWidthForCalc / 2, y: enemy.y, color: scoreColor, creationTime: now, displayStartTime: now + FLOATING_SCORE_APPEAR_DELAY });
        }

        createExplosion(enemy.x + enemyWidthForCalc / 2, enemy.y + enemyHeightForCalc / 2);
        if (enemy.id === capturingBossId) { stopSound('captureSound'); }
        if (enemy.state === 'attacking' || enemy.state === 'following_entrance_path' || enemy.state === 'diving_to_capture_position' || enemy.state === 'following_bezier_path' || enemy.state === 'returning' || enemy.state === 'showing_capture_message') {
            if (enemy.type === ENEMY3_TYPE) stopSound('bossGalagaDiveSound');
            else stopSound('butterflyDiveSound');
        }

    } else { // Enemy not destroyed, only damaged (Boss)
        destroyed = false;
        if (enemy.type === ENEMY3_TYPE) {
            playHitSoundId = 'bossHit1Sound'; playHitSoundVolume = 0.6;
            points = 0;
        }
        else { // Bee or Butterfly hit but not destroyed (should not happen with 1 HP)
            points = 0;
             // For bees/butterflies, if they are somehow hit but not destroyed, play their specific hit sound
            if (enemy.type === ENEMY1_TYPE) { playHitSoundId = 'beeHitSound'; playHitSoundVolume = 0.3; }
            else if (enemy.type === ENEMY2_TYPE) { playHitSoundId = 'butterflyHitSound'; playHitSoundVolume = 0.3; }
        }
    }

    if (playHitSoundId) {
        playSound(playHitSoundId, false, playHitSoundVolume);
    }
    return { destroyed: destroyed, pointsAwarded: points };
}


/** Helper functie om hit spark particles te genereren */
function createHitSparks(x, y) { if (!gameCtx) return; const now = Date.now(); for (let i = 0; i < HIT_SPARK_COUNT; i++) { const angle = Math.random() * Math.PI * 2; const speed = HIT_SPARK_SPEED * (0.7 + Math.random() * 0.6); const lifetime = HIT_SPARK_LIFETIME * (0.8 + Math.random() * 0.4); hitSparks.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, creationTime: now, lifetime: lifetime, size: HIT_SPARK_SIZE, color: HIT_SPARK_COLOR }); } }


/** Update functie voor hit spark particles */
function updateHitSparks() { const now = Date.now(); for (let i = hitSparks.length - 1; i >= 0; i--) { const s = hitSparks[i]; const elapsedTime = now - s.creationTime; if (elapsedTime >= s.lifetime) { hitSparks.splice(i, 1); } else { s.vy += HIT_SPARK_GRAVITY; s.x += s.vx; s.y += s.vy; s.alpha = Math.max(0, 1.0 - elapsedTime * HIT_SPARK_FADE_SPEED); } } }


function moveEntities() {
    try {
        if (isPaused) {
             return;
        }
        const now = Date.now();

        // --- Ship Movement ---
        // Deze logica is verplaatst naar DEEL 7 en gebruikt nu globale vlaggen.

        // --- Player Bullet Movement & Collision ---
        // Deze logica is verplaatst naar DEEL 7.

        // --- Enemy Bullet Movement ---
        // Deze logica is verplaatst naar DEEL 7.

        // --- Falling Ship Movement & Collision ---
        // Deze logica is verplaatst naar DEEL 7.

    } catch (e) {
        console.error("FATAL Error in moveEntities (Restored Conditions):", e, e.stack);
        isGridSoundPlaying = false; stopSound('gridBackgroundSound'); isEntrancePhaseActive = false; stopSound('entranceSound'); isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; stopSound('captureSound'); stopSound('shipCapturedSound'); isWaitingForRespawn = false; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isInvincible = false; invincibilityEndTime = 0; hitSparks = []; if(typeof showMenuState === 'function') showMenuState(); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; alert("Critical error during entity movement/collision. Returning to menu.");
    }
}


/**
 * Switches the current player in a 2-player game. (Vooral voor 'alternating' mode)
 * <<< GEWIJZIGD: Zorgt ervoor dat playerXMaxLevelReached correct wordt geüpdatet
 *     met het level waarop de speler zijn/haar beurt beëindigde. >>>
 */
function switchPlayerTurn() {
    if (!isTwoPlayerMode || selectedGameMode === 'coop') return false; // Niet voor CO-OP
    stopSound('hiScoreSound');

    // Sla de staat van de Zojuist Geëindigde Speler op.
    // 'level' is hier het level waarop de vorige speler zijn beurt eindigde.
    // Belangrijk: playerXMaxLevelReached wordt hier bijgewerkt VOORDAT 'level' mogelijk verandert
    // door de logica in runSingleGameUpdate (als beide spelers het level hebben voltooid).
    if (currentPlayer === 1) {
        player1Score = score;
        player1IsDualShipActive = isDualShipActive;
        player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
        if (player1Score > highScore) highScore = player1Score;
    } else { // currentPlayer === 2
        player2Score = score;
        player2IsDualShipActive = isDualShipActive;
        player2MaxLevelReached = Math.max(player2MaxLevelReached, level);
        if (player2Score > highScore) highScore = player2Score;
    }

    const nextPlayer = (currentPlayer === 1) ? 2 : 1;
    const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives;

    if (nextPlayerLives <= 0) {
        const livesOfCurrentPlayerEndingTurn = (currentPlayer === 1) ? player1Lives : player2Lives;
        if (livesOfCurrentPlayerEndingTurn <= 0) {
            triggerFinalGameOverSequence();
            return false;
        } else {
            forceCenterShipNextReset = false;
            return false; // Geen succesvolle wissel, huidige speler gaat door (indien nog levens)
        }
    }

    // Wissel naar de volgende speler
    currentPlayer = nextPlayer;
    score = (currentPlayer === 1) ? player1Score : player2Score;
    playerLives = (currentPlayer === 1) ? player1Lives : player2Lives;
    isDualShipActive = (currentPlayer === 1) ? player1IsDualShipActive : player2IsDualShipActive;

    // Het 'level' (de globale variabele) blijft ongewijzigd hier.
    // resetWaveInternal zal het correcte intro tonen voor het huidige `level`.
    // De logica in runSingleGameUpdate (na een succesvolle wave) bepaalt of `level` omhoog gaat.

    forceCenterShipNextReset = true;
    scoreEarnedThisCS = 0;
    csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
    normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null;
    leftPressed = false; rightPressed = false; shootPressed = false;
    p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
    keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
    keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
    p1JustFiredSingle = false; p2JustFiredSingle = false;
    p1FireInputWasDown = false; p2FireInputWasDown = false;
    isShipCaptured = false;
    isWaitingForRespawn = false; respawnTime = 0;
    isInvincible = false; invincibilityEndTime = 0;
    fallingShips = []; hitSparks = [];
    showExtraLifeMessage = false; extraLifeMessageStartTime = 0;
    return true;
}


// --- EINDE deel 4      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 5      van 8 dit code blok    --- (Focus: Ship Control - Player & AI)

function firePlayerBullet(shooterId = null, isTapEvent = false) {
    const now = Date.now();

    const inCoopLevel1IntroStrict = isTwoPlayerMode && selectedGameMode === 'coop' && level === 1 &&
                                   coopPlayersReadyStartTime > 0 && now < coopPlayersReadyStartTime + 8000;
    if (inCoopLevel1IntroStrict) {
        return false;
    }

    let canShootLogic = false;
    let shootingShipObject = null;
    let isDual = false;
    let playerSpecificLastShotTime = 0;
    let setPlayerSpecificLastShotTime = (time) => {};
    let incrementPlayerShotsFired = (count) => {};
    let useSingleShotFlag = false;
    let getSingleShotFlag = () => false;
    let setSingleShotFlag = (val) => {};
    let currentShooterPlayerId = shooterId;

    const baseChecks = !isPaused && isInGameState &&
                       gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage &&
                       !isShowingIntro && !showReadyMessage && !isCsCompletionDelayActive &&
                       !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage &&
                       !(isTwoPlayerMode && selectedGameMode === 'coop' &&
                         ((shooterId === 'player1' && isPlayer1ShowingGameOverMessage) ||
                          (shooterId === 'player2' && isPlayer2ShowingGameOverMessage)));

    if (!baseChecks) return false;

    if (isTwoPlayerMode && selectedGameMode === 'coop') {
        if (shooterId === 'player1' && ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !player1NeedsRespawnAfterCapture) {
            if (!isShowingCaptureMessage || (isShowingCaptureMessage && !isPlayer1ShipCaptured)) {
                shootingShipObject = ship1; isDual = player1IsDualShipActive; playerSpecificLastShotTime = player1LastShotTime;
                setPlayerSpecificLastShotTime = (time) => { player1LastShotTime = time; }; incrementPlayerShotsFired = (count) => { player1ShotsFired += count; };
                useSingleShotFlag = selectedFiringMode === 'single'; getSingleShotFlag = () => p1JustFiredSingle; setSingleShotFlag = (val) => { p1JustFiredSingle = val; };
                canShootLogic = true;
            }
        } else if (shooterId === 'player2' && ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !player2NeedsRespawnAfterCapture) {
             if (!isShowingCaptureMessage || (isShowingCaptureMessage && !isPlayer2ShipCaptured)) {
                shootingShipObject = ship2; isDual = player2IsDualShipActive; playerSpecificLastShotTime = player2LastShotTime;
                setPlayerSpecificLastShotTime = (time) => { player2LastShotTime = time; }; incrementPlayerShotsFired = (count) => { player2ShotsFired += count; };
                if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') {
                    useSingleShotFlag = false;
                } else {
                    useSingleShotFlag = selectedFiringMode === 'single'; getSingleShotFlag = () => p2JustFiredSingle; setSingleShotFlag = (val) => { p2JustFiredSingle = val; };
                }
                canShootLogic = true;
            }
        }
    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL (Alternating)
        if (ship && playerLives > 0 && !isShipCaptured) {
            shootingShipObject = ship; isDual = isDualShipActive;
            if (isTwoPlayerMode && selectedGameMode === 'normal') {
                if (currentPlayer === 1) {
                    playerSpecificLastShotTime = player1LastShotTime; setPlayerSpecificLastShotTime = (time) => { player1LastShotTime = time; };
                    incrementPlayerShotsFired = (count) => { player1ShotsFired += count; }; useSingleShotFlag = selectedFiringMode === 'single';
                    getSingleShotFlag = () => p1JustFiredSingle; setSingleShotFlag = (val) => { p1JustFiredSingle = val; };
                    if (!currentShooterPlayerId) currentShooterPlayerId = 'player1';
                } else { // currentPlayer === 2
                    playerSpecificLastShotTime = player2LastShotTime; setPlayerSpecificLastShotTime = (time) => { player2LastShotTime = time; };
                    incrementPlayerShotsFired = (count) => { player2ShotsFired += count; };
                    if (isPlayerTwoAI) {
                        useSingleShotFlag = false;
                        if (!currentShooterPlayerId) currentShooterPlayerId = 'ai_p2';
                    } else { // Human P2 in Normal mode
                        useSingleShotFlag = selectedFiringMode === 'single';
                        if (connectedGamepadIndexP2 === null && connectedGamepadIndex !== null) { 
                            getSingleShotFlag = () => p1JustFiredSingle;
                            setSingleShotFlag = (val) => { p1JustFiredSingle = val; };
                        } else { 
                            getSingleShotFlag = () => p2JustFiredSingle;
                            setSingleShotFlag = (val) => { p2JustFiredSingle = val; };
                        }
                        if (!currentShooterPlayerId) currentShooterPlayerId = 'player2';
                    }
                }
            } else { // 1P Classic
                playerSpecificLastShotTime = player1LastShotTime;
                setPlayerSpecificLastShotTime = (time) => { player1LastShotTime = time; };
                incrementPlayerShotsFired = (count) => { player1ShotsFired += count; }; useSingleShotFlag = selectedFiringMode === 'single';
                getSingleShotFlag = () => p1JustFiredSingle; setSingleShotFlag = (val) => { p1JustFiredSingle = val; };
                if (!currentShooterPlayerId) currentShooterPlayerId = 'player1';
            }
            canShootLogic = true;
        }
    }

    if (shooterId === null && !isManualControl && !isCoopAIDemoActive && ship && playerLives > 0 && !isShipCaptured && !isShowingCaptureMessage) {
        shootingShipObject = ship; isDual = isDualShipActive; playerSpecificLastShotTime = aiLastShotTime;
        setPlayerSpecificLastShotTime = (time) => { aiLastShotTime = time; }; incrementPlayerShotsFired = (count) => { player1ShotsFired += count; };
        useSingleShotFlag = false;
        canShootLogic = true; currentShooterPlayerId = 'ai';
    }


    if (!canShootLogic || !shootingShipObject) return false;

    const isPlayerControlledOrSpecificAI = isManualControl ||
                                        (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) ||
                                        (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP' && shooterId === 'player1');


    if (useSingleShotFlag) { 
        if (isTapEvent) { 
            if (now - playerSpecificLastShotTime < SHOOT_COOLDOWN) return false;
        } else { 
            let fireButtonIsCurrentlyPressed = false;
             if (currentShooterPlayerId === 'player1' || (!isTwoPlayerMode && currentShooterPlayerId === 'player1')) {
                fireButtonIsCurrentlyPressed = keyboardP1ShootDown || (connectedGamepadIndex !== null && navigator.getGamepads()?.[connectedGamepadIndex]?.buttons[PS5_BUTTON_CROSS]?.pressed);
            } else if (currentShooterPlayerId === 'player2' && !isPlayerTwoAI) {
                if (connectedGamepadIndexP2 !== null) { 
                    fireButtonIsCurrentlyPressed = keyboardP2ShootDown || (connectedGamepadIndexP2 !== null && navigator.getGamepads()?.[connectedGamepadIndexP2]?.buttons[PS5_BUTTON_CROSS]?.pressed);
                } else if (connectedGamepadIndex !== null) { 
                    fireButtonIsCurrentlyPressed = keyboardP2ShootDown || (connectedGamepadIndex !== null && navigator.getGamepads()?.[connectedGamepadIndex]?.buttons[PS5_BUTTON_CROSS]?.pressed);
                } else { 
                    fireButtonIsCurrentlyPressed = keyboardP2ShootDown;
                }
            }

            if (getSingleShotFlag()) { 
                if (fireButtonIsCurrentlyPressed) return false; 
                else setSingleShotFlag(false); 
            }
            if (now - playerSpecificLastShotTime < SHOOT_COOLDOWN) return false;
        }
    } else { 
        if (now - playerSpecificLastShotTime < SHOOT_COOLDOWN) return false;
    }


    try {
        const bulletY = shootingShipObject.y;
        let bulletsCreated = 0;
        if (isDual) {
            const ship1CenterX = shootingShipObject.x + shootingShipObject.width / 2;
            const ship2CenterX = shootingShipObject.x + DUAL_SHIP_OFFSET_X + shootingShipObject.width / 2;
            const bulletX1 = ship1CenterX - PLAYER_BULLET_WIDTH / 2;
            const bulletX2 = ship2CenterX - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX1, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: currentShooterPlayerId });
            bullets.push({ x: bulletX2, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: currentShooterPlayerId });
            bulletsCreated = 2;
        } else {
            const bulletX = shootingShipObject.x + shootingShipObject.width / 2 - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: currentShooterPlayerId });
            bulletsCreated = 1;
        }

        if (useSingleShotFlag && !isTapEvent) setSingleShotFlag(true); 

        playSound('playerShootSound', false, 0.4);
        incrementPlayerShotsFired(bulletsCreated);
        setPlayerSpecificLastShotTime(now);
        return true;
    } catch(e) {
        console.error("Error creating player bullet(s):", e);
        return false;
    }
}


/**
 * Handles player input (manual control), considering currentPlayer and input sources.
 */
function handlePlayerInput() {
     try {
         const now = Date.now();

         const inCoopLevel1IntroStrict = isTwoPlayerMode && selectedGameMode === 'coop' && level === 1 &&
                                       coopPlayersReadyStartTime > 0 && now < coopPlayersReadyStartTime + 8000;

         if (isCoopAIDemoActive || (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2 && !isManualControl) ) {
             if (isCoopAIDemoActive) {
                leftPressed = false; rightPressed = false; shootPressed = false;
                p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
             }
             return;
         }

         let blockAllGlobalInput = isPaused || !isManualControl || !gameCanvas || !isInGameState ||
                                   gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage ||
                                   (isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage));

         if (blockAllGlobalInput) {
             keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
             keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
             leftPressed = false; rightPressed = false; shootPressed = false;
             p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
             p1FireInputWasDown = false; p2FireInputWasDown = false;
             return;
         }

        let canvasTouchX = 0;
        if (isTouchActiveGame && gameCanvas && gameCanvas.width > 0) {
            const rect = gameCanvas.getBoundingClientRect();
            const scaleX = gameCanvas.width / rect.width;
            canvasTouchX = (touchCurrentX - rect.left) * scaleX;
        }


        let ctrlP1Left = false, ctrlP1Right = false, ctrlP1ShootIsRaw = false;
        let ctrlP2Left = false, ctrlP2Right = false, ctrlP2ShootIsRaw = false;

        if (connectedGamepadIndex !== null) {
            const gamepads = navigator.getGamepads();
            if (gamepads?.[connectedGamepadIndex]) {
                const gamepadP1Obj = gamepads[connectedGamepadIndex];
                const resultP1 = processSingleController(gamepadP1Obj, previousGameButtonStates);
                ctrlP1Left = resultP1.left; ctrlP1Right = resultP1.right; ctrlP1ShootIsRaw = resultP1.shoot;
                previousGameButtonStates = resultP1.newButtonStates.slice();
                if (resultP1.pause && !isShowingCaptureMessage) { togglePause(); return; }
                if (resultP1.back && !isShowingCaptureMessage) { stopGameAndShowMenu(); return; }
            } else { if (previousGameButtonStates.length > 0) previousGameButtonStates = []; }
        } else { if (previousGameButtonStates.length > 0) previousGameButtonStates = []; }

        if (!(isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
            if (isTwoPlayerMode && connectedGamepadIndexP2 !== null && connectedGamepadIndexP2 !== connectedGamepadIndex) {
                const gamepads = navigator.getGamepads();
                if (gamepads?.[connectedGamepadIndexP2]) {
                    const gamepadP2Obj = gamepads[connectedGamepadIndexP2];
                    const resultP2 = processSingleController(gamepadP2Obj, previousGameButtonStatesP2);
                    ctrlP2Left = resultP2.left; ctrlP2Right = resultP2.right; ctrlP2ShootIsRaw = resultP2.shoot;
                    previousGameButtonStatesP2 = resultP2.newButtonStates.slice();
                } else { if (previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; }
            } else { if (previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; }
        }

        const oldP1FireInputWasDown = p1FireInputWasDown;
        p1FireInputWasDown = keyboardP1ShootDown || ctrlP1ShootIsRaw;

        let oldP2FireInputWasDown = false;
        if (!(isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
            oldP2FireInputWasDown = p2FireInputWasDown;
            if (isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 2 && !isPlayerTwoAI) {
                 if (connectedGamepadIndexP2 !== null) { 
                     p2FireInputWasDown = keyboardP2ShootDown || ctrlP2ShootIsRaw;
                 } else if (connectedGamepadIndex !== null) { 
                     p2FireInputWasDown = keyboardP2ShootDown || ctrlP1ShootIsRaw; 
                 } else { 
                     p2FireInputWasDown = keyboardP2ShootDown; 
                 }
            } else { 
                p2FireInputWasDown = keyboardP2ShootDown || ctrlP2ShootIsRaw;
            }
        } else {
             p2FireInputWasDown = false;
        }

        if (selectedFiringMode === 'single') {
            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                if (!isTouchActiveGame) {
                    if (oldP1FireInputWasDown && !p1FireInputWasDown) p1JustFiredSingle = false;
                    if (!isPlayerTwoAI && oldP2FireInputWasDown && !p2FireInputWasDown) p2JustFiredSingle = false;
                }
            } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                 if (!isTouchActiveGame) {
                    if (currentPlayer === 1 && oldP1FireInputWasDown && !p1FireInputWasDown) p1JustFiredSingle = false;
                    else if (currentPlayer === 2 && !isPlayerTwoAI) {
                        let p2UsedP1GamepadLast = (connectedGamepadIndexP2 === null && connectedGamepadIndex !== null);
                        let p2UsingP1GamepadNow = (connectedGamepadIndexP2 === null && connectedGamepadIndex !== null);

                        if (p2UsedP1GamepadLast && p2UsingP1GamepadNow) { 
                            if (oldP1FireInputWasDown && !p1FireInputWasDown) {
                                p1JustFiredSingle = false; 
                            }
                        } else { 
                            if (oldP2FireInputWasDown && !p2FireInputWasDown) {
                                p2JustFiredSingle = false;
                            }
                        }
                    }
                }
            } else { // 1P Classic
                if (!isTouchActiveGame) {
                    if (oldP1FireInputWasDown && !p1FireInputWasDown) p1JustFiredSingle = false;
                }
            }
        }


        leftPressed = false; rightPressed = false; shootPressed = false;
        p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;

        let p1MovementFromTouch = false;

        if (isTouchActiveGame && gameCanvas) {
            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) {
                    const p1EffectiveWidth = ship1.width + (player1IsDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                    let targetShip1X = canvasTouchX - p1EffectiveWidth / 2;
                    targetShip1X = Math.max(0, Math.min(gameCanvas.width - p1EffectiveWidth, targetShip1X));
                    ship1.x = targetShip1X; ship1.targetX = targetShip1X;
                    p1MovementFromTouch = true;
                }
            } else {
                if (ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0 && (!isPlayerTwoAI || (isPlayerTwoAI && currentPlayer === 1))) {
                    const effectiveWidth = ship.width + (isDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                    let targetShipX = canvasTouchX - effectiveWidth / 2;
                    targetShipX = Math.max(0, Math.min(gameCanvas.width - effectiveWidth, targetShipX));
                    ship.x = targetShipX; ship.targetX = targetShipX;
                    p1MovementFromTouch = true;
                }
            }
        }


        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            if (!p1MovementFromTouch) {
                const p1CanControl = ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture;
                if (p1CanControl) {
                    leftPressed = keyboardP1LeftDown || ctrlP1Left;
                    rightPressed = keyboardP1RightDown || ctrlP1Right;
                }
            }
            if (!isPlayerTwoAI) {
                const p2CanControl = ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture;
                if (p2CanControl) {
                    p2LeftPressed = keyboardP2LeftDown || ctrlP2Left;
                    p2RightPressed = keyboardP2RightDown || ctrlP2Right;
                }
            }
        } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
            if (!p1MovementFromTouch) {
                const activePlayerCanControl = ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage;
                if (activePlayerCanControl) {
                    if (currentPlayer === 1 || !isTwoPlayerMode) { // P1's turn or 1P mode
                        leftPressed = (keyboardP1LeftDown || ctrlP1Left);
                        rightPressed = (keyboardP1RightDown || ctrlP1Right);
                    } else if (currentPlayer === 2 && !isPlayerTwoAI && selectedGameMode === 'normal') { // Human P2 in Normal mode
                        if (connectedGamepadIndexP2 !== null) { // P2 has their own controller
                            leftPressed = (keyboardP2LeftDown || ctrlP2Left);
                            rightPressed = (keyboardP2RightDown || ctrlP2Right);
                        } else if (connectedGamepadIndex !== null) { // P1's controller is active, P2's is not
                            leftPressed = (keyboardP2LeftDown || ctrlP1Left); 
                            rightPressed = (keyboardP2RightDown || ctrlP1Right); 
                        } else { // No gamepads connected
                            leftPressed = keyboardP2LeftDown; 
                            rightPressed = keyboardP2RightDown;
                        }
                    }
                }
            }
        }

        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            const p1CanShoot = ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture && !inCoopLevel1IntroStrict;
            if (p1CanShoot) {
                shootPressed = (isTouchActiveGame && selectedFiringMode === 'rapid' && (!isPlayerTwoAI || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP' && canvasTouchX <= gameCanvas.width / 2) ) ) || p1FireInputWasDown;
                if (isShowingCaptureMessage && isPlayer1ShipCaptured) shootPressed = false;
            }

            if (!isPlayerTwoAI) { // Human P2
                const p2CanShoot = ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture && !inCoopLevel1IntroStrict;
                if (p2CanShoot) {
                    p2ShootPressed = (isTouchActiveGame && selectedFiringMode === 'rapid' && canvasTouchX > gameCanvas.width / 2) || p2FireInputWasDown;
                    if (isShowingCaptureMessage && isPlayer2ShipCaptured) p2ShootPressed = false;
                }
            }
        } else { // 1P Classic, 1P vs AI Normal, 2P Normal
            const activePlayerCanShoot = ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && !isShowingIntro && !inCoopLevel1IntroStrict;
            if (activePlayerCanShoot) {
                let currentFireInputWasDown = false;
                if (currentPlayer === 1 || !isTwoPlayerMode) { // P1's turn or 1P mode
                    currentFireInputWasDown = p1FireInputWasDown;
                } else if (currentPlayer === 2 && !isPlayerTwoAI && selectedGameMode === 'normal') { // Human P2 in Normal mode
                    currentFireInputWasDown = p2FireInputWasDown; 
                }
                shootPressed = (isTouchActiveGame && selectedFiringMode === 'rapid') || currentFireInputWasDown;
                if (isShowingCaptureMessage && isShipCaptured) shootPressed = false;
            }
        }


        if (isManualControl) {
            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                if (shootPressed) {
                    firePlayerBullet('player1', false);
                }
                if (!isPlayerTwoAI && p2ShootPressed) {
                    firePlayerBullet('player2', false);
                }
            } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                if (shootPressed) {
                    if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                        // AI P2 schiet via aiControl, niet hier
                    } else {
                        firePlayerBullet(currentPlayer === 1 || !isTwoPlayerMode ? 'player1' : 'player2', false);
                    }
                }
            }
        }

     } catch (e) {
         console.error("Error handling player input:", e);
         leftPressed = false; rightPressed = false; shootPressed = false;
         p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
         p1FireInputWasDown = false; p2FireInputWasDown = false;
         p1JustFiredSingle = false; p2JustFiredSingle = false;
     }
}


// --- AI control functies (aiControl, aiControlCoop, fireCoopAIBullet, calculateAIDesiredState) ---

 function aiControl() {
    try {
        if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') ) return;

        let activeShipForAI = null;
        let currentSmoothedShipXForAI = null;
        let isDualActiveForAI = false;
        let isShipCapturedForAI = false;
        let isInvincibleForAI = false;
        let aiLivesForAI = 0;
        let aiIdentifierForAI = 'ai';
        let isAIPlayer2NormalMode = false;
        let aiCanBeCaptured = false; 

        if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
            if (!ship || playerLives <= 0 || isShipCaptured || isShowingPlayerGameOverMessage) {
                if(ship) ship.targetX = ship.x;
                aiNeedsStabilization = true;
                smoothedShipX = ship ? ship.x : (gameCanvas ? gameCanvas.width / 2 : 0);
                return;
            }
            activeShipForAI = ship;
            currentSmoothedShipXForAI = smoothedShipX;
            isDualActiveForAI = isDualShipActive;
            isShipCapturedForAI = isShipCaptured;
            isInvincibleForAI = isInvincible;
            aiLivesForAI = playerLives;
            aiIdentifierForAI = 'ai_p2';
            isAIPlayer2NormalMode = true;
            aiCanBeCaptured = playerLives > 1 && !isDualShipActive; 
        } else if (!isManualControl && !isPlayerTwoAI) { // 1P AI Demo
            if (playerLives <= 0 || !ship || !gameCanvas || !isInGameState || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isShipCaptured || isShowingCaptureMessage) {
                if (ship) ship.targetX = ship.x;
                aiNeedsStabilization = true;
                smoothedShipX = ship ? ship.x : (gameCanvas ? gameCanvas.width / 2 : 0);
                return;
            }
            activeShipForAI = ship;
            currentSmoothedShipXForAI = smoothedShipX;
            isDualActiveForAI = isDualShipActive;
            isShipCapturedForAI = isShipCaptured;
            isInvincibleForAI = isInvincible;
            aiLivesForAI = playerLives;
            aiCanBeCaptured = playerLives > 1 && !isDualShipActive; 
        } else {
            return;
        }

        if (currentSmoothedShipXForAI === undefined && activeShipForAI) {
            currentSmoothedShipXForAI = activeShipForAI.x;
            if (isAIPlayer2NormalMode || (!isManualControl && !isPlayerTwoAI)) {
                 smoothedShipX = currentSmoothedShipXForAI;
            }
        } else if (currentSmoothedShipXForAI === undefined && !activeShipForAI) {
            currentSmoothedShipXForAI = gameCanvas ? gameCanvas.width / 2 : 0;
            if (isAIPlayer2NormalMode || (!isManualControl && !isPlayerTwoAI)) {
                smoothedShipX = currentSmoothedShipXForAI;
            }
            return;
        }


        const now = Date.now();
        const canvasWidth = gameCanvas.width;
        const canvasHeight = gameCanvas.height;
        let effectiveShipWidth = activeShipForAI.width;
        if (isDualActiveForAI) {
            effectiveShipWidth = DUAL_SHIP_OFFSET_X + activeShipForAI.width;
        }
        const shipCenterX = activeShipForAI.x + effectiveShipWidth / 2;
        const shipTopY = activeShipForAI.y;
        const AI_CENTER_TARGET_X_VISUAL = canvasWidth / 2;
        const targetCenterShipX = AI_CENTER_TARGET_X_VISUAL - (effectiveShipWidth / 2);
        const isShowingBlockingMessage = showReadyMessage || showCSClearMessage || showCsHitsMessage || showPerfectMessage || showCsBonusScoreMessage || showExtraLifeMessage || isCsCompletionDelayActive || isShowingCaptureMessage || isShowingIntro;

        let desiredTargetX = currentSmoothedShipXForAI;
        let shouldTryShoot = false;
        let isDodgingThreat = false;
        let dodgeTargetX = currentSmoothedShipXForAI;
        let targetEnemyForAI = null;
        let isMovingToCapture = false;

        const ignoreCaptureMode = isDualActiveForAI;


        if (aiNeedsStabilization && !isShowingBlockingMessage) {
            aiStabilizationEndTime = now + AI_STABILIZATION_DURATION;
            aiNeedsStabilization = false;
            currentSmoothedShipXForAI = activeShipForAI.x;
            if (isAIPlayer2NormalMode || (!isManualControl && !isPlayerTwoAI)) {
                smoothedShipX = currentSmoothedShipXForAI;
            }
        }

        if (now < aiStabilizationEndTime && !isShowingBlockingMessage) {
            desiredTargetX = targetCenterShipX;
        } else if (!isShowingBlockingMessage) {
            isDodgingThreat = false;
            dodgeTargetX = currentSmoothedShipXForAI;

            if (!isInvincibleForAI) {
                let threateningBullets = [];
                const bulletLookahead = isChallengingStage ? FINAL_DODGE_LOOKAHEAD * 0.9 : (isEntrancePhaseActive ? ENTRANCE_BULLET_DODGE_LOOKAHEAD * 1.1 : FINAL_DODGE_LOOKAHEAD * 1.2);
                const bulletBuffer = isChallengingStage ? FINAL_DODGE_BUFFER_BASE * 0.9 : (isEntrancePhaseActive ? ENTRANCE_BULLET_DODGE_BUFFER * 1.1 : FINAL_DODGE_BUFFER_BASE * 1.2);
                const dangerZoneForBullets = { x: activeShipForAI.x - bulletBuffer, y: activeShipForAI.y - bulletLookahead, width: effectiveShipWidth + bulletBuffer * 2, height: bulletLookahead + activeShipForAI.height };

                for (const bullet of enemyBullets) {
                    if (bullet && bullet.y + bullet.height > activeShipForAI.y - activeShipForAI.height*2 && bullet.y < canvasHeight) {
                        const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height };
                        if (checkCollision(dangerZoneForBullets, bulletRect)) {
                            threateningBullets.push(bullet);
                        }
                    }
                }

                if (threateningBullets.length > 0) {
                    isDodgingThreat = true;
                    let bestDodgeX = currentSmoothedShipXForAI;
                    let maxDodgeScore = -Infinity;

                    for (let dodgeDir = -1; dodgeDir <= 1; dodgeDir += 2) {
                        const dodgeAmount = effectiveShipWidth * (2.0 + Math.random() * 0.5) + (threateningBullets.length > 1 ? effectiveShipWidth * 0.5 : 0) ;
                        let potentialDodgeX = currentSmoothedShipXForAI + dodgeDir * dodgeAmount;
                        potentialDodgeX = Math.max(AI_ANTI_CORNER_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_ANTI_CORNER_BUFFER, potentialDodgeX));

                        let bulletsNearDodge = 0;
                        const testDodgeZone = { x: potentialDodgeX - bulletBuffer/2, y: activeShipForAI.y - bulletLookahead, width: effectiveShipWidth + bulletBuffer, height: bulletLookahead + activeShipForAI.height};
                        for (const bullet of threateningBullets) {
                            if (checkCollision(testDodgeZone, { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height })) {
                                bulletsNearDodge++;
                            }
                        }
                        let dodgeScore = -bulletsNearDodge;
                        if (Math.abs(potentialDodgeX - currentSmoothedShipXForAI) < effectiveShipWidth * 0.5) dodgeScore -=10;

                        if (dodgeScore > maxDodgeScore) {
                            maxDodgeScore = dodgeScore;
                            bestDodgeX = potentialDodgeX;
                        }
                    }
                    dodgeTargetX = bestDodgeX;
                }

                if (!isDodgingThreat) {
                    const enemyLookahead = AI_COLLISION_LOOKAHEAD * 1.5;
                    const enemyBuffer = FINAL_DODGE_BUFFER_BASE * 1.5;
                    for (const currentEnemy of enemies) {
                        if (currentEnemy && (currentEnemy.state === 'attacking' || currentEnemy.state === 'diving_to_capture_position' || currentEnemy.state === 'following_entrance_path' || currentEnemy.state === 'following_bezier_path') && currentEnemy.y + currentEnemy.height > activeShipForAI.y - enemyLookahead/2 && currentEnemy.y < activeShipForAI.y + activeShipForAI.height) {
                            const dangerZoneForEnemy = { x: activeShipForAI.x - enemyBuffer, y: activeShipForAI.y - enemyLookahead, width: effectiveShipWidth + enemyBuffer * 2, height: enemyLookahead + activeShipForAI.height };
                            const enemyRect = { x: currentEnemy.x, y: currentEnemy.y, width: currentEnemy.width, height: currentEnemy.height };
                            if (checkCollision(dangerZoneForEnemy, enemyRect)) {
                                isDodgingThreat = true;
                                const enemyCenterX = currentEnemy.x + currentEnemy.width / 2;
                                const dodgeDirection = (shipCenterX < enemyCenterX) ? -1 : 1;
                                const dodgeAmount = effectiveShipWidth * (2.2 + Math.random() * 0.6);
                                dodgeTargetX = currentSmoothedShipXForAI + dodgeDirection * dodgeAmount;
                                break;
                            }
                        }
                    }
                }
            }

            if (isDodgingThreat) {
                desiredTargetX = Math.max(AI_ANTI_CORNER_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_ANTI_CORNER_BUFFER, dodgeTargetX));
                targetEnemyForAI = null;
                shouldTryShoot = false;
            } else if (fallingShips.length > 0 && !isShipCapturedForAI && !isWaitingForRespawn && !isDualActiveForAI ) {
                let closestFallingShip = null;
                let minDist = Infinity;
                for (const fs of fallingShips) {
                    if (fs && !fs.landed) {
                        const dist = Math.abs(fs.x + fs.width / 2 - shipCenterX) + Math.abs(fs.y - activeShipForAI.y);
                        if (dist < minDist) {
                            minDist = dist;
                            closestFallingShip = fs;
                        }
                    }
                }
                if (closestFallingShip) {
                    desiredTargetX = closestFallingShip.x + closestFallingShip.width / 2 - effectiveShipWidth / 2;
                    shouldTryShoot = false;
                    targetEnemyForAI = null;
                }
            } else {
                isMovingToCapture = false;
                 if (aiCanBeCaptured && captureBeamActive && capturingBossId && !isShipCapturedForAI && !isWaitingForRespawn) { 
                    const capturingBoss = enemies.find(e => e.id === capturingBossId && e.type === ENEMY3_TYPE && e.state === 'capturing');
                    if (capturingBoss) {
                        const beamCenterX = capturingBoss.x + (capturingBoss.type === ENEMY3_TYPE ? BOSS_WIDTH : ENEMY_WIDTH) / 2;
                        const dxToBeam = Math.abs(shipCenterX - beamCenterX);
                        if (dxToBeam < (effectiveShipWidth * 0.8) && (now - (capturingBoss.captureStartTime || 0) >= AI_CAPTURE_BEAM_APPROACH_DELAY_MS)) {
                            desiredTargetX = beamCenterX - effectiveShipWidth / 2;
                            shouldTryShoot = false;
                            targetEnemyForAI = null;
                            isMovingToCapture = true;
                        }
                    }
                }

                if (!isMovingToCapture) {
                    targetEnemyForAI = null;
                    let bestTargetScore = -Infinity;

                    for (const enemy of enemies) {
                        if (!enemy) continue;

                        let currentScore = 0;
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        const dx = enemyCenterX - shipCenterX;
                        const dy = shipTopY - (enemy.y + enemy.height);

                        if (dy < 0 && enemy.state !== 'attacking' && enemy.state !== 'diving_to_capture_position' && enemy.state !== 'following_bezier_path') continue;

                        currentScore = (canvasHeight - enemy.y) * 2 - Math.abs(dx) * 3 - dy;
                        if (enemy.state === 'attacking' || enemy.state === 'diving_to_capture_position') currentScore += 3000;
                        if (enemy.type === ENEMY3_TYPE && !enemy.isDamaged) currentScore += 2000;
                        if (enemy.type === ENEMY3_TYPE && enemy.isDamaged) currentScore += 4000;
                        if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip) currentScore += 5000;

                        if (currentScore > bestTargetScore) {
                            bestTargetScore = currentScore;
                            targetEnemyForAI = enemy;
                        }
                    }

                    if (targetEnemyForAI) {
                        const enemyMidX = targetEnemyForAI.x + targetEnemyForAI.width / 2;
                        desiredTargetX = enemyMidX - (effectiveShipWidth / 2);

                        const ALIGNMENT_MULTIPLIER = 1.8;
                        let alignmentThresholdForShooting;

                        if (isChallengingStage) {
                            alignmentThresholdForShooting = effectiveShipWidth * 2.5;
                        } else if (targetEnemyForAI.state === 'in_grid' || targetEnemyForAI.state === 'preparing_capture') {
                            alignmentThresholdForShooting = effectiveShipWidth * (GRID_SHOOT_ALIGNMENT_FACTOR * ALIGNMENT_MULTIPLIER);
                        } else {
                            alignmentThresholdForShooting = effectiveShipWidth * (FINAL_SHOOT_ALIGNMENT_THRESHOLD * ALIGNMENT_MULTIPLIER);
                        }

                        const horizontalDiffToAim = Math.abs(shipCenterX - enemyMidX);

                        if (horizontalDiffToAim < alignmentThresholdForShooting) {
                            let blockShootingThisTarget = false;
                            // --- START OF MODIFIED SECTION ---
                            if (aiCanBeCaptured && targetEnemyForAI.type === ENEMY3_TYPE &&
                                !targetEnemyForAI.hasCapturedShip && !captureAttemptMadeThisLevel && !isFullGridWave &&
                                (targetEnemyForAI.state === 'in_grid' ||
                                 targetEnemyForAI.state === 'preparing_capture' ||
                                 targetEnemyForAI.state === 'diving_to_capture_position' ||
                                 targetEnemyForAI.state === 'capturing' // toegevoegd
                                )
                               ) {
                                blockShootingThisTarget = true;
                            }
                            // --- END OF MODIFIED SECTION ---

                            if (!blockShootingThisTarget) {
                                shouldTryShoot = true;
                            }
                        }
                    } else {
                        desiredTargetX = targetCenterShipX;
                        shouldTryShoot = false;
                    }
                }
            }
        }

        if (activeShipForAI) {
            currentSmoothedShipXForAI += (desiredTargetX - currentSmoothedShipXForAI) * AI_SMOOTHING_FACTOR_MOVE;
            activeShipForAI.targetX = currentSmoothedShipXForAI;

            if (isAIPlayer2NormalMode) {
                smoothedShipX = currentSmoothedShipXForAI;
            } else if (!isManualControl && !isPlayerTwoAI) {
                smoothedShipX = currentSmoothedShipXForAI;
            }
        }


        if (shouldTryShoot && !isDodgingThreat && !isMovingToCapture && !isShowingBlockingMessage) {
            let canAIShootNow = false;
            if (isAIPlayer2NormalMode) {
                canAIShootNow = true;
            } else {
                if (now >= aiCanShootTime) {
                    canAIShootNow = true;
                }
            }

            if (canAIShootNow && !isShowingIntro) {
                if (firePlayerBullet(aiIdentifierForAI, false)) { // false voor isTapEvent
                    if (!isAIPlayer2NormalMode) {
                        aiCanShootTime = now + SHOOT_COOLDOWN;
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error in aiControl:", e, e.stack);
        if (ship) {
            ship.targetX = ship.x;
        }
        aiNeedsStabilization = true;
        smoothedShipX = ship ? ship.x : (gameCanvas ? gameCanvas.width / 2 : 0);
    }
 }

 /**
 * Controls CO-OP AI ships (demo mode of 1P vs AI COOP).
 */
function aiControlCoop() {
    if (!(isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) || isPaused || !gameCanvas || !isInGameState || gameOverSequenceStartTime > 0 ) {
        if (ship1) ship1.targetX = ship1.x;
        if (ship2) ship2.targetX = ship2.x;
        return;
    }

    const now = Date.now();
    const canvasWidth = gameCanvas.width;

    const p1IsHuman = isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP';

    const p1CanAct = ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture;
    const p2CanAct = ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture;

    const getShipBlockingState = (shipIdForBlockCheck) => {
        const isGameOverForThisShip = (shipIdForBlockCheck === 'p1' && isPlayer1ShowingGameOverMessage) ||
                                      (shipIdForBlockCheck === 'p2' && isPlayer2ShowingGameOverMessage);
        return isGameOverForThisShip ||
               showReadyMessage ||
               isCsCompletionDelayActive ||
               (isShowingIntro && !(level === 1 && coopPlayersReadyStartTime > 0 && (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ));
    };

    let p1ShouldShootOverrideGeneral = true;
    let p2ShouldShootOverrideGeneral = true;

    if (coopAICaptureDiveAnticipationActive && now < coopAICaptureDiveAnticipationEndTime) {
        if (!p1IsHuman) p1ShouldShootOverrideGeneral = false;
        p2ShouldShootOverrideGeneral = false;
    } else if (coopAICaptureDiveAnticipationActive) {
        coopAICaptureDiveAnticipationActive = false;
        coopAICaptureDiveAnticipationEndTime = 0;
    }

    if (p1CanAct && ship1 && !p1IsHuman) {
        if (smoothedShip1X === undefined) smoothedShip1X = ship1.x;
        const p1CompletelyBlocked = getShipBlockingState('p1');
        let { desiredTargetX: dt1, shouldTryShoot: sts1, targetEnemyForAI: te1 } = calculateAIDesiredState(ship1, smoothedShip1X, player1IsDualShipActive, enemies, enemyBullets, fallingShips, isPlayer1Invincible, isPlayer1ShipCaptured, isPlayer1WaitingForRespawn, now, canvasWidth, p1CompletelyBlocked, 'p1');
        aiShip1TargetEnemy = te1;
        smoothedShip1X += (dt1 - smoothedShip1X) * AI_SMOOTHING_FACTOR_MOVE;
        ship1.targetX = smoothedShip1X;

        const p1IsSavingPartner = te1 && te1.type === ENEMY3_TYPE && te1.hasCapturedShip && te1.id === capturedBossIdWithMessage && isPlayer2ShipCaptured;

        if (sts1 && p1ShouldShootOverrideGeneral && !(isShowingCaptureMessage && isPlayer1ShipCaptured) ) {
            if (p1IsSavingPartner || now >= aiShip1CanShootTime) {
                fireCoopAIBullet(ship1, player1IsDualShipActive, 'player1');
                if (!p1IsSavingPartner) aiShip1CanShootTime = now + SHOOT_COOLDOWN;
                else aiShip1CanShootTime = now + (SHOOT_COOLDOWN / 2);
            }
        }
    }

    if (p2CanAct && ship2) {
        if (smoothedShip2X === undefined) smoothedShip2X = ship2.x;
        const p2CompletelyBlocked = getShipBlockingState('p2');
        let { desiredTargetX: dt2, shouldTryShoot: sts2, targetEnemyForAI: te2 } = calculateAIDesiredState(ship2, smoothedShip2X, player2IsDualShipActive, enemies, enemyBullets, fallingShips, isPlayer2Invincible, isPlayer2ShipCaptured, isPlayer2WaitingForRespawn, now, canvasWidth, p2CompletelyBlocked, 'p2');
        aiShip2TargetEnemy = te2;
        smoothedShip2X += (dt2 - smoothedShip2X) * AI_SMOOTHING_FACTOR_MOVE;
        ship2.targetX = smoothedShip2X;

        const p2IsSavingPartner = te2 && te2.type === ENEMY3_TYPE && te2.hasCapturedShip && te2.id === capturedBossIdWithMessage && isPlayer1ShipCaptured;

        if (sts2 && p2ShouldShootOverrideGeneral && !(isShowingCaptureMessage && isPlayer2ShipCaptured) ) {
            if (p2IsSavingPartner || now >= aiShip2CanShootTime) {
                fireCoopAIBullet(ship2, player2IsDualShipActive, (isCoopAIDemoActive ? 'player2' : 'ai_p2'));
                if (!p2IsSavingPartner) aiShip2CanShootTime = now + SHOOT_COOLDOWN;
                else aiShip2CanShootTime = now + (SHOOT_COOLDOWN / 2);
            }
        }
    }
}

/**
 * Helper functie voor CO-OP AI om een kogel af te vuren.
 */
function fireCoopAIBullet(shootingShip, isDual, shooterPlayerId) {
    if (!shootingShip) return false;
    const now = Date.now();

    let shooterIsGameOver = false;
    if (shooterPlayerId === 'player1' && isPlayer1ShowingGameOverMessage) shooterIsGameOver = true;
    if ((shooterPlayerId === 'player2' || shooterPlayerId === 'ai_p2') && isPlayer2ShowingGameOverMessage) shooterIsGameOver = true;

    let generalBlock = isPaused || !isInGameState || gameOverSequenceStartTime > 0 || shooterIsGameOver;

    if (generalBlock) return false;

    if (shooterPlayerId === 'player1' && isPlayer1ShipCaptured) return false;
    if ((shooterPlayerId === 'player2' || shooterPlayerId === 'ai_p2') && isPlayer2ShipCaptured) return false;


    try {
        const bulletY = shootingShip.y;
        let bulletsCreated = 0;
        const bulletPlayerId = shooterPlayerId;

        if (isDual) {
            const ship1CenterX = shootingShip.x + shootingShip.width / 2;
            const ship2CenterX = shootingShip.x + DUAL_SHIP_OFFSET_X + shootingShip.width / 2;
            const bulletX1 = ship1CenterX - PLAYER_BULLET_WIDTH / 2;
            const bulletX2 = ship2CenterX - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX1, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: bulletPlayerId });
            bullets.push({ x: bulletX2, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: bulletPlayerId });
            bulletsCreated = 2;
        } else {
            const bulletX = shootingShip.x + shootingShip.width / 2 - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED, playerId: bulletPlayerId });
            bulletsCreated = 1;
        }
        playSound('playerShootSound', false, 0.4);
        if (shooterPlayerId === 'player1') {
            player1ShotsFired += bulletsCreated;
            player1LastShotTime = now;
            aiShip1LastShotTime = now;
        } else if (shooterPlayerId === 'player2' || shooterPlayerId === 'ai_p2') {
            player2ShotsFired += bulletsCreated;
            player2LastShotTime = now;
            aiShip2LastShotTime = now;
        }
        return true;
    } catch(e) {
        console.error(`Error creating CO-OP AI bullet for ${shooterPlayerId}:`, e);
        return false;
    }
}


/**
 * Helper functie die de gewenste state (doel X, schieten ja/nee, doel vijand) voor een ENKEL AI schip berekent.
 */
function calculateAIDesiredState(currentShip, currentSmoothedX, isShipDual, gameEnemies, gameEnemyBullets, gameFallingShips, isShipInvincible, isThisShipCaptured, isThisShipWaitingForRespawn, currentTime, gameCanvasWidth, isCurrentShipCompletelyBlocked, shipIdentifier) {
    let desiredTargetX = currentSmoothedX;
    let shouldTryShoot = false;
    let targetEnemyForAI = null;
    let isDodgingThreat = false;
    let isMovingForOwnFallingShip = false;
    let isTargetingCapturedShipBoss = false;
    let isMovingToCaptureBeam = false;

    const canvasHeight = gameCanvas.height;
    const effectiveShipWidth = currentShip.width + (isShipDual ? DUAL_SHIP_OFFSET_X : 0);
    const shipCenterX = currentShip.x + effectiveShipWidth / 2;
    const shipTopY = currentShip.y;
    const livesOfThisAIShip = (shipIdentifier === 'p1') ? player1Lives : ((shipIdentifier === 'ai_p2' || shipIdentifier === 'p2') ? player2Lives : 0) ;
    const canThisAIShipBeCaptured = livesOfThisAIShip > 1 && !isShipDual; 

    let laneCenterX = gameCanvasWidth / 2;

    const generalIntroIsActive = (isShowingIntro || isShowingCoopPlayersReady);
    const isCoopDemoAndGeneralIntroActive = isCoopAIDemoActive && generalIntroIsActive && !(isChallengingStage && isEntrancePhaseActive);

    const isSingleSurvivorInCoopDemo = isCoopAIDemoActive &&
                                       ((shipIdentifier === 'p1' && player1Lives > 0 && player2Lives <= 0) ||
                                        ((shipIdentifier === 'p2' || shipIdentifier === 'ai_p2') && player2Lives > 0 && player1Lives <= 0));

    if (isCoopDemoAndGeneralIntroActive && isSingleSurvivorInCoopDemo) {
         laneCenterX = gameCanvasWidth / 2;
    }
    else if (shipIdentifier === 'p1') {
        laneCenterX = gameCanvasWidth * 0.25 + Math.sin(currentTime / (AI_WIGGLE_PERIOD * 1.1)) * (AI_WIGGLE_AMPLITUDE * 0.8);
    } else if (shipIdentifier === 'p2' || shipIdentifier === 'ai_p2') {
        laneCenterX = gameCanvasWidth * 0.75 + Math.cos(currentTime / (AI_WIGGLE_PERIOD * 0.9)) * (AI_WIGGLE_AMPLITUDE * 0.8);
    }
    let targetCenterShipX = laneCenterX - (effectiveShipWidth / 2);

    if (isCurrentShipCompletelyBlocked || isThisShipCaptured || isThisShipWaitingForRespawn || (shipIdentifier === 'p1' && player1NeedsRespawnAfterCapture) || ((shipIdentifier === 'p2' || shipIdentifier === 'ai_p2') && player2NeedsRespawnAfterCapture) ) {
        if (isCoopDemoAndGeneralIntroActive && isSingleSurvivorInCoopDemo) {
             desiredTargetX = targetCenterShipX;
        }
        else {
            desiredTargetX = targetCenterShipX;
        }
        if (isThisShipCaptured || isThisShipWaitingForRespawn || (shipIdentifier === 'p1' && player1NeedsRespawnAfterCapture) || ((shipIdentifier === 'p2' || shipIdentifier === 'ai_p2') && player2NeedsRespawnAfterCapture) ) {
             desiredTargetX = currentShip.x;
        }
        return { desiredTargetX, shouldTryShoot: false, targetEnemyForAI: null };
    }

    const otherPlayerId = (shipIdentifier === 'p1') ? 'p2' : 'p1';
    const otherPlayerIsActuallyCaptured = (otherPlayerId === 'p1' && isPlayer1ShipCaptured) || (otherPlayerId === 'p2' && isPlayer2ShipCaptured);
    const otherPlayerIsShowingGameOver = (otherPlayerId === 'p1' && isPlayer1ShowingGameOverMessage) || (otherPlayerId === 'p2' && isPlayer2ShowingGameOverMessage);
    let bossHoldingPartner = null;
    let allowTargetingCapturedPartnerBoss = true;

    if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
        if (otherPlayerIsActuallyCaptured && !otherPlayerIsShowingGameOver && capturedBossIdWithMessage) {
            const partnerCaptureTime = (otherPlayerId === 'p1') ? coopPartner1CapturedTime : coopPartner2CapturedTime;
            if (partnerCaptureTime > 0 && (currentTime - partnerCaptureTime < COOP_AI_SAVE_PARTNER_DELAY_MS)) {
                allowTargetingCapturedPartnerBoss = false;
            }
            bossHoldingPartner = gameEnemies.find(e => e.id === capturedBossIdWithMessage && e.type === ENEMY3_TYPE && e.hasCapturedShip);
        }
    }


    if (bossHoldingPartner && !isShipDual && allowTargetingCapturedPartnerBoss) {
        isTargetingCapturedShipBoss = true;
        targetEnemyForAI = bossHoldingPartner;
        const bossCenterX = bossHoldingPartner.x + bossHoldingPartner.width / 2;
        desiredTargetX = bossCenterX - effectiveShipWidth / 2;
        shouldTryShoot = true;
        isDodgingThreat = false;
        if (!isShipInvincible) {
            let threateningBulletsNearBossTarget = [];
            const bulletLookaheadSave = FINAL_DODGE_LOOKAHEAD * 0.4;
            const bulletBufferSave = FINAL_DODGE_BUFFER_BASE * 0.3;
            const dangerZoneForSaving = { x: Math.min(shipCenterX, bossCenterX) - bulletBufferSave, y: currentShip.y - bulletLookaheadSave, width: Math.abs(shipCenterX - bossCenterX) + effectiveShipWidth + bulletBufferSave * 2, height: bulletLookaheadSave + currentShip.height };
            for (const bullet of gameEnemyBullets) {
                if (bullet && bullet.y + bullet.height > currentShip.y - currentShip.height && bullet.y < canvasHeight) {
                    const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height };
                    if (checkCollision(dangerZoneForSaving, bulletRect)) {
                        threateningBulletsNearBossTarget.push(bullet);
                    }
                }
            }
            if (threateningBulletsNearBossTarget.length > 0) {
                isDodgingThreat = true;
                const dodgeDirection = (currentSmoothedX < gameCanvasWidth / 2) ? -1 : 1;
                desiredTargetX = currentSmoothedX + dodgeDirection * (effectiveShipWidth * 0.6);
                shouldTryShoot = false;
            }
        }
        desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(gameCanvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX));
        return { desiredTargetX, shouldTryShoot, targetEnemyForAI };
    }

    if (!isShipInvincible) {
        let threateningBullets = [];
        const bulletLookahead = FINAL_DODGE_LOOKAHEAD * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 1.6 : 0.8);
        const bulletBuffer = FINAL_DODGE_BUFFER_BASE * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 1.7 : 0.8);
        const dangerZoneForBullets = { x: currentShip.x - bulletBuffer, y: currentShip.y - bulletLookahead, width: effectiveShipWidth + bulletBuffer * 2, height: bulletLookahead + currentShip.height };
        for (const bullet of gameEnemyBullets) {
            if (bullet && bullet.y + bullet.height > currentShip.y - currentShip.height * 1.5 && bullet.y < canvasHeight) {
                const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height };
                if (checkCollision(dangerZoneForBullets, bulletRect)) {
                    threateningBullets.push(bullet);
                }
            }
        }
        if (threateningBullets.length > 0) {
            isDodgingThreat = true;
            let bestDodgeX = currentSmoothedX;
            const dodgeAmountBase = effectiveShipWidth * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 3.0 : 2.0);
            let bulletsCenter = 0, bulletsLeft = 0, bulletsRight = 0;
            const shipEffectiveCenter = currentShip.x + effectiveShipWidth / 2;
            for (const b of threateningBullets) {
                if (b.x < shipEffectiveCenter - effectiveShipWidth * 0.5) bulletsLeft++;
                else if (b.x > shipEffectiveCenter + effectiveShipWidth * 0.5) bulletsRight++;
                else bulletsCenter++;
            }
            if (bulletsLeft <= bulletsRight && bulletsLeft <= bulletsCenter) {
                bestDodgeX = currentSmoothedX - dodgeAmountBase - (Math.random() * effectiveShipWidth * 0.4);
            } else if (bulletsRight <= bulletsLeft && bulletsRight <= bulletsCenter) {
                bestDodgeX = currentSmoothedX + dodgeAmountBase + (Math.random() * effectiveShipWidth * 0.4);
            } else {
                 if (currentSmoothedX < laneCenterX) bestDodgeX = laneCenterX + dodgeAmountBase + (Math.random() * effectiveShipWidth * 0.7);
                 else bestDodgeX = laneCenterX - dodgeAmountBase - (Math.random() * effectiveShipWidth * 0.7);
            }
            desiredTargetX = bestDodgeX;
        }

        if (!isDodgingThreat) {
            const enemyLookahead = AI_COLLISION_LOOKAHEAD * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 1.0 : 0.75);
            const enemyCollisionBuffer = AI_COLLISION_BUFFER * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 1.0 : 0.8);
            for (const enemy of gameEnemies) {
                if (!enemy) continue;
                if (!allowTargetingCapturedPartnerBoss && bossHoldingPartner && enemy.id === bossHoldingPartner.id) {
                    continue;
                }
                if ((enemy.state === 'attacking' || enemy.state === 'diving_to_capture_position') &&
                    enemy.y + enemy.height > shipTopY - enemyLookahead &&
                    enemy.y < shipTopY + currentShip.height * 1.5) {
                    const dangerZoneForEnemy = { x: currentShip.x - enemyCollisionBuffer, y: currentShip.y - enemyLookahead, width: effectiveShipWidth + enemyCollisionBuffer * 2, height: enemyLookahead + currentShip.height };
                    const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
                    if (checkCollision(dangerZoneForEnemy, enemyRect)) {
                        isDodgingThreat = true;
                        targetEnemyForAI = null;
                        shouldTryShoot = false;
                        const enemyCenterX = enemy.x + enemy.width / 2;
                        desiredTargetX = currentSmoothedX + ((shipCenterX < enemyCenterX) ? -1 : 1) * (effectiveShipWidth * ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) ? 2.2 : 1.9));
                        break;
                    }
                }
            }
        }
    }

    if (!isDodgingThreat && canThisAIShipBeCaptured && captureBeamActive && capturingBossId && !isThisShipCaptured) { 
        if (aiPlayerActivelySeekingCaptureById === null || aiPlayerActivelySeekingCaptureById === shipIdentifier) {
            const capturingBossEntity = gameEnemies.find(e => e.id === capturingBossId);
            if (capturingBossEntity && capturingBossEntity.state === 'capturing') {
                if (aiPlayerActivelySeekingCaptureById === null) {
                    aiPlayerActivelySeekingCaptureById = shipIdentifier;
                }
                if (aiPlayerActivelySeekingCaptureById === shipIdentifier) {
                    if (currentTime - (capturingBossEntity.captureStartTime || 0) >= AI_CAPTURE_BEAM_APPROACH_DELAY_MS) { 
                        isMovingToCaptureBeam = true;
                        const beamCenterX = capturingBossEntity.x + (capturingBossEntity.type === ENEMY3_TYPE ? BOSS_WIDTH : ENEMY_WIDTH) / 2;
                        desiredTargetX = beamCenterX - effectiveShipWidth / 2;
                        shouldTryShoot = false;
                        targetEnemyForAI = null;
                    } else {
                        desiredTargetX = targetCenterShipX;
                        shouldTryShoot = false;
                        targetEnemyForAI = null;
                    }
                }
            } else {
                if (aiPlayerActivelySeekingCaptureById === shipIdentifier) {
                    aiPlayerActivelySeekingCaptureById = null;
                }
            }
        }
    } else {
        if (aiPlayerActivelySeekingCaptureById === shipIdentifier && !(canThisAIShipBeCaptured && captureBeamActive && capturingBossId && !isThisShipCaptured) ) { 
             aiPlayerActivelySeekingCaptureById = null;
        }
    }


    if (!isDodgingThreat && !isMovingToCaptureBeam && !isShipDual) {
        const ownFallingShip = gameFallingShips.find(fs => fs.targetPlayerId === shipIdentifier && !fs.landed);
        if (ownFallingShip) {
            isMovingForOwnFallingShip = true;
            desiredTargetX = ownFallingShip.x + ownFallingShip.width / 2 - effectiveShipWidth / 2;
            shouldTryShoot = false;
            targetEnemyForAI = null;
        }
    }

    if (!isDodgingThreat && !isMovingToCaptureBeam && !isMovingForOwnFallingShip && !isTargetingCapturedShipBoss) {
        let bestTargetScore = -Infinity;
        let localShouldTryShoot = false;
        let localTargetEnemyForAI = null;

        for (const enemy of gameEnemies) {
            if (!enemy) continue;

            if (!allowTargetingCapturedPartnerBoss && bossHoldingPartner && enemy.id === bossHoldingPartner.id) {
                continue;
            }

            let isBossWithNeutralShipAndAILowLife = false;
            if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip && livesOfThisAIShip <= 1) {
                 const isPartnerBoss = (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && enemy.id === capturedBossIdWithMessage && otherPlayerIsActuallyCaptured;
                 if (!isPartnerBoss) {
                    isBossWithNeutralShipAndAILowLife = true;
                 }
            }
            let currentScore = 0;
            const enemyCenterX = enemy.x + enemy.width/2;
            const dx = enemyCenterX - shipCenterX;
            const dy = shipTopY - (enemy.y + enemy.height);
            if (dy < 0 && enemy.state !== 'attacking' && enemy.state !== 'diving_to_capture_position' && enemy.state !== 'following_bezier_path') continue;
            let laneBonus = 0;
            if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                if (shipIdentifier === 'p1' && enemyCenterX < gameCanvasWidth / 2) laneBonus = 5000;
                else if ((shipIdentifier === 'p2' || shipIdentifier === 'ai_p2') && enemyCenterX >= gameCanvasWidth / 2) laneBonus = 5000;
            }
            currentScore = laneBonus + (canvasHeight - enemy.y) * 2 - Math.abs(dx) * 3 - dy;
            if (enemy.state === 'attacking' || enemy.state === 'diving_to_capture_position') currentScore += 3000;
            if (enemy.type === ENEMY3_TYPE && !enemy.isDamaged) currentScore += 2000;
            if (enemy.type === ENEMY3_TYPE && enemy.isDamaged) currentScore += 4000;
            if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip) {
                if (!isBossWithNeutralShipAndAILowLife) { currentScore += 5000; }
                else { currentScore -= 10000; }
            }
            if (currentScore > bestTargetScore) {
                bestTargetScore = currentScore;
                localTargetEnemyForAI = enemy;
                let doNotShootThisBossSpecifically = false;

                if (localTargetEnemyForAI.type === ENEMY3_TYPE && !localTargetEnemyForAI.hasCapturedShip && !isFullGridWave) {
                    if (canThisAIShipBeCaptured && !captureAttemptMadeThisLevel &&
                        (localTargetEnemyForAI.state === 'in_grid' || 
                         localTargetEnemyForAI.state === 'preparing_capture' || 
                         localTargetEnemyForAI.state === 'diving_to_capture_position' ||
                         localTargetEnemyForAI.state === 'capturing' // Toegevoegd voor COOP AI
                        )
                       ) {
                        doNotShootThisBossSpecifically = true;
                    }

                    if (isShipDual) {
                        const partnerPlayerIdToCheck = (shipIdentifier === 'p1') ? 'p2' : 'p1';
                        let partnerIsActiveAndNeedsDual = false;
                        if (partnerPlayerIdToCheck === 'p1') {
                            if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture && !player1IsDualShipActive) {
                                partnerIsActiveAndNeedsDual = true;
                            }
                        } else { 
                            if (ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture && !player2IsDualShipActive) {
                                partnerIsActiveAndNeedsDual = true;
                            }
                        }
                        if (partnerIsActiveAndNeedsDual) {
                            doNotShootThisBossSpecifically = true;
                        }
                    }
                }


                if (isBossWithNeutralShipAndAILowLife && localTargetEnemyForAI === enemy) {
                     if (Math.abs(shipCenterX - (localTargetEnemyForAI.x + localTargetEnemyForAI.width / 2)) < effectiveShipWidth * 1.1) { localShouldTryShoot = true; }
                     else { localShouldTryShoot = false; }
                } else if (doNotShootThisBossSpecifically) {
                    localShouldTryShoot = false;
                } else if (Math.abs(shipCenterX - (localTargetEnemyForAI.x + localTargetEnemyForAI.width / 2)) < effectiveShipWidth * 0.9) {
                    localShouldTryShoot = true;
                } else {
                    localShouldTryShoot = false;
                }
            }
        }
        targetEnemyForAI = localTargetEnemyForAI;
        shouldTryShoot = localShouldTryShoot;


        if (targetEnemyForAI) {
            let isTargetBossWithNeutralShipAndAILowLife = false;
            if (targetEnemyForAI.type === ENEMY3_TYPE && targetEnemyForAI.hasCapturedShip && livesOfThisAIShip <= 1) {
                const isPartnerBoss = (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && targetEnemyForAI.id === capturedBossIdWithMessage && otherPlayerIsActuallyCaptured;
                if (!isPartnerBoss) {
                    isTargetBossWithNeutralShipAndAILowLife = true;
                }
            }
            if (isTargetBossWithNeutralShipAndAILowLife) {
                desiredTargetX = targetCenterShipX;
            } else {
                const enemyCenterX = targetEnemyForAI.x + targetEnemyForAI.width / 2;
                desiredTargetX = enemyCenterX - effectiveShipWidth / 2;
            }
        } else {
            desiredTargetX = targetCenterShipX;
            shouldTryShoot = false;
        }
    }

    desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(gameCanvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX));
    return { desiredTargetX, shouldTryShoot, targetEnemyForAI };
}


// --- EINDE deel 5      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---






// --- START OF FILE game_logic.js ---
// --- DEEL 6      van 8 dit code blok    --- (Focus: Enemy Attack Selection & Capture Trigger)

function findAndDetachEnemy() {
    try {
        let aShipIsCapturedInGame = false;
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            aShipIsCapturedInGame = isPlayer1ShipCaptured || isPlayer2ShipCaptured;
        } else {
            aShipIsCapturedInGame = isShipCaptured;
        }

        if (!isFullGridWave && aShipIsCapturedInGame) {
            const bossWithShip = enemies.find(e => e && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.state === 'in_grid');
            if (bossWithShip) {
                bossWithShip.justReturned = true;
                bossWithShip.attackType = 'normal';
                const attackGroupIds = new Set([bossWithShip.id]);
                resetJustReturnedFlags(attackGroupIds);
                return [bossWithShip];
            }
        }

        if (isEntrancePhaseActive) { return null; }
        let availableGridEnemies = enemies.filter(e => e && e.state === 'in_grid' && !e.justReturned); if (availableGridEnemies.length === 0) { availableGridEnemies = enemies.filter(e => e && e.state === 'in_grid'); if (availableGridEnemies.length === 0) { return null; } } if (availableGridEnemies.length === 0) { return null; }
        availableGridEnemies.sort((a, b) => (b.gridRow || 0) - (a.gridRow || 0)); const isForcedAttackScenario = availableGridEnemies.length <= 3; let attackGroup = []; const selectedAttackType = 'normal';
        if (gridJustCompleted) { gridJustCompleted = false; }
        let groupSelected = false;
        if (level > 1 && !isForcedAttackScenario && availableGridEnemies.length >= 3) { const bossesForTriple = availableGridEnemies.filter(e => e.type === ENEMY3_TYPE && !e.hasCapturedShip); for (const boss of bossesForTriple) { const escortLeft = availableGridEnemies.find(e => e.type === ENEMY2_TYPE && e.gridRow === boss.gridRow && e.gridCol === boss.gridCol - 1); const escortRight = availableGridEnemies.find(e => e.type === ENEMY2_TYPE && e.gridRow === boss.gridRow && e.gridCol === boss.gridCol + 1); if (escortLeft && escortRight) { attackGroup = [boss, escortLeft, escortRight]; groupSelected = true; break; } } }
        if (!groupSelected && !isForcedAttackScenario) { const availableBees = availableGridEnemies.filter(e => e.type === ENEMY1_TYPE); const beeGroupAttackChance = scaleValue(level, BASE_BEE_GROUP_ATTACK_PROBABILITY, MAX_BEE_GROUP_ATTACK_PROBABILITY) * 1.2; if (availableBees.length >= 2 && Math.random() < beeGroupAttackChance) { const beeTripleChance = scaleValue(level, BASE_BEE_TRIPLE_ATTACK_PROBABILITY, MAX_BEE_TRIPLE_ATTACK_PROBABILITY) * 1.1; const targetGroupSize = (availableBees.length >= 3 && Math.random() < beeTripleChance) ? 3 : 2; let foundCoordinatedGroup = false; availableBees.sort(() => Math.random() - 0.5); for (let i = 0; i < availableBees.length; i++) { const leaderBee = availableBees[i]; let potentialGroup = [leaderBee]; const neighbors = availableBees.filter(b => b.id !== leaderBee.id && b.gridRow === leaderBee.gridRow); neighbors.sort((a, b) => Math.abs(a.gridCol - leaderBee.gridCol) - Math.abs(b.gridCol - leaderBee.gridCol)); for(let j = 0; j < neighbors.length && potentialGroup.length < targetGroupSize; j++){ potentialGroup.push(neighbors[j]); } if (potentialGroup.length === targetGroupSize) { attackGroup = potentialGroup; groupSelected = true; foundCoordinatedGroup = true; break; } } if (!foundCoordinatedGroup && availableBees.length >= targetGroupSize) { attackGroup = availableBees.slice(0, targetGroupSize); groupSelected = true; } } }
        if (!groupSelected && !isForcedAttackScenario) { const availableButterflies = availableGridEnemies.filter(e => e.type === ENEMY2_TYPE); const butterflyGroupAttackChance = 0.2; if (availableButterflies.length >= 2 && Math.random() < butterflyGroupAttackChance) { const targetGroupSize = 2; let foundCoordinatedGroup = false; availableButterflies.sort(() => Math.random() - 0.5); for (let i = 0; i < availableButterflies.length; i++) { const leader = availableButterflies[i]; let potentialGroup = [leader]; const neighbors = availableButterflies.filter(b => b.id !== leader.id && b.gridRow === leader.gridRow); neighbors.sort((a, b) => Math.abs(a.gridCol - leader.gridCol) - Math.abs(b.gridCol - leader.gridCol)); for(let j = 0; j < neighbors.length && potentialGroup.length < targetGroupSize; j++){ potentialGroup.push(neighbors[j]); } if (potentialGroup.length === targetGroupSize) { attackGroup = potentialGroup; groupSelected = true; foundCoordinatedGroup = true; break; } } if (!foundCoordinatedGroup && availableButterflies.length >= targetGroupSize) { attackGroup = availableButterflies.slice(0, targetGroupSize); groupSelected = true; } } }
        if (!groupSelected && availableGridEnemies.length > 0) { const chosenEnemy = availableGridEnemies[0]; attackGroup.push(chosenEnemy); if (availableGridEnemies.length > 1 && !isForcedAttackScenario && Math.random() < 0.2) { const partnerLeft = availableGridEnemies.find(e => e.id !== chosenEnemy.id && e.gridRow === chosenEnemy.gridRow && e.gridCol === chosenEnemy.gridCol - 1); const partnerRight = availableGridEnemies.find(e => e.id !== chosenEnemy.id && e.gridRow === chosenEnemy.gridRow && e.gridCol === chosenEnemy.gridCol + 1); const potentialPartner = partnerLeft || partnerRight; if (potentialPartner) { const bothAreBosses = chosenEnemy.type === ENEMY3_TYPE && potentialPartner.type === ENEMY3_TYPE; if (!bothAreBosses) { attackGroup.push(potentialPartner); } } } groupSelected = true; }
        if (attackGroup.length > 0) { attackGroup = attackGroup.filter(e => e); if (attackGroup.length === 0) { return null; } attackGroup.forEach(enemy => { if (enemy) { enemy.justReturned = true; enemy.attackType = selectedAttackType; } }); const attackGroupIds = new Set(attackGroup.map(e => e.id)); resetJustReturnedFlags(attackGroupIds); return attackGroup; }
        return null;
    } catch (e) { console.error("Error in findAndDetachEnemy:", e); return null; }
}


/**
 * Start direct een capture dive als aan voorwaarden voldaan is.
 */
function triggerImmediateCaptureDive() {
    try {
        let canAttemptCapture = false;
        let targetPlayerShipForDive = null;

        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            const p1CanBeTargeted = ship1 && player1Lives > 1 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn;
            const p2CanBeTargeted = ship2 && player2Lives > 1 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn;

            // In CO-OP Demo, we staan een poging toe zolang `captureAttemptMadeThisLevel` false is,
            // zelfs als de vorige geselecteerde boss sneuvelde.
            // De vlag wordt pas true als een beam daadwerkelijk activeert.
            if ((p1CanBeTargeted || p2CanBeTargeted) && !captureAttemptMadeThisLevel) {
                canAttemptCapture = true;
                if (p1CanBeTargeted && p2CanBeTargeted) {
                    targetPlayerShipForDive = Math.random() < 0.5 ? ship1 : ship2;
                } else if (p1CanBeTargeted) {
                    targetPlayerShipForDive = ship1;
                } else if (p2CanBeTargeted) {
                    targetPlayerShipForDive = ship2;
                }
            }
        } else {
            if (playerLives > 1 && ship && !isShipCaptured && !isWaitingForRespawn && !captureAttemptMadeThisLevel) {
                canAttemptCapture = true;
                targetPlayerShipForDive = ship;
            }
        }

        if (isChallengingStage || !canAttemptCapture || !targetPlayerShipForDive) {
            return;
        }

        const potentialCapturingBosses = enemies.filter(e =>
            e && e.state === 'in_grid' && e.type === ENEMY3_TYPE && !e.hasCapturedShip && !e.isPreparingForImmediateCapture
        );

        if (potentialCapturingBosses.length > 0) {
            const chosenBoss = potentialCapturingBosses[Math.floor(Math.random() * potentialCapturingBosses.length)];
            const now = Date.now();

            // Markeer deze boss als geselecteerd, maar zet captureAttemptMadeThisLevel nog NIET.
            chosenBoss.isPreparingForImmediateCapture = true;

            chosenBoss.justReturned = true; // Voorkom dat hij direct weer aanvalt als dit mislukt
            const attackGroupIds = new Set([chosenBoss.id]);
            resetJustReturnedFlags(attackGroupIds);

            const diveTargetXPos = targetPlayerShipForDive.x + targetPlayerShipForDive.width / 2;
            const diveSide = (diveTargetXPos < gameCanvas.width / 2) ? 'right' : 'left';
            const targetX = diveSide === 'left'
                ? gameCanvas.width * CAPTURE_DIVE_SIDE_MARGIN_FACTOR
                : gameCanvas.width * (1 - CAPTURE_DIVE_SIDE_MARGIN_FACTOR) - BOSS_WIDTH;
            const targetY = gameCanvas.height * CAPTURE_DIVE_BOTTOM_HOVER_Y_FACTOR;

            chosenBoss.state = 'preparing_capture';
            chosenBoss.targetX = targetX;
            chosenBoss.targetY = targetY;
            chosenBoss.diveStartTime = now; // diveStartTime wordt gebruikt om de beam te timen in moveEntities
            playSound('bossGalagaDiveSound', false, 0.2);
            const leaderId = chosenBoss.id;

            chosenBoss.capturePrepareTimeout = setTimeout(() => {
                const currentEnemy = enemies.find(e => e?.id === leaderId);
                if (currentEnemy && currentEnemy.state === 'preparing_capture') {
                    currentEnemy.state = 'diving_to_capture_position';
                }
                if(currentEnemy) currentEnemy.capturePrepareTimeout = null;
                const timeoutIndex = enemySpawnTimeouts.findIndex(tId => tId === chosenBoss.capturePrepareTimeout); // Moet capturePrepareTimeout van de boss zijn
                if (timeoutIndex > -1) enemySpawnTimeouts.splice(timeoutIndex, 1);
            }, 300);
            enemySpawnTimeouts.push(chosenBoss.capturePrepareTimeout);
        }
    } catch (e) {
        console.error("Error in triggerImmediateCaptureDive:", e);
    }
}


/**
 * Resets justReturned flag for other grid enemies. (Nu met Set<string> of null)
 * <<< GEWIJZIGD: Parameter type aangepast in commentaar en logica >>>
 * @param {Set<string>|string|null} excludedIds - ID(s) to exclude. Set for multiple, string for single, null for none.
 */
function resetJustReturnedFlags(excludedIds) {
    enemies.forEach(e => {
        let exclude = false;
        if (excludedIds instanceof Set) {
            exclude = excludedIds.has(e.id);
        } else if (typeof excludedIds === 'string') {
            exclude = (e.id === excludedIds);
        }
        if (e && e.state === 'in_grid' && e.justReturned && !exclude) {
            e.justReturned = false;
        }
    });
}

// --- EINDE deel 6      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 7      van 8 dit code blok    ---

function updateFloatingScores() { if (isPaused) return; try { const now = Date.now(); floatingScores = floatingScores.filter(fs => (now - fs.creationTime < FLOATING_SCORE_DURATION + FLOATING_SCORE_APPEAR_DELAY)); } catch (e) { console.error("Error updating floating scores:", e); floatingScores = []; } }

/** Update de positie en alpha van alle actieve explosie deeltjes. */
function updateExplosions() { if (isPaused) return; try { const now = Date.now(); for (let i = explosions.length - 1; i >= 0; i--) { const explosion = explosions[i]; const elapsedTime = now - explosion.creationTime; if (elapsedTime > explosion.duration) { explosions.splice(i, 1); continue; } explosion.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.alpha = Math.max(0, 1.0 - (elapsedTime / explosion.duration) * EXPLOSION_FADE_SPEED); }); } } catch (e) { console.error("Error updating explosions:", e); explosions = []; } }


// --- Functie moveEntities: Update posities en states van alle entiteiten ---
function moveEntities(overrideP1Left = null, overrideP1Right = null) {
    if (isPaused) return;
    try {
        const now = Date.now();
        const shipBaseY  = gameCanvas ? gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN : 500;

        // --- Ship Movement (CO-OP, 1P, AI) ---
        // Keyboard/Gamepad beweging (als touch niet actief is voor beweging)
        if (gameCanvas && !isTouchActiveGame) { // Alleen keyboard/gamepad beweging als touch NIET actief is.
            if (isManualControl) {
                if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    // P1 (mens) beweging via keyboard/gamepad
                    if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) {
                        const p1EffectiveWidth = ship1.width + (player1IsDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                        if (leftPressed) ship1.x -= ship1.speed;
                        if (rightPressed) ship1.x += ship1.speed;
                        ship1.x = Math.max(0, Math.min(gameCanvas.width - p1EffectiveWidth, ship1.x));
                        ship1.targetX = ship1.x;
                    }
                    // P2 (mens) beweging via keyboard/gamepad (als geen AI)
                    if (!isPlayerTwoAI && ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture) {
                        const p2EffectiveWidth = ship2.width + (player2IsDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                        if (p2LeftPressed) ship2.x -= ship2.speed;
                        if (p2RightPressed) ship2.x += ship2.speed;
                        ship2.x = Math.max(0, Math.min(gameCanvas.width - p2EffectiveWidth, ship2.x));
                        ship2.targetX = ship2.x;
                    }
                } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                    if (ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
                        if (!isPlayerTwoAI || (isPlayerTwoAI && currentPlayer === 1) ) { // Alleen als P1 (mens) aan de beurt is in 1P vs AI
                            const effectiveWidth = ship.width + (isDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                            let useOverrideLeft = false; let useOverrideRight = false;
                            if (isManualControl && isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' && currentPlayer === 1 && isShowingIntro) {
                                if(overrideP1Left !== null) useOverrideLeft = overrideP1Left;
                                if(overrideP1Right !== null) useOverrideRight = overrideP1Right;
                            }

                            if (useOverrideLeft || leftPressed) ship.x -= ship.speed;
                            if (useOverrideRight || rightPressed) ship.x += ship.speed;
                            ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveWidth, ship.x));
                            ship.targetX = ship.x;
                        }
                    }
                }
            }
        }
        // Touch beweging wordt direct in handlePlayerInput afgehandeld door ship.x te zetten.

        // AI Control Movement (Demo modes & AI P2 in 1P vs AI Normal & AI in CO-OP modes)
        // Dit blijft nodig voor de AI-gestuurde schepen.
        if (!isManualControl ||
            (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) ||
            (isCoopAIDemoActive) ||
            (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') ) {

            if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                // AI P1 in COOP AI Demo
                if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) {
                    const moveDifference1 = ship1.targetX - ship1.x;
                    let effectiveShipSpeed1 = ship1.speed * AI_POSITION_MOVE_SPEED_FACTOR;
                    if (Math.abs(moveDifference1) > AI_MOVEMENT_DEADZONE) ship1.x += Math.sign(moveDifference1) * Math.min(Math.abs(moveDifference1), effectiveShipSpeed1);
                    const aiEffectiveWidth1 = ship1.width + (player1IsDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                    ship1.x = Math.max(0, Math.min(gameCanvas.width - aiEffectiveWidth1, ship1.x));
                }
                // AI P2 in COOP AI Demo OF 1P vs AI COOP
                if (ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture) {
                    const moveDifference2 = ship2.targetX - ship2.x;
                    let effectiveShipSpeed2 = ship2.speed * AI_POSITION_MOVE_SPEED_FACTOR;
                    if (Math.abs(moveDifference2) > AI_MOVEMENT_DEADZONE) ship2.x += Math.sign(moveDifference2) * Math.min(Math.abs(moveDifference2), effectiveShipSpeed2);
                    const aiEffectiveWidth2 = ship2.width + (player2IsDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                    ship2.x = Math.max(0, Math.min(gameCanvas.width - aiEffectiveWidth2, ship2.x));
                }
            } else if (ship) { // Standaard 1P AI Demo OF AI P2 in 1P vs AI Normal
                if (playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
                    const moveDifference = ship.targetX - ship.x;
                    let effectiveShipSpeed = ship.speed * AI_POSITION_MOVE_SPEED_FACTOR;
                    if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                        effectiveShipSpeed = ship.speed * (AI_POSITION_MOVE_SPEED_FACTOR * 1.15);
                    }

                    if (Math.abs(moveDifference) > AI_MOVEMENT_DEADZONE) {
                        ship.x += Math.sign(moveDifference) * Math.min(Math.abs(moveDifference), effectiveShipSpeed);
                    }
                    const aiEffectiveWidth = ship.width + (isDualShipActive ? DUAL_SHIP_OFFSET_X : 0);
                    ship.x = Math.max(0, Math.min(gameCanvas.width - aiEffectiveWidth, ship.x));
                }
            }
        }


        // --- Respawn Timers & Invincibility End Checks ---
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            if (isPlayer1WaitingForRespawn && now >= player1RespawnTime) isPlayer1WaitingForRespawn = false;
            if (isPlayer1Invincible && now >= player1InvincibilityEndTime) isPlayer1Invincible = false;
            if (isPlayer2WaitingForRespawn && now >= player2RespawnTime) isPlayer2WaitingForRespawn = false;
            if (isPlayer2Invincible && now >= player2InvincibilityEndTime) isPlayer2Invincible = false;
        } else { // Geldt voor 1P classic, 1P_VS_AI_NORMAL, 2P_NORMAL
            if (isWaitingForRespawn && now >= respawnTime) isWaitingForRespawn = false;
            if (isInvincible && now >= invincibilityEndTime) isInvincible = false;
        }

        // Move Player Bullets & Collision with Enemies
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i]; if (!b) { bullets.splice(i, 1); continue; }
            b.y -= b.speed; if (b.y + PLAYER_BULLET_HEIGHT < 0) { bullets.splice(i, 1); continue; }
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j]; if (!enemy) { enemies.splice(j,1); continue; }
                const enemyRect = { x: enemy.x, y: enemy.y, width: (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH), height: (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT) };
                const bulletRect = { x: b.x, y: b.y, width: b.width, height: b.height };
                if (checkCollision(bulletRect, enemyRect)) { bullets.splice(i, 1); const hitResult = handleEnemyHit(enemy, b.playerId); if (hitResult.destroyed) enemies.splice(j, 1); break; }
            }
        }

        // Move Enemy Bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) { const eb = enemyBullets[i]; if (!eb) { enemyBullets.splice(i, 1); continue; } eb.x += eb.vx; eb.y += eb.vy; if (eb.y > gameCanvas.height || eb.y < -ENEMY_BULLET_HEIGHT || eb.x < -ENEMY_BULLET_WIDTH || eb.x > gameCanvas.width) { enemyBullets.splice(i, 1); } }

        // Move Falling Ships
        const TARGET_FALLING_SHIP_Y = gameCanvas ? gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN : 500;
        const MAX_FALLING_SHIP_ROTATIONS = 2;
        for (let i = fallingShips.length - 1; i >= 0; i--) {
            const fs = fallingShips[i]; if (!fs) { fallingShips.splice(i,1); continue; }
            let dockedThisFrame = false;
            if (!fs.landed) {
                fs.y += FALLING_SHIP_SPEED;
                if (fs.y >= TARGET_FALLING_SHIP_Y) {
                    fs.y = TARGET_FALLING_SHIP_Y; fs.landed = true; fs.landedTime = now;
                    if (!fs.rotationCompleted) { fs.rotation = 0; fs.rotationCompleted = true; }

                    let rescuingPlayerShipObject = null;
                    let setDualShipForRescuer = () => {};
                    let rescuerAlreadyDual = false;
                    let playerShipIsCurrentlyCaptured = false;
                    let rescuerIsActiveAndExists = false;
                    let rescuerPlayerId = null;

                    if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) { // <<<< GEWIJZIGD
                        if (fs.targetPlayerId === 'player1' && ship1 && player1Lives > 0) {
                            rescuingPlayerShipObject = ship1;
                            rescuerAlreadyDual = player1IsDualShipActive;
                            setDualShipForRescuer = () => { player1IsDualShipActive = true; };
                            rescuerIsActiveAndExists = true;
                            rescuerPlayerId = 'player1';
                        } else if ((fs.targetPlayerId === 'player2' || fs.targetPlayerId === 'ai_p2') && ship2 && player2Lives > 0) { // <<<< GEWIJZIGD
                            rescuingPlayerShipObject = ship2;
                            rescuerAlreadyDual = player2IsDualShipActive;
                            setDualShipForRescuer = () => { player2IsDualShipActive = true; };
                            rescuerIsActiveAndExists = true;
                            rescuerPlayerId = (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') ? 'ai_p2' : 'player2'; // <<<< GEWIJZIGD
                        }
                    } else { // Human COOP (niet 1P vs AI COOP)
                        if (isTwoPlayerMode && selectedGameMode === 'coop') {
                            if (fs.targetPlayerId === 'player1' && ship1 && player1Lives > 0 ) { rescuingPlayerShipObject = ship1; rescuerAlreadyDual = player1IsDualShipActive; playerShipIsCurrentlyCaptured = isPlayer1ShipCaptured; setDualShipForRescuer = () => { player1IsDualShipActive = true; isPlayer1ShipCaptured = false;}; rescuerIsActiveAndExists = true; rescuerPlayerId = 'player1';}
                            else if (fs.targetPlayerId === 'player2' && ship2 && player2Lives > 0 ) { rescuingPlayerShipObject = ship2; rescuerAlreadyDual = player2IsDualShipActive; playerShipIsCurrentlyCaptured = isPlayer2ShipCaptured; setDualShipForRescuer = () => { player2IsDualShipActive = true; isPlayer2ShipCaptured = false;}; rescuerIsActiveAndExists = true; rescuerPlayerId = 'player2';}
                        } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                            if (ship && playerLives > 0 ) {
                                rescuingPlayerShipObject = ship;
                                rescuerAlreadyDual = isDualShipActive;
                                playerShipIsCurrentlyCaptured = isShipCaptured;
                                setDualShipForRescuer = () => {
                                    isDualShipActive = true;
                                    if (isTwoPlayerMode && selectedGameMode === 'normal') {
                                        if (currentPlayer === 1) player1IsDualShipActive = true; else player2IsDualShipActive = true;
                                    } else if (!isTwoPlayerMode) player1IsDualShipActive = true;
                                    isShipCaptured = false;
                                };
                                rescuerIsActiveAndExists = true;
                                rescuerPlayerId = (isTwoPlayerMode && selectedGameMode === 'normal') ? String(currentPlayer) : 'player1';
                            }
                        }
                    }

                    if (rescuerIsActiveAndExists && !rescuerAlreadyDual) {
                        setDualShipForRescuer();
                        playSound('dualShipSound', false, 0.4);
                        if (playerShipIsCurrentlyCaptured && !(isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP'))) { // <<<< GEWIJZIGD
                            if (rescuerPlayerId === 'player1' && ship1) { isPlayer1Invincible = true; player1InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS; }
                            else if (rescuerPlayerId === 'player2' && ship2) { isPlayer2Invincible = true; player2InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS; }
                            else if (ship) { isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; }
                        }
                        fallingShips.splice(i, 1); dockedThisFrame = true; continue;
                    } else if (rescuerIsActiveAndExists && rescuerAlreadyDual) {
                        fallingShips.splice(i, 1); dockedThisFrame = true; continue;
                    } else {
                        fallingShips.splice(i, 1); dockedThisFrame = true; continue;
                    }
                }
            }
            if(dockedThisFrame) continue;
            const elapsedFadeTime = now - fs.creationTime; if (elapsedFadeTime < FALLING_SHIP_FADE_DURATION_MS) fs.tintProgress = Math.max(0, 1.0 - (elapsedFadeTime / FALLING_SHIP_FADE_DURATION_MS)); else fs.tintProgress = 0;
            if (fs.rotationCompleted) fs.rotation = 0; else if (!fs.landed && typeof fs.rotationDirection === 'number' && typeof FALLING_SHIP_ROTATION_SPEED === 'number' && FALLING_SHIP_ROTATION_SPEED > 0) { const rotationIncrement = FALLING_SHIP_ROTATION_SPEED * fs.rotationDirection; fs.rotation += rotationIncrement; fs.totalRotation += Math.abs(rotationIncrement); if (fs.totalRotation >= (MAX_FALLING_SHIP_ROTATIONS * 2 * Math.PI)) { fs.rotation = 0; fs.rotationCompleted = true; } else { if (fs.rotation > Math.PI * 2) fs.rotation -= Math.PI * 2; if (fs.rotation < 0) fs.rotation += Math.PI * 2; } } else fs.rotation = fs.rotation || 0;

            if (!fs.landed) {
                let targetShipForDocking = null, setDualShipFlagEarly = () => {}, playerNumForDocking = 0, playerShipCapturedStateForEarlyDock = false, isTargetShipDualAlready = false;
                 if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) { // <<<< GEWIJZIGD
                    if (fs.targetPlayerId === 'player1' && ship1 && player1Lives > 0) {
                        targetShipForDocking = ship1;
                        isTargetShipDualAlready = player1IsDualShipActive;
                        setDualShipFlagEarly = () => { if (!isTargetShipDualAlready) player1IsDualShipActive = true; };
                        playerNumForDocking = 1;
                    } else if ((fs.targetPlayerId === 'player2' || fs.targetPlayerId === 'ai_p2') && ship2 && player2Lives > 0) { // <<<< GEWIJZIGD
                        targetShipForDocking = ship2;
                        isTargetShipDualAlready = player2IsDualShipActive;
                        setDualShipFlagEarly = () => { if (!isTargetShipDualAlready) player2IsDualShipActive = true; };
                        playerNumForDocking = 2;
                    }
                } else if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    if (fs.targetPlayerId === 'player1' && ship1 && player1Lives > 0 ) {
                        targetShipForDocking = ship1;
                        playerShipCapturedStateForEarlyDock = isPlayer1ShipCaptured;
                        isTargetShipDualAlready = player1IsDualShipActive;
                        setDualShipFlagEarly = () => { if (!isTargetShipDualAlready) player1IsDualShipActive = true; isPlayer1ShipCaptured = false; };
                        playerNumForDocking = 1;
                    } else if (fs.targetPlayerId === 'player2' && ship2 && player2Lives > 0 ) {
                        targetShipForDocking = ship2;
                        playerShipCapturedStateForEarlyDock = isPlayer2ShipCaptured;
                        isTargetShipDualAlready = player2IsDualShipActive;
                        setDualShipFlagEarly = () => { if (!isTargetShipDualAlready) player2IsDualShipActive = true; isPlayer2ShipCaptured = false; };
                        playerNumForDocking = 2;
                    }
                } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                    if (ship && playerLives > 0 ) {
                        targetShipForDocking = ship;
                        playerShipCapturedStateForEarlyDock = isShipCaptured;
                        isTargetShipDualAlready = isDualShipActive;
                        setDualShipFlagEarly = () => {
                            if (!isTargetShipDualAlready) {
                                isDualShipActive = true;
                                if (isTwoPlayerMode && selectedGameMode === 'normal') {
                                    if (currentPlayer === 1) player1IsDualShipActive = true; else player2IsDualShipActive = true;
                                } else if (!isTwoPlayerMode) player1IsDualShipActive = true;
                            }
                            isShipCaptured = false;
                        };
                        playerNumForDocking = (isTwoPlayerMode && selectedGameMode === 'normal') ? currentPlayer : 1;
                    }
                }
                if (targetShipForDocking && !isTargetShipDualAlready) {
                    const fallingShipRect = { x: fs.x, y: fs.y, width: fs.width, height: fs.height };
                    const playerShipRect = { x: targetShipForDocking.x, y: targetShipForDocking.y, width: targetShipForDocking.width, height: targetShipForDocking.height };
                    if (checkCollision(fallingShipRect, playerShipRect)) {
                        setDualShipFlagEarly();
                        if (playerShipCapturedStateForEarlyDock && !(isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP'))) { // <<<< GEWIJZIGD
                            playSound('dualShipSound', false, 0.4);
                            if (playerNumForDocking === 1 && ship1) { isPlayer1Invincible = true; player1InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS ; }
                            else if (playerNumForDocking === 2 && ship2) { isPlayer2Invincible = true; player2InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS; }
                            else if (playerNumForDocking !== 0 && ship) { isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; }
                        } else {
                            playSound('dualShipSound', false, 0.4);
                        }
                        fallingShips.splice(i, 1); continue;
                    }
                }
            }
            if (!fs.landed && fs.y >= gameCanvas.height) fallingShips.splice(i, 1);
        }

        // Grid Movement
        let gridHorizontalShift = 0; const gridEnemiesPresent = enemies.some(e => e?.state === 'in_grid'); const gridShouldBeMoving = !isChallengingStage && !isWaveTransitioning && gridEnemiesPresent && !isShowingPlayerGameOverMessage && !(isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage)); if (gridShouldBeMoving) { if (!isGridSoundPlaying) { isGridSoundPlaying = true; playSound('gridBackgroundSound', true, 0.1); } const gridEnemiesList = enemies.filter(e => e?.state === 'in_grid'); if (gridEnemiesList.length > 0) { let minX = gameCanvas.width, maxX = 0; gridEnemiesList.forEach(enemy => { if (enemy) { minX = Math.min(minX, enemy.x); maxX = Math.max(maxX, enemy.x + enemy.width); } }); const leftBoundary = gameCanvas.width * GRID_HORIZONTAL_MARGIN_PERCENT; const rightBoundary = gameCanvas.width * (1 - GRID_HORIZONTAL_MARGIN_PERCENT); if (gridMoveDirection === 1 && maxX >= rightBoundary) gridMoveDirection = -1; else if (gridMoveDirection === -1 && minX <= leftBoundary) gridMoveDirection = 1; const effectiveGridMoveSpeed = scaleValue(level, BASE_GRID_MOVE_SPEED, MAX_GRID_MOVE_SPEED); gridHorizontalShift = effectiveGridMoveSpeed * gridMoveDirection; currentGridOffsetX += gridHorizontalShift; enemies.forEach(e => { if (e && (e.state === 'returning' || e.state === 'in_grid' || e.state === 'moving_to_grid')) { try { const enemyWidthForGrid = (e.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((e.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: newTargetX, y: newTargetY } = getCurrentGridSlotPosition(e.gridRow, e.gridCol, enemyWidthForGrid); e.targetGridX = newTargetX; e.targetGridY = newTargetY; } catch (gridPosError) { console.error(`Error updating target grid pos for enemy ${e?.id} (state: ${e?.state}) during shift:`, gridPosError); } } }); } } else { if (isGridSoundPlaying) { stopSound('gridBackgroundSound'); isGridSoundPlaying = false; } gridHorizontalShift = 0; }

        // Enemy State Machine and Movement
        for (let i = enemies.length - 1; i >= 0; i--) {
             let enemy = enemies[i]; if (!enemy) { enemies.splice(i,1); continue; }
             const enemyId = enemy.id;
             if (enemy.capturePrepareTimeout && enemy.state !== 'preparing_capture') { clearTimeout(enemy.capturePrepareTimeout); const timeoutIndex = enemySpawnTimeouts.indexOf(enemy.capturePrepareTimeout); if (timeoutIndex > -1) enemySpawnTimeouts.splice(timeoutIndex, 1); enemy.capturePrepareTimeout = null; }
             const currentEnemyWidthCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
             const currentEnemyHeightCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);

             switch (enemy.state) {
                 case 'following_bezier_path': { let pathSpeedFactor = CS_ENTRANCE_PATH_SPEED; const speedMultiplier = enemy.pathSpeedMultiplier || 1.0; pathSpeedFactor *= speedMultiplier; if (!isChallengingStage) { enemies.splice(i, 1); enemy = null; break; } let pathSource = challengingStagePaths; let pathSegments = pathSource[enemy.entrancePathId]; if (!pathSegments || enemy.pathSegmentIndex >= pathSegments.length) { enemies.splice(i, 1); enemy = null; break; } const segmentCS = pathSegments[enemy.pathSegmentIndex]; if (!segmentCS || !segmentCS.p0 || !segmentCS.p1 || !segmentCS.p2 || !segmentCS.p3) { console.error(`Invalid CS Bezier segment ${enemy.pathSegmentIndex} for path ${enemy.entrancePathId}. Enemy ${enemy.id}`); enemies.splice(i, 1); enemy = null; break; } enemy.pathT += pathSpeedFactor; let newX_CS, newY_CS; let oldX_CS = enemy.x, oldY_CS = enemy.y; if (enemy.pathT >= 1.0) { enemy.pathT = 0; enemy.pathSegmentIndex++; if (enemy.pathSegmentIndex >= pathSegments.length) { enemies.splice(i, 1); enemy = null; } else { const nextSegmentCS = pathSegments[enemy.pathSegmentIndex]; if (nextSegmentCS?.p0) { newX_CS = nextSegmentCS.p0.x; newY_CS = nextSegmentCS.p0.y; } else { console.error(`Invalid next CS Bezier segment ${enemy.pathSegmentIndex} for path ${enemy.entrancePathId}. Enemy ${enemyId}`); enemies.splice(i, 1); enemy = null; } } } else { try { newX_CS = calculateBezierPoint(enemy.pathT, segmentCS.p0.x, segmentCS.p1.x, segmentCS.p2.x, segmentCS.p3.x); newY_CS = calculateBezierPoint(enemy.pathT, segmentCS.p0.y, segmentCS.p1.y, segmentCS.p2.y, segmentCS.p3.y); } catch (bezierError) { console.error(`Error calculating CS Bezier point for enemy ${enemyId}:`, bezierError); enemies.splice(i, 1); enemy = null; } } if (enemy) { if (isNaN(newX_CS) || isNaN(newY_CS)) { console.error(`NaN detected in CS path calculation for enemy ${enemyId}. Removing.`); enemies.splice(i, 1); enemy = null; } else { enemy.velocityX = newX_CS - oldX_CS; enemy.velocityY = newY_CS - oldY_CS; enemy.x = newX_CS; enemy.y = newY_CS; } } break; }
                 case 'following_entrance_path': { if (isChallengingStage) { enemies.splice(i, 1); enemy = null; break; } let pathSource = normalWaveEntrancePaths; let pathSegments = pathSource[enemy.entrancePathId]; let pathSpeedFactor; if (enemy.entrancePathId === 'boss_loop_left' || enemy.entrancePathId === 'boss_loop_right') { pathSpeedFactor = BOSS_LOOP_ENTRANCE_PATH_SPEED; } else { pathSpeedFactor = NORMAL_ENTRANCE_PATH_SPEED; } if (!pathSegments) { console.warn(`Enemy ${enemyId} missing SHARED path ${enemy.entrancePathId}. Switching to moving_to_grid.`); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting grid pos for ${enemyId} after missing path`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } if (enemy.pathSegmentIndex >= pathSegments.length) { console.warn(`Enemy ${enemyId} path index ${enemy.pathSegmentIndex} out of bounds for SHARED path ${enemy.entrancePathId}. Switching to moving_to_grid.`); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting grid pos for ${enemyId} after invalid path index`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } const segmentNorm = pathSegments[enemy.pathSegmentIndex]; if (!segmentNorm || !segmentNorm.p0 || !segmentNorm.p1 || !segmentNorm.p2 || !segmentNorm.p3) { console.error(`Invalid Normal Bezier segment ${enemy.pathSegmentIndex} for SHARED path ${enemy.entrancePathId}. Enemy ${enemyId}. Switching to moving_to_grid.`); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN + enemy.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); } catch(err){ console.error(`Error getting grid pos for ${enemyId} after bad segment`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } enemy.pathT += pathSpeedFactor; let newX_Norm, newY_Norm; let oldX_Norm = enemy.x, oldY_Norm = enemy.y; if (enemy.pathT >= 1.0) { enemy.pathT = 0; enemy.pathSegmentIndex++; if (enemy.pathSegmentIndex >= pathSegments.length) { let finalPathX, finalPathY; try { finalPathX = calculateBezierPoint(1.0, segmentNorm.p0.x, segmentNorm.p1.x, segmentNorm.p2.x, segmentNorm.p3.x); finalPathY = calculateBezierPoint(1.0, segmentNorm.p0.y, segmentNorm.p1.y, segmentNorm.p2.y, segmentNorm.p3.y); } catch(err) { console.error(`Error calculating final bezier point for ${enemyId} at end of normal path ${enemy.entrancePathId}`, err); finalPathX = segmentNorm.p3.x; finalPathY = segmentNorm.p3.y; } enemy.x = finalPathX; enemy.y = finalPathY; try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting target grid pos for ${enemyId} at end of normal path ${enemy.entrancePathId}`, err); enemy.targetGridX = enemy.x; enemy.targetGridY = ENEMY_TOP_MARGIN + enemy.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); } const previousState = enemy.state; enemy.state = 'moving_to_grid'; enemy.velocityX = 0; enemy.velocityY = 0; enemy.pathSegmentIndex = 0; if (previousState === 'following_entrance_path' && enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } else { const nextSegmentNorm = pathSegments[enemy.pathSegmentIndex]; if (nextSegmentNorm?.p0) { newX_Norm = nextSegmentNorm.p0.x; newY_Norm = nextSegmentNorm.p0.y; } else { console.error(`Invalid next Normal Bezier segment ${enemy.pathSegmentIndex} for SHARED path ${enemy.entrancePathId}. Enemy ${enemyId}. Switching to moving_to_grid.`); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting grid pos for ${enemyId} after bad next segment`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } } } else { try { newX_Norm = calculateBezierPoint(enemy.pathT, segmentNorm.p0.x, segmentNorm.p1.x, segmentNorm.p2.x, segmentNorm.p3.x); newY_Norm = calculateBezierPoint(enemy.pathT, segmentNorm.p0.y, segmentNorm.p1.y, segmentNorm.p2.y, segmentNorm.p3.y); } catch (bezierError) { console.error(`Error calculating Normal Bezier point for enemy ${enemyId}:`, bezierError); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting grid pos for ${enemyId} after bezier error`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } break; } } if (enemy && enemy.state === 'following_entrance_path') { if (isNaN(newX_Norm) || isNaN(newY_Norm)) { console.error(`NaN detected in Normal path calculation for enemy ${enemyId}. Switching to moving_to_grid.`); try { enemy.targetGridX = enemy.targetGridX ?? (gameCanvas.width/2); enemy.targetGridY = enemy.targetGridY ?? ENEMY_TOP_MARGIN; } catch(err){ console.error(`Error getting grid pos for ${enemyId} after NaN`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } enemy.state = 'moving_to_grid'; enemy.pathT = 0; enemy.pathSegmentIndex = 0; enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.squadronId !== undefined && squadronCompletionStatus[enemy.squadronId]) { squadronCompletionStatus[enemy.squadronId].completed++; } } else { let finalX = newX_Norm; const isPattern1LoopSquadron = currentWavePatternIndex === 1 && (enemy.squadronId === 2 || enemy.squadronId === 3); const isSecondInPair = typeof enemy.squadronEnemyIndex === 'number' && enemy.squadronEnemyIndex % 2 !== 0; if (isPattern1LoopSquadron && isSecondInPair) { const pairOffset = currentEnemyWidthCorrected + ENTRANCE_PAIR_HORIZONTAL_GAP; finalX = newX_Norm + pairOffset; } enemy.velocityX = finalX - oldX_Norm; enemy.velocityY = newY_Norm - oldY_Norm; enemy.x = finalX; enemy.y = newY_Norm; } } break; }
                 case 'moving_to_grid': { if (enemy.targetGridX == null || enemy.targetGridY == null) { console.warn(`Enemy ${enemyId} in moving_to_grid state without target. Recalculating.`); try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = finalTargetX; enemy.targetGridY = finalTargetY; } catch(err){ console.error(`Error getting grid pos for ${enemyId} in moving_to_grid`, err); enemy.state = 'in_grid'; enemy.x = gameCanvas.width/2; enemy.y = ENEMY_TOP_MARGIN; break;} } const moveTargetX = enemy.targetGridX; const moveTargetY = enemy.targetGridY; const dxMove = moveTargetX - enemy.x; const dyMove = moveTargetY - enemy.y; const distMove = Math.sqrt(dxMove * dxMove + dyMove * dyMove); const moveSpeed = ENTRANCE_SPEED * 1.2; const arrivalThreshold = moveSpeed * 0.5; if (distMove > arrivalThreshold) { enemy.velocityX = (dxMove / distMove) * moveSpeed; enemy.velocityY = (dyMove / distMove) * moveSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = moveTargetX; enemy.y = moveTargetY; enemy.velocityX = 0; enemy.velocityY = 0; const previousState = enemy.state; enemy.state = 'in_grid'; enemy.justReturned = false; if (!isGridSoundPlaying && !isChallengingStage) { isGridSoundPlaying = true; playSound('gridBackgroundSound', true, 0.1); } if (GRID_BREATH_ENABLED && !isGridBreathingActive && !isChallengingStage) { isGridBreathingActive = true; gridBreathStartTime = now; currentGridBreathFactor = 0; } if (!firstEnemyLanded && !isFullGridWave && !isChallengingStage) { lastGridFireCheckTime = Date.now(); firstEnemyLanded = true; } if (previousState === 'moving_to_grid' && !isChallengingStage && !isFullGridWave && enemy.squadronId !== undefined) { const squadId = enemy.squadronId; const squadStatus = squadronCompletionStatus[squadId]; if (squadStatus && !squadStatus.hasFiredPostLanding) { const allLanded = enemies.every(e => { if (e && e.squadronId === squadId) { return e.state === 'in_grid' || !enemies.some(aliveE => aliveE.id === e.id); } return true; }); if (allLanded) { squadStatus.hasFiredPostLanding = true; const eligibleShooters = enemies.filter(e => e && e.squadronId === squadId && e.state === 'in_grid' && (e.type === ENEMY2_TYPE || e.type === ENEMY3_TYPE) && !(e.type === ENEMY3_TYPE && e.hasCapturedShip)); if (eligibleShooters.length > 0) { const shooter = eligibleShooters[Math.floor(Math.random() * eligibleShooters.length)]; const shooterId = shooter.id; const fireDelay = 200 + Math.random() * 400; const postLandingFireTimeout = setTimeout(() => { try { const tIdx = enemySpawnTimeouts.indexOf(postLandingFireTimeout); if(tIdx > -1) enemySpawnTimeouts.splice(tIdx, 1); if (isPaused || !isInGameState || (playerLives <= 0 && (!isTwoPlayerMode || (player1Lives <=0 && player2Lives <=0) )) || isChallengingStage || isWaveTransitioning || isShipCaptured) return; const currentShooter = enemies.find(e => e && e.id === shooterId); if (currentShooter && currentShooter.state === 'in_grid') { if (createBulletSimple(currentShooter)) { playSound('enemyShootSound', false, 0.4); currentShooter.lastFiredTime = Date.now(); } } } catch (fireError) { console.error(`Error during post-landing fire for ${shooterId}:`, fireError); } }, fireDelay); enemySpawnTimeouts.push(postLandingFireTimeout); } } } } } break; }
                 case 'in_grid': { try { const enemyWidthForGrid = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: currentTargetX, y: currentTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, enemyWidthForGrid); if (typeof currentTargetX === 'number' && !isNaN(currentTargetX)) { enemy.x = currentTargetX; } if (typeof currentTargetY === 'number' && !isNaN(currentTargetY)) { enemy.y = currentTargetY; } enemy.targetGridX = currentTargetX; enemy.targetGridY = currentTargetY; } catch(gridPosError) { console.error(`Error getting grid pos within 'in_grid' for ${enemy.id}:`, gridPosError); } enemy.velocityX = gridShouldBeMoving ? gridHorizontalShift : 0; enemy.velocityY = 0; if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip && enemy.capturedShipDimensions) { enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; enemy.capturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; } break; }
                 case 'preparing_attack': { enemy.velocityX = 0; enemy.velocityY = 0; break; }
                 case 'preparing_capture': { enemy.velocityX = 0; enemy.velocityY = 0; break; }
                 case 'diving_to_capture_position': { let aShipIsAlreadyCaptured = (isTwoPlayerMode && selectedGameMode === 'coop') ? (isPlayer1ShipCaptured || isPlayer2ShipCaptured) : isShipCaptured; if (aShipIsAlreadyCaptured) { enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (e) { console.error(`Error getting grid pos for returning boss ${enemy.id}:`, e); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const targetXCapture = enemy.targetX; const targetYCapture = enemy.targetY; if (targetXCapture == null || targetYCapture == null) { console.error(`Boss ${enemy.id} diving to capture without targetX/Y! Aborting.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (e) { console.error(`Error getting grid pos for returning boss ${enemy.id}:`, e); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const dxCaptureDive = targetXCapture - enemy.x; const dyCaptureDive = targetYCapture - enemy.y; const distCaptureDive = Math.sqrt(dxCaptureDive * dxCaptureDive + dyCaptureDive * dyCaptureDive); const captureDiveSpeed = BOSS_CAPTURE_DIVE_SPEED_FACTOR * BASE_ENEMY_ATTACK_SPEED; const arrivalThresholdCapture = captureDiveSpeed * 0.6; if (distCaptureDive > arrivalThresholdCapture) { enemy.velocityX = (dxCaptureDive / distCaptureDive) * captureDiveSpeed; enemy.velocityY = (dyCaptureDive / distCaptureDive) * captureDiveSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = targetXCapture; enemy.y = targetYCapture; enemy.velocityX = 0; enemy.velocityY = 0; enemy.state = 'capturing'; enemy.captureStartTime = now; capturingBossId = enemy.id; captureBeamActive = true; captureBeamSource = { x: enemy.x + currentEnemyWidthCorrected / 2, y: enemy.y + currentEnemyHeightCorrected }; captureBeamTargetY = enemy.y; captureBeamProgress = 0; playSound('captureSound', false, 0.6); if (enemy.isPreparingForImmediateCapture) { captureAttemptMadeThisLevel = true; delete enemy.isPreparingForImmediateCapture; } } break; }
                 case 'capturing': {
                    enemy.velocityX = 0; enemy.velocityY = 0;
                    if (enemy.isPreparingForImmediateCapture && !captureAttemptMadeThisLevel) {
                        captureAttemptMadeThisLevel = true;
                        delete enemy.isPreparingForImmediateCapture;
                    }

                    let alreadyCapturedByThisBoss = false;
                    if (isTwoPlayerMode && selectedGameMode === 'coop') { alreadyCapturedByThisBoss = (isPlayer1ShipCaptured && capturedBossIdWithMessage === enemy.id) || (isPlayer2ShipCaptured && capturedBossIdWithMessage === enemy.id);
                    } else { alreadyCapturedByThisBoss = isShipCaptured && capturedBossIdWithMessage === enemy.id; }
                    if (alreadyCapturedByThisBoss) { captureBeamActive = false; if(capturingBossId === enemy.id) capturingBossId = null; enemy.state = 'returning'; stopSound('captureSound'); break; }
                    const elapsedCaptureTime = now - enemy.captureStartTime; const halfAnimationTime = CAPTURE_BEAM_ANIMATION_DURATION_MS / 2; const totalBeamStayTime = CAPTURE_BEAM_DURATION_MS; if (elapsedCaptureTime < halfAnimationTime) { captureBeamProgress = elapsedCaptureTime / halfAnimationTime; } else if (elapsedCaptureTime < totalBeamStayTime - halfAnimationTime) { captureBeamProgress = 1.0; } else if (elapsedCaptureTime < totalBeamStayTime) { captureBeamProgress = 1.0 - ((elapsedCaptureTime - (totalBeamStayTime - halfAnimationTime)) / halfAnimationTime); } else { captureBeamProgress = 0; captureBeamActive = false; capturingBossId = null; stopSound('captureSound'); enemy.state = 'attacking'; enemy.attackPathSegments = generateAttackPathInternal(enemy); enemy.attackPathSegmentIndex = 0; enemy.attackPathT = 0; enemy.speed = BASE_ENEMY_ATTACK_SPEED * ENEMY3_ATTACK_SPEED_FACTOR; enemy.lastFiredTime = 0; enemy.canFireThisDive = true; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; break; } captureBeamProgress = Math.max(0, Math.min(1, captureBeamProgress));
                    if (captureBeamActive && captureBeamProgress >= 0.95) {
                        const beamTopWidth = BOSS_WIDTH * CAPTURE_BEAM_WIDTH_TOP_FACTOR; const beamBottomWidth = SHIP_WIDTH * CAPTURE_BEAM_WIDTH_BOTTOM_FACTOR; const beamCenterX = enemy.x + currentEnemyWidthCorrected / 2; const beamVisualTopY = enemy.y + currentEnemyHeightCorrected; const beamVisualBottomY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE - 10; const boxWidth = Math.max(beamTopWidth, beamBottomWidth); const boxX = beamCenterX - boxWidth / 2; const boxY = beamVisualTopY; const boxHeight = beamVisualBottomY - beamVisualTopY;
                        if (boxHeight > 0) { const beamBoundingBox = { x: boxX, y: boxY, width: boxWidth, height: boxHeight }; let shipHitObject = null; let playerHitId = 0;
                            if (isTwoPlayerMode && selectedGameMode === 'coop') { if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && checkCollision(ship1, beamBoundingBox)) { shipHitObject = ship1; playerHitId = 1; } else if (ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && checkCollision(ship2, beamBoundingBox)) { shipHitObject = ship2; playerHitId = 2; }
                            } else { if (ship && playerLives > 0 && !isShipCaptured && checkCollision(ship, beamBoundingBox)) { shipHitObject = ship; playerHitId = currentPlayer; } }
                            if (shipHitObject) { enemy.capturedShipDimensions = { width: shipHitObject.width, height: shipHitObject.height }; enemy.hasCapturedShip = true; stopSound('captureSound'); enemy.state = 'showing_capture_message'; enemy.targetGridX = null; enemy.targetGridY = null; enemy.initialCaptureAnimationY = shipHitObject.y; enemy.captureAnimationRotation = 0; isShowingCaptureMessage = true; captureMessageStartTime = now; capturedBossIdWithMessage = enemy.id; playSound('shipCapturedSound', false, 0.3); csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null; handlePlayerShipCollision(playerHitId, false, now, true); if((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && aiPlayerActivelySeekingCaptureById) aiPlayerActivelySeekingCaptureById = null; break; } // <<<< GEWIJZIGD
                        }
                    } break;
                 }
                 case 'showing_capture_message': { enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.hasCapturedShip && enemy.capturedShipDimensions && typeof enemy.initialCaptureAnimationY === 'number') { const elapsedMessageTime = now - captureMessageStartTime; const animationProgress = Math.min(1.0, elapsedMessageTime / CAPTURE_MESSAGE_DURATION); const finalCapturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; const startY = enemy.initialCaptureAnimationY; enemy.capturedShipY = startY + (finalCapturedShipY - startY) * animationProgress; enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; } else { enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; enemy.capturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; } break; }
                 case 'attacking': { if (isEntrancePhaseActive) break; const attackSegments = enemy.attackPathSegments; const attackPathSpeedFactor = 3.8; if (!attackSegments || attackSegments.length === 0) { console.error(`Enemy ${enemyId} attacking without path! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (no attack path):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } if (enemy.attackPathSegmentIndex >= attackSegments.length) { console.warn(`Enemy ${enemyId} attacking, index ${enemy.attackPathSegmentIndex} out of bounds (${attackSegments.length})! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (invalid attack index):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const attackSegment = attackSegments[enemy.attackPathSegmentIndex]; if (!attackSegment || !attackSegment.p0 || !attackSegment.p1 || !attackSegment.p2 || !attackSegment.p3) { console.error(`Enemy ${enemyId} attacking, invalid segment ${enemy.attackPathSegmentIndex}! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (invalid attack segment):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const tIncrement = (enemy.speed / 1000) * attackPathSpeedFactor; enemy.attackPathT += tIncrement; let pathX, pathY; const oldFinalX = enemy.x; const oldFinalY = enemy.y; if (enemy.attackPathT >= 1.0) { try { pathX = calculateBezierPoint(1.0, attackSegment.p0.x, attackSegment.p1.x, attackSegment.p2.x, attackSegment.p3.x); pathY = calculateBezierPoint(1.0, attackSegment.p0.y, attackSegment.p1.y, attackSegment.p2.y, attackSegment.p3.y); } catch(bezierError) { console.error(`Error calculating FINAL bezier point for attack ${enemy.id}:`, bezierError); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after FINAL bezier error for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } enemy.attackPathT = 0; enemy.attackPathSegmentIndex++; if (enemy.attackPathSegmentIndex >= attackSegments.length) { enemy.state = 'returning'; enemy.lastFiredTime = 0; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos for returning enemy ${enemyId} after attack:`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } } else { const nextAttackSegment = attackSegments[enemy.attackPathSegmentIndex]; if (!nextAttackSegment?.p0) { console.error(`Enemy ${enemyId} attacking, invalid NEXT segment ${enemy.attackPathSegmentIndex}! Returning.`); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after invalid NEXT attack segment for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } } } else { try { pathX = calculateBezierPoint(enemy.attackPathT, attackSegment.p0.x, attackSegment.p1.x, attackSegment.p2.x, attackSegment.p3.x); pathY = calculateBezierPoint(enemy.attackPathT, attackSegment.p0.y, attackSegment.p1.y, attackSegment.p2.y, attackSegment.p3.y); } catch (bezierError) { console.error(`Error calculating bezier point during attack for ${enemy.id}:`, bezierError); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after bezier error for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } } if (enemy && enemy.state === 'attacking') { const formationOffset = enemy.attackFormationOffsetX || 0; const finalX = pathX + formationOffset; const finalY = pathY; enemy.velocityX = finalX - oldFinalX; enemy.velocityY = finalY - oldFinalY; enemy.x = finalX; enemy.y = finalY; if (enemy.y > gameCanvas.height + currentEnemyHeightCorrected * 1.5) { enemy.state = 'returning'; enemy.attackPathSegmentIndex = 0; enemy.attackPathT = 0; enemy.lastFiredTime = 0; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; enemy.y = -currentEnemyHeightCorrected * (1.1 + Math.random() * 0.4); enemy.x = Math.random() * (gameCanvas.width - currentEnemyWidthCorrected); enemy.velocityX = 0; enemy.velocityY = 0; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} off screen:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } } } break; }
                 case 'returning': { if (isEntrancePhaseActive) break; if (enemy.targetGridX == null || enemy.targetGridY == null) { console.warn(`Enemy ${enemyId} returning without target coords. Recalculating.`); try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = finalTargetX; enemy.targetGridY = finalTargetY; } catch(err){ console.error(`Error getting grid pos for ${enemyId} in returning`, err); enemy.state = 'in_grid'; enemy.x = gameCanvas.width/2; enemy.y = ENEMY_TOP_MARGIN; break; } } const targetReturnX = enemy.targetGridX; const targetReturnY = enemy.targetGridY; const dxReturn = targetReturnX - enemy.x; const dyReturn = targetReturnY - enemy.y; const distReturn = Math.sqrt(dxReturn * dxReturn + dyReturn * dyReturn); const scaledReturnSpeedFactor = scaleValue(level, BASE_RETURN_SPEED_FACTOR, MAX_RETURN_SPEED_FACTOR); const returnSpeed = BASE_RETURN_SPEED * scaledReturnSpeedFactor; const returnArrivalThreshold = returnSpeed * 0.5; if (distReturn > returnArrivalThreshold) { enemy.velocityX = (dxReturn / distReturn) * returnSpeed; enemy.velocityY = (dyReturn / distReturn) * returnSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = targetReturnX; enemy.y = targetReturnY; enemy.velocityX = 0; enemy.velocityY = 0; enemy.state = 'in_grid'; enemy.justReturned = true; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; if (enemy.hasOwnProperty('returnLogDone')) { delete enemy.returnLogDone; } if (!isGridSoundPlaying && !isChallengingStage) { isGridSoundPlaying = true; playSound('gridBackgroundSound', true, 0.1); } } break; }
             }

            // --- Enemy vs Player Ship Collision Detection ---
            if (enemy && !isShowingPlayerGameOverMessage && !(isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage)) && gameOverSequenceStartTime === 0) {
                const collisionStates = ['attacking', 'following_entrance_path', 'following_bezier_path', 'diving_to_capture_position'];
                if (collisionStates.includes(enemy.state)) {
                    let shipsToCollideWith = [];
                    if (isTwoPlayerMode && selectedGameMode === 'coop') {
                        if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1Invincible && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) shipsToCollideWith.push({shipObj: ship1, playerNum: 1, dual: player1IsDualShipActive});
                        if (ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2Invincible && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture) shipsToCollideWith.push({shipObj: ship2, playerNum: 2, dual: player2IsDualShipActive});
                    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                        if (ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && !isInvincible) {
                             shipsToCollideWith.push({shipObj: ship, playerNum: currentPlayer, dual: isDualShipActive});
                        }
                    }

                    for (const shipData of shipsToCollideWith) {
                        const currentShip = shipData.shipObj;
                        const enemyRectCollision = { x: enemy.x, y: enemy.y, width: currentEnemyWidthCorrected, height: currentEnemyHeightCorrected };
                        const mainShipRect = { x: currentShip.x, y: currentShip.y, width: currentShip.width, height: currentShip.height };
                        const dualShipPartRect = shipData.dual ? { x: currentShip.x + DUAL_SHIP_OFFSET_X, y: currentShip.y, width: currentShip.width, height: currentShip.height } : null;
                        let collided = false; let hitDual = false;

                        if (checkCollision(enemyRectCollision, mainShipRect)) collided = true;
                        else if (shipData.dual && dualShipPartRect && checkCollision(enemyRectCollision, dualShipPartRect)) { collided = true; hitDual = true; }

                        if (collided) {
                            createExplosion(enemy.x + currentEnemyWidthCorrected / 2, enemy.y + currentEnemyHeightCorrected / 2);
                            playSound('lostLifeSound', false, 0.6);
                            enemies.splice(i, 1); enemy = null;
                            handlePlayerShipCollision(shipData.playerNum, hitDual, now, false);
                            if (enemy === null) break;
                        }
                    }
                }
            }
            if (!enemy) continue;
        }


        // --- Enemy Bullet vs Player Ship Collision Detection ---
        if (!isShowingPlayerGameOverMessage && !(isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage)) && gameOverSequenceStartTime === 0) {
            let shipsToBulletHitCheck = [];
             if (isTwoPlayerMode && selectedGameMode === 'coop') {
                if (ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1Invincible && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) shipsToBulletHitCheck.push({shipObj: ship1, playerNum: 1, dual: player1IsDualShipActive});
                if (ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2Invincible && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture) shipsToBulletHitCheck.push({shipObj: ship2, playerNum: 2, dual: player2IsDualShipActive});
            } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                if (ship && playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && !isInvincible) {
                     shipsToBulletHitCheck.push({shipObj: ship, playerNum: currentPlayer, dual: isDualShipActive});
                }
            }

            for (let k = enemyBullets.length - 1; k >= 0; k--) {
                const eb = enemyBullets[k]; if (!eb) { enemyBullets.splice(k, 1); continue; }
                const bulletRect = { x: eb.x, y: eb.y, width: eb.width, height: eb.height };
                let bulletRemoved = false;

                for (const shipData of shipsToBulletHitCheck) {
                    const currentShip = shipData.shipObj;
                    const mainShipRect = { x: currentShip.x, y: currentShip.y, width: currentShip.width, height: currentShip.height };
                    const dualShipPartRect = shipData.dual ? { x: currentShip.x + DUAL_SHIP_OFFSET_X, y: currentShip.y, width: currentShip.width, height: currentShip.height } : null;
                    let collided = false; let hitDual = false;

                    if (checkCollision(bulletRect, mainShipRect)) collided = true;
                    else if (shipData.dual && dualShipPartRect && checkCollision(bulletRect, dualShipPartRect)) { collided = true; hitDual = true; }

                    if (collided) {
                        playSound('lostLifeSound', false, 0.6);
                        handlePlayerShipCollision(shipData.playerNum, hitDual, now, false);
                        enemyBullets.splice(k, 1); bulletRemoved = true;
                        break;
                    }
                }
                if (bulletRemoved) continue;
            }
        }
        updateHitSparks();

    } catch (e) { console.error("FATAL Error in moveEntities:", e, e.stack); isGridSoundPlaying = false; stopSound('gridBackgroundSound'); isEntrancePhaseActive = false; stopSound('entranceSound'); isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; isPlayer1ShowingGameOverMessage = false; player1GameOverMessageStartTime = 0; isPlayer2ShowingGameOverMessage = false; player2GameOverMessageStartTime = 0; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; stopSound('captureSound'); stopSound('shipCapturedSound'); isWaitingForRespawn = false; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isInvincible = false; invincibilityEndTime = 0; hitSparks = []; if(typeof showMenuState === 'function') showMenuState(); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; alert("Critical error during entity movement/collision. Returning to menu."); }
}


/**
 * Helper functie om de gevolgen van een botsing met een spelersschip af te handelen.
 * `wasCapturedHit` is true als de botsing het gevolg is van gevangenneming (beam, niet een fysieke botsing).
 */
function handlePlayerShipCollision(playerNumber, hitDualPart, collisionTime, wasCapturedHit = false) {
    const now = collisionTime;
    const shipBaseY  = gameCanvas ? gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN : 500;

    let lastKnownX = 0;
    let shipObjectToUpdate = null;

    if (isTwoPlayerMode && selectedGameMode === 'coop') {
        shipObjectToUpdate = (playerNumber === 1) ? ship1 : ship2;
        if (shipObjectToUpdate) {
            lastKnownX = shipObjectToUpdate.x;
            if (wasCapturedHit) {
                if (playerNumber === 1) player1CaptureRespawnX = shipObjectToUpdate.x;
                else if (playerNumber === 2) player2CaptureRespawnX = shipObjectToUpdate.x;
            }
        } else {
             if (playerNumber === 1 && typeof player1CaptureRespawnX === 'number' && player1CaptureRespawnX !== 0) lastKnownX = player1CaptureRespawnX;
             else if (playerNumber === 2 && typeof player2CaptureRespawnX === 'number' && player2CaptureRespawnX !== 0) lastKnownX = player2CaptureRespawnX;
             else if ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && gameCanvas) { // <<<< GEWIJZIGD
                 lastKnownX = playerNumber === 1 ? (gameCanvas.width / 2 - gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2)) : (gameCanvas.width / 2 + gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2));
             } else if (gameCanvas) {
                 lastKnownX = gameCanvas.width / 2 - SHIP_WIDTH / 2;
             } else {
                 lastKnownX = 200;
             }
        }
    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
        shipObjectToUpdate = ship;
        if (shipObjectToUpdate) {
            lastKnownX = shipObjectToUpdate.x;
             if (wasCapturedHit) {
                capturedShipRespawnX_NormalMode = ship.x;
             }
        } else if (wasCapturedHit && capturedShipRespawnX_NormalMode !== 0) {
            lastKnownX = capturedShipRespawnX_NormalMode;
        } else {
            lastKnownX = gameCanvas ? gameCanvas.width / 2 - SHIP_WIDTH / 2 : 200;
        }
    }

    if (isTwoPlayerMode && selectedGameMode === 'coop') {
        if (playerNumber === 1) {
            if (wasCapturedHit) {
                isPlayer1ShipCaptured = true;
                player1IsDualShipActive = false;
                player1Lives--;
                if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) coopPartner1CapturedTime = now; // <<<< GEWIJZIGD


                if (player1Lives <= 0) {
                    player1Lives = 0;
                    isPlayer1ShowingGameOverMessage = true;
                    player1GameOverMessageStartTime = now;
                    playSound('gameOverSound', false, 0.4);
                    ship1 = null;
                    player1NeedsRespawnAfterCapture = false;
                    if (aiPlayerActivelySeekingCaptureById === 'p1') aiPlayerActivelySeekingCaptureById = null;
                    if (capturedBossIdWithMessage && enemies.find(e => e.id === capturedBossIdWithMessage)) {
                        const boss = enemies.find(e => e.id === capturedBossIdWithMessage);
                        if (boss) { boss.hasCapturedShip = false; boss.capturedShipDimensions = null; }
                    }
                } else {
                    player1NeedsRespawnAfterCapture = true;
                    ship1 = null;
                }
            } else {
                if (player1IsDualShipActive && ship1) {
                    player1IsDualShipActive = false;
                    const explX = hitDualPart ? (ship1.x + DUAL_SHIP_OFFSET_X + ship1.width/2) : (ship1.x + ship1.width/2);
                    createExplosion(explX, ship1.y + ship1.height/2);
                    ship1.x = lastKnownX; ship1.y = shipBaseY; ship1.targetX = ship1.x;
                    isPlayer1Invincible = true; player1InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                    isPlayer1WaitingForRespawn = true; player1RespawnTime = now + RESPAWN_DELAY_MS;
                } else {
                    if (ship1) createExplosion(ship1.x + ship1.width/2, ship1.y + ship1.height/2);
                    player1Lives--;
                    if (player1Lives <= 0) {
                        player1Lives = 0;
                        isPlayer1ShowingGameOverMessage = true;
                        player1GameOverMessageStartTime = now;
                        playSound('gameOverSound', false, 0.4);
                        ship1 = null;
                        if (aiPlayerActivelySeekingCaptureById === 'p1') aiPlayerActivelySeekingCaptureById = null;
                    } else {
                        isPlayer1Invincible = true; player1InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isPlayer1WaitingForRespawn = true; player1RespawnTime = now + RESPAWN_DELAY_MS;
                        if (ship1) { ship1.x = lastKnownX; ship1.y = shipBaseY; ship1.targetX = ship1.x; }
                        else {
                            ship1 = { x: lastKnownX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: lastKnownX, id: 'p1' };
                        }
                    }
                }
            }
        } else if (playerNumber === 2) {
            if (wasCapturedHit) {
                isPlayer2ShipCaptured = true;
                player2IsDualShipActive = false;
                player2Lives--;
                if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) coopPartner2CapturedTime = now; // <<<< GEWIJZIGD


                if (player2Lives <= 0) {
                    player2Lives = 0;
                    isPlayer2ShowingGameOverMessage = true;
                    player2GameOverMessageStartTime = now;
                    playSound('gameOverSound', false, 0.4);
                    ship2 = null;
                    player2NeedsRespawnAfterCapture = false;
                    if (aiPlayerActivelySeekingCaptureById === 'p2' || aiPlayerActivelySeekingCaptureById === 'ai_p2') aiPlayerActivelySeekingCaptureById = null; // <<<< GEWIJZIGD
                    if (capturedBossIdWithMessage && enemies.find(e => e.id === capturedBossIdWithMessage)) {
                        const boss = enemies.find(e => e.id === capturedBossIdWithMessage);
                        if (boss) { boss.hasCapturedShip = false; boss.capturedShipDimensions = null; }
                    }
                } else {
                    player2NeedsRespawnAfterCapture = true;
                    ship2 = null;
                }
            } else {
                if (player2IsDualShipActive && ship2) {
                    player2IsDualShipActive = false;
                    const explX = hitDualPart ? (ship2.x + DUAL_SHIP_OFFSET_X + ship2.width/2) : (ship2.x + ship2.width/2);
                    createExplosion(explX, ship2.y + ship2.height/2);
                    ship2.x = lastKnownX; ship2.y = shipBaseY; ship2.targetX = ship2.x;
                    isPlayer2Invincible = true; player2InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                    isPlayer2WaitingForRespawn = true; player2RespawnTime = now + RESPAWN_DELAY_MS;
                } else {
                    if (ship2) createExplosion(ship2.x + ship2.width/2, ship2.y + ship2.height/2);
                    player2Lives--;
                    if (player2Lives <= 0) {
                        player2Lives = 0;
                        isPlayer2ShowingGameOverMessage = true;
                        player2GameOverMessageStartTime = now;
                        playSound('gameOverSound', false, 0.4);
                        ship2 = null;
                        if (aiPlayerActivelySeekingCaptureById === 'p2' || aiPlayerActivelySeekingCaptureById === 'ai_p2') aiPlayerActivelySeekingCaptureById = null; // <<<< GEWIJZIGD
                    } else {
                        isPlayer2Invincible = true; player2InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isPlayer2WaitingForRespawn = true; player2RespawnTime = now + RESPAWN_DELAY_MS;
                        if (ship2) { ship2.x = lastKnownX; ship2.y = shipBaseY; ship2.targetX = lastKnownX; }
                        else {
                            ship2 = { x: lastKnownX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: lastKnownX, id: 'p2' };
                        }
                    }
                }
            }
        }

        if (player1Lives <= 0 && player2Lives <= 0 && gameOverSequenceStartTime === 0) {
             triggerFinalGameOverSequence();
        }

    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL (Human)
        if (isDualShipActive && !wasCapturedHit && shipObjectToUpdate) {
            isDualShipActive = false;
            if (isTwoPlayerMode && selectedGameMode === 'normal') { // Geldt voor Human 2P Normal & 1P_VS_AI_NORMAL
                if (playerNumber === 1) player1IsDualShipActive = false;
                else if (playerNumber === 2) player2IsDualShipActive = false;
            } else if (!isTwoPlayerMode) player1IsDualShipActive = false; // 1P Classic

            const explX = hitDualPart ? (lastKnownX + DUAL_SHIP_OFFSET_X + SHIP_WIDTH/2) : (lastKnownX + SHIP_WIDTH/2);
            createExplosion(explX, shipBaseY + SHIP_HEIGHT/2);
            if (ship) {
                 ship.x = lastKnownX; ship.y = shipBaseY; ship.targetX = ship.x;
            }
            isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
            isWaitingForRespawn = true; respawnTime = now + RESPAWN_DELAY_MS;
            if (!isManualControl && !isPlayerTwoAI) aiNeedsStabilization = true; // Alleen voor pure 1P AI demo
            else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) aiNeedsStabilization = true; // AI P2 stabiliseren
        } else {
            if(!wasCapturedHit && shipObjectToUpdate) createExplosion(lastKnownX + SHIP_WIDTH/2, shipBaseY + SHIP_HEIGHT/2);

            if(wasCapturedHit) {
                isShipCaptured = true;
                if (ship) ship = null;
            }

            playerLives--;
            if (playerLives <= 0) {
                playerLives = 0;
                if (isTwoPlayerMode && selectedGameMode === 'normal') { // Geldt voor Human 2P Normal & 1P_VS_AI_NORMAL
                     if (playerNumber === 1) player1Lives = 0; else if (playerNumber === 2) player2Lives = 0;
                     isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerNumber;
                     playSound('gameOverSound', false, 0.4);
                     const nextP = (playerNumber === 1) ? 2 : 1;
                     const nextPLives = (nextP === 1) ? player1Lives : player2Lives;
                     if (nextPLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; }
                     else { nextActionAfterPlayerGameOver = 'show_results'; }
                     bullets = []; enemyBullets = []; explosions = [];
                     if (!(nextPLives > 0)) ship = null;
                } else { // 1P Classic
                    player1Lives = 0; ship = null;
                    playSound('gameOverSound', false, 0.4);
                    triggerFinalGameOverSequence();
                }
            } else { // Nog levens over
                if (isTwoPlayerMode && selectedGameMode === 'normal') { // Geldt voor Human 2P Normal & 1P_VS_AI_NORMAL
                    if (playerNumber === 1) player1Lives = playerLives; else player2Lives = playerLives;
                }

                if (!wasCapturedHit) {
                    isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                    isWaitingForRespawn = true; respawnTime = now + RESPAWN_DELAY_MS;
                    if (ship && gameCanvas) {
                        ship.x = lastKnownX; ship.y = shipBaseY; ship.targetX = ship.x;
                        if (!isManualControl && !isPlayerTwoAI) aiNeedsStabilization = true; // Alleen voor pure 1P AI demo
                        else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) aiNeedsStabilization = true; // AI P2 stabiliseren
                    }
                }
                if(wasCapturedHit) isDualShipActive = false;
            }
        }
    }
    if (!wasCapturedHit) fallingShips = [];
}


/**
 * Switches the current player in a 2-player game. (Vooral voor 'alternating' mode)
 */
function switchPlayerTurn() {
    if (!isTwoPlayerMode || selectedGameMode === 'coop') return false;
    stopSound('hiScoreSound');
    if (currentPlayer === 1) { player1Score = score; player1IsDualShipActive = isDualShipActive; if (player1Score > highScore) highScore = player1Score; }
    else { player2Score = score; player2IsDualShipActive = isDualShipActive; if (player2Score > highScore) highScore = player2Score; }
    const nextPlayer = (currentPlayer === 1) ? 2 : 1;
    const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives;
    if (nextPlayerLives <= 0) {
        const currentSpelersLives = (currentPlayer === 1) ? player1Lives : player2Lives;
        if (currentSpelersLives <= 0) { triggerFinalGameOverSequence(); return false; }
        else { forceCenterShipNextReset = false; return false; }
    }
    currentPlayer = nextPlayer;
    score = (currentPlayer === 1) ? player1Score : player2Score;
    playerLives = (currentPlayer === 1) ? player1Lives : player2Lives;
    isDualShipActive = (currentPlayer === 1) ? player1IsDualShipActive : player2IsDualShipActive;
    forceCenterShipNextReset = true;
    scoreEarnedThisCS = 0;
    csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
    normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null;
    leftPressed = false; rightPressed = false; shootPressed = false;
    p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
    keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
    keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
    p1JustFiredSingle = false; p2JustFiredSingle = false;
    p1FireInputWasDown = false; p2FireInputWasDown = false;
    isShipCaptured = false;
    isWaitingForRespawn = false; respawnTime = 0;
    isInvincible = false; invincibilityEndTime = 0;
    fallingShips = []; hitSparks = [];
    showExtraLifeMessage = false; extraLifeMessageStartTime = 0;
    return true;
}


/**
 * Triggers firing from grid enemies based on level and timing.
 */
function triggerGridFiring() {
    if (isPaused || !isInGameState || isChallengingStage || isWaveTransitioning) { return; }
    let canFireBasedOnPlayerState = false;
    if (isTwoPlayerMode && selectedGameMode === 'coop') {
        if ((player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) ||
            (player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture)) {
            canFireBasedOnPlayerState = true;
        }
    } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
        if (playerLives > 0 && ship && !isShipCaptured && !isShowingPlayerGameOverMessage) {
            canFireBasedOnPlayerState = true;
        }
    }
    if (!canFireBasedOnPlayerState) return;

    const gridEnemies = enemies.filter(e => e && e.state === 'in_grid');
    if (gridEnemies.length === 0) { return; }
    const now = Date.now();
    const effectiveFireInterval = scaleValue(level, BASE_GRID_FIRE_INTERVAL, MIN_GRID_FIRE_INTERVAL);
    if (now - lastGridFireCheckTime < effectiveFireInterval) { return; }
    lastGridFireCheckTime = now;
    const fireProbability = scaleValue(level, BASE_GRID_FIRE_PROBABILITY, MAX_GRID_FIRE_PROBABILITY);
    const maxFiringEnemies = Math.round(scaleValue(level, BASE_GRID_MAX_FIRING_ENEMIES, MAX_GRID_MAX_FIRING_ENEMIES));
    let firingCount = 0;
    gridEnemies.sort(() => Math.random() - 0.5);
    for (const enemy of gridEnemies) {
        if (firingCount >= maxFiringEnemies) { break; }
        if (enemy.type === ENEMY2_TYPE || enemy.type === ENEMY3_TYPE) {
            if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip) { continue; }
            if (Math.random() < fireProbability) {
                 if (createBulletSimple(enemy)) {
                     playSound('enemyShootSound', false, 0.4);
                     enemy.lastFiredTime = now;
                     firingCount++;
                 }
            }
        }
    }
}

// --- EINDE deel 7      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 8      van 8 dit code blok    --- (Focus: Geluidslogica introStep === 2 Human 2P CO-OP L1)

function runSingleGameUpdate(timestamp) {
    try {
        const now = Date.now();
        let activePlayersForLogic = false;
        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            activePlayersForLogic = (player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage && !player1NeedsRespawnAfterCapture) ||
                                  (player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage && !player2NeedsRespawnAfterCapture);
        } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
            activePlayersForLogic = playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage;
        }

        // Gamepad Exit Check
        let primaryControllerCanExit = false;
        if(isManualControl && connectedGamepadIndex !== null){
            if(isTwoPlayerMode && selectedGameMode === 'coop'){ // Geldt voor Human COOP en 1P vs AI COOP (P1 is mens)
                if(player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage) primaryControllerCanExit = true;
            } else { // 1P Classic, 1P_VS_AI_NORMAL (P1's beurt), 2P_NORMAL (actieve speler)
                if(playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && (!isPlayerTwoAI || (isPlayerTwoAI && currentPlayer === 1))) primaryControllerCanExit = true;
            }
        }
        if (primaryControllerCanExit && gameOverSequenceStartTime === 0 && !isPaused ) {
            const gamepads = navigator.getGamepads();
            if (gamepads?.[connectedGamepadIndex]) {
                 const gamepad = gamepads[connectedGamepadIndex];
                 const p1Input = processSingleController(gamepad, previousGameButtonStates);
                 previousGameButtonStates = p1Input.newButtonStates.slice();
                 if (p1Input.back) { stopGameAndShowMenu(); return; }
            } else { if(previousGameButtonStates.length > 0) previousGameButtonStates = []; }
        } else if (connectedGamepadIndex === null && previousGameButtonStates.length > 0) { previousGameButtonStates = [];}

        let secondaryControllerCanExit = false;
        // Alleen voor 2P Human COOP
        if(isManualControl && isTwoPlayerMode && selectedGameMode === 'coop' && !isPlayerTwoAI && connectedGamepadIndexP2 !== null){
            if(player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage) secondaryControllerCanExit = true;
        } else if (isManualControl && isTwoPlayerMode && selectedGameMode === 'normal' && !isPlayerTwoAI && connectedGamepadIndexP2 !== null) { // Human P2 in Normal
             if(playerLives > 0 && !isShipCaptured && !isShowingPlayerGameOverMessage && currentPlayer === 2) secondaryControllerCanExit = true;
        }

        if(secondaryControllerCanExit && gameOverSequenceStartTime === 0 && !isPaused){
            const gamepads = navigator.getGamepads();
            if (gamepads?.[connectedGamepadIndexP2]) {
                 const gamepadP2 = gamepads[connectedGamepadIndexP2];
                 const p2Input = processSingleController(gamepadP2, previousGameButtonStatesP2);
                 previousGameButtonStatesP2 = p2Input.newButtonStates.slice();
                 if (p2Input.back) { stopGameAndShowMenu(); return; }
            } else { if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; }
        } else if (connectedGamepadIndexP2 === null && previousGameButtonStatesP2.length > 0) { previousGameButtonStatesP2 = [];}


        if (isPaused) { renderGame(); return; }

        const isShowingCSBonusScreen = showCsBonusScoreMessage || showPerfectMessage;
        // --- NIEUWE LOGICA: Centreren van overgebleven AI schip in COOP Demo tijdens CS bonus ---
        if (isCoopAIDemoActive && isShowingCSBonusScreen && gameCanvas?.width > 0) {
            const p1IsOnlySurvivor = ship1 && player1Lives > 0 && player2Lives <= 0;
            const p2IsOnlySurvivor = ship2 && player2Lives > 0 && player1Lives <= 0;

            if (p1IsOnlySurvivor) {
                const p1EffectiveWidth = player1IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                const centeredX1 = Math.round(gameCanvas.width / 2 - p1EffectiveWidth / 2);
                ship1.x = centeredX1; ship1.targetX = centeredX1; smoothedShip1X = centeredX1;
                if (ship2) { ship2.targetX = ship2.x; smoothedShip2X = ship2.x; } // Zorg dat P2 niet beweegt
            } else if (p2IsOnlySurvivor) {
                const p2EffectiveWidth = player2IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                const centeredX2 = Math.round(gameCanvas.width / 2 - p2EffectiveWidth / 2);
                ship2.x = centeredX2; ship2.targetX = centeredX2; smoothedShip2X = centeredX2;
                if (ship1) { ship1.targetX = ship1.x; smoothedShip1X = ship1.x; } // Zorg dat P1 niet beweegt
            } else if (ship1 && player1Lives > 0 && ship2 && player2Lives > 0) {
                // Beide leven, standaard posities (al afgehandeld in resetWave/ elders voor CS)
                // Maar hier specifiek om te zorgen dat ze niet driften als de AI ze probeert te besturen.
                const p1InitialX = gameCanvas.width / 2 - gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                ship1.x = p1InitialX; ship1.targetX = p1InitialX; smoothedShip1X = p1InitialX;
                const p2InitialX = gameCanvas.width / 2 + gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                ship2.x = p2InitialX; ship2.targetX = p2InitialX; smoothedShip2X = p2InitialX;
            }
        }
        // --- EINDE NIEUWE LOGICA ---
        else if (isShowingCSBonusScreen && gameCanvas?.width > 0) { // Niet-COOP-Demo AI centreren
            if (isTwoPlayerMode && selectedGameMode === 'coop') { // Human COOP, 1P vs AI COOP
                const p1Active = ship1 && player1Lives > 0;
                const p2Active = ship2 && player2Lives > 0;

                if (p1Active && p2Active) {
                    if (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { // 1P vs AI COOP
                        const p1InitialX = gameCanvas.width / 2 - gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                        // P1 (mens) blijft waar die is.
                        const p2InitialX = gameCanvas.width / 2 + gameCanvas.width * COOP_SHIP_HORIZONTAL_OFFSET_FACTOR - (SHIP_WIDTH / 2);
                        if(ship2) { ship2.x = p2InitialX; ship2.targetX = p2InitialX; smoothedShip2X = p2InitialX; }
                    }
                    // Voor Human COOP, geen automatische centrering hier.
                } else if (p1Active && ship1) { // Alleen P1 over
                    const p1EffectiveWidth = player1IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                    const centeredX1 = Math.round(gameCanvas.width / 2 - p1EffectiveWidth / 2);
                    ship1.x = centeredX1; ship1.targetX = centeredX1;
                    // In 1P vs AI COOP, smoothedShip1X is niet relevant als P1 mens is.
                    if(ship2 && isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { ship2.targetX = ship2.x; smoothedShip2X = ship2.x; }
                } else if (p2Active && ship2) { // Alleen P2 over
                    const p2EffectiveWidth = player2IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                    const centeredX2 = Math.round(gameCanvas.width / 2 - p2EffectiveWidth / 2);
                    ship2.x = centeredX2; ship2.targetX = centeredX2;
                    if(isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') smoothedShip2X = centeredX2;
                    if(ship1 && isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { ship1.targetX = ship1.x; /* smoothedShip1X is not human controlled */ }
                }
            } else if ((!isManualControl || (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2)) && ship) { // 1P AI Demo, AI P2 in Normal
                 const effectiveShipWidthDemo = isDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                ship.x = Math.round(gameCanvas.width / 2 - effectiveShipWidthDemo / 2); ship.targetX = ship.x;
                 if(isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) smoothedShipX = ship.x;
                 else if (!isManualControl) smoothedShipX = ship.x;
            }
        }


        let coopLevel1IntroIsCurrentlyActive = false;
        if (selectedGameMode === 'coop' && level === 1 && coopPlayersReadyStartTime > 0) {
            coopLevel1IntroIsCurrentlyActive = true;

            if (isShowingCoopPlayersReady) {
                if (now - coopPlayersReadyStartTime < 100) { explosions = []; if (typeof updateExplosions === 'function') updateExplosions(); }
                if (now >= coopPlayersReadyStartTime + 3000) {
                    isShowingCoopPlayersReady = false;
                    explosions = []; if (typeof updateExplosions === 'function') updateExplosions();
                    if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                        isShowingIntro = true; introStep = 2; introDisplayStartTime = now;
                    } else { // Human 2P CO-OP
                        isShowingIntro = true; introStep = 1; introDisplayStartTime = now;
                    }
                }
            } else if (isShowingIntro) {
                if (now - introDisplayStartTime < 100) { explosions = []; if (typeof updateExplosions === 'function') updateExplosions(); }
                let currentCoopIntroStepDuration = INTRO_DURATION_PER_STEP;
                // Voor Human 2P CO-OP, is introStep 1 "PLAYER 1 / PLAYER 2" en introStep 2 "STAGE 1"
                if (introStep === 1 && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                    currentCoopIntroStepDuration = TWO_PLAYER_STAGE_INTRO_DURATION;
                }

                if (now >= introDisplayStartTime + currentCoopIntroStepDuration) {
                    if (introStep === 1 && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                        introStep = 2; // Ga naar "STAGE 1" voor Human 2P CO-OP
                        introDisplayStartTime = now;
                        explosions = []; if (typeof updateExplosions === 'function') updateExplosions();
                    } else { // AI COOP modes waren al op introStep 2, of Human 2P COOP is nu klaar met STAGE 1
                        isShowingIntro = false; introStep = 0;
                        playerIntroSoundPlayed = false; stageIntroSoundPlayed = false; csIntroSoundPlayed = false;
                        explosions = []; if (typeof updateExplosions === 'function') updateExplosions();
                        coopLevel1IntroIsCurrentlyActive = false;
                        coopPlayersReadyStartTime = 0;
                    }
                }
            } else {
                coopLevel1IntroIsCurrentlyActive = false;
                coopPlayersReadyStartTime = 0;
            }

            if (isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) handlePlayerInput();
            if (typeof moveEntities === 'function') moveEntities();
            renderGame();

            if (coopLevel1IntroIsCurrentlyActive) {
                return;
            }
        }


        if (selectedGameMode === 'coop' && level === 1 && !gameJustStartedAndWaveLaunched && coopPlayersReadyStartTime === 0 && gameJustStarted) {
            if (isFullGridWave) startFullGridWave();
            else if (isChallengingStage) startChallengingStageSequence();
            else if (currentWaveDefinition && currentWaveDefinition.length > 0) scheduleEntranceFlightWave();
            else { isWaveTransitioning = true; readyForNextWaveReset = true; }
            gameJustStartedAndWaveLaunched = true;
            gameJustStarted = false;
        }


        if (isShowingPlayerGameOverMessage && isTwoPlayerMode && selectedGameMode === 'normal') {
            if(now - playerGameOverMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
            if (now - playerGameOverMessageStartTime >= PLAYER_GAME_OVER_MESSAGE_DURATION) {
                isShowingPlayerGameOverMessage = false;
                explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                const prevPlayerGameOver = playerWhoIsGameOver;
                playerWhoIsGameOver = 0;

                if (nextActionAfterPlayerGameOver === 'switch_player') {
                    if (switchPlayerTurn()) {
                        if (prevPlayerGameOver === 2 && currentPlayer === 1 && player1CompletedLevel === level) {
                           level++;
                           player1CompletedLevel = -1;
                           player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                        }
                        resetWaveInternal();
                        gameJustStartedAndWaveLaunched = false; gameJustStarted = true;
                    } else {
                         triggerFinalGameOverSequence();
                    }
                } else if (nextActionAfterPlayerGameOver === 'show_results') {
                    triggerFinalGameOverSequence();
                } else {
                    triggerFinalGameOverSequence();
                }
                renderGame(); return;
            } else { renderGame(); return; }
        }

        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            let p1GameOverMsgDone = false;
            let p2GameOverMsgDone = false;

            if (isPlayer1ShowingGameOverMessage) {
                if(now - player1GameOverMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (now - player1GameOverMessageStartTime >= PLAYER_GAME_OVER_MESSAGE_DURATION_COOP) {
                    isPlayer1ShowingGameOverMessage = false;
                    p1GameOverMsgDone = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
            }
            if (isPlayer2ShowingGameOverMessage) {
                 if(now - player2GameOverMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                 if (now - player2GameOverMessageStartTime >= PLAYER_GAME_OVER_MESSAGE_DURATION_COOP) {
                    isPlayer2ShowingGameOverMessage = false;
                    p2GameOverMsgDone = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
            }

            if (p1GameOverMsgDone || p2GameOverMsgDone) {
                if (player1Lives <= 0 && player2Lives <= 0 && gameOverSequenceStartTime === 0) {
                    triggerFinalGameOverSequence();
                }
                if (isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) handlePlayerInput();
                if (typeof moveEntities === 'function') moveEntities();
                renderGame();
                if (gameOverSequenceStartTime > 0 || player1Lives > 0 || player2Lives > 0) {
                    return;
                }
            } else if (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage) {
                if (isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) handlePlayerInput();
                if (typeof moveEntities === 'function') moveEntities();
                renderGame();
                return;
            }
        }


        if (isShowingCaptureMessage) {
            if(now - captureMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
            const boss = enemies.find(e => e.id === capturedBossIdWithMessage);
            if (boss && boss.state === 'showing_capture_message') { const elapsedMessageTime = now - captureMessageStartTime; const animationProgress = Math.min(1.0, elapsedMessageTime / CAPTURE_MESSAGE_DURATION); boss.captureAnimationRotation = animationProgress * 2 * (2 * Math.PI); }
            else if (boss) { boss.captureAnimationRotation = 0; }

            if (isInGameState && !isShowingPlayerGameOverMessage && !isPlayer1ShowingGameOverMessage && !isPlayer2ShowingGameOverMessage && gameOverSequenceStartTime === 0) {
                if (isManualControl || isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) handlePlayerInput();
                if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                    aiControlCoop();
                } else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                    aiControl();
                }
                if (typeof moveEntities === 'function') moveEntities();
                updateExplosions(); updateFloatingScores();
            }

            if (now - captureMessageStartTime >= CAPTURE_MESSAGE_DURATION) {
                isShowingCaptureMessage = false;
                explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                stopSound('shipCapturedSound');
                captureBeamActive = false;
                if (boss && boss.state === 'showing_capture_message') {
                    boss.state = 'returning'; boss.captureAnimationRotation = 0;
                    try {
                        const bossWidth = (boss.type === ENEMY3_TYPE) ? BOSS_WIDTH : ENEMY_WIDTH;
                        const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(boss.gridRow, boss.gridCol, bossWidth);
                        boss.targetGridX = tgtX; boss.targetGridY = tgtY;
                    } catch (e) {
                        console.error(`[Capture Message End] Error getting grid pos for returning boss ${boss.id}:`, e);
                        boss.targetGridX = gameCanvas.width / 2; boss.targetGridY = ENEMY_TOP_MARGIN;
                    }
                } else if (boss) {
                    boss.captureAnimationRotation = 0;
                }
                capturedBossIdWithMessage = null;

                const shipBaseY = gameCanvas ? gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN : 500;
                 if (isTwoPlayerMode && selectedGameMode === 'coop') {
                    if (player1NeedsRespawnAfterCapture && player1Lives > 0) {
                        ship1 = { x: player1CaptureRespawnX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: player1CaptureRespawnX, id: 'p1' };
                        isPlayer1ShipCaptured = false;
                        isPlayer1Invincible = true; player1InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isPlayer1WaitingForRespawn = false;
                        player1NeedsRespawnAfterCapture = false;
                        player1CaptureRespawnX = 0;
                        if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) smoothedShip1X = ship1.x;
                    }
                    if (player2NeedsRespawnAfterCapture && player2Lives > 0) {
                        ship2 = { x: player2CaptureRespawnX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: player2CaptureRespawnX, id: 'p2' };
                        isPlayer2ShipCaptured = false;
                        isPlayer2Invincible = true; player2InvincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isPlayer2WaitingForRespawn = false;
                        player2NeedsRespawnAfterCapture = false;
                        player2CaptureRespawnX = 0;
                        if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) smoothedShip2X = ship2.x;
                    }

                    if ((player1Lives <=0 && player2Lives <=0) ){
                        if(gameOverSequenceStartTime === 0) triggerFinalGameOverSequence();
                    }
                 } else if (!isManualControl && !isPlayerTwoAI) { // 1P AI Demo
                    if (isShipCaptured && playerLives > 0) {
                        let respawnX = gameCanvas ? gameCanvas.width / 2 - SHIP_WIDTH / 2 : 200;
                        if (typeof smoothedShipX === 'number') respawnX = smoothedShipX;

                        ship = { x: respawnX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: respawnX, id: 'main' };
                        isShipCaptured = false;
                        isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isWaitingForRespawn = false;
                        aiNeedsStabilization = true;
                        if(smoothedShipX === undefined && ship) smoothedShipX = ship.x;
                    } else if (playerLives <= 0 && gameOverSequenceStartTime === 0) {
                        triggerFinalGameOverSequence();
                    }
                 } else if (isManualControl) { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                    if (isShipCaptured && playerLives > 0) {
                        let respawnX = (capturedShipRespawnX_NormalMode !== 0) ? capturedShipRespawnX_NormalMode : (gameCanvas ? gameCanvas.width / 2 - SHIP_WIDTH / 2 : 200);

                        ship = { x: respawnX, y: shipBaseY, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: respawnX, id: 'main' };
                        isShipCaptured = false;
                        capturedShipRespawnX_NormalMode = 0;
                        isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS;
                        isWaitingForRespawn = true;
                        respawnTime = now + RESPAWN_DELAY_MS;
                        if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) aiNeedsStabilization = true;
                    } else if (playerLives <= 0 && gameOverSequenceStartTime === 0) {
                        if (!isTwoPlayerMode || (isTwoPlayerMode && selectedGameMode === 'normal' && ((currentPlayer === 1 && player2Lives <=0) || (currentPlayer === 2 && player1Lives <=0)))) {
                            triggerFinalGameOverSequence();
                        }
                    }
                 }
            }
            renderGame(); return;
        }

        const noPlayerGameOverIsActive = !(isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage || isShowingPlayerGameOverMessage);
        const inNormalIntro = isShowingIntro && !coopLevel1IntroIsCurrentlyActive && !(selectedGameMode === 'coop' && level ===1);


        if (!coopLevel1IntroIsCurrentlyActive && gameOverSequenceStartTime === 0 && activePlayersForLogic && !isShowingCaptureMessage && noPlayerGameOverIsActive) {
            if (isInGameState && !inNormalIntro) {
                if (!(isShowingCSBonusScreen && !isManualControl)) {
                    if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                         aiControlCoop();
                    } else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                         aiControl();
                    } else if (!isManualControl && !isPlayerTwoAI) {
                        aiControl();
                    }
                }
                if (isManualControl) {
                     handlePlayerInput();
                }
            }
        }


        if (isTwoPlayerMode && selectedGameMode === 'coop') {
            if (isPlayer1Invincible && now >= player1InvincibilityEndTime) { isPlayer1Invincible = false; player1InvincibilityEndTime = 0; }
            if (isPlayer2Invincible && now >= player2InvincibilityEndTime) { isPlayer2Invincible = false; player2InvincibilityEndTime = 0; }
        } else {
            if (isInvincible && now >= invincibilityEndTime) { isInvincible = false; invincibilityEndTime = 0; }
            if (isWaitingForRespawn && now >= respawnTime) { isWaitingForRespawn = false; }
        }

        const justAwardedExtraLife = showExtraLifeMessage && (now - extraLifeMessageStartTime < 100);
        if (justAwardedExtraLife && (isWaveTransitioning || (isChallengingStage && enemies.length === 0))) {
        }

        if ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && isChallengingStage && enemies.length === 0 && !isCsCompletionDelayActive && !showCsBonusScoreMessage && !showPerfectMessage && gameCanvas && gameCanvas.width > 0) {
            const p1StillActive = ship1 && player1Lives > 0 && !isPlayer1ShipCaptured && !isPlayer1WaitingForRespawn && !isPlayer1ShowingGameOverMessage;
            const p2StillActive = ship2 && player2Lives > 0 && !isPlayer2ShipCaptured && !isPlayer2WaitingForRespawn && !isPlayer2ShowingGameOverMessage;

            if (p1StillActive && !p2StillActive) {
                const p1EffectiveWidth = player1IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                const centeredX1 = Math.round(gameCanvas.width / 2 - p1EffectiveWidth / 2);
                ship1.x = centeredX1; ship1.targetX = centeredX1; smoothedShip1X = centeredX1;
            } else if (p2StillActive && !p1StillActive) {
                const p2EffectiveWidth = player2IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                const centeredX2 = Math.round(gameCanvas.width / 2 - p2EffectiveWidth / 2);
                ship2.x = centeredX2; ship2.targetX = centeredX2; smoothedShip2X = centeredX2;
            }
        }


        if (isCsCompletionDelayActive && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0) {
             if (now - csCompletionDelayStartTime >= CS_COMPLETION_MESSAGE_DELAY + EXPLOSION_DURATION) {
                 isCsCompletionDelayActive = false;
                 csCompletionResultIsPerfect = (challengingStageEnemiesHit >= challengingStageTotalEnemies);

                 if (csCompletionResultIsPerfect) {
                     playSound('csPerfectSound', false, 0.6);
                     showCsHitsMessage = true;
                     csHitsMessageStartTime = now;
                 } else {
                     playSound('csClearSound', false, 0.6);
                     showCSClearMessage = true;
                     csClearMessageStartTime = now;
                 }
                 bullets = [];
                 enemyBullets = [];
                 renderGame(); return;
            } else if (now - csCompletionDelayStartTime >= CS_COMPLETION_MESSAGE_DELAY && explosions.length > 0) {
                 updateExplosions();
                 renderGame(); return;
            } else if (now - csCompletionDelayStartTime < CS_COMPLETION_MESSAGE_DELAY) {
                renderGame(); return;
            }
        }


        let messageTimeoutCompleted = false; let shouldExitEarly = false;
        if (noPlayerGameOverIsActive && gameOverSequenceStartTime === 0 && !isShowingCoopPlayersReady && !coopLevel1IntroIsCurrentlyActive) {
            if (showCsHitsMessage) {
                if(now - csHitsMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (Date.now() - csHitsMessageStartTime > CS_HITS_MESSAGE_DURATION) {
                    showCsHitsMessage = false;
                    showPerfectMessage = true;
                    perfectMessageStartTime = now;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
                shouldExitEarly = true;
            }
            else if (showPerfectMessage) {
                if(now - perfectMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (Date.now() - perfectMessageStartTime > CS_PERFECT_MESSAGE_DURATION) {
                    showPerfectMessage = false;
                    showCsBonusScoreMessage = true;
                    csBonusScoreMessageStartTime = now;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
                shouldExitEarly = true;
            }
            else if (showCsBonusScoreMessage) {
                if(now - csBonusScoreMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (Date.now() - csBonusScoreMessageStartTime > CS_BONUS_MESSAGE_DURATION) {
                    showCsBonusScoreMessage = false;
                    messageTimeoutCompleted = true;
                    playLevelUpAfterCSBonus = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
                shouldExitEarly = true;
            }
            else if (showCSClearMessage) {
                if(now - csClearMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (Date.now() - csClearMessageStartTime >= CS_CLEAR_HITS_DELAY && !showCsHitsForClearMessage) {
                    showCsHitsForClearMessage = true;
                }
                if (Date.now() - csClearMessageStartTime >= CS_CLEAR_SCORE_DELAY && !showCsScoreForClearMessage) {
                    showCsScoreForClearMessage = true;
                }
                if (Date.now() - csClearMessageStartTime >= CS_CLEAR_DELAY) {
                    showCSClearMessage = false;
                    showCsHitsForClearMessage = false;
                    showCsScoreForClearMessage = false;
                    messageTimeoutCompleted = true;
                    playLevelUpAfterCSBonus = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
                shouldExitEarly = true;
            }
            else if (showExtraLifeMessage) {
                if (Date.now() - extraLifeMessageStartTime > EXTRA_LIFE_MESSAGE_DURATION) {
                     showExtraLifeMessage = false;
                }
                shouldExitEarly = true;
            }
            else if (showReadyMessage) {
                if(now - readyMessageStartTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (Date.now() - readyMessageStartTime > READY_MESSAGE_DURATION) {
                    showReadyMessage = false; messageTimeoutCompleted = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
                shouldExitEarly = true;
            }
        }


        if (shouldExitEarly && !messageTimeoutCompleted && !isShowingCoopPlayersReady && !coopLevel1IntroIsCurrentlyActive && !isShowingCaptureMessage && noPlayerGameOverIsActive ) {
            if (!((isShowingCSBonusScreen || showCsHitsMessage || showCSClearMessage) && isManualControl) && !showExtraLifeMessage) {
                 renderGame(); return;
            }
        }

        if (inNormalIntro && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0) {
            let introTextFinished = false;
            const elapsedIntroTime = now - introDisplayStartTime;
            let currentIntroStepDuration = INTRO_DURATION_PER_STEP;

            const isP1vsAINormal = (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL');
            const is2PHumanNormal = (isTwoPlayerMode && selectedGameMode === 'normal' && !isPlayerTwoAI);

            if (is2PHumanNormal || isP1vsAINormal) {
                currentIntroStepDuration = TWO_PLAYER_STAGE_INTRO_DURATION;
            }

            if (introStep === 1) { // PLAYER X
                if(elapsedIntroTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                let soundIdToPlay = null;
                let soundVolume = 1.0;

                if (!playerIntroSoundPlayed) {
                    const isNormalOrVsAIMode = isP1vsAINormal || is2PHumanNormal;
                    const is1PvsAICoopModeAndNotL1 = isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP' && level > 1;

                    if (isNormalOrVsAIMode) {
                        if (currentPlayer === 1 && level === 1 && !initialGameStartSoundPlayedThisSession) {
                            soundIdToPlay = 'startSound'; soundVolume = 0.4;
                        } else if (currentPlayer === 2 || level > 1) {
                            soundIdToPlay = 'levelUpSound'; soundVolume = 0.2;
                        }
                    } else if (is1PvsAICoopModeAndNotL1) {
                         soundIdToPlay = 'levelUpSound'; soundVolume = 0.2;
                    } else if (!isTwoPlayerMode) { // 1P Classic mode
                        if (level === 1 && !initialGameStartSoundPlayedThisSession) {
                            soundIdToPlay = 'startSound'; soundVolume = 0.4;
                        } else if (level > 1) {
                            soundIdToPlay = 'levelUpSound'; soundVolume = 0.2;
                        }
                    }
                    // Voor Human 2P CO-OP L1, zal initialGameStartSoundPlayedThisSession hier true zijn
                    // (vanuit baseStartGame), dus bovenstaande condities spelen geen startSound.
                    // De levelUpSound wordt hieronder bij introStep === 2 afgehandeld.
                }


                if(soundIdToPlay) {
                    playSound(soundIdToPlay, false, soundVolume);
                    playerIntroSoundPlayed = true;
                    if (soundIdToPlay === 'startSound') {
                        initialGameStartSoundPlayedThisSession = true;
                    }
                }

                if (elapsedIntroTime >= currentIntroStepDuration) {
                    if (isChallengingStage) introStep = 3;
                    else introStep = 2;
                    introDisplayStartTime = now;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
            } else if (introStep === 2) { // STAGE X
                if(elapsedIntroTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (!stageIntroSoundPlayed) {
                     if (playLevelUpAfterCSBonus && (isTwoPlayerMode && selectedGameMode === 'coop')) {
                        playSound('levelUpSound', false, 0.2);
                        playLevelUpAfterCSBonus = false;
                        stageIntroSoundPlayed = true;
                     }
                     // <<< SPECIFIEKE LOGICA VOOR HUMAN 2P CO-OP STAGE 1 SOUND >>>
                     else if (isTwoPlayerMode && selectedGameMode === 'coop' && !isPlayerTwoAI && !isCoopAIDemoActive) {
                        // Voor Human 2-Player CO-OP: speel levelUpSound altijd (ook voor level 1).
                        // De 'startSound' is al gespeeld in baseStartGame (en playerIntroSoundPlayed is true als introStep 1 is doorlopen).
                        playSound('levelUpSound', false, 0.2);
                        stageIntroSoundPlayed = true;
                     }
                     // <<< EINDE SPECIFIEKE LOGICA >>>
                     else if (selectedGameMode === 'coop') { // AI COOP modes
                        // Voor CO-OP Demo en 1P vs AI CO-OP: speel levelUpSound alleen als level > 1.
                        if ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && level > 1) {
                            playSound('levelUpSound', false, 0.2);
                            stageIntroSoundPlayed = true;
                        }
                        // Voor CO-OP Demo en 1P vs AI CO-OP level 1, geen extra geluid hier (startSound is al gespeeld)
                        else if ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && level === 1) {
                             stageIntroSoundPlayed = true; // Markeer als gespeeld (omdat startSound de "introductie" was)
                        }
                     }
                     else if (!isTwoPlayerMode && level > 1 ) { // 1P Classic, level > 1
                        playSound('levelUpSound', false, 0.2);
                        stageIntroSoundPlayed = true;
                     } else if (level > 1 && !playerIntroSoundPlayed && !(isPlayerTwoAI && selectedGameMode === 'normal') && !initialGameStartSoundPlayedThisSession ) { // 2P Normal, level > 1
                         playSound('levelUpSound', false, 0.2);
                         stageIntroSoundPlayed = true;
                     } else if (level === 1 && !isManualControl && !isCoopAIDemoActive && !(isPlayerTwoAI && selectedGameMode === 'coop') && !initialGameStartSoundPlayedThisSession) { // 1P AI Demo, level 1
                         playSound('startSound', false, 0.4);
                         initialGameStartSoundPlayedThisSession = true;
                         stageIntroSoundPlayed = true;
                     }
                }
                if (elapsedIntroTime >= currentIntroStepDuration) {
                    introTextFinished = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
            } else if (introStep === 3) { // CHALLENGING STAGE
                if(elapsedIntroTime < 100) { explosions = []; if(typeof updateExplosions === 'function') updateExplosions(); }
                if (!csIntroSoundPlayed) { playSound('entranceSound', false, 0.4); csIntroSoundPlayed = true; stageIntroSoundPlayed = true;}
                if (elapsedIntroTime >= currentIntroStepDuration) {
                    introTextFinished = true;
                    explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
                }
            }

            if (isInGameState && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0 && gameCanvas) {
                let p1LeftOverrideForMoveEntities = null;
                let p1RightOverrideForMoveEntities = null;

                const isP1HumanVsAINormalIntro = isManualControl && isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' && currentPlayer === 1 && isShowingIntro;

                if (isP1HumanVsAINormalIntro) {
                    let p1CtrlLeft = false, p1CtrlRight = false;
                    const gamepads = navigator.getGamepads();
                    if (connectedGamepadIndex !== null && gamepads?.[connectedGamepadIndex]) {
                        const gamepadP1Obj = gamepads[connectedGamepadIndex];
                        const resultP1 = processSingleController(gamepadP1Obj, previousGameButtonStates);
                        p1CtrlLeft = resultP1.left; p1CtrlRight = resultP1.right;
                    }
                    p1LeftOverrideForMoveEntities = keyboardP1LeftDown || p1CtrlLeft;
                    p1RightOverrideForMoveEntities = keyboardP1RightDown || p1CtrlRight;
                }

                if (isP1vsAINormal && currentPlayer === 2) { // AI P2 in 1P vs AI Normal
                    aiControl();
                } else if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) { // COOP AI Demo or 1P vs AI COOP
                     aiControlCoop();
                } else if (!isManualControl && !isPlayerTwoAI) { // 1P AI Demo
                    aiControl();
                }

                if (typeof moveEntities === 'function') {
                    moveEntities(p1LeftOverrideForMoveEntities, p1RightOverrideForMoveEntities);
                }
                updateExplosions(); updateFloatingScores();
            }


            if (introTextFinished) {
                isShowingIntro = false; introStep = 0; playerIntroSoundPlayed = false; stageIntroSoundPlayed = false; csIntroSoundPlayed = false;
                if (isManualControl) {
                    isShowingDemoText = false;
                }

                if (!isChallengingStage) {
                    if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                        aiShip1CanShootTime = Date.now() + 1000;
                        aiShip2CanShootTime = Date.now() + 1200;
                    } else {
                        aiCanShootTime = Date.now() + ((isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL') ? 1000 : 3000);
                    }
                } else {
                     if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) { aiShip1CanShootTime = 0; aiShip2CanShootTime = 0;}
                     else aiCanShootTime = 0;
                }
                const isNonCoopL1Normal = level === 1 && selectedGameMode !== 'coop';
                const isCoopL1 = level === 1 && selectedGameMode === 'coop';

                const shouldLaunchWaveNow = (isNonCoopL1Normal && !gameJustStartedAndWaveLaunched) ||
                                          level > 1 ||
                                          isChallengingStage ||
                                          (isCoopL1 && !gameJustStartedAndWaveLaunched);


                if (shouldLaunchWaveNow) {
                    if (isChallengingStage) startChallengingStageSequence();
                    else {
                        if (currentWaveDefinition && currentWaveDefinition.length > 0) {
                            if (isFullGridWave) startFullGridWave();
                            else { scheduleEntranceFlightWave(); playSound('entranceSound', false, 0.4); }
                        } else {
                             isEntrancePhaseActive = false; stopSound('entranceSound'); isWaveTransitioning = true; readyForNextWaveReset = true; bullets = []; enemyBullets = []; explosions = [];
                            setTimeout(() => {
                                const livesCheck = (isTwoPlayerMode && selectedGameMode === 'coop') ? (player1Lives > 0 || player2Lives > 0) : (playerLives > 0);
                                if ((isInGameState || (!isInGameState && livesCheck)) && typeof resetWaveInternal === 'function') {
                                    if(livesCheck) { resetWaveInternal(); gameJustStartedAndWaveLaunched = false; gameJustStarted = true; }
                                    else triggerFinalGameOverSequence();
                                }
                            }, 100);
                        }
                    }
                    if (isNonCoopL1Normal || level > 1 || isChallengingStage || isCoopL1 ) gameJustStartedAndWaveLaunched = true;
                }
            }
            if (isManualControl && inNormalIntro && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0) {
                handlePlayerInput();
            }
            renderGame(); return;
        }


        const noSpecialOrNormalIntroRunning = !coopLevel1IntroIsCurrentlyActive && !inNormalIntro && !messageTimeoutCompleted && !isShowingCaptureMessage;

        if (gameJustStarted && noSpecialOrNormalIntroRunning) {
             if (!gameJustStartedAndWaveLaunched) {
                const isCoopModeL1NotAlreadyHandled = selectedGameMode === 'coop' && level === 1 && coopPlayersReadyStartTime !== 0;

                if (!isCoopModeL1NotAlreadyHandled) {
                    if (isChallengingStage) startChallengingStageSequence();
                    else {
                        if (currentWaveDefinition && currentWaveDefinition.length > 0) {
                            if (isFullGridWave) startFullGridWave();
                            else { scheduleEntranceFlightWave(); playSound('entranceSound', false, 0.4); }
                        } else {
                             isWaveTransitioning = true; readyForNextWaveReset = true;
                        }
                    }
                    gameJustStartedAndWaveLaunched = true;
                }
            }
            gameJustStarted = false;
        }

        if (noSpecialOrNormalIntroRunning && isInGameState && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0) {
            if (!isShowingCSBonusScreen || (isShowingCSBonusScreen && isManualControl)) {
                if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                    aiControlCoop();
                } else if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) {
                    aiControl();
                } else if (!isManualControl && !isPlayerTwoAI) {
                    aiControl();
                }
                if (isManualControl) {
                    handlePlayerInput();
                }
                if (typeof moveEntities === 'function') moveEntities();
                updateExplosions();
                updateFloatingScores();

            } else if (isShowingCSBonusScreen && (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP'))) {
                 updateExplosions();
                 updateFloatingScores();
            }
        }


        if (noSpecialOrNormalIntroRunning && noPlayerGameOverIsActive && gameOverSequenceStartTime === 0) {
            if (GRID_BREATH_ENABLED && isInGameState && !isChallengingStage && !isWaveTransitioning && activePlayersForLogic ) { const gridEnemiesExist = enemies.some(e => e?.state === 'in_grid'); if (gridEnemiesExist && isGridBreathingActive) { const elapsedBreathTime = now - gridBreathStartTime; const effectiveGridBreathCycleMs = scaleValue(level, BASE_GRID_BREATH_CYCLE_MS, MIN_GRID_BREATH_CYCLE_MS); const cycleTime = elapsedBreathTime % effectiveGridBreathCycleMs; currentGridBreathFactor = (Math.sin((cycleTime / effectiveGridBreathCycleMs) * Math.PI * 2 - Math.PI / 2) + 1) / 2; } else if (!gridEnemiesExist && isGridBreathingActive) { isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; } else if (gridEnemiesExist && !isGridBreathingActive) { isGridBreathingActive = true; gridBreathStartTime = now; currentGridBreathFactor = 0; }
             } else { if (isGridBreathingActive) { isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; } }

             if (isEntrancePhaseActive) {
                 const allSpawnsProcessed = enemiesSpawnedThisWave >= totalEnemiesScheduledForWave;
                 const isAnyEnemyStillEntering = enemies.some(e => e?.state === 'following_entrance_path' || e?.state === 'moving_to_grid' || e?.state === 'following_bezier_path');
                 if (totalEnemiesScheduledForWave > 0 && allSpawnsProcessed && !isAnyEnemyStillEntering) {
                    const wasEntrancePhaseActiveBefore = isEntrancePhaseActive;
                    isEntrancePhaseActive = false;
                    if (wasEntrancePhaseActiveBefore) {
                        stopSound('entranceSound');
                        enemiesSpawnedThisWave = 0; totalEnemiesScheduledForWave = 0;
                        enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = [];
                        gridJustCompleted = true;

                        if (!isChallengingStage && !isFullGridWave) {
                            if (isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) {
                                coopAICaptureDiveAnticipationActive = true;
                                coopAICaptureDiveAnticipationEndTime = Date.now() + COOP_AI_CAPTURE_DIVE_ANTICIPATION_DURATION_MS;
                                if (typeof triggerImmediateCaptureDive === 'function') {
                                    triggerImmediateCaptureDive();
                                }
                            } else if (typeof triggerImmediateCaptureDive === 'function') {
                                triggerImmediateCaptureDive();
                            }
                        }
                    }
                }
             }

            if (!isChallengingStage && !inNormalIntro && !isPaused && !isWaveTransitioning) triggerGridFiring();

            if (!isWaveTransitioning && activePlayersForLogic && !inNormalIntro && !isShowingCaptureMessage && !isEntrancePhaseActive) {
                let allEnemiesGone = enemies.length === 0; let noFallingShips = fallingShips.length === 0; let waveConsideredComplete = false;
                if (isChallengingStage) { if (allEnemiesGone && !isEntrancePhaseActive) waveConsideredComplete = true; }
                else { if (allEnemiesGone && !isEntrancePhaseActive && noFallingShips) waveConsideredComplete = true; }

                if (waveConsideredComplete) {
                    if (isGridBreathingActive) { isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; }

                    if ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && gameCanvas && gameCanvas.width > 0) {
                        const p1LivesLeft = player1Lives;
                        const p2LivesLeft = player2Lives;
                        const shipBaseY = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN;

                        if (p1LivesLeft > 0 && p2LivesLeft <= 0 && ship1) {
                            const p1EffectiveWidth = player1IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                            const centeredX1 = Math.round(gameCanvas.width / 2 - p1EffectiveWidth / 2);
                            ship1.x = centeredX1; ship1.targetX = centeredX1; smoothedShip1X = centeredX1;
                            ship1.y = shipBaseY;
                        } else if (p2LivesLeft > 0 && p1LivesLeft <= 0 && ship2) {
                            const p2EffectiveWidth = player2IsDualShipActive ? (SHIP_WIDTH + DUAL_SHIP_OFFSET_X) : SHIP_WIDTH;
                            const centeredX2 = Math.round(gameCanvas.width / 2 - p2EffectiveWidth / 2);
                            ship2.x = centeredX2; ship2.targetX = centeredX2; smoothedShip2X = centeredX2;
                            ship2.y = shipBaseY;
                        }
                    }


                    isWaveTransitioning = true; if (isGridSoundPlaying) { stopSound('gridBackgroundSound'); isGridSoundPlaying = false; }
                    if (!isChallengingStage) {
                        bullets = [];
                        enemyBullets = [];
                    }

                    floatingScores = []; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0;
                    let resetDelay;

                    if (isChallengingStage) {
                         csCompletionResultIsPerfect = (challengingStageEnemiesHit >= challengingStageTotalEnemies);
                         csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
                         setTimeout(() => {
                            if (isWaveTransitioning) {
                                explosions = [];
                                if(typeof updateExplosions === 'function') updateExplosions();
                                isCsCompletionDelayActive = true;
                                csCompletionDelayStartTime = Date.now();
                            }
                         }, EXPLOSION_DURATION);

                         if (csCompletionResultIsPerfect) {
                             let perfectBonus = 10000;
                             if (isTwoPlayerMode && selectedGameMode === 'coop') {
                                 if (player1Lives > 0 || ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && ship1)) {
                                     player1Score += perfectBonus;
                                 }
                                 if (player2Lives > 0 || ((isCoopAIDemoActive || (isPlayerTwoAI && selectedOnePlayerGameVariant === '1P_VS_AI_COOP')) && ship2)) {
                                     player2Score += perfectBonus;
                                 }
                                 highScore = Math.max(highScore, player1Score, player2Score);
                                 checkAndAwardExtraLife(null);
                             } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                                 score += perfectBonus;
                                 if (!isTwoPlayerMode) player1Score = score;
                                 else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                                      if(currentPlayer === 1) player1Score = score; else player2Score = score;
                                 }
                                 highScore = Math.max(highScore, score, player1Score, player2Score);
                                 checkAndAwardExtraLife(currentPlayer);
                             }
                             resetDelay = EXPLOSION_DURATION + CS_COMPLETION_MESSAGE_DELAY + CS_HITS_MESSAGE_DURATION + CS_PERFECT_MESSAGE_DURATION + CS_BONUS_MESSAGE_DURATION;
                         } else {
                             if (isTwoPlayerMode && selectedGameMode === 'coop') {
                                 checkAndAwardExtraLife(null);
                             } else { // 1P Classic, 1P_VS_AI_NORMAL, 2P_NORMAL
                                 checkAndAwardExtraLife(currentPlayer);
                             }
                             resetDelay = EXPLOSION_DURATION + CS_COMPLETION_MESSAGE_DELAY + CS_CLEAR_DELAY;
                         }
                         resetDelay += 100;
                     } else {
                         playSound('waveUpSound', false, 0.8);
                         normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null;
                         resetDelay = POST_MESSAGE_RESET_DELAY;
                     }

                    setTimeout(() => {
                        let advanceLevelGlobally = false;
                        let playerWhoseTurnEnded = 0;

                        if (isTwoPlayerMode && selectedGameMode === 'normal') {
                            playerWhoseTurnEnded = currentPlayer;

                            if (playerWhoseTurnEnded === 1) {
                                player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                            } else {
                                player2MaxLevelReached = Math.max(player2MaxLevelReached, level);
                            }

                            const switchedOK = switchPlayerTurn();

                            if (switchedOK) {
                                if (playerWhoseTurnEnded === 2 && currentPlayer === 1 && player1CompletedLevel === level) {
                                    advanceLevelGlobally = true;
                                    player1CompletedLevel = -1;
                                } else if (playerWhoseTurnEnded === 1) {
                                    player1CompletedLevel = level;
                                    advanceLevelGlobally = false;
                                } else {
                                    advanceLevelGlobally = false;
                                }
                            } else {
                                advanceLevelGlobally = true;
                                player1CompletedLevel = -1;
                            }
                        } else {
                            advanceLevelGlobally = true;
                            if (!isTwoPlayerMode) player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                            else if (isTwoPlayerMode && selectedGameMode === 'coop') {
                                if (player1Lives > 0) player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                                if (player2Lives > 0) player2MaxLevelReached = Math.max(player2MaxLevelReached, level);
                            }
                        }

                        if (advanceLevelGlobally) {
                            level++;
                            if (isTwoPlayerMode && selectedGameMode === 'coop') {
                                if (player1Lives > 0) player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                                if (player2Lives > 0) player2MaxLevelReached = Math.max(player2MaxLevelReached, level);
                            } else if (isTwoPlayerMode && selectedGameMode === 'normal') {
                                if (currentPlayer === 1 && player1Lives > 0) player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                                else if (currentPlayer === 2 && player2Lives > 0) player2MaxLevelReached = Math.max(player2MaxLevelReached, level);
                            } else {
                                if (playerLives > 0) player1MaxLevelReached = Math.max(player1MaxLevelReached, level);
                            }
                        }

                        let canContinue = false;
                        if (isTwoPlayerMode && selectedGameMode === 'coop') canContinue = (player1Lives > 0 || player2Lives > 0);
                        else if (isTwoPlayerMode && selectedGameMode === 'normal') canContinue = (currentPlayer === 1 ? player1Lives : player2Lives) > 0;
                        else canContinue = playerLives > 0; // Voor 1P classic, playerLives is player1Lives

                        if (canContinue) {
                            resetWaveInternal(); gameJustStartedAndWaveLaunched = false; gameJustStarted = true;
                        } else {
                            triggerFinalGameOverSequence();
                        }
                    }, resetDelay);
                    renderGame(); return;
                }

                if (!isChallengingStage) {
                     if (enemies.length > 0) {
                         let attackGroupEnemies = null; const gridEnemies = enemies.filter(e => e?.state === 'in_grid'); const isLastFewEnemies = gridEnemies.length <= 3; const levelFactor = Math.max(1, Math.min(level, LEVEL_CAP_FOR_SCALING)); const baseAttackInterval = 4200; const minAttackInterval = 800; const levelReduction = (levelFactor - 1) * ((baseAttackInterval - minAttackInterval) / (LEVEL_CAP_FOR_SCALING -1)); const currentAttackInterval = Math.max(minAttackInterval, baseAttackInterval - levelReduction); const effectiveMaxAttackingEnemies = Math.round(scaleValue(level, BASE_MAX_ATTACKING_ENEMIES, MAX_MAX_ATTACKING_ENEMIES)); const attackingEnemiesCount = enemies.filter(e => e?.state === 'attacking' || e?.state === 'preparing_attack').length;
                         if ( isLastFewEnemies || (now - lastEnemyDetachTime > currentAttackInterval && gridEnemies.length > 0 && attackingEnemiesCount < effectiveMaxAttackingEnemies) ) {
                            attackGroupEnemies = findAndDetachEnemy();
                             if (attackGroupEnemies && attackGroupEnemies.length > 0) {
                                 const validAttackers = attackGroupEnemies.map(e => enemies.find(es => es?.id === e.id)).filter(e => e && e.state === 'in_grid');
                                 if (validAttackers.length > 0) {
                                     const leaderEnemy = validAttackers[0]; const attackType = leaderEnemy.attackType; if (!isLastFewEnemies) lastEnemyDetachTime = now;
                                     if (attackType === 'normal') {
                                         const sharedPath = generateAttackPathInternal(leaderEnemy);
                                         if (sharedPath && sharedPath.length > 0) { if (validAttackers.length === 3 && leaderEnemy.type === ENEMY3_TYPE && level !== 1) playSound('tripleAttackSound', false, 0.3); let sortedAttackers = [...validAttackers]; const groupSize = sortedAttackers.length; if (groupSize > 1) { let bossInGroup = null; let nonBossAttackers = []; sortedAttackers.forEach(attacker => { if (attacker.type === ENEMY3_TYPE) bossInGroup = attacker; else nonBossAttackers.push(attacker); }); if (bossInGroup && level !== 1 && groupSize === 3 && nonBossAttackers.length === 2) sortedAttackers = [nonBossAttackers[0], bossInGroup, nonBossAttackers[1]]; else sortedAttackers.sort((a, b) => (a?.gridCol ?? 0) - (b?.gridCol ?? 0)); const MINIMAL_GAP_BETWEEN_ATTACKERS = 5; let totalFormationWidth = 0; sortedAttackers = sortedAttackers.filter(attacker => attacker && typeof attacker.width === 'number'); const currentGroupSize = sortedAttackers.length; for (let k = 0; k < currentGroupSize; k++) { totalFormationWidth += sortedAttackers[k].width; if (k < currentGroupSize - 1) totalFormationWidth += MINIMAL_GAP_BETWEEN_ATTACKERS; } const formationStartOffsetX = -totalFormationWidth / 2; let currentOffsetX = formationStartOffsetX; for (let k = 0; k < currentGroupSize; k++) { const attacker = sortedAttackers[k]; attacker.attackFormationOffsetX = currentOffsetX + attacker.width / 2; currentOffsetX += attacker.width + MINIMAL_GAP_BETWEEN_ATTACKERS; } } else sortedAttackers.forEach(att => att.attackFormationOffsetX = 0); const attackGroupId = `attack-${leaderEnemy.id}-${now}`; sortedAttackers.forEach(attacker => { if(attacker) attacker.attackGroupId = attackGroupId });
                                             let shouldFire = false; let fireDelay = GROUP_FIRE_BURST_DELAY; if (leaderEnemy.type === ENEMY2_TYPE || leaderEnemy.type === ENEMY3_TYPE) { shouldFire = true; if(leaderEnemy.type === ENEMY2_TYPE && groupSize === 1) fireDelay = SOLO_BUTTERFLY_FIRE_DELAY; } else if (leaderEnemy.type === ENEMY1_TYPE) shouldFire = true; if (isLastFewEnemies && level > 1) shouldFire = false; if (shouldFire) { sortedAttackers.forEach(attacker => { const canAttackerFire = attacker && !(attacker.type === ENEMY3_TYPE && attacker.hasCapturedShip); if (canAttackerFire) fireEnemyBurst(attacker.id, 'attacking', fireDelay); }); }
                                             sortedAttackers.forEach((enemyToAttack, delayIndex) => {
                                                  if (enemyToAttack && enemyToAttack.state === 'in_grid') {
                                                     enemyToAttack.state = 'preparing_attack'; enemyToAttack.justReturned = false; enemyToAttack.velocityX = 0; enemyToAttack.velocityY = 0; enemyToAttack.canFireThisDive = false;
                                                     setTimeout(() => {
                                                         if (isPaused) return; const currentEnemyStateDelayed = enemies.find(e => e?.id === enemyToAttack.id);
                                                         if (currentEnemyStateDelayed && currentEnemyStateDelayed.state === 'preparing_attack') {
                                                             try { const effectiveBaseSpeed = scaleValue(level, BASE_ENEMY_ATTACK_SPEED, MAX_ENEMY_ATTACK_SPEED); let speedFactor = 1.0; if (currentEnemyStateDelayed.type === ENEMY1_TYPE) speedFactor = ENEMY1_DIVE_SPEED_FACTOR; else if (currentEnemyStateDelayed.type === ENEMY2_TYPE) speedFactor = ENEMY2_DIVE_SPEED_FACTOR; else if (currentEnemyStateDelayed.type === ENEMY3_TYPE) speedFactor = ENEMY3_ATTACK_SPEED_FACTOR; if(enemyToAttack.type === ENEMY3_TYPE) playSound('bossGalagaDiveSound', false, 0.2); else playSound('butterflyDiveSound', false, 0.2); currentEnemyStateDelayed.state = 'attacking'; currentEnemyStateDelayed.attackPathSegments = sharedPath; currentEnemyStateDelayed.attackPathSegmentIndex = 0; currentEnemyStateDelayed.attackPathT = 0; currentEnemyStateDelayed.speed = effectiveBaseSpeed * speedFactor; currentEnemyStateDelayed.lastFiredTime = 0; currentEnemyStateDelayed.canFireThisDive = true; } catch (attackStartError) { console.error(`Error starting attack for ${enemyToAttack.id}:`, attackStartError); }
                                                         }
                                                     }, delayIndex * GROUP_DETACH_DELAY_MS);
                                                 }
                                             });
                                         } else attackGroupEnemies.forEach(e => { if (e) e.justReturned = false; });
                                     }
                                 }
                             }
                         }
                     }
                 }
                enemies.forEach(enemy => { if (enemy && enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip && enemy.state === 'attacking' && enemy.capturedShipDimensions && typeof enemy.capturedShipLastFiredTime === 'number') { if (now - enemy.capturedShipLastFiredTime > CAPTURED_SHIP_FIRE_COOLDOWN_MS) { const capturedShipCenterX = enemy.x + enemy.width / 2; const capturedShipBottomY = enemy.y + enemy.height + enemy.capturedShipDimensions.height * 0.5; const firePos = { x: capturedShipCenterX, y: capturedShipBottomY }; if (createBulletSimple(enemy, firePos)) { enemy.capturedShipLastFiredTime = now; playSound('playerShootSound', false, 0.4); } } } });
            }
        } else if (gameOverSequenceStartTime > 0) {
            const elapsedTime = now - gameOverSequenceStartTime;
            const isShowingResults = elapsedTime >= GAME_OVER_DURATION;
            if (isShowingResults && !isShowingResultsScreen) {
                isShowingResultsScreen = true; stopSound('gameOverSound'); playSound('resultsMusicSound', true, 0.2);
                explosions = []; if(typeof updateExplosions === 'function') updateExplosions();
            }
        }

        if (!coopLevel1IntroIsCurrentlyActive) {
            renderGame();
        }


    } catch (error) {
         console.error("!!! CRITICAL ERROR IN runSingleGameUpdate !!!", error, error.stack);
         isPaused = false; if (mainLoopId) { cancelAnimationFrame(mainLoopId); mainLoopId = null; } isInGameState = false;
         isPlayer1ShowingGameOverMessage = false; player1GameOverMessageStartTime = 0;
         isPlayer2ShowingGameOverMessage = false; player2GameOverMessageStartTime = 0;
         isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = '';
         alert("A critical error occurred in the game loop. Please refresh."); stopAllGameSoundsInternal(); isGridSoundPlaying = false; isInvincible = false; invincibilityEndTime = 0;
         try { if(typeof showMenuState === 'function') { showMenuState(); } } catch (menuError) { console.error("Failed to return to menu after critical error:", menuError); }
    }
}


/**
 * Checks if the current score warrants an extra life and awards it based on per-player thresholds.
 */
function checkAndAwardExtraLife(playerNumber = null) { // playerNumber kan null zijn voor CO-OP (beide checken)
    try {
        const playersToCheck = [];
        if (playerNumber === 1) { // P1 specifiek
            const lives = (isTwoPlayerMode && selectedGameMode === 'coop') ? player1Lives : ((isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 1) ? playerLives : player1Lives );
            const scoreVal = (isTwoPlayerMode && selectedGameMode === 'coop') ? player1Score : ((isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 1) ? score : player1Score );
            playersToCheck.push({ num: 1, currentLives: lives, currentScore: scoreVal, thresholdsMet: player1LifeThresholdsMet });
        } else if (playerNumber === 2 && isTwoPlayerMode) { // P2 specifiek
            const lives = (selectedGameMode === 'coop') ? player2Lives : ((selectedGameMode === 'normal' && currentPlayer === 2) ? playerLives : player2Lives);
            const scoreVal = (selectedGameMode === 'coop') ? player2Score : ((selectedGameMode === 'normal' && currentPlayer === 2) ? score : player2Score);
            playersToCheck.push({ num: 2, currentLives: lives, currentScore: scoreVal, thresholdsMet: player2LifeThresholdsMet });
        } else if (isTwoPlayerMode && selectedGameMode === 'coop' && playerNumber === null) { // Beide spelers in CO-OP
            playersToCheck.push({ num: 1, currentLives: player1Lives, currentScore: player1Score, thresholdsMet: player1LifeThresholdsMet });
            playersToCheck.push({ num: 2, currentLives: player2Lives, currentScore: player2Score, thresholdsMet: player2LifeThresholdsMet });
        } else if (!isTwoPlayerMode && (playerNumber === null || playerNumber === 1)) { // 1P Classic
             playersToCheck.push({ num: 1, currentLives: playerLives, currentScore: score, thresholdsMet: player1LifeThresholdsMet });
        } else if (isTwoPlayerMode && selectedGameMode === 'normal' && playerNumber === currentPlayer) { // Actieve speler in 2P Normal (Human of vs AI)
             if (currentPlayer === 1) {
                playersToCheck.push({ num: 1, currentLives: playerLives, currentScore: score, thresholdsMet: player1LifeThresholdsMet });
             } else { // currentPlayer === 2
                playersToCheck.push({ num: 2, currentLives: playerLives, currentScore: score, thresholdsMet: player2LifeThresholdsMet });
             }
        }


        playersToCheck.forEach(playerData => {
            let awardedLifeNowForThisPlayer = false;
            while (true) {
                 let lifeAwardedThisIteration = false;
                 let nextThreshold = -1;
                 const thresholdsAlreadyMetCount = playerData.thresholdsMet.size;

                 if (thresholdsAlreadyMetCount === 0) {
                     nextThreshold = EXTRA_LIFE_THRESHOLD_1;
                 } else if (thresholdsAlreadyMetCount === 1 && !playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_2)) {
                     nextThreshold = EXTRA_LIFE_THRESHOLD_2;
                 } else if (thresholdsAlreadyMetCount >=1 && playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_1) && playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_2)) {
                     let recurringMetCount = 0;
                     playerData.thresholdsMet.forEach(t => {
                         if (t >= EXTRA_LIFE_THRESHOLD_2 && ((t - EXTRA_LIFE_THRESHOLD_2) % RECURRING_EXTRA_LIFE_INTERVAL === 0)) {
                             recurringMetCount++;
                         }
                     });
                     nextThreshold = EXTRA_LIFE_THRESHOLD_2 + recurringMetCount * RECURRING_EXTRA_LIFE_INTERVAL;
                 } else if (thresholdsAlreadyMetCount === 1 && playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_1) && !playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_2)){
                    nextThreshold = EXTRA_LIFE_THRESHOLD_2;
                 }
                 else if (thresholdsAlreadyMetCount === 1 && playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_2) && !playerData.thresholdsMet.has(EXTRA_LIFE_THRESHOLD_1)) {
                     nextThreshold = EXTRA_LIFE_THRESHOLD_1;
                 }


                 if (nextThreshold !== -1 && playerData.currentScore >= nextThreshold && !playerData.thresholdsMet.has(nextThreshold)) {
                     if (playerData.num === 1) {
                         if(isTwoPlayerMode && selectedGameMode === 'coop') player1Lives++;
                         else if (isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 1) playerLives++; // P1's beurt
                         else if (!isTwoPlayerMode) playerLives++; // 1P Classic
                         player1Lives = (isTwoPlayerMode && selectedGameMode === 'coop') ? player1Lives : ((isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 1) ? playerLives : player1Lives );
                         playerData.currentLives = player1Lives;
                     } else if (playerData.num === 2) { // Alleen relevant voor 2P modes
                         if(isTwoPlayerMode && selectedGameMode === 'coop') player2Lives++;
                         else if (isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 2) playerLives++; // P2's beurt
                         player2Lives = (isTwoPlayerMode && selectedGameMode === 'coop') ? player2Lives : ((isTwoPlayerMode && selectedGameMode === 'normal' && currentPlayer === 2) ? playerLives : player2Lives);
                         playerData.currentLives = player2Lives;
                     }

                     playerData.thresholdsMet.add(nextThreshold);
                     awardedLifeNowForThisPlayer = true;
                     lifeAwardedThisIteration = true;
                 }

                 if (!lifeAwardedThisIteration) {
                     break;
                 }
            }

            if (awardedLifeNowForThisPlayer && !showExtraLifeMessage && !showCsBonusScoreMessage && !showPerfectMessage && !showCsHitsMessage && !showCSClearMessage && !showReadyMessage) {
                 setTimeout(() => {
                    if (isInGameState) {
                        explosions = [];
                        if(typeof updateExplosions === 'function') updateExplosions();
                        showExtraLifeMessage = true;
                        extraLifeMessageStartTime = Date.now();
                        playSound('extraLifeSound', false, 0.5);
                    }
                 }, EXPLOSION_DURATION);
            }
        });
    } catch (e) { console.error("Error checking/awarding extra life:", e); }
}


// --- EINDE deel 8      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---