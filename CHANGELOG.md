# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) where possible.

## [4.0.3-f7d5b45] - 2025-09-29

> The `-f7d5b45` suffix denotes the upstream `AntelopeIO/abieos` commit hash bundled with this release.

### Upstream Highlights (`2039717` → `f7d5b45`)
- Added full support for the new `bitset` ABI type, including serialization/deserialization, key conversions, and regression tests.
- Introduced `fixed_array` handling in the ABI serializer, so fixed-length array definitions now round-trip correctly.
- Switched floating-point JSON conversion to `std::to_chars`, improving numeric fidelity and removing legacy `fpconv` sources.
- Tightened validation around ABI parsing (better sanity checks, error messages, and compatibility guards) while keeping compatibility with `eosio::abi/1.x` definitions.
- Streamlined upstream CI and build configurations (consistent CMake/toolchain defaults, GCC 14 coverage) matching the latest Antelope “Spring” tooling.

### Added
- `c8` coverage tooling to produce lcov reports consumed by Coveralls.
- Comprehensive unit tests covering parse error branches to reach 100% coverage.
- Repository `LICENSE` now includes upstream `AntelopeIO/abieos` MIT license details.
- Formal `CHANGELOG.md` to track release history.

### Changed
- Workflow now runs coverage on Node 22.x only while keeping multi-version tests.

### Fixed
- Ensured `loadAbiHex` debug branch is executed within tests, eliminating remaining coverage gaps.
