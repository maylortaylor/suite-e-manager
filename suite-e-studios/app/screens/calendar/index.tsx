import { ActivityIndicator, FlatList, Linking, Platform, Text } from 'react-native';
import {
  CalendarContainer,
  CalendarEventCard,
  CalendarEventChip,
  CalendarEventChipText,
  CalendarEventDetail,
  CalendarEventLabel,
  CalendarEventTitle,
  CalendarEventWrapper,
  CalendarMonthDividerContainer,
  CalendarMonthDividerLine,
  CalendarMonthDividerText,
  Divider,
  Divider as ThemedDivider,
} from '@/app/components/ui/styled.components';
import React, { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { getApp } from 'firebase/app';
import { useTheme } from "styled-components/native";

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

// Helper to strip HTML tags from a string
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

// Accent chip for event visibility
const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <CalendarEventChip color={color}>
    <CalendarEventChipText>{label}</CalendarEventChipText>
  </CalendarEventChip>
);

// Month divider
const MonthDivider: React.FC<{ month: string }> = ({ month }) => (
  <CalendarMonthDividerContainer>
    <CalendarMonthDividerLine />
    <CalendarMonthDividerText>{month}</CalendarMonthDividerText>
    <CalendarMonthDividerLine />
  </CalendarMonthDividerContainer>
);

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

  // Helper to get month label (e.g., July 2024)
  function getMonthLabel(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  // Prepare data with month dividers
  let lastMonth = '';
  const dataWithDividers: any[] = [];
  events.forEach((event) => {
    const eventDate = event.start?.dateTime || event.start?.date;
    const monthLabel = getMonthLabel(eventDate);
    if (monthLabel !== lastMonth) {
      dataWithDividers.push({ type: 'divider', month: monthLabel, id: `divider-${monthLabel}` });
      lastMonth = monthLabel;
    }
    dataWithDividers.push({ ...event, type: 'event' });
  });

  return (
    <CalendarContainer>
      {loading && <ActivityIndicator size="large" color="#888" />}
      {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={dataWithDividers}
          keyExtractor={item => item.id || item.month}
          renderItem={({ item }) => {
            if (item.type === 'divider') {
              return <MonthDivider month={item.month} />;
            }
            const eventColor = getEventColor(theme, item);
            return (
              <CalendarEventWrapper>
                <CalendarEventCard style={{ backgroundColor: eventColor }}>
                  <Chip label={item.visibility?.charAt(0).toUpperCase() + item.visibility?.slice(1)} color={theme.colors.accent} />
                  <CalendarEventTitle>{item.summary || 'No Title'}</CalendarEventTitle>
                  <Divider
                    orientation="horizontal"
                    thickness={1}
                    marginVertical={20}
                    marginHorizontal={0}
                    color={theme.colors.text}
                  />
                  <CalendarEventDetail>
                    <CalendarEventLabel>Time: </CalendarEventLabel>{formatEventTime(item.start)}
                  </CalendarEventDetail>
                  {item.location && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Location: </CalendarEventLabel>{item.location}
                    </CalendarEventDetail>
                  )}
                  {item.description && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Description: </CalendarEventLabel>{stripHtml(item.description)}
                    </CalendarEventDetail>
                  )}
                  {item.organizer && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Organizer: </CalendarEventLabel>{item.organizer.email || item.organizer.displayName}
                    </CalendarEventDetail>
                  )}
                  {item.status && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Status: </CalendarEventLabel>{item.status}
                    </CalendarEventDetail>
                  )}
                  {item.attendees && item.attendees.length > 0 && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Attendees: </CalendarEventLabel>{item.attendees.map((a: any) => a.email || a.displayName).join(', ')}
                    </CalendarEventDetail>
                  )}
                  {item.htmlLink && (
                    <CalendarEventDetail>
                      <CalendarEventLabel>Google Calendar: </CalendarEventLabel>
                      <Text
                        style={{ color: theme.colors.accent, textDecorationLine: 'underline' }}
                        accessibilityRole="link"
                        onPress={() => {
                          if (Platform.OS === 'web') {
                            window.open(item.htmlLink, '_blank', 'noopener');
                          } else {
                            Linking.openURL(item.htmlLink);
                          }
                        }}
                      >
                        GOOGLE CALENDAR LINK
                      </Text>
                    </CalendarEventDetail>
                  )}
                </CalendarEventCard>
              </CalendarEventWrapper>
            );
          }}
          ListEmptyComponent={<Text>No events found.</Text>}
        />
      )}
    </CalendarContainer>
  );
};

export default CalendarScreen; 