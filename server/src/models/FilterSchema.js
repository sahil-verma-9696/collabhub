import mongoose from "mongoose";
const filterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "filter should be unique"],
    },

    description: {
      type: String,
      default: "",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project is required"],
    },
  },
  { timestamps: true },
);

const Filter = mongoose.model("Filter", filterSchema);
Filter.syncIndexes()
export default Filter; 
