// ─── Translations (EN / தமிழ்) ─────────────────────────────────────────────
// UI chrome only. Lesson/game/test content stays in English (that is what
// is being TAUGHT). Tamil is the language of instruction.

const translations = {
  en: {
    // ── Auth ──────────────────────────────────────────────────────────────
    appName:          'Dys-Learn',
    loginTitle:       'Dys-Learn',
    loginSubtitle:    'Ready to explore and learn?',
    registerTitle:    'Join the Crew',
    registerSubtitle: 'Become a new Space Explorer!',
    learnerName:      'Learner Name',
    secretCode:       'Secret Code (Password)',
    blastOff:         'BLAST OFF!',
    joinCrew:         'JOIN CREW!',
    newLearner:       'New learner?',
    joinLink:         'Join the crew!',
    haveAccount:      'Already have an account?',
    loginLink:        'Log in here!',
    needHelp:         'Need help?',
    askGrownUp:       'Ask a grown-up!',
    usernamePlaceholder: 'Your name',
    passwordPlaceholder: 'Your secret code',

    // ── Sidebar nav ────────────────────────────────────────────────────────
    dashboard:      'Dashboard',
    lessons:        'Lessons',
    games:          'Games',
    tests:          'Tests',
    parentsPortal:  'Parents Portal',
    logOut:         'Log Out',
    replay:         '🔄 Replay',
    slowSpeed:      '🐢 Slow Speed',
    normalSpeed:    '🐇 Normal Speed',

    // ── Dashboard — identity bar ────────────────────────────────────────────
    dayStreak:       '🔥 Day Streak',
    rankCadet:       '⭐ Star Cadet',
    rankExplorer:    '🚀 Galaxy Explorer',
    rankMaster:      '🌌 Cosmic Master',

    // ── Dashboard — planet ─────────────────────────────────────────────────
    planetLevel:        '🌍 Planet Level',
    toNextLevel:        '% to next level',

    // ── Dashboard — quests panel ───────────────────────────────────────────
    todaysQuests:       "⚔️ Today's Quests",
    questsDone:         'Quests Done',
    xpSuffix:           'XP',

    // ── Dashboard — vault panel ────────────────────────────────────────────
    progressVault:      '🏆 Progress Vault',
    alphabetsLabel:     '📖 Alphabets',
    numbersLabel:       '🔢 Numbers',
    starsThisWeek:      '⭐ Stars Collected This Week',
    locked:             'Locked',

    // ── Dashboard — portals ────────────────────────────────────────────────
    tapToEnter:   'Tap to Enter',
    active:       '● Active',
    comingSoon:   '◎ Coming Soon',

    // ── PIN modal ──────────────────────────────────────────────────────────
    parentsOnly:       'Parents Only',
    pinInstruction:    'Please enter the PIN to continue.',
    incorrectPin:      'Incorrect PIN. Try again.',
    cancel:            'Cancel',
    unlock:            'Unlock',

    // ── Lessons hub ────────────────────────────────────────────────────────
    chooseLessonTitle: '📚 Choose a Lesson',
    chooseLessonSub:   'What would you like to explore today?',
    startLearning:     'Start Learning →',
    backToCategories:  'Categories',
    learnAlphabets:    '🔤 Learn Alphabets',
    learnNumbers:      '🔢 Learn Numbers',
    unlockOneByOne:    'Unlock one by one as you learn!',
    unlocked:          'unlocked',
    backTo:            'Back to',
    lessonSuffix:      'lessons',

    // ── Lesson categories ──────────────────────────────────────────────────
    cat_alphabets:     'Alphabets',
    cat_alphabets_d:   'Learn letters A – Z with fun words!',
    cat_numbers:       'Numbers',
    cat_numbers_d:     'Count from 1 to 10 with stars!',
    cat_phonics:       'Phonics Basics',
    cat_phonics_d:     'Learn letter sounds!',
    cat_simplewords:   'Simple Words',
    cat_simplewords_d: 'Read 2–3 letter words!',
    cat_sightwords:    'Sight Words',
    cat_sightwords_d:  'Common words flashcards!',
    cat_wordbuilding:  'Word Building',
    cat_wordbuilding_d:'Combine letters to build words!',
    cat_sentence:      'Sentences',
    cat_sentence_d:    'Build simple sentences!',
    cat_reading:       'Reading Practice',
    cat_reading_d:     'Read short sentences!',
    cat_listening:     'Listening',
    cat_listening_d:   'Listen and match images!',

    // ── Games hub ──────────────────────────────────────────────────────────
    chooseGameTitle: '🎮 Choose a Game',
    chooseGameSub:   'Have fun and earn shiny badges!',
    playNow:         'Play Now →',
    backToDashboard: 'Back to Dashboard',

    // ── Game categories ────────────────────────────────────────────────────
    game_memory:   'Memory Match',
    game_memory_d: 'Match words to pictures!',
    game_letter:   'Letter Match',
    game_letter_d: 'Match big and small letters!',
    game_sound:    'Sound Match',
    game_sound_d:  'Listen and pick the right letter!',
    game_builder:  'Word Builder',
    game_builder_d:'Fix the scrambled words!',
    game_missing:  'Missing Letter',
    game_missing_d:'Fill in the missing letter!',
    game_quick:    'Quick Tap',
    game_quick_d:  'Tap the matching picture fast!',

    // ── Tests hub ──────────────────────────────────────────────────────────
    testRoomTitle: 'Test Room',
    testXP:        'TEST XP',
    badges:        'BADGES',
    startTest:     'Start Test',
    playAgain:     'Play Again',

    // ── Test categories ────────────────────────────────────────────────────
    test_alphabet:   'Alphabet Test',
    test_alphabet_d: 'Identify & Match Letters',
    test_phonics:    'Phonics Test',
    test_phonics_d:  'Match Sounds to Letters',
    test_simple:     'Simple Words',
    test_simple_d:   'Identify words from images',
    test_sight:      'Sight Words',
    test_sight_d:    'Recognize common words',
    test_wordbuilding:'Word Building',
    test_wordbuilding_d:'Unscramble mixed letters',
    test_sentence:   'Sentences',
    test_sentence_d: 'Arrange words correctly',
    test_reading:    'Reading',
    test_reading_d:  'Read and answer!',

    // ── Parents Portal ─────────────────────────────────────────────────────
    analyticsTitle:     'Analytics & Parent Portal',
    analyticsSubtitle:  "A private view of your child's learning journey.",
    backToStudent:      'Back to Student Space',
    totalScore:         'Total Score',
    lessonsViewed:      'Lessons Viewed',
    testsMastered:      'Tests Mastered',
    skillDev:           'Core Skill Development',
    reading:            'Reading Comprehension',
    writing:            'Writing & Tracing',
    auditory:           'Auditory & Phonics',
    memory:             'Memory & Recall',
    good:               'Good',
    improving:          'Improving',
    beginner:           'Beginner',
    strengths:          'Identified Strengths',
    recommended:        'Recommended Focus',
    activityLog:        'Recent Activity Timeline',
    testHistory:        'Test History',
    noActivity:         'No activity yet. Start playing!',
    noTests:            'No tests completed yet.',
    score:              'Score',
    date:               'Date',
    currentStreak:      'Current Streak',
    days:               'days',
    gamesPlayed:        'Games Played',
  },

  // ════════════════════════════════════════════════════════════════════════════
  ta: {
    // ── Auth ──────────────────────────────────────────────────────────────
    appName:          'டிஸ்-லேர்ன்',
    loginTitle:       'டிஸ்-லேர்ன்',
    loginSubtitle:    'ஆராய்ந்து கற்கத் தயாரா?',
    registerTitle:    'குழுவில் சேரு',
    registerSubtitle: 'புதிய விண்வெளி வீரராகு!',
    learnerName:      'கற்பவரின் பெயர்',
    secretCode:       'இரகசிய குறியீடு (கடவுச்சொல்)',
    blastOff:         'புறப்படு! 🚀',
    joinCrew:         'குழுவில் சேர்!',
    newLearner:       'புதிய கற்பவரா?',
    joinLink:         'குழுவில் சேரு!',
    haveAccount:      'கணக்கு ஏற்கனவே உள்ளதா?',
    loginLink:        'இங்கே உள்நுழை!',
    needHelp:         'உதவி வேண்டுமா?',
    askGrownUp:       'பெரியவரிடம் கேளு!',
    usernamePlaceholder: 'உங்கள் பெயர்',
    passwordPlaceholder: 'இரகசிய குறியீடு',

    // ── Sidebar nav ────────────────────────────────────────────────────────
    dashboard:      'முகப்பு',
    lessons:        'பாடங்கள்',
    games:          'விளையாட்டுகள்',
    tests:          'தேர்வுகள்',
    parentsPortal:  'பெற்றோர் இடம்',
    logOut:         'வெளியேறு',
    replay:         '🔄 மீண்டும் கேள்',
    slowSpeed:      '🐢 மெதுவாக',
    normalSpeed:    '🐇 சாதாரண வேகம்',

    // ── Dashboard — identity bar ────────────────────────────────────────────
    dayStreak:       '🔥 நாள் தொடர்',
    rankCadet:       '⭐ நட்சத்திர வீரர்',
    rankExplorer:    '🚀 விண்ணெளி ஆய்வாளர்',
    rankMaster:      '🌌 பிரபஞ்ச மேதை',

    // ── Dashboard — planet ─────────────────────────────────────────────────
    planetLevel:        '🌍 கோள் நிலை',
    toNextLevel:        '% அடுத்த நிலைக்கு',

    // ── Dashboard — quests panel ───────────────────────────────────────────
    todaysQuests:       '⚔️ இன்றைய பணிகள்',
    questsDone:         'பணிகள் முடிந்தன',
    xpSuffix:           'XP',

    // ── Dashboard — vault panel ────────────────────────────────────────────
    progressVault:      '🏆 முன்னேற்ற பேழை',
    alphabetsLabel:     '📖 எழுத்துக்கள்',
    numbersLabel:       '🔢 எண்கள்',
    starsThisWeek:      '⭐ இந்த வாரம் நட்சத்திரங்கள்',
    locked:             'பூட்டு',

    // ── Dashboard — portals ────────────────────────────────────────────────
    tapToEnter:   'உள்ளே செல்க',
    active:       '● செயலில்',
    comingSoon:   '◎ விரைவில்',

    // ── PIN modal ──────────────────────────────────────────────────────────
    parentsOnly:       'பெற்றோருக்கு மட்டும்',
    pinInstruction:    'தொடர PIN எண்ணை உள்ளிடவும்.',
    incorrectPin:      'தவறான PIN. மீண்டும் முயற்சி செய்.',
    cancel:            'ரத்து செய்',
    unlock:            'திற',

    // ── Lessons hub ────────────────────────────────────────────────────────
    chooseLessonTitle: '📚 பாடம் தேர்ந்தெடு',
    chooseLessonSub:   'இன்று என்ன கற்க விரும்புகிறாய்?',
    startLearning:     'கற்கத் தொடங்கு →',
    backToCategories:  'பகுப்புகள்',
    learnAlphabets:    '🔤 எழுத்துக்கள் கற்போம்',
    learnNumbers:      '🔢 எண்கள் கற்போம்',
    unlockOneByOne:    'ஒவ்வொன்றாகக் கற்று திறப்போம்!',
    unlocked:          'திறக்கப்பட்டது',
    backTo:            'திரும்பு',
    lessonSuffix:      'பாடங்கள்',

    // ── Lesson categories ──────────────────────────────────────────────────
    cat_alphabets:     'எழுத்துக்கள்',
    cat_alphabets_d:   'A முதல் Z வரை மகிழ்ச்சியாக கற்போம்!',
    cat_numbers:       'எண்கள்',
    cat_numbers_d:     '1 முதல் 10 வரை நட்சத்திரங்களுடன் எண்போம்!',
    cat_phonics:       'ஒலி அடிப்படைகள்',
    cat_phonics_d:     'எழுத்துகளின் ஒலிகளை கற்போம்!',
    cat_simplewords:   'எளிய வார்த்தைகள்',
    cat_simplewords_d: '2-3 எழுத்து வார்த்தைகள் படிக்கலாம்!',
    cat_sightwords:    'பார்வை வார்த்தைகள்',
    cat_sightwords_d:  'அடிக்கடி பயன்படும் வார்த்தைகள்!',
    cat_wordbuilding:  'வார்த்தை கட்டுதல்',
    cat_wordbuilding_d:'எழுத்துகளை இணைத்து வார்த்தை உருவாக்கு!',
    cat_sentence:      'வாக்கியங்கள்',
    cat_sentence_d:    'எளிய வாக்கியங்கள் உருவாக்கு!',
    cat_reading:       'வாசிப்பு பயிற்சி',
    cat_reading_d:     'சிறு வாக்கியங்கள் படி!',
    cat_listening:     'கேட்கும் திறன்',
    cat_listening_d:   'கேட்டு படங்களுடன் பொருத்து!',

    // ── Games hub ──────────────────────────────────────────────────────────
    chooseGameTitle: '🎮 விளையாட்டு தேர்ந்தெடு',
    chooseGameSub:   'மகிழ்ந்து விளையாடி பதக்கங்கள் பெறு!',
    playNow:         'இப்போது விளையாடு →',
    backToDashboard: 'முகப்புக்கு திரும்பு',

    // ── Game categories ────────────────────────────────────────────────────
    game_memory:   'நினைவாற்றல் விளையாட்டு',
    game_memory_d: 'வார்த்தைகளை படங்களுடன் பொருத்து!',
    game_letter:   'எழுத்து பொருத்துதல்',
    game_letter_d: 'பெரிய மற்றும் சிறிய எழுத்துகளை பொருத்து!',
    game_sound:    'ஒலி பொருத்துதல்',
    game_sound_d:  'கேட்டு சரியான எழுத்தை தேர்ந்தெடு!',
    game_builder:  'வார்த்தை கட்டுபவர்',
    game_builder_d:'கலைக்கப்பட்ட வார்த்தைகளை சரிசெய்!',
    game_missing:  'காணாத எழுத்து',
    game_missing_d:'காணாத எழுத்தை நிரப்பு!',
    game_quick:    'விரைவு தொடுதல்',
    game_quick_d:  'சரியான படத்தை விரைவாக தொடு!',

    // ── Tests hub ──────────────────────────────────────────────────────────
    testRoomTitle: 'தேர்வு அறை',
    testXP:        'தேர்வு XP',
    badges:        'பதக்கங்கள்',
    startTest:     'தேர்வு தொடங்கு',
    playAgain:     'மீண்டும் விளையாடு',

    // ── Test categories ────────────────────────────────────────────────────
    test_alphabet:   'எழுத்து தேர்வு',
    test_alphabet_d: 'எழுத்துகளை அடையாளம் காண்',
    test_phonics:    'ஒலி தேர்வு',
    test_phonics_d:  'ஒலிகளை எழுத்துகளுடன் பொருத்து',
    test_simple:     'எளிய வார்த்தைகள்',
    test_simple_d:   'படங்களிலிருந்து வார்த்தைகளை கண்டுபிடி',
    test_sight:      'பார்வை வார்த்தைகள்',
    test_sight_d:    'பொதுவான வார்த்தைகளை அடையாளம் காண்',
    test_wordbuilding:'வார்த்தை கட்டுதல்',
    test_wordbuilding_d:'கலைக்கப்பட்ட எழுத்துகளை சரிசெய்',
    test_sentence:   'வாக்கியங்கள்',
    test_sentence_d: 'வார்த்தைகளை சரியான வரிசையில் வை',
    test_reading:    'வாசிப்பு',
    test_reading_d:  'படித்து பதிலளி!',

    // ── Parents Portal ─────────────────────────────────────────────────────
    analyticsTitle:     'பகுப்பாய்வு & பெற்றோர் இடம்',
    analyticsSubtitle:  'உங்கள் குழந்தையின் கற்றல் பயணத்தின் தனிப்பட்ட பார்வை.',
    backToStudent:      'மாணவர் இடத்திற்கு திரும்பு',
    totalScore:         'மொத்த மதிப்பெண்',
    lessonsViewed:      'பாடங்கள் பார்த்தவை',
    testsMastered:      'தேர்வுகள் வென்றவை',
    skillDev:           'முக்கிய திறன் வளர்ச்சி',
    reading:            'வாசிப்பு புரிதல்',
    writing:            'எழுத்து & வரைதல்',
    auditory:           'கேட்கும் திறன் & ஒலி',
    memory:             'நினைவாற்றல் & திரும்ப பெறுதல்',
    good:               'நல்லது',
    improving:          'மேம்படுகிறது',
    beginner:           'தொடக்கநிலை',
    strengths:          'கண்டறியப்பட்ட பலன்கள்',
    recommended:        'பரிந்துரைக்கப்பட்ட கவனம்',
    activityLog:        'சமீபத்திய செயல்பாடு',
    testHistory:        'தேர்வு வரலாறு',
    noActivity:         'இன்னும் செயல்பாடு இல்லை. விளையாடத் தொடங்கு!',
    noTests:            'இன்னும் தேர்வுகள் முடிக்கப்படவில்லை.',
    score:              'மதிப்பெண்',
    date:               'தேதி',
    currentStreak:      'தற்போதைய தொடர்',
    days:               'நாட்கள்',
    gamesPlayed:        'விளையாடிய விளையாட்டுகள்',
  },
};

/**
 * Returns the translation for a given key in the given language.
 * Falls back to English if the key is missing in Tamil.
 * @param {'en' | 'ta'} lang
 * @param {string} key
 * @returns {string}
 */
export function t(lang, key) {
  return (translations[lang] && translations[lang][key]) ??
         translations['en'][key] ??
         key;
}

export default translations;
