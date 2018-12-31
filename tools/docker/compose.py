from subprocess import Popen, PIPE
import os

class Compose:
    def __init__(self, action, options):
        self.action = action
        extraOpts = ['--abort-on-container-exit']
        if(options == 'up'):
            self.options = [options] + extraOpts
        else:
            self.options = [options]
        self.process = None
        self.composeFile = None
    
    def __del__(self):
        if(self.process):
            print('\n\nShutting down docker-compose...\n\n')
            self.process.kill()
            fullComposePath = self.home() + '/' + self.composeFile
            process = Popen(['/usr/local/bin/docker-compose', '-f', fullComposePath, 'down'], stdout=PIPE, stderr=PIPE, cwd=self.home())            
            while True:
                if process.poll() is not None:
                    break
                else:
                    output = process.stderr.readline()
                    if output:
                        print(output.decode('utf-8').strip())
            rc = process.wait()
            print(f'docker-compose down exited with rc={rc}')

    def run(self):
        if(self.action == 'dev'):
            self.composeFile = 'docker-compose.dev.yml'
            returnCode = self.composeDocker(self.composeFile, self.options)
            print(f'\n\nCompleted compose with return code ---> {returnCode}')
        elif(self.action == 'ui'):
            self.composeFile = 'docker-compose.ui.yml'
            returnCode = self.composeDocker(self.composeFile, self.options)
            print(f'\n\nCompleted compose with return code ---> {returnCode}')

    def composeDocker(self, composeFile, options):
        print(f'Compose docker using file: \n\n  {composeFile}\n\nwith options:\n\n  {options}\n')
        fullComposePath = self.home() + '/' + composeFile
        composeCmd = ['/usr/local/bin/docker-compose', '-f', fullComposePath] + options
        self.process = Popen(composeCmd, stdout=PIPE, stderr=PIPE, cwd=self.home())
        while True:
            if self.process.poll() is not None:
                break
            else:
                output = self.process.stdout.readline()
                if output:
                    print(output.decode('utf-8').strip())
        rc = self.process.wait()
        if(rc != 0):
            print(self.process.stderr.read().decode('utf-8'))
        return rc

    def home(self):
        return os.getenv('GI_HOME')
