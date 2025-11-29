import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { requestPermissions, scheduleNotification, cancelNotification } from '../utils/notifications';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AlarmsScreen = ({ navigation }) => {
  const { alarms, medicines, addAlarm, updateAlarm, deleteAlarm } = useApp();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    medicineId: '',
    time: '',
    repeatDays: [],
  });

  useEffect(() => {
    // Request notification permissions on mount
    if (user?.roles?.includes('patient')) {
      requestPermissions();
    }
  }, [user]);

  const handleMenuPress = () => {
    Alert.alert(
      'Menu',
      'Choose an option',
      [
        { text: 'Dashboard', onPress: () => navigation.navigate('PatientDashboard') },
        { text: 'Medicine List', onPress: () => navigation.navigate('MedicineList') },
        { text: 'Checklist', onPress: () => navigation.navigate('Checklist') },
        { text: 'History', onPress: () => navigation.navigate('History') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAdd = () => {
    setFormData({ medicineId: '', time: '', repeatDays: [] });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (alarm) => {
    setFormData({
      medicineId: alarm.medicineId,
      time: alarm.time,
      repeatDays: alarm.repeatDays || [],
    });
    setEditingId(alarm.id);
    setShowAddForm(true);
  };

  const handleDelete = async (alarm) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (alarm.notificationIds) {
              await cancelNotification(alarm.notificationIds);
            }
            deleteAlarm(alarm.id);
          },
        },
      ]
    );
  };

  const toggleDay = (day) => {
    const newDays = formData.repeatDays.includes(day)
      ? formData.repeatDays.filter(d => d !== day)
      : [...formData.repeatDays, day];
    setFormData({ ...formData, repeatDays: newDays });
  };

  const handleTimeChange = (text) => {
    // Format as HH:MM
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 2) {
      setFormData({ ...formData, time: cleaned });
    } else if (cleaned.length <= 4) {
      setFormData({ ...formData, time: `${cleaned.slice(0, 2)}:${cleaned.slice(2)}` });
    }
  };

  const handleSave = async () => {
    if (!formData.medicineId) {
      Alert.alert('Error', 'Please select a medicine');
      return;
    }
    if (!formData.time || !formData.time.match(/^\d{2}:\d{2}$/)) {
      Alert.alert('Error', 'Please enter a valid time (HH:MM)');
      return;
    }
    if (formData.repeatDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    const medicine = medicines.find(m => m.id === formData.medicineId);
    if (!medicine) {
      Alert.alert('Error', 'Selected medicine not found');
      return;
    }

    const alarmData = {
      ...formData,
      medicineName: medicine.name,
    };

    if (editingId) {
      const oldAlarm = alarms.find(a => a.id === editingId);
      if (oldAlarm?.notificationIds) {
        await cancelNotification(oldAlarm.notificationIds);
      }
      const notificationIds = await scheduleNotification(alarmData);
      updateAlarm(editingId, { ...alarmData, notificationIds });
    } else {
      const notificationIds = await scheduleNotification(alarmData);
      addAlarm({ ...alarmData, notificationIds });
    }

    setShowAddForm(false);
    setFormData({ medicineId: '', time: '', repeatDays: [] });
    setEditingId(null);
    Alert.alert('Success', 'Alarm saved successfully!');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ medicineId: '', time: '', repeatDays: [] });
    setEditingId(null);
  };

  const renderAlarm = ({ item }) => {
    const medicine = medicines.find(m => m.id === item.medicineId);
    return (
      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.alarmMedicine}>{item.medicineName || 'Unknown'}</Text>
          <Text style={styles.alarmTime}>{item.time}</Text>
          <Text style={styles.alarmDays}>
            {item.repeatDays && item.repeatDays.length > 0
              ? item.repeatDays.join(', ')
              : 'No repeat days'}
          </Text>
        </View>
        <View style={styles.alarmActions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Alarms"
        onBack={() => navigation.goBack()}
        onMenuPress={handleMenuPress}
      />
      <ScrollView style={styles.scrollView}>
        {showAddForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingId ? 'Edit Alarm' : 'Add New Alarm'}
            </Text>

            <View style={styles.selectContainer}>
              <Text style={styles.label}>Medicine *</Text>
              <ScrollView style={styles.medicineList}>
                {medicines.length === 0 ? (
                  <Text style={styles.noMedicinesText}>
                    No medicines available. Add medicines first.
                  </Text>
                ) : (
                  medicines.map((medicine) => (
                    <TouchableOpacity
                      key={medicine.id}
                      style={[
                        styles.medicineOption,
                        formData.medicineId === medicine.id && styles.medicineOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, medicineId: medicine.id })}
                    >
                      <Text
                        style={[
                          styles.medicineOptionText,
                          formData.medicineId === medicine.id && styles.medicineOptionTextSelected,
                        ]}
                      >
                        {medicine.name}
                      </Text>
                      {formData.medicineId === medicine.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            <Input
              label="Time (HH:MM) *"
              value={formData.time}
              onChangeText={handleTimeChange}
              placeholder="09:00"
              keyboardType="numeric"
            />

            <View style={styles.daysContainer}>
              <Text style={styles.label}>Repeat Days *</Text>
              <View style={styles.daysGrid}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      formData.repeatDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        formData.repeatDays.includes(day) && styles.dayButtonTextSelected,
                      ]}
                    >
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formButtons}>
              <Button
                title="Save"
                onPress={handleSave}
                style={styles.saveButton}
              />
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                style={styles.cancelButton}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.headerActions}>
              <Button
                title="Add Alarm"
                onPress={handleAdd}
                style={styles.addButton}
                disabled={medicines.length === 0}
              />
            </View>
            {medicines.length === 0 && (
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={32} color="#FF9500" />
                <Text style={styles.warningText}>
                  Add medicines first to create alarms
                </Text>
              </View>
            )}
            {alarms.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="alarm-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyText}>No alarms set yet</Text>
                <Text style={styles.emptySubtext}>Tap "Add Alarm" to get started</Text>
              </View>
            ) : (
              <FlatList
                data={alarms}
                renderItem={renderAlarm}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  headerActions: {
    padding: 16,
  },
  addButton: {
    width: '100%',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  medicineList: {
    maxHeight: 200,
  },
  medicineOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  medicineOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FD',
  },
  medicineOptionText: {
    fontSize: 18,
    color: '#000000',
  },
  medicineOptionTextSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
  noMedicinesText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    padding: 16,
  },
  daysContainer: {
    marginBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 70,
    alignItems: 'center',
  },
  dayButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  alarmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmMedicine: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  alarmTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  alarmDays: {
    fontSize: 16,
    color: '#666666',
  },
  alarmActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    fontSize: 16,
    color: '#FF9500',
    flex: 1,
  },
});

