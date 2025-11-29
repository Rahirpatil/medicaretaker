import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [checklist, setChecklist] = useState({});
  const [history, setHistory] = useState([]);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    saveData();
  }, [medicines, alarms, checklist, history]);

  const loadData = async () => {
    try {
      const savedMedicines = await AsyncStorage.getItem('medicines');
      const savedAlarms = await AsyncStorage.getItem('alarms');
      const savedChecklist = await AsyncStorage.getItem('checklist');
      const savedHistory = await AsyncStorage.getItem('history');

      if (savedMedicines) setMedicines(JSON.parse(savedMedicines));
      if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
      if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('medicines', JSON.stringify(medicines));
      await AsyncStorage.setItem('alarms', JSON.stringify(alarms));
      await AsyncStorage.setItem('checklist', JSON.stringify(checklist));
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addMedicine = (medicine) => {
    const newMedicine = {
      id: Date.now().toString(),
      ...medicine,
      createdAt: new Date().toISOString(),
    };
    setMedicines([...medicines, newMedicine]);
    return newMedicine;
  };

  const updateMedicine = (id, updates) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMedicine = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
    setAlarms(alarms.filter(a => a.medicineId !== id));
  };

  const addAlarm = (alarm) => {
    const newAlarm = {
      id: Date.now().toString(),
      ...alarm,
      createdAt: new Date().toISOString(),
    };
    setAlarms([...alarms, newAlarm]);
    return newAlarm;
  };

  const updateAlarm = (id, updates) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const updateChecklist = (date, medicineId, taken) => {
    const dateKey = date.toISOString().split('T')[0];
    setChecklist({
      ...checklist,
      [dateKey]: {
        ...checklist[dateKey],
        [medicineId]: taken,
      },
    });

    // Add to history
    const historyEntry = {
      id: Date.now().toString(),
      medicineId,
      date: dateKey,
      taken,
      timestamp: new Date().toISOString(),
    };
    setHistory([historyEntry, ...history]);
  };

  const getHistoryForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return history.filter(h => h.date === dateKey);
  };

  return (
    <AppContext.Provider
      value={{
        medicines,
        alarms,
        checklist,
        history,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        updateChecklist,
        getHistoryForDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


