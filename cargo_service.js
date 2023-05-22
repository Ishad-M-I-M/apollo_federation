const { ApolloServer} = require("@apollo/server");
const{ startStandaloneServer } = require('@apollo/server/standalone');
const {gql} = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const PORT = 4003;

const typeDefs = gql`
    extend type Courier @key(fields: "id") {
        id: ID!
        shippingCharge: Float
    }
`;

const resolvers = {
    Courier: {
        __resolveReference(object) {
            return shippingCharges.find(shippingCharge => shippingCharge.id === object.id);
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

const shippingCharges = [
    {
        id: "1",
        shippingCharge: 100.99
    },
    {
        id: "2",
        shippingCharge: 200.99
    }
]