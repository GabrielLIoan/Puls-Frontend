export default {
  // Navigation tabs
  nav: {
    feed: 'Feed',
    saved: 'Salvate',
    profile: 'Profil',
  },

  // Feed screen
  feed: {
    title: 'Puls',
    personalizedFeed: 'Feed-ul tău personalizat',
    noArticles: 'Niciun articol momentan — revino mai târziu.',
    couldNotLoad: 'Nu am putut încărca feed-ul',
    somethingWentWrong: 'Ceva nu a mers bine',
  },

  // Article detail screen
  article: {
    readFullArticle: 'Citește articolul complet pe %{outlet}',
    signInToSave: 'Autentifică-te pentru a salva',
    signInToSaveMessage:
      'Crează un cont sau autentifică-te pentru a salva articole.',
    signInToReact: 'Autentifică-te pentru a reacționa',
    signInToReactMessage:
      'Crează un cont sau autentifică-te pentru a reacționa.',
    cancel: 'Anulează',
  },

  // Auth screens
  auth: {
    signInTitle: 'Bine ai revenit',
    signInSubtitle: 'Autentifică-te pentru a continua în Puls',
    signUpTitle: 'Crează cont',
    signUpSubtitle: 'Alătură-te Puls pentru a-ți personaliza feed-ul',
    email: 'Email',
    password: 'Parolă',
    passwordPlaceholder: '••••••••',
    name: 'Nume (opțional)',
    namePlaceholder: 'Numele tău',
    emailPlaceholder: 'tu@exemplu.com',
    newPasswordPlaceholder: 'Cel puțin 8 caractere',
    loginButton: 'Autentifică-te',
    signupButton: 'Crează cont',
    noAccount: 'Nu ai cont?',
    alreadyHaveAccount: 'Ai deja cont?',
    signUpLink: 'Înregistrează-te',
    loginLink: 'Autentifică-te',
    incorrectCredentials: 'Email sau parolă incorectă.',
    emailExists: 'Există deja un cont cu acest email.',
    passwordTooShort: 'Parola trebuie să aibă cel puțin 8 caractere.',
    genericError: 'Ceva nu a mers bine. Încearcă din nou.',
    forgotPassword: 'Ai uitat parola?',
    forgotPasswordTitle: 'Ai uitat parola?',
    forgotPasswordSubtitle: 'Introdu emailul și îți trimitem un link de resetare.',
    sendResetLink: 'Trimite link de resetare',
    checkYourEmail: 'Verifică emailul',
    resetEmailSent: 'Am trimis un link de resetare la %{email} dacă există un cont.',
    backToLogin: 'Înapoi la autentificare',
    resetPasswordTitle: 'Setează o nouă parolă',
    resetPasswordSubtitle: 'Alege o parolă puternică pentru contul tău Puls.',
    newPassword: 'Parolă nouă',
    confirmPassword: 'Confirmă parola',
    confirmPasswordPlaceholder: 'Repetă parola',
    updatePassword: 'Actualizează parola',
    passwordUpdated: 'Parolă actualizată!',
    passwordUpdatedSubtitle: 'Parola ta a fost schimbată. Autentifică-te cu noua parolă.',
    passwordsDoNotMatch: 'Parolele nu coincid.',
    invalidResetLink: 'Acest link de resetare este invalid. Te rugăm să soliciți unul nou.',
    invalidOrExpiredToken: 'Acest link a expirat sau a fost deja folosit. Te rugăm să soliciți unul nou.',
      },

  // Profile screen
  profile: {
    signInTitle: 'Autentifică-te în Puls',
    signInSubtitle:
      'Salvează articole, personalizează sursele și reacționează la știri.',
    manageOutlets: 'Gestionează surse',
    categoryPreferences: 'Preferințe categorii',
    language: 'Limbă',
    logout: 'Deconectează-te',
    changePassword: 'Schimbă parola',  
  },

  // Language switcher
  language: {
    en: '🇬🇧 English',
    ro: '🇷🇴 Română',
  },

  // Saved screen
  saved: {
    title: 'Salvate',
    saveTitle: 'Salvează articole pentru mai târziu',
    saveSubtitle: 'Autentifică-te pentru a salva articole.',
    empty:
      'Niciun articol salvat — apasă iconița bookmark pentru a salva.',
    couldNotLoad: 'Nu am putut încărca articolele salvate',
  },

  // Outlet settings screen
  outlets: {
    title: 'Gestionează surse',
    romania: 'România',
    euInternational: 'UE / Internațional',
    couldNotLoad: 'Nu am putut încărca setările surselor.',
  },

  // Reactions
  reactions: {
    signInToReact: 'Autentifică-te pentru a reacționa',
    signInToReactMessage:
      'Crează un cont sau autentifică-te pentru a reacționa.',
    cancel: 'Anulează',
    loginButton: 'Autentifică-te',
  },

  // Gamification — XP and streaks
  xp: {
    level: 'Nivel %{level}',
    xpCount: '%{xp} XP',
    streak: 'Serie de %{count} zile',
    streakSingular: 'Serie de 1 zi',
    nextLevel: '%{xp} XP până la nivelul următor',
    maxLevel: 'Nivel maxim atins',
    xpEarned: '+%{xp} XP',
    longestStreak: 'Cea mai lungă: %{count} zile',
    days: 'zile',
    day: 'zi',
  },

  // Level names
  levels: {
    1: 'Cititor',
    2: 'Curios',
    3: 'Informat',
    4: 'Analist',
    5: 'Expert',
    6: 'Jurnalist',
    7: 'Redactor',
    8: 'Cronicar',
  },

  // Badge gallery
  badges: {
    title: 'Insigne',
    first_spark: {
      name: 'Prima Scânteie',
      description: 'Citește știri 3 zile la rând',
    },
    informed_week: {
      name: 'Săptămâna Informată',
      description: 'Citește știri 7 zile la rând',
    },
    news_month: {
      name: 'Luna Știrilor',
      description: 'Citește știri 30 de zile la rând',
    },
    iron_chronicler: {
      name: 'Cronicar de Fier',
      description: 'Citește știri 100 de zile la rând',
    },
    explorer: {
      name: 'Explorator',
      description: 'Citește 3 categorii diferite într-o săptămână',
    },
    polyglot: {
      name: 'Poliglot de Știri',
      description: 'Citește din surse românești și europene în aceeași zi',
    },
    omnivore: {
      name: 'Omnivor',
      description: 'Citește 5 categorii diferite într-o zi',
    },
    loyal_fan: {
      name: 'Fan Fidel',
      description: 'Citește 50 de articole de la aceeași sursă',
    },
    collector: {
      name: 'Colecționar',
      description: 'Salvează 10 articole',
    },
    reactor: {
      name: 'Reacționează',
      description: 'Reacționează la 10 articole',
    },
  },

  // Not found screen
  notFound: {
    title: 'Această pagină nu există.',
    goHome: 'Mergi la pagina principală',
  },

  // Common / shared
  common: {
    cancel: 'Anulează',
    login: 'Autentifică-te',
    createAccount: 'Crează un cont',
    retry: 'Încearcă din nou',
    loading: 'Se încarcă...',
    error: 'Ceva nu a mers bine',
  },

  // Notifications
  notifications: {
    title: 'Digest zilnic',
    subtitle: 'Primești un rezumat zilnic al articolelor noi',
    digestTime: 'Trimite la',
    morning: '8:00',
    afternoon: '13:00',
    evening: '19:00',
  },

  search: {
    placeholder: 'Caută articole...',
    cancel: 'Anulează',
    noResults: 'Niciun rezultat pentru "%{query}"',
    searching: 'Se caută...',
  },

  theme: {
    title: 'Aspect',
    light: 'Deschis',
    dark: 'Întunecat',
    system: 'Sistem',
  },

  categories: {
    title: 'Preferințe categorii',
    subtitleAll: 'Nicio categorie selectată — feed-ul afișează toate știrile. Apasă categoriile de mai jos pentru a filtra.',
    subtitleFiltered: '%{count} categorii selectate — feed-ul afișează doar acestea.',
    clearAll: 'Șterge tot — afișează toate',
    hint: 'Feed-ul tău personalizat va afișa doar articole din categoriile selectate.',
    politics: 'Politică',
    economy: 'Economie',
    sport: 'Sport',
    tech: 'Tehnologie',
    culture: 'Cultură',
    world: 'Internațional',
    romania: 'România',
    emoji: {
      politics: '🏛️',
      economy: '📈',
      sport: '⚽',
      tech: '💻',
      culture: '🎭',
      world: '🌍',
      romania: '🇷🇴',
    },
  },

  filter: {
    title: 'Filtrează feed-ul',
    country: 'Țară',
    category: 'Categorie',
    clearAll: 'Șterge tot',
    active: '%{count} filtru(e) activ(e)',
    noResults: 'Niciun articol nu corespunde filtrelor. Încearcă să elimini unele.',
    noCategories: 'Nicio categorie găsită încă.',
  },
};