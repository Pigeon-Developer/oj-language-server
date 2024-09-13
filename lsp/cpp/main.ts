/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { IncomingMessage } from 'node:http';
import { runLanguageServer } from '../common/language-server-runner.js';

export const runClangdServer = (clangdPath: string) => {
  runLanguageServer({
    serverName: 'CLANGD',
    pathName: '/clangd',
    serverPort: 30001,
    runCommand: clangdPath,
    runCommandArgs: [],
    wsServerOptions: {
      noServer: true,
      perMessageDeflate: false,
      clientTracking: true,
      verifyClient: (clientInfo: { origin: string; secure: boolean; req: IncomingMessage }, callback) => {
        const parsedURL = new URL(`${clientInfo.origin}${clientInfo.req.url ?? ''}`);
        const authToken = parsedURL.searchParams.get('authorization');
        if (authToken === 'UserAuth') {
          callback(true);
        } else {
          callback(false);
        }
      },
    },
  });
};
