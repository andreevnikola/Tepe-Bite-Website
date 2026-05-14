import { locationSchema } from "./location";
import { newsPostSchema } from "./newsPost";

export const schema = {
  types: [locationSchema, newsPostSchema],
};
