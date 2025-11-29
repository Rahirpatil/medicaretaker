import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const AdminDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { medicines, alarms, history } = useApp();

  const handleMenuPress = () => {
    const menuOptions = [
      { text: 'All Medicines', onPress: () => navigation.navigate('MedicineList') },
      { text: 'All History', onPress: () => navigation.navigate('History') },
      { text: 'All Alarms', onPress: () => navigation.navigate('Alarms') },
    ];

    // Add other dashboards if user has multiple roles
    if (user?.roles?.includes('patient')) {
      menuOptions.push({
        text: 'Patient Dashboard',
        onPress: () => navigation.navigate('PatientDashboard'),
      });
    }
    if (user?.roles?.includes('caretaker')) {
      menuOptions.push({
        text: 'Caretaker Dashboard',
        onPress: () => navigation.navigate('CaretakerDashboard'),
      });
    }

    menuOptions.push(
      { text: 'Logout', onPress: handleLogout, style: 'destructive' },
      { text: 'Cancel', style: 'cancel' }
    );

    Alert.alert('Menu', 'Choose an option', menuOptions);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const totalMedicines = medicines.length;
  const totalAlarms = alarms.length;
  const totalHistoryEntries = history.length;
  const todayHistory = history.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return h.date === today;
  }).length;

  return (
    <View style={styles.container}>
      <Header
        title="Admin Dashboard"
        onMenuPress={handleMenuPress}
        showBack={false}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome, Administrator!</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="medical" size={32} color="#007AFF" />
            <Text style={styles.statNumber}>{totalMedicines}</Text>
            <Text style={styles.statLabel}>Medicines</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="alarm" size={32} color="#007AFF" />
            <Text style={styles.statNumber}>{totalAlarms}</Text>
            <Text style={styles.statLabel}>Alarms</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color="#007AFF" />
            <Text style={styles.statNumber}>{totalHistoryEntries}</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
        </View>

        <Card
          title="All Medicines"
          subtitle={`${totalMedicines} medicines in system`}
          icon={<Ionicons name="medical" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('MedicineList')}
        />

        <Card
          title="All Alarms"
          subtitle={`${totalAlarms} active alarms`}
          icon={<Ionicons name="alarm" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('Alarms')}
        />

        <Card
          title="All History"
          subtitle={`${todayHistory} entries today, ${totalHistoryEntries} total`}
          icon={<Ionicons name="document-text" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('History')}
        />

        <Card
          title="System Overview"
          subtitle="View comprehensive system statistics"
          icon={<Ionicons name="stats-chart" size={40} color="#007AFF" />}
          onPress={() => {
            Alert.alert(
              'System Overview',
              `Total Medicines: ${totalMedicines}\n` +
              `Active Alarms: ${totalAlarms}\n` +
              `History Entries: ${totalHistoryEntries}\n` +
              `Today's Entries: ${todayHistory}`,
              [{ text: 'OK' }]
            );
          }}
        />
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
  content: {
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 18,
    color: '#666666',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
});

