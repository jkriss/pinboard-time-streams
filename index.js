const fs = require('fs')
const { FileStore } = require('time-streams')

async function run() {
  const [input, streamName='bookmarks'] = process.argv.slice(2)
  if (!input) {
    console.error('First argument must be a Pinboard export json file')
    process.exit(1)
  }
  console.log("reading", input)
  const jsonString = fs.readFileSync(input, 'utf8')
  // get rid of weird leading character
  const bookmarks = JSON.parse(jsonString.slice(jsonString.indexOf('[')))
  console.log(`Importing ${bookmarks.length} bookmarks`)
  const stream = new FileStore(streamName)
  for (const b of bookmarks) {
    await stream.save({
      body: JSON.stringify(b, null, 2),
      date: new Date(b.time),
      name: b.hash,
      contentType: 'application/json',
      overwrite: true
    })
  }
}

run()
