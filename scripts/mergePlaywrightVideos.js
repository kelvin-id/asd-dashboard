const fs = require('fs-extra')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

// Define the folder containing the webm videos
const videoDir = path.join(__dirname, '../test-results')
const outputVideo = path.join(__dirname, '../merged-demo.webm')

// Recursively get all webm files in subdirectories
const getVideoFiles = async (dir) => {
  const files = await fs.readdir(dir)
  let webmFiles = []

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = await fs.stat(fullPath)

    if (stat.isDirectory()) {
      const subFiles = await getVideoFiles(fullPath)
      webmFiles = webmFiles.concat(subFiles)
    } else if (path.extname(fullPath).toLowerCase() === '.webm') {
      webmFiles.push(fullPath)
    }
  }

  return webmFiles
}

// Merge videos using ffmpeg
const mergeVideos = (inputVideos, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg()

    inputVideos.forEach((videoPath) => {
      command.input(videoPath)
    })

    command
      .on('start', () => {
        console.log('Merging videos...')
      })
      .on('end', () => {
        console.log('Videos merged successfully!')
        resolve()
      })
      .on('error', (err) => {
        console.error('Error during merging:', err)
        reject(err)
      })
      .mergeToFile(outputPath)
  })
};

(async () => {
  try {
    const videoFiles = await getVideoFiles(videoDir)
    if (videoFiles.length === 0) {
      console.log('No webm files found to merge.')
      return
    }
    await mergeVideos(videoFiles, outputVideo)
  } catch (error) {
    console.error('Error merging videos:', error)
  }
})()
