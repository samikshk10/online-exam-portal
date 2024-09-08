import Button from '../components/common/Button';
import DetectNoise from '../components/DetectNoise';
import Dropdown from '../components/common/Dropdown';
import ErrorBoundary from '../components/ErrorBoundary';
import Loader from '../components/common/Loader';
import WebCam from '../components/WebCam';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setShowToast } from '../feature/exam/examSlice';
import { enterFullscreen } from '../helper/helper';
import { getModel, loadModel } from '../helper/loadModelHelper';
import { Toast } from '../helper/toast';
import { CustomError } from '../types/question';

import {
    BackArrowIcon,
    CheckedIcon,
    CloseIcon,
    MicIcon,
    SpeakerIcon,
    TipsIcon,
    VideoIcon,
} from '../helper/icons';

function ExamDeviceCheck({
    setCanAccessExamPortal,
}: {
    setCanAccessExamPortal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isDeviceChecked, setIsDeviceChecked] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [checkCameraPermission, setCheckCameraPermission] =
        useState<boolean>(true);
    const [checkMicPermission, setCheckMicPermission] = useState<boolean>(true);
    const [videoOptions, setVideoOptions] = useState<string[]>([]);
    const [audioOptions, setAudioOptions] = useState<string[]>([]);
    const [showRefreshButton, setshowRefreshButton] = useState<boolean>(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get('examId');

    let audioStream: any = null;
    let videoStream: any = null;

    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');

    // const [mediaPermissionError, setMediaPermissionError] =
    //     useState<boolean>(false);

    const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
    const [soundLevel, setSoundLevel] = useState(0);
    const detectSoundOnceRef = useRef(false);

    const micToastShownRef = useRef<boolean>(false);
    const cameraToastShownRef = useRef<boolean>(false);

    const handleDropdownToggle = (dropdown: number | null) => {
        setOpenDropdown((prev: number | null) =>
            prev === dropdown ? null : dropdown
        );
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (soundLevel > 10 && detectSoundOnceRef.current === false) {
            detectSoundOnceRef.current = true;
        }
    }, [soundLevel]);

    useEffect(() => {
        async function initializeModel() {
            await loadModel();
            const model = getModel();
            if (model) {
                setIsModelsLoaded(true);
            }
        }
        initializeModel();
    }, [isModelsLoaded]);

    const handlePermissionChange = async (
        permissionName: 'microphone' | 'camera'
    ) => {
        try {
            const permission = await navigator.permissions.query({
                name: permissionName as PermissionName,
            });
            const newState = permission.state === 'granted';

            if (permissionName === 'microphone') {
                setCheckMicPermission(newState);

                if (!newState && !micToastShownRef.current) {
                    Toast.Error(
                        'Microphone permission denied',
                        CustomError.audioError
                    );
                    micToastShownRef.current = true;
                }
            } else if (permissionName === 'camera') {
                setCheckCameraPermission(newState);
                if (!newState && !cameraToastShownRef.current) {
                    Toast.Error(
                        'Camera permission denied',
                        CustomError.webCamError
                    );
                    cameraToastShownRef.current = true;
                }
            }
        } catch (error) {
            console.error(
                `Error checking ${permissionName} permission:`,
                error
            );
        }
    };

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const micPermission = await navigator.permissions.query({
                    name: 'microphone' as PermissionName,
                });
                const cameraPermission = await navigator.permissions.query({
                    name: 'camera' as PermissionName,
                });

                handlePermissionChange('microphone');
                handlePermissionChange('camera');

                micPermission.onchange = () => {
                    micToastShownRef.current = false;
                    handlePermissionChange('microphone');
                    if (micPermission.state === 'granted') {
                        setshowRefreshButton(true);
                    }
                };
                cameraPermission.onchange = () => {
                    cameraToastShownRef.current = false;
                    handlePermissionChange('camera');
                    if (cameraPermission.state === 'granted') {
                        setshowRefreshButton(true);
                    }
                };
            } catch (error) {
                console.error('Error checking permissions:', error);
            }
        };

        checkPermissions();

        return () => {
            navigator.permissions
                .query({ name: 'microphone' as PermissionName })
                .then((permission) => {
                    permission.onchange = null;
                });
            navigator.permissions
                .query({ name: 'camera' as PermissionName })
                .then((permission) => {
                    permission.onchange = null;
                });
        };
    }, []);

    useEffect(() => {
        const getDevices = async () => {
            try {
                if (checkMicPermission) {
                    audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                }
                if (checkCameraPermission) {
                    videoStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                    console.log('video stream', videoStream);
                }

                // Combine audio and video devices
                const audioDevices = audioStream
                    ? await navigator.mediaDevices.enumerateDevices()
                    : [];
                const videoDevices = videoStream
                    ? await navigator.mediaDevices.enumerateDevices()
                    : [];

                const filteredDevices = [
                    ...audioDevices.filter(
                        (device) => device.kind === 'audioinput'
                    ),
                    ...videoDevices.filter(
                        (device) => device.kind === 'videoinput'
                    ),
                ] as MediaDeviceInfo[];

                setDevices(filteredDevices);

                // Cleanup streams
                if (audioStream) {
                    audioStream
                        .getTracks()
                        .forEach((track: any) => track.stop());
                }
                if (videoStream) {
                    videoStream
                        .getTracks()
                        .forEach((track: any) => track.stop());
                }
            } catch (error) {
                console.error('Error getting devices:', error);
                setDevices([]);
            }
        };

        getDevices();
    }, []);

    useEffect(() => {
        console.log('devices', devices);
        const filterVideoOptions = (deviceList: MediaDeviceInfo[]) => {
            setVideoOptions(
                deviceList
                    .filter((device) => device.kind === 'videoinput')
                    .map((device) => device.label)
            );
        };
        filterVideoOptions(devices);

        const filterAudioOptions = (deviceList: MediaDeviceInfo[]) => {
            setAudioOptions(
                deviceList
                    .filter((device) => device.kind === 'audioinput')
                    .map((device) => device.label)
            );
        };
        filterAudioOptions(devices);
    }, [devices, checkMicPermission, checkCameraPermission]);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const audioConstraints = selectedAudioDevice
                    ? { label: { exact: selectedAudioDevice } }
                    : false;

                const videoConstraints = selectedVideoDevice
                    ? { label: { exact: selectedVideoDevice } }
                    : false;

                const VideoConstraints: MediaStreamConstraints = {
                    audio: audioConstraints as
                        | MediaTrackConstraints
                        | boolean
                        | undefined,
                };
                const AudioConstraints: MediaStreamConstraints = {
                    video: videoConstraints as
                        | MediaTrackConstraints
                        | boolean
                        | undefined,
                };
                audioStream =
                    await navigator.mediaDevices.getUserMedia(AudioConstraints);
                videoStream =
                    await navigator.mediaDevices.getUserMedia(VideoConstraints);
            } catch (error) {
                console.error('Error accessing selected devices:', error);
                // Handle errors
            }
        };

        if (selectedAudioDevice || selectedVideoDevice) {
            getMediaStream();
        }

        return () => {};
    }, [selectedAudioDevice, selectedVideoDevice]);

    return (
        <div className="h-[100dvh] px-5 md:px-20 bg-[#f4fbf9] grid place-items-center">
            <div className="flex w-full flex-col min-h-[31.25rem] h-[31.25rem] box-border gap-16 items-center md:flex-row md:gap-10">
                <div className="h-full flex-1">
                    <div className="h-full w-full relative">
                        {isModelsLoaded ? (
                            <WebCam
                                isModelsLoaded={isModelsLoaded}
                                isDeviceChecked={isDeviceChecked}
                                setIsFaceDetected={setIsFaceDetected}
                            />
                        ) : (
                            <div className="h-full w-full text-[#fff] bg-[#000] grid place-items-center">
                                <div className="flex items-center gap-3">
                                    <Loader isWhite /> Please Wait...
                                </div>
                            </div>
                        )}
                        <div className="w-2 h-[60%] max-h-[50%] absolute bottom-12 left-6 flex flex-col items-center gap-2">
                            <div className="h-full overflow-clip rotate-180 rounded-md bg-[#fff] w-full relative">
                                <div
                                    className={`absolute top-0 left-0 rounded-md bg-[#E38800] w-full`}
                                    style={{
                                        transition: 'all 0.5s linear',
                                        height: `${soundLevel ? Math.floor((soundLevel / 100) * 100) : 0}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="bg-[#EFEFEF] rounded-[50%] h-[40px] w-[35px] grid place-items-center">
                                <SpeakerIcon
                                    style={{
                                        fontSize: '18px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <ErrorBoundary>
                        <DetectNoise setSoundLevel={setSoundLevel} />
                    </ErrorBoundary>
                    <p className="mt-5 text-[17px] flex items-center ">
                        <span className="text-[#47a992] font-bold inline-flex">
                            <TipsIcon
                                style={{
                                    fontSize: '34px',
                                    marginTop: '-5px',
                                    marginRight: '2px',
                                }}
                            />{' '}
                            <span
                                style={{
                                    marginTop: '3px',
                                    marginRight: '10px',
                                }}
                            >
                                Tips:{' '}
                            </span>
                        </span>
                        <span className="inline-block mt-[3px]">
                            Stay in a well lit area for better experience
                        </span>
                    </p>
                </div>
                {!isDeviceChecked ? (
                    <div className="h-full flex-1 flex flex-col justify-between">
                        <div>
                            <h1>Test Device</h1>
                            <p className="text-lg mt-3">
                                Verify your audio and video permissions by
                                confirming your camera and microphone settings
                                prior to the exam.
                            </p>
                        </div>
                        <div>
                            <h4>Set Preferences</h4>
                            <div className="flex flex-col w-max gap-4 mt-4">
                                <Dropdown
                                    isMic
                                    isOpen={openDropdown === 1}
                                    onToggle={() => handleDropdownToggle(1)}
                                    options={
                                        checkMicPermission
                                            ? audioOptions
                                            : ['Permission denied']
                                    }
                                    selectedOption={selectedAudioDevice}
                                    setSelectedOption={setSelectedAudioDevice}
                                />
                                <Dropdown
                                    isWebCam
                                    isOpen={openDropdown === 2}
                                    onToggle={() => handleDropdownToggle(2)}
                                    options={
                                        checkCameraPermission
                                            ? videoOptions
                                            : ['Permission denied']
                                    }
                                    selectedOption={selectedVideoDevice}
                                    setSelectedOption={setSelectedVideoDevice}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                variant="secondary"
                                handleBtnClick={() => {
                                    setIsDeviceChecked(true);
                                }}
                                disabled={
                                    !checkCameraPermission ||
                                    !checkMicPermission ||
                                    !isModelsLoaded
                                }
                            >
                                Check Device
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex-1 flex flex-col items-start w-full">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsDeviceChecked(false)}
                        >
                            <BackArrowIcon
                                style={{
                                    fontSize: '18px',
                                    color: '#47a992',
                                    marginRight: '5px',
                                }}
                            />
                            <span className="font-semibold">Back</span>
                        </div>
                        <div className="mt-6">
                            <h1>Test Device</h1>
                            <p className="text-lg mt-3">
                                Ensure your device is set properly.
                            </p>
                        </div>
                        <div className="flex flex-col w-max gap-4 mt-6 text-[18px] text-[#949191]">
                            <div className="flex items-center">
                                <MicIcon style={{ fontSize: '25px' }} />
                                <p className="ml-3 w-[100px]">Microphone</p>

                                {!checkMicPermission ? (
                                    <p className="text-red-400 flex items-center ml-6 gap-2 font-semibold">
                                        <CloseIcon /> Not Found
                                    </p>
                                ) : (
                                    <p className="text-[#47a992] flex items-center ml-6 gap-2 font-semibold">
                                        <CheckedIcon />
                                        Ok
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <VideoIcon style={{ fontSize: '25px' }} />
                                <p className="ml-3 w-[100px]">Camera</p>

                                {!checkCameraPermission ? (
                                    <p className="text-red-400 flex items-center ml-6 gap-2 font-semibold">
                                        <CloseIcon /> Not Found
                                    </p>
                                ) : (
                                    <p className="text-[#47a992] flex items-center ml-6 gap-2 font-semibold">
                                        <CheckedIcon />
                                        Ok
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            {isFaceDetected ? (
                                <p className="text-[#47a992]">
                                    Face Detected Successfully.
                                </p>
                            ) : (
                                <p>
                                    Your face is being detected, please wait...
                                </p>
                            )}
                            {detectSoundOnceRef.current &&
                            checkMicPermission ? (
                                <p className="text-[#47a992]">
                                    Sound Detected Successfully.
                                </p>
                            ) : (
                                <p>Initializing sound check, please wait...</p>
                            )}
                        </div>
                        {showRefreshButton ? (
                            <div className="mt-auto">
                                <Button
                                    variant="secondary"
                                    handleBtnClick={handleRefresh}
                                >
                                    Refresh Page
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-auto">
                                <Button
                                    variant="secondary"
                                    disabled={!isFaceDetected}
                                    handleBtnClick={() => {
                                        setIsDeviceChecked(false);
                                        dispatch(setShowToast(true));
                                        navigate('/exam-portal');
                                        enterFullscreen();
                                        setCanAccessExamPortal(true);
                                    }}
                                >
                                    Start Exam
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExamDeviceCheck;
