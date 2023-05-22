const { ApolloServer} = require("@apollo/server");
const{ startStandaloneServer } = require('@apollo/server/standalone');
const {gql} = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const PORT = 4002;

const typeDefs = gql`
    type Courier @key(fields: "id") {
        id: ID!
        name: String
        shippingCharge: Float  @external
        tax: Float @external  
    }
    
    extend type Product @key(fields: "id") {
        id: ID!
        courier: Courier
    }
    
    extend type Query {
        courier(id: ID!): Courier
        couriers: [Courier]
    }
`;

const resolvers = {
    Courier: {
        __resolveReference(object) {
            return couriers.find(courier => courier.id === object.id);
        }
    },
    Product: {
        __resolveReference(object) {
            return products.find(product => product.id === object.id);
        }
    },
    Query: {
        courier(_, {id}) {
            return couriers.find(courier => courier.id === id);
        },
        couriers() {
            return couriers;
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

const couriers = [
    {
        id: "1",
        name: "DHL"
    },
    {
        id: "2",
        name: "FedEx"
    }
];

const products = [
    {
        id: "1",
        courier: couriers[0]
    },
    {
        id: "2",
        courier: couriers[1]
    },
    {
        id: "3",
        courier: couriers[0]
    }
];
