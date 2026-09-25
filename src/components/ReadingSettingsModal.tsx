import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStore } from '../store/useThemeStore';
import { X, Minus, Plus } from 'lucide-react-native';

interface ReadingSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({ visible, onClose }) => {
  const theme = useTheme();
  const { fontSize, setFontSize, lineHeight, setLineHeight, themeMode, setThemeMode } = useThemeStore();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Réglages de lecture</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Font Size Adjuster */}
          <View style={styles.settingRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Taille du texte ({fontSize}px)</Text>
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setFontSize(Math.max(12, fontSize - 2))}
              >
                <Minus size={18} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setFontSize(Math.min(32, fontSize + 2))}
              >
                <Plus size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Line Height Adjuster */}
          <View style={styles.settingRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Interligne ({lineHeight.toFixed(1)})</Text>
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setLineHeight(Math.max(1.2, parseFloat((lineHeight - 0.1).toFixed(1))))}
              >
                <Minus size={18} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setLineHeight(Math.min(2.2, parseFloat((lineHeight + 0.1).toFixed(1))))}
              >
                <Plus size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Themes Quick Bar */}
          <View style={styles.themeRow}>
            {(['light', 'dark', 'sepia', 'amoled'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.themeChip,
                  {
                    borderColor: themeMode === m ? theme.colors.accent : theme.colors.border,
                    backgroundColor: m === 'light' ? '#FFF' : m === 'dark' ? '#1E293B' : m === 'sepia' ? '#F4E8C1' : '#000',
                  },
                ]}
                onPress={() => setThemeMode(m)}
              >
                <Text style={{ color: m === 'light' || m === 'sepia' ? '#000' : '#FFF', fontSize: 11, fontWeight: 'bold' }}>
                  {m.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  themeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
  },
});
