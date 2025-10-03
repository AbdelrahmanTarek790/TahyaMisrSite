#!/usr/bin/env node

const sharp = require("sharp")
const fs = require("fs").promises
const path = require("path")

/**
 * Utility script to convert existing uploaded images to WebP format
 * This script will help migrate your existing images to the new optimized format
 */

class ExistingImageConverter {
    constructor(options = {}) {
        this.config = {
            quality: options.quality || 85,
            removeOriginals: options.removeOriginals || false,
            backupOriginals: options.backupOriginals || true,
            supportedFormats: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
            ...options,
        }
    }

    /**
     * Get all image files from uploads directory
     */
    async getImageFiles(directory) {
        try {
            const files = await fs.readdir(directory)
            const imageFiles = []

            for (const file of files) {
                const filePath = path.join(directory, file)
                const stats = await fs.stat(filePath)

                if (stats.isFile()) {
                    const ext = path.extname(file).toLowerCase()
                    if (this.config.supportedFormats.includes(ext)) {
                        imageFiles.push({
                            path: filePath,
                            name: file,
                            ext: ext,
                            size: stats.size,
                        })
                    }
                }
            }

            return imageFiles
        } catch (error) {
            console.error(`Error reading directory ${directory}:`, error.message)
            return []
        }
    }

    /**
     * Convert a single image to WebP
     */
    async convertImage(imageFile, outputDir) {
        try {
            const { path: inputPath, name } = imageFile
            const nameWithoutExt = path.parse(name).name
            const outputPath = path.join(outputDir, `${nameWithoutExt}.webp`)

            // Skip if WebP already exists
            try {
                await fs.access(outputPath)
                console.log(`⏭️  Skipping ${name} - WebP already exists`)
                return null
            } catch {
                // File doesn't exist, proceed with conversion
            }

            console.log(`🔄 Converting: ${name}`)

            // Get original metadata
            const metadata = await sharp(inputPath).metadata()
            console.log(`   Original: ${metadata.width}x${metadata.height} - ${this.formatFileSize(imageFile.size)}`)

            // Determine appropriate resize settings based on image type and size
            let resizeOptions = null

            // If image is very large, resize it
            if (metadata.width > 1920 || metadata.height > 1080) {
                // Check if it's likely a profile image (square-ish)
                const aspectRatio = metadata.width / metadata.height
                if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
                    // Likely profile image
                    resizeOptions = { width: 400, height: 400, fit: "cover" }
                } else {
                    // Likely media/content image
                    resizeOptions = { width: 1920, height: 1080, fit: "inside" }
                }
            }

            // Convert to WebP
            let sharpInstance = sharp(inputPath)

            if (resizeOptions) {
                sharpInstance = sharpInstance.resize(resizeOptions.width, resizeOptions.height, {
                    fit: resizeOptions.fit,
                    withoutEnlargement: true,
                    background: { r: 255, g: 255, b: 255, alpha: 1 },
                })
            }

            const outputBuffer = await sharpInstance
                .webp({
                    quality: this.config.quality,
                    effort: 6,
                    smartSubsample: true,
                })
                .toBuffer()

            // Write converted image
            await fs.writeFile(outputPath, outputBuffer)

            // Get final stats
            const outputStats = await fs.stat(outputPath)
            const finalMetadata = await sharp(outputPath).metadata()

            const compressionRatio = (((imageFile.size - outputStats.size) / imageFile.size) * 100).toFixed(1)

            console.log(`   ✅ Converted: ${finalMetadata.width}x${finalMetadata.height} - ${this.formatFileSize(outputStats.size)}`)
            console.log(`   💾 Saved: ${compressionRatio}% (${this.formatFileSize(imageFile.size - outputStats.size)})`)

            // Handle original file
            if (this.config.backupOriginals && !this.config.removeOriginals) {
                const backupDir = path.join(outputDir, "originals")
                await fs.mkdir(backupDir, { recursive: true })
                const backupPath = path.join(backupDir, name)
                await fs.copyFile(inputPath, backupPath)
                console.log(`   📦 Backed up original to: originals/${name}`)
            }

            if (this.config.removeOriginals) {
                await fs.unlink(inputPath)
                console.log(`   🗑️  Removed original: ${name}`)
            }

            return {
                input: imageFile,
                output: {
                    path: outputPath,
                    size: outputStats.size,
                    dimensions: `${finalMetadata.width}x${finalMetadata.height}`,
                },
                savings: {
                    bytes: imageFile.size - outputStats.size,
                    percentage: parseFloat(compressionRatio),
                },
            }
        } catch (error) {
            console.error(`❌ Error converting ${imageFile.name}:`, error.message)
            return null
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB"]
        if (bytes === 0) return "0 Bytes"
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
    }

    /**
     * Convert all images in uploads directory
     */
    async convertExistingImages(uploadsDir) {
        console.log(`\n🚀 Converting existing images in: ${uploadsDir}`)
        console.log(
            `⚙️  Quality: ${this.config.quality}% | Remove originals: ${this.config.removeOriginals} | Backup: ${this.config.backupOriginals}\n`
        )

        try {
            // Check if directory exists
            try {
                await fs.access(uploadsDir)
            } catch {
                console.log("❌ Uploads directory not found:", uploadsDir)
                return { processed: 0, totalSavings: 0 }
            }

            // Get all image files
            const imageFiles = await this.getImageFiles(uploadsDir)

            if (imageFiles.length === 0) {
                console.log("🤷 No image files found to convert.")
                return { processed: 0, totalSavings: 0 }
            }

            console.log(`📊 Found ${imageFiles.length} image files to convert\n`)

            // Process each image
            const results = []
            let totalOriginalSize = 0
            let totalOptimizedSize = 0

            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i]
                console.log(`[${i + 1}/${imageFiles.length}]`)

                const result = await this.convertImage(imageFile, uploadsDir)
                if (result) {
                    results.push(result)
                    totalOriginalSize += result.input.size
                    totalOptimizedSize += result.output.size
                }
                console.log("") // Empty line for readability
            }

            // Summary
            const totalSavings = totalOriginalSize - totalOptimizedSize
            const totalSavingsPercentage = totalOriginalSize > 0 ? ((totalSavings / totalOriginalSize) * 100).toFixed(1) : 0

            console.log("🎉 CONVERSION COMPLETE!\n")
            console.log("📈 SUMMARY:")
            console.log(`   Files processed: ${results.length}/${imageFiles.length}`)
            console.log(`   Original total size: ${this.formatFileSize(totalOriginalSize)}`)
            console.log(`   Converted total size: ${this.formatFileSize(totalOptimizedSize)}`)
            console.log(`   Total savings: ${this.formatFileSize(totalSavings)} (${totalSavingsPercentage}%)`)

            return {
                processed: results.length,
                totalSavings: totalSavings,
                totalSavingsPercentage: parseFloat(totalSavingsPercentage),
                results: results,
            }
        } catch (error) {
            console.error("❌ Error converting images:", error.message)
            throw error
        }
    }
}

// CLI Usage
async function main() {
    const args = process.argv.slice(2)

    // Default configuration
    const defaultConfig = {
        quality: 85,
        removeOriginals: false,
        backupOriginals: true,
    }

    // Parse command line arguments
    const config = { ...defaultConfig }
    let uploadsDir = path.join(__dirname, "uploads")

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]

        switch (arg) {
            case "--quality":
            case "-q":
                config.quality = parseInt(args[++i]) || defaultConfig.quality
                break
            case "--remove-originals":
                config.removeOriginals = true
                config.backupOriginals = false
                break
            case "--no-backup":
                config.backupOriginals = false
                break
            case "--uploads-dir":
            case "-d":
                uploadsDir = path.resolve(args[++i])
                break
            case "--help":
            case "-h":
                console.log(`
Existing Image Converter using Sharp

Usage: node convert-existing-images.js [options]

Options:
  -q, --quality <number>     WebP quality (0-100, default: 85)
  -d, --uploads-dir <path>   Path to uploads directory (default: ./uploads)
  --remove-originals         Remove original files after conversion
  --no-backup               Don't backup original files
  -h, --help                Show this help message

Examples:
  node convert-existing-images.js
  node convert-existing-images.js -q 90
  node convert-existing-images.js --remove-originals -q 75
  node convert-existing-images.js -d /path/to/uploads --no-backup
        `)
                return
            default:
                if (!arg.startsWith("-")) {
                    uploadsDir = path.resolve(arg)
                }
                break
        }
    }

    // Create converter instance
    const converter = new ExistingImageConverter(config)

    try {
        await converter.convertExistingImages(uploadsDir)
    } catch (error) {
        console.error("❌ Conversion failed:", error.message)
        process.exit(1)
    }
}

// Export for programmatic use
module.exports = ExistingImageConverter

// Run CLI if this file is executed directly
if (require.main === module) {
    main().catch((error) => {
        console.error("❌ Fatal error:", error.message)
        process.exit(1)
    })
}
