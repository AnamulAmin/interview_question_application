import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    size: 'A4',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#000000',
  },
  workoutCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  exerciseCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    border: '1px solid #ddd',
    borderRadius: 5,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  exerciseName: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 4,
  },
  setsReps: {
    fontSize: 10,
    color: '#555555',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
});

const WorkoutPDF = ({ workoutRoutine }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{workoutRoutine.routineName}</Text>

      {workoutRoutine.workouts.map((dayData, dayIndex) => (
        <View key={dayIndex} style={styles.workoutCard}>
          <Text style={styles.dayTitle}>{dayData.dayName}</Text>

          {dayData.exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseCard}>
              <img style={styles.image} src={exercise.workout.photo}/>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.workout.name}</Text>
                <Text style={styles.instructions}>{exercise.workout.instructions}</Text>
                <Text style={styles.setsReps}>
                  Sets: {exercise.sets} | Reps: {exercise.reps.join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default WorkoutPDF;
