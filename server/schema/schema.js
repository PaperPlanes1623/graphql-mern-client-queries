const { projects, clients } = require('../sampleData.js');

//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');



const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString},
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                //in graphql
                // return clients.find(client => client.id === parent.clientID);

                //mongo
                return clients.findById(parent.clientId);
            }
        }
    })
});
//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString},
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                //in graphql
                // return projects

                //mongo
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //in graphql
                // return projects.find(project => project.id === args.id);

                //mongo
                return Project.findById(args.id);

            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                //in graphql
                // return clients

                //mongo
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //in graphql
                // return clients.find(client => client.id === args.id);

                //mongo
                return Client.findById(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema ({
    query: RootQuery
})