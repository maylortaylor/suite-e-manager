/** @format */

import * as Clipboard from "expo-clipboard";
import * as React from "react";

import { Alert, Button, ScrollView, View } from "react-native";
import {
  Container,
  Input,
  ItemBox,
  ItemLabel,
  Label,
} from "@/app/components/ui/styled.components";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapsible } from "../../components/ui/Collapsible";
import { IconSymbol } from "@/app/components/ui/IconSymbol";
import { TouchableOpacity } from "react-native";
import { useTheme } from "styled-components/native";

const globalChecklists = require("../../../global.checklists.json");

export function EditTasksScreen() {
  const [tasks, setTasks] = React.useState<any[]>(globalChecklists.tasks);
  const [saving, setSaving] = React.useState(false);
  const theme = useTheme();

  async function handleSave() {
    setSaving(true);
    try {
      const currentData = await AsyncStorage.getItem("global.checklists.json");
      const parsedData = currentData
        ? JSON.parse(currentData)
        : globalChecklists;
      await AsyncStorage.setItem(
        "global.checklists.json",
        JSON.stringify({ ...parsedData, tasks })
      );
      Alert.alert("Saved", "Tasks data saved to storage.");
    } catch (e) {
      Alert.alert("Error", "Failed to save data.");
    }
    setSaving(false);
  }

  function updateTask(index: number, key: string, value: string) {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [key]: value };
    setTasks(updated);
  }

  return (
    <ScrollView>
      <Label fontSize={32}>Tasks</Label>
      <Container>
        {tasks.map((t: any, i: number) => (
          <Collapsible key={t.id} title={t.description}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(t.id);
                  Alert.alert("Copied", "Task ID copied to clipboard");
                }}
                style={{ marginRight: 6 }}
              >
                <IconSymbol
                  name="doc.on.doc"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <ItemLabel fontSize={10} style={{ marginRight: 4 }}>Task ID:</ItemLabel>
              <ItemLabel fontSize={10}>{t.id}</ItemLabel>
            </View>
            <ItemBox>
              <ItemLabel>Description</ItemLabel>
              <Input
                value={t.description}
                onChangeText={(v: string) => updateTask(i, "description", v)}
              />
              <ItemLabel>Category</ItemLabel>
              <Input
                value={t.category}
                onChangeText={(v: string) => updateTask(i, "category", v)}
              />
              <ItemLabel>Role</ItemLabel>
              <Input
                value={t.role}
                onChangeText={(v: string) => updateTask(i, "role", v)}
              />
            </ItemBox>
          </Collapsible>
        ))}
        <Button
          title={saving ? "Saving..." : "Save All"}
          onPress={handleSave}
          disabled={saving}
        />
      </Container>
    </ScrollView>
  );
}
