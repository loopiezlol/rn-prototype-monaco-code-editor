import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { darkThemeExtensions, lightThemeExtensions } from "./theme";
import {
  autocompletion,
  completionKeymap,
  completeFromList,
  completeAnyWord,
} from "@codemirror/autocomplete";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { bracketMatching } from "@codemirror/matchbrackets";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import {
  keymap,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
} from "@codemirror/view";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { indentOnInput } from "@codemirror/language";
import { defaultHighlightStyle } from "@codemirror/highlight";

if (!window.ReactNativeWebView) {
  console.log("window.ReactNativeWebView missing, will mock instead");
  window.ReactNativeWebView = {
    postMessage: console.log,
  };
}

const consoleLog = (type, log) =>
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ event: "console", data: { type: type, log: log } })
  );
console = {
  log: (log) => consoleLog("log", log),
  debug: (log) => consoleLog("debug", log),
  info: (log) => consoleLog("info", log),
  warn: (log) => consoleLog("warn", log),
  error: (log) => consoleLog("error", log),
};

console.log("ooooo");

// TODOS:
// - extracting theme
// - QoL: propagate errors to RN logs, capture with bugsnag
// - nice to have: brackets utility in accessory toolbar

// issues to look out for when building the editor:
// on ios mobile safari, pressing enter spits out 2 new lines
// on android mobile (through webview only) sometimes the BACKSPACE key doesn't work
// on android mobile typing "array.forEach" may duplciate the text -> seems to happen with custom syntax highlighting if placed the last

let languages = new Compartment();
let themes = new Compartment();

let jsKeywords =
  "break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import interface in instanceof let new package private protected public return static super switch this throw true try typeof var void while with yield";
let pyKeywords =
  "False def if raise None del import return True elif in try and else is while as except lambda with assert finally nonlocal yield break for not class from or continue global pass";

const mapKeywordString = (kString) =>
  kString.split(" ").map((kw) => ({
    label: kw,
    type: "keyword",
  }));
const jsCompletion = completeFromList(mapKeywordString(jsKeywords));
const pyCompletion = completeFromList(mapKeywordString(pyKeywords));

const initialState = EditorState.create({
  doc: `/* eslint-disable import/no-unresolved */
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
}`,
  extensions: [
    EditorView.updateListener.of((v) => {
      const { doc } = v.state;
      if (v.docChanged) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ event: "code-change", data: doc.toString() })
        );
      }
    }),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    defaultHighlightStyle.fallback,
    themes.of(darkThemeExtensions),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...completionKeymap,
    ]),
    languages.of(javascript()),
    EditorView.lineWrapping,
    EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }]), // adds words from the editor as completions
    javascriptLanguage.data.of({
      autocomplete: jsCompletion,
    }),
    pythonLanguage.data.of({
      autocomplete: pyCompletion,
    }),
  ],
});

const view = new EditorView({
  parent: document.getElementById("editor"),
  state: initialState,
});

window.view = view;

window.replaceCode = (code) => {
  window.view.dispatch({
    changes: {
      from: 0,
      to: window.view.state.doc.toString().length,
      insert: code || "",
    },
  });
  view.dispatch({ selection: { anchor: view.state.doc.length } });
};

const languageExtensionsMap = {
  javascript: javascript,
  python: python,
};

window.replaceLanguage = (language) => {
  const languageExtension = languageExtensionsMap[language];

  if (languageExtension) {
    view.dispatch({
      effects: languages.reconfigure(languageExtension()),
    });
  } else {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ event: "invalid-language", data: language })
    );
  }
};

window.replaceTheme = (theme) => {
  if (theme === "light") {
    view.dispatch({
      effects: themes.reconfigure(lightThemeExtensions),
    });
  } else if (theme === "dark") {
    view.dispatch({
      effects: themes.reconfigure(darkThemeExtensions),
    });
  } else {
    window?.ReactNativeWebView.postMessage(
      JSON.stringify({ event: "invalid-language", data: language })
    );
  }
};

window.simulateKeyPress = (key = "Enter") => {
  const element = document.querySelector(".cm-content");
  element.dispatchEvent(new KeyboardEvent("keydown", { key }));
  element.dispatchEvent(new KeyboardEvent("keyup", { key }));
};

// this is magic, don't touch
// fixes all problems identified with the editor's webview not syncing with the updates from react native
// e.g. closing the keyboard on Android wouldn't update the editor's view, leaving half a screen blank
window.onresize = (x) => {
  const element = document.querySelector(".cm-activeLine");
  element.scrollIntoViewIfNeeded(false); // false here makes the scroll stop once the element is visible, compared to centering it into the viewport
};
