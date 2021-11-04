import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { lineNumbers, highlightActiveLineGutterr } from "@codemirror/gutter";
import { theme, highlighting } from "./theme";
import { autocompletion } from "@codemirror/autocomplete";
import { closeBrackets } from "@codemirror/closebrackets";
import { highlightSpecialChars } from "@codemirror/view";
import { bracketMatching } from "@codemirror/matchbrackets";

const initialCode = `import logger from '@teamenki/logger';
import omit from 'lodash.omit';
import crypto from 'crypto';
import { Forbidden403, NotFound404 } from '../common/error';
import * as notifier from '../common/notifier';
import { PLATFORMS } from '../common/in-app-purchases/constants';
import Receipt from '../models/iap-receipt';
import DeprecatedReceipt from '../models/receipt';
import WebhookPayload from '../models/iap-webhook-payload';
import User from '../models/user';
import * as ios from '../common/in-app-purchases/handlers/ios';
import * as analytics from '../common/in-app-purchases/analytics';
import { processSubscription } from '../common/in-app-purchases/handlers/helpers';
import { UPSELL_SOURCE } from '../api/v2/purchases/helpers/constants';

async function getUserAssociatedWithTransaction({
  productId,
  transactionId,
  environment,
}) {
  const [initialReceipt] = await Receipt.find({
    'platformData.ios.environment': environment,
    transactionId,
  })
    .sort('createdAt')
    .limit(1)
    .lean();
  if (initialReceipt) {
    const user = await User.findOne({ _id: initialReceipt.userId }).lean();
    return { user, foundInDeprecatedReceipts: false };
  }

  const [deprecatedInitialReceipt] = await DeprecatedReceipt.find({
    transactionId,
    productId,
  })
    .sort('purchaseDate')
    .limit(1)
    .lean();
  if (deprecatedInitialReceipt) {
    const user = await User.findOne({
      _id: deprecatedInitialReceipt.userId,
    }).lean();
    return {
      user,
      foundInDeprecatedReceipts: true,
    };
  }

  return { user: null, foundInDeprecatedReceipts: false };
}`;

const initialState = EditorState.create({
  doc: initialCode,
  extensions: [
    // basicSetup,
    // javascript(),
    lineNumbers(),
    highlightSpecialChars(),
    bracketMatching(),
    autocompletion(),
    closeBrackets(),
    EditorView.lineWrapping,
    // python(),
    javascript(),
    theme,
    highlighting,
  ],
});

const view = new EditorView({
  parent: document.getElementById("editor"),
  state: initialState,
});

window.view = view;
