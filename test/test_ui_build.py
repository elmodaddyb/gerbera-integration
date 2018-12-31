#!/usr/bin/python
from subprocess import Popen, PIPE
import os, unittest

class BuildDockerUi(unittest.TestCase):
    def setUp(self):
        dirPath = os.path.dirname(os.path.realpath(__file__))
        self.dockerFile = dirPath + '/' + '../docker-compose.ui.yml'
        self.coreTagged = False
        self.homeTagged = False
        self.mediaTagged = False
        self.uiTagged = False

    def test_buildDockerUi(self):
        process = Popen(['/usr/local/bin/docker-compose', '-f', self.dockerFile, 'build'], stdout=PIPE, stderr=PIPE, cwd=r'../')
        stdout, stderr = process.communicate()

        for ln in stdout.split('\n'):
            print (ln)
            if 'Successfully tagged gerbera-integration_core:latest' in ln:
                self.coreTagged = True
            elif 'Successfully tagged gerbera-integration_home:latest' in ln:
                self.homeTagged = True
            elif 'Successfully tagged gerbera-integration_media:latest' in ln:
                self.mediaTagged = True
            elif 'Successfully tagged gerbera-integration_ui:latest' in ln:
                self.uiTagged = True

        if process.returncode != 0:
            print (stderr)

        self.assertTrue(process.returncode == 0, 'Entire process return code = 0')
        self.assertTrue(self.coreTagged, 'gerbera-core tagged successfully')
        self.assertTrue(self.homeTagged, 'gerbera-home tagged successfully')
        self.assertTrue(self.mediaTagged, 'gerbera-media tagged successfully')
        self.assertTrue(self.uiTagged, 'gerbera-ui tagged successfully')

if __name__ == '__main__':
    unittest.main()