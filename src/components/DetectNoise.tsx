import React, { useRef, useEffect } from 'react';
import { Toast } from '../helper/toast';
import { CustomError } from '../types/question';

declare global {
    interface Window {
        vad: any;
        ort: any;
    }
}

function DetectNoise({
    setSoundLevel,
}: {
    setSoundLevel: React.Dispatch<React.SetStateAction<number>>;
}) {
    const vadRef = useRef<any>(null); // Use useRef to store the VAD instance
    const analyserRef = useRef<AnalyserNode | null>(null); // Use useRef to store the AnalyserNode instance
    const audioContextRef = useRef<AudioContext | null>(null); // Use useRef to store the AudioContext instance
    const intervalRef = useRef<number | null>(null); // Use useRef to store the interval ID
    const mediaStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const initVAD = async () => {
            if (window.vad && window.ort) {
                try {
                    // Initialize VAD without explicitly loading the model as it's done within the library
                    vadRef.current = await window.vad.MicVAD.new({});
                    vadRef.current.start();

                    // Initialize sound level monitoring
                    const audioContext = new AudioContext();
                    audioContextRef.current = audioContext;
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 2048; // Adjust as needed for your application
                    analyser.smoothingTimeConstant = 0.8;
                    analyserRef.current = analyser;

                    navigator.mediaDevices
                        .getUserMedia({ audio: true })
                        .then((stream) => {
                            mediaStreamRef.current = stream;
                            const source =
                                audioContext.createMediaStreamSource(stream);
                            source.connect(analyser);
                            // Create a buffer to store the frequency data
                            const bufferLength = analyser.frequencyBinCount;
                            const dataArray = new Uint8Array(bufferLength);

                            const updateSoundLevel = () => {
                                analyser.getByteFrequencyData(dataArray);
                                // Calculate the average sound level
                                let sum = 0;
                                for (let i = 0; i < bufferLength; i++) {
                                    sum += dataArray[i];
                                }
                                const average = sum / bufferLength;
                                const threshold = 8;
                                setSoundLevel(
                                    average < threshold ? 0 : average
                                );
                            };

                            // Start updating sound level
                            intervalRef.current = window.setInterval(
                                updateSoundLevel,
                                100
                            ); // Update every 100ms
                        })
                        .catch((error) => {
                            console.error('Error accessing microphone:', error);
                        });
                } catch (error) {
                    console.error('Error initializing VAD:', error);
                    Toast.Error(
                        'Failed to initialize VAD',
                        CustomError.audioError
                    );
                }
            } else {
                console.error('VAD or ORT library not loaded');
                Toast.Error('Failed to initialize VAD', CustomError.audioError);
            }
        };

        initVAD();

        // Cleanup function to stop the VAD and audio context
        return () => {
            if (vadRef.current) {
                console.log(vadRef.current, 'vad red >>>>>>>>>>>');
                if (vadRef.current.pause) {
                    console.log('vad paused');
                    vadRef.current.pause(); // Call pause to stop VAD
                }
            }
            if (
                audioContextRef.current &&
                audioContextRef.current.state !== 'closed'
            ) {
                audioContextRef.current.close().catch((error) => {
                    console.error('Error closing AudioContext:', error);
                });
            }
            console.log('this is medistream ref', mediaStreamRef.current);
            if (mediaStreamRef.current) {
                const tracks = mediaStreamRef.current.getTracks();
                tracks.forEach((track) => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    return null;
}

export default DetectNoise;
