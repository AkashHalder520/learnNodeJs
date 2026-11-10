//os 
//cpu information
//memory information
import os from 'os';

console.log('CPU Information:', os.cpus());
console.log('Total Memory:', os.totalmem());
console.log('Free Memory:', os.freemem());
console.log('Operating System:', os.type());
console.log('Platform:', os.platform());
console.log('Uptime (seconds):', os.uptime());  
console.log('home directory', os.homedir);
