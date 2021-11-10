import { EditorView } from "@codemirror/basic-setup";
import { HighlightStyle, tags } from "@codemirror/highlight";

export const lightTheme = EditorView.theme({
  "&": {
    fontSize: "12pt",
  },
  ".cm-content": {
    fontFamily: "Source Code Pro",
  },
  ".cm-lineWrapping": {
    wordBreak: "break-all",
  },
});

const darkColors = {
  enki: {
    background: "#242a36", // enki's dark.cardBackground
    primary: "#95FFCD", // dark.accent
    text: "#f8f8f8", // enki text
    textSecondary: "#f8f8f880",
  },
  oneDark: {
    highlightBackground: "#202530", // dark.codeBackground
    selection: "#547370", // "#3E4451" combined with the accent color #95FFCD twice
    selectionMatch: "#aafe661a", // original theme
    stone: "#7d8799", // from original theme
    violet: "#c678dd",
    coral: "#e06c75",
    cyan: "#56b6c2",
    malibu: "#61afef",
    whiskey: "#d19a66",
    sage: "#98c379",
    chalky: "#e5c07b",
    invalid: "#ffffff",
    ivory: "#abb2bf",
  },
};

/// The editor theme styles for One Dark.
export const darkTheme = EditorView.theme(
  {
    "&": {
      color: darkColors.oneDark.ivory,
      backgroundColor: darkColors.enki.background,
      fontSize: "12pt",
    },
    ".cm-lineWrapping": {
      wordBreak: "break-all",
    },
    ".cm-content": {
      caretColor: darkColors.enki.primary,
      fontFamily: "Source Code Pro",
    },
    "&.cm-focused .cm-cursor": { borderLeftColor: darkColors.enki.primary },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: darkColors.oneDark.selection },

    // we don't use panels, but this is the working API
    // https://codemirror.net/6/examples/panel/
    // ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    // ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    // ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    // we don't use searching either
    // ".cm-searchMatch": {
    //   backgroundColor: "#72a1ff59",
    //   outline: "1px solid #457dff",
    // },
    // ".cm-searchMatch.cm-searchMatch-selected": {
    //   backgroundColor: "#6199ff2f",
    // },

    ".cm-activeLine": {
      backgroundColor: darkColors.oneDark.highlightBackground,
    },
    ".cm-selectionMatch": {
      backgroundColor: darkColors.oneDark.selectionMatch,
    },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: darkColors.oneDark.selectionMatch,
      outline: `1px solid ${darkColors.enki.primary}`,
    },

    ".cm-gutters": {
      backgroundColor: darkColors.enki.background,
      color: darkColors.oneDark.stone,
      border: "none",
    },

    ".cm-activeLineGutter": {
      backgroundColor: darkColors.oneDark.highlightBackground,
    },

    // we don't use folding
    // ".cm-foldPlaceholder": {
    //   backgroundColor: "transparent",
    //   border: "none",
    //   color: "#ddd",
    // },

    // autocompletions
    ".cm-tooltip": {
      border: "1px solid #181a1f",
      backgroundColor: darkColors.enki.background,
    },
    ".cm-tooltip.cm-tooltip-arrow:before": {
      borderTopColor: darkColors.enki.background,
      borderBottomColor: darkColors.enki.background,
    },
    ".cm-tooltip.cm-tooltip-arrow:after": {
      borderTopColor: darkColors.enki.background,
      borderBottomColor: darkColors.enki.background,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li": {
        color: darkColors.enki.textSecondary,
      },
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        background: darkColors.oneDark.selectionMatch,
        color: darkColors.enki.text,
      },
    },
  },
  { dark: true }
);

export const darkHighlighting = HighlightStyle.define([
  { tag: tags.keyword, color: darkColors.oneDark.violet },
  {
    tag: tags.link,
    textDecoration: "underline",
    color: darkColors.oneDark.stone,
  }, // updated
  {
    tag: tags.heading,
    textDecoration: "underline",
    fontWeight: "bold",
    color: darkColors.oneDark.coral,
  },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.strikethrough, textDecoration: "line-through" },

  {
    tag: [
      tags.atom,
      tags.bool,
      tags.url,
      tags.contentSeparator,
      tags.labelName,
    ],
    color: darkColors.oneDark.cyan,
  },
  { tag: [tags.deleted], color: darkColors.oneDark.coral },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: darkColors.oneDark.sage,
  },
  {
    tag: [tags.regexp, tags.escape, tags.special(tags.string)],
    color: darkColors.oneDark.cyan,
  },
  {
    tag: tags.definition(tags.variableName),
    color: darkColors.oneDark.whiskey,
  },
  { tag: tags.local(tags.variableName), color: darkColors.oneDark.whiskey },

  { tag: [tags.typeName, tags.namespace], color: darkColors.oneDark.chalky },
  { tag: tags.className, color: darkColors.oneDark.chalky },
  {
    tag: [tags.special(tags.variableName), tags.macroName],
    color: darkColors.oneDark.whiskey,
  },
  { tag: tags.definition(tags.propertyName), color: darkColors.oneDark.coral },
  { tag: tags.comment, color: darkColors.oneDark.stone },
  { tag: tags.meta, color: darkColors.oneDark.stone },
  { tag: tags.invalid, color: darkColors.oneDark.invalid },
  {
    tag: [tags.function(tags.variableName), tags.labelName, tags.propertyName],
    color: darkColors.oneDark.malibu,
  },
  {
    tag: [tags.propertyName],
    color: darkColors.oneDark.malibu,
  },
  // {
  //   tag: [tags.name], // don't use this. breaks android on mobile when typing x.forEach (javascript)
  //   color: darkColors.whiskey,
  // },
  {
    tag: [tags.operator],
    color: darkColors.oneDark.sage,
  },
]);

// original white theme
export const lightHighlighting = HighlightStyle.define([
  { tag: tags.link, textDecoration: "underline" },
  { tag: tags.heading, textDecoration: "underline", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.keyword, color: "#708" },
  {
    tag: [
      tags.atom,
      tags.bool,
      tags.url,
      tags.contentSeparator,
      tags.labelName,
    ],
    color: "#219",
  },
  { tag: [tags.literal, tags.inserted], color: "#164" },
  { tag: [tags.string, tags.deleted], color: "#a11" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: "#e40" },
  { tag: tags.definition(tags.variableName), color: "#00f" },
  { tag: tags.local(tags.variableName), color: "#30a" },
  { tag: [tags.typeName, tags.namespace], color: "#085" },
  { tag: tags.className, color: "#167" },
  { tag: [tags.special(tags.variableName), tags.macroName], color: "#256" },
  { tag: tags.definition(tags.propertyName), color: "#00c" },
  { tag: tags.comment, color: "#940" },
  { tag: tags.meta, color: "#7a757a" },
  { tag: tags.invalid, color: "#f00" },
]);

export const darkThemeExtensions = [darkTheme, darkHighlighting];

export const lightThemeExtensions = [lightTheme, lightHighlighting];
