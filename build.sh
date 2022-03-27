# Create out directory
rm -rf ./build
mkdir -p ./build

# build frontend
cd ./easy_scan_website/
npm run build

# build backend
cd ./../easy_scan_backend/
cargo build --release --features build_script

cd ..
mkdir -p ./build/website/static
# copy output into ./build
mv ./easy_scan_backend/target/release/easy_scan ./build
mv ./easy_scan_website/build/* ./build/website/static

