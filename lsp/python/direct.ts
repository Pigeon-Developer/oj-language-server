/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { fileURLToPath } from 'node:url';
import { runPythonServer } from './main';

const pyrightLspPath = import.meta.resolve('pyright/dist/pyright-langserver.js');

runPythonServer(fileURLToPath(pyrightLspPath));
