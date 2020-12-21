import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  Alert
} from "react-native";
import { WebView } from "react-native-webview";

// const myHtmlFile = require("./ios/assets/editor2.html");

// export const InjectedMessageHandler = `
//   if (ReactNativeWebView) {
//     ReactNativeWebView.onMessage = function (message) {
//       const action = JSON.parse(message);

//       if (action.type === 'extract') {
//         window.editor.getValue();
//       }
//     }
//    }
//   `;

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  const changeEditorCodeJS = () => {
    this.webviewBridge.injectJavaScript(`
      window.editor.getModel().setValue('const x = 2');
      window.monaco.editor.setModelLanguage(window.editor.getModel(), 'javascript');
      true;
    `);
  };

  const changeEditorCodePython = () => {
    this.webviewBridge.injectJavaScript(`
      window.editor.getModel().setValue('x = 2');
      window.monaco.editor.setModelLanguage(window.editor.getModel(), 'python');
      true;
    `);
  };

  const extractCode = () => {
    this.webviewBridge.injectJavaScript(`
      window.extractCode()
      true;
    `);
  };

  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: "row" }}>
        <Button onPress={changeEditorCodeJS} title="js code" />
        <Button onPress={changeEditorCodePython} title="python code" />
        <Button onPress={extractCode} title="extract code" />
      </View>
      <View
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          zIndex: 2,
        }}
      >
        {isLoading && <ActivityIndicator size="large" />}
      </View>
      <WebView
        originWhitelist={["*", "file://"]}
        ref={(r) => {
          this.webviewBridge = r;
        }}
        source={{
          uri: "./assets/editor2.html",
          baseUrl: "./assets/monaco-editor",
        }}
        onLoad={() => setIsLoading(false)}
        scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        onMessage={(event) => {
          console.log(JSON.parse(event.nativeEvent.data).value);
          Alert.alert('code extracted', JSON.parse(event.nativeEvent.data).value)
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    paddingVertical: "10%",
    paddingHorizontal: "2%",
    justifyContent: "center",
  },
});
