const fs = require('fs')
const getContentfulData = require('./contentful')

;(async () => {
  const contentfulData = await getContentfulData()
  const json = JSON.stringify(contentfulData)

  fs.writeFile('./static/contentful.json', json, err => console.log(err))
})()
