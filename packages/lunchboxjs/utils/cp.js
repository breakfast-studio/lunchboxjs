const { copyFileSync } = require('fs');
const { argv } = require('process');

copyFileSync(argv[2], argv[3]);
