const { rmSync } = require('fs');
const { argv } = require('process');

rmSync(argv[2], { recursive: true, force: true });
