const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs").promises

/**
 * Enhanced image upload utility with Sharp integration
 * Automatically resizes and converts images to optimized WebP format
 */

class ImageProcessor {
    constructor(options = {}) {
        this.config = {
            // Default image sizes for different use cases
            profiles: {
                width: 400,
                height: 400,
                quality: 85,
                fit: "cover",
            },
            media: {
                width: 1920,
                height: 1080,
                quality: 85,
                fit: "inside",
            },
            news: {
                width: null,
                height: null,
                quality: 85,
                fit: "cover",
            },
            // Default fallback
            default: {
                width: 1200,
                height: 800,
                quality: 85,
                fit: "inside",
            },
            ...options,
        }
    }

    /**
     * Process uploaded image with Sharp
     */
    async processImage(file, uploadType = "default") {
        try {
            const config = this.config[uploadType] || this.config.default
            const originalPath = file.path

            // Generate WebP filename
            const parsedPath = path.parse(file.filename)
            const webpFilename = `${parsedPath.name}.webp`
            const webpPath = path.join(path.dirname(originalPath), webpFilename)

            // Process image with Sharp
            await sharp(originalPath)
                .resize(config.width, config.height, {
                    fit: config.fit,
                    withoutEnlargement: true,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background for transparency
                })
                .webp({
                    quality: config.quality,
                    effort: 6,
                    smartSubsample: true,
                })
                .toFile(webpPath)

            // Remove original file
            await fs.unlink(originalPath)

            // Update file object
            file.filename = webpFilename
            file.path = webpPath
            file.mimetype = "image/webp"

            return file
        } catch (error) {
            console.error("Error processing image:", error)
            throw new Error("Image processing failed")
        }
    }
}

// Create image processor instance
const imageProcessor = new ImageProcessor()

// Memory storage for initial upload (we'll process and save manually)
const storage = multer.memoryStorage()

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed"), false)
    }
}

// Enhanced multer configuration
const createUpload = (uploadType = "default") => {
    return multer({
        storage: storage,
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB for processing
        },
        fileFilter: fileFilter,
    })
}

/**
 * Middleware to process uploaded images
 */
const processUploadedImage = (uploadType = "default") => {
    return async (req, res, next) => {
        if (!req.file) {
            return next()
        }

        try {
            const uploadDir = process.env.UPLOAD_PATH || "./uploads"

            // Ensure upload directory exists
            await fs.mkdir(uploadDir, { recursive: true })

            // Generate unique filename
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            const tempFilename = `${req.file.fieldname}-${uniqueSuffix}${path.extname(req.file.originalname)}`
            const tempPath = path.join(uploadDir, tempFilename)

            // Save buffer to temporary file
            await fs.writeFile(tempPath, req.file.buffer)

            // Create file object similar to diskStorage
            req.file.filename = tempFilename
            req.file.path = tempPath

            // Process the image
            req.file = await imageProcessor.processImage(req.file, uploadType)

            next()
        } catch (error) {
            console.error("Upload processing error:", error)
            res.status(500).json({
                success: false,
                error: "Image upload and processing failed",
                data: null,
            })
        }
    }
}

// Create different upload configurations for different use cases
const upload = {
    // For profile images (square, smaller size)
    profile: (fieldName = "profileImage") => [createUpload("profiles").single(fieldName), processUploadedImage("profiles")],

    // For media uploads (larger, maintain aspect ratio)
    media: (fieldName = "file") => [createUpload("media").single(fieldName), processUploadedImage("media")],

    // For news images (rectangular, moderate size)
    news: (fieldName = "image") => [createUpload("news").single(fieldName), processUploadedImage("news")],

    // Generic upload with default settings
    single: (fieldName, uploadType = "default") => [createUpload(uploadType).single(fieldName), processUploadedImage(uploadType)],

    // Multiple files
    array: (fieldName, maxCount = 10, uploadType = "default") => [
        createUpload(uploadType).array(fieldName, maxCount),
        async (req, res, next) => {
            if (!req.files || req.files.length === 0) {
                return next()
            }

            try {
                const uploadDir = process.env.UPLOAD_PATH || "./uploads"
                await fs.mkdir(uploadDir, { recursive: true })

                // Process each file
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i]

                    // Generate unique filename
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
                    const tempFilename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
                    const tempPath = path.join(uploadDir, tempFilename)

                    // Save buffer to temporary file
                    await fs.writeFile(tempPath, file.buffer)

                    // Create file object
                    file.filename = tempFilename
                    file.path = tempPath

                    // Process the image
                    req.files[i] = await imageProcessor.processImage(file, uploadType)
                }

                next()
            } catch (error) {
                console.error("Multiple upload processing error:", error)
                res.status(500).json({
                    success: false,
                    error: "Image upload and processing failed",
                    data: null,
                })
            }
        },
    ],
}

// Utility function to get image info
const getImageInfo = async (filePath) => {
    try {
        const metadata = await sharp(filePath).metadata()
        const stats = await fs.stat(filePath)

        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: stats.size,
            channels: metadata.channels,
            hasAlpha: metadata.hasAlpha,
        }
    } catch (error) {
        console.error("Error getting image info:", error)
        return null
    }
}

// Utility function to resize existing images
const resizeExistingImage = async (inputPath, outputPath, options = {}) => {
    const config = {
        width: 1200,
        height: 800,
        quality: 85,
        fit: "inside",
        ...options,
    }

    try {
        await sharp(inputPath)
            .resize(config.width, config.height, {
                fit: config.fit,
                withoutEnlargement: true,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .webp({
                quality: config.quality,
                effort: 6,
                smartSubsample: true,
            })
            .toFile(outputPath)

        return true
    } catch (error) {
        console.error("Error resizing image:", error)
        return false
    }
}

module.exports = {
    upload,
    imageProcessor,
    getImageInfo,
    resizeExistingImage,

    // Backward compatibility - basic upload without processing
    basicUpload: multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, process.env.UPLOAD_PATH || "./uploads")
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
                cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
            },
        }),
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
        },
        fileFilter: fileFilter,
    }),
}
