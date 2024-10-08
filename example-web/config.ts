/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { UserConfig } from 'monaco-editor-wrapper';
import { useOpenEditorStub } from 'monaco-editor-wrapper/vscode/services';
import { MonacoLanguageClient } from 'monaco-languageclient';

export enum Language {
  python = 'python',
  cpp = 'cpp',
}

export const createUserConfigForPython = (workspaceRoot: string, code: string, codeUri: string): UserConfig => {
  return {
    languageClientConfig: {
      languageId: 'python',
      name: 'Python Language Server Example',
      options: {
        $type: 'WebSocket',
        host: 'localhost',
        port: 30001,
        path: 'pyright',
        extraParams: {
          authorization: 'UserAuth',
        },
        secured: false,
        startOptions: {
          onCall: (languageClient?: MonacoLanguageClient) => {
            setTimeout(() => {
              ['pyright.restartserver', 'pyright.organizeimports'].forEach((cmdName) => {
                vscode.commands.registerCommand(cmdName, (...args: unknown[]) => {
                  languageClient?.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
                });
              });
            }, 250);
          },
          reportStatus: true,
        },
      },
      clientOptions: {
        documentSelector: ['python'],
        workspaceFolder: {
          index: 0,
          name: 'workspace',
          uri: vscode.Uri.parse(workspaceRoot),
        },
      },
    },
    wrapperConfig: {
      serviceConfig: {
        userServices: {
          ...getEditorServiceOverride(useOpenEditorStub),
          ...getKeybindingsServiceOverride(),
        },
        debugLogging: true,
      },
      editorAppConfig: {
        $type: 'extended',
        codeResources: {
          main: {
            text: code,
            uri: codeUri,
          },
        },
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.guides.bracketPairsHorizontal': 'active',
            'editor.wordBasedSuggestions': 'off',
          }),
        },
        useDiffEditor: false,
      },
    },
    loggerConfig: {
      enabled: true,
      debugEnabled: true,
    },
  };
};

export const createUserConfigForCpp = (workspaceRoot: string, code: string, codeUri: string): UserConfig => {
  return {
    languageClientConfig: {
      languageId: 'cpp',
      name: 'Cpp Language Server Example',
      options: {
        $type: 'WebSocket',
        host: 'localhost',
        port: 30001,
        path: 'clangd',
        extraParams: {
          authorization: 'UserAuth',
        },
        secured: false,
      },
      clientOptions: {
        documentSelector: ['cpp'],
        workspaceFolder: {
          index: 0,
          name: 'workspace',
          uri: vscode.Uri.parse(workspaceRoot),
        },
      },
    },
    wrapperConfig: {
      serviceConfig: {
        userServices: {
          ...getEditorServiceOverride(useOpenEditorStub),
          ...getKeybindingsServiceOverride(),
        },
        debugLogging: true,
      },
      editorAppConfig: {
        $type: 'extended',
        codeResources: {
          main: {
            text: code,
            uri: codeUri,
          },
        },
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.guides.bracketPairsHorizontal': 'active',
            'editor.wordBasedSuggestions': 'off',
          }),
        },
        useDiffEditor: false,
      },
    },
    loggerConfig: {
      enabled: true,
      debugEnabled: true,
    },
  };
};
export const createUserConfigForJava = (workspaceRoot: string, code: string, codeUri: string): UserConfig => {
  return {
    wrapperConfig: {
      serviceConfig: {
        userServices: {
          ...getKeybindingsServiceOverride(),
        },
        debugLogging: true,
      },
      editorAppConfig: {
        $type: 'extended',
        codeResources: {
          main: {
            text: code,
            uri: codeUri,
          },
        },
        useDiffEditor: false,
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.guides.bracketPairsHorizontal': 'active',
            'editor.wordBasedSuggestions': 'off',
          }),
        },
      },
    },
    languageClientConfig: {
      languageId: 'java',
      options: {
        $type: 'WebSocket',
        host: 'localhost',
        port: 30001,
        path: 'jdtls',
        extraParams: {
          authorization: 'UserAuth',
        },
        secured: false,
      },
      clientOptions: {
        documentSelector: ['java'],
        workspaceFolder: {
          index: 0,
          name: 'workspace',
          uri: vscode.Uri.parse(workspaceRoot),
        },
      },
    },
  };
};
