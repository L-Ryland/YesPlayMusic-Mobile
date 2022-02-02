import { StyleSheet } from "react-native";

import { View, Text, Cover } from "./";

export default function CoverRow() {
  return (
    <View style={styles.coverRow}>
      {
        items.map((item:any)=>{
          <>
          <Cover imageUrl={getImageUrl(item)} type={type} />
          <Text>
            {showPlayCount?item.playCount:''}
            {isExplicit(item)?'Explicit Symbol Here':''}
            {isPrivacy(item)?'Lock Symbol Here':''}
            // Link to getTitleLink(item) Here
            </Text>
          </>
        })
      }
    </View>
  );
}

const items:[] = []
const getImageUrl = (param:string) => {};
const isExplicit = (param: string) => {return param}
const isPrivacy = (param: string) => {return param}
const type:string = ''
const showPlayCount = true;

const styles = StyleSheet.create({
  coverRow: {
    display: 'flex',
  }
})
