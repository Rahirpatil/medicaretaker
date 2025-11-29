import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const HistoryScreen = ({ navigation }) => {
  const { medicines, history, getHistoryForDate } = useApp();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isCaretaker = user?.roles?.includes('caretaker') && !user?.roles?.includes('patient');

  const handleMenuPress = () => {
    const menuOptions = isCaretaker
      ? [
          { text: 'Dashboard', onPress: () => navigation.navigate('CaretakerDashboard') },
          { text: 'Cancel', style: 'cancel' },
        ]
      : [
          { text: 'Dashboard', onPress: () => navigation.navigate('PatientDashboard') },
          { text: 'Medicine List', onPress: () => navigation.navigate('MedicineList') },
          { text: 'Checklist', onPress: () => navigation.navigate('Checklist') },
          { text: 'Alarms', onPress: () => navigation.navigate('Alarms') },
          { text: 'Cancel', style: 'cancel' },
        ];

    Alert.alert('Menu', 'Choose an option', menuOptions);
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTodayHistory = () => {
    const dateKey = getDateKey(selectedDate);
    return history.filter(h => h.date === dateKey);
  };

  const getMedicineName = (medicineId) => {
    const medicine = medicines.find(m => m.id === medicineId);
    return medicine ? medicine.name : 'Unknown Medicine';
  };

  const groupHistoryByMedicine = () => {
    const todayHistory = getTodayHistory();
    const grouped = {};

    todayHistory.forEach(entry => {
      if (!grouped[entry.medicineId]) {
        grouped[entry.medicineId] = {
          medicineId: entry.medicineId,
          medicineName: getMedicineName(entry.medicineId),
          entries: [],
        };
      }
      grouped[entry.medicineId].entries.push(entry);
    });

    return Object.values(grouped);
  };

  const getTodayStats = () => {
    const todayHistory = getTodayHistory();
    const taken = todayHistory.filter(h => h.taken).length;
    const missed = todayHistory.filter(h => !h.taken).length;
    const total = medicines.length;

    return { taken, missed, total };
  };

  const stats = getTodayStats();
  const groupedHistory = groupHistoryByMedicine();

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={isCaretaker ? "Patient History" : "History"}
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
            {isToday() && <Text style={styles.todayLabel}>Today</Text>}
          </View>
          <TouchableOpacity onPress={() => navigateDate(1)} style={styles.dateNavButton}>
            <Ionicons name="chevron-forward" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.taken}</Text>
            <Text style={styles.statLabel}>Taken</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.statNumberMissed]}>{stats.missed}</Text>
            <Text style={styles.statLabel}>Missed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {groupedHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No history for this date</Text>
            <Text style={styles.emptySubtext}>
              Medicine intake will appear here once tracked
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {groupedHistory.map((group) => (
              <View key={group.medicineId} style={styles.medicineGroup}>
                <View style={styles.medicineHeader}>
                  <Text style={styles.medicineName}>{group.medicineName}</Text>
                  <View style={styles.statusBadge}>
                    {group.entries.some(e => e.taken) ? (
                      <View style={styles.badgeTaken}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={styles.badgeTextTaken}>Taken</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeMissed}>
                        <Ionicons name="close-circle" size={20} color="#FF3B30" />
                        <Text style={styles.badgeTextMissed}>Missed</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.entriesList}>
                  {group.entries.map((entry) => (
                    <View key={entry.id} style={styles.historyEntry}>
                      <View style={styles.entryInfo}>
                        <Ionicons
                          name={entry.taken ? "checkmark-circle" : "close-circle"}
                          size={24}
                          color={entry.taken ? "#4CAF50" : "#FF3B30"}
                        />
                        <Text style={styles.entryText}>
                          {entry.taken ? 'Taken' : 'Missed'}
                        </Text>
                      </View>
                      <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.allHistorySection}>
            <Text style={styles.sectionTitle}>All History</Text>
            {history.slice(0, 20).map((entry) => (
              <View key={entry.id} style={styles.allHistoryEntry}>
                <View style={styles.allHistoryInfo}>
                  <Text style={styles.allHistoryMedicine}>
                    {getMedicineName(entry.medicineId)}
                  </Text>
                  <Text style={styles.allHistoryDate}>
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {formatTime(entry.timestamp)}
                  </Text>
                </View>
                <Ionicons
                  name={entry.taken ? "checkmark-circle" : "close-circle"}
                  size={24}
                  color={entry.taken ? "#4CAF50" : "#FF3B30"}
                />
              </View>
            ))}
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
  todayLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statNumberMissed: {
    color: '#FF3B30',
  },
  statLabel: {
    fontSize: 16,
    color: '#666666',
  },
  historyContainer: {
    padding: 16,
  },
  medicineGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  medicineName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeTaken: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeTextTaken: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  badgeMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeTextMissed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  entriesList: {
    gap: 8,
  },
  historyEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  entryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryText: {
    fontSize: 18,
    color: '#000000',
  },
  entryTime: {
    fontSize: 16,
    color: '#666666',
  },
  allHistorySection: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  allHistoryEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  allHistoryInfo: {
    flex: 1,
  },
  allHistoryMedicine: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  allHistoryDate: {
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


