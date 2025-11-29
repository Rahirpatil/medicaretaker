import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { PatientDashboard } from '../screens/PatientDashboard';
import { CaretakerDashboard } from '../screens/CaretakerDashboard';
import { MedicineListScreen } from '../screens/MedicineListScreen';
import { ChecklistScreen } from '../screens/ChecklistScreen';
import { AlarmsScreen } from '../screens/AlarmsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  const isPatient = user?.roles?.includes('patient');
  const isCaretaker = user?.roles?.includes('caretaker');

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {isPatient && (
              <>
                <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
                <Stack.Screen name="MedicineList" component={MedicineListScreen} />
                <Stack.Screen name="Checklist" component={ChecklistScreen} />
                <Stack.Screen name="Alarms" component={AlarmsScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
              </>
            )}
            {isCaretaker && !isPatient && (
              <>
                <Stack.Screen name="CaretakerDashboard" component={CaretakerDashboard} />
                <Stack.Screen name="History" component={HistoryScreen} />
              </>
            )}
            {isCaretaker && isPatient && (
              <>
                <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
                <Stack.Screen name="CaretakerDashboard" component={CaretakerDashboard} />
                <Stack.Screen name="MedicineList" component={MedicineListScreen} />
                <Stack.Screen name="Checklist" component={ChecklistScreen} />
                <Stack.Screen name="Alarms" component={AlarmsScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

