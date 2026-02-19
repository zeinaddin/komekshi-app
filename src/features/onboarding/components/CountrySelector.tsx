import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Text } from '@/src/shared/components/ui';
import { useAppTheme } from '@/src/shared/theme';
import { Country, COUNTRIES } from '../constants/locations';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CountrySelectorProps {
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
  placeholder?: string;
}

export function CountrySelector({
  selectedCountry,
  onSelect,
  placeholder = 'Select your country',
}: CountrySelectorProps) {
  const theme = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleSelect = (country: Country) => {
    onSelect(country);
    setModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
        style={[
          styles.countryItem,
          {
            backgroundColor:
              selectedCountry?.code === item.code
                ? theme.colors.primary[50]
                : 'transparent',
            borderRadius: theme.borderRadius.lg,
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text
          variant="body"
          weight={selectedCountry?.code === item.code ? 'semibold' : 'regular'}
          style={{ flex: 1 }}
        >
          {item.name}
        </Text>
        {selectedCountry?.code === item.code && (
          <View
            style={[
              styles.checkmark,
              { backgroundColor: theme.colors.primary[500] },
            ]}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>
          </View>
        )}
    </TouchableOpacity>
  );

  return (
    <>
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => setModalVisible(true)}
          activeOpacity={1}
          style={[
            styles.selector,
            {
              backgroundColor: theme.colors.surface,
              borderColor: selectedCountry
                ? theme.colors.primary[500]
                : theme.colors.border.default,
              borderRadius: theme.borderRadius.xl,
            },
          ]}
        >
          {selectedCountry ? (
            <View style={styles.selectedContent}>
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Text variant="body" weight="medium">
                {selectedCountry.name}
              </Text>
            </View>
          ) : (
            <Text variant="body" color="tertiary">
              {placeholder}
            </Text>
          )}
          <Text style={StyleSheet.flatten([styles.chevron, { color: theme.colors.text.tertiary }])}>
            ▼
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          />
          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(250)}
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderTopLeftRadius: theme.borderRadius.xxl,
                borderTopRightRadius: theme.borderRadius.xxl,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalHandle,
                  { backgroundColor: theme.colors.gray[300] },
                ]}
              />
              <Text variant="h2" align="center" style={{ marginTop: 16 }}>
                Select Country
              </Text>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 2,
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 28,
  },
  chevron: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
