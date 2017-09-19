export const checkJSONHeader = res => {
  if (!res.headers.get('content-type').match(/application\/json/)) {
    throw new Error('Invalid JSON Response')
  } else {
    return res
  }
}

export const checkGraphQLError = json => (!json.errors) ?
    JSON.stringify(json, null, 2) :
    errorExit(
      'GraphQL Error',
      'The server responded with the following error:',
      JSON.stringify(json, null, 2)
    )

export const catchErrors = error => {

  if (error.message.match(/ENOENT: no such file or directory/))
    errorExit(
      'Query file not found!',
      'Please check the query file name and path.'
    )

  if (error.message.match(/Invalid JSON Response/))
     errorExit(
       'URL does not accept graph queries.',
       'The GraphQL endpoint url provided does not accept queries.'
     )

  errorExit('An unknown error occurred', error.message)

}

export const errorExit = (msg, instructions, details='') => {
  console.log(`
    Error: ${msg}
    ${instructions + '\n' + details}
  `)
  process.exit(1)
}
