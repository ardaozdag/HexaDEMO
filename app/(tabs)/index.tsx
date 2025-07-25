import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, Slash, Type, CheckCircle } from 'lucide-react-native';
import { LogoService, GenerationData } from '@/services/logoService';

const { width } = Dimensions.get('window');

interface LogoStyle {
  id: string;
  name: string;
  icon: React.ReactNode;
  backgroundColor: string;
  iconColor: string;
}

const logoStyles: LogoStyle[] = [
  {
    id: 'none',
    name: 'No Style',
    icon: <Slash size={40} color="#ffffff" />,
    backgroundColor: 'transparent',
    iconColor: '#ffffff',
  },
  {
    id: 'monogram',
    name: 'Monogram',
    icon: <Text style={{fontFamily: 'serif', fontSize: 40, color: '#1a1625'}}>B</Text>,
    backgroundColor: '#e5e7eb',
    iconColor: '#1a1625',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    icon: <Sparkles size={40} color="#ffffff" />,
    backgroundColor: '#8b5cf6',
    iconColor: '#ffffff',
  },
  {
    id: 'mascot',
    name: 'Mascot',
    icon: <Text style={{fontSize: 40}}>🐊</Text>,
    backgroundColor: '#065f46',
    iconColor: '#fbbf24',
  },
];

export default function CreateScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationData, setGenerationData] = useState<GenerationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Clean up listener on component unmount
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (generationId) {
      unsubscribe = LogoService.listenToGeneration(
        generationId,
        (data) => {
          setGenerationData(data);
          if (data?.status === 'done' || data?.status === 'error') {
            setIsGenerating(false);
          }
        },
        (error) => {
          console.error('Error listening to generation:', error);
          setIsGenerating(false);
          Alert.alert('Error', 'Failed to get generation updates. Please try again.');
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [generationId]);

  const handleCreate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt for your logo.');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationData(null);
      
      // Call Firebase Function to start generation
      const response = await LogoService.startGeneration(prompt.trim(), selectedStyle);
      
      if (response.success) {
        setGenerationId(response.generationId);
        console.log('Generation started successfully:', response.message);
      } else {
        throw new Error(response.message || 'Failed to start generation');
      }
    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to start logo generation. Please try again.'
      );
    }
  };

  const handleChipPress = () => {
    if (generationData?.status === 'done' && generationData.imageUrl) {
      router.push({
        pathname: '/output',
        params: {
          prompt: generationData.prompt,
          style: generationData.style,
          imageUrl: generationData.imageUrl,
        },
      });
    }
  };

  const getStatusChip = () => {
    if (!isGenerating && !generationData) return null;

    if (generationData?.status === 'done') {
      return (
        <TouchableOpacity style={styles.statusChip} onPress={handleChipPress}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.statusChipGradient}
          >
            <CheckCircle size={20} color="#ffffff" />
            <View style={styles.statusChipTextContainer}>
              <Text style={styles.statusChipTitle}>Your Design is Ready!</Text>
              <Text style={styles.statusChipSubtitle}>Tap to see it</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    if (generationData?.status === 'error') {
      return (
        <View style={styles.errorChip}>
          <Text style={styles.errorChipTitle}>Oops, something went wrong!</Text>
          <Text style={styles.errorChipSubtitle}>Click to try again</Text>
        </View>
      );
    }

    // Processing state
    return (
      <View style={styles.processingChip}>
        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.processingChipTitle}>Creating Your Design...</Text>
          <Text style={styles.processingChipSubtitle}>Ready in 2 minutes</Text>
        </View>
      </View>
    );
  };

  const isCreateDisabled = !prompt.trim() || isGenerating;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1625', '#2d1b69', '#1a1625']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>AI Logo</Text>
          </View>

          {/* Status Chip */}
          {getStatusChip()}

          <View style={[styles.promptSection, isGenerating && styles.disabledSection]} pointerEvents={isGenerating ? 'none' : 'auto'}>
            <View style={styles.promptHeader}>
              <Text style={styles.sectionTitle}>Enter Your Prompt</Text>
              <TouchableOpacity style={styles.surpriseButton} disabled={isGenerating}>
                <Sparkles size={16} color="#8b5cf6" />
                <Text style={styles.surpriseText}>Surprise me</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="A blue lion logo reading 'HEXA' in bold letters"
                placeholderTextColor="#6b7280"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                maxLength={500}
                editable={!isGenerating}
              />
              <Text style={styles.charCounter}>{prompt.length}/500</Text>
            </View>
          </View>

          <View style={[styles.stylesSection, isGenerating && styles.disabledSection]} pointerEvents={isGenerating ? 'none' : 'auto'}>
            <Text style={styles.sectionTitle}>Logo Styles</Text>
            <ScrollView
              horizontal
              style={styles.styleScrollView}
              contentContainerStyle={styles.styleScrollContent}
              showsHorizontalScrollIndicator={false}
            >
              {logoStyles.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.styleOption,
                      isSelected && styles.styleOptionSelected,
                      { borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.2)' },
                      { backgroundColor: style.backgroundColor },
                    ]}
                    onPress={() => !isGenerating && setSelectedStyle(style.id)}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                  >
                    <View style={styles.styleIcon}>{style.icon}</View>
                    <Text style={[styles.styleName, isSelected && styles.styleNameSelected]}>{style.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              isCreateDisabled && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={isCreateDisabled}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isCreateDisabled ? ['#4b5563', '#4b5563'] : ['#6366f1', '#8b5cf6']}
              style={styles.createButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.createButtonText}>
                Create <Text style={{ fontSize: 18 }}>✨</Text>
              </Text>
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
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Status Chip Styles
  statusChip: {
    marginBottom: 18,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  statusChipTextContainer: {
    marginLeft: 12,
  },
  statusChipTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  statusChipSubtitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '400',
  },
  processingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    marginTop: 10,
  },
  processingChipTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  processingChipSubtitle: {
    color: '#b3b3b3',
    fontSize: 13,
    fontWeight: '400',
  },
  errorChip: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    marginTop: 10,
  },
  errorChipTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  errorChipSubtitle: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '400',
  },
  promptSection: {
    marginBottom: 30,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  surpriseText: {
    fontSize: 13,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'rgba(45, 36, 56, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    overflow: 'hidden',
    marginTop: 8,
  },
  textInput: {
    padding: 20,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 12,
    color: '#6b7280',
  },
  stylesSection: {
    marginBottom: 30,
  },
  styleScrollView: {
    marginTop: 10,
  },
  styleScrollContent: {
    paddingRight: 20,
  },
  styleOption: {
    alignItems: 'center',
    marginRight: 18,
    width: 72,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  styleOptionSelected: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  styleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  styleName: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  styleNameSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledSection: {
    opacity: 0.5,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  createButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});