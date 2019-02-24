#!/usr/bin/python
from subprocess import Popen, PIPE
import os, unittest

class BuildDockerUpnp(unittest.TestCase):

    def test_runDockerUpnpTests(self):
        giCmd = ['/usr/local/bin/python3', 'gerbera-cli.py', 'test', 'upnp']
        process = Popen(giCmd, stdout=PIPE, stderr=PIPE, cwd=r'./tools')
        stdout, stderr = process.communicate()

        for ln in stdout.decode('utf-8').split('\n'):
            print(ln)
            if 'gerbera-integration_upnp_1 exited with code 0' in ln:
                successTest = True

        if process.returncode != 0:
            print(stderr)

        self.assertTrue(process.returncode == 0, "Process exits with CODE=0")
        self.assertTrue(successTest, "All tests PASS")

if __name__ == '__main__':
    unittest.main()
