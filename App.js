import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  Alert,
  SafeAreaView,
  Platform,
  Keyboard,
  InputAccessoryView,
} from "react-native";
import { WebView } from "react-native-webview";
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
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
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView
        // contentContainerStyle={{ flex: 1 }}
        enabled
        behavior={Platform.select({ ios: "padding", android: null })}
        style={{ flexGrow: 1 }}
      >
        <WebView
          style={{ margin: 0, padding: 0 }}
          originWhitelist={["*", "file://"]}
          ref={(r) => {
            this.webviewBridge = r;
          }}
          source={{
            uri: "./assets/editor/index.html",
            baseUrl: "./assets/editor/",
          }}
          onLoad={() => setIsLoading(false)}
          scrollEnabled={false}
          onMessage={(event) => {
            console.log(JSON.parse(event.nativeEvent.data).value);
            Alert.alert(
              "code extracted",
              JSON.parse(event.nativeEvent.data).value
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
});
