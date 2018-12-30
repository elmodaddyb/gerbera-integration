from subprocess import Popen, PIPE

class Cleanup:
    def __init__(self, type):
        self.type = type
        self.debug = False
    
    def run(self):
        if(self.type == 'exited'):
            self.removeExited()
        elif(self.type == 'dangling'):
            self.removeDangling()
        elif(self.type == 'core'):
            self.removeImage('gerbera-integration_core')
        elif(self.type == 'ui'):
            self.removeImage('gerbera-integration_ui')
        elif(self.type == 'home'):
            self.removeImage('gerbera-integration_home')
            self.removeVolume('gerbera-integration_gerbera-home')
        elif(self.type == 'media'):
            self.removeImage('gerbera-integration_media')
            self.removeVolume('gerbera-integration_gerbera-media')
        elif(self.type == 'all'):
            self.removeExited()
            self.removeDangling()
            self.removeImage('gerbera-integration_core')
            self.removeImage('gerbera-integration_ui')
            self.removeImage('gerbera-integration_home')
            self.removeVolume('gerbera-integration_gerbera-home')
            self.removeImage('gerbera-integration_media')
            self.removeVolume('gerbera-integration_gerbera-media')
        else:
            print(f'Type={self.type}')

    def removeExited(self):
        self.findAndRemove(['docker', 'ps', '-a' ,'-q', '-f', 'status=exited'], ['docker', 'rm', '-v'])
    
    def removeDangling(self):
        self.findAndRemove(['docker', 'images', '-f', 'dangling=true', '-q'], ['docker', 'rmi'])
    
    def removeImage(self, imageName):
        self.findAndRemove(['docker', 'images', imageName, '-q'], ['docker', 'rmi'])

    def removeVolume(self, volumeName):
        volumeList = self.findItems(['docker', 'volume', 'ls'])
        foundList = list(filter(lambda k: volumeName in k, volumeList))
        foundList = self.namesOnly(foundList, volumeName)
        self.removeItems(['docker', 'volume', 'rm'], foundList)

    def namesOnly(self, items, name):
        for idx, word in enumerate(items):
            items[idx] = word[word.rindex(name):]
        return items

    def findItems(self, findCmd):
        process = Popen(findCmd, stdout=PIPE, stderr=PIPE)
        stdout, stderr = process.communicate()
        if process.returncode != 0:
                print(stderr.decode('utf-8'))
        foundStr = stdout.decode('utf-8').strip()
        foundList = list(filter(None, foundStr.split('\n')))
        if(self.debug):
            print(f'Found {len(foundList)} docker items')
        return foundList
    
    def removeItems(self, removeCmd, items):
        if(len(items) > 0):
            print(f'Remove {len(items)} docker items: {items}')
            removeItems = removeCmd + items
            process = Popen(removeItems, stdout=PIPE, stderr=PIPE)
            stdout, stderr = process.communicate()
            if process.returncode != 0:
                print(stderr.decode('utf-8'))

    def findAndRemove(self, findCmd, removeCmd):
        foundList = self.findItems(findCmd)
        self.removeItems(removeCmd, foundList)
        