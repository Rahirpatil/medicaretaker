import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const PatientDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleMenuPress = () => {
    const menuOptions = [
      { text: 'Medicine List', onPress: () => navigation.navigate('MedicineList') },
      { text: 'Checklist', onPress: () => navigation.navigate('Checklist') },
      { text: 'Alarms', onPress: () => navigation.navigate('Alarms') },
      { text: 'History', onPress: () => navigation.navigate('History') },
    ];

    // Add caretaker dashboard option if user has both roles
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

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        onMenuPress={handleMenuPress}
        showBack={false}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <Card
          title="Medicine List"
          subtitle="View and manage your medicines"
          icon={<Ionicons name="medical" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('MedicineList')}
        />

        <Card
          title="Checklist"
          subtitle="Track your weekly medicine intake"
          icon={<Ionicons name="checkbox" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('Checklist')}
        />

        <Card
          title="Alarms"
          subtitle="Set reminders for your medicines"
          icon={<Ionicons name="alarm" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('Alarms')}
        />

        <Card
          title="History"
          subtitle="View your medicine history"
          icon={<Ionicons name="time" size={40} color="#007AFF" />}
          onPress={() => navigation.navigate('History')}
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
});

