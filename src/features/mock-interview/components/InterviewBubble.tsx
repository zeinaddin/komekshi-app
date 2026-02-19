import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from '@/src/shared/components/ui';

type MessageRole = 'interviewer' | 'candidate';
type MessageType = 'text' | 'audio';

interface InterviewBubbleProps {
  role: MessageRole;
  type: MessageType;
  text?: string;
  durationMs?: number;
  index?: number;
}

function formatDuration(ms: number): string {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function InterviewBubble({ role, type, text, durationMs, index = 0 }: InterviewBubbleProps) {
  const isInterviewer = role === 'interviewer';
  const isAudio = type === 'audio';
  const delay = Math.min(index * 80, 240);

  if (isInterviewer) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).duration(350).springify()}
        style={styles.interviewerContainer}
      >
        <LinearGradient
          colors={['#7C6AFA', '#5B4AE8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.interviewerBubble}
        >
          <Text style={styles.interviewerLabel}>interviewer</Text>
          <Text style={styles.interviewerDescription}>
            Description. Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do
          </Text>
          {isAudio ? (
            <View style={styles.audioContainer}>
              <View style={styles.waveRow}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { height: 4 + Math.random() * 16 },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.audioDuration}>{formatDuration(durationMs ?? 0)}</Text>
            </View>
          ) : (
            <View style={styles.interviewerTextContainer}>
              <Text style={styles.interviewerText}>{text}</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  }

  // Candidate (user) bubble
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(350).springify()}
      style={styles.candidateContainer}
    >
      <LinearGradient
        colors={['#4A9FFF', '#2D7FE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.candidateBubble}
      >
        {isAudio ? (
          <View style={styles.audioRowCandidate}>
            <View style={styles.waveRowCandidate}>
              {Array.from({ length: 28 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBarCandidate,
                    { height: 3 + Math.random() * 18 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.audioDurationCandidate}>{formatDuration(durationMs ?? 0)}</Text>
          </View>
        ) : (
          <Text style={styles.candidateText}>{text}</Text>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Interviewer styles
  interviewerContainer: {
    alignSelf: 'flex-start',
    maxWidth: '88%',
    marginBottom: 12,
  },
  interviewerBubble: {
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  interviewerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 2,
    textTransform: 'lowercase',
  },
  interviewerDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
    lineHeight: 14,
  },
  interviewerTextContainer: {
    backgroundColor: 'rgba(90, 130, 255, 0.5)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  interviewerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 21,
  },

  // Audio styles for interviewer
  audioContainer: {
    backgroundColor: 'rgba(90, 130, 255, 0.5)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginRight: 10,
  },
  waveBar: {
    width: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  audioDuration: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Candidate styles
  candidateContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 12,
  },
  candidateBubble: {
    borderRadius: 20,
    borderTopRightRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 100,
  },
  candidateText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 21,
  },

  // Audio styles for candidate
  audioRowCandidate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveRowCandidate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginRight: 10,
  },
  waveBarCandidate: {
    width: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  audioDurationCandidate: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
