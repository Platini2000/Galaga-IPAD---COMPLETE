// --- START OF FILE setup_utils.js ---
// --- DEEL 1      van 3 dit code blok    ---

const
    // Enemy Types (Needs to be defined BEFORE game_logic.js uses them)
    ENEMY1_TYPE = 'enemy1', ENEMY2_TYPE = 'enemy2', ENEMY3_TYPE = 'enemy3',

    // Basis Afmetingen (Vijanden & Schip) - Nodig voor paden & vroege logica
    ENEMY_WIDTH = 40, ENEMY_HEIGHT = 40,
    ENEMY1_SCALE_FACTOR = 1.33,
    ENEMY1_WIDTH = Math.round(ENEMY_WIDTH * ENEMY1_SCALE_FACTOR),
    ENEMY1_HEIGHT = Math.round(ENEMY_HEIGHT * ENEMY1_SCALE_FACTOR),
    BOSS_SCALE_FACTOR = 1.50,
    BOSS_WIDTH = Math.round(ENEMY_WIDTH * BOSS_SCALE_FACTOR),
    BOSS_HEIGHT = Math.round(ENEMY_HEIGHT * BOSS_SCALE_FACTOR),
    SHIP_WIDTH = 50, SHIP_HEIGHT = 50, SHIP_BOTTOM_MARGIN = 30, SHIP_MOVE_SPEED = 10,
    COOP_SHIP_HORIZONTAL_OFFSET_FACTOR = 0.15,

    // Challenging Stage Basis Info - Nodig voor initialisatie & pad selectie
    CHALLENGING_STAGE_ENEMY_COUNT = 40,
    CHALLENGING_STAGE_SQUADRON_SIZE = 5,
    CHALLENGING_STAGE_SQUADRON_COUNT = CHALLENGING_STAGE_ENEMY_COUNT / CHALLENGING_STAGE_SQUADRON_SIZE,
    BASE_CS_SPEED_MULTIPLIER = 4.2,
    MAX_CS_SPEED_MULTIPLIER = 5.0,
    CS_HORIZONTAL_FLYBY_SPEED_FACTOR = 0.35,
    CS_ENEMY_SPAWN_DELAY_IN_SQUADRON = 80,
    CS_HORIZONTAL_FLYBY_SPAWN_DELAY = -25,
    CS_LOOP_ATTACK_SPAWN_DELAY = 35,
    CHALLENGING_STAGE_SQUADRON_INTERVAL = 3000,

    PATH_T_OFFSET_PER_ENEMY = 0.05,
    ENEMY2_MAX_HITS = 1, ENEMY3_MAX_HITS = 2,
    LEVEL_CAP_FOR_SCALING = 50,
    BASE_GRID_FIRE_INTERVAL = 2800, MIN_GRID_FIRE_INTERVAL = 700,
    BASE_GRID_FIRE_PROBABILITY = 0.04, MAX_GRID_FIRE_PROBABILITY = 0.18,
    BASE_GRID_MAX_FIRING_ENEMIES = 7, MAX_GRID_MAX_FIRING_ENEMIES = 16,
    BASE_RETURN_SPEED_FACTOR = 1.5, MAX_RETURN_SPEED_FACTOR = 2.5,
    PLAYER_GAME_OVER_MESSAGE_DURATION_COOP = 3000,
    AI_CAPTURE_BEAM_APPROACH_DELAY_MS = 2000,
    COOP_AI_CAPTURE_DIVE_ANTICIPATION_DURATION_MS = 3000,
    COOP_AI_SAVE_PARTNER_DELAY_MS = 10000,

    // <<< Touch Input Constanten (toegevoegd) >>>
    TAP_DURATION_THRESHOLD = 250, // Max ms voor een tik vs sleep
    MIN_DRAG_DISTANCE_FOR_TAP_CANCEL = 10, // pixels, alleen X-as voor schip
    MIN_DRAG_TIME_FOR_TAP_CANCEL = 80 // ms
;


// --- Globale State Variabelen ---
let starrySkyCanvas, starryCtx, retroGridCanvas, retroGridCtx, gameCanvas, gameCtx;
let stars = [];
let gridOffsetY = 0;
let isInGameState = false;
let isShowingScoreScreen = false;
let scoreScreenStartTime = 0;
let highScore = 20000;
let playerLives = 3;
let score = 0;
let level = 1;
let isTwoPlayerMode = false;
let selectedGameMode = 'normal'; // 'normal', 'coop'
let currentPlayer = 1;
let player1Lives = 3;
let player2Lives = 3;
let player1Score = 0;
let player2Score = 0;
let player1CompletedLevel = -1;
let player1MaxLevelReached = 1;
let player2MaxLevelReached = 1;

// Menu State Variabelen
let isPlayerSelectMode = false;
let isOnePlayerGameTypeSelectMode = false;
let isOnePlayerNormalGameSubTypeSelectMode = false;
let isOnePlayerVsAIGameTypeSelectMode = false;
let isGameModeSelectMode = false;
let isFiringModeSelectMode = false;

let selectedFiringMode = 'rapid';
let selectedOnePlayerGameVariant = '';
let isPlayerTwoAI = false;

let p1JustFiredSingle = false;
let p2JustFiredSingle = false;
let p1FireInputWasDown = false;
let p2FireInputWasDown = false;
let scoreEarnedThisCS = 0;
let player1LifeThresholdsMet = new Set();
let player2LifeThresholdsMet = new Set();
let isManualControl = false; let isShowingDemoText = false; let autoStartTimerId = null; let gameJustStarted = false; let mainLoopId = null;
let isShowingIntro = false; let introStep = 0; let introDisplayStartTime = 0; let lastMouseMoveResetTime = 0;
let isChallengingStage = false;
let isFullGridWave = false;
let isWaveTransitioning = false;
let showCsHitsMessage = false; let csHitsMessageStartTime = 0;
let showExtraLifeMessage = false; let extraLifeMessageStartTime = 0;
let showPerfectMessage = false; let perfectMessageStartTime = 0;
let showCSClearMessage = false; let csClearMessageStartTime = 0;
let showCsHitsForClearMessage = false; showCsScoreForClearMessage = false;
let showReadyMessage = false; let readyMessageStartTime = 0;
let showCsBonusScoreMessage = false; let csBonusScoreMessageStartTime = 0;
let readyForNextWave = false; let readyForNextWaveReset = false;
let isCsCompletionDelayActive = false; let csCompletionDelayStartTime = 0;
let csCompletionResultIsPerfect = false;
let csIntroSoundPlayed = false;
let playerIntroSoundPlayed = false;
let stageIntroSoundPlayed = false;
let playLevelUpAfterCSBonus = false;

let isShowingPlayerGameOverMessage = false;
let playerGameOverMessageStartTime = 0;
let playerWhoIsGameOver = 0;
let nextActionAfterPlayerGameOver = '';

let isPlayer1ShowingGameOverMessage = false;
let player1GameOverMessageStartTime = 0;
let isPlayer2ShowingGameOverMessage = false;
let player2GameOverMessageStartTime = 0;


let forceCenterShipNextReset = false;
let isShipCaptured = false;
let isPlayer1ShipCaptured = false;
let isPlayer2ShipCaptured = false;
let capturingBossId = null;
let captureBeamActive = false;
let captureBeamSource = { x: 0, y: 0 };
let captureBeamTargetY = 0;
let captureBeamProgress = 0;
let captureAttemptMadeThisLevel = false;
let isWaitingForRespawn = false;
let isPlayer1WaitingForRespawn = false;
let isPlayer2WaitingForRespawn = false;
let respawnTime = 0;
let player1RespawnTime = 0;
let player2RespawnTime = 0;
let isInvincible = false;
let isPlayer1Invincible = false;
let isPlayer2Invincible = false;
let invincibilityEndTime = 0;
let player1InvincibilityEndTime = 0;
let player2InvincibilityEndTime = 0;
let fallingShips = [];
let isDualShipActive = false;
let player1IsDualShipActive = false;
let player2IsDualShipActive = false;
let isShowingCaptureMessage = false;
let captureMessageStartTime = 0;
let capturedBossIdWithMessage = null;
let enemies = [];
let normalWaveEntrancePaths = {}; let challengingStagePaths = {};
let currentWaveDefinition = null; let isEntrancePhaseActive = false;
let enemySpawnTimeouts = []; let totalEnemiesScheduledForWave = 0; let enemiesSpawnedThisWave = 0;
let lastEnemyDetachTime = 0; let gridMoveDirection = 1;
let lastGridFireCheckTime = 0;
let firstEnemyLanded = false;
let currentGridOffsetX = 0; let challengingStageEnemiesHit = 0;
let challengingStageTotalEnemies = CHALLENGING_STAGE_ENEMY_COUNT;
let isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0;
let ship = { x: 0, y: 0, width: SHIP_WIDTH, height: SHIP_HEIGHT, speed: SHIP_MOVE_SPEED, targetX: 0, id: 'main' };
let ship1 = null;
let ship2 = null;
let leftPressed = false; let rightPressed = false; let shootPressed = false;
let p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
let keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
let keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
let bullets = [];
let enemyBullets = []; let explosions = [];
let hitSparks = [];
let playerLastShotTime = 0;
let player1LastShotTime = 0;
let player2LastShotTime = 0;
let aiLastShotTime = 0;
let aiCanShootTime = 0;
let connectedGamepadIndex = null; let connectedGamepadIndexP2 = null;
let previousButtonStates = []; let previousDemoButtonStates = []; let previousGameButtonStates = []; let previousGameButtonStatesP2 = [];
let selectedButtonIndex = -1; let joystickMovedVerticallyLastFrame = false;
let isGridSoundPlaying = false;
let gridJustCompleted = false;
let player1ShotsFired = 0;
let player2ShotsFired = 0;
let player1EnemiesHit = 0;
let player2EnemiesHit = 0;
let isShowingResultsScreen = false;
let gameOverSequenceStartTime = 0; let gameStartTime = 0;
let visualOffsetX = -20; let floatingScores = [];
let csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
let normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null;
let squadronCompletionStatus = {}; let squadronEntranceFiringStatus = {}; let isPaused = false;
let mouseIdleTimerId = null;
let initialGameStartSoundPlayedThisSession = false;
let coopStartSoundPlayedThisSession = false;
let wasLastGameAIDemo = false;
let player1TriggeredHighScoreSound = false;
let player2TriggeredHighScoreSound = false;
let isShowingCoopPlayersReady = false;
let coopPlayersReadyStartTime = 0;
let gameJustStartedAndWaveLaunched = false;

let isCoopAIDemoActive = false;
let demoModeCounter = 0;
let smoothedShip1X = undefined;
let smoothedShip2X = undefined;
let aiShip1TargetEnemy = null;
let aiShip2TargetEnemy = null;
let aiShip1CanShootTime = 0;
let aiShip2CanShootTime = 0;
let aiShip1LastShotTime = 0;
let aiShip2LastShotTime = 0;
let aiPlayerActivelySeekingCaptureById = null;
let coopAICaptureDiveAnticipationActive = false;
let coopAICaptureDiveAnticipationEndTime = 0;
let player1CaptureRespawnX = 0;
let player2CaptureRespawnX = 0;
let player1NeedsRespawnAfterCapture = false;
let player2NeedsRespawnAfterCapture = false;
let capturedShipRespawnX_NormalMode = 0;
let coopPartner1CapturedTime = 0;
let coopPartner2CapturedTime = 0;

// <<< Touch Input State Variabelen (toegevoegd) >>>
let isTouching = false;
let touchCurrentX = 0;
let touchStartX = 0; // Positie waar touch begon
let isDraggingShip = false;
let shipTouchOffsetX = 0; // Offset van touch t.o.v. midden van schip
let lastTapTime = 0;    // Tijdstip van laatste tap start
let touchJustFiredSingle = false; // Vlag voor single shot met touch
let isTouchFiringActive = false; // Vlag voor continu touch vuur
// <<< EINDE Touch Input State Variabelen >>>


// --- Afbeeldingen & Geluiden ---
const shipImage = new Image(), beeImage = new Image(), butterflyImage = new Image(), bossGalagaImage = new Image(), bulletImage = new Image(), enemyBulletImage = new Image(), logoImage = new Image();
shipImage.src = 'Afbeeldingen/spaceship.png'; beeImage.src = 'Afbeeldingen/bee.png'; bulletImage.src = 'Afbeeldingen/bullet.png'; bossGalagaImage.src = 'Afbeeldingen/bossGalaga.png'; butterflyImage.src = 'Afbeeldingen/butterfly.png'; logoImage.src = 'Afbeeldingen/Logo.png';
enemyBulletImage.src = 'Afbeeldingen/bullet-enemy.png';
const beeImage2 = new Image(), butterflyImage2 = new Image(), bossGalagaImage2 = new Image();
beeImage2.src = 'Afbeeldingen/bee-2.png'; butterflyImage2.src = 'Afbeeldingen/butterfly-2.png'; bossGalagaImage2.src = 'Afbeeldingen/bossGalaga-2.png';
const level1Image = new Image(), level5Image = new Image(), level10Image = new Image(), level20Image = new Image(), level30Image = new Image(), level50Image = new Image();
level1Image.src = 'Afbeeldingen/Level-1.png'; level5Image.src = 'Afbeeldingen/Level-5.png'; level10Image.src = 'Afbeeldingen/Level-10.png'; level20Image.src = 'Afbeeldingen/Level-20.png'; level30Image.src = 'Afbeeldingen/Level-30.png'; level50Image.src = 'Afbeeldingen/Level-50.png';

// Web Audio API
let audioContext;
let soundBuffers = {};
let soundSources = {}; // To keep track of active sound sources for stopping
let soundGainNodes = {}; // To control volume per sound
let audioContextInitialized = false;

const soundPaths = {
    captureSound: "Geluiden/Capture.mp3",
    shipCapturedSound: "Geluiden/Capture-ship.mp3",
    dualShipSound: "Geluiden/coin.mp3",
    playerShootSound: "Geluiden/firing.mp3",
    explosionSound: "Geluiden/kill.mp3",
    gameOverSound: "Geluiden/gameover.mp3",
    lostLifeSound: "Geluiden/lost-live.mp3",
    entranceSound: "Geluiden/Entree.mp3",
    bossGalagaDiveSound: "Geluiden/Enemy2.mp3",
    levelUpSound: "Geluiden/LevelUp.mp3",
    enemyShootSound: "Geluiden/Fire-enemy.mp3",
    butterflyDiveSound: "Geluiden/flying.mp3",
    startSound: "Geluiden/Start.mp3",
    coinSound: "Geluiden/coin.mp3", // duplicate of dualShipSound, maybe consolidate
    beeHitSound: "Geluiden/Bees-hit.mp3",
    butterflyHitSound: "Geluiden/Butterfly-hit.mp3",
    bossHit1Sound: "Geluiden/Boss-hit1.mp3",
    bossHit2Sound: "Geluiden/Boss-hit2.mp3",
    gridBackgroundSound: "Geluiden/Achtergrond-grid.mp3",
    extraLifeSound: "Geluiden/Extra-Leven.mp3",
    csPerfectSound: "Geluiden/CS-Stage-Perfect-.mp3",
    csClearSound: "Geluiden/CS-Clear.mp3",
    waveUpSound: "Geluiden/Waveup.mp3",
    menuMusicSound: "Geluiden/Menu-music.mp3",
    readySound: "Geluiden/ready.mp3",
    tripleAttackSound: "Geluiden/Triple.mp3",
    resultsMusicSound: "Geluiden/results-music.mp3",
    hiScoreSound: "Geluiden/hi-score.mp3"
};


// --- EINDE deel 1      van 3 dit codeblok ---
// --- END OF FILE setup_utils.js ---







// --- START OF FILE setup_utils.js ---
// --- DEEL 2      van 3 dit code blok    ---

const

    BASE_ENEMY_BULLET_SPEED = 9,
    MAX_ENEMY_BULLET_SPEED = 9,
    BASE_ENEMY_ATTACK_SPEED = 5.5,
    MAX_ENEMY_ATTACK_SPEED = 8.0,
    BASE_MAX_ATTACKING_ENEMIES = 10,
    MAX_MAX_ATTACKING_ENEMIES = 22,
    BASE_GRID_MOVE_SPEED = 0.3,
    MAX_GRID_MOVE_SPEED = 0.7,
    BASE_GRID_BREATH_CYCLE_MS = 2000,
    MIN_GRID_BREATH_CYCLE_MS = 1000,
    BASE_ENEMY_BULLET_BURST_COUNT = 1,
    MAX_ENEMY_BULLET_BURST_COUNT = 5,
    BASE_ENEMY_AIM_FACTOR = 0.75,
    MAX_ENEMY_AIM_FACTOR = 0.95,
    BASE_BEE_GROUP_ATTACK_PROBABILITY = 0.05,
    MAX_BEE_GROUP_ATTACK_PROBABILITY = 0.40,
    BASE_BEE_TRIPLE_ATTACK_PROBABILITY = 0.10,
    MAX_BEE_TRIPLE_ATTACK_PROBABILITY = 0.50,

    // --- Bestaande constanten ---
    PLAYER_BULLET_WIDTH = 5, PLAYER_BULLET_HEIGHT = 15, PLAYER_BULLET_SPEED = 14,
    DUAL_SHIP_BULLET_OFFSET_X = SHIP_WIDTH * 0.5,
    ENEMY_BULLET_WIDTH = 4, ENEMY_BULLET_HEIGHT = 12,
    NUM_STARS = 500, MAX_STAR_RADIUS = 1.5, MIN_STAR_RADIUS = 0.5, TWINKLE_SPEED = 0.015, BASE_PARALLAX_SPEED = 0.3, PARALLAX_SPEED_FACTOR = 2.0, STAR_FADE_START_FACTOR_ABOVE_HORIZON = 0.25,
    GRID_RGB_PART = "100, 180, 255", GRID_BASE_ALPHA = 0.8, GRID_MIN_ALPHA = 0.3, GRID_FIXED_LINES_ALPHA = 0.5, GRID_LINE_COLOR_FIXED = `rgba(${GRID_RGB_PART}, ${GRID_FIXED_LINES_ALPHA})`, GRID_LINE_WIDTH = 2,
    GRID_SPEED = 0.4,
    GRID_HORIZON_Y_FACTOR = 0.74, GRID_BASE_SPACING = 15, GRID_SPACING_POWER = 2.0, GRID_HORIZONTAL_LINE_WIDTH_FACTOR = 1.5, GRID_NUM_PERSPECTIVE_LINES = 14, GRID_HORIZON_SPREAD_FACTOR = 1.2, GRID_BOTTOM_SPREAD_FACTOR = 2.0, GRID_PERSPECTIVE_POWER = 1.0,
    MENU_INACTIVITY_TIMEOUT = 20000, SCORE_SCREEN_DURATION = 20000,
    ENTRANCE_SPEED = 6,
    BASE_RETURN_SPEED = ENTRANCE_SPEED,
    NORMAL_ENTRANCE_PATH_SPEED = 0.013934592,
    BOSS_LOOP_ENTRANCE_PATH_SPEED = 0.055738368,
    ENEMY_SPAWN_DELAY_IN_SQUADRON = 100,
    ENTRANCE_PAIR_HORIZONTAL_GAP = 5,
    ENTRANCE_PAIR_PATH_T_OFFSET = 0.00,
    NORMAL_WAVE_SQUADRON_INTERVAL = 1800,
    ENTRANCE_FIRE_BURST_DELAY_MS = 80,
    CS_ENTRANCE_PATH_SPEED = 0.0032,
    CS_COMPLETION_MESSAGE_DELAY = 1000,
    ENEMY_ANIMATION_INTERVAL_MS = 250,
    AXIS_DEAD_ZONE_MENU = 0.3,
    AXIS_DEAD_ZONE_GAMEPLAY = 0.15,
    PS5_BUTTON_CROSS = 0, PS5_BUTTON_CIRCLE = 1, PS5_BUTTON_TRIANGLE = 3, PS5_BUTTON_R1 = 5, PS5_DPAD_UP = 12, PS5_DPAD_DOWN = 13, PS5_DPAD_LEFT = 14, PS5_DPAD_RIGHT = 15, PS5_LEFT_STICK_X = 0, PS5_LEFT_STICK_Y = 1,
    SHOOT_COOLDOWN = 140,
    CS_MULTI_BULLET_COUNT = 2,
    CS_MULTI_BULLET_SPREAD_ANGLE_DEG = 8,
    GRID_ROWS = 5, GRID_COLS = 10,
    ENEMY_V_SPACING = 20,
    ENEMY_H_SPACING_FIXED = 30,
    ENEMY_TOP_MARGIN = 117,
    GRID_HORIZONTAL_MARGIN_PERCENT = 0.18,
    GRID_BREATH_ENABLED = true,
    GRID_BREATH_MAX_EXTRA_H_SPACING_FACTOR = 0.5,
    GRID_BREATH_MAX_EXTRA_V_SPACING_FACTOR = 0.3,
    ENEMY1_DIVE_SPEED_FACTOR = 0.65,
    ENEMY2_DIVE_SPEED_FACTOR = 0.75,
    ENEMY3_ATTACK_SPEED_FACTOR = 0.80,
    BOSS_CAPTURE_DIVE_SPEED_FACTOR = 0.85,
    GROUP_DETACH_DELAY_MS = 80,
    GROUP_FIRE_BURST_DELAY = 600,
    SOLO_BUTTERFLY_FIRE_DELAY = 600,
    BOSS_CAPTURE_DIVE_PROBABILITY = 0.15,
    CAPTURE_DIVE_SIDE_MARGIN_FACTOR = 0.15,
    CAPTURE_DIVE_BOTTOM_HOVER_Y_FACTOR = 0.70,
    CAPTURE_BEAM_DURATION_MS = 5000,
    CAPTURE_BEAM_ANIMATION_DURATION_MS = 500,
    CAPTURE_BEAM_WIDTH_TOP_FACTOR = 0.7,
    CAPTURE_BEAM_WIDTH_BOTTOM_FACTOR = 1.8,
    CAPTURE_BEAM_COLOR_START = 'rgba(180, 180, 255, 0.1)',
    CAPTURE_BEAM_COLOR_END = 'rgba(220, 220, 255, 0.6)',
    CAPTURE_BEAM_PULSE_SPEED = 0.004,
    CAPTURED_SHIP_SCALE = 1.0,
    CAPTURED_SHIP_OFFSET_X = (BOSS_WIDTH - SHIP_WIDTH) / 2,
    CAPTURED_SHIP_OFFSET_Y = -SHIP_HEIGHT * 0.5,
    CAPTURE_MESSAGE_DURATION = 3000,
    CAPTURED_SHIP_TINT_COLOR = 'rgba(255, 150, 150, 0.55)',
    CAPTURED_SHIP_FIRE_COOLDOWN_MS = 500,
    RESPAWN_DELAY_MS = 2000,
    INVINCIBILITY_DURATION_MS = 2000,
    INVINCIBILITY_BLINK_ON_MS = 100,
    INVINCIBILITY_BLINK_OFF_MS = 50,
    FALLING_SHIP_SPEED = 3.5,
    FALLING_SHIP_FADE_DURATION_MS = 1500,
    FALLING_SHIP_ROTATION_DURATION_MS = 1500,
    FALLING_SHIP_ROTATION_SPEED = 0.1,
    DUAL_SHIP_DOCK_TIME_MS = 1000,
    DUAL_SHIP_OFFSET_X = SHIP_WIDTH,
    AUTO_DOCK_THRESHOLD = 20,
    FLOATING_SCORE_DURATION = 500,
    FLOATING_SCORE_APPEAR_DELAY = -50,
    FLOATING_SCORE_FONT = "bold 12px 'Press Start 2P'",
    FLOATING_SCORE_OPACITY = 0.5,
    FLOATING_SCORE_COLOR_GRID = "cyan",
    FLOATING_SCORE_COLOR_ACTIVE = "red",
    FLOATING_SCORE_COLOR_CS_CHAIN = "cyan",
    CS_CHAIN_SCORE_THRESHOLD = 4,
    CS_CHAIN_BREAK_TIME_MS = 500,
    NORMAL_WAVE_CHAIN_BONUS_ENABLED = false,
    NORMAL_WAVE_CHAIN_SCORE_THRESHOLD = 4,
    NORMAL_WAVE_CHAIN_BREAK_TIME_MS = 750,
    EXPLOSION_DURATION = 650, EXPLOSION_PARTICLE_COUNT = 25, EXPLOSION_MAX_SPEED = 5.5, EXPLOSION_MIN_SPEED = 1.5, EXPLOSION_PARTICLE_RADIUS = 4, EXPLOSION_FADE_SPEED = 2.8, EXPLOSION_MAX_OPACITY = 0.8,
    HIT_SPARK_COUNT = 8, HIT_SPARK_LIFETIME = 1500, HIT_SPARK_SPEED = 4.5, HIT_SPARK_SIZE = 2.5, HIT_SPARK_COLOR = 'rgba(255, 255, 180, 0.9)', HIT_SPARK_GRAVITY = 0.05, HIT_SPARK_FADE_SPEED = 1.0 / HIT_SPARK_LIFETIME,
    UI_TEXT_MARGIN_TOP = 35,
    UI_1UP_BLINK_ON_MS = 600, UI_1UP_BLINK_OFF_MS = 400, UI_1UP_BLINK_CYCLE_MS = UI_1UP_BLINK_ON_MS + UI_1UP_BLINK_OFF_MS,
    AI_SHOOT_COOLDOWN = 140, AI_STABILIZATION_DURATION = 500, AI_POSITION_MOVE_SPEED_FACTOR = 1.2,
    AI_COLLISION_LOOKAHEAD = SHIP_HEIGHT * 3.5, AI_COLLISION_BUFFER = SHIP_WIDTH * 0.6,
    FINAL_DODGE_LOOKAHEAD = AI_COLLISION_LOOKAHEAD * 4.5,
    FINAL_DODGE_BUFFER_BASE = AI_COLLISION_BUFFER * 3.5,
    ENTRANCE_BULLET_DODGE_LOOKAHEAD = FINAL_DODGE_LOOKAHEAD * 1.1,
    ENTRANCE_BULLET_DODGE_BUFFER = FINAL_DODGE_BUFFER_BASE * 1.1,
    FINAL_AI_DODGE_MOVE_SPEED_FACTOR = 3.8,
    AI_SHOOT_ALIGNMENT_THRESHOLD = 0.15, AI_SHOT_CLEARANCE_BUFFER = PLAYER_BULLET_WIDTH * 1.5, MAX_PREDICTION_TIME_CS = 0.7, NORMAL_MOVE_FRACTION = 0.08, CS_AI_MOVE_FRACTION = 0.16,
    AI_SMOOTHING_FACTOR_MOVE = 0.05,
    CS_MOVE_SPEED_FACTOR = 1.8, NORMAL_WAVE_ATTACKING_DODGE_BUFFER_MULTIPLIER = 1.2, NORMAL_WAVE_ATTACKING_DODGE_SPEED_MULTIPLIER = 1.1, STABILIZE_MOVE_FRACTION = 0.05, ENTRANCE_DODGE_MOVE_FRACTION = 0.15,
    AI_MOVEMENT_DEADZONE = 0.8,
    AI_SMOOTHING_FACTOR = 0.1, AI_EDGE_BUFFER = SHIP_WIDTH * 0.5, AI_ANTI_CORNER_BUFFER = AI_EDGE_BUFFER * 2.5, BEE_DODGE_BUFFER_HORIZONTAL_FACTOR = 1.5, FINAL_SHOOT_ALIGNMENT_THRESHOLD = 2.0, GRID_SHOOT_ALIGNMENT_FACTOR = 1.5, ENTRANCE_SHOOT_ALIGNMENT_FACTOR = 1.2, ENTRANCE_AI_DODGE_MOVE_SPEED_FACTOR = 4.0, AI_WIGGLE_AMPLITUDE = SHIP_WIDTH * 0.15, AI_WIGGLE_PERIOD = 3000, AI_EDGE_SHOOT_BUFFER_FACTOR = 2.0, AI_EDGE_SHOOT_TARGET_THRESHOLD_FACTOR = 0.75, ENTRANCE_SHOOT_BULLET_CHECK_LOOKAHEAD = SHIP_HEIGHT * 1.5, ENTRANCE_SHOOT_BULLET_CHECK_BUFFER = SHIP_WIDTH * 0.8, MAX_PREDICTION_TIME = 0.8, LOCAL_CS_POSITION_MIN_X = 0, LOCAL_CS_POSITION_MAX_X = 0, CS_SHOOTING_MOVE_FRACTION = 0.25, CS_SHOOTING_MOVE_SPEED_FACTOR = 2.0, CS_PREDICTION_FACTOR = 1.0, AI_CAPTURE_WAIT_DURATION_MS = 2000,
    INTRO_DURATION_PER_STEP = 4000,
    TWO_PLAYER_STAGE_INTRO_DURATION = 4000,
    READY_MESSAGE_DURATION = 3000,
    CS_HITS_MESSAGE_DURATION = 1000,
    CS_PERFECT_MESSAGE_DURATION = 1000,
    CS_BONUS_MESSAGE_DURATION = 8000,
    CS_CLEAR_DELAY = 8000,
    CS_CLEAR_HITS_DELAY = 1000,
    CS_CLEAR_SCORE_DELAY = 2000,
    EXTRA_LIFE_MESSAGE_DURATION = 3000,
    RECURRING_EXTRA_LIFE_INTERVAL = 70000,
    POST_MESSAGE_RESET_DELAY = 1000,
    EXTRA_LIFE_THRESHOLD_1 = 20000,
    EXTRA_LIFE_THRESHOLD_2 = 70000
;

const GAME_OVER_DURATION = 5000;

const waveEntrancePatterns = [
    [ { pathId: 'new_path_left', enemies: [ { type: ENEMY2_TYPE, gridRow: 1, gridCol: 4, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 5, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 4, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 5, entrancePathId: 'new_path_left' } ]}, { pathId: 'new_path_right', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 4, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 5, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 4, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 5, entrancePathId: 'new_path_right' } ]}, { pathId: 'boss_loop_left', enemies: [ { type: ENEMY3_TYPE, gridRow: 0, gridCol: 4, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 5, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 3, entrancePathId: 'boss_loop_left' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 6, entrancePathId: 'boss_loop_left' }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 3, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 6, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 3, entrancePathId: 'boss_loop_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 6, entrancePathId: 'boss_loop_left' } ]}, { pathId: 'boss_loop_right', enemies: [ { type: ENEMY2_TYPE, gridRow: 1, gridCol: 1, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 2, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 7, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 8, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 1, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 2, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 7, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 8, entrancePathId: 'boss_loop_right' } ]}, { pathId: 'mid_curve_left', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 6, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 7, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 8, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 9, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 6, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 7, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 8, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 9, entrancePathId: 'mid_curve_left' } ]}, { pathId: 'mid_curve_right', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 0, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 1, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 2, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 3, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 0, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 1, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 2, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 3, entrancePathId: 'mid_curve_right' } ]} ],
    [ { pathId: 'new_path_left', enemies: [ { type: ENEMY2_TYPE, gridRow: 1, gridCol: 4, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 5, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 4, entrancePathId: 'new_path_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 5, entrancePathId: 'new_path_left' } ]}, { pathId: 'new_path_right', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 4, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 5, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 4, entrancePathId: 'new_path_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 5, entrancePathId: 'new_path_right' } ]}, { pathId: 'boss_loop_left', enemies: [ { type: ENEMY3_TYPE, gridRow: 0, gridCol: 4, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 5, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 3, entrancePathId: 'boss_loop_left' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 6, entrancePathId: 'boss_loop_left' }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 3, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY3_TYPE, gridRow: 0, gridCol: 6, entrancePathId: 'boss_loop_left', hasCapturedShip: false }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 3, entrancePathId: 'boss_loop_left' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 6, entrancePathId: 'boss_loop_left' } ]}, { pathId: 'boss_loop_right', enemies: [ { type: ENEMY2_TYPE, gridRow: 1, gridCol: 1, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 2, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 7, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 1, gridCol: 8, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 1, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 2, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 7, entrancePathId: 'boss_loop_right' }, { type: ENEMY2_TYPE, gridRow: 2, gridCol: 8, entrancePathId: 'boss_loop_right' } ]}, { pathId: 'mid_curve_left', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 6, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 7, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 8, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 9, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 6, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 7, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 8, entrancePathId: 'mid_curve_left' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 9, entrancePathId: 'mid_curve_left' } ]}, { pathId: 'mid_curve_right', enemies: [ { type: ENEMY1_TYPE, gridRow: 3, gridCol: 0, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 1, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 2, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 3, gridCol: 3, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 0, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 1, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 2, entrancePathId: 'mid_curve_right' }, { type: ENEMY1_TYPE, gridRow: 4, gridCol: 3, entrancePathId: 'mid_curve_right' } ]} ] ];

const MARGIN_TOP = 5, MARGIN_SIDE = 105, SCORE_OFFSET_Y = 25;
const LIFE_ICON_SIZE = 35, LIFE_ICON_SPACING = 8, LIFE_ICON_MARGIN_BOTTOM = 5, LIFE_ICON_MARGIN_LEFT = MARGIN_SIDE - 30;
const LEVEL_ICON_SIZE = 35, LEVEL_ICON_MARGIN_BOTTOM = LIFE_ICON_MARGIN_BOTTOM, LEVEL_ICON_MARGIN_RIGHT = MARGIN_SIDE - 30, LEVEL_ICON_SPACING = LIFE_ICON_SPACING;

/** Basic rectangle collision check. */
function checkCollision(rect1, rect2) {
    if (!rect1 || !rect2) return false;
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function initializeAudioContext() {
    if (audioContextInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Unlock Web Audio API on iOS - needs a user gesture.
        // We'll attempt to resume it during the first click/touch if it's suspended.
        if (audioContext.state === 'suspended') {
            const unlockAudio = () => {
                audioContext.resume().then(() => {
                    console.log("AudioContext resumed successfully after user gesture.");
                    audioContextInitialized = true;
                    window.removeEventListener('click', unlockAudio);
                    window.removeEventListener('touchstart', unlockAudio);
                }).catch(e => console.error("Error resuming AudioContext:", e));
            };
            window.addEventListener('click', unlockAudio, { once: true });
            window.addEventListener('touchstart', unlockAudio, { once: true });
        } else {
            audioContextInitialized = true;
        }
    } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
    }
}

async function loadSound(soundId, path) {
    if (!audioContext) {
        console.warn(`AudioContext not initialized, cannot load sound: ${soundId}`);
        return;
    }
    if (soundBuffers[soundId]) {
        return; // Already loaded or loading
    }
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${path}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            soundBuffers[soundId] = buffer;
        }, (error) => {
            console.error(`Error decoding audio data for ${soundId} (${path}):`, error);
        });
    } catch (e) {
        console.error(`Error fetching sound ${soundId} (${path}):`, e);
    }
}

function loadAllSounds() {
    if (!audioContext) return;
    for (const soundId in soundPaths) {
        loadSound(soundId, soundPaths[soundId]);
    }
}


function initializeDOMElements() {
    starrySkyCanvas = document.getElementById('starrySkyCanvas');
    starryCtx = starrySkyCanvas?.getContext('2d');
    retroGridCanvas = document.getElementById('retroGridCanvas');
    retroGridCtx = retroGridCanvas?.getContext('2d');
    gameCanvas = document.getElementById("gameCanvas");
    gameCtx = gameCanvas?.getContext("2d");
    if (!starryCtx || !retroGridCtx || !gameCtx) { console.error("FATAL: Could not initialize one or more canvas contexts!"); alert("Error loading critical canvas elements."); document.body.innerHTML = '<p style="color:white;">FATAL ERROR</p>'; return false; }

    if (gameCanvas.width === 0 || gameCanvas.height === 0) {
        const initialWidth = window.innerWidth || 800;
        const initialHeight = window.innerHeight || 600;
        if (starrySkyCanvas) { starrySkyCanvas.width = initialWidth; starrySkyCanvas.height = initialHeight; }
        if (retroGridCanvas) { retroGridCanvas.width = initialWidth; retroGridCanvas.height = initialHeight; }
        gameCanvas.width = initialWidth;
        gameCanvas.height = initialHeight;
    }

    floatingScores = [];
    csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
    normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null;

    initializeAudioContext(); // Initialize AudioContext
    if (audioContext) {
        loadAllSounds(); // Load all sounds

        // Set initial volumes after sounds are expected to be loaded (or at least paths are known)
        // Actual buffer might not be ready yet, but GainNodes can be created.
        // A more robust solution would set volume after each sound buffer is decoded.
        setTimeout(() => {
            if (!audioContextInitialized && audioContext.state === 'suspended') {
                console.warn("AudioContext still suspended. User interaction needed to play sounds.");
            }
            setVolume('playerShootSound', 0.4);
            setVolume('explosionSound', 0.4);
            setVolume('gameOverSound', 0.4);
            setVolume('lostLifeSound', 0.6);
            setVolume('entranceSound', 0.4);
            setVolume('bossGalagaDiveSound', 0.2);
            setVolume('levelUpSound', 0.2);
            setVolume('enemyShootSound', 0.4);
            setVolume('butterflyDiveSound', 0.2);
            setVolume('startSound', 0.4);
            setVolume('coinSound', 0.4); // or dualShipSound
            setVolume('beeHitSound', 0.3);
            setVolume('butterflyHitSound', 0.3);
            setVolume('bossHit1Sound', 0.6);
            setVolume('bossHit2Sound', 0.4);
            setVolume('gridBackgroundSound', 0.1);
            setVolume('extraLifeSound', 0.5);
            setVolume('csPerfectSound', 0.6);
            setVolume('csClearSound', 0.6);
            setVolume('waveUpSound', 0.8);
            setVolume('menuMusicSound', 0.2);
            setVolume('readySound', 0.1);
            setVolume('tripleAttackSound', 0.3);
            setVolume('captureSound', 0.6);
            setVolume('shipCapturedSound', 0.3);
            setVolume('dualShipSound', 0.4);
            setVolume('resultsMusicSound', 0.2);
            setVolume('hiScoreSound', 0.2);
        }, 100); // Short delay to allow GainNode creation
    }

    const imagesToLoad = [ shipImage, beeImage, bulletImage, bossGalagaImage, butterflyImage, logoImage, level1Image, level5Image, level10Image, level20Image, level30Image, level50Image, beeImage2, butterflyImage2, bossGalagaImage2 ];
    imagesToLoad.forEach(img => { if (img) img.onerror = () => console.error(`Error loading image: ${img.src}`); });
    return true;
}


function scaleValue(currentLevel, baseValue, maxValue) { const levelForCalc = Math.max(1, Math.min(currentLevel, LEVEL_CAP_FOR_SCALING)); if (levelForCalc === 1) { return baseValue; } const progress = (levelForCalc - 1) / (LEVEL_CAP_FOR_SCALING - 1); return baseValue + (maxValue - baseValue) * progress; }

// --- EINDE deel 2      van 3 dit codeblok ---
// --- END OF FILE setup_utils.js ---











// --- START OF FILE setup_utils.js ---
// --- DEEL 3      van 3 dit code blok    ---


function setupInitialEventListeners() { /* ... ongewijzigd ... */ try { window.addEventListener("gamepadconnected", handleGamepadConnected); window.addEventListener("gamepaddisconnected", handleGamepadDisconnected); window.addEventListener('resize', resizeCanvases); } catch(e) { console.error("Error setting up initial event listeners:", e); } }


function getCurrentGridSlotPosition(gridRow, gridCol, enemyWidth) {
    if (!gameCanvas || gameCanvas.width === 0 || gridRow < 0 || gridCol < 0) {
        // console.warn(`[DEBUG] getCurrentGridSlotPosition called with invalid params or zero canvas width. Row: ${gridRow}, Col: ${gridCol}, CanvasW: ${gameCanvas?.width}`);
        return { x: gameCanvas?.width / 2 || 200, y: ENEMY_TOP_MARGIN || 100 };
    }
    const baseEnemyWidthForCalc = ENEMY_WIDTH;
    let currentHorizontalSpacing = ENEMY_H_SPACING_FIXED;
    let currentVerticalSpacing = ENEMY_V_SPACING;

    if (GRID_BREATH_ENABLED && isGridBreathingActive) {
        const extraHSpacing = ENEMY_H_SPACING_FIXED * GRID_BREATH_MAX_EXTRA_H_SPACING_FACTOR * currentGridBreathFactor;
        currentHorizontalSpacing = ENEMY_H_SPACING_FIXED + extraHSpacing;
        const extraVSpacing = ENEMY_V_SPACING * GRID_BREATH_MAX_EXTRA_V_SPACING_FACTOR * currentGridBreathFactor;
        currentVerticalSpacing = ENEMY_V_SPACING + extraVSpacing;
    }

    const actualGridWidth = GRID_COLS * baseEnemyWidthForCalc + (GRID_COLS - 1) * currentHorizontalSpacing;
    const initialGridStartX = Math.round((gameCanvas.width - actualGridWidth) / 2);
    const currentStartX = initialGridStartX + currentGridOffsetX;
    const colStartX = currentStartX + gridCol * (baseEnemyWidthForCalc + currentHorizontalSpacing);
    const centeringOffset = (baseEnemyWidthForCalc - enemyWidth) / 2;
    const targetX = Math.round(colStartX + centeringOffset);
    const targetY = Math.round(ENEMY_TOP_MARGIN + gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING));

    return { x: targetX, y: targetY };
}


/** Safely attempts to play a sound from the beginning. Handles potential errors. */
function playSound(soundId, loop = false, volume = 1) {
    if (!audioContext || !audioContextInitialized || audioContext.state === 'suspended' || !soundBuffers[soundId]) {
        // console.warn(`Cannot play sound: ${soundId}. Context suspended or buffer not ready.`);
        return;
    }
    if (isPaused && soundId !== 'menuMusicSound') return;

    // Stop any existing instance of this sound before playing a new one, unless it's music
    if (soundId !== 'menuMusicSound' && soundId !== 'gridBackgroundSound') {
        stopSound(soundId);
    } else if ((soundId === 'menuMusicSound' || soundId === 'gridBackgroundSound') && soundSources[soundId]) {
        // If it's looping music and already playing, don't restart
        return;
    }


    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers[soundId];
    source.loop = loop;

    let gainNode = soundGainNodes[soundId];
    if (!gainNode) {
        gainNode = audioContext.createGain();
        soundGainNodes[soundId] = gainNode;
    }
    // Ensure volume is within a reasonable range (0.0 to 1.0 typical, but can be higher for gain)
    const safeVolume = Math.max(0, Math.min(2, volume)); // Cap at 2 as an example
    gainNode.gain.setValueAtTime(safeVolume, audioContext.currentTime);
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
    soundSources[soundId] = source; // Store the source to allow stopping it

    source.onended = () => {
        if (soundSources[soundId] === source) { // Only delete if it's the current one
            delete soundSources[soundId];
        }
    };
}

/** Safely attempts to stop a sound and reset its position. */
function stopSound(soundId) {
    if (soundSources[soundId]) {
        try {
            soundSources[soundId].stop(0);
        } catch (e) {
            // Can throw if already stopped or not playing.
        }
        // Don't delete immediately, onended will handle it.
        // delete soundSources[soundId]; // This was causing issues with rapidly replayed sounds
    }
}

/** Helper to set volume for a specific sound */
function setVolume(soundId, volume) {
    if (!audioContext) return;
    if (!soundGainNodes[soundId]) {
        soundGainNodes[soundId] = audioContext.createGain();
        soundGainNodes[soundId].connect(audioContext.destination);
    }
    const safeVolume = Math.max(0, Math.min(2, volume));
    soundGainNodes[soundId].gain.setValueAtTime(safeVolume, audioContext.currentTime);
}


/** Attempts to enter fullscreen mode and plays menu music. */
function triggerFullscreen() {
    if (!document.fullscreenElement) {
        const element = document.documentElement;
        let requestFullscreenPromise = null;

        if (element.requestFullscreen) {
            requestFullscreenPromise = element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
            requestFullscreenPromise = element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            requestFullscreenPromise = element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
            requestFullscreenPromise = element.msRequestFullscreen();
        }

        const playMenuMusicAfterAction = () => {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    audioContextInitialized = true;
                    playSound('menuMusicSound', true, 0.2);
                }).catch(e => console.error("Error resuming AudioContext for fullscreen music:", e));
            } else if (audioContext) {
                playSound('menuMusicSound', true, 0.2);
            }
        };

        if (requestFullscreenPromise) {
            requestFullscreenPromise
                .then(() => {
                    playMenuMusicAfterAction();
                })
                .catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                    playMenuMusicAfterAction();
                });
        } else {
            console.warn("Fullscreen API is not supported by this browser.");
            playMenuMusicAfterAction();
        }
    } else {
         if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                audioContextInitialized = true;
                playSound('menuMusicSound', true, 0.2);
            });
        } else if (audioContext) {
            playSound('menuMusicSound', true, 0.2);
        }
    }
}


/** Creates a single star object with random properties. */
function createStar() { /* ... ongewijzigd ... */ if (!starrySkyCanvas || starrySkyCanvas.width === 0) return null; return { x: Math.random() * starrySkyCanvas.width, y: Math.random() * starrySkyCanvas.height, radius: Math.random() * (MAX_STAR_RADIUS - MIN_STAR_RADIUS) + MIN_STAR_RADIUS, alpha: Math.random() * 0.8 + 0.2, alphaChange: (Math.random() > 0.5 ? 1 : -1) * TWINKLE_SPEED * (Math.random() * 0.5 + 0.5) }; }

/** Populates the stars array. */
function createStars() { /* ... ongewijzigd ... */ stars = []; if (starrySkyCanvas?.width > 0 && starrySkyCanvas?.height > 0) { for (let i = 0; i < NUM_STARS; i++) { const star = createStar(); if (star) stars.push(star); } } }

/** Draws the starry background, handling movement, twinkle, and fade near horizon. */
function drawStars() { /* ... ongewijzigd ... */ try { if (!starryCtx || !starrySkyCanvas || starrySkyCanvas.width === 0 || starrySkyCanvas.height === 0) return; const currentCanvasWidth = starrySkyCanvas.width; const currentCanvasHeight = starrySkyCanvas.height; starryCtx.clearRect(0, 0, currentCanvasWidth, currentCanvasHeight); const horizonY = Math.round(currentCanvasHeight * GRID_HORIZON_Y_FACTOR); const perspectiveHeight = currentCanvasHeight - horizonY; const fadeStartY = Math.max(0, horizonY - perspectiveHeight * STAR_FADE_START_FACTOR_ABOVE_HORIZON); const fadeEndY = horizonY; const fadeRange = Math.max(1, fadeEndY - fadeStartY); stars.forEach(star => { const normalizedRadius = (star.radius - MIN_STAR_RADIUS) / (MAX_STAR_RADIUS - MIN_STAR_RADIUS); const speed = BASE_PARALLAX_SPEED + (normalizedRadius * PARALLAX_SPEED_FACTOR); if (!isPaused) { star.y += speed; } if (star.y > currentCanvasHeight + star.radius) { star.y = -star.radius * 2; star.x = Math.random() * currentCanvasWidth; } if (!isPaused) { star.alpha += star.alphaChange; if (star.alpha <= 0.1 || star.alpha >= 1.0) { star.alphaChange *= -1; star.alpha = Math.max(0.1, Math.min(1.0, star.alpha)); } } let finalAlpha = star.alpha; if (fadeStartY >= 0 && star.y > fadeStartY) { if (star.y >= horizonY) { finalAlpha = 0; } else { finalAlpha *= (1.0 - Math.min(1.0, Math.max(0, (star.y - fadeStartY) / fadeRange))); } } finalAlpha = Math.max(0, Math.min(1.0, finalAlpha)); if (finalAlpha > 0.01) { starryCtx.beginPath(); starryCtx.arc(Math.round(star.x), Math.round(star.y), star.radius, 0, Math.PI * 2); starryCtx.fillStyle = `rgba(255, 255, 255, ${finalAlpha.toFixed(3)})`; starryCtx.fill(); } }); } catch (e) { console.error("Error in drawStars:", e); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; } }

/** Draws the retro perspective grid. */
function drawRetroGrid() { /* ... ongewijzigd ... */ try { if (!retroGridCtx || !retroGridCanvas || retroGridCanvas.width === 0 || retroGridCanvas.height === 0) return; if (!isPaused) { gridOffsetY -= GRID_SPEED; } const width = retroGridCanvas.width; const height = retroGridCanvas.height; retroGridCtx.clearRect(0, 0, width, height); const horizonY = Math.round(height * GRID_HORIZON_Y_FACTOR); const vanishingPointX = width / 2; const perspectiveHeight = height - horizonY; retroGridCtx.lineWidth = GRID_LINE_WIDTH; const fixedLineWidth = width * GRID_HORIZONTAL_LINE_WIDTH_FACTOR; const fixedLineStartX = vanishingPointX - fixedLineWidth / 2; const fixedLineEndX = vanishingPointX + fixedLineWidth / 2; const fadeStartY = horizonY + perspectiveHeight * 0.1; const fadeEndY = height; const fadeRange = Math.max(1, fadeEndY - fadeStartY); retroGridCtx.strokeStyle = GRID_LINE_COLOR_FIXED; retroGridCtx.beginPath(); retroGridCtx.moveTo(fixedLineStartX, horizonY); retroGridCtx.lineTo(fixedLineEndX, horizonY); retroGridCtx.stroke(); let normalizedOffset = gridOffsetY % GRID_BASE_SPACING; if (normalizedOffset > 0) { normalizedOffset -= GRID_BASE_SPACING; } let currentDrawY = horizonY - normalizedOffset; if (currentDrawY <= horizonY) currentDrawY += GRID_BASE_SPACING; while (currentDrawY < height + GRID_BASE_SPACING) { let progress = Math.max(0, Math.min(1, (currentDrawY - horizonY) / perspectiveHeight)); if (currentDrawY > horizonY && currentDrawY <= height + GRID_LINE_WIDTH*2) { let currentAlpha; if (currentDrawY <= fadeStartY) { currentAlpha = GRID_MIN_ALPHA; } else if (currentDrawY >= fadeEndY) { currentAlpha = GRID_BASE_ALPHA; } else { const fadeProgress = (currentDrawY - fadeStartY) / fadeRange; currentAlpha = GRID_MIN_ALPHA + (GRID_BASE_ALPHA - GRID_MIN_ALPHA) * fadeProgress; } currentAlpha = Math.max(0, Math.min(GRID_BASE_ALPHA, currentAlpha)); if (currentAlpha > 0.01) { retroGridCtx.strokeStyle = `rgba(${GRID_RGB_PART}, ${currentAlpha.toFixed(3)})`; retroGridCtx.beginPath(); retroGridCtx.moveTo(fixedLineStartX, Math.round(currentDrawY)); retroGridCtx.lineTo(fixedLineEndX, Math.round(currentDrawY)); retroGridCtx.stroke(); } } let nextSpacing = GRID_BASE_SPACING * Math.pow(1 + progress * 1.5, GRID_SPACING_POWER); currentDrawY += Math.max(1, nextSpacing); } retroGridCtx.strokeStyle = GRID_LINE_COLOR_FIXED; retroGridCtx.beginPath(); const numLinesHalf = Math.floor(GRID_NUM_PERSPECTIVE_LINES / 2); const horizonSpreadWidth = width * GRID_HORIZON_SPREAD_FACTOR; const maxSpreadAtBottom = width * GRID_BOTTOM_SPREAD_FACTOR; for (let i = 0; i <= numLinesHalf; i++) { let spreadProgress = Math.pow(i / numLinesHalf, GRID_PERSPECTIVE_POWER); let startX_R = vanishingPointX + spreadProgress * (horizonSpreadWidth / 2); let startX_L = vanishingPointX - spreadProgress * (horizonSpreadWidth / 2); let bottomX_R = vanishingPointX + spreadProgress * (maxSpreadAtBottom / 2); let bottomX_L = vanishingPointX - spreadProgress * (maxSpreadAtBottom / 2); retroGridCtx.moveTo(startX_R, horizonY); retroGridCtx.lineTo(bottomX_R, height); if (i > 0) { retroGridCtx.moveTo(startX_L, horizonY); retroGridCtx.lineTo(bottomX_L, height); } } retroGridCtx.stroke(); } catch (e) { console.error("Error in drawRetroGrid:", e); } }

/** Berekent een punt op een kubische Bézier curve. */
function calculateBezierPoint(t, p0, p1, p2, p3) { /* ... ongewijzigd ... */ const u = 1 - t; const tt = t * t; const uu = u * u; const uuu = uu * u; const ttt = tt * t; let p = uuu * p0; p += 3 * uu * t * p1; p += 3 * u * tt * p2; p += ttt * p3; return p; }

/** Defines the Bezier curve paths for normal wave enemy entrances. */
 function defineNormalWaveEntrancePaths() { /* ... ongewijzigd ... */ normalWaveEntrancePaths = {}; const w = gameCanvas?.width; const h = gameCanvas?.height; if (!w || !h || w === 0) { console.error("Cannot define Normal Wave entrance paths: Canvas size unknown or zero width."); return; } const sX = w / 800; const sY = h / 600; const offTop = -Math.max(ENEMY1_HEIGHT, ENEMY_HEIGHT) * 1.5; const midScreenX = w / 2; const horizontalShift = -25; const baseEnemyWidthForCalc = ENEMY_WIDTH; const fixedSpacing = ENEMY_H_SPACING_FIXED; const actualGridWidth = GRID_COLS * baseEnemyWidthForCalc + (GRID_COLS - 1) * fixedSpacing; const initialGridStartX = Math.round((w - actualGridWidth) / 2); const col4CenterX = initialGridStartX + 4 * (baseEnemyWidthForCalc + fixedSpacing) + baseEnemyWidthForCalc / 2; const col5CenterX = initialGridStartX + 5 * (baseEnemyWidthForCalc + fixedSpacing) + baseEnemyWidthForCalc / 2; const targetCenterX_shifted = (col4CenterX + col5CenterX) / 2 + horizontalShift; const targetY_row1 = Math.round(ENEMY_TOP_MARGIN + 1 * (ENEMY_HEIGHT + ENEMY_V_SPACING)); const finalPathEndY_shifted = targetY_row1 + 60 * sY; const leftPath = [{ p0: { x: (80/400*800) * sX + horizontalShift, y: offTop }, p1: { x: (440/400*800) * sX + horizontalShift, y: (140/300*600) * sY }, p2: { x: (260/400*800) * sX + horizontalShift, y: (340/300*600) * sY }, p3: { x: targetCenterX_shifted, y: finalPathEndY_shifted } }]; normalWaveEntrancePaths['new_path_left'] = leftPath; const rightPath_shifted = leftPath.map(seg => ({ p0: { x: w - (seg.p0.x - horizontalShift) + horizontalShift, y: seg.p0.y }, p1: { x: w - (seg.p1.x - horizontalShift) + horizontalShift, y: seg.p1.y }, p2: { x: w - (seg.p2.x - horizontalShift) + horizontalShift, y: seg.p2.y }, p3: { x: targetCenterX_shifted, y: seg.p3.y } })); normalWaveEntrancePaths['new_path_right'] = rightPath_shifted; const createBossLoopPath = (isRightSide) => { const pathId = isRightSide ? 'boss_loop_right' : 'boss_loop_left'; const mirror = (x) => isRightSide ? w - x : x; const offsetY_new = 130 * sY; const radius_new = 80 * sX; const circleCenterX_new = 300 * sX; const circleCenterY_new = 300 * sY; const circleStartPointX = circleCenterX_new + radius_new; const circleStartPointY = circleCenterY_new; const startX_new = mirror(-100 * sX); const startY_new = (350 + offsetY_new) * sY; const finalY_new = ENEMY_TOP_MARGIN - 20; const P_Start = { x: startX_new, y: startY_new }; const P_Entry = { x: mirror(circleStartPointX), y: circleCenterY_new }; const P_Top = { x: mirror(circleCenterX_new), y: circleCenterY_new - radius_new }; const P_Left = { x: mirror(circleCenterX_new - radius_new), y: circleCenterY_new }; const P_Bottom = { x: mirror(circleCenterX_new), y: circleCenterY_new + radius_new }; const P_Final = { x: P_Entry.x, y: finalY_new }; const preEntryDistanceFactor = 0.25; const angleToEntry = Math.atan2(P_Entry.y - startY_new, P_Entry.x - startX_new); const P_Before_Entry = { x: P_Entry.x - Math.cos(angleToEntry) * radius_new * preEntryDistanceFactor, y: P_Entry.y - Math.sin(angleToEntry) * radius_new * preEntryDistanceFactor }; const P_Mid_Start_BeforeEntry = { x: (P_Start.x + P_Before_Entry.x) / 2, y: (P_Start.y + P_Before_Entry.y) / 2 }; const P_Mid_Entry_Final = { x: P_Entry.x, y: (P_Entry.y + P_Final.y) / 2 }; const kappa = 0.552284749831; const kRadX = radius_new * kappa; const kRadY = radius_new * kappa; let bossLoopPath = []; bossLoopPath.push({ p0: P_Start, p1: { x: P_Start.x + (P_Mid_Start_BeforeEntry.x - P_Start.x) * 0.33, y: P_Start.y + (P_Mid_Start_BeforeEntry.y - P_Start.y) * 0.33 }, p2: { x: P_Start.x + (P_Mid_Start_BeforeEntry.x - P_Start.x) * 0.66, y: P_Start.y + (P_Mid_Start_BeforeEntry.y - P_Start.y) * 0.66 }, p3: P_Mid_Start_BeforeEntry }); bossLoopPath.push({ p0: P_Mid_Start_BeforeEntry, p1: { x: P_Mid_Start_BeforeEntry.x + (P_Before_Entry.x - P_Mid_Start_BeforeEntry.x) * 0.33, y: P_Mid_Start_BeforeEntry.y + (P_Before_Entry.y - P_Mid_Start_BeforeEntry.y) * 0.33 }, p2: { x: P_Mid_Start_BeforeEntry.x + (P_Before_Entry.x - P_Mid_Start_BeforeEntry.x) * 0.66, y: P_Mid_Start_BeforeEntry.y + (P_Before_Entry.y - P_Mid_Start_BeforeEntry.y) * 0.66 }, p3: P_Before_Entry }); const cp1_smooth = { x: P_Before_Entry.x + (P_Before_Entry.x - P_Mid_Start_BeforeEntry.x) * 0.3, y: P_Before_Entry.y + (P_Before_Entry.y - P_Mid_Start_BeforeEntry.y) * 0.3 }; const cp2_smooth = { x: mirror(circleCenterX_new + kRadX), y: P_Top.y }; bossLoopPath.push({ p0: P_Before_Entry, p1: cp1_smooth, p2: cp2_smooth, p3: P_Top }); bossLoopPath.push({ p0: P_Top, p1: { x: mirror(circleCenterX_new - kRadX), y: P_Top.y }, p2: { x: P_Left.x, y: P_Left.y - kRadY }, p3: P_Left }); bossLoopPath.push({ p0: P_Left, p1: { x: P_Left.x, y: P_Left.y + kRadY }, p2: { x: mirror(circleCenterX_new - kRadX), y: P_Bottom.y }, p3: P_Bottom }); bossLoopPath.push({ p0: P_Bottom, p1: { x: mirror(circleCenterX_new + kRadX), y: P_Bottom.y }, p2: { x: P_Entry.x, y: P_Entry.y + kRadY }, p3: P_Entry }); bossLoopPath.push({ p0: P_Entry, p1: { x: P_Entry.x + (P_Mid_Entry_Final.x - P_Entry.x) * 0.33, y: P_Entry.y + (P_Mid_Entry_Final.y - P_Entry.y) * 0.33 }, p2: { x: P_Entry.x + (P_Mid_Entry_Final.x - P_Entry.x) * 0.66, y: P_Entry.y + (P_Mid_Entry_Final.y - P_Entry.y) * 0.66 }, p3: P_Mid_Entry_Final }); bossLoopPath.push({ p0: P_Mid_Entry_Final, p1: { x: P_Mid_Entry_Final.x + (P_Final.x - P_Mid_Entry_Final.x) * 0.33, y: P_Mid_Entry_Final.y + (P_Final.y - P_Mid_Entry_Final.y) * 0.33 }, p2: { x: P_Mid_Entry_Final.x + (P_Final.x - P_Mid_Entry_Final.x) * 0.66, y: P_Mid_Entry_Final.y + (P_Final.y - P_Mid_Entry_Final.y) * 0.66 }, p3: P_Final }); return bossLoopPath; }; normalWaveEntrancePaths['boss_loop_left'] = createBossLoopPath(false); normalWaveEntrancePaths['boss_loop_right'] = createBossLoopPath(true); const effectiveCurveY = 750; const finalEndY = 350 * sY; const midCurveRight_p0 = { x: midScreenX, y: offTop }; const midCurveRight_p1 = { x: (midScreenX + (750 - 400) * (2/3)) * sX, y: (-50 + (effectiveCurveY - (-50)) * (2/3)) * sY }; const midCurveRight_p2 = { x: (400 + (750 - 400) * (1/3)) * sX, y: (finalEndY + (effectiveCurveY - finalEndY) * (1/3)) * sY }; const midCurveRight_p3 = { x: midScreenX, y: finalEndY }; normalWaveEntrancePaths['mid_curve_right'] = [ { p0: midCurveRight_p0, p1: midCurveRight_p1, p2: midCurveRight_p2, p3: midCurveRight_p3 } ]; const midCurveLeft_p0 = { x: midScreenX, y: offTop }; const midCurveLeft_p1 = { x: w - midCurveRight_p1.x, y: midCurveRight_p1.y }; const midCurveLeft_p2 = { x: w - midCurveRight_p2.x, y: midCurveRight_p2.y }; const midCurveLeft_p3 = { x: midScreenX, y: finalEndY }; normalWaveEntrancePaths['mid_curve_left'] = [ { p0: midCurveLeft_p0, p1: midCurveLeft_p1, p2: midCurveLeft_p2, p3: midCurveLeft_p3 } ]; for (const pathId in normalWaveEntrancePaths) { if (!Array.isArray(normalWaveEntrancePaths[pathId])) { console.error(`Normal Wave Path ${pathId} is not an array! Using basic fallback.`); normalWaveEntrancePaths[pathId] = [{ p0:{x:w/2, y:offTop}, p1:{x:w/2, y:h/3}, p2:{x:w/2, y:h*2/3}, p3:{x:w/2, y:ENEMY_TOP_MARGIN} }]; continue; } normalWaveEntrancePaths[pathId] = normalWaveEntrancePaths[pathId].filter(seg => seg?.p0 && seg?.p1 && seg?.p2 && seg?.p3 && typeof seg.p0.x === 'number' && typeof seg.p0.y === 'number' && typeof seg.p1.x === 'number' && typeof seg.p1.y === 'number' && typeof seg.p2.x === 'number' && typeof seg.p2.y === 'number' && typeof seg.p3.x === 'number' && typeof seg.p3.y === 'number' && !isNaN(seg.p0.x + seg.p0.y + seg.p1.x + seg.p1.y + seg.p2.x + seg.p2.y + seg.p3.x + seg.p3.y) ); if (normalWaveEntrancePaths[pathId].length === 0) { console.error(`Normal Wave Path ${pathId} empty after validation! Using basic fallback.`); normalWaveEntrancePaths[pathId] = [{ p0:{x:w/2, y:offTop}, p1:{x:w/2, y:h/3}, p2:{x:w/2, y:h*2/3}, p3:{x:w/2, y:ENEMY_TOP_MARGIN} }]; } } }

/** Defines the Bezier curve paths specifically for Challenging Stages. */
function defineChallengingStagePaths() { /* ... ongewijzigd ... */ challengingStagePaths = {}; const w = gameCanvas?.width; const h = gameCanvas?.height; if (!w || !h || w === 0) { console.error("Cannot define CS paths: Canvas size unknown or zero width."); return; } const enemyW = ENEMY_WIDTH; const enemyH = ENEMY_HEIGHT; const offTop = -enemyH * 1.5; const offBottom = h + enemyH * 2; const offLeft = -enemyW * 1.5; const offRight = w + enemyW * 1.5; const midX = w / 2; const midY = h / 2; const CS3_START_SHIFT_X = -28; const shiftPathX = (originalPath, shiftX) => { return originalPath.map(seg => { const newSeg = JSON.parse(JSON.stringify(seg)); if (newSeg.p0 && typeof newSeg.p0.x === 'number') newSeg.p0.x += shiftX; if (newSeg.p1 && typeof newSeg.p1.x === 'number') newSeg.p1.x += shiftX; if (newSeg.p2 && typeof newSeg.p2.x === 'number') newSeg.p2.x += shiftX; if (newSeg.p3 && typeof newSeg.p3.x === 'number' && newSeg.p3.x !== offLeft && newSeg.p3.x !== offRight) { newSeg.p3.x += shiftX; } return newSeg; }); }; const cmScale = (37.8 / 800) * 0.3; const exampleStartX_L_frac_orig = 0.5 - cmScale; const exampleMidY_frac = 450 / 600; const exampleCp1X_L_frac_orig = 0.49; const exampleCp1Y_frac = 600 / 600; const exampleCp2X_L_frac_orig = 0.48; const exampleCp2Y_frac = 300 / 600; const path5_startX_orig = w * exampleStartX_L_frac_orig; const path5_midY = h * exampleMidY_frac; const path5_cp1X_orig = w * exampleCp1X_L_frac_orig; const path5_cp1Y = h * Math.min(1.0, exampleCp1Y_frac); const path5_cp2X_orig = w * exampleCp2X_L_frac_orig; const path5_cp2Y = h * exampleCp2Y_frac; const path5_endX_orig = offLeft; const path5_endY = offTop; const path5_seg1_p0_orig = { x: path5_startX_orig, y: offTop }; const path5_seg1_p3_orig = { x: path5_startX_orig, y: path5_midY }; const path5_seg1_p1_orig = { x: path5_startX_orig, y: offTop + (path5_midY - offTop) * 0.33 }; const path5_seg1_p2_orig = { x: path5_startX_orig, y: offTop + (path5_midY - offTop) * 0.66 }; const path5_seg2_p0_orig = path5_seg1_p3_orig; const path5_seg2_p1_orig = { x: path5_cp1X_orig, y: path5_cp1Y }; const path5_seg2_p2_orig = { x: path5_cp2X_orig, y: path5_cp2Y }; const path5_seg2_p3_orig = { x: path5_endX_orig, y: path5_endY }; const original_CS3_DiveLoopL_Sharp = [ { p0: path5_seg1_p0_orig, p1: path5_seg1_p1_orig, p2: path5_seg1_p2_orig, p3: path5_seg1_p3_orig }, { p0: path5_seg2_p0_orig, p1: path5_seg2_p1_orig, p2: path5_seg2_p2_orig, p3: path5_seg2_p3_orig } ]; const original_CS3_DiveLoopR_Sharp = original_CS3_DiveLoopL_Sharp.map(seg => ({ p0: { x: w - seg.p0.x, y: seg.p0.y }, p1: { x: w - seg.p1.x, y: seg.p1.y }, p2: { x: w - seg.p2.x, y: seg.p2.y }, p3: { x: (seg.p3.x === offLeft) ? offRight : w - seg.p3.x, y: seg.p3.y } })); challengingStagePaths['CS3_DiveLoopL_Sharp'] = shiftPathX(original_CS3_DiveLoopL_Sharp, CS3_START_SHIFT_X); challengingStagePaths['CS3_DiveLoopR_Sharp'] = shiftPathX(original_CS3_DiveLoopR_Sharp, CS3_START_SHIFT_X); const flyByY = h * 0.70; const controlOffsetYFlyBy = h * 0.03; const controlOffsetXFlyBy = w * 0.15; challengingStagePaths['CS_HorizontalFlyByL'] = [{ p0: { x: offLeft, y: flyByY }, p1: { x: offLeft + controlOffsetXFlyBy, y: flyByY - controlOffsetYFlyBy }, p2: { x: offRight - controlOffsetXFlyBy, y: flyByY + controlOffsetYFlyBy }, p3: { x: offRight, y: flyByY } }]; challengingStagePaths['CS_HorizontalFlyByR'] = [{ p0: { x: offRight, y: flyByY }, p1: { x: offRight - controlOffsetXFlyBy, y: flyByY - controlOffsetYFlyBy }, p2: { x: offLeft + controlOffsetXFlyBy, y: flyByY + controlOffsetYFlyBy }, p3: { x: offLeft, y: flyByY } }]; const loopDipY = h * 0.80; const loopRiseY = h * 0.55; const loopExitY = h * 0.15; challengingStagePaths['CS_LoopAttack_TL'] = [ { p0: { x: w * 0.1, y: offTop }, p1: { x: w * 0.2, y: h * 0.2 }, p2: { x: w * 0.6, y: loopDipY }, p3: { x: w * 0.7, y: loopDipY } }, { p0: { x: w * 0.7, y: loopDipY }, p1: { x: w * 0.8, y: loopDipY }, p2: { x: w * 0.8, y: loopRiseY }, p3: { x: w * 0.7, y: loopRiseY } }, { p0: { x: w * 0.7, y: loopRiseY }, p1: { x: w * 0.6, y: loopRiseY }, p2: { x: offRight, y: loopExitY }, p3: { x: offRight, y: loopExitY + h*0.1 } } ]; challengingStagePaths['CS_LoopAttack_TR'] = [ { p0: { x: w * 0.9, y: offTop }, p1: { x: w * 0.8, y: h * 0.2 }, p2: { x: w * 0.4, y: loopDipY }, p3: { x: w * 0.3, y: loopDipY } }, { p0: { x: w * 0.3, y: loopDipY }, p1: { x: w * 0.2, y: loopDipY }, p2: { x: w * 0.2, y: loopRiseY }, p3: { x: w * 0.3, y: loopRiseY } }, { p0: { x: w * 0.3, y: loopRiseY }, p1: { x: w * 0.4, y: loopRiseY }, p2: { x: offLeft, y: loopExitY }, p3: { x: offLeft, y: loopExitY + h*0.1 } } ]; challengingStagePaths['CS_LoopAttack_BL'] = [ { p0: { x: offLeft, y: h * 0.6 }, p1: { x: w * 0.1, y: h * 0.4 }, p2: { x: w * 0.6, y: h * 0.2 }, p3: { x: midX, y: h * 0.3 } }, { p0: { x: midX, y: h * 0.3 }, p1: { x: w * 0.4, y: h * 0.4 }, p2: { x: w * 0.3, y: loopDipY * 0.9 }, p3: { x: w*0.4, y: loopDipY } }, { p0: { x: w*0.4, y: loopDipY }, p1: { x: w * 0.5, y: loopDipY * 1.05 }, p2: { x: midX, y: offTop }, p3: { x: midX + w*0.1, y: offTop } } ]; challengingStagePaths['CS_LoopAttack_BR'] = [ { p0: { x: offRight, y: h * 0.6 }, p1: { x: w * 0.9, y: h * 0.4 }, p2: { x: w * 0.4, y: h * 0.2 }, p3: { x: midX, y: h * 0.3 } }, { p0: { x: midX, y: h * 0.3 }, p1: { x: w * 0.6, y: h * 0.4 }, p2: { x: w * 0.7, y: loopDipY * 0.9 }, p3: { x: w*0.6, y: loopDipY } }, { p0: { x: w*0.6, y: loopDipY }, p1: { x: w * 0.5, y: loopDipY * 1.05 }, p2: { x: midX, y: offTop }, p3: { x: midX - w*0.1, y: offTop } } ]; for (const key in challengingStagePaths) { challengingStagePaths[key] = challengingStagePaths[key].filter(seg => seg?.p0 && seg?.p1 && seg?.p2 && seg?.p3 && !isNaN(seg.p0.x + seg.p0.y + seg.p1.x + seg.p1.y + seg.p2.x + seg.p2.y + seg.p3.x + seg.p3.y) ); if (challengingStagePaths[key].length === 0) { console.error(`CS Path ${key} empty after validation! Adding fallback.`); challengingStagePaths[key] = [{ p0:{x:w/2, y:offTop}, p1:{x:w/2, y:h/3}, p2:{x:w/2, y:h*2/3}, p3:{x:w/2, y:offBottom} }]; } } }

/** Resizes all canvases to fit the window and redraws/recalculates related elements. */
function resizeCanvases() { /* ... ongewijzigd ... */ try { const width = window.innerWidth; const height = window.innerHeight; if (width <= 0 || height <= 0) return; if (starrySkyCanvas && (starrySkyCanvas.width !== width || starrySkyCanvas.height !== height)) { starrySkyCanvas.width = width; starrySkyCanvas.height = height; createStars(); } if (retroGridCanvas && (retroGridCanvas.width !== width || retroGridCanvas.height !== height)) { retroGridCanvas.width = width; retroGridCanvas.height = height; } if (gameCanvas && (gameCanvas.width !== width || gameCanvas.height !== height)) { const oldWidth = gameCanvas.width; gameCanvas.width = width; gameCanvas.height = height; defineNormalWaveEntrancePaths(); defineChallengingStagePaths(); if (isInGameState) { handleResizeGameElements(oldWidth, width, height); } } else if (!gameCanvas?.width || !gameCanvas?.height) { defineNormalWaveEntrancePaths(); defineChallengingStagePaths(); } } catch (e) { console.error("Error in resizeCanvases:", e); } }

/** Repositions ship and enemy targets after a resize while the game is running. */
function handleResizeGameElements(oldWidth, newWidth, newHeight) { /* ... ongewijzigd ... */ try { currentGridOffsetX = 0; if (ship) { if (oldWidth > 0 && newWidth > 0 && typeof ship.x !== 'undefined') { ship.x = (ship.x / oldWidth) * newWidth; } else { ship.x = newWidth / 2 - ship.width / 2; } ship.x = Math.max(0, Math.min(newWidth - ship.width, ship.x)); ship.y = newHeight - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; ship.targetX = ship.x; } enemies.forEach((e) => { if (e && (e.state === 'in_grid' || e.state === 'returning' || e.state === 'moving_to_grid')) { try { const enemyWidthForGrid = (e.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((e.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: newTargetX, y: newTargetY } = getCurrentGridSlotPosition(e.gridRow, e.gridCol, enemyWidthForGrid); e.targetGridX = newTargetX; e.targetGridY = newTargetY; if (e.state === 'in_grid') { e.x = newTargetX; e.y = newTargetY; } } catch (gridPosError) { console.error(`Error recalculating grid pos for enemy ${e.id} on resize:`, gridPosError); if(e.state === 'in_grid' || e.state === 'moving_to_grid' || e.state === 'returning'){ e.x = newWidth / 2; e.y = ENEMY_TOP_MARGIN + e.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); e.targetGridX = e.x; e.targetGridY = e.y; } } } }); } catch (e) { console.error("Error handling game resize specifics:", e); } }

// --- Keyboard Event Handlers ---
function handleKeyDown(e) { /* ... ongewijzigd ... */ try { if (audioContext && audioContext.state === 'suspended') { audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed by keydown."); }); } const relevantKeys = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", "w", "a", "s", "d", "p", "P", "j", "J", "l", "L", "i", "I", "Numpad4", "Numpad6", "Numpad0"]; if (relevantKeys.includes(e.key) || relevantKeys.includes(e.code)) { e.preventDefault(); } let blockAllKeyboardInput = false; if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) { blockAllKeyboardInput = true; } if (blockAllKeyboardInput) { return; } if (isInGameState) { if ((e.key === 'p' || e.key === 'P') && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) { if(typeof togglePause === 'function') togglePause(); return; } if (!isPaused) { if (!isManualControl) { if (isPlayerTwoAI && selectedGameMode === 'normal' && currentPlayer === 2) { } else { if (e.key === "Escape" || e.key === "Enter") { if(typeof stopGameAndShowMenu === 'function') stopGameAndShowMenu(); } else if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key !== 'p' && e.key !== 'P') { if(typeof showMenuState === 'function') showMenuState(); } } } else { switch (e.code) { case "ArrowLeft": case "KeyA": keyboardP1LeftDown = true; break; case "ArrowRight": case "KeyD": keyboardP1RightDown = true; break; case "Space": case "ArrowUp": case "KeyW": keyboardP1ShootDown = true; break; case "KeyJ": case "Numpad4": if(isTwoPlayerMode && !isPlayerTwoAI) keyboardP2LeftDown = true; break; case "KeyL": case "Numpad6": if(isTwoPlayerMode && !isPlayerTwoAI) keyboardP2RightDown = true; break; case "KeyI": case "Numpad0": if(isTwoPlayerMode && !isPlayerTwoAI) keyboardP2ShootDown = true; break; case "Escape": case "Enter": if(typeof stopGameAndShowMenu === 'function') stopGameAndShowMenu(); break; } if (!keyboardP2LeftDown && isTwoPlayerMode && !isPlayerTwoAI && e.key.toLowerCase() === "j") keyboardP2LeftDown = true; if (!keyboardP2RightDown && isTwoPlayerMode && !isPlayerTwoAI && e.key.toLowerCase() === "l") keyboardP2RightDown = true; if (!keyboardP2ShootDown && isTwoPlayerMode && !isPlayerTwoAI && e.key.toLowerCase() === "i") keyboardP2ShootDown = true; } } } else { if (isShowingScoreScreen && !isTransitioningToDemoViaScoreScreen) { if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key !== 'p' && e.key !== 'P') { if(typeof showMenuState === 'function') showMenuState(); return; } } else if (!isShowingScoreScreen) { stopAutoDemoTimer(); switch (e.key) { case "ArrowUp": case "w": selectedButtonIndex = (selectedButtonIndex <= 0) ? 1 : 0; startAutoDemoTimer(); break; case "ArrowDown": case "s": selectedButtonIndex = (selectedButtonIndex >= 1) ? 0 : 1; startAutoDemoTimer(); break; case "Enter": case " ": if (isPlayerSelectMode) { if (selectedButtonIndex === 0) { startGame1P(); } else { startGame2P(); } } else if (isOnePlayerGameTypeSelectMode) { if (selectedButtonIndex === 0) { isOnePlayerGameTypeSelectMode = false; isFiringModeSelectMode = true; selectedOnePlayerGameVariant = 'CLASSIC_1P'; selectedGameMode = 'normal'; isTwoPlayerMode = false; isPlayerTwoAI = false; selectedButtonIndex = 0; } else { isOnePlayerGameTypeSelectMode = false; isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = 0; } } else if (isOnePlayerVsAIGameTypeSelectMode) { if (selectedButtonIndex === 0) { selectedOnePlayerGameVariant = '1P_VS_AI_NORMAL'; selectedGameMode = 'normal'; } else { selectedOnePlayerGameVariant = '1P_VS_AI_COOP'; selectedGameMode = 'coop'; } isOnePlayerVsAIGameTypeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = true; selectedButtonIndex = 0; } else if (isGameModeSelectMode) { if (selectedButtonIndex === 0) { selectedGameMode = 'normal'; } else { selectedGameMode = 'coop'; } isGameModeSelectMode = false; isFiringModeSelectMode = true; isTwoPlayerMode = true; isPlayerTwoAI = false; selectedButtonIndex = 0; } else if (isFiringModeSelectMode) { if (selectedButtonIndex === 0) { selectedFiringMode = 'rapid'; } else { selectedFiringMode = 'single'; } baseStartGame(true); } else { if (selectedButtonIndex === 0) { isPlayerSelectMode = true; selectedButtonIndex = 0;} else if (selectedButtonIndex === 1) { exitGame(); } } startAutoDemoTimer(); break; case "Escape": if (isFiringModeSelectMode) { isFiringModeSelectMode = false; if (selectedOnePlayerGameVariant === 'CLASSIC_1P') { isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 0; } else if (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' || selectedOnePlayerGameVariant === '1P_VS_AI_COOP') { isOnePlayerVsAIGameTypeSelectMode = true; selectedButtonIndex = (selectedOnePlayerGameVariant === '1P_VS_AI_COOP' ? 1 : 0); } else if (isTwoPlayerMode && !isPlayerTwoAI) { isGameModeSelectMode = true; selectedButtonIndex = (selectedGameMode === 'coop' ? 1 : 0); } else { isPlayerSelectMode = false; selectedButtonIndex = 0; } selectedOnePlayerGameVariant = ''; isPlayerTwoAI = false; selectedGameMode = 'normal'; } else if (isOnePlayerVsAIGameTypeSelectMode) { isOnePlayerVsAIGameTypeSelectMode = false; isOnePlayerGameTypeSelectMode = true; selectedButtonIndex = 1; } else if (isOnePlayerGameTypeSelectMode) { isOnePlayerGameTypeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 0; } else if (isGameModeSelectMode) { isGameModeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 1; } else if (isPlayerSelectMode) { isPlayerSelectMode = false; selectedButtonIndex = 0; } else { triggerFullscreen(); } startAutoDemoTimer(); break; default: startAutoDemoTimer(); break; } } } } catch(err) { console.error("Error in handleKeyDown:", err); keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false; keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; } }
function handleKeyUp(e) { /* ... ongewijzigd ... */ try { switch (e.code) { case "ArrowLeft": case "KeyA": keyboardP1LeftDown = false; break; case "ArrowRight": case "KeyD": keyboardP1RightDown = false; break; case "Space": case "ArrowUp": case "KeyW": keyboardP1ShootDown = false; p1JustFiredSingle = false; break; case "KeyJ": case "Numpad4": keyboardP2LeftDown = false; break; case "KeyL": case "Numpad6": keyboardP2RightDown = false; break; case "KeyI": case "Numpad0": keyboardP2ShootDown = false; p2JustFiredSingle = false; break; } if (e.key.toLowerCase() === "j") keyboardP2LeftDown = false; if (e.key.toLowerCase() === "l") keyboardP2RightDown = false; if (e.key.toLowerCase() === "i") { keyboardP2ShootDown = false; p2JustFiredSingle = false; } } catch(err) { console.error("Error in handleKeyUp:", err); keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false; keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false; p1JustFiredSingle = false; p2JustFiredSingle = false;} }


// --- Gamepad Event Handlers ---
function handleGamepadConnected(event) { /* ... ongewijzigd ... */ try { if (audioContext && audioContext.state === 'suspended') { audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed by gamepad connection."); }); } if (connectedGamepadIndex === null) { connectedGamepadIndex = event.gamepad.index; const numButtons = event.gamepad.buttons.length; previousButtonStates = new Array(numButtons).fill(false); previousDemoButtonStates = new Array(numButtons).fill(false); previousGameButtonStates = new Array(numButtons).fill(false); if (!isInGameState) { stopAutoDemoTimer(); selectedButtonIndex = 0; } } else if (connectedGamepadIndexP2 === null) { connectedGamepadIndexP2 = event.gamepad.index; const numButtons = event.gamepad.buttons.length; previousGameButtonStatesP2 = new Array(numButtons).fill(false); } } catch(e) { console.error("Error in handleGamepadConnected:", e); } }
function handleGamepadDisconnected(event) { /* ... ongewijzigd ... */ try { if (connectedGamepadIndex === event.gamepad.index) { connectedGamepadIndex = null; previousButtonStates = []; previousDemoButtonStates = []; previousGameButtonStates = []; if (!isInGameState) { selectedButtonIndex = -1; joystickMovedVerticallyLastFrame = false; startAutoDemoTimer(); } p1FireInputWasDown = false; } else if (connectedGamepadIndexP2 === event.gamepad.index) { connectedGamepadIndexP2 = null; previousGameButtonStatesP2 = []; p2FireInputWasDown = false; } } catch(e) { console.error("Error in handleGamepadDisconnected:", e); p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; } }

// --- High Score ---
function saveHighScore() { /* ... inhoud ongewijzigd ... */ try { let potentialNewHighScore = 0; if (isTwoPlayerMode && selectedGameMode === 'coop') { potentialNewHighScore = Math.max(player1Score, player2Score); } else if (isTwoPlayerMode && selectedGameMode === 'normal') { potentialNewHighScore = Math.max(player1Score, player2Score); } else { potentialNewHighScore = score; } if (isManualControl && potentialNewHighScore > highScore) { highScore = potentialNewHighScore; } } catch (e) { console.error("Error in saveHighScore:", e); } }
function loadHighScore() { /* ... ongewijzigd ... */ try { highScore = 20000; } catch (e) { console.error("Error in loadHighScore:", e); highScore = 20000; } }

// --- Pauze Functies ---
const soundsToPauseOnSystemPause = Object.keys(SOUND_PATHS);
let soundPausedStates = {};

function pauseAllSounds() {
    if (audioContext && audioContext.state === 'running') {
        audioContext.suspend().then(() => console.log("AudioContext suspended for pause.")).catch(e => console.error("Error suspending AudioContext:", e));
    }
    stopSound(menuMusicSound);
}

function resumeAllSounds() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => console.log("AudioContext resumed from pause.")).catch(e => console.error("Error resuming AudioContext:", e));
    }
    if (!isInGameState && audioContext) {
        playSound(menuMusicSound, true, 0.2);
    }
}


/** Toggles the pause state and handles sounds. */
function togglePause() {
    let canPause = false;
    const isAnyGameOverMessageShowing = isShowingPlayerGameOverMessage || (isTwoPlayerMode && selectedGameMode === 'coop' && (isPlayer1ShowingGameOverMessage || isPlayer2ShowingGameOverMessage));

    if (isInGameState && gameOverSequenceStartTime === 0 && !isAnyGameOverMessageShowing) {
        if (!isManualControl) {
            canPause = true;
        } else if (isTwoPlayerMode && selectedGameMode === 'coop') {
            canPause = (player1Lives > 0 && ship1 && !isPlayer1ShipCaptured && !player1NeedsRespawnAfterCapture) ||
                       (player2Lives > 0 && ship2 && !isPlayer2ShipCaptured && !player2NeedsRespawnAfterCapture);
        } else if (isTwoPlayerMode && selectedGameMode === 'normal' && isPlayerTwoAI && currentPlayer === 2) {
             canPause = false;
        } else {
            canPause = playerLives > 0 && ship && !isShipCaptured;
        }
    }

    if (!canPause) return;

    isPaused = !isPaused;
    if (isPaused) {
        pauseAllSounds();
        clearTimeout(mouseIdleTimerId);
        mouseIdleTimerId = null;
    } else {
        resumeAllSounds();
        clearTimeout(mouseIdleTimerId);
        mouseIdleTimerId = setTimeout(hideCursor, 2000);
         if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => { audioContextInitialized = true; console.log("AudioContext resumed explicitly after unpause.");});
        }
    }
}


// <<< HELPER FUNCTIE processSingleController (ongewijzigd) >>>
function processSingleController(gamepad, previousButtonStates) { const currentButtonStates = gamepad.buttons.map(b => b.pressed); const result = { left: false, right: false, shoot: false, pause: false, back: false, newButtonStates: currentButtonStates.slice() }; const crossButton = currentButtonStates[PS5_BUTTON_CROSS]; const r1ButtonNow = currentButtonStates[PS5_BUTTON_R1]; const r1ButtonLast = previousButtonStates[PS5_BUTTON_R1] ?? false; const triangleButtonNow = currentButtonStates[PS5_BUTTON_TRIANGLE]; const triangleButtonLast = previousButtonStates[PS5_BUTTON_TRIANGLE] ?? false; const axisX = gamepad.axes[PS5_LEFT_STICK_X] ?? 0; const dpadLeft = currentButtonStates[PS5_DPAD_LEFT]; const dpadRight = currentButtonStates[PS5_DPAD_RIGHT]; const AXIS_THRESHOLD = AXIS_DEAD_ZONE_GAMEPLAY; if (axisX < -AXIS_THRESHOLD || dpadLeft) { result.left = true; } else if (axisX > AXIS_THRESHOLD || dpadRight) { result.right = true; } if (crossButton) { result.shoot = true; } if (r1ButtonNow && !r1ButtonLast) { result.pause = true; } if (triangleButtonNow && !triangleButtonLast) { result.back = true; } return result; }

/**
 * Functie om de *definitieve* game over sequence te starten
 */
function triggerFinalGameOverSequence() {
    if (isInGameState && gameOverSequenceStartTime === 0) {
        isPaused = false; isShowingDemoText = false; isShowingIntro = false; isWaveTransitioning = false; showCsHitsMessage = false; showExtraLifeMessage = false; showPerfectMessage = false; showCSClearMessage = false; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showReadyMessage = false; showCsBonusScoreMessage = false; isShowingPlayerGameOverMessage = false; isEntrancePhaseActive = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false;
        if (isManualControl) { saveHighScore(); }

        const soundsToStopOnFinalGameOver = Object.keys(SOUND_PATHS).filter(id => id !== 'GAME_OVER' && id !== 'RESULTS_MUSIC');
        soundsToStopOnFinalGameOver.forEach(soundId => stopSound(soundId));
        isGridSoundPlaying = false;

        const now = Date.now();
        playSound(gameOverSound, false, 0.4);

        if ((isTwoPlayerMode && selectedGameMode === 'normal' && player1Lives <= 0 && player2Lives <= 0) ||
            (selectedOnePlayerGameVariant === '1P_VS_AI_NORMAL' && player1Lives <= 0 && player2Lives <= 0) ) {
            gameOverSequenceStartTime = now - GAME_OVER_DURATION;
        } else {
            gameOverSequenceStartTime = now;
        }

        bullets = []; enemyBullets = []; explosions = []; fallingShips = []; isDualShipActive = false;
        player1IsDualShipActive = false; player2IsDualShipActive = false;
        isShowingResultsScreen = false;
        previousButtonStates = []; previousGameButtonStates = []; previousDemoButtonStates = []; previousGameButtonStatesP2 = [];
    }
}

/** Triggert de game over sequence (roept nu helper aan) */
function triggerGameOver() { triggerFinalGameOverSequence(); }

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF FILE setup_utils.js ---