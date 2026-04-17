import type { Edit, SgNode, Transform } from "codemod:ast-grep";
import type Python from "codemod:ast-grep/langs/python";

/**
 * Deterministic web3.py v6 → v7 edits (JSSG).
 * Each rule is backed by fixtures under `tests/<case>/`.
 *
 * RPC kwarg snake_case:
 * https://web3py.readthedocs.io/en/stable/migration.html#remaining-camelcase-snake-case-updates
 * Skip `dict(fromBlock=..., ...)` — those kwargs become JSON-RPC dict keys and stay camelCase.
 *
 * Class-based middleware:
 * https://web3py.readthedocs.io/en/stable/migration.html#class-based-middleware-model
 * https://web3py.readthedocs.io/en/stable/migration.html#middleware-renaming-and-removals
 */

const RPC_CAMEL_KWARGS_TO_SNAKE: Record<string, string> = {
  fromBlock: "from_block",
  toBlock: "to_block",
  blockHash: "block_hash",
};

/**
 * v6 function-style middleware passed as **bare first arg** to onion add/inject → v7 `ClassName()`.
 * **Excluded:** `geth_poa_middleware` — real code often uses the v6 **factory** form
 * `geth_poa_middleware(make_request, w3)` (e.g. Brownie). Renaming that symbol without
 * restructuring breaks semantics; handle POA migration manually or with a dedicated rule + fixtures.
 */
const MIDDLEWARE_FN_TO_CLASS: Record<string, string> = {
  pythonic_middleware: "PythonicMiddleware",
  name_to_address_middleware: "ENSNameToAddressMiddleware",
};

function renameKeywordArgument(
  rootNode: SgNode<Python>,
  oldName: string,
  newName: string,
): Edit[] {
  const idents = rootNode.findAll({
    rule: {
      kind: "identifier",
      regex: `^${oldName}$`,
    },
  });

  const edits: Edit[] = [];
  for (const ident of idents) {
    if (ident.parent()?.kind() === "keyword_argument") {
      edits.push(ident.replace(newName));
    }
  }
  return edits;
}

/** Rename every matching identifier (imports, calls, type positions). */
function renameIdentifierGlobally(
  rootNode: SgNode<Python>,
  oldName: string,
  newName: string,
): Edit[] {
  const idents = rootNode.findAll({
    rule: {
      kind: "identifier",
      regex: `^${oldName}$`,
    },
  });
  return idents.map((ident) => ident.replace(newName));
}

function enclosingCallFromKeywordNameIdent(
  kwArgNameIdent: SgNode<Python>,
): SgNode<Python> | null {
  const kw = kwArgNameIdent.parent();
  if (!kw || kw.kind() !== "keyword_argument") {
    return null;
  }
  const args = kw.parent();
  if (!args || args.kind() !== "argument_list") {
    return null;
  }
  const call = args.parent();
  if (!call || call.kind() !== "call") {
    return null;
  }
  return call;
}

/** `dict(...)` builds a mapping; camelCase kwargs must not become snake_case keys. */
function callCalleeIsBareDict(call: SgNode<Python>): boolean {
  const callee = call.field("function");
  if (!callee || callee.kind() !== "identifier") {
    return false;
  }
  return callee.text() === "dict";
}

function renameRpcStyleKwargsExceptDictCtor(rootNode: SgNode<Python>): Edit[] {
  const edits: Edit[] = [];

  for (const [oldName, newName] of Object.entries(RPC_CAMEL_KWARGS_TO_SNAKE)) {
    const idents = rootNode.findAll({
      rule: {
        kind: "identifier",
        regex: `^${oldName}$`,
      },
    });

    for (const ident of idents) {
      if (ident.parent()?.kind() !== "keyword_argument") {
        continue;
      }
      const call = enclosingCallFromKeywordNameIdent(ident);
      if (call && callCalleeIsBareDict(call)) {
        continue;
      }
      edits.push(ident.replace(newName));
    }
  }

  return edits;
}

function calleeTextNoSpace(call: SgNode<Python>): string {
  const fn = call.field("function");
  return fn ? fn.text().replace(/\s/g, "") : "";
}

/** Only `add` / `inject` on something that looks like web3's onion stack. */
function callIsMiddlewareOnionAddOrInject(call: SgNode<Python>): boolean {
  const t = calleeTextNoSpace(call);
  return t.includes("middleware_onion.add") || t.includes("middleware_onion.inject");
}

/** First positional argument in an argument_list (skip commas and keyword-only forms). */
function firstPositionalArg(argList: SgNode<Python>): SgNode<Python> | null {
  for (const ch of argList.children()) {
    if (ch.kind() === "keyword_argument") {
      continue;
    }
    if (ch.kind() === "," || ch.kind() === "(" || ch.kind() === ")") {
      continue;
    }
    return ch;
  }
  return null;
}

/**
 * `add(pythonic_middleware)` → `add(PythonicMiddleware())` (same for inject's first positional arg).
 * Only when the argument is a bare identifier matching a known v6 middleware function name.
 */
function upgradeBareMiddlewareFnInOnionCalls(rootNode: SgNode<Python>): Edit[] {
  const edits: Edit[] = [];
  const calls = rootNode.findAll({ rule: { kind: "call" } });

  for (const call of calls) {
    if (!callIsMiddlewareOnionAddOrInject(call)) {
      continue;
    }
    const args = call.field("arguments");
    if (!args || args.kind() !== "argument_list") {
      continue;
    }
    const first = firstPositionalArg(args);
    if (!first || first.kind() !== "identifier") {
      continue;
    }
    const cls = MIDDLEWARE_FN_TO_CLASS[first.text()];
    if (!cls) {
      continue;
    }
    edits.push({
      startPos: first.range().start.index,
      endPos: first.range().end.index,
      insertedText: `${cls}()`,
    });
  }

  return edits;
}

function renameLegacyMiddlewareSymbols(rootNode: SgNode<Python>): Edit[] {
  const edits: Edit[] = [];
  for (const [oldFn, newCls] of Object.entries(MIDDLEWARE_FN_TO_CLASS)) {
    edits.push(...renameIdentifierGlobally(rootNode, oldFn, newCls));
  }
  return edits;
}

/** Outermost method name for `a.b.c.add` → identifier `add`. */
function outerCallMethodName(callFn: SgNode<Python>): SgNode<Python> | null {
  if (callFn.kind() !== "attribute") {
    return null;
  }
  return callFn.field("attribute");
}

/**
 * v6 `construct_sign_and_send_raw_middleware(...)` on onion → v7 builder.
 * https://web3py.readthedocs.io/en/stable/migration.html#middleware-builder-classes
 */
function upgradeSignAndSendRawMiddleware(rootNode: SgNode<Python>): Edit[] {
  const edits: Edit[] = [];
  const calls = rootNode.findAll({ rule: { kind: "call" } });

  for (const call of calls) {
    const fn = call.field("function");
    if (!fn) {
      continue;
    }
    const ft = calleeTextNoSpace(call);
    if (!ft.includes("middleware_onion.add") && !ft.includes("middleware_onion.inject")) {
      continue;
    }

    const args = call.field("arguments");
    if (!args || args.kind() !== "argument_list") {
      continue;
    }

    const first = firstPositionalArg(args);
    if (!first || first.kind() !== "call") {
      continue;
    }

    const innerCallee = first.field("function");
    if (!innerCallee || innerCallee.kind() !== "identifier") {
      continue;
    }
    if (innerCallee.text() !== "construct_sign_and_send_raw_middleware") {
      continue;
    }

    const innerArgs = first.field("arguments");
    let innerArgsText = innerArgs ? innerArgs.text().trim() : "";
    while (
      innerArgsText.startsWith("(") &&
      innerArgsText.endsWith(")") &&
      innerArgsText.length >= 2
    ) {
      innerArgsText = innerArgsText.slice(1, -1).trim();
    }
    const buildExpr = innerArgsText
      ? `SignAndSendRawMiddlewareBuilder.build(${innerArgsText})`
      : "SignAndSendRawMiddlewareBuilder.build()";

    const isAdd = ft.includes("middleware_onion.add");
    const newFirstArg = isAdd ? `${buildExpr}, layer=0` : buildExpr;

    edits.push({
      startPos: first.range().start.index,
      endPos: first.range().end.index,
      insertedText: newFirstArg,
    });

    if (isAdd) {
      const method = outerCallMethodName(fn);
      if (method && method.text() === "add") {
        edits.push(method.replace("inject"));
      }
    }
  }

  return edits;
}

function renameConstructSignImport(rootNode: SgNode<Python>): Edit[] {
  return renameIdentifierGlobally(
    rootNode,
    "construct_sign_and_send_raw_middleware",
    "SignAndSendRawMiddlewareBuilder",
  );
}

const transform: Transform<Python> = async (root) => {
  const rootNode = root.root();

  // Order matters: upgrade onion call sites before global renames so imports/other refs still match old names for the second pass.
  const edits: Edit[] = [
    ...renameKeywordArgument(rootNode, "middlewares", "middleware"),
    ...renameIdentifierGlobally(rootNode, "WebsocketProviderV2", "WebSocketProvider"),
    ...renameRpcStyleKwargsExceptDictCtor(rootNode),
    ...upgradeSignAndSendRawMiddleware(rootNode),
    ...upgradeBareMiddlewareFnInOnionCalls(rootNode),
    ...renameLegacyMiddlewareSymbols(rootNode),
    ...renameConstructSignImport(rootNode),
  ];

  if (edits.length === 0) {
    return null;
  }

  return rootNode.commitEdits(edits);
};

export default transform;
