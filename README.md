# GaBaus Sky-Logo Converter

The definitive web tool for converting high-resolution images into professional Minecraft schematics using **Obsidian** and **Crying Obsidian**.

## What it does
This converter transforms any image into a horizontal Minecraft schematic (.schem) optimized for sky logos. It uses a high-performance chunk-processing engine that runs entirely in your browser.

## Key Features
- **Extreme Performance:** Powered by Web Workers, allowing you to process massive images (10k+) without any UI lag or browser freezes.
- **Precision Mapping:**
  - **Pure Black (#000000):** Converted to `minecraft:obsidian`.
  - **Purple (#9F81D6):** Converted to `minecraft:crying_obsidian`.
  - **Transparency:** Converted to `air`.
- **Modern Standards:** Generates Sponge Schematic V2 files, fully compatible with Amulet, WorldEdit, and modern Minecraft versions.

## Technical Engine
Built with Next.js and a custom NBT streaming writer, ensuring that data is processed in manageable chunks to maintain system stability even under heavy loads.

Part of the [GaBaus](https://github.com/RealGaBaus) utility suite.
