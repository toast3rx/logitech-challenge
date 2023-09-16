import importlib
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))
logi = importlib.import_module('logi-plugin-sdk-python')

logi.hello_world()

