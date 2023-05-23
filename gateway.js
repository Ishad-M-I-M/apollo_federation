const { ApolloServer } = require("@apollo/server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {serializeQueryPlan} = require('@apollo/query-planner');

const PORT = 4000;

const supergraphSdl = new IntrospectAndCompose({
    subgraphs: [
        { name: "products", url: "http://localhost:4001" },
        { name: "couriers", url: "http://localhost:4002" },
        { name: "cargo_service", url: "http://localhost:4003" },
        { name: "tax", url: "http://localhost:4004" },
    ],
});

const gateway = new ApolloGateway({
    supergraphSdl,
    experimental_didResolveQueryPlan: function(options) {
        if (options.requestContext.operationName !== 'IntrospectionQuery') {
            console.log(serializeQueryPlan(options.queryPlan));
        }
    }
});

const server = new ApolloServer({gateway});
startStandaloneServer(server, {
    listen:{
        port: PORT
    }
}).then(({url}) => {
    console.log(`Products service ready at ${url}`);
});