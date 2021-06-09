import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pageText: {
    fontSize: 18
  },

  textBox: {
    // marginHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    margin: 8,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 14
  },
  cardContainer: {
    paddingBottom: 10,
    paddingHorizontal: 10
  },

  buttonLabel: {
    fontSize: 16,
  },

  /**
   * Used for fat, screen-wide buttons.
   */
  fillButton: {
    height: 60,
  },

  headerTextButton: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },

  map: {
    ...StyleSheet.absoluteFillObject
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  }

})

export default styles