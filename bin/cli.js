
const program = require('commander');
const path = require('path');

const pkg = require('../package.json');
const promfiler = require('..');

const sanitizeArgv = (cmd, argv) =>
      argv.filter( (arg, i) => argv.indexOf(cmd) === -1 || i >= argv.indexOf(cmd) || i === 0 );


const runApp = (cmd) => {
    return (uri) => {
        process.argv = sanitizeArgv(cmd, process.argv);
        const appModule = path.resolve(path.join(cmd));
        console.info("\n");
        console.info("*********************************************");
        console.info('*****  Profiler listening on %s', uri);
        console.info("*****  Executing: %s", process.argv.slice(1).join(' '));
        console.info("*********************************************");
        console.info("\n");
        require(appModule);
    };
};

const runProfiling = (cmd, opts) => {
    return promfiler.startServer({
        hostname: opts.hostname,
        port: opts.port,
        path: opts.path,
    }).then( (_) => {
        promfiler.startProfiling({
            samplingInterval: opts.samplingInterval,
        });
        return _;
    });
};

program
  .version(pkg.version)
  .option('-h, --hostname <hostname>', 'Address to listen for metric interface.')
  .option('-p, --port <port>', 'Port to listen for metric interface.')
  .option('-P, --path <path>', 'Path under which to expose metrics.')
  .option('-s, --sampling-interval <sampling interval>', 'Changes default CPU profiler sampling interval to the specified number of microseconds.')
  .arguments('<app> [argv...]')
  .action((app, argv, options) => {
    runProfiling(app, options).then(runApp(app));
  });

program.on('--help', () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ promfiler ./app.js');
  console.log('    $ promfiler ./app.js foo bar');
  console.log('    $ promfiler --port 9090 ./app.js foo bar');
  console.log('');
});

program.parse(process.argv);

if (!program.args.length)
    program.help();
