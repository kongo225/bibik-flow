import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { downloadService, AVAILABLE_PACKAGES, RemoteVersionPackage } from '../services/downloadService';
import { BibleVersion } from '../data/repositories/bibleRepository';
import { Download, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const DownloadsScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [installedVersions, setInstalledVersions] = useState<BibleVersion[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    const versions = await downloadService.getInstalledVersions();
    setInstalledVersions(versions);
  };

  const isInstalled = (id: string) => installedVersions.some((v) => v.id === id);

  const handleDownload = async (pkg: RemoteVersionPackage) => {
    setDownloadingId(pkg.id);
    await downloadService.downloadVersionPackage(pkg);
    await loadVersions();
    setDownloadingId(null);
  };

  const handleDelete = async (versionId: string) => {
    if (versionId === 'lsg') {
      Alert.alert('Action impossible', 'La version Louis Segond 1910 est la version principale par défaut.');
      return;
    }
    await downloadService.deleteVersionPackage(versionId);
    await loadVersions();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Gestionnaire de Téléchargements</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Versions installées</Text>
        {installedVersions.map((v) => (
          <View key={v.id} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>{v.name}</Text>
              <Text style={[styles.sub, { color: theme.colors.textMuted }]}>
                {v.license} • {v.size_mb} Mo
              </Text>
            </View>
            {v.id !== 'lsg' && (
              <TouchableOpacity onPress={() => handleDelete(v.id)}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 16 }]}>Versions disponibles</Text>
        {AVAILABLE_PACKAGES.map((pkg) => {
          const installed = isInstalled(pkg.id);
          const downloading = downloadingId === pkg.id;

          return (
            <View key={pkg.id} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View>
                <Text style={[styles.title, { color: theme.colors.text }]}>{pkg.name}</Text>
                <Text style={[styles.sub, { color: theme.colors.textMuted }]}>
                  {pkg.license} • {pkg.size_mb} Mo
                </Text>
              </View>

              {installed ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={18} color={theme.colors.accent} />
                  <Text style={{ fontSize: 12, color: theme.colors.accent, fontWeight: 'bold' }}>Installé</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.dlBtn, { backgroundColor: theme.colors.accent }]}
                  disabled={downloading}
                  onPress={() => handleDownload(pkg)}
                >
                  <Download size={16} color={theme.colors.accentText} />
                  <Text style={{ color: theme.colors.accentText, fontSize: 12, fontWeight: 'bold' }}>
                    {downloading ? '...' : 'Télécharger'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
  title: { fontSize: 15, fontWeight: 'bold' },
  sub: { fontSize: 12, marginTop: 2 },
  dlBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
});
