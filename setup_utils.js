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
    COOP_AI_SAVE_PARTNER_DELAY_MS = 10000
;


// --- Globale State Variabelen ---
let starrySkyCanvas, starryCtx, retroGridCanvas, retroGridCtx, gameCanvas, gameCtx;
let stars = [];
let gridOffsetY = 0;
let isInGameState = false;
let isShowingScoreScreen = false;
let scoreScreenStartTime = 0;
let highScore = 20000;
// let highScoreHolderId = null; // Oude declaratie
window.highScoreHolderId = null; // << GEWIJZIGD: Expliciet aan window toevoegen
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
let normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastHitPosition = null;
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

// --- Touch Input Variabelen ---
let touchStartX = 0, touchStartY = 0;
let touchCurrentX = 0, touchCurrentY = 0;
let touchStartTime = 0;
let isTouchActiveGame = false; // Voor in-game besturing
let isTouchActiveMenu = false; // Voor menu interactie
let touchedMenuButtonIndex = -1; // Welke menuknop initieel is aangeraakt
let lastTapTime = 0; // Voor single fire debounce

// --- Portrait Mode Variabelen ---
let isShowingPortraitMessage = false;
let gameWasAutoPausedForPortrait = false;


const TOUCH_TAP_MAX_DURATION = 250; // ms voor een tap
const TOUCH_TAP_MAX_MOVEMENT = 20; // pixels toegestaan voor een tap
const TOUCH_SHIP_CONTROL_AREA_Y_FACTOR = 0.5; // Onderste helft scherm voor schipbesturing

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

    BASE_ENEMY_BULLET_SPEED = 7,
    MAX_ENEMY_BULLET_SPEED = 7,
    BASE_ENEMY_ATTACK_SPEED = 5.5,
    MAX_ENEMY_ATTACK_SPEED = 8.0,
    BASE_MAX_ATTACKING_ENEMIES = 10,
    MAX_MAX_ATTACKING_ENEMIES = 22,
    BASE_GRID_MOVE_SPEED = 0.3,
    MAX_GRID_MOVE_SPEED = 0.7,
    BASE_GRID_BREATH_CYCLE_MS = 2000,
    MIN_GRID_BREATH_CYCLE_MS = 1000,
    BASE_ENEMY_BULLET_BURST_COUNT = 1,
    MAX_ENEMY_BULLET_BURST_COUNT = 3,
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
const LIFE_ICON_SIZE = 35, LIFE_ICON_SPACING = 8, LIFE_ICON_MARGIN_BOTTOM = -1, LIFE_ICON_MARGIN_LEFT = MARGIN_SIDE - 30;
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
            setVolume('resultsMusicSound', 0.1);
            setVolume('hiScoreSound', 0.2);
        }, 100); // Short delay to allow GainNode creation
    }

    // Voeg touch event listeners toe aan gameCanvas
    if (gameCanvas) {
        gameCanvas.addEventListener('touchstart', handleTouchStartGlobal, { passive: false });
        gameCanvas.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
        gameCanvas.addEventListener('touchend', handleTouchEndGlobal, { passive: false });
        gameCanvas.addEventListener('touchcancel', handleTouchEndGlobal, { passive: false }); // Behandel cancel als een end
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
// ...
function handleTouchEndGlobal(event) {
    event.preventDefault();
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    let dx = 0, dy = 0;
    let interactionClientX, interactionClientY;

    if (event.changedTouches && event.changedTouches.length > 0) {
        interactionClientX = event.changedTouches[0].clientX;
        interactionClientY = event.changedTouches[0].clientY;
    } else {
        // Als er geen changedTouches zijn (kan gebeuren bij touchcancel),
        // gebruik de laatst bekende currentX/Y.
        interactionClientX = touchCurrentX;
        interactionClientY = touchCurrentY;
    }

    if (typeof interactionClientX === 'number' && typeof touchStartX === 'number') {
        dx = interactionClientX - touchStartX;
    }
    if (typeof interactionClientY === 'number' && typeof touchStartY === 'number') {
        dy = interactionClientY - touchStartY;
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const isTap = touchDuration < TOUCH_TAP_MAX_DURATION && distance < TOUCH_TAP_MAX_MOVEMENT;

    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const canvasTapX = (interactionClientX - rect.left) * scaleX;
    const canvasTapY = (interactionClientY - rect.top) * scaleY;

    if (!isShowingPortraitMessage && isTap) {
        const now = Date.now();
        let tapped2UpArea = false;
        if (typeof MARGIN_SIDE !== 'undefined' && typeof MARGIN_TOP !== 'undefined' && gameCanvas && gameCtx) {
            // ... (2UP tap logica blijft hetzelfde)
            gameCtx.font = "20px 'Press Start 2P'"; 
            let label2PWidthEstimate = gameCtx.measureText("2UP").width; 
            let score2PWidthEstimate = gameCtx.measureText("888888").width; 
            const approxFontHeight = 20;
            const area2UpX = gameCanvas.width - MARGIN_SIDE - Math.max(label2PWidthEstimate, score2PWidthEstimate) - SCORE_AREA_TAP_MARGIN;
            const area2UpY = MARGIN_TOP - SCORE_AREA_TAP_MARGIN;
            const area2UpWidth = Math.max(label2PWidthEstimate, score2PWidthEstimate) + 2 * SCORE_AREA_TAP_MARGIN;
            const area2UpHeight = (SCORE_OFFSET_Y + 5 + approxFontHeight) + 2 * SCORE_AREA_TAP_MARGIN;
            if (canvasTapX >= area2UpX && canvasTapX <= area2UpX + area2UpWidth &&
                canvasTapY >= area2UpY && canvasTapY <= area2UpY + area2UpHeight) {
                tapped2UpArea = true;
            }
        }
        if (tapped2UpArea) {
            if (lastTapArea === '2up' && (now - lastTapTimestamp < DOUBLE_TAP_MAX_INTERVAL)) {
                if (typeof stopGameAndShowMenu === 'function') {
                    stopGameAndShowMenu();
                    lastTapArea = null; lastTapTimestamp = 0;
                    isTouchActiveGame = false; isTouchActiveMenu = false; // Extra reset hier
                    touchedMenuButtonIndex = -1;
                    return; 
                }
            }
            lastTapArea = '2up'; lastTapTimestamp = now;
        } else {
            if (lastTapArea === '2up') { 
                lastTapArea = null; lastTapTimestamp = 0;
            }
        }
    }

    // Altijd resetten van isTouchActiveGame en isTouchActiveMenu aan het einde van een touch sequence,
    // tenzij een dubbel-tap hierboven al een return heeft veroorzaakt.
    const wasTouchActiveGame = isTouchActiveGame; // Onthoud de staat *voor* de tap-logica

    if (wasTouchActiveGame && isInGameState && !isShowingPortraitMessage) {
        if (isTap) {
            if (selectedFiringMode === 'single' && !(lastTapArea === '2up' && (Date.now() - lastTapTimestamp < DOUBLE_TAP_MAX_INTERVAL))) {
                if (Date.now() - lastTapTime > SHOOT_COOLDOWN / 2) {
                    let shooterPlayerIdForTap = 'player1';
                    if (isTwoPlayerMode && selectedGameMode === 'coop') {
                        // Voor CO-OP, bepaal schutter o.b.v. schermhelft (vereenvoudigd hier, kan complexer)
                        // Deze logica moet mogelijk robuuster als P2 ook via touch moet kunnen vuren.
                        // Voor nu, als P2 AI is, vuurt P1. Als P2 mens is, vuurt degene die het dichtstbij is, of P1.
                        if (ship2 && player2Lives > 0 && !isPlayerTwoAI) { // Alleen als P2 mens is
                             if (ship1 && ship2) { // Beide schepen bestaan
                                const distToShip1 = Math.abs(canvasTapX - (ship1.x + ship1.width / 2));
                                const distToShip2 = Math.abs(canvasTapX - (ship2.x + ship2.width / 2));
                                if (distToShip2 < distToShip1) {
                                    shooterPlayerIdForTap = 'player2';
                                }
                             } else if (ship2) { // Alleen P2 bestaat
                                shooterPlayerIdForTap = 'player2';
                             }
                        }
                        // Als P2 AI is, of P2 bestaat niet, blijft shooterPlayerIdForTap 'player1' (als P1 bestaat)
                        if (shooterPlayerIdForTap === 'player1' && (!ship1 || player1Lives <=0)) {
                            // Fallback als P1 niet kan schieten maar P2 wel
                            if (ship2 && player2Lives > 0) shooterPlayerIdForTap = isPlayerTwoAI ? 'ai_p2' : 'player2';
                            else shooterPlayerIdForTap = null; // Niemand kan schieten
                        }

                    } else if (isTwoPlayerMode && selectedGameMode === 'normal'){
                         shooterPlayerIdForTap = (currentPlayer === 1) ? 'player1' : (isPlayerTwoAI ? 'ai_p2' : 'player2');
                    }

                    if (shooterPlayerIdForTap) {
                        // Tijdelijk de fireInputWasDown vlag zetten voor firePlayerBullet
                        let oldP1FireInput = p1FireInputWasDown;
                        let oldP2FireInput = p2FireInputWasDown;
                        if (shooterPlayerIdForTap === 'player1') p1FireInputWasDown = true;
                        else if (shooterPlayerIdForTap === 'player2' || shooterPlayerIdForTap === 'ai_p2') p2FireInputWasDown = true;

                        if (typeof firePlayerBullet === 'function') {
                             firePlayerBullet(shooterPlayerIdForTap, true); // true voor isTapEvent
                        }
                        p1FireInputWasDown = oldP1FireInput; // Herstel de vlag
                        p2FireInputWasDown = oldP2FireInput;
                        lastTapTime = Date.now();
                    }
                }
            }
        }
        // shootPressed en p2ShootPressed worden in handlePlayerInput bepaald o.b.v. isTouchActiveGame
        // en gereset wanneer isTouchActiveGame false wordt.
    } else if (isTouchActiveMenu && !isInGameState && !isShowingPortraitMessage) {
        if (typeof handleCanvasTouch === 'function') {
            handleCanvasTouch(event, 'end', isTap);
        }
    }
    
    // Cruciale reset:
    isTouchActiveGame = false;
    isTouchActiveMenu = false;
    touchedMenuButtonIndex = -1;
    // Reset ook de raw input vlaggen die mogelijk door touch rapid fire zijn beïnvloed.
    // Deze worden normaal door keyboard/gamepad keyup gereset.
    // Voor touch rapid fire, is de "key down" zolang de vinger op het scherm is (isTouchActiveGame = true).
    // Als de vinger loslaat, is de "key up".
    if (selectedFiringMode === 'rapid' && wasTouchActiveGame) { // Alleen als rapid fire via touch actief was
        shootPressed = false; // Wordt in handlePlayerInput toch opnieuw geëvalueerd
        p2ShootPressed = false;
    }
}
// ...
// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF FILE setup_utils.js ---