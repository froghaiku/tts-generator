'use client';

import { useState, useEffect } from 'react';
import { 
    JAPANESE_VOICES, 
    DEFAULT_SETTINGS,
    SPEED_RANGE,
    PITCH_RANGE,
    VoiceOption 
} from '../constants/voices';
import AudioPreview from './AudioPreview';

interface FormState {
    japaneseText: string;
    selectedVoices: string[];
    speed: number;
    pitch: number;
}

export default function TTSForm() {
    const [formState, setFormState] = useState<FormState>({
        japaneseText: '',
        selectedVoices: DEFAULT_SETTINGS.selectedVoices,
        speed: DEFAULT_SETTINGS.speed,
        pitch: DEFAULT_SETTINGS.pitch
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load saved settings from localStorage on component mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('ttsSettings');
        if (savedSettings) {
            setFormState(prev => ({
                ...prev,
                ...JSON.parse(savedSettings)
            }));
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('ttsSettings', JSON.stringify(formState));
    }, [formState]);

    // Group voices by their type (Neural, Standard, Wavenet)
    const groupedVoices = JAPANESE_VOICES.reduce((groups, voice) => {
        const type = voice.id.split('-')[2]; // Extract Neural2/Standard/Wavenet
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(voice);
        return groups;
    }, {} as Record<string, VoiceOption[]>);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formState.japaneseText.trim()) {
            setError('Please enter some text');
            return;
        }
        
        if (formState.selectedVoices.length === 0) {
            setError('Please select at least one voice');
            return;
        }

        setError(null);
        setIsGenerating(true);

        try {
            // Generate audio for each selected voice
            for (const voiceId of formState.selectedVoices) {
                const response = await fetch('/api/synthesize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: formState.japaneseText,
                        voiceId,
                        speed: formState.speed,
                        pitch: formState.pitch,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate audio');
                }

                // Get the blob from the response
                const blob = await response.blob();
                
                // Create filename from text and voice
                const voiceName = JAPANESE_VOICES.find(v => v.id === voiceId)?.name || voiceId;
                const shortText = formState.japaneseText.slice(0, 30).replace(/[/\\?%*:|"<>]/g, '-');
                const fileName = `${shortText}_${voiceName}.mp3`;

                // Create and trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate audio');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Japanese Text Input */}
            <div className="space-y-2">
                <label htmlFor="japaneseText" className="block text-sm font-medium text-gray-700">
                    Japanese Text
                </label>
                <textarea
                    id="japaneseText"
                    value={formState.japaneseText}
                    onChange={(e) => setFormState(prev => ({
                        ...prev,
                        japaneseText: e.target.value
                    }))}
                    className="w-full h-32 p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Enter Japanese text here..."
                />
            </div>

            {/* Voice Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Voice Selection</h3>
                {Object.entries(groupedVoices).map(([type, voices]) => (
                    <div key={type} className="space-y-2">
                        <h4 className="font-medium text-gray-600">{type} Voices</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {voices.map(voice => (
                                <div key={voice.id} className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formState.selectedVoices.includes(voice.id)}
                                            onChange={(e) => {
                                                setFormState(prev => ({
                                                    ...prev,
                                                    selectedVoices: e.target.checked
                                                        ? [...prev.selectedVoices, voice.id]
                                                        : prev.selectedVoices.filter(id => id !== voice.id)
                                                }));
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">{voice.name} ({voice.gender})</span>
                                    </label>
                                    {formState.selectedVoices.includes(voice.id) && (
                                        <AudioPreview
                                            voiceId={voice.id}
                                            text={formState.japaneseText}
                                            speed={formState.speed}
                                            pitch={formState.pitch}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Speed Slider */}
            <div className="space-y-2">
                <label htmlFor="speed" className="block text-sm font-medium text-gray-700">
                    Speed: {formState.speed}x
                </label>
                <input
                    type="range"
                    id="speed"
                    min={SPEED_RANGE.min}
                    max={SPEED_RANGE.max}
                    step={SPEED_RANGE.step}
                    value={formState.speed}
                    onChange={(e) => setFormState(prev => ({
                        ...prev,
                        speed: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-2">
                <label htmlFor="pitch" className="block text-sm font-medium text-gray-700">
                    Pitch: {formState.pitch}
                </label>
                <input
                    type="range"
                    id="pitch"
                    min={PITCH_RANGE.min}
                    max={PITCH_RANGE.max}
                    step={PITCH_RANGE.step}
                    value={formState.pitch}
                    onChange={(e) => setFormState(prev => ({
                        ...prev,
                        pitch: parseInt(e.target.value)
                    }))}
                    className="w-full"
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? 'Generating Audio...' : 'Generate Audio'}
            </button>
        </form>
    );
}