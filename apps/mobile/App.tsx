import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

type KegStatus = "IN_STOCK" | "IN_USE" | "CLEANING" | "RETURN_DUE";

type Keg = {
  id: string;
  beerName: string;
  capacityL: number;
  status: KegStatus;
};

const initialKegs: Keg[] = [
  { id: "KEG-1001", beerName: "Pale Ale", capacityL: 20, status: "IN_STOCK" },
  { id: "KEG-1002", beerName: "Lager", capacityL: 30, status: "IN_USE" }
];

export default function App() {
  const [kegs, setKegs] = useState<Keg[]>(initialKegs);
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(
    () => kegs.filter((k) => [k.id, k.beerName, k.status].join(" ").toLowerCase().includes(keyword.toLowerCase())),
    [kegs, keyword]
  );

  const cycleStatus = (id: string) => {
    setKegs((current) =>
      current.map((k) => {
        if (k.id !== id) return k;
        const nextStatus: Record<KegStatus, KegStatus> = {
          IN_STOCK: "IN_USE",
          IN_USE: "CLEANING",
          CLEANING: "RETURN_DUE",
          RETURN_DUE: "IN_STOCK"
        };
        return { ...k, status: nextStatus[k.status] };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>🍺 樽管理モバイル</Text>
        <TextInput
          placeholder="樽ID/ビール名で検索"
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => cycleStatus(item.id)}>
              <Text style={styles.id}>{item.id}</Text>
              <Text>{item.beerName}</Text>
              <Text>{item.capacityL}L</Text>
              <Text style={styles.status}>{item.status}</Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  input: {
    borderColor: "#ccd5df",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "white"
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 4
  },
  id: { fontWeight: "700" },
  status: { color: "#146c43", fontWeight: "600" }
});
