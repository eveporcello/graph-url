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
const queryFileName = argv.q || argv.query

if (!queryFileName) {
  errorExit(
    'A graph query file was not provided.',
    'Please provide a query file with -q or --query.'
  )
}

if (!graphEndpoint) {
  errorExit(
    'A GraphQL Endpoint URL not provided.',
    'Please provide an endpoint url with -u or --url.'
  )
}

readFile(queryFileName, "UTF-8")
  .then(query => fetch(`${graphEndpoint}?query=${query}`))
  .then(checkJSONHeader)
  .then(res => res.json())
  .then(checkGraphQLError)
  .then(console.log)
  .catch(catchErrors)
