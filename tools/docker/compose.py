from subprocess import Popen, PIPE

class Compose:
    def __init__(self, action, options):
        self.action = action
        extraOpts = ['--abort-on-container-exit']
        if(options == 'up'):
            self.options = [options] + extraOpts
        else:
            self.options = [options]

    def run(self):
        if(self.action == 'dev'):
            returnCode = self.composeDocker('docker-compose.dev.yml', self.options)
            print(f'\n\nCompleted compose with return code ---> {returnCode}')
        elif(self.action == 'ui'):
            returnCode = self.composeDocker('docker-compose.ui.yml', self.options)
            print(f'\n\nCompleted compose with return code ---> {returnCode}')

    def composeDocker(self, composeFile, options):
        print(f'Compose docker using file: \n\n  {composeFile}\n\nwith options:\n\n  {options}\n')
        fullComposePath = self.home() + '/' + composeFile
        composeCmd = ['/usr/local/bin/docker-compose', '-f', fullComposePath] + options
        process = Popen(composeCmd, stdout=PIPE, stderr=PIPE, cwd=self.home())
        while True:
            if process.poll() is not None:
                break
            else:
                output = process.stdout.readline()
                if output:
                    print(output.decode('utf-8').strip())
        rc = process.wait()
        if(rc != 0):
            print(process.stderr.read().decode('utf-8'))
        return rc

    def home(self):
        ## TODO: get from environment?
        return '/Users/eamonn/development/gerbera-integration'
