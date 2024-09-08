import React, { useEffect, useRef } from 'react';
// import { detectNoise } from '../helper/helper';
import { Toast } from '../helper/toast';
import { CustomError } from '../types/question';
import '@tensorflow/tfjs';
import { FacePrediction } from '../types/question';

import { getModel } from '../helper/loadModelHelper';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setOutOfViewCount } from '../feature/exam/examSlice';

const WebCam = ({
    isModelsLoaded,
    isDeviceChecked,
    setIsFaceDetected,
}: {
    isModelsLoaded: boolean;
    isDeviceChecked?: boolean;
    setIsFaceDetected?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const showToast = useAppSelector((state) => state.exam.showToast);
    const outOfViewCount = useAppSelector(
        (state) => state.exam.outOfViewCount ?? 0
    );
    const isDeviceCheckedRef = useRef<boolean>(isDeviceChecked ?? false);
    const dispatch = useAppDispatch();

    // Update the ref when the prop changes
    useEffect(() => {
        isDeviceCheckedRef.current = isDeviceChecked ?? false;
    }, [isDeviceChecked]);

    let showToastOnce = true;
    const model = getModel();

    useEffect(() => {
        const startVideo = () => {
            navigator.mediaDevices
                .getUserMedia({
                    video: { width: 640, height: 480 },
                })
                .then(async (stream) => {
                    mediaStreamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.addEventListener('loadeddata', () => {
                            videoRef.current?.play();
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error accessing webcam: ', err);
                });
        };
        if (videoRef.current && isModelsLoaded) {
            startVideo();
        }
        return () => {
            // Cleanup function to stop the video stream when component unmounts
            if (mediaStreamRef.current) {
                const tracks = mediaStreamRef.current.getTracks();
                tracks.forEach((track) => track.stop()); // Stop all tracks in the stream
            }
        };
    }, [videoRef, isModelsLoaded]);

    const closePreviousToast = () => {
        showToastOnce = true;
    };
    useEffect(() => {
        const detectFaces = async () => {
            if (model && videoRef.current) {
                const predictions = (await model.estimateFaces(
                    videoRef.current,
                    false
                )) as FacePrediction[];
                if (isDeviceCheckedRef.current) {
                    if (
                        predictions.length === 0 ||
                        !predictions.some((prediction) => prediction.landmarks)
                    ) {
                        setIsFaceDetected && setIsFaceDetected(false);
                        if (showToastOnce) {
                            showToastOnce = false;
                            // showToast &&
                            //     Toast.Error(
                            //         'Please look at your screen',
                            //         CustomError.webCamError,
                            //         closePreviousToast
                            //     );
                        }
                    } else {
                        setIsFaceDetected && setIsFaceDetected(true);
                    }
                }

                // else {

                predictions.forEach((prediction) => {
                    if (prediction.landmarks) {
                        const [leftEye, rightEye, nose, leftMouth, rightMouth] =
                            prediction.landmarks;

                        const eyeDist = Math.abs(leftEye[0] - rightEye[0]);
                        const noseToLeftEyeDist = Math.abs(
                            nose[0] - leftEye[0]
                        );
                        const noseToRightEyeDist = Math.abs(
                            nose[0] - rightEye[0]
                        );

                        const leftRatio = noseToLeftEyeDist / eyeDist;
                        const rightRatio = noseToRightEyeDist / eyeDist;

                        const horizontalThreshold = 0.4;
                        const isHorizontallyCentered =
                            Math.abs(leftRatio - rightRatio) <
                            horizontalThreshold;

                        const verticalCenter = (leftEye[1] + rightEye[1]) / 2;
                        const mouthCenter = (leftMouth[1] + rightMouth[1]) / 2;
                        const verticalDist = Math.abs(
                            verticalCenter - mouthCenter
                        );

                        const verticalThreshold = eyeDist * 0.6;
                        const isVerticallyCentered =
                            verticalDist < verticalThreshold;

                        const isLookingAtScreen =
                            isHorizontallyCentered && isVerticallyCentered;
                        if (!isLookingAtScreen && showToastOnce) {
                            dispatch(setOutOfViewCount(outOfViewCount + 1));
                            showToastOnce = false;
                            showToast &&
                                Toast.Error(
                                    'Please look at your screen',
                                    CustomError.webCamError,
                                    closePreviousToast
                                );
                        }
                    }
                });
                // }
            }
            requestAnimationFrame(detectFaces);
        };
        const handleLoadedData = () => {
            if (videoRef.current) {
                videoRef.current.play().catch((error) => {
                    console.error('Error playing video: ', error);
                });
            }
        };

        if (model) {
            if (videoRef.current) {
                videoRef.current.addEventListener(
                    'loadedmetadata',
                    detectFaces
                );
            }

            return () => {
                // Clean up function
                if (videoRef.current) {
                    videoRef.current.removeEventListener(
                        'loadedmetadata',
                        detectFaces
                    );
                    videoRef.current.removeEventListener(
                        'loadeddata',
                        handleLoadedData
                    );
                }
            };
        }
    }, [model, isDeviceChecked]);

    return (
        <div className="h-full w-full">
            <video className="w-full h-full object-cover" ref={videoRef} />
        </div>
    );
};

export default WebCam;
