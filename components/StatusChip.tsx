import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Loader, CircleCheck } from 'lucide-react-native';

interface StatusChipProps {
  status: 'processing' | 'done';
  onPress: () => void;
}

export function StatusChip({ status, onPress }: StatusChipProps) {
  const isProcessing = status === 'processing';
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isProcessing && styles.processingChip,
        isDone && styles.doneChip,
      ]}
      onPress={onPress}
      disabled={isProcessing}
    >
      <View style={styles.chipContent}>
        {isProcessing && (
          <>
            <Loader size={14} color="#f59e0b" />
            <Text style={[styles.chipText, styles.processingText]}>
              Processing...
            </Text>
          </>
        )}
        {isDone && (
          <>
            <CircleCheck size={14} color="#10b981" />
            <Text style={[styles.chipText, styles.doneText]}>
              Done! Tap to view
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  processingChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  doneChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  processingText: {
    color: '#f59e0b',
  },
  doneText: {
    color: '#10b981',
  },
});