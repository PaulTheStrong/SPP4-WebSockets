const { graphqlHTTP } = require('express-graphql')
const { buildSchema, concatAST } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const taskService = require('./taskService');

const schema = buildSchema(`
    scalar GraphQLDateTime

    type Task {
        id: String!,
        title: String!,
        dueTo: GraphQLDateTime,
        createdAt: GraphQLDateTime,
        files: [String!],
        isCompleted: Boolean,
    }

    type MultiResponse {
        tasks: [Task],
        code: String
    }

    type TaskResponse {
        task: Task,
        code: String,
        err: String
    }

    type Query {
        tasks: MultiResponse,
    }

    input File {
        name: String!,
        buf: [Int]!
    }

    input InputTask {
        title: String!,
        dueTo: GraphQLDateTime,
        files: [File]
    }

    input UpdateTask {
        dueTo: GraphQLDateTime,
        isCompleted: Boolean
    }

    type Mutation {
        addTask(task: InputTask!): TaskResponse,
        updateTask(id: String!, task: UpdateTask!): TaskResponse,
        deleteTask(id: String!): TaskResponse,
    }

   
`);

const root = {
    tasks: async () => await taskService.getTasks(),
    addTask: async(graphqlInput) => await taskService.addTask( graphqlInput.task, graphqlInput.task.files),
    updateTask: async (graphqlInput) => await taskService.updateTask(graphqlInput.id, graphqlInput.task),
    deleteTask: async (graphqlInput) => await taskService.deleteTask(graphqlInput.id)
};

const graphql = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
});

module.exports = graphql;