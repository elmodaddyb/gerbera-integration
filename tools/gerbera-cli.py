#!/usr/bin/env python
## -----------------------------------------
## Gerbera Integration Helper Script
## Purpose: To simplify working with gerbera-integration project
## Created: 12/30/2018
## Created By: Eamonn Buss
## -----------------------------------------
import argparse, signal, sys
from docker import *

def identifyAction(action, scope, options):
    print(f'action={action}, scope={scope}, options={options}')
    if(action == 'clean'):
        return Cleanup(scope)
    elif(action == 'build'):
        return Compose(scope, 'build')
    elif(action == 'test'):
        return Compose(scope, 'up')
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('action', help='The action to run for gerbera-integration (build, test)')
    parser.add_argument('scope', help='The scope of the integration test (dev, ui, upnp)')
    parser.add_argument('--options', help='The options to pass to the action')
    args = parser.parse_args()

    signal.signal(signal.SIGINT, signal_handler)

    # Determine Action and run
    action = identifyAction(args.action, args.scope, args.options)
    if (action):
        action.run()

def signal_handler(sig, frame):
        sys.exit(0)

if __name__ == '__main__':
    main()