import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} from "graphql";

export const MovieType = new GraphQLObjectType({
  name: "movie",
  description: "this is movie type",
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    time_reservation: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "time_reservation",
          fields: {
            time_available: { type: GraphQLString },
            usersId: {
              type: new GraphQLList(
                new GraphQLObjectType({
                  name: "usersId",
                  fields: {
                    userId: { type: GraphQLID },
                    seats_reserved: { type: new GraphQLList(GraphQLInt) },
                  },
                })
              ),
            },
            _id: { type: GraphQLID },
          },
        })
      ),
    },
    slug: { type: GraphQLString },
    createdBy: { type: GraphQLID },
    Images: {
      type: new GraphQLObjectType({
        name: "Images",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    customId: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const deleteMovieArgs ={
    token: { type: GraphQLString },
    id: { type: GraphQLID }
}
