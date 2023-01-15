const { projects, clients } = require('../sampleData.js');

//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');



const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

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
                return Client.findById(parent.clientId);
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

//mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //add a client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            }
        },
        //delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        //add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { 
                   type: new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                        'new': { value: 'Not Started' },
                        'progress': { value: 'In Progress' },
                        'completed': { value: 'Completed' },
                    }
                   }),
                   defaultValue: 'Not Started', 
                },
                clientId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            },
        },
        //delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },
        //Update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { 
                    type: new GraphQLEnumType({
                     name: 'ProjectStatusUpdate',
                     values: {
                         'new': { value: 'Not Started' },
                         'progress': { value: 'In Progress' },
                         'completed': { value: 'Completed' },
                     }
                    }),
                 },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate (
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    { new: true }
                )
            }
        }
    },
});

module.exports = new GraphQLSchema ({
    query: RootQuery,
    mutation
})

