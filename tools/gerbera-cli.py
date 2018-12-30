#!/usr/bin/env python
## -----------------------------------------
## Gerbera Integration Helper Script
## Purpose: To simplify working with gerbera-integration project
## Created: 12/30/2018
## Created By: Eamonn Buss
## -----------------------------------------
import argparse, signal, sys
from docker import *

def identifyAction(scope, action, options):
    print(f'scope={scope} , action={action}, options={options}')
    if(scope == 'clean'):
        return Cleanup(action)
    elif(scope == 'compose'):
        return Compose(action, options)
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('scope', help='The scope of gerbera-integration to run the action')
    parser.add_argument('action', help='The action to run upon the gerbera-integration scope')
    parser.add_argument('--options', help='The options to pass to the action')
    args = parser.parse_args()

    signal.signal(signal.SIGINT, signal_handler)

    # Determine Action and run
    action = identifyAction(args.scope, args.action, args.options)
    if (action):
        action.run()

def signal_handler(sig, frame):
        sys.exit(0)

if __name__ == '__main__':
    main()