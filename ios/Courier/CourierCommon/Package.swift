// swift-tools-version:5.3
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "CourierCommon",
    platforms: [
        .macOS(.v11),
        .iOS(.v14),
        .tvOS(.v14),
        .watchOS(.v7),
    ],
    products: [
        .library(
            name: "CourierGenerated",
            targets: ["CourierGenerated"]),
    ],
    dependencies: [
        .package(url: "https://github.com/mjm/Relay.swift", .branch("main")),
    ],
    targets: [
        .target(
            name: "CourierGenerated",
            dependencies: [
                .product(name: "RelaySwiftUI", package: "Relay.swift")
            ]),
    ]
)
