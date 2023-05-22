const { ApolloServer} = require("@apollo/server");
const{ startStandaloneServer } = require('@apollo/server/standalone');
const {gql} = require("graphql-tag");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const PORT = 4001;

const typeDefs = gql`
    type Product @key(fields: "id") {
        id: ID!
        name: String
        price: Float
        courier: Courier @external
        estimatedShippingCharge: Float @requires(fields: "courier {shippingCharge tax} ")
    }
    
    extend type Courier @key(fields: "id") {
        id: ID! @external
        shippingCharge: Float @external
        tax: Float @external
    }
    
    extend type Query {
        product(id: ID!): Product
        products: [Product]
    }
`;

const resolvers = {
    Product: {
        __resolveReference(object) {
            return products.find(product => product.id === object.id);
        },
        estimatedShippingCharge(object) {
            return object.courier.shippingCharge + object.courier.tax;
        }
    },
    Query: {
        product(_, {id}) {
            return products.find(product => product.id === id);
        },
        products() {
            return products;
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

const products = [
    {
        id: "1",
        name: "Headphones",
        price: 10.99
    },
    {
        id: "2",
        name: "Keyboard",
        price: 20.99
    },
    {
        id: "3",
        name: "Mouse",
        price: 15.99
    }
]