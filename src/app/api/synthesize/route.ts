import { NextRequest, NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

// Initialize with Google credentials
const client = new textToSpeech.TextToSpeechClient({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, voiceId, speed, pitch } = body;

        if (!text || !voiceId) {
            return NextResponse.json({ 
                error: 'Missing required fields' 
            }, { status: 400 });
        }

        // Create the synthesis request
        const request = {
            input: { text },
            voice: {
                languageCode: 'ja-JP',
                name: voiceId,
            },
            audioConfig: {
                audioEncoding: 'MP3' as const,
                speakingRate: speed || 1.0,
                pitch: pitch || 0,
                // Add effects profile for higher quality audio
                effectsProfileId: ['telephony-class-application'],
            },
        };

        // Perform the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent;

        // For preview requests, return base64
        if (body.preview) {
            return NextResponse.json({
                audioContent: Buffer.from(audioContent as Buffer).toString('base64')
            });
        }

        // For download requests, return the audio file
        return new NextResponse(audioContent, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="tts-${voiceId}.mp3"`,
            },
        });
    } catch (error) {
        console.error('Error in text-to-speech:', error);
        return NextResponse.json(
            { error: 'Failed to synthesize speech' },
            { status: 500 }
        );
    }
}