import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const AboutScreen = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>À propos & Licences</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.appName, { color: theme.colors.accent }]}>Rhema v1.0.0</Text>
          <Text style={[styles.desc, { color: theme.colors.text }]}>
            Application biblique francophone complète, moderne, inspirée et 100% fonctionnelle hors-ligne.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Licences des textes bibliques</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.itemTitle, { color: theme.colors.text }]}>Louis Segond 1910 (LSG)</Text>
          <Text style={[styles.subText, { color: theme.colors.textMuted }]}>
            Domaine public. Libre d'utilisation et de diffusion.
          </Text>

          <Text style={[styles.itemTitle, { color: theme.colors.text, marginTop: 12 }]}>Bible Darby (FR)</Text>
          <Text style={[styles.subText, { color: theme.colors.textMuted }]}>
            Domaine public. Traduction littérale par John Nelson Darby.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Confidentialité & Données</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color={theme.colors.accent} />
            <Text style={[styles.itemTitle, { color: theme.colors.text }]}>100% Local & Respect de la vie privée</Text>
          </View>
          <Text style={[styles.subText, { color: theme.colors.textMuted, marginTop: 6 }]}>
            Vos notes, surlignages et données de lecture sont stockés exclusivement sur votre appareil et synchronisés de façon sécurisée.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  content: { padding: 16, gap: 14 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 6 },
  appName: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  itemTitle: { fontSize: 14, fontWeight: 'bold' },
  subText: { fontSize: 13, lineHeight: 18 },
});
