import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setRiskPercentage, setLoading, setError } from '../../redux/slices/alzheimerSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
 
import Header from '../../components/common/Header';
import BackButton from '../../components/common/BackButton';
import AlzheimerResult from '../../components/Alzheimer/AlzheimerResult';
import RiskIndicator from '../../components/Alzheimer/RiskIndicator';
import AlzheimerModelService from '../../api/alzheimerModelService';
 
const AlzheimerTestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { riskPercentage, isLoading, error } = useSelector((state) => state.alzheimer);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [features, setFeatures] = useState(null);
 
  // State for MRI-derived structural features
  const [hippocampusVolume, setHippocampusVolume] = useState('');
  const [corticalThickness, setCorticalThickness] = useState('');
  const [ventricleVolume, setVentricleVolume] = useState('');
  const [whiteMatters, setWhiteMatters] = useState('');
 
  // State for functional and molecular biomarkers
  const [brainGlucose, setBrainGlucose] = useState('');
  const [amyloidDeposition, setAmyloidDeposition] = useState('');
  const [tauProteinLevel, setTauProteinLevel] = useState('');
 
  const validateInputs = () => {
    if (!hippocampusVolume || !corticalThickness || !ventricleVolume ||
        !whiteMatters || !brainGlucose || !amyloidDeposition ||
        !tauProteinLevel) {
      Alert.alert('Missing Data', 'Please fill in all required fields to get an accurate assessment.');
      return false;
    }
    return true;
  };
  const handleUploadReports = async () => {
      try {
        // Implement file picker logic here if needed
        Alert.alert('Info', 'File upload not implemented in this demo.');
      } catch (err) {
        Alert.alert('Error', 'Failed to upload file.');
      }
    };
  
 
  const handleShowResult = async () => {
    // Validate inputs before processing
    if (!validateInputs()) return;
   
    try {
      // Show loading indicator
      dispatch(setLoading(true));
      setShowResult(true);
     
      // Create features object with only the required inputs
      const manualFeatures = {
        hippocampus_volume: parseFloat(hippocampusVolume),
        cortical_thickness: parseFloat(corticalThickness),
        ventricle_volume: parseFloat(ventricleVolume),
        white_matter_hyperintensities: parseFloat(whiteMatters),
        brain_glucose_metabolism: parseFloat(brainGlucose),
        amyloid_deposition: parseFloat(amyloidDeposition),
        tau_protein_level: parseFloat(tauProteinLevel)
      };
     
      // Get prediction from model
      const result = await AlzheimerModelService.predictRisk(manualFeatures);
     
      // Update state with prediction result
      dispatch(setRiskPercentage(parseFloat(result.riskPercentage)));
      setPredictionResult(result);
      setFeatures(manualFeatures);
      dispatch(setError(null));
    } catch (error) {
      console.error('Error getting prediction:', error);
      dispatch(setError('Failed to get prediction from model. Please try again.'));
      Alert.alert('Error', 'Failed to get prediction from model');
    } finally {
      dispatch(setLoading(false));
    }
  };
 
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      
      {/* Navigation */}
      <View style={styles.navigationBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={20} color="#5856D6" />
                  <Text style={styles.backButtonText}>Alzheimer Test</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadReports}>
                  <Ionicons name="cloud-upload" size={16} color="#5856D6" />
                  {/* <Icon name="add" size={16} color="#5856D6" /> */}
                  <Text style={styles.uploadButtonText}>Upload Reports</Text>
                </TouchableOpacity>
              </View>
      
     
      {/* Test Results Form */}
      <View style={styles.formContainer}>
        {/* MRI-derived Structural Features */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>MRI-derived Structural Features :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Hippocampus Volume (cm³)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={hippocampusVolume}
              onChangeText={setHippocampusVolume}
              placeholder=""
            />
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Cortical Thickness (mm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={corticalThickness}
              onChangeText={setCorticalThickness}
              placeholder=""
            />
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Ventricle Volume (cm³)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={ventricleVolume}
              onChangeText={setVentricleVolume}
              placeholder=""
            />
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>White Matter Hyperintensities</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={whiteMatters}
              onChangeText={setWhiteMatters}
              placeholder=""
            />
          </View>
        </View>
       
        {/* Functional and Molecular Biomarkers */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Functional and Molecular Biomarkers :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Brain Glucose Metabolism (SUV)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={brainGlucose}
              onChangeText={setBrainGlucose}
              placeholder=""
            />
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Amyloid Deposition (SUVR)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amyloidDeposition}
              onChangeText={setAmyloidDeposition}
              placeholder=""
            />
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Tau Protein Level (SUVR)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tauProteinLevel}
              onChangeText={setTauProteinLevel}
              placeholder=""
            />
          </View>
        </View>
      </View>
     
      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleShowResult}>
        <Text style={styles.actionButtonText}>Calculate Risk</Text>
      </TouchableOpacity>
     
      {/* {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5856D6" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
     
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )} */}
     
      {showResult && !isLoading && predictionResult && (
  <>
    <View
      style={[
        styles.resultCard,
        {
          borderColor: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a',
          backgroundColor: predictionResult.riskPercentage > 50 ? '#fff1f0' : '#f6ffed',
        },
      ]}
    >
      <Text
        style={[
          styles.resultCardTitle,
          { color: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a' },
        ]}
      >
        {predictionResult.riskPercentage > 50
          ? `High Risk: ${predictionResult.riskPercentage}%`
          : `Safe:  ${predictionResult.riskPercentage}%`
          }
      </Text>
      <Text style={styles.resultCardText}>
        Risk Percentage: {predictionResult.riskPercentage}%
      </Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Risk Level:</Text>
        <Text style={[styles.detailValue, { color: predictionResult.riskPercentage > 50 ? '#ff4d4f' : '#52c41a' }]}>
          {predictionResult.riskPercentage > 50 ? 'High' : 'Low'}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Confidence:</Text>
        <Text style={styles.detailValue}>
          {(predictionResult.confidence * 100).toFixed(0)}%
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Assessment Date:</Text>
        <Text style={styles.detailValue}>
          {new Date().toLocaleDateString()}
        </Text>
      </View>
      {predictionResult.riskPercentage <= 50 && (
        <View style={styles.safeContainer}>
          <Text style={styles.safeText}>
            The patient is safe. No immediate action is required.
          </Text>
        </View>
      )}
      <Text style={styles.resultNote}>
        Note: This assessment is based on the provided MRI features and should be confirmed by a healthcare professional.
      </Text>
    </View>

    {predictionResult.riskPercentage > 50 && (
      <View style={styles.precautionsCard}>
        <Text style={styles.precautionsTitle}>Precautions:</Text>
        <Text style={styles.precautionsText}>• Regular cognitive assessments are recommended</Text>
        <Text style={styles.precautionsText}>• Consider lifestyle modifications to slow progression</Text>
        <Text style={styles.precautionsText}>• Consult with a neurologist for a comprehensive evaluation</Text>
      </View>
    )}
  </>
)}
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5856D6',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 14,
    color: '#333333',
  },
   navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //padding: 16,
    //backgroundColor: '#FFFFFF',
    top: 60,
    //bottom: 0,
  },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     marginLeft: 4,
//     color: '#5856D6',
//     fontSize: 16,
//   },
backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButtonText: {
    marginLeft: 4,
    color: '#5856D6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5856D6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 22,
  },
  uploadButtonText: {
    color: '#5856D6',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },


 formContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 20,
    marginTop: 80,
    //marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultLabel: {
    fontSize: 14,
     color: 'rgb(77, 79, 95)',
    flex: 1,
    fontWeight:600,
  },
  input: {
    flex: 1,
    maxWidth: 100,
    borderWidth: 1.2,
    borderColor: 'rgb(156, 151, 199)',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
    //color: 'rgb(199, 47, 47)',
  },
  actionButton: {
    backgroundColor: '#5856D6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 16,
    color: '#5856D6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  precautionsContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  precautionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  precautionsText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  safeContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#F5FFF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  safeText: {
    fontSize: 14,
    color: 'green',
  },
  resultNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
 
export default AlzheimerTestScreen;
