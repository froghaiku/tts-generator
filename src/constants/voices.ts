// Define the structure of a voice option
export interface VoiceOption {
    id: string;
    name: string;
    gender: 'MALE' | 'FEMALE' | 'NEUTRAL';
    languageCode: string;
}

// All available Japanese voices from Google Cloud TTS
export const JAPANESE_VOICES: VoiceOption[] = [
    {
        id: 'ja-JP-Neural2-B',
        name: 'Neural2 B',
        gender: 'FEMALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Neural2-C',
        name: 'Neural2 C',
        gender: 'MALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Neural2-D',
        name: 'Neural2 D',
        gender: 'MALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Standard-A',
        name: 'Standard A',
        gender: 'FEMALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Standard-B',
        name: 'Standard B',
        gender: 'FEMALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Standard-C',
        name: 'Standard C',
        gender: 'MALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Standard-D',
        name: 'Standard D',
        gender: 'MALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Wavenet-A',
        name: 'Wavenet A',
        gender: 'FEMALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Wavenet-B',
        name: 'Wavenet B',
        gender: 'FEMALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Wavenet-C',
        name: 'Wavenet C',
        gender: 'MALE',
        languageCode: 'ja-JP'
    },
    {
        id: 'ja-JP-Wavenet-D',
        name: 'Wavenet D',
        gender: 'MALE',
        languageCode: 'ja-JP'
    }
];

// Default settings for the TTS generator
export const DEFAULT_SETTINGS = {
    speed: 1.0, // Default to normal speed
    pitch: 0,
    selectedVoices: ['ja-JP-Neural2-B'], // Default to first Neural voice
};

// Constants for slider ranges
export const SPEED_RANGE = {
    min: 0.25,
    max: 1.0,
    step: 0.25
};

export const PITCH_RANGE = {
    min: -20,
    max: 20,
    step: 1
};