#!/usr/bin/python
from subprocess import Popen, PIPE
import os, unittest

class BuildDockerUi(unittest.TestCase):

    def test_runDockerUiTests(self):
        giCmd = ['/usr/local/bin/python3', 'gerbera-cli.py', 'compose', 'ui', '--options=up']
        process = Popen(giCmd, stdout=PIPE, stderr=PIPE, cwd=r'./tools')
        stdout, stderr = process.communicate()

        for ln in stdout.decode('utf-8').split('\n'):
            print(ln)
            if 'gerbera-integration_ui_1 exited with code 0' in ln:
                successUiTest = True

        if process.returncode != 0:
            print(stderr)

        self.assertTrue(process.returncode == 0, "Process exits with CODE=0")
        self.assertTrue(successUiTest, "All UI tests PASS")

if __name__ == '__main__':
    unittest.main()
