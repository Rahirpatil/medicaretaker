import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const ChecklistScreen = ({ navigation }) => {
  const { medicines, checklist, updateChecklist } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMenuPress = () => {
    Alert.alert(
      'Menu',
      'Choose an option',
      [
        { text: 'Dashboard', onPress: () => navigation.navigate('PatientDashboard') },
        { text: 'Medicine List', onPress: () => navigation.navigate('MedicineList') },
        { text: 'Alarms', onPress: () => navigation.navigate('Alarms') },
        { text: 'History', onPress: () => navigation.navigate('History') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getDateString = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const toggleMedicine = (medicineId) => {
    const dateKey = getDateKey(selectedDate);
    const currentStatus = checklist[dateKey]?.[medicineId] || false;
    updateChecklist(selectedDate, medicineId, !currentStatus);
  };

  const getMedicineStatus = (medicineId) => {
    const dateKey = getDateKey(selectedDate);
    return checklist[dateKey]?.[medicineId] || false;
  };

  const getWeekSummary = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    let taken = 0;
    let total = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateKey = getDateKey(date);
      
      medicines.forEach(medicine => {
        total++;
        if (checklist[dateKey]?.[medicine.id]) {
          taken++;
        }
      });
    }
    
    return { taken, total };
  };

  const weekSummary = getWeekSummary();

  return (
    <View style={styles.container}>
      <Header
        title="Checklist"
        onBack={() => navigation.goBack()}
        onMenuPress={handleMenuPress}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => navigateDate(-1)} style={styles.dateNavButton}>
            <Ionicons name="chevron-back" size={32} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <Text style={styles.dayName}>{getDayName(selectedDate)}</Text>
            <Text style={styles.dateText}>{getDateString(selectedDate)}</Text>
          </View>
          <TouchableOpacity onPress={() => navigateDate(1)} style={styles.dateNavButton}>
            <Ionicons name="chevron-forward" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Week</Text>
          <Text style={styles.summaryText}>
            {weekSummary.taken} of {weekSummary.total} medicines taken
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(weekSummary.taken / weekSummary.total) * 100}%` },
              ]}
            />
          </View>
        </View>

        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkbox-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No medicines added yet</Text>
            <Text style={styles.emptySubtext}>
              Add medicines to track them in your checklist
            </Text>
          </View>
        ) : (
          <View style={styles.checklistContainer}>
            {medicines.map((medicine) => {
              const isTaken = getMedicineStatus(medicine.id);
              return (
                <TouchableOpacity
                  key={medicine.id}
                  style={[styles.checklistItem, isTaken && styles.checklistItemTaken]}
                  onPress={() => toggleMedicine(medicine.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        isTaken && styles.checkboxChecked,
                      ]}
                    >
                      {isTaken && (
                        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    {medicine.dosage && (
                      <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateNavButton: {
    padding: 8,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplay: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    color: '#666666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  checklistContainer: {
    padding: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistItemTaken: {
    backgroundColor: '#E8F5E9',
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 16,
    color: '#666666',
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
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

