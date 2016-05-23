BIN = ./node_modules/.bin
SRC = $(wildcard src/* src/*/*)
TEST = $(wildcard test/* test/*/*)

build: index.js

index.js: src/index.js $(SRC)
	$(BIN)/rollup $< -c > $@

clean:
	rm -rf index.js

.PHONY: build clean
