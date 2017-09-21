import Promise from 'bluebird'
import fs from 'fs'
import minimist from 'minimist'
import fetch from 'node-fetch'
import {
  errorExit,
  catchErrors,
  checkJSONHeader,
  checkGraphQLError
} from './errors'

const readFile = Promise.promisify(fs.readFile)
const argv = minimist(process.argv.slice(2))
const graphEndpoint = argv.u || argv.url
const queryFileName = argv.f || argv.fileName || argv.file

if (!graphEndpoint) {
  errorExit(
    'A GraphQL Endpoint URL not provided.',
    'Please provide an endpoint url with -u or --url.'
  )
}

if (!queryFileName) {
  errorExit(
    'A graph query file was not provided.',
    'Please provide a query file with -f or --file.'
  )
}

readFile(queryFileName, "UTF-8")
  .then(q => fetch(`${graphEndpoint}?query=${q}`))
  .then(checkJSONHeader)
  .then(res => res.json())
  .then(checkGraphQLError)
  .then(console.log)
  .catch(catchErrors)
