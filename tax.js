const { ApolloServer} = require("@apollo/server");
const{ startStandaloneServer } = require('@apollo/server/standalone');
const {gql} = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const PORT = 4004;

const typeDefs = gql`
    extend type Courier @key(fields: "id") {
        id: ID!
        tax: Float
    }
`;

const resolvers = {
    Courier: {
        __resolveReference(object) {
            return taxes.find(tax => tax.id === object.id);
        }
    }
}

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

startStandaloneServer(server, {
    listen:{
        port: PORT
    }
}).then(({url}) => {
    console.log(`Products service ready at ${url}`);
});

const taxes = [
    {
        id: "1",
        tax: 100.99
    },
    {
        id: "2",
        tax: 200.99
    }
];