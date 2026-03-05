/**
 * Image Compression Script
 * Compresses large images in /public/assets/ and /public/facultyimages/
 * Converts PNGs to WebP where possible, compresses JPEGs.
 * Run: node compress-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUALITY_JPEG = 80;
const QUALITY_WEBP = 80;
// Only compress files larger than 100KB
const SIZE_THRESHOLD = 100 * 1024;

const DIRECTORIES = [
    path.join(__dirname, 'public', 'assets'),
    path.join(__dirname, 'public', 'facultyimages'),
];

// Extensions to process
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Files/patterns to keep as original format (just compress, don't convert to webp)
// These might be used in contexts where webp isn't ideal
const KEEP_FORMAT = [];

async function getFilesRecursive(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await getFilesRecursive(fullPath)));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

async function compressImage(filePath) {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    // Skip small files
    if (originalSize < SIZE_THRESHOLD) {
        console.log(`  SKIP (small): ${path.relative(__dirname, filePath)} (${(originalSize / 1024).toFixed(1)} KB)`);
        return { skipped: true };
    }

    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);
    const dir = path.dirname(filePath);

    try {
        if (ext === '.png') {
            // Convert PNG to WebP
            const webpPath = path.join(dir, `${baseName}.webp`);
            await sharp(filePath)
                .webp({ quality: QUALITY_WEBP })
                .toFile(webpPath);

            const newStats = fs.statSync(webpPath);
            const savings = ((1 - newStats.size / originalSize) * 100).toFixed(1);

            console.log(`  PNG→WebP: ${path.relative(__dirname, filePath)}`);
            console.log(`    ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newStats.size / 1024 / 1024).toFixed(2)} MB (${savings}% reduction)`);

            return {
                original: filePath,
                compressed: webpPath,
                originalSize,
                newSize: newStats.size,
                converted: true,
            };
        } else {
            // Compress JPEG in-place (write to temp, then replace)
            const tempPath = filePath + '.tmp';
            await sharp(filePath)
                .jpeg({ quality: QUALITY_JPEG, mozjpeg: true })
                .toFile(tempPath);

            const newStats = fs.statSync(tempPath);
            const savings = ((1 - newStats.size / originalSize) * 100).toFixed(1);

            // Replace original
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);

            console.log(`  JPEG: ${path.relative(__dirname, filePath)}`);
            console.log(`    ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newStats.size / 1024 / 1024).toFixed(2)} MB (${savings}% reduction)`);

            return {
                original: filePath,
                compressed: filePath,
                originalSize,
                newSize: newStats.size,
                converted: false,
            };
        }
    } catch (err) {
        console.error(`  ERROR: ${path.relative(__dirname, filePath)}: ${err.message}`);
        return { error: true };
    }
}

async function main() {
    console.log('=== Image Compression Script ===\n');

    let totalOriginal = 0;
    let totalNew = 0;
    let processedCount = 0;
    const conversions = []; // Track PNG→WebP conversions for reference updates

    for (const dir of DIRECTORIES) {
        if (!fs.existsSync(dir)) {
            console.log(`Directory not found: ${dir}`);
            continue;
        }

        console.log(`\nProcessing: ${path.relative(__dirname, dir)}/`);
        const files = await getFilesRecursive(dir);

        for (const file of files) {
            const result = await compressImage(file);
            if (result && !result.skipped && !result.error) {
                totalOriginal += result.originalSize;
                totalNew += result.newSize;
                processedCount++;
                if (result.converted) {
                    conversions.push({
                        original: path.relative(path.join(__dirname, 'public'), result.original),
                        webp: path.relative(path.join(__dirname, 'public'), result.compressed),
                    });
                }
            }
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Files processed: ${processedCount}`);
    console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total compressed: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total savings: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)} MB (${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%)`);

    if (conversions.length > 0) {
        console.log('\n=== PNG→WebP Conversions (update references!) ===');
        conversions.forEach(c => {
            console.log(`  /${c.original} → /${c.webp}`);
        });
    }
}

main().catch(console.error);
