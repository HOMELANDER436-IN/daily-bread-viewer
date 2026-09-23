/**
 * Daily Bread — Viewer App — Internationalization (i18n)
 * Supported languages: English (en) and Malayalam (ml)
 */

const translations = {
  en: {
    appName:         'Daily Bread',
    tagline:         'God\'s Word, Every Day',
    home:            'Home',
    counselling:     'Counselling',
    language:        'Language',
    about:           'About',
    todayMessage:    "TODAY'S MESSAGE",
    goodMorning:     'Good Morning',
    goodAfternoon:   'Good Afternoon',
    goodEvening:     'Good Evening',
    noMessage:       'No message today',
    noMessageSub:    'Check back soon for a new message.',
    loadError:       'Unable to load today\'s message.',
    loadErrorSub:    'Please check your internet connection and try again.',
    retry:           'Try Again',
    refresh:         'Refresh',
    like:            'Like',
    dislike:         'Dislike',
    reactionPrompt:  'Did this message speak to you?',
    prayerTitle:     'Prayer Time',
    prayerBody:      'Take a moment to pause, pray, and be still.',
    dismiss:         'Dismiss',
    allowNotif:      'Prayer Reminders',
    allowNotifSub:   'Allow notifications to receive the daily prayer reminder.',
    allow:           'Allow',
    // Counselling page
    counsellingTitle:   'Need someone to talk to?',
    counsellingDesc:    'If you would like prayer, guidance, or counselling, you can send a private request. Your message is confidential.',
    fullName:           'Full Name',
    contactNumber:      'Contact Number',
    messageComment:     'Message / Comment',
    messageOptional:    'Optional — share what\'s on your heart',
    sendRequest:        'Send Request',
    sending:            'Sending...',
    successTitle:       'Request Submitted',
    successMsg:         'Thank you for reaching out. Your request has been submitted. Someone will get in touch with you soon.',
    sendAnother:        'Send Another Request',
    validFullName:      'Please enter your full name (at least 2 characters).',
    validPhone:         'Please enter a valid contact number.',
    submitError:        'Could not send your request. Please try again.',
    // About page
    aboutTitle:         'About Daily Bread',
    aboutTagline:       'A daily biblical message, prayer reminder, and counselling app for believers.',
    aboutMissionTitle:  'Our Mission',
    aboutMissionBody:   'Daily Bread exists to share God\'s word daily, encourage believers through prayer, and provide a private space for counselling and spiritual guidance.',
    aboutMessagesTitle: 'Daily Messages',
    aboutMessagesBody:  'Read a fresh biblical message every day in English or Malayalam. React with a like or dislike to let us know the message touched you.',
    aboutPrayerTitle:   'Prayer Reminders',
    aboutPrayerBody:    'Enable push notifications to receive a daily prayer reminder at the scheduled time. Take a moment to pause, pray, and be still.',
    aboutCounsellingTitle: 'Counselling',
    aboutCounsellingBody: 'Need someone to talk to? Submit a private counselling request — your contact details and message are kept strictly confidential.',
    aboutDesc1:         'Daily Bread brings you a fresh Biblical message every day — a verse, devotional, prayer, or reflection to nourish your soul.',
    aboutDesc2:         'If you need prayer or guidance, reach out through the Counselling section.',
    aboutPrivacy:       'Your privacy is important to us. Reactions are anonymous. Counselling requests are private and seen only by the administrator.',
  },
  ml: {
    appName:         'ദൈനം ദൈനം അപ്പം',
    tagline:         'ദൈവവചനം, ദിനംപ്രതി',
    home:            'ഹോം',
    counselling:     'കൗൺസിലിംഗ്',
    language:        'ഭാഷ',
    about:           'കുറിച്ച്',
    todayMessage:    'ഇന്നത്തെ സന്ദേശം',
    goodMorning:     'സുപ്രഭാതം',
    goodAfternoon:   'ഉച്ചയ്ക്ക് ശുഭദിനം',
    goodEvening:     'ശുഭ സന്ധ്യ',
    noMessage:       'ഇന്ന് സന്ദേശം ഇല്ല',
    noMessageSub:    'ഉടൻ ഒരു പുതിയ സന്ദേശം ഉണ്ടാകും.',
    loadError:       'ഇന്നത്തെ സന്ദേശം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.',
    loadErrorSub:    'ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കൂ.',
    retry:           'വീണ്ടും ശ്രമിക്കൂ',
    refresh:         'പുതുക്കുക',
    like:            'ഇഷ്ടപ്പെട്ടു',
    dislike:         'ഇഷ്ടപ്പെട്ടില്ല',
    reactionPrompt:  'ഈ സന്ദേശം നിങ്ങളോട് സംസാരിച്ചോ?',
    prayerTitle:     'പ്രാർത്ഥന സമയം',
    prayerBody:      'അൽപ്പസമയം മാറ്റിവെച്ച് പ്രാർത്ഥിക്കൂ.',
    dismiss:         'ഇല്ലാതാക്കുക',
    allowNotif:      'പ്രാർത്ഥനാ ഓർമ്മിപ്പിക്കൽ',
    allowNotifSub:   'ദൈനംദിന പ്രാർത്ഥന ഓർമ്മിപ്പിക്കൽ ലഭിക്കാൻ അനുമതി നൽകൂ.',
    allow:           'അനുവദിക്കുക',
    // Counselling
    counsellingTitle:   'ആരോടെങ്കിലും സംസാരിക്കണോ?',
    counsellingDesc:    'പ്രാർത്ഥന, മാർഗ്ഗദർശനം, അല്ലെങ്കിൽ കൗൺസിലിംഗ് ആവശ്യമുണ്ടെങ്കിൽ, ഒരു സ്വകാര്യ അഭ്യർത്ഥന അയയ്ക്കൂ. നിങ്ങളുടെ സന്ദേശം രഹസ്യമാണ്.',
    fullName:           'പൂർണ്ണ നാമം',
    contactNumber:      'ബന്ധപ്പെടാനുള്ള നമ്പർ',
    messageComment:     'സന്ദേശം / അഭിപ്രായം',
    messageOptional:    'ഐച്ഛികം — നിങ്ങളുടെ മനസ്സിൽ ഉള്ളത് പങ്കുവെക്കൂ',
    sendRequest:        'അഭ്യർത്ഥന അയയ്ക്കുക',
    sending:            'അയയ്ക്കുന്നു...',
    successTitle:       'അഭ്യർത്ഥന സമർപ്പിച്ചു',
    successMsg:         'ബന്ധപ്പെട്ടതിന് നന്ദി. നിങ്ങളുടെ അഭ്യർത്ഥന സ്വീകരിച്ചു. ആരെങ്കിലും ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.',
    sendAnother:        'മറ്റൊരു അഭ്യർത്ഥന അയയ്ക്കുക',
    validFullName:      'ദയവായി നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകൂ.',
    validPhone:         'ദയവായി ഒരു സാധുവായ ഫോൺ നമ്പർ നൽകൂ.',
    submitError:        'നിങ്ങളുടെ അഭ്യർത്ഥന അയയ്ക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കൂ.',
    // About
    aboutTitle:         'ദൈനം ദൈനം അപ്പത്തെ കുറിച്ച്',
    aboutTagline:       'വിശ്വാസികൾക്കായുള്ള ദൈനംദിന ബൈബിൾ സന്ദേശം, പ്രാർത്ഥനാ ഓർമ്മപ്പെടുത്തൽ, കൗൺസിലിംഗ് ആപ്പ്.',
    aboutMissionTitle:  'ഞങ്ങളുടെ ദൗത്യം',
    aboutMissionBody:   'ദൈവവചനം ദിനംപ്രതി പങ്കുവെക്കാനും, പ്രാർത്ഥനയിലൂടെ വിശ്വാസികളെ പ്രോത്സാഹിപ്പിക്കാനും, കൗൺസിലിംഗിനും ആത്മീയ മാർഗ്ഗദർശനത്തിനുമായി ഒരു സ്വകാര്യ ഇടം നൽകാനും ദൈനം ദൈനം അപ്പം നിലകൊള്ളുന്നു.',
    aboutMessagesTitle: 'ദൈനംദിന സന്ദേശങ്ങൾ',
    aboutMessagesBody:  'ഇംഗ്ലീഷിലോ മലയാളത്തിലോ ദിവസവും പുതിയൊരു ബൈബിൾ സന്ദേശം വായിക്കൂ. സന്ദേശം നിങ്ങളെ സ്പർശിച്ചുവെങ്കിൽ ലൈക്ക് ചെയ്യുക.',
    aboutPrayerTitle:   'പ്രാർത്ഥനാ ഓർമ്മിപ്പിക്കൽ',
    aboutPrayerBody:    'നിശ്ചിത സമയത്ത് ദൈനംദിന പ്രാർത്ഥനാ ഓർമ്മപ്പെടുത്തൽ ലഭിക്കാൻ പുഷ് അറിയിപ്പുകൾ സജീവമാക്കുക. ഒരു നിമിഷം പ്രാർത്ഥിക്കൂ.',
    aboutCounsellingTitle: 'കൗൺസിലിംഗ്',
    aboutCounsellingBody: 'ആരോടെങ്കിലും സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ? ഒരു സ്വകാര്യ കൗൺസിലിംഗ് അഭ്യർത്ഥന സമർപ്പിക്കൂ — നിങ്ങളുടെ വിവരങ്ങൾ രഹസ്യമായിരിക്കും.',
    aboutDesc1:         'ദൈനം ദൈനം അപ്പം നിങ്ങൾക്ക് ഓരോ ദിവസവും ഒരു പുതിയ ബൈബിൾ സന്ദേശം കൊണ്ടുവരുന്നു — ഒരു വചനം, ഭക്തി, പ്രാർത്ഥന, അല്ലെങ്കിൽ ചിന്തകൾ.',
    aboutDesc2:         'പ്രാർത്ഥന അല്ലെങ്കിൽ മാർഗ്ഗദർശനം ആവശ്യമുണ്ടെങ്കിൽ, കൗൺസിലിംഗ് വിഭാഗത്തിലൂടെ ബന്ധപ്പെടൂ.',
    aboutPrivacy:       'നിങ്ങളുടെ സ്വകാര്യത ഞങ്ങൾക്ക് പ്രധാനമാണ്. പ്രതിക്രിയകൾ അജ്ഞാതമാണ്. കൗൺസിലിംഗ് അഭ്യർത്ഥനകൾ സ്വകാര്യമാണ്.',
  },
};

let currentLang = 'en';

/**
 * Set locale and update all [data-i18n] elements in the DOM.
 * @param {string} lang - 'en' or 'ml'
 */
function setLocale(lang) {
  if (!translations[lang]) lang = 'en';
  currentLang = lang;

  // Apply font family to body
  document.body.classList.toggle('lang-ml', lang === 'ml');

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Update placeholder attributes specifically
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text) el.placeholder = text;
  });
}

/**
 * Get a translated string by key.
 * Falls back to English, then returns the key itself.
 * @param {string} key
 * @returns {string}
 */
function t(key) {
  return translations[currentLang]?.[key] ?? translations.en[key] ?? key;
}

/**
 * Get current language code.
 * @returns {string}
 */
function getLang() {
  return currentLang;
}

export { setLocale, t, getLang, translations };
