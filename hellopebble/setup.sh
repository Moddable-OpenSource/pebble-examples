set -e
set -e
mkdir -p build
mcrun -m ./src/embeddedjs/manifest.json -f x -t build -o ./build
mkdir -p resources/mods
cp build/bin/mac/mc/release/embeddedjs/mc.xsa ./resources/mods/mc.xsa
rebble build
rebble install --qemu localhost:12344
