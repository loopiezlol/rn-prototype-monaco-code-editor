import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Alert,
  Keyboard,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
  Button,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import Editor from "./Editor";

const JS_CODE = `/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import C from '@teamenki/common-constants';
import combs from '@nem035/combs';
import isEqual from 'lodash.isequal';
import difference from 'lodash.difference';
import { aspects as commonAspects } from '@teamenki/common-helpers';
import Topic from '../../../backend/app/models/topic';

const ASPECTS = Object.keys(commonAspects);

// This stat requires you to run two other stats
// to generate the starting data
// i.e. the wsa-graph-paths and wsa-sequences
export default async function compareWSAGraphAndSequences() {
  const graph = require('../wsa-graph-paths/wsa-graph.json');
  const sequences = require('../wsa-sequences/wsa-sequences.json');

  const topics = await Topic.find({
    availabilityStatus: C.TOPIC.STATUS.PUBLISHED,
    $or: [{ team: { $exists: false } }, { team: null }],
  }).lean();

  for (const { slug } of topics) {
    const { paths } = graph.find(({ topic }) => slug === topic);
    const { seqs } = sequences.find(({ topic }) => slug === topic);

    for (const comb of combs(ASPECTS)) {
      const { path } = paths.find(({ aspects }) =>
        isEqual(aspects.slice().sort(), comb.slice().sort())
      );
      const { seq } = seqs.find(({ aspects }) =>
        isEqual(aspects.slice().sort(), comb.slice().sort())
      );

      const equal = isEqual(
        seq.map(({ slug: s }) => s),
        path.map(({ slug: s }) => s)
      );

      if (!equal) {
        console.log(
          "a"
        );
      }
    }
  }

  process.exit(0);
}`;

export default function App() {
  const editorRef = React.useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  const [code, setCode] = React.useState(`def n():
  x = 2;
  `);
  const [language, setLanguage] = React.useState("python");
  const [theme, setTheme] = React.useState("dark");

  const loadJS = () => {
    setCode(JS_CODE);
    setLanguage("javascript");
  };

  const loadPython = () => {
    setCode("x = [i for i in range(10)]");
    setLanguage("python");
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleKeyPress = (key) => {
    editorRef?.current.simulateKeyPress(key);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: null })}
        style={{ flexGrow: 1 }}
      >
        <View style={[styles.bar]}>
          <Button title="Load JavaScript" onPress={loadJS} />
          <Button title="Load Python" onPress={loadPython} />
          <Button title="flip theme" onPress={toggleTheme} />
        </View>
        <Editor
          code={code}
          language={language}
          theme={theme}
          ref={editorRef}
          onKeyboardChange={setKeyboardVisible}
        />
        {isKeyboardVisible && (
          <View style={[styles.bar, { margin: 10 }]}>
            <TouchableOpacity onPress={() => handleKeyPress("Enter")}>
              <Text>ENTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleKeyPress("Tab")}>
              <Text>TAB</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleKeyPress("ArrowRight")}>
              <Text>&#8594;</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleKeyPress("ArrowLeft")}>
              <Text>&#8592;</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleKeyPress("ArrowUp")}>
              <Text>&#8593;</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleKeyPress("ArrowDown")}>
              <Text>&#8595;</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  bar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 5,
  },
});
