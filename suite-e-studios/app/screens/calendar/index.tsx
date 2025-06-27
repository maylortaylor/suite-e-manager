import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTheme } from "styled-components/native";
import { CalendarContainer } from '@/app/components/ui/styled.components';
import { getApp } from 'firebase/app';

// Helper to format date/time
function formatEventTime(start: any) {
  if (start?.dateTime) {
    const date = new Date(start.dateTime);
    return date.toLocaleString(undefined, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).replace(',', ' -');
  } else if (start?.date) {
    const date = new Date(start.date);
    return date.toLocaleDateString(undefined, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }
  return '';
}

// Helper to get event color
function getEventColor(theme: any, event: any) {
  // You can adjust this logic based on your event data structure
  // Try to use event.visibility or event.summary to determine type

  switch (event.visibility) {
    case 'private':
      return '#FFE066'; // banana
    case 'planning':
      return '#FF7043'; // red-orange
    case 'public':
    default:
      return '#FFA726'; // tangerine
  }
}

const CalendarScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const functions = getFunctions(getApp(), 'us-central1');
        const getCalendarEvents = httpsCallable(functions, 'getCalendarEvents');
        const result: any = await getCalendarEvents();
        setEvents(result.data.events || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <CalendarContainer>
      {loading && <ActivityIndicator size="large" color="#888" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.eventItem, { backgroundColor: getEventColor(theme, item) }]}>
              <Text style={styles.eventTitle}>{item.summary || 'No Title'}</Text>
              <Text style={styles.eventTime}>{formatEventTime(item.start)}</Text>
              {item.location && <Text style={styles.eventLocation}>{item.location}</Text>}
            </View>
          )}
          ListEmptyComponent={<Text>No events found.</Text>}
        />
      )}
    </CalendarContainer>
  );
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 16,
  },
  eventItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    width: '100%',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#373A40',
  },
  eventLocation: {
    fontSize: 14,
    color: '#373A40',
  },
});

export default CalendarScreen; 