import sudo from 'sudo-prompt'
import run from './src/app'

const musicConfig = `
# music start
127.0.0.1 music.163.com
127.0.0.1 interface.music.163.com
# music end`

const fs = require('fs');
const spawn = require('child_process').spawn;
const dns = require('dns');

function isConfig(){
	let data = fs.readFileSync('/private/etc/hosts');
	return data.includes(musicConfig);
}

function start(){
	dns.lookup('music.163.com', function(error, address){
		if (error !== null) {
			console.log('dns error: ' + error)
		}else{
			console.log('music.163.com ip is ' + address);
			let result = configHost(true);
            run('80:443', address)
		}
	});
}

function stop(){
	configHost(false);
	console.log("关闭成功")
}

function configHost(isConfig){
	try{
		let data = fs.readFileSync('/private/etc/hosts');
		if (isConfig) {
			if (!data.includes(musicConfig)) {
                let configData = data.toString() + musicConfig;
				sudoRun(configData)
			}
		}else{
			if (data.includes(musicConfig)) {
                let configData = data.toString().split(musicConfig).join('');
				sudoRun(configData)
			}
		}
		return true;
	}catch(err){
		console.log("权限不够 请使用sudo node music.js");
		return false;
	}
}

async function sudoRun(configData) {
    sudo.exec(`echo -n '${configData.trim()}' > /private/etc/hosts`, {name: 'Music'}, function (error, stdout, stderr) {
        if(error){
            console.log(error)
        }else{
            console.log(stdout)
        }
    })
  }

export { isConfig, start, stop }
