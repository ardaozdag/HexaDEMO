import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function OutputScreen() {
  const { prompt, style, imageUrl } = useLocalSearchParams<{
    prompt: string;
    style: string;
    imageUrl: string;
  }>();

  const handleBack = () => {
    router.back();
  };

  // Use the imageUrl from Firebase or fallback to mock
  const logoUrl = imageUrl || 'https://images.pexels.com/photos/1029230/pexels-photo-1029230.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1625', '#2d1b69', '#1a1625']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.title}>Generated Logo</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: logoUrl }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.promptContainer}>
              <Text style={styles.promptLabel}>Prompt:</Text>
              <Text style={styles.promptText}>{prompt}</Text>
            </View>

            <View style={styles.styleContainer}>
              <Text style={styles.styleLabel}>Style:</Text>
              <Text style={styles.styleText}>{style?.charAt(0).toUpperCase() + style?.slice(1)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleBack}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Create Another</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1625',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 36, 56, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeholder: {
    width: 44,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 280,
    height: 280,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: 'rgba(45, 36, 56, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  promptContainer: {
    marginBottom: 20,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  styleContainer: {},
  styleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  styleText: {
    fontSize: 16,
    color: '#ffffff',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});