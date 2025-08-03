// const { exec } = require('child_process');
import { exec } from 'child_process';

export const executeCommand = (cmd, successCallback, errorCallback) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            // console.log(`error: ${error.message}`);
            if (errorCallback) {
                errorCallback(error.message);
            }
            return;
        }
        if (stderr) {
            //console.log(`stderr: ${stderr}`);
            if (errorCallback) {
                errorCallback(stderr);
            }
            return;
        }
        //console.log(`stdout: ${stdout}`);
        if (successCallback) {
            successCallback(stdout);
        }
    });
};

export const runAllPlaywrightTests = () => {
    executeCommand(
        'bash ./util/runAllTests.sh',
        message => console.log(message),
        errormsg => console.error(errormsg)
    );
};

export const runThisPlayWrightTest = (test) => {
    executeCommand(
        `bash ./util/runASingleTest.sh '${test}'`,
        message => console.log(message),
        errormsg => console.error(errormsg)
    )
}

export const runThisPlayWrightFile = (file) => {
    executeCommand(
        `bash ./util/runASingleFile.sh ${file}`,
        message => console.log(message),
        errormsg => console.error(errormsg)
    )
}