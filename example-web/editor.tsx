import React, { useRef } from 'react';

/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
// this is required syntax highlighting
import '@codingame/monaco-vscode-python-default-extension';
import {
  RegisteredFileSystemProvider,
  registerFileSystemOverlay,
  RegisteredMemoryFile,
} from '@codingame/monaco-vscode-files-service-override';
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import { createUserConfig } from './config';

export const configureMonacoWorkers = () => {
  useWorkerFactory({
    ignoreMapping: true,
    workerLoaders: {
      editorWorkerService: () =>
        new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
    },
  });
};

export const runPythonWrapper = async () => {
  const helloPyUri = vscode.Uri.file('/workspace/hello.py');

  const helloPyCode = '';
  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(new RegisteredMemoryFile(helloPyUri, helloPyCode));

  registerFileSystemOverlay(1, fileSystemProvider);
  const userConfig = createUserConfig('/workspace', helloPyCode, '/workspace/hello.py');
  const wrapper = new MonacoEditorLanguageClientWrapper();

  return async function (htmlElement: HTMLElement) {
    if (wrapper.isStarted()) {
      console.warn('Editor was already started!');
    } else {
      await wrapper.init(userConfig);

      // open files, so the LS can pick it up
      await vscode.workspace.openTextDocument(helloPyUri);

      await wrapper.start(htmlElement);
    }
  };
};

const bootResult = runPythonWrapper();

export default function Editor() {
  const dom = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ width: 800, height: 800 }}
      ref={dom}
      onClick={(e) => {
        bootResult.then((start) => {
          start(dom.current!);
        });
      }}
    >
      启动
    </div>
  );
}
