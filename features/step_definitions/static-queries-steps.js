var { defineSupportCode } = require('cucumber')
var { expect } = require('chai')
var { join } = require('path')
var { spawn } = require('child_process')
var { writeFileSync, unlinkSync } = require('fs')

defineSupportCode(function({ Before, After, Given, When, Then }) {

    Before(function() {
      this.results = ''
      this.exitCode = null
      this.cleanup = null
    })

    After(function() {
      if(this.cleanup) {
        unlinkSync(this.cleanup)
      }
    })

    Given('the query file {string}:', function (fileName, docString) {
      writeFileSync(fileName, docString.trim())
      this.cleanup = fileName
    })

    When('I run gurl with the following arguments:', function (dataTable, callback) {
      const [header, ...rows] = dataTable.rawTable
      const args = ['index.js']
          .concat(
            rows.reduce((arr, row) => [...arr, row[0], row[1]], [])
        )
        const app = spawn('node', args, {encoding: 'UTF-8'})
        app.stdout.on('data', chunk => this.results += chunk)
        app.stderr.on('data', error => callback(error))
        app.on('error', error => callback(error))
        app.on('exit', code => {
          this.exitCode = code
          callback()
        })
    })

    Then('I should see the following results in the terminal:', function (docString) {
      expect(this.results.trim()).to.equal(docString.trim())
    })

    Then('the application should successfully exit.', function () {
      expect(this.exitCode).to.equal(0)
    })

    Then('the application should exit with an error.', function () {
      expect(this.exitCode).to.equal(1)
    })

})
