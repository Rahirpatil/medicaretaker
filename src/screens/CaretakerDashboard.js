import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

export const CaretakerDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleMenuPress = () => {
    const menuOptions = [
      { text: 'History', onPress: () => navigation.navigate('History') },
    ];

    // Add patient dashboard option if user has both roles
    if (user?.roles?.includes('patient')) {
      menuOptions.push({
        text: 'Patient Dashboard',
        onPress: () => navigation.navigate('PatientDashboard'),
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
        title="Caretaker Dashboard"
        onMenuPress={handleMenuPress}
        showBack={false}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome, Caretaker!</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <Card
          title="Patient History"
          subtitle="View patient's medicine history and status"
          icon={<Ionicons name="document-text" size={40} color="#007AFF" />}
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

