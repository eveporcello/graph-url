Feature: Static Queries
  As a developer, I want to run a GraphQL query
  against a graph endpoint
  so that I can see the results in my terminal.

Scenario: A Successful Query
  Given the query file "sample-query.txt":
    """
    {
      allLifts {
        name
      }
    }
    """
  When I run gurl with the following arguments:
      | flag  | value                                |
      | -u    | https://www.moonhighway.com/graphiql |
      | -q    | sample-query.txt                     |
  Then I should see the following results in the terminal:
      """
      {
        "data": {
          "allLifts": [
            {
              "name": "Astra Express"
            },
            {
              "name": "Jazz Cat"
            },
            {
              "name": "Jolly Roger"
            },
            {
              "name": "Neptune Rope"
            },
            {
              "name": "Panorama"
            },
            {
              "name": "Prickly Peak"
            },
            {
              "name": "Snowtooth Express"
            },
            {
              "name": "Summit"
            },
            {
              "name": "Wally's"
            },
            {
              "name": "Western States"
            },
            {
              "name": "Whirlybird"
            }
          ]
        }
      }
      """
And the application should successfully exit.

Scenario: Optional Feature Flags

Given the query file "sample-query.txt":
  """
  {
    allLifts {
      name
    }
  }
  """
When I run gurl with the following arguments:
    | flag     | value                                |
    | --url    | https://www.moonhighway.com/graphiql |
    | --query  | sample-query.txt                     |
Then I should see the following results in the terminal:
    """
    {
      "data": {
        "allLifts": [
          {
            "name": "Astra Express"
          },
          {
            "name": "Jazz Cat"
          },
          {
            "name": "Jolly Roger"
          },
          {
            "name": "Neptune Rope"
          },
          {
            "name": "Panorama"
          },
          {
            "name": "Prickly Peak"
          },
          {
            "name": "Snowtooth Express"
          },
          {
            "name": "Summit"
          },
          {
            "name": "Wally's"
          },
          {
            "name": "Western States"
          },
          {
            "name": "Whirlybird"
          }
        ]
      }
    }
    """
And the application should successfully exit.

Scenario: Query Not Provided
  When I run gurl with the following arguments:
  | flag  | value                                |
  | -u    | https://www.moonhighway.com/graphiql |
  Then I should see the following results in the terminal:
    """

      Error: A graph query file was not provided.
        Please provide a query file with -q or --query.

    """
  And the application should exit with an error.

Scenario: File Not Found
  When I run gurl with the following arguments:
    | flag  | value                                |
    | -u    | https://www.moonhighway.com/graphiql |
    | -q    | file-not-there.txt                   |
  Then I should see the following results in the terminal:
    """

      Error: Query file not found!
        Please check the query file name and path.

    """
  And the application should exit with an error.

Scenario: URL Not Provided
Given the query file "sample-query.txt":
  """
  {
    allLifts {
      name
    }
  }
  """
When I run gurl with the following arguments:
  | flag  | value            |
  | -q    | sample-query.txt |
Then I should see the following results in the terminal:
  """

    Error: A GraphQL Endpoint URL not provided.
      Please provide an endpoint url with -u or --url.

  """
And the application should exit with an error.

Scenario: URL Not a Graph Endpoint
  Given the query file "sample-query.txt":
    """
    {
      allLifts {
        name
      }
    }
    """
  When I run gurl with the following arguments:
    | flag  | value                       |
    | -u    | https://www.moonhighway.com |
    | -q    | sample-query.txt            |
  Then I should see the following results in the terminal:
    """

      Error: URL does not accept graph queries.
        The GraphQL endpoint url provided does not accept queries.

    """
  And the application should exit with an error.

Scenario: Graph Errors
  Given the query file "sample-query.txt":
    """
    {
      notThere
    }
    """
  When I run gurl with the following arguments:
    | flag  | value                                |
    | -u    | https://www.moonhighway.com/graphiql |
    | -q    | sample-query.txt                     |
  Then I should see the following results in the terminal:
    """

      Error: GraphQL Error
        The server responded with the following error:
    {
      "errors": [
        {
          "message": "Cannot query field \"notThere\" on type \"Query\".",
          "locations": [
            {
              "line": 2,
              "column": 3
            }
          ]
        }
      ]
   }

    """
  And the application should exit with an error.
