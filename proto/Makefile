PROTO_FILE = logi_plugin.proto

.PHONY: all
all: python

.PHONY: python
python:
	protoc --python_out=../logi-plugin-sdk-python $(PROTO_FILE)
