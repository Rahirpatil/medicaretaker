import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const MedicineListScreen = ({ navigation }) => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    instructions: '',
  });

  const handleMenuPress = () => {
    Alert.alert(
      'Menu',
      'Choose an option',
      [
        { text: 'Dashboard', onPress: () => navigation.navigate('PatientDashboard') },
        { text: 'Checklist', onPress: () => navigation.navigate('Checklist') },
        { text: 'Alarms', onPress: () => navigation.navigate('Alarms') },
        { text: 'History', onPress: () => navigation.navigate('History') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAdd = () => {
    setFormData({ name: '', dosage: '', instructions: '' });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage || '',
      instructions: medicine.instructions || '',
    });
    setEditingId(medicine.id);
    setShowAddForm(true);
  };

  const handleDelete = (medicine) => {
    Alert.alert(
      'Delete Medicine',
      `Are you sure you want to delete ${medicine.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMedicine(medicine.id),
        },
      ]
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a medicine name');
      return;
    }

    if (editingId) {
      updateMedicine(editingId, formData);
    } else {
      addMedicine(formData);
    }

    setShowAddForm(false);
    setFormData({ name: '', dosage: '', instructions: '' });
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ name: '', dosage: '', instructions: '' });
    setEditingId(null);
  };

  const renderMedicine = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        {item.dosage && <Text style={styles.medicineDetails}>Dosage: {item.dosage}</Text>}
        {item.instructions && (
          <Text style={styles.medicineDetails}>Instructions: {item.instructions}</Text>
        )}
      </View>
      <View style={styles.medicineActions}>
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

  return (
    <View style={styles.container}>
      <Header
        title="Medicine List"
        onBack={() => navigation.goBack()}
        onMenuPress={handleMenuPress}
      />
      <ScrollView style={styles.scrollView}>
        {showAddForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingId ? 'Edit Medicine' : 'Add New Medicine'}
            </Text>
            <Input
              label="Medicine Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Aspirin"
            />
            <Input
              label="Dosage"
              value={formData.dosage}
              onChangeText={(text) => setFormData({ ...formData, dosage: text })}
              placeholder="e.g., 100mg"
            />
            <Input
              label="Instructions"
              value={formData.instructions}
              onChangeText={(text) => setFormData({ ...formData, instructions: text })}
              placeholder="e.g., Take with food"
              multiline
            />
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
                title="Add Medicine"
                onPress={handleAdd}
                style={styles.addButton}
              />
            </View>
            {medicines.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="medical-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyText}>No medicines added yet</Text>
                <Text style={styles.emptySubtext}>Tap "Add Medicine" to get started</Text>
              </View>
            ) : (
              <FlatList
                data={medicines}
                renderItem={renderMedicine}
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
  medicineCard: {
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
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  medicineDetails: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  medicineActions: {
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
});


