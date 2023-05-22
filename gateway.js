const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const {serializeQueryPlan} = require('@apollo/query-planner');

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

(async () => {
    const server = new ApolloServer({
        gateway,
        engine: false,
        subscriptions: false,
    });

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
})();