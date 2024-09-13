import React from 'react';

/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
// this is required syntax highlighting
import '@codingame/monaco-vscode-python-default-extension';
import '@codingame/monaco-vscode-cpp-default-extension';
import '@codingame/monaco-vscode-java-default-extension';
import {
  RegisteredFileSystemProvider,
  registerFileSystemOverlay,
  RegisteredMemoryFile,
} from '@codingame/monaco-vscode-files-service-override';
import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { createUserConfigForCpp, createUserConfigForJava, createUserConfigForPython } from './config';
import { useCallback } from 'react';

export const configureMonacoWorkers = () => {
  useWorkerFactory({
    ignoreMapping: true,
    workerLoaders: {
      editorWorkerService: () =>
        new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
    },
  });
};

interface EditorItem {
  userConfig: UserConfig;
  wrapper: MonacoEditorLanguageClientWrapper;
  fileUri: vscode.Uri;
}

async function runEditor(item: EditorItem) {
  const htmlElement: HTMLElement = document.querySelector('#editor')!;
  if (item.wrapper.isStarted()) {
    console.warn('Editor was already started!');
  } else {
    await item.wrapper.init(item.userConfig);

    // open files, so the LS can pick it up
    await vscode.workspace.openTextDocument(item.fileUri);

    await item.wrapper.start(htmlElement);
  }
}

export const createPythonWrapper = () => {
  const helloPyUri = vscode.Uri.file('/workspace/hello.py');

  const helloPyCode = '';
  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(new RegisteredMemoryFile(helloPyUri, helloPyCode));

  registerFileSystemOverlay(1, fileSystemProvider);
  const userConfig = createUserConfigForPython('/workspace', helloPyCode, '/workspace/hello.py');
  const wrapper = new MonacoEditorLanguageClientWrapper();

  return {
    userConfig: userConfig,
    wrapper: wrapper,
    fileUri: helloPyUri,
  };
};

export const createCppWrapper = () => {
  const filePath = '/workspace/main.cpp';
  const fileUri = vscode.Uri.file(filePath);

  const code = '';
  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(new RegisteredMemoryFile(fileUri, code));

  registerFileSystemOverlay(1, fileSystemProvider);
  const userConfig = createUserConfigForCpp('/workspace', code, filePath);
  const wrapper = new MonacoEditorLanguageClientWrapper();

  return {
    userConfig: userConfig,
    wrapper: wrapper,
    fileUri: fileUri,
  };
};

export const createJavaWrapper = () => {
  const basePath = '/home/mlc/packages/examples/resources/eclipse.jdt.ls';
  const filePath = `${basePath}/workspace/main.java`;
  const fileUri = vscode.Uri.file(filePath);

  const code = ``;
  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(new RegisteredMemoryFile(fileUri, code));

  registerFileSystemOverlay(1, fileSystemProvider);
  const userConfig = createUserConfigForJava(`${basePath}/workspace`, code, filePath);
  const wrapper = new MonacoEditorLanguageClientWrapper();

  return {
    userConfig: userConfig,
    wrapper: wrapper,
    fileUri: fileUri,
  };
};

const EditorMap: Record<string, EditorItem> = {
  cpp: createCppWrapper(),
  python: createPythonWrapper(),
  java: createJavaWrapper(),
};

export const language = atom<string>('cpp');

function Select() {
  const value = useStore(language);

  return (
    <div>
      语言
      <select value={value}>
        <option value="cpp">cpp</option>
        <option value="python">python</option>
        <option value="java">java</option>
      </select>
    </div>
  );
}

export default function Editor() {
  const onMount = useCallback(() => {
    runEditor(EditorMap.cpp);
  }, []);

  return (
    <div>
      <Select />
      <div id="editor" style={{ width: 800, height: 800 }} ref={onMount}></div>
    </div>
  );
}
