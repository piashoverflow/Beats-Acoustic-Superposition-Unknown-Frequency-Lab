import type { Language } from './types';

export interface Translations {
  studioTitle: string;
  studioSubtitle: string;
  reset: string;
  langToggleLabel: string;
  institutionBadge: string;
  tabs: {
    module1: {
      short: string;
      full: string;
    };
    module2: {
      short: string;
      full: string;
    };
    module3: {
      short: string;
      full: string;
    };
  };
  controls: {
    heading: string;
    fork1Freq: string;
    fork2Freq: string;
    amp1: string;
    amp2: string;
    timeScale: string;
    slowMotionHint: string;
    audioSection: string;
    playAudio: string;
    muteAudio: string;
    masterVolume: string;
    playVisual: string;
    pauseVisual: string;
    presetsLabel: string;
    presetClear: string;
    presetDistinct: string;
    presetLimit: string;
    presetAbove: string;
    showCarrier: string;
    timeWindow: string;
    sweepSpeed: string;
    knownFork1: string;
    waxMass: string;
    filingLevel: string;
    applyWax: string;
    fileProngs: string;
    restoreFork: string;
    newMystery: string;
    modeChallenge: string;
    modePractice: string;
    modeLabel: string;
  };
  stage: {
    forkA: string;
    forkB: string;
    mysteryForkB: string;
    pulseIndicator: string;
    waxingLabel: string;
    waningLabel: string;
    steadyLabel: string;
    wave1Title: string;
    wave2Title: string;
    resultantTitle: string;
    constructiveHint: string;
    destructiveHint: string;
    envelopeTitle: string;
    envelopeLegend: string;
    carrierLegend: string;
    persistenceBracket: string;
    beatCounterLabel: string;
    peaksInOneSec: string;
    timeAxisSec: string;
    labBenchTitle: string;
    waxAppliedNote: string;
    filedNote: string;
    unmodifiedNote: string;
    numberLineTitle: string;
    candidateLow: string;
    candidateHigh: string;
    actualF2: string;
    waxShiftRule: string;
    fileShiftRule: string;
  };
  telemetry: {
    heading: string;
    beatFreqTitle: string;
    beatsPerSecUnit: string;
    waxingIntervalTitle: string;
    waxToWaningTitle: string;
    avgCarrierTitle: string;
    perceptionTitle: string;
    perceptionUnison: string;
    perceptionAudible: string;
    perceptionInaudible: string;
    perceptionDescUnison: string;
    perceptionDescAudible: string;
    perceptionDescInaudible: string;
    equationTitle: string;
    modulationAmpLabel: string;
    carrierFreqLabel: string;
    deductionTitle: string;
    initialBeatsLabel: string;
    currentBeatsLabel: string;
    beatTrendLabel: string;
    trendDecreased: string;
    trendIncreased: string;
    trendUnchanged: string;
    candidatesLabel: string;
    chooseDeduction: string;
    optionPlus: string;
    optionMinus: string;
    correctFeedback: string;
    wrongFeedback: string;
    ruleCardTitle: string;
    waxRuleShort: string;
    fileRuleShort: string;
    revealAnswer: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  bn: {
    studioTitle: 'বিট বা স্বরকম্প ও অজানা কম্পাঙ্ক নির্ণয় ল্যাব',
    studioSubtitle: 'অ্যাকোস্টিক সুপারপজিশন এবং কম্পাঙ্ক বিশ্লেষণ স্টুডিও',
    reset: 'রিসেট',
    langToggleLabel: 'English',
    institutionBadge: 'উদ্ভাস',
    tabs: {
      module1: {
        short: 'মডিউল ১: দুটি সুরশলাকা ও বিট গঠন',
        full: 'মডিউল ১: দুটি সুরশলাকা ও বিট গঠন',
      },
      module2: {
        short: 'মডিউল ২: বিস্তার এনভেলপ ও অডিও-ভিজ্যুয়াল',
        full: 'মডিউল ২: বিস্তার এনভেলপ ও অডিও-ভিজ্যুয়াল অ্যাকোস্টিকস',
      },
      module3: {
        short: 'মডিউল ৩: অজানা কম্পাঙ্ক (মোম ও ঘষা)',
        full: 'মডিউল ৩: অজানা কম্পাঙ্ক নির্ণয়: মোম ও ঘষা পরীক্ষা',
      },
    },
    controls: {
      heading: 'পরামিতি নিয়ন্ত্রণ',
      fork1Freq: 'সুরশলাকা ১-এর কম্পাঙ্ক (f₁)',
      fork2Freq: 'সুরশলাকা ২-এর কম্পাঙ্ক (f₂)',
      amp1: 'প্রথম তরঙ্গের বিস্তার (A₁)',
      amp2: 'দ্বিতীয় তরঙ্গের বিস্তার (A₂)',
      timeScale: 'সময় স্কেল (Slow Motion)',
      slowMotionHint: 'উচ্চ কম্পাঙ্কের তরঙ্গ স্পষ্টভাবে দেখতে সময় ধীর করুন',
      audioSection: 'অ্যাকোস্টিক সাউন্ড সিন্থেসাইজার',
      playAudio: 'শব্দ চালু করুন (Web Audio)',
      muteAudio: 'শব্দ বন্ধ করুন (Mute)',
      masterVolume: 'শব্দের মাত্রা (Volume)',
      playVisual: 'তরঙ্গ চালান',
      pauseVisual: 'তরঙ্গ থামান',
      presetsLabel: 'দ্রুত প্রিসেট (শ্রাব্যতা পরীক্ষা)',
      presetClear: '২ Hz (ধীর বিট)',
      presetDistinct: '৫ Hz (স্পষ্ট বিট)',
      presetLimit: '১০ Hz (শ্রাব্য সীমা)',
      presetAbove: '১৮ Hz (সীমার বাইরে)',
      showCarrier: 'উচ্চ-কম্পাঙ্ক বাহক তরঙ্গ দেখান',
      timeWindow: 'সময় অক্ষের ব্যাপ্তি',
      sweepSpeed: 'প্লেহেড গতি',
      knownFork1: 'জানা সুরশলাকা A-এর কম্পাঙ্ক (f₁)',
      waxMass: 'মোমের ভর (Wax Mass)',
      filingLevel: 'ফাইল দিয়ে ঘষার মাত্রা',
      applyWax: 'মোম লাগান (f₂ ↓)',
      fileProngs: 'ফাইল দিয়ে ঘষুন (f₂ ↑)',
      restoreFork: 'আসল সুরশলাকা ফিরিয়ে আনুন',
      newMystery: 'নতুন অজানা সুরশলাকা তৈরি করুন',
      modeChallenge: 'চ্যালেঞ্জ (f₂ অজানা)',
      modePractice: 'অনুশীলন (f₂ দৃশ্যমান)',
      modeLabel: 'পরীক্ষণ মোড',
    },
    stage: {
      forkA: 'সুরশলাকা A',
      forkB: 'সুরশলাকা B',
      mysteryForkB: 'অজানা সুরশলাকা B',
      pulseIndicator: 'শব্দের তীব্রতা নির্দেশক',
      waxingLabel: 'জোরালো শব্দ (Waxing)',
      waningLabel: 'মৃদু শব্দ (Waning)',
      steadyLabel: 'স্থির বিস্তার (সমসুর)',
      wave1Title: 'তরঙ্গ ১: y₁ = A₁ sin(2πf₁t)',
      wave2Title: 'তরঙ্গ ২: y₂ = A₂ sin(2πf₂t)',
      resultantTitle: 'লব্ধি বিট তরঙ্গ: y = y₁ + y₂ (উপরিপাতি)',
      constructiveHint: 'সমদশা (শৃঙ্গ + শৃঙ্গ) → জোরালো শব্দ',
      destructiveHint: 'বিপরীত দশা (শৃঙ্গ + খাঁজ) → মৃদু শব্দ',
      envelopeTitle: '১.০ সেকেন্ডের বিস্তার এনভেলপ ও বাহক তরঙ্গ বিশ্লেষণ',
      envelopeLegend: 'বিস্তার এনভেলপ (±A_mod)',
      carrierLegend: 'বাহক তরঙ্গ (f_avg)',
      persistenceBracket: 'শ্রাব্যতার স্থায়িত্বকাল = ০.১ s (ন্যূনতম ব্যবধান)',
      beatCounterLabel: '১ সেকেন্ডে বিট গণনা',
      peaksInOneSec: 'টি পূর্ণ বিট / সেকেন্ড',
      timeAxisSec: 'সময় t (সেকেন্ড)',
      labBenchTitle: 'ভার্চুয়াল ল্যাব বেঞ্চ: মোম লাগানো ও ফাইল দিয়ে ঘষা',
      waxAppliedNote: 'বাহুতে মোম লাগানো হয়েছে → ভর ↑ → কম্পাঙ্ক কমেছে',
      filedNote: 'বাহু ঘষে পাতলা করা হয়েছে → ভর ↓ → কম্পাঙ্ক বেড়েছে',
      unmodifiedNote: 'মূল অপরিবর্তিত অবস্থা (মোম বা ঘষা ছাড়া)',
      numberLineTitle: 'কম্পাঙ্ক সংখ্যারেখা বিশ্লেষক (f₁ বনাম সম্ভাব্য f₂)',
      candidateLow: 'সম্ভাব্য f₁ - N₀',
      candidateHigh: 'সম্ভাব্য f₁ + N₀',
      actualF2: 'প্রকৃত f₂',
      waxShiftRule: 'মোম লাগালে প্রতিটি সম্ভাব্য কম্পাঙ্ক বাম দিকে (↓) সরে যায়',
      fileShiftRule: 'ফাইল দিয়ে ঘষলে প্রতিটি সম্ভাব্য কম্পাঙ্ক ডান দিকে (↑) সরে যায়',
    },
    telemetry: {
      heading: 'লাইভ টেলিমেট্রি ও গাণিতিক বিশ্লেষণ',
      beatFreqTitle: 'বিট কম্পাঙ্ক (N = |f₁ - f₂|)',
      beatsPerSecUnit: 'বিট/সে.',
      waxingIntervalTitle: 'দুটি জোরালো শব্দের মধ্যবর্তী সময় (T)',
      waxToWaningTitle: 'জোরালো থেকে পরবর্তী মৃদু শব্দের সময় (T/2)',
      avgCarrierTitle: 'গড় বাহক কম্পাঙ্ক (f_avg)',
      perceptionTitle: 'মানুষের কানের শ্রাব্যতা অবস্থা',
      perceptionUnison: 'সমসুর / Unison (N = 0)',
      perceptionAudible: 'স্পষ্ট বিট শোনা যাবে (N ≤ 10 Hz)',
      perceptionInaudible: 'শ্রাব্যতা সীমার বাইরে (N > 10 Hz)',
      perceptionDescUnison: 'দুটি সুরশলাকার কম্পাঙ্ক সমান হওয়ায় কোনো বিট তৈরি হচ্ছে না; একটি অবিচ্ছিন্ন সুর শোনা যাবে।',
      perceptionDescAudible: 'বিট ব্যবধান ≥ ০.১ সেকেন্ড। মানুষের কানের ০.১ সেকেন্ড শ্রাব্যতা স্থায়িত্বের কারণে প্রতিটি জোরালো ও মৃদু শব্দ আলাদাভাবে শোনা যাবে।',
      perceptionDescInaudible: 'প্রতি সেকেন্ডে ১০টির বেশি বিট (< ০.১ সেকেন্ড ব্যবধান) হওয়ায় কান আলাদা বিট শনাক্ত করতে পারে না; একটি একটানা শব্দ শোনা যাবে।',
      equationTitle: 'ত্রিকোণমিতিক মড্যুলেশন সমীকরণ',
      modulationAmpLabel: 'সর্বোচ্চ এনভেলপ বিস্তার',
      carrierFreqLabel: 'বাহক কম্পাঙ্ক',
      deductionTitle: 'অজানা কম্পাঙ্ক নির্ণয় সহকারী',
      initialBeatsLabel: 'প্রাথমিক বিট (N₀)',
      currentBeatsLabel: 'বর্তমান বিট (N)',
      beatTrendLabel: 'বিটের পরিবর্তন',
      trendDecreased: 'কমেছে (↓) — f₁-এর কাছাকাছি এসেছে',
      trendIncreased: 'বেড়েছে (↑) — f₁ থেকে দূরে সরেছে',
      trendUnchanged: 'অপরিবর্তিত (মোম বা ঘষা প্রয়োগ করুন)',
      candidatesLabel: 'প্রাথমিক দুটি সম্ভাব্য মান',
      chooseDeduction: 'পর্যবেক্ষণের ভিত্তিতে প্রকৃত f₂ নির্বাচন করুন:',
      optionPlus: 'f₂ = f₁ + N₀',
      optionMinus: 'f₂ = f₁ - N₀',
      correctFeedback: 'সঠিক সিদ্ধান্ত! আপনার যৌক্তিক বিশ্লেষণ সম্পূর্ণ নির্ভুল হয়েছে।',
      wrongFeedback: 'আবার ভাবুন! সংখ্যারেখায় দেখুন মোম লাগালে বা ঘষলে কোন সম্ভাব্য মানটি f₁-এর কাছে আসে বা দূরে সরে যায়।',
      ruleCardTitle: 'মূল পদার্থবিজ্ঞান নীতি',
      waxRuleShort: 'মোম লাগালে → জড়তা/ভর বাড়ে → কম্পাঙ্ক কমে (f₂ ↓)',
      fileRuleShort: 'ফাইল দিয়ে ঘষলে → ভর কমে → কম্পাঙ্ক বাড়ে (f₂ ↑)',
      revealAnswer: 'সমাধান দেখুন',
    },
  },
  en: {
    studioTitle: 'Beats, Acoustic Superposition & Unknown Frequency Lab',
    studioSubtitle: 'Interactive Acoustic Wave & Frequency Deduction Studio',
    reset: 'Reset',
    langToggleLabel: 'বাংলা',
    institutionBadge: 'উদ্ভাস',
    tabs: {
      module1: {
        short: 'Module 1: Dual Forks & Beats',
        full: 'Module 1: Dual Tuning Forks & Beat Formation',
      },
      module2: {
        short: 'Module 2: Envelope & Acoustics',
        full: 'Module 2: Amplitude Envelope & Sound Synthesizer',
      },
      module3: {
        short: 'Module 3: Unknown Frequency Lab',
        full: 'Module 3: Unknown Frequency: Waxing & Filing Lab',
      },
    },
    controls: {
      heading: 'Parameter Controls',
      fork1Freq: 'Tuning Fork 1 Frequency (f₁)',
      fork2Freq: 'Tuning Fork 2 Frequency (f₂)',
      amp1: 'Wave 1 Amplitude (A₁)',
      amp2: 'Wave 2 Amplitude (A₂)',
      timeScale: 'Time-Scale Slow Motion',
      slowMotionHint: 'Slow down high-frequency oscillations to inspect wave packets',
      audioSection: 'Acoustic Sound Synthesizer',
      playAudio: 'Play Real Audio (Web Audio)',
      muteAudio: 'Mute Audio',
      masterVolume: 'Master Volume',
      playVisual: 'Play Waves',
      pauseVisual: 'Pause Waves',
      presetsLabel: 'Quick Presets (Audibility Limit)',
      presetClear: '2 Hz (Slow)',
      presetDistinct: '5 Hz (Clear)',
      presetLimit: '10 Hz (Threshold)',
      presetAbove: '18 Hz (Continuous)',
      showCarrier: 'Show High-Frequency Carrier Wave',
      timeWindow: 'Time Axis Window',
      sweepSpeed: 'Playhead Sweep Speed',
      knownFork1: 'Known Tuning Fork A (f₁)',
      waxMass: 'Wax Mass Added',
      filingLevel: 'Filing Amount',
      applyWax: 'Apply Wax (f₂ ↓)',
      fileProngs: 'File Prongs (f₂ ↑)',
      restoreFork: 'Restore Original Fork',
      newMystery: 'Generate New Mystery Fork',
      modeChallenge: 'Challenge (Hidden f₂)',
      modePractice: 'Practice (Visible f₂)',
      modeLabel: 'Experiment Mode',
    },
    stage: {
      forkA: 'Tuning Fork A',
      forkB: 'Tuning Fork B',
      mysteryForkB: 'Mystery Fork B',
      pulseIndicator: 'Acoustic Intensity Pulse',
      waxingLabel: 'Waxing (Loud Sound)',
      waningLabel: 'Waning (Minimum Sound)',
      steadyLabel: 'Steady Amplitude (Unison)',
      wave1Title: 'Wave 1: y₁ = A₁ sin(2πf₁t)',
      wave2Title: 'Wave 2: y₂ = A₂ sin(2πf₂t)',
      resultantTitle: 'Resultant Beat Wave: y = y₁ + y₂ (Superposition)',
      constructiveHint: 'In-Phase (Crest + Crest) → Constructive Waxing',
      destructiveHint: 'Out-of-Phase (Crest + Trough) → Destructive Waning',
      envelopeTitle: 'Calibrated 1.0 s Modulation Envelope & Carrier Plot',
      envelopeLegend: 'Modulation Envelope (±A_mod)',
      carrierLegend: 'Carrier Wave (f_avg)',
      persistenceBracket: 'Persistence of Hearing = 0.1 s',
      beatCounterLabel: '1-Second Beat Counter',
      peaksInOneSec: 'beats / sec',
      timeAxisSec: 'Time t (seconds)',
      labBenchTitle: 'Virtual Lab Bench: Waxing & Filing Manipulation',
      waxAppliedNote: 'Wax added to prongs → Mass ↑ → Frequency ↓',
      filedNote: 'Prongs filed down → Mass ↓ → Frequency ↑',
      unmodifiedNote: 'Unmodified baseline state (0 g wax, 0 filing)',
      numberLineTitle: 'Live Number-Line Frequency Visualizer',
      candidateLow: 'Candidate f₁ - N₀',
      candidateHigh: 'Candidate f₁ + N₀',
      actualF2: 'Actual f₂',
      waxShiftRule: 'Adding wax shifts candidate frequencies leftward (↓)',
      fileShiftRule: 'Filing prongs shifts candidate frequencies rightward (↑)',
    },
    telemetry: {
      heading: 'Live Telemetry & Math Readouts',
      beatFreqTitle: 'Beat Frequency (N = |f₁ - f₂|)',
      beatsPerSecUnit: 'beats/s',
      waxingIntervalTitle: 'Time Between Loud Sounds (T_beat)',
      waxToWaningTitle: 'Loud to Adjacent Soft Sound (T_beat / 2)',
      avgCarrierTitle: 'Average Carrier Frequency (f_avg)',
      perceptionTitle: 'Human Auditory Perception',
      perceptionUnison: 'Unison (N = 0 Hz)',
      perceptionAudible: 'Distinct Beats Audible (N ≤ 10 Hz)',
      perceptionInaudible: 'Above Persistence Limit (N > 10 Hz)',
      perceptionDescUnison: 'Frequencies match identically; no beat modulation occurs and a single steady tone is heard.',
      perceptionDescAudible: 'Beat period ≥ 0.1 s. Within the 0.1 s human persistence of hearing, each waxing and waning is heard distinctly.',
      perceptionDescInaudible: 'More than 10 beats/sec (< 0.1 s apart) exceeds human auditory persistence, blending into a continuous tone.',
      equationTitle: 'Trigonometric Modulation Equation',
      modulationAmpLabel: 'Peak Envelope Amplitude',
      carrierFreqLabel: 'Carrier Frequency',
      deductionTitle: 'Unknown Frequency Deduction Assistant',
      initialBeatsLabel: 'Initial Beats (N₀)',
      currentBeatsLabel: 'Live Beats (N)',
      beatTrendLabel: 'Observed Beat Shift',
      trendDecreased: 'Decreased (↓) — Shifted closer to f₁',
      trendIncreased: 'Increased (↑) — Shifted away from f₁',
      trendUnchanged: 'Unchanged (Apply wax or file prongs to test)',
      candidatesLabel: 'Two Candidate Frequencies',
      chooseDeduction: 'Based on your test, deduce the original f₂:',
      optionPlus: 'f₂ = f₁ + N₀',
      optionMinus: 'f₂ = f₁ - N₀',
      correctFeedback: 'Spot on! Your deduction matches the physical shift on the frequency number line.',
      wrongFeedback: 'Not quite — check the number line: observe which candidate moves closer to or farther from f₁ under your modification.',
      ruleCardTitle: 'Core Acoustic Principles',
      waxRuleShort: 'Waxing → More inertia/mass → Frequency drops (f₂ ↓)',
      fileRuleShort: 'Filing → Less mass → Frequency rises (f₂ ↑)',
      revealAnswer: 'Reveal Answer',
    },
  },
};
