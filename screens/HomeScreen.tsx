import { StyleSheet, Appearance, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

import { Text, ScrollView, View, Title } from "@/components";
import { CoverRow, DailyTracksCard, FMCard, Tracker } from "@/components";
import { RootTabScreenProps } from "@/types";
import { byAppleMusic } from "@/utils/staticData";
import { useSnapshot } from "valtio";
import { MusicLang, settings } from "@/hydrate/settings";
import { useRecommendPlaylist, useToplist } from "@/hooks/usePlaylist";
import { useNewAlbums } from "@/hooks/useAlbum";
import { useTopArtists } from "@/hooks/useArtist";

const AppleMusic: React.FC = () => (
  <View>
    <Title>by Apple Music</Title>
    <CoverRow
      rowNumber={1}
      type="playlist"
      items={byAppleMusic}
      subText="by AppleMusic"
      imageSize={1024}
    />
  </View>
);
const RecommendPlaylists: React.FC = () => {
  const { data: recommendPlaylist, isLoading } = useRecommendPlaylist();
  return (
    <View>
      <Title>Recommended PlayLists</Title>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow
          rowNumber={2}
          type="playlist"
          items={recommendPlaylist?.result}
          subText="copywriter"
        />
      )}
    </View>
  );
};
const RecommendArtists: React.FC = () => {
  const { musicLanguage } = useSnapshot(settings);
  const { data: topArtists, isLoading } = useTopArtists({
    type: musicLanguage,
  });
  return (
    <View>
      <Text style={styles.title}>Recommended Artists</Text>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow rowNumber={1} type="artist" items={topArtists} />
      )}
    </View>
  );
};
const NewAlbums: React.FC = () => {
  const { data: newAlbums, isLoading } = useNewAlbums({
    limit: 10,
    area: "ALL",
  });
  return (
    <View>
      <Title>Latest Albums</Title>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow
          rowNumber={1}
          type="album"
          items={newAlbums?.albums}
          subText="artist"
        />
      )}
    </View>
  );
};
const Charts: React.FC = () => {
  const { data: toplist, isLoading } = useToplist();
  return (
    <View>
      <Title>Charts</Title>
      {isLoading ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow
          rowNumber={1}
          type="playlist"
          items={toplist?.list}
          subText="updateFrequency"
        />
      )}
    </View>
  );
};

export function HomeScreen(props: RootTabScreenProps<"Home">) {
  // const [recommendPlaylists, setRecommendPlaylists] = useState(undefined);
  // const [newAlbum, setNewAlbum] = useState(undefined);
  // const [topArtists, setTopArtists] = useState(undefined);
  // const [toplist, setToplist] = useState(undefinedartists);
  // const newAlbums = useNewAlbums({limit: 10, area: "ALL"}).data?.albums;
  // alert(`${JSON.parse(topArtists.data)}`);

  // console.log(recommendPlaylists, newAlbum);
  // console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AppleMusic />
        <RecommendPlaylists />
        <Title>For You</Title>
        <DailyTracksCard />
        <FMCard />
        <RecommendArtists/>
        <NewAlbums/>
        <Charts/>
      </ScrollView>
      <Tracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    fontSize: 40,
    fontWeight: "700",
  },
});
