'use client';

import { useState, useRef } from 'react';

interface AudioPreviewProps {
    voiceId: string;
    text: string;
    speed: number;
    pitch: number;
}

export default function AudioPreview({ voiceId, text, speed, pitch }: AudioPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const generatePreview = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    voiceId,
                    speed,
                    pitch,
                    preview: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio preview');
            }

            const data = await response.json();
            
            // Create audio from base64
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            
            // Replace the current audio element
            if (audioRef.current) {
                audioRef.current.src = `data:audio/mp3;base64,${data.audioContent}`;
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate preview');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={generatePreview}
                disabled={isLoading}
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-gray-900"
            >
                {isLoading ? 'Generating...' : 'Preview'}
            </button>
            
            <audio ref={audioRef} controls className="max-w-[200px]" />
            
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
}