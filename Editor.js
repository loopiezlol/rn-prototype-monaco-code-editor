import React from "react";
import { WebView } from "react-native-webview";
import { Keyboard } from "react-native";

const EDITOR_INDEX_PATH =
  Platform.OS === "ios"
    ? "./assets/editor/index.html"
    : "file:///android_asset/editor/index.html";

const escapeStrings = (str) => str.replace(/'/g, "\\'").replace(/"/g, '\\"');

function Editor(
  { code, language, onCodeChange, theme = "dark", onLoadEnd, onKeyboardChange },
  ref
) {
  const editorRef = React.useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    simulateKeyPress: (key) => {
      editorRef?.current.injectJavaScript(`
        window.simulateKeyPress("${key}");
        true;
      `);
    },
    scrollToPosition: () => {
      editorRef?.current.injectJavaScript(`
        window.scrollToPosition();
        true;
      `);
    },
  }));

  React.useEffect(() => {
    if (isLoaded) {
      editorRef?.current.injectJavaScript(`
        window.replaceCode(\`${code}\`)
        true;
      `);
    }
  }, [code, isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      editorRef?.current.injectJavaScript(`
        window.replaceLanguage(\`${language}\`)
        true;
      `);
    }
  }, [language, isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      editorRef?.current.injectJavaScript(`
        window.replaceTheme(\`${theme}\`);
        true;
    `);
    }
  }, [theme, isLoaded]);

  const onEditorMesssage = (e) => {
    const { event, data } = JSON.parse(e.nativeEvent.data);
    console.log(event, data);
    if (event === "code-change" && onCodeChange) {
      onCodeChange(data);
    }
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  React.useEffect(() => {
    onKeyboardChange(isKeyboardVisible);
  }, [isKeyboardVisible]);

  const INJECTED_JAVASCRIPT = `(function() {
    window.initialSettings = { 
      code: \`${code}\`,
      language: \`${language}\`,
      theme: \`${theme}\`, 
    };
  })();
    true;
  `;

  return (
    <WebView
      style={{ margin: 0, padding: 0 }}
      originWhitelist={["*", "file://"]}
      ref={editorRef}
      source={{ uri: EDITOR_INDEX_PATH }}
      scrollEnabled={false}
      onLoadEnd={() => {
        setIsLoaded(true);
      }}
      onMessage={onEditorMesssage}
    />
  );
}

export default React.forwardRef(Editor);
