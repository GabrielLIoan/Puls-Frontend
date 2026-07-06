export default {
  // Navigation tabs
  nav: {
    feed: 'Feed',
    saved: 'Saved',
    profile: 'Profile',
  },

  // Feed screen
  feed: {
    title: 'Puls',
    personalizedFeed: 'Your personalized feed',
    noArticles: 'No articles yet — check back soon.',
    couldNotLoad: "Couldn't load the feed",
    somethingWentWrong: 'Something went wrong',
  },

  // Article detail screen
  article: {
    readFullArticle: 'Read full article on %{outlet}',
    signInToSave: 'Sign in to save',
    signInToSaveMessage:
      'Create an account or log in to save articles for later.',
    signInToReact: 'Sign in to react',
    signInToReactMessage:
      'Create an account or log in to react to articles.',
    cancel: 'Cancel',
  },

  // Auth screens
  auth: {
    signInTitle: 'Welcome back',
    signInSubtitle: 'Log in to continue to Puls',
    signUpTitle: 'Create account',
    signUpSubtitle: 'Join Puls to personalize your feed',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    name: 'Name (optional)',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    newPasswordPlaceholder: 'At least 8 characters',
    loginButton: 'Log in',
    signupButton: 'Create account',
    noAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUpLink: 'Sign up',
    loginLink: 'Log in',
    incorrectCredentials: 'Incorrect email or password.',
    emailExists: 'An account with this email already exists.',
    passwordTooShort: 'Password must be at least 8 characters.',
    genericError: 'Something went wrong. Please try again.',
    forgotPassword: 'Forgot password?',
    forgotPasswordTitle: 'Forgot your password?',
    forgotPasswordSubtitle: 'Enter your email and we\'ll send you a reset link.',
    sendResetLink: 'Send reset link',
    checkYourEmail: 'Check your email',
    resetEmailSent: 'We\'ve sent a reset link to %{email} if an account exists.',
    backToLogin: 'Back to login',
    resetPasswordTitle: 'Set new password',
    resetPasswordSubtitle: 'Choose a strong password for your Puls account.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Repeat your password',
    updatePassword: 'Update password',
    passwordUpdated: 'Password updated!',
    passwordUpdatedSubtitle: 'Your password has been changed. Log in with your new password.',
    passwordsDoNotMatch: 'Passwords do not match.',
    invalidResetLink: 'This reset link is invalid. Please request a new one.',
    invalidOrExpiredToken: 'This reset link has expired or already been used. Please request a new one.',
  },

  // Profile screen
  profile: {
    signInTitle: 'Sign in to Puls',
    signInSubtitle:
      'Save articles, customize your outlets, and react to stories you care about.',
    manageOutlets: 'Manage outlets',
    categoryPreferences: 'Category preferences',
    language: 'Language',
    logout: 'Log out',
    changePassword: 'Change password', 
  },

  // Language switcher
  language: {
    en: '🇬🇧 English',
    ro: '🇷🇴 Română',
  },

  // Saved screen
  saved: {
    title: 'Saved',
    saveTitle: 'Save articles to read later',
    saveSubtitle: 'Sign in to save articles and access them any time.',
    empty:
      'No saved articles yet — tap the bookmark icon on any article to save it.',
    couldNotLoad: "Couldn't load saved articles",
  },

  // Outlet settings screen
  outlets: {
    title: 'Manage outlets',
    romania: 'Romania',
    euInternational: 'EU / International',
    couldNotLoad: "Couldn't load your outlet settings.",
  },

  // Reactions
  reactions: {
    signInToReact: 'Sign in to react',
    signInToReactMessage:
      'Create an account or log in to react to articles.',
    cancel: 'Cancel',
    loginButton: 'Log in',
  },

  // Gamification — XP and streaks
  xp: {
    level: 'Level %{level}',
    xpCount: '%{xp} XP',
    streak: '%{count} day streak',
    streakSingular: '1 day streak',
    nextLevel: '%{xp} XP to next level',
    maxLevel: 'Max level reached',
    xpEarned: '+%{xp} XP',
    longestStreak: 'Longest: %{count} days',
    days: 'days',
    day: 'day',
  },

  // Level names
  levels: {
    1: 'Reader',
    2: 'Curious',
    3: 'Informed',
    4: 'Analyst',
    5: 'Expert',
    6: 'Journalist',
    7: 'Editor',
    8: 'Chronicler',
  },

  // Badge gallery
  badges: {
    title: 'Badges',
    first_spark: {
      name: 'First Spark',
      description: 'Read news 3 days in a row',
    },
    informed_week: {
      name: 'Informed Week',
      description: 'Read news 7 days in a row',
    },
    news_month: {
      name: 'News Month',
      description: 'Read news 30 days in a row',
    },
    iron_chronicler: {
      name: 'Iron Chronicler',
      description: 'Read news 100 days in a row',
    },
    explorer: {
      name: 'Explorer',
      description: 'Read 3 different categories in one week',
    },
    polyglot: {
      name: 'News Polyglot',
      description: 'Read from both Romanian and EU outlets in one day',
    },
    omnivore: {
      name: 'Omnivore',
      description: 'Read 5 different categories in one day',
    },
    loyal_fan: {
      name: 'Loyal Fan',
      description: 'Read 50 articles from a single outlet',
    },
    collector: {
      name: 'Collector',
      description: 'Save 10 articles',
    },
    reactor: {
      name: 'Reactor',
      description: 'React to 10 articles',
    },
  },

  // Not found screen
  notFound: {
    title: "This screen doesn't exist.",
    goHome: 'Go to home screen',
  },

  // Common / shared
  common: {
    cancel: 'Cancel',
    login: 'Log in',
    createAccount: 'Create an account',
    retry: 'Try again',
    loading: 'Loading...',
    error: 'Something went wrong',
  },

  // Notifications
  notifications: {
    title: 'Daily digest',
    subtitle: 'Get a daily summary of new articles',
    digestTime: 'Send at',
    morning: '8am',
    afternoon: '1pm',
    evening: '7pm',
  },
  
  search: {
    placeholder: 'Search articles...',
    cancel: 'Cancel',
    noResults: 'No results for "%{query}"',
    searching: 'Searching...',
  },
};