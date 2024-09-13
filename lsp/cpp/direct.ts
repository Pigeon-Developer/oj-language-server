/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { runClangdServer } from './main';

const CLANGD_PATH = process.env.CLANGD_PATH || 'clangd';

runClangdServer(CLANGD_PATH);
