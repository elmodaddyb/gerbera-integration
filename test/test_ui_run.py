#!/usr/bin/python
from subprocess import Popen, PIPE
import os, unittest

class BuildDockerUi(unittest.TestCase):
    def setUp(self):
        dirPath = os.path.dirname(os.path.realpath(__file__))
        self.dockerFile = dirPath + '/' + '../docker-compose.ui.yml'
        self.successUiTest = False

    def test_runDockerUiTests(self):
        process = Popen(['/usr/local/bin/docker-compose', '-f', self.dockerFile, 'up', '--abort-on-container-exit'], stdout=PIPE, stderr=PIPE, cwd=r'../')
        stdout, stderr = process.communicate()

        for ln in stdout.split('\n'):
            print(ln)
            if 'gerbera-integration_ui_1 exited with code 0' in ln:
                self.successUiTest = True

        if process.returncode != 0:
            print(stderr)

        self.assertTrue(process.returncode == 0, "Process exits with CODE=0")
        self.assertTrue(self.successUiTest, "All UI tests PASS")

if __name__ == '__main__':
    unittest.main()
