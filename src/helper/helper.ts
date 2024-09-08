// import { Toast } from './toast';

import { CheckedQuestionType, CodeSnippet } from '../types/question';

// export const detectNoise = async (
//     setNoiseLevel: React.Dispatch<React.SetStateAction<number | undefined>>
// ) => {
//     try {
//         const audioCtx = new window.AudioContext();
//         console.log('AudioContext state:', audioCtx.state);
//         if (audioCtx.state === 'suspended') {
//             await audioCtx.resume();
//             console.log('Resumed AudioContext');
//         }

//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: true,
//         });
//         // console.log('Microphone access granted');

//         const source = audioCtx.createMediaStreamSource(stream);

//         // console.log('Loading audio worklet module...');
//         await audioCtx.audioWorklet.addModule('worklet/worklet.js');
//         // console.log('Audio worklet module loaded');
//         const noiseLevelProcessor = new AudioWorkletNode(
//             audioCtx,
//             'noise-level-processor'
//         );

//         noiseLevelProcessor.port.onmessage = (event: MessageEvent) => {
//             const noiseLevel = event.data as number;
//             setNoiseLevel(noiseLevel);
//         };

//         // console.log('Connecting audio nodes...');
//         source.connect(noiseLevelProcessor);
//         noiseLevelProcessor.connect(audioCtx.destination);
//         // console.log('Audio nodes connected');
//     } catch (error) {
//         console.error('Error starting audio context:', error);
//     }
// };

// export const detectNoise = (
//     setNoiseLevel: React.Dispatch<React.SetStateAction<number>>
// ) => {
//     let mediaStream: MediaStream | null = null;
//     let audioContext: AudioContext | null = null;
//     let analyser: AnalyserNode | null = null;
//     let scriptProcessor: ScriptProcessorNode | null = null;
//     let average = 0;
//     let lastToastTime = 0;
//     const toastCooldown = 3000; // 5 seconds cooldown

//     const handleSuccess = (stream: MediaStream) => {
//         mediaStream = stream;
//         const AudioContext =
//             window.AudioContext || (window as any).webkitAudioContext;
//         audioContext = new AudioContext();
//         analyser = audioContext.createAnalyser();
//         scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

//         analyser.smoothingTimeConstant = 0.8;
//         analyser.fftSize = 2048;

//         const microphone = audioContext.createMediaStreamSource(mediaStream);
//         microphone.connect(analyser);
//         analyser.connect(scriptProcessor);
//         scriptProcessor.connect(audioContext.destination);

//         scriptProcessor.onaudioprocess = () => {
//             if (analyser) {
//                 const array = new Uint8Array(analyser.frequencyBinCount);
//                 analyser.getByteFrequencyData(array);

//                 let values = 0;

//                 for (let i = 0; i < array.length; i++) {
//                     values += array[i];
//                 }

//                 average = Math.round(values / array.length);
//                 if (average > 60) {
//                     const currentTime = Date.now();
//                     if (currentTime - lastToastTime > toastCooldown) {
//                         // Toast.Error(
//                         //     'Too much noise detected',
//                         //     CustomError.audioError
//                         // );
//                         lastToastTime = currentTime;
//                     }
//                 }

//                 setNoiseLevel(average);
//             }
//         };
//     };

//     const handleError = (error: Error) => {
//         console.error('The following getUserMedia error occurred: ', error);
//     };

//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         navigator.mediaDevices
//             .getUserMedia({ audio: true })
//             .then(handleSuccess)
//             .catch(handleError);
//     } else {
//         console.error('getUserMedia not supported on your browser!');
//     }
// };

export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    finallyCallback?: () => void,
    errorCallback?: (err: any) => void
) => {
    return async (...args: Parameters<T>): Promise<T | void> => {
        try {
            return await fn(...args);
        } catch (error) {
            errorCallback && errorCallback(error);
            console.log('Error in asyncHandler:', error);
            throw error;
        } finally {
            finallyCallback && finallyCallback();
        }
    };
};

export const formatCountDownTimer = (seconds: number) => {
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
};

export const isOptionSelected = (
    questionId: number,
    option: string,
    checkedQuestions: CheckedQuestionType[]
) => {
    const question = checkedQuestions?.find((q) => q.id === questionId);
    return question ? question.selectedOption === option : false;
};

export const enterFullscreen = () => {
    const elem = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
    };

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
};

export const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
    }
};

export const languageMimeTypeMap: Record<string, string> = {
    javascript: 'text/javascript',
    python: 'text/x-python',
    java: 'text/x-java',
    c: 'text/x-csrc',
    'c++': 'text/x-c++src',
    rust: 'text/x-rustsrc',
    go: 'text/x-go',
    php: 'text/x-php',
    'c#': 'text/x-csharp',
};

export const findLanguageCode = (
    codeSnippets: CodeSnippet[] = [],
    lang: string = 'JavaScript'
) => {
    const language = codeSnippets.find(
        (codeSnippet) => codeSnippet.lang === lang
    );
    return language ? language.code : '// Write your code here';
};

// const formatOutput = (output: string) => {
//     return output.split('\n').map((line, index) => (
//       <span key={index}>
//         {line}
//         <br />
//       </span>
//     ));
//   };
