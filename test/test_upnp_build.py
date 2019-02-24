#!/usr/bin/python
from subprocess import Popen, PIPE
import os, unittest

class BuildDockerUpnp(unittest.TestCase):

    def test_buildDockerUpnp(self):
        giCmd = ['/usr/local/bin/python3', 'gerbera-cli.py', 'build', 'upnp']
        process = Popen(giCmd, stdout=PIPE, stderr=PIPE, cwd=r'./tools')
        stdout, stderr = process.communicate()

        for ln in stdout.decode('utf-8').split('\n'):
            print (ln)
            if 'Successfully tagged gerbera-integration_core:latest' in ln:
                coreTagged = True
            elif 'Successfully tagged gerbera-integration_home:latest' in ln:
                homeTagged = True
            elif 'Successfully tagged gerbera-integration_media:latest' in ln:
                mediaTagged = True
            elif 'Successfully tagged gerbera-integration_upnp:latest' in ln:
                upnpTagged = True

        if process.returncode != 0:
            print (stderr)

        self.assertTrue(process.returncode == 0, 'Entire process return code = 0')
        self.assertTrue(coreTagged, 'gerbera-core tagged successfully')
        self.assertTrue(homeTagged, 'gerbera-home tagged successfully')
        self.assertTrue(mediaTagged, 'gerbera-media tagged successfully')
        self.assertTrue(upnpTagged, 'gerbera-upnp tagged successfully')

if __name__ == '__main__':
    unittest.main()
