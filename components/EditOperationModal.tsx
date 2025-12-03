import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { theme } from '../theme';
import { Operation, Material, Equipment } from '../types';
import SearchableSelect from './SearchableSelect';

interface EditOperationModalProps {
  visible: boolean;
  operation: Operation | null;
  materials: Material[];
  equipment: Equipment[];
  onCancel: () => void;
  onSave: (updatedData: Partial<Operation>) => void;
}

export const EditOperationModal: React.FC<EditOperationModalProps> = ({
  visible,
  operation,
  materials,
  equipment,
  onCancel,
  onSave,
}) => {
  const { t } = useLanguage();
  const [materialId, setMaterialId] = useState<string>('');
  const [truckId, setTruckId] = useState<string>('');
  const [miningFront, setMiningFront] = useState('');
  const [destination, setDestination] = useState('');
  const [activityDetails, setActivityDetails] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    if (visible && operation) {
      // Initialize form with operation data
      const matId = typeof operation.material === 'string' ? operation.material : operation.material?._id || '';
      setMaterialId(matId);

      const trId = operation.truckBeingLoaded
        ? (typeof operation.truckBeingLoaded === 'string' ? operation.truckBeingLoaded : operation.truckBeingLoaded._id)
        : '';
      setTruckId(trId);

      setMiningFront(operation.miningFront || '');
      setDestination(operation.destination || '');
      setActivityDetails(operation.activityDetails || '');
      setDistance(operation.distance?.toString() || '0');
    }
  }, [visible, operation]);

  const handleSave = () => {
    if (!operation) return;

    const updatedData: Partial<Operation> = {
      miningFront: miningFront.trim() || undefined,
      destination: destination.trim() || undefined,
      activityDetails: activityDetails.trim() || undefined,
      distance: distance ? parseFloat(distance) : 0,
    };

    // Only include material if it's set
    if (materialId) {
      updatedData.material = materialId as any;
    }

    // Only include truck if it's set
    if (truckId) {
      updatedData.truckBeingLoaded = truckId as any;
    }

    onSave(updatedData);
  };

  // Filter transport equipment (trucks)
  const trucks = equipment.filter(eq => eq.category === 'transport');

  const operationEquipment = operation?.equipment
    ? (typeof operation.equipment === 'string' ? null : operation.equipment)
    : null;
  const isLoadingEquipment = operationEquipment?.category === 'loading';

  // Convert materials and trucks to options format for SearchableSelect
  const materialOptions = materials.map(m => ({ label: m.name, value: m._id }));
  const truckOptions = trucks.map(t => ({ label: t.name, value: t._id }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('operation.edit')}</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Equipment & Activity Info (Read-only) */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="construct-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>{t('nav.equipment')}:</Text>
                <Text style={styles.infoValue}>{operationEquipment?.name || 'Unknown'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="list-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>{t('operation.activity')}:</Text>
                <Text style={styles.infoValue}>
                  {typeof operation?.activity === 'string' ? operation.activity : operation?.activity?.name || 'Unknown'}
                </Text>
              </View>
            </View>

            {/* Material Selection */}
            <SearchableSelect
              label={t('operation.material')}
              options={materialOptions}
              value={materialId}
              onValueChange={setMaterialId}
              placeholder={t('operation.selectMaterial') + ' (' + t('operation.optional') + ')'}
            />

            {/* Truck Selection (for loading equipment only) */}
            {isLoadingEquipment && (
              <SearchableSelect
                label={t('operation.truckBeingLoaded')}
                options={truckOptions}
                value={truckId}
                onValueChange={setTruckId}
                placeholder={t('operation.selectTruck') + ' (' + t('operation.optional') + ')'}
              />
            )}

            {/* Mining Front */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="location-outline" size={14} color={theme.colors.text} /> {t('operation.miningFront')}
              </Text>
              <TextInput
                style={styles.input}
                value={miningFront}
                onChangeText={setMiningFront}
                placeholder={t('operation.miningFront')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Destination */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="flag-outline" size={14} color={theme.colors.text} /> {t('operation.destination')}
              </Text>
              <TextInput
                style={styles.input}
                value={destination}
                onChangeText={setDestination}
                placeholder={t('operation.destination')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Distance */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="speedometer-outline" size={14} color={theme.colors.text} /> {t('operation.distance')} (km)
              </Text>
              <TextInput
                style={styles.input}
                value={distance}
                onChangeText={setDistance}
                placeholder="0"
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Activity Details */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="document-text-outline" size={14} color={theme.colors.text} /> {t('operation.details')}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={activityDetails}
                onChangeText={setActivityDetails}
                placeholder="Add any additional notes or details..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>{t('common.saveChanges')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.lg,
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: '#ffffff',
  },
});
