import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Audio} from 'expo-av';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming, FadeIn,
} from 'react-native-reanimated';
import {Text} from '@/src/shared/components/ui';
import {useAppTheme} from '@/src/shared/theme';
import {InterviewBubble, MicrophoneIcon} from '../components';
import {DEFAULT_OPENING_QUESTION, submitVoiceTurn} from '../services';

type SessionStatus = 'idle' | 'recording' | 'processing' | 'playing';
type MessageRole = 'interviewer' | 'candidate';
type MessageType = 'text' | 'audio';

interface Message {
    id: string;
    role: MessageRole;
    type: MessageType;
    text?: string;
    durationMs?: number;
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function MockInterviewScreen() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const router = useRouter();
    const scrollRef = useRef<ScrollView | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const recordingStartedAtRef = useRef<number | null>(null);
    const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const aiSoundRef = useRef<Audio.Sound | null>(null);
    const pressActiveRef = useRef(false);
    const backendEnabled = Boolean(process.env.EXPO_PUBLIC_MOCK_INTERVIEW_API_URL?.trim());

    // Animation values
    const micScale = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: `interviewer-${Date.now()}`,
            role: 'interviewer',
            type: 'text',
            text: DEFAULT_OPENING_QUESTION,
        },
    ]);
    const [turn, setTurn] = useState(0);
    const [recordingMs, setRecordingMs] = useState(0);
    const [status, setStatus] = useState<SessionStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Pulse animation for recording state
    useEffect(() => {
        if (status === 'recording') {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.2, {duration: 600}),
                    withTiming(1, {duration: 600})
                ),
                -1,
                true
            );
        } else {
            pulseScale.value = withSpring(1);
        }
    }, [status, pulseScale]);

    const micAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: micScale.value}],
    }));

    const pulseAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: pulseScale.value}],
        opacity: status === 'recording' ? 0.3 : 0,
    }));

    const appendMessage = useCallback((message: Omit<Message, 'id'>) => {
        setMessages((prev) => [
            ...prev,
            {
                id: `${message.role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ...message,
            },
        ]);
    }, []);

    const clearRecordingTimer = useCallback(() => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
    }, []);

    const unloadAiSound = useCallback(async () => {
        if (!aiSoundRef.current) {
            return;
        }

        try {
            await aiSoundRef.current.unloadAsync();
        } catch {
            // Ignore unload errors on cleanup.
        } finally {
            aiSoundRef.current = null;
        }
    }, []);

    const playAiReply = useCallback(
        async (audioUrl: string) => {
            try {
                setStatus('playing');
                await unloadAiSound();
                const {sound} = await Audio.Sound.createAsync(
                    {uri: audioUrl},
                    {shouldPlay: true}
                );

                aiSoundRef.current = sound;
                sound.setOnPlaybackStatusUpdate((playbackStatus) => {
                    if (!playbackStatus.isLoaded) {
                        return;
                    }

                    if (playbackStatus.didJustFinish) {
                        void unloadAiSound();
                        setStatus('idle');
                    }
                });
            } catch {
                setStatus('idle');
                setErrorMessage('AI voice playback failed, but text response is shown.');
            }
        },
        [unloadAiSound]
    );

    const startRecording = useCallback(async () => {
        if (status === 'recording' || status === 'processing' || status === 'playing') {
            return;
        }

        setErrorMessage(null);

        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                setErrorMessage('Microphone permission is required for voice interview.');
                return;
            }
            if (!pressActiveRef.current) {
                return;
            }

            await unloadAiSound();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            if (!pressActiveRef.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                return;
            }

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await recording.startAsync();

            recordingRef.current = recording;
            recordingStartedAtRef.current = Date.now();
            setRecordingMs(0);
            clearRecordingTimer();
            recordingTimerRef.current = setInterval(() => {
                const startedAt = recordingStartedAtRef.current;
                if (!startedAt) {
                    return;
                }
                setRecordingMs(Date.now() - startedAt);
            }, 120);
            setStatus('recording');
        } catch {
            setStatus('idle');
            setErrorMessage('Failed to start recording. Please try again.');
        }
    }, [clearRecordingTimer, status, unloadAiSound]);

    const stopRecordingAndSubmit = useCallback(async () => {
        if (!recordingRef.current) {
            return;
        }

        const recordedDurationMs = recordingStartedAtRef.current
            ? Date.now() - recordingStartedAtRef.current
            : recordingMs;

        clearRecordingTimer();
        recordingStartedAtRef.current = null;
        setRecordingMs(0);
        setStatus('processing');

        const recording = recordingRef.current;
        recordingRef.current = null;

        let audioUri: string | null = null;
        try {
            await recording.stopAndUnloadAsync();
            audioUri = recording.getURI();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch {
            setStatus('idle');
            setErrorMessage('Recording failed. Hold the mic a bit longer and retry.');
            return;
        }

        if (!audioUri) {
            setStatus('idle');
            setErrorMessage('No audio captured. Try again.');
            return;
        }

        try {
            const result = await submitVoiceTurn({audioUri, turn});
            appendMessage({
                role: 'candidate',
                type: 'audio',
                durationMs: recordedDurationMs,
            });

            const interviewerText = result.nextQuestion?.trim() || result.aiReplyText?.trim();
            if (interviewerText) {
                appendMessage({
                    role: 'interviewer',
                    type: 'text',
                    text: interviewerText,
                });
            }

            setTurn((prev) => prev + 1);

            if (result.aiReplyAudioUrl) {
                await playAiReply(result.aiReplyAudioUrl);
            } else {
                setStatus('idle');
            }
        } catch (error) {
            appendMessage({
                role: 'candidate',
                type: 'audio',
                durationMs: recordedDurationMs,
            });
            appendMessage({
                role: 'interviewer',
                type: 'text',
                text: 'I could not process this answer now. Please hold to record and try again.',
            });
            setStatus('idle');
            setErrorMessage(
                error instanceof Error ? error.message : 'Audio upload failed. Check backend endpoint.'
            );
        }
    }, [appendMessage, clearRecordingTimer, playAiReply, recordingMs, turn]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            scrollRef.current?.scrollToEnd({animated: true});
        }, 80);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [messages, status]);

    useEffect(() => {
        return () => {
            clearRecordingTimer();
            void unloadAiSound();
            const recording = recordingRef.current;
            recordingRef.current = null;
            if (recording) {
                void recording.stopAndUnloadAsync();
            }
        };
    }, [clearRecordingTimer, unloadAiSound]);

    const statusText = useMemo(() => {
        if (status === 'recording') {
            return formatDuration(recordingMs);
        }

        if (status === 'processing') {
            return 'Processing...';
        }

        if (status === 'playing') {
            return 'Playing response...';
        }

        return 'Hold to speak';
    }, [recordingMs, status]);

    const micDisabled = status === 'processing' || status === 'playing';

    return (
        <View style={[styles.container, {paddingTop: insets.top, backgroundColor: theme.colors.background}]}>
            {/* Header */}
            <Animated.View entering={FadeIn.duration(300)} style={[styles.header, {borderBottomColor: theme.colors.border.default}]}>
                <TouchableOpacity
                    style={[styles.backButton, {backgroundColor: theme.colors.surfaceSecondary}]}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>Mock Interview</Text>
                <View style={styles.headerSpacer} />
                {!backendEnabled && (
                    <Text style={[styles.demoHint, {color: theme.colors.text.tertiary}]}>Demo mode</Text>
                )}
            </Animated.View>

            {/* Messages Container */}
            <View style={styles.messagesWrapper}>
                <ScrollView
                    ref={scrollRef}
                    style={styles.messages}
                    contentContainerStyle={[
                        styles.messagesContent,
                        {paddingBottom: 140}
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message, index) => (
                        <InterviewBubble
                            key={message.id}
                            role={message.role}
                            type={message.type}
                            text={message.text}
                            durationMs={message.durationMs}
                            index={index}
                        />
                    ))}

                    {status === 'processing' && (
                        <View style={[styles.processingBubble, {backgroundColor: theme.colors.primary[50]}]}>
                            <ActivityIndicator size="small" color={theme.colors.primary[500]}/>
                            <Text style={[styles.processingText, {color: theme.colors.primary[500]}]}>Thinking...</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Floating Microphone Control */}
                <View style={styles.micFloatingContainer}>
                    {/* Pulse ring */}
                    <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]}/>

                    {/* Outer ring */}
                    <View
                        style={[
                            styles.micRing,
                            {backgroundColor: theme.colors.surfaceSecondary},
                            status === 'recording' && styles.micRingActive,
                            micDisabled && styles.micRingDisabled,
                        ]}
                    >
                        <Animated.View style={micAnimatedStyle}>
                            <Pressable
                                disabled={micDisabled}
                                delayLongPress={140}
                                onPressIn={() => {
                                    pressActiveRef.current = true;
                                    micScale.value = withSpring(0.92);
                                }}
                                onLongPress={() => {
                                    void startRecording();
                                }}
                                onPressOut={() => {
                                    pressActiveRef.current = false;
                                    micScale.value = withSpring(1);
                                    void stopRecordingAndSubmit();
                                }}
                                style={styles.micButton}
                            >
                                <LinearGradient
                                    colors={status === 'recording' ? ['#FF6B8A', '#FF4D6D'] : ['#8B7BF7', '#6A5AE0']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={styles.micInner}
                                >
                                    {status === 'processing' ? (
                                        <ActivityIndicator color="#FFFFFF" size="small"/>
                                    ) : (
                                        <MicrophoneIcon size={28}/>
                                    )}
                                </LinearGradient>
                            </Pressable>
                        </Animated.View>
                    </View>

                    {/* Status text */}
                    <Text
                        style={StyleSheet.flatten([
                            styles.statusText,
                            {color: theme.colors.text.secondary, backgroundColor: theme.colors.surface},
                            status === 'recording' && styles.statusTextRecording,
                        ])}
                    >
                        {statusText}
                    </Text>

                    {errorMessage && (
                        <Text style={[styles.errorText, {backgroundColor: theme.colors.surface}]} numberOfLines={2}>
                            {errorMessage}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    demoHint: {
        position: 'absolute',
        bottom: -16,
        left: 0,
        right: 0,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    messagesWrapper: {
        flex: 1,
        position: 'relative',
    },
    messages: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    processingBubble: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        marginTop: 4,
    },
    processingText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '600',
    },
    micFloatingContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: 8,
    },
    pulseRing: {
        position: 'absolute',
        top: 8,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B8A',
    },
    micRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    micRingActive: {
        backgroundColor: 'rgba(255, 232, 236, 0.95)',
    },
    micRingDisabled: {
        opacity: 0.6,
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
    },
    micInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusTextRecording: {
        color: '#FF4D6D',
        fontWeight: '700',
    },
    errorText: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: '500',
        color: '#EF4444',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingVertical: 4,
        borderRadius: 8,
    },
});
